# LEGAL LUMINAIRE — MASTER ROADMAP
**Last Updated**: 25 November 2026

**Maintained by**: ETERNAL_RESEARCH_CHILD daemon + manual updates  
**Status**: Synthetic demo verification complete on the hardening branch. Confidential production and court use have open release gates. See [Release Readiness](docs/RELEASE_READINESS.md).

---

## P0 — Critical / Blocking

- [x] Persistent case storage (localStorage + optional PostgreSQL via Drizzle ORM)
- [x] Hard-block explicitly flagged citations in Safe Draft printing and Bilingual Draft Studio downloads
- [x] Fact-Fit Gate enforced (score ≥ 70 = exact, 50–69 = analogous, < 30 = rejected)
- [x] Deterministic citation scanning in the verified Safe Draft and bilingual draft workflows
- [x] Structured citation fields (`reporter`, `volume`, `page`, `para`, `verifiedBy`) on Precedent type
- [x] Para-number guard — drafter blocked from citing unconfirmed paragraph numbers
- [x] Backend boot stability — no import-time crashes
- [x] Launch CI on the hardening branch covers lint, typecheck, build, Vitest, pytest, and offline browser checks
- [ ] Verify production identity and per-user case isolation
- [ ] Complete qualified review of the 11 outstanding legal sources before court use
- [ ] Indian Kanoon API — live citation existence check on entry (Month 2 residual — API key required)
- [ ] Para-number auto-fill — when `verifiedBy: "indiankanoon"`, fetch para from API and populate `para` field

---

## P1 — High Value

- [x] One-click Demo Mode — loads CASE_01 (Hemraj) in ≤ 3 clicks, SYNTHETIC badge persistent
- [x] 26-case demo browser with Criminal / Civil / Writ / Infrastructure filters
- [x] Grouped navigation — Case Setup / Research / Drafting / Review
- [x] Guided intake → research → draft → review flow
- [x] Multi-format document ingestion (PDF / DOCX / OCR image)
- [x] Contradiction detection — dates, names, amounts, locations
- [x] Verification Report + Pre-Filing Checklist — one click from every draft
- [x] Bilingual (Hindi + English) throughout
- [x] Court-specific formatting — Rajasthan HC / SC / Sessions / NCLT / NGT / CAT
- [ ] Verify deployed multi-user access with separate case memberships and roles
- [x] Infrastructure Arbitration suite — TC-22 to TC-26 (full lifecycle)
- [x] Eternal Research Improvement Lab — `/improvement-lab` route live
- [ ] Hearing Tracker — next hearing date field + countdown widget on Home (Month 6)
- [ ] Case Strength / Probability Assessment Card — aggregate Fact-Fit + tier scores (Month 6)
- [ ] National Beta Launch deployment
- [ ] 90-second demo video (TC-23 highway arbitration workflow)

---

## P2 — Enhancements

- [x] Error boundaries on all 55+ SPA routes
- [x] Print-ready CSS — court-ready typography, page breaks, bilingual header/footer
- [x] Status badges — COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR colour-coded
- [ ] Complete the launch-wide empty and loading-state review
- [x] Rate limiting on expensive endpoints (research / draft / RAG)
- [x] Observability — per-session token count + approximate cost reporting
- [ ] Stress testing — 100 MB+ multi-file upload stability
- [ ] Hybrid retrieval — Chroma dense + BM25 sparse for exact citation matching
- [ ] Extract shared form components (open from MODERNIZATION_PLAN.md)
- [ ] Offline-first PWA mode with local vector DB sync
- [ ] Bar Council AI Usage Disclosure auto-generation

---

## P3 — Future / Research

- [ ] Citation Graph — visualise citation network across precedents
- [ ] Case Similarity Engine — vector-based similar case finder
- [ ] Judge Analytics — judge-specific argument success patterns
- [ ] Voice-to-Draft — Hinglish audio → formal Hindi/English draft
- [ ] Open India Law Corpus — self-hosted legal corpus for air-gapped use
- [ ] Template marketplace — court-specific bail/discharge formats per High Court
- [ ] Fine-tuned LegalBERT / Gemma-2-9B for Hindi + legal domain inference

---

## ETERNAL_RESEARCH_CHILD Pending Findings

Items approved by the daemon but not yet applied manually:

| Date | Category | Target | Summary |
|------|----------|--------|---------|
| 2026-05-18 | CITATION_GATE_RULE | citation-gate.ts | Add citation allowlist enforcement — auto-PENDING for unknown citations |
| 2026-05-18 | ROADMAP_ITEM | ROADMAP.md | National Beta Launch + 90-sec demo video (from Antigravity Logbook) |
| 2026-05-18 | DEMO_CASE_ENRICHMENT | infra-arb-cases.ts | Enrich TC-22..TC-26 from ARBITRATE.MD source |

> Run `tsx ETERNAL_RESEARCH_CHILD/research_daemon.ts` to start the 15-minute research cycle.  
> Run `npm --prefix ETERNAL_RESEARCH_CHILD run sync` to regenerate `researchImprovements.generated.ts`.
