# ACTION PLAN — Draft Multiplication: One Subject → Full Document Family

Goal: from ONE drafted petition/application, automatically derive every
companion pleading a lawyer needs in that matter — in correct, jurisdiction-aware
legal terminology — across all 50 subjects, with Citation Search precedents
piped in and the existing zero-hallucination citation gate intact.

## A. Derivative-type taxonomy (what "multiplication" produces)

| Derivative type | Responds to / extends | When filed | Prayer focus |
|---|---|---|---|
| Rejoinder (प्रत्युत्तर) | Reply / written statement / counter | After respondent's reply, before final hearing | Parent application allowed; reply rejected as evasive; preliminary objections overruled |
| Replication (प्रतिप्रार्थना) | Written statement | Within court-fixed time after WS | O VIII R 5 CPC deemed admissions; WS evasive; trial on issues |
| Counter-Affidavit (प्रति-शपथपत्र) | Writ petition / sworn application | Return date after notice | Petition dismissed with costs; interim relief vacated |
| Supplementary Application (अनुपूरक प्रार्थना-पत्र) | Main petition/application | After filing, before judgment, on subsequent facts | Supplementary facts/documents taken on record with the main application |
| Amendment Application (संशोधन) | Parent pleading | Ideally before trial (O VI R 17 CPC test) | Leave to amend; amended pleading taken on record |
| Interim Stay / Interim Application | Main application/appeal | With parent or on apprehended coercive action | Stay of operation/proceedings pending disposal (triple test) |
| Review Application | Final order of same court | Statutory limitation (30/60 days) | Review and rectification — recall/modify/set aside |
| Appeal / Memo of Appeal | Lower court/tribunal order | Within limitation (+condonation) | Impugned order set aside / remand |
| Caveat (केवियट) | Anticipated opponent application | On apprehension of ex-parte motion | No order without notice to caveator (s.148-A regime) |
| Execution Application | Decree in applicant's favour | When decree executable | Execution by attachment/sale/arrest per O XXI CPC |
| Restoration Application | Dismissal in default | 30 days (+condonation) | Dismissal set aside; case restored to original number |
| Additional Evidence Application | Pending trial/appeal | Before arguments conclude | Additional documents/witnesses taken on record (due-diligence test) |

Each type carries: Hindi label, parent-relation description, when-filed rule,
prayer focus, jurisdiction notes, and mandatory terminology — all stored as
data in `backend/registry/derivative_drafts.json` (NOT hardcoded prompts), so
counsel can extend the taxonomy without touching code.

## B. The 50-subject matrix (applicability per subject)

Every subject id below exists in `derivative_drafts.json` with its applicable
derivative types — e.g. a consumer matter gets replication/rejoinder/counter/
supplementary/interim/caveat/appeal/review/execution, while a writ-education
matter gets a smaller family (no execution). Full matrix (50 subjects):

1. criminal_bail — 2. criminal_discharge — 3. criminal_trial — 4. criminal_appeals — 5. criminal_ni_act — 6. criminal_domestic — 7. civil_suit — 8. civil_property — 9. civil_injunction — 10. civil_contract — 11. civil_tort — 12. writ_service — 13. writ_land — 14. writ_education — 15. writ_elections — 16. service_termination — 17. service_pension — 18. service_promotion — 19. labour_industrial — 20. labour_wages — 21. consumer_deficiency — 22. consumer_unfair — 23. mact_motor — 24. family_marriage — 25. family_custody — 26. family_succession — 27. arbitration_tribunal — 28. arbitration_sec34 — 29. ibc_corporate — 30. companies_nclt — 31. sebi_securities — 32. competition_cci — 33. banking_recovery — 34. sarfaesi_drt — 35. ni_negotiable — 36. rent_eviction — 37. land_revenue — 38. tax_income — 39. tax_gst — 40. customs_excise — 41. ip_trademark — 42. ip_copyright — 43. ip_patent — 44. cyber_it_act — 45. environment_ngt — 46. electricity_erc — 47. rera_realty — 48. coop_societies — 49. insurance_claims — 50. medical_negligence

Rollout sequence (safe, incremental):
- **Wave 1 (shakedown):** criminal_discharge, criminal_bail, civil_suit — highest draft volume, matches existing DISCHARGE/BAIL_439 engine.
- **Wave 2:** writ_service, writ_land, mact_motor, consumer_deficiency, family_marriage — counter-affidavit/rejoinder-heavy families.
- **Wave 3:** arbitration_sec34, ibc_corporate, banking_recovery, sarfaesi_drt, tax_income, tax_gst — appellate + execution families.
- **Wave 4:** remaining subjects — pure data rows in the registry; zero code change.

