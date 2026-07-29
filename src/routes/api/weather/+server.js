import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { profile } from '$lib/profile';
import { checkRateLimit } from '$lib/rateLimit';
import { mapOpenWeatherCondition, mapWeatherCode, parseCoordinate } from '$lib/weather';

const CACHE_TTL_MS = 10 * 60_000;
const MAX_CACHE_ENTRIES = 100;
const REQUEST_TIMEOUT_MS = 5_000;
const cache = new Map();

export function _clearWeatherCache() {
	cache.clear();
}

export function _getWeatherCacheSize() {
	return cache.size;
}

function saveToCache(cacheKey, payload) {
	cache.delete(cacheKey);
	cache.set(cacheKey, { payload, storedAt: Date.now() });
	if (cache.size > MAX_CACHE_ENTRIES) {
		cache.delete(cache.keys().next().value);
	}
}

function roundCoordinate(value) {
	return Math.round(value * 100) / 100;
}

async function fetchWithTimeout(fetchFunction, url) {
	return fetchFunction(url, {
		headers: { accept: 'application/json' },
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
	});
}

function weatherResponse(payload, cacheStatus, personal = false) {
	return json(
		{ ...payload, cache: cacheStatus },
		{
			headers: {
				'Cache-Control': personal
					? 'private, no-store'
					: 'public, max-age=300, s-maxage=600, stale-while-revalidate=1800',
				'X-Content-Type-Options': 'nosniff'
			}
		}
	);
}

function errorResponse(code, message, status, headers = {}) {
	return json(
		{ error: { code, message } },
		{
			status,
			headers: {
				'Cache-Control': 'no-store',
				'X-Content-Type-Options': 'nosniff',
				...headers
			}
		}
	);
}

async function getWeather(
	{ latitude, longitude, isProfileLocation, personal, fetchFunction },
	options = {}
) {
	const lat = isProfileLocation ? latitude : roundCoordinate(latitude);
	const lon = isProfileLocation ? longitude : roundCoordinate(longitude);
	const location = isProfileLocation ? profile.location : 'Current location';
	const cacheKey = `${lat.toFixed(2)}:${lon.toFixed(2)}`;
	const cached = cache.get(cacheKey);
	if (cached && Date.now() - cached.storedAt < CACHE_TTL_MS) {
		return weatherResponse(cached.payload, 'hit', personal);
	}

	const apiKey =
		options.apiKey === undefined ? env.OPENWEATHER_API_KEY?.trim() : options.apiKey.trim();
	if (apiKey) {
		try {
			const openWeatherUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
			openWeatherUrl.search = new URLSearchParams({
				lat: String(lat),
				lon: String(lon),
				appid: apiKey,
				units: 'imperial'
			}).toString();
			const upstream = await fetchWithTimeout(fetchFunction, openWeatherUrl);
			if (upstream.ok) {
				const data = await upstream.json();
				const temperature = Number(data.main?.temp);
				if (!Number.isFinite(temperature)) {
					throw new Error('OpenWeatherMap returned an invalid temperature');
				}
				const payload = {
					temp: Math.round(temperature),
					condition: mapOpenWeatherCondition(data.weather?.[0]?.main),
					location: isProfileLocation ? profile.location : data.name || location,
					source: 'OpenWeatherMap',
					stale: false
				};
				saveToCache(cacheKey, payload);
				return weatherResponse(payload, 'miss', personal);
			}
		} catch {
			// Continue to the keyless provider.
		}
	}

	try {
		const openMeteoUrl = new URL('https://api.open-meteo.com/v1/forecast');
		openMeteoUrl.search = new URLSearchParams({
			latitude: String(lat),
			longitude: String(lon),
			current: 'temperature_2m,weather_code',
			temperature_unit: 'fahrenheit',
			timezone: 'auto'
		}).toString();
		const upstream = await fetchWithTimeout(fetchFunction, openMeteoUrl);
		if (upstream.ok) {
			const data = await upstream.json();
			const temperature = Number(data.current?.temperature_2m);
			const weatherCode = Number(data.current?.weather_code);
			if (!Number.isFinite(temperature) || !Number.isFinite(weatherCode)) {
				throw new Error('Open-Meteo returned invalid current conditions');
			}
			const payload = {
				temp: Math.round(temperature),
				condition: mapWeatherCode(weatherCode),
				location,
				source: 'Open-Meteo',
				stale: false
			};
			saveToCache(cacheKey, payload);
			return weatherResponse(payload, 'miss', personal);
		}
	} catch {
		// A stale response or service error is returned below.
	}

	if (cached) {
		return weatherResponse({ ...cached.payload, stale: true }, 'stale', personal);
	}

	return errorResponse('WEATHER_UNAVAILABLE', 'Current weather is temporarily unavailable.', 503, {
		'Retry-After': '60'
	});
}

export async function GET({ url, fetch = globalThis.fetch }, options = {}) {
	if (url.searchParams.has('lat') || url.searchParams.has('lon')) {
		return errorResponse(
			'LOCATION_REQUIRES_POST',
			'Location coordinates must be sent in a private request body.',
			400
		);
	}

	return getWeather(
		{
			latitude: profile.coordinates.latitude,
			longitude: profile.coordinates.longitude,
			isProfileLocation: true,
			personal: false,
			fetchFunction: fetch
		},
		options
	);
}

export async function POST({ request, getClientAddress, fetch = globalThis.fetch }, options = {}) {
	if (typeof getClientAddress === 'function') {
		const rate = checkRateLimit(`weather:${getClientAddress()}`, {
			limit: 30,
			windowMs: 60_000
		});
		if (!rate.allowed) {
			return errorResponse(
				'RATE_LIMITED',
				'Too many weather requests were made. Please wait before trying again.',
				429,
				{ 'Retry-After': String(rate.retryAfter) }
			);
		}
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return errorResponse('INVALID_REQUEST', 'A JSON request body is required.', 400);
	}

	const latitude = parseCoordinate(
		body?.latitude === undefined ? null : String(body.latitude),
		-90,
		90
	);
	const longitude = parseCoordinate(
		body?.longitude === undefined ? null : String(body.longitude),
		-180,
		180
	);
	if (latitude === null || longitude === null) {
		return errorResponse(
			'INVALID_COORDINATES',
			'Valid latitude and longitude values are required.',
			400
		);
	}

	return getWeather(
		{
			latitude,
			longitude,
			isProfileLocation: false,
			personal: true,
			fetchFunction: fetch
		},
		options
	);
}
