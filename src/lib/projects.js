import { profile } from '$lib/profile';

export const excludedRepositoryNames = new Set([
	'weather-app',
	'IT-2320-interactive-internet-programming-projects',
	'MyWebsite',
	profile.githubUsername
]);

export function rankProject(name) {
	const index = profile.featuredRepoOrder.indexOf(name);
	return index === -1 ? profile.featuredRepoOrder.length : index;
}

export function sanitizeHttpUrl(value) {
	if (!value || typeof value !== 'string') return null;
	try {
		const url = new URL(value);
		return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
	} catch {
		return null;
	}
}

export function normalizeGitHubRepository(repository) {
	return {
		id: String(repository.id),
		name: repository.name,
		description: repository.description || 'No description available.',
		url:
			sanitizeHttpUrl(repository.html_url) ??
			`https://github.com/${profile.githubUsername}/${encodeURIComponent(repository.name)}`,
		homepage: sanitizeHttpUrl(repository.homepage),
		language: repository.language || 'Unknown',
		stars: Number(repository.stargazers_count) || 0,
		forks: Number(repository.forks_count) || 0,
		updatedAt: repository.updated_at,
		topics: Array.isArray(repository.topics) ? repository.topics.slice(0, 12) : [],
		size: Number(repository.size) || 0,
		cloneUrl: sanitizeHttpUrl(repository.clone_url) ?? ''
	};
}

export function selectGitHubProjects(repositories) {
	return repositories
		.filter(
			(repository) =>
				repository &&
				typeof repository.name === 'string' &&
				!repository.fork &&
				!excludedRepositoryNames.has(repository.name)
		)
		.map(normalizeGitHubRepository)
		.sort((left, right) => {
			const rankDifference = rankProject(left.name) - rankProject(right.name);
			if (rankDifference !== 0) return rankDifference;
			return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
		})
		.slice(0, 6);
}

export function createFallbackProjects() {
	return profile.featuredProjects
		.filter((project) => !project.private)
		.map((project, index) => ({
			id: `fallback-${project.title}`,
			name: project.title === 'Brack' ? 'brack-app' : project.title,
			description: project.description,
			url: project.href,
			homepage: project.href.startsWith('https://github.com/') ? null : project.href,
			language: project.tech.split(',')[0] || 'Unknown',
			stars: 0,
			forks: 0,
			updatedAt: null,
			topics: project.tech
				.split(',')
				.map((technology) => technology.trim().toLowerCase())
				.slice(0, 5),
			size: 0,
			cloneUrl: project.href.startsWith('https://github.com/') ? `${project.href}.git` : '',
			fallbackOrder: index
		}))
		.sort((left, right) => rankProject(left.name) - rankProject(right.name));
}
