<script>
	import { onMount } from 'svelte';
	import { clearNotifications, notifications, removeNotification } from '$lib/notifications';

	export let mode = 'desktop';
	export let onClose = () => {};
	export let trigger = null;

	let panel;
	let closeButton;

	const appearance = {
		info: { icon: 'fas fa-circle-info', color: 'text-blue-300' },
		success: { icon: 'fas fa-circle-check', color: 'text-green-300' },
		warning: { icon: 'fas fa-triangle-exclamation', color: 'text-amber-300' },
		error: { icon: 'fas fa-circle-xmark', color: 'text-red-300' }
	};

	function formatTime(timestamp) {
		return new Intl.DateTimeFormat(undefined, {
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(timestamp));
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			event.preventDefault();
			onClose(true);
		}
	}

	onMount(() => {
		closeButton?.focus();
		const handleOutside = (event) => {
			if (!panel?.contains(event.target) && !trigger?.contains(event.target)) onClose(false);
		};
		document.addEventListener('pointerdown', handleOutside);
		return () => document.removeEventListener('pointerdown', handleOutside);
	});
</script>

<div
	bind:this={panel}
	class={`fixed z-[9000] flex max-h-[min(38rem,calc(100dvh-5rem))] w-[min(24rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-xl border border-gray-600 bg-gray-800 text-white shadow-2xl ${
		mode === 'mobile' ? 'right-2 top-10' : 'bottom-14 right-2'
	}`}
	role="dialog"
	aria-modal="false"
	aria-labelledby="notification-center-title"
	tabindex="-1"
	on:keydown={handleKeydown}
>
	<header class="flex items-center justify-between border-b border-gray-600 px-4 py-3">
		<div>
			<h2 id="notification-center-title" class="font-semibold">Notifications</h2>
			<p class="text-xs text-gray-300">Recent system and application activity</p>
		</div>
		<div class="flex items-center gap-1">
			{#if $notifications.length > 0}
				<button
					type="button"
					class="rounded px-2 py-1 text-xs text-gray-200 hover:bg-gray-700"
					on:click={clearNotifications}
				>
					Clear all
				</button>
			{/if}
			<button
				bind:this={closeButton}
				type="button"
				class="rounded p-2 text-gray-300 hover:bg-gray-700 hover:text-white"
				on:click={() => onClose(true)}
				aria-label="Close notifications"
			>
				<i class="fas fa-times" aria-hidden="true"></i>
			</button>
		</div>
	</header>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex (keyboard access for notification history) -->
	<div class="min-h-0 flex-1 overflow-y-auto" tabindex="0" aria-label="Notification history">
		{#if $notifications.length === 0}
			<div class="flex min-h-52 flex-col items-center justify-center p-8 text-center text-gray-300">
				<i class="fas fa-bell-slash mb-3 text-3xl" aria-hidden="true"></i>
				<p class="font-medium">No notifications</p>
				<p class="mt-1 text-sm">System and application updates will appear here.</p>
			</div>
		{:else}
			<ul class="divide-y divide-gray-700">
				{#each $notifications as notification (notification.id)}
					{@const style = appearance[notification.type] ?? appearance.info}
					<li class="flex items-start gap-3 p-4">
						<i class={`${style.icon} ${style.color} mt-1`} aria-hidden="true"></i>
						<div class="min-w-0 flex-1">
							<div class="flex items-start justify-between gap-2">
								<h3 class="font-medium leading-tight">{notification.title}</h3>
								<time
									class="shrink-0 text-xs text-gray-300"
									datetime={new Date(notification.createdAt).toISOString()}
								>
									{formatTime(notification.createdAt)}
								</time>
							</div>
							<p class="mt-1 text-sm leading-relaxed text-gray-200">{notification.message}</p>
							<p class="mt-2 text-xs text-gray-300">{notification.source}</p>
						</div>
						<button
							type="button"
							class="rounded p-1 text-gray-300 hover:bg-gray-700 hover:text-white"
							on:click={() => removeNotification(notification.id)}
							aria-label={`Remove ${notification.title} notification`}
						>
							<i class="fas fa-trash-can" aria-hidden="true"></i>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
