# Legal Luminaire — Release Readiness
**Last updated:** 2026-11-21  
**HEAD:** `0abe110`  
**Branch:** `main` (in sync with `origin/main`)

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
| **Synthetic-data demo / staging** | — | ✅ Yes |
| **Confidential production** | SE-01 | ❌ No |
| **Court-use exports** | SE-01 + Legal sources (all 11 items) | ❌ No |

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

## Recommended execution order

1. **P2-01 first** — establish whether the missing source is needed or superseded.
   Low risk; makes the CI skip stub green or removes it entirely.
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
