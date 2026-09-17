# Week 4 — Days 24–25: API routes family recovered (slice)

> Target 2 from `14_recovery_targets.md`. Owner: User (provisional). Review: Day 27 / Day 30.

## Module boundary

Application Services AI/agent sub-layer: `backend/api/routes_*.py`.

Rule: parse request → call `agents/` / `services/` / `drafting/` → serialize. Errors via `abort()` or global HTTPException handler (`api/http_errors.py`).

## Recovered this phase

| Router | Change |
|--------|--------|
| `routes_health.py` | Isolated probe; no RAG/agents |
| `routes_copilot.py` | `abort()` for flag-off and retrieval failure |
| `routes_drafting.py` | `abort(404)` when case missing |
| `routes.py` (legacy mega-router) | Several 503/404/500 paths use `abort()` |

Global handler still wraps leftover string `HTTPException` on other routers.

## Prefix exceptions (do not mass-rename)

| Include in `main.py` | Prefix | Notes |
|----------------------|--------|--------|
| Most FastAPI routers | `/api/v1` | Canonical for new routes |
| `legal_stream_router` | `/api/legal` | SSE surface |
| `similarity_router`, `analytics_router`, `graph_router` | none (router-owned paths) | Known exception |
| `pleading_variants_router` | `/api` | Not `/api/v1` — EXC until Day 30 |

## Out of scope (documented)

- Rewriting remaining `HTTPException` in chronology, deadlines, derivative, oral, lab, search, graph, similarity, collision, pleading_variants.
- Merging derivative vs pleading-variant families.
- Express envelopes (EXC-1 / Day 27).

## Tests

Health + `abort()` envelope + rate-limit markers. Copilot integration tests stay EXC-CI-PYTEST-COPILOT.

## Exit check

Touched routers match Day 10 errors and Day 11 logs well enough to be the example. Other routers inherit the envelope when they raise `HTTPException`.
