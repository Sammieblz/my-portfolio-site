<script>
	import { onDestroy, onMount } from 'svelte';
	import { calculateEfficiency, calculateMatchScore, createMemoryDeck } from '$lib/memoryGame';
	import { notify } from '$lib/notifications';

	const STORAGE_KEY = 'portfolio-memory-high-scores-v1';
	const cardIcons = [
		'fas fa-heart',
		'fas fa-star',
		'fas fa-moon',
		'fas fa-sun',
		'fas fa-cat',
		'fas fa-dog',
		'fas fa-fish',
		'fas fa-car',
		'fas fa-plane',
		'fas fa-train',
		'fas fa-bicycle',
		'fas fa-apple-whole',
		'fas fa-lemon',
		'fas fa-music',
		'fas fa-camera',
		'fas fa-book',
		'fas fa-gamepad',
		'fas fa-house',
		'fas fa-tree',
		'fas fa-rocket',
		'fas fa-gem',
		'fas fa-crown',
		'fas fa-key',
		'fas fa-umbrella',
		'fas fa-snowflake',
		'fas fa-fire',
		'fas fa-bolt',
		'fas fa-pizza-slice',
		'fas fa-mug-hot',
		'fas fa-football',
		'fas fa-basketball',
		'fas fa-baseball'
	];
	const difficulties = {
		easy: { size: 4, name: 'Easy', color: 'text-green-400', button: 'bg-green-700' },
		medium: { size: 6, name: 'Medium', color: 'text-yellow-300', button: 'bg-yellow-700' },
		hard: { size: 8, name: 'Hard', color: 'text-red-300', button: 'bg-red-700' }
	};

	let difficulty = 'easy';
	let cards = [];
	let flippedCards = [];
	let matchedCards = [];
	let score = 0;
	let moves = 0;
	let timeElapsed = 0;
	let started = false;
	let paused = false;
	let won = false;
	let processing = false;
	let statusMessage = 'Choose a difficulty and start the game.';
	let highScores = { easy: 0, medium: 0, hard: 0 };
	let gameTimer;
	let flipBackTimeout;
	let winTimeout;

	$: gridSize = difficulties[difficulty].size;
	$: completion = cards.length ? Math.round((matchedCards.length / cards.length) * 100) : 0;
	$: efficiency = calculateEfficiency(cards.length, moves);

	function clearScheduledWork() {
		globalThis.clearInterval(gameTimer);
		globalThis.clearTimeout(flipBackTimeout);
		globalThis.clearTimeout(winTimeout);
		gameTimer = null;
		flipBackTimeout = null;
		winTimeout = null;
	}

	function buildDeck() {
		cards = createMemoryDeck(cardIcons, (gridSize * gridSize) / 2);
	}

	function startGame() {
		clearScheduledWork();
		score = 0;
		moves = 0;
		timeElapsed = 0;
		flippedCards = [];
		matchedCards = [];
		started = true;
		paused = false;
		won = false;
		processing = false;
		statusMessage = `${difficulties[difficulty].name} game started.`;
		buildDeck();
		gameTimer = globalThis.setInterval(() => {
			if (!paused && started && !won) timeElapsed += 1;
		}, 1000);
	}

	function resetGame() {
		clearScheduledWork();
		started = false;
		paused = false;
		won = false;
		processing = false;
		score = 0;
		moves = 0;
		timeElapsed = 0;
		flippedCards = [];
		matchedCards = [];
		statusMessage = 'Game reset.';
		buildDeck();
	}

	function changeDifficulty(nextDifficulty) {
		if (!difficulties[nextDifficulty]) return;
		difficulty = nextDifficulty;
		resetGame();
		statusMessage = `${difficulties[difficulty].name} difficulty selected.`;
	}

	function togglePause() {
		paused = !paused;
		statusMessage = paused ? 'Game paused.' : 'Game resumed.';
	}

	function getCardLabel(card, index, revealed, matched) {
		const iconName = card.icon.replace('fas fa-', '').replaceAll('-', ' ');
		if (matched) return `Card ${index + 1}: matched ${iconName}`;
		if (revealed) return `Card ${index + 1}: ${iconName}`;
		return `Card ${index + 1}: hidden`;
	}

	function finishGame() {
		won = true;
		globalThis.clearInterval(gameTimer);
		gameTimer = null;
		const newHighScore = score > highScores[difficulty];
		if (newHighScore) {
			highScores = { ...highScores, [difficulty]: score };
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(highScores));
			} catch {
				// Storage is optional; the current-session score still works.
			}
		}
		statusMessage = `Game complete in ${moves} moves with a score of ${score}.`;
		notify({
			title: newHighScore ? 'New memory high score' : 'Memory game complete',
			message: `${score} points in ${moves} moves.`,
			type: 'success',
			source: 'Memory Game',
			dedupeKey: 'memory-game-result'
		});
	}

	function flipCard(cardId) {
		if (!started || won || paused || processing) return;
		const card = cards.find((candidate) => candidate.id === cardId);
		if (!card || matchedCards.includes(cardId) || flippedCards.includes(cardId)) return;

		flippedCards = [...flippedCards, cardId];
		statusMessage = 'Card revealed.';
		if (flippedCards.length !== 2) return;

		processing = true;
		moves += 1;
		const [firstId, secondId] = flippedCards;
		const firstCard = cards.find((candidate) => candidate.id === firstId);
		const secondCard = cards.find((candidate) => candidate.id === secondId);

		if (firstCard.pairId === secondCard.pairId) {
			matchedCards = [...matchedCards, firstId, secondId];
			flippedCards = [];
			score += calculateMatchScore({ timeElapsed, moves, gridSize });
			processing = false;
			statusMessage = 'Match found.';
			if (matchedCards.length === cards.length) {
				winTimeout = globalThis.setTimeout(finishGame, 350);
			}
		} else {
			statusMessage = 'No match.';
			flipBackTimeout = globalThis.setTimeout(() => {
				flippedCards = [];
				processing = false;
			}, 800);
		}
	}

	function formatTime(seconds) {
		return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
	}

	onMount(() => {
		try {
			const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
			for (const key of Object.keys(highScores)) {
				const value = Number(saved[key]);
				if (Number.isFinite(value) && value >= 0) highScores[key] = Math.floor(value);
			}
			highScores = { ...highScores };
		} catch {
			// Ignore invalid or unavailable storage.
		}
		buildDeck();
	});

	onDestroy(clearScheduledWork);
