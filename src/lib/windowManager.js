export const DESKTOP_TASKBAR_HEIGHT = 56;
export const WINDOW_MARGIN = 12;

/**
 * @typedef {{ width: number, height: number }} Viewport
 * @typedef {{ x: number, y: number, width: number, height: number }} WindowBounds
 */

/** @param {number} value @param {number} minimum @param {number} maximum */
export function clamp(value, minimum, maximum) {
	return Math.min(Math.max(value, minimum), maximum);
}

/**
 * @param {WindowBounds} bounds
 * @param {Viewport} viewport
 * @param {{ width: number, height: number }} minSize
 * @param {number} [taskbarHeight]
 * @returns {WindowBounds}
 */
export function constrainWindowBounds(
	bounds,
	viewport,
	minSize,
	taskbarHeight = DESKTOP_TASKBAR_HEIGHT
) {
	const usableHeight = Math.max(0, viewport.height - taskbarHeight);
	const width = clamp(bounds.width, Math.min(minSize.width, viewport.width), viewport.width);
	const height = clamp(bounds.height, Math.min(minSize.height, usableHeight), usableHeight);
	const x = clamp(bounds.x, 0, Math.max(0, viewport.width - width));
	const y = clamp(bounds.y, 0, Math.max(0, usableHeight - height));

	return { x, y, width, height };
}

/**
 * @param {{ width: number, height: number }} requestedSize
 * @param {Viewport} viewport
 * @param {number} index
 * @returns {WindowBounds}
 */
export function createInitialBounds(requestedSize, viewport, index) {
	const cascade = (index % 10) * 24;
	const width = Math.min(requestedSize.width, Math.max(320, viewport.width - WINDOW_MARGIN * 2));
	const availableHeight = viewport.height - DESKTOP_TASKBAR_HEIGHT;
	const height = Math.min(requestedSize.height, Math.max(240, availableHeight - WINDOW_MARGIN * 2));
	const centeredX = Math.max(WINDOW_MARGIN, (viewport.width - width) / 2);
	const centeredY = Math.max(WINDOW_MARGIN, (availableHeight - height) / 2);

	return constrainWindowBounds(
		{
			x: centeredX + cascade,
			y: centeredY + cascade,
			width,
			height
		},
		viewport,
		{ width: Math.min(320, width), height: Math.min(240, height) }
	);
}

/** @param {Viewport} viewport */
export function createMaximizedBounds(viewport) {
	return {
		x: 0,
		y: 0,
		width: viewport.width,
		height: Math.max(0, viewport.height - DESKTOP_TASKBAR_HEIGHT)
	};
}

export function createWindowId() {
	if (typeof globalThis.crypto?.randomUUID === 'function') {
		return globalThis.crypto.randomUUID();
	}

	return `window-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
