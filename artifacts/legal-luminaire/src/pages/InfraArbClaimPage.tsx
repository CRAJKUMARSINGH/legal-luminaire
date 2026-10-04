/**
 * InfraArbClaimPage
 * Route: /infra-arb-claims
 *
 * Full-lifecycle Infrastructure Arbitration Claim Statement viewer.
 * Shows the complete Claim Statement (English + Hindi) for a selected
 * infra arbitration case (TC-22 to TC-26), with:
 *  – Claim-by-claim Fact-Fit breakdown
 *  – Standards Matrix
 *  – Section 11 Application draft preview
 *  – Print-ready layout
 *
 * Data source: @/data/demo-cases/infra-arb-cases (SYNTHETIC / DEMO)
 * No API key required.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2, Truck, Droplets, Zap, Trees,
  FileText, Scale, ShieldCheck, AlertTriangle,
  Printer, ChevronDown, ChevronUp, BookOpen,
} from "lucide-react";
import { INFRA_ARB_CASES } from "@/data/demo-cases/infra-arb-cases";

// ── Status badge colours ──────────────────────────────────────────────────────
const STATUS_CLASS: Record<string, string> = {
  VERIFIED:  "bg-emerald-100 text-emerald-800 border-emerald-300",
  SECONDARY: "bg-amber-100  text-amber-800  border-amber-300",
  PENDING:   "bg-red-100    text-red-800    border-red-300",
};

const SCORE_CLASS = (score: number) =>
  score >= 90 ? "text-emerald-700 font-bold" :
  score >= 75 ? "text-blue-700 font-semibold" :
  score >= 50 ? "text-amber-700" :
                "text-red-700";

const CASE_ICONS = [Building2, Truck, Droplets, Zap, Trees];

export default function InfraArbClaimPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [tab, setTab] = useState<"en" | "hi" | "standards" | "sec11">("en");

  const selected = INFRA_ARB_CASES[selectedIdx];
  const Icon = CASE_ICONS[selectedIdx] ?? Building2;

  const handlePrint = () => window.print();

  return (
    <div className="container mx-auto max-w-6xl py-6 px-4 space-y-6">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Infrastructure Arbitration — Claim Statement</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Full-lifecycle claim viewer · Section 11 Application · Hindi &amp; English
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500 text-white">SYNTHETIC / DEMO</Badge>
          <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1.5 print:hidden">
            <Printer className="h-3.5 w-3.5" /> Print / PDF
          </Button>
        </div>
      </div>

      {/* ── Case Selector ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 print:hidden">
        {INFRA_ARB_CASES.map((c, i) => {
          const CIcon = CASE_ICONS[i] ?? Building2;
          return (
            <Button
              key={c.id}
              variant={selectedIdx === i ? "default" : "outline"}
              size="sm"
              onClick={() => { setSelectedIdx(i); setExpandedClaim(null); }}
              className="gap-1.5"
            >
              <CIcon className="h-3.5 w-3.5" />
              {c.id}
            </Button>
          );
        })}
      </div>

      {/* ── Case Header Card ───────────────────────────────────────── */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">{selected.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{selected.contractor}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold text-primary">{selected.contractValue}</div>
              <div className="text-xs text-muted-foreground">Contract Value</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[
              { label: "Total Claim",  value: selected.totalClaim },
              { label: "Verified Claims", value: `${selected.claims.filter(c => c.status === "VERIFIED").length} / ${selected.claims.length}` },
              { label: "Expected Award", value: selected.expectedAward },
              { label: "Status",       value: selected.status },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-muted/40 p-2">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="font-semibold mt-0.5">{value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Claim Matrix ───────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Claim Matrix — Fact-Fit Gate
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2 font-medium">Claim</th>
                  <th className="text-right px-4 py-2 font-medium">Amount</th>
                  <th className="text-center px-4 py-2 font-medium">Score</th>
                  <th className="text-center px-4 py-2 font-medium">Status</th>
                  <th className="text-left px-4 py-2 font-medium">Evidence</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {selected.claims.map((claim) => (
                  <>
                    <tr
                      key={claim.id}
                      className="border-b hover:bg-muted/20 cursor-pointer"
                      onClick={() => setExpandedClaim(expandedClaim === claim.id ? null : claim.id)}
                    >
                      <td className="px-4 py-2.5 font-medium">{claim.title}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{claim.amount}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={SCORE_CLASS(claim.factFitScore)}>{claim.factFitScore}%</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <Badge
                          variant="outline"
                          className={`text-xs ${STATUS_CLASS[claim.status] ?? ""}`}
                        >
                          {claim.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">{claim.evidence}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {expandedClaim === claim.id
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />}
                      </td>
                    </tr>
                    {expandedClaim === claim.id && (
                      <tr key={`${claim.id}-detail`} className="bg-muted/10">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="space-y-2 text-sm">
                            {claim.status === "PENDING" && (
                              <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded p-2 border border-red-200">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <span className="font-medium">BLOCKED FROM DRAFT — Citation unverified. Do not use as primary authority.</span>
                              </div>
                            )}
                            <p className="text-muted-foreground">{claim.facts}</p>
                            <div className="flex flex-wrap gap-2">
                              {claim.clauses?.map(cl => (
                                <Badge key={cl} variant="secondary" className="text-xs">{cl}</Badge>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Document Tabs ──────────────────────────────────────────── */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="print:hidden">
          <TabsTrigger value="en">
            <FileText className="h-3.5 w-3.5 mr-1.5" />Claim (English)
          </TabsTrigger>
          <TabsTrigger value="hi">
            <FileText className="h-3.5 w-3.5 mr-1.5" />दावा (हिंदी)
          </TabsTrigger>
          <TabsTrigger value="standards">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />Standards
          </TabsTrigger>
          <TabsTrigger value="sec11">
            <Scale className="h-3.5 w-3.5 mr-1.5" />Section 11
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en">
          <Card>
            <CardContent className="pt-4">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed bg-muted/20 rounded p-4 overflow-auto max-h-[600px]">
                {selected.claimStatementEn ?? "Full claim statement — see case folder CLAIM_STATEMENT_FULL.lex"}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hi">
          <Card>
            <CardContent className="pt-4">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed bg-muted/20 rounded p-4 overflow-auto max-h-[600px]">
                {selected.claimStatementHi ?? "हिंदी दावा कथन — CLAIM_STATEMENT_HINDI.lex देखें"}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {selected.standards?.map(std => (
                  <div key={std.code} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/10">
                    <Badge variant="outline" className="shrink-0 font-mono text-xs">{std.code}</Badge>
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{std.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{std.clause}</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs ${STATUS_CLASS[std.confidence] ?? ""}`}
                    >
                      {std.confidence}
                    </Badge>
                  </div>
                )) ?? <p className="text-muted-foreground text-sm">See Standards_Matrix_CPWD_FIDIC_IS.md in case folder.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sec11">
          <Card>
            <CardContent className="pt-4">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed bg-muted/20 rounded p-4 overflow-auto max-h-[600px]">
{`IN THE HIGH COURT OF RAJASTHAN AT JODHPUR
Arbitration Application No. _____ / 2026

${selected.contractor?.toUpperCase() ?? "CLAIMANT"}     ...Petitioner

Versus

${selected.employer?.toUpperCase() ?? "RESPONDENT"}    ...Respondent

APPLICATION UNDER SECTION 11(6) OF THE
ARBITRATION AND CONCILIATION ACT, 1996
FOR APPOINTMENT OF SOLE ARBITRATOR / ARBITRAL TRIBUNAL

PRAYER:
(a) Appoint a Sole Arbitrator / Arbitral Tribunal to adjudicate
    disputes arising out of Work Order dated ${selected.workOrderDate ?? "___"};
(b) Direct the Respondent to bear costs of this application;
(c) Pass such other order as this Hon'ble Court deems fit.

[SYNTHETIC / DEMO — Not for filing in any court]`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Print footer ───────────────────────────────────────────── */}
      <div className="hidden print:block text-center text-xs text-muted-foreground border-t pt-4 mt-8">
        SYNTHETIC / DEMO — Legal Luminaire · All case data is fictional and for demonstration purposes only.
      </div>
    </div>
  );
}
