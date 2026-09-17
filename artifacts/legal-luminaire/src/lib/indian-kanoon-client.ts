/**
 * Indian Kanoon API Client — Month 2
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps the free Indian Kanoon search API to provide live citation verification.
 * Upgrades PENDING/SECONDARY/VERIFIED labels from manual to API-backed checks.
 *
 * API docs: https://api.indiankanoon.org/
 * Free endpoint: GET https://api.indiankanoon.org/search/?formInput=CASE_NAME&pagenum=0
 *
 * Usage:
 *   const result = await indianKanoonClient.verifyCitation("Kattavellai", "2025 INSC 845");
 *   // result.tier = "VERIFIED" | "SECONDARY" | "PENDING"
 *   // result.found = true/false
 *   // result.headnote = "..." (first hit headnote, if found)
 */

import { API_BASE } from "@/lib/api-client";

export type IKVerificationTier = "VERIFIED" | "SECONDARY" | "PENDING";

export interface IKSearchHit {
  tid: number;
  title: string;
  docsource: string;
  publishdate: string;
  headline: string;
}

export interface IKSearchResponse {
  docs: IKSearchHit[];
  total: number;
}

export interface CitationVerificationResult {
  /** Raw citation string that was checked */
  rawCitation: string;
  /** Whether at least one result was found on Indian Kanoon */
  found: boolean;
  /** Derived verification tier based on match quality */
  tier: IKVerificationTier;
  /** First matching document title */
  matchedTitle?: string;
  /** Publish date of first hit */
  publishDate?: string;
  /** Direct Indian Kanoon document URL */
  documentUrl?: string;
  /** Headnote excerpt from first hit */
  headnote?: string;
  /** Error message if lookup failed */
  error?: string;
  /** Whether result came from backend proxy (true) or cache (false) */
  fromApi: boolean;
}

// ── In-memory cache (session-scoped) ─────────────────────────────────────────
const _cache = new Map<string, CitationVerificationResult>();

function cacheKey(caseName: string, citation: string): string {
  return `${caseName.toLowerCase().trim()}||${citation.toLowerCase().trim()}`;
}

// ── Main client ───────────────────────────────────────────────────────────────

export const indianKanoonClient = {
  /**
   * Verify a citation via the backend proxy.
   * The backend calls Indian Kanoon and returns the result.
   * Falls back to SECONDARY tier if the API is unavailable.
   */
  async verifyCitation(
    caseName: string,
    citation = "",
    forceRefresh = false,
  ): Promise<CitationVerificationResult> {
    const key = cacheKey(caseName, citation);
    if (!forceRefresh && _cache.has(key)) {
      return _cache.get(key)!;
    }

    try {
      const params = new URLSearchParams({ case_name: caseName, citation });
      const res = await fetch(`${API_BASE}/verify-citation?${params.toString()}`);

      if (!res.ok) {
        const fallback: CitationVerificationResult = {
          rawCitation: citation || caseName,
          found: false,
          tier: "SECONDARY",
          error: `Backend returned ${res.status}`,
          fromApi: true,
        };
        _cache.set(key, fallback);
        return fallback;
      }

      const data = await res.json();
      const result = mapBackendResponse(caseName, citation, data);
      _cache.set(key, result);
      return result;
    } catch (err) {
      const fallback: CitationVerificationResult = {
        rawCitation: citation || caseName,
        found: false,
        tier: "SECONDARY",
        error: err instanceof Error ? err.message : "Network error",
        fromApi: false,
      };
      _cache.set(key, fallback);
      return fallback;
    }
  },

  /**
   * Direct Indian Kanoon search URL (opens in browser tab).
   * Use this when API verification is not needed.
   */
  searchUrl(query: string): string {
    return `https://indiankanoon.org/search/?formInput=${encodeURIComponent(query)}`;
  },

  /**
   * Batch verify multiple citations concurrently.
   * Returns a Map of rawCitation → result.
   */
  async batchVerify(
    entries: Array<{ caseName: string; citation: string }>,
  ): Promise<Map<string, CitationVerificationResult>> {
    const results = await Promise.allSettled(
      entries.map((e) => this.verifyCitation(e.caseName, e.citation)),
    );
    const map = new Map<string, CitationVerificationResult>();
    results.forEach((r, i) => {
      const key = `${entries[i].caseName}||${entries[i].citation}`;
      if (r.status === "fulfilled") {
        map.set(key, r.value);
      } else {
        map.set(key, {
          rawCitation: entries[i].citation,
          found: false,
          tier: "SECONDARY",
          error: "Batch lookup failed",
          fromApi: false,
        });
      }
    });
    return map;
  },

  /** Clear the session cache (e.g. after manual re-verification). */
  clearCache(): void {
    _cache.clear();
  },
};

// ── Map backend response to CitationVerificationResult ───────────────────────

function mapBackendResponse(
  caseName: string,
  citation: string,
  data: {
    found_on_indian_kanoon?: boolean;
    confidence?: "HIGH" | "LOW";
    indian_kanoon_result?: string;
    error?: string;
  },
): CitationVerificationResult {
  const found = Boolean(data.found_on_indian_kanoon);
  const highConfidence = data.confidence === "HIGH";

  let tier: IKVerificationTier;
  if (found && highConfidence) {
    tier = "VERIFIED";
  } else if (found && !highConfidence) {
    tier = "SECONDARY";
  } else {
    tier = "PENDING";
  }

  return {
    rawCitation: citation || caseName,
    found,
    tier,
    headnote: data.indian_kanoon_result ?? undefined,
    error: data.error,
    fromApi: true,
    documentUrl: found
      ? `https://indiankanoon.org/search/?formInput=${encodeURIComponent(caseName)}`
      : undefined,
  };
}
