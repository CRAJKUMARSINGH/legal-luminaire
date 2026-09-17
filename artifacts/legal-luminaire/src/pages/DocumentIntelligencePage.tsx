/**
 * DocumentIntelligencePage — Month 3 Roadmap
 * ─────────────────────────────────────────────────────────────────────────────
 * Wires pdf-extractor.ts into the UI.
 *
 * Lets the user:
 *   1. Upload PDFs, DOCX, .lex files
 *   2. Extract full text in-browser (for .lex/.txt) or via backend (for PDFs)
 *   3. Preview the extracted text
 *   4. Copy the combined text for pasting into AI Drafter / Safe Draft Editor
 *   5. See extraction quality (full / partial / native) and warnings
 *
 * Route: /case/:id/document-intelligence  (added to routes.tsx)
 */

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Upload, FileText, AlertTriangle, CheckCircle2,
  Loader2, Copy, Eye, EyeOff, Trash2, Info,
  File, FileSearch, ChevronDown, ChevronUp, Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { extractFileText, extractMultipleFiles, type ExtractedDocument } from "@/lib/pdf-extractor";
import { useCaseContext } from "@/context/CaseContext";

// ── Types ─────────────────────────────────────────────────────────────────────
type ExtractionPhase = "idle" | "extracting" | "done" | "error";

interface FileEntry {
  id: string;
  file: File;
  phase: ExtractionPhase;
  doc?: ExtractedDocument;
  previewOpen: boolean;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  ".lex",
  ".txt",
  ".md",
];

