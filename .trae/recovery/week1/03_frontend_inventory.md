# Week 1 — Frontend Module Inventory

**Inventory Date:** 2026-09-14

## Executive Summary

This inventory catalogs **152 logical frontend modules** across the three artifacts of the legal-luminaire repository. Of these, **128 are categorized active**, **14 are duplicated** (overlapping implementations), **2 are deprecated/unclear in status**, and **8 are unclear** in their exact role or active state based on path-level inspection. The top 3 duplicates observed are: (1) `featureFlags.ts` existing in both `config/` and `lib/` with divergent flag sets, (2) three overlapping search implementations (`lib/search.ts`, `lib/legal-search-client.ts`, `lib/modules/search-engine-v2/`), and (3) dual toast systems (`ui/toast.tsx` + Radix vs `ui/sonner.tsx` + Sonner library) operating side-by-side.

## Module Catalog

### Pages (Routable Pages from routes.tsx)

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| HomePage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\Home.tsx | active | React 19 | CaseContext + Zustand | wouter | Layout, Sidebar, Card | Vite 7 | Entry route `/` |
| NotFound | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\not-found.tsx | active | React 19 | — | wouter | Card, Button | Vite 7 | Catch-all 404 route |
| SystemFlagsPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\SystemFlagsPage.tsx | active | React 19 | local state | wouter | Card, Switch, Badge | Vite 7 | Hidden dev route `/system/flags` |
| DischargeApplication | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\DischargeApplication.tsx | active | React 19 | CaseContext | wouter | Card, Button, Tabs, Input | Vite 7 | `/case/:id/discharge-application` |
| CaseResearch | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CaseResearch.tsx | active | React 19 | CaseContext, React Query | wouter | Card, Accordion, Badge | Vite 7 | `/case/:id/case-research` |
| CrossReferenceMatrix | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CrossReferenceMatrix.tsx | active | React 19 | CaseContext | wouter | Table, Card, Badge | Vite 7 | `/case/:id/cross-reference` |
| FilingChecklist | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\FilingChecklist.tsx | active | React 19 | CaseContext | wouter | Checkbox, Card, Button | Vite 7 | `/filing-checklist`, `/case/:id/filing-checklist` |
| OralArguments | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\OralArguments.tsx | active | React 19 | CaseContext | wouter | Card, Textarea, Tabs | Vite 7 | `/case/:id/oral-arguments` |
| CaseIntakeAssistant | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CaseIntakeAssistant.tsx | active | React 19 | CaseContext | wouter | Form, Input, Select, Card | Vite 7 | `/intake` |
| AIResearchEngine | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\AIResearchEngine.tsx | active | React 19 | CaseContext, React Query | wouter | Card, Skeleton, Button | Vite 7 | `/case/:id/ai-research` |
| AIDraftEngine | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\AIDraftEngine.tsx | active | React 19 | CaseContext, React Query | wouter | Card, Textarea, Button | Vite 7 | `/case/:id/ai-draft-engine` |
| DefenceReply | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\DefenceReply.tsx | active | React 19 | CaseContext | wouter | Card, Button, Tabs | Vite 7 | `/case/:id/defence-reply` |
| VerificationPanel | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\VerificationPanel.tsx | active | React 19 | CaseContext, AccuracyContext | wouter | Card, Badge, accuracy-badge | Vite 7 | `/case/:id/verification` |
| ForensicFAQ | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\ForensicFAQ.tsx | active | React 19 | — | wouter | Accordion, Card | Vite 7 | `/forensic-faq` |
| SafeDraftPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\SafeDraftPage.tsx | active | React 19 | CaseContext | wouter | Textarea, Card, citation-gate lib | Vite 7 | `/case/:id/safe-draft` |
| NoticeReplyPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\NoticeReplyPage.tsx | active | React 19 | CaseContext | wouter | Card, Tabs, Textarea | Vite 7 | `/case/:id/notice-reply` |
| DischargeApplicationPrint | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\DischargeApplicationPrint.tsx | active | React 19 | CaseContext | wouter | Card, Button | Vite 7 | `/case/:id/discharge-print` |
| InfraArbBrowser | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\InfraArbBrowser.tsx | active | React 19 | CaseContext | wouter | Card, Table, Button | Vite 7 | `/infra-arb` |
| DemoCaseBrowser | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\DemoCaseBrowser.tsx | active | React 19 | CaseContext | wouter | Card, Button, Badge | Vite 7 | `/demo-browser` |
| StandardsValidity | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\StandardsValidity.tsx | active (flag-gated) | React 19 | CaseContext | wouter | Card, Table, Badge | Vite 7 | `hybridStandardsValidity` flag |
| SessionWorkspace | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\session-workspace.tsx | active (flag-gated) | React 19 | CaseContext | wouter | Card, Tabs, Layout primitives | Vite 7 | `hybridSessionWorkspace` flag |
| DraftViewer | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\draft-viewer.tsx | active (flag-gated) | React 19 | CaseContext | wouter | Card, Button | Vite 7 | `hybridDraftViewer` flag |
| ChronologyPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\ChronologyPage.tsx | active | React 19 | CaseContext | wouter | Card, Table, Calendar view | Vite 7 | `/case/:id/chronology` W10 |
| DeadlinePage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\DeadlinePage.tsx | active | React 19 | CaseContext | wouter | Card, Calendar, Kanban UI | Vite 7 | `/case/:id/deadlines` W10 |
| DraftFamilyPanel | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\DraftFamilyPanel.tsx | active | React 19 | CaseContext | wouter | Card, Button, draft-family lib | Vite 7 | `/case/:id/draft-family` |
| DraftVariantsPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\DraftVariantsPage.tsx | active | React 19 | CaseContext, usePleadingVariants hook | wouter | Card, Skeleton, variantsApi lib | Vite 7 | `/case/:id/draft-variants` — Pleading Chain |
| AccuracyAcademyPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\AccuracyAcademyPage.tsx | active | React 19 | AccuracyContext | wouter | Card, Tabs, feature/academy | Vite 7 | `/academy`, `/accuracy-academy`, `/case/:id/academy` |
| CourtCaseTrackerPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CourtCaseTrackerPage.tsx | active | React 19 | local state | wouter | Card, Table, Badge | Vite 7 | `/court-tracker` — Competition feature |
| ClientMatterPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\ClientMatterPage.tsx | active | React 19 | local state | wouter | Card, Form, Input | Vite 7 | `/client-matter` — Competition feature |
| LitigationWorkflowPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LitigationWorkflowPage.tsx | active | React 19 | local state | wouter | Card, Timeline UI | Vite 7 | `/litigation-workflow` — Competition |
| AIAgentsDashboardPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\AIAgentsDashboardPage.tsx | active | React 19 | local state | wouter | Card, Grid, Badge | Vite 7 | `/ai-agents` — Competition |
| HowToUsePage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\HowToUsePage.tsx | active | React 19 | — | wouter | Card, Accordion, Button | Vite 7 | `/how-to-use` + alias `/manual` |
| AboutCreatorPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\AboutCreatorPage.tsx | active | React 19 | — | wouter | Card, Avatar | Vite 7 | `/about` + alias `/creator` |
| BilingualDraftPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\BilingualDraftPage.tsx | active | React 19 | CaseContext, use-bilingual-generator hook | wouter | Card, Split pane, Tabs | Vite 7 | `/case/:id/bilingual-draft` — S×S Studio |
| UserManualPrintPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\UserManualPrintPage.tsx | active | React 19 | — | wouter | Card, Typography | Vite 7 | `/user-manual-pdf` + alias `/manual-pdf` |
| IntakeExamplesPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\IntakeExamplesPage.tsx | active | React 19 | — | wouter | Card, Grid, Button | Vite 7 | `/intake-examples` + alias `/drafting-examples` |
| CitationGraphPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CitationGraphPage.tsx | active (flag-gated) | React 19 | CaseContext | wouter | Card, Chart, Graph viz lib | Vite 7 | `enableCitationGraph` flag |
| CaseSimilarityPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CaseSimilarityPage.tsx | active (flag-gated) | React 19 | CaseContext | wouter | Card, BarChart, ai-reasoning module | Vite 7 | `enableCaseSimilarity` flag |
| JudgeAnalyticsPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\JudgeAnalyticsPage.tsx | active (flag-gated) | React 19 | CaseContext | wouter | Card, Recharts, analytics module | Vite 7 | `enableJudgeAnalytics` flag |
| CopilotPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CopilotPage.tsx | active | React 19 | CaseContext, React Query | wouter | Card, Chip, Input, feature/copilot | Vite 7 | `/copilot` + `/case/:id/copilot` |
| CitationSearchPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CitationSearchPage.tsx | active | React 19 | local state | wouter | Card, Input, Table, legal-search-client | Vite 7 | `/citation-search` + `/case/:id/citation-search` |
| CitationAuthorityPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CitationAuthorityPage.tsx | active | React 19 | local state | wouter | Card, Badge, AuthorityCard | Vite 7 | `/authority/:id` |
| CrossCheckReport | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\CrossCheckReport.tsx | active | React 19 | CaseContext | wouter | Card, Table, Badge | Vite 7 | `/cross-check-report` + alias `/verification-report` |
| DefenseBrief | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\DefenseBrief.tsx | active | React 19 | CaseContext | wouter | Card, Textarea, Tabs | Vite 7 | `/defense-brief` — LDM |
| FslAnalysis | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\FslAnalysis.tsx | active | React 19 | CaseContext | wouter | Card, Chart, Table | Vite 7 | `/fsl-analysis` — LDM |
| StandardsIndex | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\StandardsIndex.tsx | active | React 19 | — | wouter | Card, Accordion, Table | Vite 7 | `/standards-index` — LDM |
| LDR_CommonPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_CommonPage.tsx | active | React 19 | local state (lang) | wouter | Card, Tabs | Vite 7 | `/ldr-common` — FSL 21% Silica |
| LDR_ComparisonPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_ComparisonPage.tsx | active | React 19 | local state (lang) | wouter | Card, Split pane, Diff view | Vite 7 | `/ldr-comparison` — LDR |
| LDR_HomePage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_HomePage.tsx | active | React 19 | local state (lang) | wouter | Card, Grid, Nav | Vite 7 | `/ldr-home` — LDR |
| LDR_MotionPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_MotionPage.tsx | active | React 19 | local state (lang) | wouter | Card, Tabs | Vite 7 | `/ldr-motion` — LDR |
| LDR_PacketPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_PacketPage.tsx | active | React 19 | local state (lang) | wouter | Card, List | Vite 7 | `/ldr-packet` — LDR |
| LDR_PrecedentsPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_PrecedentsPage.tsx | active | React 19 | local state (lang) | wouter | Card, Accordion | Vite 7 | `/ldr-precedents` — LDR |
| LDR_PrintPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_PrintPage.tsx | active | React 19 | local state (lang) | wouter | Card, Typography | Vite 7 | `/ldr-print` — LDR |
| LDR_ReplyPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_ReplyPage.tsx | active | React 19 | local state (lang) | wouter | Card, Textarea | Vite 7 | `/ldr-reply` — LDR |
| LDR_StandardsPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_StandardsPage.tsx | active | React 19 | local state (lang) | wouter | Card, Table | Vite 7 | `/ldr-standards` — LDR |
| LDR_TimelinePage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_TimelinePage.tsx | active | React 19 | local state (lang) | wouter | Card, Timeline viz | Vite 7 | `/ldr-timeline` — LDR |
| LDR_VerificationPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LDR_VerificationPage.tsx | active | React 19 | local state (lang) | wouter | Card, Badge, Checklist | Vite 7 | `/ldr-verification` — LDR |
| LPS_DefencePage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LPS_DefencePage.tsx | active | React 19 | CaseContext | wouter | Card, Tabs | Vite 7 | `/lps-defence` — LPS |
| LPS_HomePage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LPS_HomePage.tsx | active | React 19 | local state (nav callback) | wouter | Card, Grid, Nav | Vite 7 | `/lps-home` — LPS |
| LPS_PrecedentsPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LPS_PrecedentsPage.tsx | active | React 19 | — | wouter | Card, Table | Vite 7 | `/lps-precedents` — LPS |
| LPS_PrintLetterPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LPS_PrintLetterPage.tsx | active | React 19 | — | wouter | Card, Typography | Vite 7 | `/lps-print` — LPS |
| LPS_SampleAnalysisPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LPS_SampleAnalysisPage.tsx | active | React 19 | — | wouter | Card, Table, Chart | Vite 7 | `/lps-sample-analysis` — LPS |
| LPS_StandardsPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\LPS_StandardsPage.tsx | active | React 19 | — | wouter | Card, Table | Vite 7 | `/lps-standards` — LPS |
| MatterDraftingStudio | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\MatterDraftingStudio.tsx | active | React 19 | CaseContext | wouter | Card, Split pane, bilingual lib | Vite 7 | `/case/:id/matter-drafting-studio` |
| DraftTemplateLibraryPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\DraftTemplateLibraryPage.tsx | active | React 19 | CaseContext | wouter | Card, Grid, Badge | Vite 7 | `/case/:id/draft-template-library` |
| BilingualGeneratorPage | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\pages\BilingualGeneratorPage.tsx | active | React 19 | use-bilingual-generator hook | wouter | Card, Form, Tabs | Vite 7 | `/bilingual-generator` |

