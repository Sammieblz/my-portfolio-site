import { describe, expect, it } from 'vitest';
import { buildPortfolioUrl, getPortfolioRouteState } from '$lib/routeState';

describe('portfolio route state', () => {
	it('maps dedicated routes to applications', () => {
		expect(getPortfolioRouteState('https://example.com/projects')).toEqual({
			appId: 'projects',
			data: {}
		});
		expect(getPortfolioRouteState('https://example.com/resume').appId).toBe('resume');
	});

	it('supports safe app and case-study query state', () => {
		expect(getPortfolioRouteState('https://example.com/?app=weather').appId).toBe('weather');
		expect(getPortfolioRouteState('https://example.com/projects?project=clutch-dna')).toEqual({
			appId: 'projects',
			data: { project: 'clutch-dna' }
		});
		expect(getPortfolioRouteState('https://example.com/?app=missing').appId).toBe('home');
	});

	it('builds stable shareable URLs and rejects unsafe slugs', () => {
		expect(buildPortfolioUrl('about')).toBe('/about');
		expect(buildPortfolioUrl('terminal')).toBe('/?app=terminal');
		expect(buildPortfolioUrl('projects', { project: 'interviewai' })).toBe(
			'/projects?project=interviewai'
		);
		expect(buildPortfolioUrl('projects', { project: '../bad' })).toBe('/projects');
	});
});
