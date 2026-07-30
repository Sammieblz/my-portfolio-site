import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const browserErrors = new WeakMap();
const portfolioHeadingName = 'Samuel Ndubuisi | Full Stack Developer';
const applicationNames = [
	['File Manager', 'Files'],
	['GitHub Projects', 'Projects'],
	['Resume.pdf', 'Resume'],
	['About Samuel', 'About'],
	['Contact', 'Contact'],
	['Weather', 'Weather'],
	['Clock', 'Clock'],
	['Memory Game', 'Memory']
];

function isMobile(testInfo) {
	return testInfo.project.name.includes('mobile');
}

async function expectNoSignificantAccessibilityViolations(page) {
	const results = await new AxeBuilder({ page }).analyze();
	const significantViolations = results.violations.filter((violation) =>
		['critical', 'serious', 'moderate'].includes(violation.impact)
	);
	expect(significantViolations).toEqual([]);
}

async function openApplication(page, testInfo, desktopName, mobileName) {
	const mobile = isMobile(testInfo);
	const launcher = mobile
		? page
				.getByRole('navigation', { name: 'Applications' })
				.getByRole('button', { name: mobileName, exact: true })
		: page.getByRole('button', { name: `Open ${desktopName}`, exact: true });
	await launcher.click();

	if (mobile) {
		await expect(page.getByRole('button', { name: `Close ${desktopName}` })).toBeVisible();
	} else {
		await expect(page.getByRole('dialog', { name: desktopName })).toBeVisible();
	}
}

async function closeApplication(page, testInfo, desktopName) {
	if (isMobile(testInfo)) {
		await page.getByRole('button', { name: `Close ${desktopName}` }).click();
	} else {
		await page
			.getByRole('dialog', { name: desktopName })
			.getByRole('button', { name: `Close ${desktopName}` })
			.click();
	}
}

test.beforeEach(async ({ page }) => {
	const errors = [];
	browserErrors.set(page, errors);
	page.on('pageerror', (error) => errors.push(`Page error: ${error.message}`));
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(`Console error: ${message.text()}`);
	});
});

test.afterEach(async ({ page }) => {
	expect(browserErrors.get(page) ?? []).toEqual([]);
});

test('loads a recruiter-first home and opens the terminal', async ({ page }, testInfo) => {
	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: portfolioHeadingName, exact: true })
	).toBeAttached();
	await expect(page.getByText('Greater Cleveland, Ohio').first()).toBeVisible();
	await expect(page.getByText('Available for opportunities').first()).toBeVisible();
	if (!isMobile(testInfo)) {
		await expect(page.getByText('Selected work')).toBeVisible();
	}

	if (isMobile(testInfo)) {
		await page.getByRole('button', { name: 'Terminal', exact: true }).click();
	} else {
		await expect(page.getByRole('dialog', { name: 'Samuel Ndubuisi' })).toBeVisible();
		await page.getByRole('button', { name: 'Open Terminal' }).click();
	}

	await expect(page.getByLabel('Portfolio terminal')).toBeVisible();
	await expect(page).toHaveURL(/\/\?app=terminal$/);
});

test('supports desktop window controls and keyboard resizing', async ({ page }, testInfo) => {
	test.skip(isMobile(testInfo));
	await page.goto('/');
	await page.getByRole('button', { name: 'Open Terminal' }).click();
	const terminalWindow = page.getByRole('dialog', { name: 'Terminal' });
	await expect(terminalWindow).toBeVisible();

	const resizeHandle = terminalWindow.getByRole('button', { name: /Resize Terminal/ });
	const originalBounds = await terminalWindow.boundingBox();
	await resizeHandle.focus();
	await resizeHandle.press('ArrowRight');
	await expect
		.poll(async () => (await terminalWindow.boundingBox())?.width)
		.toBeGreaterThan(originalBounds?.width ?? 0);

	await terminalWindow.getByRole('button', { name: 'Maximize Terminal' }).click();
	await expect(terminalWindow.getByRole('button', { name: 'Restore Terminal' })).toBeVisible();
	await terminalWindow.getByRole('button', { name: 'Minimize Terminal' }).click();
	await expect(terminalWindow).toBeHidden();

	const taskbarButton = page.getByRole('button', { name: 'Terminal', exact: true });
	await expect(taskbarButton).toBeFocused();
	await taskbarButton.click();
	await expect(terminalWindow).toBeVisible();
	await terminalWindow.getByRole('button', { name: 'Close Terminal' }).click();
	await expect(page.getByRole('button', { name: 'Open Terminal' })).toBeFocused();

	const fileLauncher = page.getByRole('button', { name: 'Open File Manager' });
	await fileLauncher.click();
	const fileWindow = page.getByRole('dialog', { name: 'File Manager' });
	await fileWindow.getByRole('button', { name: 'Close File Manager' }).click();
	await expect(fileLauncher).toBeFocused();
});

