import { describe, expect, it } from 'vitest';
import {
	HOME_DIRECTORY,
	getNode,
	listDirectory,
	normalizePath,
	readFile,
	resolvePath
} from '$lib/filesystem';

describe('simulated filesystem', () => {
	it('normalizes paths without escaping root', () => {
		expect(normalizePath('/home/samuel/../samuel/./Documents')).toBe('/home/samuel/Documents');
		expect(normalizePath('/../../')).toBe('/');
	});

	it('resolves absolute, relative, and home paths', () => {
		expect(resolvePath(HOME_DIRECTORY, 'Documents')).toBe('/home/samuel/Documents');
		expect(resolvePath('/home/samuel/Documents', '..')).toBe(HOME_DIRECTORY);
		expect(resolvePath('/', '~')).toBe(HOME_DIRECTORY);
	});

	it('lists directories with folders first', () => {
		const entries = listDirectory(HOME_DIRECTORY);
		expect(entries.length).toBeGreaterThan(0);
		expect(entries[0].type).toBe('directory');
		expect(entries.some((entry) => entry.name === 'Documents')).toBe(true);
	});

	it('reads text files and rejects directories or missing files', () => {
		expect(readFile('/home/samuel/Documents/contact.txt')).toContain('Email:');
		expect(readFile('/home/samuel/Documents')).toBeNull();
		expect(getNode('/missing')).toBeNull();
	});
});
