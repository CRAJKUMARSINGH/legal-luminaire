[SYNTHETIC TEST DATA — NOT REAL]
[EDGE CASE — CONTRADICTORY DATES]
[This document intentionally contains date contradictions for robustness testing]

# SYNTHETIC INPUT: Contradictory Dates in Charge Sheet

**Test ID:** TC-E02
**Purpose:** Test app's date contradiction detection

## Charge Sheet with Contradictory Dates (FICTIONAL)

```
Case No.: Sessions Case 123/2025 (FICTIONAL)
Court: Sessions Judge, Jaipur

FIR Date: 20-03-2025
Arrest Date: 15-03-2025  ← CONTRADICTION: Arrest before FIR
Charge Sheet Date: 01-04-2025
Remand Date: 14-03-2025  ← CONTRADICTION: Remand before arrest

Accused: [Accused Name]
Charges: IPC §420

Facts:
Accused arrested on 15-03-2025 pursuant to FIR dated 20-03-2025.
[Note: FIR date is AFTER arrest date — logical impossibility]
```

## Expected App Behaviour
- App should flag: "Date conflict detected — FIR date (20-03-2025) is after arrest date (15-03-2025)"
- App should NOT silently use wrong dates in draft
- App should ask user to confirm correct dates before proceeding
- Draft should NOT be generated without user acknowledgement of conflict

## Pass Criteria
- Conflict flagged with specific dates mentioned
- Warning shown before draft generation
- Draft not generated without user confirmation

## Test Purpose
TC-E02: Date validation — data integrity check
