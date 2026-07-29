import { defineConfig, devices } from '@playwright/test';

const chromiumProjects = [
	{
		name: 'desktop-chromium',
		use: { ...devices['Desktop Chrome'] }
	},
	{
		name: 'mobile-chromium',
		use: { ...devices['Pixel 7'] }
	}
];

const crossBrowserProjects = [
	{
		name: 'desktop-firefox',
		use: { ...devices['Desktop Firefox'] }
	},
	{
		name: 'mobile-webkit',
		use: { ...devices['iPhone 15'] }
	}
];

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : process.env.FULL_BROWSER_MATRIX === '1' ? 2 : undefined,
	reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		reducedMotion: 'reduce'
	},
	projects: process.env.FULL_BROWSER_MATRIX === '1' ? crossBrowserProjects : chromiumProjects,
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
