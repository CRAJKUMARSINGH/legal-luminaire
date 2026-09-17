**How to Apply the Legal Luminaire v2.0 Draft Patch**

Here is a practical, sequenced plan to apply the patch safely. It follows the 30-Day Recovery Checklist rules you shared (freeze non-critical work, small changes, clear ownership, document decisions, protect `main`).

### 1. Preconditions (Do These First – Day 0)

- Freeze all non-critical feature merges.
- Name one **Recovery / Patch Lead**.
- Name one clear owner for each major module:
  - Auth & Multi-tenancy
  - Research + Fact-Fit Gate
  - Drafting / Agentic workflows
  - Case Library / TC packs
  - Contract / CLM layer
- Create (or update) an Architecture Decision Record (ADR) folder and write short ADRs for:
  - Source-grounding strategy
  - Fact-Fit Gate enforcement rules
  - Multi-tenant isolation model
  - Case-pack folder standard
- Confirm the live repository structure and that `main` is protected (no direct pushes, PR + review + green CI required).

### 2. Recommended Application Order (Phased)

#### Phase 0 – Foundation & Control (3–5 days)
1. Create a long-lived branch: `feature/v2-patch-core`.
2. Add / update the engineering handbook with the new Case Pack Standard (folder layout, required matrices, bilingual rule, Fact-Fit Gate mandatory).
3. Physically integrate the two already-delivered full packs:
   - Create folders `CIVIL_03_SPECIFIC_PERFORMANCE_2026` and `CIVIL_04_INJUNCTION_2026` exactly as specified.
   - Drop all files from the `TC74_TC75_fullpacks.zip`.
   - Make them the first “golden” fixtures the demo browser and tests can load.
4. Update `TEST_CASE_MATRIX` and `MARKETING_SHOWCASE_MAP` to include TC-74 and TC-75.
5. Add a simple “Load TC-XX” button / command in the demo browser that pulls the full pack into a matter workspace.

#### Phase 1 – Authorisation & Multi-Tenancy (Highest Priority – 1–2 weeks)
This “completes the app” and must come before heavy feature work.

1. Implement identity (email + OTP or SSO).
2. Implement the role hierarchy (Super-Admin → Firm Admin → Partner → Associate → Paralegal → Client).
3. Add `tenant_id` (and preferably `matter_id`) to every relevant table.
4. Enforce row-level security / query filters so no cross-tenant data is ever returned.
5. Build the permission matrix and check it at both API and UI layers.
6. Add immutable audit logging for:
   - Every AI generation
   - Every Fact-Fit Gate override
   - Every share / export
7. Add a basic “Impersonate” mode for support (fully audited).
8. Write tests that prove a user from Tenant A cannot see Tenant B’s matters or documents.

Only after Phase 1 is green and reviewed should you open the next phases.

#### Phase 2 – Core Intelligence (Research + Fact-Fit + Matter Workspace)
1. Source-grounded research endpoint (every citation must open the exact paragraph / section).
2. Fact-Fit Gate as a first-class service:
   - Score every evidence / claim item.
   - Block `FATAL_ERROR` items from appearing in final drafts unless an explicit, audited override is given.
3. Multi-document matter workspace:
   - Upload full bundles → auto chronology, exhibit index, issue map, witness cross-reference.
4. “Upload pleading → CaseIQ-style” precedent suggestion.
5. Wire the existing TC packs so loading a case automatically populates the workspace with its matrices and drafts.

#### Phase 3 – Agentic Drafting + Bilingual Output
1. Agentic workflow: user describes matter → system proposes plan → researches → drafts.
2. One-click generation of the stage documents already defined in the packs (Plaint, Order 39, Discharge, Written Arguments, etc.).
3. Parallel Hindi + English output with correct court formatting.
4. In-editor (web + Word add-in if planned) clause generation and playbook redlining.

#### Phase 4 – Contract Layer + Court Tracking + Polish
1. Clause library + playbook redlining.
2. Portfolio “Ask AI” across uploaded contracts.
3. Live court-tracking MVP (cause lists, CNR, basic limitation alerts).
4. Full demo-browser category filters for all verticals.

#### Phase 5 – Hardening & 151-Lawyer Simulation
1. Build the load-test harness (Playwright + k6 or equivalent).
2. Generate 151 random lawyer personas with the mix described in the patch.
3. Run sustained sessions that exercise ~95 % of endpoints and UI surfaces.
4. Fix any latency, authz, or stability issues.
5. Only after this passes, merge the long-lived branch into `main` via normal PR process.

### 3. Day-to-Day Application Rules (from your Recovery Checklist)

- Every change goes through a PR.
- PR template must include: purpose, risk, test evidence, rollback note, and which module owner reviewed it.
- CI must be green (build + lint + type-check + critical tests).
- No PR larger than a single coherent concern.
- Update the recovery board daily (`broken now` / `risky but working` / `duplicate` / `unknown/unowned`).
- Record every architecture decision the same day.

### 4. How to Handle the Existing Case Packs

- Treat `TC74_TC75_fullpacks.zip` and `criminal_compendiums.zip` as the source of truth for content.
- Do **not** expand more full sets until Phase 1 (Auth) and Phase 2 (Matter Workspace + Fact-Fit) are live.
- Once the workspace can load a pack cleanly, expand the next priority cases (recommended order: finish TC-27 Murder → TC-32 Bank Fraud or TC-37 ACB Trap → TC-62 Title/Mutation) under the new standard only.

### 5. Immediate Next Commands You Can Give Me

You can reply with any of these and I will produce the concrete next artefact:

- `Give me the exact folder tree + file list for integrating TC-74 and TC-75`
- `Draft the Auth permission matrix table`
- `Write the ADR for Fact-Fit Gate enforcement`
- `Produce the PR template + CI gate checklist`
- `Create the 151-persona load-test outline in detail`
- `Update the recovery board with current status of all verticals`

### Summary – Safest Application Path

1. Freeze → assign owners → write ADRs.  
2. Integrate the two finished packs (TC-74 & TC-75) as golden fixtures.  
3. Ship Auth + multi-tenancy first (this “completes the app”).  
4. Then layer Research + Fact-Fit + Matter Workspace.  
5. Then Agentic Drafting.  
6. Then Contract + Court Tracking.  
7. Load-test with 151 lawyers.  
8. Only then reopen broader feature work under the new rules.

This keeps the system controlled, consistent, and owned while progressively delivering the best-of-all-worlds capabilities.  

Tell me which piece you want next and I will generate it immediately.