# Phase 3 Case Expansion Roadmap — Backlog Index

**Original Source:** `SUPPLEMENT\CASE-COMPENDIUM` — consolidated here for discoverability & roadmap alignment.
**Current Total Demo Cases:** 86 implemented (TC-01 to TC-26 + TC-27/31 Serious Criminal + TC-72/86 Civil Disputes).
**Phase 3 Backlog:** +40 new cases (TC-32 to TC-71) across 9 new verticals = **126 cases total** upon full completion.
**Authoritative Active Data Location:** All implemented case packs live in `real_cases/` root; all demo browser metadata lives in `src/data/all-demo-cases.ts`.

---

## Table of Contents

| # | File | TC Range | Status | Vertical |
|---|------|----------|--------|----------|
| 1 | [01_IMPLEMENTED_INFRA_ARB_TC22_26.md](01_IMPLEMENTED_INFRA_ARB_TC22_26.md) | TC-22..TC-26 | ✅ DONE | Infrastructure Arbitration (5) |
| 2 | [02_IMPLEMENTED_SERIOUS_CRIMINAL_TC27_31.md](02_IMPLEMENTED_SERIOUS_CRIMINAL_TC27_31.md) | TC-27..TC-31 | ✅ DONE | Serious Criminal — Murder/Rape/POCSO/Conspiracy (5) |
| 3 | [03_IMPLEMENTED_CIVIL_DISPUTES_TC72_86.md](03_IMPLEMENTED_CIVIL_DISPUTES_TC72_86.md) | TC-72..TC-86 | ✅ DONE | Civil Disputes — Title/Injunction/Partition/Consumer (15) |
| — | [12_EXPANDED_TC74_SPECIFIC_PERFORMANCE_FULLSET.md](12_EXPANDED_TC74_SPECIFIC_PERFORMANCE_FULLSET.md) | TC-74 | ✅ DONE | Expanded design spec for Specific Performance full document pack |
| — | [00_COMPENDIUM_ORIGINAL_README_TC74_TC75_PACK.md](00_COMPENDIUM_ORIGINAL_README_TC74_TC75_PACK.md) | TC-74, TC-75 | ✅ DONE | Original Compendium README — TC74/TC75 full pack + 86-case roll-up |
| — | [13_HISTORIC_ARCHIVE_TC74_SPECIFIC_PERFORMANCE_PACK_ORIGINAL/](13_HISTORIC_ARCHIVE_TC74_SPECIFIC_PERFORMANCE_PACK_ORIGINAL/) | TC-74 | ✅ DONE (archive) | Original drafted pack — superseded by `real_cases/CIVIL_03_*` |
| — | [14_HISTORIC_ARCHIVE_TC75_INJUNCTION_PACK_ORIGINAL/](14_HISTORIC_ARCHIVE_TC75_INJUNCTION_PACK_ORIGINAL/) | TC-75 | ✅ DONE (archive) | Original drafted pack — superseded by `real_cases/CIVIL_04_*` |
| 4 | [04_FUTURE_FINANCIAL_CRIME_TC32_36.md](04_FUTURE_FINANCIAL_CRIME_TC32_36.md) | TC-32..TC-36 | 🔜 PHASE 3 | Financial Crime — Bank Fraud / Investment / Corporate / Digital / Insurance (5) |
| 5 | [05_FUTURE_ANTI_CORRUPTION_TC37_41.md](05_FUTURE_ANTI_CORRUPTION_TC37_41.md) | TC-37..TC-41 | 🔜 PHASE 3 | Anti-Corruption / PC Act — Trap / Tender / Conspiracy / DA / Trap+Conspiracy (5) |
| 6 | [06_FUTURE_CHEQUE_138_TC42_46.md](06_FUTURE_CHEQUE_138_TC42_46.md) | TC-42..TC-46 | 🔜 PHASE 3 | Cheque Dishonour / s.138 NI Act — Full lifecycle × 5 fact patterns (5) |
| 7 | [07_FUTURE_THEFT_BURGLARY_TC47_51.md](07_FUTURE_THEFT_BURGLARY_TC47_51.md) | TC-47..TC-51 | 🔜 PHASE 3 | Theft / Burglary / House-Breaking / Robbery / Dacoity (5) |
| 8 | [08_FUTURE_CHEATING_420_TC52_56.md](08_FUTURE_CHEATING_420_TC52_56.md) | TC-52..TC-56 | 🔜 PHASE 3 | Cheating u/s 420 IPC — Real Estate / Education / Job / Loan / Cyber (5) |
| 9 | [09_FUTURE_DEFAMATION_TC57_61.md](09_FUTURE_DEFAMATION_TC57_61.md) | TC-57..TC-61 | 🔜 PHASE 3 | Defamation / Dignity / Privacy — Print / Social / Political / Medical / Commercial (5) |
| 10 | [10_FUTURE_LAND_REVENUE_TC62_66.md](10_FUTURE_LAND_REVENUE_TC62_66.md) | TC-62..TC-66 | 🔜 PHASE 3 | Land & Revenue Courts — Mutation / Encroachment / Bhoodan / Ceiling / Tenancy (5) |
| 11 | [11_FUTURE_PROPERTY_RERA_TC67_71.md](11_FUTURE_PROPERTY_RERA_TC67_71.md) | TC-67..TC-71 | 🔜 PHASE 3 | Property / RERA deep dives — RERA Project / HOA / Gift / Lease / Co-Ownership (5) |

