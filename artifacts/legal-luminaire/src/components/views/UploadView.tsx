import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DocumentProgressIndicator } from "@/components/DocumentProgressIndicator";
import { useCaseContext } from "@/context/CaseContext";
import { apiRequest } from "@/lib/api-client";

// ── Local upload-state machine ─────────────────────────────────────────────
type UploadPhase = "idle" | "uploading" | "success" | "error";

interface UploadFileState {
  file: File;
  phase: UploadPhase;
  /** Human-readable progress label */
  progressLabel: string;
  /** Error message if phase === "error" */
  errorMessage?: string;
}

// ── Component ──────────────────────────────────────────────────────────────
export const UploadView = () => {
  const { toast } = useToast();
  const { selectedCase } = useCaseContext();
  const [fileStates, setFileStates] = useState<UploadFileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const caseId = selectedCase?.id || "default-case";

  // ── File selection ───────────────────────────────────────────────────────
  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setGlobalError(null);
    const newStates: UploadFileState[] = Array.from(incoming).map((f) => ({
      file: f,
      phase: "idle",
      progressLabel: "Ready",
    }));
    setFileStates((prev) => {
      // Deduplicate by name+size
      const existingKeys = new Set(prev.map((s) => `${s.file.name}-${s.file.size}`));
      const deduped = newStates.filter(
        (s) => !existingKeys.has(`${s.file.name}-${s.file.size}`)
      );
      return [...prev, ...deduped];
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    // Reset input so the same file can be re-added after removal
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFileStates((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Update a single file's state ─────────────────────────────────────────
  const patchFile = (index: number, patch: Partial<UploadFileState>) => {
    setFileStates((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  };

  // ── Upload a single file to the backend ─────────────────────────────────
  const uploadFile = async (index: number) => {
    const entry = fileStates[index];
    if (!entry || entry.phase === "uploading") return;

    patchFile(index, { phase: "uploading", progressLabel: "Uploading…", errorMessage: undefined });

    const formData = new FormData();
    formData.append("file", entry.file);
    formData.append("case_id", caseId);

    try {
      const res = await apiRequest("/upload-document", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const msg = `Server error ${res.status}: ${res.statusText}`;
        patchFile(index, { phase: "error", progressLabel: "Failed", errorMessage: msg });
        toast({ title: "Upload Failed", description: `${entry.file.name}: ${msg}`, variant: "destructive" });
        return;
      }

      const data = await res.json() as { success?: boolean; message?: string };
      if (data.success === false) {
        const msg = data.message ?? "Upload rejected by server.";
        patchFile(index, { phase: "error", progressLabel: "Failed", errorMessage: msg });
        toast({ title: "Upload Failed", description: `${entry.file.name}: ${msg}`, variant: "destructive" });
        return;
      }

      patchFile(index, { phase: "success", progressLabel: "Indexed" });
      toast({ title: "File Indexed", description: `${entry.file.name} is ready for RAG search.` });
    } catch {
      const msg = "Network error — is the backend running on port 8000?";
      patchFile(index, { phase: "error", progressLabel: "Network error", errorMessage: msg });
      toast({ title: "Connection Failed", description: msg, variant: "destructive" });
    }
  };

  // ── Upload all pending files ──────────────────────────────────────────────
  const uploadAll = async () => {
    setGlobalError(null);
    const pendingIndices = fileStates
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => s.phase === "idle" || s.phase === "error")
      .map(({ i }) => i);

    if (pendingIndices.length === 0) {
      toast({ title: "Nothing to upload", description: "All files are already indexed or uploading." });
      return;
    }

    // Fire uploads concurrently (backend handles parallelism)
    await Promise.all(pendingIndices.map(uploadFile));
  };

  // ── Derived counts ────────────────────────────────────────────────────────
  const countByPhase = (phase: UploadPhase) =>
    fileStates.filter((s) => s.phase === phase).length;
  const anyUploading = countByPhase("uploading") > 0;
  const allDone =
    fileStates.length > 0 &&
    fileStates.every((s) => s.phase === "success");

  // ── Phase badge ───────────────────────────────────────────────────────────
  const phaseBadge = (s: UploadFileState) => {
    switch (s.phase) {
      case "uploading":
        return <Badge variant="outline" className="text-blue-600 border-blue-300 gap-1"><Loader2 className="h-3 w-3 animate-spin" />{s.progressLabel}</Badge>;
      case "success":
        return <Badge variant="outline" className="text-emerald-600 border-emerald-300 gap-1"><CheckCircle2 className="h-3 w-3" />Indexed</Badge>;
      case "error":
        return <Badge variant="outline" className="text-red-600 border-red-300 gap-1"><AlertCircle className="h-3 w-3" />Error</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Week 3: Document Pipeline Progress Indicator */}
      <DocumentProgressIndicator 
        currentStep="upload"
        completedSteps={allDone ? ["upload", "index"] : []}
        loadingSteps={anyUploading ? ["upload", "index"] : []}
      />
      
      <div>
        <h2 className="text-2xl font-bold text-foreground">Upload Case Documents</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Upload PDFs, .md, .docx, or judgment images for RAG indexing
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-primary/5"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-foreground font-medium">Drop files here or click to browse</p>
        <p className="text-sm text-muted-foreground mt-1">
          Supports: PDF, MD, DOCX, JPG, PNG
        </p>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.md,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleSelect}
        />
      </div>

      {/* Global error */}
      {globalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {globalError}
        </div>
      )}

      {/* File list */}
      {fileStates.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Selected Files ({fileStates.length})</span>
              {allDone && (
                <span className="text-xs font-normal text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> All indexed
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {fileStates.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate font-medium">{s.file.name}</p>
                  {s.phase === "error" && s.errorMessage && (
                    <p className="text-xs text-red-600 truncate">{s.errorMessage}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {(s.file.size / 1024).toFixed(1)} KB
                </span>
                {phaseBadge(s)}
                {s.phase !== "uploading" && (
                  <button
                    onClick={() => removeFile(i)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            <Button
              className="w-full mt-3 gap-2"
              onClick={uploadAll}
              disabled={anyUploading || allDone}
            >
              {anyUploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading {countByPhase("uploading")} file(s)…</>
              ) : allDone ? (
                <><CheckCircle2 className="h-4 w-4" /> All Files Indexed</>
              ) : (
                <><Upload className="h-4 w-4" /> Index to Vector DB ({countByPhase("idle") + countByPhase("error")} pending)</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Backend info card */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-5 text-sm text-muted-foreground">
          <p className="font-medium text-amber-700 mb-2">Backend Integration Required</p>
          <p>
            File upload and RAG indexing require the Python backend with ChromaDB/Pinecone
            vector store running on{" "}
            <code className="text-xs bg-amber-100 px-1 py-0.5 rounded">VITE_API_URL</code>.
            Once deployed, uploaded files will be auto-indexed and available to the AI Drafter
            agents. If the backend is unavailable, upload attempts will show a clear error
            message above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
