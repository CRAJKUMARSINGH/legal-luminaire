# Legal Source Closure — 11 Outstanding Items
**Priority:** P0 for court-use exports  
**Status:** OPEN — 11 procurement actions pending; all are non-engineering  
**Opened:** 2026-11-15 (downgrade audit commit `0a4e5c8`)  
**Owner:** Legal team / advocate  
**Reference:** `final-deliverables/LEGAL_SOURCE_REVIEW.md`

---

## What is blocked

Court-use export is disabled in the application. It remains disabled until
**all 11 items below are resolved by qualified legal review** and the
corresponding source documents are obtained and recorded.

This is not an engineering gate. The software already enforces the block
correctly (`blockedFromDraft: true` on all PENDING entries, compile-time
assertion in `citation_registry.py`, P0 regression test in `verification-engine.test.ts`).
The 11 items require procurement and legal judgment, not code changes.

---

## Outstanding items

### Case law — certified copies required

| # | Precedent | Current tier | Procurement action | Registry ID |
|---|---|---|---|---|
| 1 | State of Gujarat v. Mohanbhai (2003) 4 GLR 3121 | PENDING | Gujarat HC library — certified copy + para extract | p6_mohanbhai |
| 2 | R.B. Constructions v. Maharashtra 2014 SCC OnLine Bom 125 | PENDING | Bombay HC / SCC Online — certified copy | p7_rb_constructions |
| 3 | C.B.I. v. K.S. Kalra 2011 SCC OnLine Del 3412 | PENDING | Delhi HC / SCC Online — certified copy | p8_ks_kalra |
| 4 | M/s. Builders Association v. UP 2018 SCC OnLine All 442 | PENDING | Allahabad HC / SCC Online — certified copy | p9_builders_assoc |
| 5 | Rajasthan HC Suo Motu PIL ___/2025 (29 Jul + 23 Aug orders) | SECONDARY | Rajasthan HC Registry — certified copies; confirm docket number | p_rajasthan_hc_pil |
| 6 | Surendra Koli v. UP curative petition (11 Nov 2025) | SECONDARY | SC Registry — certified copy of curative order | p_surendra_koli |
| 7 | RSMML v. Contractor (30 Mar 2026) | SECONDARY | Rajasthan HC — certified copy of Division Bench order | p_rsmml |

### Standards — official text required

| # | Standard | Current tier | Procurement action |
|---|---|---|---|
| 8 | IS 2250:1981 (Masonry mortar) | SECONDARY | Purchase from BIS Portal (bis.gov.in); extract Clause text |
| 9 | IS 3535:1986 (Cement sampling) | SECONDARY | Purchase from BIS Portal; extract Clause text |
| 10 | ASTM C1324 (Hardened masonry mortar) | SECONDARY | Purchase from astm.org; extract Clause text |
| 11 | CPWD Manual 2023 (Joint sampling norms) | SECONDARY | Download from cpwd.gov.in; extract relevant clause |

---

## What "resolved" means for each item

For case law items (1–7):
- Certified copy obtained from court registry or official subscription service (Manupatra / SCC Online).
- Exact paragraph number confirmed in the judgment text.
- Verbatim holding extracted (no paraphrasing).
- Status promoted from PENDING → VERIFIED or COURT_SAFE in `case01-data.ts` and `citation_registry.py`.
- `statusNote` updated with procurement date, source, and verifying advocate's name.
- `blockedFromDraft` set to `false` only after the above.
- P0 regression test must still pass (all remaining PENDING entries still blocked).

For standards items (8–11):
- Official document obtained from the authoritative source.
- `exactClauseText` populated with verbatim text from the official document.
- `tier` promoted to `COURT_SAFE` or `VERIFIED`.
- `sourceUrl` updated to official source (not archive.org mirror).

---

## Acceptance criteria for court-use export

Court-use export is re-enabled when **all** of the following are true:

1. All 11 items above are resolved (or formally withdrawn with justification).
2. A qualified Indian advocate has reviewed every promoted citation for:
   - Holding accuracy against the judgment text
   - Correct paragraph reference
   - Applicability to the specific case facts
3. `final-deliverables/LEGAL_SOURCE_REVIEW.md` updated with resolution evidence.
4. `docs/RELEASE_READINESS.md` updated to reflect court-use gate status.
5. SE-01 (OIDC case isolation) is also resolved — court-use exports must not be
   accessible without per-user authentication.

---

## What must NOT happen

- Do not promote a citation based on a news article, blog post, or secondary summary.
  Manupatra, SCC Online, Indian Kanoon full text, or a court-issued certified copy only.
- Do not set `blockedFromDraft: false` on any PENDING entry until a certified copy
  is in hand and para numbers are confirmed.
- Do not paraphrase holdings. Verbatim text from the judgment is mandatory.
- Do not purchase BIS or ASTM standards and manually type out clause text without
  a second reviewer confirming accuracy.

---

## Independent progress possible

This work can proceed entirely independently of:
- SE-01 (OIDC) — legal procurement does not require engineering
- P2-01 (drafting package) — citation tier changes are data updates, not code changes
- SE-08 (chromadb) — no overlap

The only dependency is SE-01: once the sources are verified, the court-use
export gate cannot be opened without SE-01 also being resolved.
