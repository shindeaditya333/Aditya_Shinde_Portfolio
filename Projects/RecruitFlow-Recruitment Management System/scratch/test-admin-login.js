const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  let browser;
  try {
    console.log('Registering Admin via API...');
    // We can't register admin via UI, UI defaults to CANDIDATE. We have to do it via API.
    await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Admin Test',
        email: 'admin@example.com',
        password: 'password123',
        role: 'ADMIN'
    });
    
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.toString()));
    page.on('error', err => console.log('BROWSER CRASH ERROR:', err.toString()));

    console.log('Navigating to login...');
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle0' });

    console.log('Filling form...');
    await page.type('input[type="email"]', 'admin@example.com');
    await page.type('input[type="password"]', 'password123');

    console.log('Clicking login...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(e => console.log('Navigation timeout', e.message))
    ]);

    await new Promise(r => setTimeout(r, 2000));

    console.log('Current URL after login:', page.url());
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body Text Snippet after login:', bodyText.substring(0, 500));

  } catch (err) {
    console.error('SCRIPT ERROR:', err.response?.data || err.message);
  } finally {
    if (browser) await browser.close();
  }
})();
