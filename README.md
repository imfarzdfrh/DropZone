# DropZone

A Nuxt 4 / Vue 3 gaming storefront prototype with Tailwind CSS, shared UI components,
cart, browser-local wishlist, demo account, avatar storage and wallet previews.

## Development

Use Node.js 22.18+ or Node.js 24.

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser smoke test starts the production build on port 3100. It checks cart totals
and persistence, demo login/signup/logout, profile edits with avatar upload/removal,
wishlist, wallet request persistence, filtering/sorting, mobile overflow and corrupt
account recovery. Remote image/font requests are blocked for deterministic testing;
external asset availability is not tested. `CHROMIUM_EXECUTABLE` can select a local
Chromium binary in a constrained Linux environment.

## Demo boundaries

There is no authentication backend, order service, checkout provider or support delivery.
Passwords are not verified or stored. Each demo sign-in creates a new sample account.
Account and wallet records live in localStorage; avatars live in IndexedDB. Cart and
wishlist are shared within the browser, not tied to a server-side user identity.
Deposits only create pending sample records; no money is charged or credited.
Support contact details and product images are placeholders.

For the audit and fixes, see [docs/AUDIT.fa.md](docs/AUDIT.fa.md).
