# Week 2 — Day 13 Detailed Risk Heatmap

> Source: `detailed_recovery_plan.md` Week 2, Day 13. Extends Week 1 `06_risk_heatmap.md` with 1–5 scores on seven dimensions.
> Scoring is reproducible: use §1 anchors; composite is defined in §2. Bucket labels match Day 7. Reclassification vs Week 1 is in §5 (none in this pass).

---

## 1. Scoring rubric (1 / 3 / 5)

| Dimension | 1 | 3 | 5 |
|-----------|---|---|---|
| **Business criticality** | No user journey depends on it (sandbox, toast chrome). | Used by one or more features, not every case. | Every case or every page goes through it, or loss is non-recoverable. |
| **Change frequency** | Touched rarely (infra files, graph client). | Touched some weeks (agents, copilot). | Touched by almost every patch (main.py, many routers, case store). |
| **Defect history** | No documented races, missing files, or CI holes. | Some inventory issues, limited blast radius. | Documented races, empty-key boot, missing TC packs, dual stacks on :8000. |
| **Ownership clarity** | UNOWNED G-1..G-4 or disputed. | User (default) provisional. | Named owner, no dispute, backup recorded. |
| **Test quality** | No automated tests on the happy path; CI skips pytest. | Some tests exist (e.g. `test_copilot.py`) or compile-only CI. | Critical path covered and run in CI. |
| **Dependency complexity** | Few deps, one runtime. | Several packages or two stores. | LLM + RAG + Redis + dual backends + frontend stores. |
| **Runtime fragility** | Failure is cosmetic. | Feature degrades. | Boot/request path fails opaquely or data diverges. |

Ownership clarity and test quality are **health** scores (higher is better). The other five are **pressure** scores (higher is more dangerous).

---

## 2. Composite risk

For each module:

```
inverted_ownership = 6 - ownership_clarity
inverted_tests     = 6 - test_quality
composite = average of:
  business_criticality,
  change_frequency,
  defect_history,
  inverted_ownership,
  inverted_tests,
  dependency_complexity,
  runtime_fragility
```

**Overall risk** = composite rounded to 2 decimals. **High risk** = composite ≥ 4.00. **High change** = change frequency ≥ 4.

Week 1 bucket is copied unless §5 says otherwise.

---

## 3. Scored table (≥ 10 modules)

Scores are 1–5 integers. Owner column is Week 1 status.

