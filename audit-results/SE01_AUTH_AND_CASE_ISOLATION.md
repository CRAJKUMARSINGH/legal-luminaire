# SE-01 — Auth & Case Isolation Status

**Status: PARTIAL — OIDC NOT IMPLEMENTED (blocked, scoped-key interim deployed)**

## Implemented (verified, commit 8903cde)
- `LL_API_KEY_SCOPES` per-key case allowlists: `keyA:TC-01,TC-02;keyB:TC-22`
- Fail-closed: keys absent from scope map denied all `/api/v1/cases/{id}/*`
- Scopes take precedence over global `LL_ALLOWED_CASES`; `case01` demo bypass retained
- 6 new tests; backend suite 176/176 pass; auth file 28/28 pass
- Code: `backend/config.py` (`api_key_case_scopes`), `backend/api/auth.py`

## NOT implemented (blocked — requires dedicated project)
- OIDC Authorization Code + PKCE, BFF server-side sessions, Secure/HttpOnly/SameSite cookies
- CSRF protection for cookie-authenticated routes
- Per-user identity (`sub`), case membership/role repository, non-disclosing 404s
- Session revocation/expiry enforcement, login/logout audit events
- WebSocket/job/presigned-URL authorization review

## Compensating controls now in place
- Scoped keys prevent one client's credential reaching another's cases
- Secrets remain server-side only (verified: no `LL_API_KEY`/`VITE_*` secret in bundle)
- Fail-closed unauthenticated behavior preserved (401/403 paths tested)

## Acceptance verdict
SE-01 acceptance NOT met. Confidential production remains CONDITIONAL/BLOCKED
until OIDC session layer + cross-user test matrix (two users, two cases,
real DB) is implemented per SUPPLEMENT guide §1.
