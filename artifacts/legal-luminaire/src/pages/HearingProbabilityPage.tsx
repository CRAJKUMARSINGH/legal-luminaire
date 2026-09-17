/**
 * HearingProbabilityPage — Month 6 (Roadmap: Outcome Prediction + Hearing Tracker)
 * ─────────────────────────────────────────────────────────────────────────────────
 * Standalone page that shows:
 *   1. Next-hearing countdown with urgency colour-coding
 *   2. Probability / Case Strength Assessment card (citation + fact-fit + standards)
 *   3. Hearing history table (editable — next hearing date persisted to localStorage)
 *   4. Ground-by-ground strength breakdown for active case
 *
 * Route: /case/:id/hearing-probability  (added to routes.tsx)
 *
 * Data: localStorage-persisted per case. No backend required (Month 1 upgrade will
 *       migrate this to PostgreSQL via Drizzle ORM).
 *
 * NOT a legal opinion — clearly labelled as a technical strength indicator.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Info,
  Save,
  Plus,
  Trash2,
  Clock,
  Gavel,
  FileText,
} from "lucide-react";
import { differenceInCalendarDays, format, parseISO, isValid } from "date-fns";
import { useCaseContext } from "@/context/CaseContext";
import { HearingCountdown } from "@/components/HearingCountdown";
import { ProbabilityAssessmentCard } from "@/components/ProbabilityAssessmentCard";
import { CASE01_PRECEDENTS, CASE01_STANDARDS } from "@/lib/case01-data";

// ── Types ─────────────────────────────────────────────────────────────────────
interface HearingEntry {
  id: string;
  date: string;
  purpose: string;
  court: string;
  notes: string;
}

interface GroundStrength {
  ground: string;
  groundHi: string;
  score: number;
  citationCount: number;
  pendingCount: number;
  standardsCount: number;
  verdict: "strong" | "moderate" | "weak";
  keyNote: string;
}

// ── Storage helpers ────────────────────────────────────────────────────────────
function storageKey(caseId: string): string {
  return `legal-luminaire:hearing-tracker:${caseId}`;
}

function loadHearings(caseId: string): HearingEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(caseId));
    if (raw) return JSON.parse(raw) as HearingEntry[];
  } catch {
    /* ignore */
  }
  // Default demo entry for Case 01 (Hemraj)
  return [
    {
      id: "h1",
      date: "2026-10-15",
      purpose: "Arguments on Discharge Application",
      court: "Sessions Court, Udaipur",
      notes: "Bring certified copies of Kattavellai 2025 INSC 845 + IS 3535:1986",
    },
  ];
}

