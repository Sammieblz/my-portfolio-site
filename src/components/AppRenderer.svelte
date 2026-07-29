<script>
	import { loadApplicationComponent } from '$lib/componentRegistry';

	export let appId;
	export let windowState;
	export let onOpenApp = () => {};
	export let onClose = () => {};

	$: componentPromise = loadApplicationComponent(appId);
</script>

{#await componentPromise}
	<div class="flex h-full items-center justify-center bg-gray-900 text-gray-300" role="status">
		<p>
			<i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>
			Opening application…
		</p>
	</div>
{:then AppComponent}
	{#if AppComponent}
		<svelte:component this={AppComponent} {windowState} {onOpenApp} {onClose} />
	{:else}
		<p class="p-6 text-red-300" role="alert">This application could not be loaded.</p>
	{/if}
{:catch}
	<div class="flex h-full items-center justify-center bg-gray-900 p-6 text-center text-red-300">
		<p role="alert">This application failed to load. Close it and try again.</p>
	</div>
{/await}
