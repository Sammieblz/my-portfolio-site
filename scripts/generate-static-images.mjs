import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const workspace = resolve(import.meta.dirname, '..');
const iconSvg = await readFile(resolve(workspace, 'static/icons/portfolio-icon.svg'), 'utf8');
const socialSvg = await readFile(resolve(workspace, 'static/social-card.svg'), 'utf8');
const profilePng = await readFile(resolve(workspace, 'static/images/sam-svelte-bg.png'));
const browser = await chromium.launch({ headless: true });

async function renderSvg(svg, width, height, outputPath) {
	const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
	await page.setContent(
		`<!doctype html><style>html,body,svg{width:100%;height:100%;margin:0;display:block}</style>${svg}`
	);
	await page.screenshot({
		path: resolve(workspace, outputPath),
		type: 'png',
		animations: 'disabled'
	});
	await page.close();
}

await renderSvg(iconSvg, 192, 192, 'static/icons/icon-192.png');
await renderSvg(iconSvg, 512, 512, 'static/icons/icon-512.png');
await renderSvg(iconSvg, 512, 512, 'static/icons/icon-maskable-512.png');
await renderSvg(iconSvg, 180, 180, 'static/icons/apple-touch-icon.png');
await renderSvg(socialSvg, 1200, 630, 'static/social-card.png');

const conversionPage = await browser.newPage();
const profileWebp = await conversionPage.evaluate(async (base64Source) => {
	const image = new Image();
	image.src = `data:image/png;base64,${base64Source}`;
	await image.decode();
	const canvas = document.createElement('canvas');
	canvas.width = image.naturalWidth;
	canvas.height = image.naturalHeight;
	canvas.getContext('2d').drawImage(image, 0, 0);
	return canvas.toDataURL('image/webp', 0.82).split(',')[1];
}, profilePng.toString('base64'));
await writeFile(
	resolve(workspace, 'static/images/sam-svelte-bg.webp'),
	Buffer.from(profileWebp, 'base64')
);
await conversionPage.close();
await browser.close();
