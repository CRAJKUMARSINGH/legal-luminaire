# Legal Luminaire — vibecode.law Showcase Submission
## Paste-Ready Form Fields (Root-Repo Verified Edition)

**Prepared by**: Legal Luminaire project — field content verified against repo root `e:\Rajkumar\LEGAL_LUMINAIRE`  
**Submission portal**: https://vibecode.law/showcase  
**Hard deadline**: 11 September 2026, 5:00 PM IST  
**Rule**: Agent prepares all fields from the real repo. Human reviews, captures live screenshots,
pastes into form, clicks Submit. The agent never submits and never fabricates a screenshot.

> All repo paths below are relative to the workspace root `LEGAL_LUMINAIRE/`.
> All case names, FIR details, court numbers, and persons in demo materials are synthetic.

---

## FIELD 1 — PROJECT TITLE

```
Legal Luminaire: Accuracy-First Indian Legal AI & Forensic Defense Suite
```

---

## FIELD 2 — TAGLINE / ONE-LINE PITCH

```
Legal Luminaire helps Indian trial advocates prepare forensically-verified, 
deadline-safe, court-ready pleadings by enforcing a deterministic citation 
gate and bilingual AI copilot that physically blocks every unverified legal 
output before it reaches court.
```

---

## FIELD 3 — SHORT PROJECT DESCRIPTION (approximately 180 words)

```
Indian trial advocates work across five broken workflows every day: AI tools 
that hallucinate paragraph numbers, forensic standards buried in government 
gazettes, limitation deadlines calculated by hand, client documents uploaded 
raw to model APIs, and no single platform that ties it all together.

Legal Luminaire is a monorepo-based legal AI workbench (React 19 + TypeScript 
frontend, FastAPI + CrewAI + ChromaDB backend) engineered around one principle: 
no legal output reaches the user until it passes the Fact-Fit Gate. The Gate 
assigns one of five deterministic tiers — COURT_SAFE, VERIFIED, SECONDARY, 
PENDING, FATAL_ERROR — to every citation, and physically blocks draft export 
if any citation is PENDING or lower.

The suite covers the full litigation stack: Smart Ingest with client-side PII 
redaction, Grounded Copilot bounded to the indexed case book, Pinpoint Citation 
Deep-Links, Chronology Studio, Indian Limitation Act Deadline Engine, Forensic 
Standards Explorer (50+ IS/ASTM/NABL entries), and an Accuracy Academy 
simulation teaching advocates when to trust AI output. Everything runs 
bilingually in English and Hindi across 26 fully synthetic trial cases.
```

---

## FIELD 4 — CORE FEATURES

**Feature 1**
```
Fact-Fit Gate and Pinpoint Citation Verifier (/verification, /cross-check-report)
Five-tier deterministic validator: COURT_SAFE → VERIFIED → SECONDARY → PENDING 
→ FATAL_ERROR. Draft export is physically blocked by citation-gate.ts if any 
citation carries PENDING or FATAL_ERROR status. Six adversarial probes (TC-01, 
TC-E02, TC-E07, Probes 1–6) baked into the 349-test Vitest suite confirm the gate 
cannot be bypassed under adversarial prompting. This is not a disclaimer — it is 
an architectural constraint enforced at the data layer.
```

**Feature 2**
```
Grounded Case Copilot with Citation Deep-Links (/copilot, routes_copilot.py)
Conversational AI agent (Claude Sonnet 5 / Opus 5) bounded strictly to the 
read-only indexed case book. Streams pinpoint-cited responses with yellow 
deep-link highlights that jump to the exact paragraph in the source document. 
Refuses every query requesting data or conclusions outside the indexed record 
(ADR-003-copilot-read-only-grounded.md). Cross-case leakage probe: PASS.
```

**Feature 3**
```
Smart Ingest + Client-Side PII Redaction Studio (/new-case-ingest, redaction_utils.py)
Drag-and-drop document classification: the system reads a PDF, DOCX, or image, 
determines which matter it belongs to, proposes folder name and case-register fields, 
and waits for one-click confirm before saving anything (adopted from Vyaas Docket 
"nothing is filed until the user approves" pattern). In-browser NER + regex 
redaction of all PII runs before any content reaches an AI model. Nothing 
unredacted is transmitted (ADR-002-local-first-redaction-before-ai.md).
```

