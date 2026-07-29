import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { notify } from '$lib/notifications';
import { profile } from '$lib/profile';

const DEFAULT_STATUS = {
	battery: null,
	batteryAvailable: false,
	charging: false,
	connectionLabel: 'Online',
	weather: {
		temp: null,
		condition: 'unavailable',
		location: profile.location,
		source: 'Unavailable',
		stale: true
	},
	time: '',
	isoTime: '',
	online: true
};

export const systemStatus = writable({ ...DEFAULT_STATUS });

let consumers = 0;
let cleanupResources = null;
let lastOnline = null;
let weatherWasUnavailable = false;
let lowBatteryNotified = false;

function updateTime() {
	const now = new Date();
	systemStatus.update((status) => ({
		...status,
		time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
		isoTime: now.toISOString()
	}));
}

function updateNetworkStatus() {
	const online = navigator.onLine;
	const connection = navigator.connection;
	const effectiveType = connection?.effectiveType;
	const connectionLabel = online
		? effectiveType
			? `Online (${effectiveType.toUpperCase()})`
			: 'Online'
		: 'Offline';

	systemStatus.update((status) => ({
		...status,
		online,
		connectionLabel
	}));

	if (lastOnline !== null && lastOnline !== online) {
		notify({
			title: online ? 'Back online' : 'You are offline',
			message: online
				? 'The network connection was restored.'
				: 'Live projects, weather, and contact delivery may be unavailable.',
			type: online ? 'success' : 'warning',
			source: 'Network',
			dedupeKey: 'network-status'
		});
	}
	lastOnline = online;
}

async function updateWeather(signal) {
	try {
		const response = await fetch('/api/weather', { signal });
		if (!response.ok) throw new Error(`Weather request failed with ${response.status}`);
		const weather = await response.json();

		systemStatus.update((status) => ({
			...status,
			weather: {
				temp: weather.temp,
				condition: weather.condition,
				location: weather.location,
				source: weather.source,
				stale: Boolean(weather.stale)
			}
		}));
		if (weatherWasUnavailable) {
			notify({
				title: 'Weather restored',
				message: 'Current weather data is available again.',
				type: 'success',
				source: 'Weather',
				dedupeKey: 'weather-status'
			});
		}
		weatherWasUnavailable = false;
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError') return;
		systemStatus.update((status) => ({
			...status,
			weather: { ...status.weather, stale: true }
		}));
		if (!weatherWasUnavailable) {
			notify({
				title: 'Weather unavailable',
				message: 'Current conditions could not be refreshed.',
				type: 'warning',
				source: 'Weather',
				dedupeKey: 'weather-status'
			});
		}
		weatherWasUnavailable = true;
	}
}

async function connectBattery(cleanups, isDisposed) {
	if (typeof navigator.getBattery !== 'function') return;

	try {
		const battery = await navigator.getBattery();
		if (isDisposed()) return;
		const updateBattery = () => {
			const level = Math.round(battery.level * 100);
			systemStatus.update((status) => ({
				...status,
				battery: level,
				batteryAvailable: true,
				charging: battery.charging
			}));
			if (level <= 15 && !battery.charging && !lowBatteryNotified) {
				notify({
					title: 'Low battery',
					message: `${level}% remaining. Connect a charger soon.`,
					type: 'warning',
					source: 'Battery',
					dedupeKey: 'low-battery'
				});
				lowBatteryNotified = true;
			} else if (level > 20 || battery.charging) {
				lowBatteryNotified = false;
			}
		};

		updateBattery();
		battery.addEventListener('chargingchange', updateBattery);
		battery.addEventListener('levelchange', updateBattery);
		cleanups.push(() => {
			battery.removeEventListener('chargingchange', updateBattery);
			battery.removeEventListener('levelchange', updateBattery);
		});
	} catch {
		// Battery Status API is optional; the UI labels the fallback accurately.
	}
}

function startSystemStatus() {
	const cleanups = [];
	const weatherController = new AbortController();
	let disposed = false;

	updateTime();
	updateNetworkStatus();
	void updateWeather(weatherController.signal);
	void connectBattery(cleanups, () => disposed);

	const clockInterval = globalThis.setInterval(updateTime, 30_000);
	const weatherInterval = globalThis.setInterval(
		() => void updateWeather(weatherController.signal),
		10 * 60_000
	);
	const handleVisibility = () => {
		if (!document.hidden) {
			updateTime();
			void updateWeather(weatherController.signal);
		}
	};

	globalThis.addEventListener('online', updateNetworkStatus);
	globalThis.addEventListener('offline', updateNetworkStatus);
	navigator.connection?.addEventListener?.('change', updateNetworkStatus);
	document.addEventListener('visibilitychange', handleVisibility);

	return () => {
		disposed = true;
		weatherController.abort();
		globalThis.clearInterval(clockInterval);
		globalThis.clearInterval(weatherInterval);
		globalThis.removeEventListener('online', updateNetworkStatus);
		globalThis.removeEventListener('offline', updateNetworkStatus);
		navigator.connection?.removeEventListener?.('change', updateNetworkStatus);
		document.removeEventListener('visibilitychange', handleVisibility);
		cleanups.forEach((cleanup) => cleanup());
	};
}

/**
 * Starts the shared status service once and reference-counts consumers.
 * The returned function must be called when the consumer is destroyed.
 */
export function initSystemStatus() {
	if (!browser) return () => {};

	consumers += 1;
	if (!cleanupResources) cleanupResources = startSystemStatus();

	let released = false;
	return () => {
		if (released) return;
		released = true;
		consumers = Math.max(0, consumers - 1);
		if (consumers === 0 && cleanupResources) {
			cleanupResources();
			cleanupResources = null;
		}
	};
}

export function getWeatherIcon(condition) {
	const icons = {
		sunny: 'fas fa-sun',
		clear: 'fas fa-sun',
		'partly-cloudy': 'fas fa-cloud-sun',
		cloudy: 'fas fa-cloud',
		overcast: 'fas fa-cloud',
		rainy: 'fas fa-cloud-rain',
		rain: 'fas fa-cloud-rain',
		drizzle: 'fas fa-cloud-rain',
		thunderstorm: 'fas fa-bolt',
		storm: 'fas fa-bolt',
		snow: 'fas fa-snowflake',
		snowy: 'fas fa-snowflake',
		mist: 'fas fa-smog',
		fog: 'fas fa-smog',
		haze: 'fas fa-smog',
		windy: 'fas fa-wind'
	};
	return icons[condition] || 'fas fa-cloud';
}

export function getBatteryIcon(level, charging = false) {
	if (charging) return 'fas fa-bolt';
	if (level >= 90) return 'fas fa-battery-full';
	if (level >= 65) return 'fas fa-battery-three-quarters';
	if (level >= 40) return 'fas fa-battery-half';
	if (level >= 15) return 'fas fa-battery-quarter';
	return 'fas fa-battery-empty';
}

export function getWiFiIcon(online) {
	return online ? 'fas fa-wifi' : 'fas fa-wifi-slash';
}
