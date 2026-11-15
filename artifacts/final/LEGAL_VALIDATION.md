# LEGAL VALIDATION
**Legal Luminaire — Citation and Legal Accuracy Assessment**  
**Audit Date:** 2026-11-15 | HEAD `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`

This document assesses the accuracy of legal citations, standards, and deadline rules in the codebase against the requirements of the Accuracy Rules steering document.

---

## Accuracy Rules Compliance Checklist

| Rule | Requirement | Status |
|------|-------------|--------|
| Rule 1 — Citation Accuracy | Full case name + citation + court + date + verified URL + para | PARTIALLY MET — 4/19 precedents lack para numbers |
| Rule 1 — Verbatim holdings | Holdings must be quoted verbatim from source | PARTIALLY MET — 7 SECONDARY entries have `holdingAccurate: false` |
| Rule 1 — PENDING → blockedFromDraft | PENDING citations must have `blockedFromDraft: true` | MET — all 4 PENDING entries have `blockedFromDraft: true` |
| Rule 2 — Fact-Fit Gate | 3-axis scoring, 0–100, with thresholds | PARTIALLY MET — scores are manually assigned, not computed |
| Rule 3 — IS/ASTM clause sources | Clause text from official sources | PARTIALLY MET — IS 3535:1986 has archive.org text; others are SECONDARY |
| Rule 3 — IS 1199:2018 applicability | Never applied to hardened masonry mortar | MET — coded as `applicability: "wrong"` |
| Rule 3 — IS 2250:1981 is correct | For masonry mortar | MET — coded as `applicability: "correct"` |
| Rule 3 — ASTM C1324 for hardened mortar | Correct standard | MET — coded as correct |
| Rule 4 — Database search order | Manupatra → SCC → Kanoon → LexisNexis → BAILII → BIS → ASTM → CPWD | PARTIALLY MET — search tools exist but order not enforced algorithmically |
| Rule 5 — Verification tiers | COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR | MET — tiers implemented in verification-engine.ts |
| Rule 6 — PENDING blocked from draft | PENDING must not appear in generated documents | MET — `blockedFromDraft: true` enforced; citation gate hard-blocks |
| Rule 7 — `blockedFromDraft: true` default | All new PENDING citations default to blocked | MET — documented in source code |
| Rule 8 — Testing requirements | ≥3 test cases, self-assessment ≥8/10 | PARTIALLY MET — 364 frontend tests pass; backend copilot test broken |
| Rule 9 — 21 diverse test cases | Test cases folder must have 21 case types | MET — 26 cases present (TC-01..TC-26 + imaginary cases) |

---

## Citation Accuracy Assessment by Precedent

### COURT_SAFE (3 precedents)

| ID | Case | Para Confirmed | Verbatim Holding | Assessment |
|----|------|---------------|-----------------|------------|
| p4 | Prafulla Kumar Samal (1979) 3 SCC 4 | Para 10 ✅ | Yes ✅ | COURT_SAFE — safe to file |
| p5 | Ramesh Singh (1977) 4 SCC 39 | Para 5 ✅ | Yes ✅ | COURT_SAFE — safe to file |
| p10 | Jacob Mathew (2005) 6 SCC 1 | Para 48 ✅ | Yes ✅ | COURT_SAFE — analogous only |

### VERIFIED (7 precedents)

| ID | Case | Para Confirmed | Verbatim Holding | Note |
|----|------|---------------|-----------------|------|
| p1 | Kattavellai 2025 INSC 845 | Not confirmed ⚠️ | Confirmed ✅ | Obtain certified copy + para |
| p11 | Damu (2000) 6 SCC 269 | Not confirmed ⚠️ | Confirmed ✅ | Obtain para |
| p12 | Baldev Singh (1999) 6 SCC 172 | Not confirmed ⚠️ | Confirmed ✅ | Obtain para |
| p13 | Rajasthan HC Suo Motu PIL ___/2025 | No docket number ❌ | Paraphrased ❌ | **Downgrade to SECONDARY** |
| p14 | Surendra Koli (2025) | No para ❌ | From news media ❌ | **Downgrade to SECONDARY** |
| p16 | RSMML v. Contractor (2026) | No para ❌ | From newspaper ❌ | **Downgrade to SECONDARY** |
| p18 | IS 3535:1986 Cl. 5.7.5 | Cl. 5.7.5 ✅ | Archive.org source ⚠️ | Obtain official BIS copy |

### SECONDARY (4 precedents — usable with qualification)