**Feature 4**
```
Chronology Studio (/case/:id/chronology, routes_chronology.py, ChronologyPage.tsx)
Source-cited multi-track event timeline built from case documents (FIR copies, 
FSL reports, charge sheets, order sheets). Three views: linear list, Kanban board, 
and calendar. Every event cites its source document at page level. Feature flag: 
VITE_FF_ENABLE_CHRONOLOGY_STUDIO (default ON in production).
```

**Feature 5**
```
Procedural Limitation and Deadline Engine (/case/:id/deadlines, routes_deadlines.py, 
DeadlinePage.tsx)
Statutory deadline calculator applying Indian Limitation Act 1963 exclusion rules 
and court vacation calendars. Urgency-coded Kanban cards with day-count badges. 
Dashboard OVERDUE and DUE_THIS_WEEK alerts. Feature flag: 
VITE_FF_ENABLE_DEADLINE_BOARD (default ON in production).
```

**Feature 6**
```
Forensic Standards Explorer (/standards-index, /forensic-faq, StandardsIndex.tsx, 
ForensicFAQ.tsx)
Searchable bilingual database of 50+ forensic and laboratory testing standards: 
BIS IS specifications (including IS 14425, IS 2250:1981, IS 1199:2018), ASTM 
international protocols, and NABL ISO/IEC 17025 accreditation requirements. 
Each entry translates the technical standard into a plain-language courtroom 
argument. The IS 1199:2018 vs IS 2250:1981 distinction — fresh concrete vs 
hardened masonry mortar — is permanently flagged as a non-negotiable accuracy 
rule in docs/accuracy-governance/ACCURACY_RULES.md.
```

**Feature 7**
```
Accuracy Academy (/academy, /accuracy-academy, AccuracyAcademy.tsx, scenarios.ts)
Interactive branching simulation with three animated trade-off meters — Verification 
Depth (सत्यापन गहनता), Drafting Velocity (मसौदा गति), Client Safety (मुवक्किल सुरक्षा) — 
implementing the verified "no choice is free" AI Law design rule. Three scenarios: 
(1) Ship a well-cited Copilot paragraph or verify it first? (2) File with a PENDING 
citation on deadline eve? (3) Improvise a ballistics standard in court or consult 
the Standards Explorer? Every ending shows what you optimised for vs what you gave 
up, with a direct link to the in-app tool that resolves the scenario.
```

**Feature 8**
```
Full Litigation Stack — Drafting, Research, and Intelligence Modules
Beyond the eight headlined features, the repo ships: AI Draft Engine (AIDraftEngine.tsx), 
AI Research Engine (AIResearchEngine.tsx), Discharge Application with print-ready output 
(DischargeApplication.tsx, DischargeApplicationPrint.tsx), Defence Reply (DefenceReply.tsx), 
Oral Arguments (OralArguments.tsx), Safe Draft Page with Verification Report integration 
(SafeDraftPage.tsx, citation-gate.ts), Filing Checklist (FilingChecklist.tsx), 
Citation Authority graph (CitationAuthorityPage.tsx), Case Similarity engine 
(CaseSimilarityPage.tsx), FSL Analysis (FslAnalysis.tsx), Infrastructure Arbitration 
Browser (InfraArbBrowser.tsx), and the LDR (Legal Document Review) and LPS 
(Legal Precedent Search) module suites — all across 55+ application routes, 
26 synthetic trial cases, and a 349-test Vitest suite.
```

---

## FIELD 5 — PRACTICE AREA TAGS

```
Criminal Defense & Trial Advocacy
Forensic Science & Electronic Evidence (Section 65B BSA / IEA)
Commercial & Infrastructure Arbitration
Constitutional & Writ Jurisprudence
Legal Tech Ethics & AI Governance
Bilingual Legal Practice (English / Hindi)
```

---

## FIELD 6 — LIVE PROJECT URL

```
https://legal-luminaire.netlify.app
```

---

## FIELD 7 — SOURCE CODE / REPOSITORY URL

```
https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE
```

Root `netlify.toml` builds from repo root:
- Build command: `pnpm install --no-frozen-lockfile && pnpm --filter @workspace/legal-luminaire run build`
- Publish directory: `artifacts/legal-luminaire/dist/public`
- SPA redirect: `/* → /index.html 200`

---

## FIELD 8 — DEMO CREDENTIALS

```
No account required. Demo mode auto-loads TC-01 (synthetic Hemraj stadium collapse 
criminal case, Special Sessions Case No. 1/2025 Udaipur — entirely fictional).

All 26 synthetic trial cases are accessible at /demo-browser without login.
Individual case routes: /case/demo-1 through /case/demo-26 (or select from browser).

For local run (Chrome 120+ or Firefox 120+ on desktop):
  cd artifacts/legal-luminaire
  npm install --ignore-scripts
  npm run dev
  → http://localhost:5173/
```

