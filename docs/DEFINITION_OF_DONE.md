# Definition of done (cross-agent / multi-contributor)

A change is done only if all of the following hold.

1. It lands in the **canonical** frontend or FastAPI backend (or `lib/` actually imported by them). Experiment/archive folders are not a delivery path.
2. Frontend HTTP to the product API goes through `src/lib/api-client.ts` (or the approved helpers in that module: `variantsApi.ts`, `draft-family.ts`, streaming hooks). No hardcoded `http://localhost:8000`.
3. New UI capabilities are gated with `VITE_FF_*` in `src/lib/featureFlags.ts`, default **off**.
4. New pages are registered only in `src/routes.tsx` (additive). Protected citation-safety files in ADR-009 are not replaced.
5. Package manager remains **pnpm** in CI, Netlify, Vercel, and contributor docs.
6. Tests or smoke coverage match the risk: typecheck for UI, backend compile/tests for API, and `bash scripts/check-governance.sh` (or `pwsh scripts/check-governance.ps1`) from repo root.
7. Docs that describe startup or deploy still match reality (`README.md`, `docs/USER_MANUAL.md`). Architecture changes get an ADR under `docs/adr/`.
