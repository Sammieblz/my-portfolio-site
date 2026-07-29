<script>
	import { onMount, tick } from 'svelte';
	import AppRenderer from './AppRenderer.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import DesktopIcons from './DesktopIcons.svelte';
	import Taskbar from './Taskbar.svelte';
	import Window from './Window.svelte';
	import { getApplication } from '$lib/appRegistry';
	import { getPortfolioRouteState, updatePortfolioUrl } from '$lib/routeState';
	import {
		constrainWindowBounds,
		createInitialBounds,
		createMaximizedBounds,
		createWindowId
	} from '$lib/windowManager';
	import { notify } from '$lib/notifications';

	export let initialApp = 'home';

	/** @type {Array<any>} */
	let openWindows = [];
	let activeWindow = null;
	let nextZIndex = 100;
	let showContextMenu = false;
	let contextMenuPosition = { x: 0, y: 0 };
	let desktopRef;

	const wallpaperStyle = `
		background:
			radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, rgba(81, 207, 102, 0.1) 0%, transparent 50%),
			linear-gradient(135deg, #0d1117 0%, #161b22 100%);
	`;

	function getViewport() {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		};
	}

	function focusWindow(windowId, syncRoute = true) {
		const selected = openWindows.find((windowState) => windowState.id === windowId);
		if (!selected) return;

		nextZIndex += 1;
		openWindows = openWindows.map((windowState) =>
			windowState.id === windowId
				? { ...windowState, minimized: false, zIndex: nextZIndex }
				: windowState
		);
		activeWindow = windowId;
		if (syncRoute) updatePortfolioUrl(selected.appId, selected.data);
	}

	function openApp(appId, overrides = {}) {
		const application = getApplication(appId);
		if (!application) return;

		if (!application.multiple) {
			const existing = openWindows.find((windowState) => windowState.appId === appId);
			if (existing) {
				if (overrides.data) {
					updateWindow(existing.id, { data: overrides.data });
				}
				focusWindow(existing.id, false);
				if (overrides.updateUrl !== false) {
					updatePortfolioUrl(appId, overrides.data ?? existing.data);
				}
				return;
			}
		}

		const viewport = getViewport();
		const requestedSize = {
			width: overrides.width ?? application.defaultSize.width,
			height: overrides.height ?? application.defaultSize.height
		};
		const bounds = createInitialBounds(requestedSize, viewport, openWindows.length);
		nextZIndex += 1;

		const windowState = {
			id: createWindowId(),
			appId,
			title: overrides.title ?? application.title,
			bounds,
			restoreBounds: bounds,
			minSize: application.minSize,
			minimized: false,
			maximized: false,
			zIndex: nextZIndex,
			data: overrides.data ?? {},
			returnFocus: document.activeElement instanceof HTMLElement ? document.activeElement : null
		};

		openWindows = [...openWindows, windowState];
		activeWindow = windowState.id;
		if (overrides.updateUrl !== false) updatePortfolioUrl(appId, windowState.data);
	}

	function updateWindow(windowId, patch) {
		openWindows = openWindows.map((windowState) =>
			windowState.id === windowId ? { ...windowState, ...patch } : windowState
		);
	}

	function closeWindow(windowId) {
		const closedWindow = openWindows.find((windowState) => windowState.id === windowId);
		const remaining = openWindows.filter((windowState) => windowState.id !== windowId);
		openWindows = remaining;

		if (activeWindow === windowId) {
			const nextActive = [...remaining]
				.filter((windowState) => !windowState.minimized)
				.sort((a, b) => b.zIndex - a.zIndex)[0];
			activeWindow = nextActive?.id ?? null;
			updatePortfolioUrl(nextActive?.appId ?? 'home', nextActive?.data ?? {});
		}

		void tick().then(() => {
			const fallback = desktopRef?.querySelector(
				`[data-application-id="${closedWindow?.appId ?? ''}"]`
			);
			const returnFocus = closedWindow?.returnFocus;
			const canRestore =
				returnFocus?.isConnected &&
				returnFocus.matches(
					'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
				);
			const target = canRestore ? returnFocus : fallback;
			target?.focus();
		});
	}

	function minimizeWindow(windowId) {
		const selected = openWindows.find((windowState) => windowState.id === windowId);
		if (!selected) return;

		updateWindow(windowId, { minimized: true });
		const nextActive = [...openWindows]
			.filter((windowState) => windowState.id !== windowId && !windowState.minimized)
			.sort((a, b) => b.zIndex - a.zIndex)[0];
		activeWindow = nextActive?.id ?? null;
		updatePortfolioUrl(nextActive?.appId ?? 'home', nextActive?.data ?? {});
		void tick().then(() => document.getElementById(`taskbar-window-${windowId}`)?.focus());
	}

	function toggleMaximize(windowId) {
		const selected = openWindows.find((windowState) => windowState.id === windowId);
		if (!selected) return;

		if (selected.maximized) {
			updateWindow(windowId, {
				maximized: false,
				bounds: constrainWindowBounds(selected.restoreBounds, getViewport(), selected.minSize)
			});
		} else {
			updateWindow(windowId, {
				maximized: true,
				restoreBounds: selected.bounds,
				bounds: createMaximizedBounds(getViewport())
			});
		}
		focusWindow(windowId);
	}

	function restoreWindow(windowId) {
		focusWindow(windowId);
	}

	function handleDesktopPointerDown(event) {
		if (event.target === desktopRef) {
			activeWindow = null;
			showContextMenu = false;
		}
	}

	function handleContextMenu(event) {
		if (event.target.closest('.app-window, .taskbar')) return;
		event.preventDefault();
		const menuWidth = 224;
		const menuHeight = 420;
		contextMenuPosition = {
			x: Math.min(event.clientX, globalThis.innerWidth - menuWidth),
			y: Math.min(event.clientY, globalThis.innerHeight - menuHeight)
		};
		showContextMenu = true;
	}

	function handleViewportResize() {
		const viewport = getViewport();
		openWindows = openWindows.map((windowState) => ({
			...windowState,
			bounds: windowState.maximized
				? createMaximizedBounds(viewport)
				: constrainWindowBounds(windowState.bounds, viewport, windowState.minSize)
		}));
	}

	onMount(() => {
		notify({
			title: 'Portfolio ready',
			message: 'Open an application from the desktop or the Start menu.',
			source: 'Portfolio OS',
			dedupeKey: 'shell-ready',
			popup: false
		});
		const initialRoute = getPortfolioRouteState(globalThis.location.href);
		const requestedApp = initialApp === 'home' ? initialRoute.appId : initialApp;
		openApp(requestedApp, {
			data: initialRoute.appId === requestedApp ? initialRoute.data : {},
			updateUrl: false
		});
		const handleHistory = () => {
			const route = getPortfolioRouteState(globalThis.location.href);
			openApp(route.appId, { data: route.data, updateUrl: false });
		};

		globalThis.addEventListener('resize', handleViewportResize);
		globalThis.addEventListener('popstate', handleHistory);

		return () => {
			globalThis.removeEventListener('resize', handleViewportResize);
			globalThis.removeEventListener('popstate', handleHistory);
		};
	});
