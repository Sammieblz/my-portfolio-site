import { describe, expect, it } from 'vitest';
import {
	calculateEfficiency,
	calculateMatchScore,
	createMemoryDeck,
	fisherYatesShuffle
} from '$lib/memoryGame';

describe('memory game domain', () => {
	it('uses a deterministic Fisher-Yates shuffle when given deterministic randomness', () => {
		expect(fisherYatesShuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1]);
	});

	it('creates exactly two cards for each pair', () => {
		const deck = createMemoryDeck(['a', 'b', 'c'], 3, () => 0.5);
		expect(deck).toHaveLength(6);
		for (const pairId of [0, 1, 2]) {
			expect(deck.filter((card) => card.pairId === pairId)).toHaveLength(2);
		}
	});

	it('rejects a deck larger than the icon pool', () => {
		expect(() => createMemoryDeck(['a'], 2)).toThrow(/Not enough/);
	});

	it('scores difficulty and safely calculates efficiency', () => {
		expect(calculateMatchScore({ timeElapsed: 0, moves: 1, gridSize: 4 })).toBe(169);
		expect(calculateMatchScore({ timeElapsed: 1000, moves: 100, gridSize: 8 })).toBe(200);
		expect(calculateEfficiency(16, 0)).toBe(0);
		expect(calculateEfficiency(16, 8)).toBe(100);
		expect(calculateEfficiency(16, 16)).toBe(50);
	});
});
