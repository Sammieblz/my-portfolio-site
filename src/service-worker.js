/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const worker = /** @type {ServiceWorkerGlobalScope} */ (globalThis.self);
const CACHE_NAME = `portfolio-shell-${version}`;
const APP_PAGES = ['/', '/about', '/projects', '/resume', '/contact'];
const PRECACHE = [
	...build,
	...files.filter((file) => !file.startsWith('/document/')),
	...APP_PAGES
];

worker.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE))
			.then(() => worker.skipWaiting())
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		Promise.all([
			caches
				.keys()
				.then((keys) =>
					Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
				),
			worker.clients.claim()
		])
	);
});

worker.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);
	if (request.method !== 'GET' || url.origin !== worker.location.origin) return;
	if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/document/')) return;

	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response.ok) {
						const copy = response.clone();
						void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					}
					return response;
				})
				.catch(async () => {
					return (
						(await caches.match(request)) ??
						(await caches.match(url.pathname)) ??
						(await caches.match('/')) ??
						new Response('The portfolio is unavailable offline.', {
							status: 503,
							headers: { 'Content-Type': 'text/plain; charset=utf-8' }
						})
					);
				})
		);
		return;
	}

	event.respondWith(
		caches.match(request).then((cached) => {
			if (cached) return cached;
			return fetch(request).then((response) => {
				if (response.ok) {
					const copy = response.clone();
					void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
				}
				return response;
			});
		})
	);
});
