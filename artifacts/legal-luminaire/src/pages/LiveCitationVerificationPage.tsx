/**
 * LiveCitationVerificationPage — Month 2 Roadmap
 * ─────────────────────────────────────────────────────────────────────────────
 * Connects the indianKanoonClient to the UI.
 * Upgrades PENDING / SECONDARY / VERIFIED labels from manual to API-backed checks.
 *
 * Features:
 *  - Enter any case name + citation → live check via Indian Kanoon API
 *  - Batch verify all citations from the active case's case law matrix
 *  - Visual tier upgrade/downgrade with colour coding
 *  - Direct Indian Kanoon link for each hit
 *
 * Route: /case/:id/live-citations  (added to routes.tsx)
 */

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, RefreshCw, ExternalLink, CheckCircle2,
  AlertTriangle, Info, XCircle, ShieldCheck,
  Loader2, BookOpen, Zap,
} from "lucide-react";
import { indianKanoonClient, type CitationVerificationResult, type IKVerificationTier } from "@/lib/indian-kanoon-client";
import { useCaseContext } from "@/context/CaseContext";
import { CASE01_PRECEDENTS } from "@/lib/case01-data";

// ── Tier config ───────────────────────────────────────────────────────────────
const TIER_CFG: Record<IKVerificationTier, {
  label: string; labelHi: string; icon: React.ElementType;
  badgeClass: string; rowClass: string;
}> = {
  VERIFIED:  { label: "Verified",  labelHi: "सत्यापित",   icon: CheckCircle2,   badgeClass: "bg-emerald-600 text-white",           rowClass: "border-emerald-200 bg-emerald-50/40" },
  SECONDARY: { label: "Secondary", labelHi: "द्वितीयक",   icon: Info,           badgeClass: "bg-amber-500 text-white",             rowClass: "border-amber-200 bg-amber-50/40" },
  PENDING:   { label: "Pending",   labelHi: "लंबित",      icon: AlertTriangle,  badgeClass: "bg-red-500 text-white",               rowClass: "border-red-200 bg-red-50/40" },
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface VerificationRow {
  id: string;
  caseName: string;
  citation: string;
  existingStatus: string;
  result?: CitationVerificationResult;
  loading: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LiveCitationVerificationPage() {
  const { selectedCase, isDemoMode } = useCaseContext();

  // ── Manual search ─────────────────────────────────────────────────────────
  const [manualName, setManualName] = useState("");
  const [manualCitation, setManualCitation] = useState("");
  const [manualResult, setManualResult] = useState<CitationVerificationResult | null>(null);
  const [manualLoading, setManualLoading] = useState(false);

  // ── Batch rows (from active case + Case01 precedents) ─────────────────────
  const buildRows = useCallback((): VerificationRow[] => {
    // Combine active case's caseLaw (if any) with the hardcoded case01 precedents
    const caseLawRows: VerificationRow[] = (selectedCase?.caseLaw ?? []).map((cl, i) => ({
      id: `cl-${i}`,
      caseName: cl.case,
      citation: cl.citation ?? "",
      existingStatus: cl.status,
      loading: false,
    }));

    const precedentRows: VerificationRow[] = CASE01_PRECEDENTS
      .filter((p) => p.status !== "PENDING") // don't auto-check pending
      .map((p) => ({
        id: p.id,
        caseName: p.name,
        citation: p.citation,
        existingStatus: p.status,
        loading: false,
      }));

    // Deduplicate: caseLaw takes priority
    const seen = new Set(caseLawRows.map((r) => r.caseName.toLowerCase()));
    const extras = precedentRows.filter((r) => !seen.has(r.caseName.toLowerCase()));
    return [...caseLawRows, ...extras];
  }, [selectedCase]);

  const [rows, setRows] = useState<VerificationRow[]>(() => buildRows());
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchDone, setBatchDone] = useState(false);

  // ── Manual lookup ─────────────────────────────────────────────────────────
  const handleManualSearch = async () => {
    if (!manualName.trim()) return;
    setManualLoading(true);
    setManualResult(null);
    try {
      const res = await indianKanoonClient.verifyCitation(
        manualName.trim(),
        manualCitation.trim(),
        true,
      );
      setManualResult(res);
    } finally {
      setManualLoading(false);
    }
  };

  // ── Batch verify all rows ─────────────────────────────────────────────────
  const handleBatchVerify = async () => {
    setBatchLoading(true);
    setBatchDone(false);
    const updated = [...rows];

    // Mark all as loading
    setRows(updated.map((r) => ({ ...r, loading: true })));

    for (let i = 0; i < updated.length; i++) {
      const row = updated[i];
      try {
        const res = await indianKanoonClient.verifyCitation(row.caseName, row.citation, true);
        updated[i] = { ...row, result: res, loading: false };
      } catch {
        updated[i] = {
          ...row,
          result: {
            rawCitation: row.citation,
            found: false,
            tier: "PENDING",
            error: "Lookup failed",
            fromApi: false,
          },
          loading: false,
        };
      }
      setRows([...updated]);
      // Small delay to avoid hammering the API
      await new Promise((r) => setTimeout(r, 400));
    }

    setBatchLoading(false);
    setBatchDone(true);
  };

  const handleClearCache = () => {
    indianKanoonClient.clearCache();
    setRows(buildRows());
    setBatchDone(false);
    setManualResult(null);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const verifiedCount = rows.filter((r) => r.result?.tier === "VERIFIED").length;
  const secondaryCount = rows.filter((r) => r.result?.tier === "SECONDARY").length;
  const pendingCount = rows.filter((r) => r.result?.tier === "PENDING").length;
  const checkedCount = rows.filter((r) => r.result !== undefined).length;

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Live Citation Verification
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Indian Kanoon API-backed — PENDING/SECONDARY/VERIFIED labels updated from manual to live checks
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDemoMode && (
            <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">
              DEMO
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={handleClearCache} className="gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Clear Cache
          </Button>
        </div>
      </div>

      {/* Manual Search Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Search className="h-4 w-4" /> Single Citation Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium">Case Name *</label>
              <Input
                className="mt-1 text-sm"
                placeholder="e.g. Kattavellai @ Devakar v. State of Tamil Nadu"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Citation / Year (optional)</label>
              <Input
                className="mt-1 text-sm"
                placeholder="e.g. 2025 INSC 845"
                value={manualCitation}
                onChange={(e) => setManualCitation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
              />
            </div>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleManualSearch}
            disabled={manualLoading || !manualName.trim()}
          >
            {manualLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
            Verify on Indian Kanoon
          </Button>

          {/* Manual result */}
          {manualResult && (
            <ManualResultCard result={manualResult} caseName={manualName} />
          )}
        </CardContent>
      </Card>

      {/* Batch Verify Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" /> Batch Verify — Case Law Matrix
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({rows.length} citations)
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {batchDone && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{verifiedCount} verified</span>
                  <span className="text-amber-700">{secondaryCount} secondary</span>
                  <span className="text-red-700">{pendingCount} pending</span>
                </div>
              )}
              <Button
                size="sm"
                className="gap-1.5"
                onClick={handleBatchVerify}
                disabled={batchLoading}
              >
                {batchLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
                {batchLoading ? `Checking ${checkedCount}/${rows.length}…` : "Verify All"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No citations in active case. Add case law in the Case Law Matrix first.
            </p>
          ) : (
            <div className="space-y-2">
              {rows.map((row) => (
                <CitationRow key={row.id} row={row} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <div>
          Verification is performed via Indian Kanoon's search API through the backend proxy.
          A HIGH-confidence match returns <strong>VERIFIED</strong>; a low-confidence match
          returns <strong>SECONDARY</strong>; not found returns <strong>PENDING</strong>.
          Always obtain a certified copy from the official source before filing.
          Results are cached for the browser session.
        </div>
      </div>
    </div>
  );
}

// ── Manual result card ────────────────────────────────────────────────────────
function ManualResultCard({ result, caseName }: { result: CitationVerificationResult; caseName: string }) {
  const tier = result.tier as IKVerificationTier;
  const cfg = TIER_CFG[tier];
  const TierIcon = cfg.icon;

  return (
    <div className={`rounded-lg border p-4 space-y-2 ${cfg.rowClass}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <TierIcon className="h-4 w-4" />
        <span className="font-semibold text-sm">{caseName}</span>
        <Badge className={cfg.badgeClass}>{cfg.label} · {cfg.labelHi}</Badge>
        {result.found && (
          <Badge variant="outline" className="text-emerald-700 border-emerald-400 text-xs">
            Found on Indian Kanoon
          </Badge>
        )}
      </div>
      {result.matchedTitle && (
        <p className="text-xs text-foreground/80">
          <strong>Matched:</strong> {result.matchedTitle}
        </p>
      )}
      {result.headnote && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2 line-clamp-3">
          {result.headnote}
        </p>
      )}
      {result.error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <XCircle className="h-3 w-3" /> {result.error}
        </p>
      )}
      {result.documentUrl && (
        <a
          href={result.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" /> View on Indian Kanoon
        </a>
      )}
    </div>
  );
}

// ── Citation row (batch list) ─────────────────────────────────────────────────
function CitationRow({ row }: { row: VerificationRow }) {
  const cfg = row.result ? TIER_CFG[row.result.tier as IKVerificationTier] : null;
  const existingCfg = getExistingStatusCfg(row.existingStatus);

  return (
    <div className={`rounded-lg border p-3 transition-colors ${cfg ? cfg.rowClass : "bg-muted/20"}`}>
      <div className="flex items-start gap-3">
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate max-w-xs">{row.caseName}</span>
            {row.citation && (
              <span className="text-xs text-muted-foreground font-mono">{row.citation}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {/* Existing status */}
            <span className="text-[10px] text-muted-foreground">Was:</span>
            <Badge variant="outline" className={`text-xs ${existingCfg.color}`}>
              {row.existingStatus}
            </Badge>
            {/* New status from API */}
            {row.loading && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Checking…
              </span>
            )}
            {!row.loading && row.result && cfg && (
              <>
                <span className="text-[10px] text-muted-foreground">→ Now:</span>
                <Badge className={`text-xs ${cfg.badgeClass}`}>
                  {cfg.label}
                </Badge>
                {row.result.documentUrl && (
                  <a
                    href={row.result.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-xs text-primary hover:underline ml-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </>
            )}
          </div>
          {!row.loading && row.result?.headnote && (
            <p className="mt-1 text-[11px] text-muted-foreground italic line-clamp-2 border-l-2 border-primary/20 pl-2">
              {row.result.headnote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getExistingStatusCfg(status: string): { color: string } {
  switch (status.toUpperCase()) {
    case "VERIFIED":
    case "COURT_SAFE":
      return { color: "text-emerald-700 border-emerald-400" };
    case "SECONDARY":
      return { color: "text-amber-700 border-amber-400" };
    default:
      return { color: "text-red-700 border-red-400" };
  }
}
