# ⚖️ Legal Luminaire

### **The AI legal workbench that physically blocks unverified citations from reaching court.**

> Accuracy-first · Bilingual EN/HI · Local-first privacy · 26 synthetic trial cases · 349 tests passing

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Netlify Status](https://img.shields.io/badge/demo-live%20on%20Netlify-00C7B7?logo=netlify)](https://legal-luminaire.netlify.app)
[![Tests](https://img.shields.io/badge/tests-349%20passing-brightgreen)](artifacts/legal-luminaire/src/__tests__)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm)](https://pnpm.io)
[![Vibeathon 2026](https://img.shields.io/badge/ILTN%20Vibeathon-2026-blue)](https://vibecode.law/showcase)

---

## ✨ What makes this brilliant?

Every AI legal tool on the market lets you generate citations and hopes you verify them later. **Legal Luminaire makes verification non-optional.** Its Fact-Fit Gate assigns one of five deterministic tiers to every citation — `COURT_SAFE`, `VERIFIED`, `SECONDARY`, `PENDING`, `FATAL_ERROR` — and **physically disables draft export** until every precedent passes. No override. No workaround.

Built for Indian trial advocates who face five broken workflows daily: AI hallucinations in pleadings, forensic standards buried in government gazettes, limitation deadlines miscalculated without court-vacation exclusions, client documents uploaded raw to model APIs, and no single tool that ties it all together. Legal Luminaire resolves all five — bilingually, locally, and with a full 349-test verification suite to prove it.

**If you prepare court filings, defend against forensic evidence, or manage limitation deadlines in Indian courts — this workbench was built for you.**

---

## 🚀 Key Features

- **🔒 Fact-Fit Gate** — Five-tier deterministic citation gate. `PENDING` or `FATAL_ERROR`? Export blocked. No exceptions. Six adversarial probes confirm this cannot be bypassed.
- **🤖 Grounded Copilot** — AI that reads only your indexed case book. Refuses to invent matters, dates, or orders. Yellow deep-link highlights jump to the exact source paragraph.
- **🛡 Client-Side PII Redaction** — NER + regex redaction runs entirely in your browser. Nothing unredacted ever reaches an AI model. (Architectural rule, not a setting.)
- **📅 Indian Limitation Act Engine** — Computes statutory deadlines with court-vacation exclusions. OVERDUE and DUE_THIS_WEEK alerts on the dashboard. No more missed Section 5 windows.
- **📋 Chronology Studio** — Drags dates out of FIRs, FSL reports, and order sheets into a source-cited timeline with list, Kanban, and calendar views.
- **🔬 Forensic Standards Explorer** — 50+ IS/ASTM/NABL standards in bilingual plain-language. Know exactly which IS clause the prosecution violated — without a technical expert in the room.
- **🎓 Accuracy Academy** — Interactive simulation with live trade-off meters (Verification Depth / Drafting Velocity / Client Safety). Teaches *when* to trust AI output. Every choice has a cost.
- **📁 26 Synthetic Demo Cases** — Complete trial dossiers across criminal defense, S.65B BSA electronic evidence, commercial arbitration, and ballistics. 100% synthetic. Zero real PII.
- **📚 50+ Sample Drafting Library** — Pre-built case templates, legal document templates, and test scenarios for quick case setup.
- **🌐 Full EN/HI Bilingual UI** — Every label, error state, and workflow available in English and Hindi.

---

## 📸 Demo / Screenshots

> **Live demo**: https://legal-luminaire.netlify.app — loads the synthetic Hemraj case instantly, no login required.

| Feature | Screenshot |
|---|---|
| Dashboard & case dockets | `docs/submission/screenshots/01_home_dashboard.png` |
| Smart Ingest + PII Redaction | `docs/submission/screenshots/02_smart_ingest_redaction.png` |
| Grounded Copilot with deep-links | `docs/submission/screenshots/03_grounded_copilot.png` |
| Chronology Studio | `docs/submission/screenshots/04_chronology_studio.png` |
| Deadline Board (OVERDUE) | `docs/submission/screenshots/05_deadline_board.png` |
| Forensic Standards Explorer | `docs/submission/screenshots/06_standards_explorer.png` |
| Accuracy Academy meters | `docs/submission/screenshots/07_accuracy_academy.png` |

> Screenshot files are real captures from the live Netlify deploy. To record a 30–60s demo GIF, open the live URL and use [LICEcap](https://www.cockos.com/licecap/) (Windows) or [Kap](https://getkap.co/) (macOS) while walking through routes `/copilot` → `/verification` → `/academy`.

---

## ⚡ Quick Start

**Under 90 seconds to a running demo.**

### Prerequisites
- Node.js 18+ (Node 22 recommended)
- Python 3.11+ *(optional — only needed for Copilot streaming and RAG backend)*
- pnpm 10+ (`npm install -g pnpm`)

### 1 — Clone and install

```powershell
git clone https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE.git
cd LEGAL_LUMINAIRE
pnpm install
```

### 2 — Start the frontend

```powershell
cd artifacts\legal-luminaire
pnpm dev
```

Open **http://localhost:5173/** — the demo case (synthetic Hemraj stadium collapse) loads automatically. All 26 demo cases are accessible with no API key.

### 3 — Start the backend *(optional — enables Copilot streaming and RAG)*

```powershell
cd artifacts\legal-luminaire\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env — set ANTHROPIC_API_KEY (and optionally OPENAI_API_KEY, TAVILY_API_KEY)
uvicorn main:app --reload
```

### Or run everything with Docker

```powershell
docker compose up --build
```

### Deploy to Netlify in one click

The root `netlify.toml` is pre-configured. Connect your fork in Netlify UI, leave Base Directory blank, and click Deploy. The build command and publish directory are auto-detected.

```
Publish directory: artifacts/legal-luminaire/dist/public
Node version:      22
pnpm version:      10
SPA routing:       /* → /index.html 200 (configured)
```

---

## 📖 How to Use

### Exploring the demo (no setup needed)

| Route | What you see |
|---|---|
| `/` | Dashboard — case dockets, OVERDUE badges, bilingual toggle |
| `/demo-browser` | All 26 synthetic trial case dossiers |
| `/new-case-ingest` | Smart document drop + PII redaction proposal |
| `/copilot` | Grounded Copilot — ask anything about the active case |
| `/verification` | Fact-Fit Gate — run citation probes |
| `/case/demo-1/chronology` | Chronology Studio — three-column timeline |
| `/case/demo-1/deadlines` | Deadline Board — Kanban + urgency countdown |
| `/standards-index` | Forensic Standards Explorer |
| `/academy` | Accuracy Academy — trade-off simulation |
| `/system/flags` | Hidden dev route — toggle all feature flags |

### Working with your own cases

1. **Drop your documents** onto `/new-case-ingest`. The system classifies them and proposes a folder structure.
2. The **Redaction Studio** highlights detected PII for your approval. Confirm before anything leaves the browser.
3. With the case book indexed, open the **Copilot** and ask questions in plain English or Hindi.
4. Run the **Fact-Fit Gate** on every Copilot citation before exporting any draft.
5. Use the **Deadline Board** to confirm your Limitation Act filing windows.
6. Add IS-standard arguments from the **Forensic Standards Explorer** if your case involves forensic evidence.
7. Export the draft — the gate enforces `COURT_SAFE` or `VERIFIED` status on all citations before the button activates.

### Folder naming convention for case documents

```
CASENO_PARTY1_PARTY2_YEAR
Example: CASE02_PITAMBARA_ROOPAM_2026
```

---

## 🔧 Configuration

All configuration is via environment variables in `artifacts/legal-luminaire/backend/.env` (copy from `.env.example`):

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | For Copilot | Claude Sonnet 5 / Opus 5 streaming |
| `OPENAI_API_KEY` | Optional | GPT-4o fallback for research engine |
| `TAVILY_API_KEY` | Optional | Web search grounding for research agent |

Frontend feature flags are set via Vite environment variables in `artifacts/legal-luminaire/.env`:

| Flag | Default | Feature |
|---|---|---|
| `VITE_FF_ENABLE_CHRONOLOGY_STUDIO` | `true` | Chronology Studio |
| `VITE_FF_ENABLE_DEADLINE_BOARD` | `true` | Deadline Board |
| `VITE_FF_ACCURACY_ACADEMY` | `true` | Accuracy Academy |
| `VITE_FF_ENABLE_CITATION_GRAPH` | `false` | Citation graph (Phase 3, roadmap) |
| `VITE_FF_ENABLE_JUDGE_ANALYTICS` | `false` | Judge analytics (Phase 5, roadmap) |

All experimental flags default to `false`. Toggling them in `/system/flags` (dev only) enables them locally without touching production.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript 5 (strict) + Vite + Tailwind CSS + Radix UI |
| Routing | Wouter — single `src/routes.tsx` with 55+ lazy-loaded routes |
| Backend | Python FastAPI + CrewAI + LangChain + ChromaDB (RAG) |
| AI model | Anthropic Claude API — Sonnet 5 (everyday) / Opus 5 (research) |
| Tests | Vitest — 349 tests (343 core + 6 Academy), all passing |
| CI | GitHub Actions — typecheck + build + flag-lint + spec-lint |
| Hosting | Netlify — SPA redirects, security headers, Node 22 |
| Monorepo | pnpm 10 workspace (`pnpm-workspace.yaml`) |
| Container | Docker Compose — full frontend + backend stack |

---

## 🗺 Roadmap

These features are architecturally planned, behind feature flags, and ready for contribution:

- [ ] **Citation Graph** — Interactive D3.js / Cytoscape.js visualisation of case citation networks (Phase 3 — `VITE_FF_ENABLE_CITATION_GRAPH`)
- [ ] **Case Similarity Engine** — 4-layer semantic + legal-issue + citation + court scoring (Phase 4 — `VITE_FF_ENABLE_CASE_SIMILARITY`)
- [ ] **Judge Analytics** — Decision pattern analysis, bail rates, conviction rates per judge (Phase 5 — `VITE_FF_ENABLE_JUDGE_ANALYTICS`)
- [ ] **Open India Law Corpus** — 12M+ judgment SQLite FTS index from Vaquill / CC BY 4.0, for local research without an API
- [ ] **Offline PWA** — Service worker cache so the workbench runs fully offline in court
- [ ] **Scanned PDF OCR** — Page-by-page transcription for documents with no text layer
- [ ] **Multi-user Chamber Mode** — Cause list, team chat, and user management for a full litigation chamber

Want to work on one of these? See [CONTRIBUTING.md](CONTRIBUTING.md) and open a discussion.

---

## 🤝 How to Contribute

Contributions are warmly welcome — legal domain expertise is as valuable as code here.

```powershell
# 1. Fork the repo and create your branch
git checkout -b feat/your-feature-name

# 2. Make your changes
# 3. Run the checks
pnpm run typecheck
pnpm --filter @workspace/legal-luminaire run build

# 4. Open a PR against main
```

Full guidelines → [CONTRIBUTING.md](CONTRIBUTING.md)

**Not a developer?** Open an issue using the [Legal Domain Request](/.github/ISSUE_TEMPLATE/legal-domain-request.md) template to request new case types, court formats, or IS-standard additions. That's a real and valued contribution.

---

## 📜 License

[MIT](LICENSE) — free to use, fork, and adapt. Attribution appreciated.

---

## ❤️ Shout-outs

Legal Luminaire drew interaction patterns and inspiration from six brilliant projects on [vibecode.law](https://vibecode.law/showcase):

| Project | What we adopted |
|---|---|
| [Vyaas Docket](https://vibecode.law/showcase/vyaas-docket-508140) | Smart document drop + grounded copilot contract + citation deep-links |
| [Vaadhan](https://vibecode.law/showcase/vaadhan-723173) | Integrated litigation workspace model + deadline engine concept |
| [AI Law: A Simulation](https://vibecode.law/showcase/ai-law-a-simulation-in-working-with-ai-495228) | Trade-off meters + "no choice is free" Accuracy Academy design |
| [Document Redactor](https://vibecode.law/showcase/document-redactor-and-recompiler-357726) | Local in-browser PII redaction — "nothing goes to an AI" |
| [Local Law Explorer](https://vibecode.law/showcase/local-law-explorer-812278) | Plain-language standards cards, honest non-verdict framing |
| [vibecode-submit](https://vibecode.law/showcase/skill-for-submitting-a-project-to-vibecodelaw-525107) | Submission kit mechanic — agent drafts, human submits, never fabricates |

Built over 12 weeks with [Kiro](https://kiro.dev) · [Devin](https://devin.ai) · [Trae](https://trae.ai) · Google Antigravity — four AI coding agents working under human architectural oversight.

---

## ⭐ Call to Action

**If Legal Luminaire saves you even one citation scare — star the repo and share it.**

```
"Stop researching. Start winning." — Legal Luminaire
```

[![Star on GitHub](https://img.shields.io/github/stars/CRAJKUMARSINGH/LEGAL_LUMINAIRE?style=social)](https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE)

Share on [LinkedIn](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE) · [X / Twitter](https://twitter.com/intent/tweet?text=Legal+Luminaire+%E2%80%94+accuracy-first+AI+legal+workbench+for+Indian+courts+that+physically+blocks+unverified+citations.+Open+source%3A+https%3A%2F%2Fgithub.com%2FCRAJKUMARSINGH%2FLEGAL_LUMINAIRE) · [Reddit r/legaltech](https://www.reddit.com/submit?url=https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE&title=Legal+Luminaire+%E2%80%94+open-source+AI+legal+workbench+for+Indian+courts)

---

> **Disclaimer**: All demo cases, persons, FIR details, and dates are entirely synthetic and do not represent any real legal matter, person, or proceeding. Legal Luminaire is a workflow-support tool — not a substitute for advice from a qualified advocate.
