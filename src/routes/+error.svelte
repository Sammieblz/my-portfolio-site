<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} | Samuel Ndubuisi</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-gray-950 p-6 text-white">
	<div class="max-w-lg text-center">
		<p class="mono text-sm text-red-300">Error {$page.status}</p>
		<h1 class="mt-3 text-3xl font-bold">
			{$page.status === 404 ? 'That page does not exist' : 'The portfolio hit a problem'}
		</h1>
		<p class="mt-4 text-gray-300">
			{$page.error?.message || 'Please return to the portfolio and try again.'}
		</p>
		{#if $page.error?.errorId}
			<p class="mono mt-3 text-xs text-gray-500">Reference: {$page.error.errorId}</p>
		{/if}
		<a
			href="/"
			class="mt-7 inline-block rounded bg-blue-700 px-5 py-3 font-medium hover:bg-blue-600"
		>
			Return to the portfolio
		</a>
	</div>
</main>