---

## Suggested Phase 3 Execution Order (priority)

1. **TC-32/36 Financial Crime** — FIN_01 Bank Fraud and FIN_02 Investment already have skeleton folders in `real_cases/`. Lowest lift to complete FIN_03-05 and wire category.
2. **TC-42/46 Cheque u/s 138** — Highest volume Indian civil/criminal overlap. Reuses existing NI Act drafting patterns from TC-03/TC-13.
3. **TC-52/56 Cheating 420** — Facts align with existing financial-fraud standards matrices already in repo.
4. **TC-37/41 Anti-Corruption** — Entirely new vertical. Needs: new FSL/Vigilance standards matrix, trap-procedure checklist, DA asset-schedule docs.
5. **TC-62/66 Land Revenue** — Needs revenue-court specific forms (mutation, khata, jamabandi); overlaps with civil-title TC-72 but different forum.
6. **TC-47/51 Theft/Burglary** — Straightforward criminal fact patterns; reuses existing criminal standards.
7. **TC-67/71 Property/RERA** — RERA adjudication is high-value commercial niche; needs RERA-specific Forms I/II/III knowledge.
8. **TC-57/61 Defamation/Dignity** — Requires balancing with existing POCSO/sexual-offence standards; may need separate dignity matrix.
9. **TC-70/71 + remaining financial verticals wrap-up** — Insurance, digital scams, cyber cheating are long-tail.

---

## Wiring Checklist Per Vertical (when implementing)

When turning any of these 9 design specs into active cases, **ALL** of the following must be updated (derived from the gaps audit of TC-27/31 and TC-72/86):

| Step | File / Location | What to do |
|------|-----------------|------------|
| 1 | `real_cases/<NEW_FOLDER_*>/` | Create 11-16 doc pack per folder (facts, evidence, standards, 4-8 drafted `.lex` docs, Hindi variants, cross-exam keys, checklists) |
| 2 | `artifacts/legal-luminaire/backend/scripts/seed_26_cases.py` → rename to `seed_86_cases.py` then `seed_126_cases.py` | Add folder to `CASES_TO_SEED` dict so RAG ingests the pack |
| 3 | `artifacts/legal-luminaire/src/data/case-pack-paths.ts` | Add every new TC ID → `REPO_PACK_BY_DEMO_ID` folder-path mapping |
| 4 | `artifacts/legal-luminaire/src/data/all-demo-cases.ts` | Add 5 new case entries (title, shortTitle, description, subject, court, parties, category, icon, color, isNew:true). Do NOT re-use existing TC IDs — collision risk. |
| 5 | `artifacts/legal-luminaire/src/pages/DemoCaseBrowser.tsx` | Add new category to `DEMO_CATEGORIES` array (icon + color + label) |
| 6 | `artifacts/legal-luminaire/src/components/home/OnboardingHero.tsx` | Update "Try **86** Demo Cases" → next number |
| 7 | `artifacts/legal-luminaire/src/components/home/DemoModeCard.tsx` | Update promo text and button label count |
| 8 | `README.md` | Update hero tagline, key features bullet, quick-start, how-to-use counts |
| 9 | `about the project.md` | Update opening sentence case count and subject coverage list |
| 10 | `docs/marketing/*_INTEGRATION_SUMMARY.md` | Copy existing integration summary template, fill for new vertical |
| 11 | Run backend test | `python backend/scripts/seed_86_cases.py --dry-run` to confirm ingestion |
| 12 | UI manual check | Load demo browser → filter category → click each card → confirm "Load Case" button resolves to folder (not synthetic hint) |

---

## Duplicate-ID Risk Note

On 2026-09-15 audit, `all-demo-cases.ts` was found to have **two separate entries sharing IDs TC-27 through TC-31** (one block under "Week 03 — Public Law/Arbitration/Execution Writ/Civil/Commercial" and a second block under "Serious Criminal Matters"). Before adding new TC IDs, reconcile this collision by either:

- Renaming the older WEEK-03 public-law block to a new free TC range (e.g. TC-100..TC-104), OR
- Deduping the entries so only the "Serious Criminal" block owns TC-27..TC-31.

Failing to do so means React will warn on duplicate-keys in the demo browser list and the wrong case card may load.
