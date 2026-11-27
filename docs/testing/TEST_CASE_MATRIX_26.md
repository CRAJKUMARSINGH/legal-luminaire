# Legal Luminaire — Canonical Test Case Matrix

**Last Updated:** 2026-11-26

**Scope:** 26 primary cases plus 12 edge/stress scenarios.

This is the canonical test specification. Current execution status is recorded in [Release Readiness](../RELEASE_READINESS.md); this matrix is not a historical result snapshot.

## Category-wise Distribution

| Category | Count | Case IDs |
|----------|-------|----------|
| Criminal & Forensic | 8 | TC-01 to TC-08 |
| Civil & Family | 6 | TC-09 to TC-14 |
| Writ & Constitutional | 4 | TC-15 to TC-18 |
| Commercial & Consumer | 3 | TC-19 to TC-21 |
| **Infrastructure & Arbitration (New)** | **5** | **TC-22 to TC-26** |

## Infrastructure Arbitration Cases (Full Lifecycle)

| TC ID | Project | Contract Value | Total Claim | Verified Claims | Status | Demo Priority |
|-------|---------|----------------|-------------|------------------|--------|---------------|
| TC-22 | 300-Bed Hospital Building | ₹48.75 Cr | ₹19.84 Cr | 4/6 | Complete | High |
| TC-23 | 45 km National Highway | ₹112.65 Cr | ₹55.30 Cr | 4/6 | Complete + Expanded Claim | **Highest** |
| TC-24 | Medium Irrigation Dam | ₹87.40 Cr | ₹54.85 Cr | 4/5 | Complete | High |
| TC-25 | 220 kV GIS Substation | ₹68.25 Cr | ₹30.45 Cr | 4/5 | Complete + Expanded Claim | High |
| TC-26 | 185 Acres Township Landscape | ₹34.80 Cr | ₹20.75 Cr | 4/6 | Complete | Medium |

### Testing Checklist for Infrastructure Cases
- [x] Demo Mode loads full case without API key
- [x] Claim Matrix shows Fact-Fit Gate (Verified/Secondary/Pending)
- [x] Timeline + Contradiction Radar works
- [x] Hindi + English document generation
- [x] PDF output with watermark in Demo Mode
- [x] Standards Matrix (CPWD/FIDIC/IS codes) displays correctly

**Primary cases:** 26

**Edge/stress scenarios:** 12

**Total specifications:** 38

## Primary Case Index (TC-01 to TC-21)

