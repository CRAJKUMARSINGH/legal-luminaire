/**
 * Client for FastAPI's free-text legal citation search.
 * All requests use the canonical /api/v1 API boundary.
 */
import { apiFetch } from "./api-client";

export type SearchKind = "precedent" | "statute" | "standard";

export interface LegalSearchHit {
  kind: SearchKind;
  id: string;
  name: string;
  citation: string;
  court?: string;
  date?: string;
  holding: string;
  application: string;
  incident?: string;
  tags: string[];
  priority: "binding" | "persuasive" | "secondary";
  sourceUrl: string;
  score: number;
  matchedTerms: string[];
  matchedFields: string[];
}

export interface LegalSearchResponse {
  query: string;
  tokens: string[];
  total: number;
  precedents: LegalSearchHit[];
  statutes: LegalSearchHit[];
  standards: LegalSearchHit[];
  summary: string;
}

export interface LegalCorpusStats {
  totalItems: number;
  breakdown: Record<string, number>;
}

export async function searchLegalCorpus(
  query: string,
  options: { limit?: number; kind?: "all" | SearchKind } = {},
): Promise<LegalSearchResponse> {
  const params = new URLSearchParams({ q: query });
  if (options.limit) params.set("limit", String(options.limit));
  if (options.kind) params.set("kind", options.kind);

  return apiFetch<LegalSearchResponse>(`/legal-search?${params.toString()}`);
}

export async function getCorpusStats(): Promise<LegalCorpusStats> {
  return apiFetch<LegalCorpusStats>("/legal-search/corpus-stats");
}
