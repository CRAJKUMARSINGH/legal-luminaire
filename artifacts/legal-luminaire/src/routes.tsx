import React, { Suspense, lazy, useState, type ComponentType, type ReactNode } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { useCaseContext } from "@/context/CaseContext";
import { featureFlags } from "@/config/featureFlags";
import { LEGACY_FLAT_PATHS } from "@/config/navigation";
import { Layout } from "@/components/layout/Layout";
import type { LpsRoute, FlatRoute } from "@/types";
import { isLpsRoute, LPS_ROUTE_MAP } from "@/types";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";

// Lazy load components for code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
// Week 1 — hidden /system/flags dev route (bilingual flag inspector)
// Works under Netlify SPA redirects (/* → /index.html 200).
const SystemFlagsPage = lazy(() => import("@/pages/SystemFlagsPage"));
const Home = lazy(() => import("@/pages/Home"));
const DischargeApplication = lazy(() => import("@/pages/DischargeApplication"));
const CaseResearch = lazy(() => import("@/pages/CaseResearch"));
const CrossReferenceMatrix = lazy(() => import("@/pages/CrossReferenceMatrix"));
const FilingChecklist = lazy(() => import("@/pages/FilingChecklist"));
const OralArguments = lazy(() => import("@/pages/OralArguments"));
const CaseIntakeAssistant = lazy(() => import("@/pages/CaseIntakeAssistant"));
const AIResearchEngine = lazy(() => import("@/pages/AIResearchEngine"));
const AIDraftEngine = lazy(() => import("@/pages/AIDraftEngine"));
const DefenceReply = lazy(() => import("@/pages/DefenceReply"));
const VerificationPanel = lazy(() => import("@/pages/VerificationPanel"));
const ForensicFAQ = lazy(() => import("@/pages/ForensicFAQ"));
const SafeDraftPage = lazy(() => import("@/pages/SafeDraftPage"));
const NoticeReplyPage = lazy(() => import("@/pages/NoticeReplyPage"));
const DischargeApplicationPrint = lazy(() => import("@/pages/DischargeApplicationPrint"));
const InfraArbBrowser = lazy(() => import("@/pages/InfraArbBrowser"));
const DemoCaseBrowser = lazy(() => import("@/pages/DemoCaseBrowser"));
const StandardsValidity = lazy(() => import("@/pages/StandardsValidity"));
const SessionWorkspace = lazy(() => import("@/pages/session-workspace"));
const DraftViewer = lazy(() => import("@/pages/draft-viewer"));
// Week 10: Chronology Studio & Deadline Board
const ChronologyPage = lazy(() => import("@/pages/ChronologyPage"));
const DeadlinePage = lazy(() => import("@/pages/DeadlinePage"));
// Week 12: Accuracy Academy
const AccuracyAcademyPage = lazy(() => import("@/pages/AccuracyAcademyPage"));

// Statutory Competition Features (statutory feature parity)
const CourtCaseTrackerPage    = lazy(() => import("@/pages/CourtCaseTrackerPage"));
const ClientMatterPage        = lazy(() => import("@/pages/ClientMatterPage"));
const LitigationWorkflowPage  = lazy(() => import("@/pages/LitigationWorkflowPage"));
const AIAgentsDashboardPage   = lazy(() => import("@/pages/AIAgentsDashboardPage"));
const HowToUsePage            = lazy(() => import("@/pages/HowToUsePage"));
const AboutCreatorPage        = lazy(() => import("@/pages/AboutCreatorPage"));
// Bilingual Generator
const BilingualGeneratorPage  = lazy(() => import("@/pages/BilingualGeneratorPage").then(module => ({ default: module.BilingualGeneratorPage })));
const UserManualPrintPage     = lazy(() => import("@/pages/UserManualPrintPage"));
// Week 01 Kiro — Drafting Intake Examples EX-001..EX-011
const IntakeExamplesPage      = lazy(() => import("@/pages/IntakeExamplesPage"));

// Phase 3-6 Intelligence Pages
const CitationGraphPage = lazy(() => import("@/pages/CitationGraphPage"));
const CaseSimilarityPage = lazy(() => import("@/pages/CaseSimilarityPage"));
const JudgeAnalyticsPage = lazy(() => import("@/pages/JudgeAnalyticsPage"));
const CopilotPage = lazy(() => import("@/pages/CopilotPage").then(m => ({ default: m.CopilotPage })));

