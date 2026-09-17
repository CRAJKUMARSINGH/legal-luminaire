# ADR-012 — HTTP error envelope

**Date:** 2026-09-14  
**Status:** Accepted  
**Deciders:** Architecture Owner (User, default)

## Context

FastAPI routers mixed string `HTTPException.detail` and dict details. Clients could not parse errors uniformly.

## Decision

Canonical error JSON: `success: false`, `error.code`, `error.message`, `error.details`, `error.trace_id`, `error.timestamp`. Routes should `abort()`. Global handlers convert remaining `HTTPException` and validation errors.

Rejected: RFC-7807 problem+json (would be a third shape this month); Express-first envelope (Express migrates Day 27+).

Health success stays `HealthResponse` without envelope.

## Consequences

`api/http_errors.py` is the translation boundary. Agents must not raise `HTTPException`.
