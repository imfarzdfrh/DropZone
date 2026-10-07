# Gaming storefront

The English storefront now covers eight gaming categories with a shared right sidebar, desktop category disclosure and mobile/tablet modal drawer.

## Content and extension points

- `app/data/categories.ts`: category IDs, child IDs, labels, Lucide icon names and canonical route builder. Navbar and sidebar both render `CategoryNavigation`.
- `app/types/product.ts`: common physical/digital product contract.
- `app/data/demo/products.ts`: clearly identified sample products and prices. Replace this data source with live inventory when available; no real sales rankings are inferred.
- `app/data/catalog.ts`: joins samples with legacy skin IDs so saved carts and wishlists remain compatible.
- `app/utils/catalog.ts`: pure filtering and sorting. Route query parameters hold category, subcategory, search, product kind, platform, budget and sort selection.
- `app/components/ProductCard.vue`: shared card for homepage and catalog, with saved-item and add-to-cart actions.
- `app/assets/css/store.css`: store layout, semantic theme tokens and responsive rules. Existing account/auth/checkout styles remain in `main.css` with readable-scale overrides.
- `public/images/catalog`: original local SVG illustrations; no external image service or runtime image API is required. These are illustrations, not product photography.

The catalog keeps `/shop` and existing legacy category URLs. Navigation is a standard keyboard-accessible disclosure rather than an ARIA application menu. The small-screen drawer uses a native modal dialog for focus containment, Escape behavior and restoration; backdrop and close button also dismiss it. The desktop sidebar is 260–270 px wide and independently scrolls below the sticky header.

Sample accounts, wallet requests and checkout retain their existing demo behavior. This repository has no existing product-management page or backend; this change does not add an administrative UI. Sales, stock, fulfilment, pricing and authentication must be connected to trusted services before production use.

## Checks

```sh
npm ci
npm run build
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run test:storefront
```

For an existing compatible Chromium installation, set `CHROMIUM_EXECUTABLE` for either browser test. Set `PREVIEW_DIR` when running `test:storefront` to capture desktop/mobile home, desktop/tablet catalog and category navigation previews. The browser tests start and stop their own production server.

`test:e2e` covers existing account, avatar, cart, wishlist and wallet behavior. `test:storefront` covers the shared category routes, keyboard interaction, search/sort/filter persistence, physical-product cart persistence, drawer dismissal/selection, empty states, touch target size and overflow across 320, 390, 768, 1024 and 1440 px viewports. English is retained; layout also supports RTL direction and isolated price text.
