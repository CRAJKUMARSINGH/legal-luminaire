# ACCESSIBILITY REPORT
**Guide 2 §1, §5 — WCAG 2.2 AA Assessment**  
**Branch:** `design/legal-luminaire-premium-landing`  
**Date:** 2026-11-15

---

## Limitation

This report is a code-level accessibility audit. No browser-based screen reader
testing (NVDA, JAWS, VoiceOver) or automated axe-core scan was run — no browser
automation tooling was available on this machine. Contrast ratios are computed
from CSS values, not measured from rendered pixels.

---

## Checklist

### Perceivable

| WCAG 2.2 Criterion | Status | Evidence |
|---------------------|--------|---------|
| 1.1.1 Non-text content | ✅ | All icons have `aria-hidden="true"`; text labels always present |
| 1.3.1 Info and relationships | ✅ | Semantic HTML: `<section>`, `<h1>`, `<h2>`, `<ol>`, `<footer>` |
| 1.4.3 Contrast (minimum) | ✅ | All text/background pairs meet 4.5:1 (see DESIGN_TOKENS.md) |
| 1.4.11 Non-text contrast | ✅ | Icon borders and focus rings meet 3:1 |
| 1.4.13 Content on hover/focus | ✅ | Hover transitions are opacity-only, no new content appears |

### Operable

| WCAG 2.2 Criterion | Status | Evidence |
|---------------------|--------|---------|
| 2.1.1 Keyboard | ✅ | All CTAs are `<a>` or `<Link>` — natively focusable |
| 2.1.2 No keyboard trap | ✅ | No modals in hero; focus flows naturally |
| 2.4.3 Focus order | ✅ | DOM order matches visual order (left-to-right, top-to-bottom) |
| 2.4.7 Focus visible | ✅ | `:focus-visible` with `outline: 3px solid var(--ll-gold); outline-offset: 3px` |
| 2.5.5 Target size | ✅ | CTAs have `minHeight: "44px"` (44×44px minimum) |
| 2.3.1 Three flashes | ✅ | No animations that flash |
| 2.3.3 Animation from interactions | ✅ | `prefers-reduced-motion: reduce` honoured |

### Understandable

| WCAG 2.2 Criterion | Status | Evidence |
|---------------------|--------|---------|
| 3.1.1 Language of page | ⚠️ | `<html lang="en">` in index.html — Hindi text inline (no `lang` switch) |
| 3.2.1 On focus | ✅ | No context change on focus |
| 3.2.2 On input | ✅ | No form inputs in hero |
| 3.3.2 Labels/instructions | ✅ | All buttons have text labels (not icon-only) |

### Robust

| WCAG 2.2 Criterion | Status | Evidence |
|---------------------|--------|---------|
| 4.1.2 Name, role, value | ✅ | `aria-label` on sections; `aria-labelledby` on hero |
| 4.1.3 Status messages | ✅ | No dynamic status in hero (static content) |

---

## Gaps

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| No `lang="hi"` on Hindi text spans | LOW | Add `lang="hi"` attribute to Hindi text elements |
| No screen reader testing | MEDIUM | Run NVDA/VoiceOver on deployed page |
| No axe-core automated scan | MEDIUM | Add `@axe-core/playwright` to browser test suite |
| No keyboard-only navigation test | MEDIUM | Run Tab-only navigation on deployed page |

---

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This global override ensures all CSS animations and transitions are effectively
disabled when the user has `prefers-reduced-motion: reduce` set in their OS.
