import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { checkDiscrepancies, type DiscrepancyResult } from "@/lib/bilingual-draft";

export interface DiscrepancyCheckerProps {
  en: string;
  hi: string;
}

const severityClass: Record<DiscrepancyResult["severity"], string> = {
  high: "border-red-200 bg-red-50",
  medium: "border-amber-200 bg-amber-50",
  low: "border-blue-200 bg-blue-50",
};

export default function DiscrepancyChecker({
  en,
  hi,
}: DiscrepancyCheckerProps) {
  const discrepancies = checkDiscrepancies(en, hi);
  if (discrepancies.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        No deterministic discrepancies found. Human review is still required.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {discrepancies.length} deterministic comparison finding
        {discrepancies.length === 1 ? "" : "s"}.
      </p>
      {discrepancies.map((item, index) => (
        <div
          key={`${item.kind}-${index}`}
          className={`rounded-lg border p-3 ${severityClass[item.severity]}`}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 space-y-1 text-sm">
              <p className="font-medium">
                {item.kind.replaceAll("_", " ")} · {item.severity}
              </p>
              <p>
                English: <strong>{item.enPhrase || "—"}</strong> · Hindi:{" "}
                <strong>{item.hiPhrase || "—"}</strong>
              </p>
              <p className="text-xs">{item.suggestion}</p>
              {item.statusNote && (
                <p className="text-xs text-muted-foreground">{item.statusNote}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
