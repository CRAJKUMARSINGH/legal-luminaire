/**
 * TutorialPairDraftPage — engine hand-off for a single tutorial pair.
 * Route: /tutorial-pairs/:id
 *
 * Left half: the pair's gate-shaped worked-example bodies (the corpus body).
 * Right half: the live drafting engine, pre-filled with the pair's intake text,
 * so the reader can watch the real engine (POST /legal/draft) draw the same
 * answer back — and refuse in the same places (the [PENDING — …] holes).
 *
 * SYNTHETIC / DEMO — not legal advice — not filing-ready.
 */
import { useState } from "react";
import { Link, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DraftGenerator } from "@/components/draft-generator";
import { RAJASTHAN_TUTORIAL_PAIRS } from "@/data/rajasthan-tutorial-pairs";
import type { DraftState } from "@/data/tutorial-pair-types";
import { ArrowLeft, FileText } from "lucide-react";

const PRODUCTIVE = new Set<DraftState>(["draft", "review-needed", "ready-for-supervising-advocate"]);

const DRAFT_STATUS_COLOR: Record<string, string> = {
  draft: "bg-blue-50 text-blue-700 border-blue-200",
  "review-needed": "bg-amber-50 text-amber-700 border-amber-200",
  "ready-for-supervising-advocate": "bg-green-50 text-green-700 border-green-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  "intake-only": "bg-gray-50 text-gray-700 border-gray-200",
  "research-needed": "bg-violet-50 text-violet-700 border-violet-200",
};

/** Map a corpus draft to the engine's draft-type vocabulary. */
function engineDraftType(title: string, type: string): string {
  const t = `${type} ${title}`.toLowerCase();
  if (t.includes("bail")) return "bail_application";
  if (t.includes("discharge")) return "discharge_application";
  if (t.includes("charge sheet") || t.includes("charge-sheet")) return "reply_to_charge_sheet";
  if (t.includes("written statement") || t.includes("written submission")) return "written_submission";
  if (t.includes("revision")) return "revision_petition";
  return "general";
}

function engineLanguage(lang: string): string {
  if (lang === "hi") return "hindi";
  if (lang === "hinglish") return "bilingual";
  return "english";
}

export default function TutorialPairDraftPage() {
  const [, params] = useRoute("/tutorial-pairs/:id");
  const pair = RAJASTHAN_TUTORIAL_PAIRS.find((p) => p.id === params?.id);

  const productive = pair?.expected.drafts.filter((d) => PRODUCTIVE.has(d.status)) ?? [];
  const [engineType, setEngineType] = useState<string>(
    productive[0] ? engineDraftType(productive[0].title, productive[0].type) : "general",
  );

  if (!pair) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4" role="status">
        <h1 className="text-xl font-semibold text-foreground">Tutorial pair not found</h1>
        <p className="text-sm text-muted-foreground">
          No pair matches <span className="font-mono">{params?.id}</span> in the 30-pair corpus.
        </p>
        <Link href="/tutorial-pairs">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> All tutorial samples
          </Button>
        </Link>
      </div>
    );
  }

  const e = pair.expected;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <Link href="/tutorial-pairs">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" /> All tutorial samples
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="font-mono text-base text-muted-foreground">{pair.id}</span>
            {pair.title}
            <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">SYNTHETIC / DEMO</Badge>
          </h1>
          <p className="text-sm text-muted-foreground">
            {pair.district} · {pair.stage} · {pair.level} · {pair.forum} — gate-shaped, never filing-ready.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Corpus body ─────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">What the user typed</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-foreground/80 whitespace-pre-line">{pair.input.text}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge variant="outline" className="text-[10px]">citation: {e.citationGate}</Badge>
                <Badge variant="outline" className="text-[10px]">limitation: {e.limitationGate}</Badge>
                <Badge variant="outline" className="text-[10px]">→ {e.terminalOutcome.kind}</Badge>
              </div>
            </CardContent>
          </Card>

          {e.drafts.map((d, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm leading-snug">{d.title}</CardTitle>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${DRAFT_STATUS_COLOR[d.status] ?? ""}`}>
                    {d.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{d.type}</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {PRODUCTIVE.has(d.status) && d.body ? (
                  <>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Worked example — [PENDING — …] holes are deliberate
                    </p>
                    <pre className="text-xs text-foreground/90 whitespace-pre-wrap font-serif bg-muted/40 rounded-md p-3 max-h-96 overflow-y-auto">
                      {d.body}
                    </pre>
                    {productive.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setEngineType(engineDraftType(d.title, d.type))}
                      >
                        Draft this in the engine →
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No body by design{d.blockedReason ? ` — ${d.blockedReason}` : "."}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Engine hand-off ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  This panel runs the repository&apos;s live drafting engine with the pair&apos;s intake text
                  pre-filled. The engine draws the answer back — and blocks the same unverified
                  authorities, leaving them as <span className="font-mono">[PENDING]</span> holes.
                  SYNTHETIC / DEMO.
                </span>
              </p>
            </CardContent>
          </Card>
          <DraftGenerator
            key={engineType}
            sessionId={Number(pair.id.replace("TP-RJ-", "")) || 1}
            initialQuery={pair.input.text}
            initialDraftType={engineType}
            initialLanguage={engineLanguage(pair.input.language)}
          />
        </div>
      </div>
    </div>
  );
}
