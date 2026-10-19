module.exports = async (browser) => {
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/en/login');
  if (page.url().includes('/dashboard/')) {
    await page.close();
    return;
  }
  await page.type('#email', 'viewer@demo.test');
  await page.type('#password', 'demo1234');
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]'),
  ]);
  if (!page.url().includes('/dashboard/items'))
    throw new Error('Lighthouse authentication failed');
  await page.close();
};
