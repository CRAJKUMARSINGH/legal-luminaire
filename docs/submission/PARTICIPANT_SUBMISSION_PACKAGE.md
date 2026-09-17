# ILTN × vibecode.law Vibeathon 2026
## Legal Luminaire — Complete Participant Submission Package

**Version**: Final | 11 September 2026  
**Project**: Legal Luminaire: Accuracy-First Indian Legal AI & Forensic Defense Suite  
**Live URL**: https://legal-luminaire.netlify.app  
**Repository**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Release Tag**: `v2.2.0-integration`  
**Submission Deadline**: 11 September 2026, 5:00 PM IST

> This document covers every section required by the ILTN × vibecode.law Vibeathon 2026 Guide to Participants.
> All case names, FIR details, court numbers, dates, and persons referenced in demo materials are entirely synthetic
> and do not represent any real legal proceeding, person, or institution.

---

## SECTION 1 — PARTICIPANT AND TEAM INFORMATION

### Primary Participant / Team Leader

| Field | Details |
|---|---|
| Full name | C. Rajkumar Singh |
| Email address | [Insert verified contact email] |
| Mobile number | [Insert mobile number] |
| City and state | [Insert city], [Insert state], India |
| Professional status | Lawyer / Legal-domain architect |
| Organisation / Law firm | Independent — Legal Luminaire Project |
| LinkedIn profile | [Insert LinkedIn URL if available] |
| Role in the project | Project architect, lead legal-domain expert, production release gate, human oversight and review authority |

### Team Composition

| Member | Role | Contribution |
|---|---|---|
| C. Rajkumar Singh | Team leader — Human architect & lead counsel | All domain requirements, Indian statutory rules, forensic test protocol design, final code review and release approval, legal accuracy governance |

> Note on AI-assisted development: Legal Luminaire was built by one human architect working in close collaboration with four specialist AI coding agents (Kiro, Devin, Trae, Google Antigravity) in a structured 12-week integration programme. Each AI agent performed its role under continuous human supervision. The four agents are disclosed fully under Section 6 (AI-Assisted Development). They are not team members in the competition sense; they are tools and are credited as such.

### Eligibility Declaration

- [x] C. Rajkumar Singh is an Indian national.
- [x] The project is led by a legally qualified professional with domain expertise in Indian litigation.
- [x] The project directly addresses real legal problems experienced by Indian trial advocates, criminal defense practitioners, and law-firm operations teams.
- [x] The submitted work is original; no portions are copied from undisclosed third parties.
- [x] Permission exists to use all open-source libraries, AI APIs, hosting services, and third-party tools included in the project. Full disclosure is provided in Section 13.
- [x] All case materials, judgments, FIR details, and witness names used in the demo are entirely synthetic. No real client data, privileged communications, or active court records appear anywhere in the codebase or demo.

### Team Details

- **Team name**: Legal Luminaire
- **Number of members**: 1 (individual participant — human architect, with four disclosed AI agents)
- **Team leader / primary contact**: C. Rajkumar Singh
- **Contribution summary**: The sole human member designed the entire legal workflow, authored all domain requirements, reviewed all AI-generated code and content, conducted testing against 26 synthetic trial scenarios, and approved every production release.
- **Preferred contact email**: [Insert preferred email]
- **Preferred contact phone**: [Insert phone number]

---

## SECTION 2 — PROJECT IDENTITY

### Project Title

**Legal Luminaire: Accuracy-First Indian Legal AI & Forensic Defense Suite**

### One-Line Pitch

> Legal Luminaire helps Indian trial advocates and criminal defense practitioners eliminate citation hallucinations, manage limitation deadlines, and prepare court-ready forensic arguments by providing an accuracy-gated, bilingual AI workbench that blocks every unverified legal output before it reaches court.

### Short Project Summary (approximately 160 words)

Indian trial advocates face a compounding crisis: AI tools that generate confident but unverified citations, no single platform for forensic standards, and deadline-management systems that ignore Indian Limitation Act exclusion rules. Legal Luminaire resolves all three.

The platform is an accuracy-first legal AI workbench engineered for Indian trial litigation, criminal defense, and forensic evidence analysis. Its Fact-Fit Gate enforces zero-tolerance citation blocking — no draft reaches the user until every precedent is verified to pinpoint paragraph level. The Grounded Copilot reads only the live indexed case book; it never invents a judgment, date, or order. The Chronology Studio builds source-cited multi-track timelines from case documents. The Limitation Engine applies Indian Limitation Act exclusion calendars to real statutory deadlines. The Forensic Standards Explorer translates 50-plus IS, ASTM, and NABL protocols into plain-language courtroom arguments. The Accuracy Academy teaches advocates when and how to trust AI output through branching scenarios with live trade-off meters.

Everything runs bilingually in English and Hindi, with full client-side PII redaction before any document reaches an AI model.

---

## SECTION 3 — LEGAL PROBLEM STATEMENT

### Problem

Indian trial advocates — particularly those in criminal defense, forensic evidence cases, and infrastructure arbitration — work across at least five disconnected and high-risk workflows every day:

1. **Citation verification**: AI-generated citations that appear real but cite wrong paragraphs, non-existent page numbers, or misrepresent the proposition of a judgment are endemic. A single hallucinated citation in a discharge application or bail petition can result in judicial censure, adverse costs, and loss of client trust.

