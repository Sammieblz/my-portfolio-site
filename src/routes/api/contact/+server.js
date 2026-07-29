import { env as privateEnv } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { profile } from '$lib/profile';
import { checkRateLimit } from '$lib/rateLimit';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 5_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maximumLength) {
	return typeof value === 'string' ? value.trim().slice(0, maximumLength) : '';
}

function response(payload, status = 200, headers = {}) {
	return json(payload, {
		status,
		headers: {
			'Cache-Control': 'no-store',
			'X-Content-Type-Options': 'nosniff',
			...headers
		}
	});
}

function resolveProviderEndpoint() {
	const configured = privateEnv.FORMSPREE_ENDPOINT?.trim() || profile.contact.formspreeEndpoint;
	try {
		const url = new URL(configured);
		return url.protocol === 'https:' && url.hostname === 'formspree.io' ? url : null;
	} catch {
		return null;
	}
}

async function readPayload(request) {
	const contentType = request.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) return request.json();
	if (
		contentType.includes('application/x-www-form-urlencoded') ||
		contentType.includes('multipart/form-data')
	) {
		return Object.fromEntries(await request.formData());
	}
	throw new Error('Unsupported contact content type');
}

export async function POST({ request, getClientAddress, fetch }) {
	const clientAddress =
		typeof getClientAddress === 'function' ? getClientAddress() : 'contact-test-client';
	const rate = checkRateLimit(`contact:${clientAddress}`, {
		limit: 5,
		windowMs: 10 * 60_000
	});
	if (!rate.allowed) {
		return response(
			{
				error: {
					code: 'RATE_LIMITED',
					message: 'Too many messages were submitted. Please wait before trying again.'
				}
			},
			429,
			{ 'Retry-After': String(rate.retryAfter) }
		);
	}

	let raw;
	try {
		raw = await readPayload(request);
	} catch {
		return response(
			{ error: { code: 'INVALID_REQUEST', message: 'The contact request is invalid.' } },
			400
		);
	}

	const payload = {
		name: clean(raw.name, MAX_NAME_LENGTH),
		email: clean(raw.email, MAX_EMAIL_LENGTH),
		subject: clean(raw.subject, MAX_SUBJECT_LENGTH) || 'Portfolio contact',
		message: clean(raw.message, MAX_MESSAGE_LENGTH),
		company: clean(raw.company ?? raw._gotcha, 200)
	};

	if (payload.company) return response({ ok: true });
	if (!payload.name || !EMAIL_PATTERN.test(payload.email) || !payload.message) {
		return response(
			{
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Name, a valid email address, and message are required.'
				}
			},
			400
		);
	}

	const endpoint = resolveProviderEndpoint();
	if (!endpoint) {
		return response(
			{
				error: {
					code: 'CONTACT_UNAVAILABLE',
					message: `The contact form is unavailable. Email ${profile.email} instead.`
				}
			},
			503,
			{ 'Retry-After': '60' }
		);
	}

	try {
		const upstream = await fetch(endpoint, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				name: payload.name,
				email: payload.email,
				_replyto: payload.email,
				subject: payload.subject,
				_subject: payload.subject,
				message: payload.message
			}),
			signal: AbortSignal.timeout(10_000)
		});
		if (!upstream.ok) throw new Error(`Form provider returned ${upstream.status}`);
		return response({ ok: true });
	} catch {
		return response(
			{
				error: {
					code: 'CONTACT_UNAVAILABLE',
					message: `The message could not be delivered. Email ${profile.email} instead.`
				}
			},
			503,
			{ 'Retry-After': '60' }
		);
	}
}
