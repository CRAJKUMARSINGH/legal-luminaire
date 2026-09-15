import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCaseContext } from "@/context/CaseContext";
import { Scale, X, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { NAV_GROUPS, type NavGroup, type NavGroupId, type NavItem } from "@/config/navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { selectedCase, selectedCaseId, setSelectedCaseId, cases, isDemoMode } = useCaseContext();
  const [collapsed, setCollapsed] = useState<Record<NavGroupId, boolean>>({
    setup: false, research: false, drafting: false, review: false, week04: false,
  });
  const [moreOpen, setMoreOpen] = useState<Record<NavGroupId, boolean>>({
    setup: false, research: false, drafting: false, review: false, week04: false,
  });

  const hrefFor = (item: NavItem) => (item.caseScoped ? `/case/${selectedCase.id}${item.path}` : item.path);
  const isActive = (item: NavItem) => location === hrefFor(item);

  const renderItem = (item: NavItem) => {
    const active = isActive(item);
    const Icon = item.icon;
    return (
      <Link
        key={item.path}
        href={hrefFor(item)}
        onClick={onClose}
        aria-current={active ? "page" : undefined}
        className={`w-full flex items-center justify-between p-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary ${active ? "bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
      >
        <div className="flex items-center gap-2 text-left">
          <Icon className={`w-4 h-4 ${active ? "" : "opacity-70"}`} />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px]">{item.label}</span>
            <span className="text-[9px] opacity-70">{item.labelEn}</span>
          </div>
        </div>
        {item.badge && (
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm ${item.badge === "NEW" ? "bg-emerald-500 text-white" : item.badge === "DEMO" ? "bg-amber-500 text-white" : "bg-red-500 text-white"}`}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const renderGroup = (group: NavGroup) => {
    const isCollapsed = collapsed[group.id];
    const showMore = moreOpen[group.id];
    const groupActive = [...group.items, ...group.secondary].some(isActive);
    const panelId = `nav-group-${group.id}`;
    return (
      <section key={group.id} className="mb-4" aria-labelledby={`${panelId}-label`}>
        <button
          type="button"
          id={`${panelId}-label`}
          aria-expanded={!isCollapsed}
          aria-controls={panelId}
          onClick={() => setCollapsed((s) => ({ ...s, [group.id]: !s[group.id] }))}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary hover:bg-sidebar-accent/60 ${groupActive ? "text-sidebar-primary" : "text-sidebar-accent-foreground"}`}
        >
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] font-bold tracking-wide">{group.groupLabel}</span>
            <span className="text-[9px] uppercase tracking-widest opacity-60">{group.groupLabelEn}</span>
          </span>
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 opacity-60" /> : <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
        </button>
        {!isCollapsed && (
          <div id={panelId} className="mt-1 space-y-0.5">
            {group.items.map(renderItem)}
            {group.secondary.length > 0 && (
              <>
                <button
                  type="button"
                  aria-expanded={showMore}
                  aria-controls={`${panelId}-more`}
                  onClick={() => setMoreOpen((s) => ({ ...s, [group.id]: !s[group.id] }))}
                  className="w-full flex items-center gap-1.5 px-2 py-1 text-[10px] text-sidebar-accent-foreground opacity-70 hover:opacity-100 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary"
                >
                  {showMore ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  {showMore ? "कम दिखाएँ / Show less" : `और टूल / More tools (${group.secondary.length})`}
                </button>
                {showMore && (
                  <div id={`${panelId}-more`} className="pl-2 border-l border-sidebar-border ml-2 space-y-0.5">
                    {group.secondary.map(renderItem)}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        aria-label="मुख्य नेविगेशन / Main navigation"
        className={`fixed left-0 top-0 h-full z-40 bg-sidebar text-sidebar-foreground transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto w-72 flex flex-col shadow-xl`}
      >
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg leading-tight text-sidebar-foreground">Legal Luminaire</h1>
                  <span className="bg-primary/20 text-primary text-[8px] font-black px-1 rounded border border-primary/30 uppercase tracking-tighter">Pro</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-sidebar-accent-foreground opacity-80">अधिवक्ता शोध मंच</p>
                  <span className="text-[8px] bg-emerald-500/20 text-emerald-500 px-1 rounded border border-emerald-500/30 font-bold tracking-tighter animate-pulse">BETA</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-sidebar-accent" aria-label="मेनू बंद करें / Close menu">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-4 px-2">
            <label htmlFor="sidebar-case-selector" className="block text-xs font-semibold uppercase tracking-wider text-sidebar-accent-foreground opacity-60 mb-2">
              सक्रिय केस / Active Case
            </label>
            <select
              id="sidebar-case-selector"
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-sidebar-accent text-sidebar-accent-foreground text-xs rounded-md px-2 py-2 border border-sidebar-border"
            >
              {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            {isDemoMode && (
              <p className="mt-1.5 text-[9px] font-black tracking-widest text-amber-400 uppercase">
                SYNTHETIC / DEMO — कृत्रिम डेटा
              </p>
            )}
          </div>

          {NAV_GROUPS.map(renderGroup)}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-lg p-3">
            <p className="text-xs text-sidebar-accent-foreground opacity-80 leading-relaxed truncate">{selectedCase.caseNo || "Case"}</p>
            <p className="text-xs font-semibold text-sidebar-primary mt-1 truncate">{selectedCase.title}</p>
            <div className="mt-2 flex items-center gap-1.5 opacity-60">
              <Globe className="w-3 h-3 text-sidebar-accent-foreground" />
              <span className="text-[9px] font-bold tracking-widest text-sidebar-accent-foreground uppercase">Jurisdiction Aware</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
