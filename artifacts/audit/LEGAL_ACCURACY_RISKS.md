# LEGAL ACCURACY RISKS
**Audit Date:** 2026-11-15  
**HEAD SHA:** `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`  
**Source files inspected:**
- `src/lib/case01-data.ts`
- `src/lib/verification-engine.ts`
- `src/lib/citation-gate.ts`
- `backend/api/routes_verify.py`
- `backend/services/limitation_engine.py`
- `backend/services/limitation_rules.json`
- `backend/api/redaction_utils.py`

Findings are classified CRITICAL / HIGH / MEDIUM / LOW.

---

## CRITICAL

### LAR-C01 — Four Precedents Are PENDING with No Verified Holdings — Blocked from Draft but Present in UI
**File:** `src/lib/case01-data.ts` — p6, p7, p8, p9  
**Evidence:**
```typescript
// p6: State of Gujarat v. Mohanbhai — (2003) 4 GLR 3121
holding: `[PENDING — obtain authentic judgment copy before reliance]`,
status: "PENDING",
blockedFromDraft: true  // correctly blocked

// p7: R.B. Constructions — 2014 SCC OnLine Bom 125
holding: `[PENDING — citation authenticity check required]`,
status: "PENDING",
blockedFromDraft: true  // correctly blocked

// p8: C.B.I. v. K.S. Kalra — 2011 SCC OnLine Del 3412
// p9: M/s. Builders Association — 2018 SCC OnLine All 442
```
These four citations appear in the research UI with fabricated-looking holdings. `blockedFromDraft: true` prevents them from reaching a court document, which is correct. However, their listed holdings (`"[PENDING...]"`) are placeholder text, not real legal quotes. If the block were accidentally removed or bypassed, false holdings would be cited in court.  
**Impact:** If `blockedFromDraft` defaults were ever changed to `false` (e.g., a developer mistakenly promotes them), fabricated quotes reach pleadings.  
**Recommendation:** Add an automated test that verifies every PENDING entry has `blockedFromDraft: true`. Add a CI lint rule that catches any PENDING with `blockedFromDraft: false`.

### LAR-C02 — Backend Citation Verification Only Checks Against `law_db.json` — Not Against Real Sources
**File:** `backend/api/routes_verify.py`  
**Evidence:**
```python
db = _load_law_db()
precedents = db.get("precedents", [])
# matches citation/case name against in-memory JSON
```
**File:** `backend/rag/law_db.json` — this is a small static JSON file, not a live legal database.  
**Impact:** A citation can be `verified: true` in the API response if it matches the internal JSON, even if the actual SCC or Indian Kanoon record does not exist or the holding is incorrect. This creates false confidence in citation verification.  
**Recommendation:** The `/verify-citations` endpoint should clearly label results as "verified against internal database only — not a live legal source check." Live verification requires Tavily/Indian Kanoon API calls; those are gated behind `TAVILY_API_KEY`.

---

## HIGH

### LAR-H01 — Seven SECONDARY Citations Have `holdingAccurate: false` — Unverified Quotes in Drafts
**File:** `src/lib/verification-engine.ts`  
**Evidence:**
```typescript
// p_sushil_sharma
holdingAccurate: false, // cannot confirm until SCC copy obtained
verifiedHolding: null,
```
SECONDARY citations are allowed in drafts with a qualification note (`blockedFromDraft: false`). However, `holdingAccurate: false` means the quote in the draft may not match the actual judgment text.  
**Impact:** An advocate filing a written submission with a SECONDARY citation may cite incorrect verbatim text as a quotation from the judgment — this is a misrepresentation to the court.  
**Recommendation:** Require advocates to review and explicitly accept SECONDARY citations before export; display `holdingAccurate: false` prominently in the Citation Gate UI; consider requiring a manual "I confirm the quote is correct" checkbox before a SECONDARY citation can be exported.

### LAR-H02 — Limitation Engine Uses a 1.4x Calendar-Day Approximation for Working-Day Rules — No Court Holiday Calendar
**File:** `backend/services/limitation_engine.py`  
**Evidence:**
```python
WORKING_DAY_FACTOR = 1.4  # 5-day week / 7-day week ≈ 0.71 → inverse ≈ 1.40
```
Rules with `period_basis="working"` multiply by 1.4. The engine correctly labels this in `basis_en` and `basis_hi`, and marks all output as `is_synthetic=True`. However, the disclaimer is in a data field — it may not be prominently surfaced to the advocate reading the deadline on screen.  
**Impact:** An advocate relying on a computed working-day deadline may miss a real court deadline if the actual calendar includes Rajasthan court holidays, vacations, or Supreme Court gazette holidays.  
**Recommendation:** Add a prominent UI-level warning (not just in `basis_en`) whenever a working-day rule deadline is displayed: "⚠️ This deadline uses an approximation. Verify against the official court holiday calendar before relying."

### LAR-H03 — IS Standard Clause Numbers Are SECONDARY — Exact Clause Text Not in System
**File:** `src/lib/verification-engine.ts` — `STANDARDS_ACCURACY`  
**Evidence:**
```typescript
// IS 2250:1981
exactClauseText: null,
tier: "SECONDARY",
// IS 3535:1986
exactClauseText: null,
// ASTM C1324
exactClauseText: null,
// CPWD Manual 2023
exactClauseText: null,
```
Only IS 1199:2018 and IS 3535:1986 (confidence: "VERIFIED") have confirmed scope text. The specific clause numbers cited in pleadings (IS 3535:1986 Cl. 4.1, Cl. 5.7.5; CPWD Manual §§3.7.4 & 12.2.1) have not been confirmed from official sources.  
**Impact:** Citing a clause number that does not exist or states something different is a material error in a technical defence submission.  
**Recommendation:** Obtain official BIS copies of IS 2250:1981, IS 3535:1986, and CPWD Manual 2023 before filing. Clause text must be attached as Annexures to discharge applications.

