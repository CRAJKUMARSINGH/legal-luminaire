# Canonical frontend — Legal Luminaire

This directory is the **production web app** (`@workspace/legal-luminaire`).

- Dev: from repo root, `pnpm --filter @workspace/legal-luminaire run dev`
- API client (only place that builds backend URLs): `src/lib/api-client.ts`
- Product API: `./backend` (FastAPI)

Not product runtime: `../api-server`, `../mockup-sandbox`. See `docs/adr/ADR-009-canonical-product-boundaries.md`.
