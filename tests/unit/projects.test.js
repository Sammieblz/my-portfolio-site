import { describe, expect, it } from 'vitest';
import {
	createFallbackProjects,
	normalizeGitHubRepository,
	rankProject,
	sanitizeHttpUrl,
	selectGitHubProjects
} from '$lib/projects';

function repository(overrides = {}) {
	return {
		id: 1,
		name: 'example',
		description: null,
		html_url: 'https://github.com/Sammieblz/example',
		homepage: '',
		language: null,
		stargazers_count: 2,
		forks_count: 1,
		updated_at: '2026-01-01T00:00:00Z',
		topics: ['svelte'],
		size: 100,
		clone_url: 'https://github.com/Sammieblz/example.git',
		fork: false,
		...overrides
	};
}

describe('project normalization', () => {
	it('normalizes missing GitHub fields', () => {
		expect(normalizeGitHubRepository(repository())).toMatchObject({
			id: '1',
			description: 'No description available.',
			language: 'Unknown',
			homepage: null
		});
	});

	it('filters forks and ranks featured repositories first', () => {
		const selected = selectGitHubProjects([
			repository({ id: 1, name: 'other' }),
			repository({ id: 2, name: 'AITT' }),
			repository({ id: 3, name: 'fork', fork: true })
		]);
		expect(selected.map((project) => project.name)).toEqual(['AITT', 'other']);
	});

	it('provides usable fallback projects', () => {
		expect(createFallbackProjects().length).toBeGreaterThan(2);
		expect(createFallbackProjects().every((project) => project.url.startsWith('https://'))).toBe(
			true
		);
		expect(rankProject('unknown')).toBeGreaterThan(rankProject('AITT'));
	});

	it('allows only HTTP links', () => {
		expect(sanitizeHttpUrl('https://example.com/path')).toBe('https://example.com/path');
		expect(sanitizeHttpUrl('javascript:alert(1)')).toBeNull();
		expect(sanitizeHttpUrl('not a URL')).toBeNull();
	});
});
