import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Save, Send, CheckCircle2, Printer, ArrowLeft,
  FileText, Eye, ShieldCheck, ShieldAlert, ShieldX,
  IndianRupee, Plus, Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CitationGatePanel } from "@/components/CitationGatePanel";
import { scanDraftForCitations, type GateResult } from "@/lib/citation-gate";

// ─── Types ────────────────────────────────────────────────────────────────────

type DraftStatus = "draft" | "finalized" | "sent";

type BillType =
  | "work_executed"
  | "consultancy_fee"
  | "liquidated_damages"
  | "material_escalation"
  | "advance_recovery";

type BillLine = {
  id: string;
  description: string;
  amountRs: number;
  gstPercent: number | null;
  billType: BillType;
};

export type SafeDraftState = {
  title: string;
  draftType: string;
  subject: string;
  toParty: string;
  fromParty: string;
  content: string;
  legalBasis: string;
  enclosures: string;
  status: DraftStatus;
  bills: BillLine[];
};

interface SafeDraftEditorProps {
  caseTitle?: string;
  caseNumber?: string;
  legalGrounds?: string;
  initialState?: Partial<SafeDraftState>;
  onSave?: (state: SafeDraftState, status: DraftStatus) => Promise<void>;
  onBack?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcTotal(bill: BillLine): number {
  const gst = bill.gstPercent ? bill.amountRs * (bill.gstPercent / 100) : 0;
  return bill.amountRs + gst;
}

function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function newBill(): BillLine {
  return {
    id: Math.random().toString(36).slice(2),
    description: "",
    amountRs: 0,
    gstPercent: null,
    billType: "work_executed",
  };
}

// ─── Gate status icon ─────────────────────────────────────────────────────────

function GateStatusIcon({ result }: { result: GateResult }) {
  if (result.hardBlock)
    return <ShieldX className="w-4 h-4 text-red-500" />;
  if (result.overallStatus === "WARN")
    return <ShieldAlert className="w-4 h-4 text-amber-500" />;
  return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
}

// ─── Status badge colours ─────────────────────────────────────────────────────

function statusBadgeCls(status: DraftStatus): string {
  if (status === "finalized")
    return "bg-primary/10 text-primary border-primary/30";
  if (status === "sent")
    return "bg-emerald-100 text-emerald-800 border-emerald-300";
  return "bg-secondary text-secondary-foreground border-border";
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SafeDraftEditor({
  caseTitle = "",
  caseNumber = "",
  legalGrounds = "",
  initialState,
  onSave,
  onBack,
}: SafeDraftEditorProps) {
  const { toast } = useToast();

  const [title, setTitle]         = useState(initialState?.title    ?? `Draft Reply — ${caseTitle}`);
  const [draftType, setDraftType] = useState(initialState?.draftType ?? "reply_to_show_cause");
  const [subject, setSubject]     = useState(initialState?.subject   ?? `Ref: Case No. ${caseNumber} — Reply to Notice`);
  const [toParty, setToParty]     = useState(initialState?.toParty   ?? "");
  const [fromParty, setFromParty] = useState(initialState?.fromParty ?? "");
  const [content, setContent]     = useState(initialState?.content   ?? "");
  const [legalBasis, setLegalBasis] = useState(initialState?.legalBasis ?? "");
  const [enclosures, setEnclosures] = useState(initialState?.enclosures ?? "");
  const [status, setStatus]       = useState<DraftStatus>(initialState?.status ?? "draft");
  const [bills, setBills]         = useState<BillLine[]>(initialState?.bills ?? []);
  const [showBills, setShowBills] = useState(false);
  const [showGate, setShowGate]   = useState(true);
  const [isSaving, setIsSaving]   = useState(false);

  const gateResult = useMemo(() => {
    const draftText = [title, subject, toParty, fromParty, content, legalBasis, enclosures,
      ...bills.map((bill) => bill.description)].join("\n");
    return scanDraftForCitations(draftText);
  }, [title, subject, toParty, fromParty, content, legalBasis, enclosures, bills]);

  const billsTotal = bills.reduce(
    (sum: number, b: BillLine) => sum + calcTotal(b), 0
  );

  const collectState = (): SafeDraftState => ({
    title, draftType, subject, toParty, fromParty,
    content, legalBasis, enclosures, status, bills,
  });

  // ── Save with gate enforcement ──
  const handleSave = async (newStatus: DraftStatus = status) => {
    if (!title.trim() || !subject.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Title, Subject, and Content are required.",
        variant: "destructive",
      });
      return;
    }

    // HARD BLOCK — PENDING / FATAL_ERROR citations
    if (newStatus !== "draft" && gateResult.hardBlock) {
      const blocked = gateResult.matches
        .filter((m) => m.status === "BLOCKED")
        .length;
      toast({
        title: "⛔ Citation Gate — BLOCKED",
        description: `${blocked} PENDING/FATAL citation(s) detected. Remove them before finalizing.`,
        variant: "destructive",
      });
      return;
    }

    // SOFT WARN — SECONDARY citations
    if (newStatus !== "draft" && gateResult.overallStatus === "WARN") {
      const warnCount = gateResult.matches
        .filter((m) => m.status === "WARN")
        .length;
      const ok = window.confirm(
        `⚠ ${warnCount} SECONDARY citation(s) detected.\n\n` +
        `These need primary verification before filing.\n\nProceed anyway?`
      );
      if (!ok) return;
    }

    setIsSaving(true);
    try {
      const state: SafeDraftState = { ...collectState(), status: newStatus };
      await onSave?.(state, newStatus);
      setStatus(newStatus);
      toast({
        title:
          newStatus === "draft"      ? "Draft saved"      :
          newStatus === "finalized"  ? "Draft finalized"  : "Marked as sent",
        description:
          newStatus === "finalized"
            ? "Citation gate passed. Advocate review is required before filing."
            : undefined,
      });
    } catch {
      toast({
        title: "Save failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Bills CRUD ──
  const addBill    = () => setBills((b: BillLine[]) => [...b, newBill()]);
  const removeBill = (id: string) =>
    setBills((b: BillLine[]) => b.filter((x: BillLine) => x.id !== id));
  const updateBill = (id: string, patch: Partial<BillLine>) =>
    setBills((b: BillLine[]) =>
      b.map((x: BillLine) => (x.id === id ? { ...x, ...patch } : x))
    );

  // ── Inject bills table into draft body ──
  const injectBills = () => {
    if (!bills.length) return;
    const rows = bills
      .map((b: BillLine, i: number) =>
        `${i + 1}. ${b.description}\n   Amount: ${formatINR(b.amountRs)}` +
        (b.gstPercent
          ? ` + ${b.gstPercent}% GST = ${formatINR(calcTotal(b))}`
          : "")
      )
      .join("\n");
    const table =
      `\n\n--- PENDING BILLS / PAYMENT CLAIMS ---\n${rows}\n` +
      `TOTAL CLAIMED: ${formatINR(billsTotal)}\n--- END OF BILLS ---\n`;
    setContent((c: string) => c + table);
    toast({ title: "Bills injected", description: "Payment claims added to draft body." });
  };

  const gateColor =
    gateResult.hardBlock        ? "text-red-600"    :
    gateResult.overallStatus === "WARN" ? "text-amber-600" : "text-emerald-600";

  const gateBorder =
    gateResult.hardBlock        ? "border-red-400"    :
    gateResult.overallStatus === "WARN" ? "border-amber-400" : "border-emerald-300";

  return (
    <div className="flex flex-col h-full">

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b bg-card no-print shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold font-serif">Safe Draft Editor</h1>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${statusBadgeCls(status)}`}>
                {status}
              </span>
              <GateStatusIcon result={gateResult} />
            </div>
            {caseNumber && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Case: {caseNumber} — {caseTitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Gate toggle */}
          <Button
            variant="ghost" size="sm"
            onClick={() => setShowGate((g) => !g)}
            className={`gap-1.5 text-xs ${gateColor}`}
          >
            <GateStatusIcon result={gateResult} />
            {gateResult.hardBlock ? "BLOCKED" :
             gateResult.overallStatus === "WARN" ? "WARN" : "Gate OK"}
          </Button>

          <Button
            variant="outline" size="sm"
            onClick={() => handleSave("draft")}
            disabled={isSaving || status === "sent"}
          >
            <Save className="h-4 w-4 mr-1.5" /> Save
          </Button>

          <Button
            size="sm"
            onClick={() => handleSave("finalized")}
            disabled={
              isSaving ||
              status === "sent" ||
              status === "finalized" ||
              gateResult.hardBlock
            }
            title={gateResult.hardBlock ? "Resolve blocked citations first" : ""}
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark Final
          </Button>

          <Button
            size="sm" variant="outline"
            className="bg-emerald-600 text-white hover:bg-emerald-700 border-0"
            onClick={() => handleSave("sent")}
            disabled={
              isSaving ||
              status === "sent" ||
              status === "draft" ||
              gateResult.hardBlock
            }
          >
            <Send className="h-4 w-4 mr-1.5" /> Mark Sent
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={gateResult.hardBlock}
            onClick={() => { if (!gateResult.hardBlock) window.print(); }}
          >
            <Printer className="h-4 w-4 mr-1.5" /> Print A4
          </Button>
        </div>
      </div>

      {/* ── Hard-block banner ── */}
      {gateResult.hardBlock && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg bg-red-600 text-white px-4 py-2.5 text-sm font-semibold no-print">
          <ShieldX className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            ⛔ Citation Gate BLOCKED —{" "}
            {gateResult.matches.filter((m) => m.status === "BLOCKED").length}{" "}
            PENDING/FATAL citation(s) detected. Resolve them to finalize or print.
          </span>
        </div>
      )}

      {/* ── Main layout ── */}
      {gateResult.hardBlock ? (
        <p className="hidden print:block">Printing blocked by the Citation Gate.</p>
      ) : (
        <article className="hidden print:block">
          <h1>{title}</h1>
          <p>Fact-Fit Gate status · {gateResult.overallStatus}</p>
          <p>Advocate review required before filing · दाखिल करने से पहले अधिवक्ता की समीक्षा आवश्यक है।</p>
          {toParty && <p className="whitespace-pre-wrap">To · {toParty}</p>}
          <p className="whitespace-pre-wrap"><strong>Subject · </strong>{subject}</p>
          <p>Sir/Madam,</p>
          <div className="whitespace-pre-wrap break-words">{content}</div>
          <p>Yours faithfully,</p>
          {fromParty && <p className="whitespace-pre-wrap">{fromParty}</p>}
          {enclosures && <p className="whitespace-pre-wrap"><strong>Enclosures · </strong>{enclosures}</p>}
        </article>
      )}
      <div className="no-print flex flex-1 overflow-hidden">

        {/* ── Letter editor ── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Card className="shadow-md min-h-[900px]">
            <CardContent className="p-8 md:p-12 font-serif text-[15px] leading-relaxed">

              {/* Header row */}
              <div className="flex justify-between items-start border-b pb-6 mb-6 gap-4">
                <div className="space-y-3 w-1/2">
                  <label className="text-[10px] text-muted-foreground font-sans font-semibold uppercase tracking-wider block mb-1">
                    To
                  </label>
                  <Textarea
                    className="text-base font-serif font-bold border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20 resize-none min-h-[60px] p-1"
                    placeholder="Recipient name & address..."
                    value={toParty}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setToParty(e.target.value)}
                  />
                </div>
                <div className="space-y-3 w-1/3 text-right">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-sans font-semibold uppercase tracking-wider block mb-1">
                      Date
                    </label>
                    <div className="py-1 text-sm">{format(new Date(), "dd MMMM yyyy")}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground font-sans font-semibold uppercase tracking-wider block mb-1">
                      From
                    </label>
                    <Input
                      className="text-right text-base font-serif border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20"
                      placeholder="Sender name..."
                      value={fromParty}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFromParty(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6 flex items-start gap-2">
                <span className="font-bold mt-2 shrink-0">Sub:</span>
                <Textarea
                  className="text-base font-bold font-serif border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20 resize-none min-h-[56px] flex-1"
                  placeholder="Subject of the letter..."
                  value={subject}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSubject(e.target.value)}
                />
              </div>

              <div className="mb-4">Sir/Madam,</div>

              {/* Body — gate scans this */}
              <Textarea
                className="w-full min-h-[500px] text-[15px] leading-relaxed font-serif border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20 resize-y p-1"
                placeholder="Draft the letter body here. Any case law citations will be scanned by the Citation Gate in real time..."
                value={content}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              />

              {/* Signature block */}
              <div className="mt-12 space-y-6">
                <div>
                  <div>Yours faithfully,</div>
                  <div className="mt-10 border-b w-48 mb-2" />
                  <div className="text-muted-foreground italic text-sm">Authorized Signatory</div>
                  {fromParty && (
                    <div className="font-semibold text-sm mt-1">{fromParty}</div>
                  )}
                </div>
                <div className="pt-6 border-t">
                  <label className="text-[10px] text-muted-foreground font-sans font-semibold uppercase tracking-wider block mb-1">
                    Enclosures
                  </label>
                  <Input
                    className="font-serif text-sm border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20"
                    placeholder="List enclosures..."
                    value={enclosures}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEnclosures(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right sidebar ── */}
        <div className="w-80 border-l bg-card overflow-y-auto p-4 space-y-4 no-print shrink-0 hidden lg:block">

          {/* Draft metadata */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" /> Draft Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Internal Title</label>
                <Input
                  placeholder="e.g. First Reply to Notice"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Draft Type</label>
                <Select value={draftType} onValueChange={setDraftType}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reply_to_show_cause">Reply to Show Cause</SelectItem>
                    <SelectItem value="counter_notice">Counter Notice</SelectItem>
                    <SelectItem value="legal_objection">Legal Objection</SelectItem>
                    <SelectItem value="payment_demand">Payment Demand</SelectItem>
                    <SelectItem value="time_extension_request">Time Extension Request</SelectItem>
                    <SelectItem value="general_correspondence">General Correspondence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Legal Basis <span className="opacity-50">(internal — not printed)</span>
                </label>
                <Textarea
                  placeholder="Sections 51, 53, 55 ICA — reciprocal promises..."
                  className="min-h-[80px] text-xs resize-none"
                  value={legalBasis}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setLegalBasis(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Case legal grounds reference */}
          {legalGrounds && (
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="text-xs font-semibold flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" /> Case Legal Grounds
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {legalGrounds}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Citation Gate Panel */}
          {showGate && (
            <Card className={`border-2 ${gateBorder}`}>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GateStatusIcon result={gateResult} />
                  Citation Gate
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <CitationGatePanel result={gateResult} />
              </CardContent>
            </Card>
          )}

          {/* Bills & Claims module */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" /> Bills & Claims
                </span>
                <Button
                  variant="ghost" size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => setShowBills((s: boolean) => !s)}
                >
                  {showBills ? "Hide" : "Show"}
                </Button>
              </CardTitle>
            </CardHeader>

            {showBills && (
              <CardContent className="px-4 pb-4 space-y-3">
                {bills.map((bill: BillLine) => (
                  <div key={bill.id} className="space-y-2 p-3 bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <Select
                        value={bill.billType}
                        onValueChange={(v: string) =>
                          updateBill(bill.id, { billType: v as BillType })
                        }
                      >
                        <SelectTrigger className="h-7 text-xs w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work_executed">Work Executed</SelectItem>
                          <SelectItem value="consultancy_fee">Consultancy Fee</SelectItem>
                          <SelectItem value="liquidated_damages">Liquidated Damages</SelectItem>
                          <SelectItem value="material_escalation">Material Escalation</SelectItem>
                          <SelectItem value="advance_recovery">Advance Recovery</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost" size="icon"
                        className="h-6 w-6 text-red-500"
                        onClick={() => removeBill(bill.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    <Input
                      className="text-xs h-7"
                      placeholder="Description..."
                      value={bill.description}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateBill(bill.id, { description: e.target.value })
                      }
                    />

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-muted-foreground">Amount (₹)</label>
                        <Input
                          type="number" className="text-xs h-7"
                          value={bill.amountRs || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateBill(bill.id, { amountRs: parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="w-20">
                        <label className="text-[10px] text-muted-foreground">GST %</label>
                        <Input
                          type="number" className="text-xs h-7"
                          placeholder="18"
                          value={bill.gstPercent ?? ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateBill(bill.id, {
                              gstPercent: e.target.value
                                ? parseFloat(e.target.value)
                                : null,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-right text-primary">
                      Total: {formatINR(calcTotal(bill))}
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline" size="sm"
                  className="w-full gap-1.5 text-xs"
                  onClick={addBill}
                >
                  <Plus className="w-3 h-3" /> Add Bill Line
                </Button>

                {bills.length > 0 && (
                  <>
                    <div className="border-t pt-2 flex justify-between text-sm font-bold">
                      <span>Grand Total</span>
                      <span className="text-primary">{formatINR(billsTotal)}</span>
                    </div>
                    <Button
                      size="sm" className="w-full gap-1.5 text-xs"
                      onClick={injectBills}
                    >
                      <FileText className="w-3 h-3" /> Inject into Draft Body
                    </Button>
                  </>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-family: 'Times New Roman', serif; font-size: 12pt; }
        }
      `}</style>
    </div>
  );
}
