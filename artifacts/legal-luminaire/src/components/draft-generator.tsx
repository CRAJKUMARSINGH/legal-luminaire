import { useState } from "react";
import { useDraftStream } from "@/hooks/use-draft-stream";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, Sparkles, AlertCircle, CheckCircle2, ChevronRight, FileSearch } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { featureFlags } from "@/config/featureFlags";

const DRAFT_TYPES = [
  { value: "discharge_application", label: "Discharge Application" },
  { value: "bail_application", label: "Bail Application" },
  { value: "written_submission", label: "Written Submission" },
  { value: "revision_petition", label: "Revision Petition" },
  { value: "reply_to_charge_sheet", label: "Reply to Charge Sheet" },
  { value: "general", label: "General Draft / Other" },
];

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "bilingual", label: "Bilingual (English & Hindi)" },
];

interface DraftGeneratorProps {
  sessionId: number;
  /** Pre-filled intake text — e.g. a tutorial pair's `input.text`. */
  initialQuery?: string;
  initialDraftType?: string;
  initialLanguage?: string;
}

export function DraftGenerator({
  sessionId,
  initialQuery = "",
  initialDraftType = "discharge_application",
  initialLanguage = "hindi",
}: DraftGeneratorProps) {
  const [query, setQuery] = useState(initialQuery);
  const [draftType, setDraftType] = useState(initialDraftType);
  const [language, setLanguage] = useState(initialLanguage);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { state, generateDraft } = useDraftStream();

  const handleGenerate = async () => {
    if (!query.trim()) {
      toast({ title: "Query required", description: "Please specify what you want to draft.", variant: "destructive" });
      return;
    }
    try {
      const resultDraftId = await generateDraft({ sessionId, query, draftType, language });
      if (resultDraftId) {
        toast({ title: "Draft Generated", description: "Your legal draft has been generated successfully." });
        if (featureFlags.hybridDraftViewer) {
          setLocation(`/draft/${resultDraftId}`);
        }
      }
    } catch (e: unknown) {
      toast({ title: "Generation failed", description: e instanceof Error ? e.message : "An error occurred.", variant: "destructive" });
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "researcher": return <FileSearch className="h-5 w-5 text-blue-500" />;
      case "verifier": return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "drafter": return <FileText className="h-5 w-5 text-primary" />;
      case "streaming": return <Sparkles className="h-5 w-5 text-primary" />;
      case "complete": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error": return <AlertCircle className="h-5 w-5 text-destructive" />;
      default: return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "researcher": return "Analyzing Documents & Facts...";
      case "verifier": return "Verifying Citations & Legal Provisions...";
      case "drafter": return "Formulating Legal Arguments...";
      case "streaming": return "Generating Final Draft...";
      case "complete": return "Generation Complete";
      case "error": return "Error Occurred";
      default: return "Processing...";
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-border bg-muted/30">
        <h2 className="text-xl font-serif font-semibold text-foreground flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" /> Draft Generation Engine
        </h2>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Draft Type</Label>
              <Select value={draftType} onValueChange={setDraftType} disabled={state.isStreaming}>
                <SelectTrigger><SelectValue placeholder="Select draft type" /></SelectTrigger>
                <SelectContent>
                  {DRAFT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage} disabled={state.isStreaming}>
                <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Specific Instructions / Focus Areas</Label>
            <Textarea
              placeholder="E.g., Emphasize chain-of-custody failure, cite Kattavellai precedent, focus on IS standard violations..."
              className="min-h-[120px] resize-y"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={state.isStreaming}
            />
          </div>
          <Button
            className="w-full text-md h-12 gap-2 shadow-sm font-medium"
            onClick={handleGenerate}
            disabled={state.isStreaming || !query.trim()}
          >
            {state.isStreaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
            {state.isStreaming ? "Generating..." : "Generate Court-Ready Draft"}
          </Button>
        </div>
      </div>

      {/* Progress */}
      {(state.isStreaming || state.stage === "complete" || state.stage === "error") && (
        <div className="flex-1 bg-background border-t border-border flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-border bg-sidebar/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStageIcon(state.stage)}
              <div>
                <div className="font-medium text-sm text-foreground">{getStageLabel(state.stage)}</div>
                {state.message && <div className="text-xs text-muted-foreground mt-0.5">{state.message}</div>}
              </div>
            </div>
            {featureFlags.hybridDraftViewer && state.stage === "complete" && state.draftId && (
              <Button variant="outline" size="sm" onClick={() => setLocation(`/draft/${state.draftId}`)} className="gap-1">
                View Full Draft <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex-1 p-6 overflow-y-auto max-h-[400px]">
            <div className="legal-prose whitespace-pre-wrap font-serif text-sm opacity-90">
              {state.content ? state.content :
                state.stage !== "error" ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground italic text-sm">
                    AI engine is working... Draft content will appear here.
                  </div>
                ) : (
                  <div className="text-destructive font-sans">{state.error}</div>
                )
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
