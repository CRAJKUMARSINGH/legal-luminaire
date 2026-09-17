# ADR-009 — Canonical Product Boundaries

**Date:** 2026-09-14  
**Status:** Accepted  
**Deciders:** Engineering leads (Kiro, Devin, Trae, Antigravity, Cursor)

---

## Context

The repository is the result of four-agent parallel development. Valuable features exist across multiple folders but the product boundary was never explicitly declared. This caused:

- Two backend implementations (`artifacts/legal-luminaire/backend` and `artifacts/api-server`)
- Frontend API calls scattered across 10+ files with hardcoded `localhost:8000`
- Mixed `/api` and `/api/v1` endpoint prefixes
- Production app code living inside `artifacts/` alongside prototypes and experiments
- `vercel.json` using `npm` while the workspace uses `pnpm`

## Decision

**Legal Luminaire is one product with one web app and one primary API.**

### Canonical product path

| Layer | Canonical location |
|-------|--------------------|
| Frontend SPA | `artifacts/legal-luminaire` (target: `apps/legal-luminaire-web`) |
| Backend API | `artifacts/legal-luminaire/backend` (target: `services/legal-luminaire-api`) |
| Shared types | `lib/` — only packages actively imported by the canonical product |
| Architecture decisions | `docs/adr/` |
| Operational setup | `README.md` |

### Non-canonical (experiments / archive)

| Folder | Status |
|--------|--------|
| `artifacts/api-server` | **Experiment** — Express API server, not on production path |
| `artifacts/mockup-sandbox` | **Experiment** — UI mockup sandbox |
| `SUPPLEMENT/` | **Archive** — Agent output snapshots and patch files |
| `output_100426/` | **Archive** — One-off competition/filing outputs |
| `Attached_Assets/` | **Archive** — Reference documents |

## Rules (effective immediately)

### Rule 1 — One canonical implementation per capability
If two implementations of the same capability exist (e.g. two draft generators, two search clients), only the one in `artifacts/legal-luminaire` is canonical. The other must be archived.

### Rule 2 — Frontend components do not hardcode infrastructure URLs
All frontend API calls must go through `src/lib/api-client.ts`.  
The `BASE_URL` in `api-client.ts` is the **single source of truth** for the backend address.  
`import.meta.env.VITE_API_URL || "/api/v1"` — this resolves correctly in local dev (proxy), Docker, and Vercel.

**Forbidden pattern:**
```ts
// NEVER in any component or hook
fetch("http://localhost:8000/api/v1/...")
```

**Required pattern:**
```ts
// Always — go through api-client.ts
import { apiClient } from "@/lib/api-client";
await apiClient.someMethod(...)
```

### Rule 3 — One API prefix convention
- Backend routes are mounted at `/api/v1` for product endpoints
- Backend routes are mounted at `/api` for streaming/SSE endpoints (`/api/variants`, `/api/legal`)
- Frontend uses `/api/v1` as default — the Vite dev proxy handles it locally

### Rule 4 — Package manager is pnpm
No `npm install`, no `npm run` in any CI, deploy config, or README.  
Root: `pnpm install` · Dev: `pnpm --filter @workspace/legal-luminaire run dev`

### Rule 5 — Protected files (Citation Safety System)
The following files must never be replaced or broken:
- `src/App.tsx`
- `src/main.tsx`
- `src/index.css`
- `src/context/CaseContext.tsx`
- `src/context/AccuracyContext.tsx`
- `src/lib/citation-gate.ts`
- `src/components/CitationGatePanel.tsx`
- `src/components/views/SafeDraftEditor.tsx`
- `src/pages/SafeDraftPage.tsx`
- `src/lib/verification-engine.ts`
- `src/lib/case01-data.ts`
- `vite.config.ts`

## Migration plan

This is a phased migration — move when risk is low:

1. `chore/declare-canonical-product-path` — this ADR + README update ✅
2. `refactor/unify-frontend-api-client` — fix hardcoded URLs ✅
3. `chore/archive-experimental-folders` — in-place markers + `docs/FOLDER_INVENTORY.md` ✅
4. `refactor/move-active-app-out-of-artifacts` — rename when CI/deploy are retargeted (deferred)
5. `chore/add-governance-checks` — `scripts/check-governance.sh` in CI ✅

## Consequences

- Any new feature that calls the backend must add a method to `api-client.ts` or `variantsApi.ts`, not call `fetch()` directly in a component
- The Express API server (`artifacts/api-server`) is frozen — no new work
- `SUPPLEMENT/` folder is read-only archive — no new files written there
- Future ADRs are the only mechanism for changing these boundaries
