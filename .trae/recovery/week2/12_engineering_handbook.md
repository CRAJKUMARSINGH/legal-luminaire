# Week 2 — Day 12 Engineering Handbook

> Source: `detailed_recovery_plan.md` Day 12. Condenses Days 8–11 plus `02_control_rules.md`.
> Full text: `08_architecture_baseline.md`, `09_code_organization_standard.md`, `10_api_contract_standard.md`, `11_logging_and_config_standard.md`.
> If a case is not covered here, ask the Architecture Owner. Do not invent a new pattern.

---

## 1. Target architecture

**Decision:** layered application with shared platform components.

**Shape:** Presentation → Feature → Orchestration → Application Services (FastAPI = AI/agent; Express = CRUD/ops) → Domain/Agent → Shared Platform → Data. Calls go **down only**.

**Exceptions (unchanged until review):** EXC-1 both backends stay (Day 30); EXC-2 mockup-sandbox stays (Day 27); EXC-3 three search impls stay (Day 30); EXC-4 three case stores stay (Day 27); EXC-5 no staging (Day 30).

---

## 2. Code organization

| Put | Where |
|-----|--------|
| New SPA page | `src/pages/FooPage.tsx` + `routes.tsx` |
| Feature-owned hook/types | `src/features/<Name>/` |
| Shared hook (≥2 features) | `src/hooks/use-<name>.ts` |
| HTTP client | `src/lib/*-client.ts` |
| UI primitive | `src/components/ui/` |
| AI/agent HTTP | `backend/api/routes_<domain>.py` |
| CRUD HTTP | `artifacts/api-server/src/routes/` |
| Agent/service logic | `backend/agents/` or `backend/services/` — never in the route |
| Tests | `backend/tests/test_<module>.py` / `<module>.test.ts[x]` |

**Names:** pages/components PascalCase `.tsx`; lib/hooks kebab-case; backend `snake_case.py` and `routes_<domain>.py`; DTOs in a `models.py`, not scattered.

**Share** if ≥3 consumers, same signature, no domain nouns. **Keep local** if domains will diverge.

**Forbidden:** `lib/` → `pages/` or `features/`; `agents/` → `api/`; SPA → `mockup-sandbox`.

---

## 3. Interface rules

- JSON requests; `X-Request-ID` in/out.
- FastAPI success: `{ success, data, meta: { trace_id, timestamp } }`.
- FastAPI error: `error.code`, `error.message`, `error.details`, `error.trace_id`, `error.timestamp`.
- New FastAPI paths: `/api/v1`. Express new paths: `/api/v1`. Old Express unenveloped routes until Day 27.
- Validate at entry (DTO) → domain (agents/services) → persistence (registry/DB). Agents do not raise `HTTPException`.

---

## 4. Logging and config

**Log fields:** `timestamp`, `level`, `message`, `trace_id`, `module` (+ `case_id` when known).

| Level | Use |
|-------|-----|
| DEBUG | Local diagnosis; no secrets, no full prompts |
| INFO | Successful request lifecycle |
| WARNING | Degraded but continuing (Redis down) |
| ERROR | Request failed |
| CRITICAL | Boot or process cannot continue |

Generate `trace_id` if `X-Request-ID` missing; propagate into agents/RAG.

**Config:** Vite `import.meta.env`; FastAPI `BaseSettings` + `.env`; Express `process.env`; Compose/platform env. Required LLM keys: **fail boot** (`Field(min_length=1)`), never default `""`. Secrets only via env; redact `_KEY`/`_SECRET`/`_TOKEN` in logs.

---

## 5. PR and review rules

From `02_control_rules.md` (not weakened):

- Source of truth: `main`. Branches: `recovery/`, `fix/`, `feat/` (frozen unless Recovery Lead writes approval), `hotfix/`, `chore/`.
- Size: ≤400 one area owner; 401–1000 owner + peer; >1000 two reviewers including owner **and** Recovery Lead written approval. Recovery markdown in `.trae/recovery/` is exempt from LOC caps.
- One approval from the area owner. No self-merge. Merge = Release Owner or Recovery Lead. CI green (enforced Week 3 Day 15; red CI before that is a §4 exception row).
- Drafting/agent/prompt PRs also need Architecture Owner.
- Reviewer checks: owner sign-off, no new pattern, size, smoke tests, risk low/medium/high with rollback note if medium/high.
- Hotfix: production restore or data-loss only; `hotfix/<id>-<slug>`; both Recovery Lead and Release Owner; post-hoc review in 24h; log in exception register.

---

## 6. Definition of done for a recovered module

A module is recovered for this phase if:

- it has a clear owner
- its boundary is documented
- dead or duplicate code has been reduced
- naming and structure are aligned enough with the standard
- critical-path tests exist or were improved
- logging and error handling follow the current standard
- CI passes
- unresolved issues are documented

---

## 7. How to use this handbook

Read this file first. Open 08–11 when placing a file, writing a route, or changing logs/env. Control rules stay in `02_control_rules.md`. Ownership stays in `01_roles_and_ownership.md`.
