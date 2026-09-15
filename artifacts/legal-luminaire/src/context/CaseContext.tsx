/**
 * CaseContext — case state with localStorage-first, optional backend sync.
 * PROTECTED FILE — always falls back to localStorage, never backend-only.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CaseRecord, defaultCase, loadCases, saveCases, loadSelectedCaseId, saveSelectedCaseId, isSeeded, markSeeded } from "@/lib/case-store";
import { CASE_TEMPLATES, generateCaseFromTemplate } from "@/lib/case-templates";
import type { CaseTemplate } from "@/lib/multi-case-store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api-client";
import { buildCaseRecord, recordIdForDemo } from "@/cases/registry";
import { loadRecentCases, pushRecentCase, type RecentCaseEntry } from "@/lib/recent-cases";

export type CaseContextType = {
  cases: CaseRecord[];
  selectedCaseId: string;
  selectedCase: CaseRecord;
  setSelectedCaseId: (id: string) => void;
  addCase: (record: CaseRecord) => void;
  deleteCase: (id: string) => void;
  duplicateCase: (id: string) => void;
  createFromTemplate: (templateId: string, overrides?: Partial<CaseRecord>) => void;
  templates: CaseTemplate[];
  isLoading: boolean;
  /** Build (or rebuild) a catalogue case (TC-01 … TC-26) and make it the active case. Returns the record id. */
  loadDemoCase: (demoId: string) => Promise<string | null>;
  /** Last few opened cases, most recent first, resolved against `cases`. */
  recentCases: CaseRecord[];
  isDemoMode: boolean;
};

