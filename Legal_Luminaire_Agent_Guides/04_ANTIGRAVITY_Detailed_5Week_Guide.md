# LEGAL LUMINAIRE — ANTIGRAVITY DETAILED 5-WEEK IMPLEMENTATION GUIDE
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Antigravity (Google Antigravity)  
**Role**: Final Polish • Accuracy Regression • Visual Consistency • Production Lock • Release Specialist  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: You are the final quality and production gate. No release without a clean Netlify deploy from a fresh clone. Accuracy regressions are blockers. All documentation and marketing material must remain synthetic-only.

---

## STANDING RULES FOR ANTIGRAVITY (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Accuracy regressions (especially citation blocking or Fact-Fit Gate failures) are immediate blockers.
3. Netlify production files must remain present, correct, and verified after every change you or others make.
4. All visual and UX polish must preserve bilingual support and accessibility.
5. Demo Mode and sample cases must stay clearly labelled “SYNTHETIC / DEMO”.
6. Prefer polish that increases trust (status badges, verification visibility, clear empty states) over pure decoration.
7. End every week by writing the required completion / audit / hand-off file under `docs/enrichment/`.
8. Conventional commit messages only.
9. In Week 5 you own the final release tag — do not tag until every acceptance criterion across all weeks is green.

---

## WEEK 1 — HANDOFF & VISUAL AUDIT
**Theme**: Foundation & Netlify Lock (Kiro Primary)

### Detailed Tasks
1. After Kiro completes Week 1, run a full visual regression checklist on:
   - Empty states
   - Skeleton loaders
   - Desktop and mobile viewports
2. Confirm SPA routing works correctly on a Netlify preview / deploy after Kiro’s changes.
3. Prepare a precise hand-off checklist for Week 2 that lists:
   - Files changed by Kiro
   - Known residual risks
   - What Devin should verify first
4. Write hand-off report:
   ```
   docs/enrichment/WEEK1_ANTIGRAVITY_HANDOFF.md
   ```

### Acceptance
- Visual checklist completed.
- Netlify SPA routing confirmed.
- Hand-off file committed.

---

## WEEK 2 — UX AUDIT
**Theme**: Navigation, Demo Mode & Multi-Case (Devin Primary)

### Detailed Tasks
1. Perform a complete UX walkthrough of:
   - Grouped navigation
   - One-click Demo Mode
   - Test Data Browser
   - Case switching
2. Verify bilingual labels, empty states, and SYNTHETIC badges remain consistent and visible.
3. Confirm that Netlify deploy still succeeds after the multi-case data layer changes.
4. Write UX audit report:
   ```
   docs/enrichment/WEEK2_ANTIGRAVITY_UX_AUDIT.md
   ```
   Include: walkthrough findings, any residual navigation or labelling issues, Netlify status.

### Acceptance
- Full UX walkthrough completed.
- Audit file committed.

---

## WEEK 3 — ACCURACY AUDIT
**Theme**: Document Pipeline & Accuracy Controls (Trae Primary)

### Detailed Tasks
1. Run full accuracy regression testing on at least:
   - TC-01 (Hemraj / Building Collapse)
   - TC-E02 (Contradictory Dates)
   - TC-E07 (Adversarial Fake Citation)
2. Explicitly verify that PENDING and FATAL_ERROR citations remain completely blocked from draft output.
3. Confirm that the Verification Report and Pre-Filing Checklist are reachable in one click from drafts.
4. Verify that the Netlify static demo still works with the backend optional.
5. Write accuracy audit report:
   ```
   docs/enrichment/WEEK3_ANTIGRAVITY_ACCURACY_AUDIT.md
   ```

### Acceptance
- Accuracy regression passed (or residual issues clearly documented as blockers).
- Audit file committed.

---

## WEEK 4 — PRIMARY POLISH OWNERSHIP
**Theme**: Guided Workflow, Visual Consistency & Observability Surface

### Objectives
- Deliver the final layer of visual and interaction polish.
- Ensure error handling and observability are production-ready from a user perspective.
- Keep Netlify production files untouched and functional.

### Detailed Tasks (execute strictly in order)

