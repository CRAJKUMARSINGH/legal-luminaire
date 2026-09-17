/**
 * Draft Template Library Page
 *
 * Browse, search and filter all 40+ verified drafts produced by the
 * four-agent system. Each card shows metadata and a "Use in Studio"
 * button that opens MatterDraftingStudio with the draft pre-loaded as
 * source text.
 *
 * Route: /case/:id/draft-template-library  (case-scoped)
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Filter,
  Languages,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  DRAFT_TEMPLATES,
  searchTemplates,
  tierBadgeClass,
  type DraftLanguage,
  type DraftTemplate,
  type MatterCategory,
  type VerificationTier,
} from "@/data/draft-template-library";
import { DOCUMENT_STAGES } from "@/data/matter-drafting-catalog";
import { useCaseContext } from "@/context/CaseContext";

// ─── Constants ───────────────────────────────────────────────────────────────

const LANGUAGE_LABELS: Record<DraftLanguage, string> = {
  en: "English",
  hi: "Hindi / हिंदी",
  bilingual: "Bilingual",
};

const AGENT_COLOURS: Record<string, string> = {
  Kiro:        "bg-violet-100 text-violet-800",
  Devin:       "bg-blue-100 text-blue-800",
  Trae:        "bg-cyan-100 text-cyan-800",
  Antigravity: "bg-orange-100 text-orange-800",
  Cursor:      "bg-emerald-100 text-emerald-800",
  Human:       "bg-gray-100 text-gray-700",
};

const TIER_LABEL: Record<VerificationTier, string> = {
  COURT_SAFE: "Court-Safe",
  VERIFIED:   "Verified",
  SECONDARY:  "Secondary",
  PENDING:    "Pending",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: VerificationTier }) {
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tierBadgeClass(tier)}`}>
      {TIER_LABEL[tier]}
    </span>
  );
}

function CitationBar({ verified, pending }: { verified: number; pending: number }) {
  const total = verified + pending;
  if (total === 0) return null;
  const pct = Math.round((verified / total) * 100);
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
        <span>{verified} verified · {pending} pending</span>
        <span>{pct}% verified</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onUse,
}: {
  template: DraftTemplate;
  onUse: (t: DraftTemplate) => void;
}) {
  const hasPublicFile = Boolean(template.publicPath);

  return (
    <div className="flex flex-col rounded-2xl border bg-card p-4 shadow-sm gap-3 hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug">{template.title}</p>
          {template.titleHi && (
            <p className="text-xs text-muted-foreground mt-0.5">{template.titleHi}</p>
          )}
        </div>
        <TierBadge tier={template.lowestTier} />
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
          {CATEGORY_LABELS[template.category]}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
          {LANGUAGE_LABELS[template.language]}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${AGENT_COLOURS[template.sourceAgent] ?? "bg-gray-100"}`}>
          {template.sourceAgent}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
          {template.version}
        </span>
      </div>

      {/* Court */}
      <p className="text-[11px] text-muted-foreground">
        <span className="font-medium text-foreground">Court: </span>{template.court}
      </p>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>

      {/* Citation bar */}
      <CitationBar verified={template.verifiedCitations} pending={template.pendingCitations} />

      {/* Tags */}
      {template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {tag}
            </span>
          ))}
          {template.tags.length > 5 && (
            <span className="text-[10px] text-muted-foreground">+{template.tags.length - 5} more</span>
          )}
        </div>
      )}

      {/* Repo path */}
      <p className="text-[10px] text-muted-foreground/70 truncate font-mono">
        {template.repoPath}
      </p>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto pt-1">
        <button
          type="button"
          onClick={() => onUse(template)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Use in Studio
        </button>
        {hasPublicFile && (
          <a
            href={template.publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-muted"
            title="Open raw file"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {!hasPublicFile && (
          <div
            className="flex items-center gap-1 rounded-lg border border-dashed px-3 py-2 text-[10px] text-muted-foreground"
            title="File not yet in public/case-assets — use repo path above"
          >
            repo only
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DraftTemplateLibraryPage() {
  const { selectedCase } = useCaseContext();
  const [, navigate] = useLocation();

  const [query, setQuery]             = useState("");
  const [catFilter, setCatFilter]     = useState<MatterCategory | "all">("all");
  const [langFilter, setLangFilter]   = useState<DraftLanguage | "all">("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");

  const allAgents = useMemo(
    () => ["all", ...new Set(DRAFT_TEMPLATES.map((t) => t.sourceAgent))],
    [],
  );

  const allCategories: Array<MatterCategory | "all"> = ["all", ...ALL_CATEGORIES];

  const filtered = useMemo(() => {
    let list = query.trim() ? searchTemplates(query) : DRAFT_TEMPLATES;
    if (catFilter !== "all")   list = list.filter((t) => t.category === catFilter);
    if (langFilter !== "all")  list = list.filter((t) => t.language === langFilter);
    if (agentFilter !== "all") list = list.filter((t) => t.sourceAgent === agentFilter);
    return list;
  }, [query, catFilter, langFilter, agentFilter]);

  const handleUseInStudio = (template: DraftTemplate) => {
    // Store the selected template in sessionStorage so MatterDraftingStudio picks it up
    sessionStorage.setItem(
      "draft-template-library:selected",
      JSON.stringify({
        id:          template.id,
        title:       template.title,
        description: template.description,
        publicPath:  template.publicPath,
        repoPath:    template.repoPath,
        matterFamily: template.matterFamily,
        language:    template.language,
        tags:        template.tags,
      }),
    );
    navigate(`/case/${selectedCase.id}/matter-drafting-studio`);
  };

  const totalVerified = DRAFT_TEMPLATES.reduce((s, t) => s + t.verifiedCitations, 0);
  const totalPending  = DRAFT_TEMPLATES.reduce((s, t) => s + t.pendingCitations, 0);

  return (
    <div className="min-h-full bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Header ── */}
        <header className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <BookOpen className="h-4 w-4" />
            Drafting <ChevronRight className="h-3 w-3" /> Draft Template Library
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Draft Template Library</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            {DRAFT_TEMPLATES.length} verified drafts produced by Kiro, Devin, Trae, Antigravity and Cursor across{" "}
            {new Set(DRAFT_TEMPLATES.map((t) => t.category)).size} matter types.
            Click <span className="font-semibold">Use in Studio</span> to open Matter Drafting Studio with the draft
            pre-loaded as your source text.
          </p>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap gap-4">
            {[
              { label: "Total drafts",      value: DRAFT_TEMPLATES.length },
              { label: "Verified citations", value: totalVerified },
              { label: "Pending citations",  value: totalPending },
              { label: "Matter types",       value: ALL_CATEGORIES.length },
              { label: "Languages",          value: 3 },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border bg-muted/30 px-4 py-2 text-center">
                <p className="text-lg font-bold">{value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </header>

        {/* ── Safety notice ── */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            These drafts are starting points only. When you load one into Matter Drafting Studio,
            the Citation Gate will re-scan it. Replace every party name, date, amount and case number
            with your verified case facts before filing.
          </span>
        </div>

        {/* ── Filters ── */}
        <div className="rounded-2xl border bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4 text-primary" /> Filters
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, court, tag, description…"
              className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Category */}
            <label className="text-xs font-medium text-muted-foreground">
              Matter type
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value as MatterCategory | "all")}
                className="mt-1 w-full rounded-lg border bg-background px-2 py-1.5 text-sm font-normal text-foreground"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All types" : CATEGORY_LABELS[c as MatterCategory]}
                  </option>
                ))}
              </select>
            </label>

            {/* Language */}
            <label className="text-xs font-medium text-muted-foreground">
              Language
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value as DraftLanguage | "all")}
                className="mt-1 w-full rounded-lg border bg-background px-2 py-1.5 text-sm font-normal text-foreground"
              >
                <option value="all">All languages</option>
                <option value="en">English</option>
                <option value="hi">Hindi / हिंदी</option>
                <option value="bilingual">Bilingual</option>
              </select>
            </label>

            {/* Agent */}
            <label className="text-xs font-medium text-muted-foreground">
              Source agent
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="mt-1 w-full rounded-lg border bg-background px-2 py-1.5 text-sm font-normal text-foreground"
              >
                {allAgents.map((a) => (
                  <option key={a} value={a}>{a === "all" ? "All agents" : a}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filtered.length}</strong> of {DRAFT_TEMPLATES.length} drafts
            </span>
            {(query || catFilter !== "all" || langFilter !== "all" || agentFilter !== "all") && (
              <button
                type="button"
                onClick={() => { setQuery(""); setCatFilter("all"); setLangFilter("all"); setAgentFilter("all"); }}
                className="text-primary underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── Template grid ── */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
            <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p className="font-medium">No templates match your filters.</p>
            <p className="text-sm mt-1">Try clearing some filters or broadening your search.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUseInStudio}
              />
            ))}
          </div>
        )}

        {/* ── Legend ── */}
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Verification tier legend
          </p>
          <div className="flex flex-wrap gap-3">
            {(["COURT_SAFE", "VERIFIED", "SECONDARY", "PENDING"] as VerificationTier[]).map((tier) => (
              <div key={tier} className="flex items-center gap-2">
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tierBadgeClass(tier)}`}>
                  {TIER_LABEL[tier]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tier === "COURT_SAFE"  && "Certified copy + para number confirmed"}
                  {tier === "VERIFIED"    && "Existence confirmed on official source"}
                  {tier === "SECONDARY"   && "Credible secondary source — needs primary verification"}
                  {tier === "PENDING"     && "Unverified — must not appear in filed drafts"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {Object.entries(AGENT_COLOURS).map(([agent, cls]) => (
              <div key={agent} className="flex items-center gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{agent}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
