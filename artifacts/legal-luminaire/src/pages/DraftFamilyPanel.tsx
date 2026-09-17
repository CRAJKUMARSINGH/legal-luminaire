/**
 * DraftFamilyPanel — "Draft Multiplication" studio.
 *
 * Converts ONE parent draft into the full "document family":
 *   rejoinder / counter-claim / written submissions / supplementary
 *   affidavit / evidence application / cross-exam questions /
 *   objections / appeal memorial / stay / compliance / review / execution
 *
 * Pairing is subject × derivative_type gated by registry:derivative_drafts.json.
 * Every generated draft carries a rendered lineage-audit block (header + anchors
 * + synthetic disclaimer) plus a structured lineage payload for the UI tree.
 *
 * Wired to:
 *   GET/POST /api/v1/case/:id/derivative/generate
 *   GET/POST /api/v1/case/:id/derivative/family
 *   GET /api/v1/derivative/registry  (subjects + types listing)
 *   GET /api/v1/derivative/subject/:id/types
 *
 * Consumes existing UI building blocks (Card, Button, Badge, Select, Tabs,
 * ScrollArea, Textarea, Input) from /components/ui — purely additive import.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCaseContext } from "@/context/CaseContext";
import { useToast } from "@/hooks/use-toast";
import {
  draftFamilyClient,
  pairingColorForType,
  defaultSubjectFromDraftTitle,
  type DerivativeAnchor,
  type DerivativeAvailableTypesResponse,
  type DerivativeFamilyResponse,
  type DerivativeGenerateResponse,
  type DerivativeLineage,
  type DerivativeRegistryResponse,
  type DerivativeSubjectInfo,
  type DerivativeTypeInfo,
} from "@/lib/draft-family";
import {
  GitBranch,
  Play,
  FolderGit2,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Download,
  Sparkles,
  Search,
  Loader2,
  Link2,
  FileText,
  RefreshCw,
  ChevronRight,
  Eye,
  Wand2,
  Scale,
} from "lucide-react";

export default function DraftFamilyPanel() {
  const { selectedCase } = useCaseContext();
  const { toast } = useToast();

  const caseId = selectedCase?.id || "CASE01_HEMRAJ_STATE_2025";
  const caseTitle = selectedCase?.title || "Hemraj vs State & Another";

  // ── Registry state ─────────────────────────────────────────────────────
  const [registry, setRegistry] = useState<DerivativeRegistryResponse | null>(null);
  const [registryLoading, setRegistryLoading] = useState(false);
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

  // ── Inputs ─────────────────────────────────────────────────────────────
  const [parentDraftId, setParentDraftId] = useState<string>(() => `${caseId}_discharge_v1`);
  const [parentDraftText, setParentDraftText] = useState<string>(() => {
    return (
`1. **Jurisdiction & Cause of Action** — Petitioner resides within jurisdiction.
2. **Factual Narrative** — On 15-03-2025 Respondent dishonoured cheque no. 4321 for Rs 5,50,000.
3. **Legal Notice** — Statutory notice dated 20-03-2025; Reply received 28-03-2025 denying liability.
4. **Grounds** — Presumption under NI 139; failure to prove legally enforceable debt shifts burden.
5. **Prayers** — (a) Convict Respondent u/s 138 NI Act; (b) Award compensation with costs.`
    );
  });
  const [parentType, setParentType] = useState<string>("initial");
  const [subjectId, setSubjectId] = useState<string>("cheque_dishonour");
  const [derivativeTypeId, setDerivativeTypeId] = useState<string>("rejoinder");
  const [useLlm, setUseLlm] = useState<boolean>(true);

  // ── Available types for the chosen subject ─────────────────────────────
  const [availableTypes, setAvailableTypes] = useState<DerivativeTypeInfo[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);

  // ── Generation state ───────────────────────────────────────────────────
  const [singleGenerating, setSingleGenerating] = useState(false);
  const [familyGenerating, setFamilyGenerating] = useState(false);
  const [singleResult, setSingleResult] = useState<DerivativeGenerateResponse | null>(null);
  const [familyResult, setFamilyResult] = useState<DerivativeFamilyResponse | null>(null);
  const [activeFamilyTab, setActiveFamilyTab] = useState<string>("");

  // ── Search (Citation Search hookup) ────────────────────────────────────
  const [subjectSearch, setSubjectSearch] = useState<string>("");

  // ── Helpers ────────────────────────────────────────────────────────────
  const showToast = useCallback(
    (title: string, description: string, variant: "default" | "destructive" = "default") => {
      toast({ title, description, variant });
    },
    [toast]
  );

  // ── Load registry & health on mount ────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function init() {
      setRegistryLoading(true);
      try {
        const [h, r] = await Promise.all([
          draftFamilyClient.health(),
          draftFamilyClient.getRegistry(),
        ]);
        if (cancelled) return;
        setFeatureEnabled(h.enabled);
        setRegistry(r);
      } catch (err) {
        if (cancelled) return;
        showToast(
          "Registry unavailable",
          `Could not load derivative-draft registry. ${(err as Error).message}`,
          "destructive"
        );
      } finally {
        if (!cancelled) setRegistryLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  // ── When subject changes, refresh the applicable types list ────────────
  useEffect(() => {
    if (!subjectId) return;
    let cancelled = false;
    async function load() {
      setTypesLoading(true);
      try {
        const res: DerivativeAvailableTypesResponse = await draftFamilyClient.getAvailableTypes(subjectId);
        if (cancelled) return;
        setAvailableTypes(res.available_types || []);
        // If the currently selected derivative_type is no longer applicable, pick the first available
        if (res.available_types?.length && !res.available_types.some((t) => t.id === derivativeTypeId)) {
          setDerivativeTypeId(res.available_types[0].id);
        }
      } catch (err) {
        if (cancelled) return;
        showToast(
          "Types lookup failed",
          (err as Error).message,
          "destructive"
        );
      } finally {
        if (!cancelled) setTypesLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [subjectId, derivativeTypeId, showToast]);

  // ── Suggest a default subject from case title ──────────────────────────
  useEffect(() => {
    if (!registry?.subjects?.length) return;
    const suggested = defaultSubjectFromDraftTitle(caseTitle);
    if (registry.subjects.some((s) => s.id === suggested)) {
      setSubjectId(suggested);
    }
  }, [registry, caseTitle]);

  // ── Filtered subjects list (by search) ─────────────────────────────────
  const filteredSubjects: DerivativeSubjectInfo[] = useMemo(() => {
    if (!registry?.subjects) return [];
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return registry.subjects;
    return registry.subjects.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.label.toLowerCase().includes(q)
    );
  }, [registry, subjectSearch]);

  // ── Actions ────────────────────────────────────────────────────────────
  const validateInputs = useCallback((): string | null => {
    if (!parentDraftText.trim()) return "Parent draft text cannot be empty.";
    if (parentDraftText.length < 10) return "Parent draft text is too short (min 10 chars).";
    if (!parentDraftId.trim()) return "Parent draft id cannot be empty.";
    if (!subjectId.trim()) return "Select a legal subject.";
    if (!derivativeTypeId.trim()) return "Select a derivative type.";
    if (!availableTypes.some((t) => t.id === derivativeTypeId)) {
      return `Derivative type '${derivativeTypeId}' is not applicable for subject '${subjectId}'.`;
    }
    return null;
  }, [parentDraftText, parentDraftId, subjectId, derivativeTypeId, availableTypes]);

  const handleGenerateOne = useCallback(async () => {
    const problem = validateInputs();
    if (problem) {
      showToast("Cannot generate", problem, "destructive");
      return;
    }
    setSingleGenerating(true);
    setSingleResult(null);
    try {
      const res = await draftFamilyClient.generateDerivative(caseId, {
        parent_draft_id: parentDraftId,
        parent_type: parentType,
        parent_draft_text: parentDraftText,
        subject_id: subjectId,
        derivative_type_id: derivativeTypeId,
        use_llm: useLlm,
      });
      setSingleResult(res);
      if (res.success) {
        showToast(
          "Derivative draft ready",
          `${res.derivative_type_id} · ${res.lineage?.anchors?.length || 0} anchors · ${(res.draft_content?.length || 0).toLocaleString()} chars`,
          "default"
        );
      } else {
        showToast("Generation failed", res.error || "Unknown error", "destructive");
      }
    } catch (err) {
      showToast(
        "Network error",
        (err as Error).message,
        "destructive"
      );
    } finally {
      setSingleGenerating(false);
    }
  }, [caseId, parentDraftId, parentType, parentDraftText, subjectId, derivativeTypeId, useLlm, validateInputs, showToast]);

  const handleGenerateFamily = useCallback(async () => {
    const problem = validateInputs();
    if (problem) {
      showToast("Cannot generate family", problem, "destructive");
      return;
    }
    setFamilyGenerating(true);
    setFamilyResult(null);
    setActiveFamilyTab("");
    try {
      const res = await draftFamilyClient.generateFamily(caseId, {
        parent_draft_id: parentDraftId,
        parent_type: parentType,
        parent_draft_text: parentDraftText,
        subject_id: subjectId,
        use_llm: useLlm,
      });
      setFamilyResult(res);
      if (res.success) {
        const firstSuccess = Object.entries(res.family || {}).find(
          ([, v]) => (v as DerivativeGenerateResponse)?.success
        );
        setActiveFamilyTab(firstSuccess ? firstSuccess[0] : "overview");
        showToast(
          "Document family generated",
          `${res.success_count}/${res.total_types} succeeded · ${res.failed_types?.length || 0} failed`,
          res.success_count > 0 ? "default" : "destructive"
        );
      } else {
        showToast("Family generation failed", res.error || "Unknown error", "destructive");
      }
    } catch (err) {
      showToast("Network error", (err as Error).message, "destructive");
    } finally {
      setFamilyGenerating(false);
    }
  }, [caseId, parentDraftId, parentType, parentDraftText, subjectId, validateInputs, showToast]);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied", `${label} copied to clipboard.`);
    } catch (err) {
      showToast("Copy failed", (err as Error).message, "destructive");
    }
  }, [showToast]);

  const downloadDraft = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // ── Sub-components ──────────────────────────────────────────────────────
  const TypeChips = ({ onPick }: { onPick?: (id: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {(availableTypes.length ? availableTypes : registry?.derivative_types || []).map((t) => {
        const active = t.id === derivativeTypeId;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setDerivativeTypeId(t.id);
              onPick?.(t.id);
            }}
            className={
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
              (active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : `${pairingColorForType(t.id)} hover:shadow-sm`)
            }
          >
            <span className="font-semibold">{t.label_en}</span>
            <span className="text-[10px] opacity-70">/ {t.label_hi}</span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </button>
        );
      })}
    </div>
  );

  const LineageTree = ({ lineage }: { lineage: DerivativeLineage | null }) => {
    if (!lineage) return null;
    return (
      <div className="space-y-3 rounded-lg border bg-muted/40 p-4 text-sm">
        <div className="flex items-center gap-2 font-semibold">
          <Link2 className="h-4 w-4 text-primary" />
          Lineage Audit — {lineage.anchors?.length || 0} anchors
        </div>
        <div className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
          <div><span className="opacity-60">Parent:</span> {lineage.parent?.draft_id} ({lineage.parent?.type})</div>
          <div><span className="opacity-60">Derivative:</span> {lineage.derivative?.type_label_en}</div>
          <div><span className="opacity-60">Subject:</span> {lineage.subject?.label}</div>
          <div><span className="opacity-60">Generated:</span> {lineage.generated_at}</div>
        </div>
        <div className="space-y-1.5 pt-2">
          {lineage.anchors?.map((a: DerivativeAnchor, i: number) => (
            <div key={a.anchor_id || i} className="rounded-md border bg-card px-3 py-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-[10px]">
                  [{a.anchor_id}]
                </Badge>
                <span className="text-[10px] opacity-60">{a.page_refs}</span>
              </div>
              <div className="mt-1 text-xs leading-snug">{a.anchor_summary}</div>
              <div className="mt-1 text-[10px] opacity-60">
                <span className="font-medium">{a.anchor_ref}</span> — {a.transform_strategy}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DraftPreview = ({ result }: { result: DerivativeGenerateResponse }) => (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={result.success ? "verified" : "fatal"} className="text-xs">
            {result.success ? "Draft OK" : "Draft FAILED"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {result.derivative_type_id}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {(result.draft_content?.length || 0).toLocaleString()} chars
          </Badge>
          {result.pairing_valid === false && (
            <Badge variant="destructive" className="text-xs">
              ⚠ Pairing rejected
            </Badge>
          )}
          <Badge variant="pending" className="text-xs">
            SYNTHETIC / DEMO
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(result.draft_content || "", "Draft text")}
            disabled={!result.success}
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadDraft(
                result.draft_content || "",
                `${caseId}_${result.derivative_type_id}.txt`
              )
            }
            disabled={!result.success}
          >
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </div>

      <LineageTree lineage={result.lineage} />

      <div className="rounded-lg border bg-background">
        <div className="flex items-center gap-2 border-b px-4 py-2 text-xs font-medium text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          Draft content — {result.derivative_type_id}
        </div>
        <ScrollArea className="h-[520px] w-full">
          <pre className="whitespace-pre-wrap px-5 py-4 font-mono text-[12.5px] leading-relaxed">
            {result.error && !result.success
              ? `ERROR: ${result.error}`
              : result.draft_content || ""}
          </pre>
        </ScrollArea>
      </div>

      {result.disclaimer && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700">
          <AlertTriangle className="mr-2 inline h-3.5 w-3.5 align-text-bottom" />
          {result.disclaimer}
        </div>
      )}
    </div>
  );

  const subjectsById = useMemo(() => {
    const m: Record<string, DerivativeSubjectInfo> = {};
    (registry?.subjects || []).forEach((s) => (m[s.id] = s));
    return m;
  }, [registry]);

  const typesById = useMemo(() => {
    const m: Record<string, DerivativeTypeInfo> = {};
    (registry?.derivative_types || []).forEach((t) => (m[t.id] = t));
    return m;
  }, [registry]);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="flex flex-col gap-5 p-4 sm:p-6">
        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Draft Multiplication Studio
                <span className="ml-2 text-sm font-normal text-muted-foreground">/ व्युत्पन्न ड्राफ्ट स्टूडियो</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                One parent draft → full document family (rejoinder, appeal, cross-exam bank, objections, execution…). Pairing-gated · Lineage-audited · Synthetic demo.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {featureEnabled !== null && (
              <Badge variant={featureEnabled ? "courtSafe" : "pending"} className="text-xs">
                {featureEnabled ? (
                  <>
                    <ShieldCheck className="mr-1 h-3 w-3" /> FEATURE LIVE
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-1 h-3 w-3" /> FEATURE OFFLINE
                  </>
                )}
              </Badge>
            )}
            {registry && (
              <Badge variant="secondary" className="text-xs">
                v{registry.registry_version} · {registry.subjects_count} subjects · {registry.derivative_types_count} types
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                setRegistryLoading(true);
                try {
                  setRegistry(await draftFamilyClient.getRegistry());
                  showToast("Refreshed", "Registry reloaded.");
                } catch (err) {
                  showToast("Refresh failed", (err as Error).message, "destructive");
                } finally {
                  setRegistryLoading(false);
                }
              }}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${registryLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>

        {!featureEnabled && featureEnabled !== null && (
          <div className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 p-4 text-sm text-amber-700">
            <AlertTriangle className="mr-2 inline h-4 w-4 align-text-bottom" />
            <span className="font-semibold">Write endpoints are disabled.</span> Set environment variable{" "}
            <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs">FEATURE_DERIVATIVE_DRAFTS=true</code> on the backend to activate POST generation. Registry listing (/registry, /subjects, /types, /health) remains available.
          </div>
        )}

        {/* ── Main Tabs ─────────────────────────────────────────────── */}
        <Tabs defaultValue="single" className="w-full">
          <TabsList>
            <TabsTrigger value="single">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> One Derivative
            </TabsTrigger>
            <TabsTrigger value="family">
              <GitBranch className="mr-1.5 h-3.5 w-3.5" /> Whole Family
            </TabsTrigger>
            <TabsTrigger value="registry">
              <Scale className="mr-1.5 h-3.5 w-3.5" /> Registry (50 Subjects)
            </TabsTrigger>
          </TabsList>

          {/* ── Single Derivative Tab ─────────────────────────────── */}
          <TabsContent value="single" className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
              {/* Left column: Inputs */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wand2 className="h-4 w-4" /> Parent & Pairing
                  </CardTitle>
                  <CardDescription>
                    Paste your parent draft, choose the subject area and derivative type, then multiply.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Case</label>
                    <Input value={`${caseId} · ${caseTitle}`} disabled />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Parent draft id
                      </label>
                      <Input
                        value={parentDraftId}
                        onChange={(e) => setParentDraftId(e.target.value)}
                        placeholder="e.g. discharge_v3"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Parent stage
                      </label>
                      <Select value={parentType} onValueChange={setParentType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="initial">Initial / Petition</SelectItem>
                          <SelectItem value="reply">Reply / WS</SelectItem>
                          <SelectItem value="rejoinder">Rejoinder</SelectItem>
                          <SelectItem value="supplementary">Supplementary</SelectItem>
                          <SelectItem value="issues_framed">Issues framed</SelectItem>
                          <SelectItem value="evidence_affidavit">Evidence affidavit</SelectItem>
                          <SelectItem value="evidence_list">Evidence list</SelectItem>
                          <SelectItem value="judgment_or_order">Judgment / Order</SelectItem>
                          <SelectItem value="appeal_memorial">Appeal memorial</SelectItem>
                          <SelectItem value="conditional_order">Conditional order</SelectItem>
                          <SelectItem value="decree_or_award">Decree / Award</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Parent draft text (source of anchors)
                    </label>
                    <Textarea
                      value={parentDraftText}
                      onChange={(e) => setParentDraftText(e.target.value)}
                      className="min-h-[220px] font-mono text-[12.5px]"
                      placeholder="Paste the parent pleading. Numbered paragraphs and Issue/Ground/Prayer headings are automatically extracted as anchors."
                    />
                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{parentDraftText.length.toLocaleString()} chars</span>
                      <span>Min 10 chars · Max 80,000 chars</span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Legal subject (50 available)
                    </label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Search 50 subjects… e.g. cheque, maintenance, medical, bail"
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                      />
                    </div>
                    <Select
                      value={subjectId}
                      onValueChange={(v) => {
                        setSubjectId(v);
                        setSubjectSearch("");
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Pick a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-[260px]">
                          {filteredSubjects.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              <span className="truncate">
                                <span className="font-mono text-[10px] opacity-60 mr-1.5">[{s.id}]</span>
                                {s.label}
                                <span className="ml-2 text-[10px] opacity-50">
                                  · {s.applicable_types.length} types
                                </span>
                              </span>
                            </SelectItem>
                          ))}
                          {filteredSubjects.length === 0 && (
                            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                              No subjects match "{subjectSearch}".
                            </div>
                          )}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <div className="mt-1.5 text-[11px] text-muted-foreground">
                      Chosen: <span className="font-medium">{subjectsById[subjectId]?.label || subjectId}</span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="block text-xs font-medium text-muted-foreground">
                        Derivative type — applicable to this subject
                      </label>
                      {typesLoading && (
                        <span className="text-[10px] text-muted-foreground">refreshing…</span>
                      )}
                    </div>
                    <TypeChips />
                  </div>

                  <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Eye className="h-3.5 w-3.5" />
                      <span>
                        Use LLM to flesh out skeleton (if API key configured)
                        <span className="ml-1 opacity-60">/ एलएलएम का उपयोग करें</span>
                      </span>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                        checked={useLlm}
                        onChange={(e) => setUseLlm(e.target.checked)}
                      />
                      <span className="text-xs font-medium">{useLlm ? "On" : "Skeleton only"}</span>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      onClick={handleGenerateOne}
                      disabled={singleGenerating || !featureEnabled}
                      className="flex-1"
                    >
                      {singleGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" /> Generate Derivative
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGenerateFamily}
                      disabled={familyGenerating || !featureEnabled}
                    >
                      <FolderGit2 className="mr-2 h-4 w-4" /> Whole Family
                    </Button>
                  </div>

                  {!featureEnabled && featureEnabled !== null && (
                    <div className="text-[11px] text-muted-foreground">
                      Write endpoints disabled — results above are statically stubbed. Enable{" "}
                      <code className="rounded bg-background px-1">FEATURE_DERIVATIVE_DRAFTS=true</code> on backend to activate.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Right column: Output */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" /> Derivative Draft Output
                  </CardTitle>
                  <CardDescription>
                    Each generated draft carries a rendered lineage-audit block (anchors + header/footer) plus a structured lineage payload (for UI tree views).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {singleResult ? (
                    <DraftPreview result={singleResult} />
                  ) : singleGenerating ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                      <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm">Multiplying the parent draft into a {derivativeTypeId}…</p>
                      <p className="text-xs">Pairing: {subjectId} × {derivativeTypeId}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Sparkles className="h-7 w-7" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground">No derivative generated yet</h3>
                      <p className="mt-1 max-w-md text-sm">
                        Fill in the parent draft on the left, pick a legal subject and derivative type, then click{" "}
                        <span className="font-medium text-foreground">Generate Derivative</span> to see the output with full lineage audit.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Whole Family Tab ─────────────────────────────────────── */}
          <TabsContent value="family" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <GitBranch className="h-4 w-4" /> Full Document Family Generator
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (for subject: {subjectsById[subjectId]?.label || subjectId})
                  </span>
                </CardTitle>
                <CardDescription>
                  Generates EVERY derivative_type applicable to the chosen subject — one button press. Pairing is whitelisted in registry. You can inspect each member, copy, or download individually.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleGenerateFamily}
                    disabled={familyGenerating || !featureEnabled}
                  >
                    {familyGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Multiplying…
                      </>
                    ) : (
                      <>
                        <FolderGit2 className="mr-2 h-4 w-4" /> Generate Full Family
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Applicable types for this subject:{" "}
                    <span className="font-medium text-foreground">{availableTypes.length}</span>
                    {" · "}
                    {availableTypes.map((t) => (
                      <Badge
                        key={t.id}
                        variant="outline"
                        className="ml-1 text-[10px]"
                      >
                        {t.id}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {familyResult ? (
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Scale className="h-4 w-4" /> Family Results
                      </CardTitle>
                      <CardDescription>
                        {familyResult.success_count} of {familyResult.total_types} drafts succeeded.
                        {familyResult.failed_types?.length ? (
                          <span className="ml-1 text-destructive">
                            Failed: {familyResult.failed_types.join(", ")}.
                          </span>
                        ) : null}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="courtSafe" className="text-xs">
                        {familyResult.success_count} OK
                      </Badge>
                      {familyResult.failed_types?.length ? (
                        <Badge variant="fatal" className="text-xs">
                          {familyResult.failed_types.length} failed
                        </Badge>
                      ) : null}
                      <Badge variant="pending" className="text-xs">SYNTHETIC</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {Object.keys(familyResult.family || {}).length ? (
                    <Tabs value={activeFamilyTab} onValueChange={setActiveFamilyTab}>
                      <TabsList className="mb-3 flex flex-wrap h-auto">
                        <TabsTrigger value="overview" className="h-8 text-xs">
                          Overview
                        </TabsTrigger>
                        {Object.entries(familyResult.family).map(([typeId, val]) => {
                          const v = val as DerivativeGenerateResponse;
                          return (
                            <TabsTrigger key={typeId} value={typeId} className="h-8 text-xs">
                              <div className="flex items-center gap-1.5">
                                {v?.success ? (
                                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3 text-rose-600" />
                                )}
                                <span className={pairingColorForType(typeId) + " rounded px-1.5 py-0.5"}>
                                  {typesById[typeId]?.label_en || typeId}
                                </span>
                              </div>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                      <TabsContent value="overview">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {Object.entries(familyResult.family).map(([typeId, val]) => {
                            const v = val as DerivativeGenerateResponse;
                            const tinfo = typesById[typeId];
                            return (
                              <div
                                key={typeId}
                                className={
                                  "rounded-lg border p-4 transition-shadow hover:shadow-sm " +
                                  (v?.success ? "" : "border-dashed opacity-80")
                                }
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <Badge className="text-[10px]" variant="outline">
                                      {tinfo?.label_en || typeId}
                                    </Badge>
                                    <div className="mt-1 text-[11px] opacity-60">
                                      {tinfo?.label_hi}
                                    </div>
                                  </div>
                                  <Badge
                                    variant={v?.success ? "verified" : "fatal"}
                                    className="text-[10px]"
                                  >
                                    {v?.success ? "OK" : "FAIL"}
                                  </Badge>
                                </div>
                                <div className="mt-3 space-y-1 text-xs">
                                  <div>
                                    Anchors:{" "}
                                    <span className="font-medium">
                                      {v?.lineage?.anchors?.length || 0}
                                    </span>
                                  </div>
                                  <div>
                                    Draft length:{" "}
                                    <span className="font-medium">
                                      {(v?.draft_content?.length || 0).toLocaleString()} chars
                                    </span>
                                  </div>
                                  <div>
                                    Stage hint:{" "}
                                    <span className="font-medium">
                                      {tinfo?.stage_hint || "—"}
                                    </span>
                                  </div>
                                  <div>
                                    Typical delay:{" "}
                                    <span className="font-medium">
                                      {tinfo?.typical_delay_days || 0} days
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setActiveFamilyTab(typeId)}
                                  >
                                    <Eye className="h-3.5 w-3.5" /> Inspect
                                  </Button>
                                  {v?.success && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        downloadDraft(
                                          v.draft_content,
                                          `${caseId}_${typeId}.txt`
                                        )
                                      }
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700">
                          <AlertTriangle className="mr-2 inline h-3.5 w-3.5 align-text-bottom" />
                          {familyResult.disclaimer}
                        </div>
                      </TabsContent>

                      {Object.entries(familyResult.family).map(([typeId, val]) => (
                        <TabsContent key={typeId} value={typeId}>
                          <DraftPreview result={val as DerivativeGenerateResponse} />
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      No family members were produced — check the error.
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : familyGenerating ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">Generating the full document family for {subjectId}…</p>
                  <p className="text-xs">This can take a moment for large subjects with 10–12 applicable types.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <GitBranch className="mb-4 h-10 w-10 text-primary/60" />
                  <h3 className="text-base font-semibold text-foreground">Family not generated yet</h3>
                  <p className="mt-1 max-w-md text-sm">
                    Generate the whole family to see every applicable derivative type for this subject. You can then inspect each draft individually with its lineage audit.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Registry Tab ──────────────────────────────────────────── */}
          <TabsContent value="registry">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scale className="h-4 w-4" /> 50 Legal Subjects × 12 Derivative Types
                </CardTitle>
                <CardDescription>
                  The pairing matrix. Only pairs explicitly whitelisted in{" "}
                  <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-[11px]">subjects[].applicable_types</code> are accepted by the generate endpoints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search subjects by label or id…"
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                  />
                </div>
                <div className="rounded-lg border">
                  <div className="grid grid-cols-12 gap-2 border-b bg-muted/40 px-4 py-2 text-[11px] font-semibold text-muted-foreground">
                    <div className="col-span-3">Subject</div>
                    <div className="col-span-7">Label</div>
                    <div className="col-span-2 text-right"># Types</div>
                  </div>
                  <ScrollArea className="h-[520px] w-full">
                    {filteredSubjects.map((s, idx) => (
                      <div
                        key={s.id}
                        className={
                          "grid grid-cols-12 items-center gap-2 border-b px-4 py-2.5 text-xs last:border-b-0 " +
                          (idx % 2 ? "bg-muted/20" : "")
                        }
                      >
                        <div className="col-span-3 flex items-center gap-1.5">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                            {s.id}
                          </code>
                        </div>
                        <div className="col-span-7 truncate">
                          {s.label}
                        </div>
                        <div className="col-span-2 flex flex-wrap items-center justify-end gap-1">
                          <Badge variant="secondary" className="text-[10px]">
                            {s.applicable_types.length}/12
                          </Badge>
                        </div>
                        <div className="col-span-12 mt-1.5 flex flex-wrap gap-1">
                          {s.applicable_types.map((tid) => (
                            <span
                              key={tid}
                              className={
                                "rounded px-1.5 py-0.5 text-[10px] " +
                                pairingColorForType(tid)
                              }
                            >
                              {typesById[tid]?.label_en || tid}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {filteredSubjects.length === 0 && (
                      <div className="px-4 py-12 text-center text-xs text-muted-foreground">
                        No subjects match "{subjectSearch}".
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Footer banner ─────────────────────────────────────────── */}
        <div className="rounded-xl border bg-gradient-to-r from-primary/5 via-primary/0 to-primary/5 p-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>
                Next steps after multiplying drafts:{" "}
                <span className="font-medium text-foreground">
                  (1) Accuracy Gate — run the drafts through the citation-verification engine.{" "}
                  (2) Deadline Engine — auto-schedule rejoinder limitation dates.{" "}
                  (3) Print / export to PDF.
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
