/**
 * PDF Document Intelligence — Month 3
 * ─────────────────────────────────────────────────────────────────────────────
 * Wires text extraction from uploaded PDFs and .lex files into the AI Drafter.
 *
 * Two paths:
 *   1. Browser-side: extract via backend /omni-preview endpoint (already built)
 *   2. AI Drafter context: inject extracted text as source material
 *
 * This module provides the glue layer that:
 *   - Sends a file to the backend for text extraction
 *   - Returns clean plain-text ready for the AI Drafter's source input
 *   - Handles .lex files (plain text) natively in the browser
 *   - Handles PDFs via the backend extraction endpoint
 */

import { API_BASE } from "@/lib/api-client";

export interface ExtractedDocument {
  fileName: string;
  mimeType: string;
  /** Extracted plain text — ready for the AI Drafter's sourceText field */
  text: string;
  /** Whether extraction was full (PDF backend) or partial (browser text) */
  extractionQuality: "full" | "partial" | "native";
  /** Any warnings from the extraction process */
  warnings: string[];
  /** Number of pages/chunks detected */
  pageCount: number;
  /** Document metadata if available */
  metadata?: {
    title?: string;
    author?: string;
    date?: string;
    caseNumber?: string;
  };
}

/** File types that can be extracted natively in the browser (plain text). */
const NATIVE_TEXT_TYPES = [
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
];

const NATIVE_EXTENSIONS = [".lex", ".txt", ".md", ".csv", ".json"];

function isNativeText(file: File): boolean {
  return (
    NATIVE_TEXT_TYPES.some((t) => file.type.startsWith(t)) ||
    NATIVE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
  );
}

/**
 * Extract text from a single file.
 * .lex / .txt files are read directly in the browser.
 * PDFs go through the backend /omni-preview endpoint.
 */
export async function extractFileText(file: File): Promise<ExtractedDocument> {
  // ── Native text files — read directly ──────────────────────────────────────
  if (isNativeText(file)) {
    try {
      const text = await file.text();
      return {
        fileName: file.name,
        mimeType: file.type || "text/plain",
        text,
        extractionQuality: "native",
        warnings: [],
        pageCount: Math.ceil(text.length / 3000),
        metadata: extractMetadataFromText(text),
      };
    } catch (err) {
      return errorResult(file, `Failed to read text file: ${err}`);
    }
  }

  // ── PDF / DOCX — backend extraction ────────────────────────────────────────
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/omni-preview`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return errorResult(file, `Backend extraction failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json() as {
      success?: boolean;
      chunks?: Array<{ text: string; page?: number }>;
      metadata?: { title?: string; author?: string; date?: string };
      errors?: string[];
      message?: string;
    };

    if (!data.success || !data.chunks?.length) {
      return errorResult(file, data.message ?? data.errors?.[0] ?? "No text extracted");
    }

    const text = data.chunks.map((c) => c.text).join("\n\n---\n\n");

    return {
      fileName: file.name,
      mimeType: file.type,
      text,
      extractionQuality: "full",
      warnings: data.errors ?? [],
      pageCount: data.chunks.length,
      metadata: data.metadata,
    };
  } catch (err) {
    return errorResult(file, `Network error during extraction: ${err}`);
  }
}

/**
 * Extract text from multiple files and concatenate for the AI Drafter.
 * Returns a single string ready to inject into MatterDraftingStudio sourceText.
 */
export async function extractMultipleFiles(
  files: File[],
  onProgress?: (done: number, total: number, fileName: string) => void,
): Promise<{
  combinedText: string;
  results: ExtractedDocument[];
  failedFiles: string[];
}> {
  const results: ExtractedDocument[] = [];
  const failedFiles: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i, files.length, file.name);
    const result = await extractFileText(file);
    results.push(result);
    if (result.warnings.some((w) => w.includes("Failed") || w.includes("error"))) {
      failedFiles.push(file.name);
    }
  }

  onProgress?.(files.length, files.length, "Complete");

  const combinedText = results
    .filter((r) => r.text.trim().length > 0)
    .map((r) => `=== SOURCE: ${r.fileName} ===\n${r.text}`)
    .join("\n\n" + "=".repeat(60) + "\n\n");

  return { combinedText, results, failedFiles };
}

/**
 * Extract basic metadata from lex/text content using pattern matching.
 * Court documents have predictable header structures.
 */
function extractMetadataFromText(text: string): ExtractedDocument["metadata"] {
  const meta: ExtractedDocument["metadata"] = {};

  // Case number
  const caseNoMatch = text.match(/(?:Case|Petition|Appeal|OA)\s+No\.?\s+([^\n]{1,40})/i);
  if (caseNoMatch) meta.caseNumber = caseNoMatch[1].trim();

  // Date
  const dateMatch = text.match(/(?:Dated?:|dated)\s+(\d{1,2}[\-./]\d{1,2}[\-./]\d{2,4}|\d{1,2}\s+\w+\s+\d{4})/i);
  if (dateMatch) meta.date = dateMatch[1].trim();

  // Title / heading
  const firstLine = text.split("\n").find((l) => l.trim().length > 10)?.trim();
  if (firstLine) meta.title = firstLine.slice(0, 100);

  return meta;
}

function errorResult(file: File, errorMsg: string): ExtractedDocument {
  return {
    fileName: file.name,
    mimeType: file.type,
    text: "",
    extractionQuality: "partial",
    warnings: [errorMsg],
    pageCount: 0,
  };
}
