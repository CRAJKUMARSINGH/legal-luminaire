# Unwired Files Resolution Report
**Repository:** CRAJKUMARSINGH/legal-luminaire  
**Baseline commit:** `c8f91cb` — "chore: remove duplicate enrichment docs and stale generated artifacts"  
**Branch:** `reconcile/unwired-files`  
**Report date:** 2026-11-21  
**Authored by:** Kiro reconciliation run, Phases 1–9

---

## Executive Summary

| Category | Files | Disposition |
|---|---:|---|
| A1 — Local debug/audit debris | 7 | ARCHIVE / DELETE (see §A1) |
| A2 — Orphan `.pyc` bytecode | 17 | ARCHIVE — source unrecoverable from Git history; functionality superseded |
| A3 — Missing test modules | 5 | RECREATED against current wired contracts |
| B1 — Root-level report files | 50+ | KEEP_EVIDENCE — preserved in place, indexed |
| B2 — Artifact reports | 23 | KEEP_EVIDENCE — preserved in place, indexed |
| B3 — Documentation files | ~102 | KEEP_DOCUMENTATION — indexed in `docs/DOCUMENTATION_INDEX.md` |
| B4 — .kiro / .trae specs | 28 | KEEP_DOCUMENTATION — active requirements retained |
| B5 — Legal deliverables | 26 | KEEP_EVIDENCE — court-use block maintained |
| B6 — Brand assets | 50 | CURATED — logo-01.htm bundle → archive; approved assets kept |
| B7 — Forensic FAQs | 2 | KEEP_DOCUMENTATION |
| B8 — Scripts | 15 | Mixed — see §B8 |
| B9 — Standalone packages | 2 | ARCHIVE — api-server and mockup-sandbox → `archive/retired-packages/` |

---

## Regression Results (Phase 8)

| Gate | Result | Detail |
|---|---|---|
| TypeScript check | ✅ PASS | `tsc --noEmit` — 0 errors |
| Frontend tests | ✅ PASS | 388/388 passing (Vitest 4) |
| Production build | ✅ PASS | Vite build complete — 110+ chunks, no errors (chunk-size advisory only) |
| Backend tests | ⚠️ ENVIRONMENT | Python output capture blocked by shell environment; test files verified syntactically |
| Playwright route sweep | ⚠️ DEFERRED | Requires running frontend server + Chrome; evidence already in `artifacts/legal-luminaire/preview-audit/` |
| Auth/case-isolation tests | ⚠️ DEFERRED | Backend environment dependency; test file `test_authentication.py` exists and is tracked |
| Citation export regression | ✅ COVERED | `adversarial-citation-gate.test.ts` (388 total includes citation gate tests) |
| Security/dependency scan | ⚠️ OPEN | SE-08 chromadb exceptions documented in `audit-results/SE08_CHROMADB_ADVISORY_REGISTER.md` |

---

## §A1 — Local debug/audit debris

| File | Disposition | Rationale |
|---|---|---|
| `route-sweep.mjs` | KEEP_DOCUMENTATION | Puppeteer route audit script; references `preview-audit/` output already in repo |
| `artifacts/legal-luminaire/preview-audit/` | KEEP_EVIDENCE | Contains screenshots and report from last Puppeteer sweep |
| `artifacts/legal-luminaire/backend/check_imports.py` | (not found — already removed) | — |
| `artifacts/legal-luminaire/backend/scan_imports.py` | (not found — already removed) | — |
| `unwired-files-inventory.md` | INCORPORATE → staged | Source of this analysis; will be committed as `docs/unwired-files-inventory.md` |

---

## §A2 — Orphan bytecode

All 17 `.pyc` files moved to `archive/unwired-recovery/bytecode/` during this reconciliation:

```
archive/unwired-recovery/bytecode/drafting/
  architecture.cpython-314.pyc
  blocks.cpython-314.pyc
  catalog.cpython-314.pyc
  conflicts.cpython-314.pyc
  engine.cpython-314.pyc
  grounds.cpython-314.pyc
  placeholders.cpython-314.pyc
  prompts.cpython-314.pyc
  __init__.cpython-314.pyc

archive/unwired-recovery/bytecode/registry/
  derivative_drafts.cpython-314.pyc
  __init__.cpython-314.pyc

archive/unwired-recovery/bytecode/tests/
  test_drafting_engine.cpython-314-pytest-9.1.1.pyc
  test_health_route.cpython-314-pytest-9.1.1.pyc
  test_http_contract.cpython-314-pytest-9.1.1.pyc
  test_rate_limit.cpython-314-pytest-9.1.1.pyc
  test_variant_engine.cpython-314-pytest-9.1.1.pyc
  test_variant_engine.cpython-314.pyc
```

**Finding:** No `drafting/` or `registry/` Python source was ever committed to the repository (confirmed via `git log --all --diff-filter=D`). The `.pyc` targets `api/routes_drafting.py` for the runtime path, which uses Gemini-prompt-based generation — the drafting package is **superseded at runtime**. Python 3.14 bytecode cannot be reliably decompiled; reconstructing legal drafting logic by inference would risk fabricating legal content, which the accuracy rules prohibit.

**Decision:** Source treated as **UNCERTAIN — required and missing (BLOCKER P2-01)**. Bytecode archived for reference. The gap is documented in `test_drafting_engine.py` (skip stub).

---

## §A3 — Recreated test modules

Five test files recreated against **current wired contracts** (not decompiled from bytecode):

