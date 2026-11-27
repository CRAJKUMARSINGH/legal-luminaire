# Unwired Code Inventory — Legal Luminaire

Per-file inventory of source code that is not reachable from the canonical frontend (`src/main.tsx`) or backend (`backend/main.py`), including test-only modules, standalone utilities, legacy workspace packages, archived code, and missing-source gaps.

- Generated: 2026-11-26
- Branch/HEAD: `codex/code-junction-launch-hardening` @ `2e70ea2`
- Companion: [Master inventory](unwired-files-inventory.md) · [Guidance inventory](guidance-material-inventory.md)

## Method and limits

- Frontend: traversed static imports/exports, dynamic `import()`, `require()`, `@/` aliases, extension resolution, and `index` resolution from `src/main.tsx`.
- Backend: parsed Python AST imports and relative imports from `backend/main.py`.
- Tests: traversed separately from Vitest/pytest test roots.
- Excluded: dependencies, virtual environments, build output, caches, bytecode, and the duplicate nested checkout.
- “Unreachable” is a static result. Reflection, string-based loading, manual scripts, or future routes can change it; each candidate below was reviewed for its intended role.

## Summary

| Class | Count |
|---|---:|
| Frontend runtime-and-test unreachable | 52 |
| Backend runtime-and-test unreachable | 11 |
| Frontend test-only | 15 |
| Backend test-only | 22 |
| Legacy `lib/**` files not used by the canonical app | 79 |
| Active root utility/support files | 11 |
| App-level utility scripts | 3 |
| Archived package/script files | 93 |
| Missing drafting/registry source files | 11 |

## Disposition legend

`INCORPORATE` = wire after prerequisites; `BLOCKED_REVIEW` = decision/safety/data work required first; `KEEP_TEST` = intentional test-only; `ARCHIVE` = retired/superseded; `DELETE` = empty/stale candidate; `WIRED_AUXILIARY` = intentionally connected to tooling rather than the web runtime.

# 1. Backend runtime orphans

## 1.1 Pleading variants — blocked cluster

| File | Current state | Disposition and required work |
|---|---|---|
| `artifacts/legal-luminaire/backend/api/routes_pleading_variants.py` | Complete `/variants` router; not registered in `main.py` | `BLOCKED_REVIEW`. Do not register as-is. The Fact-Fit import is inside `try/except ImportError` and can fail open. Citation search also degrades to empty results on import failure. |
| `artifacts/legal-luminaire/backend/services/variant_engine.py` | Reached only by tests and the unwired router | `BLOCKED_REVIEW`. Keep test-only until the register-or-retire decision. `DATA_FILE` points to missing `backend/data/subject_variants.json`. |
| `artifacts/legal-luminaire/backend/data/subject_variants.json` | **Missing** | Supply a validated registry with real, court-checkable authorities or retire the feature. Do not invent legal data. |
| `artifacts/legal-luminaire/backend/services/factfit_gate.py` | **Missing**, but imported by the router | Identify/build an adapter to the canonical citation gate. Import failure must block generation, not bypass it. |
| `artifacts/legal-luminaire/backend/services/rag_store.py` | **Missing**, but imported by the router | Use the canonical case-scoped retrieval service or remove the route. Missing search must not look like “no citations.” |

Acceptance gate: explicit register-or-retire ADR/issue; verified registry if registered; intentional router registration; mandatory 428 blocking for `PENDING`/`FATAL_ERROR`; auth and case scoping on every route; no silent test skips; browser route sweep passes.

## 1.2 Derivative drafting — blocked cluster

| File | Current state | Disposition and required work |
|---|---|---|
| `artifacts/legal-luminaire/backend/api/routes_derivative.py` | Complete derivative router; not registered in `main.py` | `BLOCKED_REVIEW`. Decide register vs. retire. Add canonical citation-gate enforcement, auth/case scoping, persistent family storage, rate-limit tests, and route tests. |
| `artifacts/legal-luminaire/backend/agents/derivative_drafter.py` | Only imported by the unwired derivative router | `BLOCKED_REVIEW`. Treat as one feature cluster with the router. Preserve lineage, pairing checks, synthetic labels, and bilingual disclaimers if adopted. |

The router already has useful controls: `FEATURE_DERIVATIVE_DRAFTS`, subject/type pairing, structured lineage, synthetic labeling, bilingual disclaimers, and deterministic fallback drafts. Those controls are necessary but not sufficient for production registration.

