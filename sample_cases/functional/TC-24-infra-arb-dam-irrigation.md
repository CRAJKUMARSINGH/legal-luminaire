---
test_id: TC-24
title: "Infrastructure Arbitration — Dam (Medium Irrigation Dam)"
category: infrastructure_arbitration
sub_category: dam_hydraulic
priority: P1
status: active
synthetic: true
label: "SYNTHETIC / DEMO"
contract_value: "₹87.40 Crore"
case_folder: INFRA_ARB_03_DAM_IRRIGATION_2026
---

# TC-24 — Infrastructure Arbitration: Medium Irrigation Dam, River Banas, Rajsamand

> **ALL DATA IS SYNTHETIC / DEMO. No real persons, contracts, or proceedings.**

## Purpose
Test geological-surprise and force-majeure arbitration lifecycle. Demonstrates FIDIC Sub-Clause 4.12 (Unforeseeable Physical Conditions) claim — the most technically complex claim type in construction arbitration. Tests expert-report-based Fact-Fit scoring.

## Case Facts (Synthetic)

| Field | Value |
|-------|-------|
| Project | Construction of Medium Irrigation Dam across River Banas, District Rajsamand |
| Contractor | M/s. Rajasthan Construction Consortium (SYNTHETIC) |
| Employer | Water Resources Department, Govt. of Rajasthan (SYNTHETIC) |
| Contract Value | ₹87.40 Crore |
| Time Allowed | 30 months |
| Work Order Date | 15.04.2024 |
| Site Handover | 10.05.2024 |
| Major Issue | Unexpected hard rock + swelling clay at foundation (from Month 4) |
| Scheduled Completion | 14.10.2026 |
| Progress at Termination | 29% |
| Termination Notice | 18.02.2026 |
| Arbitration Invoked | 05.03.2026 |

## Claim Matrix (Fact-Fit Gate)

| Claim | Amount (₹) | Fact-Fit Score | Status | Key Evidence |
|-------|-----------|----------------|--------|--------------|
| Geological Surprise (FIDIC 4.12) | 18.75 Cr | 97 | VERIFIED | Borehole logs + Expert report |
| Design Change by Dept | 12.60 Cr | 92 | VERIFIED | Revised drawings |
| Delay in Material Approval | 7.85 Cr | 85 | VERIFIED | Correspondence |
| Idle Plant & Machinery | 9.40 Cr | 81 | VERIFIED | Equipment logs |
| Loss of Profit | 6.25 Cr | 55 | SECONDARY | Formula-based |
| **Total** | **₹54.85 Cr** | — | — | — |

## Applicable Standards

- IS 6512:1987 (Criteria for Design of Dams)
- IS 1893 (Earthquake Resistant Design)
- CPWD Specifications for Hydraulic Works
- FIDIC Clause 4.12 (Unforeseeable Physical Conditions), 13.1 (Variations), 19.1 (Force Majeure)
- Arbitration & Conciliation Act 1996 §11, §34, §36

## Expected Behaviour

1. System identifies geological surprise as highest-scoring claim (97 Fact-Fit).
2. Contradiction Radar: Dept's pre-tender borehole report showed uniform strata — concealment of actual conditions.
3. FIDIC 4.12 analysis: tender bore logs vs actual conditions — system flags discrepancy.
4. Expert report requirement detected for geological claim — system prompts upload.
5. Case Strength Snapshot: Defence Viability ≥ 85%, Evidence Grounding ≥ 88%.
6. Award preview: 70% of verified claims ≈ ₹34 Cr + 9% interest.

## Pass Criteria

| Criterion | Expected |
|-----------|----------|
| Geological claim identified as VERIFIED (97 score) | YES |
| FIDIC 4.12 cited correctly | YES |
| Concealment contradiction detected | YES |
| Loss of Profit marked SECONDARY | YES |
| Expert report prompt shown | YES |

## Fail Conditions

- Geological claim blocked despite VERIFIED status.
- FIDIC 4.12 clause number incorrect.
- No contradiction between pre-tender borehole logs and actual conditions.

## Notes

- Geological surprise claims require expert geotechnical report — system must prompt for it.
- IS 6512:1987 and IS 1893 are dam-specific — do not substitute building/road standards.
- Force Majeure (FIDIC 19.1) applies if monsoon exceeded historical averages — flag for argument.