| File | Status | Coverage |
|---|---|---|
| `tests/test_drafting_engine.py` | ✅ Created | Skip stub documenting the drafting-layer gap; routes_drafting coverage deferred to P2-01 |
| `tests/test_health_route.py` | ✅ Created | GET /api/v1/health, GET /api/v1/copilot/health — both auth-exempt |
| `tests/test_http_contract.py` | ✅ Created | 401/403/429 auth/rate-limit envelopes; /api/v1 prefix; 404 shape |
| `tests/test_rate_limit.py` | ✅ Created | In-memory rate limiter from main.py via AST extraction; 60s window; isolation; bypass resistance |
| `tests/test_variant_engine.py` | ✅ Created | services/variant_engine.py — matter context, archetype prompt, citation slots, placeholders |

---

## §B8 — Script decisions

| File | Disposition | Rationale |
|---|---|---|
| `scripts/autopilot-one-hour.ps1` | KEEP_RUNTIME | Updated: removed mock-sandbox/api-server build steps; added `--run` to Vitest; safe — no destructive ops |
| `scripts/clean.ps1` | KEEP_RUNTIME | Housekeeping utility; kept as-is |
| `scripts/generate_discharge_english.py` | KEEP_DOCUMENTATION | Canonical English-side discharge generator; referenced in output_100426/README.md |
| `scripts/generate_discharge_pdf.py` | KEEP_RUNTIME | Canonical PDF export; referenced in output_100426/README.md |
| `scripts/gen_discharge_v5.py` | KEEP_DOCUMENTATION | v5 generator; produces output_100426 HTML; keep as historical record |
| `scripts/load_test_sim.py` | ARCHIVE → `archive/retired-scripts/` | Dev utility; not referenced by CI or production paths |
| `scripts/post-merge.sh` | KEEP_RUNTIME | Used in release workflow (`pnpm install + db push`) |
| `scripts/scan_markdown_duty.py` | KEEP_RUNTIME | Documentation reconciliation; useful for future MD duty scans |
| `scripts/seed-demo-data.ts` | KEEP_RUNTIME | Reproducible synthetic demo seeding |
| `scripts/package.json` | KEEP_RUNTIME | Required for TypeScript scripts |
| `scripts/tsconfig.json` | KEEP_RUNTIME | Required while TypeScript scripts remain |
| `scripts/_gen.py` | ARCHIVE → `archive/retired-scripts/` | Utility replaced by canonical generators |
| `scripts/audit_scatter.ts` | ARCHIVE → `archive/retired-scripts/` | On-demand audit tool; not in active use |
| `scripts/gen_discharge_v4.py` | ARCHIVE → `archive/retired-scripts/` | Historical v4 generator |
| `scripts/src/hello.ts` | DELETE | Unused starter stub; `console.log("Hello from @workspace/scripts")` only |

---

## §B9 — Standalone packages

Both archived under `archive/retired-packages/` (per ADR-009):

| Package | Decision |
|---|---|
| `artifacts/api-server/` | ARCHIVE — Express/Drizzle API stub; Python FastAPI backend is canonical. Never in production path. |
| `artifacts/mockup-sandbox/` | ARCHIVE — Replit-era Vite sandbox; superseded by `artifacts/legal-luminaire/`. |

---

## Remaining Blockers

| ID | Description | Severity |
|---|---|---|
| P2-01 | `drafting/` package source missing — `api/routes_drafting.py` currently supersedes it at runtime. Formal decision: re-implement from requirements spec or permanently drop. | P2 |
| SE-01 | Per-user OIDC + case isolation not implemented. Confidential production use blocked. | P0 |
| SE-08 | chromadb PYSEC exceptions active in pip-audit CI. Time-bounded exceptions documented. | P1 |
| COURT-USE | 11 authoritative-source items outstanding in `final-deliverables/LEGAL_SOURCE_REVIEW.md`. Court-use export remains disabled. | P0 |

---

## Files Preserved (key evidence)

- `final-deliverables/LEGAL_SOURCE_REVIEW.md` — KEEP_EVIDENCE
- `final-deliverables/SECURITY_EXCEPTIONS.md` — KEEP_EVIDENCE
- `final-deliverables/PRODUCTION_READINESS.md` — KEEP_EVIDENCE
- `final-deliverables/ROLLBACK_RUNBOOK.md` — KEEP_EVIDENCE
- `audit-results/SE01_AUTH_AND_CASE_ISOLATION.md` — KEEP_EVIDENCE
- `audit-results/SE08_CHROMADB_ADVISORY_REGISTER.md` — KEEP_EVIDENCE
- `audit-results/FINAL_RELEASE_DECISION.md` — KEEP_EVIDENCE
- All `real_cases/CASE01_HEMRAJ_STATE_2025/` — KEEP_EVIDENCE (legal source records)

---

## Rollback Procedure

```bash
# To undo the reconciliation branch entirely:
git checkout main
git branch -D reconcile/unwired-files
git push origin --delete reconcile/unwired-files

# To undo individual commits after merge:
git revert <sha>   # do NOT use git reset on a shared branch
```

The archive/ directory is tracked in Git. All moved files remain recoverable via `git show` or `git restore` using the original paths from before the rename commits.

---

## Commit SHAs

| Commit | Description |
|---|---|
| `c8f91cb` | Baseline — chore: remove duplicate enrichment docs |
| (this PR) | feat(reconcile): archive retired packages, recreate test stubs, delete hello.ts |
| (this PR) | docs(reconcile): documentation index + unwired files inventory + resolution report |
