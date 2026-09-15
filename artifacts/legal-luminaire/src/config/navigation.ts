import React from "react";
import {
  Scale, BookOpen, CheckSquare,
  Home as HomeIcon, FilePlus, FileText,
  LayoutDashboard, MessageSquare, Clock, FlaskConical, Upload, Files, ShieldCheck, Globe, AlertCircle,
  FileSearch, Table2, Brain, Sparkles, Network, BarChart3, GitCompare, Mic, Edit3, GraduationCap,
  Gavel, Users, Zap, Bot, HelpCircle, Bot as Robot, Languages,
} from "lucide-react";
import { featureFlags } from "@/config/featureFlags";

export type NavItem = {
  path: string;
  label: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  caseScoped: boolean;
  badge?: string;
};

export type NavGroupId = "setup" | "research" | "drafting" | "review" | "week04";

export type NavGroup = {
  id: NavGroupId;
  groupLabel: string;
  groupLabelEn: string;
  /** Always visible. Keep to ≤ 5 per group. */
  items: NavItem[];
  /** Behind a "More tools" disclosure — progressive disclosure, not removal. */
  secondary: NavItem[];
};

/**
 * Four-section navigation (Week 2). Every route that used to be a flat sidebar
 * entry still exists — less-used ones live under each group's `secondary` list.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "setup",
    groupLabel: "केस सेटअप / Case Setup",
    groupLabelEn: "Case Setup",
    items: [
      { path: "/",        label: "मुख्य पृष्ठ",    labelEn: "Home",            icon: HomeIcon,        caseScoped: false },
      { path: "/cases",   label: "सभी केस",         labelEn: "All Cases",       icon: Files,           caseScoped: false },
      { path: "/demo-browser", label: "26 डेमो केस", labelEn: "26 Demo Cases",  icon: Globe,           caseScoped: false, badge: "26" },
      { path: "/intake",  label: "नया केस इनटेक",   labelEn: "New Case Intake", icon: FilePlus,        caseScoped: false },
      { path: "/dashboard",   label: "डैशबोर्ड",       labelEn: "Dashboard",          icon: LayoutDashboard, caseScoped: true },
      { path: "/timeline",         label: "टाइमलाइन",  labelEn: "Timeline",         icon: Clock,       caseScoped: true },
    ],
    secondary: [
      { path: "/new-case-ingest", label: "AI केस इंजेस्ट", labelEn: "AI Case Ingest", icon: Upload,   caseScoped: false },
      { path: "/upload",           label: "अपलोड",      labelEn: "Upload",           icon: Upload,      caseScoped: true },
      { path: "/documents",        label: "दस्तावेज़",  labelEn: "Documents",        icon: Files,       caseScoped: true },
      { path: "/court-tracker",    label: "कोर्ट ट्रैकर", labelEn: "Court & Case Tracking", icon: Gavel,  caseScoped: false, badge: "NEW" },
      { path: "/client-matter",    label: "मुवक्किल/वाद",  labelEn: "Client & Matter Mgmt", icon: Users,  caseScoped: false, badge: "NEW" },
    ],
  },
  {
    id: "research",
    groupLabel: "शोध / Research",
    groupLabelEn: "Research",
    items: [
      { path: "/case-law",    label: "कानून खोज",      labelEn: "Case Law",         icon: BookOpen,        caseScoped: true },
      { path: "/ai-research", label: "AI शोध इंजन", labelEn: "AI Research",       icon: Brain, caseScoped: true },
      { path: "/standards",   label: "मानक",          labelEn: "Standards",         icon: FlaskConical,    caseScoped: true },
      { path: "/copilot",     label: "AI कोपायलट",    labelEn: "Copilot",          icon: Sparkles,       caseScoped: true },
      { path: "/citation-search", label: "Citation Explorer", labelEn: "Citation Explorer", icon: BookOpen, caseScoped: false, badge: "NEW" },
    ],
    secondary: [
      { path: "/case-research", label: "विधिक शोध", labelEn: "Case Research", icon: FileSearch, caseScoped: true },
      { path: "/cross-reference", label: "क्रॉस-रेफ मैट्रिक्स", labelEn: "Cross-Ref Matrix", icon: Table2, caseScoped: true },
      { path: "/chat",        label: "AI चैट",         labelEn: "AI Chat",            icon: MessageSquare,   caseScoped: true },
      { path: "/lps-home", label: "Precedent Search", labelEn: "Precedent Search", icon: FileSearch, caseScoped: false, badge: "LPS" },
      { path: "/lps-defence", label: "LPS Defence", labelEn: "LPS Defence", icon: ShieldCheck, caseScoped: false, badge: "LPS" },
      { path: "/lps-sample-analysis", label: "नमूना विश्लेषण", labelEn: "Sample Analysis", icon: FlaskConical, caseScoped: false, badge: "LPS" },
      { path: "/ldr-home", label: "डॉक्युमेंट रिव्यू", labelEn: "Document Review", icon: Files, caseScoped: false, badge: "LDR" },
      { path: "/forensic-faq", label: "फॉरेन्सिक FAQ", labelEn: "Forensic FAQ", icon: FlaskConical, caseScoped: false },
      { path: "/standards-index", label: "Standards Index", labelEn: "Standards Index", icon: BookOpen, caseScoped: false, badge: "LDM" },
      { path: "/improvement-lab", label: "Research Lab", labelEn: "Improvement Lab", icon: FileSearch, caseScoped: false, badge: "P2" },
      ...(featureFlags.enableCitationGraph || featureFlags.enableCitationExtraction ? [
        { path: "/citation-graph", label: "Citation Graph", labelEn: "Citation Graph", icon: Network, caseScoped: true, badge: "NEW" as const },
      ] : []),
      ...(featureFlags.enableCaseSimilarity || featureFlags.enableQueryUnderstanding ? [
        { path: "/case-similarity", label: "Case Similarity", labelEn: "Case Similarity", icon: GitCompare, caseScoped: true, badge: "NEW" as const },
      ] : []),
      ...(featureFlags.enableJudgeAnalytics || featureFlags.enableCourtAnalytics ? [
        { path: "/judge-analytics", label: "Judge Analytics", labelEn: "Judge Analytics", icon: BarChart3, caseScoped: true, badge: "NEW" as const },
      ] : []),
    ],
  },
  {
    id: "drafting",
    groupLabel: "प्रारूपण / Drafting",
    groupLabelEn: "Drafting",
    items: [
      { path: "/bilingual-generator", label: "द्विभाषी जनरेटर", labelEn: "Bilingual Generator", icon: Languages, caseScoped: false, badge: "NEW" },
      { path: "/ai-draft-engine", label: "AI ड्राफ्ट इंजन", labelEn: "AI Draft Engine",    icon: Sparkles, caseScoped: true },
      { path: "/safe-draft",      label: "सेफ ड्राफ्ट",   labelEn: "Safe Draft Editor", icon: ShieldCheck, caseScoped: true, badge: "NEW" },
      { path: "/discharge-application", label: "प्रार्थना-पत्र", labelEn: "Discharge App",   icon: Scale,    caseScoped: true },
      { path: "/oral-arguments", label: "मौखिक बहस",     labelEn: "Oral Arguments",   icon: Mic,      caseScoped: true },
    ],
    secondary: [
      { path: "/drafting",            label: "AI प्रारूप",     labelEn: "AI Drafting",         icon: Edit3,   caseScoped: true },
      { path: "/defence-reply", label: "डिफेंस रिप्लाई", labelEn: "Defence Reply", icon: FileText,        caseScoped: true },
      { path: "/notice-reply", label: "नोटिस रिप्लाई", labelEn: "Notice Reply",       icon: FileText,        caseScoped: true, badge: "NEW" },
      { path: "/discharge-print", label: "डिस्चार्ज PDF", labelEn: "Discharge PDF v5",  icon: Scale,           caseScoped: true, badge: "NEW" },
      { path: "/ldr-motion", label: "Draft Motion", labelEn: "Draft Motion", icon: FilePlus, caseScoped: false, badge: "LDR" },
      { path: "/defense-brief", label: "Defense Brief", labelEn: "Defense Brief", icon: ShieldCheck, caseScoped: false, badge: "LDM" },
      { path: "/infra-arb", label: "इन्फ्रा आर्बिट्रेशन", labelEn: "Infra Arbitration", icon: Scale, caseScoped: false, badge: "NEW" },
    ],
  },
  {
    id: "review",
    groupLabel: "समीक्षा / Review",
    groupLabelEn: "Review",
    items: [
      { path: "/verification",     label: "सत्यापन",    labelEn: "Verification",     icon: ShieldCheck, caseScoped: true },
      { path: "/filing-checklist", label: "चेकलिस्ट",  labelEn: "Filing Checklist", icon: CheckSquare, caseScoped: true },
      { path: "/academy", label: "सटीकता अकादमी", labelEn: "Accuracy Academy", icon: GraduationCap, caseScoped: false, badge: "W12" },
      { path: "/ai-agents",        label: "AI एजेंट",    labelEn: "AI Agents",        icon: Robot,         caseScoped: false, badge: "NEW" },
      { path: "/how-to-use",    label: "उपयोग मार्गदर्शिका", labelEn: "How To Use", icon: HelpCircle, caseScoped: false, badge: "NEW" },
    ],
    secondary: [
      { path: "/review-queue", label: "चेंबर समीक्षा", labelEn: "Review Queue", icon: FilePlus, caseScoped: false, badge: "3" },
      { path: "/litigation-workflow", label: "वर्कफ्लो ऑटोमेशन", labelEn: "Workflow Automation", icon: Zap, caseScoped: false, badge: "NEW" },
      { path: "/cross-check-report", label: "Cross Check", labelEn: "Cross Check", icon: CheckSquare, caseScoped: false, badge: "LDM" },
      { path: "/fsl-analysis", label: "FSL Analysis", labelEn: "FSL Analysis", icon: FlaskConical, caseScoped: false, badge: "LDM" },
      { path: "/ldr-comparison", label: "Doc Compare", labelEn: "Doc Compare", icon: GitCompare, caseScoped: false, badge: "LDR" },
      { path: "/intake-examples", label: "इनटेक उदाहरण W01", labelEn: "Drafting Intake Examples", icon: BookOpen, caseScoped: false, badge: "W01" },
      { path: "/about",         label: "निर्माता के बारे में", labelEn: "About the Creator", icon: Users,      caseScoped: false, badge: "NEW" },
      ...(featureFlags.hybridStandardsValidity ? [
        { path: "/standards-validity", label: "मानक वैधता", labelEn: "Standards Validity", icon: AlertCircle, caseScoped: true, badge: "NEW" as const },
      ] : []),
      ...(featureFlags.hybridSessionWorkspace ? [
        { path: "/session-workspace", label: "कार्यस्थान", labelEn: "Hybrid Workspace", icon: LayoutDashboard, caseScoped: true, badge: "BETA" as const },
      ] : []),
    ],
  },
  {
    id: "week04",
    groupLabel: "सप्ताह 04 – एंटिग्रैविटी",
    groupLabelEn: "Week 04 – Antigravity",
    items: [
      { path: "/example33", label: "उदाहरण 33 – Sale Deed", labelEn: "Example 33 – Sale Deed", icon: Scale, caseScoped: false },
      { path: "/example34", label: "उदाहरण 34 – Commercial Lease", labelEn: "Example 34 – Commercial Lease", icon: HomeIcon, caseScoped: false },
      { path: "/example35", label: "उदाहरण 35 – Mortgage", labelEn: "Example 35 – Mortgage", icon: Scale, caseScoped: false },
      { path: "/example36", label: "उदाहरण 36 – Gift Deed", labelEn: "Example 36 – Gift Deed", icon: Scale, caseScoped: false },
      { path: "/example37", label: "उदाहरण 37 – Will", labelEn: "Example 37 – Will", icon: Gavel, caseScoped: false },
      { path: "/example38", label: "उदाहरण 38 – POA", labelEn: "Example 38 – POA", icon: Scale, caseScoped: false },
      { path: "/example39", label: "उदाहरण 39 – Partnership", labelEn: "Example 39 – Partnership", icon: Users, caseScoped: false },
      { path: "/example40", label: "उदाहरण 40 – Dissolution", labelEn: "Example 40 – Dissolution", icon: Gavel, caseScoped: false },
      { path: "/example41", label: "उदाहरण 41 – NDA & IP", labelEn: "Example 41 – NDA & IP", icon: ShieldCheck, caseScoped: false }
    ],
    secondary: []
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => [...g.items, ...g.secondary]);

/** Case-scoped paths that historically existed as flat routes — kept alive as redirects. */
export const LEGACY_FLAT_PATHS: string[] = ALL_NAV_ITEMS.filter((i) => i.caseScoped).map((i) => i.path);

export function findNavGroup(item: NavItem): NavGroup | undefined {
  return NAV_GROUPS.find((g) => g.items.includes(item) || g.secondary.includes(item));
}