</script>

<main
	bind:this={desktopRef}
	class="h-screen w-full overflow-hidden"
	style={wallpaperStyle}
	aria-label="Samuel Ndubuisi portfolio desktop"
	on:pointerdown={handleDesktopPointerDown}
	on:contextmenu={handleContextMenu}
>
	<h1 class="sr-only">Samuel Ndubuisi | Full Stack Developer</h1>
	<DesktopIcons {openApp} />

	{#each openWindows as windowState (windowState.id)}
		<Window
			{windowState}
			onFocus={() => focusWindow(windowState.id)}
			onUpdate={(patch) => updateWindow(windowState.id, patch)}
			onMinimize={() => minimizeWindow(windowState.id)}
			onMaximize={() => toggleMaximize(windowState.id)}
			onClose={() => closeWindow(windowState.id)}
		>
			<AppRenderer
				appId={windowState.appId}
				{windowState}
				onOpenApp={openApp}
				onClose={() => closeWindow(windowState.id)}
			/>
		</Window>
	{/each}

	{#if showContextMenu}
		<ContextMenu
			position={contextMenuPosition}
			onAction={openApp}
			onClose={() => (showContextMenu = false)}
		/>
	{/if}

	<Taskbar {openWindows} {activeWindow} {openApp} {focusWindow} {restoreWindow} />
</main>
