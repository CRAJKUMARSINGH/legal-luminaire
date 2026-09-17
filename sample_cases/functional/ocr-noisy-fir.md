[SYNTHETIC TEST DATA — NOT REAL]
[EDGE CASE — OCR NOISE SIMULATION]
[This document intentionally contains OCR-like errors for robustness testing]

# SYNTHETIC INPUT: OCR-Noisy FIR Text

**Test ID:** TC-E01
**Purpose:** Test app's handling of garbled/OCR-scanned text

## Simulated OCR Output (with intentional errors)

```
F1R No. 4S6/2O25 (FICTIONAL)
P.S. K0twa1i, Ajm3r
D@te: 1S-O3-2O25

C0mp1ainant: [Name garb1ed]
Acc used: [Name] S/0 [Father N@me]
Secti0ns: IPC §42O, §4O6

F@cts:
Acc used c0llected Rs. 8,OO,OOO fr0m c0mp1ainant f0r f1at b00king.
N0 f1at de1ivered. N0 refund m@de. Acc used abs c0nding.
Rec eipts avai1ab1e. Wh@tsApp mess@ges as evid ence.

Arr est date: 2O-O3-2O25
```

## Expected App Behaviour
- App should NOT crash
- App should display warning: "Input quality low — manual review recommended"
- App should NOT fabricate missing facts
- App should extract what it can (FIR number, date, sections)
- App should flag garbled fields as [UNREADABLE]

## Pass Criteria
- No crash
- Warning displayed
- No invented facts in output
- Partial extraction shown with [UNREADABLE] markers

## Test Purpose
TC-E01: OCR noise robustness — hallucination prevention
