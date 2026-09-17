# ADR-010 — Governance Enforcement Rules

**Date:** 2026-09-14  
**Status:** Accepted  
**Supersedes:** None (companion to ADR-009)

---

## Context

ADR-009 declared canonical product boundaries. This ADR defines the enforcement mechanism — the rules that prevent the repo from fragmenting again as new agents or contributors add work.

## Rules

### Rule 1 — No hardcoded infrastructure URLs in frontend source

**Forbidden:**
```ts
fetch("http://localhost:8000/api/v1/...")
fetch("http://localhost:8000/...")
```

**Required:** Import `API_BASE` or `API_STREAM_BASE` from `@/lib/api-client` and use those.

**Exceptions:** Only `api-client.ts` and `variantsApi.ts` may construct full URLs.

**Check:** `scripts/check-governance.ps1` Rule 1

---

### Rule 2 — One base URL per prefix tier

| Tier | Constant | Default value |
|------|----------|---------------|
| Standard endpoints | `API_BASE` | `/api/v1` |
| Streaming / SSE | `API_STREAM_BASE` | `/api` |

Backend routers must be consistent: product endpoints → `/api/v1`, SSE streams → `/api`.

**Check:** `scripts/check-governance.ps1` Rule 2

---

### Rule 3 — Package manager is pnpm everywhere

`vercel.json`, `.github/workflows/*.yml`, and all READMEs must use `pnpm`.  
Never use `npm install` or `npm run` in any config that touches this repo.

**Check:** `scripts/check-governance.ps1` Rule 3

---

### Rule 4 — No duplicate routes

The same path string must not appear twice in `routes.tsx`.  
Aliases are fine (e.g. `/manual` and `/how-to-use` both render `HowToUsePage`) but the path strings must be distinct.

**Check:** `scripts/check-governance.ps1` Rule 4

---

### Rule 5 — No orphan page files

Every `.tsx` file in `src/pages/` must have a corresponding `<Route>` in `routes.tsx`.  
If a page is experimental, either route it behind a feature flag or move it to `experiments/`.

**Check:** `scripts/check-governance.ps1` Rule 5

---

### Rule 6 — Protected files are immutable

The 12 files listed in ADR-009 (Citation Safety System) must not be replaced, overwritten, or deleted.  
Any PR touching those files requires explicit sign-off.

**Check:** `scripts/check-governance.ps1` Rule 6

---

### Rule 7 — New features must be feature-flagged

Any new page, route, or backend capability that is not yet stable must be gated behind `featureFlags.ts`.  
This prevents experimental code from reaching production paths accidentally.

**Check:** Code review only (not automated yet).

---

### Rule 8 — One canonical implementation per capability

If two implementations of the same capability exist (e.g. two search clients, two draft generators), a PR must close one before the other can merge. "Both alive" is never acceptable.

**Check:** Code review only.

---

## Running the governance check

```powershell
# From repo root
bash scripts/check-governance.sh
# or
pwsh scripts/check-governance.ps1
```

Returns exit code 0 if all rules pass, exit code 1 if any fail.

CI (`.github/workflows/ci.yml`) runs `bash scripts/check-governance.sh` on every pull request and push to `main`.

## Consequences

- Every code contribution must pass `check-governance.ps1` before merge
- New capabilities requiring infrastructure URL access must add a method to `api-client.ts`, not bypass it
- The list of protected files may grow but never shrink
