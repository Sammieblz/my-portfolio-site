/**
 * Central metadata for every portfolio application.
 *
 * Components are intentionally resolved by the shells so this module can also be
 * imported by the simulated filesystem without creating component import cycles.
 */
export const applications = [
	{
		id: 'home',
		name: 'Portfolio Home',
		mobileName: 'Home',
		title: 'Samuel Ndubuisi',
		icon: 'fas fa-house',
		color: 'kali-blue',
		category: 'application',
		desktop: true,
		startMenu: true,
		mobile: false,
		multiple: false,
		defaultSize: { width: 860, height: 620 },
		minSize: { width: 560, height: 420 }
	},
	{
		id: 'terminal',
		name: 'Terminal',
		title: 'Terminal',
		icon: 'fas fa-terminal',
		color: 'kali-green',
		category: 'application',
		desktop: true,
		startMenu: true,
		mobile: true,
		multiple: true,
		defaultSize: { width: 700, height: 430 },
		minSize: { width: 420, height: 280 }
	},
	{
		id: 'file-manager',
		name: 'File Manager',
		mobileName: 'Files',
		title: 'File Manager',
		icon: 'fas fa-folder',
		color: 'kali-blue',
		category: 'application',
		desktop: true,
		startMenu: true,
		mobile: true,
		multiple: false,
		defaultSize: { width: 820, height: 610 },
		minSize: { width: 520, height: 360 }
	},
	{
		id: 'projects',
		name: 'GitHub Projects',
		mobileName: 'Projects',
		title: 'GitHub Projects',
		icon: 'fab fa-github',
		color: 'kali-yellow',
		category: 'application',
		desktop: true,
		startMenu: true,
		mobile: true,
		multiple: false,
		defaultSize: { width: 920, height: 700 },
		minSize: { width: 560, height: 400 }
	},
	{
		id: 'resume',
		name: 'Resume.pdf',
		mobileName: 'Resume',
		title: 'Resume.pdf',
		icon: 'fas fa-file-pdf',
		color: 'kali-red',
		category: 'application',
		desktop: true,
		startMenu: true,
		mobile: true,
		multiple: false,
		defaultSize: { width: 820, height: 650 },
		minSize: { width: 520, height: 400 }
	},
	{
		id: 'about',
		name: 'About Samuel',
		mobileName: 'About',
		title: 'About Samuel',
		icon: 'fas fa-user',
		color: 'text-pink-400',
		category: 'application',
		desktop: true,
		startMenu: true,
		mobile: true,
		multiple: false,
		defaultSize: { width: 760, height: 590 },
		minSize: { width: 520, height: 380 }
	},
	{
		id: 'contact',
		name: 'Contact',
		title: 'Contact Me',
		icon: 'fas fa-envelope',
		color: 'kali-blue',
		category: 'application',
		desktop: true,
		startMenu: true,
		mobile: true,
		multiple: false,
		defaultSize: { width: 650, height: 570 },
		minSize: { width: 480, height: 380 }
	},
	{
		id: 'weather',
		name: 'Weather',
		title: 'Weather',
		icon: 'fas fa-cloud-sun',
		color: 'kali-yellow',
		category: 'application',
		desktop: true,
		startMenu: true,
		mobile: true,
		multiple: false,
		defaultSize: { width: 780, height: 580 },
		minSize: { width: 500, height: 380 }
	},
	{
		id: 'clock',
		name: 'Clock',
		title: 'Clock',
		icon: 'fas fa-clock',
		color: 'kali-green',
		category: 'application',
		desktop: true,
		startMenu: true,
		mobile: true,
		multiple: false,
		defaultSize: { width: 700, height: 520 },
		minSize: { width: 460, height: 340 }
	},
	{
		id: 'memory',
		name: 'Memory Game',
		mobileName: 'Memory',
		title: 'Memory Game',
		icon: 'fas fa-brain',
		color: 'text-purple-400',
		category: 'game',
		desktop: true,
		startMenu: true,
		mobile: true,
		multiple: false,
		defaultSize: { width: 780, height: 680 },
		minSize: { width: 520, height: 450 }
	}
];

/** @type {Map<string, (typeof applications)[number]>} */
const applicationMap = new Map(applications.map((app) => [app.id, app]));

/** @param {string} id */
export function getApplication(id) {
	return applicationMap.get(id) ?? null;
}

/** @param {'desktop' | 'startMenu' | 'mobile'} surface */
export function getApplicationsFor(surface) {
	return applications.filter((application) => application[surface]);
}

export function validateApplicationRegistry() {
	const ids = applications.map((application) => application.id);
	const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

	if (duplicateIds.length > 0) {
		throw new Error(`Duplicate application IDs: ${[...new Set(duplicateIds)].join(', ')}`);
	}

	for (const application of applications) {
		if (!application.name || !application.title || !application.icon) {
			throw new Error(`Application "${application.id}" is missing required metadata`);
		}
		if (application.defaultSize.width < application.minSize.width) {
			throw new Error(`Application "${application.id}" has an invalid default width`);
		}
		if (application.defaultSize.height < application.minSize.height) {
			throw new Error(`Application "${application.id}" has an invalid default height`);
		}
	}

	return true;
}

validateApplicationRegistry();