| Module | Paths (abbrev.) | BC | CF | DH | OC | TQ | DC | RF | Composite | Week 1 bucket | Owner |
|--------|-----------------|----|----|----|----|----|----|----|-----------|---------------|-------|
| FastAPI root + config | `backend/main.py`, `config.py` | 5 | 5 | 4 | 1 | 1 | 5 | 5 | 4.86 | business-critical-and-unstable | UNOWNED [G-3] |
| API routes family | `backend/api/routes*.py` | 5 | 5 | 4 | 3 | 2 | 5 | 4 | 4.29 | business-critical-and-unstable | User (provisional) |
| RAG + document store | `backend/rag/` | 5 | 4 | 4 | 1 | 1 | 5 | 5 | 4.71 | business-critical-and-unstable | UNOWNED [G-2] |
| CaseContext + case stores | `CaseContext.tsx`, `case-store.ts`, `multi-case-store.ts` | 5 | 4 | 4 | 3 | 1 | 4 | 5 | 4.29 | business-critical-and-unstable | User (provisional) |
| Registry + uploaded_cases | `backend/registry/`, `src/cases/registry.ts` | 5 | 3 | 3 | 1 | 1 | 4 | 4 | 4.14 | business-critical-and-unstable | UNOWNED [G-2] |
| Search trifecta | `lib/search.ts`, `legal-search-client.ts`, `routes_search.py` | 5 | 4 | 3 | 1 | 1 | 5 | 4 | 4.43 | business-critical-and-unstable | UNOWNED [G-2] |
| Feature flags duality | `config/featureFlags.ts`, `lib/featureFlags.ts` | 4 | 4 | 3 | 1 | 1 | 3 | 4 | 4.00 | business-critical-and-unstable | UNOWNED [G-3] |
| CI workflows | `.github/workflows/ci.yml`, `security-audit.yml` | 5 | 3 | 4 | 1 | 2 | 3 | 4 | 4.00 | business-critical-and-unstable | UNOWNED [G-4][G-1] |
| Docker + Netlify + Vercel | Dockerfiles, `vercel.json`, `nginx.conf`, compose | 5 | 2 | 3 | 1 | 1 | 4 | 4 | 4.00 | business-critical-and-unstable | UNOWNED [G-4] |
| Neo4j graph client | `backend/graph/neo4j_client.py` | 4 | 2 | 3 | 1 | 1 | 4 | 5 | 4.00 | business-critical-and-unstable | UNOWNED [G-2] |
| Agents family | `backend/agents/` | 5 | 3 | 2 | 3 | 2 | 4 | 3 | 3.43 | business-critical-but-stable | User (provisional) |
| Express api-server | `artifacts/api-server/src/` | 4 | 2 | 2 | 3 | 2 | 3 | 2 | 2.86 | business-critical-but-stable | User (provisional) |
| Frontend `routes.tsx` | `src/routes.tsx` | 5 | 4 | 2 | 3 | 2 | 3 | 2 | 3.29 | business-critical-but-stable | User (provisional) |
| Copilot stack | `features/copilot/`, `routes_copilot.py`, `test_copilot.py` | 4 | 3 | 2 | 3 | 4 | 3 | 2 | 2.71 | business-critical-but-stable | User (provisional) |
| Drafting engine internals | `backend/drafting/` | 4 | 3 | 3 | 1 | 2 | 5 | 4 | 4.00 | unknown-risk | UNOWNED [G-2] |
| mockup-sandbox UI | `artifacts/mockup-sandbox/src/components/ui/` | 1 | 3 | 2 | 3 | 1 | 2 | 1 | 2.43 | low-criticality-and-messy | User (provisional) |
| Dual toast / layout | `components/ui/toast*.tsx`, sidebars | 2 | 2 | 2 | 3 | 1 | 2 | 2 | 2.43 | low-criticality-and-messy | User (provisional) |

Worked example (FastAPI root): inverted OC = 5, inverted TQ = 5; average (5+5+4+5+5+5+5)/7 = **4.86**.

---

## 4. High-change + high-risk intersection

Modules with **change frequency ≥ 4** and **composite ≥ 4.00** (feeds Day 14):

1. FastAPI root + config — CF 5, composite 4.86
2. API routes family — CF 5, composite 4.29
3. RAG + document store — CF 4, composite 4.71
4. CaseContext + case stores — CF 4, composite 4.29
5. Search trifecta — CF 4, composite 4.43
6. Feature flags duality — CF 4, composite 4.00

`routes.tsx` has CF 4 but composite 3.29 — **not** in this intersection.

CI, Docker, Neo4j, Registry, Agents, Express, Copilot, drafting internals fail the CF ≥ 4 cut (or both cuts).

---

## 5. Bucket alignment with `06_risk_heatmap.md`

Every module in the table that also appears in Week 1 keeps the same Day 7 bucket. **No reclassification** this pass.

Drafting engine internals stays **unknown-risk** even with composite 4.00 because the call graph is still unmapped (Week 1 heuristic: unknown until a 30-minute trace). Do not treat it as a Week 4 target until that trace exists.

---

## 6. Low-value areas excluded from Week 4

- **mockup-sandbox UI duplicates** — composite 2.43, low criticality, EXC-2 until Day 27. Cleanup would consume frontend time without stabilizing case data or API errors.
- **Dual toast / layout** — messy chrome; a broken toast does not block drafting.
- **Accuracy academy** (Week 1 bucket 3, not rescored in the table) — isolated training surface; do not spend Week 4 on folder tidy.

---

## 7. Methodology note

Rescore when: owner gap G-n closes (raise OC), pytest joins CI (raise TQ), or a production incident is logged (raise DH/RF). Change only integers with a one-line reason in this file. Do not change Week 1 bucket without a §5 justification row.

---

## 8. Exit check

Week 4 targets must be justified by §4 intersection, not preference. Low-value messy UI is explicitly out of Week 4.