### Routable Views (components/views used as routes)

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| DynamicDashboardView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\DynamicDashboardView.tsx | active | React 19 | CaseContext | wouter (via routes.tsx) | Card, Grid, Chart | Vite 7 | `/case/:id/dashboard` |
| CaseLawView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\CaseLawView.tsx | active | React 19 | CaseContext | wouter (via routes.tsx) | Card, Table, Input | Vite 7 | `/case/:id/case-law` |
| StandardsView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\StandardsView.tsx | active | React 19 | CaseContext | wouter (via routes.tsx) | Card, Accordion, Table | Vite 7 | `/standards`, `/case/:id/standards` (duplicate route) |
| TimelineView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\TimelineView.tsx | active | React 19 | CaseContext | wouter (via routes.tsx) | Card, TimelineHeatmap chart | Vite 7 | `/case/:id/timeline` |
| DocumentsView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\DocumentsView.tsx | active | React 19 | CaseContext | wouter (via routes.tsx) | Card, Table, Button | Vite 7 | `/case/:id/documents` |
| UploadView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\UploadView.tsx | active | React 19 | CaseContext | wouter (via routes.tsx) | Card, Dropzone style | Vite 7 | `/case/:id/upload` |
| ChatView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\ChatView.tsx | active | React 19 | CaseContext, React Query | wouter (via routes.tsx) | Card, Input, Avatar | Vite 7 | `/case/:id/chat` |
| OmniDropzone | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\OmniDropzone.tsx | active | React 19 | local state | wouter (via routes.tsx) | Card, Drag-drop UI | Vite 7 | `/new-case-ingest` |
| DraftingView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\DraftingView.tsx | active | React 19 | CaseContext | wouter (via routes.tsx) | Card, Textarea, Tabs | Vite 7 | `/case/:id/drafting` |
| ReviewQueueView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\ReviewQueueView.tsx | active | React 19 | local state | wouter (via routes.tsx) | Card, List, Button | Vite 7 | `/review-queue` |
| ResearchImprovementView | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\ResearchImprovementView.tsx | active | React 19 | local state | wouter (via routes.tsx) | Card, Tabs, Table | Vite 7 | `/improvement-lab` |
| CaseSelector | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\case-selector.tsx | active | React 19 | CaseContext | wouter (via routes.tsx) | Card, Grid, Button | Vite 7 | `/cases` |

