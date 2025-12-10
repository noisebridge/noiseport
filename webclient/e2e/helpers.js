const path = require('path');

const TEST_CREDENTIALS = {
	username: 'testy.mctestface',
	password: 'WRzN^G0^VI1pT2e^$EBc'
};

const TEST_PAGES = [
	{ name: 'home', path: '/' },
	{ name: 'account', path: '/account' },
	{ name: 'transactions', path: '/transactions' },
	{ name: 'paymaster', path: '/paymaster' },
	{ name: 'training', path: '/training' },
	{ name: 'cards', path: '/cards' },
	{ name: 'members', path: '/members' },
	{ name: 'classes', path: '/classes' },
	{ name: 'storage', path: '/storage' },
	{ name: 'utils', path: '/utils' },
	{ name: 'charts', path: '/charts' },
	{ name: 'admin', path: '/admin' },
	{ name: 'admintrans', path: '/admintrans' }
];

const SCREENSHOT_DIRS = {
	baseline: path.join(__dirname, '__screenshots__', 'baseline'),
	current: path.join(__dirname, '__screenshots__', 'current'),
	diff: path.join(__dirname, '__screenshots__', 'diff')
};

async function login(page, baseUrl) {
	console.log('Navigating to login page...');
	await page.goto(baseUrl, { waitUntil: 'networkidle2' });

	console.log('Filling in login credentials...');
	await page.waitForSelector('input[name="username"]', { timeout: 10000 });
	await page.type('input[name="username"]', TEST_CREDENTIALS.username);
	await page.type('input[name="password"]', TEST_CREDENTIALS.password);

	console.log('Submitting login form...');
	const loginButton = await page.$x("//button[contains(text(), 'Log In')]");
	if (loginButton.length > 0) {
		await Promise.all([
			loginButton[0].click(),
			page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {
				console.log('Navigation timeout - may already be on next page');
			})
		]);
	} else {
		throw new Error('Login button not found');
	}

	// wait for login
	await page.waitForTimeout(2000);
	console.log('Login completed successfully');
}

async function capturePageScreenshot(page, baseUrl, pageInfo, outputPath) {
	console.log(`Navigating to ${pageInfo.name} page: ${pageInfo.path}`);

	await page.goto(`${baseUrl}${pageInfo.path}`, {
		waitUntil: 'networkidle2',
		timeout: 30000
	});

	// wait for render
	await page.waitForTimeout(2000);

	await page.screenshot({
		path: outputPath,
		fullPage: true
	});

	console.log(`Screenshot saved: ${outputPath}`);
}

module.exports = {
	TEST_CREDENTIALS,
	TEST_PAGES,
	SCREENSHOT_DIRS,
	login,
	capturePageScreenshot
};
