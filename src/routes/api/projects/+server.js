import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { createFallbackProjects, selectGitHubProjects } from '$lib/projects';
import { profile } from '$lib/profile';

const CACHE_TTL_MS = 15 * 60_000;
let cache = null;

export function _clearProjectsCache() {
	cache = null;
}

function projectResponse(payload, cacheStatus) {
	return json(
		{ ...payload, cache: cacheStatus },
		{
			headers: {
				'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600',
				'X-Content-Type-Options': 'nosniff'
			}
		}
	);
}

export async function GET({ fetch }) {
	if (cache && Date.now() - cache.storedAt < CACHE_TTL_MS) {
		return projectResponse(cache.payload, 'hit');
	}

	try {
		const headers = {
			accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'Samuel-Ndubuisi-Portfolio'
		};
		if (env.GITHUB_TOKEN?.trim()) {
			headers.authorization = `Bearer ${env.GITHUB_TOKEN.trim()}`;
		}

		const response = await fetch(
			`https://api.github.com/users/${encodeURIComponent(profile.githubUsername)}/repos?sort=updated&per_page=40`,
			{ headers, signal: AbortSignal.timeout(7_000) }
		);
		if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

		const repositories = await response.json();
		const projects = selectGitHubProjects(repositories);
		if (projects.length === 0) throw new Error('GitHub returned no displayable repositories');

		const payload = {
			projects,
			source: 'github',
			stale: false,
			fetchedAt: new Date().toISOString()
		};
		cache = { payload, storedAt: Date.now() };
		return projectResponse(payload, 'miss');
	} catch {
		if (cache) {
			return projectResponse({ ...cache.payload, stale: true }, 'stale');
		}

		return projectResponse(
			{
				projects: createFallbackProjects(),
				source: 'fallback',
				stale: true,
				fetchedAt: new Date().toISOString()
			},
			'fallback'
		);
	}
}
