---
test_id: TC-25
title: "Infrastructure Arbitration — Electrical (220 kV GIS Substation)"
category: infrastructure_arbitration
sub_category: electrical_power
priority: P1
status: active
synthetic: true
label: "SYNTHETIC / DEMO"
contract_value: "₹68.25 Crore"
case_folder: INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026
---

# TC-25 — Infrastructure Arbitration: 220 kV GIS Substation + Transmission Line, Bhiwadi

> **ALL DATA IS SYNTHETIC / DEMO. No real persons, contracts, or proceedings.**

## Purpose
Test employer-supplied-material delay and Right of Way lifecycle. Demonstrates the interaction between RVPNL GCC, FIDIC Special Conditions, and IEEMA Price Variation Formula. Tests employer-liability claims where equipment supply was the employer's contractual obligation.

## Case Facts (Synthetic)

| Field | Value |
|-------|-------|
| Project | 220 kV GIS Substation + 45 km Transmission Line, Bhiwadi, Rajasthan |
| Contractor | M/s. Rajputana Powertech Pvt. Ltd. (SYNTHETIC) |
| Employer | Rajasthan Rajya Vidyut Prasaran Nigam Ltd. — RVPNL (SYNTHETIC) |
| Contract Value | ₹68.25 Crore |
| Time Allowed | 21 months |
| Work Order Date | 08.05.2024 |
| Site Handover | 25.05.2024 |
| GIS Equipment Delay | 5 months (Employer's supply obligation — Special Conditions Clause 12) |
| RoW Clearance Delay | 7 months (8.2 km forest stretch) |
| Progress at Termination | 52% |
| Termination Notice | 05.03.2026 |
| Arbitration Invoked | 20.03.2026 |

## Claim Matrix (Fact-Fit Gate)

| Claim | Amount (₹) | Fact-Fit Score | Status | Key Evidence |
|-------|-----------|----------------|--------|--------------|
| GIS Equipment Supply Delay | 9.85 Cr | 95 | VERIFIED | Purchase Order + Delivery delay certs |
| Right of Way & Forest Clearance | 7.40 Cr | 93 | VERIFIED | Revenue records + Forest Dept letters |
| Idle Machinery & Labour | 5.25 Cr | 87 | VERIFIED | Log books + photos |
| Price Escalation (IEEMA) | 4.15 Cr | 90 | VERIFIED | IEEMA price indices |
| Loss of Profit | 3.80 Cr | 62 | SECONDARY | Formula-based |
| **Total** | **₹30.45 Cr** | — | — | — |

## Applicable Standards

- IEC 61869 (Instrument Transformers)
- IS 2026 (Power Transformers)
- IEEMA Price Variation Formula
- CEA Guidelines for Transmission Lines
- FIDIC Red Book Sub-Clause 2.1, 8.4, 13.1, 20.1
- RVPNL GCC + Special Conditions Clause 12
- Arbitration & Conciliation Act 1996 §11, §34, §36

## Expected Behaviour

1. System identifies GIS equipment delay as employer-liability claim (highest priority).
2. Special Conditions Clause 12 parsed — employer supply obligation confirmed.
3. Contradiction Radar: RVPNL termination notice blames contractor progress, but internal PO documents show 5-month delay in employer's own equipment supply.
4. IEEMA formula applied to price escalation claim.
5. Case Strength Snapshot: Defence Viability ≥ 82%, Evidence Grounding ≥ 87%.
6. Award preview: ₹23.65 Cr + 9% interest; counter-claim LD allowed ₹1.85 Cr only.

## Pass Criteria

| Criterion | Expected |
|-----------|----------|
| Employer-supply obligation identified from Special Conditions | YES |
| GIS delay claim marked VERIFIED (95 score) | YES |
| IEEMA formula applied to price escalation | YES |
| Contradiction: employer blame vs own supply delay | YES |
| Loss of Profit SECONDARY | YES |

## Fail Conditions

- GIS delay claim treated as contractor fault.
- IEEMA formula not applied.
- Special Conditions Clause 12 not referenced.
- No contradiction between termination notice and PO documents.

## Notes

- Key legal point: when employer undertakes material supply, delay becomes employer's liability — not force majeure.
- NTPC v. Siemens (SC, 2022) is the leading precedent for employer-supplied material delay claims.
- RoW delay: Forest Department clearance is always employer's obligation — standard FIDIC 2.1 argument.
