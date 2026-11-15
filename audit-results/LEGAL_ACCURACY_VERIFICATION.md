# LEGAL ACCURACY VERIFICATION
**Post-Implementation Audit — Independent Citation Verification**  
**Date:** 2026-11-15 | HEAD `10cc700`

---

## 1. PENDING Citations — Blocked From Draft (VERIFIED)

| ID | Case | `blockedFromDraft` | Evidence |
|----|------|---------------------|---------|
| p6 | State of Gujarat v. Mohanbhai (2003) 4 GLR 3121 | ✅ `true` (line 275) | `case01-data.ts` — explicit field |
| p7 | R.B. Constructions 2014 SCC OnLine Bom 125 | ✅ `true` (line 292) | `case01-data.ts` — explicit field |
| p8 | C.B.I. v. K.S. Kalra 2011 SCC OnLine Del 3412 | ✅ `true` (line 309) | `case01-data.ts` — explicit field |
| p9 | Builders Association 2018 SCC OnLine All 442 | ✅ `true` (line 326) | `case01-data.ts` — explicit field |

**Regression guard:** P0 test suite asserts all 4 have `blockedFromDraft === true`. ✅ PASSING.

---

## 2. Downgraded Precedents (VERIFIED)

| ID | Case | Previous Tier | Current Tier | Source | Downgrade Justification |
|----|------|---------------|-------------|--------|------------------------|
| p13 | Rajasthan HC Suo Motu PIL | VERIFIED | **SECONDARY** | LiveLaw HC homepage | Blank docket `___/2025`; paraphrased holding |
| p14 | Surendra Koli v. State of UP | VERIFIED | **SECONDARY** | Indian Express / NDTV | News media only; no certified order |
| p16 | RSMML v. Contractor | VERIFIED | **SECONDARY** | PinkCityPost newspaper | Newspaper only; no certified order |

**Registry mirror:** All 3 also added to `PRECEDENT_ACCURACY` in `verification-engine.ts` as SECONDARY entries (`p_rajasthan_hc_pil`, `p_surendra_koli`, `p_rsmml`). ✅ VERIFIED.

**Regression guard:** P0 test suite asserts p13/p14/p16 `status !== "VERIFIED"` and registry entries are SECONDARY. ✅ PASSING.

---

## 3. Combined Accuracy Percentage (VERIFIED REMOVED)

| Element | Status | Evidence |
|---------|--------|---------|
| `overallAccuracyScore()` score field | Returns `-1` sentinel | `verification-engine.ts:631` |
| `accuracyNote` field | Present, explains removal | `verification-engine.ts:632` |
| `generateAccuracyReport()` | No longer prints `score/100` | Replaced with tier counts |
| Frontend tests | 2 tests verify sentinel + note | `verification-engine.test.ts:528-540` |

---

## 4. SECONDARY Citations with Inaccurate Holdings

| ID | Case | `holdingAccurate` | Status |
|----|------|-------------------|--------|
| p2 | Uttarakhand HC Chain of Custody | Not set (false) | SECONDARY — LiveLaw only |
| p3 | Sushil Sharma (2014) 4 SCC 317 | `false` | SECONDARY — para unconfirmed |
| p15 | Tomaso Bruno (2015) 7 SCC 178 | Not set | SECONDARY — para unconfirmed |
| p19 | C.J. Christopher Signi 2025 | Not set | SECONDARY — SCC Times blog |
| p_rajasthan_hc_pil (new) | `false` | SECONDARY — news report |
| p_surendra_koli (new) | `false` | SECONDARY — news report |
| p_rsmml (new) | `false` | SECONDARY — newspaper |

All 7 SECONDARY entries have `holdingAccurate: false` or `null` and are correctly restricted. ✅ VERIFIED.

---

## 5. IS/ASTM Standards — Clause Evidence Status

| Standard | `exactClauseText` | Tier | Court-Ready? |
|----------|-------------------|------|-------------|
| IS 1199:2018 | ✅ Present (scope clause) | VERIFIED | Yes — scope confirmed from archive.org |
| IS 2250:1981 | ❌ `null` | SECONDARY | No — needs BIS copy |
| IS 3535:1986 | ❌ `null` (partial via archive.org) | SECONDARY | No — needs official BIS |
| ASTM C1324 | ❌ `null` | SECONDARY | No — needs astm.org purchase |
| CPWD Manual 2023 | ❌ `null` | SECONDARY | No — needs cpwd.gov.in download |

**Status:** 4 of 5 standards remain restricted. IS 1199:2018 scope is confirmed. **REQUIRES LEGAL REVIEW** for the remaining 4 — procurement task, not engineering.

---

## 6. Court Docket Identifiers

| Precedent | Docket Number | Fabricated? |
|-----------|--------------|-------------|
| p13 Rajasthan HC PIL | `___/2025` (blank) | ✅ NOT fabricated — explicitly blank, not invented |
| All others | Real or search-URL format | ✅ None fabricated |

No docket numbers were fabricated. The blank `___/2025` is an explicit placeholder. ✅ VERIFIED.

---

## 7. Server-Side Citation Validation Bypass

**Status:** ❌ NOT FIXED — `_evaluate_citation_gate()` in `routes.py:136` is still keyword-only (scans for literal "PENDING"/"FATAL_ERROR" words in output text). No structural registry check exists on the backend.

**Risk:** An LLM that produces an unverified citation without using the word "PENDING" bypasses the server-side gate. The frontend Citation Gate (TypeScript) is more robust but can be bypassed via direct API calls.

**Mitigation:** The frontend gate blocks unrecognised citations as WARN. The backend gate blocks the word "PENDING". Both must be bypassed for a fabricated citation to reach export.

---

## 8. Summary

| Check | Status |
|-------|--------|
| 1. All 4 PENDING blocked from drafting | ✅ VERIFIED + TESTED |
| 2. p13 appropriate classification | ✅ SECONDARY (downgraded) |
| 3. p14/p16 not VERIFIED from media | ✅ SECONDARY (downgraded) |
| 4. 7 SECONDARY restricted | ✅ All `holdingAccurate: false` |
| 5. 5 IS/ASTM clause evidence | ⚠️ 1 confirmed, 4 restricted (need BIS) |
| 6. Combined accuracy % removed | ✅ Sentinel -1 + accuracyNote |
| 7. Fact-fit scores traceable | ⚠️ Manual scores (documented limitation) |
| 8. Deadline approximations warning | ❌ No UI-level warning added |
| 9. Court docket IDs not fabricated | ✅ Blank placeholders, not invented |
| 10. Server-side validation bypass | ❌ Still keyword-only |
