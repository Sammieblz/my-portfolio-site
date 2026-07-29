<script>
	import {
		HOME_DIRECTORY,
		getNode,
		listDirectory,
		normalizePath,
		resolvePath
	} from '$lib/filesystem';

	export let onOpenApp = () => {};

	let currentPath = HOME_DIRECTORY;
	let viewMode = 'grid';
	let history = [HOME_DIRECTORY];
	let historyIndex = 0;

	$: entries = listDirectory(currentPath) ?? [];
	$: breadcrumbs = currentPath.split('/').filter(Boolean);

	function navigateTo(path, addToHistory = true) {
		const normalized = normalizePath(path);
		const node = getNode(normalized);
		if (!node || node.type !== 'directory') return;

		currentPath = normalized;
		if (addToHistory) {
			history = [...history.slice(0, historyIndex + 1), normalized];
			historyIndex = history.length - 1;
		}
	}

	function goBack() {
		if (historyIndex <= 0) return;
		historyIndex -= 1;
		navigateTo(history[historyIndex], false);
	}

	function goForward() {
		if (historyIndex >= history.length - 1) return;
		historyIndex += 1;
		navigateTo(history[historyIndex], false);
	}

	function openEntry(entry) {
		if (entry.type === 'directory') {
			navigateTo(resolvePath(currentPath, entry.name));
		} else if (entry.type === 'app') {
			onOpenApp(entry.appId);
		} else if (entry.type === 'link') {
			globalThis.open(entry.href, '_blank', 'noopener,noreferrer');
		}
	}

	function navigateBreadcrumb(index) {
		navigateTo(`/${breadcrumbs.slice(0, index + 1).join('/')}`);
	}

	function getFileIcon(entry) {
		if (entry.icon) return entry.icon;
		if (entry.type === 'directory') return 'fas fa-folder';
		return 'fas fa-file';
	}
</script>

<section class="file-manager flex h-full w-full flex-col overflow-hidden" aria-label="File manager">
	<header class="flex items-center justify-between border-b border-gray-600 px-3 py-2">
		<div class="flex items-center gap-1" aria-label="Navigation controls">
			<button
				type="button"
				class="rounded px-2 py-1 hover:bg-gray-600 disabled:opacity-40"
				on:click={goBack}
				disabled={historyIndex === 0}
				aria-label="Back"
			>
				<i class="fas fa-arrow-left" aria-hidden="true"></i>
			</button>
			<button
				type="button"
				class="rounded px-2 py-1 hover:bg-gray-600 disabled:opacity-40"
				on:click={goForward}
				disabled={historyIndex >= history.length - 1}
				aria-label="Forward"
			>
				<i class="fas fa-arrow-right" aria-hidden="true"></i>
			</button>
			<button
				type="button"
				class="rounded px-2 py-1 hover:bg-gray-600 disabled:opacity-40"
				on:click={() => navigateTo(resolvePath(currentPath, '..'))}
				disabled={currentPath === HOME_DIRECTORY}
				aria-label="Parent folder"
			>
				<i class="fas fa-arrow-up" aria-hidden="true"></i>
			</button>
			<button
				type="button"
				class="rounded px-2 py-1 hover:bg-gray-600"
				on:click={() => navigateTo(HOME_DIRECTORY)}
				aria-label="Home folder"
			>
				<i class="fas fa-home" aria-hidden="true"></i>
			</button>
		</div>

		<div class="flex items-center gap-1" aria-label="View controls">
			<button
				type="button"
				class="rounded px-2 py-1 hover:bg-gray-600"
				class:bg-gray-600={viewMode === 'grid'}
				aria-pressed={viewMode === 'grid'}
				on:click={() => (viewMode = 'grid')}
				aria-label="Grid view"
			>
				<i class="fas fa-th" aria-hidden="true"></i>
			</button>
			<button
				type="button"
				class="rounded px-2 py-1 hover:bg-gray-600"
				class:bg-gray-600={viewMode === 'list'}
				aria-pressed={viewMode === 'list'}
				on:click={() => (viewMode = 'list')}
				aria-label="List view"
			>
				<i class="fas fa-list" aria-hidden="true"></i>
			</button>
		</div>
	</header>

	<nav
		class="flex flex-wrap items-center gap-1 border-b border-gray-600 px-4 py-2 text-xs"
		aria-label="Current path"
	>
		<button type="button" class="text-gray-300 hover:text-white" on:click={() => navigateTo('/')}>
			Root
		</button>
		{#each breadcrumbs as part, index}
			<span class="text-gray-500" aria-hidden="true">/</span>
			<button
				type="button"
				class="text-gray-300 hover:text-white"
				on:click={() => navigateBreadcrumb(index)}
			>
				{part}
			</button>
		{/each}
	</nav>

	<div class="flex-1 overflow-y-auto p-4">
		{#if entries.length === 0}
			<div class="flex h-full flex-col items-center justify-center text-gray-400">
				<i class="fas fa-folder-open mb-3 text-4xl" aria-hidden="true"></i>
				<p>This folder is empty.</p>
			</div>
		{:else if viewMode === 'grid'}
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				{#each entries as entry (entry.name)}
					<button
						type="button"
						class="file-item flex min-w-0 flex-col items-center rounded p-3 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
						on:click={() => openEntry(entry)}
					>
						<i
							class={`${getFileIcon(entry)} ${entry.color ?? 'text-gray-400'} mb-2 text-3xl`}
							aria-hidden="true"
						></i>
						<span class="w-full break-words text-xs font-medium text-white">{entry.name}</span>
						{#if entry.size}<span class="mt-1 text-[11px] text-gray-400">{entry.size}</span>{/if}
					</button>
				{/each}
			</div>
		{:else}
			<div class="space-y-1">
				{#each entries as entry (entry.name)}
					<button
						type="button"
						class="file-item flex w-full items-center gap-3 rounded p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
						on:click={() => openEntry(entry)}
					>
						<i
							class={`${getFileIcon(entry)} ${entry.color ?? 'text-gray-400'} text-lg`}
							aria-hidden="true"
						></i>
						<span class="min-w-0 flex-1 truncate text-sm text-white">{entry.name}</span>
						<span class="text-xs capitalize text-gray-400">{entry.type}</span>
						{#if entry.size}<span class="text-xs text-gray-400">{entry.size}</span>{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>
