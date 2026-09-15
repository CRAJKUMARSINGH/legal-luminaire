import { useState, useEffect, useRef } from "react";
import {
  Upload, Zap, FileText, CheckCircle2, AlertTriangle,
  Loader2, Download, Copy, Wifi, WifiOff, Printer,
  MessageSquare, Send, ShieldCheck, RefreshCw, Database,
  FilePlus,
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import { apiRequest } from "@/lib/api-client";
import { apiClient, type ResearchResponse, type HealthResponse } from "@/lib/api-client";
import { caseLawMatrix } from "@/data/caseData";
import { findCitationsInText } from "@/lib/citation-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { DraftSkeleton } from "@/components/ui/skeleton-loaders";

type RunStatus = "idle" | "uploading" | "running" | "done" | "error";
type TabId = "draft" | "chat" | "verify";

const AGENT_ORDER = [
  { key: "researcher",          label: "Researcher Agent",       desc: "Verifying citations on Indian Kanoon, SCC Online, Manupatra", color: "text-blue-600" },
  { key: "standards_verifier",  label: "Standards Verifier",     desc: "Checking IS/ASTM/BS clauses on BIS portal & archive.org",    color: "text-violet-600" },
  { key: "fact_checker",        label: "Fact Checker",           desc: "Rejecting hallucinated cases, flagging fatal errors",         color: "text-amber-600" },
  { key: "drafter",             label: "Senior Drafter",         desc: "Generating court-ready Hindi discharge application",          color: "text-emerald-600" },
];

type StepStatus = "pending" | "running" | "done" | "error";
type AgentStep = { agent: string; status: StepStatus; output: string };

const QUICK_PROMPTS = [
  "Draft superior Hindi discharge application u/s 250 BNSS 2023 for Hemraj Vardar — Stadium wall collapse case. Include all 12 grounds, IS standard violations, chain of custody failure, cross-reference matrix, and prayer clause.",
  "Verify Kattavellai @ Devakar 2025 INSC 845 — extract exact para on chain of custody register",
  "Generate cross-reference matrix: violation → IS clause → precedent for all 12 grounds",
  "Draft 5 oral argument paragraphs in Hindi for discharge hearing",
  "Research mode: verify all PENDING citations — R.B. Constructions, K.S. Kalra, Builders Association",
];

type ChatMsg = { role: "user" | "assistant"; content: string; sources?: string[] };

export default function AIDraftEngine() {
  const { selectedCase, selectedCaseId } = useCaseContext();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("draft");

  // Draft tab state
  const [files, setFiles] = useState<File[]>([]);
  const [uploadResult, setUploadResult] = useState<{ chunks: number; files: string[] } | null>(null);
  const [query, setQuery] = useState(QUICK_PROMPTS[0]);
  const [mode, setMode] = useState<"research" | "draft">("draft");
  const [status, setStatus] = useState<RunStatus>("idle");
  const [steps, setSteps] = useState<AgentStep[]>(
    AGENT_ORDER.map((a) => ({ agent: a.key, status: "pending" as StepStatus, output: "" }))
  );
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState("");
  const [preloading, setPreloading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Chat tab state
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "नमस्कार। मैं Legal Luminaire AI हूँ।\n\nActive Case: Special Session Case No. 1/2025 — Hemraj Vardar, Stadium Wall Collapse, Udaipur\n\nमैं आपकी सहायता कर सकता हूँ:\n• Hindi discharge application draft करने में\n• Citations verify करने में\n• IS standards analysis में\n• Cross-reference matrix बनाने में\n\nक्या सहायता चाहिए?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Verify tab state
  const [verifyCitation, setVerifyCitation] = useState("");
  const [verifyStandard, setVerifyStandard] = useState("");
  const [verifyResult, setVerifyResult] = useState<Record<string, unknown> | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    apiClient.health().then(setHealth).catch(() => setHealth(null)).finally(() => setHealthLoading(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const backendOnline = health?.status === "ok";

  const handlePreload = async () => {
    setPreloading(true);
    try {
      const res = await apiRequest("/cases/case01/preload", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setUploadResult({ chunks: data.total_chunks, files: [`${data.files_indexed} files indexed`] });
      } else {
        setError(data.error || "Preload failed");
      }
    } catch (e) {
      setError("Preload request failed");
    } finally {
      setPreloading(false);
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setStatus("uploading");
    setError("");
    try {
      const res = await apiClient.uploadFiles(selectedCaseId, files);
      if (res.success) {
        setUploadResult({ chunks: res.total_chunks, files: res.indexed.map((i: { file: string }) => i.file) });
      } else {
        setError(res.errors?.join("; ") || "Upload failed");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setStatus("idle");
    }
  };

  const handleRun = async () => {
    if (!backendOnline) { setError("Backend offline. Run: cd backend && python main.py"); return; }
    setStatus("running"); setError(""); setResult(null);
    setSteps(AGENT_ORDER.map((a) => ({ agent: a.key, status: "pending" as StepStatus, output: "" })));
    const stepDelay = 9000;
    AGENT_ORDER.forEach((a, i) => {
      setTimeout(() => {
        setSteps((prev) => prev.map((s, idx) =>
          idx === i ? { ...s, status: "running" as StepStatus } :
          idx < i  ? { ...s, status: "done" as StepStatus } : s
        ));
      }, i * stepDelay);
    });
    try {
      const res = await apiClient.runResearch(selectedCaseId, {
        query, incident_type: "construction wall collapse forensic mortar sampling",
        evidence_type: "material sampling forensic lab report chain of custody",
        procedural_defects: ["no panchnama", "no chain of custody", "no contractor representative", "wrong IS standard", "rain sampling"],
        mode,
      });
      setSteps(AGENT_ORDER.map((a) => {
        const t = res.tasks_output?.find((x: { agent: string }) => x.agent.toLowerCase().includes(a.key));
        return { agent: a.key, status: (res.success ? "done" : "error") as StepStatus, output: t?.output || "" };
      }));
      setResult(res);
      setStatus(res.success ? "done" : "error");
      if (!res.success) setError(res.error || "Research failed");
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Request failed");
      setStatus("error");
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", content: chatInput };
    setChatHistory((h) => [...h, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await apiRequest("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_id: selectedCaseId, message: chatInput, history: chatHistory.slice(-6) }),
      });
      const data = await res.json();
      setChatHistory((h) => [...h, { role: "assistant", content: data.reply || "No response", sources: data.sources }]);
    } catch {
      setChatHistory((h) => [...h, { role: "assistant", content: "⚠ Backend offline or error. Start backend first." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true); setVerifyResult(null);
    try {
      if (verifyCitation) {
        const res = await apiRequest(`/verify-citation?case_name=${encodeURIComponent(verifyCitation)}`);
        setVerifyResult(await res.json());
      } else if (verifyStandard) {
        const res = await apiRequest(`/verify-standard?code=${encodeURIComponent(verifyStandard)}`);
        setVerifyResult(await res.json());
      }
    } catch (e) {
      setVerifyResult({ error: String(e) });
    } finally {
      setVerifying(false);
    }
  };

  const copyDraft = () => result?.draft && navigator.clipboard.writeText(result.draft);
  const downloadDraft = () => {
    if (!result?.draft) return;
    const hits = findCitationsInText(result.draft, caseLawMatrix.map((c) => ({ case: c.case, status: c.status })));
    const pending = hits.filter((h) => h.status === "PENDING");
    const secondary = hits.filter((h) => h.status === "SECONDARY");
    if (pending.length > 0) {
      alert(
        `Download blocked: this draft contains ${pending.length} PENDING (unverified) citation(s).\n\n` +
          pending.map((p) => `- ${p.case}`).join("\n") +
          `\n\nVerify before filing.`
      );
      return;
    }
    if (secondary.length > 0) {
      const ok = confirm(
        `Warning: this draft contains ${secondary.length} SECONDARY citation(s) (not court-verified).\n\n` +
          secondary.map((s) => `- ${s.case}`).join("\n") +
          `\n\nProceed to download anyway?`
      );
      if (!ok) return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([result.draft], { type: "text/plain;charset=utf-8" }));
    a.download = `discharge_application_${selectedCaseId}.txt`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> AI Draft Engine
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Multi-agent · RAG · Zero-hallucination · Manupatra + SCC + Indian Kanoon verified
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
          healthLoading ? "bg-muted text-muted-foreground border-border" :
          backendOnline ? "bg-green-50 text-green-700 border-green-200" :
          "bg-red-50 text-red-700 border-red-200"
        }`}>
          {healthLoading ? <Loader2 className="w-3 h-3 animate-spin" /> :
           backendOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {healthLoading ? "Checking..." : backendOnline ? "Backend online" : "Backend offline"}
        </div>
      </div>

      {/* Backend health */}
      {backendOnline && health && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "OpenAI", ok: health.openai_configured },
            { label: "Tavily Search", ok: health.tavily_configured },
            { label: "ChromaDB RAG", ok: health.chroma_ready },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg p-2.5 text-center text-xs border ${
              item.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {item.ok ? <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1" /> : <AlertTriangle className="w-3.5 h-3.5 mx-auto mb-1" />}
              {item.label}
            </div>
          ))}
        </div>
      )}

      {/* Setup instructions */}
      {!healthLoading && !backendOnline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          <p className="font-semibold mb-2">Backend Setup Required</p>
          <pre className="text-xs bg-amber-100 rounded p-3 overflow-x-auto">{`cd artifacts/legal-luminaire/backend
cp .env.example .env
# Add OPENAI_API_KEY and TAVILY_API_KEY to .env
pip install -r requirements.txt
python main.py`}</pre>
        </div>
      )}

      {/* Active case + preload */}
      <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="text-sm">
          <span className="font-semibold text-muted-foreground">Active Case: </span>
          <span>{selectedCase.title}</span>
          {uploadResult && (
            <span className="ml-3 text-xs text-green-700 font-medium">
              ✓ {uploadResult.files.length} files · {uploadResult.chunks} chunks in RAG
            </span>
          )}
        </div>
        <Button
          variant="outline" size="sm"
          onClick={handlePreload}
          disabled={preloading || !backendOnline}
          className="gap-1.5 text-xs shrink-0"
        >
          {preloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
          {preloading ? "Indexing..." : "Pre-load Case 01 Docs"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { id: "draft" as TabId, label: "AI Draft Engine", icon: Zap },
          { id: "chat" as TabId, label: "Chat / Refine", icon: MessageSquare },
          { id: "verify" as TabId, label: "Verify Citation", icon: ShieldCheck },
        ]).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ── DRAFT TAB ── */}
      {tab === "draft" && (
        <div className="space-y-4">
          {/* File upload */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Case Documents (PDF, DOCX, MD, .lex)
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <input type="file" multiple accept=".pdf,.doc,.docx,.md,.txt,.lex,.jpg,.jpeg,.png"
                onChange={(e) => setFiles(Array.from(e.target.files || []))} className="text-sm" />
              <Button onClick={handleUpload} disabled={!files.length || status === "uploading" || !backendOnline}
                variant="outline" size="sm" className="gap-1.5">
                {status === "uploading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                {status === "uploading" ? "Indexing..." : "Index into RAG"}
              </Button>
            </div>
            {files.length > 0 && (
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {files.map((f) => <li key={f.name}>• {f.name} ({(f.size / 1024).toFixed(0)} KB)</li>)}
              </ul>
            )}
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => setQuery(p)}
                className="text-xs rounded-full border border-border px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                {p.length > 60 ? p.slice(0, 60) + "…" : p}
              </button>
            ))}
          </div>

          {/* Query */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h2 className="text-sm font-semibold">Research / Draft Query</h2>
            <Textarea value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want? e.g., Draft superior Hindi discharge application..." className="min-h-24" />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" value="research" checked={mode === "research"} onChange={() => setMode("research")} />
                Research only
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" value="draft" checked={mode === "draft"} onChange={() => setMode("draft")} />
                Full Hindi draft (25-30 pages)
              </label>
            </div>
          </div>

          {/* Run */}
          <Button onClick={handleRun} disabled={status === "running" || !backendOnline}
            className="w-full h-12 gap-2 font-semibold">
            {status === "running" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {status === "running" ? "Agents running — verifying citations..." : "Run AI Research + Draft"}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}

          {/* Idle empty state — shown before first run */}
          {status === "idle" && !result && (
            <EmptyState
              icon={<FilePlus className="h-8 w-8" />}
              title="Ready to generate your draft"
              titleHi="ड्राफ्ट बनाने के लिए तैयार"
              description="Select a quick prompt above, or type your own query, then click Run."
              descriptionHi="ऊपर से एक प्रॉम्प्ट चुनें या अपना सवाल टाइप करें, फिर Run दबाएं।"
              actions={[
                {
                  label: "Load Demo Case",
                  labelHi: "डेमो केस लोड करें",
                  href: "/demo-browser",
                  variant: "outline",
                },
              ]}
              compact
            />
          )}

          {/* Skeleton shown while agents run (before pipeline cards appear) */}
          {status === "running" && !result && steps.every(s => s.status === "pending") && (
            <DraftSkeleton />
          )}

          {/* Agent pipeline */}
          {status !== "idle" && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-semibold">Agent Pipeline</h2>
              {AGENT_ORDER.map((a, i) => {
                const step = steps[i];
                return (
                  <div key={a.key} className={`flex items-start gap-3 p-3 rounded-lg border ${
                    step.status === "done" ? "bg-green-50 border-green-200" :
                    step.status === "running" ? "bg-blue-50 border-blue-200" :
                    step.status === "error" ? "bg-red-50 border-red-200" : "bg-muted/30 border-border"
                  }`}>
                    <div className="mt-0.5 shrink-0">
                      {step.status === "done" ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                       step.status === "running" ? <Loader2 className="w-4 h-4 text-blue-600 animate-spin" /> :
                       step.status === "error" ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                       <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${a.color}`}>{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                      {step.output && (
                        <details className="mt-2">
                          <summary className="text-xs text-primary cursor-pointer">View output</summary>
                          <pre className="text-xs mt-1 bg-white/70 rounded p-2 overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {step.output.slice(0, 2000)}{step.output.length > 2000 ? "…" : ""}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Output */}
          {result?.draft && (
            <div ref={outputRef} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <div>
                  <h2 className="text-sm font-bold">Generated Output</h2>
                  <p className="text-xs text-muted-foreground">
                    {result.doc_count > 0 ? `RAG: ${result.doc_count} chunks · ` : ""}
                    {mode === "draft" ? "Court-ready Hindi discharge application" : "Research report"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyDraft} variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Copy className="w-3 h-3" /> Copy
                  </Button>
                  <Button onClick={downloadDraft} variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Download className="w-3 h-3" /> Download
                  </Button>
                  <Button onClick={() => window.print()} size="sm" className="gap-1.5 text-xs no-print">
                    <Printer className="w-3 h-3" /> Print
                  </Button>
                </div>
              </div>
              <div className="p-5 max-h-[70vh] overflow-y-auto">
                <pre className="hindi-text text-sm leading-loose whitespace-pre-wrap font-serif text-foreground">
                  {result.draft}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CHAT TAB ── */}
      {tab === "chat" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: "60vh" }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <p className="text-xs mt-1 opacity-60">Sources: {msg.sources.join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-sm text-muted-foreground">Thinking…</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t border-border p-3 flex gap-2">
            <Textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about the case, citations, IS standards, or request a draft…"
              className="min-h-[52px] resize-none text-sm"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChat(); } }} />
            <Button onClick={handleChat} disabled={chatLoading || !chatInput.trim()} size="icon" className="h-[52px] w-[52px] shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── VERIFY TAB ── */}
      {tab === "verify" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> On-Demand Citation & Standard Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Verify Case Citation</label>
                <input value={verifyCitation} onChange={(e) => setVerifyCitation(e.target.value)}
                  placeholder="e.g. Kattavellai Devakar State Tamil Nadu 2025"
                  className="border rounded-lg px-3 py-2 text-sm w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Verify IS/ASTM Standard</label>
                <input value={verifyStandard} onChange={(e) => setVerifyStandard(e.target.value)}
                  placeholder="e.g. IS 1199:2018 or ASTM C1324"
                  className="border rounded-lg px-3 py-2 text-sm w-full" />
              </div>
            </div>
            <Button onClick={handleVerify} disabled={verifying || (!verifyCitation && !verifyStandard) || !backendOnline}
              className="gap-2">
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {verifying ? "Verifying…" : "Verify Now"}
            </Button>
          </div>

          {verifyResult && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">Verification Result</h3>
              {verifyResult.error ? (
                <p className="text-sm text-red-600">{String(verifyResult.error)}</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(verifyResult).map(([k, v]) => (
                    <div key={k} className="flex gap-3 text-sm">
                      <span className="font-medium text-muted-foreground w-40 shrink-0">{k}:</span>
                      <span className="text-foreground break-all">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Known verification status */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-3">Known Citation Status</h3>
            <div className="space-y-2">
              {[
                { name: "Kattavellai 2025 INSC 845", status: "VERIFIED", note: "SC 3-bench, 15 Jul 2025" },
                { name: "Prafulla Kumar Samal (1979) 3 SCC 4", status: "VERIFIED", note: "Para 10 confirmed" },
                { name: "Ramesh Singh (1977) 4 SCC 39", status: "VERIFIED", note: "Para 5 confirmed" },
                { name: "Jacob Mathew (2005) 6 SCC 1", status: "VERIFIED", note: "Para 48 confirmed" },
                { name: "State of Maharashtra v. Damu (2000) 6 SCC 269", status: "VERIFIED", note: "SC" },
                { name: "State of Punjab v. Baldev Singh (1999) 6 SCC 172", status: "VERIFIED", note: "SC" },
                { name: "Sushil Sharma (2014) 4 SCC 317", status: "SECONDARY", note: "Verify exact para" },
                { name: "Uttarakhand HC March 2026", status: "SECONDARY", note: "Fetch full citation" },
                { name: "R.B. Constructions (2014 SCC OnLine Bom 125)", status: "PENDING", note: "Authenticity unconfirmed" },
                { name: "K.S. Kalra (2011 SCC OnLine Del 3412)", status: "PENDING", note: "Authenticity unconfirmed" },
                { name: "Builders Association v. UP (2018)", status: "PENDING", note: "Authenticity unconfirmed" },
                { name: "Mohanbhai (2003) 4 GLR 3121", status: "PENDING", note: "Authenticity unconfirmed" },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-3 text-xs">
                  <Badge variant="outline" className={`shrink-0 ${
                    c.status === "VERIFIED" ? "bg-green-50 text-green-700 border-green-300" :
                    c.status === "SECONDARY" ? "bg-blue-50 text-blue-700 border-blue-300" :
                    "bg-orange-50 text-orange-700 border-orange-300"
                  }`}>{c.status}</Badge>
                  <span className="text-foreground">{c.name}</span>
                  <span className="text-muted-foreground ml-auto shrink-0">{c.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
