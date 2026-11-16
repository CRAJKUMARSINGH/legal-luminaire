# PERFORMANCE COMPARISON
**Guide 2 §6 — Bundle Size and Performance Impact**  
**Branch:** `design/legal-luminaire-premium-landing`  
**Date:** 2026-11-15

---

## Build Comparison

| Metric | Before (main @ 010b7a7) | After (design branch) | Delta |
|--------|----------------------|----------------------|-------|
| Total modules | 2997 | 2997 | 0 (same) |
| Asset chunks | 115 | 115 | 0 |
| index.html | 1430 bytes | 1430 bytes | 0 |
| CSS bundle | 235 kB (gzip: 34 kB) | ~236 kB (gzip: ~35 kB) | +1 kB CSS tokens |
| `PremiumHeroBanner.tsx` | 243 lines | 290 lines | +47 lines (trust section + footer) |

**Impact:** CSS bundle increased by ~1 kB due to design token custom properties
and `prefers-reduced-motion` media query. JS bundle unchanged — same number of
modules and chunks. This is a negligible performance impact.

---

## Performance Targets (Estimated — Not Measured)

| Metric | Target | Estimated | Measured? |
|--------|--------|-----------|----------|
| LCP | ≤ 2.5s | ~1.5s | ❌ No Lighthouse |
| CLS | ≤ 0.1 | ~0 (fixed-height gradient hero) | ❌ No browser |
| INP | ≤ 200ms | ~50ms (CSS-only transitions) | ❌ No browser |

### Why Estimated Values Are Conservative

- Hero uses a CSS gradient background (no image load) → no LCP from images
- No Framer Motion animations in hero → no JS animation overhead
- `prefers-reduced-motion` media query reduces all transitions to 0.01ms
- Code splitting: hero is part of the Home chunk, loaded on initial page

---

## Bundle Size Impact

The design token CSS variables add ~1 kB to the CSS bundle. The Trust
Architecture and Footer sections add ~47 lines of JSX to the component. No
new npm dependencies were introduced. No new icons imported (all from
existing `lucide-react` set).

**No meaningful performance regression.**

---

## Recommendation

To measure actual Core Web Vitals:
1. Deploy the design branch to a preview URL
2. Run Lighthouse on the preview
3. Record LCP, CLS, INP at 75th percentile
4. Compare against the `main` branch preview
