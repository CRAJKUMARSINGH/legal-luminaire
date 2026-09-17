/**
 * DemoCaseBrowser — Full 26-Case Demo Browser with Category Filters
 * Master prompt: "21-card demo case selector with filters like Criminal/Civil/Writ/Consumer/Commercial"
 * Artemis-II Accuracy: Fact-Fit Gate scores + verification status on every card.
 */
import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Scale, Search, ArrowRight, Loader2,
  PlayCircle, Building2, FileText, Gavel, ShieldCheck,
  Users, Briefcase, Landmark, ShieldAlert,
} from "lucide-react";
import {
  ALL_DEMO_CASES, DEMO_CATEGORIES, filterDemoCases,
  type DemoCategory, type DemoCaseCard,
} from "@/data/all-demo-cases";
import {
  REPO_PACK_BY_DEMO_ID,
  SAMPLE_CASE_LIBRARY_ROOT,
  syntheticSpecHint,
} from "@/data/case-pack-paths";
import { useCaseContext } from "@/context/CaseContext";
import { SCENARIO_LABELS, recordIdForDemo, scenarioTypeFor, type ScenarioType } from "@/cases/registry";

const SCENARIO_COLORS: Record<ScenarioType, string> = {
  functional: "bg-emerald-50 text-emerald-700 border-emerald-200",
  edge: "bg-violet-50 text-violet-700 border-violet-200",
  stress: "bg-rose-50 text-rose-700 border-rose-200",
  showcase: "bg-sky-50 text-sky-700 border-sky-200",
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Criminal: Gavel,
  Civil: FileText,
  Writ: Landmark,
  Consumer: Users,
  Commercial: Briefcase,
  Infrastructure: Building2,
  "Financial Crime": ShieldAlert,
};

