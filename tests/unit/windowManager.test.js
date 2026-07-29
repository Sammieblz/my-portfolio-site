import { describe, expect, it } from 'vitest';
import {
	clamp,
	constrainWindowBounds,
	createInitialBounds,
	createMaximizedBounds
} from '$lib/windowManager';

describe('window geometry', () => {
	it('clamps numbers', () => {
		expect(clamp(-1, 0, 10)).toBe(0);
		expect(clamp(11, 0, 10)).toBe(10);
		expect(clamp(5, 0, 10)).toBe(5);
	});

	it('keeps windows inside the usable desktop', () => {
		expect(
			constrainWindowBounds(
				{ x: -40, y: 999, width: 2000, height: 10 },
				{ width: 1280, height: 800 },
				{ width: 400, height: 300 }
			)
		).toEqual({ x: 0, y: 444, width: 1280, height: 300 });
	});

	it('creates cascaded initial bounds and full maximized bounds', () => {
		const first = createInitialBounds({ width: 700, height: 500 }, { width: 1280, height: 800 }, 0);
		const second = createInitialBounds(
			{ width: 700, height: 500 },
			{ width: 1280, height: 800 },
			1
		);
		expect(second.x).toBeGreaterThan(first.x);
		expect(second.y).toBeGreaterThan(first.y);
		expect(createMaximizedBounds({ width: 1280, height: 800 })).toEqual({
			x: 0,
			y: 0,
			width: 1280,
			height: 744
		});
	});

	it('shrinks a window below its normal minimum when the viewport is shorter', () => {
		expect(
			constrainWindowBounds(
				{ x: 50, y: 50, width: 700, height: 500 },
				{ width: 640, height: 220 },
				{ width: 420, height: 280 }
			)
		).toEqual({ x: 0, y: 0, width: 640, height: 164 });
	});
});
