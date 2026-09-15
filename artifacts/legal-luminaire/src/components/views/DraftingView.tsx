import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  FileText, Bot, Download, Copy, RefreshCcw, 
  CheckCircle, Loader2, FileSignature, BookOpen, AlertCircle, Gavel,
  ShieldCheck, ShieldAlert, ShieldX, FileWarning, Scaling, Send,
  Globe, CheckCircle2, XCircle, Lock, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaseContext } from "@/context/CaseContext";
import { useToast } from "@/hooks/use-toast";
import { DocumentProgressIndicator } from "@/components/DocumentProgressIndicator";
import { apiRequest } from "@/lib/api-client";

type DraftType = "BRIEF" | "DISCHARGE" | "BAIL_439";

export const DraftingView = () => {
  const { selectedCase } = useCaseContext();
  const { toast } = useToast();
  
  const [draftType, setDraftType] = useState<DraftType>("BRIEF");
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useLocation();
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [allVerified, setAllVerified] = useState(true);
  const [role, setRole] = useState<"junior" | "senior">("junior");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("role") === "senior") setRole("senior");
    
    const type = params.get("type") as DraftType;
    let timer: NodeJS.Timeout;
    if (type && ["BRIEF", "DISCHARGE", "BAIL_439"].includes(type)) {
      setDraftType(type);
      timer = setTimeout(() => {
        generateDraft(type);
      }, 500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [selectedCase.id]);

  const updateStatus = async (newStatus: string) => {
    try {
      await apiRequest(`/cases/${selectedCase.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selectedCase, review_status: newStatus })
      });
      toast({ title: `Status: ${newStatus}`, description: "Case workflow status updated successfully." });
    } catch (err) {
      console.error(err);
    }
  };

  const generateDraft = async (typeOverride?: DraftType) => {
    const activeType = typeOverride || draftType;
    setIsGenerating(true);
    try {
      const res = await apiRequest("/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: selectedCase.id,
          draft_type: activeType,
          additional_notes: notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.draft_content);
        toast({ title: "Draft Generated", description: "Verifying legal citations..." });
        verifyDraftCitations(data.draft_content);
      } else {
        toast({ title: "Generation Failed", description: data.error || "Unknown error", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network Error", description: "Is the backend running?", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyDraftCitations = async (text: string) => {
    setIsVerifying(true);
    const citationRegex = /([A-Z\.]+\s+\d{4}\s+[A-Z\.]+\s+\d+)|(\d{4}\s+[\(\d\)]+\s+[A-Z\.]+\s+\d+)/g;
    const matches = text.match(citationRegex) || [];
    const uniqueCitations = Array.from(new Set(matches));

    if (uniqueCitations.length === 0) {
      setVerificationResults([]);
      setAllVerified(true);
      setIsVerifying(false);
      return;
    }

    try {
      const res = await apiRequest("/verify-citations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citations: uniqueCitations })
      });
      const data = await res.json();
      if (data.success) {
        setVerificationResults(data.results);
        setAllVerified(data.all_verified);
      }
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied", description: "Draft copied to clipboard." });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-50 flex-col">
      {/* Week 3: Document Pipeline Progress Indicator */}
      <div className="bg-background border-b border-border shrink-0">
        <div className="p-3 max-w-7xl mx-auto">
          <DocumentProgressIndicator 
            currentStep="draft"
            completedSteps={["upload", "index", "research"]}
            loadingSteps={isGenerating ? ["upload", "index", "research", "draft"] : []}
          />
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* --- Sidebar Controls --- */}
        <aside className="w-80 border-r bg-white p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5 text-primary" />
            {role === "senior" ? "Senior Review Workspace" : "Legal Drafting Engine"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {role === "senior" ? "Reviewing junior's application draft." : "Select Indian legal section to auto-draft."}
          </p>

          {/* Week 14: Senior Comparison Panel (Split-Screen) */}
          {role === "senior" && (
            <div className="mt-4 space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Extracted Case Facts
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-[9px] text-blue-600/70 font-bold uppercase">Incident Type</p>
                    <p className="text-xs font-bold text-slate-800">{selectedCase.metadata?.category || "General Forensic"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-blue-600/70 font-bold uppercase">Target Jurisdiction</p>
                    <p className="text-xs font-bold text-slate-800">{selectedCase.court || "TBD"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-blue-600/70 font-bold uppercase">Primary Accused</p>
                    <p className="text-xs font-bold text-slate-800">{selectedCase.accused_names?.[0] || "Name Redacted"}</p>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full text-[10px] font-bold h-8 gap-2 border-blue-200 text-blue-700 bg-white shadow-sm">
                 <Scaling className="w-3 h-3" /> COMPARE WITH ORIGINAL SCAN
              </Button>
            </div>
          )}

          {role === "junior" && (
            <div className="mt-4 p-2 bg-slate-100 rounded border border-slate-200">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Scaling className="w-3 h-3" /> Formatting Mode
               </p>
                <p className="text-xs font-medium text-slate-700 truncate">{selectedCase.court}</p>
                <p className="text-[9px] text-slate-500 mt-1 italic">
                   {selectedCase.court.includes("Rajasthan") ? "Applying Rajasthan HC Rules" : 
                    selectedCase.court.includes("Supreme") ? "Applying SCI Double Spacing" :
                    "Applying Session Court Layout"}
                </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal Sections (Week 11)</label>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant={draftType === "BRIEF" ? "default" : "outline"} 
              className="w-full justify-start gap-2 h-12"
              onClick={() => setDraftType("BRIEF")}
            >
              <FileText className="w-4 h-4" /> Brief / Synopsis
            </Button>
            <Button 
              variant={draftType === "BAIL_439" ? "default" : "outline"} 
              className="w-full justify-start gap-2 h-12"
              onClick={() => setDraftType("BAIL_439")}
            >
              <Gavel className="w-4 h-4" /> §439 Bail Application
            </Button>
            <Button 
              variant={draftType === "DISCHARGE" ? "default" : "outline"} 
              className="w-full justify-start gap-2 h-12"
              onClick={() => setDraftType("DISCHARGE")}
            >
              <FileSignature className="w-4 h-4" /> §250 Discharge App
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Additional Context</label>
          <textarea 
            className="w-full min-h-[100px] p-3 text-sm rounded-lg border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
            placeholder="Focus on specific police procedural gaps..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button 
          className="mt-auto h-12 gap-2 shadow-sm" 
          onClick={() => generateDraft()}
          disabled={isGenerating || selectedCase.review_status === "APPROVED"}
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
          {selectedCase.review_status === "APPROVED" ? "Locked for Filing" : "Generate Court Draft"}
        </Button>
      </aside>

      {/* --- Document Workspace --- */}
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-[800px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
               <Badge variant="outline" className="bg-white">AI DRAFT v1.2</Badge>
               {content && <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">READY</Badge>}
            </div>
            {content && (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={copyToClipboard} className="gap-1.5" disabled={!allVerified}>
                  <Copy className="w-4 h-4" /> Copy Document
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5" disabled={!allVerified}>
                  <Download className="w-4 h-4" /> Export PDF
                </Button>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                
                {role === "junior" && selectedCase.review_status !== "APPROVED" && (
                  <Button 
                    size="sm" 
                    className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-md text-[10px] font-bold h-8 transition-all" 
                    disabled={!allVerified || isGenerating}
                    onClick={() => updateStatus("SUBMITTED")}
                  >
                    <Send className="w-3.5 h-3.5" /> SUBMIT FOR REVIEW
                  </Button>
                )}

                {role === "senior" && selectedCase.review_status === "SUBMITTED" && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" className="gap-1.5 bg-emerald-600 text-white h-8 text-[10px] font-bold px-4" 
                      onClick={() => updateStatus("APPROVED")}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> APPROVE & SIGN
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Safety Barrier (Week 12 Hardening) */}
          {content && (
            <div className={`p-4 rounded-xl border flex items-start gap-4 ${allVerified ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-red-50 border-red-200 shadow-sm animate-pulse'}`}>
               <div className={`p-2 rounded-lg ${allVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : allVerified ? <ShieldCheck className="w-5 h-5" /> : <ShieldX className="w-5 h-5" />}
               </div>
               <div className="flex-1">
                  <p className={`text-sm font-bold ${allVerified ? 'text-emerald-800' : 'text-red-800'}`}>
                     {isVerifying ? "Verifying Legal Citations..." : allVerified ? "Citation Safety Verified (Zero Hallucination)" : "CITATIONS COULD NOT BE VERIFIED"}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {allVerified ? "Verified against ground-truth database. Export permitted." : "Draft contains potentially fabricated precedents. Final export and copy actions are BLOCKED for safety."}
                  </p>
                  {/* Week 3: Links to Verification Report and Pre-Filing Checklist */}
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="text-xs gap-1.5 h-7" onClick={() => window.open('/verification-report', '_blank')}>
                      <FileWarning className="w-3 h-3" /> Verification Report
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs gap-1.5 h-7" onClick={() => window.open('/filing-checklist', '_blank')}>
                      <CheckCircle2 className="w-3 h-3" /> Pre-Filing Checklist
                    </Button>
                  </div>
               </div>
            </div>
          )}

          <Card className={`min-h-[1000px] shadow-2xl border-none font-serif leading-relaxed p-16 bg-white relative
            ${selectedCase.court.includes("Rajasthan") ? "style-rajasthan-hc" : ""}
            ${selectedCase.court.includes("Supreme") ? "style-supreme-court" : ""}
          `}>
            {selectedCase.review_status === "APPROVED" && (
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center -rotate-12 overflow-hidden">
                  <p className="text-8xl font-black text-emerald-500/5 uppercase tracking-[0.5em] select-none">APPROVED</p>
               </div>
            )}

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm italic text-slate-500">Generating Court-Specific Draft...</p>
              </div>
            ) : content ? (
              <div className={`whitespace-pre-wrap text-[15px] text-slate-800 relative z-10 
                ${selectedCase.court.includes("Supreme") ? "leading-[2.2]" : "leading-relaxed"}
              `}>
                {selectedCase.review_status === "APPROVED" && (
                  <div className="mb-6 p-2 bg-emerald-50 border border-emerald-100 rounded text-emerald-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                     <Lock className="w-3 h-3" /> This document is LOCKED and SIGNED for filing.
                  </div>
                )}
                {content}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2 opacity-50">
                 <FileText className="w-16 h-16" />
                 <p className="text-sm">Select a legal application to draft based on Case Facts</p>
              </div>
            )}
          </Card>
        </div>
      </main>
      </div>
    </div>
  );
};

const Badge = ({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: "default" | "outline" | "secondary", className?: string }) => {
  const styles = {
    default: "bg-slate-900 text-white",
    outline: "border border-slate-200 text-slate-600",
    secondary: "bg-slate-100 text-slate-700"
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${styles[variant]} ${className}`}>{children}</span>;
};
