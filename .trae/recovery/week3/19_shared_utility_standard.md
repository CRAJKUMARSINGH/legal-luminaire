# Week 3 — Day 19 Shared Utility Standard

> Source: `detailed_recovery_plan.md` Day 19. Import rules remain those in `09_code_organization_standard.md`.

## Canonical shared utilities (keep)

| Utility | Path | Consumers | Rule |
|---------|------|-----------|------|
| `cn()` | `src/lib/utils.ts` | `components/ui/*` | Only className helper in Shared Platform UI |
| Integration flags | `src/lib/featureFlags.ts` | Copilot, Home, SystemFlags, **CI flag-type-check** | Week-1 eight flags; snake_case keys |
| Hybrid/extended flags | `src/config/featureFlags.ts` | `routes.tsx`, navigation, search/graph modules | camelCase keys; do not merge into lib this month |
| API client | `src/lib/api-client.ts` | SPA HTTP | No raw `fetch` of backend hosts from components |
| Date validator | `src/lib/date-validator.ts` | case date conflicts | Domain-ish; keep local to legal dates — do not fold into `utils.ts` |

## Duplicate / review (do not delete this week)

| Item | Canonical | Obsolete / review | Action this week |
|------|-----------|-------------------|------------------|
| Feature flag files | Both live (different registries) | A third file would be forbidden | Comments only; merge deferred (CI depends on `lib/featureFlags.ts`) |
| Toast | `@/hooks/use-toast` + `ui/toaster.tsx` | `sonner` + `ui/sonner.tsx` | New toasts use `use-toast`. Do not delete Sonner (BilingualGenerator still imports it). |
| `CaseFile` types | Document as EXC-4 adapters | `case-store.ts` vs `multi-case-store.ts` | No unification (Day 27). Stop adding a third `CaseFile`. |
| Search helpers | Intent routing later (EXC-3) | `search.ts` / `legal-search-client.ts` / search-engine-v2 | No deletion |
| mockup-sandbox `cn`/ui | SPA `components/ui` | sandbox copies | EXC-2 |

## When a new helper may be shared

Same three rules as Day 9: ≥3 consumers, same signature, no domain nouns. Otherwise keep it in the feature folder.

## Duplicate removal list (scheduled, not executed)

1. Collapse toast to `use-toast` after BilingualGenerator migrates (Day 27+).
2. Re-export integration flags from `config/featureFlags.ts` only after CI grep is updated.
3. One `CaseFile` interface behind adapters (Week 4 Target 3 / Day 27).

## Exit check

Utility usage is documented: `cn` and two flag registries are the only blessed shared frontend helpers; new helpers default to local.
