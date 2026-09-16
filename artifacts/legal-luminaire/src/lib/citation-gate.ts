/**
 * CITATION GATE — Legal Luminaire
 * ─────────────────────────────────────────────────────────────────────────────
 * Scans free-text draft content for case law citations and checks each one
 * against the verification engine registry.
 *
 * Three outcomes per detected citation:
 *   SAFE     — COURT_SAFE or VERIFIED, not blockedFromDraft
 *   WARN     — SECONDARY tier (usable with qualification note)
 *   BLOCKED  — PENDING or FATAL_ERROR, or blockedFromDraft: true
 *
 * The gate HARD-BLOCKS finalization if any BLOCKED citation is present.
 * It SOFT-WARNS if any SECONDARY citation is present.
 */

import {
  PRECEDENT_ACCURACY,
  type PrecedentAccuracy,
  type AccuracyTier,
} from "./verification-engine";

export type GateStatus = "SAFE" | "WARN" | "BLOCKED";

export type CitationMatch = {
  /** The raw text fragment that triggered the match */
  rawMatch: string;
  /** Matched registry entry, if found */
  registryEntry: PrecedentAccuracy | null;
  /** Resolved gate status */
  status: GateStatus;
  /** Human-readable reason shown in the UI */
  reason: string;
  /** Optional status note for additional context in the UI */
  statusNote?: string;
  /** Tier from registry, or null if unrecognised */
  tier: AccuracyTier | "UNRECOGNISED" | null;
  /** Whether this citation is hard-blocked from filing */
  blockedFromDraft: boolean;
};

export type GateResult = {
  /** Highest severity across all matches */
  overallStatus: GateStatus;
  /** All detected citations with their verdicts */
  matches: CitationMatch[];
  /** True if finalization must be prevented */
  hardBlock: boolean;
  /** Summary message for the UI */
  summary: string;
};

// ─── DETECTION PATTERNS ──────────────────────────────────────────────────────
// Ordered from most specific to least specific.
// Each pattern is tested against the full draft text (case-insensitive).

const CITATION_PATTERNS: RegExp[] = [
  // SCC / INSC / SCC OnLine patterns
  /\(\d{4}\)\s*\d+\s*SCC\s*\d+/gi,
  /\d{4}\s*INSC\s*\d+/gi,
  /\d{4}\s*SCC\s*OnLine\s*\w+\s*\d+/gi,
  // GLR / regional reporters
  /\(\d{4}\)\s*\d+\s*GLR\s*\d+/gi,
  // "v." case name patterns — catches "X v. Y" or "X vs Y"
  /[A-Z][a-zA-Z\s\.]+\s+v(?:s)?\.?\s+[A-Z][a-zA-Z\s\.]+/g,
  // IS / ASTM / BS standards
  /IS\s*\d+(?::\d+)?(?:\s*\(Part\s*\d+\))?/gi,
  /ASTM\s+[A-Z]\d+/gi,
  /BS\s*\d+/gi,
  // Section references to ICA / IPC / BNSS / CrPC
  /[Ss]ection\s+\d+\s+(?:of\s+)?(?:Indian Contract Act|ICA|IPC|BNSS|CrPC|BSA)/gi,
  /[Ss]\.?\s*\d+\s+(?:ICA|IPC|BNSS|CrPC)/gi,
];

// ─── REGISTRY LOOKUP ─────────────────────────────────────────────────────────

/**
 * Tries to match a raw citation string against the PRECEDENT_ACCURACY registry.
 * Uses a fuzzy approach: checks if any significant token from the raw string
 * appears in the registry entry's name or citation field.
 */
