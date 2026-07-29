const loaders = {
	about: () => import('../components/AboutApp.svelte'),
	clock: () => import('../components/ClockApp.svelte'),
	contact: () => import('../components/ContactApp.svelte'),
	'file-manager': () => import('../components/FileManager.svelte'),
	home: () => import('../components/HomeApp.svelte'),
	memory: () => import('../components/MemoryGame.svelte'),
	projects: () => import('../components/ProjectViewer.svelte'),
	resume: () => import('../components/ResumeViewer.svelte'),
	terminal: () => import('../components/Terminal.svelte'),
	weather: () => import('../components/WeatherApp.svelte')
};

const componentPromises = new Map();

export function loadApplicationComponent(appId) {
	const loader = loaders[appId];
	if (!loader) return Promise.resolve(null);
	if (!componentPromises.has(appId)) {
		componentPromises.set(
			appId,
			loader().then((module) => module.default)
		);
	}
	return componentPromises.get(appId);
}

export function hasApplicationComponent(appId) {
	return Boolean(loaders[appId]);
}

export function _clearApplicationComponentCache() {
	componentPromises.clear();
}
