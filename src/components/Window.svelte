<script>
	import { onMount, tick } from 'svelte';
	import { constrainWindowBounds } from '$lib/windowManager';

	export let windowState;
	export let onFocus;
	export let onUpdate;
	export let onMinimize;
	export let onMaximize;
	export let onClose;

	let interaction = null;
	let windowElement;

	function viewport() {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		};
	}

	function beginInteraction(event, type) {
		if (event.button !== 0 || windowState.maximized) return;
		if (type === 'move' && event.target.closest('button, a, input, select, textarea')) return;

		interaction = {
			type,
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			startBounds: { ...windowState.bounds }
		};
		event.currentTarget.setPointerCapture(event.pointerId);
		onFocus();
		event.preventDefault();
	}

	function updateInteraction(event) {
		if (!interaction || event.pointerId !== interaction.pointerId) return;

		const deltaX = event.clientX - interaction.startX;
		const deltaY = event.clientY - interaction.startY;
		const proposed =
			interaction.type === 'move'
				? {
						...interaction.startBounds,
						x: interaction.startBounds.x + deltaX,
						y: interaction.startBounds.y + deltaY
					}
				: {
						...interaction.startBounds,
						width: interaction.startBounds.width + deltaX,
						height: interaction.startBounds.height + deltaY
					};

		onUpdate({
			bounds: constrainWindowBounds(proposed, viewport(), windowState.minSize)
		});
	}

	function endInteraction(event) {
		if (!interaction || event.pointerId !== interaction.pointerId) return;
		if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		interaction = null;
	}

	function handleTitleKeydown(event) {
		if (windowState.maximized) return;

		const distance = event.shiftKey ? 24 : 8;
		const movement = {
			ArrowLeft: { x: -distance, y: 0 },
			ArrowRight: { x: distance, y: 0 },
			ArrowUp: { x: 0, y: -distance },
			ArrowDown: { x: 0, y: distance }
		}[event.key];

		if (!movement) return;
		event.preventDefault();
		onUpdate({
			bounds: constrainWindowBounds(
				{
					...windowState.bounds,
					x: windowState.bounds.x + movement.x,
					y: windowState.bounds.y + movement.y
				},
				viewport(),
				windowState.minSize
			)
		});
	}

	function handleResizeKeydown(event) {
		if (windowState.maximized) return;

		const distance = event.shiftKey ? 24 : 8;
		const change = {
			ArrowLeft: { width: -distance, height: 0 },
			ArrowRight: { width: distance, height: 0 },
			ArrowUp: { width: 0, height: -distance },
			ArrowDown: { width: 0, height: distance }
		}[event.key];

		if (!change) return;
		event.preventDefault();
		onUpdate({
			bounds: constrainWindowBounds(
				{
					...windowState.bounds,
					width: windowState.bounds.width + change.width,
					height: windowState.bounds.height + change.height
				},
				viewport(),
				windowState.minSize
			)
		});
	}

	onMount(async () => {
		await tick();
		if (!windowElement?.contains(document.activeElement)) windowElement?.focus();
	});
</script>

<div
	bind:this={windowElement}
	class="app-window window-enter absolute flex flex-col overflow-hidden"
	style:left={`${windowState.bounds.x}px`}
	style:top={`${windowState.bounds.y}px`}
	style:width={`${windowState.bounds.width}px`}
	style:height={`${windowState.bounds.height}px`}
	style:z-index={windowState.zIndex}
	role="dialog"
	aria-modal="false"
	aria-label={windowState.title}
	aria-hidden={windowState.minimized}
	inert={windowState.minimized}
	hidden={windowState.minimized}
	tabindex="-1"
	on:pointerdown={onFocus}
>
	<header
		class="window-header flex min-h-10 touch-none items-center justify-between px-3"
		class:cursor-move={!windowState.maximized}
		tabindex="0"
		role="toolbar"
		aria-label={`${windowState.title} window. Use arrow keys to move.`}
		on:pointerdown={(event) => beginInteraction(event, 'move')}
		on:pointermove={updateInteraction}
		on:pointerup={endInteraction}
		on:pointercancel={endInteraction}
		on:keydown={handleTitleKeydown}
		on:dblclick={onMaximize}
	>
		<div class="flex min-w-0 items-center gap-2">
			<div class="flex gap-1" aria-hidden="true">
				<span class="h-3 w-3 rounded-full bg-red-500"></span>
				<span class="h-3 w-3 rounded-full bg-yellow-500"></span>
				<span class="h-3 w-3 rounded-full bg-green-500"></span>
			</div>
			<span class="mono truncate text-sm font-medium">{windowState.title}</span>
		</div>

		<div class="window-controls flex gap-1">
			<button
				type="button"
				class="flex h-7 w-7 items-center justify-center rounded hover:bg-gray-600"
				aria-label={`Minimize ${windowState.title}`}
				on:click|stopPropagation={onMinimize}
			>
				<i class="fas fa-minus text-xs" aria-hidden="true"></i>
			</button>
			<button
				type="button"
				class="flex h-7 w-7 items-center justify-center rounded hover:bg-gray-600"
				aria-label={`${windowState.maximized ? 'Restore' : 'Maximize'} ${windowState.title}`}
				on:click|stopPropagation={onMaximize}
			>
				<i
					class={`fas ${windowState.maximized ? 'fa-compress' : 'fa-expand'} text-xs`}
					aria-hidden="true"
				></i>
			</button>
			<button
				type="button"
				class="flex h-7 w-7 items-center justify-center rounded hover:bg-red-600"
				aria-label={`Close ${windowState.title}`}
				on:click|stopPropagation={onClose}
			>
				<i class="fas fa-times text-xs" aria-hidden="true"></i>
			</button>
		</div>
	</header>

	<div class="min-h-0 flex-1 overflow-hidden">
		<slot />
	</div>

	{#if !windowState.maximized}
		<button
			type="button"
			class="absolute bottom-0 right-0 h-6 w-6 touch-none cursor-se-resize bg-transparent"
			aria-label={`Resize ${windowState.title}. Use arrow keys to resize.`}
			on:pointerdown={(event) => beginInteraction(event, 'resize')}
			on:pointermove={updateInteraction}
			on:pointerup={endInteraction}
			on:pointercancel={endInteraction}
			on:keydown={handleResizeKeydown}
		>
			<span class="absolute bottom-1 right-1 h-2 w-2 border-b-2 border-r-2 border-gray-400"></span>
		</button>
	{/if}
</div>

<style>
	.window-header {
		background: #21262d;
		border-bottom: 1px solid #30363d;
	}

	.app-window {
		background: #0d1117;
		border: 1px solid #30363d;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 50%);
	}
</style>
