# Unwired Recovery — Archived Evidence

This folder preserves the **only surviving evidence** of modules and tests that were
present in the working tree but **never committed** to Git (their `.pyc` bytecode was
the last remnant). Sources could not be recovered from history, and Python 3.14
bytecode cannot be reliably decompiled, so the bytecode is archived here rather than
reconstructed from inference (which would risk fabricating legal logic).

Baseline: `c8f91cb` · Branch: `reconcile/unwired-files`

## What was archived and why

| Archived files | Origin | Classification | Reason |
|---|---|---|---|
| `bytecode/drafting/*.pyc` (8 + `__init__`) | `backend/drafting/` | **SUPERSEDED** | `git log --diff-filter=A` shows these `.py` files were *never* committed. `test_drafting_engine` expected a ~30-template catalog (`TEMPLATES`, `resolve_legacy_draft_type`) and a skeleton builder (SOURCE CONTROL / VERIFICATION / LIST OF ANNEXURES / `Legal grounds` / `आधार`). ADR-010 supersedes the package; `api/routes_drafting.py` remains the canonical Gemini-direct path. |
| `bytecode/registry/*.pyc` (2) | `backend/registry/` | **RETIRED** | Bytecode API matches the former `backend/services/variant_engine.py` (`MatterContext`, `load_registry`, `subject_families`, `extract_matter_context`, `build_archetype_prompt`, `DATA_FILE = subject_variants.json`). The Pleading Chain was retired under ADR-011; this is historical evidence only. |
| `bytecode/tests/test_variant_engine*.pyc` | `backend/tests/` | **RETIRED** | Targeted the former `services.variant_engine`. The source, router, and test were removed with the Pleading Chain under ADR-011; only the archived bytecode remains. |
| `bytecode/tests/test_drafting_engine*.pyc` | `backend/tests/` | **SUPERSEDED** | Targeted the missing `drafting` package. A documented **skip stub** (`backend/tests/test_drafting_engine.py`) preserves the historical gap after ADR-010 superseded the package. |
| `bytecode/tests/test_health_route*.pyc` | `backend/tests/` | **HISTORICAL → RECREATED** | Original targeted `api.routes_health`, `RequestIdMiddleware`, `register_error_handlers` — removed runtime. Re-authored against the CURRENT wired health surface (`backend/tests/test_health_route.py`). |
| `bytecode/tests/test_http_contract*.pyc` | `backend/tests/` | **HISTORICAL → RECREATED** | Original targeted `api.request_context.current_trace_id` and the `api.http_errors` envelope — removed runtime. Re-authored against the CURRENT auth/429/404 envelope contract (`backend/tests/test_http_contract.py`). |
| `bytecode/tests/test_rate_limit*.pyc` | `backend/tests/` | **HISTORICAL → RECREATED** | Original targeted `api.rate_limit.RateLimiter` / `is_expensive_endpoint` — removed (limiter now lives inline in `main.py`). Re-authored against the CURRENT limiter (`backend/tests/test_rate_limit.py`), extracting the real functions from `main.py` via AST. |

## Recovered API surface (for the drafting layer, from bytecode constants)

`drafting/` was an "advocate-grade drafting generation layer" with, at minimum:
`architecture`, `blocks`, `catalog`, `conflicts`, `engine`, `grounds`, `placeholders`,
`prompts`. The catalog exposed ~30 templates across `criminal` / `civil` with a per-template
`starter` flag; `engine.resolve_legacy_draft_type()` mapped legacy request types
(`BAIL_439 → regular_bail`, `DISCHARGE → discharge`, `BRIEF → defence_brief`); the skeleton
carried `[Information required: …]` placeholders plus SOURCE CONTROL / VERIFICATION /
LIST OF ANNEXURES sections and marked output `NOT filing-ready`.

## Decision records

**P2-01 / ADR-010 — CLOSED.** The `drafting` package was never committed and cannot be safely reconstructed. ADR-010 supersedes it with the existing Gemini-direct drafting path; the skip stub remains as historical evidence.

**P2-02 / ADR-011 — CLOSED.** The Pleading Chain variant engine, router, frontend client, and test were retired. The missing `subject_variants.json` registry is not a current runtime requirement, and the legacy URL now links to Safe Draft with a retirement notice.
