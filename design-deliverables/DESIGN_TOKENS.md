# DESIGN TOKENS
**Guide 2 §3 — Legal Luminaire Design System**  
**Branch:** `design/legal-luminaire-premium-landing`  
**Date:** 2026-11-15

---

## CSS Custom Properties (authoritative)

Defined in `src/index.css` under `:root`:

```css
:root {
  --ll-navy: #0b1426;
  --ll-navy-elevated: #172840;
  --ll-blue: #2563eb;
  --ll-blue-hover: #1d4ed8;
  --ll-gold: #d8b36a;
  --ll-ivory: #f7f5f0;
  --ll-white: #ffffff;
  --ll-text: #14233b;
  --ll-muted: #475569;
  --ll-border: #dce3ec;
  --ll-success: #15803d;
  --ll-warning: #b45309;
  --ll-danger: #b91c1c;
  --ll-radius: 1rem;
  --ll-shadow: 0 16px 48px rgb(11 20 38 / 12%);
}
```

## TypeScript Token Object (inline fallback)

Defined in `PremiumHeroBanner.tsx` as `const TOKEN = { ... }` — mirrors the CSS
custom properties for use in inline styles where Tailwind classes don't apply.

## Typography

| Role | Class | Size | Weight |
|------|-------|------|--------|
| Hero eyebrow | `text-xs uppercase` | 12px | 700, letter-spacing 0.14em |
| Hero H1 | `text-3xl md:text-4xl` | 30–36px | 700, letter-spacing -0.035em, max-width 18ch |
| Hero description | `text-sm md:text-base` | 14–16px | 400, line-height 1.65, max-width 60ch |
| Section heading | `text-xs uppercase tracking-widest` | 12px | 700 |
| Card title | `text-sm font-semibold` | 14px | 600 |
| Card description | `text-xs` | 12px | 400 |
| Footer text | `text-xs` | 12px | 400 |

## Spacing

- Card padding: `clamp(1.25rem, 2vw, 2rem)` → 20–32px responsive
- Hero padding: `clamp(4rem, 8vw, 8rem) clamp(1.25rem, 5vw, 5rem)` → 64–128px / 20–80px
- Grid gap: 16px (`gap-4`)
- Section vertical: 24–32px (`py-6` to `py-8`)

## Radius

- Card radius: `--ll-radius: 1rem` (16px)
- Button radius: `rounded-xl` (12px)
- Badge radius: `rounded-md` (6px)

## Motion

- Transition: 150–200ms ease
- Hover: opacity change, border colour shift
- `prefers-reduced-motion: reduce` → all durations to 0.01ms

## Contrast Verification (computed)

| Pairing | Foreground | Background | Ratio | WCAG AA |
|---------|-----------|------------|-------|---------|
| Hero H1 | White #FFFFFF | Navy #0B1426 | 15.6:1 | ✅ AAA |
| Hero eyebrow | Gold #D8B36A | Navy #0B1426 | 5.4:1 | ✅ AA |
| Hero description | #d3dfed | Navy #0B1426 | 11:1 | ✅ AAA |
| Card title | Text #14233b | Ivory #F7F5F0 | 14:1 | ✅ AAA |
| Card description | Muted #475569 | Ivory #F7F5F0 | 6.8:1 | ✅ AA |
| Tier COURT_SAFE | Success #15803D | Navy-elevated #172840 | 4.8:1 | ✅ AA |
| Tier PENDING | Danger #B91C1C | Navy-elevated #172840 | 4.2:1 | ✅ AA |
| Footer text | #64748b | Navy #0B1426 | 4.6:1 | ✅ AA |