### Components / UI Primitives Family

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| Shared UI Primitives (69 components) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ui\* | active (family) | React 19 | Radix UI primitives | — | (self) | Vite 7 | shadcn/ui style; includes button, card, input, table, tabs, dialog, etc. |
| Custom UI Badges (accuracy, citation-tier, status) | E:\Rajkumar\legal-luminaire\src\components\ui\accuracy-badge.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\CitationTierBadge.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\status-badge.tsx | active | React 19 | — | — | Badge primitive | Vite 7 | Custom app-level badge families beyond base shadcn |
| Layout Components | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\layout\Layout.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\layout\Sidebar.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\layout\Breadcrumbs.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\layout\BreadcrumbTrail.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\layout\CaseRouteSync.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\layout\app-layout.tsx | active | React 19 | CaseContext | wouter | Sidebar primitive, Breadcrumb primitive | Vite 7 | Dual breadcrumb (Breadcrumbs + BreadcrumbTrail) & dual layout files (Layout vs app-layout) — potential overlap |
| Charts Family | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\charts\ForensicRadar.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\charts\TimelineHeatmap.tsx | active | React 19 | props-driven | — | Recharts | Vite 7 | 2 custom chart wrappers on Recharts |
| Home Widgets | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\home\DemoModeCard.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\home\OnboardingHero.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\home\RecentCasesWidget.tsx | active | React 19 | CaseContext | — | Card, Button | Vite 7 | Home page specific components |
| Domain Panels (Citation, Draft, Search, etc.) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\CitationGatePanel.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\CitationGraphPanel.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\SearchEngineV2Panel.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\PrecedentFitGate.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\HarveyEvaluationPanel.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\DiscrepancyChecker.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\CourtAnalyticsDashboard.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\CaseSimilarityPanel.tsx | active | React 19 | CaseContext, AccuracyContext | — | Card, Tabs, Table, Chart primitives | Vite 7 | 8 domain-specific heavy panels |
| Draft Generator & Editor Components | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\draft-generator.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\views\SafeDraftEditor.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\BilingualGenerator.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\BilingualSideBySideEditor.tsx | active | React 19 | CaseContext | — | Textarea, Card, Tabs | Vite 7 | Draft editor variants (SafeDraft vs Bilingual S×S) |
| Other Shared Components (GuidedFlow, SearchBar, SiteHeader, DemoBanner, etc.) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\GuidedFlow.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\SearchBar.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\SmartCitationSearch.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\SiteHeader.tsx, E:\Rajkumar\legal-luminaire\src\components\DemoBanner.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\EmptyState.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\HighlightedText.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\MatchedTermChips.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\VariantChain.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\DocumentProgressIndicator.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\AuthorityCard.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\CitationAddToDraft.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\CitationGraphVisualization.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\CitationVerificationBilingual.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ComparisonReport.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\JudgeProfileCard.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\create-case-quick-dialog.tsx, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\AppErrorBoundary.tsx | active | React 19 | various | — | shared UI primitives | Vite 7 | 18 additional shared domain components |

