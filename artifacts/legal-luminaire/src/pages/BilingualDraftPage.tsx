/**
 * BilingualDraftPage
 * Route: /case/:id/bilingual-draft
 *
 * Side-by-side bilingual drafting and review studio.
 * Three tabs:  ✏️ Draft  |  🔍 Discrepancies  |  📋 Report & Citation Gate
 *
 * Week 1–3 feature — additive, does not touch any protected file.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import BilingualSideBySideEditor from "@/components/BilingualSideBySideEditor";
import DiscrepancyChecker from "@/components/DiscrepancyChecker";
import ComparisonReport from "@/components/ComparisonReport";
import CitationVerificationBilingual from "@/components/CitationVerificationBilingual";
import {
  BILINGUAL_TEMPLATES,
  getTemplate,
  saveBilingualDraft,
  loadBilingualDraft,
  checkDiscrepancies,
  type DocType,
  type BilingualContent,
} from "@/lib/bilingual-draft";
import { useCaseContext } from "@/context/CaseContext";
import {
  Save,
  Trash2,
  FileDown,
  RotateCcw,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

/* ── Doc type options ────────────────────────────────────────────────────── */
const DOC_TYPES: { value: DocType; labelEn: string; labelHi: string }[] = [
  { value: "discharge",           labelEn: "Discharge Application",  labelHi: "आरोपमुक्ति आवेदन" },
  { value: "bail",                labelEn: "Bail Application",        labelHi: "जमानत आवेदन" },
  { value: "written_submissions", labelEn: "Written Submissions",     labelHi: "लिखित प्रस्तुतियाँ" },
  { value: "notice_reply",        labelEn: "Notice Reply",            labelHi: "नोटिस उत्तर" },
  { value: "writ",                labelEn: "Writ Petition",           labelHi: "रिट याचिका" },
  { value: "other",               labelEn: "Other",                   labelHi: "अन्य" },
];