| ID | Case | Exact Quote Confirmed | Assessment |
|----|------|----------------------|-----------|
| p2 | Uttarakhand HC March 2026 | No — LiveLaw only | Use for oral argument only |
| p3 | Sushil Sharma (2014) 4 SCC 317 | No — `holdingAccurate: false` | Do not quote verbatim in pleading |
| p15 | Tomaso Bruno (2015) 7 SCC 178 | No — `holdingAccurate: false` (implicit SECONDARY) | Do not quote verbatim |
| p19 | C.J. Christopher Signi 2025 Madras HC | No — SCC Times blog | Research lead only |

### PENDING (4 precedents — BLOCKED from draft)

| ID | Case | Issue |
|----|------|-------|
| p6 | State of Gujarat v. Mohanbhai (2003) 4 GLR 3121 | Citation authenticity unconfirmed |
| p7 | R.B. Constructions 2014 SCC OnLine Bom 125 | Citation unconfirmed |
| p8 | C.B.I. v. K.S. Kalra 2011 SCC OnLine Del 3412 | Citation unconfirmed |
| p9 | Builders Association 2018 SCC OnLine All 442 | Citation unconfirmed |

All four have `blockedFromDraft: true` ✅

---

## IS/ASTM Standards Accuracy Assessment

| Standard | Applicability Coded | Official Text Present | Confidence | Recommendation |
|----------|--------------------|-----------------------|-----------|---------------|
| IS 1199:2018 | WRONG (prosecution error) ✅ | Scope confirmed (archive.org) | VERIFIED | Obtain BIS official copy of scope clause |
| IS 2250:1981 | CORRECT ✅ | Not obtained ❌ | SECONDARY | Purchase from BIS Portal |
| IS 3535:1986 | CORRECT ✅ | Partial (archive.org) | SECONDARY | Purchase official copy; verify Cl. 4.1, 5.7.5 |
| ASTM C1324 | CORRECT ✅ | Not obtained ❌ | SECONDARY | Purchase from astm.org |
| CPWD Manual 2023 | CORRECT ✅ | Not obtained ❌ | SECONDARY | Download from cpwd.gov.in |

---

## Limitation Rules Accuracy Assessment

| Rule ID | Statute | Period | Basis | Test | Assessment |
|---------|---------|--------|-------|------|-----------|
| CRPC-167-90D | CrPC §167(2) | 90d calendar | Standard Indian criminal law | V01 ✅ | COURT_SAFE (deterministic) |
| CRPC-167-60D | CrPC §167(2) | 60d calendar | Standard Indian criminal law | V02 ✅ | COURT_SAFE |
| CRPC-173-FINAL | CrPC §173 | 90d calendar | Standard | V03 ✅ | COURT_SAFE |
| FSL-REPORT-RECEIPT | Forensic practice | 60d calendar | NABL guideline | V04 ✅ | SECONDARY — no statutory anchor |
| BAIL-439-APPLICATION | CrPC §439 | 7d working (≈9d cal) | Court practice | V06 ✅ | SECONDARY — approximation |
| APPEAL-SC-SLP-90D | SC Rules 2013 | 90d calendar | SC Rules Order XIX | V05 ✅ (CANNOT_COMPUTE) | COURT_SAFE |
| LIMITATION-468-3Y | CrPC §468(2)(c) | 1095d calendar | Statute | V07 ✅ | COURT_SAFE |

**All deadline computations use `is_synthetic=True` and are marked `[SYNTHETIC/DEMO]` in output — no risk of live court misuse from these labels.**

---

## Overall Legal Accuracy Rating

| Dimension | Rating | Basis |
|-----------|--------|-------|
| Citation blocking (PENDING) | ✅ Compliant | All 4 PENDING blocked; tested |
| Verbatim holdings (COURT_SAFE) | ✅ Compliant | 3 COURT_SAFE entries have confirmed para + verbatim quote |
| Verbatim holdings (VERIFIED) | ⚠️ Partially compliant | 3 VERIFIED entries sourced from news media — should be SECONDARY |
| Standards applicability | ✅ Compliant | IS 1199:2018 correctly coded as WRONG; IS 2250:1981 as CORRECT |
| Deadline accuracy | ✅ Verified | 10 hand-computed tests all pass |
| Citation gate (frontend) | ✅ Verified | Hard-block on PENDING; 364 tests pass |
| Citation gate (backend) | ⚠️ Partial | Keyword-only; can be bypassed |
| Combined accuracy score | ❌ Non-compliant | Directive forbids combined %; present in `overallAccuracyScore()` |

**Conclusion:** The legal accuracy controls are substantively sound. Three specific precedents need tier correction before any court filing. The combined accuracy percentage must be removed from the UI.
