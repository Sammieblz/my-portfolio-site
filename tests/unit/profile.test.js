import { describe, expect, it } from 'vitest';
import { profile, validateProfileContent } from '$lib/profile';

describe('profile content', () => {
	it('is complete, internally valid, and free of em dashes', () => {
		expect(validateProfileContent()).toBe(true);
		expect(profile.caseStudies.length).toBeGreaterThanOrEqual(3);
		expect(JSON.stringify(profile)).not.toContain(String.fromCodePoint(0x2014));
	});

	it('rejects duplicate case-study slugs', () => {
		const invalid = {
			...profile,
			caseStudies: [profile.caseStudies[0], profile.caseStudies[0]]
		};
		expect(() => validateProfileContent(invalid)).toThrow(/unique/);
	});
});
