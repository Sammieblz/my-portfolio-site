<script>
	import { onMount } from 'svelte';
	import { getApplicationsFor } from '$lib/appRegistry';

	export let position;
	export let onAction;
	export let onClose;

	let contextMenuRef;
	const menuItems = getApplicationsFor('startMenu');

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			onClose();
			return;
		}

		const buttons = [...contextMenuRef.querySelectorAll('[role="menuitem"]')];
		const currentIndex = buttons.indexOf(document.activeElement);
		const nextIndex = {
			ArrowDown: (currentIndex + 1) % buttons.length,
			ArrowUp: (currentIndex - 1 + buttons.length) % buttons.length,
			Home: 0,
			End: buttons.length - 1
		}[event.key];
		if (nextIndex !== undefined) {
			event.preventDefault();
			buttons[nextIndex]?.focus();
		}
	}

	onMount(() => {
		contextMenuRef?.querySelector('button')?.focus();
		const handleOutside = (event) => {
			if (contextMenuRef && !contextMenuRef.contains(event.target)) onClose();
		};
		document.addEventListener('pointerdown', handleOutside);
		return () => document.removeEventListener('pointerdown', handleOutside);
	});
</script>

<div
	bind:this={contextMenuRef}
	class="context-menu fixed z-[6000] min-w-56 rounded-lg py-2"
	style:left={`${Math.max(0, position.x)}px`}
	style:top={`${Math.max(0, position.y)}px`}
	role="menu"
	aria-label="Desktop menu"
	tabindex="-1"
	on:keydown={handleKeydown}
>
	{#each menuItems as application}
		<button
			type="button"
			role="menuitem"
			class="context-menu-item flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:text-white"
			on:click={() => {
				onAction(application.id);
				onClose();
			}}
		>
			<i class={`${application.icon} ${application.color} w-4`} aria-hidden="true"></i>
			{application.name}
		</button>
	{/each}
	<div class="my-1 border-t border-gray-600"></div>
	<button
		type="button"
		role="menuitem"
		class="context-menu-item flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:text-white"
		on:click={onClose}
	>
		<i class="fas fa-times w-4 text-gray-400" aria-hidden="true"></i>
		Close menu
	</button>
</div>
