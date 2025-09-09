<script>
    import { onMount, onDestroy } from 'svelte';
    
    export let window = {};
    export let closeWindow = () => {};
    export let minimizeWindow = () => {};
    export let maximizeWindow = () => {};
    
    let score = 0;
    let highScore = 0;
    let moves = 0;
    let gameWon = false;
    let gameStarted = false;
    let gamePaused = false;
    let cards = [];
    let flippedCards = [];
    let matchedCards = [];
    let difficulty = 'easy';
    let timeElapsed = 0;
    let gameTimer = null;
    let isProcessing = false;
    let showStats = false;
    
    const cardIcons = [
        'fas fa-heart', 'fas fa-star', 'fas fa-moon', 'fas fa-sun',
        'fas fa-cat', 'fas fa-dog', 'fas fa-fish', 'fas fa-bird',
        'fas fa-car', 'fas fa-plane', 'fas fa-train', 'fas fa-bicycle',
        'fas fa-apple', 'fas fa-lemon', 'fas fa-grape', 'fas fa-cherry',
        'fas fa-music', 'fas fa-camera', 'fas fa-book', 'fas fa-gamepad',
        'fas fa-home', 'fas fa-tree', 'fas fa-flower', 'fas fa-mountain',
        'fas fa-rocket', 'fas fa-gem', 'fas fa-crown', 'fas fa-key',
        'fas fa-umbrella', 'fas fa-snowflake', 'fas fa-fire', 'fas fa-bolt',
        'fas fa-pizza', 'fas fa-coffee', 'fas fa-cake', 'fas fa-ice-cream',
        'fas fa-football', 'fas fa-basketball', 'fas fa-baseball', 'fas fa-soccer-ball',
        'fas fa-guitar', 'fas fa-piano', 'fas fa-microphone', 'fas fa-headphones'
    ];
    
    const difficulties = {
        easy: { size: 4, name: 'Easy', color: 'text-green-400', bgColor: 'bg-green-600' },
        medium: { size: 6, name: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-600' },
        hard: { size: 8, name: 'Hard', color: 'text-red-400', bgColor: 'bg-red-600' }
    };
    
    onMount(() => {
        const saved = localStorage.getItem('memory-high-score');
        if (saved) {
            highScore = parseInt(saved);
        }
        createCards();
    });
    
    onDestroy(() => {
        if (gameTimer) {
            clearInterval(gameTimer);
        }
    });
    
    function createCards() {
        const gridSize = difficulties[difficulty].size;
        const totalCards = gridSize * gridSize;
        const pairsNeeded = totalCards / 2;
        
        const selectedIcons = cardIcons.slice(0, pairsNeeded);
        const cardData = [];
        
        for (let i = 0; i < pairsNeeded; i++) {
            cardData.push({ 
                id: i * 2, 
                icon: selectedIcons[i], 
                matched: false,
                pairId: i
            });
            cardData.push({ 
                id: i * 2 + 1, 
                icon: selectedIcons[i], 
                matched: false,
                pairId: i
            });
        }
        
        cards = cardData.sort(() => Math.random() - 0.5);
    }
    
    function startGame() {
        gameStarted = true;
        gameWon = false;
        gamePaused = false;
        score = 0;
        moves = 0;
        timeElapsed = 0;
        flippedCards = [];
        matchedCards = [];
        isProcessing = false;
        showStats = false;
        
        createCards();
        startTimer();
    }
    
    function startTimer() {
        if (gameTimer) {
            clearInterval(gameTimer);
        }
        gameTimer = setInterval(() => {
            if (!gamePaused && gameStarted && !gameWon) {
                timeElapsed++;
            }
        }, 1000);
    }
    
    function pauseGame() {
        gamePaused = !gamePaused;
    }
    
    function resetGame() {
        if (gameTimer) {
            clearInterval(gameTimer);
        }
        gameStarted = false;
        gameWon = false;
        gamePaused = false;
        score = 0;
        moves = 0;
        timeElapsed = 0;
        flippedCards = [];
        matchedCards = [];
        isProcessing = false;
        showStats = false;
        createCards();
    }
    
    function changeDifficulty(newDifficulty) {
        if (gameStarted && !gameWon) {
            if (!confirm('Are you sure you want to change difficulty? Current progress will be lost.')) {
                return;
            }
        }
        difficulty = newDifficulty;
        resetGame();
    }
    
    function flipCard(cardId) {
        if (!gameStarted || gameWon || gamePaused || isProcessing) return;
        
        const card = cards.find(c => c.id === cardId);
        if (!card || card.matched || flippedCards.includes(cardId)) return;
        
        // Add card to flipped cards
        flippedCards.push(cardId);
        
        // If we have 2 cards flipped, check for match
        if (flippedCards.length === 2) {
            isProcessing = true;
            moves++;
            
            const [firstId, secondId] = flippedCards;
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === secondId);
            
            // Check if cards match
            if (firstCard.pairId === secondCard.pairId) {
                // Match found - mark as matched
                firstCard.matched = true;
                secondCard.matched = true;
                matchedCards.push(firstId, secondId);
                
                // Calculate score
                const baseScore = 100;
                const timeBonus = Math.max(0, 50 - Math.floor(timeElapsed / 10));
                const moveBonus = Math.max(0, 20 - moves);
                const difficultyMultiplier = difficulties[difficulty].size / 4;
                
                score += Math.floor((baseScore + timeBonus + moveBonus) * difficultyMultiplier);
                
                // Clear flipped cards array and reset processing
                flippedCards = [];
                isProcessing = false;
                
                // Check if game is won
                if (matchedCards.length === cards.length) {
                    setTimeout(() => {
                        gameWon = true;
                        if (gameTimer) {
                            clearInterval(gameTimer);
                        }
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem('memory-high-score', highScore.toString());
                        }
                    }, 500);
                }
            } else {
                // No match - flip cards back after delay
                setTimeout(() => {
                    flippedCards = [];
                    isProcessing = false;
                }, 1000);
            }
        }
    }
    
    function getGridSize() {
        return difficulties[difficulty].size;
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function getCompletionRate() {
        return Math.round((matchedCards.length / cards.length) * 100);
    }
    
    function getEfficiency() {
        const perfectMoves = cards.length / 2;
        return Math.round((perfectMoves / moves) * 100);
    }
    
    function isCardFlipped(cardId) {
        return flippedCards.includes(cardId);
    }
    
    function isCardMatched(cardId) {
        return matchedCards.includes(cardId);
    }
</script>

<div class="memory-game w-full h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
    <!-- Game Header -->
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-purple-400">
            <i class="fas fa-brain mr-2"></i>
            Memory Game
        </h2>
        <div class="flex gap-2 text-sm">
            <div class="bg-gray-700 px-3 py-1 rounded">
                Score: <span class="text-yellow-400 font-bold">{score}</span>
            </div>
            <div class="bg-gray-700 px-3 py-1 rounded">
                Moves: <span class="text-blue-400 font-bold">{moves}</span>
            </div>
            <div class="bg-gray-700 px-3 py-1 rounded">
                Time: <span class="text-green-400 font-bold">{formatTime(timeElapsed)}</span>
            </div>
            <div class="bg-gray-700 px-3 py-1 rounded">
                High: <span class="text-purple-400 font-bold">{highScore}</span>
            </div>
        </div>
    </div>
    
    <!-- Difficulty Selector -->
    <div class="flex justify-center mb-4">
        <div class="bg-gray-700 rounded-lg p-1 flex">
            {#each Object.entries(difficulties) as [key, diff]}
                <button 
                    class="px-3 py-1 rounded text-sm transition-colors {difficulty === key ? diff.bgColor + ' text-white' : 'text-gray-300 hover:text-white'}"
                    on:click={() => changeDifficulty(key)}
                >
                    {diff.name} ({diff.size}x{diff.size})
                </button>
            {/each}
        </div>
    </div>
    
    <!-- Game Board -->
    <div class="flex-1 flex items-center justify-center">
        {#if !gameStarted}
            <div class="text-center">
                <div class="text-6xl mb-4">
                    <i class="fas fa-brain text-purple-400"></i>
                </div>
                <h3 class="text-2xl font-bold mb-4">Memory Game</h3>
                <p class="text-gray-400 mb-6 max-w-md">
                    Match pairs of cards by remembering their positions. 
                    Complete faster with fewer moves for higher scores!
                </p>
                <div class="mb-4">
                    <span class="text-sm text-gray-300">Current Difficulty: </span>
                    <span class="text-lg font-semibold {difficulties[difficulty].color}">
                        {difficulties[difficulty].name} ({difficulties[difficulty].size}x{difficulties[difficulty].size})
                    </span>
                </div>
                <button 
                    on:click={startGame}
                    class="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                    <i class="fas fa-play mr-2"></i>
                    Start Game
                </button>
            </div>
        {:else if gameWon}
            <div class="text-center">
                <div class="text-6xl mb-4">
                    <i class="fas fa-trophy text-yellow-400"></i>
                </div>
                <h3 class="text-3xl font-bold mb-2 text-green-400">Congratulations!</h3>
                <p class="text-xl text-gray-300 mb-2">You completed the game in {moves} moves!</p>
                <p class="text-lg text-yellow-400 mb-2">Final Score: {score}</p>
                <p class="text-sm text-gray-400 mb-4">Time: {formatTime(timeElapsed)} | Efficiency: {getEfficiency()}%</p>
                <div class="flex gap-3 justify-center">
                    <button 
                        on:click={startGame}
                        class="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                        <i class="fas fa-redo mr-2"></i>
                        Play Again
                    </button>
                    <button 
                        on:click={() => showStats = !showStats}
                        class="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                        <i class="fas fa-chart-bar mr-2"></i>
                        {showStats ? 'Hide' : 'Show'} Stats
                    </button>
                </div>
                
                {#if showStats}
                    <div class="mt-6 bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
                        <h4 class="text-lg font-semibold mb-3">Game Statistics</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-gray-400">Difficulty:</span>
                                <span class="ml-2 {difficulties[difficulty].color} font-semibold">{difficulties[difficulty].name}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">Grid Size:</span>
                                <span class="ml-2 text-white">{getGridSize()}x{getGridSize()}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">Total Cards:</span>
                                <span class="ml-2 text-white">{cards.length}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">Perfect Moves:</span>
                                <span class="ml-2 text-white">{cards.length / 2}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">Your Moves:</span>
                                <span class="ml-2 text-white">{moves}</span>
                            </div>
                            <div>
                                <span class="text-gray-400">Efficiency:</span>
                                <span class="ml-2 text-white">{getEfficiency()}%</span>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="w-full max-w-4xl">
                <!-- Game Controls -->
                <div class="flex justify-center mb-4 gap-2">
                    <button 
                        on:click={pauseGame}
                        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                    >
                        <i class="fas {gamePaused ? 'fa-play' : 'fa-pause'} mr-1"></i>
                        {gamePaused ? 'Resume' : 'Pause'}
                    </button>
                    <button 
                        on:click={resetGame}
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                    >
                        <i class="fas fa-stop mr-1"></i>
                        Reset
                    </button>
                </div>
                
                <!-- Progress Bar -->
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{getCompletionRate()}%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div 
                            class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style="width: {getCompletionRate()}%"
                        ></div>
                    </div>
                </div>
                
                <!-- Cards Grid -->
                <div 
                    class="grid gap-2 bg-gray-800 p-4 rounded-lg mx-auto"
                    style="grid-template-columns: repeat({getGridSize()}, 1fr); max-width: {getGridSize() * 80}px;"
                >
                    {#each cards as card, index}
                        {@const isFlipped = isCardFlipped(card.id)}
                        {@const isMatched = isCardMatched(card.id)}
                        <button
                            class="aspect-square flex items-center justify-center rounded-lg transition-all duration-300 transform hover:scale-105 {isMatched ? 'bg-green-500 shadow-lg shadow-green-500/50 scale-105' : isFlipped ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-105' : 'bg-gray-600 hover:bg-gray-500'} {isProcessing ? 'pointer-events-none' : ''}"
                            on:click={() => flipCard(card.id)}
                            disabled={isMatched || isProcessing}
                        >
                            {#if isFlipped || isMatched}
                                <i class="text-white text-lg sm:text-xl {card.icon}"></i>
                            {:else}
                                <i class="fas fa-question text-gray-400 text-lg sm:text-xl"></i>
                            {/if}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
    
    <!-- Game Info -->
    {#if gameStarted && !gameWon}
        <div class="mt-4 text-center text-sm text-gray-400">
            <div class="mb-2">
                <strong>Difficulty:</strong> <span class="{difficulties[difficulty].color} font-semibold">{difficulties[difficulty].name.toUpperCase()}</span>
                <span class="mx-2">•</span>
                <strong>Grid:</strong> {getGridSize()}x{getGridSize()}
                <span class="mx-2">•</span>
                <strong>Cards:</strong> {cards.length}
            </div>
            <div>
                Click cards to flip them and find matching pairs! Complete faster for higher scores.
            </div>
        </div>
    {/if}
</div>