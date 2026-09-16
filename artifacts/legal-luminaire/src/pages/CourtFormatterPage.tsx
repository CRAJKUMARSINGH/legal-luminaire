/**
 * CourtFormatterPage — Month 5 Roadmap
 * ─────────────────────────────────────────────────────────────────────────────
 * Court-specific formatting engine wired to a working UI.
 * User selects a court → fills in petitioner/respondent details →
 * gets a ready-to-copy caption, cause title, and prayer opener.
 *
 * Supported courts:
 *   Rajasthan HC · Supreme Court · Sessions Court · NCLT · NGT · CAT · District Civil
 *
 * Route: /court-formatter  and  /case/:id/court-formatter  (added to routes.tsx)
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Gavel, Copy, Eye, EyeOff, Scale, Info,
  MapPin, CheckCircle2, ChevronDown, ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  formatCourtCaption,
  COURT_STYLE_LABELS,
  type CourtStyle,
  type CourtFormatInput,
} from "@/lib/court-formatter";
import { useCaseContext } from "@/context/CaseContext";

// ── Court style options (display order) ──────────────────────────────────────
const COURT_STYLES: CourtStyle[] = [
  "rajasthan_hc",
  "supreme_court",
  "sessions",
  "district_civil",
  "nclt",
  "ngt",
  "cat",
];

const COURT_ICONS: Record<CourtStyle, string> = {
  rajasthan_hc:   "🏛",
  supreme_court:  "⚖",
  sessions:       "🔨",
  district_civil: "📋",
  nclt:           "🏢",
  ngt:            "🌿",
  cat:            "⚙",
};

const CASE_TYPES: string[] = [
  "Criminal Misc. Petition",
  "Discharge Application",
  "Writ Petition (Criminal)",
  "Writ Petition (Civil)",
  "Bail Application",
  "Anticipatory Bail Application",
  "Criminal Appeal",
  "Civil Appeal",
  "Revision Petition",
  "Company Petition",
  "Application under Section 482 CrPC",
  "Application (Article 226/227)",
  "Original Application (OA)",
  "Transfer Application",
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function CourtFormatterPage() {
  const { selectedCase, isDemoMode } = useCaseContext();
  const { toast } = useToast();

  // ── Form state ────────────────────────────────────────────────────────────
  const [courtStyle, setCourtStyle] = useState<CourtStyle>("rajasthan_hc");
  const [caseType, setCaseType] = useState("Criminal Misc. Petition");
  const [caseYear, setCaseYear] = useState(new Date().getFullYear().toString());
  const [caseNumber, setCaseNumber] = useState("");
  const [petitionerName, setPetitionerName] = useState(
    selectedCase ? "Hemraj Vardar" : ""
  );
  const [petitionerDesig, setPetitionerDesig] = useState(
    selectedCase ? "Director, M/s Praman Construction Pvt. Ltd., Udaipur" : ""
  );
  const [respondentName, setRespondentName] = useState("State of Rajasthan");
  const [respondentDesig, setRespondentDesig] = useState("");
  const [courtLocation, setCourtLocation] = useState("");
  const [bench, setBench] = useState("");
  const [actSection, setActSection] = useState("Section 482 CrPC / Article 226 & 227 of the Constitution of India");

  // ── Preview state ─────────────────────────────────────────────────────────
  const [showCaption, setShowCaption] = useState(true);
  const [showPrayer, setShowPrayer] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  // ── Generate formatted block ──────────────────────────────────────────────
  const formatted = useMemo(() => {
    if (!petitionerName || !respondentName) return null;
    const input: CourtFormatInput = {
      courtStyle,
      caseType,
      caseYear,
      caseNumber: caseNumber || undefined,
      petitionerName,
      petitionerDesignation: petitionerDesig || undefined,
      respondentName,
      respondentDesignation: respondentDesig || undefined,
      courtLocation: courtLocation || undefined,
      bench: bench || undefined,
      actSection: actSection || undefined,
    };
    try {
      return formatCourtCaption(input);
    } catch {
      return null;
    }
  }, [courtStyle, caseType, caseYear, caseNumber, petitionerName, petitionerDesig,
      respondentName, respondentDesig, courtLocation, bench, actSection]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied!`, description: "Paste directly into your pleading document." });
    } catch {
      toast({ title: "Copy failed", description: "Use Ctrl+A, Ctrl+C in the preview box.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Court-Specific Formatter
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            न्यायालय-विशिष्ट प्रारूपण — Auto-formats captions, cause titles, and prayer openers per court style
          </p>
        </div>
        {isDemoMode && (
          <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">DEMO</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Input Panel ──────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Court selector */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Select Court
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {COURT_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setCourtStyle(style)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium text-left transition-colors ${
                      courtStyle === style
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/20 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{COURT_ICONS[style]}</span>
                    {COURT_STYLE_LABELS[style]}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Case details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Case Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium">Case Type</label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                >
                  {CASE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Year</label>
                  <Input className="mt-1 text-sm" value={caseYear} onChange={(e) => setCaseYear(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Case No. (if assigned)</label>
                  <Input className="mt-1 text-sm" placeholder="Leave blank if not yet filed" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Act / Section Reference</label>
                <Input className="mt-1 text-sm" value={actSection} onChange={(e) => setActSection(e.target.value)} />
              </div>
              {(courtStyle === "sessions" || courtStyle === "district_civil") && (
                <div>
                  <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Court Location
                  </label>
                  <Input className="mt-1 text-sm" placeholder="e.g. Udaipur / Jaipur" value={courtLocation} onChange={(e) => setCourtLocation(e.target.value)} />
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground font-medium">Bench (optional)</label>
                <Input className="mt-1 text-sm" placeholder="e.g. Justice X + Justice Y" value={bench} onChange={(e) => setBench(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* Parties */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium">Petitioner / Applicant Name *</label>
                <Input className="mt-1 text-sm" placeholder="Full name" value={petitionerName} onChange={(e) => setPetitionerName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Petitioner Designation / Address</label>
                <Input className="mt-1 text-sm" placeholder="e.g. Director, M/s XYZ Pvt. Ltd." value={petitionerDesig} onChange={(e) => setPetitionerDesig(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Respondent Name *</label>
                <Input className="mt-1 text-sm" placeholder="e.g. State of Rajasthan" value={respondentName} onChange={(e) => setRespondentName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Respondent Designation / Address</label>
                <Input className="mt-1 text-sm" placeholder="Through Secretary, Home Department" value={respondentDesig} onChange={(e) => setRespondentDesig(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Output Panel ────────────────────────────────────────── */}
        <div className="space-y-4">
          {!formatted ? (
            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              <Scale className="h-10 w-10 mx-auto mb-3 opacity-30" />
              Enter petitioner and respondent names to generate the caption.
            </div>
          ) : (
            <>
              {/* Full Caption */}
              <OutputBlock
                title="Full Caption"
                titleHi="सम्पूर्ण शीर्षक"
                content={formatted.fullCaption}
                open={showCaption}
                onToggle={() => setShowCaption((x) => !x)}
                onCopy={() => handleCopy(formatted.fullCaption, "Caption")}
              />

              {/* Prayer Opener */}
              <OutputBlock
                title="Prayer Opener"
                titleHi="प्रार्थना प्रारम्भ"
                content={formatted.prayerOpener}
                open={showPrayer}
                onToggle={() => setShowPrayer((x) => !x)}
                onCopy={() => handleCopy(formatted.prayerOpener, "Prayer Opener")}
              />

              {/* Verification Clause */}
              <OutputBlock
                title="Verification Clause"
                titleHi="सत्यापन खण्ड"
                content={formatted.verificationClause}
                open={showVerification}
                onToggle={() => setShowVerification((x) => !x)}
                onCopy={() => handleCopy(formatted.verificationClause, "Verification Clause")}
              />

              {/* Quick summary */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-xs font-medium">
                      {COURT_ICONS[courtStyle]} {COURT_STYLE_LABELS[courtStyle]}
                    </span>
                    <Badge variant="outline" className="text-xs">{caseType}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Court heading, cause title, prayer opener, and verification clause
                    formatted to <strong>{COURT_STYLE_LABELS[courtStyle]}</strong> conventions.
                    Replace bracketed placeholders [N], [CITY], [DATE] before filing.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <div>
          Formats are based on standard practice for each court as of 2024–2026.
          Always verify the current court's filing rules, cause-list requirements, and caption format
          with the court registry before submission. Replace all bracketed placeholders.
        </div>
      </div>
    </div>
  );
}

// ── Output block sub-component ────────────────────────────────────────────────
function OutputBlock({
  title, titleHi, content, open, onToggle, onCopy,
}: {
  title: string; titleHi: string; content: string;
  open: boolean; onToggle: () => void; onCopy: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 text-sm font-semibold text-left hover:text-primary transition-colors"
          >
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {title}
            <span className="text-xs font-normal text-muted-foreground">{titleHi}</span>
          </button>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={onCopy}>
            <Copy className="h-3 w-3" /> Copy
          </Button>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="pt-3">
          <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/40 rounded p-3 border max-h-64 overflow-y-auto leading-relaxed">
            {content}
          </pre>
        </CardContent>
      )}
    </Card>
  );
}
