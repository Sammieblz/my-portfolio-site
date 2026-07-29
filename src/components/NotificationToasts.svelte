<script>
	import { dismissNotification, notifications } from '$lib/notifications';

	export let mode = 'desktop';

	const appearance = {
		info: {
			icon: 'fas fa-circle-info',
			border: 'border-blue-500',
			iconColor: 'text-blue-300'
		},
		success: {
			icon: 'fas fa-circle-check',
			border: 'border-green-500',
			iconColor: 'text-green-300'
		},
		warning: {
			icon: 'fas fa-triangle-exclamation',
			border: 'border-amber-500',
			iconColor: 'text-amber-300'
		},
		error: {
			icon: 'fas fa-circle-xmark',
			border: 'border-red-500',
			iconColor: 'text-red-300'
		}
	};

	$: visibleNotifications = $notifications
		.filter((notification) => notification.visible)
		.slice(0, mode === 'mobile' ? 1 : 4);
</script>

<section
	class={`pointer-events-none fixed z-[8000] flex flex-col gap-2 ${
		mode === 'mobile'
			? 'left-2 right-2 top-11'
			: 'bottom-16 right-3 w-[min(24rem,calc(100vw-1.5rem))]'
	}`}
	aria-label="Notification pop-ups"
>
	{#each visibleNotifications as notification (notification.id)}
		{@const style = appearance[notification.type] ?? appearance.info}
		<article
			class={`notification-popup pointer-events-auto rounded-lg border border-l-4 ${style.border} bg-gray-800/95 p-3 text-white shadow-2xl backdrop-blur`}
			role={notification.type === 'error' ? 'alert' : 'status'}
		>
			<div class="flex items-start gap-3">
				<i class={`${style.icon} ${style.iconColor} mt-1`} aria-hidden="true"></i>
				<div class="min-w-0 flex-1">
					<div class="flex items-start justify-between gap-2">
						<h2 class="font-semibold leading-tight">{notification.title}</h2>
						<button
							type="button"
							class="rounded p-1 text-gray-300 hover:bg-gray-700 hover:text-white"
							on:click={() => dismissNotification(notification.id)}
							aria-label={`Dismiss ${notification.title} notification`}
						>
							<i class="fas fa-times" aria-hidden="true"></i>
						</button>
					</div>
					<p class="mt-1 text-sm leading-relaxed text-gray-200">{notification.message}</p>
					<p class="mt-2 text-xs text-gray-300">{notification.source}</p>
				</div>
			</div>
		</article>
	{/each}
</section>

<style>
	.notification-popup {
		animation: notification-in 180ms ease-out;
	}

	@keyframes notification-in {
		from {
			transform: translateX(1rem);
		}
		to {
			transform: translateX(0);
		}
	}
</style>
