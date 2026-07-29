<script>
	import { onMount, tick } from 'svelte';
	import NotificationCenter from './NotificationCenter.svelte';
	import NotificationToasts from './NotificationToasts.svelte';
	import { getApplication, getApplicationsFor } from '$lib/appRegistry';
	import {
		dismissAllNotificationPopups,
		markAllNotificationsRead,
		unreadNotificationCount
	} from '$lib/notifications';
	import {
		getBatteryIcon,
		getWeatherIcon,
		getWiFiIcon,
		initSystemStatus,
		systemStatus
	} from '$lib/systemStatus';

	export let openWindows = [];
	export let activeWindow = null;
	export let openApp;
	export let focusWindow;
	export let restoreWindow;

	let showStartMenu = false;
	let showNotifications = false;
	let status = $systemStatus;
	let startButton;
	let startMenu;
	let notificationButton;
	const menuApplications = getApplicationsFor('startMenu');

	onMount(() => {
		const cleanupStatus = initSystemStatus();
		const handlePointerDown = (event) => {
			if (
				showStartMenu &&
				!startMenu?.contains(event.target) &&
				!startButton?.contains(event.target)
			) {
				showStartMenu = false;
			}
		};
		const handleKeydown = (event) => {
			if (event.key === 'Escape' && showStartMenu) {
				showStartMenu = false;
				startButton?.focus();
			}
		};

		document.addEventListener('pointerdown', handlePointerDown);
		document.addEventListener('keydown', handleKeydown);
		return () => {
			cleanupStatus();
			document.removeEventListener('pointerdown', handlePointerDown);
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	function handleAppClick(windowState) {
		if (windowState.minimized) {
			restoreWindow(windowState.id);
		} else {
			focusWindow(windowState.id);
		}
	}

	function launch(applicationId) {
		openApp(applicationId);
		showStartMenu = false;
	}

	async function toggleStartMenu() {
		showNotifications = false;
		showStartMenu = !showStartMenu;
		if (showStartMenu) {
			await tick();
			startMenu?.querySelector('button')?.focus();
		}
	}

	async function toggleNotifications() {
		showStartMenu = false;
		showNotifications = !showNotifications;
		if (showNotifications) {
			markAllNotificationsRead();
			dismissAllNotificationPopups();
			await tick();
		}
	}

	async function closeNotifications(restoreFocus = true) {
		showNotifications = false;
		if (restoreFocus) {
			await tick();
			notificationButton?.focus();
		}
	}
</script>

<footer
	class="taskbar absolute bottom-0 left-0 right-0 z-[5000] flex h-14 items-center border-t border-gray-600 bg-gray-800 px-2"
	aria-label="Desktop taskbar"
>
	<button
		bind:this={startButton}
		type="button"
		class="taskbar-item flex items-center gap-2 rounded px-3 py-2 text-sm font-medium"
		class:bg-gray-700={showStartMenu}
		aria-expanded={showStartMenu}
		aria-controls="start-menu"
		on:click={toggleStartMenu}
	>
		<img src="/sam-logo.png" alt="" width="40" height="24" class="h-6 w-auto" />
		<span>Samuel</span>
	</button>

	<div
		class="ml-4 flex flex-1 items-center gap-1 overflow-x-auto"
		role="group"
		aria-label="Open windows"
	>
		{#each openWindows as windowState (windowState.id)}
			{@const application = getApplication(windowState.appId)}
			<button
				type="button"
				id={`taskbar-window-${windowState.id}`}
				class="taskbar-item flex min-w-0 flex-shrink-0 items-center gap-2 rounded px-3 py-2 text-sm font-medium"
				class:bg-gray-700={activeWindow === windowState.id}
				class:opacity-60={windowState.minimized}
				aria-pressed={activeWindow === windowState.id}
				on:click={() => handleAppClick(windowState)}
			>
				<i class={application?.icon ?? 'fas fa-window-maximize'} aria-hidden="true"></i>
				<span class="max-w-28 truncate">{windowState.title}</span>
			</button>
		{/each}
	</div>

	<div class="flex items-center gap-3" aria-label="System status">
		<button
			bind:this={notificationButton}
			type="button"
			class="relative rounded p-2 hover:bg-gray-700"
			aria-label={$unreadNotificationCount > 0
				? `Notifications, ${$unreadNotificationCount} unread`
				: 'Notifications'}
			aria-expanded={showNotifications}
			on:click={toggleNotifications}
		>
			<i class="fas fa-bell" aria-hidden="true"></i>
			{#if $unreadNotificationCount > 0}
				<span
					class="absolute right-0.5 top-0.5 min-w-4 rounded-full bg-red-600 px-1 text-center text-[10px] font-bold leading-4 text-white"
					aria-hidden="true"
				>
					{Math.min($unreadNotificationCount, 99)}
				</span>
			{/if}
		</button>
		<span class="flex items-center gap-1 text-xs" title={status.weather.location}>
			<i class={`${getWeatherIcon(status.weather.condition)} text-yellow-400`} aria-hidden="true"
			></i>
			<span>{status.weather.temp === null ? '--' : status.weather.temp}°F</span>
		</span>
		<span class="flex items-center gap-1 text-xs" title={status.connectionLabel}>
			<i class={getWiFiIcon(status.online)} aria-hidden="true"></i>
			<span class="sr-only">{status.connectionLabel}</span>
		</span>
		{#if status.batteryAvailable}
			<span class="flex items-center gap-1 text-xs" title="Battery status">
				<i class={getBatteryIcon(status.battery, status.charging)} aria-hidden="true"></i>
				<span>{status.battery}%</span>
			</span>
		{/if}
		<time class="mono text-xs" datetime={status.isoTime}>{status.time}</time>
	</div>
</footer>

{#if showStartMenu}
	<div
		bind:this={startMenu}
		id="start-menu"
		class="absolute bottom-14 left-2 z-[5001] w-72 rounded-lg border border-gray-600 bg-gray-800 shadow-xl"
	>
		<div class="p-4">
			<p class="mb-3 text-sm font-semibold text-gray-300">Applications</p>
			<div class="space-y-1">
				{#each ['application', 'game'] as category}
					{#if category === 'game'}
						<div class="my-2 border-t border-gray-600"></div>
						<p class="mb-2 px-3 text-xs font-semibold text-gray-400">Games</p>
					{/if}
					{#each menuApplications.filter((app) => app.category === category) as application}
						<button
							type="button"
							class="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-gray-700"
							on:click={() => launch(application.id)}
						>
							<i class={`${application.icon} ${application.color}`} aria-hidden="true"></i>
							<span>{application.name}</span>
						</button>
					{/each}
				{/each}
			</div>
		</div>
	</div>
{/if}

{#if showNotifications}
	<NotificationCenter mode="desktop" trigger={notificationButton} onClose={closeNotifications} />
{/if}

<NotificationToasts mode="desktop" />