const EMPTY: BilingualContent = { en: "", hi: "" };

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function BilingualDraftPage() {
  const { id: caseId } = useParams<{ id: string }>();
  const { selectedCase } = useCaseContext();
  const resolvedCaseId = caseId ?? selectedCase?.id ?? "demo";

  const [docType,    setDocType]    = useState<DocType>("discharge");
  const [content,   setContent]    = useState<BilingualContent>(EMPTY);
  const [savedAt,   setSavedAt]    = useState("");
  const [tab,       setTab]        = useState("draft");
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  const [dirty,     setDirty]      = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const template = useMemo(() => getTemplate(docType), [docType]);
  const docLabel = DOC_TYPES.find((d) => d.value === docType);
  const discrepancyCount = useMemo(() => checkDiscrepancies(content.en, content.hi).length, [content]);

  /* ── Load saved draft when doc type or case changes ─────────────────── */
  useEffect(() => {
    const saved = loadBilingualDraft(resolvedCaseId, docType);
    if (saved) {
      setContent({ en: saved.en, hi: saved.hi });
      setSavedAt(saved.savedAt);
    } else {
      setContent(EMPTY);
      setSavedAt("");
    }
    setDirty(false);
  }, [resolvedCaseId, docType]);

  /* ── Auto-save every 30 s while dirty ───────────────────────────────── */
  useEffect(() => {
    if (!dirty) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      handleSave(true);
    }, 30_000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, dirty]);

  const handleChange = useCallback((updated: BilingualContent) => {
    setContent(updated);
    setDirty(true);
  }, []);

  const handleSave = (auto = false) => {
    saveBilingualDraft({
      id: `${resolvedCaseId}-${docType}`,
      caseId: resolvedCaseId,
      docType,
      titleEn: docLabel?.labelEn ?? docType,
      titleHi: docLabel?.labelHi ?? docType,
      en: content.en,
      hi: content.hi,
      savedAt: new Date().toISOString(),
      discrepancies: checkDiscrepancies(content.en, content.hi),
    });
    setSavedAt(new Date().toLocaleTimeString());
    setDirty(false);
    if (!auto) console.info("[BilingualDraft] Saved manually.");
  };

  const handleLoadTemplate = () => {
    if (!template) return;
    setContent({ en: template.en, hi: template.hi });
    setDirty(true);
  };

  const handleClear = () => {
    setContent(EMPTY);
    setDirty(true);
  };

  const handleExport = () => {
    const blob = new Blob(
      [
        `BILINGUAL DRAFT — ${docLabel?.labelEn ?? docType}\n`,
        `Case: ${resolvedCaseId} | Saved: ${savedAt || "not saved"}\n`,
        "=".repeat(80) + "\n\n",
        "ENGLISH\n" + "-".repeat(40) + "\n",
        content.en,
        "\n\n" + "HINDI / हिंदी\n" + "-".repeat(40) + "\n",
        content.hi,
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bilingual-draft-${docType}-${resolvedCaseId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-[1400px] space-y-4 py-6 px-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🇬🇧 / 🇮🇳 Bilingual Draft Studio
          </h1>
          <p className="text-sm text-muted-foreground">
            Side-by-side Hindi & English drafting with real-time discrepancy checking and citation gate.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {dirty && (
            <Badge variant="outline" className="text-amber-700 border-amber-300 animate-pulse">
              Unsaved changes
            </Badge>
          )}
          {savedAt && !dirty && (
            <Badge variant="outline" className="text-emerald-700 border-emerald-300">
              Saved {savedAt}
            </Badge>
          )}
          {discrepancyCount > 0 && (
            <Badge className="bg-amber-500">{discrepancyCount} discrepancies</Badge>
          )}
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-xl border">
        {/* Doc type selector */}
        <Select value={docType} onValueChange={(v) => setDocType(v as DocType)}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Document type" />
          </SelectTrigger>
          <SelectContent>
            {DOC_TYPES.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.labelEn} · {d.labelHi}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="sm" variant="outline" onClick={handleLoadTemplate} disabled={!template} className="gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          Load Template
        </Button>

        <Button size="sm" variant="outline" onClick={() => setReadOnlyMode((v) => !v)} className="gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          {readOnlyMode ? "Exit Review Mode" : "Review Mode"}
        </Button>

        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" onClick={handleClear} className="gap-1.5 text-destructive">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5">
            <FileDown className="h-3.5 w-3.5" /> Export .txt
          </Button>
          <Button size="sm" onClick={() => handleSave()} disabled={!dirty} className="gap-1.5">
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
        </div>
      </div>

      {readOnlyMode && (
        <Alert className="border-blue-300 bg-blue-50">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            Review Mode — both panels are read-only. Switch back to edit.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="draft">✏️ Draft</TabsTrigger>
          <TabsTrigger value="discrepancies" className="relative">
            🔍 Discrepancies
            {discrepancyCount > 0 && (
              <Badge className="ml-1.5 bg-amber-500 text-white text-[10px] h-4 px-1">
                {discrepancyCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="report">📋 Report & Citation Gate</TabsTrigger>
        </TabsList>

        {/* Tab 1 — Editor */}
        <TabsContent value="draft">
          <BilingualSideBySideEditor
            value={content}
            onChange={handleChange}
            readOnly={readOnlyMode}
            height={560}
            showCounts={true}
          />
        </TabsContent>

        {/* Tab 2 — Discrepancies */}
        <TabsContent value="discrepancies" className="max-w-2xl">
          <DiscrepancyChecker en={content.en} hi={content.hi} />
        </TabsContent>

        {/* Tab 3 — Report + Citation Gate */}
        <TabsContent value="report">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComparisonReport
              en={content.en}
              hi={content.hi}
              docType={docType}
              titleEn={docLabel?.labelEn ?? docType}
              caseId={resolvedCaseId}
            />
            <CitationVerificationBilingual en={content.en} hi={content.hi} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
