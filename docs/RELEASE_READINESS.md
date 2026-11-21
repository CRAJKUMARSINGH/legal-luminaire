# Legal Luminaire — Release Readiness
**Last updated:** 2026-11-21  
**HEAD:** `47273bd`  
**Branch:** `main` (in sync with `origin/main` — PR #6 merged as `47273bd`)

---

## Regression baseline (current)

| Gate | Status | Detail |
|---|---|---|
| TypeScript check | ✅ PASS | `tsc --noEmit` — 0 errors |
| Frontend tests | ✅ PASS | 388/388 (Vitest 4) |
| Production build | ✅ PASS | Vite — 110+ chunks, no errors |
| Backend syntax | ✅ PASS | No import-time crashes |
| Citation gate tests | ✅ PASS | Included in 388 — PENDING always blocked |
| PENDING→blocked regression | ✅ PASS | Suite 9 CI guard (11 assertions) |

---

## Open blockers

### By release type

| Release | Blocked by | May proceed? |
|---|---|---|
| **Synthetic-data demo / staging** | — (P2-02 degrades the `/draft-variants` feature only) | ✅ Yes |
| **Confidential production** | SE-01 | ❌ No |
| **Court-use exports** | SE-01 + Legal sources (all 11 items) | ❌ No |

Full blocker set (**5**): `P2-01`, `P2-02`, `SE-01`, `SE-08`, `LEGAL-11` — details below.

---

### SE-01 — OIDC and case isolation
**Priority:** P0 (confidential production)  
**Detail:** `docs/blockers/SE-01-OIDC-CASE-ISOLATION.md`

Scoped API keys (`LL_API_KEY_SCOPES`) are deployed as an interim control.
Full OIDC (Authorization Code + PKCE, BFF server-side sessions, per-user case
ownership at every endpoint) is not implemented.

**Acceptance:** Criteria A–D in the blocker doc all verified, including
two-user/two-case cross-access test matrix against a real database.

---

### Legal source closure — 11 outstanding items
**Priority:** P0 (court-use exports)  
**Detail:** `docs/blockers/LEGAL-SOURCE-CLOSURE.md`

4 PENDING citations and 4 standards require certified copies / official
documents from courts, BIS, ASTM, and CPWD. 3 SECONDARY precedents require
certified copies before they can be promoted. All are procurement actions —
no engineering change needed.

**Acceptance:** All 11 items resolved with verified sources, qualified legal
review completed, and SE-01 also resolved.

---

### SE-08 — chromadb vulnerability exceptions
**Priority:** P1  
**Detail:** `docs/blockers/SE-08-CHROMADB-ADVISORIES.md`

4 advisories (2 Critical, 2 High) in `chromadb==1.5.9`. All assessed as
unreachable: backend uses embedded `PersistentClient` only. No `HttpClient`,
`trust_remote_code`, or `SimpleRBAC` in codebase. `pip-audit` active in CI
with per-advisory `--ignore-vuln` flags.

**Acceptance:** Patched version tested and deployed, or architecture change
eliminates the dependency. Exception void if `chromadb serve` or
`trust_remote_code` is introduced.

---

### P2-01 — Drafting package gap
**Priority:** P2  
**Detail:** `docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md`

9 Python source files (`drafting/` + `registry/`) were never committed.
Current runtime path (`api/routes_drafting.py` → Gemini) is fully functional
for `BRIEF | DISCHARGE | BAIL_439`. Missing: composable block layer,
~30-template catalog, structural placeholder validation, conflict detection,
prompt injection defence, and draft provenance tracking.

**Acceptance:** Either (A) product decision + ADR formally superseding the
package, or (B) rebuild from requirements with full test coverage.

---

### P2-02 — Pleading variants: missing data + unwired routes
**Priority:** P2  
**Detail:** `docs/blockers/P2-02-PLEADING-VARIANTS.md`

Two gaps: (A) `backend/data/subject_variants.json` was never committed, so every
registry-backed call in `services/variant_engine.py` fails; and (B)
`api/routes_pleading_variants.py` is **not registered** in `main.py` (17 routers are),
so the whole `/api/v1/variants/*` surface 404s. A browser-side **unhandled rejection**
on `/case/:id/draft-variants` (missing `.catch()` in `DraftVariantsPage.tsx`) is a live
defect — not a passing browser test.

**Acceptance:** A recorded decision to **register or retire** the feature; if
registered, a schema-valid `subject_variants.json` (no fabricated authorities) and an
intentionally registered router preserving the Fact-Fit Gate (428) and auth/case
scoping; the 2 registry-gated test skips resolved; and the browser unhandled rejection
fixed.

---

## Recommended execution order

1. **P2-01 + P2-02 first** — both are drafting-surface decisions and can be resolved
   together: P2-01 (recover/rebuild/retire the missing package) and P2-02
   (register/retire the variants feature + missing data). Fix the P2-02 browser defect
   immediately — it is independent of the decision.
2. **SE-01 second** — dedicated security-controlled implementation.
   Unlocks confidential production.
3. **SE-08 third** — reassess when a patched `chromadb` release ships.
   No action needed until then unless architecture changes.
4. **Legal source closure proceeds in parallel** — independent of engineering.
   Unlocks court-use export once SE-01 is also resolved.

---

## Archive of superseded reports

| Report | Location | Superseded by |
|---|---|---|
| Unwired files manifest | `audit-results/UNWIRED_FILES_MANIFEST.md` | This document (blocker tracking) |
| Unwired files resolution report | `audit-results/UNWIRED_FILES_RESOLUTION_REPORT.md` | Blockers in `docs/blockers/` |
| Prior release decisions | `audit-results/FINAL_RELEASE_DECISION.md`, `audit-results/RELEASE_DECISION.md` | This document |
| Prior production readiness | `final-deliverables/PRODUCTION_READINESS.md` | This document |
