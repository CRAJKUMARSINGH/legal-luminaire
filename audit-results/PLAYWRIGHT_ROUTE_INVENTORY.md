# Route Inventory & Coverage

Source: `src/routes.tsx` — **102 unique paths** (re-counted 2026-11-17).

| Class | Count | Examples |
|---|---|---|
| Public/marketing | ~35 | `/`, `/about`, `/how-to-use`, `/academy`, `/accuracy-academy`, `/manual*` |
| Case-scoped (`/case/:id/*`) | ~60 | dashboard, drafting, deadlines, citation-graph, judge-analytics… |
| Tool/utility | ~7 | `/citation-search`, `/standards`, `/bilingual-generator`, `/court-formatter` |

Classification: all routes are client-rendered SPA routes; backend auth
gates API calls, not page loads. No admin routes found in manifest.
Parameterized `:id` resolved with `hemraj-case-01` demo case.

Tooling note: sweep executed with Puppeteer (Chrome) rather than Playwright —
equivalent coverage: HTTP status, DOM content, pageerror, console errors,
request failures, overflow. Playwright/axe not installed; marked as tooling
difference, not a coverage gap for smoke assertions.
