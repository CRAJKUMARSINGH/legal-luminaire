## Summary

<!-- What problem this PR solves. -->

## Affected area

- [ ] Frontend (`artifacts/legal-luminaire/src`)
- [ ] FastAPI (`artifacts/legal-luminaire/backend`)
- [ ] Express api-server (CRUD/ops only — EXC-1)
- [ ] Infra / CI / docs
- [ ] Recovery documentation (`.trae/recovery/`)

Owning module (from `docs/OWNERS.md` / CODEOWNERS):

## Risk level

- [ ] Low
- [ ] Medium (rollback note required)
- [ ] High (rollback note required)

Rollback notes (medium/high):

## Test evidence

- Commands run:
- CI expected to pass: frontend typecheck+test+build; backend compileall + smoke pytest

## Migration impact

- [ ] None
- [ ] Env / config (`LL_*`, `VITE_*`)
- [ ] API contract / error envelope
- [ ] Data / localStorage / registry

## Checklist

- [ ] No new framework, dependency, or architectural pattern without Architecture Owner approval
- [ ] PR size: ≤400 LOC, or 401–1000 with peer, or >1000 with Recovery Lead written approval
- [ ] No self-merge; area owner reviewed
- [ ] Critical path has smoke coverage (see `.trae/recovery/week3/16_testing_minimum_standard.md`)
- [ ] Drafting/agent/prompt changes also have Architecture Owner review