## 1.3 Alternate implementations

| File | Current state | Disposition and required work |
|---|---|---|
| `artifacts/legal-luminaire/backend/agents/fact_fit_engine.py` | Optimized alternate gate with batching, caching, embeddings, TF-IDF, and cosine scoring; no references | Benchmark only. Compare verdict parity, adversarial cases, offline behavior, latency, memory, and failure semantics with the canonical gate. Never replace the gate solely for speed. |
| `artifacts/legal-luminaire/backend/rag/optimized_document_store.py` | Alternate store with parallel processing, semantic chunking, caching, and incremental indexing; no references | Benchmark only. Require case-isolation parity, redaction parity, deterministic retrieval tests, and migration/rollback planning before adoption. |
| `artifacts/legal-luminaire/backend/utils/pdf_engine.py` | Court-ready PDF helper with Devanagari font handling, watermark, margins, header/footer; no references | `INCORPORATE` only behind a gated export path. Add citation-blocking tests, font fallback tests, print-layout tests, and advocate-review disclosure tests. |
| `artifacts/legal-luminaire/backend/graph/neo4j_client.py` | Optional Neo4j client; no references | `BLOCKED_REVIEW`. Adopt only with a named graph feature, configuration, failure/fallback behavior, and tests; otherwise retire. |

## 1.4 Standalone backend utilities

| File | Current state | Disposition and required work |
|---|---|---|
| `artifacts/legal-luminaire/backend/api/regional_audit.py` | Audit script; runs at module import | Keep as a standalone audit utility. Do not import into the FastAPI runtime. Move under `scripts/` or document invocation if retained. |
| `artifacts/legal-luminaire/backend/api/stress_test_ingest.py` | Mocked ingestion stress harness | `KEEP_TEST`. Keep as a standalone performance/robustness tool; document its synthetic scope. |
| `artifacts/legal-luminaire/backend/scripts/generator.py` | Empty | `DELETE` after confirming no planned generator contract. |
| `artifacts/legal-luminaire/backend/scripts/seed_26_cases.py` | Standalone API seeder for `real_cases/` | `INCORPORATE` as documented setup tooling, not runtime. Fix stale case-count messaging, add dry-run/config options, and link from onboarding/deployment docs. |

# 2. Frontend runtime orphans

## 2.1 Feature prototypes, alternates, data, and utilities

| File | Role | Disposition and suggested integration point |
|---|---|---|
| `artifacts/legal-luminaire/src/components/EmptyState.tsx` | Reusable empty-state component | Keep as a design-system candidate. Use in pages that currently lack empty states; add tests before broad adoption. |
| `artifacts/legal-luminaire/src/components/layout/app-layout.tsx` | Legacy/alternate application layout | `ARCHIVE` or delete. Active `components/layout/Layout.tsx` already owns the shell, sidebar, breadcrumbs, and copilot. |
| `artifacts/legal-luminaire/src/components/SearchEngineV2Panel.tsx` | Phase-2 search prototype | `BLOCKED_REVIEW`. Promote only if the canonical search API and route need its query-expansion/analytics UI; add loading/error/empty states. |
| `artifacts/legal-luminaire/src/components/SiteHeader.tsx` | Alternate site header | Retire or reconcile with the active layout. Do not mount a second header. |
| `artifacts/legal-luminaire/src/components/status-badge.tsx` | Citation/status badge helper | Keep if it fills a gap not covered by `ui/accuracy-badge` and other active badges; otherwise consolidate. |
| `artifacts/legal-luminaire/src/components/ui/VirtualizedList.tsx` | Large-list virtualization helper | Keep as a performance primitive. Adopt only for measured large-list routes and add keyboard/accessibility tests. |
| `artifacts/legal-luminaire/src/components/VerificationDashboard.tsx` | Verification dashboard prototype | Compare with active verification surfaces. Promote only with a named route and current API contracts. |
| `artifacts/legal-luminaire/src/components/views/DashboardView.tsx` | Older dashboard view | Retire if superseded by active case/dashboard pages; avoid route duplication. |
| `artifacts/legal-luminaire/src/components/views/LabView.tsx` | Older lab view | Compare with active lab/research routes; retire or complete migration. |
| `artifacts/legal-luminaire/src/components/views/SearchView.tsx` | Older search view | Compare with active research/search routes; retire or complete migration. |
| `artifacts/legal-luminaire/src/data/defenceHindi.ts` | Bilingual defence content | `KEEP_DATA` until a named drafting view consumes it. Validate synthetic labeling and citation status before use. |
| `artifacts/legal-luminaire/src/data/demo-cases/demo01.ts` | Legacy demo-case aggregate | Retire or migrate unique data into the canonical case registry. Do not create a second demo-case source of truth. |
| `artifacts/legal-luminaire/src/data/stub-cases/index.ts` | Synthetic stub-case index | Keep only if the stub-case workflow is still planned; otherwise remove to reduce duplicate case registries. |
| `artifacts/legal-luminaire/src/hooks/use-mobile.tsx` | Mobile breakpoint hook | Keep as a utility candidate; adopt only if active responsive code needs it. |
| `artifacts/legal-luminaire/src/hooks/useDebounce.ts` | Debounce hook | Keep as a utility candidate for search/filter inputs; add tests if adopted. |
| `artifacts/legal-luminaire/src/lib/format.ts` | INR/date formatting helpers | Consolidate with active formatting utilities or adopt in named views to avoid duplicate formatters. |

