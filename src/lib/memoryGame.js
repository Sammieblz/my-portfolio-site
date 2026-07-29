export function fisherYatesShuffle(items, random = Math.random) {
	const shuffled = [...items];
	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}
	return shuffled;
}

export function createMemoryDeck(icons, pairsNeeded, random = Math.random) {
	if (pairsNeeded > icons.length) throw new Error('Not enough unique icons for the requested deck');

	const cards = icons.slice(0, pairsNeeded).flatMap((icon, pairId) => [
		{ id: `${pairId}-a`, pairId, icon },
		{ id: `${pairId}-b`, pairId, icon }
	]);
	return fisherYatesShuffle(cards, random);
}

export function calculateMatchScore({ timeElapsed, moves, gridSize }) {
	const baseScore = 100;
	const timeBonus = Math.max(0, 50 - Math.floor(timeElapsed / 10));
	const moveBonus = Math.max(0, 20 - moves);
	return Math.floor((baseScore + timeBonus + moveBonus) * (gridSize / 4));
}

export function calculateEfficiency(cardCount, moves) {
	if (moves <= 0) return 0;
	return Math.min(100, Math.round((cardCount / 2 / moves) * 100));
}
