<script>
	import { onMount, tick } from 'svelte';
	import { notify } from '$lib/notifications';
	import { profile } from '$lib/profile';
	import { getPortfolioRouteState, updatePortfolioUrl } from '$lib/routeState';

	export let windowState = { data: {} };

	const caseStudies = profile.caseStudies.map((study) => ({
		...study,
		id: `case-study-${study.slug}`,
		name: study.title,
		description: study.summary,
		kind: 'case-study'
	}));

	let view = 'case-studies';
	let projects = [];
	let loading = true;
	let warning = '';
	let selectedProject = null;
	let fetchedAt = null;
	let requestController;
	let closeButton;
	let projectDialog;
	let previousFocus;
	let copyStatus = '';
	let requestedSlug;

	async function fetchProjects() {
		requestController?.abort();
		requestController = new AbortController();
		loading = true;
		warning = '';

		try {
			const response = await fetch('/api/projects', { signal: requestController.signal });
			if (!response.ok) throw new Error(`Project request returned ${response.status}`);
			const result = await response.json();
			projects = result.projects;
			fetchedAt = new Date(result.fetchedAt);
			if (result.stale || result.source === 'fallback') {
				warning = 'Live GitHub data is unavailable; showing a reliable saved project list.';
				notify({
					title: 'Using saved projects',
					message: 'Live GitHub data is unavailable. A saved project list is displayed.',
					type: 'warning',
					source: 'GitHub Projects',
					dedupeKey: 'projects-status'
				});
			}
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			warning = 'Projects could not be loaded. Check your connection and retry.';
			notify({
				title: 'Projects unavailable',
				message: 'Project data could not be loaded. Check your connection and retry.',
				type: 'error',
				source: 'GitHub Projects',
				dedupeKey: 'projects-status'
			});
		} finally {
			loading = false;
		}
	}

	async function openProject(project, event, syncRoute = true) {
		previousFocus = event?.currentTarget ?? null;
		selectedProject = project;
		copyStatus = '';
		if (syncRoute && project.kind === 'case-study') {
			updatePortfolioUrl('projects', { project: project.slug });
		}
		await tick();
		closeButton?.focus();
	}

	function closeProjectDetails(syncRoute = true) {
		selectedProject = null;
		if (syncRoute) updatePortfolioUrl('projects');
		void tick().then(() => previousFocus?.focus());
	}

	function handleDialogKeydown(event) {
		if (event.key === 'Escape') {
			closeProjectDetails();
			return;
		}
		if (event.key !== 'Tab') return;

		const focusable = [...projectDialog.querySelectorAll('button, a, input')].filter(
			(element) => !element.disabled
		);
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable.at(-1);

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	async function copyToClipboard(text) {
		try {
			await navigator.clipboard.writeText(text);
			copyStatus = 'Clone URL copied.';
			notify({
				title: 'Clone URL copied',
				message: 'The repository URL is ready to paste.',
				type: 'success',
				source: 'Clipboard',
				duration: 3_000,
				dedupeKey: 'project-copy'
			});
		} catch {
			copyStatus = 'The clone URL could not be copied.';
			notify({
				title: 'Copy failed',
				message: 'The clone URL could not be copied.',
				type: 'error',
				source: 'Clipboard',
				duration: 4_000,
				dedupeKey: 'project-copy'
			});
		}
	}

	function formatSize(size) {
		if (!size) return 'Not reported';
		if (size < 1024) return `${size} KB`;
		return `${(size / 1024).toFixed(1)} MB`;
	}

	function formatDate(date) {
		return date
			? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))
			: 'Saved project';
	}

	function syncProjectFromRoute(projectSlug) {
		const requestedProject = caseStudies.find((study) => study.slug === projectSlug);
		requestedSlug = projectSlug;
		if (requestedProject && selectedProject?.slug !== projectSlug) {
			void openProject(requestedProject, null, false);
		} else if (!requestedProject && selectedProject?.kind === 'case-study') {
			closeProjectDetails(false);
		}
	}

	onMount(() => {
		void fetchProjects();
		const handleHistory = () => {
			const route = getPortfolioRouteState(globalThis.location.href);
			if (route.appId === 'projects') syncProjectFromRoute(route.data.project);
		};
		globalThis.addEventListener('popstate', handleHistory);
		return () => {
			requestController?.abort();
			globalThis.removeEventListener('popstate', handleHistory);
		};
	});

	$: if (windowState?.data?.project !== requestedSlug) {
		syncProjectFromRoute(windowState?.data?.project);
	}
</script>

<section
	class="file-manager flex h-full w-full flex-col overflow-hidden"
	aria-label="Portfolio projects"
