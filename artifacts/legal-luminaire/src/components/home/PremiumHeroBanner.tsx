/**
 * PremiumHeroBanner — Legal Luminaire landing hero section.
 *
 * Guide 2 refinement: Premium Landing-Page Beautification.
 * Visual identity: Judicial Navy × Royal Blue × Champagne Gold × Ivory
 *
 * Design tokens are defined as CSS custom properties in index.css (--ll-*).
 * This component uses inline styles as fallback for values not yet in
 * the Tailwind config, while progressively adopting the CSS tokens.
 *
 * Accessibility:
 *   - Single H1 per view (this component provides the landing page H1)
 *   - Focus-visible outlines with gold accent (3px, offset 3px)
 *   - prefers-reduced-motion: all transitions reduced to 0.01ms
 *   - 44×44px minimum touch target on all interactive elements
 *   - All icons aria-hidden; text labels always present
 *   - Colour is never the sole differentiator for status (icon + text paired)
 */

import { Link } from "wouter";
import {
  Scale, ShieldCheck, BookOpen, FileText, Clock,
  Globe, ArrowRight, Github, Zap, Lock, Eye,
  AlertTriangle, CheckCircle2, Info,
} from "lucide-react";

// ── Design tokens (also defined as CSS --ll-* variables in index.css)
const TOKEN = {
  navy:        "#0B1426",
  navyElevated:"#172840",
  blue:        "#2563EB",
  blueHover:   "#1d4ed8",
  gold:        "#D8B36A",
  ivory:       "#F7F5F0",
  white:       "#FFFFFF",
  text:        "#14233b",
  muted:       "#475569",
  border:      "#dce3ec",
  success:     "#15803D",
  warning:     "#B45309",
  danger:      "#B91C1C",
};

