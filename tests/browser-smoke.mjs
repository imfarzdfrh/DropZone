import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const server = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: { ...process.env, PORT: '3100', HOST: '127.0.0.1' },
  stdio: 'ignore',
});
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:3100/');
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for server startup. */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Production server did not start; run npm run build first.');
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
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/https:\/\/(images.unsplash.com|fonts.googleapis.com|fonts.gstatic.com)/, (r) =>
    r.abort(),
  );
  async function go(path) {
    await page.goto('http://127.0.0.1:3100' + path);
    await page.waitForTimeout(500);
  }
  await go('/shop');
  await page.getByRole('button', { name: 'Add Vandal / Prism Shift to cart', exact: true }).click();
  await page.getByRole('button', { name: 'Add to favorites', exact: true }).first().click();
  await page.getByRole('link', { name: 'Shopping cart', exact: true }).click();
  await page.getByRole('heading', { name: 'Vandal / Prism Shift' }).waitFor();
  assert.match(await page.locator('.summary-total').innerText(), /24.90/);
  await page.getByRole('button', { name: 'Add one Vandal / Prism Shift', exact: true }).click();
  assert.match(await page.locator('.summary-total').innerText(), /49.80/);
  await page.reload();
  await page.getByRole('heading', { name: 'Vandal / Prism Shift' }).waitFor();
  assert.match(await page.locator('.summary-total').innerText(), /49.80/);
  await page.getByRole('link', { name: 'Sign in to use wallet funds' }).click();
  await page.locator('#email').fill('farzad@example.com');
  await page.locator('#password').fill('demo-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForURL('**/account');
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: /Edit profile/ }).click();
  await page.getByLabel('Username', { exact: true }).fill('farzad_updated');
  await page.getByLabel('First name', { exact: true }).fill('Farzad');
  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    canvas.getContext('2d').fillRect(0, 0, 128, 128);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  await page.locator('input[type=file]').setInputFiles({
    name: 'avatar.png',
    mimeType: 'image/png',
    buffer: Buffer.from(png, 'base64'),
  });
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByText('Profile updated successfully.').waitFor();
  await page.reload();
  await page.getByLabel('Username', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Username', { exact: true }).inputValue(), 'farzad_updated');
  await page.locator('.profile-avatar-preview .user-avatar img').waitFor();
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.reload();
  await page.getByLabel('Username', { exact: true }).waitFor();
  assert.equal(await page.locator('.profile-avatar-preview .user-avatar img').count(), 0);
  await page.getByRole('link', { name: 'Wishlist', exact: true }).click();
  await page.getByText('Vandal / Prism Shift', { exact: true }).waitFor();
  await page
    .getByRole('link', { name: /Wallet/ })
    .first()
    .click();
  await page.getByRole('button', { name: 'Continue to payment' }).click();
  await page.getByRole('button', { name: 'Record pending request' }).click();
  await page.getByText('Demo deposit request', { exact: true }).waitFor();
  await page.reload();
  await page.getByText('Demo deposit request', { exact: true }).waitFor();
  await page.getByRole('link', { name: 'Shopping cart', exact: true }).click();
  await page.getByLabel('Use wallet funds').check();
  assert.match(await page.locator('.summary-total').innerText(), /0.00/);
  await page.getByRole('button', { name: 'Continue to checkout' }).click();
  await page.getByText('Checkout is not connected. Wallet funds have not been charged.').waitFor();
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await page.getByText('Your cart is taking a breather.').waitFor();
  await go('/shop?category=invalid');
  assert.equal(await page.locator('.product-card').count(), 5);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    '/',
    '/shop',
    '/cart',
    '/account/profile',
    '/account/wallet',
    '/account/wishlist',
    '/support',
    '/how-it-works',
  ]) {
    await go(path);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `overflow ${path}`,
    );
  }
  await go('/shop?category=Knives');
  assert.equal(await page.locator('.product-card').count(), 1);
  await go('/shop?search=Ghost');
  assert.equal(await page.locator('.product-card').count(), 1);
  await go('/shop');
  await page.getByLabel('Sort products').selectOption('price-low');
  assert.match(await page.locator('.product-card').first().innerText(), /Ghost/);
  await page.setViewportSize({ width: 1280, height: 900 });
  await go('/signup');
  await page.locator('#display-name').fill('New Player!');
  await page.locator('#email').fill('new@example.com');
  await page.locator('#password').fill('demo-password');
  await page.locator('input[name=terms]').check();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.waitForURL('**/account');
  await page.getByRole('heading', { name: 'New Player!', exact: true }).waitFor();
  await page.locator('.header-profile-trigger').click();
  await page.getByRole('menuitem', { name: /Log out/ }).click();
  await page.waitForURL('http://127.0.0.1:3100/');
  await go('/account/profile');
  await page.waitForURL('**/login');
  await page.evaluate(() =>
    localStorage.setItem(
      'dropzone-account-v1',
      JSON.stringify({ user: { walletBalance: 'broken' }, transactions: [null] }),
    ),
  );
  await go('/account');
  await page.waitForURL('**/login');
  assert.deepEqual(errors, []);
  console.log(
    'PASS: cart math/removal/reload, SPA profile and avatar persistence/removal, signup/logout, filters/sorting, wishlist, pending wallet persistence, wallet checkout preview, invalid category, 8 mobile routes, corrupted account redirect; no runtime errors',
  );
} finally {
  await browser?.close();
  server.kill();
}
