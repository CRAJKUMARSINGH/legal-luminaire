# REAL RESPONSIVE SCREENSHOTS
**Master Enrichment Guide Phase D — real browser captures, 2026-11-16**

Captured from the **production build** (`vite build` → `vite preview` @ `127.0.0.1:4173`) using headless Chrome via Puppeteer-core. Files are real PNG output, not descriptions.

Location: `artifacts/legal-luminaire/preview-audit/`

| File | Viewport | Contents |
|------|----------|----------|
| `home-mobile-375.png` | 375×812 | Full-page mobile landing |
| `home-tablet-768.png` | 768×1024 | Full-page tablet landing |
| `home-laptop-1024.png` | 1024×768 | Full-page laptop landing |
| `home-desktop-1440.png` | 1440×900 | Full-page desktop landing |
| `route-about.png` | 1440×900 | `/about` direct-load |
| `route-how-to-use.png` | 1440×900 | `/how-to-use` direct-load |
| `route-accuracy-academy.png` | 1440×900 | `/accuracy-academy` direct-load |
| `keyboard-focus.png` | 1440×900 | Visible focus ring during Tab navigation |
| `reduced-motion.png` | 1440×900 | `prefers-reduced-motion: reduce` emulation |

Machine-readable results: `preview-audit/report.json`
Reproduction script: `preview-audit/preview-audit.mjs`

## Measured results

- Horizontal overflow: **none** at all four breakpoints
- Console errors / failed requests / HTTP ≥400: **0**
- Broken images: **0**
- H1 present on every page (`Legal Luminaire`)
- Internal links present (`<a href>` count recorded per viewport in report.json)

## Not captured

- Lighthouse/Core Web Vitals (LCP/CLS/INP) — NOT MEASURED
- axe-core automated WCAG scan — NOT RUN (contrast values only computed in `design-deliverables/DESIGN_TOKENS.md`)
- Screenshots of auth-gated `/case/:id/*` routes — require backend + credentials
