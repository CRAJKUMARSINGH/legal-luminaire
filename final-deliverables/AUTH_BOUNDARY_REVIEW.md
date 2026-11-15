# AUTH BOUNDARY REVIEW
**Guide 1 §2 — Browser-to-Backend Authentication Boundary**  
**Date:** 2026-11-15

---

## Current Implementation

`api/auth.py` implements shared API-key authentication via `X-API-Key` header.  
`config.py` reads `LL_API_KEY` (comma-separated list of accepted keys) from `.env`.  
When `LL_API_KEY` is empty, auth is **disabled** (backward-compatible dev mode).

## Critical Boundary Question (from Guide 1 §2)

> Does the browser ship or store `LL_API_KEY`?

**Answer: NO.** Evidence from source scan:

```
Scan: grep LL_API_KEY across all frontend src/**/*.ts /*.tsx
Result: NONE FOUND
```

`LL_API_KEY` is a backend environment variable read by `config.py`. It is never:
- Embedded in Vite build output (`VITE_*` prefix required for frontend exposure)
- Stored in `localStorage` or `sessionStorage`
- Returned in any API response

The one `VITE_FF_` match in `SystemFlagsPage.tsx:106` is a UI string that displays
feature-flag env var names for developers — it is not an actual secret value.

## localStorage Usage Inventory

localStorage is used for case-state persistence (offline-first design). Content stored:

| File | Usage | Contains Secrets? |
|------|-------|-------------------|
| `lib/case-store.ts` | Case metadata (id, name, charges, dates) | ❌ No keys |
| `lib/multi-case-store.ts` | Multi-case index | ❌ No keys |
| `lib/bilingual-draft.ts` | Draft text per case | ❌ No keys |
| `lib/chamber-auth.ts` | Chamber token (optional UI role) | ⚠️ See note |
| `lib/recent-cases.ts` | Last-opened case list | ❌ No keys |
| `features/copilot/CopilotPanel.tsx` | Copilot session history | ❌ No keys |

**Chamber auth note:** `chamber-auth.ts` stores a UI-level role token in localStorage.
This is a frontend display control only — the backend does not validate it. It is not
equivalent to a server-side credential. No `LL_API_KEY` is involved.

## Assessment

The current `X-API-Key` / `LL_API_KEY` model is **machine-to-machine only** — suitable
for a single-operator deployment where the key is configured server-side and never
exposed to browsers. It is **not** a multi-user identity system.

**For a public multi-user legal workbench, Guide 1 §2 requires:**

| Requirement | Current Status | Required Action |
|-------------|---------------|-----------------|
| Per-user identity | ❌ Not implemented | OIDC/OAuth2 with identity provider |
| Short-lived session tokens | ❌ Static shared key | Authorization code with PKCE |
| Secure, HttpOnly cookies | ❌ No session cookies | Replace `X-API-Key` with session |
| Token expiry and rotation | ❌ Static key | Implement refresh + rotation |
| Per-case access control | ✅ `ll_allowed_cases` works | Extend to per-user grants |
| Cross-tenant isolation | ⚠️ Partial — case_id in path | Enforce server-side per user |

## Risk Classification

| Risk | Level | Mitigation |
|------|-------|-----------|
| Shared key leaked from server env | MEDIUM | Key rotation, secrets manager |
| No per-user identity | HIGH (multi-user) | Implement OIDC before multi-user launch |
| localStorage case data on shared device | LOW | Add "clear session" UI option |
| Chamber auth token forgeable | LOW | Backend does not trust it |

## Verdict

**Safe for single-operator demo/staging** with `LL_API_KEY` set server-side.  
**Not safe for multi-user production** without per-user identity implementation.  
No `LL_API_KEY` is exposed to any browser. No secrets found in frontend source.
