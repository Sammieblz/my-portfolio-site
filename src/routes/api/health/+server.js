import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export function GET() {
	return json(
		{
			status: 'ok',
			service: 'samuel-portfolio',
			version: '1.0.0',
			deployment: env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? null,
			timestamp: new Date().toISOString()
		},
		{
			headers: {
				'Cache-Control': 'no-store',
				'X-Content-Type-Options': 'nosniff'
			}
		}
	);
}
