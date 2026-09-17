/**
 * Draft Multiplication client — document-family (derivative drafts) API + registry types.
 *
 * Additive: does not touch existing draft generation paths.
 * Mirrors the style of api-client.ts and verification-engine.ts.
 *
 * Endpoints covered:
 *   GET  /derivative/health
 *   GET  /derivative/registry          (full 50 subjects + 12 types)
 *   GET  /derivative/subject/:id/types (types whitelisted for one subject)
 *   POST /case/:id/derivative/generate
 *   POST /case/:id/derivative/family
 *   GET  /case/:id/derivative/family
 */

import { apiFetch } from "@/lib/api-client";

// ─── Registry types ───────────────────────────────────────────────────────────

export type DerivativeTypeId =
  | "rejoinder"
  | "counter_claim"
  | "written_submissions"
  | "supplementary_affidavit"
  | "evidence_application"
  | "cross_exam_questions"
  | "objection_docs"
  | "appeal_memorial"
  | "stay_application"
  | "compliance_affidavit"
  | "review_petition"
  | "execution_petition";

export interface DerivativeTypeInfo {
  id: DerivativeTypeId | string;
  label_en: string;
  label_hi: string;
  parent_anchor: string;
  stage_hint: string;
  typical_delay_days: number;
}

export interface DerivativeSubjectInfo {
  id: string;
  label: string;
  applicable_types: string[];
}

export interface DerivativeRegistryResponse {
  success: boolean;
  registry_version: string;
  registry_description: string;
  last_updated: string;
  subjects_count: number;
  derivative_types_count: number;
  subjects: DerivativeSubjectInfo[];
  derivative_types: DerivativeTypeInfo[];
  disclaimer: string;
  error?: string | null;
}

export interface DerivativeAvailableTypesResponse {
  success: boolean;
  subject?: { id: string; label: string } | null;
  available_types: DerivativeTypeInfo[];
  registry_version: string;
  error?: string | null;
}

export interface DerivativeHealthResponse {
  feature: "derivative_drafts";
  enabled: boolean;
  registry_version: string;
  subjects_count: number;
  derivative_types_count: number;
  endpoints: string[];
  write_endpoints_require_flag: string;
  disclaimer: string;
}

// ─── Lineage & response types ────────────────────────────────────────────────

export interface DerivativeAnchor {
  anchor_id: string;
  anchor_ref: string;
  anchor_summary: string;
  page_refs: string;
  transform_strategy: string;
}

export interface DerivativeLineage {
  generated_at: string;
  case_id: string;
  parent: { draft_id: string; type: string };
  derivative: {
    type_id: string;
    type_label_en: string;
    type_label_hi: string;
  };
  subject: { id: string; label: string };
  anchors: DerivativeAnchor[];
  is_synthetic: boolean;
}

export interface DerivativeGenerateResponse {
  success: boolean;
  case_id: string;
  subject_id: string;
  derivative_type_id: string;
  draft_content: string;
  lineage: DerivativeLineage | null;
  pairing_valid: boolean;
  is_synthetic: boolean;
  disclaimer: string;
  error?: string | null;
}

export interface DerivativeFamilyResponse {
  success: boolean;
  case_id: string;
  subject_id: string;
  parent_draft_id: string;
  generated_at: string;
  total_types: number;
  success_count: number;
  failed_types: string[];
  family: Record<string, DerivativeGenerateResponse>;
  is_synthetic: boolean;
  disclaimer: string;
  error?: string | null;
}

// ─── Request body types ───────────────────────────────────────────────────────

export interface DerivativeGenerateRequest {
  case_id: string;
  parent_draft_id: string;
  parent_type?: string;
  parent_draft_text: string;
  subject_id: string;
  derivative_type_id: string;
  use_llm?: boolean;
}

export interface DerivativeFamilyRequest {
  case_id: string;
  parent_draft_id: string;
  parent_type?: string;
  parent_draft_text: string;
  subject_id: string;
  use_llm?: boolean;
}

// ─── Public client ────────────────────────────────────────────────────────────