### LAR-H04 — Rajasthan HC Suo Motu PIL Holding Is Paraphrased, Not Verbatim
**File:** `src/lib/case01-data.ts` — p13 `Rajasthan HC Suo Motu PIL`  
**Evidence:**
```typescript
citation: "Suo Motu PIL ___/2025 | Orders: 29 July 2025 + 23 August 2025",
// Citation number is BLANK (___/2025)
status: "VERIFIED",
```
The PIL number is unknown. The holding attributed to the court is a summary, not a verbatim quote from a certified order. The source URL points to `livelaw.in/high-court/rajasthan-high-court` (a homepage, not the specific order).  
**Impact:** Citing a case with no docket number and a paraphrased holding is impermissible in Indian courts.  
**Recommendation:** Downgrade to SECONDARY. Obtain the certified copies of 29 July 2025 and 23 August 2025 orders and extract the PIL number before filing.

---

## MEDIUM

### LAR-M01 — Fact-Fit Scores Are Assigned by Human Judgment, Not Computed
**File:** `src/lib/case01-data.ts` — `fitScore` field  
**Evidence:** Scores such as `fitScore: 92`, `fitScore: 90`, `fitScore: 65` are hardcoded values, not computed by any algorithm from the case facts.  
**Impact:** The scoring gives a false impression of algorithmic accuracy. Two different data-entry operators might assign different scores to the same precedent.  
**Recommendation:** Document that scores are manually assigned by the advocate team. Add a metadata field `scoredBy: "manual" | "engine"` to distinguish manual from computed scores.

### LAR-M02 — `Surendra Koli v. State of UP (2025)` Holding Sourced from News Media, Not Certified Copy
**File:** `src/lib/case01-data.ts` — p14  
**Evidence:**
```typescript
status: "VERIFIED",
sourceUrl: "https://indianexpress.com/article/legal-news/...",
statusNote: "Verified from Indian Express, NDTV, Tribune India..."
```
"VERIFIED" tier is used but the source is news reports, not the official SC order. The holding text ("There was no credible chain of custody...") is from media reporting, not the judgment itself.  
**Impact:** News reports paraphrase rulings; the actual holding may differ. Citing an Indian Express summary as a court holding is not acceptable in pleadings.  
**Recommendation:** Downgrade to SECONDARY. Obtain the certified copy of the curative petition order.

### LAR-M03 — RSMML Force Majeure Case (p16) Sourced from PinkCityPost.com Only
**File:** `src/lib/case01-data.ts` — p16  
**Evidence:**
```typescript
status: "VERIFIED",
sourceUrl: "https://www.pinkcitypost.com/...",
```
A newspaper website does not constitute primary verification of a court order.  
**Recommendation:** Same as LAR-M02 — obtain certified HC order.

### LAR-M04 — `C.J. Christopher Signi` (p19) Holding Sourced from SCC Times Blog, Not Full Judgment
**File:** `src/lib/case01-data.ts` — p19  
**Evidence:**
```typescript
status: "SECONDARY",
statusNote: "Based on SCC Times blog summary, not the full judgment text."
```
The entry correctly labels this SECONDARY. However, the displayed holding is a quote that appears to be derived from the blog summary, which may not accurately reflect the judgment text.  
**Impact:** Moderate — blocked from primary citation by SECONDARY tier.  
**Recommendation:** Acceptable as research lead; must not be cited without the full SCC Online text.

### LAR-M05 — Bilingual Holdings Are Not Independently Verified Translations
**File:** `src/lib/verification-engine.ts` — `p_ramesh_singh`  
**Evidence:**
```typescript
// English holding:
verifiedHolding: "The Judge while considering the question of framing charges should satisfy himself..."
// Hindi draft holding:
draftHolding: "उन्मोचन चरण में न्यायालय मात्र यह देखता है कि प्रथम दृष्टया आरोप सिद्ध हो सकता है अथवा नहीं।"
```
The Hindi text is a free translation, not a translation from an official Hindi-medium judgment. Using a translated holding as if it were the court's own Hindi text could mislead.  
**Impact:** Low for English submissions; medium risk if the Hindi translation is submitted to a court as a direct quote.  
**Recommendation:** Label translated holdings as `[अनुवाद — मूल अंग्रेज़ी पाठ के आधार पर]` ("Translation based on English original").

---

## LOW

### LAR-L01 — `overallAccuracyScore()` Combines COURT_SAFE (100) + VERIFIED (70) + SECONDARY (40) Into a Single Percentage
**File:** `src/lib/verification-engine.ts`  
**Evidence:**
```typescript
const score = Math.round(((courtSafe * 100 + verified * 70 + secondary * 40) / (total * 100)) * 100);
```
This score is displayed in the UI. The Master Engineering Directive explicitly states "Never combine these into an unsupported single accuracy percentage."  
**Recommendation:** Remove the combined score from the UI. Display separate counts for each tier instead.

### LAR-L02 — IS 3535:1986 Archive.org Source May Not Match Official BIS Text
**File:** `src/lib/case01-data.ts` / `verification-engine.ts`  
**Evidence:** `sourceUrl: "https://archive.org/stream/gov.in.is.3535.1986/is.3535.1986_djvu.txt"`  
**Impact:** Archive.org hosts scanned government documents. OCR errors or page misalignment could produce incorrect clause numbers.  
**Recommendation:** Obtain official BIS print copy or authenticated digital copy before citing specific clause numbers.

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 2 |
| HIGH | 4 |
| MEDIUM | 5 |
| LOW | 2 |
