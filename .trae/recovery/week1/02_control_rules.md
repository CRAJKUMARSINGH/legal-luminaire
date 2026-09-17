# Week 1 — Control Rules

> Source: `detailed_recovery_plan.md` Day 3. Effective 2026-09-14 through the 30-day recovery period.
> No rule may be bypassed without an `APPROVED EXCEPTION` entry in §4.

## 1. Branch Policy

### 1.1 Source of Truth
- **Single source-of-truth branch**: `main`
- No parallel "source-of-truth" branches (e.g., `develop`, `production`, `release/*` are allowed only if their role is explicitly documented here — currently **none** are defined, so `main` is the only truth).
- Any branch currently being treated as a hidden truth → must be merged or documented as an APPROVED EXCEPTION by Day 3.

### 1.2 Allowed Branch Names

All work must be on a branch matching one of:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `recovery/` | Recovery deliverables, standards, inventories | `recovery/week1-inventories` |
| `fix/` | Bug fixes (including patch gap fixes) | `fix/registry-schema-mismatch` |
| `feat/` | Features — **FROZEN during recovery freeze** except with Recovery Lead explicit written approval | `feat/pleading-variants-ui` |
| `hotfix/` | Production emergency only — §3 flow required | `hotfix/crash-in-drafting-route` |
| `chore/` | Build, lint, CI, dependency bumps that don't change behavior | `chore/bump-fastapi-security` |

Anything not on the list → rename the branch or file a documented exception.

### 1.3 PR Size Guidance

| Size | Lines (add+del) | Reviewers | Approval |
|------|-----------------|-----------|----------|
| Small | ≤ 400 | 1 area owner | Sufficient |
| Medium | 401 – 1000 | 1 area owner + 1 peer | Sufficient |
| Large | > 1000 | 2 reviewers (**must include** the area owner) | + written Recovery Lead approval on the PR |

Recovery deliverables (markdown files in `.trae/recovery/`) are exempt from LOC size rules because they are not runtime code.

## 2. Review Policy

### 2.1 Mandatory Review Expectations
- Every PR requires **at least 1 approval** from the ownership matrix for its primary area.
- CI (build + lint + typecheck) must be green before merge (Week 3 Day 15 makes this enforced; until then, "red CI" is a recorded bypass in §4).
- No self-merge. No merge by the PR author. Merge is performed by the Release Owner or Recovery Lead.
- Drafting/agent/routing PRs that modify prompt text or model invocation → also require Architecture Owner review (prompt drift risk).

### 2.2 Reviewer Checklist (abbreviated)
Each reviewer is asked to confirm:

- [ ] Ownership: the module owner has signed off (or is the reviewer).
- [ ] Boundaries: does this PR respect the current architecture direction and the "no new patterns without approval" rule?
- [ ] Size: if > 1k LOC, Recovery Lead approval is on the PR.
- [ ] Tests: critical paths have at least smoke coverage (per Week 3 Day 16 standard).
- [ ] Risks: risk level marked on PR (low / medium / high); medium/high carry a rollback note.

## 3. Emergency Change Flow (Production Hotfixes)

Hotfix is defined as: **a change restoring production service or correcting a data-loss bug that cannot wait for a normal PR/review cycle**.

### Step-by-step
1. **Declare** the situation: Recovery Lead + Release Owner both agree verbally this qualifies as emergency.
2. **Branch**: `hotfix/<issue-id>-<slug>`, branched directly from `main`.
3. **Code**: Keep the fix as small as possible. Any refactor belongs to a follow-up `fix/` PR, not the hotfix.
4. **Deploy**: Recovery Lead + Release Owner both approve; merge directly.
5. **Post-hoc review**: Within **24 hours** of merge, a full PR review is conducted retroactively and any required remediation is scheduled in a `fix/` PR.
6. **Record**: The hotfix is logged in the Exception Register (§4) with: reason, both approvers, date, follow-up review status.

A change that is "urgent feature work" or "urgent cleanup" does **not** qualify.

## 4. APPROVED EXCEPTION Register

Every bypass of these rules must be a row here. Empty register = zero bypasses. Start date: 2026-09-14.

| Date | Exception | Why it was needed | Approver(s) | Follow-up | Status |
|------|-----------|-------------------|-------------|-----------|--------|
| 2026-09-14 | EXC-CI-ESLINT — typecheck stands in for ESLint | No ESLint config; adding one is a new toolchain | Recovery Lead (User) | Add ESLint or confirm typecheck-only by Day 30 | Open |
| 2026-09-14 | EXC-CI-PYTEST-VARIANTS — variant pytest not in CI | 52-subject registry + caption parse drift vs tests | Recovery Lead (User) | Fix parser/tests by Day 30 | Open |
| 2026-09-14 | EXC-CI-EXPRESS — api-server not in CI | Not canonical product (ADR-009) | Recovery Lead (User) | Review Day 30 with EXC-1 | Open |
| 2026-09-14 | EXC-CI-STREAMLIT-AUDIT — skip missing requirements file | `requirements-streamlit.txt` does not exist | Recovery Lead (User) | Add file or delete the step by Day 30 | Open |
| 2026-09-14 | EXC-LLM-KEYS-DEFAULT-OFF — `LL_REQUIRE_LLM_KEYS` defaults false | Local/CI must boot without OpenAI | Recovery Lead + Architecture Owner | Production deploy sets true; review Day 30 | Open |