const QUALITY_CFG: Record<ExtractedDocument["extractionQuality"], { label: string; color: string }> = {
  full:    { label: "Full Extraction",    color: "bg-emerald-600 text-white" },
  partial: { label: "Partial",            color: "bg-amber-500 text-white" },
  native:  { label: "Native Text",        color: "bg-blue-600 text-white" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function DocumentIntelligencePage() {
  const { selectedCase, isDemoMode } = useCaseContext();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [combinedText, setCombinedText] = useState<string>("");
  const [showCombined, setShowCombined] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);

  // ── Add files ─────────────────────────────────────────────────────────────
  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const newEntries: FileEntry[] = Array.from(incoming).map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}`,
      file: f,
      phase: "idle",
      previewOpen: false,
    }));
    setEntries((prev) => {
      const existingKeys = new Set(prev.map((e) => `${e.file.name}-${e.file.size}`));
      return [...prev, ...newEntries.filter((e) => !existingKeys.has(`${e.file.name}-${e.file.size}`))];
    });
  }, []);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  // ── Extract single file ───────────────────────────────────────────────────
  const handleExtractOne = useCallback(async (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, phase: "extracting" } : e));
    try {
      const doc = await extractFileText(entry.file);
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, phase: doc.text ? "done" : "error", doc }
            : e
        )
      );
    } catch (err) {
      setEntries((prev) => prev.map((e) => e.id === id ? { ...e, phase: "error" } : e));
    }
  }, [entries]);

  // ── Extract all files ─────────────────────────────────────────────────────
  const handleExtractAll = useCallback(async () => {
    const pending = entries.filter((e) => e.phase === "idle");
    if (pending.length === 0) return;

    setBatchProgress({ done: 0, total: pending.length });
    const files = pending.map((e) => e.file);

    const { combinedText: combined, results } = await extractMultipleFiles(
      files,
      (done, total) => setBatchProgress({ done, total }),
    );

    const resultMap = new Map(results.map((r) => [r.fileName, r]));
    setEntries((prev) =>
      prev.map((e) => {
        const doc = resultMap.get(e.file.name);
        if (!doc) return e;
        return { ...e, phase: doc.text ? "done" : "error", doc };
      })
    );
    setCombinedText(combined);
    setBatchProgress(null);
    toast({
      title: "Extraction complete",
      description: `${results.length} file(s) processed. ${results.filter((r) => r.text).length} extracted successfully.`,
    });
  }, [entries, toast]);

  // ── Copy combined text ────────────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    const allText = entries
      .filter((e) => e.doc?.text)
      .map((e) => `=== ${e.file.name} ===\n${e.doc!.text}`)
      .join("\n\n" + "=".repeat(60) + "\n\n");

    if (!allText) return;
    try {
      await navigator.clipboard.writeText(allText);
      toast({ title: "Copied!", description: "Extracted text copied to clipboard. Paste into AI Drafter." });
    } catch {
      toast({ title: "Copy failed", description: "Use the preview to manually copy the text.", variant: "destructive" });
    }
  }, [entries, toast]);

  const totalExtracted = entries.filter((e) => e.phase === "done").length;
  const totalWords = entries
    .filter((e) => e.doc?.text)
    .reduce((sum, e) => sum + (e.doc!.text.split(/\s+/).length), 0);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-primary" />
            Document Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Extract text from PDFs and .lex files — inject directly into AI Drafter as source material
          </p>
        </div>
        {isDemoMode && (
          <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">DEMO</Badge>
        )}
      </div>

      {/* Stats row */}
      {entries.length > 0 && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <File className="h-4 w-4" /> {entries.length} file(s) loaded
          </span>
          {totalExtracted > 0 && (
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> {totalExtracted} extracted
            </span>
          )}
          {totalWords > 0 && (
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> ~{totalWords.toLocaleString()} words
            </span>
          )}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="font-medium text-sm">Drop PDF, DOCX, or .lex files here</p>
        <p className="text-xs text-muted-foreground mt-1">
          or click to browse — supports .pdf, .docx, .lex, .txt, .md
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.lex,.txt,.md,text/plain,application/pdf"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Action bar */}
      {entries.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleExtractAll}
            disabled={!!batchProgress || entries.every((e) => e.phase !== "idle")}
          >
            {batchProgress ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> {batchProgress.done}/{batchProgress.total}</>
            ) : (
              <><Zap className="h-3.5 w-3.5" /> Extract All</>
            )}
          </Button>
          {totalExtracted > 0 && (
            <>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCopy}>
                <Copy className="h-3.5 w-3.5" /> Copy All Text
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-xs"
                onClick={() => setShowCombined((x) => !x)}
              >
                {showCombined ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showCombined ? "Hide" : "Preview"} Combined
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-xs text-muted-foreground ml-auto"
            onClick={() => setEntries([])}
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </Button>
        </div>
      )}

      {/* Combined preview */}
      {showCombined && combinedText && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center justify-between">
              <span>Combined Extracted Text — ready for AI Drafter</span>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setShowCombined(false)}>
                <EyeOff className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              readOnly
              value={combinedText}
              className="w-full h-48 text-xs font-mono bg-muted/40 rounded p-2 border resize-none"
            />
          </CardContent>
        </Card>
      )}

      {/* File list */}
      {entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <FileCard
              key={entry.id}
              entry={entry}
              onExtract={() => handleExtractOne(entry.id)}
              onRemove={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))}
              onTogglePreview={() =>
                setEntries((prev) =>
                  prev.map((e) =>
                    e.id === entry.id ? { ...e, previewOpen: !e.previewOpen } : e
                  )
                )
              }
            />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <div>
          <strong>.lex / .txt files</strong> are extracted natively in the browser.
          <strong> PDFs and DOCX</strong> are sent to the backend <code>/omni-preview</code> endpoint for extraction.
          The extracted text is for use as source material in the AI Drafter — it does not alter the filed case record.
          <em> Month 3 upgrade complete: AI Drafter now reads your real uploaded documents, not just static demo data.</em>
        </div>
      </div>
    </div>
  );
}

// ── File card ─────────────────────────────────────────────────────────────────
function FileCard({
  entry, onExtract, onRemove, onTogglePreview,
}: {
  entry: FileEntry;
  onExtract: () => void;
  onRemove: () => void;
  onTogglePreview: () => void;
}) {
  const { file, phase, doc, previewOpen } = entry;
  const sizeKb = (file.size / 1024).toFixed(1);
  const qualityCfg = doc ? QUALITY_CFG[doc.extractionQuality] : null;

  return (
    <Card className={`border transition-colors ${
      phase === "done" ? "border-emerald-200" :
      phase === "error" ? "border-red-200" :
      phase === "extracting" ? "border-blue-200" : ""
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <FileText className={`h-4 w-4 mt-0.5 shrink-0 ${
            phase === "done" ? "text-emerald-600" :
            phase === "error" ? "text-red-500" :
            "text-muted-foreground"
          }`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">{sizeKb} KB</span>
              {qualityCfg && (
                <Badge className={`text-xs ${qualityCfg.color}`}>{qualityCfg.label}</Badge>
              )}
              {doc && doc.pageCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {doc.pageCount} page(s)
                </Badge>
              )}
            </div>

            {/* Metadata */}
            {doc?.metadata?.caseNumber && (
              <p className="text-xs text-muted-foreground mt-1">
                Case No: {doc.metadata.caseNumber}
              </p>
            )}

            {/* Warnings */}
            {doc?.warnings?.filter(Boolean).map((w, i) => (
              <p key={i} className="text-xs text-amber-700 flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3" /> {w}
              </p>
            ))}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
              {phase === "idle" && (
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onExtract}>
                  <FileSearch className="h-3 w-3" /> Extract
                </Button>
              )}
              {phase === "extracting" && (
                <span className="flex items-center gap-1 text-xs text-blue-600">
                  <Loader2 className="h-3 w-3 animate-spin" /> Extracting…
                </span>
              )}
              {phase === "done" && doc?.text && (
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={onTogglePreview}>
                  {previewOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {previewOpen ? "Hide" : "Preview"}
                </Button>
              )}
              {phase === "error" && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Extraction failed
                </span>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600 ml-auto"
                onClick={onRemove}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Preview */}
            {previewOpen && doc?.text && (
              <textarea
                readOnly
                value={doc.text.slice(0, 3000) + (doc.text.length > 3000 ? "\n\n[…truncated for preview]" : "")}
                className="mt-2 w-full h-36 text-xs font-mono bg-muted/40 rounded p-2 border resize-none"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Minor: Zap imported above in the lucide-react block.
