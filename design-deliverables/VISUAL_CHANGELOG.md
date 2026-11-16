# VISUAL CHANGELOG
**Guide 2 — Landing Page Visual Changes**  
**Branch:** `design/legal-luminaire-premium-landing`  
**Date:** 2026-11-15

---

## Before (main @ 010b7a7)

The existing `PremiumHeroBanner.tsx` (243 lines) had:
- Hero with Scale icon, title "Legal Luminaire", gold badge "India's Evidence-First Legal AI"
- Tagline "Cite with confidence. Draft with rigour. File with authority."
- Hindi subtitle
- Gold disclaimer ribbon
- 6 capability cards (Citation Safety Gate, 19 Verified Precedents, Deterministic Deadlines, Bilingual Drafting, 26 Demo Cases, Privacy by Default)
- 6-step workflow pipeline (Case Intake → Export)
- CTA: "Browse Demo Cases" + "GitHub"

**Design tokens:** Inline JS constants (`const TOKEN = {...}`), no CSS custom properties.

---

## After (design/legal-luminaire-premium-landing)

Refactored `PremiumHeroBanner.tsx` (290 lines) with:

### Added
- **Eyebrow text**: "INDIAN LEGAL RESEARCH WORKBENCH" (gold, uppercase, letter-spaced)
- **New H1**: "Clarity in Law. Confidence in Every Citation." (replaces "Legal Luminaire" as H1 — the wordmark moves to eyebrow)
- **Description**: "Research legal authorities, organize evidence, and prepare drafts with transparent citation review and human oversight."
- **Trust Architecture section** (NEW): 4-tier grid showing COURT_SAFE / VERIFIED / SECONDARY / PENDING with icon + colour + text
- **Footer** (NEW): legal disclaimer, links to About / Documentation / GitHub, non-substitution-for-legal-advice notice
- **CSS design tokens** (NEW): `--ll-*` custom properties in `index.css` `:root`
- **Focus-visible styles** (NEW): gold accent outline (3px, offset 3px)
- **`prefers-reduced-motion`** (NEW): global media query reducing all transitions to 0.01ms
- **44px minimum touch targets** (NEW): `minHeight: "44px"` on all CTAs

### Changed
- Hero gradient: refined with radial overlay (`radial-gradient(circle at 80% 18%, ...)` + linear)
- Hero background: navy → navy with blue radial highlight at top-right
- CTA label: "Browse Demo Cases" → "Explore Workbench"
- CTA radius: `rounded-md` → `rounded-xl` (12px)
- CTA padding: increased for 44px minimum height
- Workflow: 6 steps (Intake → Export) → 5 steps (Research → Review) per Guide 2 §2
- Section labels: "Platform Capabilities" unchanged; "Litigation Workflow" → "Workflow"
- Card styling: `rounded-xl` → `rounded-2xl` (16px) with subtle shadow
- Capability titles updated per Guide 2 §2: "Citation Safety Gate" → "Citation Review", etc.

### Removed
- Badge "India's Evidence-First Legal AI" (replaced by eyebrow text)
- "19 Verified Precedents" specific count in card title (kept in description)

### Preserved
- Color palette: Navy / Blue / Gold / Ivory (unchanged)
- Disclaimer ribbon text
- Hindi subtitle
- GitHub link
- All existing hooks, context, and route integration in Home.tsx

---

## What Was NOT Changed

- No backend files modified
- No security controls modified
- No citation registry modified
- No test files modified
- No `netlify.toml` modified
- No `App.tsx` or `routes.tsx` modified

---

## Test Impact

| Suite | Before | After | Delta |
|-------|--------|-------|-------|
| Frontend (Vitest) | 388/388 | 388/388 | 0 (zero regressions) |
| TypeScript strict | 0 errors | 0 errors | 0 |
| Production build | 115 chunks | 115 chunks | 0 |

**The visual changes did not disturb any security or citation tests.**
