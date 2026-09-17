# LEGAL LUMINAIRE — TRAE DETAILED 5-WEEK IMPLEMENTATION GUIDE
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Trae (ByteDance Trae)  
**Role**: Backend Pipeline • Document Ingestion • Accuracy Controls • Observability • Rate Limiting Specialist  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: Never allow PENDING or FATAL_ERROR citations into any draft output. Never break Fact-Fit Gate, verification tiers, or IS-standard enforcement. Netlify production files must remain committed and functional. Vector DB data must stay gitignored.

---

## STANDING RULES FOR TRAE (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Accuracy is non-negotiable: PENDING and FATAL_ERROR citations must remain blocked from all draft generation.
3. All document processing must handle bilingual (Hindi + English) and noisy OCR input gracefully.
4. Keep `chroma_db/`, `__pycache__/`, and similar runtime data gitignored.
5. After any backend change that affects the API contract, coordinate with frontend (Devin / Kiro) so types stay aligned.
6. Prefer defensive coding and clear error messages over silent failures.
7. End every week by writing the required completion / support file under `docs/enrichment/`.
8. Conventional commit messages only.
9. If a change risks introducing hallucinations or unverified citations → stop immediately.

---

## WEEK 1 — SUPPORT ROLE
**Theme**: Foundation & Netlify Lock (Kiro Primary)

### Detailed Tasks
1. Scan the FastAPI backend for any import-order issues, missing imports (especially BaseModel / Pydantic), or crash-on-start problems.
2. Fix only critical blockers that prevent the backend from starting.
3. Confirm that ChromaDB / vector store paths and any local embedding caches remain properly gitignored.
4. Add or improve basic health-check endpoint documentation if missing (`/api/v1/health` or equivalent).
5. After Kiro’s frontend changes, re-verify that PENDING citations are still blocked from draft output.
6. Write backend note:
   ```
   docs/enrichment/WEEK1_TRAE_BACKEND_NOTE.md
   ```
   Include: crashes fixed, gitignore status, health endpoint status, citation blocking verification.

### Acceptance
- Backend starts cleanly.
- Citation blocking still works.
- Support note committed.

---

## WEEK 2 — SUPPORT ROLE
**Theme**: Multi-Case Data Layer (Devin Primary)

### Detailed Tasks
1. Ensure backend case-related endpoints accept a case-ID (or equivalent) parameter without breaking existing calls.
2. Confirm that document upload and indexing continue to work correctly when the active case context changes.
3. Add simple structured logging for case-switch events (for later observability).
4. Write support note:
   ```
   docs/enrichment/WEEK2_TRAE_BACKEND_NOTE.md
   ```

### Acceptance
- Backend remains compatible with the new multi-case frontend.
- Support note committed.

---

## WEEK 3 — PRIMARY OWNERSHIP
**Theme**: Document Pipeline, Accuracy Controls & Backend Hardening

### Objectives
- Deliver true end-to-end document upload → indexing → research → draft.
- Strengthen evidence and contradiction controls.
- Introduce basic observability and rate limiting.
- Improve print readiness of drafts.

### Detailed Tasks (execute strictly in order)

#### 3.1 End-to-End Document Upload & Indexing
- Connect the frontend upload UI fully to the backend indexing pipeline.
- Support PDF, DOCX, and image (OCR) inputs.
- Ensure uploaded documents are correctly associated with the active case.
- Handle large files, noisy OCR, mixed Hindi-English text, and duplicate annexures gracefully.
- Provide clear progress and error feedback to the frontend.

#### 3.2 Contradiction Detection Expansion
- Expand existing contradiction detection beyond dates.
- Detect conflicts in:
  - Party names
  - Amounts / figures
  - Locations
  - Key factual assertions across documents
- Surface contradictions clearly in the research / verification UI.

#### 3.3 Primary Source Emphasis
- Strengthen the distinction between:
  - Primary sources (user-uploaded documents)
  - Secondary / web-sourced material
- Ensure drafts and verification reports clearly indicate source type.

#### 3.4 Verification Linking
- Make the Verification Report and Pre-Filing Checklist directly accessible from every generated draft (one-click).

#### 3.5 Observability Baseline
- Add basic request tracing that identifies which agent / step handled a request.
- Add per-case / per-session token and approximate cost reporting.
- Expose this data via a simple API endpoint that the frontend can later surface.

#### 3.6 Rate Limiting
- Implement sensible rate limiting on expensive endpoints (research, drafting, heavy RAG calls).
- Return clear HTTP 429 responses with retry guidance.

#### 3.7 Print-Ready CSS
- Ensure draft output pages have clean print-ready CSS (page breaks, margins, no UI chrome when printing).

#### 3.8 Completion
- Write detailed completion report:
  ```
  docs/enrichment/WEEK3_TRAE_COMPLETION.md
  ```
  Include: pipeline architecture, contradiction rules added, observability endpoints, rate-limit configuration, accuracy regression results (TC-01 + at least one edge case), Netlify static-demo status, hand-off notes for Antigravity / Devin.

### Week 3 Acceptance Criteria
- [ ] Upload → Index → Research → Draft works end-to-end on TC-01 and at least one edge case
- [ ] PENDING and FATAL_ERROR citations remain blocked
- [ ] Contradiction detection covers dates + names + amounts + locations
- [ ] Verification Report is one click from every draft
- [ ] Basic tracing and cost reporting exist
- [ ] Rate limiting is active on expensive endpoints
- [ ] Netlify static demo still works (backend optional)
- [ ] `WEEK3_TRAE_COMPLETION.md` committed

---

## WEEK 4 — OBSERVABILITY HARDENING
**Theme**: Guided Workflow Support & Production Observability

### Detailed Tasks
1. Surface the tracing and cost-reporting data in a simple, non-intrusive UI panel (or prepare the API cleanly for Devin / Antigravity to consume).
2. Harden error boundaries and add retry logic with exponential backoff on all critical API calls.
3. Enforce file upload size and type validation on both frontend and backend (reject oversized or unsupported files early with clear messages).
4. Write observability note:
   ```
   docs/enrichment/WEEK4_TRAE_OBSERVABILITY.md
   ```

### Acceptance
- Observability data is available and useful.
- Upload validation is strict and user-friendly.
- Observability note committed.

---

## WEEK 5 — BACKEND FINAL LOCK
**Theme**: Security, Rate Limits & Production Readiness

### Detailed Tasks
1. Perform final backend security review (input validation, rate limits, error leakage, secrets handling).
2. Confirm all observability endpoints are safe for production (no sensitive data leakage).
3. Re-verify that citation blocking and Fact-Fit Gate still function correctly after all changes.
4. Write final backend report:
   ```
   docs/enrichment/WEEK5_TRAE_BACKEND_FINAL.md
   ```

### Acceptance
- Backend is production-hardened.
- Final report committed.

---

## FINAL NOTES FOR TRAE
You are the guardian of accuracy and the document pipeline.  
A single PENDING citation leaking into a draft is a critical failure.  
Always prefer “block and explain” over “generate and hope”.  
Keep the backend optional for the static Netlify demo while making the full RAG path robust for local / self-hosted use.  
End of Trae Guide.
