const buckets = new Map();
const MAX_BUCKETS = 2_000;

function pruneBuckets(now) {
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt <= now) buckets.delete(key);
	}
	if (buckets.size <= MAX_BUCKETS) return;
	for (const key of buckets.keys()) {
		buckets.delete(key);
		if (buckets.size <= MAX_BUCKETS) break;
	}
}

export function checkRateLimit(key, { limit, windowMs, now = Date.now() }) {
	pruneBuckets(now);
	const safeKey = String(key || 'unknown').slice(0, 200);
	const existing = buckets.get(safeKey);
	const bucket =
		existing && existing.resetAt > now
			? existing
			: {
					count: 0,
					resetAt: now + windowMs
				};
	bucket.count += 1;
	buckets.set(safeKey, bucket);

	return {
		allowed: bucket.count <= limit,
		remaining: Math.max(0, limit - bucket.count),
		retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
	};
}

export function _clearRateLimits() {
	buckets.clear();
}
