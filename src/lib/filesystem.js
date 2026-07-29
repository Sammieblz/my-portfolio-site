import { applications } from '$lib/appRegistry';
import { profile } from '$lib/profile';

export const HOME_DIRECTORY = profile.terminal.homeDir;

const appShortcuts = Object.fromEntries(
	applications.map((application) => [
		application.name,
		{
			type: 'app',
			appId: application.id,
			icon: application.icon,
			color: application.color
		}
	])
);

export const fileSystem = {
	type: 'directory',
	children: {
		home: {
			type: 'directory',
			children: {
				samuel: {
					type: 'directory',
					children: {
						Desktop: {
							type: 'directory',
							children: appShortcuts
						},
						Documents: {
							type: 'directory',
							children: {
								'resume.pdf': {
									type: 'app',
									appId: 'resume',
									icon: 'fas fa-file-pdf',
									color: 'kali-red',
									size: profile.assets.resumeSize
								},
								'projects.md': {
									type: 'file',
									icon: 'fas fa-file-alt',
									color: 'kali-blue',
									size: '2 KB',
									content: profile.featuredProjects
										.map(
											(project) => `## ${project.title}\n${project.description}\n${project.href}`
										)
										.join('\n\n')
								},
								'skills.txt': {
									type: 'file',
									icon: 'fas fa-file-lines',
									color: 'kali-green',
									size: '251 B',
									content:
										'JavaScript, TypeScript, Python, Java, C++\nReact, Svelte, Next.js\nNode.js, Supabase, AWS'
								},
								'about.txt': {
									type: 'file',
									icon: 'fas fa-file-lines',
									color: 'kali-green',
									size: '184 B',
									content: `${profile.name}\n${profile.role}\n${profile.location}\n${profile.contact.availability}`
								},
								'contact.txt': {
									type: 'file',
									icon: 'fas fa-file-lines',
									color: 'kali-yellow',
									size: '168 B',
									content: `Email: ${profile.email}\nGitHub: ${profile.links.github}\nLinkedIn: ${profile.links.linkedin}`
								}
							}
						},
						Projects: {
							type: 'directory',
							children: Object.fromEntries(
								profile.featuredProjects.map((project) => [
									project.title,
									{
										type: 'link',
										href: project.href,
										icon: 'fab fa-github',
										color: 'kali-yellow',
										size: 'Repository'
									}
								])
							)
						},
						Downloads: {
							type: 'directory',
							children: {}
						},
						Pictures: {
							type: 'directory',
							children: {
								'profile.png': {
									type: 'link',
									href: profile.assets.profileImage,
									icon: 'fas fa-image',
									color: 'kali-blue',
									size: '171 KB'
								}
							}
						}
					}
				}
			}
		}
	}
};

export function normalizePath(path) {
	const parts = [];
	for (const part of path.split('/')) {
		if (!part || part === '.') continue;
		if (part === '..') {
			parts.pop();
		} else {
			parts.push(part);
		}
	}
	return `/${parts.join('/')}`;
}

export function resolvePath(currentPath, target) {
	if (!target || target === '~') return HOME_DIRECTORY;
	if (target.startsWith('~/')) return normalizePath(`${HOME_DIRECTORY}/${target.slice(2)}`);
	if (target.startsWith('/')) return normalizePath(target);
	return normalizePath(`${currentPath}/${target}`);
}

export function getNode(path) {
	const normalized = normalizePath(path);
	if (normalized === '/') return fileSystem;

	let current = fileSystem;
	for (const part of normalized.split('/').filter(Boolean)) {
		if (current.type !== 'directory' || !current.children?.[part]) return null;
		current = current.children[part];
	}
	return current;
}

export function listDirectory(path) {
	const node = getNode(path);
	if (!node || node.type !== 'directory') return null;

	return Object.entries(node.children ?? {})
		.map(([name, entry]) => ({ name, ...entry }))
		.sort((left, right) => {
			if (left.type === 'directory' && right.type !== 'directory') return -1;
			if (left.type !== 'directory' && right.type === 'directory') return 1;
			return left.name.localeCompare(right.name);
		});
}

export function readFile(path) {
	const node = getNode(path);
	return node?.type === 'file' ? node.content : null;
}