function lookupRegistry(raw: string): PrecedentAccuracy | null {
  const normalised = raw.toLowerCase().replace(/\s+/g, " ").trim();

  // Extract tokens of length >= 4 (skip noise words)
  const tokens = normalised
    .split(/[\s,\.\(\)\/\|]+/)
    .filter((t) => t.length >= 4 && !["with", "from", "that", "this", "under"].includes(t));

  let bestMatch: PrecedentAccuracy | null = null;
  let bestScore = 0;

  for (const entry of PRECEDENT_ACCURACY) {
    const haystack = `${entry.name} ${entry.citation}`.toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Require at least 2 matching tokens to avoid false positives
  return bestScore >= 2 ? bestMatch : null;
}

// ─── TIER → STATUS MAPPING ───────────────────────────────────────────────────

function tierToStatus(
  tier: AccuracyTier,
  blockedFromDraft: boolean
): GateStatus {
  if (blockedFromDraft) return "BLOCKED";
  switch (tier) {
    case "COURT_SAFE":
    case "VERIFIED":
      return "SAFE";
    case "SECONDARY":
      return "WARN";
    case "PENDING":
    case "FATAL_ERROR":
      return "BLOCKED";
  }
}

function buildReason(
  entry: PrecedentAccuracy | null,
  raw: string,
  status: GateStatus
): string {
  if (!entry) {
    return `"${raw.slice(0, 60)}" — not found in verification registry. Verify before filing.`;
  }
  if (status === "BLOCKED") {
    return `${entry.name} [${entry.tier}] — BLOCKED. ${entry.verificationNote}`;
  }
  if (status === "WARN") {
    return `${entry.name} [SECONDARY] — usable with qualification. ${entry.verificationNote}`;
  }
  return `${entry.name} [${entry.tier}] — verified, safe to use.`;
}

// ─── MAIN GATE FUNCTION ───────────────────────────────────────────────────────

/**
 * Scan draft text and return a GateResult.
 * Call this on every content change (debounced) and before any save/finalize.
 */
export function scanDraftForCitations(text: string): GateResult {
  if (!text || text.trim().length === 0) {
    return {
      overallStatus: "SAFE",
      matches: [],
      hardBlock: false,
      summary: "No citations detected.",
    };
  }

  const seen = new Set<string>();
  const matches: CitationMatch[] = [];

  for (const pattern of CITATION_PATTERNS) {
    const hits = text.match(pattern) ?? [];
    for (const raw of hits) {
      const key = raw.toLowerCase().trim();
      if (seen.has(key)) continue;
      seen.add(key);

      const entry = lookupRegistry(raw);

      let status: GateStatus;
      let tier: AccuracyTier | "UNRECOGNISED" | null;
      let blockedFromDraft: boolean;

      if (entry) {
        status = tierToStatus(entry.tier, entry.blockedFromDraft);
        tier = entry.tier;
        blockedFromDraft = entry.blockedFromDraft;
      } else {
        // Unrecognised citation — treat as WARN (not hard-blocked, but flagged)
        status = "WARN";
        tier = "UNRECOGNISED";
        blockedFromDraft = false;
      }

      matches.push({
        rawMatch: raw,
        registryEntry: entry,
        status,
        reason: buildReason(entry, raw, status),
        tier,
        blockedFromDraft,
      });
    }
  }

  // Deduplicate by registry entry id (keep highest severity)
  const deduped = deduplicateMatches(matches);

  const hardBlock = deduped.some((m) => m.status === "BLOCKED");
  const hasWarn = deduped.some((m) => m.status === "WARN");

  const overallStatus: GateStatus = hardBlock
    ? "BLOCKED"
    : hasWarn
    ? "WARN"
    : "SAFE";

  const blockedCount = deduped.filter((m) => m.status === "BLOCKED").length;
  const warnCount = deduped.filter((m) => m.status === "WARN").length;
  const safeCount = deduped.filter((m) => m.status === "SAFE").length;

  let summary: string;
  if (hardBlock) {
    summary = `⛔ ${blockedCount} BLOCKED citation(s) detected — finalization prevented. Verify and remove before filing.`;
  } else if (hasWarn) {
    summary = `⚠ ${warnCount} SECONDARY citation(s) need qualification. ${safeCount} safe.`;
  } else if (deduped.length === 0) {
    summary = "No citations detected.";
  } else {
    summary = `✓ All ${safeCount} detected citation(s) are verified.`;
  }

  return { overallStatus, matches: deduped, hardBlock, summary };
}

function deduplicateMatches(matches: CitationMatch[]): CitationMatch[] {
  const byId = new Map<string, CitationMatch>();
  for (const m of matches) {
    const key = m.registryEntry?.id ?? m.rawMatch.toLowerCase().trim();
    const existing = byId.get(key);
    if (!existing) {
      byId.set(key, m);
    } else {
      // Keep highest severity
      const rank = { BLOCKED: 2, WARN: 1, SAFE: 0 };
      if (rank[m.status] > rank[existing.status]) {
        byId.set(key, m);
      }
    }
  }
  return Array.from(byId.values());
}