export const draftFamilyClient = {
  // ── Health & registry (read-only, always available) ────────────────────

  health(): Promise<DerivativeHealthResponse> {
    return apiFetch("/derivative/health");
  },

  getRegistry(): Promise<DerivativeRegistryResponse> {
    return apiFetch("/derivative/registry");
  },

  getSubjects(): Promise<DerivativeRegistryResponse> {
    return apiFetch("/derivative/subjects");
  },

  getDerivativeTypes(): Promise<DerivativeRegistryResponse> {
    return apiFetch("/derivative/types");
  },

  getAvailableTypes(subjectId: string): Promise<DerivativeAvailableTypesResponse> {
    return apiFetch(`/derivative/subject/${encodeURIComponent(subjectId)}/types`);
  },

  // ── Draft multiplication (write, flag-gated) ────────────────────────────

  generateDerivative(
    caseId: string,
    req: Omit<DerivativeGenerateRequest, "case_id"> & { case_id?: string }
  ): Promise<DerivativeGenerateResponse> {
    const body: DerivativeGenerateRequest = {
      case_id: caseId,
      parent_draft_id: req.parent_draft_id,
      parent_type: req.parent_type ?? "initial",
      parent_draft_text: req.parent_draft_text,
      subject_id: req.subject_id,
      derivative_type_id: req.derivative_type_id,
      use_llm: req.use_llm ?? true,
    };
    return apiFetch(`/case/${encodeURIComponent(caseId)}/derivative/generate`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  generateFamily(
    caseId: string,
    req: Omit<DerivativeFamilyRequest, "case_id"> & { case_id?: string }
  ): Promise<DerivativeFamilyResponse> {
    const body: DerivativeFamilyRequest = {
      case_id: caseId,
      parent_draft_id: req.parent_draft_id,
      parent_type: req.parent_type ?? "initial",
      parent_draft_text: req.parent_draft_text,
      subject_id: req.subject_id,
      use_llm: req.use_llm ?? true,
    };
    return apiFetch(`/case/${encodeURIComponent(caseId)}/derivative/family`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  getStoredFamily(caseId: string): Promise<{ success: boolean; family: Record<string, unknown> }> {
    return apiFetch(`/case/${encodeURIComponent(caseId)}/derivative/family`);
  },
};

// ─── Helpers useful to the UI ─────────────────────────────────────────────────

export const DERIVATIVE_TYPE_STAGE_COLORS: Record<string, string> = {
  rejoinder: "bg-sky-500/10 text-sky-700 border-sky-500/20",
  counter_claim: "bg-violet-500/10 text-violet-700 border-violet-500/20",
  written_submissions: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  supplementary_affidavit: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  evidence_application: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  cross_exam_questions: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  objection_docs: "bg-red-500/10 text-red-700 border-red-500/20",
  appeal_memorial: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  stay_application: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  compliance_affidavit: "bg-teal-500/10 text-teal-700 border-teal-500/20",
  review_petition: "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20",
  execution_petition: "bg-slate-500/10 text-slate-700 border-slate-500/20",
};

export function pairingColorForType(typeId: string): string {
  return (
    DERIVATIVE_TYPE_STAGE_COLORS[typeId] ||
    "bg-gray-500/10 text-gray-700 border-gray-500/20"
  );
}

export function defaultSubjectFromDraftTitle(title: string): string {
  const t = (title || "").toLowerCase();
  if (t.includes("cheque") || t.includes("138") || t.includes("ni act")) return "cheque_dishonour";
  if (t.includes("rent") || t.includes("eviction") || t.includes("landlord")) return "landlord_tenant";
  if (t.includes("maintenance") || t.includes("domestic") || t.includes("matrimonial") || t.includes("family"))
    return "family_maintenance";
  if (t.includes("vehicle") || t.includes("mact") || t.includes("motor")) return "motor_vehicle_claims";
  if (t.includes("consumer") || t.includes("deficiency")) return "consumer_protection";
  if (t.includes("bail") || t.includes("anticipatory")) return "criminal_bail";
  if (t.includes("discharge") || t.includes("quash")) return "criminal_discharge";
  if (t.includes("medical") || t.includes("negligence") || t.includes("hospital")) return "medical_negligence";
  if (t.includes("insurance") || t.includes("policy")) return "insurance_claims";
  if (t.includes("contract") || t.includes("arbitration") || t.includes("breach")) return "contract_commercial";
  if (t.includes("partition") || t.includes("title") || t.includes("declaration")) return "property_partition";
  if (t.includes("money") || t.includes("recovery") || t.includes("debt")) return "money_recovery";
  return "cheque_dishonour";
}
