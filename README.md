# ⚖️ Legal Luminaire

**India's Evidence-First Legal Research & Litigation Intelligence Workbench**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-D8B36A.svg)](LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/CRAJKUMARSINGH/legal-luminaire/ci.yml?branch=main&label=CI)](https://github.com/CRAJKUMARSINGH/legal-luminaire/actions)
[![Tests](https://img.shields.io/badge/tests-558%20passing-15803D)](https://github.com/CRAJKUMARSINGH/legal-luminaire/actions)

---

## ✨ What Makes This Brilliant

Legal Luminaire is not a generic AI chatbot bolted onto legal templates. It is a **citation-safe, bilingual, evidence-grounded** platform built for the specific demands of Indian litigation.

Every precedent is independently tier-graded — `COURT_SAFE`, `VERIFIED`, `SECONDARY`, or `PENDING`. Unverified citations are hard-blocked from any court-ready export. The limitation engine computes CrPC deadlines deterministically, without an LLM, with full bilingual audit trails. Advocates stay in control: AI drafts require human review before anything reaches a court file.

---

## 🚀 Key Features

- **Citation Safety Gate** — real-time scan of every draft; PENDING citations blocked from export automatically
- **Verification Engine** — 5-tier registry (COURT_SAFE → FATAL_ERROR) with verbatim holdings and para references
- **19 Graded Precedents** — Hemraj stadium collapse defence: Kattavellai SC 2025, Prafulla Kumar Samal, Baldev Singh, Jacob Mathew, and more
- **Deterministic Deadline Engine** — CrPC §167, §173, §439, §468 computed without LLM; CANNOT_COMPUTE safety for missing dates
- **Bilingual Drafting** — English/Hindi side-by-side; discharge applications, written submissions, arbitration claims
- **26 Demo Cases** — criminal, civil, and infrastructure arbitration (TC-01 through TC-26)
- **Document Intelligence** — PDF/DOCX/MD upload, OCR, ChromaDB vector store, BM25 + semantic hybrid search
- **PII Redaction** — Aadhaar, PAN, phone, email, passport, voter ID masked before any AI processing
- **Accuracy Academy** — training module for legal citation standards
- **Fully typed** — strict TypeScript + Python type hints throughout; 388 frontend + 170 backend tests

---

## 📸 Screenshots

> _Add screenshots here. Suggested: Home dashboard, Citation Gate in action, Deadline Board, Bilingual Draft Editor._
>
> **Quick recording tip:** A 20–40 second screen recording of the Citation Gate blocking a PENDING citation makes the most compelling demo.

---

## ⚡ Quick Start

**Prerequisites:** Node 22+, pnpm 10+, Python 3.11–3.13 (for backend)

```bash
# 1. Clone
git clone https://github.com/CRAJKUMARSINGH/legal-luminaire.git
cd legal-luminaire

# 2. Install (all workspace packages)
pnpm install

# 3. Run frontend (works without backend — uses localStorage)
pnpm --filter @workspace/legal-luminaire run dev
# → http://localhost:5173
```

The frontend runs fully without a backend. All 26 demo cases, the Citation Gate, Verification Engine, and Deadline Board are available immediately.

### Production status and launch checks

The frontend is available for synthetic-data demonstrations. Open TC-01 from the Demo Case Browser, review sources in the Verification Panel, and use Safe Draft to see how the Fact-Fit Gate controls output. Confidential production requires the identity and case-isolation work tracked in [SE-01](docs/blockers/SE-01-OIDC-CASE-ISOLATION.md). Court-use exports also require closure of the [11 outstanding source-verification items](docs/blockers/LEGAL-SOURCE-CLOSURE.md). Treat outputs as research and drafting aids. A qualified Indian advocate must review any AI-assisted draft before filing.

Keep confidential material out of hosted demos and shared fixtures. The demo uses browser-local storage. Backend-enabled workflows can send content to configured providers, so confirm their data-handling terms before using client material.

Install the backend test dependencies and Ruff in your active Python environment with `python -m pip install -r artifacts/legal-luminaire/backend/requirements.txt ruff`. From the repository root, `pnpm launch:gate` runs Python lint checks, workspace typechecking, the frontend suite including the Fact-Fit Gate regressions, the production frontend build, and backend pytest. See the [launch hardening report](LAUNCH_HARDENING_REPORT.md) for current validation and release blockers.

After building, run the browser smoke tests with `python -m pip install playwright`, `python -m playwright install chromium`, and `python scripts/test_launch_browser.py`. The tests open the static production build and use only synthetic case data.

---

## 📖 How to Use

### Frontend Only (Demo Mode)

1. Open `http://localhost:5173`
2. Browse demo cases from the **Demo Case Browser** or **Infra Arbitration Browser**
3. Open TC-01 (Hemraj Stadium Collapse) to see a fully loaded case
4. Navigate to **Safe Draft** — type or paste text containing a citation to see the Citation Gate in action
5. Navigate to **Deadline Board** — see CrPC deadlines with bilingual basis strings
6. Navigate to **Verification Panel** — inspect tier-graded precedents

### Full Stack (with AI features)

```bash
# 1. Create backend/.env from the example
cp artifacts/legal-luminaire/backend/.env.example artifacts/legal-luminaire/backend/.env
# Edit .env — add OPENAI_API_KEY and TAVILY_API_KEY

# 2. Create Python virtualenv and install
cd artifacts/legal-luminaire/backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt  # Windows
# or: .venv/bin/pip install -r requirements.txt  # Linux/Mac

# 3. Start backend
.venv/Scripts/python main.py

# 4. Frontend (separate terminal)
cd ../../../
pnpm --filter @workspace/legal-luminaire run dev
```

---

## 🔧 Configuration

| Variable | Purpose | Required |
|----------|---------|---------|
| `OPENAI_API_KEY` | GPT-4o agents + embeddings | For AI research/drafting |
| `TAVILY_API_KEY` | Live citation verification | For web verification |
| `GOOGLE_API_KEY` | Gemini omni-modal ingestion | Optional |
| `CORS_ORIGINS` | Allowed frontend origins | Production |
| `APP_ENV` | `development` or `production` | Deployment |
| `HALLUCINATION_THRESHOLD` | Block output above this ungrounded ratio | Optional (default 0.25) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Wouter, TanStack Query |
| UI | Radix UI primitives, Lucide icons, Recharts, Framer Motion |
| Backend | FastAPI, Python 3.14, Pydantic v2, ChromaDB, LangChain 0.3 |
| AI | OpenAI GPT-4o, CrewAI, SBERT embeddings, BM25 + semantic hybrid |
| Testing | Vitest 4 (388 tests), pytest 9 (170 tests) |
| Deployment | Netlify (frontend), Docker (full stack), pnpm monorepo |

---

## 🗺 Roadmap

- [ ] Live Manupatra / SCC Online API integration (citation verification)
- [ ] Advocate approval workflow with digital signature
- [ ] Court holiday calendar for precise working-day deadline computation
- [ ] Additional IS/ASTM clause text from official BIS purchases
- [ ] Redis-backed rate limiting for multi-instance production
- [ ] Backend API key authentication

See [ROADMAP.md](ROADMAP.md) for the full plan.

---

## ⚠️ Important Disclaimers

1. **Demo data only** — all case data is synthetic. Do not use real client information.
2. **Not legal advice** — this is a research and drafting aid. All outputs require review by a qualified Indian advocate before filing.
3. **Court-use exports** — SECONDARY citations require the advocate to confirm the holding independently. PENDING citations are blocked automatically.
4. **Deadline calculations** — working-day rules use a 1.4× approximation. Always verify against the official court holiday calendar before relying on a computed deadline.

---

## 🤝 How to Contribute

We welcome contributions from Indian legal professionals, TypeScript developers, and Python engineers.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) first. Key rules:
- Never add a legal citation without a `status` field and a `sourceUrl`
- Never set `blockedFromDraft: false` on a PENDING citation
- Never claim a test passes without actual command output
- Keep the Citation Gate and Verification Engine wired — removing either violates the accuracy rules

---

## 📜 License

MIT — see [LICENSE](LICENSE)

---

## ❤️ Acknowledgements

Built for the Indian legal community. Inspired by the need for rigorous, source-cited legal research that holds up in court — not just in a demo.

---

⭐ **If Legal Luminaire saves you time or improves your research quality, please star the repo and share it with a colleague.**

> Topics: `legal-tech` · `indian-law` · `legal-research` · `legal-ai` · `litigation` · `citation-verification` · `react` · `typescript` · `fastapi` · `document-intelligence`