// Citation-Explorer merge
const CitationSearchPage = lazy(() => import("@/pages/CitationSearchPage"));
const CitationAuthorityPage = lazy(() => import("@/pages/CitationAuthorityPage"));

// Defense Master Pages
const CrossCheckReport = lazy(() => import("@/pages/CrossCheckReport"));
const DefenseBrief = lazy(() => import("@/pages/DefenseBrief"));
const FslAnalysis = lazy(() => import("@/pages/FslAnalysis"));
const StandardsIndex = lazy(() => import("@/pages/StandardsIndex"));

// Document Review Pages
const LDR_ComparisonPage = lazy(() => import("@/pages/LDR_ComparisonPage"));
const LDR_HomePage = lazy(() => import("@/pages/LDR_HomePage"));
const LDR_MotionPage = lazy(() => import("@/pages/LDR_MotionPage"));
const LDR_PacketPage = lazy(() => import("@/pages/LDR_PacketPage"));
const LDR_PrecedentsPage = lazy(() => import("@/pages/LDR_PrecedentsPage"));
const LDR_PrintPage = lazy(() => import("@/pages/LDR_PrintPage"));
const LDR_ReplyPage = lazy(() => import("@/pages/LDR_ReplyPage"));
const LDR_StandardsPage = lazy(() => import("@/pages/LDR_StandardsPage"));
const LDR_TimelinePage = lazy(() => import("@/pages/LDR_TimelinePage"));
const LDR_VerificationPage = lazy(() => import("@/pages/LDR_VerificationPage"));

// Precedent Search Pages
const LPS_DefencePage = lazy(() => import("@/pages/LPS_DefencePage"));
const LPS_HomePage = lazy(() => import("@/pages/LPS_HomePage"));
const LPS_PrecedentsPage = lazy(() => import("@/pages/LPS_PrecedentsPage"));
const LPS_PrintLetterPage = lazy(() => import("@/pages/LPS_PrintLetterPage"));
const LPS_SampleAnalysisPage = lazy(() => import("@/pages/LPS_SampleAnalysisPage"));
const LPS_StandardsPage = lazy(() => import("@/pages/LPS_StandardsPage"));

// Lazy load heavy view components
const DynamicDashboardView = lazy(() => import("@/components/views/DynamicDashboardView").then(module => ({ default: module.DynamicDashboardView })));
const CaseSelector = lazy(() => import("@/components/case-selector").then(module => ({ default: module.CaseSelector })));
const CaseLawView = lazy(() => import("@/components/views/CaseLawView").then(module => ({ default: module.CaseLawView })));
const StandardsView = lazy(() => import("@/components/views/StandardsView").then(module => ({ default: module.StandardsView })));
const TimelineView = lazy(() => import("@/components/views/TimelineView").then(module => ({ default: module.TimelineView })));
const DocumentsView = lazy(() => import("@/components/views/DocumentsView").then(module => ({ default: module.DocumentsView })));
const UploadView = lazy(() => import("@/components/views/UploadView").then(module => ({ default: module.UploadView })));
const ChatView = lazy(() => import("@/components/views/ChatView").then(module => ({ default: module.ChatView })));
const OmniDropzone = lazy(() => import("@/components/views/OmniDropzone").then(module => ({ default: module.OmniDropzone })));
const DraftingView = lazy(() => import("@/components/views/DraftingView").then(module => ({ default: module.DraftingView })));
const ReviewQueueView = lazy(() => import("@/components/views/ReviewQueueView").then(module => ({ default: module.ReviewQueueView })));
const ResearchImprovementView = lazy(() => import("@/components/views/ResearchImprovementView").then(module => ({ default: module.ResearchImprovementView })));

// Loading fallback component
const LoadingFallback = (): React.JSX.Element => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

type SafePageProps = Record<string, unknown>;
function SafePage<T extends SafePageProps>(
  Comp: ComponentType<T>,
  componentName?: string
): (props: T) => ReactNode {
  return (props: T) => (
    <AppErrorBoundary
      componentName={componentName || Comp.displayName || Comp.name || "PageComponent"}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Comp {...props} />
      </Suspense>
    </AppErrorBoundary>
  );
}
function Wrap<T extends SafePageProps>(
  node: ReactNode,
  componentName: string
): ReactNode {
  return (
    <AppErrorBoundary componentName={componentName}>
      <Suspense fallback={<LoadingFallback />}>{node}</Suspense>
    </AppErrorBoundary>
  );
}