## 2.2 Unused UI primitives — 36 files

These are unused shadcn/Radix-style primitives, not evidence of 36 missing product features. Default disposition: keep as design-system inventory only while a named consumer is planned; otherwise remove in a focused cleanup.

```text
artifacts/legal-luminaire/src/components/ui/accordion.tsx
artifacts/legal-luminaire/src/components/ui/alert-dialog.tsx
artifacts/legal-luminaire/src/components/ui/aspect-ratio.tsx
artifacts/legal-luminaire/src/components/ui/avatar.tsx
artifacts/legal-luminaire/src/components/ui/button-group.tsx
artifacts/legal-luminaire/src/components/ui/calendar.tsx
artifacts/legal-luminaire/src/components/ui/carousel.tsx
artifacts/legal-luminaire/src/components/ui/chart.tsx
artifacts/legal-luminaire/src/components/ui/checkbox.tsx
artifacts/legal-luminaire/src/components/ui/collapsible.tsx
artifacts/legal-luminaire/src/components/ui/command.tsx
artifacts/legal-luminaire/src/components/ui/context-menu.tsx
artifacts/legal-luminaire/src/components/ui/drawer.tsx
artifacts/legal-luminaire/src/components/ui/dropdown-menu.tsx
artifacts/legal-luminaire/src/components/ui/empty.tsx
artifacts/legal-luminaire/src/components/ui/field.tsx
artifacts/legal-luminaire/src/components/ui/hover-card.tsx
artifacts/legal-luminaire/src/components/ui/input-group.tsx
artifacts/legal-luminaire/src/components/ui/input-otp.tsx
artifacts/legal-luminaire/src/components/ui/item.tsx
artifacts/legal-luminaire/src/components/ui/kbd.tsx
artifacts/legal-luminaire/src/components/ui/menubar.tsx
artifacts/legal-luminaire/src/components/ui/navigation-menu.tsx
artifacts/legal-luminaire/src/components/ui/pagination.tsx
artifacts/legal-luminaire/src/components/ui/popover.tsx
artifacts/legal-luminaire/src/components/ui/radio-group.tsx
artifacts/legal-luminaire/src/components/ui/resizable.tsx
artifacts/legal-luminaire/src/components/ui/sheet.tsx
artifacts/legal-luminaire/src/components/ui/sidebar.tsx
artifacts/legal-luminaire/src/components/ui/skeleton.tsx
artifacts/legal-luminaire/src/components/ui/slider.tsx
artifacts/legal-luminaire/src/components/ui/sonner.tsx
artifacts/legal-luminaire/src/components/ui/spinner.tsx
artifacts/legal-luminaire/src/components/ui/switch.tsx
artifacts/legal-luminaire/src/components/ui/toggle-group.tsx
artifacts/legal-luminaire/src/components/ui/toggle.tsx
```

Special notes:

- `ui/sonner.tsx` imports `next-themes`, while the canonical app uses its own theme/provider stack. Verify compatibility before use.
- `ui/empty.tsx` overlaps conceptually with the unreferenced `components/EmptyState.tsx`; choose one pattern.
- `ui/sidebar.tsx` is a primitive, not the active `components/layout/Sidebar`; naming similarity does not make it wired.

