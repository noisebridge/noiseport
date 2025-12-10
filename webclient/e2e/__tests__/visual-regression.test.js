const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const { TEST_PAGES, SCREENSHOT_DIRS, login, capturePageScreenshot } = require('../helpers');

describe('Visual Regression Tests - Comparison', () => {
	let browser;
	let page;
	const baseUrl = 'http://localhost:3000';

	beforeAll(async () => {
		[SCREENSHOT_DIRS.current, SCREENSHOT_DIRS.diff].forEach(dir => {
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
		});

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

	function compareImages(baselinePath, currentPath, diffPath) {
		const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
		const current = PNG.sync.read(fs.readFileSync(currentPath));
		const { width, height } = baseline;
		const diff = new PNG({ width, height });

		const PixDiff = pixelmatch(
			baseline.data,
			current.data,
			diff.data,
			width,
			height,
			{ threshold: 0.1 }
		);

		fs.writeFileSync(diffPath, PNG.sync.write(diff));

		const totalPix = width * height;
		const diffPercent = (PixDiff / totalPix) * 100;

		return { numDiffPix: PixDiff, diffPercent: diffPercent };
	}

	TEST_PAGES.forEach((pageInfo) => {
		test(`Compare ${pageInfo.name} against baseline`, async () => {
			const currentPath = path.join(SCREENSHOT_DIRS.current, `${pageInfo.name}.png`);
			await capturePageScreenshot(page, baseUrl, pageInfo, currentPath);

			const baselinePath = path.join(SCREENSHOT_DIRS.baseline, `${pageInfo.name}.png`);
			const diffPath = path.join(SCREENSHOT_DIRS.diff, `${pageInfo.name}.png`);

			if (!fs.existsSync(baselinePath)) {
				throw new Error(`Baseline screenshot not found: ${baselinePath}`);
			}

			const { numDiffPix: numDiffPix, diffPercent: diffPercent } = compareImages(
				baselinePath,
				currentPath,
				diffPath
			);

			console.log(
				`${pageInfo.name}: ${numDiffPix} different pixels (${diffPercent.toFixed(2)}%)`
			);

			expect(diffPercent).toBeLessThan(5);
		}, 120000);
	});
});
