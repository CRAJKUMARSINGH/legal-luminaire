# Main Branch Protection — Required CI Status Checks

**Scope:** Repository-wide ruleset applying to `main`
**Status:** ACTIVE — CI now gates merges to `main`
**Raised:** 2026-11-27
**Owner:** `CRAJKUMARSINGH` (repository owner)
**Ruleset:** `main-protection` (id `28236430`), `enforcement: active`

---

## 1. Decision

`main` now requires CI to pass before a pull request can merge. A repository ruleset of
type `required_status_checks` gates merges; it adds **no** approval requirement.

| Required check (context) | Source workflow job |
|---|---|
| `Frontend typecheck + build (pnpm)` | `.github/workflows/ci.yml` → job `frontend` |
| `Backend syntax and pytest (Python)` | `.github/workflows/ci.yml` → job `backend` |

The `context` is the **job** name, not the workflow filename. The workflow is named `ci`,
but a ruleset requiring the context `ci` would match no check and block nothing.

## 2. Why status checks only (no approving review)

The repository has a single collaborator who is also the PR author, so a
`pull_request` approving-review rule would be self-blocking: every merge would need an
exception, exactly like the one recorded for PR #7. A `required_status_checks`-only
ruleset enforces the objective part — "CI must be green" — without manufacturing an
unmeetable review requirement.

## 3. Compensating controls

- **CI must be green** — the two required checks above run on every pull request
  (`on: pull_request:` in `ci.yml`); a red run sets `mergeStateStatus: BLOCKED`.
- **Not auto-merged** — the owner merges manually; the ruleset only refuses a red merge.
- **No bypass** — the owner has **no** bypass actor on this ruleset
  (`current_user_can_bypass: never`), so the ruleset is a real gate rather than advice.
- **Docs stay in scope** — `docs/**` and `*.md` are deliberately **not** excluded from CI
  via `paths-ignore`, because the documentation link tests live there.

## 4. Verification

A throwaway pull request (#8, branch `ci/verify-gate`) was opened with a deliberate broken
markdown link and the `docs-link-integrity` guard committed. Results:

- CI ran on the `pull_request` event;
- `docs-link-integrity` failed → `Frontend typecheck + build (pnpm)` failed;
- `gh pr view 8` reported `mergeStateStatus: BLOCKED`.

The PR was then closed and its branch deleted. No merge was performed.

## 5. Relationship to the PR #7 exception

The PR #7 record ([REVIEW_EXCEPTION_PR-007.md](REVIEW_EXCEPTION_PR-007.md), §2) cites
`rulesets → [] (none)` as one of three checks that no review gate exists. That premise is
now stale: a ruleset exists. The PR #7 **decision** is nevertheless unaffected — this
ruleset requires status checks only and adds no independent-approval requirement, so the
"no approval gate" conclusion still holds.

## 6. Revocation

To remove the gate:

```bash
gh api -X DELETE repos/CRAJKUMARSINGH/legal-luminaire/rulesets/28236430
```

The ruleset is additive to repository settings; deleting it restores the prior state
(no branch protection on `main`).
