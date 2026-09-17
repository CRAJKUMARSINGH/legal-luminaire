/**
 * HearingCountdown — Month 6
 * ─────────────────────────────────────────────────────────────────────────────
 * Shows a countdown to the next hearing date with urgency colour-coding.
 * Displayed on the case dashboard.
 *
 * Props:
 *   nextHearingDate — ISO date string e.g. "2026-10-15"
 *   court           — Court name
 *   purpose         — Hearing purpose e.g. "Charge framing"
 */
import { useMemo } from "react";
import { differenceInCalendarDays, format, parseISO, isValid } from "date-fns";
import { Calendar, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface HearingCountdownProps {
  nextHearingDate?: string;
  court?: string;
  purpose?: string;
  compact?: boolean;
}

export function HearingCountdown({
  nextHearingDate,
  court,
  purpose,
  compact = false,
}: HearingCountdownProps) {
  const { daysLeft, label, urgency, formattedDate } = useMemo(() => {
    if (!nextHearingDate) {
      return { daysLeft: null, label: "No hearing scheduled", urgency: "none" as const, formattedDate: "" };
    }
    const d = parseISO(nextHearingDate);
    if (!isValid(d)) {
      return { daysLeft: null, label: "Invalid date", urgency: "none" as const, formattedDate: "" };
    }
    const days = differenceInCalendarDays(d, new Date());
    const formatted = format(d, "dd MMM yyyy");
    if (days < 0)  return { daysLeft: days, label: `Passed ${Math.abs(days)} day(s) ago`, urgency: "past" as const, formattedDate: formatted };
    if (days === 0) return { daysLeft: 0,   label: "TODAY",                                urgency: "today" as const, formattedDate: formatted };
    if (days <= 3)  return { daysLeft: days, label: `${days} day(s) remaining`,             urgency: "critical" as const, formattedDate: formatted };
    if (days <= 7)  return { daysLeft: days, label: `${days} days remaining`,               urgency: "warning" as const, formattedDate: formatted };
    return           { daysLeft: days,       label: `${days} days remaining`,               urgency: "ok" as const, formattedDate: formatted };
  }, [nextHearingDate]);

  const colorMap = {
    none:     "text-muted-foreground",
    past:     "text-slate-500",
    today:    "text-red-700 font-bold animate-pulse",
    critical: "text-red-600 font-semibold",
    warning:  "text-amber-600 font-semibold",
    ok:       "text-emerald-600",
  };

  const bgMap = {
    none:     "bg-muted/30",
    past:     "bg-slate-50 border-slate-200",
    today:    "bg-red-50 border-red-400 border-2",
    critical: "bg-red-50 border-red-300",
    warning:  "bg-amber-50 border-amber-300",
    ok:       "bg-emerald-50 border-emerald-200",
  };

  const IconMap = {
    none:     Calendar,
    past:     CheckCircle2,
    today:    AlertTriangle,
    critical: AlertTriangle,
    warning:  Clock,
    ok:       Calendar,
  };

  const Icon = IconMap[urgency];

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 text-xs rounded-md px-2 py-1 border ${bgMap[urgency]}`}>
        <Icon className={`h-3 w-3 ${colorMap[urgency]}`} />
        <span className={colorMap[urgency]}>
          {formattedDate ? `${formattedDate} · ` : ""}{label}
        </span>
      </div>
    );
  }

  return (
    <Card className={`border ${bgMap[urgency]}`}>
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`mt-0.5 rounded-full p-2 ${urgency === "today" || urgency === "critical" ? "bg-red-100" : urgency === "warning" ? "bg-amber-100" : "bg-emerald-50"}`}>
          <Icon className={`h-4 w-4 ${colorMap[urgency]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">Next Hearing</span>
            {urgency === "today" && <Badge className="bg-red-600 text-white animate-pulse">TODAY</Badge>}
            {urgency === "critical" && <Badge className="bg-red-500 text-white">URGENT</Badge>}
            {urgency === "warning" && <Badge className="bg-amber-500 text-white">THIS WEEK</Badge>}
          </div>
          {formattedDate && (
            <p className={`text-base font-bold mt-0.5 ${colorMap[urgency]}`}>
              {formattedDate}
            </p>
          )}
          <p className={`text-xs mt-0.5 ${colorMap[urgency]}`}>{label}</p>
          {court && <p className="text-xs text-muted-foreground mt-1">📍 {court}</p>}
          {purpose && <p className="text-xs text-muted-foreground">⚖ {purpose}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
