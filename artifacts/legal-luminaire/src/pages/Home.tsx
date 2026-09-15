import { useMemo, useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Scale, FileText, BookOpen, FlaskConical, Clock,
  AlertTriangle, CheckCircle2, Info, ArrowRight,
  MessageSquare, LayoutDashboard, Files, Upload, PlayCircle,
  Zap, Target, Printer, ShieldCheck, History, Plus, Sparkles, Edit3,
} from "lucide-react";
import { HarveyEvaluationPanel } from "@/components/HarveyEvaluationPanel";
import { GuidedFlow } from "@/components/GuidedFlow";
import { featureFlags } from "@/config/featureFlags";
import { integrationFlags } from "@/lib/featureFlags";
import { useCaseContext } from "@/context/CaseContext";
import { CopilotPanel, SuggestedQuestions } from "@/features/copilot";
import { DemoModeCard } from "@/components/home/DemoModeCard";
import { RecentCasesWidget } from "@/components/home/RecentCasesWidget";
import { OnboardingHero } from "@/components/home/OnboardingHero";
import { DEFAULT_CASE_ID, getChargesArray } from "@/lib/case-store";
import { apiRequest } from "@/lib/api-client";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import { EmptyState } from "@/components/ui/empty-state";

// ── Status badge (mirrors DashboardView from update) ──────────────────────
type VS = "VERIFIED" | "SECONDARY" | "PENDING";
const StatusBadge = ({ status }: { status: VS }) => {
  const cfg: Record<VS, { variant: "default" | "secondary" | "outline"; icon: React.ReactNode }> = {
    VERIFIED:  { variant: "default",    icon: <CheckCircle2 className="h-3 w-3" /> },
    SECONDARY: { variant: "secondary",  icon: <Info className="h-3 w-3" /> },
    PENDING:   { variant: "outline",    icon: <AlertTriangle className="h-3 w-3" /> },
  };
  const { variant, icon } = cfg[status];
  return (
    <Badge variant={variant} className="gap-1 text-xs">
      {icon} {status}
    </Badge>
  );
};

// ── Quick-access nav (same tools as sidebar) ──────────────────────────────
const quickLinksFor = (caseId: string) => [
  { href: `/case/${caseId}/dashboard`,             label: "Dashboard",            icon: LayoutDashboard },
  { href: `/case/${caseId}/chat`,                  label: "AI Drafter",           icon: MessageSquare },
  { href: `/case/${caseId}/timeline`,              label: "Case Timeline",        icon: Clock },
  { href: `/case/${caseId}/case-law`,              label: "Case Law Matrix",      icon: BookOpen },
  { href: `/case/${caseId}/standards`,             label: "Standards Matrix",     icon: FlaskConical },
  { href: `/case/${caseId}/documents`,             label: "Documents",            icon: Files },
  { href: `/case/${caseId}/upload`,                label: "Upload Files",         icon: Upload },
  { href: `/case/${caseId}/discharge-application`, label: "Discharge App",        icon: Scale },
  { href: `/case/${caseId}/discharge-print`,       label: "Discharge PDF v6",     icon: Printer },
  { href: "/infra-arb",                            label: "Infra Arbitration",    icon: Scale },
];

// ── Defence Strength Radar data — CASE_01 (Hemraj) evidence only ──────────
const HEMRAJ_RADAR_DATA = [
  { pillar: "Chain of Custody",   score: 72, fullMark: 100 },
  { pillar: "Sampling Method",    score: 80, fullMark: 100 },
  { pillar: "Weather Evidence",   score: 58, fullMark: 100 },
  { pillar: "Standards (BIS/IS)", score: 65, fullMark: 100 },
  { pillar: "Natural Justice",    score: 85, fullMark: 100 },
  { pillar: "FSL Challenge",      score: 70, fullMark: 100 },
];

const overallStrength = Math.round(
  HEMRAJ_RADAR_DATA.reduce((sum, d) => sum + d.score, 0) / HEMRAJ_RADAR_DATA.length
);

