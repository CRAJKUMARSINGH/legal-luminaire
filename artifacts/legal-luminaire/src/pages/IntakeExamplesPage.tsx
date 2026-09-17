/**
 * IntakeExamplesPage — all 51 synthetic drafting-intake examples
 * Route: /intake-examples
 * Source: SUPPLEMENT/WEEK_01_KIRO.md through WEEK_05_INTEGRATION.md
 * ALL DATA SYNTHETIC / DEMO — not legal advice — not filing-ready without supervising-advocate approval.
 */
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Scale, Search, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Clock, FileText, Shield, Info, BookOpen,
  User, Gavel, Home, Building2, Users, Car, Briefcase, TreePine,
} from "lucide-react";
import type { IntakeExample } from "@/data/demo-cases/intake-example-types";
import { ALL_INTAKE_EXAMPLES } from "@/data/demo-cases/all-intake-examples";

// ── Colour config ─────────────────────────────────────────────────────────
const WORKFLOW_CONFIG: Record<string, { label: string; color: string }> = {
  "intake-only":                      { label: "Intake Only",                  color: "bg-gray-100 text-gray-700" },
  "research-needed":                  { label: "Research Needed",              color: "bg-blue-100 text-blue-700" },
  "draft":                            { label: "Draft",                        color: "bg-violet-100 text-violet-700" },
  "review-needed":                    { label: "Review Needed",                color: "bg-amber-100 text-amber-700" },
  "ready-for-supervising-advocate":   { label: "Ready — Supervisor Review",    color: "bg-green-100 text-green-700" },
  "blocked":                          { label: "Blocked",                      color: "bg-red-100 text-red-700" },
};
const URGENCY_CONFIG: Record<string, { label: string; color: string }> = {
  routine:   { label: "Routine",  color: "bg-gray-100 text-gray-600" },
  moderate:  { label: "Moderate", color: "bg-amber-100 text-amber-700" },
  urgent:    { label: "Urgent",   color: "bg-orange-100 text-orange-700" },
  critical:  { label: "Critical", color: "bg-red-100 text-red-700 font-bold" },
};
const APPROACH_CONFIG: Record<string, string> = {
  "cold-walk-in":    "Cold Walk-in",
  "referral":        "Referral",
  "returning-client":"Returning Client",
  "online-intake":   "Online Intake",
  "legal-aid-camp":  "Legal Aid Camp",
  "urgent-referral": "Urgent Referral",
};
const DOMAIN_ICON: Record<string, React.ComponentType<{className?: string}>> = {
  "Commercial Recovery / MSMED": Briefcase,
  "Property / Injunction":       Home,
  "Consumer / Real Estate":      Building2,
  "Tenancy / Notice":            Home,
  "Contract / Specific Performance": Scale,
  "Family Property / Partition": Users,
  "Family / Protective Relief":  Shield,
  "Family / Guardianship":       Users,
  "MACT / Compensation":         Car,
  "Service Law / Writ":          Gavel,
  "Public Law / Acquisition":    TreePine,
  "Criminal / Anticipatory Bail": Shield,
  "Criminal / Bail":             Shield,
  "Negotiable Instrument / Notice": FileText,
  "Criminal / Complaint":        Gavel,
  "Criminal / Inherent Jurisdiction": Gavel,
  "Family / Maintenance":        Users,
  "Criminal Procedure / Revision": Gavel,
  "Criminal / Appeal":           Gavel,
  "Supreme Court / SLP":         Gavel,
  "Constitutional / Habeas Corpus": Shield,
};
const DRAFT_TYPE_COLOR: Record<string, string> = {
  "notice":         "bg-blue-50 text-blue-700 border-blue-200",
  "pleading":       "bg-violet-50 text-violet-700 border-violet-200",
  "application":    "bg-amber-50 text-amber-700 border-amber-200",
  "affidavit":      "bg-green-50 text-green-700 border-green-200",
  "deed":           "bg-teal-50 text-teal-700 border-teal-200",
  "checklist":      "bg-gray-50 text-gray-700 border-gray-200",
  "no-filing-note": "bg-red-50 text-red-700 border-red-200",
  "memo":           "bg-orange-50 text-orange-700 border-orange-200",
  "chronology":     "bg-indigo-50 text-indigo-700 border-indigo-200",
  "index":          "bg-pink-50 text-pink-700 border-pink-200",
  "undertaking":    "bg-cyan-50 text-cyan-700 border-cyan-200",
  "letter":         "bg-lime-50 text-lime-700 border-lime-200",
  "table":          "bg-slate-50 text-slate-700 border-slate-200",
  "instruction":    "bg-purple-50 text-purple-700 border-purple-200",
};

