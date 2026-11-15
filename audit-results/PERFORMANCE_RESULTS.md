# PERFORMANCE RESULTS
**Post-Implementation Audit — Performance Assessment**  
**Date:** 2026-11-15 | HEAD `10cc700`

---

## Limitation

This audit was conducted without browser-based performance profiling (Lighthouse, Core Web Vitals). No running dev server was available. Performance metrics below are **estimated from code analysis and build output**, not measured.

---

## 1. Build Output Analysis

| Metric | Value | Assessment |
|--------|-------|-----------|
| Total modules transformed | 2997 | Normal for a 105-route SPA |
| CSS bundle | 235 kB (gzip: 34 kB) | ✅ Under 50 kB gzip target |
| Main JS chunk | ~0.5 kB | ✅ Router only (code-split working) |
| Vendor chunk | 0.00 kB | ⚠️ Empty (react/react-dom not split as intended) |
| Total asset chunks | 115 | ✅ Good code splitting |
| Source maps | Disabled | ✅ Reduces build size for production |

**Note:** The `vendor` chunk is empty because `react`/`react-dom` are deduplicated via `resolve.dedupe` but the `manualChunks` config doesn't successfully split them. This is cosmetic — the app JS is in the main index bundle. Functionally correct.

---

## 2. Code Splitting

The application uses Vite's lazy loading (90 lazy imports in `routes.tsx`). Each route is a separate chunk:
- `citation-gate-*.js` — 2.59 kB (gzip: 1.30 kB)
- `StandardsView-*.js` — 2.80 kB (gzip: 1.28 kB)
- `DeadlinePage-*.js` — 6.86 kB (gzip: 2.51 kB)

This means the initial page load only fetches the Home chunk + shared vendor. Additional chunks load on navigation. ✅ Good for LCP.

---

## 3. Performance Targets (Estimated, Not Measured)

| Metric | Target | Estimated | Measured? |
|--------|--------|-----------|-----------|
| LCP | ≤ 2.5s | ~1.5s (estimated from chunk sizes) | ❌ NOT MEASURED |
| CLS | ≤ 0.1 | ~0 (hero uses fixed-height gradient) | ❌ NOT MEASURED |
| INP | ≤ 200ms | ~50ms (CSS-only transitions, no JS animation) | ❌ NOT MEASURED |

---

## 4. Performance-Relevant Code Patterns

| Pattern | Status | Evidence |
|---------|--------|---------|
| Code splitting (lazy routes) | ✅ | 90 lazy imports in routes.tsx |
| Image optimization | ✅ | No large images in hero (SVG icons only) |
| Font preloading | ⚠️ | Uses `next-themes` but no explicit font preconnect |
| CSS optimization | ✅ | Tailwind CSS 4 with PurgeCSS |
| JS bundle size | ✅ | Main chunks < 10 kB each (gzip) |
| Render-blocking resources | ✅ | Vite handles async loading |
| `prefers-reduced-motion` | ❌ | Not implemented in PremiumHeroBanner |
| HMR websocket in CSP | ✅ | `ws://localhost:*` in connect-src (dev only) |

---

## 5. Backend Performance

| Metric | Value | Source |
|--------|-------|--------|
| Rate limit | 10 expensive req/min | `main.py` — `_is_expensive_endpoint` |
| Test suite duration | 2.88s (73 tests) | pytest output |
| Deadline engine computation | < 1ms per deadline | O(1) date arithmetic |

---

## 6. Recommendation

To measure actual Core Web Vitals:
1. Start the dev server: `pnpm --filter @workspace/legal-luminaire run dev`
2. Open Chrome DevTools → Lighthouse
3. Run audit on `http://localhost:5173` at mobile + desktop
4. Record LCP, CLS, INP values

Or add Lighthouse CI to the GitHub Actions workflow for automated performance regression detection.