export default function Home() {
  const { cases, selectedCase, selectedCaseId, setSelectedCaseId, isDemoMode } = useCaseContext();
  const caseId = selectedCase?.id ?? selectedCaseId;
  const isHemraj = caseId === DEFAULT_CASE_ID;
  const caseLawMatrix  = selectedCase?.caseLaw ?? [];
  const timelineEvents = selectedCase?.timeline ?? [];
  const standardsMatrix = selectedCase?.standards ?? [];
  const caseDocuments  = selectedCase?.documents ?? [];
  const strategyPillars = useMemo(() => (selectedCase?.strategy ?? []).map((s) => s.title), [selectedCase]);
  const charges = useMemo(() => getChargesArray(selectedCase ?? {} as any), [selectedCase]);
  const QUICK_LINKS = useMemo(() => quickLinksFor(caseId ?? "demo-1"), [caseId]);
  const PRIORITY_ACTIONS = useMemo(() => caseLawMatrix
    .filter((c) => c.status === "PENDING")
    .map((c) => ({ task: c.action, citation: c.case.split(",")[0], court: c.court }))
    .concat(
      timelineEvents
        .filter((e) => e.note)
        .map((e) => ({ task: e.note ?? "", citation: e.title, court: "Evidence" }))
    )
    .slice(0, 5), [caseLawMatrix, timelineEvents]);
  const [showGuidedFlow, setShowGuidedFlow] = useState(false);
  const [copilotInput, setCopilotInput] = useState("");
  const [overdueDeadlines, setOverdueDeadlines] = useState<any[]>([]);
  const verifiedCount  = useMemo(() => caseLawMatrix.filter((c) => c.status === "VERIFIED").length, [caseLawMatrix]);
  const pendingCount   = useMemo(() => caseLawMatrix.filter((c) => c.status === "PENDING").length, [caseLawMatrix]);
  const secondaryCount = useMemo(() => caseLawMatrix.length - verifiedCount - pendingCount, [caseLawMatrix.length, verifiedCount, pendingCount]);
  const total          = caseLawMatrix.length;

  // Fetch overdue deadlines for dashboard (Week 10)
  useEffect(() => {
    if (selectedCaseId) {
      apiRequest(`/case/${selectedCaseId}/deadlines/urgent`)
        .then(res => res.json())
        .then(data => {
          const overdue = data.items?.filter((item: any) => item.status === "OVERDUE") || [];
          setOverdueDeadlines(overdue);
        })
        .catch(err => console.error("Failed to fetch overdue deadlines:", err));
    }
  }, [selectedCaseId]);

  const stats = useMemo(() => [
    { label: "Case Documents",      value: caseDocuments.length,   icon: FileText,    color: "text-blue-500" },
    { label: "Case Law Citations",  value: caseLawMatrix.length,   icon: BookOpen,    color: "text-emerald-500" },
    { label: "Standards Referenced",value: standardsMatrix.length, icon: FlaskConical,color: "text-violet-500" },
    { label: "Timeline Events",     value: timelineEvents.length,  icon: Clock,       color: "text-amber-500" },
  ], [caseDocuments.length, caseLawMatrix.length, standardsMatrix.length, timelineEvents.length]);

  // Recent cases - show last 5 cases excluding current
  const recentCases = useMemo(() => {
    return cases
      .filter(c => c.id !== selectedCaseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [cases, selectedCaseId]);

  const handleStartNewCase = () => {
    setShowGuidedFlow(false);
    window.location.href = "/intake";
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">

      {/* Onboarding hero: shown ONLY when no case is loaded yet */}
      {!selectedCase && <OnboardingHero />}

      {/* ── Demo Mode (1 click) ──────────────────────────────────────────── */}
      <DemoModeCard />

      {/* ── All content below only renders when a case is loaded ─────── */}
      {selectedCase && (<>

      {/* ── Task-Oriented Dashboard Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-surface hover-elevate cursor-pointer group" onClick={() => setShowGuidedFlow(true)}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Start Guided Flow</p>
              <p className="text-xs text-muted-foreground">मार्गदर्शित कार्यप्रवाह शुरू करें</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent>
        </Card>

        <Link href={`/case/${selectedCaseId}/upload`}>
          <Card className="glass-surface hover-elevate cursor-pointer group">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-blue-500/10 p-3 group-hover:bg-blue-500/20 transition-colors">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Upload Documents</p>
                <p className="text-xs text-muted-foreground">दस्तावेज़ अपलोड करें</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href={`/case/${selectedCaseId}/case-law`}>
          <Card className="glass-surface hover-elevate cursor-pointer group">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-emerald-500/10 p-3 group-hover:bg-emerald-500/20 transition-colors">
                <BookOpen className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Research Case Law</p>
                <p className="text-xs text-muted-foreground">कानून शोध करें</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href={`/case/${selectedCaseId}/drafting`}>
          <Card className="glass-surface hover-elevate cursor-pointer group">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-violet-500/10 p-3 group-hover:bg-violet-500/20 transition-colors">
                <Edit3 className="h-6 w-6 text-violet-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Draft Document</p>
                <p className="text-xs text-muted-foreground">दस्तावेज़ लिखें</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ── Overdue Deadlines Card (Week 10) ─────────────────────────────── */}
      {overdueDeadlines.length > 0 && (
        <Card className="border-red-300 bg-red-50 hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Overdue Deadlines
              <Badge variant="destructive" className="ml-auto">
                {overdueDeadlines.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueDeadlines.slice(0, 3).map((deadline: any) => (
                <div key={deadline.rule_id} className="p-3 bg-white rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{deadline.name}</p>
                      <p className="text-xs text-muted-foreground">{deadline.name_hi}</p>
                    </div>
                    <Badge variant="outline" className="text-red-700 border-red-300">
                      {deadline.days_remaining} days overdue
                    </Badge>
                  </div>
                </div>
              ))}
              {overdueDeadlines.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{overdueDeadlines.length - 3} more overdue items
                </p>
              )}
            </div>
            <Link href={`/case/${selectedCaseId}/deadlines`}>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View All Deadlines
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* ── Ask Luminaire Copilot Card (Week 6) ─────────────────────────────── */}
      {integrationFlags.ask_copilot && selectedCase && (
        <Card className="glass-surface hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Ask Luminaire
              <Badge variant="outline" className="ml-auto text-xs">SYNTHETIC / DEMO</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SuggestedQuestions 
              onQuestionClick={(question) => {
                setCopilotInput(question);
              }}
              maxQuestions={3}
            />
          </CardContent>
        </Card>
      )}

      {/* ── Guided Flow Component (shown when activated) ─────────────── */}
      {showGuidedFlow && (
        <GuidedFlow 
          onComplete={() => setShowGuidedFlow(false)}
          onStartNew={handleStartNewCase}
        />
      )}

      {/* ── Discharge Application Hero Card ─────────────────────────────── */}
      {isHemraj && <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-5 flex items-center gap-4 hover-elevate transition-all">
        <div className="rounded-xl bg-primary/15 p-3 shrink-0">
          <Printer className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-foreground">उन्मोचन प्रार्थना-पत्र v6 — हेमराज वर्दार</p>
            <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] font-black">UNIQUE SYNERGY</Badge>
            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[10px]">
              <ShieldCheck className="h-3 w-3 mr-1" />Inline Citations
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            प्रत्येक निर्णय के साथ inline citation block — पूर्ण holding + annexure PDF नाम + verification badge सीधे draft body में।
            A4 print-ready | 23 named annexures | 12 grounds | Artemis-II Accuracy
          </p>
        </div>
        <Link href={`/case/${caseId}/discharge-print`}>
          <Button className="gap-1.5 shrink-0 bg-primary">
            <Printer className="h-3.5 w-3.5" /> Generate PDF
          </Button>
        </Link>
      </div>}

      {/* ── Bento grid (2025 layout) ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Case Header (hero tile) */}
        <div className="lg:col-span-8 rounded-xl glass-surface-strong neon-ring p-6 hover-elevate">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary/10 p-3 shrink-0">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-foreground">{selectedCase.title.replace(/^\[DEMO\]\s*/, "")}</h2>
                {isDemoMode && <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">SYNTHETIC / DEMO</Badge>}
              </div>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{selectedCase.brief}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {charges.length > 0 && <Badge variant="destructive">{charges.join(" + ")}</Badge>}
                {selectedCase.court && <Badge variant="outline">{selectedCase.court}</Badge>}
                {selectedCase.caseNo && <Badge variant="outline">{selectedCase.caseNo}</Badge>}
                {selectedCase.status && <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">{selectedCase.status}</Badge>}
              </div>
            </div>
            <Link href={`/case/${caseId}/dashboard`}>
              <Button size="sm" className="gap-1.5 shrink-0 hidden sm:flex">
                Open Case <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Access tile */}
        <div className="lg:col-span-4 rounded-xl glass-surface p-5 hover-elevate">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Quick Access</p>
            <Badge variant="outline" className="text-[10px]">Bento</Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {QUICK_LINKS.slice(0, 6).map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className="group flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border/70 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer text-center">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground leading-tight">{label}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border/60">
            <Link href={`/case/${caseId}/upload`}>
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <Upload className="h-3.5 w-3.5" /> Upload documents
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <RecentCasesWidget />

      <HarveyEvaluationPanel />

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-surface hover-elevate">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Recent Cases Widget ─────────────────────────────────────────── */}
      {recentCases.length > 0 && (
        <Card className="glass-surface hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Recent Cases
              <Badge variant="outline" className="ml-auto text-xs">{recentCases.length} recent</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all hover:border-primary/40 hover:bg-primary/5 ${
                    c.id === selectedCaseId ? "border-primary/30 bg-primary/10" : "border-border/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Scale className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.court}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    {c.isDemo && (
                      <Badge className="bg-red-500/10 text-red-700 border-red-500/30 text-[9px] font-black shrink-0">
                        DEMO
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <Link href="/cases" className="mt-3 block">
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                <Files className="h-3.5 w-3.5" /> View all cases
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* ── Gift: Defence Strength Radar + Priority Actions ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Radar Chart — hand-scored for CASE_01 only; other cases show verification blocks */}
        {isHemraj ? <Card className="glass-surface hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Defence Strength Analysis
              <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs">
                {overallStrength}% Overall
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Pillar-by-pillar strength based on verified evidence &amp; precedents
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={HEMRAJ_RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="pillar"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(v: number) => [`${v}%`, "Strength"]}
                />
                <Radar
                  name="Defence"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))" }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {HEMRAJ_RADAR_DATA.map((d) => (
                <div key={d.pillar} className="flex flex-col items-center gap-0.5">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${d.score}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground text-center leading-tight">{d.pillar}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> : (
          <Card className="glass-surface hover-elevate">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                सत्यापन ब्लॉक / Verification Blocks
                <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs">
                  {(selectedCase.verificationBlocks ?? []).length}
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground">Every claim carries its verification tier — PENDING items are blocked from drafting.</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {(selectedCase.verificationBlocks ?? []).length === 0 && (
                <p className="text-xs text-muted-foreground py-4 text-center" role="status">कोई सत्यापन ब्लॉक नहीं · No verification blocks recorded yet.</p>
              )}
              {(selectedCase.verificationBlocks ?? []).map((vb) => (
                <div key={vb.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/30">
                  <StatusBadge status={(vb.status === "COURT_SAFE" ? "VERIFIED" : vb.status === "FATAL_ERROR" ? "PENDING" : vb.status) as VS} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-snug">{vb.claim}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{vb.evidence}{vb.blockedFromDraft ? " · BLOCKED FROM DRAFT" : ""}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Priority Action Items */}
        <Card className="glass-surface hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Priority Actions
              <Badge className="ml-auto bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
                {PRIORITY_ACTIONS.length} pending
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Auto-generated from pending citations &amp; evidence gaps
            </p>
          </CardHeader>
          <CardContent className="pt-0 space-y-2.5">
            {PRIORITY_ACTIONS.length === 0 && (
              <p className="text-xs text-muted-foreground py-4 text-center" role="status">कोई लंबित कार्य नहीं · No pending actions.</p>
            )}
            {PRIORITY_ACTIONS.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 font-bold text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground leading-snug">{item.task}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {item.citation} · {item.court}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-1">
              <Link href={`/case/${caseId}/case-law`}>
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                  <BookOpen className="h-3 w-3" /> View Full Case Law Matrix
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Verification + Strategy ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Citation Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Citation Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Verified",   count: verifiedCount,  barClass: "bg-primary",    pct: verifiedCount / total },
              { label: "Secondary",  count: secondaryCount, barClass: "bg-secondary-foreground/30", pct: secondaryCount / total },
              { label: "Pending",    count: pendingCount,   barClass: "bg-amber-500",  pct: pendingCount / total },
            ].map(({ label, count, barClass, pct }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barClass} transition-all duration-500`}
                    style={{ width: `${Math.round(pct * 100)}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="pt-2 border-t border-border flex flex-wrap gap-3">
              {caseLawMatrix.slice(0, 4).map((c) => (
                <div key={c.case} className="flex items-center gap-1.5 min-w-0">
                  <StatusBadge status={c.status as VS} />
                  <span className="text-xs text-muted-foreground truncate max-w-[160px]">{c.case.split(",")[0]}</span>
                </div>
              ))}
              {caseLawMatrix.length > 4 && (
                <Link href={`/case/${caseId}/case-law`}>
                  <span className="text-xs text-primary hover:underline cursor-pointer">
                    +{caseLawMatrix.length - 4} more →
                  </span>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Defence Strategy Pillars */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Defence Strategy Pillars</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {strategyPillars.length === 0 && (
                <li className="text-xs text-muted-foreground" role="status">कोई रणनीति स्तंभ नहीं · No strategy pillars yet.</li>
              )}
              {strategyPillars.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <Link href={`/case/${caseId}/discharge-application`}>
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <Scale className="h-3.5 w-3.5" /> View Discharge Application
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Access Nav ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Quick Access
            <Link href="/intake">
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                + New Case
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className="group flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer text-center">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground leading-tight">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Case Law (top 3) ──────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Key Precedents
            <Link href={`/case/${caseId}/case-law`}>
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {caseLawMatrix.length === 0 && (
              <p className="text-xs text-muted-foreground py-4 text-center" role="status">कोई नज़ीर दर्ज नहीं · No precedents recorded for this case.</p>
            )}
            {caseLawMatrix.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                <StatusBadge status={c.status as VS} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.case}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.useForDefence}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{c.court}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      </>)}
    </div>
  );
}
