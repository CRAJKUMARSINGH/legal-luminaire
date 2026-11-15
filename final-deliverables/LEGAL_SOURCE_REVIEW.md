# LEGAL SOURCE REVIEW
**Date:** 2026-11-15 | HEAD `10cc700`

**Principle:** No BIS/ASTM clause text was invented. No judicial docket numbers were fabricated. All citation tiers reflect actual source availability.

---

## 1. Citation Registry — Current Tier Status

### COURT_SAFE (3 entries) — Safe to export

| ID | Case | Para | Holding | Evidence |
|----|------|------|---------|---------|
| p_prafulla | Prafulla Kumar Samal (1979) 3 SCC 4 | Para 10 | Confirmed verbatim | Indian Kanoon |
| p_ramesh_singh | State of Bihar v. Ramesh Singh (1977) 4 SCC 39 | Para 5 | Confirmed | Indian Kanoon |
| p_jacob_mathew | Jacob Mathew v. State of Punjab (2005) 6 SCC 1 | Para 48 | Confirmed verbatim | Indian Kanoon |

### VERIFIED (5 entries) — Safe with note; para pending

| ID | Case | Source | Para |
|----|------|--------|------|
| p_kattavellai | Kattavellai 2025 INSC 845 | Multiple secondary | Not confirmed |
| p11_damu | State of Maharashtra v. Damu (2000) 6 SCC 269 | Search URL | Not confirmed |
| p12_baldev | State of Punjab v. Baldev Singh (1999) 6 SCC 172 | Search URL | Not confirmed |
| p_rajasthan_hc_pil | Rajasthan HC Suo Motu PIL ___/2025 | LiveLaw | Not confirmed |
| p_rsmml | RSMML v. Contractor 30 March 2026 | PinkCityPost | Not confirmed |

### SECONDARY (5 entries) — Restricted; qualify before use

| ID | Case | Restriction Reason |
|----|------|--------------------|
| p_sushil_sharma | Sushil Sharma (2014) 4 SCC 317 | Para unconfirmed |
| p_surendra_koli | Surendra Koli (2025) | News media only |
| p15_tomaso_bruno | Tomaso Bruno (2015) 7 SCC 178 | Para unconfirmed |
| p19_signi | C.J. Christopher Signi 2025 Mad HC | SCC Times blog |
| p14_surendra_koli | Surendra Koli curative 2025 | Media source |

### PENDING (4 entries) — BLOCKED from all exports

| ID | Case | Citation | Block Reason |
|----|------|----------|-------------|
| p6_mohanbhai | State of Gujarat v. Mohanbhai | (2003) 4 GLR 3121 | GLR copy not obtained |
| p7_rb_constructions | R.B. Constructions v. Maharashtra | 2014 SCC OnLine Bom 125 | Not verified |
| p8_ks_kalra | C.B.I. v. K.S. Kalra | 2011 SCC OnLine Del 3412 | Not verified |
| p9_builders_assoc | M/s. Builders Association v. UP | 2018 SCC OnLine All 442 | Not verified |

**All 4 PENDING entries have `blocked=True`.** The compile-time safety assertion in `citation_registry.py` enforces this invariant at import time.

---

## 2. IS/ASTM Standards — Clause Evidence Status

| Standard | Applicability | `exactClauseText` | Tier | Court-Ready? |
|----------|-------------|-------------------|------|-------------|
| IS 1199:2018 | WRONG (prosecution error) | ✅ Scope confirmed | VERIFIED | Scope only |
| IS 2250:1981 | CORRECT (masonry mortar) | ❌ null | SECONDARY | No — needs BIS |
| IS 3535:1986 | CORRECT (sampling) | ❌ null | SECONDARY | No — needs BIS |
| ASTM C1324 | CORRECT (hardened mortar) | ❌ null | SECONDARY | No — needs ASTM |
| CPWD Manual 2023 | CORRECT (joint sampling) | ❌ null | SECONDARY | No — needs CPWD |

**No clause text was invented.** The `exactClauseText: null` values are explicit admissions that the text has not been obtained. The `verificationNote` on each entry tells the advocate exactly what procurement action is required.

---

## 3. Deadline Rules — Source Notes

All 10 rules in `limitation_rules.json` have `source_note` populated and are marked `is_synthetic=True`. Every computed deadline carries `[SYNTHETIC/DEMO]` in `basis_en` and `basis_hi`. These computations cannot be accidentally used as real court deadlines.

---

## 4. Downgraded Precedents — Audit Trail

Three precedents were downgraded from VERIFIED to SECONDARY in commit `0a4e5c8` (2026-11-15):

| Precedent | From | To | Justification |
|-----------|------|-----|---------------|
| Rajasthan HC PIL ___/2025 | VERIFIED | SECONDARY | Blank docket number; paraphrased holding from LiveLaw homepage |
| Surendra Koli (2025) | VERIFIED | SECONDARY | Indian Express/NDTV/Tribune only; no certified order |
| RSMML v. Contractor (2026) | VERIFIED | SECONDARY | PinkCityPost newspaper only; no certified order |

The P0 regression guard in `verification-engine.test.ts` (Suite 9, 11 tests) prevents these from being accidentally re-promoted to VERIFIED without code review.

---

## 5. What Requires Legal/Procurement Action (Not Engineering)

| Action | Required By | Status |
|--------|------------|--------|
| Obtain certified copy: p6 Mohanbhai (2003) 4 GLR 3121 | Gujarat HC library | PENDING |
| Obtain certified copy: p7 R.B. Constructions 2014 SCC OnLine Bom 125 | Bombay HC | PENDING |
| Obtain certified copy: p8 K.S. Kalra 2011 SCC OnLine Del 3412 | Delhi HC | PENDING |
| Obtain certified copy: p9 Builders Association 2018 SCC OnLine All 442 | Allahabad HC | PENDING |
| Obtain certified copy: Rajasthan HC PIL 29 Jul + 23 Aug 2025 orders | Rajasthan HC | PENDING |
| Obtain certified copy: Surendra Koli curative petition order | SC Registry | PENDING |
| Obtain certified copy: RSMML HC order 30 Mar 2026 | Rajasthan HC | PENDING |
| Purchase IS 2250:1981 | BIS Portal | PENDING |
| Purchase IS 3535:1986 (official BIS copy) | BIS Portal | PENDING |
| Purchase ASTM C1324 | astm.org | PENDING |
| Download CPWD Manual 2023 | cpwd.gov.in | PENDING |

**None of the above were fabricated as a shortcut. All remain in their restricted tiers until authoritative documents are obtained.**
