import { get } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	MAX_NOTIFICATION_HISTORY,
	_resetNotifications,
	clearNotifications,
	dismissAllNotificationPopups,
	dismissNotification,
	markAllNotificationsRead,
	notifications,
	notify,
	removeNotification,
	unreadNotificationCount
} from '$lib/notifications';

describe('notification service', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-07-27T12:00:00Z'));
		_resetNotifications();
	});

	afterEach(() => {
		_resetNotifications();
		vi.useRealTimers();
	});

	it('keeps auto-dismissed pop-ups in unread history', () => {
		notify({ title: 'Ready', message: 'Portfolio loaded.', duration: 1_000 });
		expect(get(notifications)[0]).toMatchObject({
			title: 'Ready',
			visible: true,
			read: false
		});
		expect(get(unreadNotificationCount)).toBe(1);

		vi.advanceTimersByTime(1_000);
		expect(get(notifications)[0]).toMatchObject({ visible: false, read: false });
	});

	it('can record history without covering the interface with a pop-up', () => {
		notify({
			title: 'Portfolio ready',
			message: 'Choose an application.',
			popup: false
		});
		expect(get(notifications)[0]).toMatchObject({
			visible: false,
			read: false
		});
		expect(get(unreadNotificationCount)).toBe(1);
	});

	it('deduplicates repeated system events and restarts their pop-up', () => {
		const firstId = notify({
			title: 'Offline',
			message: 'Connection lost.',
			dedupeKey: 'network',
			duration: 100
		});
		vi.advanceTimersByTime(100);
		const secondId = notify({
			title: 'Online',
			message: 'Connection restored.',
			type: 'success',
			dedupeKey: 'network'
		});

		expect(secondId).toBe(firstId);
		expect(get(notifications)).toHaveLength(1);
		expect(get(notifications)[0]).toMatchObject({
			title: 'Online',
			type: 'success',
			visible: true
		});
	});

	it('marks, dismisses, clears, and bounds notification history', () => {
		const id = notify({ title: 'One', message: 'First', duration: 0 });
		dismissNotification(id);
		expect(get(notifications)[0]).toMatchObject({ visible: false, read: true });

		for (let index = 0; index < MAX_NOTIFICATION_HISTORY + 5; index += 1) {
			notify({ title: `Event ${index}`, message: 'Update', duration: 0 });
		}
		expect(get(notifications)).toHaveLength(MAX_NOTIFICATION_HISTORY);

		dismissAllNotificationPopups();
		expect(get(notifications).every((notification) => !notification.visible)).toBe(true);
		removeNotification(get(notifications)[0].id);
		expect(get(notifications)).toHaveLength(MAX_NOTIFICATION_HISTORY - 1);

		markAllNotificationsRead();
		expect(get(unreadNotificationCount)).toBe(0);
		clearNotifications();
		expect(get(notifications)).toEqual([]);
	});
});
