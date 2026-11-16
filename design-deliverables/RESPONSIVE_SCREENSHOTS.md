# RESPONSIVE SCREENSHOTS
**Guide 2 §6 — Before/After Visual Regression**  
**Branch:** `design/legal-luminaire-premium-landing`  
**Date:** 2026-11-15

---

## Limitation

No screenshots were captured. Browser automation tooling (Playwright/Puppeteer)
is not configured on this machine. This document records the **structural**
responsive layout based on CSS analysis, not pixel-level visual comparison.

---

## Responsive Layout Analysis

### 375px (Mobile)

| Element | Layout | Evidence |
|---------|--------|---------|
| Hero | Single column (`flex-col`) | `flex flex-col md:flex-row` — column below md breakpoint |
| CTAs | Stacked vertical | `flex flex-col sm:flex-row md:flex-col` — column below sm |
| Capability cards | 1 column | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Trust tiers | 2 columns | `grid-cols-2 lg:grid-cols-4` |
| Workflow | Wraps horizontally | `flex flex-wrap gap-3` |
| Footer | Stacked | `flex-col sm:flex-row` |

**Potential risk:** Hero CTA buttons stack below the hero text on mobile.
On 375px this may push the disclaimer below the fold. No horizontal scroll
expected — all content uses `flex-col` and `grid-cols-1` below breakpoints.

### 768px (Tablet)

| Element | Layout |
|---------|--------|
| Hero | Two-column (`md:flex-row`) — logo + text left, CTAs right |
| CTAs | Stacked vertical (right column) |
| Capability cards | 2 columns |
| Trust tiers | 2 columns |
| Footer | Row layout |

### 1024px (Desktop)

| Element | Layout |
|---------|--------|
| Hero | Two-column full width |
| Capability cards | 3 columns |
| Trust tiers | 4 columns |
| Footer | Row layout with links |

### 1440px (Wide Desktop)

| Element | Layout |
|---------|--------|
| All grids at maximum columns | Full-width, generous spacing |
| Hero text constrained to `maxWidth: 18ch` (H1) and `maxWidth: 60ch` (description) | Readable line length |

---

## No Horizontal Overflow

- Hero uses `overflow-hidden` on the container (`rounded-2xl overflow-hidden`)
- All grids use responsive column counts that stack on narrow viewports
- No fixed-width elements that could exceed 375px
- CTA text is short ("Explore Workbench" / "GitHub") — no truncation risk

---

## What Cannot Be Verified Without Browser

| Check | Status |
|-------|--------|
| Actual rendering at 375px | ❌ NOT VERIFIED |
| Actual rendering at 768px | ❌ NOT VERIFIED |
| Actual rendering at 1024px | ❌ NOT VERIFIED |
| Actual rendering at 1440px | ❌ NOT VERIFIED |
| Touch target hit areas on real device | ❌ NOT VERIFIED |
| Focus ring visibility in real DOM | ❌ NOT VERIFIED (CSS rule present) |
| Light/dark theme switching | ❌ NOT VERIFIED (hero is dark-only) |

---

## Recommendation

To capture screenshots:

```bash
npx playwright install chromium
pnpm --filter @workspace/legal-luminaire run dev &
npx playwright screenshot --viewport-size=375,667 http://localhost:5173 screenshots/375px.png
npx playwright screenshot --viewport-size=768,1024 http://localhost:5173 screenshots/768px.png
npx playwright screenshot --viewport-size=1024,768 http://localhost:5173 screenshots/1024px.png
npx playwright screenshot --viewport-size=1440,900 http://localhost:5173 screenshots/1440px.png
```
