---
test_id: TC-23
title: "Infrastructure Arbitration — Road (NH Highway Extension)"
category: infrastructure_arbitration
sub_category: road
priority: P1
status: active
synthetic: true
label: "SYNTHETIC / DEMO"
contract_value: "₹112.65 Crore"
case_folder: INFRA_ARB_02_ROAD_HIGHWAY_2026
---

# TC-23 — Infrastructure Arbitration: 45 km NH-758 Highway Extension, Rajasthan

> **ALL DATA IS SYNTHETIC / DEMO. No real persons, contracts, or proceedings.**

## Purpose
Test highway-specific arbitration lifecycle with NHAI/FIDIC contract framework. Highest-value infra arbitration case in the demo suite. Tests EOT claims, RoW delay, price escalation (Wholesale Price Index), and FIDIC Sub-Clause 20.2 notice compliance.

## Case Facts (Synthetic)

| Field | Value |
|-------|-------|
| Project | Construction of 45 km 2-Lane NH-758 Extension, Rajasthan |
| Contractor | M/s. Rajputana Infra Projects Pvt. Ltd. (SYNTHETIC) |
| Employer | National Highways Authority of India — PIU Udaipur (SYNTHETIC) |
| Contract Value | ₹112.65 Crore |
| Time Allowed | 24 months |
| LOA Date | 10.06.2024 |
| Site Possession | 12.09.2024 (78 days late — forest clearance + farmer protest) |
| Scheduled Completion | 09.06.2026 |
| Progress at Termination | 38% |
| EOT Granted | 1 × 120 days |
| Termination Notice | 20.02.2026 |
| Arbitration Invoked | 05.03.2026 |

## Claim Matrix (Fact-Fit Gate)

| Claim | Amount (₹) | Fact-Fit Score | Status | Key Evidence |
|-------|-----------|----------------|--------|--------------|
| Delay in Site Possession (78 days) | 14.85 Cr | 96 | VERIFIED | LOA + Possession Certificate |
| Price Escalation (10CC / WPI) | 9.75 Cr | 93 | VERIFIED | Wholesale Price Index |
| Extra Items & Variation Orders | 11.40 Cr | 89 | VERIFIED | EE Instructions |
| Idle Machinery & Labour | 6.25 Cr | 82 | VERIFIED | Log books + photos |
| Loss of Profit & Overhead (Hudson) | 8.90 Cr | 68 | SECONDARY | Formula-based |
| Geological Conditions | 4.15 Cr | 51 | PENDING | Needs expert report |
| **Total** | **₹55.30 Cr** | — | — | — |

## Applicable Standards

- IRC:SP:84-2019 (Manual for 2-Lane Highways)
- MoRTH Specifications for Road & Bridge Works (5th Revision)
- IS 2386 (Tests on Aggregates)
- FIDIC Red Book Sub-Clause 2.1 (Right of Access), 8.4 (EOT), 13.1 (Variations), 20.1–20.2 (Claims)
- NHAI GCC 2022
- Arbitration & Conciliation Act 1996 §11, §34, §36

## Expected Behaviour

1. System builds full 24-month project timeline with delay markers.
2. Claim Matrix renders all 6 claims; Geological Conditions (PENDING) blocked from primary draft.
3. Contradiction Radar: NHAI's termination notice cites "slow progress" despite internal emails acknowledging force majeure delay.
4. FIDIC 20.2 notice compliance check: detects email-only notices (no written acknowledgement) — flags as risk.
5. Case Strength Snapshot: Defence Viability ≥ 78%, Evidence Grounding ≥ 85%.
6. Generates Section 11 Application (Hindi + English) and full Claim Statement.
7. Award preview: ₹41.65 Cr + 8.5% interest; counter-claim LD allowed ₹2.15 Cr only.
8. DEMO watermark on all outputs.

## Pass Criteria

| Criterion | Expected |
|-----------|----------|
| All 6 claims rendered with Fact-Fit scores | YES |
| PENDING geological claim blocked from draft | YES |
| FIDIC 20.2 notice compliance risk flagged | YES |
| Hudson Formula claim shown as SECONDARY | YES |
| Section 11 + Claim Statement generated | Hindi + English |
| DEMO badge persistent | YES |

## Fail Conditions

- Geological claim (PENDING) cited as primary authority.
- Claim amounts differ from input data.
- FIDIC clause numbers missing from Standards Matrix.
- No contradiction detected between termination notice and internal emails.

## Key Precedents

- *Union of India v. Pramod Kumar* (SC) — delay compensation
- *NHAI v. ITD Cementation* (Delhi HC) — employer-caused delays

## Notes

- Highest contract value in infra suite (₹112.65 Cr) — use for maximum demo impact.
- Hudson Formula is always SECONDARY without documentary proof of opportunity loss.
- FIDIC 20.2: notice within 28 days is mandatory — email-only = procedural risk.
