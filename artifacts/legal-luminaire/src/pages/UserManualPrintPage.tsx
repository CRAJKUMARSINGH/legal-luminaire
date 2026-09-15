/**
 * UserManualPrintPage — printable PDF user manual.
 * Route: /user-manual-pdf  alias: /manual-pdf
 * Use: File -> Print -> Save as PDF in Chrome/Edge
 */
import { Button } from "@/components/ui/button";
import { Printer, BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const SECTIONS = [
  {
    title: "1. What is Legal Luminaire?",
    content: `Legal Luminaire is an accuracy-first AI legal workbench for Indian advocates, senior counsel, and forensic litigators.

REPLACES: research databases, drafting software, deadline trackers, IS standards references, document stores
BUILT BY: Rajkumar Singh Chauhan — Senior Counsel & Civil Engineer, 30+ years, B.E. + LL.B.
CORE RULE: No legal draft reaches court without deterministic verification.

WHO IS THIS FOR:
  - Advocates in Sessions Courts and High Courts
  - Senior Counsel in criminal, civil, infrastructure matters
  - Forensic litigators challenging FSL reports and IS standard compliance
  - Legal researchers needing verified precedent research

DISCLAIMER: All demo data is SYNTHETIC. Never file demo documents in any court.`
  },
  {
    title: "2. Quick Start (60 seconds)",
    content: `STEP 1 — Open the app
  Live:  https://legal-luminaire.netlify.app
  Local: http://localhost:5173

STEP 2 — Load a demo case
  Click "Try 26 Demo Cases" on the Home page, OR
  Click "Load Demo Case (Hemraj)" on the amber Demo Mode card.
  No login. No API key required.

STEP 3 — Follow the 5-Step Workflow shown on Home:
  1. Intake -> 2. Research -> 3. Verify -> 4. Draft -> 5. Review

STEP 4 — Read the manual
  App: /how-to-use  (interactive)
  PDF: /user-manual-pdf -> File -> Print -> Save as PDF`
  },
  {
    title: "3. The 12 Statutory Features",
    content: `1. AI LEGAL RESEARCH (/case/:id/case-research)
   Enter a legal issue -> AI searches 25+ authorities -> Fact-Fit Gate scores 0-100
   Score >=70 = primary, 50-69 = analogous, 30-49 = supporting, <30 = REJECTED

2. AI LEGAL DRAFTING (/case/:id/ai-draft-engine)
   Select doc type + language -> auto-populated VERIFIED citations -> verbatim holdings
   Supported: Discharge App, Bail, Written Submissions, Notice Reply, Oral Arguments

3. CITATION VERIFICATION (/case/:id/verification)
   COURT_SAFE: certified copy confirmed     [allowed in drafts]
   VERIFIED:   confirmed on official source [allowed]
   SECONDARY:  credible secondary source    [with qualification]
   PENDING:    unverified                   [BLOCKED]
   FATAL_ERROR: fabricated/mismatched       [BLOCKED permanently]

4. CASE CHRONOLOGY (/case/:id/chronology)
   Generate -> Accept/Edit/Reject each entry -> Export (accepted only)
   Undated entries -> "Needs Dating" amber lane (never silently guessed)

5. CASE MANAGEMENT (/cases)
   Create/switch/duplicate cases; 26 demo cases; Dashboard at /case/:id/dashboard

6. COURT & CASE TRACKING (/court-tracker)
   Hearing history, court orders, next dates. Demo = synthetic data.

7. DEADLINE TRACKING (/case/:id/deadlines)
   Kanban: Overdue / This Week / Upcoming / Filed
   Month Calendar view; Limitation Act 1963 rules applied

8. DOCUMENT MANAGEMENT (/new-case-ingest)
   Drag PDF/DOCX/images -> auto-classify -> PII redact (in-browser) -> register

9. CLIENT & MATTER MGMT (/client-matter)
   Client profiles + matter status, next dates, charges. localStorage only.

10. WORKFLOW AUTOMATION (/litigation-workflow)
    Step-by-step guides: Discharge / Bail / Written Submissions / Trial Prep
    AI-Automated steps run automatically; Blocked steps need advocate sign-off

11. AI AGENTS DASHBOARD (/ai-agents)
    8 agents: Research, Drafting, Citation Verification, Chronology, Deadline Engine,
    Standards Explorer, Ask Luminaire Copilot, Accuracy Academy

12. FORENSIC STANDARDS (/standards-index, /forensic-faq)
    IS 2250:1981 = masonry mortar (CORRECT)
    IS 1199:2018 = fresh concrete ONLY (auto-flagged if misapplied)
    ASTM C1324 = hardened masonry mortar forensics`
  },
  {
    title: "4. The 6 Accuracy Rules (Mandatory)",
    content: `These rules are hardwired. They cannot be disabled by any feature flag.

RULE 1 — CITATION COMPLETENESS
  Every citation: full case name + reporter + court + date + verified URL + para number
  Format: Case Name (Year) Volume Reporter Page, Para N

RULE 2 — VERBATIM HOLDINGS
  Holdings are NEVER paraphrased. Always verbatim from verified source.

RULE 3 — PENDING CITATION BLOCK
  PENDING and FATAL_ERROR citations: physically blocked from all draft output.
  The Citation Safety Gate disables the export button until citations clear.

RULE 4 — IS STANDARD GUARD
  IS 2250:1981 -> masonry mortar testing (CORRECT)
  IS 1199:2018 -> fresh concrete ONLY (auto-flagged if misapplied)

RULE 5 — FACT-FIT GATE
  Score <30 = FATAL ERROR if cited as primary authority.
  Most common AI drafting error -- Legal Luminaire prevents it automatically.

RULE 6 — MANDATORY VERIFICATION REPORT
  Every draft output includes:
  - Verification Report (citation tier for every citation)
  - Pre-Filing Checklist (12-point advocate sign-off)`
  },
  {
    title: "5. Local Installation",
    content: `PREREQUISITES
  Node.js 22+  ->  https://nodejs.org
  pnpm 10+     ->  npm install -g pnpm
  Git

FRONTEND ONLY (recommended first)
  git clone https://github.com/CRAJKUMARSINGH/legal-luminaire.git
  cd legal-luminaire
  pnpm install
  pnpm --filter @workspace/legal-luminaire run dev
  Open: http://localhost:5173

FULL STACK (with AI backend)
  cd artifacts/legal-luminaire/backend
  python -m venv .venv
  .venv\Scripts\activate          (Windows)
  pip install -r requirements.txt
  cp .env.example .env            # Add OPENAI_API_KEY / TAVILY_API_KEY
  uvicorn main:app --reload

NETLIFY DEPLOYMENT (one-click)
  1. Connect repo to Netlify
  2. Leave Base directory BLANK
  3. Build + publish from netlify.toml (auto-detected)

OPTIONAL ENV VARS (demo works without any)
  VITE_API_URL       FastAPI API base URL (default: /api/v1)
  OPENAI_API_KEY     for AI drafting backend
  TAVILY_API_KEY     for research backend`
  },
  {
    title: "6. About the Creator",
    content: `NAME:   Rajkumar Singh Chauhan (राजकुमार सिंह चौहान)
QUALS:  B.E. (Civil Engineering) + LL.B.
EXP:    30+ years -- Indian courts
        Criminal Law | Civil Litigation | Infrastructure Arbitration | Forensic Engineering

THE DUAL-EXPERT ADVANTAGE:
Legal Luminaire is built by the only practitioner who has 30+ years in Indian courts
AND can read an FSL report. The IS standard guard (IS 2250:1981 vs IS 1199:2018)
came from standing in a sessions court watching the prosecution expert crumble under
cross-examination on standard misapplication.

"I built this because I needed it. Every accuracy rule is a scar from a real case."
-- Rajkumar Singh Chauhan

LinkedIn: https://in.linkedin.com/in/rajkumar-singh-chauhan-76627b18
GitHub:   https://github.com/CRAJKUMARSINGH
Repo:     https://github.com/CRAJKUMARSINGH/legal-luminaire`
  }
];

export default function UserManualPrintPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Toolbar -- hidden on print */}
      <div className="no-print sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Legal Luminaire -- User Manual PDF</span>
        </div>
        <div className="flex gap-2">
          <Link href="/how-to-use">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" /> Interactive Guide
            </Button>
          </Link>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8 print:px-8 print:py-6">
        {/* Cover */}
        <div className="text-center border-b pb-8">
          <div className="text-5xl mb-3">⚖️</div>
          <h1 className="text-3xl font-bold">Legal Luminaire</h1>
          <p className="text-lg text-muted-foreground mt-1">User Manual and Reference Guide</p>
          <p className="text-sm text-muted-foreground mt-3">
            India's Accuracy-First AI Legal Workbench<br />
            Built by Rajkumar Singh Chauhan -- Senior Counsel and Civil Engineer<br />
            Version 2.2.0 · September 2026
          </p>
          <div className="flex justify-center gap-3 mt-4 text-xs flex-wrap">
            <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 font-semibold">SYNTHETIC / DEMO DATA</span>
            <span className="px-2 py-1 rounded bg-green-100 text-green-800">Hindi + English</span>
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">26 Demo Cases</span>
            <span className="px-2 py-1 rounded bg-primary/10 text-primary">12 Statutory Features</span>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            https://legal-luminaire.netlify.app | https://github.com/CRAJKUMARSINGH/legal-luminaire
          </p>
        </div>

        {/* TOC */}
        <div className="border rounded-lg p-5 bg-muted/20">
          <h2 className="font-bold text-base mb-3">Table of Contents</h2>
          <ol className="space-y-1.5 text-sm">
            {SECTIONS.map(s => (
              <li key={s.title} className="text-sm">{s.title}</li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        {SECTIONS.map(section => (
          <div key={section.title} className="print:break-inside-avoid">
            <h2 className="text-xl font-bold border-b-2 border-primary/20 pb-2 mb-4">{section.title}</h2>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed bg-muted/20 rounded-lg p-4 border font-mono print:bg-transparent print:border-none print:font-sans print:text-sm print:p-0">
{section.content}
            </pre>
          </div>
        ))}

        {/* Footer */}
        <div className="border-t pt-6 text-center text-xs text-muted-foreground">
          <p className="font-semibold">Legal Luminaire v2.2.0 -- User Manual</p>
          <p className="mt-1">All demo data is SYNTHETIC. Not for filing in any court. Not a substitute for professional legal advice.</p>
          <p className="mt-1">© 2026 Rajkumar Singh Chauhan · MIT License</p>
        </div>
      </div>

      <style>{`@media print{.no-print{display:none!important}h1{font-size:20pt}h2{font-size:13pt;font-weight:bold;border-bottom:1px solid #ccc;padding-bottom:4pt;margin-top:18pt}pre{font-family:inherit;font-size:9pt;white-space:pre-wrap}@page{margin:2cm 1.5cm}}`}</style>
    </div>
  );
}