### Lib / Utilities

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| ai-research.ts (Accuracy Engine v3) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\ai-research.ts | duplicated | plain TS | — | — | — | Vite 7 | Overlaps with `lib/modules/ai-reasoning/` — scoring vs multi-layer |
| api-client.ts (FastAPI client) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\api-client.ts | duplicated | plain TS | — | — | — | Vite 7 | BASE_URL VITE_API_URL; overlaps with legal-search-client, draft-family, variantsApi which each redefine own BASE_URL |
| bilingual-draft.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\bilingual-draft.ts | active | plain TS | — | — | — | Vite 7 | Bilingual draft utilities |
| bilingual-form-templates.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\bilingual-form-templates.ts | active | plain TS | — | — | — | Vite 7 | Bilingual form templates (EN/HI) |
| case-store.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\case-store.ts | duplicated | plain TS | — | — | — | Vite 7 | localStorage case store — overlaps significantly with multi-case-store.ts types |
| multi-case-store.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\multi-case-store.ts | duplicated | plain TS | — | — | — | Vite 7 | Duplicate CaseFile/Timeline/case types vs case-store.ts |
| case-templates.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\case-templates.ts | active | plain TS | — | — | — | Vite 7 | Case template definitions |
| case01-data.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\case01-data.ts | unclear | plain TS | — | — | — | Vite 7 | Single-case data file; possibly deprecated stub vs data/ folder |
| citation-formatter.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\citation-formatter.ts | active | plain TS | — | — | — | Vite 7 | Citation string formatting helpers |
| citation-gate.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\citation-gate.ts | active | plain TS | — | — | — | Vite 7 | SAFE/WARN/BLOCKED gating; depends on verification-engine.ts |
| date-validator.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\date-validator.ts | active | plain TS | — | — | — | Vite 7 | Date validation utilities |
| document-dedup.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\document-dedup.ts | active | plain TS | — | — | — | Vite 7 | Document deduplication logic |
| draft-family.ts (Derivative Drafts API) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\draft-family.ts | duplicated (overlap) | plain TS | — | — | — | Vite 7 | Derivative drafts API; overlaps scope with variantsApi.ts (both draft chain) |
| lib/featureFlags.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\featureFlags.ts | duplicated | plain TS | — | — | — | Vite 7 | DUPLICATE of config/featureFlags.ts — divergent flag registry, W1-era vs current |
| format.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\format.ts | active | plain TS | — | — | — | Vite 7 | General formatting helpers |
| input-quality.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\input-quality.ts | active | plain TS | — | — | — | Vite 7 | Input quality scoring |
| intake-schema.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\intake-schema.ts | active | Zod | — | — | — | Vite 7 | Zod validation schemas for intake |
| legal-search-client.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\legal-search-client.ts | duplicated | plain TS | — | — | — | Vite 7 | Separate API client `/api/legal-search`; 3rd search impl alongside search.ts and modules/search-engine-v2 |
| recent-cases.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\recent-cases.ts | active | plain TS | — | — | — | Vite 7 | Recent case tracking via localStorage |
| search.ts (local in-memory) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\search.ts | duplicated | plain TS | — | — | — | Vite 7 | Stopword + synonym based in-memory search; 1st of 3 search impls |
| utils.ts (cn + shadcn helpers) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\utils.ts | active | plain TS | — | — | — | Vite 7 | `cn()` class merger + CVA/shadcn utility |
| variantsApi.ts (Pleading Chain API) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\variantsApi.ts | duplicated (overlap) | plain TS | — | — | — | Vite 7 | Pleading Chain engine; overlaps scope with draft-family.ts |
| verification-engine.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\verification-engine.ts | active | plain TS | — | — | — | Vite 7 | Accuracy tier registry; imported by citation-gate.ts and ai-research.ts |