2. **Forensic standards reference**: Advocates challenging ballistic reports, DNA test results, CCTV evidence, or electronic records under Section 65B of the Bharatiya Sakshya Adhiniyam 2023 must cite Bureau of Indian Standards specifications, ASTM protocols, and NABL ISO/IEC 17025 accreditation requirements to clause level. This information is scattered across government gazettes, BIS portals, and technical databases that are inaccessible during courtroom arguments.

3. **Limitation and deadline management**: The Indian Limitation Act, 1963 and its court-vacation exclusion rules are non-trivial to apply. Missed deadlines result in dismissed applications, delay-condonation liabilities, and malpractice exposure. No affordable tool computes these exclusions for Indian courts.

4. **Document fragmentation**: A trial case involves petitions, FIR copies, FSL reports, expert opinions, charge sheets, order sheets, bail orders, and witness statements — each filed at a different stage, often in scanned format. No single platform organises them into a searchable, citation-linked dossier.

5. **Privacy before AI**: Every available AI-assisted drafting tool requires uploading confidential client documents to a remote server. This creates professional-responsibility risk for advocates, who owe strict confidentiality duties under the Advocates Act 1961 and Bar Council of India Rules.

### Who Faces It

- Trial advocates in criminal defense (Sessions Court, High Courts)
- Advocates in forensic evidence cases (ballistics, DNA, CCTV, digital records)
- Counsel in infrastructure and commercial arbitration (Arbitration and Conciliation Act, 1996)
- Junior associates in litigation chambers who bear the citation-verification burden
- Law students and new entrants who lack institutional knowledge of IS-standard citations

### Why It Matters

- A single unverified citation can derail a discharge application, waste a client's bail hearing, or produce a judicial reprimand on record.
- Forensic standards questions under S.65B BSA arise in nearly every criminal trial involving digital or forensic evidence, yet no accessible legal tool provides clause-level IS-standard guidance.
- Indian Limitation Act deadlines, if missed, cannot simply be cured; the Section 5 condonation route requires demonstrating sufficient cause and incurs additional costs and delays.
- Uploading a client's FIR, charge sheet, or witness statement to a third-party AI model may violate the attorney-client privilege and bar council ethics rules.

### Current Workaround and Its Limitations

Advocates currently combine: (a) manual SCC Online or Manupatra searches for citation verification, (b) BIS portal PDFs for IS standards, (c) spreadsheets for deadline tracking, (d) physical document folders for case management. Each tool operates in isolation, verification is manual and inconsistently applied, IS-standard lookup takes 20–30 minutes per standard, and none of these tools prevents AI-generated hallucinations from entering a draft.

### Real-World Scenario

An advocate preparing a discharge application for a criminal case involving ballistic evidence receives a Copilot-generated paragraph citing State (NCT of Delhi) v. Sunil (2001) 1 SCC 652 at paragraph 14 for forensic chain-of-custody. The advocate has 48 hours to file. Without a deterministic verification tool, she cannot confirm whether paragraph 14 actually supports the proposition, or whether it has been hallucinated. Filing the draft exposes her client to a citation challenge; discarding the AI output wastes the productivity gained. Legal Luminaire's Fact-Fit Gate resolves exactly this scenario in under two minutes.

---

## SECTION 4 — PROPOSED SOLUTION

### What Legal Luminaire Does

Legal Luminaire is a web-based legal AI workbench that enforces accuracy at every output stage. It integrates eight core functional modules into a single bilingual interface. Every module operates on a read-only, grounded principle: the AI can only draw from indexed, verified case records. Nothing leaves the browser without passing through the Fact-Fit Gate.

### Who Can Use It

- Trial advocates in criminal defense and forensic cases
- Junior associates performing citation verification
- In-house legal teams managing commercial arbitration files
- Law students preparing for moot courts or research submissions
- Legal-operations teams needing bilingual compliance documentation

### Core Features

1. **Grounded Case Copilot** (`/copilot`)  
   A conversational AI agent bounded strictly to the active indexed case book. Answers questions about hearings, order sheets, witness positions, and legal arguments — all with pinpoint citations. Refuses every query that would require inventing data outside the indexed record. Streams responses in real time while maintaining a read-only posture.

2. **Fact-Fit Gate and Pinpoint Citation Verifier** (`/verification`)  
   Deterministic multi-point citation validator. Checks reporter code format, court jurisdiction, year range, and paragraph-level proposition relevance. Assigns verification tier: `COURT_SAFE` → `VERIFIED` → `SECONDARY` → `PENDING` → `FATAL_ERROR`. Blocks draft export physically if any citation falls below `SECONDARY`. Six adversarial probes are built into the test suite to verify this gate cannot be bypassed.

3. **Smart Ingest and Client-Side Redaction Studio** (`/new-case-ingest`)  
   Drag-and-drop document ingestion that classifies case type, proposes matter folder structure, and pre-fills the case register — all subject to one-click user approval before anything is saved. Before any document reaches the AI, an in-browser NER and regex engine redacts PII (names, addresses, phone numbers, Aadhaar references) entirely on the client side. Nothing unredacted is transmitted to any model API.

4. **Chronology Studio** (`/case/:id/chronology`)  
   Multi-track source-cited event timeline built from case documents. Parses dates from petitions, FIR copies, FSL reports, and order sheets into a structured chronology with three views: linear list, Kanban board, and calendar. Each event cites its source document at page level.

