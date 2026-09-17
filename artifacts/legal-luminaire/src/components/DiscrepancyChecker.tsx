/**
 * DiscrepancyChecker
 *
 * Real-time panel that lists all terminology / section / date mismatches
 * detected between the English and Hindi panels.
 * Wired into BilingualDraftPage — rendered as a collapsible sidebar.
 */
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { checkDiscrepancies, type DiscrepancyResult } from "@/lib/bilingual-draft";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

const KIND_LABEL: Record<DiscrepancyResult["kind"], string> = {
  terminology_mismatch: "Terminology",
  section_mismatch: "Section No.",
  party_name_mismatch: "Party Name",
  date_mismatch: "Date",
};

const SEVERITY_COLOR: Record<DiscrepancyResult["severity"], string> = {
  high:   "bg-red-100 border-red-300 text-red-900",
  medium: "bg-amber-100 border-amber-300 text-amber-900",
  low:    "bg-blue-100 border-blue-300 text-blue-900",
};

const SEV_BADGE: Record<DiscrepancyResult["severity"], string> = {
  high:   "bg-red-600",
  medium: "bg-amber-500",
  low:    "bg-blue-600",
};

export default function DiscrepancyChecker({ en, hi }: { en: string; hi: string }) {
  const issues = useMemo(() => checkDiscrepancies(en, hi), [en, hi]);
  const high   = issues.filter((i) => i.severity === "high").length;
  const medium = issues.filter((i) => i.severity === "medium").length;

  if (issues.length === 0) {
    return (
      <Alert className="border-emerald-300 bg-emerald-50">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <AlertTitle className="text-emerald-800">No discrepancies detected</AlertTitle>
        <AlertDescription className="text-emerald-700 text-xs">
          Both panels are consistent on terminology, section numbers and dates.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <span>
          {issues.length} discrepanc{issues.length === 1 ? "y" : "ies"} found
        </span>
        {high > 0 && (
          <Badge className="bg-red-600">{high} high</Badge>
        )}
        {medium > 0 && (
          <Badge className="bg-amber-500">{medium} medium</Badge>
        )}
      </div>

      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {issues.map((issue, i) => (
          <div
            key={i}
            className={`rounded-md border p-3 text-xs space-y-1 ${SEVERITY_COLOR[issue.severity]}`}
          >
            <div className="flex items-center gap-2">
              <Badge className={`${SEV_BADGE[issue.severity]} text-white text-[10px]`}>
                {issue.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {KIND_LABEL[issue.kind]}
              </Badge>
            </div>
            <p>{issue.suggestion}</p>
            <div className="flex gap-3 font-mono pt-0.5">
              {issue.enPhrase && (
                <span className="text-blue-800 bg-blue-50 px-1 rounded">EN: {issue.enPhrase}</span>
              )}
              {issue.hiPhrase && (
                <span className="text-amber-800 bg-amber-50 px-1 rounded">HI: {issue.hiPhrase}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-xs">
          High-severity issues (section numbers, dates) must be resolved before filing.
          Medium issues (terminology) should be checked for legal accuracy.
        </AlertDescription>
      </Alert>
    </div>
  );
}
