/**
 * InfraArbClaimPage — Infrastructure Arbitration Claim Statement Viewer
 * Source: SUPPLEMENT/ARBITRATE.MD (TC-22 to TC-26 expanded claim statements)
 * + SUPPLEMENT/genspark.md (activation gap analysis)
 *
 * Features:
 *   - Full structured claim statements for all 5 infra arb cases
 *   - Fact-Fit Gate scoring per claim
 *   - FIDIC/CPWD clause references
 *   - Hindi/English toggle
 *   - Pre-filing checklist
 *   - Key contradiction spotlight
 *   - Print/copy-ready output
 *
 * Route: /infra-arb-claims  (added to routes.tsx)
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2, Truck, Droplets, Zap, Trees,
  CheckCircle2, AlertTriangle, XCircle, Info,
  Scale, FileText, ChevronDown, ChevronUp,
  Copy, Printer, BookOpen, ShieldAlert,
  ClipboardCheck, Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  INFRA_ARB_CLAIM_DATA, CLAIM_STATUS_CONFIG,
  type InfraArbCase, type ClaimItem, type ClaimStatus,
} from "@/data/demo-cases/infra-arb-claim-data";

const CASE_ICONS = [Building2, Truck, Droplets, Zap, Trees];
const STATUS_ICONS: Record<ClaimStatus, React.ElementType> = {
  VERIFIED: CheckCircle2,
  SECONDARY: AlertTriangle,
  PENDING: XCircle,
};

function FactFitBar({ score, status }: { score: number; status: ClaimStatus }) {
  const color =
    status === "VERIFIED" ? "bg-emerald-500" :
    status === "SECONDARY" ? "bg-amber-400" : "bg-red-400";
  const textColor =
    status === "VERIFIED" ? "text-emerald-700" :
    status === "SECONDARY" ? "text-amber-700" : "text-red-700";
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[11px] font-bold ${textColor}`}>{score}%</span>
    </div>
  );
}

function ClaimCard({
  claim, lang, caseId,
}: {
  claim: ClaimItem; lang: "en" | "hi"; caseId: string;
}) {
  const [open, setOpen] = useState(false);
  const cfg = CLAIM_STATUS_CONFIG[claim.status];
  const StatusIcon = STATUS_ICONS[claim.status];
  const facts = lang === "hi" ? claim.factsHindi : claim.facts;

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg}`}>
      <button
        type="button"
        onClick={() => setOpen((x) => !x)}
        className="w-full flex items-start gap-3 p-4 text-left hover:opacity-90 transition-opacity"
      >
        <div className={`rounded-full p-1.5 shrink-0 mt-0.5 ${
          claim.status === "VERIFIED" ? "bg-emerald-100" :
          claim.status === "SECONDARY" ? "bg-amber-100" : "bg-red-100"
        }`}>
          <StatusIcon className={`h-3.5 w-3.5 ${cfg.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black text-muted-foreground uppercase">
              Claim {claim.claimNo}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {lang === "hi" ? claim.titleHindi : claim.title}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs font-bold text-foreground">
              ₹{claim.amount.toFixed(2)} Cr
            </span>
            <Badge className={`text-[10px] ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
              {cfg.label} · {cfg.labelHi}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{claim.clause}</span>
          </div>
          <FactFitBar score={claim.factFitScore} status={claim.status} />
        </div>
        <div className="shrink-0">
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/40 pt-3">
          {claim.warning && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">{claim.warning}</p>
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {lang === "hi" ? "तथ्य" : "Facts"} · {lang === "hi" ? "Facts" : "तथ्य"}
            </p>
            <ol className="space-y-1 list-none">
              {facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  <span className="text-foreground/80">{fact}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              {lang === "hi" ? "गणना" : "Calculation"} · {lang === "hi" ? "Calculation" : "गणना"}
            </p>
            <pre className="text-[11px] font-mono bg-muted/40 border border-border/60 rounded-lg px-3 py-2 whitespace-pre-wrap leading-relaxed">
              {claim.calculation}
            </pre>
          </div>

          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              {lang === "hi" ? "साक्ष्य" : "Evidence"} · {lang === "hi" ? "Evidence" : "साक्ष्य"}
            </p>
            <ul className="space-y-1">
              {claim.evidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                  <FileText className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {claim.precedents.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Precedents · पूर्व निर्णय
              </p>
              <ul className="space-y-1">
                {claim.precedents.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px]">
                    <BookOpen className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-foreground/70 italic">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InfraArbClaimPage() {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState("TC-23");
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [showChecklist, setShowChecklist] = useState(false);

  const selectedCase = useMemo(
    () => INFRA_ARB_CLAIM_DATA.find((c) => c.id === selectedId)!,
    [selectedId]
  );

  const totalClaim = selectedCase.claims.reduce((s, c) => s + c.amount, 0);
  const verifiedAmount = selectedCase.claims
    .filter((c) => c.status === "VERIFIED")
    .reduce((s, c) => s + c.amount, 0);
  const verifiedCount = selectedCase.claims.filter((c) => c.status === "VERIFIED").length;
  const avgFitScore = Math.round(
    selectedCase.claims.reduce((s, c) => s + c.factFitScore, 0) / selectedCase.claims.length
  );

  const handleCopy = async () => {
    const text = selectedCase.claims.map((c) =>
      `CLAIM ${c.claimNo}: ${c.title}\nAmount: ₹${c.amount.toFixed(2)} Cr\nStatus: ${c.status} (${c.factFitScore}% fit)\nClause: ${c.clause}\nCalculation: ${c.calculation}\n`
    ).join("\n---\n");
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Claim statement copied!", description: "Paste into your document." });
    } catch {
      toast({ title: "Copy failed", description: "Use the print option instead.", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Infrastructure Arbitration — Claim Statements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            TC-22 to TC-26 · Full structured claims with Fact-Fit Gate · FIDIC/CPWD clause links · Hindi/English
          </p>
        </div>
        <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">DEMO</Badge>
      </div>

      {/* Case selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {INFRA_ARB_CLAIM_DATA.map((c, i) => {
          const Icon = CASE_ICONS[i];
          const isSelected = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-medium transition-all ${
                isSelected ? "border-primary bg-primary/10 text-primary shadow-sm" : "hover:border-primary/40 text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-black">{c.id}</span>
              <span className="text-center text-[10px] leading-tight">{c.employerShort}</span>
            </button>
          );
        })}
      </div>

      {/* Case header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-bold text-base">
                {lang === "hi" ? selectedCase.projectNameHindi : selectedCase.projectName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedCase.contractor} v. {selectedCase.employer}
              </p>
              <p className="text-xs text-muted-foreground">{selectedCase.court}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {selectedCase.arbitrationClause}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div className="flex gap-1 bg-muted/40 rounded-lg p-1">
                {(["en", "hi"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      lang === l ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {l === "en" ? "English" : "हिंदी"}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7" onClick={handleCopy}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7" onClick={() => window.print()}>
                  <Printer className="h-3 w-3" /> Print
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: "Contract Value", value: `₹${selectedCase.contractValue.toFixed(2)} Cr` },
              { label: "Total Claim", value: `₹${totalClaim.toFixed(2)} Cr`, sub: `${selectedCase.claims.length} claims` },
              { label: "Verified Claims", value: `₹${verifiedAmount.toFixed(2)} Cr`, sub: `${verifiedCount}/${selectedCase.claims.length} verified` },
              { label: "Avg Fact-Fit Score", value: `${avgFitScore}%`, sub: "across all claims" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-background/60 border border-border/40 p-3">
                <p className="text-lg font-black text-foreground">{s.value}</p>
                <p className="text-[11px] font-medium text-foreground/80">{s.label}</p>
                {s.sub && <p className="text-[10px] text-muted-foreground">{s.sub}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Contradiction Spotlight */}
      <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4">
        <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-red-800 uppercase tracking-wider">
            Key Contradiction — Employer's Fatal Inconsistency
          </p>
          <p className="text-sm text-red-700 mt-1">{selectedCase.keyContradicton}</p>
        </div>
      </div>

      {/* Claims list */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <Target className="h-4 w-4" /> Claims — Fact-Fit Gate Scored
          <span className="text-xs font-normal ml-1">(click any claim to expand)</span>
        </h2>
        <div className="space-y-3">
          {selectedCase.claims.map((claim) => (
            <ClaimCard key={claim.claimNo} claim={claim} lang={lang} caseId={selectedCase.id} />
          ))}
        </div>
      </div>

      {/* Pre-Filing Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <button
            type="button"
            className="flex items-center justify-between w-full"
            onClick={() => setShowChecklist((x) => !x)}
          >
            <CardTitle className="text-sm flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Pre-Filing Checklist · दाखिल करने से पहले जाँच-सूची
              <Badge variant="outline" className="text-xs">
                {selectedCase.preFilingChecklist.length} items
              </Badge>
            </CardTitle>
            {showChecklist ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
        </CardHeader>
        {showChecklist && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {(lang === "hi" ? selectedCase.preFilingChecklistHindi : selectedCase.preFilingChecklist).map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <input type="checkbox" className="mt-0.5 shrink-0" />
                  <span className="text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <div>
          <strong>DEMO MODE — Synthetic data only.</strong> All facts, names, amounts, and case references are illustrative.
          VERIFIED claims require certified copies of all listed evidence before filing.
          SECONDARY/PENDING claims require additional professional substantiation.
          Never file without advocate review.
        </div>
      </div>
    </div>
  );
}