const CaseContext = createContext<CaseContextType | null>(null);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  // Always load from localStorage first — backend is optional enhancement
  const [cases, setCases] = useState<CaseRecord[]>(() => loadCases());
  const [selectedCaseId, setSelectedCaseIdState] = useState<string>(() => loadSelectedCaseId());
  const [isLoading, setIsLoading] = useState(false);
  const [recent, setRecent] = useState<RecentCaseEntry[]>(() => loadRecentCases());
  const { toast } = useToast();

  // Seed infra arb cases on first load (TC-22 to TC-26)
  useEffect(() => {
    if (!isSeeded()) {
      import("@/data/demo-cases/infra-arb-cases").then(({ INFRA_ARB_CASES }) => {
        setCases((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const toAdd = INFRA_ARB_CASES.filter((c) => !existingIds.has(c.id));
          if (toAdd.length === 0) { markSeeded(); return prev; }
          const next = [...prev, ...toAdd];
          saveCases(next);
          markSeeded();
          return next;
        });
      }).catch(() => { /* infra cases optional */ });
    }
  }, []);

  // Hydrate the built-in CASE_01 slot from the data layer if it is still an empty shell
  useEffect(() => {
    const c01 = cases.find((c) => c.id === defaultCase.id);
    if (!c01 || (c01.caseLaw?.length ?? 0) > 0) return;
    buildCaseRecord("TC-01").then((rec) => {
      if (!rec) return;
      setCases((prev) => {
        const next = prev.map((c) => (c.id === defaultCase.id ? { ...rec, id: defaultCase.id, files: c.files } : c));
        saveCases(next);
        return next;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optionally sync from backend — never blocks UI, tries live app prefix first
  useEffect(() => {
    async function syncFromBackend() {
      // The FastAPI service is the only canonical backend.
      const endpoints = ["/cases"];
      for (const url of endpoints) {
        try {
          const res = await apiRequest(url, { signal: AbortSignal.timeout(3000) });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              setCases(data);
              saveCases(data);
              break; // stop on first success
            }
          }
        } catch {
          // try next endpoint
        }
      }
    }
    syncFromBackend();
  }, []);

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === selectedCaseId) ?? cases[0] ?? defaultCase,
    [cases, selectedCaseId]
  );

  const setSelectedCaseId = (id: string) => {
    setSelectedCaseIdState(id);
    saveSelectedCaseId(id);
    setRecent(pushRecentCase(id));
  };

  const recentCases = useMemo(
    () => recent.map((r) => cases.find((c) => c.id === r.id)).filter((c): c is CaseRecord => Boolean(c)),
    [recent, cases]
  );

  const isDemoMode = Boolean(selectedCase.isDemo) || selectedCase.title.startsWith("[DEMO]");

  const loadDemoCase = async (demoId: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const record = await buildCaseRecord(demoId);
      if (!record) {
        toast({ title: "Demo case not found / डेमो केस नहीं मिला", description: demoId, variant: "destructive" });
        return null;
      }
      const id = recordIdForDemo(demoId);
      const full = { ...record, id };
      setCases((prev) => {
        const next = prev.some((c) => c.id === id)
          ? prev.map((c) => (c.id === id ? full : c))
          : [full, ...prev];
        saveCases(next);
        return next;
      });
      setSelectedCaseId(id);
      return id;
    } finally {
      setIsLoading(false);
    }
  };

  const addCase = (record: CaseRecord) => {
    setCases((prev) => {
      const next = [record, ...prev.filter((c) => c.id !== record.id)];
      saveCases(next);
      return next;
    });
    setSelectedCaseId(record.id);
    // Fire-and-forget backend sync
    apiRequest("/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    }).catch(() => {/* backend optional */});
  };

  const deleteCase = (id: string) => {
    if (id === "case-01") return;
    setCases((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCases(next);
      if (selectedCaseId === id && next.length > 0) setSelectedCaseId(next[0].id);
      return next;
    });
    apiRequest(`/cases/${id}`, { method: "DELETE" }).catch(() => {});
  };

  const duplicateCase = (id: string) => {
    const src = cases.find((c) => c.id === id);
    if (!src) return;
    addCase({ ...src, id: `case-${Date.now()}`, title: `${src.title} (Copy)`, createdAt: new Date().toISOString() });
  };

  const createFromTemplate = (templateId: string, overrides: Partial<CaseRecord> = {}) => {
    // Map CaseRecord overrides to the MultiCaseData shape that generateCaseFromTemplate expects.
    // Only the fields that exist on both types are forwarded; extended CaseRecord fields
    // (parties, citations, forensic_grounding, …) are not part of MultiCaseData and are
    // applied directly after the case is generated.
    const templateOverrides: Parameters<typeof generateCaseFromTemplate>[1] = {
      ...(overrides.title     !== undefined && { title:   overrides.title }),
      ...(overrides.court     !== undefined && { court:   overrides.court }),
      ...(overrides.caseNo    !== undefined && { caseNo:  overrides.caseNo }),
      ...(overrides.brief     !== undefined && { brief:   overrides.brief }),
      ...(overrides.status    !== undefined && { status:  overrides.status }),
      // charges: CaseRecord allows string | string[]; MultiCaseData only accepts string
      ...(overrides.charges   !== undefined && {
        charges: Array.isArray(overrides.charges)
          ? overrides.charges.join(", ")
          : overrides.charges,
      }),
    };
    const generated = generateCaseFromTemplate(templateId, templateOverrides);
    if (!generated) return;
    addCase({
      id: generated.id,
      title: generated.title,
      court: generated.court,
      caseNo: generated.caseNo,
      brief: generated.brief,
      createdAt: generated.createdAt,
      files: [],
      status: generated.status,
      charges: generated.charges,
      caseLaw:  generated.caseLaw  as CaseRecord["caseLaw"],
      timeline: generated.timeline as CaseRecord["timeline"],
      strategy: generated.strategy as CaseRecord["strategy"],
      standards: generated.standards as CaseRecord["standards"],
      metadata: generated.metadata,
    });
  };

  return (
    <CaseContext.Provider value={{
      cases, selectedCaseId, selectedCase,
      setSelectedCaseId, addCase, deleteCase, duplicateCase,
      createFromTemplate, templates: CASE_TEMPLATES, isLoading,
      loadDemoCase, recentCases, isDemoMode,
    }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCaseContext() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCaseContext must be used within CaseProvider");
  return ctx;
}