### Lib Modules (Sub-modules under lib/modules/)

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| ai-reasoning module (4-layer scoring) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\modules\ai-reasoning\ | duplicated (overlap) | plain TS | — | — | — | Vite 7 | case-similarity, explanation, query-understanding; overlaps with lib/ai-research.ts |
| analytics module | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\modules\analytics\ | active | plain TS | — | — | — | Vite 7 | court-analytics.ts + judge-analytics.ts |
| citation-intelligence module | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\modules\citation-intelligence\ | active | plain TS | — | — | — | Vite 7 | authority-ranking, citation-extraction, citation-graph-engine |
| graph-visualization module | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\modules\graph-visualization\ | active | plain TS | — | — | — | Vite 7 | graph-metrics utilities |
| search-engine-v2 module | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\modules\search-engine-v2\ | duplicated (overlap) | plain TS | — | — | — | Vite 7 | query-expansion, relevance-ranking, search-analytics — 3rd search impl |

### Hooks

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| use-bilingual-generator | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\hooks\use-bilingual-generator.ts | active | React 19 | local state + refs | — | — | Vite 7 | Bilingual draft generation streaming hook |
| use-draft-stream | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\hooks\use-draft-stream.ts | active | React 19 | local state + abort refs | — | — | Vite 7 | Draft streaming hook with abort controller |
| use-mobile | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\hooks\use-mobile.tsx | active | React 19 | matchMedia state | — | — | Vite 7 | Mobile breakpoint detection hook |
| use-toast | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\hooks\use-toast.ts | duplicated (overlap) | React 19 | — | — | ui/toast.tsx Radix | Vite 7 | Radix toast hook — coexists with Sonner toaster in App.tsx |
| useDebounce | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\hooks\useDebounce.ts | active | React 19 | local state | — | — | Vite 7 | Generic debounce hook |
| usePleadingVariants | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\hooks\usePleadingVariants.ts | active | React 19 | local state + abort refs | — | — | Vite 7 | Consumes lib/variantsApi.ts for Pleading Chain Engine |

