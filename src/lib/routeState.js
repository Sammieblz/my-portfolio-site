import { browser } from '$app/environment';
import { getApplication } from '$lib/appRegistry';

export const APP_PATHS = {
	home: '/',
	about: '/about',
	projects: '/projects',
	resume: '/resume',
	contact: '/contact'
};

const PATH_APPS = new Map(Object.entries(APP_PATHS).map(([appId, path]) => [path, appId]));

function cleanProjectSlug(value) {
	return typeof value === 'string' && /^[a-z0-9-]{1,80}$/.test(value) ? value : null;
}

export function getPortfolioRouteState(input) {
	const url = input instanceof URL ? input : new URL(String(input), 'https://portfolio.local');
	const pathApp = PATH_APPS.get(url.pathname);
	const queryApp = url.pathname === '/' ? url.searchParams.get('app') : null;
	const queryAppId = queryApp && getApplication(queryApp) ? queryApp : null;
	const appId = queryAppId ?? pathApp ?? 'home';
	const data = {};
	const project = appId === 'projects' ? cleanProjectSlug(url.searchParams.get('project')) : null;
	if (project) data.project = project;

	return { appId, data };
}

export function buildPortfolioUrl(appId, data = {}) {
	const safeAppId = getApplication(appId) ? appId : 'home';
	const path = APP_PATHS[safeAppId] ?? '/';
	const params = new URLSearchParams();

	if (!APP_PATHS[safeAppId]) params.set('app', safeAppId);
	const project = safeAppId === 'projects' ? cleanProjectSlug(data.project) : null;
	if (project) params.set('project', project);

	const query = params.toString();
	return `${path}${query ? `?${query}` : ''}`;
}

export function updatePortfolioUrl(appId, data = {}, { replace = false } = {}) {
	if (!browser) return;
	const nextUrl = buildPortfolioUrl(appId, data);
	const currentUrl = `${globalThis.location.pathname}${globalThis.location.search}`;
	if (nextUrl === currentUrl) return;

	globalThis.history[replace ? 'replaceState' : 'pushState'](
		{ portfolioApp: appId, portfolioData: data },
		'',
		nextUrl
	);
}