# 3. Test-only code

Test-only does not mean unused. These files are intentionally outside the production runtime.

## 3.1 Frontend — 15 files

```text
artifacts/legal-luminaire/src/__tests__/academy.test.ts
artifacts/legal-luminaire/src/__tests__/adversarial-citation-gate.test.ts
artifacts/legal-luminaire/src/__tests__/ai-reasoning.test.ts
artifacts/legal-luminaire/src/__tests__/analytics-graph.test.ts
artifacts/legal-luminaire/src/__tests__/citation-gate.test.ts
artifacts/legal-luminaire/src/__tests__/citation-intelligence.test.ts
artifacts/legal-luminaire/src/__tests__/integration-supplements.test.tsx
artifacts/legal-luminaire/src/__tests__/robustness-suite.test.ts
artifacts/legal-luminaire/src/__tests__/search-engine-v2.test.ts
artifacts/legal-luminaire/src/__tests__/self-assessment.test.ts
artifacts/legal-luminaire/src/__tests__/verification-engine.test.ts
artifacts/legal-luminaire/src/__tests__/week2-data-layer.test.ts
artifacts/legal-luminaire/src/config/navigation-integrity.test.ts
artifacts/legal-luminaire/src/data/demo-cases/intake-examples-completeness.test.ts
```

Disposition: `KEEP_TEST`. The fifteenth file is production-shaped but test-reachable only:

| File | Disposition |
|---|---|
| `artifacts/legal-luminaire/src/lib/intake-schema.ts` | Decide whether intake runtime should consume this schema. If yes, wire it into the active intake form and keep validation tests; if no, move it beside the tests or remove it. |

## 3.2 Backend — 22 files

```text
artifacts/legal-luminaire/backend/api/__init__.py
artifacts/legal-luminaire/backend/rag/__init__.py
artifacts/legal-luminaire/backend/services/__init__.py
artifacts/legal-luminaire/backend/services/variant_engine.py
artifacts/legal-luminaire/backend/tests/__init__.py
artifacts/legal-luminaire/backend/tests/conftest.py
artifacts/legal-luminaire/backend/tests/test_authentication.py
artifacts/legal-luminaire/backend/tests/test_citation_registry.py
artifacts/legal-luminaire/backend/tests/test_copilot.py
artifacts/legal-luminaire/backend/tests/test_deadline_engine.py
artifacts/legal-luminaire/backend/tests/test_drafting_engine.py
artifacts/legal-luminaire/backend/tests/test_health_route.py
artifacts/legal-luminaire/backend/tests/test_http_contract.py
artifacts/legal-luminaire/backend/tests/test_rate_limit.py
artifacts/legal-luminaire/backend/tests/test_route_registry.py
artifacts/legal-luminaire/backend/tests/test_security_remediation.py
artifacts/legal-luminaire/backend/tests/test_stadium_collapse_accuracy.py
artifacts/legal-luminaire/backend/tests/test_variant_engine.py
artifacts/legal-luminaire/backend/tests/test_verification_syntax.py
artifacts/legal-luminaire/backend/verification/__init__.py
artifacts/legal-luminaire/backend/verification/accuracy_pipeline.py
artifacts/legal-luminaire/backend/verification/error_detector.py
```

Disposition notes:

- Tests and package initializers: `KEEP_TEST`.
- `services/variant_engine.py`: `BLOCKED_REVIEW`; see the pleading-variants cluster.
- `verification/accuracy_pipeline.py` and `verification/error_detector.py`: test-only production modules with existing local modifications. Treat as modification-in-progress, not deletion candidates. Decide whether the active verification route should consume them.
- `tests/test_drafting_engine.py` is a documented skip stub for P2-01.
- `tests/test_variant_engine.py` contains registry-gated skips for P2-02.

# 4. Active utility and support code

## 4.1 Root `scripts/` — 11 files

