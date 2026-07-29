import { profile } from '../src/lib/profile.js';

const maintainedLinks = new Set([
	profile.links.portfolio,
	profile.links.github,
	...profile.caseStudies.flatMap((study) => Object.values(study.links).filter(Boolean))
]);

async function checkLink(url) {
	const response = await fetch(url, {
		method: 'GET',
		redirect: 'follow',
		headers: {
			accept: 'text/html,application/xhtml+xml',
			'user-agent': 'Samuel-Portfolio-Link-Check/1.0'
		},
		signal: AbortSignal.timeout(15_000)
	});
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	return response.url;
}

const results = await Promise.allSettled(
	[...maintainedLinks].map(async (url) => ({ url, resolvedUrl: await checkLink(url) }))
);
const failures = [];

results.forEach((result, index) => {
	const url = [...maintainedLinks][index];
	if (result.status === 'fulfilled') {
		console.log(`OK ${url} -> ${result.value.resolvedUrl}`);
	} else {
		failures.push(`${url}: ${result.reason?.message ?? 'request failed'}`);
	}
});

if (failures.length > 0) {
	throw new Error(`Maintained link check failed:\n${failures.join('\n')}`);
}
