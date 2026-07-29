import { getNode, listDirectory, readFile, resolvePath } from '$lib/filesystem';
import { getTerminalFeaturedProjectsLines, profile } from '$lib/profile';

export const TERMINAL_HELP = [
	'Available commands:',
	'  help             Show this help message',
	'  clear            Clear the terminal',
	'  whoami           Display the portfolio owner',
	'  pwd              Print the current directory',
	'  ls [directory]   List files and directories',
	'  cd [directory]   Change directory',
	'  cat <file>       Display a text file',
	'  projects         Show featured projects',
	'  about            Show a short biography',
	'  contact          Show contact information',
	'  resume           Open the résumé viewer',
	'  date             Show the current date and time',
	'  uptime           Show this terminal session uptime',
	'  neofetch         Show portfolio system information',
	'  history          Show command history',
	'  exit             Close this terminal'
];

export function parseCommand(input) {
	const tokens = [];
	const matcher = /"([^"]*)"|'([^']*)'|([^\s]+)/g;
	let match;
	while ((match = matcher.exec(input.trim()))) {
		tokens.push(match[1] ?? match[2] ?? match[3]);
	}
	return { command: (tokens.shift() ?? '').toLowerCase(), args: tokens };
}

function formatUptime(startedAt, now) {
	const totalSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * @param {string} input
 * @param {{ cwd: string, history: string[], startedAt: number, now?: Date }} context
 */
export function executeTerminalCommand(input, context) {
	const { command, args } = parseCommand(input);
	const now = context.now ?? new Date();
	const result = { cwd: context.cwd, lines: [], action: null };

	if (!command) return result;

	switch (command) {
		case 'help':
			result.lines = TERMINAL_HELP;
			break;
		case 'clear':
			result.action = { type: 'clear' };
			break;
		case 'exit':
			result.action = { type: 'close' };
			break;
		case 'whoami':
			result.lines = [profile.name];
			break;
		case 'pwd':
			result.lines = [context.cwd];
			break;
		case 'cd': {
			const target = resolvePath(context.cwd, args[0] ?? '~');
			const node = getNode(target);
			if (!node) {
				result.lines = [`cd: ${args[0]}: No such file or directory`];
			} else if (node.type !== 'directory') {
				result.lines = [`cd: ${args[0]}: Not a directory`];
			} else {
				result.cwd = target;
			}
			break;
		}
		case 'ls': {
			const target = resolvePath(context.cwd, args[0] ?? '.');
			const entries = listDirectory(target);
			if (!entries) {
				result.lines = [`ls: ${args[0] ?? target}: Not a directory`];
			} else if (entries.length === 0) {
				result.lines = ['(empty directory)'];
			} else {
				result.lines = entries.map((entry) =>
					entry.type === 'directory' ? `${entry.name}/` : entry.name
				);
			}
			break;
		}
		case 'cat': {
			if (!args[0]) {
				result.lines = ['Usage: cat <file>'];
				break;
			}
			const target = resolvePath(context.cwd, args[0]);
			const content = readFile(target);
			if (content === null) {
				const node = getNode(target);
				result.lines = [
					node?.type === 'directory'
						? `cat: ${args[0]}: Is a directory`
						: `cat: ${args[0]}: No such text file`
				];
			} else {
				result.lines = content.split('\n');
			}
			break;
		}
		case 'projects':
			result.lines = getTerminalFeaturedProjectsLines();
			break;
		case 'about':
			result.lines = [
				`${profile.name} | ${profile.role}`,
				'',
				`Based in ${profile.location}, Samuel builds thoughtful web and mobile products.`,
				'He co-founded Byteflow LLC and works across modern JavaScript, Python, and cloud stacks.'
			];
			break;
		case 'contact':
			result.lines = [
				`Email: ${profile.email}`,
				`GitHub: ${profile.links.github}`,
				`LinkedIn: ${profile.links.linkedin}`,
				`Status: ${profile.contact.availability}`
			];
			break;
		case 'resume':
			result.lines = ['Opening résumé…'];
			result.action = { type: 'open-app', appId: 'resume' };
			break;
		case 'date':
			result.lines = [now.toString()];
			break;
		case 'uptime':
			result.lines = [`Session uptime: ${formatUptime(context.startedAt, now.getTime())}`];
			break;
		case 'neofetch':
			result.lines = [
				profile.terminal.userAtHost,
				'----------------------------',
				'OS: Portfolio OS 1.0',
				'Framework: SvelteKit',
				'UI: Accessible desktop + mobile shell',
				`Owner: ${profile.name}`,
				`Role: ${profile.role}`,
				`Location: ${profile.location}`
			];
			break;
		case 'history':
			result.lines =
				context.history.length > 0
					? context.history.map((entry, index) => `${index + 1}  ${entry}`)
					: ['No commands in history'];
			break;
		default:
			result.lines = [`Command not found: ${command}. Type "help" for available commands.`];
	}

	return result;
}