>
	<header
		class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-600 px-4 py-2"
	>
		<div class="flex flex-wrap items-center gap-2">
			<div class="flex rounded bg-gray-800 p-0.5" aria-label="Project view">
				<button
					type="button"
					class="rounded px-3 py-1 text-xs"
					class:bg-blue-700={view === 'case-studies'}
					class:text-gray-300={view !== 'case-studies'}
					aria-pressed={view === 'case-studies'}
					on:click={() => (view = 'case-studies')}
				>
					Case studies
				</button>
				<button
					type="button"
					class="rounded px-3 py-1 text-xs"
					class:bg-blue-700={view === 'repositories'}
					class:text-gray-300={view !== 'repositories'}
					aria-pressed={view === 'repositories'}
					on:click={() => (view = 'repositories')}
				>
					GitHub
				</button>
			</div>
			<button
				type="button"
				class="flex items-center gap-2 rounded px-3 py-1 text-xs hover:bg-gray-600 disabled:opacity-50"
				on:click={fetchProjects}
				disabled={loading}
				hidden={view !== 'repositories'}
			>
				<i class="fas fa-sync-alt" class:animate-spin={loading} aria-hidden="true"></i>
				Refresh
			</button>
			<span class="text-xs text-gray-400">
				{view === 'case-studies'
					? `${caseStudies.length} case studies`
					: `${projects.length} repositories`}
			</span>
		</div>
		{#if fetchedAt}
			<time class="text-xs text-gray-400" datetime={fetchedAt.toISOString()}>
				Updated {fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
			</time>
		{/if}
	</header>

	{#if warning && view === 'repositories'}
		<div
			class="border-b border-amber-800 bg-amber-950 px-4 py-2 text-sm text-amber-200"
			role="status"
		>
			{warning}
		</div>
	{/if}

	<div class="flex-1 overflow-y-auto p-4">
		{#if view === 'case-studies'}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each caseStudies as study (study.id)}
					<button
						type="button"
						class="file-item rounded-xl border border-gray-600 p-5 text-left hover:border-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
						on:click={(event) => openProject(study, event)}
						aria-label={`Open ${study.title} case study`}
					>
						<span class="flex items-start justify-between gap-3">
							<span class="text-lg font-semibold text-white">{study.title}</span>
							<i class="fas fa-arrow-up-right-from-square text-blue-300" aria-hidden="true"></i>
						</span>
						<span class="mt-2 block text-sm leading-relaxed text-gray-300">{study.summary}</span>
						<span class="mt-4 flex flex-wrap gap-1">
							{#each study.tech.slice(0, 4) as technology}
								<span class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200">
									{technology}
								</span>
							{/each}
						</span>
					</button>
				{/each}
			</div>
		{:else if loading && projects.length === 0}
			<div class="flex h-64 items-center justify-center" role="status">
				<div class="text-center text-gray-300">
					<i class="fas fa-spinner fa-spin mb-4 text-3xl text-blue-400" aria-hidden="true"></i>
					<p>Loading projects…</p>
				</div>
			</div>
		{:else if projects.length === 0}
			<div class="flex h-64 flex-col items-center justify-center text-center">
				<i class="fas fa-triangle-exclamation mb-4 text-3xl text-red-400" aria-hidden="true"></i>
				<p class="text-gray-300">No projects are available right now.</p>
				<button type="button" class="mt-4 rounded bg-gray-700 px-4 py-2" on:click={fetchProjects}>
					Retry
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each projects as project (project.id)}
					<button
						type="button"
						class="file-item rounded border border-gray-600 p-4 text-left hover:border-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
						on:click={(event) => openProject(project, event)}
					>
						<span class="mb-2 flex items-start justify-between gap-3">
							<span class="truncate text-lg font-semibold text-white">{project.name}</span>
							<span class="flex shrink-0 items-center gap-2 text-xs text-gray-400">
								<i class="fas fa-star" aria-hidden="true"></i>{project.stars}
								<i class="fas fa-code-branch" aria-hidden="true"></i>{project.forks}
							</span>
						</span>
						<span class="mb-3 block text-sm text-gray-300">{project.description}</span>
						<span class="flex items-center justify-between gap-3 text-xs text-gray-400">
							<span>{project.language}</span>
							<span>{formatDate(project.updatedAt)}</span>
						</span>
						{#if project.topics?.length}
							<span class="mt-3 flex flex-wrap gap-1">
								{#each project.topics.slice(0, 4) as topic}
									<span class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200">{topic}</span>
								{/each}
							</span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>

{#if selectedProject}
	<div
		class="fixed inset-0 z-[7000] flex items-center justify-center bg-black/70 p-4"
		role="presentation"
		on:pointerdown={(event) => event.target === event.currentTarget && closeProjectDetails()}
	>
		<div
			bind:this={projectDialog}
			class="max-h-[85dvh] w-full max-w-2xl overflow-hidden rounded-lg border border-gray-600 bg-gray-800 shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="project-dialog-title"
			tabindex="-1"
			on:keydown={handleDialogKeydown}
		>
			<header class="flex items-center justify-between border-b border-gray-600 p-4">
				<h2 id="project-dialog-title" class="text-xl font-semibold text-white">
					{selectedProject.name}
				</h2>
				<button
					bind:this={closeButton}
					type="button"
					class="rounded p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
					on:click={closeProjectDetails}
					aria-label="Close project details"
				>
					<i class="fas fa-times" aria-hidden="true"></i>
				</button>
			</header>

			<div class="max-h-[calc(85dvh-4rem)] overflow-y-auto p-4">
				<p class="mb-5 text-gray-300">{selectedProject.description}</p>

				{#if selectedProject.kind === 'case-study'}
					<div class="space-y-5">
						<section>
							<h3 class="mb-1 font-semibold text-white">Problem</h3>
							<p class="text-sm leading-relaxed text-gray-300">{selectedProject.problem}</p>
						</section>
						<section>
							<h3 class="mb-1 font-semibold text-white">Samuel's role</h3>
							<p class="text-sm leading-relaxed text-gray-300">{selectedProject.role}</p>
						</section>
						<section>
							<h3 class="mb-1 font-semibold text-white">Solution</h3>
							<p class="text-sm leading-relaxed text-gray-300">{selectedProject.solution}</p>
						</section>
						<section>
							<h3 class="mb-2 font-semibold text-white">Outcomes</h3>
							<ul class="space-y-2 text-sm text-gray-300">
								{#each selectedProject.outcomes as outcome}
									<li class="flex items-start gap-2">
										<i class="fas fa-circle-check mt-1 text-green-400" aria-hidden="true"></i>
										<span>{outcome}</span>
									</li>
								{/each}
							</ul>
						</section>
						<section>
							<h3 class="mb-2 font-semibold text-white">Technology</h3>
							<ul class="flex flex-wrap gap-2">
								{#each selectedProject.tech as technology}
									<li class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-100">{technology}</li>
								{/each}
							</ul>
						</section>
					</div>
				{:else}
					<dl class="mb-5 grid grid-cols-2 gap-4 text-sm">
						<div>
							<dt class="text-gray-400">Language</dt>
							<dd>{selectedProject.language}</dd>
						</div>
						<div>
							<dt class="text-gray-400">Size</dt>
							<dd>{formatSize(selectedProject.size)}</dd>
						</div>
						<div>
							<dt class="text-gray-400">Stars</dt>
							<dd>{selectedProject.stars}</dd>
						</div>
						<div>
							<dt class="text-gray-400">Forks</dt>
							<dd>{selectedProject.forks}</dd>
						</div>
					</dl>
				{/if}

				{#if selectedProject.kind !== 'case-study' && selectedProject.cloneUrl}
					<label class="mb-5 block text-sm text-gray-400">
						Clone URL
						<span class="mt-1 flex gap-2">
							<input
								class="mono min-w-0 flex-1 rounded bg-gray-700 p-2 text-sm text-white"
								value={selectedProject.cloneUrl}
								readonly
							/>
							<button
								type="button"
								class="rounded bg-gray-700 px-3 text-white hover:bg-gray-600"
								on:click={() => copyToClipboard(selectedProject.cloneUrl)}
							>
								Copy
							</button>
						</span>
					</label>
					<p class="mb-4 text-sm text-gray-300" role="status">{copyStatus}</p>
				{/if}

				<div class="mt-5 flex flex-wrap gap-2">
					{#if selectedProject.kind === 'case-study'}
						{#if selectedProject.links.source}
							<a
								href={selectedProject.links.source}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700"
							>
								<i class="fab fa-github" aria-hidden="true"></i>
								View source
								<span class="sr-only">(opens in a new tab)</span>
							</a>
						{/if}
						{#if selectedProject.links.live}
							<a
								href={selectedProject.links.live}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 rounded bg-green-700 px-4 py-2 text-sm hover:bg-green-800"
							>
								<i class="fas fa-external-link-alt" aria-hidden="true"></i>
								View project
								<span class="sr-only">(opens in a new tab)</span>
							</a>
						{/if}
					{:else}
						<a
							href={selectedProject.url}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700"
						>
							<i class="fab fa-github" aria-hidden="true"></i>
							View on GitHub
							<span class="sr-only">(opens in a new tab)</span>
						</a>
						{#if selectedProject.homepage}
							<a
								href={selectedProject.homepage}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 rounded bg-green-700 px-4 py-2 text-sm hover:bg-green-800"
							>
								<i class="fas fa-external-link-alt" aria-hidden="true"></i>
								Live demo
								<span class="sr-only">(opens in a new tab)</span>
							</a>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