test('keeps application state while switching and minimizing', async ({ page }, testInfo) => {
	await page.goto('/');
	if (isMobile(testInfo)) {
		await page.getByRole('button', { name: 'Terminal', exact: true }).click();
	} else {
		await page.getByRole('button', { name: 'Open Terminal' }).click();
	}

	const input = page.getByLabel('Terminal command');
	await input.fill('echo state-preserved');
	await input.press('Enter');
	await expect(page.getByRole('log')).toContainText('state-preserved');

	if (isMobile(testInfo)) {
		await page.getByRole('button', { name: 'Back to applications' }).click();
		await page.getByRole('button', { name: 'Recent applications' }).click();
		await expect(page.getByRole('heading', { name: 'Recent applications' })).toBeVisible();
		await page
			.getByRole('region', { name: 'Recent applications' })
			.getByRole('button', { name: 'Terminal', exact: true })
			.click();
	} else {
		const terminalWindow = page.getByRole('dialog', { name: 'Terminal' });
		await terminalWindow.getByRole('button', { name: 'Minimize Terminal' }).click();
		await page.getByRole('button', { name: 'Terminal', exact: true }).click();
	}

	await expect(page.getByRole('log')).toContainText('state-preserved');
});

test('terminal commands use the shared filesystem', async ({ page }, testInfo) => {
	await page.goto('/');
	if (isMobile(testInfo)) {
		await page.getByRole('button', { name: 'Terminal', exact: true }).click();
	} else {
		await page.getByRole('button', { name: 'Open Terminal' }).click();
	}

	const input = page.getByLabel('Terminal command');
	await input.fill('cat Documents/contact.txt');
	await input.press('Enter');
	await expect(page.getByRole('log')).toContainText('GitHub:');
});

test('opens every portfolio application without a runtime failure', async ({ page }, testInfo) => {
	test.setTimeout(90_000);
	await page.goto('/');

	for (const [desktopName, mobileName] of applicationNames) {
		await openApplication(page, testInfo, desktopName, mobileName);
		await expectNoSignificantAccessibilityViolations(page);
		await closeApplication(page, testInfo, desktopName);
	}
});

test('returns validated API and accessible error responses', async ({ page }) => {
	const privateLocation = await page.request.get('/api/weather?lat=41.5&lon=-81.7');
	expect(privateLocation.status()).toBe(400);
	expect(await privateLocation.json()).toMatchObject({
		error: { code: 'LOCATION_REQUIRES_POST' }
	});

	const invalidLocation = await page.request.post('/api/weather', {
		data: { latitude: 999, longitude: 0 }
	});
	expect(invalidLocation.status()).toBe(400);

	const health = await page.request.get('/api/health');
	expect(health.status()).toBe(200);
	expect(await health.json()).toMatchObject({ status: 'ok', service: 'samuel-portfolio' });

	await page.goto('/definitely-not-a-route');
	await expect(page.getByRole('heading', { name: 'That page does not exist' })).toBeVisible();
	browserErrors.get(page).length = 0;
	await expectNoSignificantAccessibilityViolations(page);
});

test('has no significant automatically detectable accessibility violations', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: portfolioHeadingName, exact: true })
	).toBeAttached();
	await expectNoSignificantAccessibilityViolations(page);
});

