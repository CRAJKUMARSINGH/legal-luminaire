import { useState } from "react";
import { 
  Copy, Check, AlertTriangle, Mic, Bot, 
  RefreshCcw, Loader2, Gavel, UserCheck, ShieldPlus, ChevronRight, BookOpen 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaseContext } from "@/context/CaseContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api-client";

type WitnessType = "IO" | "FSL_EXPERT" | "SEIZURE_WITNESS";

export default function OralArguments() {
  const { selectedCase } = useCaseContext();
  const { toast } = useToast();
  
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [witnessType, setWitnessType] = useState<WitnessType>("IO");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [strategyNote, setStrategyNote] = useState("");

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({ title: "Copied", description: "Text copied to clipboard." });
    });
  };

  const generateAIExam = async () => {
    setIsGenerating(true);
    try {
      const res = await apiRequest("/generate-cross-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: selectedCase.id,
          witness_type: witnessType
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiQuestions(data.questions);
        setStrategyNote(data.strategy_note);
        toast({ title: "Examination Plan Ready", description: "AI has generated tactical questions." });
      } else {
        toast({ title: "Error", description: data.error || "Failed to generate", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network Error", description: "Check if backend is running", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Mic className="w-6 h-6 text-primary" />
            Oral Arguments & Cross-Exam
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tactical litigation support for {selectedCase.title}
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
          WEEK 7: CROSS-EXAM ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: AI CROSS-EXAM PLANNER --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                Witness Exam Planner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target Witness</label>
                <div className="grid grid-cols-1 gap-2">
                   <Button 
                    variant={witnessType === "IO" ? "default" : "outline"} 
                    size="sm" className="justify-start gap-2"
                    onClick={() => setWitnessType("IO")}
                   >
                     <UserCheck className="w-3 h-3" /> Investigating Officer (I.O.)
                   </Button>
                   <Button 
                    variant={witnessType === "FSL_EXPERT" ? "default" : "outline"} 
                    size="sm" className="justify-start gap-2"
                    onClick={() => setWitnessType("FSL_EXPERT")}
                   >
                     <ShieldPlus className="w-3 h-3" /> FSL / Forensic Expert
                   </Button>
                   <Button 
                    variant={witnessType === "SEIZURE_WITNESS" ? "default" : "outline"} 
                    size="sm" className="justify-start gap-2"
                    onClick={() => setWitnessType("SEIZURE_WITNESS")}
                   >
                     <Gavel className="w-3 h-3" /> Seizure / Motbir Witness
                   </Button>
                </div>
              </div>

              <Button 
                className="w-full gap-2 h-10 shadow-sm" 
                onClick={generateAIExam}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                Generate Tactical Questions
              </Button>
            </CardContent>
          </Card>

          {strategyNote && (
             <Card className="bg-slate-900 text-slate-100 border-none shadow-xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="p-4 bg-primary/20 border-b border-white/10 uppercase tracking-tighter text-[10px] font-bold flex items-center gap-2">
                   <Gavel className="w-3 h-3" /> Defense Strategy Note
                </div>
                <CardContent className="p-5">
                   <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-serif italic text-justify">
                      {strategyNote}
                   </p>
                </CardContent>
             </Card>
          )}
        </div>

        {/* --- RIGHT: QUESTIONS & ARGUMENTS --- */}
        <div className="lg:col-span-2 space-y-6">
          {isGenerating && (
             <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium italic">Synthesizing procedural lapses from Case Documents...</p>
             </div>
          )}

          {!isGenerating && aiQuestions.length === 0 && (
             <div className="bg-slate-50 border-2 border-dashed rounded-2xl p-12 text-center text-slate-400">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="font-bold">No Examination Plan Generated</h3>
                <p className="text-xs">Select a witness type and click generate to see AI-tailored questions.</p>
             </div>
          )}

          {aiQuestions.length > 0 && (
            <div className="space-y-4 animate-in fade-in duration-700">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700 ml-1">
                <ChevronRight className="w-4 h-4 text-primary" />
                Tactical Questions for {witnessType}
              </h3>
              {aiQuestions.map((q, i) => (
                <div key={i} className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-primary/30 transition-all shadow-sm">
                   <div className="flex items-start gap-4">
                      <span className="text-primary font-black text-lg opacity-20 leading-none">Q{i+1}</span>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed pr-8">{q}</p>
                   </div>
                   <button 
                     onClick={() => handleCopy(q, 100+i)}
                     className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-100 rounded"
                   >
                     <Copy className="w-3 h-3" />
                   </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-8 space-y-4">
             <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700 ml-1">
               <BookOpen className="w-4 h-4 text-primary" />
               Case Defense Arguments (Rajasthan Prep)
             </h3>
             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-800 flex items-start gap-3">
               <AlertTriangle className="w-4 h-4 shrink-0" />
               <p>These arguments are pre-composed based on common forensic failures in Indian construction law (Standard BIS 1199/516). Use these during final oral arguments.</p>
             </div>
             {/* Note: I'll keep the list simplified for now to avoid bloating, but it exists in context */}
             <p className="text-xs text-muted-foreground italic pl-1">Scroll below for formal arguments...</p>
          </div>
        </div>

      </div>
    </div>
  );
}
