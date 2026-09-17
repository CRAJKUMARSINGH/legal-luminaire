# Week 1 — Recovery Roles & Ownership

> Source: `detailed_recovery_plan.md` Days 1–2. Default owners set below; replace names with real assignees as the team is staffed.
> Document created 2026-09-14 (Recovery Day 1).

## 1. Recovery Lead Roles

| Role | Named Owner | Notes / Rationale |
|------|-------------|-------------------|
| **Recovery Lead** | User (default) | Drives the 30-day effort, resolves cross-module blockers, approves exceptions to control rules, signs off on freeze lift at Day 29. |
| **Architecture Owner** | User (default) | Defends technical standards, approves new patterns/dependencies, owns architecture decision records (ADRs) starting Week 2 Day 27, signs off on target architecture at Week 2 Day 8. |
| **Release Owner** | UNOWNED — gap to resolve by Day 5 | Controls merges, owns CI/CD health and gate discipline, operates emergency hotfix flow, owns release notes and post-incident reviews. *Temporarily delegated to Recovery Lead until filled.* |
| **Documentation Owner** | User (default) | Ensures every standard, decision, and boundary gets written down; owns this recovery folder, engineering handbook (Week 2 Day 12), and ADR index. |

## 2. Module Ownership Matrix

Every important area has **one accountable owner**. "UNOWNED" rows are visibility gaps for the recovery board.

| Area / Module | Owner | Status | Notes |
|---------------|-------|--------|-------|
| **Frontend applications + shared UI**<br>(`artifacts/legal-luminaire/src`, `mockup-sandbox`) | User (default) | Provisional | Split responsibility expected later: pages vs shared `components/ui/`. |
| **Backend services + agents + APIs**<br>(`backend/api/`, `backend/agents/`, `backend/services/`, `main.py`) | User (default) | Provisional | Drafting agents, research agents, and routers currently share ownership; split before Week 3. |
| **Data layer + RAG + DB**<br>(`backend/rag/`, `backend/graph/`, `backend/registry/`, `backend/data/`, `backend/drafting/`) | UNOWNED — gap to resolve | — | RAG store, standards index, ChromaDB, Neo4j client are business-critical and currently share no explicit owner. |
| **Auth + identity + config**<br>(`backend/config.py`, `backend/.env.example`, feature flags) | UNOWNED — gap to resolve | — | Secrets handling, env-var validation, and feature-flag ownership need a named owner because both patches depend on flags. |
| **Deployment + infra + CI/CD**<br>(`.github/workflows/`, `docker-compose.yml`, `Dockerfile*`, `vercel.json`, `nginx.conf`, `start.*`) | UNOWNED — gap to resolve | — | No explicit release/infra owner today; this is the single biggest operational risk. |
| **Docs + product specs**<br>(`docs/`, `.kiro/specs/`, `.trae/specs/`, README family) | Documentation Owner | Active | Specs are scattered across 3 spec folders; consolidation in Week 2. |

## 3. Ownership Gap Register

These gaps must be resolved no later than **Day 5 (2026-09-18)**.

| # | Gap | Why it matters | Proposed assignee | Proposed deadline |
|---|-----|----------------|-------------------|-------------------|
| G-1 | Release Owner unfilled | Emergency changes have no accountable approver; CI bypass can't be audited. | User (interim) + delegate | Day 5 |
| G-2 | Data / RAG / Graph owner missing | RAG and vector-store changes affect all drafting features; drift risk is high. | User (interim) | Day 5 |
| G-3 | Auth + Config owner missing | Env/secrets/flag changes leak into patches unchecked (both patches reference flags). | User (interim) | Day 5 |
| G-4 | Infra + CI/CD owner missing | Workflows, Docker, Vercel deploy have no single owner; rollback ownership undefined. | User (interim) | Day 5 |

## 4. Delegation & Escalation Rules

1. Only the named owner (or Recovery Lead acting as interim) may approve PRs against their area.
2. If an owner is unavailable for > 48 hours, Recovery Lead appoints a backup **in writing** in this file.
3. Cross-area changes require both owners' approvals (equivalent to 2-reviewer rule for large PRs).
4. Ownership disputes → escalate to Recovery Lead → decision recorded here.

## 5. Temporary Merge Freeze (Day 1 – Day 29)

In effect per `detailed_recovery_plan.md` Day 1:

- **Frozen**: Merges to `main` for any non-critical feature PRs.
- **Allowed during freeze**: Patch-completion work for the two approved patches, recovery deliverables (this folder), critical hotfixes approved per Emergency Change Flow.
- **Lift date**: Day 29 (2026-10-13) — subject to explicit Recovery Lead sign-off with evidence that Week 3 gates (CI mandatory, PR template active, ownership mapping complete) are in place.
