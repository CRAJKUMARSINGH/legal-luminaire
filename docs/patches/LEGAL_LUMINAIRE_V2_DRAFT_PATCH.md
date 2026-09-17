# Legal Luminaire – Draft Patch v2.0
**“Verifiable, Matter-Aware, Full-Lifecycle Legal OS for India”**  
Date: 15 September 2026  
Status: Ready for engineering review & phased rollout  
Target: Complete the app + add robust multi-tenant authorisation + prepare for simulated load of 151 concurrent lawyer personas using ~95 % of content randomly

---

## 1. Executive Synthesis – What the Market Leaders Actually Do (Triple-Deep)

### Research & Case Law Layer
| Capability | Best-in-class Source | Key Innovation |
|------------|----------------------|----------------|
| Source-grounded answers with paragraph-level pin-cites | Bharat.Law NyaI, CoCounsel Deep Research Verify | Every claim opens the exact judgment paragraph; zero hallucinated citations |
| Conceptual / Parallel Search + CaseIQ (upload pleading → get precedents) | CaseMine | Upload any pleading / order → auto-extract issues + map to authorities without keyword reformulation |
| Dynamic case maps / citation networks / citator (followed / overruled) | CaseMine visuals + CiteTEXT | Visual graph of precedent evolution + contextual excerpts on hover |
| Live multi-court tracking (15k+ courts, cause lists, limitation alerts) | Bharat.Law | CNR lookup + daily digests + bench changes |
| Multi-document matter intelligence (full trial bundles 10k+ pages) | Bharat.Law Document Intelligence + CaseMine Multi-Doc AMICUS | Auto chronology, exhibit index, cross-reference, issue map across entire record |
| Agentic research plans | CoCounsel next-gen / Westlaw Brief Builder | User describes matter → system plans multi-step research, iterates, cites |

### Drafting & Document Automation
| Capability | Best-in-class Source | Key Innovation |
|------------|----------------------|----------------|
| In-Word / in-editor clause generation + redline with playbooks | Spellbook + Ironclad Jurist / AI Assist | Context-aware drafting from firm clause library + colour-coded redlines with reasoning |
| Agentic multi-step drafting (research → plan → draft → cite) | Paxton agentic workflow + CoCounsel Brief Builder | Breaks long documents into orchestrated steps; higher coherence than single-shot |
| Full bilingual (10 Indian languages) + court-ready typed output | Bharat.Law | Hindi + 8 more; OCR + structure preservation |
| Template + playbook automation with fallback language | SpotDraft + Spellbook Tuning | Policy-aligned redlines + institutional knowledge compounding |

### Contract / CLM Layer
| Capability | Best-in-class Source | Key Innovation |
|------------|----------------------|----------------|
| Clause extraction (175–194 OOTB types) + Smart Import | Ironclad | Property + clause detection at scale |
| Portfolio interrogation + Ask AI across all contracts | SpotDraft Sidebar / Ask AI | Natural-language questions over entire repository with section references |
| Autonomous / agentic CLM (intake → review → redline → renew) | Spellbook ACM + SpotDraft Sidebar | Pulls from email/Slack, applies playbooks, maintains version history |

### Gaps That Legal Luminaire Must Own (India-specific + our existing strength)
- Full-lifecycle **criminal + civil + infrastructure arbitration** case packs with Fact-Fit Gate / verification tiers (already partially built – TC-27, TC-74, TC-75, etc.).
- Bilingual .lex / .md drafting that survives Indian court formatting (cause title, verification, schedule, Hindi parallel).
- Standards Matrix + Evidence Matrix as first-class objects (unique to our accuracy-first positioning).
- Seamless transition from research → Fact-Fit Gate → bilingual draft → Order 39 / Discharge / Specific Performance workflow.
- Authorisation & multi-tenant isolation suitable for chambers, solos, and firm practice groups.

---

## 2. Best-of-All-Worlds Feature Matrix for Legal Luminaire v2.0

### Core Pillars (Must Ship)

**A. Verifiable Research Engine (NyaI-inspired + CaseIQ)**
- Source-grounded answers only – every citation is a live link to judgment paragraph / statute section.
- Parallel / conceptual search + “Upload Pleading → CaseIQ-style precedent map”.
- Dynamic case-map visualisation with citator signals (followed / distinguished / overruled).
- Live court tracking module (cause lists, CNR, limitation risk) for 15k+ Indian forums.
- Multi-document matter workspace: upload full trial / arbitration bundle → auto chronology, exhibit index, issue map, witness cross-reference.

**B. Matter-Aware Agentic Drafting (CoCounsel + Paxton + Spellbook hybrid)**
- Agentic workflow: describe matter → system proposes research plan → executes → drafts bilingual document with Fact-Fit Gate scores attached.
- In-editor (Word + web) clause generation from firm / personal library + playbook redlining with reasoning.
- One-click generation of every stage document we already defined (Plaint, Order 39, Discharge Application, Written Arguments, Judgment draft, etc.) with Hindi parallel.
- Continuous readiness / limitation / jurisdiction checker baked into Specific Performance, Injunction, Discharge workflows.

**C. Fact-Fit Gate & Standards Matrix (Our Unique Moat)**
- Every piece of evidence / claim item scored (COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR).
- Standards Matrix auto-populated from BNSS / CPC / SRA / TP Act / local revenue rules / FSL protocols / POCSO guidelines.
- “Blocked from draft” enforcement – FATAL_ERROR items cannot appear in final output without override + audit log.

