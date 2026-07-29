<script>
	import { onMount, tick } from 'svelte';
	import AppRenderer from './AppRenderer.svelte';
	import ProfileImage from './ProfileImage.svelte';
	import NotificationCenter from './NotificationCenter.svelte';
	import NotificationToasts from './NotificationToasts.svelte';
	import { getApplication, getApplicationsFor } from '$lib/appRegistry';
	import {
		dismissAllNotificationPopups,
		markAllNotificationsRead,
		notify,
		unreadNotificationCount
	} from '$lib/notifications';
	import {
		getBatteryIcon,
		getWeatherIcon,
		getWiFiIcon,
		initSystemStatus,
		systemStatus
	} from '$lib/systemStatus';
	import { profile } from '$lib/profile';
	import { getPortfolioRouteState, updatePortfolioUrl } from '$lib/routeState';

	export let initialApp = 'home';

	let activeApp = null;
	let openedApps = [];
	let recentApps = [];
	let appData = {};
	let showRecents = false;
	let showNotifications = false;
	let status = $systemStatus;
	let notificationButton;
	const applications = getApplicationsFor('mobile');

	function openApp(applicationId, overrides = {}) {
		if (!getApplication(applicationId)) return;
		if (!openedApps.includes(applicationId)) openedApps = [...openedApps, applicationId];
		if (overrides.data) {
			appData = { ...appData, [applicationId]: overrides.data };
		}
		recentApps = [applicationId, ...recentApps.filter((id) => id !== applicationId)];
		activeApp = applicationId;
		showRecents = false;
		if (overrides.updateUrl !== false) {
			updatePortfolioUrl(applicationId, overrides.data ?? appData[applicationId] ?? {});
		}
	}

	function goHome(options = {}) {
		activeApp = null;
		showRecents = false;
		if (options.updateUrl !== false) updatePortfolioUrl('home');
	}

	function closeApp(applicationId = activeApp) {
		if (!applicationId) return;
		openedApps = openedApps.filter((id) => id !== applicationId);
		recentApps = recentApps.filter((id) => id !== applicationId);
		const nextAppData = { ...appData };
		delete nextAppData[applicationId];
		appData = nextAppData;
		if (activeApp === applicationId) activeApp = null;
		updatePortfolioUrl('home');
	}

	function toggleRecents() {
		showNotifications = false;
		showRecents = !showRecents;
	}

	async function toggleNotifications() {
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

	onMount(() => {
		const cleanupStatus = initSystemStatus();
		notify({
			title: 'Portfolio ready',
			message: 'Choose an application to explore Samuel’s work.',
			source: 'Portfolio OS',
			dedupeKey: 'shell-ready',
			popup: false
		});
		const initialRoute = getPortfolioRouteState(globalThis.location.href);
		const requestedApp = initialApp === 'home' ? initialRoute.appId : initialApp;
		if (requestedApp !== 'home') {
			openApp(requestedApp, { updateUrl: false, data: initialRoute.data });
		}
		const handleHistory = () => {
			const route = getPortfolioRouteState(globalThis.location.href);
			if (route.appId === 'home') {
				goHome({ updateUrl: false });
			} else {
				openApp(route.appId, { updateUrl: false, data: route.data });
			}
		};
		globalThis.addEventListener('popstate', handleHistory);

		return () => {
			cleanupStatus();
			globalThis.removeEventListener('popstate', handleHistory);
		};
	});
</script>

<main
	class="mobile-shell flex h-[100dvh] w-screen flex-col overflow-hidden bg-[rgb(13,17,23)] text-white"
	aria-label="Samuel Ndubuisi mobile portfolio"
>
	<h1 class="sr-only">Samuel Ndubuisi | Full Stack Developer</h1>

	<header
		class="mobile-status flex min-h-9 items-center justify-between border-b border-gray-800 bg-gray-900/80 px-3 py-2 text-xs"
	>
		<time datetime={status.isoTime} class="font-medium">{status.time}</time>
		<div class="flex items-center gap-2" aria-label="System status">
			<button
				bind:this={notificationButton}
				type="button"
				class="relative rounded p-1 hover:bg-gray-800"
				aria-label={$unreadNotificationCount > 0
					? `Notifications, ${$unreadNotificationCount} unread`
					: 'Notifications'}
				aria-expanded={showNotifications}
				on:click={toggleNotifications}
			>
				<i class="fas fa-bell" aria-hidden="true"></i>
				{#if $unreadNotificationCount > 0}
					<span
						class="absolute -right-1 -top-1 min-w-3 rounded-full bg-red-600 px-0.5 text-[8px] font-bold leading-3 text-white"
						aria-hidden="true"
					>
						{Math.min($unreadNotificationCount, 99)}
					</span>
				{/if}
			</button>
			<span class="flex items-center gap-1" title={status.weather.location}>
				<i class={`${getWeatherIcon(status.weather.condition)} text-yellow-400`} aria-hidden="true"
				></i>
				<span>{status.weather.temp === null ? '--' : status.weather.temp}°F</span>
			</span>
			<span title={status.connectionLabel}>
				<i class={getWiFiIcon(status.online)} aria-hidden="true"></i>
				<span class="sr-only">{status.connectionLabel}</span>
			</span>
			{#if status.batteryAvailable}
				<span class="flex items-center gap-1" title="Battery status">
					<i class={getBatteryIcon(status.battery, status.charging)} aria-hidden="true"></i>
					<span>{status.battery}%</span>
				</span>
			{/if}
		</div>
	</header>

	<NotificationToasts mode="mobile" />

	{#if showNotifications}
		<NotificationCenter mode="mobile" trigger={notificationButton} onClose={closeNotifications} />
	{/if}

	<div class="relative min-h-0 flex-1">
		<div class="h-full overflow-y-auto" hidden={Boolean(activeApp)} inert={Boolean(activeApp)}>
			<section class="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-blue-950 p-4">
				<p class="text-xs font-medium uppercase tracking-wider text-blue-300">
					{profile.contact.availability}
				</p>
				<div class="mt-2 flex items-center gap-3">
					<ProfileImage
						alt=""
						loading="eager"
						fetchpriority="high"
						className="h-full w-full rounded-lg object-cover"
						pictureClass="block h-14 w-12 shrink-0"
					/>
					<div class="min-w-0">
						<p class="truncate text-lg font-semibold">{profile.name}</p>
						<p class="text-sm text-gray-300">{profile.role}</p>
						<p class="text-xs text-gray-400">{profile.location}</p>
					</div>
				</div>
				<div class="mt-3 grid grid-cols-3 gap-2">
					<button
						type="button"
						class="rounded bg-blue-600 px-2 py-2 text-xs font-medium hover:bg-blue-500"
						on:click={() => openApp('projects')}
					>
						Projects
					</button>
					<button
						type="button"
						class="rounded bg-gray-700 px-2 py-2 text-xs font-medium hover:bg-gray-600"
						on:click={() => openApp('resume')}
					>
						Resume
					</button>
					<button
						type="button"
						class="rounded bg-gray-700 px-2 py-2 text-xs font-medium hover:bg-gray-600"
						on:click={() => openApp('contact')}
					>
						Contact
					</button>
				</div>
			</section>
			<nav class="grid grid-cols-4 gap-x-3 gap-y-6 p-5" aria-label="Applications">
				{#each applications as application}
					<button
						type="button"
						class="flex flex-col items-center gap-2 rounded-lg p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
						on:click={() => openApp(application.id)}
					>
						<span
							class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800/80 shadow-md"
							aria-hidden="true"
						>
							<i class={`text-xl ${application.icon} ${application.color}`}></i>
						</span>
						<span class="text-[11px] tracking-wide text-gray-200">
							{application.mobileName ?? application.name}
						</span>
					</button>
				{/each}
			</nav>
		</div>

		{#each openedApps as applicationId (applicationId)}
			{@const application = getApplication(applicationId)}
			<div
				class="absolute inset-0 flex flex-col bg-gray-900"
				role="group"
				aria-label={`${application?.name ?? 'Portfolio'} application`}
				aria-hidden={activeApp !== applicationId}
				inert={activeApp !== applicationId}
				hidden={activeApp !== applicationId}
			>
				<header class="flex min-h-12 items-center justify-between border-b border-gray-800 px-2">
					<div class="flex min-w-0 items-center gap-2">
						<button
							type="button"
							class="rounded p-2 hover:bg-gray-800"
							on:click={goHome}
							aria-label="Back to applications"
						>
							<i class="fas fa-arrow-left" aria-hidden="true"></i>
						</button>
						<h2 class="truncate text-sm font-medium">{application?.name}</h2>
					</div>
					<button
						type="button"
						class="rounded p-2 hover:bg-gray-800"
						on:click={() => closeApp(applicationId)}
						aria-label={`Close ${application?.name ?? 'application'}`}
					>
						<i class="fas fa-times" aria-hidden="true"></i>
					</button>
				</header>
				<div class="min-h-0 flex-1 overflow-hidden">
					<AppRenderer
						appId={applicationId}
						windowState={{
							id: `mobile-${applicationId}`,
							data: appData[applicationId] ?? {}
						}}
						onOpenApp={openApp}
						onClose={() => closeApp(applicationId)}
					/>
				</div>
			</div>
		{/each}

		{#if showRecents}
			<section
				class="absolute inset-x-3 bottom-3 z-30 max-h-[70%] overflow-y-auto rounded-2xl border border-gray-600 bg-gray-800 p-4 shadow-2xl"
				aria-labelledby="recent-applications-title"
			>
				<div class="mb-3 flex items-center justify-between">
					<h2 id="recent-applications-title" class="font-semibold">Recent applications</h2>
					<button
						type="button"
						class="rounded p-2 hover:bg-gray-700"
						on:click={() => (showRecents = false)}
						aria-label="Close recent applications"
					>
						<i class="fas fa-times" aria-hidden="true"></i>
					</button>
				</div>
				{#if recentApps.length === 0}
					<p class="py-8 text-center text-sm text-gray-300">No recent applications.</p>
				{:else}
					<ul class="space-y-2">
						{#each recentApps as applicationId}
							{@const recentApplication = getApplication(applicationId)}
							<li class="flex items-center gap-2 rounded-lg bg-gray-900 p-2">
								<button
									type="button"
									class="flex min-w-0 flex-1 items-center gap-3 rounded p-2 text-left hover:bg-gray-700"
									on:click={() => openApp(applicationId)}
								>
									<i
										class={`${recentApplication?.icon ?? 'fas fa-window-maximize'} ${recentApplication?.color ?? ''}`}
										aria-hidden="true"
									></i>
									<span class="truncate">{recentApplication?.name}</span>
								</button>
								<button
									type="button"
									class="rounded p-2 text-gray-300 hover:bg-gray-700"
									on:click={() => closeApp(applicationId)}
									aria-label={`Close ${recentApplication?.name ?? 'application'}`}
								>
									<i class="fas fa-times" aria-hidden="true"></i>
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/if}
	</div>

	<nav
		class="mobile-nav flex min-h-12 items-center justify-around border-t border-gray-800 bg-gray-900/90 py-1"
		aria-label="Mobile navigation"
	>
		<button type="button" class="rounded p-3 hover:bg-gray-800" on:click={goHome} aria-label="Back">
			<i class="fas fa-chevron-left" aria-hidden="true"></i>
		</button>
		<button
			type="button"
			class="rounded-full bg-gray-700 p-3 hover:bg-gray-600"
			on:click={goHome}
			aria-label="Home"
		>
			<i class="fas fa-circle text-xs" aria-hidden="true"></i>
		</button>
		<button
			type="button"
			class="rounded p-3 hover:bg-gray-800"
			class:bg-gray-700={showRecents}
			on:click={toggleRecents}
			aria-label="Recent applications"
			aria-expanded={showRecents}
		>
			<i class="fas fa-square" aria-hidden="true"></i>
		</button>
	</nav>
</main>

<style>
	.mobile-shell {
		touch-action: manipulation;
	}
</style>
