/**
 * ComparisonReport
 *
 * Generates a printable side-by-side comparison report:
 *  - Bilingual summary table (doc type, word counts, discrepancy count)
 *  - Pre-filing bilingual checklist (both languages must satisfy all items)
 *  - Citation gate status for both panels (if provided)
 */
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { checkDiscrepancies, type DocType } from "@/lib/bilingual-draft";
import { Printer, CheckSquare, XSquare, MinusSquare } from "lucide-react";

/* expose wordCount from lib for external use */
function wordCount(t: string) {
  return t.trim() === "" ? 0 : t.trim().split(/\s+/).length;
}

interface ChecklistItem {
  id: string;
  labelEn: string;
  labelHi: string;
  checkEn: (text: string) => boolean;
  checkHi: (text: string) => boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "cause-title",
    labelEn: "Cause title present (IN THE COURT OF / IN THE HON'BLE…)",
    labelHi: "वाद शीर्षक उपस्थित (माननीय न्यायालय में…)",
    checkEn: (t) => /IN THE (COURT|HON)/i.test(t),
    checkHi: (t) => /माननीय|न्यायालय में/.test(t),
  },
  {
    id: "case-no",
    labelEn: "Case / Petition number placeholder present",
    labelHi: "मामला / याचिका संख्या प्लेसहोल्डर उपस्थित",
    checkEn: (t) => /NO\.\s*\[/.test(t) || /\d{1,6}\/\d{4}/.test(t),
    checkHi: (t) => /संख्या/.test(t),
  },
  {
    id: "parties",
    labelEn: "Versus / parties block present",
    labelHi: "बनाम / पक्षकार ब्लॉक उपस्थित",
    checkEn: (t) => /VERSUS|V\.\s*S\.|v\.\s*State/i.test(t),
    checkHi: (t) => /बनाम/.test(t),
  },
  {
    id: "prayer",
    labelEn: "Prayer / relief clause present",
    labelHi: "प्रार्थना / अनुतोष खंड उपस्थित",
    checkEn: (t) => /PRAYER|RELIEF SOUGHT|prayed/i.test(t),
    checkHi: (t) => /प्रार्थना|अनुतोष/.test(t),
  },
  {
    id: "date-place",
    labelEn: "Place and Date present",
    labelHi: "स्थान और दिनांक उपस्थित",
    checkEn: (t) => /Place:/i.test(t) && /Date:/i.test(t),
    checkHi: (t) => /स्थान:/.test(t) && /दिनांक:/.test(t),
  },
  {
    id: "counsel-line",
    labelEn: "Counsel signature line present",
    labelHi: "अधिवक्ता हस्ताक्षर पंक्ति उपस्थित",
    checkEn: (t) => /Counsel|Advocate/i.test(t),
    checkHi: (t) => /अधिवक्ता|वकील/.test(t),
  },
  {
    id: "word-min",
    labelEn: "Minimum 100 words in English panel",
    labelHi: "हिंदी पैनल में न्यूनतम 100 शब्द",
    checkEn: (t) => wordCount(t) >= 100,
    checkHi: (t) => wordCount(t) >= 100,
  },
  {
    id: "no-placeholder",
    labelEn: "No unfilled [PLACEHOLDER] values",
    labelHi: "कोई अधूरा [प्लेसहोल्डर] नहीं",
    checkEn: (t) => !/\[[A-Z\s/]+\]/.test(t),
    checkHi: (t) => !/\[[^\]]{3,}\]/.test(t),
  },
];

const STATUS_ICON = {
  pass: <CheckSquare className="h-4 w-4 text-emerald-600" />,
  fail: <XSquare className="h-4 w-4 text-red-500" />,
  na: <MinusSquare className="h-4 w-4 text-muted-foreground" />,
};

interface Props {
  en: string;
  hi: string;
  docType: DocType;
  titleEn: string;
  caseId: string;
}

export default function ComparisonReport({ en, hi, docType, titleEn, caseId }: Props) {
  const discrepancies = useMemo(() => checkDiscrepancies(en, hi), [en, hi]);
  const highCount = discrepancies.filter((d) => d.severity === "high").length;

  const checklist = useMemo(
    () =>
      CHECKLIST_ITEMS.map((item) => ({
        ...item,
        passEn: item.checkEn(en),
        passHi: item.checkHi(hi),
      })),
    [en, hi],
  );

  const allPass = checklist.every((c) => c.passEn && c.passHi);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-5 text-sm">
      {/* Summary */}
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">Bilingual Draft Report</h3>
          <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1.5 print:hidden">
            <Printer className="h-3.5 w-3.5" /> Print / PDF
          </Button>
        </div>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-2 border">Field</th>
              <th className="text-left p-2 border">English</th>
              <th className="text-left p-2 border">Hindi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border font-medium">Document Type</td>
              <td className="p-2 border">{titleEn}</td>
              <td className="p-2 border">
                {BILINGUAL_DOCTYPE_LABELS[docType] ?? docType}
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium">Word Count</td>
              <td className="p-2 border">{wordCount(en).toLocaleString()}</td>
              <td className="p-2 border">{wordCount(hi).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="p-2 border font-medium">Characters</td>
              <td className="p-2 border">{en.length.toLocaleString()}</td>
              <td className="p-2 border">{hi.length.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="p-2 border font-medium">Discrepancies</td>
              <td className="p-2 border" colSpan={2}>
                <Badge className={highCount > 0 ? "bg-red-600" : "bg-emerald-600"}>
                  {discrepancies.length} total · {highCount} high
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pre-filing checklist */}
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Pre-Filing Bilingual Checklist
            {allPass ? (
              <Badge className="ml-2 bg-emerald-600">All pass ✓</Badge>
            ) : (
              <Badge className="ml-2 bg-red-600">Issues found</Badge>
            )}
          </h3>
        </div>
        <div className="space-y-1">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-2 rounded-md p-2 text-xs
                ${!item.passEn || !item.passHi ? "bg-red-50 border border-red-200" : "bg-emerald-50"}`}
            >
              <div className="flex gap-1 mt-0.5 shrink-0">
                {item.passEn ? STATUS_ICON.pass : STATUS_ICON.fail}
                {item.passHi ? STATUS_ICON.pass : STATUS_ICON.fail}
              </div>
              <div>
                <p className="font-medium text-foreground">{item.labelEn}</p>
                <p className="text-muted-foreground">{item.labelHi}</p>
                {(!item.passEn || !item.passHi) && (
                  <p className="text-red-700 mt-0.5">
                    {!item.passEn && "English panel: not satisfied. "}
                    {!item.passHi && "Hindi panel: not satisfied."}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          First icon = English panel · Second icon = Hindi panel
        </p>
      </div>
    </div>
  );
}

const BILINGUAL_DOCTYPE_LABELS: Partial<Record<DocType, string>> = {
  discharge: "आरोपमुक्ति आवेदन",
  bail: "जमानत आवेदन",
  written_submissions: "लिखित प्रस्तुतियाँ",
  notice_reply: "नोटिस का उत्तर",
  writ: "रिट याचिका",
  other: "अन्य",
};

/* import fix for wordCount from lib */