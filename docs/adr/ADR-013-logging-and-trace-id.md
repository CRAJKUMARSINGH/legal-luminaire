# ADR-013 — Logging and request correlation

**Date:** 2026-09-14  
**Status:** Accepted  
**Deciders:** Architecture Owner (User, default)

## Context

Uvicorn access logs, named loggers, `print()` in scripts, and Express Pino JSON could not be joined.

## Decision

Application logs include `timestamp`, `level`, `module`/`name`, `trace_id`, `message`. `X-Request-ID` is read or generated and echoed. Implementation: `RequestIdMiddleware` + `TraceIdFilter`.

Rejected: full JSON shipper / OpenTelemetry this month (no G-4 owner, no aggregator).

## Consequences

Scripts may still `print()`. Uvicorn access log remains a second stream until Day 30 review.
