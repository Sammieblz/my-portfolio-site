import { describe, expect, it } from 'vitest';
import { HOME_DIRECTORY } from '$lib/filesystem';
import { executeTerminalCommand, parseCommand, TERMINAL_HELP } from '$lib/terminal';

const context = {
	cwd: HOME_DIRECTORY,
	history: ['pwd', 'ls'],
	startedAt: new Date('2026-01-01T00:00:00Z').getTime(),
	now: new Date('2026-01-01T01:02:03Z')
};

describe('terminal command parser', () => {
	it('supports quoted arguments', () => {
		expect(parseCommand(`cat "a file.txt"`)).toEqual({
			command: 'cat',
			args: ['a file.txt']
		});
	});

	it.each([
		['help', TERMINAL_HELP[0]],
		['whoami', 'Samuel Ndubuisi'],
		['pwd', HOME_DIRECTORY],
		['history', '1  pwd'],
		['uptime', 'Session uptime: 1h 2m 3s'],
		['neofetch', 'samuel@kali-portfolio'],
		['unknown', 'Command not found']
	])('executes %s', (command, expected) => {
		expect(executeTerminalCommand(command, context).lines.join('\n')).toContain(expected);
	});

	it('navigates only to real directories', () => {
		expect(executeTerminalCommand('cd Documents', context).cwd).toBe('/home/samuel/Documents');
		expect(executeTerminalCommand('cd missing', context).lines[0]).toContain('No such');
		expect(executeTerminalCommand('cd Documents/contact.txt', context).lines[0]).toContain(
			'Not a directory'
		);
	});

	it('lists and reads the shared filesystem', () => {
		expect(executeTerminalCommand('ls Documents', context).lines).toContain('contact.txt');
		expect(executeTerminalCommand('cat Documents/contact.txt', context).lines.join('\n')).toContain(
			'GitHub:'
		);
		expect(executeTerminalCommand('cat Documents', context).lines[0]).toContain('directory');
		expect(executeTerminalCommand('cat missing', context).lines[0]).toContain('No such');
	});

	it('returns explicit shell actions', () => {
		expect(executeTerminalCommand('clear', context).action).toEqual({ type: 'clear' });
		expect(executeTerminalCommand('exit', context).action).toEqual({ type: 'close' });
		expect(executeTerminalCommand('resume', context).action).toEqual({
			type: 'open-app',
			appId: 'resume'
		});
	});
});
