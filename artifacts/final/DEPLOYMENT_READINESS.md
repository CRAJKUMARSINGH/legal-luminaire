# DEPLOYMENT READINESS
**Legal Luminaire — Release Recommendation**  
**Audit Date:** 2026-11-15 | HEAD `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`

---

## Checklist Result

| Check | Status | Evidence |
|-------|--------|---------|
| 1. All applicable tests pass | ⚠️ PARTIAL | 364/364 frontend + 54/54 backend tests pass; test_copilot.py collection fails |
| 2. Production build verified | ✅ PASS | `dist/public/index.html` exists; 2997 modules compiled |
| 3. No secrets bundled | ✅ PASS | No API keys in source; `.env` pattern used throughout |
| 4. Security headers configured | ❌ FAIL | No CSP, HSTS, X-Frame-Options on Netlify or nginx |
| 5. Frontend-backend connectivity | ⚠️ UNVERIFIED | Vite proxy configured; backend not started (no .env) |
| 6. Critical workflows verified in browser | ⚠️ UNVERIFIED | Cannot run browser tests without API keys |
| 7. Exported documents and citations verified | ⚠️ PARTIAL | Citation Gate verified in tests; full export flow unverified |
| 8. Backup and rollback | ⚠️ PARTIAL | Git history is rollback mechanism; no automated DB backup |
| 9. Unresolved risks recorded | ✅ DONE | OPEN_RISKS.md |
| 10. Release recommendation with evidence | ✅ BELOW | |

---

## Frontend (Static Site) — Netlify / CDN

**Status: CONDITIONALLY READY for demo/staging deployment.**

The frontend builds cleanly with 2997 modules, TypeScript strict mode passes, and 364 tests pass. It functions without a backend using `localStorage`. The following must be completed before public production use:

- Add security headers to `netlify.toml` (30 minutes of work)
- Remove combined accuracy percentage from UI (SEC-P0-04)
- Downgrade three incorrectly tiered VERIFIED citations to SECONDARY (30 minutes)

**Blockers for advocate/court use:** See Legal Validation blockers below.

---

## Backend (FastAPI) — Docker / Cloud

**Status: NOT READY for production deployment.**

**Hard blockers:**
1. **No authentication** (SEC-H01) — any client on the network can hit all endpoints
2. **OPENAI_API_KEY required** — backend will not start research/drafting without it
3. **ChromaDB is local-disk** — data not backed up; lost if container is redeployed without volume mount

**Recommended actions before production:**
1. Add API key authentication middleware
2. Configure persistent volume for ChromaDB
3. Add health-check alerting (endpoint exists: `GET /api/v1/health`)
4. Set `CORS_ORIGINS` explicitly in deployment environment

---

## Legal Accuracy — Court Filing

**Status: NOT READY for unassisted court filing.**

Three precedents marked VERIFIED must be downgraded to SECONDARY:
- p13 Rajasthan HC Suo Motu PIL (blank docket number, paraphrased holding)
- p14 Surendra Koli 2025 (news media source only)
- p16 RSMML 2026 (newspaper source only)

Five standards have `exactClauseText: null` — the specific clause numbers cited in draft pleadings are not confirmed from official sources. BIS/CPWD copies must be obtained before filing.

The combined accuracy percentage must be removed from the UI (contradicts the directive).

**Once the above corrections are made, the Citation Gate provides a genuinely conservative safety mechanism** — PENDING citations are hard-blocked, SECONDARY citations are flagged, and COURT_SAFE/VERIFIED citations are tested and confirmed.

---

## Production Deployment Command

**Frontend only (after resolving P0 items):**
```bash
pnpm --filter @workspace/legal-luminaire run build
# Output: artifacts/legal-luminaire/dist/public/
# Deploy dist/public/ to Netlify/CDN
```

**Full stack (Docker):**
```bash
# 1. Create backend .env with OPENAI_API_KEY, TAVILY_API_KEY, CORS_ORIGINS
# 2. Mount ChromaDB volume
docker compose up --build
```

---

## Release Recommendation

**RECOMMEND: Staged deployment only.**

Deploy the frontend to staging for demonstration and advocate feedback. Do not deploy the backend to production until authentication is implemented. Do not allow court filing from the application until the three incorrectly tiered citations are corrected and the BIS/CPWD standard copies are obtained.

The core legal accuracy infrastructure (Citation Gate, Verification Engine, Deadline Engine) is well-built and tested. The application is a capable research and drafting aid. The gaps are specific, documented, and all correctable.

**Estimated time to P0+P1 remediation: 2–3 developer-days + legal team procurement time for official BIS/CPWD copies.**
