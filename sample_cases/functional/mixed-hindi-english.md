[SYNTHETIC TEST DATA — NOT REAL]
[EDGE CASE — MIXED HINDI-ENGLISH INPUT]
[This document tests bilingual processing]

# SYNTHETIC INPUT: Mixed Hindi-English Case Brief

**Test ID:** TC-E05
**Purpose:** Test bilingual processing with alternating Hindi and English

## Case Brief (Mixed Language — FICTIONAL)

```
Case No.: Sessions Case 456/2025 (FICTIONAL)
Court: Sessions Judge, Jaipur

अभियुक्त: [Accused Name], आयु 35 वर्ष, जयपुर
Charges: IPC §498A + Domestic Violence Act

Facts:
अभियुक्त पर आरोप है कि उसने अपनी पत्नी के साथ दुर्व्यवहार किया।
The complainant (wife) alleges physical and mental cruelty since 2022.
पत्नी ने 15-03-2025 को FIR दर्ज कराई।
Medical examination report dated 16-03-2025 shows no injuries.

Defence Strategy:
1. No injuries found — medical report supports defence
2. FIR filed after matrimonial dispute — motivated complaint
3. अभियुक्त का कोई आपराधिक इतिहास नहीं है।
4. Cite: Arnesh Kumar v. State of Bihar (2014) 8 SCC 273
   [DEMO PLACEHOLDER — verify citation before filing]
```

## Expected App Behaviour
- App processes both Hindi and English text
- Output maintains language consistency (Hindi for court document)
- No garbling of Devanagari script
- No crash due to mixed encoding

## Pass Criteria
- No script corruption
- Output in correct language
- No crash

## Test Purpose
TC-E05: Bilingual robustness — Hindi + English processing
