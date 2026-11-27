import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const CASE_ID = "synthetic-construction-demo";
const FIXTURE = new URL("../test-assets/synthetic-inputs/construction-defect-report.md", import.meta.url);

export async function seedDemo(backendUrl: string, apiKey?: string): Promise<number> {
  const backend = new URL(backendUrl);
  const localHosts = ["localhost", "127.0.0.1", "[::1]"];
  if (!["http:", "https:"].includes(backend.protocol) ||
      !localHosts.includes(backend.hostname) || backend.username || backend.password) {
    throw new Error("BACKEND_URL must point to a local HTTP or HTTPS backend.");
  }

  const document = await readFile(FIXTURE, "utf8");
  if (!document.startsWith("[SYNTHETIC TEST DATA — NOT REAL]")) {
    throw new Error("The demo fixture is missing its synthetic data label.");
  }
  const form = new FormData();
  form.append("files", new Blob([document], { type: "text/markdown" }), "construction-defect-report.md");

  const response = await fetch(new URL(`/api/v1/cases/${CASE_ID}/upload`, backend), {
    method: "POST",
    headers: apiKey ? { "X-API-Key": apiKey } : undefined,
    body: form,
    redirect: "error",
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    throw new Error(`Demo upload failed (HTTP ${response.status}).`);
  }

  const result = await response.json() as {
    success?: boolean;
    case_id?: string;
    errors?: unknown[];
    total_chunks?: number;
  } | null;
  if (result?.success !== true || result.case_id !== CASE_ID ||
      !Array.isArray(result.errors) || result.errors.length ||
      typeof result.total_chunks !== "number" ||
      !Number.isSafeInteger(result.total_chunks) || result.total_chunks <= 0) {
    throw new Error("The backend did not confirm successful indexing of the synthetic fixture.");
  }
  return result.total_chunks;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedDemo(process.env.BACKEND_URL ?? "http://127.0.0.1:8000", process.env.LL_DEMO_API_KEY)
    .then((chunks) => console.log(`Indexed ${chunks} synthetic chunks for ${CASE_ID}.`))
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : "Demo seeding failed.");
      process.exitCode = 1;
    });
}
