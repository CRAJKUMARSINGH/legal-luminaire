[SYNTHETIC TEST DATA — NOT REAL]
[EDGE CASE — MINIMUM INPUT]
[This document tests graceful degradation with minimal data]

# SYNTHETIC INPUT: Near-Empty Minimum Input

**Test ID:** TC-E09
**Purpose:** Test graceful degradation with minimal case data

## Minimum Input Provided

```
FIR Number: 789/2025 (FICTIONAL)
Accused Name: [Accused Name]
```

## What Is NOT Provided
- Court name
- Charges/sections
- Facts
- Date of incident
- Complainant details
- Witnesses
- Evidence

## Expected App Behaviour
- App should NOT crash
- App should show what can be generated vs. what requires more data
- Partial template generated with [REQUIRED] markers for missing fields
- No fabricated facts inserted
- Clear message: "Insufficient data for complete draft — please provide: [list]"

## Pass Criteria
- No crash
- No invented facts
- [REQUIRED] markers in output
- List of missing required fields shown

## Test Purpose
TC-E09: Minimum viable input — graceful degradation
