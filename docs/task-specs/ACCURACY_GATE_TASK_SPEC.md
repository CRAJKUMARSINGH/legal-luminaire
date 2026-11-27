# TASK SPECIFICATION — ACCURACY GATE ENHANCEMENTS
## Legal Luminaire | Version 1.0 | April 3, 2026

---

## TASK ID: FEAT-ACCURACY-001

## PURPOSE
Strengthen the existing accuracy gate to cover the canonical edge cases in
`docs/testing/TEST_CASE_MATRIX_26.md` — specifically date validation,
OCR noise warnings, and document deduplication.

## CURRENT STATE
- PENDING citation block: ✅ implemented (`verification-engine.ts`)
- Fact-Fit Gate scoring: ✅ implemented (`PrecedentFitGate.tsx`)
- IS standard wrong-flag: ✅ implemented (`case01-data.ts`)
- Date contradiction detection: ❌ NOT implemented
- OCR noise warning: ❌ NOT implemented
- Document deduplication: ❌ NOT implemented

## REQUIRED ENHANCEMENTS

### Enhancement 1 — Date Validator
**File:** `src/lib/date-validator.ts` (new)
**Logic:**
- Parse all dates from intake form (FIR date, arrest date, remand date, charge sheet date)
- Check: arrest date must be ≥ FIR date
- Check: remand date must be ≥ arrest date
- Check: charge sheet date must be ≥ arrest date
- If conflict: show warning, block draft until user confirms

### Enhancement 2 — OCR Noise Warning
**File:** `src/lib/input-quality.ts` (new)
**Logic:**
- Score input text for OCR noise indicators (digit/letter substitutions, broken words)
- If noise score > threshold: show warning "Input quality low — manual review recommended"
- Mark garbled fields as [UNREADABLE] in extraction
- Never fabricate content to fill [UNREADABLE] gaps

### Enhancement 3 — Document Deduplication
**File:** `src/lib/document-dedup.ts` (new)
**Logic:**
- Hash each uploaded document (SHA-256 of content)
- On upload: check hash against existing documents
- If duplicate: show warning "Duplicate document detected — [filename]"
- Deduplicate annexure index

## SUCCESS CRITERIA
| Test Case | Expected Result After Fix |
|-----------|--------------------------|
| TC-E02 Contradictory dates | Conflict flagged |
| TC-E01 OCR noisy text | Warning shown, no invented facts |
| TC-E04 Duplicate annexures | Duplicates detected, index clean |

## ACCURACY COMPLIANCE
All enhancements must follow `docs/accuracy-governance/ACCURACY_RULES.md`.
No enhancement may introduce fabricated content.
