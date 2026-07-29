<script>
	import { onDestroy } from 'svelte';
	import { notify } from '$lib/notifications';
	import { getWeatherIcon, systemStatus } from '$lib/systemStatus';

	let status = $systemStatus;
	let locating = false;
	let locationMessage = '';
	let requestController;

	const descriptions = {
		sunny: 'Sunny',
		clear: 'Clear',
		'partly-cloudy': 'Partly cloudy',
		cloudy: 'Cloudy',
		overcast: 'Overcast',
		rainy: 'Rain',
		rain: 'Rain',
		drizzle: 'Drizzle',
		thunderstorm: 'Thunderstorm',
		storm: 'Storm',
		snow: 'Snow',
		mist: 'Mist',
		fog: 'Fog',
		haze: 'Haze',
		windy: 'Windy',
		unavailable: 'Unavailable'
	};

	function getPosition() {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(new Error('Geolocation is not supported'));
				return;
			}
			navigator.geolocation.getCurrentPosition(resolve, reject, {
				enableHighAccuracy: false,
				timeout: 8_000,
				maximumAge: 10 * 60_000
			});
		});
	}

	async function useMyLocation() {
		if (locating) return;
		locating = true;
		locationMessage = '';
		requestController?.abort();
		requestController = new AbortController();

		try {
			const position = await getPosition();
			const response = await fetch('/api/weather', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				}),
				signal: requestController.signal
			});
			if (!response.ok) throw new Error('Weather request failed');
			const weather = await response.json();
			systemStatus.update((current) => ({
				...current,
				weather: {
					temp: weather.temp,
					condition: weather.condition,
					location: weather.location,
					source: weather.source,
					stale: Boolean(weather.stale)
				}
			}));
			locationMessage = 'Weather updated for your current location.';
			notify({
				title: 'Local weather updated',
				message: `${weather.temp}°F at your current location.`,
				type: 'success',
				source: 'Weather',
				dedupeKey: 'location-weather'
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			locationMessage =
				'Location weather was not available. Your browser may have denied the request.';
			notify({
				title: 'Location weather unavailable',
				message: 'Location permission may have been denied or weather data is unavailable.',
				type: 'warning',
				source: 'Weather',
				dedupeKey: 'location-weather'
			});
		} finally {
			locating = false;
		}
	}

	onDestroy(() => requestController?.abort());
</script>

<section
	class="flex h-full w-full flex-col overflow-y-auto bg-gray-900 text-white"
	aria-label="Weather"
>
	<header class="bg-gradient-to-r from-blue-700 to-purple-700 p-6 text-center">
		<i
			class={`${getWeatherIcon(status.weather.condition)} mb-4 text-6xl text-yellow-200`}
			aria-hidden="true"
		></i>
		<h2 class="text-4xl font-bold">
			{status.weather.temp === null ? 'Weather unavailable' : `${status.weather.temp}°F`}
		</h2>
		<p class="mt-2 text-xl text-gray-100">
			{descriptions[status.weather.condition] ?? 'Current conditions'}
		</p>
		<p class="mt-2 text-sm text-gray-200">
			<i class="fas fa-map-marker-alt mr-1" aria-hidden="true"></i>{status.weather.location}
		</p>
	</header>

	<div class="mx-auto grid w-full max-w-4xl flex-1 gap-5 p-5 md:grid-cols-2">
		<section class="rounded-lg bg-gray-800 p-5" aria-labelledby="weather-details">
			<h3 id="weather-details" class="mb-4 text-lg font-semibold">Weather details</h3>
			<dl class="space-y-3">
				<div class="flex justify-between gap-3">
					<dt class="text-gray-400">Temperature</dt>
					<dd>{status.weather.temp === null ? 'Unavailable' : `${status.weather.temp}°F`}</dd>
				</div>
				<div class="flex justify-between gap-3">
					<dt class="text-gray-400">Condition</dt>
					<dd>{descriptions[status.weather.condition] ?? status.weather.condition}</dd>
				</div>
				<div class="flex justify-between gap-3">
					<dt class="text-gray-400">Location</dt>
					<dd class="text-right">{status.weather.location}</dd>
				</div>
				<div class="flex justify-between gap-3">
					<dt class="text-gray-400">Data source</dt>
					<dd>{status.weather.source}</dd>
				</div>
			</dl>
			{#if status.weather.stale}
				<p class="mt-4 rounded bg-amber-950 p-3 text-sm text-amber-200" role="status">
					Live weather is temporarily unavailable; this reading may be stale.
				</p>
			{/if}
		</section>

		<section class="rounded-lg bg-gray-800 p-5" aria-labelledby="local-weather">
			<h3 id="local-weather" class="mb-3 text-lg font-semibold">Local weather</h3>
			<p class="text-sm leading-relaxed text-gray-300">
				Weather defaults to Samuel's location. Your browser will request location permission only if
				you choose the button below.
			</p>
			<button
				type="button"
				class="mt-5 flex items-center gap-2 rounded bg-blue-700 px-4 py-2 hover:bg-blue-600 disabled:opacity-60"
				on:click={useMyLocation}
				disabled={locating}
			>
				<i
					class={`fas ${locating ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'}`}
					aria-hidden="true"
				></i>
				{locating ? 'Locating…' : 'Use my location'}
			</button>
			<p class="mt-3 text-sm text-gray-300" role="status">{locationMessage}</p>
		</section>

		<section class="rounded-lg bg-gray-800 p-5 md:col-span-2" aria-labelledby="connection-status">
			<h3 id="connection-status" class="mb-3 text-lg font-semibold">Connection status</h3>
			<p class={status.online ? 'text-green-300' : 'text-red-300'}>
				<i class={`fas ${status.online ? 'fa-wifi' : 'fa-wifi-slash'} mr-2`} aria-hidden="true"></i>
				{status.connectionLabel}
			</p>
		</section>
	</div>
</section>
