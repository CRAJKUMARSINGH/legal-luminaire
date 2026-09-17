# 30-day recovery — operating index

**Purpose:** regain control of a multi-agent codebase. This is **not** a rewrite.

**Calendar:** 2026-09-14 (Day 1) through 2026-10-13 (Day 30).  
**Source of truth branch:** `main`.

| Read this | When |
|-----------|------|
| [30_DAY_PLAN.md](30_DAY_PLAN.md) | Full day-by-day plan (operating guide) |
| [ANNOUNCEMENT.md](ANNOUNCEMENT.md) | What is frozen, who approves, what is urgent |
| [STATUS.md](STATUS.md) | Day map → artifacts, remaining risks |
| [BOARD.md](BOARD.md) | Live issue buckets |
| [CHANGE_EVIDENCE.md](CHANGE_EVIDENCE.md) | Required evidence on every meaningful change |
| [../ENGINEERING_HANDBOOK.md](../ENGINEERING_HANDBOOK.md) | Short enforceable standards |
| [../OWNERS.md](../OWNERS.md) | Roles and module owners |
| [../DEFINITION_OF_DONE.md](../DEFINITION_OF_DONE.md) | Recovered-module + PR done |

Working papers (inventories, heatmaps, week notes) live in `.trae/recovery/week1` … `week4`. Do not treat that folder as product runtime.

## Non-negotiables (all 30 days)

- no direct pushes to `main`
- no merge without review
- no merge if CI fails
- no large PRs unless the Recovery Lead explicitly approves
- no new dependency, framework, or architectural pattern without Architecture Owner approval
- no touching an important module without naming an owner
- no code cleanup without documenting the affected boundary
- no exceptions that are not written in `.trae/recovery/week1/02_control_rules.md` §4
