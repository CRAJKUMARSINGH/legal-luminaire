# RELEASE CANDIDATE MANIFEST
**Guide 1 §1 — Production Security & Deployment**  
**Date:** 2026-11-15  
**Principle:** Every value below was read from the actual repository, not inferred.

---

## Repository Identity

| Field | Value |
|-------|-------|
| HEAD SHA | `010b7a77194669336857e08ce9138419824f777d` |
| origin/main SHA | `010b7a77194669336857e08ce9138419824f777d` |
| Branch | `main` |
| Local = Remote | ✅ SYNCHRONISED |
| Dirty files | `pnpm-lock.yaml` (M) — pre-existing LF/CRLF drift only |
| Untracked | Temp `.txt` audit output files + `CODE-JUNCTION/` — intentionally untracked |

## Runtime Versions

| Component | Version |
|-----------|---------|
| Node.js | v24.14.0 |
| Python (.venv) | 3.14.7 |
| pnpm | 10.11.0 |
| React | 19.1.0 |
| FastAPI | >=0.111.0 |

## Dependency Lockfile

| File | SHA-256 |
|------|---------|
| `pnpm-lock.yaml` | `30FFDA19E1E4485B82074C3815E795C5DE75BCE9B2B57CF7981ED7C51A1040B1` |

## Test Results (run at this SHA)

| Suite | Tests | Result |
|-------|-------|--------|
| Backend (pytest, no exclusions) | 170 | ✅ 170 passed, 1 warning |
| Frontend (Vitest) | 388 | ✅ 388 passed |
| TypeScript strict typecheck | — | ✅ 0 errors |
| Production build | 115 chunks | ✅ clean |

## Commits Since Last Stable Baseline

```
010b7a7  feat(security+tests): Priority 1-6 final security and test completion
10cc700  merge: audit/legal-luminaire-hardening-ui into main
0a4e5c8  feat(hardening): CODE-JUNCTION enrichment — P0 legal corrections + P1 security
bda89ce  refactor(daemon): full enrichment of ETERNAL_RESEARCH_CHILD
```

## Modified Files in This Release (vs bda89ce)

| File | Change Type |
|------|-------------|
| `backend/api/auth.py` | NEW — API-key authentication middleware |
| `backend/api/citation_registry.py` | NEW — Structural citation gate |
| `backend/api/routes.py` | MOD — Magic-byte upload + prompt injection defence |
| `backend/api/routes_copilot.py` | MOD — `datetime.now(UTC)` |
| `backend/api/routes_verify.py` | MOD — Structural registry verification |
| `backend/config.py` | MOD — Auth fields, Pydantic v2, hallucination threshold |
| `backend/main.py` | MOD — Auth middleware wired |
| `backend/rag/optimized_document_store.py` | MOD — LangChain import fix |
| `backend/tests/test_authentication.py` | NEW — 22 behavioral auth tests |
| `backend/tests/test_citation_registry.py` | NEW — 41 structural gate tests |
| `backend/tests/test_security_remediation.py` | NEW — 18 behavioral security tests |
| `src/__tests__/adversarial-citation-gate.test.ts` | NEW — 13 frontend adversarial tests |
| `src/features/deadlines/DeadlineBoard.tsx` | MOD — Working-day warning banner |
| `src/lib/case01-data.ts` | MOD — p13/p14/p16 downgraded VERIFIED→SECONDARY |
| `src/lib/verification-engine.ts` | MOD — Combined score removed, 3 SECONDARY entries |

## Deployment Targets

| Target | Configuration |
|--------|---------------|
| Frontend | Netlify — `netlify.toml` publish: `artifacts/legal-luminaire/dist/public` |
| Backend | Docker / uvicorn — `artifacts/legal-luminaire/backend/main.py` |
| Auth mode | `LL_API_KEY` env var — empty=disabled (dev), set=enforced (prod) |

## Remaining Production Blockers

1. `LL_API_KEY` must be set before any public-facing backend deployment
2. `APP_ENV=production` must be set to enforce CORS wildcard rejection
3. `LL_API_KEY` is a shared static key — not user-identity; see `AUTH_BOUNDARY_REVIEW.md`
4. No Redis rate limiting (in-memory only)
5. Court-use exports blocked pending certified legal source copies (11 items)
