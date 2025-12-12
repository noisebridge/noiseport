const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { TEST_PAGES, SCREENSHOT_DIRS, login, capturePageScreenshot } = require('../helpers');

describe('Visual Regression Tests - Baseline Capture', () => {
	let browser;
	let page;
	const baseUrl = 'http://localhost:3000';
	const screenshotDir = SCREENSHOT_DIRS.baseline;

	beforeAll(async () => {
		if (!fs.existsSync(screenshotDir)) {
			fs.mkdirSync(screenshotDir, { recursive: true });
		}

		browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});

		page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 1080 });

		await login(page, baseUrl);
	}, 120000);

	afterAll(async () => {
		if (browser) {
			await browser.close();
		}
	});

	TEST_PAGES.forEach((pageInfo) => {
		test(`Capture baseline screenshot for ${pageInfo.name}`, async () => {
			const screenshotPath = path.join(screenshotDir, `${pageInfo.name}.png`);
			await capturePageScreenshot(page, baseUrl, pageInfo, screenshotPath);

			expect(fs.existsSync(screenshotPath)).toBe(true);
		}, 120000);
	});
});
