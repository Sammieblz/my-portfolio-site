import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		environment: 'jsdom',
		include: ['tests/unit/**/*.test.js'],
		setupFiles: ['./vitest.setup.js'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			include: [
				'src/components/HomeApp.svelte',
				'src/components/NotificationToasts.svelte',
				'src/lib/appRegistry.js',
				'src/lib/filesystem.js',
				'src/lib/memoryGame.js',
				'src/lib/notifications.js',
				'src/lib/profile.js',
				'src/lib/projects.js',
				'src/lib/rateLimit.js',
				'src/lib/routeState.js',
				'src/lib/terminal.js',
				'src/lib/weather.js',
				'src/lib/windowManager.js',
				'src/routes/api/**/*.js'
			],
			thresholds: {
				lines: 70,
				functions: 70,
				branches: 65,
				statements: 70
			}
		}
	}
});
