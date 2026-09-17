# Week 3 — Day 18 Review Ownership Mapping

> Source: `detailed_recovery_plan.md` Day 18. GitHub file: `.github/CODEOWNERS`.

## Mapping

| Path | Reviewer | Notes |
|------|----------|--------|
| `*` | @CRAJKUMARSINGH | Solo operator; Recovery Lead default |
| `artifacts/legal-luminaire/src/` | Frontend owner (User / @CRAJKUMARSINGH) | Pages, features, lib |
| `artifacts/legal-luminaire/backend/` | Backend owner (User / @CRAJKUMARSINGH) | FastAPI |
| `backend/rag/`, `graph/`, `registry/` | G-2 interim User | Data/RAG gap |
| `backend/config.py` | G-3 interim User | Auth/config gap |
| `.github/`, `docs/adr/` | G-4 / G-1 interim User | Infra/CI, Release |

GitHub CODEOWNERS requests a review from the listed user on PRs that touch those paths. **Merge is still not self-merge** per control rules: Release Owner or Recovery Lead merges after that review is recorded. On a solo team the same human holds both roles; the PR must still show the template checklist completed.

## Escalation

If the owner is unavailable > 48 hours: Recovery Lead appoints a backup in `01_roles_and_ownership.md` and may review as interim.

## Exit check

Important changes are reviewed by the person mapped to the area (today: the same named GitHub user, with the mapping visible).
