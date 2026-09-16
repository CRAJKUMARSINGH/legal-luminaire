/**
 * CitationVerificationBilingual
 *
 * Runs the citation gate on BOTH English and Hindi panels simultaneously.
 * Reuses the existing citation-gate.ts — purely additive, no changes to protected files.
 *
 * Shows:
 *  - Per-panel status badge (SAFE / WARN / BLOCKED)
 *  - Combined list of all flagged citations from both panels
 *  - Hard block notice if either panel is BLOCKED
 */
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { scanDraftForCitations } from "@/lib/citation-gate";
import type { GateResult } from "@/lib/citation-gate";
import { ShieldCheck, ShieldAlert, ShieldX, Info } from "lucide-react";

/* ── Helpers ────────────────────────────────────────────────────────────── */
const STATUS_ICON = {
  SAFE:    <ShieldCheck className="h-4 w-4 text-emerald-600" />,
  WARN:    <ShieldAlert className="h-4 w-4 text-amber-500" />,
  BLOCKED: <ShieldX className="h-4 w-4 text-red-600" />,
};
const STATUS_BADGE: Record<GateResult["overallStatus"], string> = {
  SAFE:    "bg-emerald-600",
  WARN:    "bg-amber-500",
  BLOCKED: "bg-red-600",
};

function PanelGateResult({
  label,
  result,
}: {
  label: string;
  result: GateResult;
}) {
  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="flex items-center gap-2">
        {STATUS_ICON[result.overallStatus]}
        <span className="font-semibold text-sm">{label}</span>
        <Badge className={STATUS_BADGE[result.overallStatus]}>
          {result.overallStatus}
        </Badge>
        <span className="text-xs text-muted-foreground ml-auto">
          {result.matches.length} citation{result.matches.length !== 1 ? "s" : ""} scanned
        </span>
      </div>
      {result.matches.length > 0 && (
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {result.matches.map((c: import('@/lib/citation-gate').CitationMatch, i: number) => (
            <div
              key={i}
              className={`text-xs rounded p-2 border
                ${c.status === "BLOCKED" ? "bg-red-50 border-red-300 text-red-900"
                : c.status === "WARN"    ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}
            >
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    c.status === "BLOCKED" ? "bg-red-600"
                    : c.status === "WARN"  ? "bg-amber-500"
                    : "bg-emerald-600"
                  }
                >
                  {c.status}
                </Badge>
                <span className="font-mono break-all">{c.rawMatch}</span>
              </div>
              {c.statusNote && (
                <p className="mt-1 text-[11px]">{c.statusNote}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function CitationVerificationBilingual({
  en,
  hi,
}: {
  en: string;
  hi: string;
}) {
  const enResult = useMemo(() => scanDraftForCitations(en), [en]);
  const hiResult = useMemo(() => scanDraftForCitations(hi), [hi]);

  const isBlocked =
    enResult.overallStatus === "BLOCKED" || hiResult.overallStatus === "BLOCKED";
  const isWarn =
    enResult.overallStatus === "WARN" || hiResult.overallStatus === "WARN";

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" />
        Citation Gate — Both Panels
      </h3>

      {isBlocked && (
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertTitle>🔒 Draft Blocked</AlertTitle>
          <AlertDescription>
            One or both panels contain PENDING or FATAL_ERROR citations.
            Resolve before exporting or filing.
          </AlertDescription>
        </Alert>
      )}

      {!isBlocked && isWarn && (
        <Alert className="border-amber-300 bg-amber-50">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Review Required</AlertTitle>
          <AlertDescription className="text-amber-700 text-xs">
            SECONDARY citations detected. Add qualification note before filing.
          </AlertDescription>
        </Alert>
      )}

      {!isBlocked && !isWarn && (
        <Alert className="border-emerald-300 bg-emerald-50">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-800">Both panels clear</AlertTitle>
          <AlertDescription className="text-emerald-700 text-xs">
            All scanned citations are COURT_SAFE or VERIFIED.
          </AlertDescription>
        </Alert>
      )}

      <PanelGateResult label="🇬🇧 English Panel" result={enResult} />
      <PanelGateResult label="🇮🇳 Hindi Panel" result={hiResult} />

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-xs">
          The Citation Gate scans for unverified or fabricated citations in both panels
          independently. Both must be SAFE or WARN (with qualification) before export.
        </AlertDescription>
      </Alert>
    </div>
  );
}
