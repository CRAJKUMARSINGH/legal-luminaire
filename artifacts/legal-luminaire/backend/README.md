# Canonical backend — Legal Luminaire API

FastAPI is the **only** product API.

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Routes: `/api/v1` for JSON product endpoints; `/api` for streaming/SSE.

The Express app at `artifacts/api-server` is quarantined and must not receive new product work.