| ID | Title | Category | Court | Charges/Law | Scenario Type | Priority |
|----|-------|----------|-------|-------------|---------------|----------|
| TC-01 | Building Collapse — Hemraj Vardar | Functional | Sessions, Udaipur | IPC 304A + PCA | Clean, real-data | P0 |
| TC-02 | NDPS Bail — Procedure Violation | Functional | HC Rajasthan | NDPS §8/21/29 | Clean simple | P0 |
| TC-03 | NI Act Discharge — Security Cheque | Functional | MM Court Delhi | NI Act §138 | Clean simple | P0 |
| TC-04 | Domestic Violence Bail | Functional | Sessions, Jaipur | IPC 498A + DV Act | Clean simple | P1 |
| TC-05 | Cyber Fraud Bail | Functional | Sessions, Mumbai | IT Act §66C/66D | Clean simple | P1 |
| TC-06 | Land Acquisition Writ | Functional | HC Rajasthan | Art. 226 — LA Act | Clean simple | P1 |
| TC-07 | Medical Negligence Discharge | Functional | Sessions, Delhi | IPC 304A | Clean simple | P1 |
| TC-08 | Road Accident Bail | Functional | Sessions, Jodhpur | IPC 304A/279 | Clean simple | P1 |
| TC-09 | Forest Offence Bail | Functional | Sessions, Udaipur | Forest Act §26 | Clean simple | P2 |
| TC-10 | Arms Act Discharge | Functional | Sessions, Jaipur | Arms Act §25/27 | Clean simple | P2 |
| TC-11 | PC Act Bribery Discharge | Functional | Special Court | PCA §7/13 | Clean simple | P2 |
| TC-12 | Murder Bail | Functional | HC Rajasthan | IPC 302 | Long narrative | P0 |
| TC-13 | POCSO Discharge | Functional | Sessions, Kota | POCSO §4 + IPC 376 | Sensitive/complex | P0 |
| TC-14 | GST Fraud Bail | Functional | Sessions, Delhi | CGST Act §132 | Financial/complex | P1 |
| TC-15 | Environment Violation Writ | Functional | NGT | EP Act + Water Act | Technical | P1 |
| TC-16 | Landlord-Tenant Written Submission | Functional | HC Rajasthan | TPA | Civil/complex | P2 |
| TC-17 | Service Matter Writ | Functional | HC Rajasthan | Art. 226 — Service | Administrative | P2 |
| TC-18 | Insurance Claim Written Submission | Functional | Consumer Forum | CPA | Consumer | P2 |
| TC-19 | Contract Dispute Written Submission | Functional | Commercial Court | Contract Act | Commercial | P2 |
| TC-20 | Family Maintenance Application | Functional | Family Court | CrPC §125 / BNSS §144 | Family | P2 |
| TC-21 | Election Petition Written Submission | Functional | HC Rajasthan | RPA §100 | Constitutional | P2 |

## Edge / Stress / Adversarial Scenarios

| ID | Title | Scenario Type | Required Behavior |
|----|-------|---------------|------------------|
| TC-E01 | OCR-Noisy FIR Text | Formatting noise | Warn on low-quality input, extract only supported facts, and never invent missing content. |
| TC-E02 | Contradictory Dates in Charge Sheet | Conflicting data | Flag impossible date order and require acknowledgement before drafting. |
| TC-E03 | Missing Party Names | Missing data | Preserve explicit placeholders and flag missing names in the checklist. |
| TC-E04 | Duplicate Annexures | Duplicate data | Detect duplicate documents and deduplicate the annexure index. |
| TC-E05 | Mixed Hindi-English Text | Language mixing | Preserve both scripts without corruption or language drift. |
| TC-E06 | Unsupported Document Style | Invalid input | Reject or clearly flag unsupported formats before processing. |
| TC-E07 | Adversarial Misleading Input | Misleading input | Mark invented citations PENDING and physically block them from draft output. |
| TC-E08 | Huge Multi-Document Bundle | Large input | Enforce documented size/page limits, show progress, and fail safely without timeout or memory exhaustion. |
| TC-E09 | Near-Empty Minimum Input | Minimal data | Explain missing data, preserve required markers, and generate only supported partial output. |
| TC-E10 | Conflicting Contract References | Inconsistent data | Detect conflicting clause references and surface the discrepancy. |
| TC-E11 | Survey Mismatch in Property Case | Data mismatch | Flag survey/property discrepancies instead of silently choosing one value. |
| TC-E12 | Conflicting Loss Figures (Insurance) | Conflicting data | Detect conflicting loss figures and require explicit resolution. |

## Detailed Primary Scenario Specifications

### TC-01 — Building Collapse (Hemraj Vardar)
- **Input:** `test-cases/CASE01_HEMRAJ_STATE_2025/input-documents/`
- **Expected:** Load `case01-data.ts`; score all 10 precedents; flag IS 1199:2018 as wrong and IS 2250:1981 as correct; recognize ASTM C1324 for hardened mortar forensics; generate the Hindi discharge application with all 10 grounds; show VERIFIED/SECONDARY tiers; produce the 12-item annexure checklist.
- **Pass:** All VERIFIED precedents appear, the wrong standard is warned, no PENDING citation appears, the checklist has at least 10 items, and the showcase score is at least 9/10.

