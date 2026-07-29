<script>
	import { onMount, tick } from 'svelte';
	import { profile } from '$lib/profile';
	import { HOME_DIRECTORY } from '$lib/filesystem';
	import { executeTerminalCommand } from '$lib/terminal';

	export let onOpenApp = () => {};
	export let onClose = () => {};

	const sessionStartedAt = Date.now();
	let terminalInput;
	let outputContainer;
	let commandInput = '';
	let commandHistory = [];
	let historyIndex = -1;
	let currentDirectory = HOME_DIRECTORY;
	let nextLineId = 0;
	let output = [];

	function addLines(lines, kind = 'output') {
		const additions = lines.map((text) => ({ id: nextLineId++, kind, text }));
		output = [...output, ...additions].slice(-500);
		void scrollToBottom();
	}

	async function scrollToBottom() {
		await tick();
		if (outputContainer) outputContainer.scrollTop = outputContainer.scrollHeight;
	}

	function prompt() {
		return `${profile.terminal.userAtHost}:${currentDirectory}$`;
	}

	function runCommand() {
		const input = commandInput.trim();
		if (!input) return;

		addLines([`${prompt()} ${input}`], 'command');
		commandHistory = [...commandHistory, input].slice(-100);
		historyIndex = commandHistory.length;

		const result = executeTerminalCommand(input, {
			cwd: currentDirectory,
			history: commandHistory,
			startedAt: sessionStartedAt
		});
		currentDirectory = result.cwd;

		if (result.action?.type === 'clear') {
			output = [];
		} else {
			addLines(result.lines);
		}

		if (result.action?.type === 'open-app') onOpenApp(result.action.appId);
		if (result.action?.type === 'close') onClose();
		commandInput = '';
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			runCommand();
			return;
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (historyIndex > 0) {
				historyIndex -= 1;
				commandInput = commandHistory[historyIndex] ?? '';
			}
		}
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex += 1;
				commandInput = commandHistory[historyIndex] ?? '';
			} else {
				historyIndex = commandHistory.length;
				commandInput = '';
			}
		}
	}

	onMount(() => {
		addLines([
			profile.terminal.welcomeLine,
			'Type "help" for available commands.',
			'',
			'This terminal is a safe portfolio simulation; it does not execute system commands.'
		]);
		terminalInput?.focus();
	});
</script>

<section
	class="terminal flex h-full w-full flex-col overflow-hidden"
	aria-label="Portfolio terminal"
>
	<div
		bind:this={outputContainer}
		class="flex-1 overflow-y-auto p-4"
		role="log"
		aria-live="polite"
		aria-relevant="additions"
	>
		{#each output as line (line.id)}
			<div
				class="mono mb-1 whitespace-pre-wrap break-words text-sm"
				class:kali-green={line.kind === 'command'}
				class:text-gray-100={line.kind !== 'command'}
			>
				{line.text || '\u00a0'}
			</div>
		{/each}
	</div>

	<label class="flex items-center border-t border-gray-600 p-4">
		<span class="sr-only">Terminal command</span>
		<span class="kali-green mono shrink-0 text-sm">{prompt()}</span>
		<input
			bind:this={terminalInput}
			bind:value={commandInput}
			on:keydown={handleKeydown}
			class="mono ml-2 min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
			placeholder="Enter command…"
			autocomplete="off"
			autocapitalize="off"
			spellcheck="false"
		/>
	</label>
</section>
