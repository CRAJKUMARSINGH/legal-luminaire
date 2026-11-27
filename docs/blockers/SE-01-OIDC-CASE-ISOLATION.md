# SE-01 — OIDC Authentication and Case Isolation
**Priority:** P0 for confidential production  
**Status:** PARTIAL — scoped API keys deployed; OIDC not implemented · Reviewed 2026-11-27 (`Legal kiro 26.txt` A4): still OPEN — needs an OIDC provider, BFF server-side sessions, and a real-database cross-user test matrix.  
**Opened:** Pre-2026-11  
**Owner:** Backend engineering (security-controlled implementation)  
**Reference:** SUPPLEMENT guide §1

---

## Current state (as of commit `8903cde`)

Deployed and tested:
- `LL_API_KEY_SCOPES` per-key case allowlists (`keyA:TC-01,TC-02;keyB:TC-22`)
- Fail-closed: keys without scope entry are denied all `/api/v1/cases/{id}/*`
- Scopes take precedence over global `LL_ALLOWED_CASES`
- 401/403/429 auth error envelopes tested in `test_http_contract.py`
- No server secrets in client bundle (verified)

Not implemented:
- OIDC Authorization Code + PKCE
- BFF server-side sessions with `Secure`/`HttpOnly`/`SameSite=Lax` cookies
- CSRF protection for cookie-authenticated state-changing routes
- Per-user identity (`sub` scoped to issuer), case membership / role repository
- Server-side ownership check on every data access path (search, jobs, exports,
  attachments, presigned URLs, WebSockets)
- Non-disclosing 404 for unauthorized case access
- Session revocation / expiry enforcement
- Login/denied-access/export audit events (without leaking sensitive content)
- Two-user, two-case cross-access test matrix against a real database

---

## Acceptance criteria

SE-01 is resolved when **all** of the following pass:

### A — OIDC provider wired

| Criterion | Verification |
|---|---|
| OIDC Authorization Code + PKCE flow with an established provider | Sign-in and sign-out tested in staging |
| BFF pattern: tokens/sessions server-side only; no secrets in `VITE_*` or localStorage | Bundle scan finds no secrets |
| `Secure`, `HttpOnly`, `SameSite=Lax` (or stricter) cookies | Browser DevTools / Burp inspection |
| CSRF protection on all state-changing cookie-authenticated routes | Automated CSRF test |
| JWKS-based signature verification; issuer, audience, expiry, nonce validated | Unit test on token validation |

### B — Case-level authorization enforced server-side

| Criterion | Verification |
|---|---|
| Every `/api/v1/cases/{id}/*` endpoint checks ownership against a server-owned mapping | Code review + route-by-route checklist |
| Search, async jobs, export downloads, attachments, presigned URLs all scoped | Automated test: User A cannot retrieve User B's search results or exports |
| Deny-by-default; unknown case_id → non-disclosing 404 | Automated test |
| `LL_API_KEY_SCOPES` removed or superseded by OIDC identity; shared key grants no cross-case access | Test: shared key denied after OIDC migration |

### C — Cross-user test matrix passes

| Scenario | Expected result |
|---|---|
| Anonymous request to protected endpoint | 401 |
| User A requests User B's case | 403 / non-disclosing 404 |
| Forged or expired session token | Denied |
| Valid user, no case membership | Denied |
| Authorized user, correct permission | Allowed |
| Case ID tampering in job status URL | Denied |
| Session expiry | Access removed |
| CSRF attempt on state-changing route | Denied |
| Browser bundle scanned for secrets | None found |
| Two concurrent users, two cases, real DB | Each user sees only their own data |

### D — Audit trail

- Login events, denied-access events, case membership changes, and export events
  are logged without recording sensitive case content or tokens.

---

## Release decision

| Release type | Gate |
|---|---|
| Synthetic-data demo / staging | May proceed independently (scoped keys + existing controls sufficient) |
| Confidential production | **BLOCKED** until criteria A–D above are all verified |
| Court-use exports | **BLOCKED** by SE-01 and separately by legal-source closure |

---

## Implementation notes

The SUPPLEMENT guide §1 (`SUPPLEMENT/LEGAL_LUMINAIRE_SE01_BROWSER_SE08_LEGAL_PATCH.md`,
now archived) contains the full architectural contract, illustrative FastAPI
dependency code, and mandatory test scenarios. Use that as the requirements spec.

Do not reuse the shared `LL_API_KEY` for browser-user sessions.  
Do not store OIDC client secrets in `VITE_*` env vars or the frontend bundle.  
Use an audited library for OIDC callback and token validation — not hand-written parsing.