const CATEGORY_COLORS: Record<string, string> = {
  Criminal: "bg-red-50 text-red-700 border-red-200",
  Civil: "bg-blue-50 text-blue-700 border-blue-200",
  Writ: "bg-violet-50 text-violet-700 border-violet-200",
  Consumer: "bg-orange-50 text-orange-700 border-orange-200",
  Commercial: "bg-slate-50 text-slate-700 border-slate-200",
  Infrastructure: "bg-amber-50 text-amber-700 border-amber-200",
  "Financial Crime": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const SCORE_COLOR = (score: number) =>
  score >= 90 ? "text-emerald-600" : score >= 80 ? "text-blue-600" : "text-amber-600";

function CaseCard({ c, active, loading, onLoad }: { c: DemoCaseCard; active: boolean; loading: boolean; onLoad: (id: string) => void }) {
  const CatIcon = CATEGORY_ICONS[c.category] || Scale;
  const catColor = CATEGORY_COLORS[c.category] || "";
  const scenario = scenarioTypeFor(c.id);

  return (
    <Card
      data-testid={`demo-card-${c.id}`}
      className={`hover-elevate transition-all border group ${active ? "border-primary ring-1 ring-primary/40" : "hover:border-primary/30"}`}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="rounded-lg bg-muted p-1.5 shrink-0">
              <CatIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{c.id}</p>
                <span className="text-[8px] font-black bg-amber-100 text-amber-700 border border-amber-300 px-1 rounded tracking-tighter">
                  SYNTHETIC
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{c.title}</p>
              {c.titleHindi && <p className="text-[11px] text-muted-foreground leading-tight line-clamp-1">{c.titleHindi}</p>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge className="bg-amber-500 text-white text-[8px] font-black tracking-wider">SYNTHETIC / DEMO</Badge>
            {active && <Badge variant="outline" className="text-[9px] border-primary text-primary">सक्रिय / Active</Badge>}
            {c.isNew && <Badge className="bg-emerald-500 text-white text-[9px] font-black">NEW</Badge>}
          </div>
        </div>

        {/* Court + Charges (required card fields) */}
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[11px]">
          <dt className="text-muted-foreground">न्यायालय / Court</dt>
          <dd className="text-foreground font-medium truncate" title={c.court}>{c.court}</dd>
          <dt className="text-muted-foreground">आरोप / Charges</dt>
          <dd className="text-foreground font-medium truncate" title={c.charges}>{c.charges}</dd>
        </dl>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className={`text-[10px] border ${SCENARIO_COLORS[scenario]}`} title="Scenario type">
            {SCENARIO_LABELS[scenario].hi} / {SCENARIO_LABELS[scenario].en}
          </Badge>
          <Badge variant="outline" className={`text-[10px] border ${catColor}`}>
            {c.category}
          </Badge>
          <Badge variant="outline" className="text-[10px]">{c.subCategory}</Badge>
          <Badge variant="outline" className={`text-[10px] ${c.status === "Award Passed" ? "border-emerald-500/30 text-emerald-700" : ""}`}>
            {c.status}
          </Badge>
        </div>

        {/* Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{c.summary}</p>

        {/* Key Ground */}
        <div className="rounded-md bg-muted/40 px-2.5 py-1.5">
          <p className="text-[10px] font-semibold text-foreground line-clamp-1">
            <ShieldCheck className="h-3 w-3 inline mr-1 text-primary" />
            {c.keyGround}
          </p>
        </div>

        <p className="text-[9px] text-muted-foreground font-mono leading-snug">
          {REPO_PACK_BY_DEMO_ID[c.id] ?? `${syntheticSpecHint(c.id)} · see ${SAMPLE_CASE_LIBRARY_ROOT}/`}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <span className={`font-bold ${SCORE_COLOR(c.factFitScore)}`}>
              {c.factFitScore}% verified
            </span>
            <span className="text-muted-foreground">
              {c.verifiedClaims}/{c.totalClaims} claims
            </span>
          </div>
          {c.awardValue && (
            <span className="text-xs font-bold text-emerald-600">Award: {c.awardValue}</span>
          )}
        </div>

        {/* Action */}
        <Button
          size="sm"
          className="w-full gap-1.5 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
          disabled={loading}
          data-testid={`load-demo-${c.id}`}
          onClick={() => onLoad(c.id)}
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />}
          लोड करें / Load Case
          <ArrowRight className="h-3 w-3 ml-auto" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DemoCaseBrowser() {
  const { loadDemoCase, selectedCaseId } = useCaseContext();
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<DemoCategory>("All");
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleLoad = async (demoId: string) => {
    setLoadingId(demoId);
    try {
      const id = await loadDemoCase(demoId);
      if (id) setLocation(`/case/${id}/dashboard`);
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = useMemo(
    () => filterDemoCases(ALL_DEMO_CASES, activeCategory, search),
    [activeCategory, search]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ALL_DEMO_CASES.length };
    for (const c of ALL_DEMO_CASES) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-5">
        <div className="flex items-start gap-4">
          <PlayCircle className="h-8 w-8 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-amber-900">टेस्ट डेटा ब्राउज़र / Test Data Browser</h1>
              <Badge className="bg-amber-500 text-white text-[10px] font-black">SYNTHETIC / DEMO · 26 CASES</Badge>
              <Badge variant="outline" className="border-amber-400 text-amber-700 text-[10px]">NO API KEY REQUIRED</Badge>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Explore all 26 pre-loaded case types — Criminal, Civil, Writ, Consumer, Commercial, and 5 full-lifecycle Infrastructure Arbitration cases.
              All citations carry Fact-Fit Gate scores. PENDING citations are blocked from draft output.
              Full bundles live under <code className="text-amber-900">real_cases/</code>; synthetic specs under{" "}
              <code className="text-amber-900">{SAMPLE_CASE_LIBRARY_ROOT}/</code>.
            </p>
          </div>
          <Link href="/intake">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white shrink-0 gap-1.5">
              Start Real Case <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cases, charges, grounds..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DEMO_CATEGORIES.map(cat => {
            const CatIcon = cat === "All" ? Scale : (CATEGORY_ICONS[cat] || Scale);
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <CatIcon className="h-3.5 w-3.5" />
                {cat}
                <span className={`text-[10px] font-black px-1 rounded ${activeCategory === cat ? "bg-primary-foreground/20" : "bg-muted"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong className="text-foreground">{filtered.length}</strong> of {ALL_DEMO_CASES.length} cases
          {activeCategory !== "All" && ` in ${activeCategory}`}
          {search && ` matching "${search}"`}
        </p>
        {(activeCategory !== "All" || search) && (
          <Button
            variant="ghost" size="sm" className="text-xs"
            onClick={() => { setActiveCategory("All"); setSearch(""); }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Case Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(c => (
            <CaseCard
              key={c.id}
              c={c}
              active={recordIdForDemo(c.id) === selectedCaseId}
              loading={loadingId === c.id}
              onLoad={handleLoad}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground">No cases found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search term or category filter.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => { setActiveCategory("All"); setSearch(""); }}>
            Show all cases
          </Button>
        </div>
      )}

      {/* Accuracy Footer */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Artemis-II Accuracy Rules Applied</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              All demo cases carry Fact-Fit Gate scores. VERIFIED citations are safe to draft.
              SECONDARY citations appear with qualification notes. PENDING citations are blocked from all draft output.
              No hallucinated citations — every precedent is marked with its verification status and source URL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
