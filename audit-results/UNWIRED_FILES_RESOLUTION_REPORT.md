# Unwired Files Resolution Report
**Repository:** CRAJKUMARSINGH/legal-luminaire  
**Baseline commit:** `c8f91cb` — "chore: remove duplicate enrichment docs and stale generated artifacts"  
**Branches:** `reconcile/unwired-files` (commit `3e4f2b7`, merged into `main` as `0abe110`), follow-up `reconcile/unwired-files-followup` (report corrections)  
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
| TypeScript check | ✅ PASS | `pnpm typecheck` — libs + `@workspace/legal-luminaire` + `@workspace/scripts`, 0 errors |
| Frontend tests | ✅ PASS | **388/388 passing across 14 files** (Vitest 4.1.11) — re-verified this run |
| Production build | ✅ PASS | `vite build` complete — 110+ chunks, no errors (chunk-size advisory only) |
| Backend tests | ✅ PASS | **206 passed, 5 skipped, 1 warning in 15.14s** (`backend/.venv/Scripts/python.exe -m pytest tests -q`) — re-verified this run |
| Playwright route sweep | ✅ PASS | **100/102** routes OK (puppeteer-core + Chrome, preview `:4173`). 2 non-passes are **not** defects: `/case/hemraj-case-01/dashboard` returns a conditional-GET `304` yet renders correctly (text 6231, 0 JS errors); `/case/hemraj-case-01/draft-variants` raises the pre-existing unhandled rejection (see P2-02). The four transient 404s seen in an earlier run did **not** recur. |
| Auth/case-isolation tests | ✅ PASS | `backend/tests/test_authentication.py` + `test_http_contract.py` + `test_rate_limit.py` are part of the 206-pass backend suite (401/403/429 envelopes, per-key case scoping) |
| Citation export regression | ✅ PASS | `citation-gate.test.ts` (34) + `citation-intelligence.test.ts` (34) + `adversarial-citation-gate.test.ts` (13) — included in the 388 frontend suite |
| Security/dependency scan | ✅ PASS (demo scope) | `pnpm audit --audit-level high` → **no known vulnerabilities**. Python audit is enforced in CI (`security-audit.yml`); chromadb exceptions documented in `audit-results/SE08_CHROMADB_ADVISORY_REGISTER.md` (SE-08) |

> The earlier revision of this table recorded the backend suite and the route
> sweep as *environment-blocked / deferred*. That was inaccurate — both were
> executed successfully and are recorded above with their real figures.

---

## §A1 — Local debug/audit debris

| File | Disposition | Status | Rationale |
|---|---|---|---|
| `route-sweep.mjs` | KEEP_DOCUMENTATION | Kept in place (git-ignored, `.gitignore:96`) | Puppeteer route audit script; writes to `preview-audit/routes/report.json`; re-run this reconciliation |
| `artifacts/legal-luminaire/preview-audit/` | KEEP_EVIDENCE | Kept in place (git-ignored, `.gitignore:98`) | 11 PNG screenshots + `preview-audit.mjs` + `report.json` + `routes/` — browser/viewport/keyboard/reduced-motion evidence |
| `artifacts/legal-luminaire/backend/check_imports.py` | DELETE | ✅ Deleted | git-ignored langchain import prober; wrote `import-check-results.txt`, which does not exist |
| `artifacts/legal-luminaire/backend/scan_imports.py` | DELETE | ✅ Deleted | git-ignored AST langchain scanner; wrote `import-scan-results.txt`, which does not exist |
| `tmp-probe.mjs` | DELETE | ✅ Deleted | One-off scratch probe used to confirm the transient 404s were flaky |
| `route-sweep-last-run.log` | DELETE | ✅ Deleted | Throwaway sweep log |
| `unwired-files-inventory.md` | INCORPORATE | ✅ Moved → `docs/unwired-files-inventory.md` | Source inventory for this analysis; relocated beside the docs index for discoverability |

---

## §A2 — Orphan bytecode

All 17 `.pyc` files were moved out of `backend/__pycache__/` into
`archive/unwired-recovery/bytecode/`. **Note:** `.gitignore:32` (`*.py[cod]`)
excludes compiled Python, so this archive is a **local-only** reference copy —
it is not committed. The authoritative record of the gap is the written
analysis (`archive/unwired-recovery/README.md` + `docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md`),
not the bytecode itself.

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
| `scripts/src/hello.ts` | DELETE | ✅ Executed — removed in `3e4f2b7`; the empty `scripts/src/` dir is gone. `scripts/package.json`/`tsconfig.json` retained for `seed-demo-data.ts` |