| File | Disposition |
|---|---|
| `scripts/autopilot-one-hour.ps1` | Keep as developer validation tool; already excludes retired packages |
| `scripts/clean.ps1` | Keep as maintenance utility; document destructive scope before use |
| `scripts/gen_discharge_v5.py` | Review for retirement or fold into canonical drafting/export tooling |
| `scripts/generate_discharge_english.py` | Review for retirement or fold into canonical drafting/export tooling |
| `scripts/generate_discharge_pdf.py` | Review against `backend/utils/pdf_engine.py`; avoid duplicate PDF pipelines |
| `scripts/package.json` | Keep; workspace typecheck package |
| `scripts/post-merge.sh` | Legacy Drizzle utility; not canonical FastAPI workflow |
| `scripts/scan_markdown_duty.py` | Keep as documentation-governance scanner |
| `scripts/seed-demo-data.ts` | Keep as setup utility; update API/schema assumptions before documenting |
| `scripts/test_launch_browser.py` | Keep; referenced by README and launch lint |
| `scripts/tsconfig.json` | Keep; includes the seeder for workspace typecheck |

## 4.2 App-level utility scripts — 3 files

| File | Disposition |
|---|---|
| `artifacts/legal-luminaire/scripts/seed-hemraj-case.ts` | Legacy Drizzle seeder; not canonical FastAPI setup. Retain only with `lib/db`, otherwise retire. |
| `artifacts/legal-luminaire/backend/scripts/generator.py` | `DELETE`; empty |
| `artifacts/legal-luminaire/backend/scripts/seed_26_cases.py` | Keep as documented backend setup utility |

# 5. Legacy workspace packages — 79 files

These packages are workspace members and may be typechecked, but the canonical React app does not import them and the FastAPI backend does not use them. They belong to the retired Express/Drizzle stack or its tooling.

## 5.1 `lib/api-spec/` — 3 files

Disposition: `ARCHIVE` with the retired Express API unless a new API contract deliberately adopts it.

```text
lib/api-spec/openapi.yaml
lib/api-spec/orval.config.ts
lib/api-spec/package.json
```

## 5.2 `lib/api-client-react/` — 6 files

Disposition: `ARCHIVE`; generated client for the retired API surface.

```text
lib/api-client-react/package.json
lib/api-client-react/src/custom-fetch.ts
lib/api-client-react/src/generated/api.schemas.ts
lib/api-client-react/src/generated/api.ts
lib/api-client-react/src/index.ts
lib/api-client-react/tsconfig.json
```

## 5.3 `lib/api-zod/` — 60 files

Disposition: `ARCHIVE`; generated schemas for the retired API surface.

```text
lib/api-zod/package.json
lib/api-zod/src/generated/api.ts
lib/api-zod/src/generated/types/activityItem.ts
lib/api-zod/src/generated/types/activityItemActivityType.ts
lib/api-zod/src/generated/types/bill.ts
lib/api-zod/src/generated/types/billBillType.ts
lib/api-zod/src/generated/types/billStatus.ts
lib/api-zod/src/generated/types/case.ts
lib/api-zod/src/generated/types/caseCategory.ts
lib/api-zod/src/generated/types/caseStatus.ts
lib/api-zod/src/generated/types/correspondence.ts
lib/api-zod/src/generated/types/correspondenceDirection.ts
lib/api-zod/src/generated/types/createBillBody.ts
lib/api-zod/src/generated/types/createBillBodyBillType.ts
lib/api-zod/src/generated/types/createBillBodyStatus.ts
lib/api-zod/src/generated/types/createCaseBody.ts
lib/api-zod/src/generated/types/createCaseBodyCategory.ts
lib/api-zod/src/generated/types/createCaseBodyStatus.ts
lib/api-zod/src/generated/types/createCorrespondenceBody.ts
lib/api-zod/src/generated/types/createCorrespondenceBodyDirection.ts
lib/api-zod/src/generated/types/createDraftBody.ts
lib/api-zod/src/generated/types/createDraftBodyDraftType.ts
lib/api-zod/src/generated/types/createDraftBodyStatus.ts
lib/api-zod/src/generated/types/createNoticeBody.ts
lib/api-zod/src/generated/types/createNoticeBodyNoticeType.ts
lib/api-zod/src/generated/types/createNoticeBodyStatus.ts
lib/api-zod/src/generated/types/createPartyBody.ts
lib/api-zod/src/generated/types/createPartyBodyPartyType.ts
lib/api-zod/src/generated/types/dashboardSummary.ts
lib/api-zod/src/generated/types/draft.ts
lib/api-zod/src/generated/types/draftDraftType.ts
lib/api-zod/src/generated/types/draftStatus.ts
lib/api-zod/src/generated/types/getRecentActivityParams.ts
lib/api-zod/src/generated/types/healthStatus.ts
lib/api-zod/src/generated/types/index.ts
lib/api-zod/src/generated/types/listBillsParams.ts
lib/api-zod/src/generated/types/listBillsStatus.ts
lib/api-zod/src/generated/types/listCasesParams.ts
lib/api-zod/src/generated/types/listCasesStatus.ts
lib/api-zod/src/generated/types/listCorrespondenceDirection.ts
lib/api-zod/src/generated/types/listCorrespondenceParams.ts
lib/api-zod/src/generated/types/listDraftsParams.ts
lib/api-zod/src/generated/types/listDraftsStatus.ts
lib/api-zod/src/generated/types/listNoticesParams.ts
lib/api-zod/src/generated/types/notice.ts
lib/api-zod/src/generated/types/noticeNoticeType.ts
lib/api-zod/src/generated/types/noticeStatus.ts
lib/api-zod/src/generated/types/party.ts
lib/api-zod/src/generated/types/partyPartyType.ts
lib/api-zod/src/generated/types/pendingBillsSummary.ts
lib/api-zod/src/generated/types/pendingBillsSummaryBreakdownItem.ts
lib/api-zod/src/generated/types/updateBillBody.ts
lib/api-zod/src/generated/types/updateBillBodyStatus.ts
lib/api-zod/src/generated/types/updateCaseBody.ts
lib/api-zod/src/generated/types/updateCaseBodyStatus.ts
lib/api-zod/src/generated/types/updateDraftBody.ts
lib/api-zod/src/generated/types/updateDraftBodyStatus.ts
lib/api-zod/src/index.ts
lib/api-zod/tsconfig.json
```

