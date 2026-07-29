import { beforeEach, describe, expect, it } from 'vitest';
import { _clearRateLimits, checkRateLimit } from '$lib/rateLimit';

describe('bounded rate limiter', () => {
	beforeEach(_clearRateLimits);

	it('allows a bounded number of requests and reports retry timing', () => {
		expect(checkRateLimit('client', { limit: 2, windowMs: 1_000, now: 0 }).allowed).toBe(true);
		expect(checkRateLimit('client', { limit: 2, windowMs: 1_000, now: 1 }).allowed).toBe(true);
		const blocked = checkRateLimit('client', { limit: 2, windowMs: 1_000, now: 2 });
		expect(blocked.allowed).toBe(false);
		expect(blocked.retryAfter).toBe(1);
	});

	it('starts a new window after expiration', () => {
		checkRateLimit('client', { limit: 1, windowMs: 100, now: 0 });
		expect(checkRateLimit('client', { limit: 1, windowMs: 100, now: 100 }).allowed).toBe(true);
	});
});
