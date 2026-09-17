/**
 * Draft Multiplication client — document-family (derivative drafts) API + registry types.
 * Additive: does not touch existing draft generation paths.
 */
import type { Authority } from "@/data/citations";

export interface DerivativeTypeInfo {
  id: string;
  label: string;
  hindi_label: string;
  parent_relation: string;
  when_filed: string;
  prayer_focus: string;
  jurisdiction_notes: string;
  terminology: Record<string, string>;
}

export interface SubjectInfo {
  id: string;
  label: string;
  applicable_types: string[];
}

export interface DraftFamilyRecord {
  id: string;
  title: string;
  draft_type: string; // "BRIEF" | "DISCHARGE" | "BAIL_439" | derivative type id
  subject_id?: string;
  content: string;
  generated_at: string;
  review_status: string;
  lineage?: {
    derivative_type_id: string;
    derivative_type_label: string;
    subject_id: string;
    parent_draft_id?: string | null;
    authority_ids: string[];
    citations_extracted: string[];
  };
}

const API_BASE = "http://localhost:8000/api/v1";

export async function fetchDerivativeTypes(subjectId?: string): Promise<DerivativeTypeInfo[]> {
  const url = subjectId
    ? `${API_BASE}/derivative-types?subject_id=${encodeURIComponent(subjectId)}`
    : `${API_BASE}/derivative-types`;
  const res = await fetch(url);
  const data = await res.json();
  return data.types ?? [];
}

export async function fetchSubjects(): Promise<SubjectInfo[]> {
  const res = await fetch(`${API_BASE}/subjects`);
  const data = await res.json();
  return data.subjects ?? [];
}

export async function fetchDraftFamily(caseId: string): Promise<DraftFamilyRecord[]> {
  const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/draft-family`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.family ?? [];
}

export interface DerivativeDraftRequest {
  subject_id: string;
  derivative_type_id: string;
  parent_draft_id?: string | null;
  authority_blocks: Authority[];
  additional_notes?: string;
}

export interface DerivativeDraftResult {
  success: boolean;
  draft_id?: string;
  draft_content: string;
  citations_extracted: string[];
  error?: string;
}

export async function generateDerivativeDraft(
  caseId: string,
  req: DerivativeDraftRequest
): Promise<DerivativeDraftResult> {
  const res = await fetch(
    `${API_BASE}/cases/${encodeURIComponent(caseId)}/derivative-drafts`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    }
  );
  return res.json();
}
