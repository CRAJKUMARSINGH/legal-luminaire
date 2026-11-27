# ⚖️ Legal Luminaire

**Stop hallucinated citations before they reach a court file — accuracy-first AI research & drafting for Indian litigation.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-D8B36A.svg)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/CRAJKUMARSINGH/legal-luminaire/ci.yml?branch=main&label=CI)](https://github.com/CRAJKUMARSINGH/legal-luminaire/actions)
[![Tests](https://img.shields.io/badge/tests-Vitest%20%2B%20pytest-15803D)](https://github.com/CRAJKUMARSINGH/legal-luminaire/actions)
[![Made for Indian Courts](https://img.shields.io/badge/made%20for-Indian%20Courts-B8860B)](#-what-makes-this-brilliant)
[![Bilingual](https://img.shields.io/badge/UI-Hindi%20%2B%20English-6A0DAD)](#-key-features)
[![pnpm monorepo](https://img.shields.io/badge/monorepo-pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

---

## ✨ What Makes This Brilliant?

Legal Luminaire is not a generic chatbot bolted onto legal templates. It is a **citation-safe, bilingual, evidence-grounded** platform built for the specific demands of Indian litigation — and its rules come from courtroom experience, not marketing.

Consider the forensic standards guard. In real construction-defect defence, the prosecution often relies on **IS 1199:2018**, which governs sampling of **fresh concrete only**. For hardened masonry mortar, the correct authority is **IS 2250:1981** (with ASTM C1324 for hardened-mortar forensics). A tool that cannot tell the two apart will confidently draft a defence around the wrong standard. Legal Luminaire flags that exact misapplication and warns before filing.

> **That's not a feature. That's a weapon.**

**Non-negotiables.** These are enforced in code, not just documented:

- Every precedent carries a tier; `PENDING` and `FATAL_ERROR` citations are blocked from all draft output.
- Every draft ships with a verification report and a pre-filing checklist.
- Demo data is **synthetic** — never real client records.

> *"I built this because I needed it. Every accuracy rule in this app is a scar from a real case."* — the creator

**The 5-tier verification ladder:**

| Tier | Meaning | Draft behaviour |
|---|---|---|
| `COURT_SAFE` | Certified copy + paragraph number confirmed | Allowed |
| `VERIFIED` | Existence confirmed on an official source | Allowed |
| `SECONDARY` | Credible secondary source, pending primary check | Allowed with an explicit qualification note |
| `PENDING` | Unverified | **Blocked** from all output |
| `FATAL_ERROR` | Factually mismatched or fabricated | **Blocked** |

---

## 🚀 Key Features

- 🛡️ **Citation Safety Gate** — every draft is scanned in real time; `PENDING` citations are blocked from export automatically.
- 🪜 **5-tier verification engine** — `COURT_SAFE → VERIFIED → SECONDARY → PENDING → FATAL_ERROR`, with verbatim holdings and paragraph references.
- 🎯 **Fact-Fit Gate** — scores each precedent 0–100 across incident, evidence, and procedural-defect match; below 30 is auto-rejected.
- 🔬 **Forensic standards guard** — catches IS/ASTM misapplication (for example IS 1199:2018 vs IS 2250:1981) before a draft goes out.
- 🧭 **55+ routes** across Case Setup, Research, Drafting, and Review.
- 📁 **26 demo cases** — criminal, civil, and infrastructure-arbitration bundles (TC-01 … TC-26) plus intake examples.
- 🌐 **Bilingual by default** — Hindi and English side by side in the UI and in generated drafts.
- 🧱 **Four-step guided workflow** — Case Setup → Research → Drafting → Review.
- 📝 **Court-ready outputs** — drafts, a verification report, and a pre-filing checklist.
- 💻 **Local-first demo mode** — explore every case and the Citation Gate with **zero API keys**.
- 🗂️ **Multi-case system** — switch between 26 pre-loaded bundles; case context follows you across routes.
- 🎓 **Accuracy Academy** — a branching walkthrough that trains the citation standards themselves.
- 🕸️ **Research intelligence** — citation graph, case similarity, judge analytics, and cross-reference matrix.
- 🏗️ **Infrastructure arbitration modules** — LDR (liquidated-damages review) and LPS (lab/standards) packs for TC-22 … TC-26.
- ✅ **Tested and CI-locked** — Vitest frontend suite, pytest backend suite, production build, and a pinned launch gate on GitHub Actions.

---

## 📸 Demo / Screenshots

| | |
|---|---|
| ![Document ingest with PII redaction before AI processing](docs/submission/screenshots/02_smart_ingest_redaction.png) | ![Copilot answering from source-cited holdings](docs/submission/screenshots/03_grounded_copilot.png) |
| **Ingest with redaction** — Aadhaar, PAN, phone, email, passport and voter ID are masked before anything reaches a model | **Grounded copilot** — answers carry the tier of the authority they rest on |
| ![Chronology studio with sourced timeline entries](docs/submission/screenshots/04_chronology_studio.png) | ![Deadline board with computed CrPC dates](docs/submission/screenshots/05_deadline_board.png) |
| **Chronology studio** — every entry keeps its source document | **Deadline board** — §167, §173, §439, §468 computed without an LLM |
| ![Standards explorer showing clause text and validity status](docs/submission/screenshots/06_standards_explorer.png) | ![Accuracy academy citation-drill module](docs/submission/screenshots/07_accuracy_academy.png) |
| **Standards explorer** — IS/ASTM clause status, superseded clauses flagged | **Accuracy academy** — drills on the citation tiers before you draft |

**Recording tip:** a 20–40 second capture of the Citation Gate blocking a PENDING citation, then a draft export refusing it, is the strongest demo — stronger than any still.

---

## ⚡ Quick Start

**Prerequisites:** Node 22+, pnpm 10+, and Python 3.11–3.13 (only if you want the optional backend and AI features).

```bash
# Windows (PowerShell)

# 1. Clone
git clone https://github.com/CRAJKUMARSINGH/legal-luminaire.git
cd legal-luminaire

# 2. Install every workspace package
pnpm install --frozen-lockfile

# 3. Run the frontend (works with no backend, uses browser-local storage)
pnpm --filter @workspace/legal-luminaire run dev
# → http://localhost:5173
```

```bash
# macOS / Linux (bash)

# 1. Clone
git clone https://github.com/CRAJKUMARSINGH/legal-luminaire.git
cd legal-luminaire

# 2. Install every workspace package
pnpm install --frozen-lockfile

# 3. Run the frontend (works with no backend, uses browser-local storage)
pnpm --filter @workspace/legal-luminaire run dev
# → http://localhost:5173
```

Open `http://localhost:5173`, click **Demo Mode**, and pick a case. All 26 demo cases, the Citation Gate, the Verification Engine, and the Deadline Board work immediately — **no API keys required**.

### Full-stack (optional — needed for AI research & drafting)

```powershell
# Windows (PowerShell)

# 1. Configure the backend
Copy-Item artifacts/legal-luminaire/backend/.env.example artifacts/legal-luminaire/backend/.env
# Edit .env and add OPENAI_API_KEY and TAVILY_API_KEY

# 2. Create a virtual environment and install
cd artifacts/legal-luminaire/backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt

# 3. Start the backend
.venv\Scripts\python main.py
```

```bash
# macOS / Linux (bash)

# 1. Configure the backend
cp artifacts/legal-luminaire/backend/.env.example artifacts/legal-luminaire/backend/.env
# Edit .env and add OPENAI_API_KEY and TAVILY_API_KEY

# 2. Create a virtual environment and install
cd artifacts/legal-luminaire/backend
python -m venv .venv
.venv/bin/pip install -r requirements.txt

# 3. Start the backend
.venv/bin/python main.py
```

Then start the frontend in a second terminal with `pnpm --filter @workspace/legal-luminaire run dev`.

### One-command launch gate (optional)

Once the backend test dependencies and Ruff are installed, `pnpm launch:gate` runs Python lint, workspace typechecking, the synthetic seeder contract test, the Vitest suite (including the Fact-Fit Gate regressions), the production frontend build, and pytest. See [LAUNCH_HARDENING_REPORT.md](LAUNCH_HARDENING_REPORT.md) for the current baseline and release blockers.

---

## 📖 How to Use

### A. Run the Hemraj Stadium Collapse demo

1. Open `http://localhost:5173` and click **Demo Mode**.
2. Open **Demo Case Browser** and pick **TC-01 — Hemraj Stadium Collapse**.
3. Walk the four steps: **Case Setup → Research → Drafting → Review**.
4. Open the **Verification Panel** to inspect the 5-tier graded precedents.
5. Open **Safe Draft**, paste a sentence containing a `PENDING` citation, and watch the gate block export.

### B. Generate a discharge application

1. Open a case and go to **Drafting → Safe Draft** (or the **Discharge Application** page).
2. Write or paste your draft. The Citation Gate scans as you type.
3. Clear every blocked citation — the **Print A4** / finalise controls re-enable only when the draft clears the gate.
4. Print or export the draft; the verification report and pre-filing checklist are included.

### C. Use the citation verification gate and cross-reference matrix

1. Open **Cross-Reference Matrix** for the case to see every authority mapped to the facts.
2. Open **Verification Panel** to read the tier, holding, and source reference for each citation.
3. Use **Citation Search** to look up an authority and open its deep-linked source.
4. Export nothing until every `PENDING` / `FATAL_ERROR` entry is resolved.

### D. Switch between the 26 demo cases

1. Open **Demo Case Browser** (criminal/civil bundles) or **Infra Arbitration Browser** (TC-22 … TC-26).
2. Select a case — the case context is carried through every case-scoped route.
3. Cold-link guard: opening a deep link without a selected case redirects you safely instead of rendering blank.

**Seed a case into a local backend index (operator example):**

```bash
# Windows (PowerShell) / macOS / Linux (bash) — requires a running backend
pnpm --filter @workspace/scripts run seed-demo
```

The seeder uploads one labelled synthetic report into the `synthetic-construction-demo` case. It defaults to `http://127.0.0.1:8000`; set `LL_DEMO_API_KEY` if backend auth is enabled. The offline frontend demo does not need it.

---

## 🔧 Configuration / Options

| Variable | Purpose | Required |
|---|---|---|
| `OPENAI_API_KEY` | GPT agents + embeddings | For AI research/drafting |
| `TAVILY_API_KEY` | Live citation verification | For web verification |
| `GOOGLE_API_KEY` | Gemini omni-modal ingestion | Optional |
| `CORS_ORIGINS` | Allowed frontend origins | Production |
| `APP_ENV` | `development` or `production` | Deployment |
| `HALLUCINATION_THRESHOLD` | Block output above this ungrounded ratio | Optional (default 0.25) |

**Frontend feature flags** (all default **off**; override with `VITE_FF_*=true`):

| Flag | Area | Default |
|---|---|---|
| `VITE_FF_REDACTION_STUDIO` | Client-side PII redaction + recompile | off |
| `VITE_FF_SMART_DROP` | Document drop classification | off |
| `VITE_FF_ASK_COPILOT` | Grounded read-only case copilot | off |
| `VITE_FF_CITATION_DEEPLINK` | Every citation deep-links to source | off |
| `VITE_FF_DEADLINE_ENGINE` | Limitation/deadline engine | off |
| `VITE_FF_CHRONOLOGY_STUDIO` | Chronology list/board/calendar | off |
| `VITE_FF_STANDARDS_EXPLORER` | IS/ASTM/NABL standards browser | off |
| `VITE_FF_ACCURACY_ACADEMY` | Accuracy Academy walkthrough | off |

The hidden `/system/flags` dev route lets you toggle flags at runtime without editing `.env`. A `docker-compose.yml` is included for full-stack runs, and `netlify.toml` is preconfigured for the frontend deploy.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Wouter, Zustand, TanStack Query, Zod, Framer Motion, Recharts, Radix UI |
| Backend | FastAPI, Pydantic v2, CrewAI, LangChain, ChromaDB, BM25 + semantic hybrid search, Python 3.11+ |
| Testing | Vitest (frontend), pytest (backend), Playwright (offline browser smoke) |
| Tooling | pnpm monorepo, Ruff, strict TypeScript, GitHub Actions CI |
| Deploy | Netlify (frontend), Docker Compose (full stack), Vercel |

---

## 🗺 Roadmap / Planned Features

**Active / in progress** — promoted to the current enhancement cycle and behind `VITE_FF_*` flags (see [docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)):

- **Deadline Engine** (`deadline_engine`) — deterministic CrPC limitation dates, no LLM.
- **Accuracy Academy** (`accuracy_academy`) — branching citation-standards walkthrough.
- **Citation Deep-Link** (`citation_deeplink`) — every citation opens its source document.

**Upcoming** (flip the matching `VITE_FF_*=true` to preview):

- 🔜 Redaction Studio (`redaction_studio`)
- 🔜 Smart Drop (`smart_drop`)
- 🔜 Ask Copilot (`ask_copilot`)
- 🔜 Chronology Studio (`chronology_studio`)
- 🔜 Standards Explorer (`standards_explorer`)

**Stretch goals:**

- 🧑‍🤝‍🧑 Multi-user workspace with shared case files
- 🔗 Indian Kanoon live API integration
- 🔄 Harvey.ai bi-directional sync
- ✍️ PDF signature overlay for filing
- 📱 Mobile PWA for chambers

See [ROADMAP.md](ROADMAP.md) for the full plan.

---

## 🤝 How to Contribute

We welcome contributions from Indian legal professionals, TypeScript developers, and Python engineers. First-time contributors are genuinely welcome — accuracy-first is a culture, not a gate.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) first. The non-negotiables:

- Never add a legal citation without a `status` field and a `sourceUrl`.
- Never set `blockedFromDraft: false` on a `PENDING` citation.
- Never claim a test passes without real command output.
- Keep the Citation Gate and Verification Engine wired — removing either violates the accuracy rules.

---

## 📜 License

MIT — see [LICENSE](LICENSE).

Copyright (c) 2026 Rajkumar Singh Chauhan.

---

## ❤️ Shout-outs & Thanks

**Built by a dual expert.** Rajkumar Singh Chauhan is a **Senior Counsel and a Civil Engineer (B.E. Civil + LL.B.)** with 30+ years in Indian litigation. That combination is why the software understands both the law and the physical evidence behind it — the standards guard exists because the physics and the procedure have to agree.

- 🙏 To the **open-source legal-tech community** — you proved that rigorous, transparent tooling belongs in law.
- 🏛️ To the **Indian Judiciary's open data** and public reporting, which make traceable research possible.
- 🤖 To the four AI collaborators behind the 12-week integration — **Kiro, Devin, Trae, and Antigravity**.

---

## ⭐ Star Legal Luminaire

If Legal Luminaire saves you hours of research or one citation mistake — star the repo and share it with a fellow advocate! ⚖️🔥

> `#legaltech` · `#indianlaw` · `#legalai` · `#accuracyfirst` · `#zerohallucination` · `#citationverification` · `#indiancourts` · `#bilingual` · `#constructionlaw` · `#forensics`
