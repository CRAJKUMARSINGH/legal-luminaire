# Week 4 — Day 27 Architecture decision records

> Source: `detailed_recovery_plan.md` Day 27.

Short ADRs live in `docs/adr/`. This file is the recovery index only.

| ADR | Decision | Alternatives rejected | Exceptions / review |
|-----|----------|----------------------|---------------------|
| [ADR-011](../../../docs/adr/ADR-011-layered-architecture.md) | Layered app with shared platform | Modular monolith; bounded services | EXC-1 dual backends — Day 30 |
| [ADR-012](../../../docs/adr/ADR-012-http-error-envelope.md) | FastAPI envelope + `abort()` | RFC-7807 this month; Express-first | Express until Day 27+; health success unenveloped |
| [ADR-013](../../../docs/adr/ADR-013-logging-and-trace-id.md) | `trace_id` + `X-Request-ID` | OpenTelemetry / JSON shipper | Uvicorn access log; script `print()` |
| [ADR-014](../../../docs/adr/ADR-014-config-and-llm-keys.md) | Env Settings; `LL_REQUIRE_LLM_KEYS` | Always-required keys | Default false until production |
| [ADR-015](../../../docs/adr/ADR-015-shared-code-rules.md) | Share only if ≥3 consumers, same signature, no domain leak | Merge flags / search / stores this month | EXC-2, EXC-3, EXC-4 |

CI verifies ADR-001 through ADR-015 exist.
