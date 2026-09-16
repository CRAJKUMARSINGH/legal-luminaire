/**
 * Legal Luminaire API Client
 * Connects React frontend to Python FastAPI backend
 */

export const API_BASE = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

export function apiRequest(path: string, init?: RequestInit): Promise<Response> {
  const isMultipart = init?.body instanceof FormData;
  return fetch(apiUrl(path), {
    ...init,
    headers: isMultipart
      ? init?.headers
      : { "Content-Type": "application/json", ...init?.headers },
  });
}

export type ResearchMode = "research" | "draft";

export interface ResearchRequest {
  case_id: string;
  query: string;
  incident_type?: string;
  evidence_type?: string;
  procedural_defects?: string[];
  mode: ResearchMode;
}

export interface TaskOutput {
  agent: string;
  output: string;
}

export interface ResearchResponse {
  success: boolean;
  case_id: string;
  mode: string;
  draft: string;
  tasks_output: TaskOutput[];
  error?: string;
  doc_count: number;
}

export interface UploadResponse {
  success: boolean;
  case_id: string;
  indexed: { file: string; chunks: number }[];
  skipped: string[];
  errors: string[];
  total_chunks: number;
}

export interface CaseStatusResponse {
  case_id: string;
  has_documents: boolean;
  doc_count: number;
}

export interface HealthResponse {
  status: string;
  openai_configured: boolean;
  tavily_configured: boolean;
  chroma_ready: boolean;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiRequest(path, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

export const apiClient = {
  health(): Promise<HealthResponse> {
    return apiFetch("/health");
  },

  getCaseStatus(caseId: string): Promise<CaseStatusResponse> {
    return apiFetch(`/cases/${caseId}/status`);
  },

  async uploadFiles(caseId: string, files: File[]): Promise<UploadResponse> {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await apiRequest(`/cases/${caseId}/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Upload failed ${res.status}`);
    }
    return res.json();
  },

  runResearch(caseId: string, req: Omit<ResearchRequest, "case_id">): Promise<ResearchResponse> {
    return apiFetch(`/cases/${caseId}/research`, {
      method: "POST",
      body: JSON.stringify({ ...req, case_id: caseId }),
    });
  },
};

// ── Extended client methods ────────────────────────────────────────────────────

export interface CitationVerifyResponse {
  case_name: string;
  citation: string;
  found_on_indian_kanoon: boolean;
  indian_kanoon_result: string;
  web_result: string;
  confidence: "HIGH" | "LOW";
  recommendation: string;
  error?: string;
}

export interface StandardVerifyResponse {
  code: string;
  result: string;
  error?: string;
}

export interface ChatResponse {
  reply: string;
  sources: string[];
  verification_notes: string[];
}

export const extendedApiClient = {
  verifyCitation(caseName: string, citation = ""): Promise<CitationVerifyResponse> {
    const params = new URLSearchParams({ case_name: caseName, citation });
    return apiFetch(`/verify-citation?${params}`);
  },

  verifyStandard(code: string): Promise<StandardVerifyResponse> {
    return apiFetch(`/verify-standard?code=${encodeURIComponent(code)}`);
  },

  chat(caseId: string, message: string, history: Array<{ role: string; content: string }> = []): Promise<ChatResponse> {
    return apiFetch("/chat", {
      method: "POST",
      body: JSON.stringify({ case_id: caseId, message, history }),
    });
  },

  preloadCase01(): Promise<{ success: boolean; files_indexed: number; total_chunks: number; error?: string }> {
    return apiFetch("/cases/case01/preload", { method: "POST" });
  },
};

/**
 * streamRequest — wrapper around fetch that returns a raw Response.
 * Used by variantsApi.ts for SSE streaming and regular REST calls.
 */
export function streamRequest(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });
}

/**
 * fetchPublicText — fetches a publicly accessible text resource by full URL.
 * Used by MatterDraftingStudio.tsx to load remote text content.
 */
export async function fetchPublicText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetchPublicText: ${res.status} ${res.statusText}`);
  return res.text();
}
