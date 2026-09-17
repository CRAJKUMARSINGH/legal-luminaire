# LEGAL LUMINAIRE — DEVIN DETAILED 5-WEEK IMPLEMENTATION GUIDE
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Devin (Cognition Devin)  
**Role**: UX Navigation • Multi-Case Data Layer • Guided Workflows • User-Facing Documentation Specialist  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: Never break accuracy rules, Fact-Fit Gate, verification tiers, IS-standard logic, or synthetic sample cases. All UI changes must remain bilingual. Netlify production files must remain committed and functional.

---

## STANDING RULES FOR DEVIN (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Every user-facing string must exist in both English and Hindi (or be clearly marked for translation).
3. Demo Mode and all sample cases must remain clearly labelled “SYNTHETIC / DEMO”.
4. Never hard-code Case 01 data into components that should be data-driven.
5. After any route change, verify Netlify SPA routing still works.
6. Prefer progressive disclosure over navigation overload.
7. End every week by writing the required completion / audit / support file under `docs/enrichment/`.
8. Conventional commit messages only.
9. If a UI change risks accuracy (e.g. hiding verification status) → stop and document.

---

## WEEK 1 — SUPPORT / AUDIT ROLE
**Theme**: Foundation & Netlify Lock (Kiro Primary)

### Detailed Tasks
1. Independently clone the repository into a clean environment.
2. Run the exact Netlify build command that Kiro has configured and report any failures (path, lockfile, publish directory, etc.).
3. Audit the empty states and skeleton loaders that Kiro implements:
   - Accessibility (ARIA, focus, contrast)
   - Bilingual consistency
   - Mobile responsiveness
4. Propose (do not implement yet) three concrete improvements to a future “Recent Cases” widget.
5. Verify that the Hemraj case (CASE_01) and TC-01 still load correctly after dependency pinning.
6. Write audit note:
   ```
   docs/enrichment/WEEK1_DEVIN_AUDIT.md
   ```
   Include: Netlify test result, accessibility findings, bilingual check, residual risks.

### Acceptance
- Independent Netlify verification completed.
- Audit file committed with clear findings.

---

## WEEK 2 — PRIMARY OWNERSHIP
**Theme**: UX Navigation, Demo Mode & Multi-Case Data Layer

### Objectives
- Eliminate navigation overload.
- Deliver a one-click, clearly labelled Demo Mode.
- Make the application multi-case capable without code changes for each new case.
- Improve form validation feedback.

### Detailed Tasks (execute strictly in order)

#### 2.1 Navigation Restructuring
- Collapse the current 40+ flat navigation items into four clear grouped sections:
  - Case Setup
  - Research
  - Drafting
  - Review
- Add a persistent breadcrumb trail for all case-scoped pages.
- Ensure keyboard navigation and mobile drawer behaviour remain excellent.
- Keep legacy flat routes as redirects only (no removal yet).

#### 2.2 One-Click Demo Mode
- Implement a prominent “Load Demo Case (Hemraj – Synthetic)” button / card.
- On activation:
  - Load full CASE_01 data
  - Pre-fill all relevant forms and matrices
  - Clearly display a persistent “SYNTHETIC / DEMO” badge on every page
- Demo Mode must be reachable in ≤ 3 clicks from Home.

#### 2.3 Test Data Browser
- Build a browsable UI for all 21 functional cases + edge / stress / showcase cases.
- Each entry must show: ID, title, court, charges, scenario type, and a “Load” action.
- Loading a test case must switch the active case context cleanly.

#### 2.4 Multi-Case Data Layer
- Introduce a proper case data layer (JSON / Markdown / TypeScript data files under a `cases/` structure or equivalent).
- All pages that previously hard-coded Case 01 content must now read from the currently selected case.
- Create a case selector (dropdown or list) that is available globally or on Home.
- Minimum fields per case: court, case number, parties, facts timeline, standards matrix, case-law links, prayer clauses, verification blocks.

#### 2.5 Form Validation Feedback
- Wire existing Zod schemas to the intake / case-setup forms.
- Surface validation errors clearly next to fields (bilingual where possible).
- Prevent submission of invalid data.

#### 2.6 Recent Cases Widget
- Add a “Recent Cases” widget on Home that shows the last few loaded cases (local storage or equivalent).

#### 2.7 Completion
- Write detailed completion report:
  ```
  docs/enrichment/WEEK2_DEVIN_COMPLETION.md
  ```
  Include: architecture decisions for the data layer, files changed, Demo Mode verification, multi-case test results, Netlify status, hand-off notes for Trae.

### Week 2 Acceptance Criteria
- [ ] Navigation is grouped and no longer overwhelms
- [ ] Demo Mode loads CASE_01 in ≤ 3 clicks and is clearly labelled SYNTHETIC
- [ ] At least three sample cases can be switched without code changes
- [ ] Zod validation feedback is visible and helpful
- [ ] Netlify deploy still succeeds
- [ ] `WEEK2_DEVIN_COMPLETION.md` committed

---

## WEEK 3 — SUPPORT ROLE
**Theme**: Document Pipeline & Accuracy Controls (Trae Primary)

### Detailed Tasks
1. Confirm that the UI clearly distinguishes primary sources (user uploads) from secondary / web sources.
2. Ensure the Verification Report and Pre-Filing Checklist are directly linked / accessible from every draft output page (one click).
3. Add clear progress indicators for the multi-step flow: Upload → Index → Research → Draft.
4. Write UI support note:
   ```
   docs/enrichment/WEEK3_DEVIN_UI_NOTE.md
   ```

### Acceptance
- Source distinction and verification linking are clear.
- Support note committed.

---

## WEEK 4 — GUIDED FLOW OWNERSHIP
**Theme**: Guided Workflow & Task-Oriented Dashboard

### Detailed Tasks
1. Implement a guided multi-step flow:
   Intake → Research → Draft → Review
   with visible progress indicators and ability to move back and forth safely.
2. Convert the Home page into task-oriented dashboard cards (instead of pure link lists).
3. Add a document-type selector (Discharge Application, Bail Application, Written Submission, etc.) before the drafting step.
4. Ensure the guided flow works correctly in both Demo Mode and normal multi-case mode.
5. Write completion note:
   ```
   docs/enrichment/WEEK4_DEVIN_GUIDED_FLOW.md
   ```

### Acceptance
- A new user can complete a full synthetic case via the guided path.
- Dashboard cards are clear and actionable.
- Guided flow note committed.

---

## WEEK 5 — DOCUMENTATION LOCK
**Theme**: Final User-Facing Documentation & UX Verification

### Detailed Tasks
1. Perform a complete end-to-end UX walkthrough of:
   - Guided flow
   - Demo Mode
   - Multi-case switching
   - Verification linking
2. Update all user-facing documentation:
   - Root README
   - `docs/USER_MANUAL.md`
   - Video script notes if present
3. Ensure all new features are described accurately and remain synthetic-only.
4. Write final documentation report:
   ```
   docs/enrichment/WEEK5_DEVIN_DOCS.md
   ```

### Acceptance
- Documentation is complete, accurate, and professional.
- Final docs file committed.

---

## FINAL NOTES FOR DEVIN
You own the user experience and the multi-case foundation.  
Every screen a lawyer sees must feel purposeful, clear, and trustworthy.  
Never hide verification status or accuracy signals.  
Always leave the application in a state where Demo Mode is the fastest way to demonstrate value.  
End of Devin Guide.