test('serves metadata, security headers, PWA assets, and the stable resume', async ({
	page
}, testInfo) => {
	test.skip(isMobile(testInfo));
	const response = await page.goto('/');
	expect(response?.headers()['content-security-policy']).toContain("default-src 'self'");
	expect(response?.headers()['x-frame-options']).toBe('DENY');
	expect(response?.headers()['x-content-type-options']).toBe('nosniff');
	expect(response?.headers()['permissions-policy']).toContain('geolocation=(self)');

	const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
	expect(JSON.parse(jsonLd ?? '{}')).toMatchObject({
		'@type': 'Person',
		name: 'Samuel Ndubuisi',
		address: {
			addressLocality: 'Cleveland',
			addressRegion: 'OH'
		}
	});
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://sndubuisi.vercel.app/'
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'https://sndubuisi.vercel.app/social-card.png'
	);

	for (const asset of [
		'/site.webmanifest',
		'/robots.txt',
		'/sitemap.xml',
		'/sam-logo.png',
		'/images/sam-svelte-bg.webp',
		'/icons/icon-192.png',
		'/icons/icon-maskable-512.png',
		'/social-card.png',
		'/document/Samuel_Ndubuisi_Resume.pdf'
	]) {
		expect((await page.request.get(asset)).status(), `${asset} should be available`).toBe(200);
	}
	const resumeResponse = await page.request.get('/document/Samuel_Ndubuisi_Resume.pdf');
	expect(resumeResponse.headers()['content-type']).toContain('application/pdf');
	expect(resumeResponse.headers()['x-frame-options']).toBeUndefined();

	const manifest = await (await page.request.get('/site.webmanifest')).json();
	expect(manifest.icons).toEqual(
		expect.arrayContaining([
			expect.objectContaining({ src: '/icons/icon-192.png', sizes: '192x192' }),
			expect.objectContaining({ purpose: 'maskable' })
		])
	);
	const sitemap = await (await page.request.get('/sitemap.xml')).text();
	for (const route of ['/about', '/projects', '/resume', '/contact']) {
		expect(sitemap).toContain(`https://sndubuisi.vercel.app${route}`);
	}
});

test('shows OS pop-ups while preserving notification history', async ({ page }, testInfo) => {
	await page.goto('/resume');
	const downloadButton = page.getByRole('button', { name: 'Download', exact: true });
	const downloadPromise = page.waitForEvent('download');
	await downloadButton.click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toBe('Samuel_Ndubuisi_Resume.pdf');

	const popups = page.getByRole('region', { name: 'Notification pop-ups' });
	await expect(popups).toContainText('Resume download started');
	const popupBounds = await popups.locator('.notification-popup').boundingBox();
	const viewport = page.viewportSize();
	expect(popupBounds?.y).toBeGreaterThanOrEqual(0);
	expect((popupBounds?.y ?? 0) + (popupBounds?.height ?? 0)).toBeLessThanOrEqual(
		viewport?.height ?? Number.POSITIVE_INFINITY
	);

	const notificationButton = page.getByRole('button', { name: /Notifications/ }).first();
	await expect(notificationButton).toHaveAttribute('aria-label', /unread/);
	await notificationButton.click();

	const notificationCenter = page.getByRole('dialog', { name: 'Notifications' });
	await expect(notificationCenter).toContainText('Portfolio ready');
	await expect(notificationCenter).toContainText('Resume download started');
	await expectNoSignificantAccessibilityViolations(page);
	await notificationCenter.getByRole('button', { name: 'Clear all' }).click();
	await expect(notificationCenter).toContainText('No notifications');
	await notificationCenter.getByRole('button', { name: 'Close notifications' }).click();
	await expect(notificationButton).toBeFocused();

	if (isMobile(testInfo)) {
		const navigationBounds = await page
			.getByRole('navigation', { name: 'Mobile navigation' })
			.boundingBox();
		expect((popupBounds?.y ?? 0) + (popupBounds?.height ?? 0)).toBeLessThan(
			navigationBounds?.y ?? Number.POSITIVE_INFINITY
		);
	}
});

