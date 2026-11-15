/**
 * PremiumHeroBanner — Legal Luminaire landing hero section.
 *
 * Visual identity: Midnight Navy / Royal Blue / Antique Gold / Ivory
 * Positioned at the top of Home.tsx above the existing dashboard widgets.
 * Does NOT break any existing hook, context, or route.
 */

import { Link } from "wouter";
import {
  Scale, ShieldCheck, BookOpen, FileText, Clock,
  Globe, ArrowRight, Github, Zap, Lock, Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ── Design tokens (inlined for portability — also documented in DESIGN_TOKENS.md)
const TOKEN = {
  navy:    "#0B1426",
  blue:    "#2563EB",
  gold:    "#D8B36A",
  ivory:   "#F7F5F0",
  slate:   "#64748B",
  emerald: "#15803D",
};

// ── Feature capability cards
const CAPABILITIES = [
  {
    icon: ShieldCheck,
    title: "Citation Safety Gate",
    titleHi: "उद्धरण सुरक्षा द्वार",
    desc: "Every precedent is classified COURT_SAFE → VERIFIED → SECONDARY → PENDING. Unverified citations are hard-blocked from court export.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: BookOpen,
    title: "19 Verified Precedents",
    titleHi: "19 सत्यापित मिसालें",
    desc: "Hemraj stadium collapse defence: IS 1199, IS 2250, ASTM C1324, Kattavellai SC 2025, Prafulla Kumar Samal, and more — all tier-graded.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Clock,
    title: "Deterministic Deadlines",
    titleHi: "नियतात्मक समय-सीमाएँ",
    desc: "CrPC §167, §173, §439, §468 — computed without LLM, with bilingual basis strings and CANNOT_COMPUTE safety for missing dates.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: FileText,
    title: "Bilingual Drafting",
    titleHi: "द्विभाषी प्रारूपण",
    desc: "English and Hindi side-by-side. Discharge applications, written submissions, arbitration claims — all with pre-filing checklists.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Globe,
    title: "26 Demo Cases",
    titleHi: "26 प्रदर्शन मामले",
    desc: "TC-01 (stadium collapse) through TC-26 (infra arbitration). Browse, research, and draft across criminal, civil, and arbitration matters.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Lock,
    title: "Privacy by Default",
    titleHi: "डिफ़ॉल्ट गोपनीयता",
    desc: "Aadhaar, PAN, phone, email, passport and voter ID are redacted before any AI processing. Your case data stays in your browser.",
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

// ── Workflow steps
const WORKFLOW = [
  { step: "01", label: "Case Intake", labelHi: "मामला प्रविष्टि",   icon: FileText },
  { step: "02", label: "Document Upload", labelHi: "दस्तावेज़ अपलोड", icon: Zap },
  { step: "03", label: "Research",    labelHi: "अनुसंधान",           icon: BookOpen },
  { step: "04", label: "Draft",       labelHi: "प्रारूप",             icon: Eye },
  { step: "05", label: "Verify",      labelHi: "सत्यापन",             icon: ShieldCheck },
  { step: "06", label: "Export",      labelHi: "निर्यात",              icon: Scale },
];

export function PremiumHeroBanner() {
  return (
    <div className="rounded-2xl overflow-hidden mb-8 shadow-xl">
      {/* ── Hero strip ───────────────────────────────────────────────────── */}
      <div
        className="relative px-8 py-10 md:px-12 md:py-14"
        style={{ background: `linear-gradient(135deg, ${TOKEN.navy} 0%, #132040 60%, #1a2f5a 100%)` }}
      >
        {/* Background filigree — subtle legal scales motif */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #2563EB 1px, transparent 1px), " +
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
            {/* Title */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1
                className="text-3xl md:text-4xl font-bold tracking-tight"
                style={{ color: TOKEN.ivory }}
              >
                Legal Luminaire
              </h1>
              <Badge
                className="text-xs font-semibold px-2 py-0.5 rounded-md border-0"
                style={{ background: TOKEN.gold, color: TOKEN.navy }}
              >
                India's Evidence-First Legal AI
              </Badge>
            </div>

            {/* Tagline */}
            <p className="text-base md:text-lg font-medium mb-1" style={{ color: TOKEN.gold }}>
              Cite with confidence. Draft with rigour. File with authority.
            </p>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              अनुसंधान • प्रारूपण • सत्यापन — हिंदी और अंग्रेज़ी में
            </p>

            {/* Disclaimer ribbon */}
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium"
              style={{ background: "rgba(217,179,106,0.12)", border: `1px solid ${TOKEN.gold}44`, color: TOKEN.gold }}
            >
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              Demo environment — synthetic case data only. Not legal advice. Court-use exports require advocate review.
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <Link href="/demo-cases">
              <Button
                className="w-full sm:w-auto font-semibold gap-2 shadow"
                style={{ background: TOKEN.blue, color: "white" }}
              >
                <Zap className="w-4 h-4" aria-hidden="true" />
                Browse Demo Cases
              </Button>
            </Link>
            <a
              href="https://github.com/CRAJKUMARSINGH/legal-luminaire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90"
              style={{ borderColor: `${TOKEN.ivory}44`, color: TOKEN.ivory, background: "transparent" }}
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* ── Capability cards ─────────────────────────────────────────────── */}
      <div
        className="px-6 py-8 md:px-10"
        style={{ background: TOKEN.ivory }}
      >
        <h2 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: TOKEN.slate }}>
          Platform Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className={`rounded-xl p-4 ${cap.bg} border border-transparent hover:border-current/10 transition`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex-shrink-0 ${cap.color}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{cap.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 mb-1">{cap.titleHi}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{cap.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Workflow pipeline ────────────────────────────────────────────── */}
      <div
        className="px-6 py-6 md:px-10 border-t"
        style={{ borderColor: "#e2e8f0", background: "white" }}
      >
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: TOKEN.slate }}>
          Litigation Workflow
        </h2>
        <ol className="flex flex-wrap gap-3" aria-label="Litigation workflow steps">
          {WORKFLOW.map((w, idx) => {
            const Icon = w.icon;
            const isLast = idx === WORKFLOW.length - 1;
            return (
              <li key={w.step} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
                  style={{ background: idx === 0 ? TOKEN.blue : "#f1f5f9", color: idx === 0 ? "white" : TOKEN.navy }}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{w.step}. {w.label}</span>
                  <span className="text-opacity-70" style={{ color: idx === 0 ? "#bfdbfe" : TOKEN.slate }}>
                    {w.labelHi}
                  </span>
                </div>
                {!isLast && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
