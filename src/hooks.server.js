import { dev } from '$app/environment';

export async function handle({ event, resolve }) {
	const response = await resolve(event);

	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-XSS-Protection', '0');

	if (event.url.protocol === 'https:') {
		response.headers.set(
			'Strict-Transport-Security',
			'max-age=63072000; includeSubDomains; preload'
		);
	}

	return response;
}

export function handleError({ error, event, status, message }) {
	if (status < 500) {
		return { message };
	}

	const errorId = globalThis.crypto.randomUUID();
	console.error('Unhandled server error', {
		errorId,
		route: event.route.id,
		status,
		error
	});

	return {
		message: dev ? message : 'An unexpected error occurred.',
		errorId
	};
}