</script>

<section
	class="flex h-full w-full flex-col overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 p-3 text-white sm:p-4"
	aria-label="Memory game"
>
	<header class="mb-3 flex flex-wrap items-center justify-between gap-2">
		<h2 class="text-xl font-bold text-purple-300 sm:text-2xl">
			<i class="fas fa-brain mr-2" aria-hidden="true"></i>Memory Game
		</h2>
		<dl class="flex flex-wrap gap-2 text-xs sm:text-sm">
			<div class="rounded bg-gray-700 px-2 py-1">
				<dt class="sr-only">Score</dt>
				<dd>Score: {score}</dd>
			</div>
			<div class="rounded bg-gray-700 px-2 py-1">
				<dt class="sr-only">Moves</dt>
				<dd>Moves: {moves}</dd>
			</div>
			<div class="rounded bg-gray-700 px-2 py-1">
				<dt class="sr-only">Time</dt>
				<dd>Time: {formatTime(timeElapsed)}</dd>
			</div>
			<div class="rounded bg-gray-700 px-2 py-1">
				<dt class="sr-only">High score</dt>
				<dd>High: {highScores[difficulty]}</dd>
			</div>
		</dl>
	</header>

	<div class="mb-3 flex justify-center gap-1" aria-label="Difficulty">
		{#each Object.entries(difficulties) as [key, setting]}
			<button
				type="button"
				class={`rounded px-3 py-1 text-sm ${
					difficulty === key ? `${setting.button} text-white` : 'bg-gray-700 text-gray-200'
				}`}
				aria-pressed={difficulty === key}
				on:click={() => changeDifficulty(key)}
			>
				{setting.name} ({setting.size}×{setting.size})
			</button>
		{/each}
	</div>

	<p class="sr-only" aria-live="polite">{statusMessage}</p>

	{#if !started}
		<div class="flex flex-1 flex-col items-center justify-center px-4 text-center">
			<i class="fas fa-brain mb-4 text-6xl text-purple-300" aria-hidden="true"></i>
			<h3 class="text-2xl font-bold">{difficulties[difficulty].name} memory game</h3>
			<p class="mt-3 max-w-md text-gray-300">
				Reveal cards and match every pair. Fewer moves and faster matches earn more points.
			</p>
			<button
				type="button"
				class="mt-6 rounded-lg bg-purple-700 px-8 py-3 font-semibold hover:bg-purple-600"
				on:click={startGame}
			>
				Start game
			</button>
		</div>
	{:else if won}
		<div class="flex flex-1 flex-col items-center justify-center px-4 text-center">
			<i class="fas fa-trophy mb-4 text-6xl text-yellow-300" aria-hidden="true"></i>
			<h3 class="text-3xl font-bold text-green-300">Game complete</h3>
			<p class="mt-3 text-lg">Score {score} · {moves} moves · {formatTime(timeElapsed)}</p>
			<p class="mt-1 text-gray-300">Efficiency: {efficiency}%</p>
			<button
				type="button"
				class="mt-6 rounded-lg bg-purple-700 px-6 py-2 font-semibold hover:bg-purple-600"
				on:click={startGame}
			>
				Play again
			</button>
		</div>
	{:else}
		<div class="mb-3 flex justify-center gap-2">
			<button
				type="button"
				class="rounded bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
				on:click={togglePause}
			>
				<i class={`fas ${paused ? 'fa-play' : 'fa-pause'} mr-1`} aria-hidden="true"></i>{paused
					? 'Resume'
					: 'Pause'}
			</button>
			<button
				type="button"
				class="rounded bg-red-800 px-4 py-2 text-sm hover:bg-red-700"
				on:click={resetGame}
			>
				<i class="fas fa-stop mr-1" aria-hidden="true"></i>Reset
			</button>
		</div>

		<div class="mb-3">
			<div class="mb-1 flex justify-between text-xs text-gray-300">
				<span>Progress</span><span>{completion}%</span>
			</div>
			<div
				class="h-2 rounded-full bg-gray-700"
				role="progressbar"
				aria-valuenow={completion}
				aria-valuemin="0"
				aria-valuemax="100"
				aria-label="Matched cards"
			>
				<div
					class="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
					style:width={`${completion}%`}
				></div>
			</div>
		</div>

		<div class="flex min-h-0 flex-1 items-center justify-center overflow-auto">
			<div
				class="grid w-full gap-1.5 rounded-lg bg-gray-800 p-2 sm:gap-2 sm:p-3"
				style:grid-template-columns={`repeat(${gridSize}, minmax(0, 1fr))`}
				style:max-width={`${gridSize * 68}px`}
			>
				{#each cards as card, index (card.id)}
					{@const revealed = flippedCards.includes(card.id) || matchedCards.includes(card.id)}
					{@const matched = matchedCards.includes(card.id)}
					<button
						type="button"
						class={`aspect-square min-h-9 rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
							matched ? 'bg-green-600' : revealed ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
						}`}
						disabled={matched || processing || paused}
						aria-label={getCardLabel(card, index, revealed, matched)}
						aria-pressed={revealed}
						on:click={() => flipCard(card.id)}
					>
						<i
							class={revealed ? `${card.icon} text-white` : 'fas fa-question text-gray-300'}
							aria-hidden="true"
						></i>
					</button>
				{/each}
			</div>
		</div>

		{#if paused}
			<p class="mt-3 text-center font-semibold text-yellow-200">Game paused</p>
		{/if}
	{/if}
</section>
