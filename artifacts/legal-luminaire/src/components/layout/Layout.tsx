import { useState } from "react";
import { Menu } from "lucide-react";
import { useLocation } from "wouter";
import { Sidebar } from "./Sidebar";
import { BreadcrumbTrail } from "./BreadcrumbTrail";
import { Breadcrumbs } from "./Breadcrumbs";
import { CaseRouteSync } from "./CaseRouteSync";
import { DemoBanner } from "@/components/DemoBanner";
import { useCaseContext } from "@/context/CaseContext";
import { NAV_GROUPS, ALL_NAV_ITEMS } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { CopilotPanel } from "@/features/copilot";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { selectedCase, isDemoMode } = useCaseContext();

  const currentNav = ALL_NAV_ITEMS.find(
    n => n.path !== "/" &&
      (location === n.path || location === `/case/${selectedCase.id}${n.path}`)
  ) || ALL_NAV_ITEMS.find(n => n.path === "/");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CaseRouteSync />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card shrink-0 no-print">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="मेनू खोलें / Open menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <BreadcrumbTrail />
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">{currentNav?.label || "Legal Luminaire"}</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">{currentNav?.labelEn || "Advocate Research Platform"}</p>
              {selectedCase.isDemo && (
                <Badge variant="fatal" className="text-[10px] font-black tracking-wider border-dashed">
                  SYNTHETIC
                  <span className="opacity-70 ml-0.5">/ कृत्रिम</span>
                  <span className="ml-1 opacity-60">DEMO</span>
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(isDemoMode || selectedCase.isDemo) && (
              <span
                data-testid="demo-badge"
                className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-lg"
                title="कृत्रिम / डेमो डेटा — Synthetic demo data, not for filing"
              >
                SYNTHETIC / DEMO
              </span>
            )}
            <span className="hidden md:inline text-[9px] font-black tracking-widest bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-lg">
              NATIONAL BETA 2026
            </span>
            <span className="hidden md:inline text-[10px] bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-bold">
              Professional Edition
            </span>
          </div>
        </header>
        {(isDemoMode || selectedCase.isDemo) && <DemoBanner caseTitle={selectedCase.title} />}
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      {/* ── Ask Luminaire Copilot Panel (Week 6) ─────────────────────────────── */}
      <CopilotPanel />
    </div>
  );
}
