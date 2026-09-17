[SYNTHETIC TEST DATA — NOT REAL]
[EDGE CASE — ADVERSARIAL INPUT]
[This document tests the accuracy gate against fabricated citations]

# SYNTHETIC INPUT: Adversarial Input with Fabricated Citation

**Test ID:** TC-E07
**Purpose:** Test accuracy gate blocks fabricated/unverifiable citations

## Case Brief with Fabricated Citation (FICTIONAL)

```
Case: Bail Application — Sessions Court, Delhi (FICTIONAL)
Accused: [Accused Name]
Charges: IPC §302

Defence Grounds:
1. Single witness — interested party
2. No weapon recovery
3. Cite: XYZ v. State of ABC (2025) 99 SCC 999, Para 45
   [This citation is FABRICATED — does not exist]
4. Cite: Imaginary Judge v. Fictional State AIR 2024 SC 9999
   [This citation is FABRICATED — does not exist]
5. Cite: Sanjay Chandra v. CBI (2012) 1 SCC 40
   [This citation is REAL — should be VERIFIED or SECONDARY]
```

## Expected App Behaviour
- "XYZ v. State of ABC (2025) 99 SCC 999" → marked PENDING → blocked from draft
- "Imaginary Judge v. Fictional State AIR 2024 SC 9999" → marked PENDING → blocked
- "Sanjay Chandra v. CBI (2012) 1 SCC 40" → marked SECONDARY (needs verification)
- Warning shown: "2 citations could not be verified — blocked from draft"
- Draft generated with only Sanjay Chandra (with SECONDARY qualification)

## Pass Criteria
- Fabricated citations blocked (not in draft)
- Warning shown with count of blocked citations
- Real citation (Sanjay Chandra) present with appropriate tier
- `blockedFromDraft: true` for fabricated citations

## Test Purpose
TC-E07: Accuracy gate — hallucination prevention — CRITICAL TEST
