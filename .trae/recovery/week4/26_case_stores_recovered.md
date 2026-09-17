# Week 4 — Day 26: CaseContext + case stores recovered (slice)

> Target 3 from `14_recovery_targets.md`. Owner: User (frontend). Review: Day 27 / Day 30.

## Module boundary

| Piece | Role |
|-------|------|
| `CaseContext.tsx` | Holds active `case_id` / `cases[]`. **Write authority** for the canonical adapter. Uses `useToast` (not Sonner). |
| `lib/case-store.ts` | Canonical localStorage adapter (`legal_luminaire_cases_v1`). Canonical `CaseFile` / `CaseRecord`. |
| `lib/multi-case-store.ts` | Legacy adapter, **separate keys**. Re-exports `CaseFile` from case-store. Templates only are imported by CaseContext. |
| Express workspace DB | Not written by CaseContext except fire-and-forget `extendedApiClient` create/delete. |

No third store was added.

## Tests

`src/__tests__/case-store.test.ts` — hydrate/read, corrupt JSON, selected id, seed flags, `mergeIncomingCases`; proves multi-case keys do not collide.

## Unresolved (EXC-4 until Day 27 ADR)

- Backend list-cases sync can still **add** remote records; it no longer **replaces** the whole local store (`mergeIncomingCases`).
- Two persistence shapes (`CaseRecord` vs `MultiCaseData`).
- Python vs TS registry drift (G-2).
- No user data migration.

## Exit check

Canonical write path is named. Tests cover load/save and merge-only backend sync. Full unification is explicitly not done.