### TC-02 — NDPS Bail
- **Input:** `test-cases/CASE02_RAMESH_STATE_2025/input-documents/`
- **Expected:** Generate the §439 CrPC / §483 BNSS bail application; highlight §52A non-compliance; cite Baldev Singh and Tofan Singh with DEMO PLACEHOLDER tags; show citation tiers, verification report, and pre-filing checklist.
- **Pass:** The §52A ground is present, at least two precedents are cited, and both reports are generated.

### TC-03 — NI Act Discharge
- **Input:** `test-cases/CASE03_APEX_SUNIL_2025/input-documents/`
- **Expected:** Generate the §245 CrPC / §250 BNSS discharge application; lead with the security-cheque defence; cite Rangappa and Krishna Janardhan Bhat; produce the cross-reference matrix.
- **Pass:** The security-cheque ground is present, at least two precedents are cited, and the cross-reference matrix is generated.

### TC-12 — Murder Bail (Long Narrative)
- **Input:** `test-cases/CASE_12_MurderBail/input-documents/`
- **Expected:** Generate the §439 CrPC bail application with single-witness, no-weapon, pending-FSL, and Article 21 grounds; cite Sanjay Chandra; preserve the complete facts section without truncation.
- **Pass:** All grounds are present, facts are not truncated, and the verification report is complete.

## Detailed Edge Scenario Specifications

### TC-E01 — OCR-Noisy FIR Text
- **Input:** Synthetic FIR with missing spaces, garbled words, and wrong characters.
- **Pass:** No crash; low-quality warning is shown; usable data is partially extracted; no facts are fabricated.

### TC-E02 — Contradictory Dates
- **Input:** Synthetic charge sheet with FIR date 2025-03-20 and arrest date 2025-03-15.
- **Pass:** The conflict is flagged and warned; the draft is not generated without user acknowledgement.

### TC-E03 — Missing Party Names
- **Input:** Case brief containing `[ACCUSED NAME]` and `[COMPLAINANT NAME]`.
- **Pass:** No crash; placeholders remain in output; the checklist flags missing data.

### TC-E04 — Duplicate Annexures
- **Input:** Bundle containing the FIR twice and charge sheet three times.
- **Pass:** Duplicates are detected and warned; the annexure index is deduplicated.

### TC-E05 — Mixed Hindi-English Text
- **Input:** Case brief alternating Hindi and English paragraphs.
- **Pass:** No Devanagari corruption; output language remains correct; no crash.

### TC-E07 — Adversarial Misleading Input
- **Input:** Case brief containing invented citation `XYZ v. ABC (2025) 99 SCC 999`.
- **Pass:** Citation is PENDING, warning is shown, `blockedFromDraft: true` is set, and the draft excludes it.

### TC-E08 — Huge Multi-Document Bundle
- **Input:** At least 20 synthetic documents totalling 200+ pages.
- **Pass:** No crash; progress is shown; documented size/page limits are enforced; analysis completes within the declared threshold.

### TC-E09 — Near-Empty Minimum Input
- **Input:** Only FIR number and accused name.
- **Pass:** No crash or invented facts; missing data is explicit; any partial output uses `[REQUIRED]` markers.

## Robustness Coverage Requirements

- TC-02 to TC-21 require dedicated deterministic fixtures or a documented provider-backed test path; do not claim offline coverage from UI presence alone.
- TC-E01, TC-E02, TC-E04, TC-E06, and TC-E08 require explicit validation, warning, deduplication, format, and size-limit behavior before provider use.
- TC-E10 to TC-E12 require discrepancy detection and explicit user resolution; conflicting values must not be silently selected.

## Pass / Fail Criteria

A scenario passes only when the application does not crash, fabricates no facts or citations, blocks PENDING citations from draft output, generates the required verification/checklist output, and matches the expected output type. It fails on an unhandled error, fabricated or unverified citation, unexplained empty output, or an unflagged wrong standard/value.