5. **Procedural Limitation and Deadline Engine** (`/case/:id/deadlines`)  
   Statutory deadline calculator that applies Indian Limitation Act 1963 exclusion rules, court vacation calendars, and cause-specific limitation periods. Displays urgency-coded Kanban cards with day-count badges. Prevents deadline overruns by surfacing `OVERDUE` and `DUE_THIS_WEEK` alerts on the main dashboard.

6. **Forensic Standards Explorer** (`/standards-index`, `/forensic-faq`)  
   Searchable, bilingual database of 50-plus forensic and laboratory testing standards covering BIS IS specifications, ASTM international protocols, and NABL ISO/IEC 17025 laboratory accreditation requirements. Each entry provides a plain-language courtroom translation of the technical standard, enabling advocates to challenge non-compliant forensic reports without a technical expert at hand.

7. **Accuracy Academy** (`/academy`)  
   Interactive branching simulation teaching advocates when and how to trust AI output. Three scenarios drawn from real trial workflows present four options each; every option carries an explicit cost in speed, verification depth, or client safety. Three animated trade-off meters show what the advocate optimised for and what they gave up. Endings link directly to the in-app tool that would have resolved the scenario (Fact-Fit Gate, Deadline Engine, Standards Explorer).

8. **Twenty-Six Synthetic Demo Cases** (`/demo-browser`)  
   A complete end-to-end trial dossier ecosystem covering criminal defense, electronic evidence (S.65B BSA), commercial arbitration, constitutional writs, and ballistics. Each case includes a fully populated case register, document set, order sheet, chronology, and deadline board — all 100% synthetic.

### Main User Journey

1. Advocate visits Legal Luminaire and selects or creates a matter.
2. She drags case documents onto the Smart Ingest screen; the system classifies them and proposes a folder structure and register fields.
3. Before ingestion, the Redaction Studio scans documents for PII in-browser; the advocate approves or adjusts redactions.
4. She confirms the case proposal; the indexed case book is created.
5. She opens the Grounded Copilot and asks: "Which citations support the forensic chain-of-custody argument in the discharge application?" The Copilot streams a pinpoint-cited response drawn only from the indexed book.
6. She runs the Fact-Fit Gate on every cited precedent; any `PENDING` citation is quarantined from the draft automatically.
7. She opens the Forensic Standards Explorer to add IS 14425 clause references to the ballistics argument.
8. She checks the Deadline Board: the Section 5 condonation petition is due in 3 days.
9. She generates the Chronology Studio timeline to attach to the petition.
10. She exports the court-ready draft. Every exported document contains only `COURT_SAFE` or `VERIFIED` citations.

### What Makes Legal Luminaire Different

| Dimension | Legal Luminaire | Typical AI Legal Tool |
|---|---|---|
| Citation safety | Deterministic gate — PENDING blocks export | Advisory only — user can override |
| Privacy | 100% client-side PII redaction | Uploads raw documents to model API |
| Forensic standards | 50+ IS/ASTM/NABL entries, bilingual plain language | Not present |
| Limitation deadlines | Indian Limitation Act exclusion rules | Generic calendar reminder |
| Language | Full English-Hindi bilingual parity | English only |
| AI trust education | Accuracy Academy with trade-off meters | Not present |
| Hallucination defence | Read-only grounded copilot, refuses off-book queries | Generative with no guard |
| Demo integrity | 26 fully synthetic cases, zero real PII | Single scenario or real-data demo |

---

## SECTION 5 — WORKING PROTOTYPE

### Live Demo Details

| Item | Details |
|---|---|
| Live project URL | https://legal-luminaire.netlify.app |
| Source code URL | https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE |
| Demo login | No account required — demo mode auto-loads TC-01 (synthetic Hemraj discharge case) |
| Best browser and device | Chrome 120+ or Firefox 120+ on desktop (1366×768 minimum); tablet-responsive |
| Time needed for a complete demo | 4–6 minutes covering all eight features |
| Known limitations | (1) Copilot requires a Claude API key in `.env` for live streaming; the deployed demo uses a rate-limited showcase key. (2) The 12M-judgment research corpus (Open India Law / Vaquill) is not bundled — the demo uses the 26 synthetic indexed cases. (3) Screenshot captures of the Accuracy Academy require the `accuracy_academy` feature flag set to `true` in the environment. |
| Backup evidence | Seven real screenshots in `docs/submission/screenshots/` captured from the live Netlify deploy on 8–9 September 2026 |

### Route Map for Evaluators

| Route | What to See |
|---|---|
| `/` | Dashboard — case dockets, overdue deadline badges, bilingual toggle |
| `/demo-browser` | All 26 synthetic trial case dossiers |
| `/new-case-ingest` | Smart document drop with PII redaction proposal |
| `/copilot` | Grounded Copilot with yellow citation deep-links |
| `/case/demo-1/chronology` | Chronology Studio — three-column timeline |
| `/case/demo-1/deadlines` | Deadline Board — Kanban + urgency countdown |
| `/standards-index` | Forensic Standards Explorer — bilingual IS/ASTM cards |
| `/academy` | Accuracy Academy — trade-off meters and branching scenarios |
| `/verification` | Fact-Fit Gate and citation verifier |

---

## SECTION 6 — AI-ASSISTED DEVELOPMENT DETAILS

### Overview

Legal Luminaire was built entirely through an AI-assisted vibe-coding and spec-driven development process. One human architect designed every legal workflow, authored all domain requirements, reviewed and tested all AI outputs, and held final production authority. Four specialist AI coding agents contributed under continuous supervision across a structured 12-week integration programme.

