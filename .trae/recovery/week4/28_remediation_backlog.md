# Week 4 — Day 28 Prioritized remediation backlog

> Remaining work after Days 22–26 module slices and Day 27 ADRs 011–015.

## Now

| Item | Owner | Why |
|------|-------|-----|
| Mark GitHub required checks on `main` | G-1 interim | CI exists but is not branch-protection |
| Set `LL_REQUIRE_LLM_KEYS=true` on any real FastAPI host | G-3 | Otherwise keys still fail late |
| Convert remaining routers to `abort()` (chronology, deadlines, derivative, oral, lab, …) | Backend | Envelope works globally; codes still generic |

## Next 30 days

| Item | Owner | Why |
|------|-------|-----|
| Fix `test_variant_engine.py` + caption parse; add to CI | Backend | EXC-CI-PYTEST-VARIANTS |
| Run `test_copilot.py` in CI with slim mocks | Backend | EXC-CI-PYTEST-COPILOT |
| Case-store unification ADR + adapter interface | Frontend | EXC-4 Day 27 follow-up |
| Search client router (EXC-3) | Frontend + G-2 | Three search impls |
| ESLint or confirm typecheck-only | G-4 | EXC-CI-ESLINT |
| Staging env design | G-1 / G-4 | EXC-5 |
| Express `/api/v1` envelope | Express | Day 10 exception |
| Fill G-1..G-4 with named people | Recovery Lead | Ownership gaps |

## Done this recovery

| Item | Note |
|------|------|
| Backend `listCases` must not replace localStorage | `mergeIncomingCases` — local ids win |

## Later

| Item | Why |
|------|-----|
| Dual-backend physical topology (nginx / ports / one runtime) | EXC-1 |
| mockup-sandbox UI consolidation | EXC-2 |
| Auth / sessions / CORS tighten | Day 7 §7 |
| JSON log aggregation | No shipper |
| TC-02..TC-21 uploaded_cases packs | Data gap |
| Python ↔ TS registry schema parity | G-2 |

Structural cleanup vs defects: CI exceptions and `abort()` conversion are structural. Variant tests are defects. Auth is a feature, not this recovery.