**D. Full-Lifecycle Case Library Integration**
- All existing packs (Infra Arb TC-22–26, Criminal TC-27–31, Financial/ACB/Cheque/Theft/420/Pride, Land, Property, Civil Master TC-72–86) become first-class selectable templates.
- Demo browser filters + marketing showcase cards auto-updated.
- One-click “Load TC-74 full set” → populates matter workspace with all matrices + bilingual drafts.

**E. Contract & Transaction Layer (SpotDraft + Ironclad + Spellbook)**
- Clause library + playbook redlining for commercial agreements.
- Portfolio Ask-AI across uploaded contracts.
- Smart import + 150+ clause type detection.

**F. Collaboration & Workspace**
- Shared matter workspace (documents, tasks, research, drafts, court events) with role-based access.
- Version history + audit trail on every AI suggestion.

---

## 3. Authorisation & Multi-Tenant Security (Complete the App)

### Required Auth Model
- **Identity**: Email + OTP / SSO (Google Workspace / Microsoft) + optional Aadhaar e-Sign for court filings later.
- **Roles** (hierarchical):
  - Super-Admin (platform)
  - Firm Admin / Chamber Owner
  - Partner / Senior Counsel
  - Associate / Junior
  - Paralegal / Clerk
  - Client (read-only matter view, optional)
- **Scopes**:
  - Matter-level ACLs (who can see which case)
  - Document-level (draft vs final)
  - Feature flags (research credits, drafting volume, court tracking)
- **Data isolation**: Row-level security + tenant_id on every table. Zero cross-tenant leakage.
- **Audit**: Immutable log of every AI generation, override of Fact-Fit Gate, export, and share.
- **Compliance**: DPDP Act ready (consent, retention, breach clock), zero training on customer data.

### Implementation Notes
- JWT + short-lived access tokens + refresh.
- Fine-grained permission matrix stored in DB and enforced at API + UI.
- “Impersonate” mode for support (audited).

---

## 4. Simulated Load Test Spec – 151 Random Lawyers @ ~95 % Content Usage

**Objective**: Validate that 151 concurrent realistic lawyer sessions can exercise ~95 % of the feature surface without degradation.

**Persona Mix (randomly generated)**
- 40 % Solo / small chamber (heavy drafting + research)
- 30 % Mid-size firm associates (matter workspace + collaboration)
- 20 % Senior counsel / government advocates (court tracking + Fact-Fit Gate heavy)
- 10 % In-house / corporate (contract + portfolio Ask-AI)

**Session Behaviour (each lawyer)**
- Randomly select 8–12 matters from the full TC library (criminal, civil, infra, financial).
- Upload 3–8 documents per matter (mix of PDF judgments, pleadings, contracts).
- Trigger: research query, CaseIQ-style upload, Fact-Fit Gate run, bilingual draft generation, Order 39 / Discharge / Specific Performance workflow, redline playbook, portfolio question, court-tracking check.
- Export / share 2–3 outputs.
- Total actions per session designed so aggregate coverage ≈ 95 % of all endpoints and UI surfaces.

**Success Criteria**
- p95 latency < 4 s for research, < 12 s for full multi-doc intelligence, < 8 s for bilingual draft.
- Zero cross-tenant data leakage.
- Fact-Fit Gate never allows FATAL_ERROR into final output without explicit override + log.
- Authz correctly blocks junior from senior-only matters.
- System remains stable under sustained load for 90 minutes.

**Test Harness**
- Scripted Playwright / k6 mix with realistic think times.
- Seed data = all current TC packs + synthetic variations.
- Metrics: error rate, latency percentiles, authz denial correctness, credit consumption accuracy.

---

## 5. Phased Rollout Recommendation

**Phase 1 (2–3 weeks)** – Core completion + Auth
- Ship multi-tenant auth + roles + audit.
- Integrate existing TC-74 & TC-75 full packs into live matter workspace.
- Source-grounded research + Fact-Fit Gate enforcement.

**Phase 2 (3–4 weeks)** – Agentic + Multi-doc
- Agentic drafting workflow.
- Multi-document intelligence (chronology, exhibit index, issue map).
- CaseIQ-style “upload pleading → precedents”.

**Phase 3 (4 weeks)** – Contract layer + Polish
- Clause library + playbook redlining.
- Portfolio Ask-AI.
- Live court tracking MVP.
- Full 151-lawyer load test + hardening.

**Phase 4** – Continuous
- Expand remaining TC packs under the recovery checklist rules (one owner, small PRs, documented decisions).
- Firm playbook / clause library sharing.
- DPDP / consent manager readiness.

---

## 6. Immediate Engineering Tasks (Recovery-Checklist Aligned)

1. Freeze non-critical feature work.
2. Name single owner for Auth module and single owner for Research/Drafting core.
3. Create architecture decision records for:
   - Source-grounding strategy
   - Fact-Fit Gate enforcement
   - Multi-tenant isolation model
4. Add the two delivered packs (TC-74, TC-75) as golden test fixtures.
5. Implement the permission matrix and row-level security before any further case-pack expansion.
6. Prepare the 151-persona load-test harness as soon as auth is live.

---

## 7. Success Definition

Legal Luminaire v2.0 is complete when:
- A new Indian lawyer can open a matter, upload a full trial bundle, receive a source-grounded research report with Fact-Fit scores, generate a bilingual Order 39 / Discharge / Specific Performance draft, and share it with a junior under correct ACLs — all inside one workspace.
- 151 concurrent realistic sessions exercise 95 % of the surface with stable performance and zero data leakage.
- Every output remains defensible in an Indian court (citations openable, FATAL_ERROR blocked, audit trail present).

This patch turns the excellent case-pack foundation already built into a production-grade, best-of-all-worlds Legal OS for India.

Ready for engineering breakdown into tickets or further prioritisation.  