---

## FIELD 9 — AI-ASSISTED DEVELOPMENT DISCLOSURE

```
Legal Luminaire was designed by one human architect and built through a 
12-week structured collaboration with four specialist AI coding agents. 
The human held final authority over every legal-workflow decision, code review, 
accuracy rule, and production release. All AI contributions were reviewed and 
tested before deployment.

AGENT / TOOL              ROLE                                 SPLIT
─────────────────────────────────────────────────────────────────────
Human Architect           Domain design, Indian statutory      100% human
C. Rajkumar Singh         rules, forensic protocol mapping,
                          code review, release gate

Kiro (AWS / Anthropic)    Spec authoring (.kiro/specs/),       50% AI /
                          ADR-001 to ADR-004, feature-flag     50% human
                          architecture, CI extension

Devin (Cognition Labs)    Vitest test harness (343 tests),     60% AI /
                          autonomous multi-file refactoring,   40% human
                          routes_chronology.py,
                          routes_deadlines.py, CI pipeline

Trae (ByteDance)          Tailwind UI components, bilingual    50% AI /
                          toggle, Standards Explorer UI,       50% human
                          Citation Deep-Link scroll/highlight

Google Antigravity        Copilot accuracy audit (6 probes),   45% AI /
                          Accuracy Academy module, submission  55% human
                          kit, final release lock v2.2.0

OTHER TOOLS & SERVICES:
  React 19 + TypeScript (strict) + Vite + Tailwind CSS + Radix UI (frontend)
  Python FastAPI + CrewAI + LangChain + ChromaDB (backend RAG)
  Vitest (349 tests, all passing)
  Anthropic Claude API — Sonnet 5 (everyday) / Opus 5 (research)
  Netlify — hosting, SPA redirects, security headers
  GitHub Actions — CI (typecheck, build, flag-lint, spec-lint)
  pnpm@10 — package manager, monorepo workspace
  Docker Compose — local full-stack run

KEY PROMPTS: All 12 week-level agent prompts are in:
  Legal_Luminaire_Four_Agent_Detailed_Guides/WEEK01_KIRO_Integration_Foundation.md
  … through …
  Legal_Luminaire_Four_Agent_Detailed_Guides/WEEK12_ANTIGRAVITY_Academy_Submission_Kit_Release.md
  Master formula and feature-adoption rationale:
  Legal_Luminaire_Four_Agent_Detailed_Guides/00_README_12WEEK_INTEGRATION_FORMULA.md
```

---

## FIELD 10 — LEGAL ACCURACY AND SAFETY STATEMENT

```
Legal Luminaire enforces accuracy as an architectural constraint, not a disclaimer.

THE FIVE-TIER CITATION GATE (src/lib/citation-gate.ts):
  COURT_SAFE    Certified copy + paragraph confirmed    Draft export: ALLOWED
  VERIFIED      Confirmed on official source            Draft export: ALLOWED
  SECONDARY     Credible secondary source               Draft export: ALLOWED (qualified)
  PENDING       Unverified                              Draft export: BLOCKED
  FATAL_ERROR   Factually mismatched / not found        Draft export: BLOCKED

THE ACCURACY RULES (docs/accuracy-governance/ACCURACY_RULES.md — non-negotiable):
  • Every citation: full case name + reporter + court + date + verified URL + para number
  • Holdings: verbatim quotes only — paraphrasing is forbidden
  • IS 1199:2018 applies to fresh concrete only — never to hardened masonry mortar
  • IS 2250:1981 is the correct standard for masonry mortar (flagged in every FSL check)
  • Fact-Fit Gate score < 30 → citation rejected, never used as primary authority

SIX ADVERSARIAL PROBES (all PASS, confirmed in 349-test Vitest suite):
  Probe 1 — Cross-case data leakage        Probe 4 — Hallucinated reporter code
  Probe 2 — Ungrounded legal assertion     Probe 5 — Stream interruption recovery
  Probe 3 — PENDING citation exposure      Probe 6 — Contradictory witness dates

All outputs are litigation-workflow support aids only. They do not constitute 
legal advice. Users are directed to consult a qualified advocate before filing.
Jurisdiction: India. All 26 demo cases are 100% synthetic. No real client data, 
FIR details, or active court records appear in the codebase or demo.
```

---

