# Launch hardening report

## Release decision

Use synthetic data for demonstrations. Confidential production is blocked by [identity and case isolation](docs/blockers/SE-01-OIDC-CASE-ISOLATION.md). Court-use exports also require qualified review and closure of the [11 source-verification items](docs/blockers/LEGAL-SOURCE-CLOSURE.md).

## Baseline

The starting point for this pass was GitHub `main` at `ff68166`. Earlier CODE-JUNCTION work is already on that branch. It includes citation registry and export guard changes, backend authorization and case scopes, redaction, and the premium landing page. The original [baseline](artifacts/audit/BASELINE_RESULTS.md), the [citation export evidence](final-deliverables/CITATION_EXPORT_RECHECK.md), and the [browser route sweep](audit-results/ROUTE_BROWSER_COVERAGE.md) document the earlier checks.

The current frontend baseline passed all 388 tests with the packages already installed in this checkout. The focused Fact-Fit Gate suite passed all 13 tests. The production frontend bundle built successfully with those packages. Its main JavaScript entry was 614.14 kB minified and 182.33 kB gzipped, and Vite flagged the entry for size. Frozen-lockfile validation passed. The existing frontend installation contains Zod 3 while the app declares Zod 4, and the initial TypeScript run reported dependency type errors. The initial backend environment failed pytest collection because its Pydantic and `pydantic-settings` packages were incompatible.

## Changes in this pass

- Draft Variants now shows a loading state, a bilingual unavailable message when subjects are missing or the request fails, and the existing editor when subjects are available. Leaving the page cancels the request. The unavailable state avoids displaying an editor that requires an available subject registry.
- Safe Draft checks the current draft fields before finalizing or printing. For a blocked draft the Print A4 button is disabled, and the browser print layout shows a gate message. Once the gate clears, the print layout renders the draft as text, shows its gate status, and includes an English and Hindi advocate-review reminder.
- Safe Draft saves to browser-local storage without writing draft contents or storage keys to the console. A pattern scan of the existing static build found no matching private-key markers, OpenAI project or service-account keys, or AWS access-key IDs. The pattern scan covers only those credential formats.
- `pnpm launch:gate` runs Python lint checks, workspace typechecking, the frontend tests including the Fact-Fit Gate suite, the frontend production build, and backend pytest. GitHub CI adds the Python lint, backend pytest, and offline browser checks alongside its existing route and spec checks. The scripts package TypeScript configuration now checks the seeder that is present in the checkout.

A headless Chrome run opened synthetic case TC-01 from the demo browser, then loaded the Verification Panel and Deadline Board from the static production build. Safe Draft disabled finalization and printing when it detected a pending citation. Removing the citation restored the print controls and the printed draft text. Draft Variants passed for a mocked 404, an empty subject list, and a populated subject list. The run completed without a backend or uncaught browser errors.

## Local verification

A fresh checkout installed from the frozen lockfile. `pnpm launch:gate` then passed with pinned pnpm 10.11.0. Ruff and workspace TypeScript checks passed, along with all 388 frontend tests and the production build. The final entry bundle was 614.43 kB minified and 182.68 kB gzipped. Backend pytest passed 206 tests using an isolated dependency override for the host environment. The five existing skips cover the open drafting and variants registry gaps.

## Remaining work

- Run the updated GitHub workflow and refresh the full route sweep. The focused offline browser check covers selected routes and Safe Draft print output. A full bilingual filing export and provider-backed ingestion and retrieval need separate verification.
- Resolve the [pleading-variants registration decision](docs/blockers/P2-02-PLEADING-VARIANTS.md) and the [drafting package gap](docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md).
- Close the [ChromaDB exception lifecycle](docs/blockers/SE-08-CHROMADB-ADVISORIES.md) and complete the production and legal-source requirements above.