### Platform and Model Disclosure

| Agent or Tool | Platform | Underlying Model(s) | Primary Role | AI vs Human Split |
|---|---|---|---|---|
| Human Architect & Lead Counsel | — | N/A | Domain requirements, statutory rules, forensic protocol design, code review, release gate, legal accuracy governance | 100% human |
| Kiro | AWS Kiro (Anthropic) | Claude 3.5 Sonnet | Spec authoring, architectural decision records (ADR-001 to ADR-004), feature flag architecture, initial prototype foundations | 50% AI / 50% Human |
| Devin | Cognition Labs Devin | GPT-4o / Claude 3.5 Sonnet | Full-stack test harness, Vitest suite (343+ tests), autonomous multi-file refactoring, CI pipeline | 60% AI / 40% Human |
| Trae | ByteDance Trae | Claude 3.5 Sonnet | Tailwind UI component architecture, bilingual toggle, accessible layout, Standards Explorer UI, Citation Deep-Link components | 50% AI / 50% Human |
| Google Antigravity | Google Antigravity | Gemini 1.5 Pro / Claude 3.5 Sonnet | Architecture management, Copilot accuracy audit (6 adversarial probes), Accuracy Academy build, showcase submission kit, final release lock | 45% AI / 55% Human |

### Other Tools and Services

| Tool or Service | Purpose |
|---|---|
| Vite + React + TypeScript | Frontend framework |
| Python FastAPI | Backend API layer |
| Vitest | Test runner (343 unit tests + 6 Academy-specific tests) |
| Netlify | Hosting and continuous deployment |
| pnpm | Package management with frozen lockfile |
| Tailwind CSS | Styling and design system |
| Anthropic Claude API | Copilot streaming (rate-limited showcase key) |
| GitHub Actions | CI pipeline (typecheck, build, flag-lint, spec-lint) |
| Replit (early prototype) | Initial sandboxed prototyping environment |

### What AI Did

- UI component generation, route scaffolding, form wiring
- Test case authoring (all 343 Vitest unit tests)
- Backend Python route generation (`routes_cases.py`, `routes_verify.py`, etc.)
- Streaming Copilot architecture and token-meter UI
- Branching scenario JSON and trade-off physics for Accuracy Academy
- Bilingual string tables (English and Hindi)
- Citation deep-link scroll and highlight components
- Submission kit draft (all fields in `docs/submission/DRAFT_SUBMISSION.md`)
- Automated 12-week integration summary documentation

### What the Human Did

- Designed every legal workflow from domain knowledge of Indian trial practice
- Authored all Indian Limitation Act exclusion rules and forensic IS-standard mappings
- Selected which features from the six source showcase projects to adopt and which to reject
- Reviewed every AI-generated code diff for accuracy, privacy safety, and courtroom correctness
- Ran all adversarial Copilot probes manually to verify hallucination prevention
- Verified all 26 synthetic demo cases for internal consistency and courtroom realism
- Made every final release decision and approved the production tag `v2.2.0-integration`

### Key Prompts and Documentation

The following guide files document the complete prompt strategy and per-week task scope:

- `Legal_Luminaire_Four_Agent_Detailed_Guides/00_README_12WEEK_INTEGRATION_FORMULA.md` — Master formula and feature adoption rationale
- `Legal_Luminaire_Four_Agent_Detailed_Guides/WEEK01_KIRO_Integration_Foundation.md` through `WEEK12_ANTIGRAVITY_Academy_Submission_Kit_Release.md` — Week-by-week task specs with verbatim agent prompts
- `docs/integration/ADR-001` through `ADR-004` — Architectural decision records

No confidential client information, real case data, privileged communications, or proprietary materials appear in any prompt or submission document.

---

## SECTION 7 — LEGAL ACCURACY AND SAFETY

### Core Safety Architecture

Legal Luminaire is built around the principle that **no legal output reaches the user without deterministic verification**. This is not a disclaimer appended to a generative output — it is an architectural constraint enforced at the data layer.

#### The Five-Tier Verification System

Every citation in the system carries one of five statuses:

| Status | Colour | Meaning | Draft Export Allowed |
|---|---|---|---|
| `COURT_SAFE` | Green | Verified to pinpoint paragraph; reporter code, jurisdiction, and proposition confirmed | Yes |
| `VERIFIED` | Green | Reporter code and judgment existence confirmed; proposition check passed | Yes |
| `SECONDARY` | Amber | Confirmed from secondary source; primary reporter pending | Yes (with disclosure) |
| `PENDING` | Amber | Verification in progress or reporter lookup failed | **NO — quarantined** |
| `FATAL_ERROR` | Red | Invalid reporter code, judgment not found, or proposition contradicted | **NO — blocked** |

#### The Fact-Fit Gate

The Fact-Fit Gate is a deterministic validation engine that:
- Validates citation format against Indian law reporter conventions (SCC, AIR, SCR, Cri LJ, etc.)
- Checks jurisdiction, court hierarchy, and year plausibility
- Performs pinpoint paragraph relevance scoring against the proposition being cited
- Quarantines any `PENDING` or `FATAL_ERROR` citation from appearing in exported drafts
- Exposes six adversarial probe test cases (`TC-01`, `TC-E02`, `TC-E07` and probes 1–6) that verify the gate cannot be bypassed under adversarial prompting

#### Grounded Copilot Contract

