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
| Pleading Chain | Retire | The router was never registered and the required registry was never committed. [ADR-011](docs/adr/ADR-011-retire-pleading-chain.md) records removal of the unused API and client code. Existing bookmarks show a bilingual notice and link to Safe Draft. |
| Unrecovered drafting package | Supersede | The existing Gemini-direct API and frontend Template Library cover the supported drafting and template-discovery paths. [ADR-010](docs/adr/ADR-010-gemini-direct-drafting.md) records the scope and preserves the recovery history. |

## Baseline

The starting point for this pass was GitHub `main` at `ff68166`. Earlier CODE-JUNCTION work is already on that branch. It includes citation registry and export guard changes, backend authorization and case scopes, redaction, and the premium landing page. The current [release-readiness baseline](docs/RELEASE_READINESS.md) documents the checks and outstanding runtime verification; superseded dated evidence snapshots have been removed.

The current frontend baseline passed all 388 tests with the packages already installed in this checkout. The focused Fact-Fit Gate suite passed all 13 tests. The production frontend bundle built successfully with those packages. Its main JavaScript entry was 614.14 kB minified and 182.33 kB gzipped, and Vite flagged the entry for size. Frozen-lockfile validation passed. The existing frontend installation contains Zod 3 while the app declares Zod 4, and the initial TypeScript run reported dependency type errors. The initial backend environment failed pytest collection because its Pydantic and `pydantic-settings` packages were incompatible.

## Changes in this pass

- Draft Variants now shows a loading state, a bilingual unavailable message when subjects are missing or the request fails, and the existing editor when subjects are available. Leaving the page cancels the request. The unavailable state avoids displaying an editor that requires an available subject registry.
- Safe Draft checks the current draft fields before finalizing or printing. For a blocked draft the Print A4 button is disabled, and the browser print layout shows a gate message. Once the gate clears, the print layout renders the draft as text, shows its gate status, and includes an English and Hindi advocate-review reminder.
- Bilingual Draft Studio uses the same per-language gate results for the review panel and the text download. A blocked result in either language disables the download. Allowed downloads include both gate statuses and the bilingual advocate-review reminder.
- The server checks streamed drafts against the structural citation registry before sending any draft content. It also preserves the block on explicit PENDING and FATAL_ERROR markers. Automated streaming cases cover a known pending citation with no marker, an explicit fatal marker, and a draft that clears the gate.
- Safe Draft saves to browser-local storage without writing draft contents or storage keys to the console. A pattern scan of the existing static build found no matching private-key markers, OpenAI project or service-account keys, or AWS access-key IDs. The pattern scan covers only those credential formats.
- Standard, parallel, and case-isolated document ingestion now redact extracted text before chunking and embedding. The standard ingestion regression loads a synthetic text file and checks that the six supported identifier types are masked in the chunks passed to the vector store. Existing stored documents and vectors require a separate migration or reindexing review.
- Case chat, lab report extraction, collision discovery, and the drafting and oral-argument routes now apply the shared redactor to the reviewed provider inputs. Lab report extraction uses an isolated temporary directory and cleans up the raw file before sending extracted text to its provider.
- Gemini-direct drafting now checks generated text against the shared citation registry before returning it. Known blocked citations result in an empty draft response, and provider exceptions produce generic error messages without returning provider details.
- Streaming draft queries and retrieved context are redacted before embedding or model use. Hybrid search redacts queries before expansion and embedding, and uses the same case-scoped vector-store factory as the upload path. The regression tests mock provider boundaries.
- The shared legal verifier now lives in the agents package alongside the existing agent-tools module. The analytics, similarity, deadlines, and derivative routes use imports compatible with the documented backend entry point. A regression checks that the accuracy pipeline and error detector load the same verifier. A request to the real application's `/api/v1/health` route returned HTTP 200 using isolated Python dependencies.
- `pnpm launch:gate` runs Python lint checks, workspace typechecking, the frontend tests including the Fact-Fit Gate suite, the frontend production build, and backend pytest. GitHub CI adds the Python lint, backend pytest, and offline browser checks alongside its existing route and spec checks. The scripts package TypeScript configuration now checks the seeder that is present in the checkout.

A headless Chrome run opened synthetic case TC-01 from the demo browser, then loaded the Verification Panel and Deadline Board from the static production build. Safe Draft disabled finalization and printing when it detected a pending citation. Removing the citation restored the print controls and the printed draft text. Bilingual Draft Studio blocked the download when either editor held the pending citation. After both editors cleared, the downloaded file contained both languages and both gate statuses. Draft Variants passed for a mocked 404, an empty subject list, and a populated subject list. The run completed without a backend or uncaught browser errors.

## Local verification

A fresh checkout installed from the frozen lockfile. `pnpm launch:gate` passed with pinned pnpm 10.11.0. Ruff and workspace TypeScript checks passed, along with all 388 frontend tests and the production build. The final entry bundle was 614.43 kB minified and 182.69 kB gzipped. Backend pytest passed 207 tests, including the ingestion redaction regression, using an isolated dependency override for the host environment. The five existing skips cover the open drafting and variants registry gaps.

## Remaining work

