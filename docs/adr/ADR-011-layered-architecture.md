# ADR-011 — Target architecture: layered application

**Date:** 2026-09-14  
**Status:** Accepted  
**Deciders:** Architecture Owner (User, default)

## Context

Three implicit shapes existed: modular monolith, dual backends as services, and informal layers. Dual FastAPI + Express on `:8000` is historical, not a designed split.

## Decision

The product is a **layered application with shared platform components**. Call direction is down only. FastAPI is the AI/agent Application Services sub-layer; Express is CRUD/ops (EXC-1 until Day 30).

Rejected: modular monolith (cannot merge Python and Node runtimes without a rewrite); bounded services (solo team, no ops budget).

## Consequences

New AI routes go to FastAPI. New CRUD/ops routes go to Express or wait for EXC-1 review. Import-direction violations need a control-rules exception.

Full shape: `.trae/recovery/week2/08_architecture_baseline.md`. Review: Day 30.
