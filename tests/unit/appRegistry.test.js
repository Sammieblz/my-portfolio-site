import { describe, expect, it } from 'vitest';
import {
	applications,
	getApplication,
	getApplicationsFor,
	validateApplicationRegistry
} from '$lib/appRegistry';

describe('application registry', () => {
	it('contains unique, valid applications', () => {
		expect(validateApplicationRegistry()).toBe(true);
		expect(new Set(applications.map((app) => app.id)).size).toBe(applications.length);
	});

	it('resolves known and unknown applications', () => {
		expect(getApplication('terminal')?.title).toBe('Terminal');
		expect(getApplication('missing')).toBeNull();
	});

	it('filters applications by shell surface', () => {
		expect(getApplicationsFor('mobile')).not.toContainEqual(
			expect.objectContaining({ id: 'home' })
		);
		expect(getApplicationsFor('desktop').every((app) => app.desktop)).toBe(true);
	});
});
