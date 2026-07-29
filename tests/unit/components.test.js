import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HomeApp from '../../src/components/HomeApp.svelte';
import NotificationToasts from '../../src/components/NotificationToasts.svelte';
import { _resetNotifications, notify } from '../../src/lib/notifications';

afterEach(() => {
	cleanup();
	_resetNotifications();
});

describe('HomeApp', () => {
	it('presents recruiter actions and opens the requested application', async () => {
		const onOpenApp = vi.fn();
		render(HomeApp, { onOpenApp });

		expect(screen.getByRole('heading', { name: 'Samuel Ndubuisi' })).toBeInTheDocument();
		expect(screen.getByText('Greater Cleveland, Ohio')).toBeInTheDocument();

		await fireEvent.click(screen.getByRole('button', { name: 'View resume' }));
		expect(onOpenApp).toHaveBeenCalledWith('resume');

		await fireEvent.click(screen.getByRole('button', { name: 'View AITT case study' }));
		expect(onOpenApp).toHaveBeenCalledWith('projects', {
			data: { project: 'aitt' }
		});
	});
});

describe('NotificationToasts', () => {
	it('limits mobile pop-ups and dismisses the visible notification', async () => {
		notify({ title: 'First', message: 'First message', duration: 0 });
		notify({ title: 'Second', message: 'Second message', duration: 0 });

		const { container } = render(NotificationToasts, { mode: 'mobile' });
		expect(container.querySelectorAll('.notification-popup')).toHaveLength(1);
		expect(screen.getByText('Second')).toBeInTheDocument();

		await fireEvent.click(screen.getByRole('button', { name: 'Dismiss Second notification' }));
		expect(screen.queryByText('Second')).not.toBeInTheDocument();
		expect(screen.getByText('First')).toBeInTheDocument();
	});

	it('keeps history-only notifications out of the pop-up region', () => {
		notify({
			title: 'History only',
			message: 'Stored without interruption',
			duration: 0,
			popup: false
		});

		const { container } = render(NotificationToasts);
		expect(container.querySelectorAll('.notification-popup')).toHaveLength(0);
	});
});
