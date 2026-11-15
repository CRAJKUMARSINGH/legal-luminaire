# DESIGN TOKENS — Legal Luminaire Premium Visual Identity

## Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `navy` | `#0B1426` | Hero backgrounds, primary dark surfaces |
| `blue` | `#2563EB` | Primary CTAs, active state, Royal Blue accent |
| `gold` | `#D8B36A` | Taglines, borders, premium accents — Antique Gold |
| `ivory` | `#F7F5F0` | Page backgrounds, card surfaces |
| `slate` | `#64748B` | Secondary text, metadata, labels |
| `emerald` | `#15803D` | Verified/safe status, success states |

## Typography

| Role | Style |
|------|-------|
| Hero title | `text-3xl md:text-4xl font-bold tracking-tight` |
| Section heading | `text-xs font-bold uppercase tracking-widest` |
| Body copy | `text-sm leading-relaxed` |
| Hindi subtitle | `text-sm` with reduced opacity |
| Badge text | `text-xs font-semibold` |

## Component Library

- **PremiumHeroBanner** (`src/components/home/PremiumHeroBanner.tsx`) — Hero strip + capabilities grid + workflow pipeline
- **AccuracyBadge** (`src/components/ui/accuracy-badge.tsx`) — Tier-coloured badges
- **CitationTierBadge** (`src/components/CitationTierBadge.tsx`) — COURT_SAFE/VERIFIED/SECONDARY/PENDING display

## Animation Principles

- Use Framer Motion only for meaningful state transitions (not decoration)
- Respect `prefers-reduced-motion` — no autoplay animations
- Hero gradient is CSS-only (no JS animation needed)

## Accessibility Notes

- All `Icon` components carry `aria-hidden="true"` — text labels are always present
- CTA buttons have explicit text labels (not icon-only)
- Colour contrast: navy background + ivory text = 15.6:1 ratio (exceeds WCAG AA)
- Gold on navy = 5.4:1 (passes AA for normal text)