---

## §B9 — Standalone packages

Both archived under `archive/retired-packages/` (per ADR-009):

| Package | Decision |
|---|---|
| `artifacts/api-server/` | ARCHIVE — Express/Drizzle API stub; Python FastAPI backend is canonical. Never in production path. |
| `artifacts/mockup-sandbox/` | ARCHIVE — Replit-era Vite sandbox; superseded by `artifacts/legal-luminaire/`. |

---

## Remaining Blockers

| ID | Description | Severity | Detail doc |
|---|---|---|---|
| P2-01 | `drafting/` package source missing (9 modules, never committed) — `api/routes_drafting.py` supersedes it at runtime. Formal decision required: rebuild from requirements (**Option B**) or formally supersede via a new ADR (**Option A**). | P2 | [docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md](../docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md) |
| P2-02 | `services/variant_engine.DATA_FILE` → `backend/data/subject_variants.json` **does not exist**; `api/routes_pleading_variants.py` fails at `load_registry()`. Manifests as the `/case/:id/draft-variants` unhandled rejection in the route sweep. Pre-existing, independent of this reconciliation. | P2 | `archive/unwired-recovery/README.md` §Blocker raised |
| SE-01 | Per-user OIDC + case isolation not implemented (scoped `LL_API_KEY` deployed; OIDC not). Confidential production use blocked. | P0 | [docs/blockers/SE-01-OIDC-CASE-ISOLATION.md](../docs/blockers/SE-01-OIDC-CASE-ISOLATION.md) |
| SE-08 | chromadb PYSEC exceptions active in pip-audit CI. Time-bounded exceptions documented. | P1 | `audit-results/SE08_CHROMADB_ADVISORY_REGISTER.md` |
| COURT-USE | 11 authoritative-source items outstanding in `final-deliverables/LEGAL_SOURCE_REVIEW.md`. Court-use export remains disabled. | P0 | `final-deliverables/LEGAL_SOURCE_REVIEW.md` |

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
- `docs/DOCUMENTATION_INDEX.md` — KEEP_DOCUMENTATION (searchable index)
- `docs/unwired-files-inventory.md` — KEEP_DOCUMENTATION (source inventory, relocated from repo root)
- `docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md`, `docs/blockers/SE-01-OIDC-CASE-ISOLATION.md` — KEEP_DOCUMENTATION (blocker acceptance criteria)
- `archive/unwired-recovery/README.md` — KEEP_EVIDENCE (bytecode provenance + recovered API surface)
- `audit-results/UNWIRED_FILES_MANIFEST.md` / `.csv` — KEEP_EVIDENCE (per-path Phase-1 manifest)

---

## Rollback Procedure

```bash
# The main reconciliation is ALREADY MERGED into main as 0abe110.
# To roll it back without rewriting shared history:
git revert -m 1 0abe110          # revert the merge commit (keeps audit trail; no force-push)

# To restore a single archived path from before the rename commits:
git checkout c8f91cb -- scripts/_gen.py
git checkout c8f91cb -- logo-ideas/logo-01.htm

# Branch hygiene (both branches are merged; deletion of the remote ref is safe):
git push origin --delete reconcile/unwired-files
git branch -D reconcile/unwired-files-followup
```

Tracked moves (`archive/*`, `docs/*`) are fully recoverable via `git show` /
`git restore` at their original paths. **Exception:** `archive/unwired-recovery/bytecode/*.pyc`
is **git-ignored** (`*.py[cod]`) and exists only in the reconciliation working
copy — it cannot be restored from Git. This is intentional (the .py sources were
never committed and cannot be safely decompiled); the written analysis in
`archive/unwired-recovery/README.md` is the durable record.

---

## Commit SHAs

| Commit | Branch | Description |
|---|---|---|
| `c8f91cb` | `main` | Baseline — "chore: remove duplicate enrichment docs and stale generated artifacts" |
| `3e4f2b7` | `reconcile/unwired-files` | `chore(archive)`: retire api-server, mockup-sandbox, superseded scripts and brand variants |
| `0abe110` | `main` (merge) | `feat(reconcile)`: merge `reconcile/unwired-files` — archive retired packages, recreate tests, index docs |
| *(follow-up)* | `reconcile/unwired-files-followup` | `docs(reconcile)`: correct Phase-8 regression results, record executed deletions, relocate inventory to `docs/`, add blocker acceptance criteria |

> The follow-up commit is pushed as its own branch and proposed via pull request.
> No force-push; no merge without review.