test('supports case-study deep links and browser history', async ({ page }) => {
	await page.goto('/projects?project=aitt');
	const projectDialog = page.locator('[role="dialog"][aria-modal="true"]');
	await expect(projectDialog).toBeVisible();
	await expect(projectDialog.getByRole('heading', { name: 'AITT' })).toBeVisible();
	await expect(projectDialog).toContainText("Samuel's role");
	await expect(projectDialog.getByRole('button', { name: 'Close project details' })).toBeFocused();
	await expectNoSignificantAccessibilityViolations(page);

	await page.keyboard.press('Escape');
	await expect(projectDialog).toBeHidden();
	await expect(page).toHaveURL(/\/projects$/);
	await page.goBack();
	await expect(page).toHaveURL(/\/projects\?project=aitt$/);
	await expect(projectDialog).toBeVisible();
});

test('submits contact messages through the same-origin endpoint', async ({ page }) => {
	await page.route('**/api/contact', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ ok: true })
		});
	});
	await page.goto('/contact');

	await page.getByLabel('Name *').fill('Portfolio Test');
	await page.getByLabel('Email *').fill('portfolio@example.com');
	await page.getByLabel('Message *').fill('Production readiness review.');
	await page.getByRole('button', { name: 'Send message' }).click();

	await expect(
		page.getByRole('region', { name: 'Contact Samuel' }).getByText(/^Message sent/)
	).toBeVisible();
	await expect(page.getByLabel('Name *')).toHaveValue('');
	await expect(page.getByLabel('Message *')).toHaveValue('');
});

test('preserves contact input when delivery fails', async ({ page }, testInfo) => {
	test.skip(isMobile(testInfo));
	await page.route('**/api/contact', async (route) => {
		await route.fulfill({
			status: 503,
			contentType: 'application/json',
			body: JSON.stringify({ error: { code: 'CONTACT_UNAVAILABLE' } })
		});
	});
	await page.goto('/contact');

	await page.getByLabel('Name *').fill('Portfolio Test');
	await page.getByLabel('Email *').fill('portfolio@example.com');
	await page.getByLabel('Message *').fill('Please preserve this message.');
	await page.getByRole('button', { name: 'Send message' }).click();

	await expect(
		page.getByRole('region', { name: 'Contact Samuel' }).getByRole('alert')
	).toContainText('could not be sent');
	await expect(page.getByLabel('Message *')).toHaveValue('Please preserve this message.');
	browserErrors.get(page).length = 0;
});

test('handles denied geolocation without losing the weather app', async ({ page }, testInfo) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'geolocation', {
			configurable: true,
			value: {
				getCurrentPosition(_success, error) {
					error({ code: 1, message: 'Permission denied' });
				}
			}
		});
	});
	await page.goto('/');
	await openApplication(page, testInfo, 'Weather', 'Weather');
	await page.getByRole('button', { name: 'Use my location' }).click();
	await expect(page.getByText(/Location weather was not available/)).toBeVisible();
	await expect(page.getByRole('region', { name: 'Weather', exact: true })).toBeVisible();
});

test('keeps mobile content inside the viewport and removes unsupported battery UI', async ({
	page
}, testInfo) => {
	test.skip(!isMobile(testInfo));
	await page.goto('/');

	const dimensions = await page.evaluate(() => ({
		scrollWidth: document.documentElement.scrollWidth,
		clientWidth: document.documentElement.clientWidth
	}));
	expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
	await expect(page.getByTitle('Battery status')).toHaveCount(0);
	await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
});

test('can navigate cached portfolio pages offline', async ({ page, context }, testInfo) => {
	test.skip(isMobile(testInfo));
	await page.goto('/');
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
	});

	try {
		await context.setOffline(true);
		await page.goto('/about');
		await expect(
			page.getByRole('heading', { name: portfolioHeadingName, exact: true })
		).toBeAttached();
		await expect(page.getByText('Experience').first()).toBeVisible();
	} finally {
		await context.setOffline(false);
	}
});

test('contains no em dash characters in public portfolio routes', async ({ request }) => {
	for (const route of ['/', '/about', '/projects', '/resume', '/contact']) {
		const response = await request.get(route);
		expect(response.ok()).toBe(true);
		expect(await response.text()).not.toContain(String.fromCodePoint(0x2014));
	}
});