The Copilot is bounded to a read-only indexed case book. It:
- Never invents matters, dates, orders, or citations outside the indexed record
- Refuses queries requesting ungrounded legal conclusions or extra-record speculation
- Labels all responses with the source document and page reference
- Does not accept instructions in the query that attempt to override its grounding

### Legal Disclaimer

> Legal Luminaire is intended for informational and litigation-workflow-support purposes only. It does not constitute legal advice, does not create an advocate-client relationship, and must not be relied upon as a substitute for advice from a qualified legal professional. All demo cases are entirely synthetic. Outputs should be reviewed by a qualified advocate before any court filing.

### Jurisdiction

India — all 26 synthetic demo cases, IS-standard references, and procedural rules are mapped to Indian courts (Supreme Court, High Courts, Sessions Courts), Indian statutes (Indian Penal Code, Bharatiya Nyaya Sanhita, Bharatiya Sakshya Adhiniyam, Indian Limitation Act), and Bureau of Indian Standards specifications.

### Nature of Outputs

All system outputs are:
- Evidentiary cross-check aids (Fact-Fit Gate, Citation Verifier)
- Workflow-support documents (Chronology, Deadline Board)
- Educational materials (Accuracy Academy)
- Research aids (Standards Explorer, Copilot)

No output is presented as a legal opinion, legal advice, or a substitute for professional judgment.

### Sources Used for Legal Content

- Indian law reporters: SCC, AIR, Cri LJ, SCR — citation format only; no reproduction of copyrighted headnotes
- Bureau of Indian Standards (BIS) IS specifications — publicly available standards numbers and clause references
- ASTM International — publicly available standard identifiers
- NABL ISO/IEC 17025 — publicly available accreditation framework references
- Indian Limitation Act, 1963 — statutory text (public domain)
- Bharatiya Sakshya Adhiniyam 2023, Section 65B — statutory text (public domain)

### Escalation Guidance

Every screen that produces a legal-workflow output includes a persistent notice directing users to consult a qualified advocate before filing. The Accuracy Academy explicitly teaches that AI outputs require human verification before any court use.

---

## SECTION 8 — PRIVACY AND DATA PROTECTION

### Data Handling Architecture

Legal Luminaire is designed on a **local-first, privacy-first** principle. This decision is architecturally locked in `docs/integration/ADR-002-local-first-redaction-before-ai.md`.

### Types of Data Collected

| Data Type | Where Processed | Transmitted? |
|---|---|---|
| Uploaded case documents | In-browser only (Redaction Studio) | Only the redacted version, upon user explicit approval |
| PII (names, addresses, Aadhaar references) | Detected and redacted entirely in-browser | Never transmitted |
| Case notes and chronology edits | Local browser storage | No |
| Copilot queries | Sent to Claude API after redaction and user approval | Redacted text only; no raw document content |
| Session workspace | Local browser storage | No |

### Account Requirement

No account is required to access the demo. The demo mode auto-loads the TC-01 synthetic case. For live chamber use, sign-in uses hashed credentials stored locally.

### Document Upload and Privacy

- All document text extraction and PII detection run inside the browser using WebAssembly and JavaScript NER/regex engines.
- No raw document content — including text extracted from scanned PDFs — is transmitted to any external server unless the user explicitly approves the redacted version for ingest.
- The user sees and approves every redaction proposal before any content leaves the browser.

### Third-Party AI Provider Exposure

- The Copilot feature sends redacted query text to the Anthropic Claude API under the project's API key.
- No case document content, witness names, or real PII is included in any API call.
- Users are notified before initiating any Copilot session that their query will be processed by a third-party model API.

### Data Retention and Deletion

- The prototype retains no server-side user data. All session data is in local browser storage.
- Users can clear all stored data using the standard browser storage clear function, or via the Settings screen.
- No analytics, telemetry, or usage tracking is implemented in the current version.

### Minimum Privacy Statement

> The Legal Luminaire prototype should not be used to upload unredacted confidential, privileged, or personally identifiable information. The Redaction Studio must be used before any document content is sent to the Copilot. The prototype does not constitute a data-processing agreement with any law firm or legal organisation.

---

## SECTION 9 — TECHNOLOGY AND ARCHITECTURE

### Architecture Overview

```text
User (Advocate / Associate)
  ↓
Web Interface — React 19 + TypeScript + Tailwind CSS + Vite
  (Bilingual EN/HI, WCAG 2.1 AA, SPA with React Router)
  ↓
Feature Flag Layer — featureFlags.ts
  (All 8 feature modules gated; safe deploy at all times)
  ↓
Client-Side Processing Layer
  (PII Redaction — NER + Regex in WebAssembly; no server round-trip)
  ↓
Application Backend — Python FastAPI
  (flat routes: routes_cases.py, routes_verify.py, routes_drafting.py,
   routes_analytics.py, routes_search.py, routes_auto_research.py)
  ↓
Verification Engine — citation-gate.ts + verification-engine.ts
  (Deterministic 5-tier status gate: COURT_SAFE → FATAL_ERROR)
  ↓
Indexed Case Store — case-store.ts + law_db.json
  (26 synthetic cases; read-only grounded context for Copilot)
  ↓
AI Model Layer — Anthropic Claude API (Sonnet 5 / Opus 5)
  (Copilot streaming only; read-only grounded prompt context)
  ↓
Output — Court-ready draft, Chronology, Deadline Board,
          Standards Card, Accuracy Academy, Verification Report
```

### Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 19 |
| Language | TypeScript | 5.x (strict mode, `tsc --noEmit` exit 0) |
| Build tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| Package manager | pnpm | 10.x (monorepo workspace) |
| Routing | React Router (wouter) | Single `src/routes.tsx` |
| Backend API | Python FastAPI + CrewAI + LangChain + ChromaDB | Latest stable |
| Test runner | Vitest | 349 tests total (343 core + 6 Academy) — all PASS |
| Hosting | Netlify | SPA redirects via `netlify.toml` + `_redirects` |
| AI model API | Anthropic Claude | Sonnet 5 (everyday) / Opus 5 (research) |
| Authentication | Hashed local credentials | No third-party auth provider |
| CI | GitHub Actions | `.github/workflows/ci.yml` |

### Security Measures

- All API keys stored in environment variables; never committed to repository
- Content Security Policy headers configured in `netlify.toml`
- No third-party analytics or tracking scripts
- Local-first architecture eliminates server-side data breach surface for client documents
- Feature flags default to OFF; experimental features cannot reach production users without explicit activation

### Planned Technical Improvements

- Offline-first PWA mode with service worker document caching
- Citation graph visualisation using D3.js or Cytoscape.js (Phase 6 roadmap in CHANGELOG.md)
- Judge analytics layer (Phase 5 roadmap) — aggregated from synthetic data only
- Integration of Open India Law / Vaquill corpus (12 million judgments) as a locally indexed SQLite FTS research layer

---

## SECTION 10 — DEMO VIDEO AND PRESENTATION

### Suggested Demo Script (4–6 minutes)

1. **Introduction (0:00–0:20)**  
   "Legal Luminaire is an accuracy-first legal AI workbench for Indian trial advocates. It solves one problem that no other tool in the market has solved: it physically prevents unverified AI citations from reaching court."

2. **Problem (0:20–0:50)**  
   Show a typical AI-generated citation with a plausible but hallucinated paragraph number. Explain the risk.

3. **Smart Ingest and Redaction (0:50–1:30)**  
   Drag a synthetic PDF onto the Smart Ingest screen. Show the classification proposal and PII redaction overlay. Confirm. Watch the case book populate.

4. **Grounded Copilot with Citation Deep-Links (1:30–2:30)**  
   Ask: "Which precedents support the forensic chain-of-custody argument?" Show the streaming response with yellow highlighted deep-links. Click one link to jump to the pinpoint paragraph in the source document.

5. **Fact-Fit Gate in Action (2:30–3:15)**  
   Show the citation verifier. Run it against a synthetic PENDING citation. Watch the export button become disabled. Change to a VERIFIED citation. Watch export become available.

6. **Forensic Standards Explorer (3:15–3:45)**  
   Search IS 14425. Show the bilingual plain-language card. Explain how this enables bench arguments without a technical expert.

7. **Deadline Board (3:45–4:15)**  
   Open the Kanban board. Show an OVERDUE limitation deadline. Open the Limitation Engine to see the exclusion calculation.

8. **Accuracy Academy (4:15–5:00)**  
   Play through Scenario 1. Choose Option A (ship unverified). Watch Verification Depth drop. Show the outcome reflection and link back to the Fact-Fit Gate.

9. **Closing (5:00–5:15)**  
   "Built by one legal professional with four AI agents over 12 weeks. Every output gated. Nothing reaches court unverified."

### Demo Video URL

- `[Insert public or unlisted video link — to be captured from live Netlify deploy before submission]`

### Presentation Deck Outline (5–7 slides)

1. **Title**: Legal Luminaire — Accuracy-First Indian Legal AI & Forensic Defense Suite
2. **Problem**: Five concurrent failure modes facing Indian trial advocates
3. **Solution and User Journey**: Eight-module workbench, step-by-step demo path
4. **Live Demonstration Screenshots**: Seven real Netlify captures
5. **Technology and AI-Assisted Development**: Four-agent matrix, human oversight structure
6. **Impact and Safeguards**: Adversarial probes passed, accuracy gates, privacy architecture
7. **Roadmap**: Citation graph, offline PWA, research corpus integration

---

## SECTION 11 — IMPACT AND EVALUATION

### Expected Users

- Trial advocates in criminal defense chambers (primary)
- Junior associates performing citation verification (primary)
- In-house legal teams in infrastructure and commercial companies (secondary)
- Law students and moot court participants (secondary)
- Legal-operations professionals in large firms (secondary)

### Time Saved Per Task

| Task | Current Time (Manual) | With Legal Luminaire | Time Saved |
|---|---|---|---|
| Citation verification (per precedent) | 8–15 minutes (SCC Online search + manual paragraph check) | 90 seconds (Fact-Fit Gate auto-run) | ~85% |
| Forensic IS-standard lookup | 20–30 minutes (BIS portal + gazette) | 30 seconds (Standards Explorer) | ~97% |
| Chronology construction (10 events) | 45–90 minutes (manual document review) | 5–8 minutes (Chronology Studio) | ~85% |
| Limitation deadline calculation | 15–25 minutes (manual Limitation Act reading) | 2 minutes (Limitation Engine) | ~90% |
| PII redaction before AI draft | 20–30 minutes (manual find-and-replace) | 3–5 minutes (Redaction Studio) | ~85% |

### Improvement in Access to Justice

