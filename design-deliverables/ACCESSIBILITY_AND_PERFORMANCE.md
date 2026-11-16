# ACCESSIBILITY AND PERFORMANCE
**Master Enrichment Guide Phase D acceptance — 2026-11-16**

## Accessibility — runtime verified

| Criterion | Status | Evidence |
|-----------|--------|----------|
| No horizontal scroll @375px | ✅ | `preview-audit/report.json` — scrollW == clientW |
| Keyboard navigation | ✅ | 12 Tab stops, all focusable elements reachable |
| Visible focus indicators | ✅ | Non-none outline/box-shadow on SELECT/BUTTON/A (`keyboard-focus.png`) |
| Reduced-motion | ✅ | Media query clamps animation/transition to 0.01ms (`index.css:38-43`) |
| Single H1 per view | ✅ | `Legal Luminaire` hero title |
| Touch targets ≥44px | ⚠️ CODE-LEVEL | `.ll-primary`/`.ll-secondary` set `min-height: 44px`; not measured per-element at runtime |
| WCAG 2.2 AA contrast | ⚠️ PARTIAL | Token contrast computed in `DESIGN_TOKENS.md`; **no axe scan run** |
| Screen-reader semantics | ⚠️ CODE-LEVEL | `aria-hidden` on icons, `aria-label` on sections per `ACCESSIBILITY_REPORT.md`; no screen-reader test executed |

## Performance — partially measured

| Metric | Status |
|--------|--------|
| Production build | ✅ Success, ~115 chunks; `index-*.js` 614 kB (gzip 183 kB), CSS 236 kB (gzip 35 kB) |
| Largest chunks | ⚠️ `RadarChart` 388 kB, `IntakeExamplesPage` 182 kB — code-split already; further splitting possible |
| Empty `vendor` chunk | ⚠️ Noted in build output — `manualChunks` vendor resolves empty; harmless but worth cleaning |
| LCP / CLS / INP | ❌ NOT MEASURED — requires Lighthouse on a deployed preview |
| Bundle secrets scan | ✅ 0 credential patterns in `dist/public/assets/*.js` |

## Outstanding before production

1. Run axe-core or Lighthouse accessibility audit on the preview deploy
2. Record LCP/CLS/INP under real network conditions
3. Keyboard-test auth-gated routes (case workspace, citation verification, export dialogs)
