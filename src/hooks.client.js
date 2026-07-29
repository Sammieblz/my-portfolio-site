import { dev } from '$app/environment';

export function handleError({ error, status, message }) {
	const errorId = globalThis.crypto.randomUUID();
	console.error('Unhandled client error', { errorId, status, error });

	return {
		message: dev ? message : 'An unexpected error occurred.',
		errorId
	};
}