// ── Combined examples ───────────────────────────────────────────────────────
// ── Single card ───────────────────────────────────────────────────────────
function ExampleCard({ ex }: { ex: IntakeExample }) {
  const [open, setOpen] = useState(false);
  const Icon = DOMAIN_ICON[ex.domain] ?? Scale;
  const wf = WORKFLOW_CONFIG[ex.workflowState] ?? WORKFLOW_CONFIG["intake-only"];
  const urg = URGENCY_CONFIG[ex.urgency] ?? URGENCY_CONFIG.routine;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <button className="w-full text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
        <CardHeader className="pb-3 hover:bg-muted/20 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-black text-muted-foreground">{ex.id}</span>
                  <CardTitle className="text-sm font-semibold leading-snug">{ex.title}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[9px]">{ex.domain}</Badge>
                  <Badge variant="outline" className="text-[9px]">{ex.complexity}</Badge>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium ${wf.color}`}>{wf.label}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium ${urg.color}`}>{urg.label}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] bg-muted text-muted-foreground">{APPROACH_CONFIG[ex.approachStatus]}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className="bg-amber-500 text-white text-[8px] font-black">SYNTHETIC</Badge>
              {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </div>
        </CardHeader>
      </button>

      {open && (
        <CardContent className="pt-0 border-t space-y-5">
          {/* 0. Background */}
          <Section icon={User} label="0. Background" color="text-primary">
            <p className="text-sm leading-relaxed">{ex.background}</p>
            {ex.backgroundHi && <p className="text-xs text-muted-foreground mt-1 italic">{ex.backgroundHi}</p>}
          </Section>

          {/* 1. Documents */}
          <Section icon={FileText} label="1. Data & Documents" color="text-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-green-700 mb-1">Documents brought ({ex.documents.length})</p>
                <ul className="space-y-0.5">{ex.documents.map((d,i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs">
                    <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />{d}
                  </li>
                ))}</ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-700 mb-1">Missing documents ({ex.missingDocuments.length})</p>
                <ul className="space-y-0.5">{ex.missingDocuments.map((d,i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs">
                    <AlertTriangle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />{d}
                  </li>
                ))}</ul>
                {ex.documentGaps.length > 0 && <>
                  <p className="text-xs font-semibold text-amber-700 mb-1 mt-2">Document gaps</p>
                  <ul className="space-y-0.5">{ex.documentGaps.map((d,i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                      <Info className="h-3 w-3 shrink-0 mt-0.5" />{d}
                    </li>
                  ))}</ul>
                </>}
              </div>
            </div>
          </Section>

          {/* 2. Client Request */}
          <Section icon={Scale} label="2. Client Request" color="text-violet-600">
            <p className="text-sm">{ex.clientRequest}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[9px]">Clarity: {ex.requestClarity}</Badge>
            </div>
            {ex.requestNote && <p className="text-xs text-amber-700 mt-1 italic">{ex.requestNote}</p>}
          </Section>

          {/* 3. Action Plan */}
          <Section icon={BookOpen} label="3. Action Plan" color="text-green-600">
            {(["facts","research","drafting","review","filing"] as const).map(phase => (
              ex.actionPlan[phase].length > 0 && (
                <div key={phase} className="mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{phase}</p>
                  <ul className="space-y-0.5">{ex.actionPlan[phase].map((step,i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-100 text-green-700 text-[8px] font-bold shrink-0 mt-0.5">{i+1}</span>
                      {step}
                    </li>
                  ))}</ul>
                </div>
              )
            ))}
            {ex.unresolvedFacts.length > 0 && (
              <div className="mt-2 rounded bg-amber-50 border border-amber-200 p-2">
                <p className="text-xs font-semibold text-amber-800 mb-1">Unresolved facts (UNCONFIRMED)</p>
                <ul className="space-y-0.5">{ex.unresolvedFacts.map((f,i) => (
                  <li key={i} className="text-xs text-amber-700 flex items-start gap-1"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />{f}</li>
                ))}</ul>
              </div>
            )}
            {ex.adverseFact && (
              <div className="mt-2 rounded bg-red-50 border border-red-200 p-2">
                <p className="text-xs font-semibold text-red-800 mb-0.5">Adverse / Contradictory Fact</p>
                <p className="text-xs text-red-700">{ex.adverseFact}</p>
              </div>
            )}
            <div className={`mt-2 rounded border p-3 ${
              ex.terminalOutcome.kind === "hold" || ex.terminalOutcome.kind === "no-filing"
                ? "bg-red-50 border-red-200"
                : ex.terminalOutcome.kind === "review" || ex.terminalOutcome.kind === "refer"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-green-50 border-green-200"
            }`}>
              <p className="text-xs font-semibold text-foreground">Logical conclusion</p>
              <p className="text-xs font-semibold mt-0.5">{ex.terminalOutcome.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{ex.terminalOutcome.rationale}</p>
              <p className="text-xs mt-1"><strong>Next safe action:</strong> {ex.terminalOutcome.nextAction}</p>
            </div>
          </Section>

          {/* 4. Drafts */}
          <Section icon={Gavel} label="4. Drafts Created" color="text-amber-600">
            <div className="space-y-2">{ex.drafts.map((d,i) => {
              const dColor = DRAFT_TYPE_COLOR[d.type] ?? "bg-gray-50 text-gray-700 border-gray-200";
              const dState = WORKFLOW_CONFIG[d.status] ?? WORKFLOW_CONFIG["intake-only"];
              return (
                <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border ${dColor}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase">{d.type}</span>
                      <span className="text-xs font-medium">{d.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      <span className={`inline-flex items-center px-1.5 py-0 rounded text-[9px] font-medium ${dState.color}`}>{dState.label}</span>
                      {d.approvalRequired && <span className="inline-flex items-center px-1.5 py-0 rounded text-[9px] bg-yellow-100 text-yellow-800">Supervisor approval required</span>}
                      {d.jurisdiction && <span className="text-[9px] text-muted-foreground">Jurisdiction: {d.jurisdiction}</span>}
                    </div>
                    {d.blockedReason && <p className="text-[10px] text-red-700 mt-0.5 flex items-start gap-1"><AlertTriangle className="h-3 w-3 shrink-0" />{d.blockedReason}</p>}
                    {d.limitationNote && <p className="text-[10px] text-amber-700 mt-0.5 flex items-start gap-1"><Clock className="h-3 w-3 shrink-0" />{d.limitationNote}</p>}
                  </div>
                </div>
              );
            })}</div>
            {/* Gates */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border ${ex.citationGate === "BLOCKED" ? "bg-red-100 text-red-700 border-red-300" : ex.citationGate === "PENDING" ? "bg-amber-100 text-amber-700 border-amber-300" : "bg-blue-100 text-blue-700 border-blue-300"}`}>
                <Shield className="h-3 w-3" />Citation Gate: {ex.citationGate}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border ${ex.limitationGate === "URGENT" || ex.limitationGate === "EXPIRED-RISK" ? "bg-red-100 text-red-700 border-red-300" : ex.limitationGate === "UNKNOWN" ? "bg-amber-100 text-amber-700 border-amber-300" : "bg-green-100 text-green-700 border-green-300"}`}>
                <Clock className="h-3 w-3" />Limitation Gate: {ex.limitationGate}
              </span>
            </div>
          </Section>

          {/* Training control */}
          <div className="rounded bg-muted/40 border p-3 text-[10px] text-muted-foreground">
            <strong>Training control:</strong> Every unverified assertion = UNCONFIRMED. Never invent a date, statute, citation, party, amount or document. No fixture is filing-ready without supervising-advocate approval. <strong>SYNTHETIC / DEMO</strong> — not legal advice.
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function Section({ icon: Icon, label, color, children }: { icon: React.ComponentType<{className?:string}>; label: string; color: string; children: React.ReactNode }) {
  return (
    <div className="pt-4">
      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${color}`}>
        <Icon className="h-3.5 w-3.5" />{label}
      </p>
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function IntakeExamplesPage() {
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterComplexity, setFilterComplexity] = useState("all");

  const domains = useMemo(() => Array.from(new Set(ALL_INTAKE_EXAMPLES.map(e => e.domain))), []);

  const filtered = useMemo(() => ALL_INTAKE_EXAMPLES.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.domain.toLowerCase().includes(q) || e.background.toLowerCase().includes(q);
    const matchDomain = filterDomain === "all" || e.domain === filterDomain;
    const matchComp = filterComplexity === "all" || e.complexity === filterComplexity;
    return matchSearch && matchDomain && matchComp;
  }), [search, filterDomain, filterComplexity]);

  return (
    <div className="space-y-5 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Drafting Intake Examples — Weeks 01–05</h1>
            <p className="text-sm text-muted-foreground mt-1">
              EX-001 to EX-051 · Civil, Family, Property, Consumer, Public Law, Criminal, Conveyancing, Technology and Regulatory<br />
              <span className="text-[10px]">Source: DU Faculty of Law — Drafting, Pleadings &amp; Conveyancing (educational adaptation) · every path ends in a safe logical conclusion</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-amber-500 text-white text-[9px] font-black">SYNTHETIC / DEMO</Badge>
              <Badge variant="outline" className="text-[9px]">Not Legal Advice</Badge>
              <Badge variant="outline" className="text-[9px]">Not Filing-Ready</Badge>
              <Badge variant="outline" className="text-[9px]">Supervising Advocate Approval Required</Badge>
              <Badge variant="outline" className="text-[9px]">{ALL_INTAKE_EXAMPLES.length} examples</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 text-sm" placeholder="Search examples…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={filterDomain} onChange={e => setFilterDomain(e.target.value)}>
          <option value="all">All Domains</option>
          {domains.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={filterComplexity} onChange={e => setFilterComplexity(e.target.value)}>
          <option value="all">All Complexity</option>
          <option value="Basic">Basic</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
        <span className="text-xs text-muted-foreground">{filtered.length}/{ALL_INTAKE_EXAMPLES.length} shown</span>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Examples", value: ALL_INTAKE_EXAMPLES.length, color: "text-primary" },
          { label: "Blocked Drafts", value: ALL_INTAKE_EXAMPLES.flatMap(e=>e.drafts).filter(d=>d.status==="blocked").length, color: "text-red-600" },
          { label: "Unresolved Facts", value: ALL_INTAKE_EXAMPLES.reduce((n,e)=>n+e.unresolvedFacts.length,0), color: "text-amber-600" },
          { label: "Supervisor Approval Needed", value: ALL_INTAKE_EXAMPLES.flatMap(e=>e.drafts).filter(d=>d.approvalRequired).length, color: "text-orange-600" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Examples */}
      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No examples match your filters.</p>}
        {filtered.map(ex => <ExampleCard key={ex.id} ex={ex} />)}
      </div>

      {/* Footer disclaimer */}
      <div className="rounded-lg bg-muted/40 border p-3 text-[10px] text-muted-foreground text-center">
        All examples are <strong>SYNTHETIC / DEMO</strong> — original educational adaptation of topic areas from the University of Delhi Faculty of Law curriculum on Drafting, Pleadings and Conveyancing. Not legal advice. Not filing-ready. Verify all Indian statutes, procedural codes, court rules, forms, limitation periods and citations as current before use.
      </div>
    </div>
  );
}