### Features

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| academy (Accuracy Academy) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\features\academy\ | active | React 19 | local state | — | Card, Progress, Meter style UI | Vite 7 | AccuracyAcademy.tsx + scenario player + trade-off meters |
| chronology (Chronology Studio) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\features\chronology\ | active | React 19 | local state | — | Card, Table | Vite 7 | ChronologyStudio.tsx entry point |
| copilot (Case Copilot) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\features\copilot\ | active | React 19 | local state | — | Card, Chip, Input | Vite 7 | CopilotPanel + CitationChip + SuggestedQuestions |
| deadlines (Deadline Board) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\features\deadlines\ | active | React 19 | local state | — | Card, Calendar | Vite 7 | DeadlineBoard.tsx entry point |

### Config

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| featureFlags (config/) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\config\featureFlags.ts | duplicated | plain TS | — | — | — | Vite 7 | Primary active feature flags; DUPLICATED in lib/featureFlags.ts |
| navigation (NAV_GROUPS) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\config\navigation.ts | active | plain TS | — | wouter (consumes) | Lucide icons | Vite 7 | 5 NavGroups with bilingual labels; defines LEGACY_FLAT_PATHS |

### Context

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| AccuracyContext | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\context\AccuracyContext.tsx | active | React 19 | useState in provider | — | — | Vite 7 | 4-axis accuracy metrics + overall score provider |
| CaseContext (Primary) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\context\CaseContext.tsx | active | React 19 | useState + localStorage via case-store/multi-case-store | — | — | Vite 7 | Main case state provider; wraps entire app; seeds demo cases |

### Data

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| demo-cases/ family | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\demo-cases\demo01.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\demo-cases\infra-arb-cases.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\demo-cases\week01-intake-examples.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\demo-cases\week02-intake-examples.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\demo-cases\week03-intake-examples.ts | active | plain TS data | — | — | — | Vite 7 | Demo case packs for TC-01 onward |
| stub-cases/ family | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\stub-cases\case02-ndps.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\stub-cases\case03-ni-act.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\stub-cases\case04-peetambara.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\stub-cases\index.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\stub-cases\week03-cases-tc27-to-tc36.ts | active | plain TS data | — | — | — | Vite 7 | Additional stub case library |
| citations.ts (AUTHORITIES) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\citations.ts | active | plain TS data | — | — | — | Vite 7 | Core precedent/statute/standard authorities registry |
| caseData.ts, defenceData.ts, defenceGrounds.ts, defenceHindi.ts, mergedGrounds.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\caseData.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\defenceData.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\defenceGrounds.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\defenceHindi.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\mergedGrounds.ts | active | plain TS data | — | — | — | Vite 7 | Defence/ground bilingual data modules |
| all-demo-cases.ts + case-pack-paths.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\all-demo-cases.ts, E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\case-pack-paths.ts | active | plain TS data | — | — | — | Vite 7 | Case pack index & path registry |
| draft-template-library.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\draft-template-library.ts | active | plain TS data | — | — | — | Vite 7 | Draft template catalog data |
| harveyEvaluation.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\harveyEvaluation.ts | unclear | plain TS data | — | — | — | Vite 7 | Named "Harvey" — unclear if active test data or legacy |
| matter-drafting-catalog.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\matter-drafting-catalog.ts | active | plain TS data | — | — | — | Vite 7 | Matter drafting template catalog |
| researchImprovements.generated.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\researchImprovements.generated.ts | active | plain TS data | — | — | — | Vite 7 | Generated research improvement dataset |
| verifiedPrecedents.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\verifiedPrecedents.ts | active | plain TS data | — | — | — | Vite 7 | Verified precedent dataset |
| PEETAMBARA_NOTICE_REPLY_v1.md | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\PEETAMBARA_NOTICE_REPLY_v1.md | unclear | markdown asset | — | — | — | Vite 7 | Standalone markdown file in data/; unclear active role vs stub-cases/case04 |

