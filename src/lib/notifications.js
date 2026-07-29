import { derived, writable } from 'svelte/store';

export const MAX_NOTIFICATION_HISTORY = 50;
const DEFAULT_DURATION_MS = 6_000;
const allowedTypes = new Set(['info', 'success', 'warning', 'error']);
const popupTimers = new Map();
let sequence = 0;

export const notifications = writable([]);
export const unreadNotificationCount = derived(
	notifications,
	(items) => items.filter((item) => !item.read).length
);

function clearPopupTimer(id) {
	const timer = popupTimers.get(id);
	if (timer) globalThis.clearTimeout(timer);
	popupTimers.delete(id);
}

function schedulePopupDismissal(id, duration) {
	clearPopupTimer(id);
	if (duration <= 0) return;

	const timer = globalThis.setTimeout(() => {
		notifications.update((items) =>
			items.map((item) => (item.id === id ? { ...item, visible: false } : item))
		);
		popupTimers.delete(id);
	}, duration);
	popupTimers.set(id, timer);
}

function cleanText(value, fallback, maximumLength) {
	const text = typeof value === 'string' ? value.trim() : '';
	return (text || fallback).slice(0, maximumLength);
}

/**
 * Adds a notification to the shared history and displays it as a pop-up.
 * A matching dedupeKey updates the existing history item instead of adding noise.
 */
export function notify({
	title,
	message,
	type = 'info',
	source = 'System',
	duration = DEFAULT_DURATION_MS,
	dedupeKey = null,
	popup = true
}) {
	const createdAt = Date.now();
	const normalizedType = allowedTypes.has(type) ? type : 'info';
	const normalizedDuration = Number.isFinite(duration)
		? Math.max(0, duration)
		: DEFAULT_DURATION_MS;
	let notificationId;

	notifications.update((items) => {
		const existing = dedupeKey ? items.find((item) => item.dedupeKey === dedupeKey) : null;
		notificationId = existing?.id ?? `notification-${createdAt}-${sequence++}`;
		const notification = {
			id: notificationId,
			title: cleanText(title, 'Notification', 80),
			message: cleanText(message, 'An update is available.', 280),
			type: normalizedType,
			source: cleanText(source, 'System', 40),
			createdAt,
			dedupeKey,
			read: false,
			visible: Boolean(popup)
		};

		const nextItems = [notification, ...items.filter((item) => item.id !== notificationId)];
		const retained = nextItems.slice(0, MAX_NOTIFICATION_HISTORY);
		for (const removed of nextItems.slice(MAX_NOTIFICATION_HISTORY)) {
			clearPopupTimer(removed.id);
		}
		return retained;
	});

	if (popup) {
		schedulePopupDismissal(notificationId, normalizedDuration);
	} else {
		clearPopupTimer(notificationId);
	}
	return notificationId;
}

export function dismissNotification(id) {
	clearPopupTimer(id);
	notifications.update((items) =>
		items.map((item) => (item.id === id ? { ...item, visible: false, read: true } : item))
	);
}

export function dismissAllNotificationPopups() {
	for (const id of popupTimers.keys()) clearPopupTimer(id);
	notifications.update((items) => items.map((item) => ({ ...item, visible: false })));
}

export function markAllNotificationsRead() {
	notifications.update((items) => items.map((item) => ({ ...item, read: true })));
}

export function removeNotification(id) {
	clearPopupTimer(id);
	notifications.update((items) => items.filter((item) => item.id !== id));
}

export function clearNotifications() {
	for (const id of popupTimers.keys()) clearPopupTimer(id);
	notifications.set([]);
}

export function _resetNotifications() {
	clearNotifications();
	sequence = 0;
}
