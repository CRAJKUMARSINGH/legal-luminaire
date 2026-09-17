# Legal Luminaire: Landing Page & Dashboard Functional Audit & Corrections

**Document Reference**: `CORRECTIONS_NEEDED.md`  
**Related Specs**: `SUPPLEMENT/MASTER-TESTER-LEGAL.MD`  
**Execution Context**: Robotic Verification of `http://localhost:5173/` (Landing Page & Case-01 Dashboard)

---

## Executive Summary

A comprehensive robotic test was conducted against the Legal Luminaire web application across the landing page root (`/`) and the case dashboard route (`/case/case-01/dashboard`). 

While all core navigation, layout structures, and bilingual hero cards rendered without application-crashing exceptions, several **critical functional discrepancies, data fallbacks, and UI/UX state inconsistencies** were identified. Below is the itemized breakdown of corrections required to achieve full compliance with `MASTER-TESTER-LEGAL.MD`.

---

## 1. High-Priority Corrections (P0 / Critical)

### 1.1 Initial Accuracy Score Zero-State (`AccuracyBadge` / `AccuracyContext`)
- **Observed Behavior**: Upon loading the pre-loaded Hemraj case (Case-01), the header displays a `LOW ACCURACY` badge with `0.0/10` across all categories (Legal: 0.0, Technical: 0.0, Factual: 0.0, Procedural: 0.0) accompanied by a "Requires review" warning.
- **Root Cause**: `src/context/AccuracyContext.tsx` initializes `metrics` to zeros. No baseline computation or mock seed is run upon loading synthetic demo cases.
- **Correction Needed**:
  - Automatically calculate or seed baseline accuracy scores for synthetic demo cases in `AccuracyContext` upon selection.
  - Case-01 (Hemraj) with 18 documents, 8 citations, and 9 standards should display appropriate verified scoring (e.g. `8.5/10 - HIGH ACCURACY` or `CRITICAL ACCURACY`) instead of zero.

---

### 1.2 Forensic Risk Radar & Activity Heatmap Fallbacks (`DynamicDashboardView`)
- **Observed Behavior**: The Forensic Risk Radar and Timeline Heatmap render empty fallback messages (*"Insufficient data for Risk Radar"* and *"Insufficient events for heatmap visualization"*).
- **Root Cause**: `DynamicDashboardView.tsx` fetches from `/cases/{id}/stats`. When running frontend-only or if the backend endpoint is not populated, `stats` evaluates to `null`, causing `data` to be empty.
- **Correction Needed**:
  - Provide a fallback dataset for demo cases (similar to `HEMRAJ_RADAR_DATA` in `Home.tsx`) inside `DynamicDashboardView.tsx` when `stats?.radar` is empty or the API request fails.
  - Add Recharts `<Tooltip />` inside `src/components/charts/ForensicRadar.tsx` so robotic and user hovers display score details for each forensic pillar.

---

### 1.3 Routing & Dashboard View Inconsistency (`Home.tsx` vs `DynamicDashboardView.tsx`)
- **Observed Behavior**: 
  - When visiting `/`, the app renders `Home.tsx`. If a case is selected, `Home.tsx` has its own dashboard implementation (Guided Flow, Recharts radar chart, hearing pills, priority actions).
  - Clicking "Load Demo Case (Hemraj – Synthetic)" in `DemoModeCard` routes the user to `/case/case-01/dashboard`, which renders `DynamicDashboardView.tsx` with a different layout, different charts, and different components.
- **Correction Needed**:
  - Standardize dashboard rendering so both `/` (with active case) and `/case/:id/dashboard` share consistent component logic, metrics, and visual hierarchy.
  - Avoid duplicate definitions of stats and charts between `Home.tsx` and `DynamicDashboardView.tsx`.

---

## 2. Medium-Priority Corrections (P1 / Major)

### 2.1 Bilingual (EN/HI) Label Coverage
- **Observed Behavior**:
  - Top-level hero elements and action cards have Hindi and English translations (e.g., `डेमो मोड / Demo Mode`, `मार्गदर्शित कार्यप्रवाह शुरू करें`).
  - However, several inner dashboard cards, chart legends, table column headers (*"Documents"*, *"Timeline Events"*, *"Senior's Strategy"*), and empty states remain purely English.
- **Correction Needed**:
  - Audit all text strings against the bilingual requirement in Section 4.10 of `MASTER-TESTER-LEGAL.MD`.
  - Wrap hardcoded strings with bilingual helper or localization tokens (`lang === 'hi' ? ... : ...`).

---

### 2.2 Priority Actions & Pending Citations Workflow
- **Observed Behavior**: In `DynamicDashboardView`, citation verification displays `Verified: 1`, `Secondary: 4`, `Pending: 3`.
- **Correction Needed**:
  - Add direct actionable buttons next to `Pending` citations allowing the user to initiate verification or run fact-fit checks directly from the dashboard card.
  - Explicitly display the Fact-Fit Gate export status badge on the dashboard (`EXPORT BLOCKED: 3 PENDING CITATIONS`).

---

### 2.3 Dormant / Roadmap Feature Indicators
- **Observed Behavior**: Links to dormant features (e.g. Citation Graph, Case Similarity, Judge Analytics) in the sidebar or deep links render either blank or generic placeholders.
- **Correction Needed**:
  - Per Section 5 (G4) and Section 7 of `MASTER-TESTER-LEGAL.MD`, wrap dormant routes in a standard `RoadmapFeatureBadge` or `DormantNotice` component clearly explaining that the feature is roadmap-gated, avoiding false-positive bug reports.

---

## 3. Implementation Checklist for Corrections

| ID | Module / File | Required Change | Priority |
|---|---|---|---|
| **FIX-01** | `src/context/AccuracyContext.tsx` | Seed initial metrics for demo cases to eliminate `0.0/10 LOW ACCURACY` false-warning | **P0** |
| **FIX-02** | `src/components/views/DynamicDashboardView.tsx` | Add synthetic fallback data for Radar and Heatmap when API returns empty/null | **P0** |
| **FIX-03** | `src/components/charts/ForensicRadar.tsx` | Add `<Tooltip />` and interactive hover inspection to radar chart | **P1** |
| **FIX-04** | `src/pages/Home.tsx` & `src/routes.tsx` | Align root landing page `/` and `/case/:id/dashboard` layouts to prevent divergence | **P1** |
| **FIX-05** | `src/components/ui/accuracy-badge.tsx` | Ensure bilingual label rendering (`अति महत्वपूर्ण सटीकता` vs `उच्च सटीकता`) follows active language state | **P2** |
| **FIX-06** | `src/components/views/DynamicDashboardView.tsx` | Add Fact-Fit Gate export status alert on dashboard showing citations blocking export | **P1** |

---

## Conclusion
Resolving **FIX-01**, **FIX-02**, and **FIX-03** will ensure that pre-loaded demo cases present rich, accurate data with interactive charts and proper accuracy badges immediately upon loading, aligning the app with the standards in `MASTER-TESTER-LEGAL.MD`.
