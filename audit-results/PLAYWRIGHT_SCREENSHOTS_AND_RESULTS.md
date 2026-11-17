# Route Sweep Results

**102/102 routes PASS** — headless Chrome, production build (`vite preview` :4173),
1440px viewport, `hemraj-case-01` for `:id` routes.

- HTTP 200 + rendered content + zero pageerrors: 102
- Console errors: 0 | Horizontal overflow: 0 | Failed critical requests: 0
- One transient asset-fetch failure (`/accuracy-academy`) re-tested → PASS

Evidence: `artifacts/legal-luminaire/preview-audit/routes/report.json`
Script: `route-sweep.mjs` (repo root, untracked)

NOT covered: authenticated flows, backend-API-dependent interactions
(upload/AI/citation calls), mobile viewports for all routes, axe-core,
LCP/CLS/INP measurement, visual regression diffs. Prior 4-viewport audit
covers home + 3 routes only.