## 5.4 `lib/db/` — 10 files

Disposition: retain only while `scripts/post-merge.sh` or `seed-hemraj-case.ts` intentionally use the legacy database. It is not the canonical FastAPI persistence layer.

```text
lib/db/drizzle.config.ts
lib/db/package.json
lib/db/src/index.ts
lib/db/src/schema/bills.ts
lib/db/src/schema/cases.ts
lib/db/src/schema/correspondence.ts
lib/db/src/schema/drafts.ts
lib/db/src/schema/index.ts
lib/db/src/schema/notices.ts
lib/db/src/schema/parties.ts
lib/db/tsconfig.json
```

# 6. Archived code — 93 files

These files are already under `archive/`. Default disposition is `ARCHIVE`; do not merge them into the canonical runtime without a superseding ADR.

## 6.1 Retired Express/Drizzle API — 20 files

```text
archive/retired-packages/api-server/.replit-artifact/artifact.toml
archive/retired-packages/api-server/build.mjs
archive/retired-packages/api-server/package.json
archive/retired-packages/api-server/src/app.ts
archive/retired-packages/api-server/src/index.ts
archive/retired-packages/api-server/src/lib/.gitkeep
archive/retired-packages/api-server/src/lib/logger.ts
archive/retired-packages/api-server/src/lib/route-value-mappers.ts
archive/retired-packages/api-server/src/middlewares/.gitkeep
archive/retired-packages/api-server/src/routes/bills.ts
archive/retired-packages/api-server/src/routes/cases.ts
archive/retired-packages/api-server/src/routes/correspondence.ts
archive/retired-packages/api-server/src/routes/dashboard.ts
archive/retired-packages/api-server/src/routes/drafts.ts
archive/retired-packages/api-server/src/routes/health.ts
archive/retired-packages/api-server/src/routes/index.ts
archive/retired-packages/api-server/src/routes/notices.ts
archive/retired-packages/api-server/src/routes/parties.ts
archive/retired-packages/api-server/tsconfig.json
```

## 6.2 Retired mockup sandbox — 69 files

