import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const server = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: { ...process.env, PORT: '3101', HOST: '127.0.0.1' },
  stdio: 'ignore',
});
let browser;
try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch('http://127.0.0.1:3101/')).ok) break;
    } catch {
      /* Server is starting. */
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
    args: process.env.CHROMIUM_EXECUTABLE
      ? [
          '--no-sandbox',
          '--no-zygote',
          '--single-process',
          '--use-gl=angle',
          '--use-angle=swiftshader',
          '--enable-unsafe-swiftshader',
        ]
      : [],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(6000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const go = async (path) => {
    await page.goto('http://127.0.0.1:3101' + path);
    await page.waitForTimeout(250);
    await page.evaluate(() => document.fonts.ready);
  };
  await go('/');
  const mega = page.getByRole('button', { name: 'Product categories', exact: true });
  await mega.focus();
  await page.keyboard.press('Enter');
  await page.locator('#category-mega').waitFor();
  assert.equal(await page.locator('#category-mega .category-group').count(), 8);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#category-mega').count(), 0);
  assert.equal(await mega.evaluate((e) => e === document.activeElement), true);
  await mega.click();
  const megaTarget = page
    .locator('#category-mega')
    .getByRole('link', { name: 'Headsets', exact: true });
  const href = await megaTarget.getAttribute('href');
  await megaTarget.click();
  await page.waitForURL('**/shop?category=peripherals&subcategory=headsets');
  assert.equal(await page.locator('.product-card').count(), 1);
  assert.equal(
    await page
      .locator('.store-sidebar')
      .getByRole('link', { name: 'Headsets', exact: true })
      .getAttribute('href'),
    href,
  );
  assert.equal(
    await page
      .locator('.store-sidebar')
      .getByRole('link', { name: 'Headsets', exact: true })
      .getAttribute('aria-current'),
    'page',
  );
  await page
    .locator('.store-sidebar')
    .getByRole('button', { name: 'Expand Monitors', exact: true })
    .click();
  await page
    .locator('.store-sidebar')
    .getByRole('link', { name: 'Gaming monitors', exact: true })
    .click();
  await page.waitForURL('**/shop?category=monitors&subcategory=gaming-monitors');
  assert.equal(await page.locator('.product-card').count(), 1);
  await page.getByRole('button', { name: 'Product categories', exact: true }).click();
  await page.mouse.click(5, 900);
  assert.equal(await page.locator('#category-mega').count(), 0);
  await page.getByLabel('Search products', { exact: true }).fill('Steam');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.waitForURL('**/shop?search=Steam');
  assert.equal(await page.locator('.product-card').count(), 2);
  await page.getByLabel('Product type', { exact: true }).selectOption('digital');
  await page.getByLabel('Price range', { exact: true }).selectOption('50');
  await page.getByLabel('Sort by', { exact: true }).selectOption('price-low');
  await page.waitForTimeout(200);
  assert.match(await page.locator('.product-card').first().innerText(), /Steam Account/);
  await page.reload();
  await page.waitForTimeout(200);
  assert.equal(await page.getByLabel('Product type', { exact: true }).inputValue(), 'digital');
  await go('/shop?category=peripherals&subcategory=headsets');
  await page
    .getByRole('button', { name: 'Add Pulse Wireless Headset to cart', exact: true })
    .click();
  await page.getByRole('link', { name: 'Shopping cart', exact: true }).click();
  await page.waitForURL('**/cart');
  await page.getByRole('heading', { name: 'Pulse Wireless Headset', exact: true }).waitFor();
  assert.match(await page.locator('.summary-total').innerText(), /89.00/);
  await page.reload();
  await page.getByRole('heading', { name: 'Pulse Wireless Headset', exact: true }).waitFor();
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/shop', '/cart', '/login', '/signup', '/support']) {
      await go(route);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `horizontal overflow ${width} ${route}`,
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await go('/shop');
  const trigger = page.getByRole('button', { name: 'Categories', exact: true });
  await trigger.click();
  await page.locator('dialog[open]').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  assert.equal(await trigger.evaluate((e) => e === document.activeElement), true);
  await trigger.click();
  await page.mouse.click(5, 420);
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await trigger.click();
  await page.getByRole('button', { name: 'Close categories', exact: true }).click();
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await trigger.click();
  await page
    .locator('dialog')
    .getByRole('button', { name: 'Expand Gaming gear', exact: true })
    .click();
  await page.locator('dialog').getByRole('link', { name: 'Headsets', exact: true }).click();
  await page.waitForURL('**/shop?category=peripherals&subcategory=headsets');
  assert.equal(await page.locator('.product-card').count(), 1);
  assert.equal(await page.locator('dialog[open]').count(), 0);
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  assert.equal(
    await page
      .locator('.catalog-product-content button')
      .evaluate((e) => e.getBoundingClientRect().height >= 44),
    true,
  );
  await go('/shop?search=does-not-exist');
  await page.getByRole('heading', { name: 'No products found' }).waitFor();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.waitForTimeout(200);
  assert.equal(await page.locator('.product-card').count(), 29);
  await page.evaluate(() => (document.documentElement.dir = 'rtl'));
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.equal(
    await page
      .locator('.catalog-product-price bdi')
      .first()
      .evaluate((e) => getComputedStyle(e).unicodeBidi),
    'isolate',
  );
  if (process.env.PREVIEW_DIR) {
    await mkdir(process.env.PREVIEW_DIR, { recursive: true });
    for (const [name, path, width, height] of [
      ['home-desktop', '/', 1440, 1000],
      ['shop-desktop', '/shop?category=peripherals', 1440, 1000],
      ['home-mobile', '/', 390, 844],
      ['shop-tablet', '/shop', 1024, 900],
    ]) {
      await page.setViewportSize({ width, height });
      await go(path);
      await page.screenshot({ path: `${process.env.PREVIEW_DIR}/${name}.png`, fullPage: true });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await go('/shop');
    await trigger.click();
    await page.screenshot({ path: `${process.env.PREVIEW_DIR}/categories-mobile.png` });
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await go('/shop');
    await mega.click();
    await page.screenshot({ path: `${process.env.PREVIEW_DIR}/categories-desktop.png` });
  }
  assert.deepEqual(errors, []);
  console.log(
    'PASS: shared menu routes, keyboard and focus restoration, outside click, sidebar filters, search/sort persistence, physical cart persistence, six routes at five viewport sizes, drawer dismissal/selection, 44px actions, empty state and RTL layout',
  );
} finally {
  await browser?.close();
  server.kill();
}