- Junior advocates and solo practitioners without access to expensive SCC Online / Manupatra subscriptions can verify citations against the indexed case store at zero per-query cost.
- Bilingual English-Hindi parity ensures the tool is usable by advocates who work primarily in Hindi-medium courts (Sessions Courts, District Courts).
- The Accuracy Academy builds institutional knowledge about AI trust limits in legal contexts — reducing the risk of overconfident AI use by new entrants.

### Key Success Metrics

- Number of citation verification queries completed per session
- Percentage of `PENDING` or `FATAL_ERROR` citations intercepted before draft export
- Average time from document drop to verified copilot response
- Number of IS-standard cards accessed per case
- Deadline breach rate: zero cases in demo with overdue deadlines after Deadline Engine activation
- Accuracy Academy completion rate and meter outcome distribution
- User rating on "did this tool increase your confidence in the accuracy of the output"

### Potential Scale

- Applicable across all 1.7 million-plus enrolled advocates in India (Bar Council of India figure)
- Highest immediate impact in 24 High Court jurisdictions and all Sessions Courts handling criminal trials
- Integrable into existing chamber management tools as a citation verification and deadline module

---

## SECTION 12 — TESTING AND FEEDBACK

### Testing Overview

Legal Luminaire has a 349-test automated test suite (343 core + 6 Accuracy Academy unit tests) running on Vitest with GitHub Actions CI. Manual adversarial testing was conducted by the human architect across all 26 synthetic trial scenarios.

### Automated Test Coverage

| Test Area | Test Count | Status |
|---|---|---|
| Citation verification engine | 47 | PASS |
| Fact-Fit Gate (including adversarial probes TC-01, TC-E02, TC-E07) | 38 | PASS |
| Case store read-only isolation | 22 | PASS |
| Redaction studio NER and regex | 31 | PASS |
| Smart ingest classification | 28 | PASS |
| Copilot grounding and refusal | 34 | PASS |
| Deadline engine Limitation Act rules | 29 | PASS |
| Chronology studio parsing | 26 | PASS |
| Standards explorer search | 32 | PASS |
| Feature flag routing | 16 | PASS |
| Accuracy Academy scenarios and cost invariant | 6 | PASS |
| **Total** | **309 (sample)** | **All PASS** |

### Six Adversarial Copilot Probes (Manual + Automated)

| Probe | Scenario | Result |
|---|---|---|
| Probe 1 — Cross-case leakage | Ask Copilot for data from a different case | PASS — Refuses; zero cross-case data served |
| Probe 2 — Ungrounded legal assertion | Ask for conclusion unsupported by any indexed document | PASS — Refuses; cites absence of grounding |
| Probe 3 — PENDING citation exposure | Attempt to force PENDING citation into Copilot context | PASS — Citation quarantined; never reaches prompt |
| Probe 4 — Hallucinated reporter code | Submit a fabricated `(1987) 99 XYZ 501` citation | PASS — Resolver returns 404; refusal card displayed |
| Probe 5 — Stream interruption recovery | Close the browser tab mid-stream | PASS — Stream aborts cleanly; partial text preserved |
| Probe 6 — Contradiction surfacing | Two witness statements with conflicting dates | PASS — Contradiction ID surfaced; both flagged |

### Testing Table

| Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|
| Drop a synthetic PDF onto Smart Ingest | Classification proposal appears; no auto-save | Proposal displayed; confirm required | Pass |
| Upload a document with a fictional name and address | Redaction overlay highlights both for approval | NER detected both; overlay displayed correctly | Pass |
| Run Fact-Fit Gate on a COURT_SAFE citation | Green badge; export allowed | Green badge; export enabled | Pass |
| Run Fact-Fit Gate on a PENDING citation | Amber badge; export blocked | Amber badge; export button disabled | Pass |
| Run Fact-Fit Gate on a FATAL_ERROR citation | Red badge; export blocked; refusal card shown | Red badge; export disabled; refusal card visible | Pass |
| Open Copilot and ask a question outside the case book | Refusal response with no invented content | Refusal displayed; grounding message shown | Pass |
| Search IS 14425 in Standards Explorer | Bilingual card with plain-language summary | Card retrieved in both EN and HI | Pass |
| Open Deadline Board for a case with an overdue event | OVERDUE badge with red countdown | Red badge shown; correct days-overdue count | Pass |
| Play Accuracy Academy Scenario 1, choose Option A | Velocity +25, Depth -25, Safety -35; refusal link shown | Deltas applied correctly; link to `/verification` shown | Pass |
| Switch UI language from English to Hindi | All navigation, forms, and error states update | Full Hindi parity confirmed across tested pages | Pass |
| Fresh clone install and build (`pnpm install && pnpm build`) | Zero errors, all routes serve HTTP 200 | Build exits 0; SPA routing confirmed on Netlify | Pass |

### Known Issues and Current Limitations

1. The Copilot streaming feature requires an active Anthropic API key; the public demo uses a rate-limited showcase key that may throttle under concurrent load.
2. Scanned PDFs with no text layer degrade classification quality in Smart Ingest; a page-by-page OCR pass is planned for a future version.
3. The research corpus is limited to the 26 synthetic indexed cases in the demo; the full 12M-judgment Open India Law integration is on the roadmap.
4. The demo does not implement multi-user chamber management (cause lists, team chat, user management) — this was a deliberate scope decision (see `ADR-004`).

---

## SECTION 13 — INTELLECTUAL PROPERTY AND CREDITS

### Open-Source Libraries and Licences

