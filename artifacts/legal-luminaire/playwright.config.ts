import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * Route-crawl regression gate (TICKET 1). Fails if any nav path renders an
 * empty <main> or emits a console error. Reuses an already-running preview
 * server (CI starts one) and otherwise boots `vite preview` itself.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npx vite preview --config vite.config.ts --host 127.0.0.1 --port 4173",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
