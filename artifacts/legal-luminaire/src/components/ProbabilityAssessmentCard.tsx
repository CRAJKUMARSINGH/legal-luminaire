/**
 * ProbabilityAssessmentCard — Month 6
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates a "probability assessment" card based on:
 *   - Verified citation count vs total citations
 *   - IS/ASTM standards coverage
 *   - Fact-Fit scores from case law matrix
 *   - Presence of PENDING / BLOCKED citations
 *
 * NOT a legal opinion — clearly labelled as a technical strength indicator.
 */
import { useMemo } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CaseRecord } from "@/lib/case-store";

interface ProbabilityAssessmentCardProps {
  caseRecord: CaseRecord;
  compact?: boolean;
}

interface AssessmentBreakdown {
  label: string;
  score: number;   // 0–100
  weight: number;  // weight in total
  status: "strong" | "moderate" | "weak";
  note: string;
}

function computeAssessment(caseRecord: CaseRecord): {
  overall: number;
  label: string;
  breakdown: AssessmentBreakdown[];
} {
  const breakdown: AssessmentBreakdown[] = [];

  // ── 1. Citation verification quality ──────────────────────────────────────
  const caseLaw = caseRecord.caseLaw ?? [];
  const total = caseLaw.length;
  const verified = caseLaw.filter((c) => c.status === "VERIFIED" || c.status === "COURT_SAFE").length;
  const secondary = caseLaw.filter((c) => c.status === "SECONDARY").length;
  const pending = caseLaw.filter((c) => c.status === "PENDING").length;

  const citationScore = total === 0 ? 50
    : Math.round(((verified * 1.0 + secondary * 0.5) / total) * 100);
  breakdown.push({
    label: "Citation Verification",
    score: citationScore,
    weight: 0.35,
    status: citationScore >= 70 ? "strong" : citationScore >= 40 ? "moderate" : "weak",
    note: total === 0
      ? "No case law added yet"
      : `${verified} verified, ${secondary} secondary, ${pending} pending`,
  });

  // ── 2. Fact-Fit score ──────────────────────────────────────────────────────
  const fitScores = caseLaw
    .filter((c) => typeof (c as { fitScore?: number }).fitScore === "number")
    .map((c) => (c as { fitScore: number }).fitScore);
  const avgFit = fitScores.length > 0
    ? Math.round(fitScores.reduce((a, b) => a + b, 0) / fitScores.length)
    : 50;
  breakdown.push({
    label: "Fact-Fit Score (Avg)",
    score: avgFit,
    weight: 0.30,
    status: avgFit >= 70 ? "strong" : avgFit >= 50 ? "moderate" : "weak",
    note: fitScores.length > 0
      ? `Average across ${fitScores.length} precedent(s)`
      : "No fit scores computed",
  });

  // ── 3. Standards coverage ─────────────────────────────────────────────────
  const standards = caseRecord.standards ?? [];
  const correctStds = standards.filter((s) => (s as { applicability?: string }).applicability === "correct").length;
  const stdScore = standards.length === 0 ? 50
    : Math.round((correctStds / standards.length) * 100);
  breakdown.push({
    label: "Standards Coverage",
    score: stdScore,
    weight: 0.20,
    status: stdScore >= 70 ? "strong" : stdScore >= 40 ? "moderate" : "weak",
    note: standards.length === 0
      ? "No IS/ASTM standards linked"
      : `${correctStds} of ${standards.length} standards correctly applied`,
  });

  // ── 4. Evidence completeness ──────────────────────────────────────────────
  const hasFiles = (caseRecord.files?.length ?? 0) > 0;
  const hasTimeline = (caseRecord.timeline?.length ?? 0) >= 3;
  const hasBrief = (caseRecord.brief?.length ?? 0) > 100;
  const evidenceScore = ((hasFiles ? 33 : 0) + (hasTimeline ? 34 : 0) + (hasBrief ? 33 : 0));
  breakdown.push({
    label: "Evidence Completeness",
    score: evidenceScore,
    weight: 0.15,
    status: evidenceScore >= 70 ? "strong" : evidenceScore >= 40 ? "moderate" : "weak",
    note: [
      hasFiles ? "Documents uploaded" : "No documents",
      hasTimeline ? "Timeline present" : "Timeline incomplete",
      hasBrief ? "Case brief present" : "Brief missing",
    ].join(" · "),
  });

  // ── Weighted overall ──────────────────────────────────────────────────────
  const overall = Math.round(
    breakdown.reduce((sum, b) => sum + b.score * b.weight, 0)
  );

  const label =
    overall >= 75 ? "Strong" :
    overall >= 55 ? "Moderate" :
    overall >= 35 ? "Developing" : "Needs Work";

  return { overall, label, breakdown };
}

export function ProbabilityAssessmentCard({
  caseRecord,
  compact = false,
}: ProbabilityAssessmentCardProps) {
  const { overall, label, breakdown } = useMemo(
    () => computeAssessment(caseRecord),
    [caseRecord]
  );

  const overallColor =
    overall >= 75 ? "text-emerald-700" :
    overall >= 55 ? "text-amber-700" :
    "text-red-700";

  const overallBg =
    overall >= 75 ? "bg-emerald-50 border-emerald-200" :
    overall >= 55 ? "bg-amber-50 border-amber-200" :
    "bg-red-50 border-red-200";

  const TrendIcon = overall >= 65 ? TrendingUp : overall >= 40 ? Minus : TrendingDown;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 rounded-md px-3 py-2 border text-sm ${overallBg}`}>
        <TrendIcon className={`h-4 w-4 ${overallColor}`} />
        <span className={`font-semibold ${overallColor}`}>{overall}%</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
    );
  }

  return (
    <Card className={`border ${overallBg}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendIcon className={`h-4 w-4 ${overallColor}`} />
            Case Strength Assessment
          </span>
          <Badge className={
            overall >= 75 ? "bg-emerald-600 text-white" :
            overall >= 55 ? "bg-amber-500 text-white" :
            "bg-red-500 text-white"
          }>
            {overall}% — {label}
          </Badge>
        </CardTitle>
        <p className="text-[10px] text-muted-foreground italic">
          Technical indicator only — not a legal opinion. Based on citation verification, fact-fit scores, and evidence completeness.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {breakdown.map((b) => (
          <div key={b.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground/80">{b.label}</span>
              <div className="flex items-center gap-1.5">
                {b.status === "strong" && <ShieldCheck className="h-3 w-3 text-emerald-600" />}
                {b.status === "moderate" && <ShieldAlert className="h-3 w-3 text-amber-500" />}
                {b.status === "weak" && <ShieldX className="h-3 w-3 text-red-500" />}
                <span className={
                  b.status === "strong" ? "text-emerald-700 font-semibold" :
                  b.status === "moderate" ? "text-amber-700 font-semibold" :
                  "text-red-700 font-semibold"
                }>{b.score}%</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  b.status === "strong" ? "bg-emerald-500" :
                  b.status === "moderate" ? "bg-amber-400" :
                  "bg-red-400"
                }`}
                style={{ width: `${b.score}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">{b.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