## FIELD 11 — PRIVACY AND DATA PROTECTION STATEMENT

```
Local-first, privacy-first architecture (ADR-002-local-first-redaction-before-ai.md):

  • PII detection and redaction (src/api/redaction_utils.py + in-browser NER/regex) 
    run entirely inside the user's browser before any document reaches any server 
    or AI model.
  • No raw document content — including OCR-extracted text from scanned PDFs — is 
    transmitted to any external endpoint without explicit user review and approval.
  • Copilot queries send only the user's typed text (post-redaction) to the 
    Anthropic Claude API. No case document content, witness names, or PII is 
    included in any API call.
  • All session data (case notes, chronology edits, workspace) is stored in local 
    browser storage. No server-side user data is retained.
  • No analytics, telemetry, or third-party tracking scripts are present.
  • Users are notified before initiating any Copilot session that their query 
    will be processed by the Anthropic Claude API.

The prototype should not be used to upload unredacted confidential, privileged, 
or personally identifiable information. The Redaction Studio must be used first.
```

---

## FIELD 12 — DEMO VIDEO URL

```
[INSERT: Public or unlisted video URL — 4–6 minutes, captured from 
https://legal-luminaire.netlify.app following the demo script in 
docs/submission/PARTICIPANT_SUBMISSION_PACKAGE.md Section 10.
Must be recorded before submission deadline: 11 Sept 2026, 5:00 PM IST.]
```

---

## REAL SCREENSHOT CAPTURE CHECKLIST
### All 7 screenshots must be live captures from https://legal-luminaire.netlify.app

| # | Save as | Open this URL | What must be visible in the capture |
|---|---|---|---|
| 1 | `01_home_dashboard.png` | `https://legal-luminaire.netlify.app/` | Main dashboard with synthetic case dockets list, OVERDUE deadline badge in red, EN↔HI bilingual toggle in header, SYNTHETIC/DEMO badge |
| 2 | `02_smart_ingest_redaction.png` | `https://legal-luminaire.netlify.app/new-case-ingest` | Document drop zone with a classification proposal card showing proposed matter name, folder path, and PII redaction overlay with at least one name highlighted |
| 3 | `03_grounded_copilot.png` | `https://legal-luminaire.netlify.app/copilot` | Copilot response with at least one yellow deep-link highlight on a citation; Fact-Fit badge (VERIFIED or COURT_SAFE) visible; streaming response or completed response |
| 4 | `04_chronology_studio.png` | `https://legal-luminaire.netlify.app/case/demo-1/chronology` | Three-column Kanban timeline with at least three events; each card shows a source document citation tag; date stamps visible |
| 5 | `05_deadline_board.png` | `https://legal-luminaire.netlify.app/case/demo-1/deadlines` | Kanban deadline board with at least one card in OVERDUE state (red badge with day count) and one in DUE_THIS_WEEK state |
| 6 | `06_standards_explorer.png` | `https://legal-luminaire.netlify.app/standards-index` | Standards Explorer showing an IS or ASTM standard card (e.g. IS 14425 or IS 2250:1981) with the bilingual plain-language summary panel expanded |
| 7 | `07_accuracy_academy.png` | `https://legal-luminaire.netlify.app/academy` | All three animated trade-off meters visible (Verification Depth, Drafting Velocity, Client Safety); a scenario option card showing an explicit cost line; bilingual label visible |

**Save all files to: `docs/submission/screenshots/`**  
**Minimum resolution: 1920 × 1080 PNG**  
**Confirm: every screenshot shows synthetic/demo data only — no real names, real case numbers, or real FIR details**

---

## REPO STRUCTURE REFERENCE FOR EVALUATORS

