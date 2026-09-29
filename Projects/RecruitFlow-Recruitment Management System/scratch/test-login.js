const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.toString()));
    page.on('error', err => console.log('BROWSER CRASH ERROR:', err.toString()));

    console.log('Navigating to login...');
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle0' });

    console.log('Filling form...');
    // We'll use the user we just registered
    await page.type('input[type="email"]', 'testcandidate@example.com');
    await page.type('input[type="password"]', 'password123');

    console.log('Clicking login...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(e => console.log('Navigation timeout', e.message))
    ]);

    // Wait a bit just in case React is processing
    await new Promise(r => setTimeout(r, 2000));

    console.log('Current URL after login:', page.url());
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body Text Snippet after login:', bodyText.substring(0, 500));

  } catch (err) {
    console.error('SCRIPT ERROR:', err);
  } finally {
    if (browser) await browser.close();
  }
})();
