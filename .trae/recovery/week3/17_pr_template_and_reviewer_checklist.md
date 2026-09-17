# Week 3 — Day 17 PR Quality

> Source: `detailed_recovery_plan.md` Day 17. Does not contradict `02_control_rules.md`.

## PR template

GitHub template: `.github/PULL_REQUEST_TEMPLATE.md`

Required fields: summary, affected area, risk level, test evidence, migration impact, rollback notes (medium/high), checklist.

## Expected size

| Size | Lines (add+del) | Reviewers |
|------|-----------------|-----------|
| Small | ≤ 400 | 1 area owner |
| Medium | 401–1000 | owner + 1 peer |
| Large | > 1000 | 2 reviewers including owner + Recovery Lead written approval |

Split structural cleanup from behavior change when both are large.

## Reviewer checklist

- [ ] Owner for the primary area signed off (CODEOWNERS / `docs/OWNERS.md`)
- [ ] No new pattern, framework, or dependency without Architecture Owner
- [ ] Size rule applied
- [ ] Tests match Day 16 minimum
- [ ] Risk marked; medium/high have rollback notes
- [ ] Prompt / agent / drafting PRs have Architecture Owner review
- [ ] Does not merge red CI

## Exit check

Reviewers can see why the change exists and how risky it is from the template alone.
