/**
 * SafeDraftPage — wraps SafeDraftEditor for the /case/:id/safe-draft route.
 * Pre-populates from the active case context.
 */
import { useLocation } from "wouter";
import { useCaseContext } from "@/context/CaseContext";
import { SafeDraftEditor, type SafeDraftState } from "@/components/views/SafeDraftEditor";
// DraftStatus is inlined here to match the editor prop contract
type DraftStatus = "draft" | "finalized" | "sent";
import { useToast } from "@/hooks/use-toast";

export default function SafeDraftPage() {
  const { selectedCase } = useCaseContext();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSave = async (state: SafeDraftState, _status: DraftStatus) => {
    // Persist to localStorage as a simple offline store
    // Replace with API call when backend is wired
    const key = `safe-draft-${selectedCase.id}-${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(state));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <SafeDraftEditor
        caseTitle={selectedCase.title}
        caseNumber={selectedCase.caseNo}
        legalGrounds={(selectedCase.metadata as Record<string, unknown>)?.legalGrounds as string | undefined}
        onSave={handleSave}
        onBack={() => setLocation(`/case/${selectedCase.id}/drafting`)}
      />
    </div>
  );
}