## C. File-by-file change list (all paths verified in the repo)

| File | Status | What it adds |
|---|---|---|
| `artifacts/legal-luminaire/backend/registry/__init__.py` | NEW | Registry loader + system-prompt builder + authority-block formatter |
| `artifacts/legal-luminaire/backend/registry/derivative_drafts.json` | NEW | 12 derivative types + 50-subject applicability matrix |
| `artifacts/legal-luminaire/backend/agents/derivative_drafter.py` | NEW | Derivative generator: parent-child context, authority-block injection, Gemini call, citation extraction |
| `artifacts/legal-luminaire/backend/api/routes_derivative.py` | NEW | 4 endpoints (below) + lineage persisted as `draft_family.json` beside `case_data.json` (same sanitized-id scheme as `JSONCaseRepository`) |
| `artifacts/legal-luminaire/backend/main.py` | +3 lines | Import + `app.include_router(derivative_router, prefix="/api/v1")` |
| `artifacts/legal-luminaire/src/lib/draft-family.ts` | NEW | Typed frontend client |
| `artifacts/legal-luminaire/src/pages/DraftFamilyPanel.tsx` | NEW | Draft Multiplication studio (subject → version → parent → authorities → generate → family tree) |
| `artifacts/legal-luminaire/src/routes.tsx` | +3 lines | Lazy route `/case/:id/draft-family` |

## D. New API surface (`/api/v1`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/derivative-types?subject_id=` | Registry listing, filtered by subject |
| GET | `/subjects` | 50-subject taxonomy |
| POST | `/cases/{case_id}/derivative-drafts` | Generate one derivative draft (subject, type, parent, authority blocks, notes) → draft + lineage + citations |
| GET | `/cases/{case_id}/draft-family` | Full lineage tree for the case |

## E. How Drafting Studio + Citation Search plug in

1. Draft the parent (petition/application) in the existing Drafting Studio — unchanged flow.
2. Open **Draft Family** (`/case/<id>/draft-family`); choose the subject; the panel filters applicable versions.
3. Pick the parent draft — the generator receives its verbatim body and must keep facts, dates, parties and cross-references consistent.
4. **Citation Search hook:** the authority box reuses `src/lib/search.ts` (the exact engine behind CitationSearchPage); picked authorities travel as authority blocks (title/citation/holding/application) and the prompt restricts the draft to ONLY those precedents.
5. Extracted citations from every derivative draft feed the existing `/verify-citations` gate, so the Week-12 safety barrier applies to the whole family.

## F. Verification already performed (in-sandbox)

- `python -m py_compile` clean on: `registry/__init__.py`, `agents/derivative_drafter.py`, `api/routes_derivative.py`, `main.py`.
- Registry unit test: 12 derivative types, 50 subjects, every `applicable_types` reference resolves; prompt builder emits Rejoinder/Hindi/VERIFIED markers.
- `esbuild` parse of `draft-family.ts` and `DraftFamilyPanel.tsx` (1.0 kB / 11.9 kB, no errors).
- `git diff --cached --stat`: 8 files, 1020 insertions, 0 deletions.

Not verified locally: a live Gemini end-to-end generation (needs `GOOGLE_API_KEY`) and the full `pnpm build` (heavy deps) — both use existing, already-configured paths in the repo.

## G. Apply & rollback

Apply: `unzip draft-multiplication-patch.zip -d legal-luminaire/` — no new deps either side.
Rollback: `git checkout -- artifacts/legal-luminaire/backend/main.py artifacts/legal-luminaire/src/routes.tsx` and delete the 6 new files (list in APPLY.md §5).

## H. Next increments (post-merge)

1. Surface a "Draft Family" tab inside DraftingView's sidebar for discoverability.
2. Per-subject jurisdiction packs (Rajasthan HC, SCI, district) — extend `court_styles.py` data, not code.
3. Family-wide citation sweep: one `/verify-citations` call across all drafts in `draft_family.json` with a combined safety badge.
4. One-click "Full Family" generation: generate all applicable types for the subject in sequence with progress UI.
5. Deadline Engine hook: auto-schedule rejoinder/replication limitation dates when a family member is generated (`routes_deadlines.py` integration).
