# Legal Luminaire — Release Readiness
**Last updated:** 2026-11-25

**Branch:** `codex/code-junction-launch-hardening`

**Verification details:** [Launch hardening report](../LAUNCH_HARDENING_REPORT.md)

---

## Regression baseline (current)

| Gate | Status | Detail |
|---|---|---|
| TypeScript check | ✅ PASS | `tsc --noEmit` — 0 errors |
| Frontend tests | ✅ PASS | 388/388 (Vitest 4) |
| Production build | ✅ PASS | Vite — 110+ chunks, no errors |
| Backend checks | ✅ PASS | Syntax, selected Ruff checks and pytest |
| Citation gate tests | ✅ PASS | Deterministic scanner suite and 13 adversarial probes |
| Offline browser smoke | ✅ PASS | TC-01, Safe Draft, bilingual download and compatibility-route checks |

This section is the canonical current test/build baseline. Separate historical result snapshots are not retained as competing sources of truth. The dated browser summary is not a current full-route certification; a fresh route sweep, axe/Lighthouse checks, and live-backend staging verification remain outstanding.

---

## Open blockers

### By release type

| Release | Blocked by | May proceed? |
|---|---|---|
| **Synthetic-data demo / staging** | Legacy Pleading Chain links lead users to Safe Draft | ✅ Yes |
| **Confidential production** | SE-01 | ❌ No |
| **Court-use exports** | SE-01 + Legal sources (all 11 items) | ❌ No |

Open blockers (**3**): `SE-01`, `SE-08`, and `LEGAL-11`.

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

### P2-01 — Drafting package superseded

The existing Gemini-direct endpoints remain the backend drafting integration for advocate review. The frontend Draft Template Library serves template discovery. The provider-backed workflow remains subject to live validation. [ADR-010](adr/ADR-010-gemini-direct-drafting.md)

---

### P2-02 — Pleading Chain retired

The unused API and registry-dependent generation code were removed. The legacy URL shows a bilingual retirement notice with a link to Safe Draft. [ADR-011](adr/ADR-011-retire-pleading-chain.md)

---

## Recommended execution order

1. **SE-01** — complete and verify identity and case isolation.
   Unlocks confidential production.
2. **SE-08** — reassess when a patched `chromadb` release ships.
   No action needed until then unless architecture changes.
3. **Legal source closure proceeds in parallel** — independent of engineering.
   Unlocks court-use export once SE-01 is also resolved.