#### 4.1 Visual Consistency
- Standardise card elevation, spacing, and typography across the application.
- Implement consistent, colour-coded status badges for:
  - COURT_SAFE
  - VERIFIED
  - SECONDARY
  - PENDING
  - FATAL_ERROR
- Ensure badges are visible in both light and dark contexts if applicable.

#### 4.2 Error Boundaries & Resilience
- Add React error boundaries on all major page components so a single failure does not crash the entire SPA.
- Coordinate with Trae to ensure frontend retry logic is present for transient API failures.

#### 4.3 Print & Bilingual Polish
- Final pass on print-ready CSS (page breaks, margins, hiding of navigation chrome).
- Final bilingual consistency check on all new strings introduced in Weeks 1–4.

#### 4.4 Netlify Integrity
- Explicitly confirm that root `netlify.toml`, artifact-level config, and any `_redirects` remain correct and committed.
- Do not alter production configuration unless a clear bug is found; if a bug is found, fix it and document.

#### 4.5 Completion
- Write detailed completion report:
  ```
  docs/enrichment/WEEK4_ANTIGRAVITY_COMPLETION.md
  ```
  Include: visual changes, error-boundary coverage, print CSS status, Netlify verification, residual risks, readiness for Week 5 release.

### Week 4 Acceptance Criteria
- [ ] Visual language is consistent and professional
- [ ] Status badges are clear and colour-coded
- [ ] Major pages have error boundaries
- [ ] Print CSS is clean
- [ ] Netlify production files remain intact and functional
- [ ] `WEEK4_ANTIGRAVITY_COMPLETION.md` committed

---

## WEEK 5 — FINAL PRODUCTION LOCK & RELEASE
**Theme**: Clean Deploy, Documentation, Marketing Hygiene & Tagging

### Objectives
- Guarantee that a completely clean clone deploys correctly to Netlify.
- Finalise all documentation and synthetic-only marketing material.
- Tag a stable enrichment release.

### Detailed Tasks (execute strictly in order)

#### 5.1 Clean-Clone Netlify Verification
- Perform a full clean-clone test:
  1. Fresh clone of main
  2. Follow the documented Netlify connection steps exactly
  3. Confirm build succeeds and SPA routing works
- Fix any remaining path, lockfile, publish-directory, or redirect issues.
- Guarantee that the following production files remain committed:
  - Root `netlify.toml`
  - `artifacts/legal-luminaire/netlify.toml` (if used)
  - Any `_redirects` or equivalent
  - `vercel.json`
  - Docker-related files

#### 5.2 Documentation & Summary
- Create the overall summary:
  ```
  docs/enrichment/ENRICHMENT_5WEEK_SUMMARY.md
  ```
- Update:
  - CHANGELOG.md
  - Accuracy governance notes if needed
  - Marketing showcase map (must remain synthetic-only)
- Ensure README accurately reflects the enriched state of the project.

#### 5.3 Final Accuracy & UX Sweep
- Re-run a short accuracy spot-check on TC-01 and one edge case.
- Confirm Demo Mode, guided flow, and multi-case switching still work.

#### 5.4 Release Tag
- Only after every acceptance criterion from Weeks 1–5 is green:
  - Create annotated tag (recommended: `v2.1.0-enrichment`)
  - Push the tag
- Write final report:
  ```
  docs/enrichment/WEEK5_ANTIGRAVITY_FINAL.md
  ```
  Include: clean-clone Netlify result, tag name, residual known limitations, recommendation for next phase.

### Week 5 Acceptance Criteria
- [ ] Clean-clone Netlify deploy succeeds
- [ ] All production files are present and correct
- [ ] ENRICHMENT_5WEEK_SUMMARY.md and WEEK5_ANTIGRAVITY_FINAL.md committed
- [ ] CHANGELOG and key docs updated
- [ ] Release tagged and pushed
- [ ] No accuracy regressions

---

## FINAL NOTES FOR ANTIGRAVITY
You are the last line of defence.  
A beautiful UI that allows an unverified citation into a court document is a failure.  
A perfect codebase that cannot be deployed from a clean clone is also a failure.  
Only tag the release when both accuracy and production deployability are proven.  
Leave the repository in a state that an Indian advocate can clone, connect to Netlify, and immediately experience a professional, synthetic, zero-hallucination demo.  
End of Antigravity Guide.
