import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const clientDirectory = path.resolve('.svelte-kit/output/client');
const manifestPath = path.join(clientDirectory, '.vite/manifest.json');
const limits = {
	largestJavaScript: 85 * 1024,
	totalJavaScript: 320 * 1024,
	largestStylesheet: 120 * 1024,
	largestFont: 125 * 1024
};

async function collectFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const target = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectFiles(target)));
		} else {
			files.push(target);
		}
	}
	return files;
}

function formatBytes(bytes) {
	return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
	await readFile(manifestPath, 'utf8').catch(() => {
		throw new Error('Build output is missing. Run "npm run build" before the bundle budget.');
	});

	const files = await collectFiles(clientDirectory);
	const assets = await Promise.all(
		files.map(async (file) => ({
			file,
			size: (await stat(file)).size,
			extension: path.extname(file)
		}))
	);
	const javascript = assets.filter((asset) => ['.js', '.mjs'].includes(asset.extension));
	const stylesheets = assets.filter((asset) => asset.extension === '.css');
	const fonts = assets.filter((asset) => asset.extension === '.woff2');
	const largest = (collection) =>
		collection.reduce((current, asset) => (asset.size > current.size ? asset : current), {
			size: 0,
			file: ''
		});

	const measurements = [
		{
			name: 'Largest JavaScript chunk',
			value: largest(javascript).size,
			limit: limits.largestJavaScript
		},
		{
			name: 'Total JavaScript',
			value: javascript.reduce((total, asset) => total + asset.size, 0),
			limit: limits.totalJavaScript
		},
		{
			name: 'Largest stylesheet',
			value: largest(stylesheets).size,
			limit: limits.largestStylesheet
		},
		{
			name: 'Largest font',
			value: largest(fonts).size,
			limit: limits.largestFont
		}
	];

	for (const measurement of measurements) {
		console.log(
			`${measurement.name}: ${formatBytes(measurement.value)} / ${formatBytes(measurement.limit)}`
		);
	}

	const failures = measurements.filter((measurement) => measurement.value > measurement.limit);
	if (failures.length > 0) {
		throw new Error(
			`Bundle budget exceeded: ${failures.map((failure) => failure.name).join(', ')}`
		);
	}
}

await main();
