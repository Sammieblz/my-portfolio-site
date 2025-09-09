<script>
	import { onMount } from 'svelte';
	import { systemStatus, initSystemStatus, getBatteryIcon, getWiFiIcon, getWeatherIcon } from '../lib/systemStatus.js';
	import Terminal from './Terminal.svelte';
	import FileManager from './FileManager.svelte';
	import ProjectViewer from './ProjectViewer.svelte';
	import ResumeViewer from './ResumeViewer.svelte';
	import AboutApp from './AboutApp.svelte';
	import ContactApp from './ContactApp.svelte';
	import WeatherApp from './WeatherApp.svelte';
	import ClockApp from './ClockApp.svelte';
	import MemoryGame from './MemoryGame.svelte';

	let activeApp = null; // 'terminal' | 'file-manager' | 'projects' | 'resume' | 'about' | 'contact' | 'weather' | 'clock' | 'memory'
	let status = $systemStatus;

	const apps = [
		{ key: 'terminal', name: 'Terminal', icon: 'fas fa-terminal', color: 'text-green-400' },
		{ key: 'file-manager', name: 'Files', icon: 'fas fa-folder', color: 'text-blue-400' },
		{ key: 'projects', name: 'Projects', icon: 'fab fa-github', color: 'text-yellow-300' },
		{ key: 'resume', name: 'Resume', icon: 'fas fa-file-pdf', color: 'text-red-400' },
		{ key: 'about', name: 'About', icon: 'fas fa-user', color: 'text-pink-400' },
		{ key: 'contact', name: 'Contact', icon: 'fas fa-envelope', color: 'text-blue-300' },
		{ key: 'weather', name: 'Weather', icon: 'fas fa-cloud-sun', color: 'text-yellow-400' },
		{ key: 'clock', name: 'Clock', icon: 'fas fa-clock', color: 'text-green-400' },
		{ key: 'memory', name: 'Memory', icon: 'fas fa-brain', color: 'text-purple-400' }
	];

	function openApp(key) {
		activeApp = key;
	}
	function goHome() {
		activeApp = null;
	}

	onMount(() => {
		initSystemStatus();
	});
</script>

<!-- Container mimicking Android phone viewport -->
<div class="mobile-shell h-screen w-screen bg-[rgb(13,17,23)] text-white overflow-hidden flex flex-col">
	<!-- Status Bar -->
	<div class="mobile-status flex items-center justify-between px-3 py-2 text-xs bg-gray-900/80 border-b border-gray-800">
		<div class="font-medium">{status.time}</div>
		<div class="flex items-center gap-2">
			<!-- Weather -->
			<div class="flex items-center gap-1">
				<i class="{getWeatherIcon(status.weather.condition)} text-yellow-400"></i>
				<span class="text-[10px]">{status.weather.temp}°F</span>
			</div>
			<!-- WiFi -->
			<div class="flex items-center gap-1">
				<i class="{getWiFiIcon(status.wifi)}"></i>
				<span class="text-[10px]">{status.wifi}%</span>
			</div>
			<!-- Battery -->
			<div class="flex items-center gap-1">
				<i class="{getBatteryIcon(status.battery, status.charging)}"></i>
				<span class="text-[10px]">{status.battery}%</span>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex-1 relative">
		{#if !activeApp}
			<!-- Launcher Grid -->
			<div class="p-4 grid grid-cols-4 gap-4">
				{#each apps as app}
					<button
						type="button"
						class="flex flex-col items-center gap-2 focus:outline-none"
						on:click={() => openApp(app.key)}
					>
						<div class="w-12 h-12 rounded-2xl bg-gray-800/80 flex items-center justify-center shadow-md">
							<i class={`text-xl ${app.icon} ${app.color}`}></i>
						</div>
						<div class="text-[10px] text-gray-300 tracking-wide">{app.name}</div>
					</button>
				{/each}
			</div>
		{:else}
			<!-- Full-screen App View -->
			<div class="absolute inset-0 bg-gray-900 flex flex-col">
				<!-- App Header -->
				<div class="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-900">
					<div class="flex items-center gap-2">
						<button type="button" class="p-2 rounded hover:bg-gray-800" on:click={goHome} aria-label="Back to Home">
							<i class="fas fa-arrow-left"></i>
						</button>
						<div class="text-xs font-medium uppercase tracking-wide">{apps.find(a => a.key === activeApp)?.name}</div>
					</div>
					<button type="button" class="p-2 rounded hover:bg-gray-800" on:click={goHome} aria-label="Close App">
						<i class="fas fa-times"></i>
					</button>
				</div>
				<div class="flex-1 min-h-0">
					{#if activeApp === 'terminal'}
						<Terminal />
					{:else if activeApp === 'file-manager'}
						<FileManager />
					{:else if activeApp === 'projects'}
						<ProjectViewer />
					{:else if activeApp === 'resume'}
						<ResumeViewer />
					{:else if activeApp === 'about'}
						<AboutApp />
					{:else if activeApp === 'contact'}
						<ContactApp />
					{:else if activeApp === 'weather'}
						<WeatherApp />
					{:else if activeApp === 'clock'}
						<ClockApp />
					{:else if activeApp === 'memory'}
						<MemoryGame />
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Navigation Bar -->
	<div class="mobile-nav flex items-center justify-around py-2 bg-gray-900/90 border-t border-gray-800">
		<button type="button" class="p-2 rounded hover:bg-gray-800" on:click={goHome} aria-label="Back">
			<i class="fas fa-chevron-left"></i>
		</button>
		<button type="button" class="p-2 rounded-full bg-gray-700 hover:bg-gray-600" on:click={goHome} aria-label="Home">
			<i class="fas fa-circle"></i>
		</button>
		<button type="button" class="p-2 rounded hover:bg-gray-800" on:click={() => (activeApp = null)} aria-label="Recents">
			<i class="fas fa-square"></i>
		</button>
	</div>
</div>

<style>
	.mobile-shell { touch-action: manipulation; }
</style>
