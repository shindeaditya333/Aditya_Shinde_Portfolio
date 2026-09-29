const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

    console.log('Navigating to register...');
    await page.goto('http://localhost:5174/register', { waitUntil: 'networkidle0' });

    console.log('Filling register form...');
    await page.type('input[name="name"]', 'Test Candidate');
    await page.type('input[name="email"]', 'testcandidate@example.com');
    await page.type('input[name="password"]', 'password123');

    console.log('Clicking register...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(e => console.log('Navigation timeout', e.message))
    ]);

    console.log('Current URL after register:', page.url());
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body Text Snippet after register:', bodyText.substring(0, 200));

    if (page.url().includes('dashboard')) {
       console.log('Successfully reached dashboard!');
    }

  } catch (err) {
    console.error('SCRIPT ERROR:', err);
  } finally {
    if (browser) await browser.close();
  }
})();
