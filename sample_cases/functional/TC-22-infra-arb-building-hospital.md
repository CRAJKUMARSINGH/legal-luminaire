---
test_id: TC-22
title: "Infrastructure Arbitration — Building (Hospital Construction)"
category: infrastructure_arbitration
sub_category: building
priority: P1
status: active
synthetic: true
label: "SYNTHETIC / DEMO"
contract_value: "₹48.75 Crore"
case_folder: INFRA_ARB_01_BUILDING_HOSPITAL_2026
---

# TC-22 — Infrastructure Arbitration: 300-Bed Hospital Construction, Udaipur

> **ALL DATA IS SYNTHETIC / DEMO. No real persons, contracts, or proceedings.**

## Purpose
Test full-lifecycle infrastructure arbitration workflow: Work Order → Disputes → Legal Notice → Standing Committee → No Satisfaction → Section 11 Application → Claim Statement (Hindi + English) → Counter-Claim → Witness Affidavits → Cross-Examination → Arbitral Award → Execution/Stay.

## Case Facts (Synthetic)

| Field | Value |
|-------|-------|
| Project | Construction of 300-Bed District Hospital, Udaipur, Rajasthan |
| Contractor | M/s. Rajputana Builders Pvt. Ltd. (SYNTHETIC) |
| Employer | Rajasthan Medical Services Corporation Ltd. – RMSCL (SYNTHETIC) |
| Contract Value | ₹48.75 Crore |
| Time Allowed | 18 months |
| Work Order Date | 05.05.2024 |
| Site Handover | 20.05.2024 (45 days late) |
| Scheduled Completion | 04.11.2025 |
| Progress at Termination | 41% |
| Termination Notice | 15.01.2026 |
| Arbitration Invoked | 10.02.2026 |

## Claim Matrix (Fact-Fit Gate)

| Claim | Amount (₹) | Fact-Fit Score | Status | Key Evidence |
|-------|-----------|----------------|--------|--------------|
| Delay — late site handover | 4.82 Cr | 94 | VERIFIED | Work Order + Possession Letter |
| Variation & Extra Items | 6.15 Cr | 88 | VERIFIED | Engineer instructions |
| Price Escalation (10CC) | 3.94 Cr | 91 | VERIFIED | CPWD indices |
| Idle Labour & Machinery | 2.18 Cr | 76 | SECONDARY | Logs + photos |
| Loss of Profit | 2.75 Cr | 45 | PENDING | Insufficient proof |
| **Total** | **₹19.84 Cr** | — | — | — |

## Applicable Standards

- IS 456:2000 (Plain & Reinforced Concrete)
- IS 1200 (Method of Measurement)
- CPWD Specifications 2021 Vol-I & II
- FIDIC Red Book Clause 8.4 (EOT), 20.1 (Claims)
- Arbitration & Conciliation Act 1996 §11, §34, §36

## Input Files Used

- `WORK_ORDER_2024.lex`
- `LEGAL_NOTICE_DEMAND_01.lex`
- `STANDING_COMMITTEE_MINUTES_01.md`
- `NO_SATISFACTION_LETTER_01.lex`
- `ARB_APPOINTMENT_APPLICATION_SEC11.lex`
- `CLAIM_STATEMENT_FULL.lex`
- `CLAIM_STATEMENT_HINDI.lex`
- `COUNTER_CLAIM_REPLY.lex`
- `WITNESS_AFFIDAVIT_01.lex`
- `CROSS_EXAMINATION_TRANSCRIPT_EXCERPT.lex`
- `FINAL_ARBITRAL_AWARD.lex`
- `EXECUTION_STAY_APPLICATION.lex`

## Expected Behaviour

1. System loads all lifecycle documents and builds full case timeline.
2. Claim Matrix renders with Fact-Fit scores and colour-coded status badges.
3. PENDING claim (Loss of Profit) is flagged — blocked from primary draft.
4. Contradiction Radar surfaces: employer denied delay in termination letter despite internal records confirming it.
5. Case Strength Snapshot shows: Defence Viability ≥ 75%, Evidence Grounding ≥ 80%.
6. One-click generates Section 11 Application (Hindi + English).
7. Verification Report shows tier for every cited precedent and standard.
8. Pre-Filing Checklist generated with VERIFIED/SECONDARY/PENDING breakdown.
9. DEMO watermark visible on all generated output.
10. Award preview shows ₹14.28 Cr (70% of verified claims) + 9% interest.

## Pass Criteria

| Criterion | Expected |
|-----------|----------|
| Claim Matrix rendered | All 5 claims with scores |
| PENDING claim blocked from primary draft | YES |
| Contradiction detected (employer's internal delay admission) | YES |
| Section 11 draft generated | Hindi + English |
| Fact-Fit Gate applied to cited precedents | Score shown per case law |
| DEMO label visible | YES — persistent badge |
| Pre-Filing Checklist generated | YES |

## Fail Conditions

- Loss of Profit (PENDING) appears as primary authority in any draft.
- Claim amounts fabricated (differ from input data).
- Missing CPWD / FIDIC standard references in Standards Matrix.
- Section 11 application missing prayer clause or court heading.

## Key Precedents (Verified)

- *M/s. K.N. Sathyapalan v. State of Kerala* (SC) — delay in site possession
- *Union of India v. Prafulla Kumar Samal* (1979) 3 SCC 4 — prima facie / discharge standard (analogous)

## Notes

- This is the **flagship infrastructure arbitration demo case**.
- Demonstrate alongside TC-01 (criminal defence) to showcase domain breadth.
- Loss of Profit claim uses Hudson Formula — always SECONDARY or PENDING without documentary proof.
