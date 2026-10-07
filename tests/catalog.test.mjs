import test from 'node:test';
import assert from 'node:assert/strict';
import { storeCategories, categoryRoute, resolveCategory } from '../app/data/categories.ts';
import { filterProducts } from '../app/utils/catalog.ts';
const items = [
  {
    id: 1,
    name: 'Wireless headset',
    summary: '50 mm drivers',
    platform: 'PC / Console',
    category: 'peripherals',
    subcategory: 'headsets',
    kind: 'physical',
    price: 89,
  },
  {
    id: 2,
    name: 'PC adventure',
    summary: 'Digital edition',
    platform: 'PC',
    category: 'games',
    subcategory: 'pc-games',
    kind: 'digital',
    price: 39,
  },
  {
    id: 3,
    name: 'Console adventure',
    summary: 'Physical disc',
    platform: 'Console',
    category: 'games',
    subcategory: 'disc-games',
    kind: 'physical',
    price: 45,
  },
];
test('taxonomy produces unique shared links and rejects mismatched children', () => {
  assert.equal(storeCategories.length, 8);
  const routes = storeCategories.flatMap((c) =>
    c.children.map((child) => categoryRoute(c.id, child.id)),
  );
  assert.equal(new Set(routes.map((r) => JSON.stringify(r))).size, routes.length);
  assert.equal(resolveCategory('peripherals', 'steam-wallet').subcategory, undefined);
  assert.equal(resolveCategory('invalid').category, undefined);
});
test('filters compose category, format, platform, query, budget and sorting without mutating data', () => {
  assert.deepEqual(
    filterProducts(items, { category: 'games', subcategory: 'digital-games' }).map((p) => p.id),
    [2],
  );
  assert.deepEqual(
    filterProducts(items, { platform: 'Console', kind: 'physical', budget: '50' }).map((p) => p.id),
    [3],
  );
  assert.deepEqual(
    filterProducts(items, { search: '  50 MM ' }).map((p) => p.id),
    [1],
  );
  assert.deepEqual(
    filterProducts(items, { sort: 'price-low' }).map((p) => p.id),
    [2, 3, 1],
  );
  assert.deepEqual(
    items.map((p) => p.id),
    [1, 2, 3],
  );
});

test('sample catalog covers every new category and leaf without duplicate IDs', async () => {
  const { demoProducts } = await import('../app/data/demo/products.ts');
  assert.equal(new Set(demoProducts.map((p) => p.id)).size, demoProducts.length);
  for (const category of storeCategories) {
    assert.ok(filterProducts(demoProducts, { category: category.id }).length, category.id);
    for (const child of category.children.filter((c) => c.id !== 'skins')) {
      assert.ok(
        filterProducts(demoProducts, { category: category.id, subcategory: child.id }).length,
        child.id,
      );
    }
  }
});
