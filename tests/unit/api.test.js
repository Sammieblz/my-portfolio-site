import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST as postContact } from '../../src/routes/api/contact/+server.js';
import { GET as getHealth } from '../../src/routes/api/health/+server.js';
import { _clearProjectsCache, GET as getProjects } from '../../src/routes/api/projects/+server.js';
import {
	_clearWeatherCache,
	_getWeatherCacheSize,
	GET as getWeather,
	POST as postWeather
} from '../../src/routes/api/weather/+server.js';
import { _clearRateLimits } from '$lib/rateLimit';

function weatherRequest(latitude, longitude) {
	return new Request('http://localhost/api/weather', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ latitude, longitude })
	});
}

function contactRequest(payload) {
	return new Request('http://localhost/api/contact', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload)
	});
}

it('reports application health without caching', async () => {
	const response = getHealth();
	expect(response.headers.get('cache-control')).toBe('no-store');
	expect(await response.json()).toMatchObject({
		status: 'ok',
		service: 'samuel-portfolio',
		version: '1.0.0'
	});
});

describe('contact API', () => {
	beforeEach(_clearRateLimits);

	it('validates and forwards a contact message without logging form content', async () => {
		const fetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
		const response = await postContact({
			request: contactRequest({
				name: 'Portfolio Visitor',
				email: 'visitor@example.com',
				subject: 'Opportunity',
				message: 'Hello Samuel',
				company: ''
			}),
			fetch
		});

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ ok: true });
		expect(fetch).toHaveBeenCalledTimes(1);
		const forwarded = JSON.parse(fetch.mock.calls[0][1].body);
		expect(forwarded).toMatchObject({
			name: 'Portfolio Visitor',
			email: 'visitor@example.com',
			message: 'Hello Samuel'
		});
	});

	it('rejects malformed contact details', async () => {
		const response = await postContact({
			request: contactRequest({ name: '', email: 'invalid', message: '' }),
			fetch: vi.fn()
		});
		expect(response.status).toBe(400);
		expect((await response.json()).error.code).toBe('VALIDATION_ERROR');
	});

	it('silently accepts honeypot submissions without contacting the provider', async () => {
		const fetch = vi.fn();
		const response = await postContact({
			request: contactRequest({
				name: 'Bot',
				email: 'bot@example.com',
				message: 'Spam',
				company: 'https://spam.example'
			}),
			fetch
		});
		expect(response.status).toBe(200);
		expect(fetch).not.toHaveBeenCalled();
	});

	it('returns a retryable error when delivery fails', async () => {
		const response = await postContact({
			request: contactRequest({
				name: 'Visitor',
				email: 'visitor@example.com',
				message: 'Please reply'
			}),
			fetch: vi.fn().mockResolvedValue(new Response('{}', { status: 503 }))
		});
		expect(response.status).toBe(503);
		expect(response.headers.get('retry-after')).toBe('60');
	});
});

