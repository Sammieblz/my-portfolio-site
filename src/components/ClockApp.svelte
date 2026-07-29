<script>
	import { onMount } from 'svelte';

	let currentTime = new Date();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const worldZones = [
		{ city: 'New York', zone: 'America/New_York' },
		{ city: 'London', zone: 'Europe/London' },
		{ city: 'Lagos', zone: 'Africa/Lagos' },
		{ city: 'Tokyo', zone: 'Asia/Tokyo' }
	];

	$: secondDegrees = currentTime.getSeconds() * 6;
	$: minuteDegrees = currentTime.getMinutes() * 6 + currentTime.getSeconds() * 0.1;
	$: hourDegrees = (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5;

	function greeting() {
		const hour = currentTime.getHours();
		if (hour < 5) return 'Good night';
		if (hour < 12) return 'Good morning';
		if (hour < 17) return 'Good afternoon';
		if (hour < 21) return 'Good evening';
		return 'Good night';
	}

	onMount(() => {
		const interval = globalThis.setInterval(() => {
			currentTime = new Date();
		}, 1000);
		return () => globalThis.clearInterval(interval);
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (keyboard access for this scroll region) -->
<section
	class="flex h-full w-full flex-col overflow-y-auto bg-gray-900 text-white"
	aria-label="Clock"
	tabindex="0"
>
	<header class="bg-gradient-to-r from-indigo-700 to-purple-700 p-6 text-center">
		<time
			class="mono block text-4xl font-bold text-green-200 sm:text-5xl"
			datetime={currentTime.toISOString()}
		>
			{currentTime.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			})}
		</time>
		<p class="mt-2 text-xl">{greeting()}, Samuel.</p>
	</header>

	<div class="mx-auto grid w-full max-w-5xl gap-5 p-5 md:grid-cols-2">
		<section class="rounded-lg bg-gray-800 p-6 text-center" aria-labelledby="local-time">
			<h3 id="local-time" class="mb-4 text-lg font-semibold">Local time</h3>
			<p class="text-xl text-gray-200">
				{currentTime.toLocaleDateString([], {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</p>
			<p class="mt-3 text-sm text-gray-400">{timezone}</p>
		</section>

		<section class="rounded-lg bg-gray-800 p-6" aria-labelledby="analog-clock">
			<h3 id="analog-clock" class="sr-only">Analog clock</h3>
			<div
				class="relative mx-auto h-44 w-44 rounded-full border-4 border-gray-500 bg-gray-900"
				role="img"
				aria-label={`Analog clock showing ${currentTime.toLocaleTimeString()}`}
			>
				<span class="absolute left-1/2 top-2 h-3 w-0.5 -translate-x-1/2 bg-gray-400"></span>
				<span class="absolute bottom-2 left-1/2 h-3 w-0.5 -translate-x-1/2 bg-gray-400"></span>
				<span class="absolute left-2 top-1/2 h-0.5 w-3 -translate-y-1/2 bg-gray-400"></span>
				<span class="absolute right-2 top-1/2 h-0.5 w-3 -translate-y-1/2 bg-gray-400"></span>
				<span
					class="absolute bottom-1/2 left-1/2 h-12 w-1 origin-bottom -translate-x-1/2 rounded bg-white"
					style:transform={`translateX(-50%) rotate(${hourDegrees}deg)`}
				></span>
				<span
					class="absolute bottom-1/2 left-1/2 h-16 w-0.5 origin-bottom -translate-x-1/2 rounded bg-blue-300"
					style:transform={`translateX(-50%) rotate(${minuteDegrees}deg)`}
				></span>
				<span
					class="absolute bottom-1/2 left-1/2 h-[4.5rem] w-px origin-bottom -translate-x-1/2 bg-red-400"
					style:transform={`translateX(-50%) rotate(${secondDegrees}deg)`}
				></span>
				<span
					class="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
				></span>
			</div>
		</section>

		<section class="rounded-lg bg-gray-800 p-6 md:col-span-2" aria-labelledby="world-clock">
			<h3 id="world-clock" class="mb-4 text-lg font-semibold">World clock</h3>
			<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{#each worldZones as item}
					<li class="rounded bg-gray-700 p-3">
						<p class="text-sm text-gray-300">{item.city}</p>
						<time
							class="mono mt-1 block text-lg font-semibold"
							datetime={currentTime.toISOString()}
						>
							{currentTime.toLocaleTimeString([], {
								timeZone: item.zone,
								hour: '2-digit',
								minute: '2-digit'
							})}
						</time>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</section>