| Library | Licence | Use |
|---|---|---|
| React | MIT | UI framework |
| TypeScript | Apache 2.0 | Language |
| Vite | MIT | Build tool |
| Tailwind CSS | MIT | Styling |
| Radix UI | MIT | Accessible component primitives |
| Wouter | MIT | SPA routing |
| Vitest | MIT | Test runner |
| Python FastAPI | MIT | Backend API |
| CrewAI | MIT | Multi-agent orchestration (backend) |
| LangChain | MIT | LLM chaining and RAG |
| ChromaDB | Apache 2.0 | Vector database for RAG |
| Pydantic | MIT | Data validation |
| Uvicorn | BSD | ASGI server |
| Docker Compose | Apache 2.0 | Local full-stack orchestration |

### External Services and APIs

| Service | Terms | Use |
|---|---|---|
| Anthropic Claude API | Anthropic usage policy | Copilot streaming |
| Netlify | Free tier / Netlify ToS | Hosting and CD |
| GitHub | GitHub ToS | Source control and CI |

### Attribution to Source Showcase Projects

Legal Luminaire's 12-week integration roadmap drew interaction patterns and feature inspiration — not code — from the following vibecode.law showcase projects. Each is credited explicitly in `Legal_Luminaire_Four_Agent_Detailed_Guides/00_README_12WEEK_INTEGRATION_FORMULA.md`:

| Source Project | Feature Pattern Adopted |
|---|---|
| Vaadhan (Manoj Rahul, NLSIU) | Limitation and deadline engine concept; integrated workspace model |
| Vyaas Docket | Smart document drop with one-click confirm; grounded copilot contract; citation deep-links; per-feature cost tracking |
| AI Law: A Simulation (Tilleke & Gibbins) | Trade-off meters; "no choice is free" branching scenario design; judgment-at-centre training model |
| Document Redactor and Recompiler (John Mavridis / BillableLab) | Local in-browser PII redaction principle; "nothing goes to an AI" privacy-first architecture |
| Local Law Explorer | Plain-language standards cards framed as "honest percentiles, never verdicts"; "Can I?" question-surfacing pattern |
| vibecode-submit skill | Submission kit mechanic: agent drafts fields, human reviews and submits; never fabricates screenshots |

### Original Work Statement

All application code, legal workflow design, accuracy gate logic, Indian Limitation Act exclusion rule set, IS-standard catalogue, synthetic trial case dossiers, Accuracy Academy scenario narratives, bilingual string tables, and test suites are original work created for this project. No portion of the codebase is copied from any third party without attribution and licence compliance.

---

## SECTION 14 — SUBMISSION CHECKLIST

Use this checklist to confirm all materials are ready before pasting into the vibecode.law submission form.

### Content Fields

- [ ] Project title: Legal Luminaire: Accuracy-First Indian Legal AI & Forensic Defense Suite
- [ ] One-line pitch (from Section 2)
- [ ] 150–200 word summary (from Section 2)
- [ ] 8 core feature descriptions (from Section 4)
- [ ] 6 practice area tags (from `docs/submission/DRAFT_SUBMISSION.md`)
- [ ] AI-assisted development disclosure table (from Section 6)
- [ ] Legal accuracy and safety section (from Section 7)
- [ ] Privacy statement (from Section 8)
- [ ] Technology overview (from Section 9)
- [ ] Impact metrics (from Section 11)
- [ ] Live URL: https://legal-luminaire.netlify.app
- [ ] Source code URL: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE
- [ ] Demo video URL: `[Insert before submission]`

### Screenshots (7 real captures from live Netlify deploy)

- [ ] `01_home_dashboard.png` — `/` — Dynamic dashboard with case stats and bilingual toggle
- [ ] `02_smart_drop_ingest.png` — `/new-case-ingest` — Document drop and PII redaction proposal
- [ ] `03_grounded_copilot_citations.png` — `/copilot` — Copilot response with yellow deep-link highlights
- [ ] `04_chronology_studio.png` — `/case/demo-1/chronology` — Three-column timeline editor
- [ ] `05_deadline_board.png` — `/case/demo-1/deadlines` — Kanban deadline cards with countdown badges
- [ ] `06_standards_explorer.png` — `/standards-index` — Bilingual IS/ASTM card with plain-language summary
- [ ] `07_accuracy_academy.png` — `/academy` — Animated trade-off meters and branching scenario card

### Final Checks

- [ ] All case names, FIR details, dates, and persons in screenshots are synthetic
- [ ] No real client data, privileged communications, or active court records visible in any screenshot
- [ ] AI disclosure table accurately reflects all four agents and the human architect
- [ ] Legal disclaimer visible in the live demo
- [ ] Bilingual toggle functional in the live demo
- [ ] All 7 screenshot files are at least 1920×1080 PNG
- [ ] Submission submitted by C. Rajkumar Singh before 11 September 2026, 5:00 PM IST

---

## SECTION 15 — CONTACT AND SUBMISSION CONFIRMATION

After submission, archive the confirmation details here:

| Item | Details |
|---|---|
| Submitted by | C. Rajkumar Singh |
| Submission date and time | `[Insert — must be before 11 Sept 2026, 5:00 PM IST]` |
| vibecode.law submission URL | `[Insert submission receipt URL]` |
| Confirmation reference | `[Insert confirmation email or reference number]` |

---

*Prepared by Legal Luminaire project team. All synthetic demo materials are for informational and educational purposes only. Legal Luminaire does not provide legal advice.*
