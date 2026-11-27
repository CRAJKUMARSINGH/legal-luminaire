import { useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useCaseContext } from "@/context/CaseContext";
import { CASE_CATALOG } from "@/cases/registry";

/**
 * Keeps `CaseContext` in sync with the `/case/:id/*` URL so deep links and
 * demo-browser links switch the active case. Unknown catalogue ids are built
 * on the fly; unknown arbitrary ids are left alone (the selector still rules).
 */
export function CaseRouteSync() {
  const [match, params] = useRoute<{ id: string }>("/case/:id/*?");
  const { cases, selectedCaseId, setSelectedCaseId, loadDemoCase } = useCaseContext();
  const [, setLocation] = useLocation();
  const inflight = useRef<string | null>(null);

  const urlId = match ? params.id : null;

  useEffect(() => {
    // Cold-link guard: "/case/undefined/dashboard" → "/case/case-01/dashboard"
    if (urlId === "undefined") {
      setLocation(window.location.pathname.replace("/case/undefined", "/case/case-01"), { replace: true });
      return;
    }
    if (!urlId || urlId === selectedCaseId || inflight.current === urlId) return;
    if (cases.some((c) => c.id === urlId)) {
      setSelectedCaseId(urlId);
      return;
    }
    if (CASE_CATALOG.some((c) => c.id === urlId)) {
      inflight.current = urlId;
      loadDemoCase(urlId).finally(() => { inflight.current = null; });
    }
  }, [urlId, selectedCaseId, cases, setSelectedCaseId, loadDemoCase]);

  return null;
}
