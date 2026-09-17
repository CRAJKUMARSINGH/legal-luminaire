import { FileText, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  checkDiscrepancies,
  type DocType,
} from "@/lib/bilingual-draft";

export interface ComparisonReportProps {
  en: string;
  hi: string;
  docType: DocType;
  titleEn: string;
  caseId: string;
}

export default function ComparisonReport({
  en,
  hi,
  docType,
  titleEn,
  caseId,
}: ComparisonReportProps) {
  const findings = checkDiscrepancies(en, hi);
  const hasContent = Boolean(en.trim() || hi.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          Comparison report
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {titleEn} · {docType} · case {caseId}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={hasContent ? "secondary" : "outline"}>
            {hasContent ? "Content present" : "Draft is empty"}
          </Badge>
          <Badge variant={findings.length ? "destructive" : "secondary"}>
            {findings.length} finding{findings.length === 1 ? "" : "s"}
          </Badge>
        </div>
        <div className="rounded-md border bg-muted/30 p-3 text-xs">
          <p className="flex items-center gap-2 font-medium">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            Export safety
          </p>
          <p className="mt-1 text-muted-foreground">
            This comparison is a deterministic review aid. It does not certify
            translation accuracy, citations, or filing readiness.
          </p>
        </div>
        {findings.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            {findings.slice(0, 6).map((finding, index) => (
              <li key={`${finding.kind}-${index}`}>{finding.suggestion}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
