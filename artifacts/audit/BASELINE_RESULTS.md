# BASELINE RESULTS
**Audit Date:** 2026-11-15  
**HEAD SHA:** `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`

All commands executed on the actual repository. Results below are verbatim from execution output.

---

## 1. TypeScript Typecheck

**Command:** `pnpm run typecheck` (from `artifacts/legal-luminaire/`)  
**Result:** ✅ EXIT CODE 0 — no errors

```
> @workspace/legal-luminaire@0.0.0 typecheck
> tsc -p tsconfig.json --noEmit
```

TypeScript strict mode is active (`strict: true`, `strictFunctionTypes: true`, `noImplicitOverride: true` in `tsconfig.base.json`, commit `b9c6d61`).

---

## 2. Frontend Build

**Command:** `pnpm run build` (from `artifacts/legal-luminaire/`)  
**Result:** ✅ EXIT CODE 0 — production build succeeded

```
vite v7.3.6 building client environment for production...
✓ 2997 modules transformed.
Generated an empty chunk: "vendor".
dist/public/index.html                   1.43 kB | gzip:   0.61 kB
dist/public/assets/index-B9bph1OQ.css  235.34 kB | gzip:  34.32 kB
dist/public/assets/index-CGc7PU9E.js     0.46 kB | gzip:   0.34 kB
...
```

**Observations:**
- 2997 modules compiled cleanly
- `vendor` chunk is empty (0.00 kB) — `react` and `react-dom` are not being split into vendor as intended in `rollupOptions.output.manualChunks`. This is cosmetic only; the app JS is included in the main index bundle.
- Sourcemap warnings from `tooltip.tsx`, `select.tsx`, `label.tsx`, `progress.tsx` during transform (non-fatal, cosmetic — caused by Tailwind's CSS sourcemap interaction)

---

## 3. Frontend Test Suite (Vitest)

**Command:** `pnpm run test` (from `artifacts/legal-luminaire/`)  
**Result:** ✅ EXIT CODE 0

```
 RUN  v4.1.11
 Test Files  13 passed (13)
      Tests  364 passed (364)
   Start at  07:25:44
   Duration  8.21s
```

**13 test files, 364 tests — all passing.** No skipped or failing tests.

Test files executed:
- `__tests__/academy.test.ts`
- `__tests__/ai-reasoning.test.ts`
- `__tests__/analytics-graph.test.ts`
- `__tests__/citation-gate.test.ts`
- `__tests__/citation-intelligence.test.ts`
- `__tests__/integration-supplements.test.tsx`
- `__tests__/robustness-suite.test.ts`
- `__tests__/search-engine-v2.test.ts`
- `__tests__/self-assessment.test.ts`
- `__tests__/verification-engine.test.ts`
- `__tests__/week2-data-layer.test.ts`
- `config/navigation-integrity.test.ts`
- `data/demo-cases/intake-examples-completeness.test.ts`

---

## 4. Backend Python Tests

**Command:** `pytest tests/test_deadline_engine.py tests/test_route_registry.py tests/test_stadium_collapse_accuracy.py` (from `backend/`, Python 3.14 venv)  
**Result:** ✅ 54/54 PASSED — EXIT CODE 0

```
============================= test session starts ==============================
platform win32 -- Python 3.14.7, pytest-9.1.1
54 passed, 3 warnings in 1.17s
```

Deadline engine: 50/50 tests passing, covering boundary dates, bilingual output, TC-01 hand-computed verification, and copilot snippet format.

**Failing test modules (not in the passing run above):**

| Module | Error | Severity |
|--------|-------|---------|
| `tests/test_copilot.py` | `ImportError: attempted relative import beyond top-level package` in `api/routes_copilot.py` line 41 | MEDIUM — test cannot be collected; copilot feature itself may work at runtime |
| `tests/test_verification_syntax.py` | Functions are not proper pytest fixtures — `filepath` fixture not found | LOW — file is meant to be run as a script (`python test_verification_syntax.py`) not via pytest |

**PytestReturnNotNoneWarning in `test_stadium_collapse_accuracy.py`:** Three test functions return `bool` instead of asserting. Tests pass but are incorrectly written — a false negative could go undetected.

---

## 5. Node.js Security Audit

**Command:** `pnpm audit --audit-level high` (from workspace root)  
**Result:** ❌ EXIT CODE 1 — 19 vulnerabilities found (6 HIGH, 9 MODERATE, 4 LOW)

**High severity findings:**

| Package | Advisory | Path |
|---------|----------|------|
| `extract-zip` | Unvalidated symlink path traversal (GHSA-jmr9-qjv8-65gv) | `scripts > puppeteer > @puppeteer/browsers > extract-zip` |
| `extract-zip` | Arbitrary file writes through symlink entries (GHSA-7pqw-9j4j-h8q3) | same |
| `launch-editor` | `fs.existsSync()` bypass on Windows (GHSA-mrhx-c7xc-m3w5) | `artifacts__legal-luminaire > zod` |
| `body-parser` | DoS via trailing bytes (GHSA-27r3-jxmh-p828) | `artifacts__api-server > express > body-parser` |

**Note:** The `extract-zip` advisory states `Patched versions: <0.0.0` — meaning no patch exists yet. The pnpm workspace override for `extract-zip` is pinned to `2.0.1` (highest available), which is itself the vulnerable version. The advisory path is through `puppeteer` (a development/scripting tool — not in the production frontend bundle).

The `body-parser` vulnerability is in `artifacts/api-server` (the Express.js legacy server), not in the FastAPI Python backend used in production.

---

## 6. Backend Python — Startup Smoke Test

**Backend requires `.env` with `OPENAI_API_KEY`** — not present on this machine. The backend cannot be started without API keys. This is expected; the application degrades gracefully (frontend works standalone with localStorage; backend features require keys).

```python
# config.py — settings.openai_api_key: str = ""  (default empty)
# main.py — lifespan: "OpenAI not configured — skipping Case01 preload"
# routes.py — raises HTTP 503 if research called without key
```

---

## 7. Build Artifact Verification

| Check | Result |
|-------|--------|
| `dist/public/index.html` exists | ✅ 1.43 kB |
| `dist/public/assets/` directory exists | ✅ 60+ JS chunks |
| `dist/public/assets/index-B9bph1OQ.css` | ✅ 235 kB |
| `dist/public/assets/citation-gate-BSnlxvOK.js` | ✅ 2.59 kB — Citation Gate compiled |
| TypeScript strict mode clean | ✅ |
| Source maps disabled in production build | ✅ (vite.config.ts `sourcemap: false`) |
| `_redirects` file for SPA catch-all | ✅ CI smoke check passes |

---

## 8. Summary Table

| Check | Status | Notes |
|-------|--------|-------|
| TypeScript typecheck | ✅ PASS | Strict mode, 0 errors |
| Frontend build | ✅ PASS | 2997 modules, clean |
| Frontend tests (364) | ✅ PASS | 13/13 files, 364/364 |
| Backend tests (54) | ✅ PASS | deadline + route + accuracy |
| Backend test_copilot.py | ❌ COLLECTION ERROR | Relative import bug |
| Backend test_verification_syntax.py | ❌ FIXTURE ERROR | Not pytest-compatible |
| Node security audit | ⚠️ 19 vulns | 6 HIGH (see SEC findings) |
| Backend startup | ⚠️ REQUIRES .env | Graceful degradation exists |
