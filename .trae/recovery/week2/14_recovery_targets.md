# Week 2 — Day 14 Recovery Targets

> Source: `detailed_recovery_plan.md` Week 2, Day 14. Selected from `13_detailed_risk_heatmap.md` §4 (high-change + high-risk).
> Recovery Lead / Architecture Owner: User (default). Interim owners follow `01_roles_and_ownership.md`.

---

## 1. Selected module list (exactly 3)

### Target 1 — FastAPI root + config

| Field | Content |
|-------|---------|
| **Owner** | User (interim) filling G-3 Auth/Config until a dedicated owner exists |
| **Reason for selection** | Highest composite in the heatmap (**4.86**), change frequency **5**. Every page hits `main.py`; empty-string env defaults turn missing secrets into late LLM failures (Day 7 config + Day 11 standard). |
| **Key problems** | (1) Required keys default to `""` so boot always succeeds. (2) Unstructured logging and mixed `print()` on lifespan. (3) No request-id middleware. (4) Ad-hoc `_check*.py` / `_inspect*.py` at backend root. (5) `start.bat` vs `start.sh` start different servers. |
| **Expected recovery outcome** | (1) Named owner recorded. (2) Boundary note: main = composition root only. (3) Dead debug scripts removed or moved to `scripts/`. (4) Startup validation matches Day 11. (5) `trace_id` middleware + required log fields. (6) Smoke test or documented pytest for health + missing-key boot. (7) CI still passes compile. (8) Unresolved items listed. |
| **Dependencies to coordinate** | G-3 owner; `.env.example` vs `Settings`; Docker Compose `REDIS_URL`; frontend `VITE_BACKEND_URL`; Release Owner (G-1) if start scripts change; do not block on Express (EXC-1). |
| **Review date** | Interim **Day 27**; final **Day 30** |

**Scope:** Fail-fast config, logging/correlation on the ASGI app, delete or quarantine root debug scripts, document lifespan. Align `start.bat`/`start.sh` to uvicorn if that is a small safe change.

**Out of scope:** Rewriting agents; merging Express into FastAPI; adding auth; provisioning staging (EXC-5); JSON log shipper vendor choice.

---

### Target 2 — API routes family

| Field | Content |
|-------|---------|
| **Owner** | User (default, provisional) — Backend services area |
| **Reason for selection** | Composite **4.29**, change frequency **5**. Eighteen routers are the Application Services AI/agent surface; Day 7 shows string vs dict `HTTPException.detail`. Week 4 must leave one error model (Day 10) on the recovered routers. |
| **Key problems** | (1) Incompatible error shapes. (2) Mix of `/api/v1` vs `/api` prefixes. (3) Almost no per-router tests. (4) Rate limiter declared in lifespan but not verified on expensive POSTs. (5) Routes contain too much logic that belongs in `agents/` / `drafting/`. |
| **Expected recovery outcome** | (1) Owner clear. (2) Boundary: routes parse → call domain → envelope. (3) Reduce dead/duplicate handlers where obvious. (4) Naming stays `routes_<domain>.py`. (5) Critical-path tests for at least health + one drafting or copilot route. (6) Errors/logs follow Day 10–11 on touched routers. (7) CI compile (and pytest if wired). (8) Remaining prefix exceptions documented. |
| **Dependencies to coordinate** | Target 1 middleware (`trace_id`, settings); Day 10 envelope; frontend `*-client.ts` parsers; Architecture Owner for any prompt-bearing route; `test_copilot.py` / `test_drafting_engine.py` as smoke anchors. |
| **Review date** | Interim **Day 27**; final **Day 30** |

**Scope:** Introduce shared error helper + envelope on recovered routers (start with `routes.py` health, `routes_copilot.py`, `routes_drafting.py` — highest traffic / existing tests). Document prefix exceptions. Do not mass-rename URLs.

**Out of scope:** Full rewrite of all 18 files in one PR; consolidating pleading-variants vs derivative routes (related but a separate later item); Express route migration.

---

### Target 3 — CaseContext + case-store + multi-case-store

| Field | Content |
|-------|---------|
| **Owner** | User (default, provisional) — Frontend applications |
| **Reason for selection** | Composite **4.29**, change frequency **4**. Every case-aware page reads these stores; two TypeScript models plus Express workspace DB (EXC-4). Hydration races documented in `MULTI_CASE_IMPLEMENTATION.md`. Week 4 can document the boundary and add tests without unifying storage. |
| **Key problems** | (1) Duplicate `CaseFile` shapes. (2) Unclear write authority (localStorage vs multi-case vs Express). (3) No unit tests. (4) Feature flags may switch stores without one interface. (5) Registry TS vs Python registry drift is adjacent (not in this target’s write set unless required). |
| **Expected recovery outcome** | (1) Owner clear. (2) Boundary note: Context holds the active `case_id`; stores are adapters (EXC-4). (3) Dead unused exports reduced. (4) File names stay kebab-case; document canonical types location. (5) Tests for hydrate/read of one store. (6) Client errors/logs: no new ad-hoc toast path. (7) Frontend CI/typecheck as available. (8) Unification deferred to Day 27 ADR, listed as unresolved. |
| **Dependencies to coordinate** | EXC-4; `src/cases/registry.ts`; Express workspace DB (read-only coordination); `routes.tsx` case-scoped pages; do not require RAG (Target postponed). |
| **Review date** | Interim **Day 27**; final **Day 30** |

**Scope:** Document adapter roles, freeze new duplicate types, add tests around hydration, stop adding a third store.

**Out of scope:** Migrating existing users’ localStorage; deleting `multi-case-store.ts`; implementing write-through cache; merging Python and TS registries (postponed with G-2).

---

## 2. Postponed modules

Next-highest from §4 intersection **not** selected:

| Module | Why deferred |
|--------|----------------|
| RAG + document store (composite 4.71) | Highest remaining risk but blocked on G-2, dual `document_store` APIs, and Chroma data. Too large for Days 22–26 without Target 1 boot/logging. Revisit Day 30. |
| Search trifecta (4.43) | EXC-3: keep three implementations until Day 30. Unifying search would compete with all three targets. |
| Feature flags duality (4.00) | Smaller than config.py; canonical file already named in Day 7 dup #1. Do after Target 1 so flag env validation has a home. |
| Registry + uploaded_cases | CF 3, missing TC-02..TC-21. Data pack repair is not a 2-day code recovery. G-2. |
| CI workflows | Week 3 Day 15 (`make CI mandatory`), not Week 4 module recovery. |
| Docker + Netlify + Vercel | G-4 ops; EXC-5 staging. Not a module cleanup. |
| Neo4j client | Low change frequency. |
| Drafting engine internals | Unknown-risk until call-graph audit. |
| mockup-sandbox / toast / academy | Explicitly excluded in Day 13 §6. |

---

## 3. Exit check

The team knows which modules get focused Week 4 work first: **(1) FastAPI root + config, (2) API routes family, (3) CaseContext + case stores.**

No other module receives Week 4 cleanup attention unless all three targets already meet the handbook definition of done **and** the Recovery Lead approves an add in writing.