export function Router() {
  const { selectedCase } = useCaseContext();
  const [, setLocation] = useLocation();
  const [ldrLang, setLdrLang] = useState<"en" | "hi" | "both">("both");

  const handleLpsNavigate = (route: string) => {
    // isLpsRoute narrows to LpsRoute — no unsafe `as` cast needed
    if (isLpsRoute(route)) {
      const dest: FlatRoute = LPS_ROUTE_MAP[route];
      setLocation(dest);
    }
    // Unknown route values are silently ignored (defensive — callers should
    // only pass LpsRoute values but external data cannot be guaranteed)
  };

  return (
    <AppErrorBoundary componentName="RootLayout">
      <Layout>
        <Switch>
          <Route path="/" component={() => Wrap(<Home />, "HomePage")} />
          {/* Week 1 — hidden dev route: bilingual feature-flag inspector */}
          <Route path="/system/flags" component={() => Wrap(<SystemFlagsPage />, "SystemFlagsPage")} />
          <Route path="/cases" component={() => <div className="p-6">{Wrap(<CaseSelector />, "CaseSelector")}</div>} />
          <Route path="/intake" component={() => Wrap(<CaseIntakeAssistant />, "CaseIntakeAssistant")} />
          <Route path="/new-case-ingest" component={() => Wrap(<OmniDropzone />, "OmniDropzone")} />
          <Route path="/review-queue" component={() => <div className="p-0">{Wrap(<ReviewQueueView />, "ReviewQueueView")}</div>} />
          <Route path="/improvement-lab" component={() => <div className="p-0">{Wrap(<ResearchImprovementView />, "ResearchImprovementView")}</div>} />
          <Route path="/forensic-faq" component={() => Wrap(<ForensicFAQ />, "ForensicFAQ")} />
          <Route path="/infra-arb" component={() => Wrap(<InfraArbBrowser />, "InfraArbBrowser")} />
          <Route path="/demo-browser" component={() => Wrap(<DemoCaseBrowser />, "DemoCaseBrowser")} />
          <Route path="/citation-search" component={() => Wrap(<CitationSearchPage />, "CitationSearchPage")} />
          <Route path="/authority/:id" component={() => Wrap(<CitationAuthorityPage />, "CitationAuthorityPage")} />
          <Route path="/copilot" component={() => Wrap(<CopilotPage />, "CopilotPage")} />
          <Route path="/standards" component={() => <div className="p-0">{Wrap(<StandardsView />, "StandardsView")}</div>} />

          {/* Defense Master Routes */}
          <Route path="/cross-check-report" component={() => Wrap(<CrossCheckReport />, "CrossCheckReport")} />
          <Route path="/verification-report" component={() => Wrap(<CrossCheckReport />, "CrossCheckReport")} />
          <Route path="/defense-brief" component={() => Wrap(<DefenseBrief />, "DefenseBrief")} />
          <Route path="/fsl-analysis" component={() => Wrap(<FslAnalysis />, "FslAnalysis")} />
          <Route path="/standards-index" component={() => Wrap(<StandardsIndex />, "StandardsIndex")} />
          <Route path="/filing-checklist" component={() => Wrap(<FilingChecklist />, "FilingChecklist")} />

          {/* Legacy flat case routes (e.g. /dashboard) → redirect into the active case. */}
          {LEGACY_FLAT_PATHS.map((p) => (
            <Route key={p} path={p} component={() => <Redirect to={`/case/${selectedCase.id}${p}`} replace />} />
          ))}

          {/* Document Review Routes */}
          <Route path="/ldr-home" component={() => Wrap(<LDR_HomePage lang={ldrLang} />, "LDR_HomePage")} />
          <Route path="/ldr-comparison" component={() => Wrap(<LDR_ComparisonPage lang={ldrLang} />, "LDR_ComparisonPage")} />
          <Route path="/ldr-motion" component={() => Wrap(<LDR_MotionPage lang={ldrLang} />, "LDR_MotionPage")} />
          <Route path="/ldr-packet" component={() => Wrap(<LDR_PacketPage packetId="A" lang={ldrLang} />, "LDR_PacketPage")} />
          <Route path="/ldr-precedents" component={() => Wrap(<LDR_PrecedentsPage lang={ldrLang} />, "LDR_PrecedentsPage")} />
          <Route path="/ldr-print" component={() => Wrap(<LDR_PrintPage lang={ldrLang} />, "LDR_PrintPage")} />
          <Route path="/ldr-reply" component={() => Wrap(<LDR_ReplyPage lang={ldrLang} />, "LDR_ReplyPage")} />
          <Route path="/ldr-standards" component={() => Wrap(<LDR_StandardsPage />, "LDR_StandardsPage")} />
          <Route path="/ldr-timeline" component={() => Wrap(<LDR_TimelinePage lang={ldrLang} />, "LDR_TimelinePage")} />
          <Route path="/ldr-verification" component={() => Wrap(<LDR_VerificationPage />, "LDR_VerificationPage")} />

          {/* Precedent Search Routes */}
          <Route path="/lps-home" component={() => Wrap(<LPS_HomePage onNavigate={handleLpsNavigate} />, "LPS_HomePage")} />
          <Route path="/lps-defence" component={() => Wrap(<LPS_DefencePage />, "LPS_DefencePage")} />
          <Route path="/lps-precedents" component={() => Wrap(<LPS_PrecedentsPage />, "LPS_PrecedentsPage")} />
          <Route path="/lps-print" component={() => Wrap(<LPS_PrintLetterPage />, "LPS_PrintLetterPage")} />
          <Route path="/lps-sample-analysis" component={() => Wrap(<LPS_SampleAnalysisPage />, "LPS_SampleAnalysisPage")} />
          <Route path="/lps-standards" component={() => Wrap(<LPS_StandardsPage />, "LPS_StandardsPage")} />

          {/* Case-scoped routes */}
          <Route path="/case/:id/copilot"               component={() => Wrap(<CopilotPage />, "CopilotPage")} />
          <Route path="/case/:id/citation-search"       component={() => Wrap(<CitationSearchPage />, "CitationSearchPage")} />
          <Route path="/case/:id/dashboard"             component={() => <div className="p-6">{Wrap(<DynamicDashboardView />, "DynamicDashboardView")}</div>} />
          <Route path="/case/:id/chat"                  component={() => <div className="flex flex-col h-full">{Wrap(<ChatView />, "ChatView")}</div>} />
          <Route path="/case/:id/case-law"              component={() => <div className="p-0">{Wrap(<CaseLawView />, "CaseLawView")}</div>} />
          <Route path="/case/:id/case-research"         component={() => Wrap(<CaseResearch />, "CaseResearch")} />
          <Route path="/case/:id/cross-reference"       component={() => Wrap(<CrossReferenceMatrix />, "CrossReferenceMatrix")} />
          <Route path="/case/:id/ai-research"           component={() => Wrap(<AIResearchEngine />, "AIResearchEngine")} />
          <Route path="/case/:id/ai-draft-engine"       component={() => Wrap(<AIDraftEngine />, "AIDraftEngine")} />
          <Route path="/standards"                 component={() => <div className="p-0">{Wrap(<StandardsView />, "StandardsView")}</div>} />
          <Route path="/case/:id/standards"             component={() => <div className="p-0">{Wrap(<StandardsView />, "StandardsView")}</div>} />
          <Route path="/case/:id/timeline"              component={() => <div className="p-0">{Wrap(<TimelineView />, "TimelineView")}</div>} />
          <Route path="/case/:id/documents"             component={() => <div className="p-0">{Wrap(<DocumentsView />, "DocumentsView")}</div>} />
          <Route path="/case/:id/upload"                component={() => <div className="p-0">{Wrap(<UploadView />, "UploadView")}</div>} />
          <Route path="/case/:id/drafting"              component={() => <div className="p-0">{Wrap(<DraftingView />, "DraftingView")}</div>} />
          <Route path="/case/:id/safe-draft"            component={() => Wrap(<SafeDraftPage />, "SafeDraftPage")} />
          <Route path="/case/:id/notice-reply"          component={() => Wrap(<NoticeReplyPage />, "NoticeReplyPage")} />
          <Route path="/case/:id/discharge-print"       component={() => Wrap(<DischargeApplicationPrint />, "DischargeApplicationPrint")} />
          <Route path="/case/:id/verification"          component={() => Wrap(<VerificationPanel />, "VerificationPanel")} />
          <Route path="/case/:id/filing-checklist"      component={() => Wrap(<FilingChecklist />, "FilingChecklist")} />
          <Route path="/case/:id/discharge-application" component={() => Wrap(<DischargeApplication />, "DischargeApplication")} />
          <Route path="/case/:id/defence-reply"         component={() => Wrap(<DefenceReply />, "DefenceReply")} />
          <Route path="/case/:id/oral-arguments"        component={() => Wrap(<OralArguments />, "OralArguments")} />
          {/* Week 10: Chronology Studio & Deadline Board */}
          <Route path="/case/:id/chronology"           component={() => Wrap(<ChronologyPage />, "ChronologyPage")} />
          <Route path="/case/:id/deadlines"            component={() => Wrap(<DeadlinePage />, "DeadlinePage")} />
          {/* Week 12: Accuracy Academy */}
          <Route path="/academy"                       component={() => Wrap(<AccuracyAcademyPage />, "AccuracyAcademyPage")} />
          <Route path="/accuracy-academy"              component={() => Wrap(<AccuracyAcademyPage />, "AccuracyAcademyPage")} />
          <Route path="/case/:id/academy"              component={() => Wrap(<AccuracyAcademyPage />, "AccuracyAcademyPage")} />
          {/* Statutory Competition Features */}
          <Route path="/court-tracker"        component={() => Wrap(<CourtCaseTrackerPage />,   "CourtCaseTrackerPage")} />
          <Route path="/client-matter"        component={() => Wrap(<ClientMatterPage />,        "ClientMatterPage")} />
          <Route path="/litigation-workflow"  component={() => Wrap(<LitigationWorkflowPage />,  "LitigationWorkflowPage")} />
          <Route path="/ai-agents"            component={() => Wrap(<AIAgentsDashboardPage />,   "AIAgentsDashboardPage")} />
          <Route path="/how-to-use"           component={() => Wrap(<HowToUsePage />,            "HowToUsePage")} />
          {/* Bilingual Generator */}
          <Route path="/bilingual-generator"  component={() => Wrap(<BilingualGeneratorPage />,  "BilingualGeneratorPage")} />
          <Route path="/manual"               component={() => Wrap(<HowToUsePage />,            "HowToUsePage")} />
          <Route path="/about"                component={() => Wrap(<AboutCreatorPage />,         "AboutCreatorPage")} />
          <Route path="/creator"              component={() => Wrap(<AboutCreatorPage />,         "AboutCreatorPage")} />
          <Route path="/user-manual-pdf"      component={() => Wrap(<UserManualPrintPage />,      "UserManualPrintPage")} />
          <Route path="/manual-pdf"           component={() => Wrap(<UserManualPrintPage />,      "UserManualPrintPage")} />
          {/* Week 01 Kiro — Drafting Intake Examples */}
          <Route path="/intake-examples"      component={() => Wrap(<IntakeExamplesPage />,       "IntakeExamplesPage")} />
          <Route path="/drafting-examples"    component={() => Wrap(<IntakeExamplesPage />,       "IntakeExamplesPage")} />
          {featureFlags.hybridStandardsValidity && (
            <Route path="/case/:id/standards-validity"  component={() => Wrap(<StandardsValidity />, "StandardsValidity")} />
          )}
          {featureFlags.hybridSessionWorkspace && (
            <Route path="/case/:id/session-workspace"   component={() => Wrap(<SessionWorkspace />, "SessionWorkspace")} />
          )}
          {featureFlags.hybridDraftViewer && (
            <Route path="/draft/:id"                    component={() => Wrap(<DraftViewer />, "DraftViewer")} />
          )}
          {(featureFlags.enableCitationGraph || featureFlags.enableCitationExtraction) && (
            <Route path="/case/:id/citation-graph"    component={() => Wrap(<CitationGraphPage />, "CitationGraphPage")} />
          )}
          {(featureFlags.enableCaseSimilarity || featureFlags.enableQueryUnderstanding) && (
            <Route path="/case/:id/case-similarity"   component={() => Wrap(<CaseSimilarityPage />, "CaseSimilarityPage")} />
          )}
          {(featureFlags.enableJudgeAnalytics || featureFlags.enableCourtAnalytics) && (
            <Route path="/case/:id/judge-analytics"   component={() => Wrap(<JudgeAnalyticsPage />, "JudgeAnalyticsPage")} />
          )}
          <Route component={() => Wrap(<NotFound />, "NotFound")} />
        </Switch>
      </Layout>
    </AppErrorBoundary>
  );
}
