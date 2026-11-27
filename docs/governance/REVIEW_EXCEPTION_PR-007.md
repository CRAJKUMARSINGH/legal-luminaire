# Review Requirement Exception — PR #7

**Scope:** Pull request **#7** only (`docs/p2-02-blocker-and-release-readiness`)
**Status:** ACTIVE — owner-approved exception to the independent-review requirement
**Raised:** 2026-11-21
**Applies to head SHA:** `be246bd579ee60577ceeb5a2568a9958ccb2a4e5`
**Owner:** `CRAJKUMARSINGH` (repository owner)
**Applies to merge of:** PR #7 → `main`

---

## 1. What is being excepted

The repository's process asks for human review of pull requests. For PR #7 an
**independent** GitHub review cannot be assigned, because the repository has exactly one
collaborator and that collaborator is also the PR author. This document records an
explicit, owner-approved exception to that review requirement for PR #7.

## 2. Why independent review is not platform-mandated

Three checks establish that no branch protection, ruleset, or written policy requires an
independent approval:

| Check | Command | Result |
|---|---|---|
| Branch protection on `main` | `gh api repos/CRAJKUMARSINGH/legal-luminaire/branches/main/protection` | `404 — Branch not protected` |
| Repository rulesets | `gh api repos/CRAJKUMARSINGH/legal-luminaire/rulesets` | `[]` (none) |
| Written review policy | [CONTRIBUTING.md](../../CONTRIBUTING.md#L45-L54) | PR *guidelines* only — **no independent-approval gate** |

The review requirement is therefore a self-imposed process rule, not a GitHub-enforced
gate. Repository policy does not forbid recording an owner-approved exception.

## 3. Compensating controls (what is NOT waived)

This exception covers **only** the independent-review assignment step. It does **not**
waive any of the following, all of which are satisfied or required:

- **Required CI checks** must pass — PR #7: Frontend typecheck + build, Backend syntax
  check, Node dependency audit (pnpm), Python dependency audit (pip-audit), Netlify Header
  rules, Redirect rules, deploy-preview — **all SUCCESS**; CodeRabbit SUCCESS.
- **Documentation-only scope** — 3 Markdown files; no runtime, auth, citation-gate,
  export, routing, deployment-config, or legal-data change.
- **No blocker closed** — P2-01, P2-02, SE-01, SE-08, LEGAL-11 remain open.
- **Release restrictions unchanged** — confidential production blocked by SE-01;
  court-use exports blocked pending SE-01 + all 11 legal-source items.
- **Not auto-merged** — the owner performs any merge manually.

## 4. Decision

The repository owner **approves merging PR #7 without an independent GitHub reviewer**,
on the basis that:

1. independent review is not platform-mandated (§2);
2. no independent reviewer exists in the repository (sole collaborator = author);
3. the change is documentation-only with all required CI checks green (§3).

**Approved by:** `CRAJKUMARSINGH` (repository owner) · 2026-11-21

## 5. Limitations of this exception

- Applies **only** to PR #7. It sets **no precedent** for code-bearing pull requests and
  must not be cited to waive review for changes that touch runtime, security, citation, or
  export paths.
- Void if PR #7's head changes to include any non-documentation file.
- Void if any required CI check fails or is bypassed.
- Does **not** alter branch protection, rulesets, or the release gates.

## 6. Revocation

The owner may revoke this exception at any time before the PR #7 merge. Once PR #7 is
merged or closed, this record becomes historical and this file provides the audit trail.
To add a genuine independent reviewer in future, grant the reviewer repository access and
re-request review on the relevant PR instead of relying on this exception.
