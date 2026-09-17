# ADR-014 — Configuration and LLM keys

**Date:** 2026-09-14  
**Status:** Accepted  
**Deciders:** Architecture Owner (User, default)

## Context

`config.py` defaulted API keys to `""`, so the process always booted and failed on first LLM call. `.env.example` called those keys required.

## Decision

- Config loads from env / `.env` via Pydantic Settings.
- `LL_REQUIRE_LLM_KEYS` (default **false**) when true fails boot without `OPENAI_API_KEY`.
- Production should set the flag true. CI/local SPA-only stay false (EXC-LLM-KEYS-DEFAULT-OFF, review Day 30).
- Secrets only in env; never logged.

Rejected: always-required keys (breaks CI and demo without OpenAI).

## Consequences

Operators must set `LL_REQUIRE_LLM_KEYS=true` on any real backend deploy.
