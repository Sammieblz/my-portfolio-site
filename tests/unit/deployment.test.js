import { describe, expect, it } from 'vitest';
import vercelConfig from '../../vercel.json';

describe('Vercel response headers', () => {
	it('does not block same-origin PDF embedding with a global frame header', () => {
		const globalHeaders =
			vercelConfig.headers.find((entry) => entry.source === '/(.*)')?.headers ?? [];
		const documentHeaders =
			vercelConfig.headers.find((entry) => entry.source === '/document/(.*)')?.headers ?? [];

		expect(globalHeaders.map((header) => header.key.toLowerCase())).not.toContain(
			'x-frame-options'
		);
		expect(documentHeaders.map((header) => header.key.toLowerCase())).not.toContain(
			'x-frame-options'
		);
	});
});
