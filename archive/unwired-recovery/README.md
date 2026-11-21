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
| `bytecode/drafting/*.pyc` (8 + `__init__`) | `backend/drafting/` | **UNCERTAIN** | `git log --diff-filter=A` shows these `.py` files were *never* committed. `test_drafting_engine` expected a ~30-template catalog (`TEMPLATES`, `resolve_legacy_draft_type`) and a skeleton builder (SOURCE CONTROL / VERIFICATION / LIST OF ANNEXURES / `Legal grounds` / `आधार`). No wired backend equivalent exists; `api/routes_drafting.py` uses a different, simpler Gemini-prompt path. |
| `bytecode/registry/*.pyc` (2) | `backend/registry/` | **SUPERSEDED** | Bytecode API is identical to the wired `backend/services/variant_engine.py` (`MatterContext`, `load_registry`, `subject_families`, `extract_matter_context`, `build_archetype_prompt`, `DATA_FILE = subject_variants.json`). `registry/` is a predecessor of the shipped service. |
| `bytecode/tests/test_variant_engine*.pyc` | `backend/tests/` | **RECREATED** | Targets `services.variant_engine`, which exists and is wired via `api/routes_pleading_variants.py`. Re-authored from the wired implementation (not decompiled): see `backend/tests/test_variant_engine.py` — 10 pass, 2 registry-gated tests skip (see BLOCKER P2-02). |
| `bytecode/tests/test_drafting_engine*.pyc` | `backend/tests/` | **UNCERTAIN** | Targets the missing `drafting` package. Recreated as a documented **skip stub** (`backend/tests/test_drafting_engine.py`) so the gap stays visible in CI (BLOCKER P2-01). |
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

## Blocker raised

**BLOCKER P2-01** — the `drafting` package is *required by a test* (`test_drafting_engine`)
but was never committed and cannot be safely reconstructed. Requires a product decision:
re-implement deliberately, or formally drop the drafting-layer epic.

**BLOCKER P2-02** — `services.variant_engine.DATA_FILE` resolves to
`backend/data/subject_variants.json`, which **does not exist** anywhere in the repo. The
wired route `api/routes_pleading_variants.py` will fail at `load_registry()`. This is a
pre-existing runtime gap independent of this reconciliation.
