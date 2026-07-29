<script>
	import { getApplicationsFor } from '$lib/appRegistry';

	export let openApp;
	const desktopApps = getApplicationsFor('desktop');
</script>

<nav class="absolute left-4 top-4 grid w-48 grid-cols-2 gap-3" aria-label="Desktop applications">
	{#each desktopApps as application (application.id)}
		<button
			type="button"
			data-application-id={application.id}
			class="desktop-icon flex select-none flex-col items-center rounded p-3 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
			on:click={() => openApp(application.id)}
			aria-label={`Open ${application.name}`}
		>
			<span class={`mb-2 text-4xl ${application.color}`} aria-hidden="true">
				<i class={application.icon}></i>
			</span>
			<span class="text-xs font-medium leading-tight text-white">{application.name}</span>
		</button>
	{/each}
</nav>
