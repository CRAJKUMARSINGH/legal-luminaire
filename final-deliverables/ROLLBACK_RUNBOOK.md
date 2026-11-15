# ROLLBACK RUNBOOK
**Guide 1 §7 — Safe Rollback Procedure**  
**Date:** 2026-11-15

---

## When to Rollback

Rollback is required when:
- A deployed release causes critical functionality loss
- A security regression is discovered post-deployment
- Citation gate fails to block a PENDING citation in production
- Authentication bypass is detected

Do NOT rollback for:
- Cosmetic issues (use hotfix forward)
- Non-critical warnings (patch in next release)
- Test failures in staging (fix before promoting)

---

## Pre-Rollback Checklist

1. Confirm the current deployment SHA matches `010b7a7`
2. Record the failing symptom with timestamp and logs
3. Notify the release owner
4. Confirm the previous stable SHA is known (see table below)

## Known Stable SHAs

| SHA | Description | Status |
|-----|-------------|--------|
| `010b7a7` | Priority 1-6 security + test completion | **Current RC** |
| `10cc700` | Merge of hardening enrichment | Previous stable |
| `bda89ce` | Pre-audit baseline | Oldest rollback target |

---

## Frontend Rollback (Netlify)

```bash
# Option A: Netlify UI rollback (preferred — instant)
# 1. Go to Netlify dashboard → Deploys
# 2. Find the previous successful deploy
# 3. Click "Publish" on that deploy
# This instantly switches the production URL to the previous build.

# Option B: Git-based rollback (requires redeploy)
git checkout 10cc700 -- artifacts/legal-luminaire/src/ artifacts/legal-luminaire/dist/
pnpm --filter @workspace/legal-luminaire run build
# Netlify auto-deploys from the build output
```

## Backend Rollback (uvicorn/Docker)

```bash
# Option A: Docker image rollback
docker pull legal-luminaire-backend:10cc700
docker stop legal-luminaire-backend
docker run -d --name legal-luminaire-backend legal-luminaire-backend:10cc700

# Option B: Git rollback + restart
cd artifacts/legal-luminaire/backend
git checkout 10cc700 -- api/ config.py main.py rag/
# Restart uvicorn
pkill -f "uvicorn main:app"
.venv/Scripts/python main.py  # or: .venv/bin/python main.py
```

## Database / ChromaDB Rollback

ChromaDB data is stored in `chroma_db/` (local filesystem). No schema migrations
exist, so no database rollback is needed. If case data was corrupted:

```bash
# ChromaDB collections are per-case under chroma_db/<case_id>/
# To rollback a single case collection:
rm -rf chroma_db/<case_id>/
# Re-ingest from source files in uploaded_cases/<case_id>/
python -c "from rag.document_store import ingest_files; ingest_files('<case_id>', [...])"
```

## Post-Rollback Verification

After rollback, verify:

```bash
# 1. Backend health
curl -sf http://localhost:8000/api/v1/health | python -m json.tool

# 2. Frontend loads
curl -sf -o /dev/null -w "%{http_code}" https://FRONTEND_URL/

# 3. Citation gate still blocks PENDING
python -m pytest tests/test_citation_registry.py -q

# 4. Auth still works (if enabled)
python -m pytest tests/test_authentication.py -q

# 5. Full test suite
python -m pytest tests/ -q
pnpm --filter @workspace/legal-luminaire run test
```

## Rollback Safety Rules

1. **Never** `git reset --hard` on `main` — use checkout of specific files instead
2. **Never** delete ChromaDB data without confirming source files exist in `uploaded_cases/`
3. **Always** record the rollback timestamp and reason in this file's changelog below
4. **Always** run the full test suite after rollback to confirm no regression
5. **Always** notify all stakeholders before and after rollback

## Rollback Changelog

| Date | From SHA | To SHA | Reason | Verified By |
|------|----------|--------|--------|-------------|
| (none yet) | — | — | — | — |