- Refresh the full route sweep. The focused offline browser check covers selected routes, Safe Draft print output, and the bilingual text download. The [launch workflow for the streaming citation guard](https://github.com/CRAJKUMARSINGH/legal-luminaire/actions/runs/45654475708) passed. A full filing-format workflow and provider-backed ingestion and retrieval need separate verification.
- Complete the launch-wide review of navigation and first-run onboarding, empty and loading states, feature flags, legacy routes, and deployment tracing and token reporting. The focused browser checks cover the documented demo journey.
- Close the [ChromaDB exception lifecycle](docs/blockers/SE-08-CHROMADB-ADVISORIES.md) and complete the production and legal-source requirements above.

## Go/no-go checklist

- **Synthetic demo:** The clean install, launch gate, and offline browser journey must pass. Keep the synthetic-case label and advocate-review notice visible.
- **Confidential production:** Complete production identity and case isolation, verify provider-backed workflows with synthetic fixtures, and assess retained raw documents and existing vectors. Keep real client records out of shared demos.
- **Court use:** Clear the confidential-production gate, record all 11 primary-source dispositions, and obtain qualified Indian advocate review for any proposed filing.

## CODE-JUNCTION inventory

The 26 November 2026 recursive review found three untracked files, zero subfolders, and zero patches. The two launch briefs matched the prior inventory. `Legal kiro 26.txt` appeared during the review. The repository also gained the tracked unwired-file inventories in `f4dfc22`.

| File | Size | Disposition |
| --- | ---: | --- |
| `COMPREHENSIVE LAUNCH-READY TASK FOR.txt` | 12,779 bytes | Retained as the primary brief. It now includes the distinct architecture and feature-triage criteria. |
| `lel# SYSTEM  ROLE DEFINITION.md` | 14,398 bytes before removal | Removed after verifying that the primary brief contains the consolidated criteria. |
| `Legal kiro 26.txt` | 7,924 bytes | Retained the complete remediation checklist and removed the download and pricing preamble. |

The [documentation index](docs/DOCUMENTATION_INDEX.md) records which operator scripts still have a use and links both FAQ pages. Keep the three documented discharge generators for reproducibility. The Markdown scan remains a manual inventory tool. Preserve actively referenced audit and release artifacts; stale generic test snapshots are removed.

Local backend verification after the import fixes passed 213 tests, with five existing skips. The health endpoint returned HTTP 200. This check used isolated compatible Python dependencies and did not exercise live provider workflows.

## CODE-JUNCTION completion

**64% complete (9 of 14 tracked work items).** This checklist groups overlapping requirements from both retained briefs into equally weighted work items. An item counts as done when its stated outcome has evidence. Partially completed items count as open. Release decisions still depend on the go/no-go checklist.

| Work item | Status | Evidence or next acceptance check |
| --- | --- | --- |
| Inbox inventory and consolidation | Done | Two briefs remain. The duplicate Markdown brief and download preamble were removed. |
| Engineering baseline and launch command | Done | Frozen install, lint, typecheck, build, and launch command recorded. |
| Citation controls on tested draft paths | Done | Safe Draft, bilingual download, and streaming draft block tested pending citations. |
| Offline TC-01 and deadline workflow | Done | Browser smoke and deterministic deadline tests passed. |
| Backend entry point and verifier imports | Done | Health returned HTTP 200 and local backend pytest passed 213 tests. |
| Redaction on reviewed processing paths | Done | Synthetic and mocked-provider tests cover the reviewed embedding and generation boundaries. |
| Documentation and operator-script triage | Done | Release docs, FAQ links, script dispositions, and audit provenance are recorded. |
| Live provider workflows and demo seeder | Open | The repaired seeder passes its loopback multipart contract test. Live end-to-end ingestion, retrieval, and drafting with synthetic data remain to be verified. |
| Production identity and case isolation | Open | Close SE-01 with staging and cross-user access evidence. |
| Court-use legal sources | Open | Record all 11 source dispositions and qualified advocate review. |
| ChromaDB exception lifecycle | Open | Verify a supported remediation or replacement. |
| Pleading Chain | Done | Retired under ADR-011. The API regression and offline browser check verified that generation is absent and the old bookmark leads to Safe Draft without making variants requests. |
| Missing drafting package | Done | Superseded under ADR-010. Executable tests cover both supported API paths, redacted inputs, withholding a draft with a pending citation, and generic failure responses. |
| Launch-wide UX, deployment, and CI verification | Open | Complete the route and accessibility sweep, verify deploy and rollback paths, and run CI for the final change set. |

Retirement verification passed 388 frontend tests and 204 backend tests, with three remaining drafting-package skips. Retiring the unused engine removed its tests and the two skips tied to the missing variants registry. The production build and offline browser smoke passed.

Drafting supersession verification passed 388 frontend tests and 208 backend tests with zero skips. The former skip-only drafting tests were replaced with mocked-provider tests. Live Gemini validation remains open.

The seeder now uses the case-scoped upload route, sends only the labelled synthetic fixture to a local backend, and treats indexing errors or zero chunks as failure. The scripts typecheck and loopback contract test passed. The test is wired into the launch command and GitHub CI. The checklist score remains 64% because this item also requires live-provider verification.