```text
archive/retired-packages/mockup-sandbox/.replit-artifact/artifact.toml
archive/retired-packages/mockup-sandbox/components.json
archive/retired-packages/mockup-sandbox/index.html
archive/retired-packages/mockup-sandbox/mockupPreviewPlugin.ts
archive/retired-packages/mockup-sandbox/package.json
archive/retired-packages/mockup-sandbox/src/.generated/mockup-components.ts
archive/retired-packages/mockup-sandbox/src/App.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/accordion.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/alert-dialog.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/alert.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/aspect-ratio.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/avatar.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/badge.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/breadcrumb.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/button-group.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/button.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/calendar.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/card.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/carousel.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/chart.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/checkbox.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/collapsible.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/command.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/context-menu.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/dialog.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/drawer.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/dropdown-menu.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/empty.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/field.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/form.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/hover-card.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/input-group.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/input-otp.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/input.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/item.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/kbd.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/label.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/menubar.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/navigation-menu.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/pagination.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/popover.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/progress.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/radio-group.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/resizable.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/scroll-area.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/select.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/separator.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/sheet.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/sidebar.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/skeleton.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/slider.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/sonner.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/spinner.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/switch.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/table.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/tabs.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/textarea.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/toast.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/toaster.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/toggle-group.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/toggle.tsx
archive/retired-packages/mockup-sandbox/src/components/ui/tooltip.tsx
archive/retired-packages/mockup-sandbox/src/hooks/use-mobile.tsx
archive/retired-packages/mockup-sandbox/src/hooks/use-toast.ts
archive/retired-packages/mockup-sandbox/src/index.css
archive/retired-packages/mockup-sandbox/src/lib/utils.ts
archive/retired-packages/mockup-sandbox/src/main.tsx
archive/retired-packages/mockup-sandbox/tsconfig.json
archive/retired-packages/mockup-sandbox/vite.config.ts
```

## 6.3 Retired scripts — 4 files

```text
archive/retired-scripts/_gen.py
archive/retired-scripts/audit_scatter.ts
archive/retired-scripts/gen_discharge_v4.py
archive/retired-scripts/load_test_sim.py
```

# 7. Missing source and recovery evidence

The following source files do not exist. They are listed because tests, routers, or historical evidence still refer to them.

```text
artifacts/legal-luminaire/backend/drafting/__init__.py
artifacts/legal-luminaire/backend/drafting/architecture.py
artifacts/legal-luminaire/backend/drafting/blocks.py
artifacts/legal-luminaire/backend/drafting/catalog.py
artifacts/legal-luminaire/backend/drafting/conflicts.py
artifacts/legal-luminaire/backend/drafting/engine.py
artifacts/legal-luminaire/backend/drafting/grounds.py
artifacts/legal-luminaire/backend/drafting/placeholders.py
artifacts/legal-luminaire/backend/drafting/prompts.py
artifacts/legal-luminaire/backend/registry/__init__.py
artifacts/legal-luminaire/backend/registry/derivative_drafts.py
```

Evidence: `archive/unwired-recovery/README.md` and `docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md`. The source was never committed and cannot be safely reconstructed from the archived Python 3.14 bytecode. Choose supersede-by-ADR or deliberate rebuild.

# 8. Wired auxiliary and duplicate checkout

## Wired auxiliary: research daemon

```text
ETERNAL_RESEARCH_CHILD/README.md
ETERNAL_RESEARCH_CHILD/package.json
ETERNAL_RESEARCH_CHILD/phase2_improvement_pipeline.ts
ETERNAL_RESEARCH_CHILD/research_daemon.ts
ETERNAL_RESEARCH_CHILD/research_findings.log
ETERNAL_RESEARCH_CHILD/tsconfig.json
```

Disposition: `WIRED_AUXILIARY`. Root `pnpm daemon*` scripts invoke it, and its generated feed is consumed by `/improvement-lab`. It is not in the web request path.

Configuration gap: `ETERNAL_RESEARCH_CHILD/package.json` runs `tsc -p tsconfig.phase2.json`, but that file is absent. Add it or correct the script before treating daemon typecheck as reliable.

## Duplicate checkout

`legal-luminaire/` is a separate nested Git repository at `ff68166`. It duplicates the main tree and is intentionally counted once. Do not merge or delete it without user direction.

`.kilo/worktrees/succulent-buffer/` is a linked worktree at detached HEAD `8903cde`; it is tooling metadata, not source backlog.

# 9. Recommended implementation order

1. Resolve P2-01 and P2-02; keep the variants router blocked until fail-open behavior is removed.
2. Add explicit citation-gate, auth, case-scope, persistence, and test requirements to any derivative-draft registration plan.
3. Benchmark alternate gate/RAG implementations against canonical behavior.
4. Triage frontend prototypes by named route and user journey; retire duplicates.
5. Document seeder/audit/stress utilities and retire duplicate PDF/drafting generators.
6. Keep archived packages archived; decide whether legacy `lib/db` and the Hemraj seeder are still needed.
7. Remove the empty generator and resolve the duplicate checkout only after user approval.