function saveHearings(caseId: string, entries: HearingEntry[]): void {
  try {
    localStorage.setItem(storageKey(caseId), JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

// ── Ground-by-ground strength (Hemraj case hardcoded; generic for others) ─────
function computeGroundStrengths(): GroundStrength[] {
  const verifiedCitations = CASE01_PRECEDENTS.filter((p) => p.status === "VERIFIED").length;
  const secondaryCitations = CASE01_PRECEDENTS.filter((p) => p.status === "SECONDARY").length;
  const pendingCitations = CASE01_PRECEDENTS.filter((p) => p.status === "PENDING").length;
  const verifiedStandards = CASE01_STANDARDS.filter((s) => s.confidence === "VERIFIED").length;

  void verifiedCitations;
  void secondaryCitations;
  void pendingCitations;
  void verifiedStandards;

  return [
    {
      ground: "Chain of Custody Absent",
      groundHi: "अभिरक्षा श्रृंखला का अभाव",
      score: 91,
      citationCount: 4, // Kattavellai, Damu, Surendra Koli, Uttarakhand HC
      pendingCount: 0,
      standardsCount: 2, // IS 3535, ISO/IEC 17025
      verdict: "strong",
      keyNote: "Binding SC precedent (Kattavellai 2025 INSC 845) directly on point. 7 chain-of-custody gaps documented.",
    },
    {
      ground: "Wrong IS Standard (IS 1199:2018)",
      groundHi: "गलत मानक का प्रयोग",
      score: 88,
      citationCount: 2, // Tomaso Bruno, Sushil Sharma
      pendingCount: 0,
      standardsCount: 3, // IS 1199, IS 2250, ASTM C1324
      verdict: "strong",
      keyNote: "Prosecution expert admitted IS 2250:1981 is correct standard. IS 1199:2018 scope clause unambiguous — fresh concrete only.",
    },
    {
      ground: "No Three-Way Split (IS 3535:1986 Cl. 5.7.5)",
      groundHi: "तीन भागों में विभाजन नहीं",
      score: 83,
      citationCount: 2, // Baldev Singh, p18 standard precedent
      pendingCount: 0,
      standardsCount: 1, // IS 3535
      verdict: "strong",
      keyNote: "Contractor deprived of counter-sample for independent retesting. IS 3535:1986 Cl. 5.7.5 + Art. 21 fair trial right engaged.",
    },
    {
      ground: "Contractor Absent at Sampling (Natural Justice)",
      groundHi: "ठेकेदार प्रतिनिधि अनुपस्थित",
      score: 80,
      citationCount: 2, // Baldev Singh, Christopher Signi
      pendingCount: 0,
      standardsCount: 2, // IS 3535 Cl. 4.1, CPWD Manual
      verdict: "strong",
      keyNote: "IS 3535:1986 Cl. 4.1 + CPWD Manual §§3.7.4, 12.2.1 — mandatory presence violated. Audi alteram partem.",
    },
    {
      ground: "Carbonated Layer Not Removed (ASTM C1324)",
      groundHi: "कार्बोनेटेड परत नहीं हटाई",
      score: 72,
      citationCount: 0,
      pendingCount: 0,
      standardsCount: 2, // ASTM C1324, BS EN 1015-2
      verdict: "moderate",
      keyNote: "15-year-old mortar: carbonated layer 10–15mm deep, strength 30–50% lower than original. ASTM C1324 §§7-8 entirely ignored. Needs expert affidavit.",
    },
    {
      ground: "Force Majeure (Heavy Rainfall)",
      groundHi: "अपरिहार्य घटना — भारी वर्षा",
      score: 68,
      citationCount: 3, // Rajasthan HC PIL, RSMML, NBC
      pendingCount: 1, // RSMML downgraded to SECONDARY
      standardsCount: 1, // NBC 2016
      verdict: "moderate",
      keyNote: "NBC 2016 §3.4 classifies extreme weather as Force Majeure. Rajasthan HC's own judicial notice of weather + age + maintenance as causes. RSMML citation needs certified copy.",
    },
    {
      ground: "Discharge — No Prima Facie Case",
      groundHi: "आरोप-मुक्ति — प्रथम दृष्टया प्रकरण नहीं",
      score: 87,
      citationCount: 2, // Prafulla Kumar Samal, Ramesh Singh
      pendingCount: 0,
      standardsCount: 0,
      verdict: "strong",
      keyNote: "Both Prafulla Kumar Samal Para 10 and Ramesh Singh Para 5 are VERIFIED with exact verbatim text. Defective FSL report = suspicion only = discharge mandatory.",
    },
    {
      ground: "Panchanama — Section 162 CrPC Defect",
      groundHi: "पंचनामा — धारा 162 CrPC उल्लंघन",
      score: 62,
      citationCount: 2, // Damu, Rajesh & Anr. 2023 INSC 839 (p20)
      pendingCount: 1, // p20 is SECONDARY — certified copy required
      standardsCount: 0,
      verdict: "moderate",
      keyNote: "Rajesh & Anr. (2023 INSC 839) directly on panchanama inadmissibility. Certified copy required before filing — currently SECONDARY.",
    },
  ];
}

// ── Urgency helpers ───────────────────────────────────────────────────────────
function getUrgency(dateStr: string): "critical" | "warning" | "ok" | "past" {
  const d = parseISO(dateStr);
  if (!isValid(d)) return "ok";
  const days = differenceInCalendarDays(d, new Date());
  if (days < 0) return "past";
  if (days <= 7) return "critical";
  if (days <= 30) return "warning";
  return "ok";
}

function daysLabel(dateStr: string): string {
  const d = parseISO(dateStr);
  if (!isValid(d)) return "Invalid date";
  const days = differenceInCalendarDays(d, new Date());
  if (days < 0) return `${Math.abs(days)} day(s) ago`;
  if (days === 0) return "TODAY";
  return `${days} day(s)`;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function HearingProbabilityPage() {
  const { selectedCase, isDemoMode } = useCaseContext();
  const caseId = selectedCase?.id ?? "case01";

  // ── Hearing tracker state ─────────────────────────────────────────────────
  const [hearings, setHearings] = useState<HearingEntry[]>(() => loadHearings(caseId));
  const [editId, setEditId] = useState<string | null>(null);
  const [newHearing, setNewHearing] = useState<Omit<HearingEntry, "id">>({
    date: "",
    purpose: "",
    court: "",
    notes: "",
  });
  const [addingNew, setAddingNew] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Persist on change ──────────────────────────────────────────────────────
  useEffect(() => {
    saveHearings(caseId, hearings);
  }, [hearings, caseId]);

  // ── Next hearing (soonest future date) ────────────────────────────────────
  const nextHearing = useMemo(() => {
    const future = hearings
      .filter((h) => {
        const d = parseISO(h.date);
        return isValid(d) && differenceInCalendarDays(d, new Date()) >= 0;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
    return future[0] ?? null;
  }, [hearings]);

  // ── Ground strengths (Hemraj or generic) ──────────────────────────────────
  const groundStrengths = useMemo(() => computeGroundStrengths(), []);

  const overallStrength = useMemo(() => {
    const sum = groundStrengths.reduce((s, g) => s + g.score, 0);
    return Math.round(sum / groundStrengths.length);
  }, [groundStrengths]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddHearing = useCallback(() => {
    if (!newHearing.date || !newHearing.purpose) return;
    const entry: HearingEntry = { id: `h${Date.now()}`, ...newHearing };
    setHearings((prev) =>
      [...prev, entry].sort((a, b) => a.date.localeCompare(b.date))
    );
    setNewHearing({ date: "", purpose: "", court: "", notes: "" });
    setAddingNew(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [newHearing]);

  const handleDelete = useCallback((id: string) => {
    setHearings((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const handleUpdateField = useCallback(
    (id: string, field: keyof HearingEntry, value: string) => {
      setHearings((prev) =>
        prev.map((h) => (h.id === id ? { ...h, [field]: value } : h))
      );
    },
    []
  );

  const OverallIcon = overallStrength >= 75 ? TrendingUp : overallStrength >= 50 ? Minus : TrendingDown;
  const overallColor =
    overallStrength >= 75 ? "text-emerald-700" : overallStrength >= 50 ? "text-amber-700" : "text-red-700";
  const overallBg =
    overallStrength >= 75
      ? "bg-emerald-50 border-emerald-300"
      : overallStrength >= 50
      ? "bg-amber-50 border-amber-300"
      : "bg-red-50 border-red-300";

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Hearing Tracker & Case Strength
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            सुनवाई काउंटडाउन एवं प्रकरण-सामर्थ्य मूल्यांकन — Month 6 Roadmap
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isDemoMode && (
            <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">
              SYNTHETIC / DEMO
            </Badge>
          )}
          {saved && (
            <Badge className="bg-emerald-600 text-white gap-1">
              <Save className="h-3 w-3" /> Saved
            </Badge>
          )}
        </div>
      </div>

      {/* ── Case context bar ─────────────────────────────────────────────── */}
      {selectedCase && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <Gavel className="h-4 w-4 text-primary" />
            {selectedCase.title.replace(/^\[DEMO\]\s*/, "")}
          </span>
          {selectedCase.caseNo && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              {selectedCase.caseNo}
            </span>
          )}
          {selectedCase.court && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Gavel className="h-3.5 w-3.5" />
              {selectedCase.court}
            </span>
          )}
        </div>
      )}

      {/* ── Top row: Countdown + Overall Strength ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hearing Countdown */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Next Hearing
          </h2>
          {nextHearing ? (
            <HearingCountdown
              nextHearingDate={nextHearing.date}
              court={nextHearing.court}
              purpose={nextHearing.purpose}
            />
          ) : (
            <Card className="border-dashed border-muted-foreground/30">
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No upcoming hearing scheduled.
                <br />
                Add one below.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Overall Strength */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Target className="h-4 w-4" /> Overall Case Strength
          </h2>
          <Card className={`border-2 ${overallBg}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={`rounded-full p-3 ${
                  overallStrength >= 75
                    ? "bg-emerald-100"
                    : overallStrength >= 50
                    ? "bg-amber-100"
                    : "bg-red-100"
                }`}
              >
                <OverallIcon className={`h-6 w-6 ${overallColor}`} />
              </div>
              <div>
                <p className={`text-3xl font-black ${overallColor}`}>{overallStrength}%</p>
                <p className={`text-sm font-semibold ${overallColor}`}>
                  {overallStrength >= 75
                    ? "Strong Defence Position"
                    : overallStrength >= 55
                    ? "Moderate — Pending Citations to Resolve"
                    : "Needs Work — Address Pending Citations"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {groundStrengths.length} defence grounds
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Probability Assessment Card (full) ───────────────────────────── */}
      {selectedCase && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> Citation-Based Probability Assessment
          </h2>
          <ProbabilityAssessmentCard caseRecord={selectedCase} />
        </div>
      )}

      {/* ── Ground-by-Ground Strength Breakdown ──────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" /> Ground-by-Ground Strength
          <span className="text-xs font-normal ml-1">
            (आधार-वार सामर्थ्य — Hemraj Vardar Case 01)
          </span>
        </h2>
        <div className="space-y-3">
          {groundStrengths.map((g) => (
            <Card key={g.ground} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {g.verdict === "strong" ? (
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    ) : g.verdict === "moderate" ? (
                      <ShieldAlert className="h-4 w-4 text-amber-500" />
                    ) : (
                      <ShieldX className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <span className="font-semibold text-sm">{g.ground}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {g.groundHi}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            g.verdict === "strong"
                              ? "bg-emerald-600 text-white"
                              : g.verdict === "moderate"
                              ? "bg-amber-500 text-white"
                              : "bg-red-500 text-white"
                          }
                        >
                          {g.score}%
                        </Badge>
                        {g.pendingCount > 0 && (
                          <Badge variant="outline" className="text-amber-700 border-amber-400 text-xs gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {g.pendingCount} pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          g.verdict === "strong"
                            ? "bg-emerald-500"
                            : g.verdict === "moderate"
                            ? "bg-amber-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${g.score}%` }}
                      />
                    </div>
                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      {g.citationCount > 0 && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {g.citationCount} citation(s)
                        </span>
                      )}
                      {g.standardsCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Info className="h-3 w-3 text-blue-500" />
                          {g.standardsCount} IS/ASTM standard(s)
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-foreground/70 bg-muted/40 rounded px-2 py-1 border-l-2 border-primary/30">
                      {g.keyNote}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Hearing Tracker Table ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> Hearing Schedule
            <span className="text-xs font-normal ml-1">(सुनवाई अनुसूची)</span>
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setAddingNew(true)}
          >
            <Plus className="h-3.5 w-3.5" /> Add Hearing
          </Button>
        </div>

        {/* Add New Hearing Form */}
        {addingNew && (
          <Card className="mb-4 border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Add Hearing Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={newHearing.date}
                    onChange={(e) =>
                      setNewHearing((p) => ({ ...p, date: e.target.value }))
                    }
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Purpose *
                  </label>
                  <Input
                    placeholder="e.g. Discharge Application Arguments"
                    value={newHearing.purpose}
                    onChange={(e) =>
                      setNewHearing((p) => ({ ...p, purpose: e.target.value }))
                    }
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Court
                  </label>
                  <Input
                    placeholder="e.g. Sessions Court, Udaipur"
                    value={newHearing.court}
                    onChange={(e) =>
                      setNewHearing((p) => ({ ...p, court: e.target.value }))
                    }
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Preparation Notes
                  </label>
                  <Input
                    placeholder="Documents to bring, reminders…"
                    value={newHearing.notes}
                    onChange={(e) =>
                      setNewHearing((p) => ({ ...p, notes: e.target.value }))
                    }
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5" onClick={handleAddHearing}>
                  <Save className="h-3.5 w-3.5" /> Save Hearing
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAddingNew(false);
                    setNewHearing({ date: "", purpose: "", court: "", notes: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hearing List */}
        {hearings.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No hearings scheduled yet. Click "Add Hearing" to begin.
          </div>
        ) : (
          <div className="space-y-3">
            {hearings
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((h) => {
                const urgency = getUrgency(h.date);
                const isEditing = editId === h.id;
                const d = parseISO(h.date);
                const formatted = isValid(d)
                  ? format(d, "dd MMM yyyy")
                  : h.date;
                const days = daysLabel(h.date);

                const urgencyBg = {
                  critical: "bg-red-50 border-red-200",
                  warning: "bg-amber-50 border-amber-200",
                  ok: "bg-white",
                  past: "bg-slate-50 border-slate-200 opacity-70",
                }[urgency];

                return (
                  <Card
                    key={h.id}
                    className={`border hover:shadow-md transition-shadow ${urgencyBg}`}
                  >
                    <CardContent className="p-4">
                      {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input
                            type="date"
                            value={h.date}
                            onChange={(e) =>
                              handleUpdateField(h.id, "date", e.target.value)
                            }
                            className="text-sm"
                          />
                          <Input
                            placeholder="Purpose"
                            value={h.purpose}
                            onChange={(e) =>
                              handleUpdateField(h.id, "purpose", e.target.value)
                            }
                            className="text-sm"
                          />
                          <Input
                            placeholder="Court"
                            value={h.court}
                            onChange={(e) =>
                              handleUpdateField(h.id, "court", e.target.value)
                            }
                            className="text-sm"
                          />
                          <Input
                            placeholder="Notes"
                            value={h.notes}
                            onChange={(e) =>
                              handleUpdateField(h.id, "notes", e.target.value)
                            }
                            className="text-sm"
                          />
                          <div className="sm:col-span-2 flex gap-2">
                            <Button
                              size="sm"
                              className="gap-1.5"
                              onClick={() => {
                                setEditId(null);
                                setSaved(true);
                                setTimeout(() => setSaved(false), 2000);
                              }}
                            >
                              <Save className="h-3.5 w-3.5" /> Done
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">
                                {h.purpose}
                              </span>
                              {urgency === "critical" && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  URGENT — {days}
                                </Badge>
                              )}
                              {urgency === "warning" && (
                                <Badge className="bg-amber-500 text-white text-xs">
                                  {days}
                                </Badge>
                              )}
                              {urgency === "ok" && (
                                <Badge
                                  variant="outline"
                                  className="text-emerald-700 border-emerald-400 text-xs"
                                >
                                  {days}
                                </Badge>
                              )}
                              {urgency === "past" && (
                                <Badge
                                  variant="outline"
                                  className="text-slate-500 text-xs"
                                >
                                  {days}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatted}
                              </span>
                              {h.court && (
                                <span className="flex items-center gap-1">
                                  <Gavel className="h-3 w-3" />
                                  {h.court}
                                </span>
                              )}
                            </div>
                            {h.notes && (
                              <p className="mt-2 text-xs text-foreground/70 bg-muted/40 rounded px-2 py-1 border-l-2 border-primary/30">
                                📝 {h.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => setEditId(h.id)}
                              title="Edit"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                              onClick={() => handleDelete(h.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>

      {/* ── Disclaimer ────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <div>
          <strong>Technical indicator only — not a legal opinion.</strong> Case strength scores are
          computed from citation verification status, fact-fit scores, and evidence completeness.
          They do not predict judicial outcomes. Hearing dates are stored locally in your browser
          and do not sync with eCourts India.{" "}
          <em>
            Month 1 upgrade: migrate to PostgreSQL via Drizzle ORM for persistent cross-device
            storage.
          </em>
        </div>
      </div>
    </div>
  );
}
