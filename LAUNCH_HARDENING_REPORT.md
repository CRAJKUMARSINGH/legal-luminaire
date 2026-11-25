# Launch hardening report

## Release decision

Use synthetic data for demonstrations. Confidential production is blocked by [identity and case isolation](docs/blockers/SE-01-OIDC-CASE-ISOLATION.md). Court-use exports also require qualified review and closure of the [11 source-verification items](docs/blockers/LEGAL-SOURCE-CLOSURE.md).

## Architecture and feature triage

| Surface | Launch treatment | Dependencies and evidence |
| --- | --- | --- |
| Case intake and demo workspace | Keep | The case registry and case context supply the selected case. The TC-01 browser journey runs from the static build without a backend. |
| Citation review and drafting | Keep and harden | The verification registry supplies tiers, source references and holdings. The deterministic citation scanner consumes those tiers. Safe Draft and Bilingual Draft Studio use the scan result to control output. |
| Deadline Board | Keep | The limitation engine calculates supported dates independently of AI. The offline smoke test opens the board, and the backend suite checks calculation and missing-input behavior. |
| Document intelligence and AI drafting | Keep for backend testing | Local extraction and redaction precede the embedding or model calls on the paths reviewed here. Provider-backed ingestion, retrieval and drafting require separate validation. |
| Pleading Chain | Demote | The primary navigation now omits this unavailable feature. Draft Family opens Safe Draft. Existing direct links still open the compatibility route, which shows availability and can be used to verify a future registry integration. |
| Recovered drafting package | Keep outside the active stack | Source reconstruction remains blocked. The [drafting package record](docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md) captures the scope and acceptance criteria. |

## Baseline

The starting point for this pass was GitHub `main` at `ff68166`. Earlier CODE-JUNCTION work is already on that branch. It includes citation registry and export guard changes, backend authorization and case scopes, redaction, and the premium landing page. The original [baseline](artifacts/audit/BASELINE_RESULTS.md), the [citation export evidence](final-deliverables/CITATION_EXPORT_RECHECK.md), and the [browser route sweep](audit-results/ROUTE_BROWSER_COVERAGE.md) document the earlier checks.

The current frontend baseline passed all 388 tests with the packages already installed in this checkout. The focused Fact-Fit Gate suite passed all 13 tests. The production frontend bundle built successfully with those packages. Its main JavaScript entry was 614.14 kB minified and 182.33 kB gzipped, and Vite flagged the entry for size. Frozen-lockfile validation passed. The existing frontend installation contains Zod 3 while the app declares Zod 4, and the initial TypeScript run reported dependency type errors. The initial backend environment failed pytest collection because its Pydantic and `pydantic-settings` packages were incompatible.

## Changes in this pass

- Draft Variants now shows a loading state, a bilingual unavailable message when subjects are missing or the request fails, and the existing editor when subjects are available. Leaving the page cancels the request. The unavailable state avoids displaying an editor that requires an available subject registry.
- Safe Draft checks the current draft fields before finalizing or printing. For a blocked draft the Print A4 button is disabled, and the browser print layout shows a gate message. Once the gate clears, the print layout renders the draft as text, shows its gate status, and includes an English and Hindi advocate-review reminder.
- Bilingual Draft Studio uses the same per-language gate results for the review panel and the text download. A blocked result in either language disables the download. Allowed downloads include both gate statuses and the bilingual advocate-review reminder.
- The server checks streamed drafts against the structural citation registry before sending any draft content. It also preserves the block on explicit PENDING and FATAL_ERROR markers. Automated streaming cases cover a known pending citation with no marker, an explicit fatal marker, and a draft that clears the gate.
- Safe Draft saves to browser-local storage without writing draft contents or storage keys to the console. A pattern scan of the existing static build found no matching private-key markers, OpenAI project or service-account keys, or AWS access-key IDs. The pattern scan covers only those credential formats.
- Standard, parallel, and case-isolated document ingestion now redact extracted text before chunking and embedding. The standard ingestion regression loads a synthetic text file and checks that the six supported identifier types are masked in the chunks passed to the vector store. Existing stored documents and vectors require a separate migration or reindexing review.
- Case chat, lab report extraction, collision discovery, and the drafting and oral-argument routes now apply the shared redactor to the reviewed provider inputs. Lab report extraction uses an isolated temporary directory and cleans up the raw file before sending extracted text to its provider.
- Streaming draft queries and retrieved context are redacted before embedding or model use. Hybrid search redacts queries before expansion and embedding, and uses the same case-scoped vector-store factory as the upload path. The regression tests mock provider boundaries.
- `pnpm launch:gate` runs Python lint checks, workspace typechecking, the frontend tests including the Fact-Fit Gate suite, the frontend production build, and backend pytest. GitHub CI adds the Python lint, backend pytest, and offline browser checks alongside its existing route and spec checks. The scripts package TypeScript configuration now checks the seeder that is present in the checkout.

A headless Chrome run opened synthetic case TC-01 from the demo browser, then loaded the Verification Panel and Deadline Board from the static production build. Safe Draft disabled finalization and printing when it detected a pending citation. Removing the citation restored the print controls and the printed draft text. Bilingual Draft Studio blocked the download when either editor held the pending citation. After both editors cleared, the downloaded file contained both languages and both gate statuses. Draft Variants passed for a mocked 404, an empty subject list, and a populated subject list. The run completed without a backend or uncaught browser errors.

## Local verification

A fresh checkout installed from the frozen lockfile. `pnpm launch:gate` passed with pinned pnpm 10.11.0. Ruff and workspace TypeScript checks passed, along with all 388 frontend tests and the production build. The final entry bundle was 614.43 kB minified and 182.69 kB gzipped. Backend pytest passed 207 tests, including the ingestion redaction regression, using an isolated dependency override for the host environment. The five existing skips cover the open drafting and variants registry gaps.

## Remaining work

- Run the updated GitHub workflow and refresh the full route sweep. The focused offline browser check covers selected routes, Safe Draft print output, and the bilingual text download. A full filing-format workflow and provider-backed ingestion and retrieval need separate verification.
- Complete the launch-wide review of navigation and first-run onboarding, empty and loading states, feature flags, legacy routes, and deployment tracing and token reporting. The focused browser checks cover the documented demo journey.
- Resolve the [pleading-variants registration decision](docs/blockers/P2-02-PLEADING-VARIANTS.md) and the [drafting package gap](docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md).
- Close the [ChromaDB exception lifecycle](docs/blockers/SE-08-CHROMADB-ADVISORIES.md) and complete the production and legal-source requirements above.

## Go/no-go checklist

- **Synthetic demo:** The clean install, launch gate, and offline browser journey must pass. Keep the synthetic-case label and advocate-review notice visible.
- **Confidential production:** Complete production identity and case isolation, verify provider-backed workflows with synthetic fixtures, and assess retained raw documents and existing vectors. Keep real client records out of shared demos.
- **Court use:** Clear the confidential-production gate, record all 11 primary-source dispositions, and obtain qualified Indian advocate review for any proposed filing.