describe('weather API', () => {
	beforeEach(() => {
		_clearWeatherCache();
		_clearRateLimits();
	});

	it('keeps coordinates out of GET query strings', async () => {
		const response = await getWeather({
			url: new URL('http://localhost/api/weather?lat=41&lon=-81'),
			fetch: vi.fn()
		});
		expect(response.status).toBe(400);
		expect((await response.json()).error.code).toBe('LOCATION_REQUIRES_POST');
	});

	it('rejects malformed private coordinates', async () => {
		const response = await postWeather({
			request: weatherRequest(999, 0),
			fetch: vi.fn()
		});
		expect(response.status).toBe(400);
		expect((await response.json()).error.code).toBe('INVALID_COORDINATES');
	});

	it('returns normalized default Open-Meteo data and then serves cache', async () => {
		const fetch = vi.fn().mockResolvedValueOnce(
			new Response(JSON.stringify({ current: { temperature_2m: 69.7, weather_code: 2 } }), {
				status: 200
			})
		);
		const event = {
			url: new URL('http://localhost/api/weather'),
			fetch
		};
		const first = await getWeather(event, { apiKey: '' });
		expect(await first.json()).toMatchObject({
			temp: 70,
			condition: 'partly-cloudy',
			location: 'Greater Cleveland, Ohio',
			source: 'Open-Meteo',
			cache: 'miss'
		});
		const second = await getWeather(event, { apiKey: '' });
		expect((await second.json()).cache).toBe('hit');
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it('rounds private coordinates and disables response caching', async () => {
		const fetch = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ current: { temperature_2m: 60, weather_code: 1 } }), {
				status: 200
			})
		);
		const response = await postWeather(
			{
				request: weatherRequest(41.123456, -81.654321),
				fetch
			},
			{ apiKey: '' }
		);
		expect(response.headers.get('cache-control')).toBe('private, no-store');
		expect(String(fetch.mock.calls[0][0])).toContain('latitude=41.12');
		expect(String(fetch.mock.calls[0][0])).toContain('longitude=-81.65');
	});

	it('prefers normalized OpenWeatherMap data when a server key is configured', async () => {
		const fetch = vi.fn().mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					main: { temp: 54.6 },
					weather: [{ main: 'Snow' }],
					name: 'Cleveland'
				}),
				{ status: 200 }
			)
		);

		const response = await postWeather(
			{
				request: weatherRequest(41.08, -81.52),
				fetch
			},
			{ apiKey: 'test-key' }
		);
		expect(await response.json()).toMatchObject({
			temp: 55,
			condition: 'snow',
			source: 'OpenWeatherMap'
		});
		expect(String(fetch.mock.calls[0][0])).toContain('appid=test-key');
	});

	it('falls through when a provider returns malformed current conditions', async () => {
		const fetch = vi
			.fn()
			.mockResolvedValueOnce(new Response(JSON.stringify({ main: {} }), { status: 200 }))
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ current: { temperature_2m: 63, weather_code: 3 } }), {
					status: 200
				})
			);

		const response = await postWeather(
			{
				request: weatherRequest(40, -80),
				fetch
			},
			{ apiKey: 'test-key' }
		);
		expect(await response.json()).toMatchObject({
			temp: 63,
			condition: 'cloudy',
			location: 'Current location',
			source: 'Open-Meteo'
		});
	});

	it('serves an expired reading as stale when providers are down', async () => {
		let now = 1_000_000;
		vi.spyOn(Date, 'now').mockImplementation(() => now);
		const fetch = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ current: { temperature_2m: 61, weather_code: 1 } }), {
					status: 200
				})
			)
			.mockRejectedValueOnce(new Error('offline'));

		await postWeather({ request: weatherRequest(41.08, -81.52), fetch }, { apiKey: '' });
		now += 11 * 60_000;
		const response = await postWeather(
			{ request: weatherRequest(41.08, -81.52), fetch },
			{ apiKey: '' }
		);
		expect(await response.json()).toMatchObject({
			temp: 61,
			stale: true,
			cache: 'stale'
		});
	});

	it('returns a retryable service error if providers fail and no stale data exists', async () => {
		const response = await getWeather(
			{
				url: new URL('http://localhost/api/weather'),
				fetch: vi.fn().mockRejectedValue(new Error('offline'))
			},
			{ apiKey: '' }
		);
		expect(response.status).toBe(503);
		expect((await response.json()).error.code).toBe('WEATHER_UNAVAILABLE');
		expect(response.headers.get('retry-after')).toBe('60');
	});

	it('bounds coordinate cache growth', async () => {
		const fetch = vi.fn().mockImplementation(() =>
			Promise.resolve(
				new Response(JSON.stringify({ current: { temperature_2m: 70, weather_code: 0 } }), {
					status: 200
				})
			)
		);

		for (let longitude = 0; longitude <= 100; longitude += 1) {
			await postWeather({ request: weatherRequest(0, longitude), fetch }, { apiKey: '' });
		}
		expect(_getWeatherCacheSize()).toBe(100);
	});
});

describe('projects API', () => {
	beforeEach(_clearProjectsCache);

	it('normalizes live GitHub results', async () => {
		const fetch = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify([
					{
						id: 1,
						name: 'AITT',
						description: 'Interview training',
						html_url: 'https://github.com/Sammieblz/AITT',
						homepage: null,
						language: 'TypeScript',
						stargazers_count: 1,
						forks_count: 0,
						updated_at: '2026-01-01T00:00:00Z',
						topics: ['ai'],
						size: 20,
						clone_url: 'https://github.com/Sammieblz/AITT.git',
						fork: false
					}
				]),
				{ status: 200 }
			)
		);
		const response = await getProjects({ fetch });
		expect(await response.json()).toMatchObject({
			source: 'github',
			stale: false,
			cache: 'miss'
		});
	});

	it('returns saved projects on an upstream failure', async () => {
		const response = await getProjects({
			fetch: vi.fn().mockRejectedValue(new Error('offline'))
		});
		const result = await response.json();
		expect(result.source).toBe('fallback');
		expect(result.projects.length).toBeGreaterThan(0);
	});
});