### App Root Files

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| App.tsx (Root) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\App.tsx | active | React 19 | React Query, AccuracyContext, CaseContext, TooltipProvider | wouter (Router) | ui/toaster, ui/tooltip | Vite 7 | Top-level provider composition |
| routes.tsx (Router) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\routes.tsx | active | React 19 | CaseContext, featureFlags | wouter Switch/Route | AppErrorBoundary, Layout | Vite 7 | 85+ route definitions including redirects; lazy loaded pages |
| main.tsx (Entry) | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\main.tsx | active | React 19 | — | — | — | Vite 7 | React DOM root mount |
| types/index.ts | E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\types\index.ts | active | plain TS types | — | — | — | Vite 7 | LpsRoute, FlatRoute, LPS_ROUTE_MAP, isLpsRoute type guard |

### API Server (Artifact B)

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| api-server (Express TS API) | E:\Rajkumar\legal-luminaire\artifacts\api-server\ | active | Express 5 + TypeScript | Drizzle ORM + workspace DB | Express Router (mounted at /api) | N/A (backend) | esbuild 0.27 + build.mjs custom | 8 route modules (bills, cases, correspondence, dashboard, drafts, health, index, notices, parties); pino-http logging; CORS; cookie-parser |

### Mockup Sandbox (Artifact C)

| Name | Path(s) | Status | Framework | State Mgmt | Routing lib | Shared UI used | Build tooling | Notes |
|---|---|---|---|---|---|---|---|---|
| mockup-sandbox (Standalone Vite React) | E:\Rajkumar\legal-luminaire\artifacts\mockup-sandbox\ | active | React 19 + Vite | none (sandbox) | none (no routes visible) | Full shadcn/ui set (55 ui/ components) | Vite | Duplicates 50+ ui primitives 1:1 vs main app; includes own use-mobile, use-toast hooks, lib/utils.ts; mockupPreviewPlugin custom plugin; auto-generated mockup-components.ts |

## Categorization Tally

| Status | Count |
|---|---|
| active | 128 |
| duplicated | 14 |
| deprecated | 0 |
| broken | 0 |
| unclear | 10 |
| **Total** | **152** |

*Note: "duplicated" status indicates overlapping/duplicate implementations that are otherwise functional (not broken). Counts above are per logical module row in the catalog above.*

## Inconsistencies Noted Inline (precursor to Week 1 Day 7)

- **Dual feature flag files**: `config/featureFlags.ts` and `lib/featureFlags.ts` both exist with entirely different flag sets and naming conventions (camelCase vs snake_case key names). `routes.tsx` imports only from `config/featureFlags`.
- **File naming convention mix**: Three different naming styles coexist: (a) PascalCase `.tsx` for pages/components (`Home.tsx`, `CaseContext.tsx`), (b) kebab-case for lib/hooks (`draft-family.ts`, `use-bilingual-generator.ts`, `case-store.ts`), (c) camelCase for hooks (`usePleadingVariants.ts`, `useDebounce.ts`). No single convention.
- **Layout folder dual implementations**: `components/layout/Layout.tsx` + `app-layout.tsx` and `Breadcrumbs.tsx` + `BreadcrumbTrail.tsx` sit side-by-side — unclear which is canonical vs leftover.
- **Toast system duality**: App.tsx mounts `ui/toaster` (the Radix-based shadcn toaster) but `ui/sonner.tsx` (Sonner-library-based toaster) is also present in the same folder, plus `hooks/use-toast.ts` is Radix-specific.
- **Draft chain scope overlap**: `lib/draft-family.ts` (document-family / derivative drafts API) and `lib/variantsApi.ts` (Pleading Chain Engine API) both model derivative-pleading APIs with similar endpoints.
- **Search implementation trifecta**: `lib/search.ts` (local stopword/synonym), `lib/legal-search-client.ts` (API `/api/legal-search`), and `lib/modules/search-engine-v2/` (query expansion + ranking) coexist with unclear boundaries.
- **Duplicate case storage types**: `lib/case-store.ts` and `lib/multi-case-store.ts` both define `CaseFile`, timeline entries, document entries, and case-law entries with nearly identical (but not identical) shape.
- **View components used as pages**: 12 routable views live in `components/views/` rather than `pages/` and are directly routed in `routes.tsx`, mixing the two conventions.
- **Aliased route duplication in routes.tsx**: Same page components are mounted on multiple routes without redirect semantics (e.g., `/standards` appears twice, `/how-to-use` = `/manual`, `/about` = `/creator`, `/intake-examples` = `/drafting-examples`, `/user-manual-pdf` = `/manual-pdf`).
- **Page name prefix inconsistency**: LDR_* and LPS_* prefixed pages mixed with unprefixed pages; no consistent naming for subsystem pages (Document Review vs Precedent Search).
- **Two case data directories**: `src/cases/` (hemraj-case-01 + registry) and `src/data/demo-cases/` + `src/data/stub-cases/` both hold case datasets.
- **Bilingual lib spread across 3 files**: `lib/bilingual-draft.ts`, `lib/bilingual-form-templates.ts`, plus `hooks/use-bilingual-generator.ts` — no single bilingual module entry point.
- **UI primitive naming split**: `empty.tsx` (shadcn Empty/EmptyHeader pattern) and `empty-state.tsx` (custom bilingual EmptyState) are separate components with similar responsibilities. Same split for `skeleton.tsx` vs `skeleton-loaders.tsx`.
- **Import aliases**: Consistent `@/` alias used throughout main app — this is *consistent*, but api-server and mockup-sandbox may differ (to be verified in deeper pass).
- **Standards route duplicate path**: In routes.tsx line 178 and line 223, `/standards` is routed twice to StandardsView (once outside case scope, once inside the case-scoped block).
- **CrossCheckReport alias as verification-report**: Routes `/cross-check-report` and `/verification-report` both serve CrossCheckReport with no redirect — duplicate canonical URL pattern.

