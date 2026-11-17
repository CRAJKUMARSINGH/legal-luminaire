# ROUTE BROWSER COVERAGE
**Master Enrichment Guide Phase C — browser evidence 2026-11-16**

Method: production build (`vite preview`) + Puppeteer-core 24.40.0 / local Chrome headless. Script + raw JSON: `artifacts/legal-luminaire/preview-audit/`.

## Routes exercised in a real browser

| Route | Result |
|-------|--------|
| `/` (home/landing) | ✅ HTTP 200, renders, 0 console errors — all 4 viewports |
| `/about` (direct refresh) | ✅ HTTP 200, SPA fallback works |
| `/how-to-use` (direct refresh) | ✅ HTTP 200 |
| `/accuracy-academy` (direct refresh) | ✅ HTTP 200 |

## Viewports

375×812, 768×1024, 1024×768, 1440×900 — **no horizontal overflow** at any size (`scrollWidth == clientWidth`).

## Interaction checks

- Keyboard: 12 Tab stops reach focusable elements; visible focus indicators confirmed (non-none outline/box-shadow) — `keyboard-focus.png`
- Reduced motion: `prefers-reduced-motion` emulated; animations clamped to ~0ms — `reduced-motion.png`
- Assets: 0 broken images; 0 failed network requests; 0 console/page errors

## Coverage honesty

`src/routes.tsx` declares **~100 routes**. Only 4 were exercised in a browser. Auth-gated case routes (`/case/:id/*`), citation verification UI, draft export, upload flows, and error-recovery paths are **NOT browser-verified** — they are covered only by unit tests (388 frontend tests). A full Playwright sweep across all routes remains outstanding before production promotion.

**Verdict:** Landing page and SPA fallback VERIFIED. Full route coverage NOT VERIFIED.

## Update — Full route sweep (2026-11-17, commit 4889d0f+)

All **102 routes** in `src/routes.tsx` were exercised via headless Chrome
(Puppeteer) against the production build (`vite preview`, port 4173) at
1440px. Parameterized `/case/:id/*` routes used `hemraj-case-01`.

| Metric | Result |
|---|---|
| Routes tested | 102 |
| Passed (HTTP 200, content rendered, zero page errors) | **102** |
| Failed | 0 |
| Console/page errors | 0 across all routes |
| Horizontal overflow | 0 |

Evidence: `artifacts/legal-luminaire/preview-audit/routes/report.json`
(sweep script: `route-sweep.mjs`). One transient asset-fetch failure on
`/accuracy-academy` during the sweep was re-tested individually and
passed — not a code defect.

Caveat: backend API was not running during the sweep; routes render their
shells and client-side content. Backend-dependent interactive flows
(upload, AI draft generation, citation verification calls) were NOT
exercised end-to-end — that remains covered by the 176 backend tests.
