# Legal Luminaire — 51 Intake Examples Patch Handoff

## Scope

This patch implements the due synthetic-intake work from Weeks 01–05 and the
new logical-conclusion requirement:

- EX-001 through EX-051 are exposed through one browser.
- EX-032 through EX-041 are added as structured Week 04 fixtures.
- EX-042 through EX-051 are added as structured Week 05 fixtures.
- Every fixture has sections 0–4, accuracy gates, unresolved facts, an adverse
  or contradictory fact, draft states, and a mandatory terminal outcome.
- Every terminal outcome ends in a safe operational conclusion:
  hold, research/review, clarify/refer, or supervised review.
- No synthetic fixture can advertise a `filing-ready` state.
- Broken Week 04 navigation paths (`/example33`, etc.) are corrected to the
  routes that actually exist (`/example-33`, etc.).

## Changed files

- `artifacts/legal-luminaire/src/data/demo-cases/intake-example-types.ts`
  - Shared schema and mandatory `TerminalOutcome`.
- `artifacts/legal-luminaire/src/data/demo-cases/intake-example-utils.ts`
  - Deterministic safe-conclusion derivation.
- `artifacts/legal-luminaire/src/data/demo-cases/all-intake-examples.ts`
  - Unified EX-001–EX-051 data source.
- `artifacts/legal-luminaire/src/data/demo-cases/week01-intake-examples.ts`
- `artifacts/legal-luminaire/src/data/demo-cases/week02-intake-examples.ts`
- `artifacts/legal-luminaire/src/data/demo-cases/week03-intake-examples.ts`
  - Existing fixtures migrated to the shared schema and terminal-outcome
    normalisation.
- `artifacts/legal-luminaire/src/data/demo-cases/week04-intake-examples.ts`
- `artifacts/legal-luminaire/src/data/demo-cases/week05-intake-examples.ts`
  - New fixtures for EX-032–EX-051.
- `artifacts/legal-luminaire/src/pages/IntakeExamplesPage.tsx`
  - Unified 51-example browser and visible “Logical conclusion / Next safe
    action” panel.
- `artifacts/legal-luminaire/src/config/navigation.ts`
  - Corrected broken Week 04 paths.
- `artifacts/legal-luminaire/src/data/demo-cases/intake-examples-completeness.test.ts`
  - Fixture and safety-gate tests.
- `artifacts/legal-luminaire/src/config/navigation-integrity.test.ts`
  - Landing navigation tests.
- `docs/INTAKE_EXAMPLES_51_HANDOFF.md`
  - This handoff.

## Schema decisions

The terminal outcome is intentionally not a legal merits conclusion. It is the
next safe workflow conclusion:

1. **Hold — do not file** when a draft or accuracy gate is blocked.
2. **Research and supervisor review required** when a citation or deadline is
   pending/unknown.
3. **Clarify instructions before drafting** when the request is unclear,
   overbroad or conflicting.
4. **Proceed to supervised review** only when the fixture has a bounded next
   step; it still does not mean filing-ready.

The UI shows the conclusion and next action inside every expanded fixture so a
deep path does not terminate in an empty screen or an unexplained disabled
control.

## Validation evidence

Run from `artifacts/legal-luminaire`:

```text
pnpm test --run src/data/demo-cases/intake-examples-completeness.test.ts src/config/navigation-integrity.test.ts
```

Result at patch time:

```text
Test Files  2 passed (2)
Tests       6 passed (6)
```

The focused tests verify:

- exactly 51 unique IDs in numerical order;
- five required intake sections and a non-empty terminal outcome for every
  fixture;
- no `filing-ready` workflow or draft state;
- a blocked draft always explains its block;
- at least 45 fixtures retain an adverse/contradictory fact;
- the old broken unhyphenated Week 04 paths are absent.

## Known repository-wide blocker

The repository's full application typecheck is not clean at the base commit.
It reports pre-existing missing modules including `SaraswatiMascot`,
`DiscrepancyChecker`, `ComparisonReport`, `chamber-auth`, `court-formatter`,
`VariantChain`, `CitationAddToDraft`, `DraftFamilyPanel`,
`InfraArbClaimPage`, and `DraftTemplateLibraryPage`, plus an existing implicit
`any` in `DraftVariantsPage.tsx`. Those errors are outside this patch and are
not silently claimed as fixed.

The patch is therefore **focused-test certified**, not repository-wide
typecheck certified. Before merging, repair or restore those unrelated modules
and rerun the full build/typecheck gate.

## Safety and release notes

- All data remains synthetic/demo data.
- No connector, client record, credential, or production matter is touched.
- Current Indian statutes, court rules, forms, limitation periods and
  citations remain explicitly unverified where the fixture says so.
- This patch must not be presented as legal advice or filing material.