// ── Feature capability cards — only features that actually exist
const CAPABILITIES = [
  {
    icon: ShieldCheck,
    title: "Citation Review",
    titleHi: "उद्धरण समीक्षा",
    desc: "Every precedent is classified COURT_SAFE → VERIFIED → SECONDARY → PENDING. Unverified citations are hard-blocked from court export.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: BookOpen,
    title: "Case Analysis",
    titleHi: "मामला विश्लेषण",
    desc: "Hemraj stadium collapse defence: IS 1199, IS 2250, ASTM C1324, Kattavellai SC 2025, Prafulla Kumar Samal — all tier-graded.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "Evidence Organization",
    titleHi: "साक्ष्य संगठन",
    desc: "Document upload with OCR, ChromaDB vector search, and source-cited chronology extraction. Original evidence is never silently replaced.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Eye,
    title: "Draft Preparation",
    titleHi: "प्रारूप तैयारी",
    desc: "English and Hindi side-by-side. Discharge applications, written submissions, arbitration claims — all with pre-filing checklists.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Globe,
    title: "Bilingual Workflows",
    titleHi: "द्विभाषी वर्कफ़्लो",
    desc: "26 demo cases (TC-01 through TC-26). Browse, research, and draft across criminal, civil, and arbitration matters in EN + HI.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Lock,
    title: "Data Safeguards",
    titleHi: "डेटा सुरक्षा",
    desc: "Aadhaar, PAN, phone, email, passport and voter ID are redacted before any AI processing. Case data stays in your browser by default.",
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

// ── Trust architecture — source tier explanation
const TIERS = [
  { tier: "COURT_SAFE", color: TOKEN.success, icon: CheckCircle2, desc: "Certified copy + para confirmed" },
  { tier: "VERIFIED",    color: TOKEN.blue,    icon: ShieldCheck,   desc: "Existence confirmed on official source" },
  { tier: "SECONDARY",   color: TOKEN.warning, icon: Info,          desc: "Credible secondary — qualify before use" },
  { tier: "PENDING",     color: TOKEN.danger,  icon: AlertTriangle, desc: "Unverified — BLOCKED from all exports" },
];

// ── Workflow steps
const WORKFLOW = [
  { step: "01", label: "Research",  labelHi: "अनुसंधान",    icon: BookOpen },
  { step: "02", label: "Verify",   labelHi: "सत्यापन",      icon: ShieldCheck },
  { step: "03", label: "Organize",  labelHi: "संगठन",        icon: FileText },
  { step: "04", label: "Draft",     labelHi: "प्रारूप",      icon: Eye },
  { step: "05", label: "Review",    labelHi: "समीक्षा",      icon: Scale },
];

export function PremiumHeroBanner() {
  return (
    <div className="rounded-2xl overflow-hidden mb-8 shadow-xl">
      {/* ── Hero strip ───────────────────────────────────────────────────── */}
      <section
        aria-labelledby="ll-hero-title"
        className="relative px-6 py-10 md:px-12 md:py-14 ll-hero"
        style={{
          background:
            "radial-gradient(circle at 80% 18%, rgba(37,99,235,0.23), transparent 34%)," +
            "linear-gradient(135deg, #0b1426, #142a46 72%, #0b1426)",
        }}
      >
        {/* Background filigree — subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #2563EB 1px, transparent 1px)," +
              "radial-gradient(circle at 80% 50%, #D8B36A 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Logo mark */}
          <div
            className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${TOKEN.blue}, #1d4ed8)` }}
          >
            <Scale className="w-8 h-8 text-white" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Eyebrow */}
            <p
              className="text-xs font-bold uppercase mb-2"
              style={{ color: TOKEN.gold, letterSpacing: "0.14em" }}
            >
              Indian Legal Research Workbench
            </p>

            {/* H1 — single heading per view */}
            <h1
              id="ll-hero-title"
              className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
              style={{ color: TOKEN.white, maxWidth: "18ch", lineHeight: "1.08", letterSpacing: "-0.035em" }}
            >
              Clarity in Law. Confidence in Every Citation.
            </h1>

            {/* Description */}
            <p
              className="text-sm md:text-base mb-3"
              style={{ color: "#d3dfed", lineHeight: "1.65", maxWidth: "60ch" }}
            >
              Research legal authorities, organize evidence, and prepare drafts with
              transparent citation review and human oversight. Bilingual English + Hindi.
            </p>

            {/* Hindi subtitle */}
            <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
              अनुसंधान • प्रारूपण • सत्यापन — हिंदी और अंग्रेज़ी में
            </p>

            {/* Disclaimer ribbon */}
            <div
              className="mt-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium"
              style={{
                background: "rgba(217,179,106,0.12)",
                border: `1px solid ${TOKEN.gold}44`,
                color: TOKEN.gold,
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              Demo environment — synthetic case data only. Not legal advice.
              Court-use exports require advocate review.
            </div>
          </div>

          {/* CTA buttons — 44px min-height for touch targets */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <Link href="/demo-cases">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold no-underline transition-colors ll-btn-primary"
                style={{
                  background: TOKEN.blue,
                  color: TOKEN.white,
                  minHeight: "44px",
                }}
              >
                <Zap className="w-4 h-4" aria-hidden="true" />
                Explore Workbench
              </a>
            </Link>
            <a
              href="https://github.com/CRAJKUMARSINGH/legal-luminaire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-colors hover:opacity-90"
              style={{
                borderColor: `${TOKEN.white}44`,
                color: TOKEN.white,
                background: "transparent",
                minHeight: "44px",
              }}
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust architecture — source tier explanation ──────────────────── */}
      <section
        aria-label="Citation source tiers"
        className="px-6 py-6 md:px-10"
        style={{ background: TOKEN.navyElevated }}
      >
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: TOKEN.gold }}>
          Trust Architecture
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TIERS.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.tier}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${t.color}33` }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: t.color }} aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold" style={{ color: t.color }}>{t.tier}</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-3" style={{ color: "#64748b" }}>
          Legal status is never colour-only — each tier pairs colour with an icon and text label.
          Human legal review is required for all court filings.
        </p>
      </section>

      {/* ── Capability cards ─────────────────────────────────────────────── */}
      <section
        aria-label="Platform capabilities"
        className="px-6 py-8 md:px-10"
        style={{ background: TOKEN.ivory }}
      >
        <h2 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: TOKEN.muted }}>
          Platform Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className={`rounded-2xl p-5 ${cap.bg} border transition`}
                style={{ borderColor: TOKEN.border, boxShadow: "0 4px 16px rgba(11,20,38,0.06)" }}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex-shrink-0 ${cap.color}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-snug" style={{ color: TOKEN.text }}>
                      {cap.title}
                    </p>
                    <p className="text-xs mt-0.5 mb-1.5" style={{ color: TOKEN.muted }}>
                      {cap.titleHi}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: TOKEN.muted }}>
                      {cap.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Workflow pipeline ────────────────────────────────────────────── */}
      <section
        aria-label="Litigation workflow"
        className="px-6 py-6 md:px-10 border-t"
        style={{ borderColor: TOKEN.border, background: TOKEN.white }}
      >
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: TOKEN.muted }}>
          Workflow
        </h2>
        <ol className="flex flex-wrap gap-3" aria-label="Litigation workflow steps">
          {WORKFLOW.map((w, idx) => {
            const Icon = w.icon;
            const isLast = idx === WORKFLOW.length - 1;
            return (
              <li key={w.step} className="flex items-center gap-2">
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
                  style={{
                    background: idx === 0 ? TOKEN.blue : "#f1f5f9",
                    color: idx === 0 ? TOKEN.white : TOKEN.navy,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{w.step}. {w.label}</span>
                  <span style={{ color: idx === 0 ? "#bfdbfe" : TOKEN.muted }}>
                    {w.labelHi}
                  </span>
                </div>
                {!isLast && <ArrowRight className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="px-6 py-5 md:px-10"
        style={{ background: TOKEN.navy }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#64748b" }}>
            Legal Luminaire — Evidence-first Indian legal research and litigation intelligence.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#64748b" }}>
            <a href="/about" className="hover:text-slate-300 transition-colors">About</a>
            <a href="/how-to-use" className="hover:text-slate-300 transition-colors">Documentation</a>
            <a
              href="https://github.com/CRAJKUMARSINGH/legal-luminaire"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
        <p className="text-xs mt-3" style={{ color: "#475569" }}>
          This application is a research and drafting aid, not legal advice.
          All outputs require review by a qualified Indian advocate before filing.
          Synthetic case data only — do not upload real client documents to demo deployments.
        </p>
      </footer>
    </div>
  );
}
