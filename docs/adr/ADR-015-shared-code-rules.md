# ADR-015 — Shared code vs local duplication

**Date:** 2026-09-14  
**Status:** Accepted  
**Deciders:** Architecture Owner (User, default)

## Context

Duplicate `cn`/UI in mockup-sandbox, two flag registries, two case stores, three search stacks.

## Decision

Share a helper only if ≥3 consumers, identical signature, and no domain nouns. Otherwise keep it local.

Canonical now: `src/lib/utils.ts` (`cn`), two **live** flag files (`lib/featureFlags.ts` integration + `config/featureFlags.ts` hybrid), `case-store.ts` as SPA write adapter.

Rejected this month: merging flag files (CI grep depends on `lib/featureFlags.ts`); unifying search (EXC-3); deleting multi-case-store (EXC-4); deleting sandbox UI (EXC-2).

## Consequences

Do not add a third flag registry or third case store. Exceptions review Day 27–30.