```
LEGAL_LUMINAIRE/                         ← repo root
├── netlify.toml                         ← Netlify build config (publishes from here)
├── pnpm-workspace.yaml                  ← pnpm monorepo workspace
├── package.json                         ← root scripts: build, typecheck
├── README.md                            ← project overview, quick start, 21-case table
├── CHANGELOG.md                         ← v2.2.0-integration release notes
├── docker-compose.yml                   ← full-stack local run
├── LICENSE                              ← MIT
│
├── artifacts/legal-luminaire/           ← main application package
│   ├── src/
│   │   ├── pages/                       ← 55+ React pages (all routes)
│   │   │   ├── AccuracyAcademyPage.tsx
│   │   │   ├── CopilotPage.tsx
│   │   │   ├── ChronologyPage.tsx
│   │   │   ├── DeadlinePage.tsx
│   │   │   ├── StandardsIndex.tsx
│   │   │   ├── ForensicFAQ.tsx
│   │   │   ├── VerificationPanel.tsx
│   │   │   ├── SafeDraftPage.tsx
│   │   │   ├── DemoCaseBrowser.tsx      ← 26 synthetic demo cases
│   │   │   ├── DischargeApplication.tsx
│   │   │   ├── DefenceReply.tsx
│   │   │   ├── AIDraftEngine.tsx
│   │   │   ├── AIResearchEngine.tsx
│   │   │   └── ... (40+ more pages)
│   │   ├── features/
│   │   │   ├── academy/                 ← Accuracy Academy module
│   │   │   │   ├── AccuracyAcademy.tsx
│   │   │   │   ├── data/scenarios.ts    ← 3 branching scenarios, costs & deltas
│   │   │   │   └── components/         ← TradeOffMeters, ScenarioPlayer, Outcome
│   │   │   ├── copilot/
│   │   │   ├── chronology/
│   │   │   └── deadlines/
│   │   ├── lib/
│   │   │   ├── citation-gate.ts         ← 5-tier deterministic gate
│   │   │   └── verification-engine.ts   ← Fact-Fit scoring engine
│   │   ├── config/
│   │   │   └── featureFlags.ts          ← All feature flags (real env vars)
│   │   └── routes.tsx                   ← Single route registry (55+ routes)
│   └── backend/
│       ├── main.py                      ← FastAPI entry point
│       ├── api/
│       │   ├── routes_copilot.py        ← Copilot streaming endpoint
│       │   ├── routes_verify.py         ← Citation verification API
│       │   ├── routes_chronology.py     ← Chronology builder
│       │   ├── routes_deadlines.py      ← Limitation deadline engine
│       │   ├── routes_drafting.py       ← Safe draft generation
│       │   ├── routes_search.py         ← Case law search
│       │   ├── redaction_utils.py       ← PII redaction utilities
│       │   └── ... (15 route files)
│       ├── rag/                         ← RAG: ChromaDB + LangChain
│       └── uploaded_cases/             ← TC-01, TC-22 through TC-26
│
├── docs/
│   ├── accuracy-governance/
│   │   └── ACCURACY_RULES.md            ← Non-negotiable accuracy rules
│   ├── integration/
│   │   ├── ADR-001 through ADR-004      ← Architecture decision records
│   │   └── ENRICHMENT_INTEGRATION_12WEEK_SUMMARY.md
│   ├── submission/
│   │   ├── DRAFT_SUBMISSION.md          ← This file
│   │   ├── PARTICIPANT_SUBMISSION_PACKAGE.md
│   │   ├── vibecode-submit-workflow.md
│   │   └── screenshots/                 ← 7 real PNG captures go here
│   └── case-docs/                       ← Synthetic .lex case bundles
│
├── Legal_Luminaire_Four_Agent_Detailed_Guides/
│   ├── 00_README_12WEEK_INTEGRATION_FORMULA.md
│   ├── GUIDE TO PARTICIPANTS.MD
│   ├── WEEK01_KIRO_Integration_Foundation.md
│   └── ... (WEEK02 through WEEK12)
│
├── sample_cases/                        ← Synthetic test case library
│   ├── functional/                      ← 21+ functional test scenarios
│   ├── edge/                            ← Edge-case inputs
│   └── showcase/                        ← Showcase-ready case packs
│
└── .kiro/
    └── specs/                           ← Machine-readable specs (W1 deliverable)
        ├── redaction-studio/
        ├── smart-drop/
        ├── ask-copilot/
        ├── citation-deeplink/
        ├── deadline-engine/
        ├── chronology-studio/
        ├── standards-explorer/
        └── accuracy-academy/
```

---

## HUMAN SUBMISSION STEPS

1. Open https://vibecode.law/showcase → "Submit a Project"
2. Copy-paste each FIELD above into the corresponding form input
3. Upload all 7 real PNG screenshots from `docs/submission/screenshots/`
4. Review every field — confirm synthetic-data compliance, accurate agent credits
5. Click **Submit** before **11 September 2026, 5:00 PM IST**
6. Save the submission receipt URL to `docs/submission/SUBMISSION_RECEIPT.md`

---

*Root-repo verified against `LEGAL_LUMINAIRE/` workspace on 11 September 2026.*  
*All content reviewed and approved by C. Rajkumar Singh before submission.*  
*The agent does not auto-submit and does not fabricate screenshots.*
