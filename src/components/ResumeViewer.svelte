<script>
	import { notify } from '$lib/notifications';
	import { profile } from '$lib/profile';

	const pdfUrl = profile.assets.resumePdf;
	let loading = true;
	let failed = false;
	let zoom = 100;

	function downloadResume() {
		const link = document.createElement('a');
		link.href = pdfUrl;
		link.download = profile.assets.resumeDownloadName;
		document.body.appendChild(link);
		link.click();
		link.remove();
		notify({
			title: 'Resume download started',
			message: profile.assets.resumeDownloadName,
			type: 'success',
			source: 'Resume',
			duration: 4_000,
			dedupeKey: 'resume-download'
		});
	}

	function openInNewTab() {
		globalThis.open(pdfUrl, '_blank', 'noopener,noreferrer');
		notify({
			title: 'Resume opened',
			message: 'The PDF was opened in a new browser tab.',
			type: 'info',
			source: 'Resume',
			duration: 4_000,
			dedupeKey: 'resume-open'
		});
	}

	function adjustZoom(delta) {
		zoom = Math.max(50, Math.min(175, zoom + delta));
	}
</script>

<section
	class="file-manager flex h-full w-full flex-col overflow-hidden"
	aria-label="Résumé viewer"
>
	<header
		class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-600 px-3 py-2"
	>
		<div class="flex flex-wrap gap-2">
			<button
				type="button"
				class="flex items-center gap-2 rounded px-3 py-1 text-xs hover:bg-gray-600"
				on:click={downloadResume}
			>
				<i class="fas fa-download" aria-hidden="true"></i>Download
			</button>
			<button
				type="button"
				class="flex items-center gap-2 rounded px-3 py-1 text-xs hover:bg-gray-600"
				on:click={openInNewTab}
			>
				<i class="fas fa-external-link-alt" aria-hidden="true"></i>Open in browser
			</button>
		</div>

		<div class="flex items-center gap-1" aria-label="Zoom controls">
			<button
				type="button"
				class="rounded px-2 py-1 hover:bg-gray-600"
				on:click={() => adjustZoom(-25)}
				disabled={zoom === 50}
				aria-label="Zoom out"
			>
				<i class="fas fa-search-minus" aria-hidden="true"></i>
			</button>
			<output class="min-w-12 text-center text-xs text-gray-300">{zoom}%</output>
			<button
				type="button"
				class="rounded px-2 py-1 hover:bg-gray-600"
				on:click={() => adjustZoom(25)}
				disabled={zoom === 175}
				aria-label="Zoom in"
			>
				<i class="fas fa-search-plus" aria-hidden="true"></i>
			</button>
			<button
				type="button"
				class="rounded px-2 py-1 text-xs hover:bg-gray-600"
				on:click={() => (zoom = 100)}
				aria-label="Reset zoom"
			>
				100%
			</button>
		</div>
	</header>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex (keyboard access for this scroll region) -->
	<div
		class="relative min-h-0 flex-1 overflow-auto bg-gray-200 p-3"
		tabindex="0"
		aria-label="Résumé document area"
	>
		{#if failed}
			<div class="flex h-full flex-col items-center justify-center px-4 text-center text-gray-800">
				<i class="fas fa-file-pdf mb-4 text-5xl text-red-600" aria-hidden="true"></i>
				<h2 class="text-xl font-semibold">Inline PDF viewing is unavailable</h2>
				<p class="mt-2 max-w-md text-sm">
					Open the résumé in your browser or download it directly. Your current page will stay open.
				</p>
				<div class="mt-5 flex flex-wrap justify-center gap-3">
					<button
						type="button"
						class="rounded bg-blue-700 px-4 py-2 text-white"
						on:click={openInNewTab}
					>
						Open in browser
					</button>
					<button
						type="button"
						class="rounded bg-gray-700 px-4 py-2 text-white"
						on:click={downloadResume}
					>
						Download PDF
					</button>
				</div>
			</div>
		{:else}
			{#if loading}
				<div
					class="absolute inset-0 z-10 flex items-center justify-center bg-gray-200"
					role="status"
				>
					<p class="text-gray-700">
						<i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>Loading résumé…
					</p>
				</div>
			{/if}
			<div class="mx-auto h-full min-h-[600px]" style:width={`${zoom}%`}>
				<iframe
					src={pdfUrl}
					class="h-full min-h-[600px] w-full rounded border border-gray-400 bg-white shadow-lg"
					title={`${profile.name} résumé PDF`}
					on:load={() => (loading = false)}
					on:error={() => {
						loading = false;
						failed = true;
					}}
				></iframe>
			</div>
		{/if}
	</div>

	<footer
		class="flex flex-wrap items-center justify-between gap-2 border-t border-gray-600 bg-gray-800 px-4 py-2 text-xs text-gray-400"
	>
		<span>{profile.name} | {profile.role}</span>
		<span>
			Résumé updated
			<time datetime={profile.assets.resumeUpdated}>
				{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
					new Date(`${profile.assets.resumeUpdated}T12:00:00`)
				)}
			</time>
		</span>
	</footer>
</section>
