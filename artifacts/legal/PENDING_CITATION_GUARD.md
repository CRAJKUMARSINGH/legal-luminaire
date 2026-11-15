# PENDING CITATION GUARD
**Date:** 2026-11-15

## Purpose

This document records the regression guard implementation that prevents any PENDING citation from accidentally becoming exportable.

## Guard Location

**File:** `artifacts/legal-luminaire/src/__tests__/verification-engine.test.ts`  
**Suite:** Suite 9 — `P0 Regression Guard`

## Tests Added

```
P0 Regression Guard — PENDING citations must always be blockedFromDraft
  ✓ every PENDING entry in CASE01_PRECEDENTS has blockedFromDraft=true
  ✓ no PENDING entry in CASE01_PRECEDENTS has blockedFromDraft=false or undefined
  ✓ every PENDING entry in PRECEDENT_ACCURACY registry has blockedFromDraft=true

P0 Regression Guard — downgraded precedents p13/p14/p16 must stay SECONDARY
  ✓ p13 (Rajasthan HC PIL) is NOT VERIFIED in CASE01_PRECEDENTS
  ✓ p14 (Surendra Koli) is NOT VERIFIED in CASE01_PRECEDENTS
  ✓ p16 (RSMML) is NOT VERIFIED in CASE01_PRECEDENTS
  ✓ p_rajasthan_hc_pil is SECONDARY in PRECEDENT_ACCURACY registry
  ✓ p_surendra_koli is SECONDARY in PRECEDENT_ACCURACY registry
  ✓ p_rsmml is SECONDARY in PRECEDENT_ACCURACY registry

P0 Regression Guard — overallAccuracyScore combined percentage removed
  ✓ score field returns -1 sentinel (not a 0-100 percentage)
  ✓ accuracyNote field is present and explains the removal
```

## What the Guard Prevents

If any developer changes:
- `status: "PENDING"` → any other value without getting a certified copy
- `blockedFromDraft: true` → `false` on a PENDING entry
- Promotes p13/p14/p16 back to VERIFIED without certified order
- Restores the combined accuracy percentage formula

…the CI `pnpm run test` will fail on these tests before the change can be merged.

## PENDING Entries Currently Guarded (4)

| ID | Case | Citation |
|----|------|---------|
| p6 | State of Gujarat v. Mohanbhai | (2003) 4 GLR 3121 |
| p7 | R.B. Constructions v. State of Maharashtra | 2014 SCC OnLine Bom 125 |
| p8 | C.B.I. v. K.S. Kalra | 2011 SCC OnLine Del 3412 |
| p9 | M/s. Builders Association v. State of UP | 2018 SCC OnLine All 442 |

## Upgrade Path

To promote a PENDING citation, all of the following are required:
1. Obtain certified copy from HC/SC Registry
2. Confirm exact para number and verbatim holding
3. Update `status`, `verifiedHolding`, `paraRef` in `case01-data.ts`
4. Update `tier`, `verifiedHolding`, `paraRef` in `verification-engine.ts`
5. Set `blockedFromDraft: false` only after steps 1–4
6. Have the advocate confirm before commit