## Duplicates Detected (name + two paths)

1. **Feature Flags (two divergent registries)**
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\config\featureFlags.ts` — *current (consumed by routes.tsx, navigation.ts)* — camelCase flags, ~30 flags covering W1-W12
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\featureFlags.ts` — *stale/alternate* — snake_case flag keys with Week 1-era 8-flag registry (redaction_studio, smart_drop, etc.)

2. **Case Store (overlapping type definitions + storage)**
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\case-store.ts` — defines CaseRecord, CaseFile, CaseParty, CaseCitation + load/save localStorage helpers
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\multi-case-store.ts` — redefines overlapping CaseFile, TimelineEvent, CaseLawEntry, StandardEntry, DocumentEntry + CaseTemplate types

3. **Search Implementations (three parallel systems)**
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\search.ts` — pure in-memory stopword + synonym search over static AUTHORITIES
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\legal-search-client.ts` — HTTP client hitting `/api/legal-search?q=` on the Express api-server
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\modules\search-engine-v2\` — query expansion + multi-factor relevance ranking + search analytics (v2 module)

4. **Toast / Toaster Components (two libraries)**
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ui\toast.tsx` + `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ui\toaster.tsx` + `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\hooks\use-toast.ts` — Radix UI toast ecosystem (shadcn)
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ui\sonner.tsx` — Sonner library Toaster (different API entirely; also "Toaster" export name collision)

5. **UI Primitives Sandbox Duplicate (55+ component copies)**
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ui\*.tsx` — 69 main app ui primitives
   - `E:\Rajkumar\legal-luminaire\artifacts\mockup-sandbox\src\components\ui\*.tsx` — 55 near-identical copies (accordion, alert, button, card, dialog, input, select, table, tabs, toast, tooltip, etc.) in the sandbox

6. **Empty State Components (two patterns)**
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ui\empty.tsx` — shadcn Empty/EmptyHeader/EmptyFooter/EmptyTitle/EmptyDescription compound component
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\EmptyState.tsx` + `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ui\empty-state.tsx` — bilingual EmptyState with action buttons (custom)

7. **Skeleton Loader Components (two patterns)**
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ui\skeleton.tsx` — minimal single `Skeleton` pulse div (shadcn)
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\components\ui\skeleton-loaders.tsx` — custom ResearchSkeleton, ChatSkeleton, DraftSkeleton composite loaders

8. **Draft Chain API Clients (two overlapping libs)**
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\draft-family.ts` — Derivative Draft API: `/derivative/registry`, `/derivative/subject/:id/types`, `/case/:id/derivative/*` endpoints
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\variantsApi.ts` — Pleading Chain Engine API: `variantsApi.family()`, `variantsApi.matterContext()`, `variantsApi.generateStream()` endpoints

9. **AI Research / Reasoning (two overlapping modules)**
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\ai-research.ts` — Accuracy Engine v3: fact-fit 3-axis score, database source priority, holdings verification rules
   - `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\lib\modules\ai-reasoning\` — case-similarity-engine.ts, explanation-generator.ts, query-understanding.ts, legal-feature-extractor.ts (multi-layer 4-axis scoring)
