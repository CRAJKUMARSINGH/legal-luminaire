/**
 * OnboardingHero — displayed on Home BEFORE any case is loaded.
 * Solves: "tool is nowhere displaying — what is the use of it?"
 */
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SaraswatiMascot } from "@/components/SaraswatiMascot";
import {
  Scale, ShieldCheck, Search, Edit3, Clock, FlaskConical,
  BookOpen, ArrowRight, PlayCircle, HelpCircle, Bot, Users,
  ChevronDown, ChevronUp, Gavel, AlertTriangle, Zap, FileText,
} from "lucide-react";

const FEATURES = [
  { icon: Search,        label: "AI Legal Research",        labelHi: "AI विधिक शोध",        color: "text-blue-600",   bg: "bg-blue-50 border-blue-100" },
  { icon: Edit3,         label: "AI Legal Drafting",         labelHi: "AI प्रारूपण",          color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
  { icon: ShieldCheck,   label: "Citation Verification",     labelHi: "उद्धरण सत्यापन",       color: "text-green-600",  bg: "bg-green-50 border-green-100" },
  { icon: Clock,         label: "Case Chronology",           labelHi: "केस कालक्रम",          color: "text-amber-600",  bg: "bg-amber-50 border-amber-100" },
  { icon: Scale,         label: "Case Management",           labelHi: "केस प्रबंधन",          color: "text-primary",    bg: "bg-primary/5 border-primary/20" },
  { icon: Gavel,         label: "Court & Case Tracking",     labelHi: "कोर्ट ट्रैकिंग",       color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  { icon: AlertTriangle, label: "Deadline Tracking",         labelHi: "समय-सीमा ट्रैकिंग",    color: "text-red-600",    bg: "bg-red-50 border-red-100" },
  { icon: FileText,      label: "Document Management",       labelHi: "दस्तावेज़ प्रबंधन",     color: "text-blue-500",   bg: "bg-blue-50/70 border-blue-100" },
  { icon: Users,         label: "Client & Matter Mgmt",      labelHi: "मुवक्किल/वाद",         color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
  { icon: Zap,           label: "Workflow Automation",       labelHi: "कार्यप्रवाह",          color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
  { icon: Bot,           label: "8 AI Agents",               labelHi: "8 AI एजेंट",           color: "text-primary",    bg: "bg-primary/5 border-primary/20" },
  { icon: FlaskConical,  label: "Forensic Standards",        labelHi: "फॉरेन्सिक मानक",       color: "text-teal-600",   bg: "bg-teal-50 border-teal-100" },
];

const WORKFLOW_STEPS = [
  { n: "1", label: "Intake",   hi: "इनटेक",   desc: "Upload FIR, charge-sheet, FSL report",          route: "/intake",              color: "bg-blue-500" },
  { n: "2", label: "Research", hi: "शोध",      desc: "Fact-Fit Gate scores precedents",                route: "/citation-search",     color: "bg-violet-500" },
  { n: "3", label: "Verify",   hi: "सत्यापन", desc: "5-tier citation verification report",            route: "/verification-report", color: "bg-green-500" },
  { n: "4", label: "Draft",    hi: "प्रारूप", desc: "Bilingual draft with AI copilot",                route: "/copilot",             color: "bg-amber-500" },
  { n: "5", label: "Review",   hi: "समीक्षा", desc: "Pre-filing checklist + accuracy report",        route: "/filing-checklist",    color: "bg-primary" },
];

export function OnboardingHero() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-blue-50/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start gap-5">
          <SaraswatiMascot size="lg" onClick={() => window.location.href = "/about"} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">Legal Luminaire</h1>
              <Badge className="bg-primary text-primary-foreground text-[10px] font-black">ACCURACY-FIRST</Badge>
              <Badge variant="outline" className="text-[10px]">Hindi + English</Badge>
              <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">SYNTHETIC / DEMO</Badge>
            </div>
            <p className="text-base font-semibold text-foreground/90 leading-snug">
              India's first zero-hallucination AI legal workbench — built by a Senior Counsel with 30+ years in Indian courts.
            </p>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
              Research precedents with a 3-axis Fact-Fit Gate, verify citations across 5 tiers, draft bilingual court documents
              with verbatim holdings, track deadlines, manage cases — all from one platform.
              <strong> PENDING citations are hard-blocked. IS standards are enforced. No hallucinations.</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary shrink-0" />
              Built by <strong>Rajkumar Singh Chauhan</strong> — Senior Counsel and Civil Engineer · 30+ years · B.E. + LL.B.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link href="/demo-browser">
                <Button className="gap-1.5 bg-primary"><PlayCircle className="h-4 w-4" /> Try All Demo Cases</Button>
              </Link>
              <Link href="/how-to-use">
                <Button variant="outline" className="gap-1.5"><HelpCircle className="h-4 w-4" /> How To Use</Button>
              </Link>
              <Link href="/ai-agents">
                <Button variant="outline" className="gap-1.5"><Bot className="h-4 w-4" /> AI Agents</Button>
              </Link>
              <Link href="/manual">
                <Button variant="ghost" className="gap-1.5 text-xs"><BookOpen className="h-3.5 w-3.5" /> User Manual</Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="gap-1.5 text-xs"><Users className="h-3.5 w-3.5" /> About Creator</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Workflow */}
      <div className="rounded-xl border bg-card p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          5-Step Accuracy-First Workflow
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          {WORKFLOW_STEPS.map((w) => (
            <Link key={w.n} href={w.route} className="flex-1">
              <div className="flex sm:flex-col items-center gap-2 sm:gap-1.5 p-3 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group h-full">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-white font-bold text-xs shrink-0 ${w.color}`}>{w.n}</span>
                <div className="sm:text-center min-w-0">
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{w.label}</p>
                  <p className="text-[10px] text-muted-foreground">{w.hi}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5 leading-tight hidden sm:block">{w.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Accuracy Core */}
      <div className="rounded-xl border border-green-200 bg-green-50/60 p-5">
        <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-3">
          Accuracy Engine (always enforced — cannot be disabled)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { e: "🎯", t: "Fact-Fit Gate: every precedent scored 0-100. Score < 30 = auto-rejected." },
            { e: "🔒", t: "5 Tiers: COURT_SAFE → VERIFIED → SECONDARY → PENDING → FATAL_ERROR" },
            { e: "🚫", t: "PENDING citations hard-blocked. Draft export disabled until cleared." },
            { e: "📐", t: "IS 2250:1981 vs IS 1199:2018 — wrong standard auto-flagged." },
            { e: "📝", t: "Verbatim holdings only — paraphrasing forbidden in all code paths." },
            { e: "📋", t: "Every draft: Verification Report + Pre-Filing Checklist auto-generated." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-green-800">
              <span className="shrink-0 text-sm mt-0.5">{r.e}</span>
              <span>{r.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 12 Features */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold hover:bg-muted/30 transition-colors"
          onClick={() => setShowAll(!showAll)}
        >
          <span className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            12 Statutory Features — click to explore
            <Badge variant="outline" className="text-[10px]">12 features</Badge>
          </span>
          {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showAll && (
          <div className="px-5 pb-5 border-t">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
              {FEATURES.map(f => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className={`flex items-center gap-2 p-2.5 rounded-lg border ${f.bg}`}>
                    <Icon className={`h-4 w-4 shrink-0 ${f.color}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium leading-tight truncate">{f.label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{f.labelHi}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link href="/ai-agents">
                <Button size="sm" className="gap-1.5 text-xs"><Bot className="h-3.5 w-3.5" /> AI Agents Dashboard</Button>
              </Link>
              <Link href="/litigation-workflow">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Zap className="h-3.5 w-3.5" /> Workflow Automation</Button>
              </Link>
              <Link href="/how-to-use">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs"><HelpCircle className="h-3.5 w-3.5" /> Full User Manual</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Start */}
      <div className="rounded-xl border bg-muted/20 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Start in 60 seconds</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { n: "1", label: "Load Demo Case",      hi: "डेमो केस लोड",    route: "/demo-browser",      cls: "bg-amber-500 text-white hover:bg-amber-600" },
            { n: "2", label: "Research Precedents",  hi: "मिसालें खोजें",   route: "/citation-search",   cls: "bg-blue-500 text-white hover:bg-blue-600" },
            { n: "3", label: "Draft a Document",     hi: "दस्तावेज़ लिखें", route: "/copilot",           cls: "bg-violet-500 text-white hover:bg-violet-600" },
            { n: "4", label: "Read User Manual",     hi: "मैनुअल पढ़ें",    route: "/how-to-use",        cls: "bg-primary text-primary-foreground hover:opacity-90" },
          ].map(q => (
            <Link key={q.n} href={q.route}>
              <div className={`flex items-center gap-2.5 p-3 rounded-lg cursor-pointer transition-all ${q.cls}`}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 font-bold text-xs shrink-0">{q.n}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold leading-tight">{q.label}</p>
                  <p className="text-[10px] opacity-80">{q.hi}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
