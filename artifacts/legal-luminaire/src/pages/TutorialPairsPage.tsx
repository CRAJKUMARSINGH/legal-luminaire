/**
 * TutorialPairsPage — Rajasthan District & High Court tutorial samples
 * Route: /tutorial-pairs
 * Source: tutorial-data/pairs/ (30 pairs) via the UI bundle
 *   RAJASTHAN_TUTORIAL_PAIRS (src/data/rajasthan-tutorial-pairs.ts).
 * ALL DATA SYNTHETIC / DEMO — not legal advice — not filing-ready.
 *
 * Each card shows one pair: what the user types (`input`) and what the
 * repository draws back (`expected`) — citation gate, limitation gate,
 * tier-tagged verification, blocked drafts and a terminal outcome.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, ShieldCheck, Info, AlertTriangle } from "lucide-react";
import { RAJASTHAN_TUTORIAL_PAIRS } from "@/data/rajasthan-tutorial-pairs";
import type {
  TutorialStage,
  TutorialLevel,
  TutorialForum,
  TerminalKind,
} from "@/data/tutorial-pair-types";

const STAGES: TutorialStage[] = ["initial", "reply", "trial", "appeal", "mid-journey"];
const LEVELS: TutorialLevel[] = ["beginner", "intermediate", "advanced", "expert"];
const FORUMS: TutorialForum[] = ["district", "high-court", "revenue", "rera", "commercial", "family"];

const STAGE_LABEL: Record<string, string> = {
  initial: "Initial",
  reply: "Reply",
  trial: "Trial",
  appeal: "Appeal",
  "mid-journey": "Mid-journey",
};
const FORUM_LABEL: Record<string, string> = {
  district: "District Court",
  "high-court": "Rajasthan High Court",
  revenue: "Board of Revenue",
  rera: "RERA",
  commercial: "Commercial Court",
  family: "Family Court",
};
const STAGE_COLOR: Record<string, string> = {
  initial: "bg-blue-100 text-blue-700",
  reply: "bg-violet-100 text-violet-700",
  trial: "bg-rose-100 text-rose-700",
  appeal: "bg-amber-100 text-amber-700",
  "mid-journey": "bg-teal-100 text-teal-700",
};
const LEVEL_COLOR: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-cyan-100 text-cyan-700",
  advanced: "bg-orange-100 text-orange-700",
  expert: "bg-red-100 text-red-700 font-bold",
};
const TERMINAL_COLOR: Record<TerminalKind, string> = {
  proceed: "bg-green-50 text-green-700 border-green-200",
  review: "bg-amber-50 text-amber-700 border-amber-200",
  hold: "bg-red-50 text-red-700 border-red-200",
  refer: "bg-blue-50 text-blue-700 border-blue-200",
  "no-filing": "bg-gray-50 text-gray-700 border-gray-200",
};
const DRAFT_STATUS_COLOR: Record<string, string> = {
  draft: "bg-blue-50 text-blue-700 border-blue-200",
  "review-needed": "bg-amber-50 text-amber-700 border-amber-200",
  "ready-for-supervising-advocate": "bg-green-50 text-green-700 border-green-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  "intake-only": "bg-gray-50 text-gray-700 border-gray-200",
  "research-needed": "bg-violet-50 text-violet-700 border-violet-200",
};

function PairCard({ pair }: { pair: (typeof RAJASTHAN_TUTORIAL_PAIRS)[number] }) {
  const [open, setOpen] = useState(false);
  const e = pair.expected;
  const blocked = e.drafts.filter((d) => d.status === "blocked").length;
  const worked = e.drafts.filter((d) => !!d.body).length;
  return (
    <Card className="glass-surface hover-elevate flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">{pair.id}</Badge>
          <Badge className={`border-0 text-[10px] ${STAGE_COLOR[pair.stage]}`}>{STAGE_LABEL[pair.stage]}</Badge>
          <Badge className={`border-0 text-[10px] ${LEVEL_COLOR[pair.level]}`}>{pair.level}</Badge>
          <span className="text-[10px] text-muted-foreground ml-auto">{FORUM_LABEL[pair.forum]}</span>
        </div>
        <CardTitle className="text-sm font-semibold leading-snug">{pair.title}</CardTitle>
        <p className="text-[11px] text-muted-foreground">
          {pair.district} · {pair.input.kind} · {pair.input.language}/{pair.input.channel}
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-3 flex-1">
        <p className="text-xs text-foreground/90 leading-relaxed">{e.triage.oneLineRead}</p>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-[10px] gap-1">
            <ShieldCheck className="h-3 w-3" /> citation: {e.citationGate}
          </Badge>
          <Badge variant="outline" className="text-[10px] gap-1">
            <AlertTriangle className="h-3 w-3" /> limitation: {e.limitationGate}
          </Badge>
          <Badge variant="outline" className={`text-[10px] ${TERMINAL_COLOR[e.terminalOutcome.kind]}`}>
            → {e.terminalOutcome.kind}
          </Badge>
          {worked > 0 && (
            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
              {worked} worked example(s)
            </Badge>
          )}
          {blocked > 0 && (
            <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200">
              {blocked} draft(s) blocked
            </Badge>
          )}
        </div>

        {open && (
          <div className="space-y-3 pt-1 border-t border-border/60">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-2">User input</p>
              <p className="text-xs text-foreground/80 whitespace-pre-line">{pair.input.text}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Terminal outcome</p>
              <p className="text-xs text-foreground/80">
                <span className="font-medium">{e.terminalOutcome.label}</span> — {e.terminalOutcome.rationale}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Repository draws back</p>
              <div className="space-y-2 mt-1">
                {e.drafts.map((d, i) => (
                  <div key={i} className="rounded-md border border-border/60 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-foreground/90 leading-snug">{d.title}</span>
                      <Badge variant="outline" className={`text-[9px] shrink-0 ${DRAFT_STATUS_COLOR[d.status] ?? ""}`}>
                        {d.status}
                      </Badge>
                    </div>
                    {d.body ? (
                      <pre className="mt-1.5 text-[11px] text-foreground/80 whitespace-pre-wrap font-serif bg-muted/40 rounded p-2 max-h-56 overflow-y-auto">
                        {d.body}
                      </pre>
                    ) : (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {d.blockedReason ?? "No body by design."}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Common mistakes</p>
              <ul className="list-disc ml-4 space-y-0.5">
                {e.commonMistakes.map((m, i) => (
                  <li key={i} className="text-xs text-foreground/80">{m}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide details" : "Show input & drafts"}
          </Button>
          <Link href={`/tutorial-pairs/${pair.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full text-xs">Open in Drafting Studio →</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TutorialPairsPage() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");

  const stats = useMemo(() => {
    const count = <T extends string>(key: (p: (typeof RAJASTHAN_TUTORIAL_PAIRS)[number]) => T) =>
      RAJASTHAN_TUTORIAL_PAIRS.reduce<Record<string, number>>((acc, p) => {
        const k = key(p);
        acc[k] = (acc[k] ?? 0) + 1;
        return acc;
      }, {});
    return { stage: count((p) => p.stage), level: count((p) => p.level), forum: count((p) => p.forum) };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RAJASTHAN_TUTORIAL_PAIRS.filter(
      (p) =>
        (stage === "all" || p.stage === stage) &&
        (level === "all" || p.level === level) &&
        (q === "" || p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)),
    );
  }, [query, stage, level]);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Rajasthan Tutorial Samples
              <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">SYNTHETIC / DEMO</Badge>
            </h1>
            <p className="text-sm text-muted-foreground">
              District &amp; High Court intake → repository-draw pairs. Gate-shaped, never filing-ready.
            </p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">← Home</Button>
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4">
          <p className="text-2xl font-bold text-foreground">{RAJASTHAN_TUTORIAL_PAIRS.length}</p>
          <p className="text-xs text-muted-foreground">Tutorial pairs</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-2xl font-bold text-foreground">{STAGES.filter((s) => stats.stage[s]).length}</p>
          <p className="text-xs text-muted-foreground">Case stages covered</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-2xl font-bold text-foreground">{LEVELS.filter((l) => stats.level[l]).length}</p>
          <p className="text-xs text-muted-foreground">Advocate levels</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-2xl font-bold text-foreground">{FORUMS.filter((f) => stats.forum[f]).length}</p>
          <p className="text-xs text-muted-foreground">Forums</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card><CardContent className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder="Search by title or id (e.g. bail, 138, RERA)…"
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground mr-1 self-center">Stage:</span>
          {["all", ...STAGES].map((s) => (
            <Button key={s} size="sm" variant={stage === s ? "default" : "outline"} className="h-7 text-xs"
              onClick={() => setStage(s)}>
              {s === "all" ? "All" : STAGE_LABEL[s]}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground mr-1 self-center">Level:</span>
          {["all", ...LEVELS].map((l) => (
            <Button key={l} size="sm" variant={level === l ? "default" : "outline"} className="h-7 text-xs"
              onClick={() => setLevel(l)}>
              {l === "all" ? "All" : l}
            </Button>
          ))}
        </div>
      </CardContent></Card>

      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Info className="h-3.5 w-3.5" /> Showing {filtered.length} of {RAJASTHAN_TUTORIAL_PAIRS.length} samples.
      </p>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center" role="status">
          No tutorial samples match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => <PairCard key={p.id} pair={p} />)}
        </div>
      )}
    </div>
  );
}
