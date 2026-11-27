# Limitation & Deadline Engine — Requirements
**Status**: ACTIVE — promoted 2026-11-27 (`Legal kiro 26.txt` C1; see docs/DOCUMENTATION_INDEX.md §3)
**Flag**: `deadline_engine` (default OFF)
**Weeks**: 9 (Kiro backend) → 10 (Devin board UI)
**Source**: Statutory — *Limitation & Deadline Tracking* feature (vibecode.law/showcase/Statutory-723173)
**Primary Principle**: Deadlines are computed deterministically from synthetic dates only and always displayed with their governing basis. No LLM in the computation path. Bilingual throughout.

---

## Scope

A deterministic **limitation calculator** for common Indian criminal-procedure and filing deadlines, driven by a versioned, human-reviewable rule table. Deadline derivation is from the synthetic case data layer (FIR date, arrest date, FSL submission, bail application, discharge petition, hearings). Every deadline carries an explicit basis string so the user can independently verify the computation.

This is a **read-only, pure-computation feature** — it cannot draft, file, or modify anything.

---

## API Contract (Week 9 — frozen; Week 10 board UI builds on this)

### `GET /api/v1/deadlines/health`
Always 200, regardless of flag state. Never rate-limited.
```json
{
  "feature": "deadline_engine",
  "enabled": true,
  "rule_count": 10,
  "endpoints": ["GET /api/v1/case/{case_id}/deadlines", "..."],
  "disclaimer": "<bilingual disclaimer>"
}
```

### `GET /api/v1/deadlines/rules`
Returns the full versioned rule table (flag-gated: 404 if OFF).
```json
{
  "rule_count": 10,
  "disclaimer": "...",
  "rules": [{ "id", "name", "name_hi", "statute", "section", "event_type",
               "period_days", "period_basis", "applies_to", "extension_rule",
               "consequence", "consequence_hi", "source_note", "blocked_from_draft" }]
}
```

### `GET /api/v1/case/{case_id}/deadlines`
Full computed schedule for a case (flag-gated). Optional `?reference_date=YYYY-MM-DD`.
```json
{
  "case_id": "TC-01",
  "computed_at": "2026-09-08",
  "total": 10,
  "status_counts": { "UPCOMING": 3, "WARNING": 2, "OVERDUE": 1, "CANNOT_COMPUTE": 4 },
  "items": [<DeadlineItem>, ...],
  "disclaimer": "<bilingual SYNTHETIC/DEMO disclaimer>"
}
```

### `GET /api/v1/case/{case_id}/deadlines/urgent`
Filters to URGENT (≤14 days) and OVERDUE items only (flag-gated).

### `DeadlineItem` schema
```json
{
  "rule_id":        "CRPC-167-90D",
  "case_id":        "TC-01",
  "event_type":     "arrest_date",
  "event_date":     "2023-03-20",
  "due_date":       "2023-06-18",
  "days_remaining": -1186,
  "status":         "OVERDUE",
  "name":           "Charge-sheet filing deadline (serious offences)",
  "name_hi":        "आरोप-पत्र दाखिल करने की समय-सीमा (गंभीर अपराध)",
  "basis_en":       "<full EN computation chain + SYNTHETIC/DEMO disclaimer>",
  "basis_hi":       "<full HI computation chain>",
  "statute":        "CrPC / BNSS",
  "section":        "CrPC §167(2) / BNSS §187(2)",
  "source_note":    "ILLUSTRATIVE. Verify §167(2) CrPC / §187(2) BNSS text.",
  "period_days":    90,
  "period_basis":   "calendar",
  "consequence":    "Accused entitled to default bail under §167(2) proviso",
  "consequence_hi": "§167(2) के अनुसार आरोपी को डिफ़ॉल्ट जमानत का अधिकार",
  "computed_at":    "2026-09-08",
  "is_synthetic":   true,
  "completed":      false
}
```

### Error codes
| Code | Condition |
|------|-----------|
| 404  | Feature flag `deadline_engine` is OFF |
| 422  | Invalid `reference_date` format |
| 500  | Computation or rules-file error |

---

## Computation Rules (enforced in `limitation_engine.py`)

1. **DETERMINISTIC** — same inputs always produce same output. No randomness, no network, no LLM.
2. **CANNOT_COMPUTE safety** — missing event date → explicit `status="CANNOT_COMPUTE"` with bilingual message. Never silently omitted, never estimated.
3. **Working-day rules** — `period_basis="working"` uses `period_days × 1.4` calendar-day approximation. Explicitly documented in basis string. No court-holiday calendar.
4. **Status thresholds**: OVERDUE (past), URGENT (≤14d), WARNING (≤30d), UPCOMING (>30d).
5. **Sort order** — items sorted by `due_date` ascending; CANNOT_COMPUTE items last.
6. **Disclaimer mandatory** — every response carries `disclaimer` field. Never suppressed.

---

## Rule Table (`limitation_rules.json`)

10 rules seeded at v1.0:

| Rule ID | Event basis | Period | Basis |
|---------|-------------|--------|-------|
| `CRPC-167-90D` | arrest_date | 90 days | calendar |
| `CRPC-167-60D` | arrest_date | 60 days | calendar |
| `CRPC-173-FINAL` | fir_date | 90 days | calendar |
| `CRPC-309-NEXT-DATE` | last_hearing_date | 30 days | calendar |
| `LIMITATION-468-3Y` | incident_date | 1095 days | calendar |
| `LIMITATION-468-1Y` | incident_date | 365 days | calendar |
| `BAIL-439-APPLICATION` | bail_application_date | 7 days | working |
| `DISCHARGE-PETITION-HEARING` | discharge_petition_date | 30 days | calendar |
| `FSL-REPORT-RECEIPT` | fsl_sample_submission_date | 60 days | calendar |
| `APPEAL-SC-SLP-90D` | hc_order_date | 90 days | calendar |

Every rule carries a mandatory `source_note` marked **"ILLUSTRATIVE — verify against current statute text before professional use"**.

---

## Copilot Integration (W5 contract extension)

- Citation type `"deadline"` added to `CopilotCitation.type` Literal.
- `_build_citations` in `routes_copilot.py` accepts `citation_type="deadline"` in chunk metadata.
- Deadline answers cite `rule_id` + `basis_en` snippet (≤300 chars) from the engine — never a guessed date.
- `format_copilot_citation_snippet(deadline)` in `limitation_engine.py` builds the snippet.

---

## TC-01 Demo Data

`backend/uploaded_cases/TC-01/TC-01_Deadline_Events.json` — 8 event types:
- `incident_date`, `fir_date`, `arrest_date`, `fsl_sample_submission_date`
- `bail_application_date`, `discharge_petition_date`, `last_hearing_date`
- `hc_order_date` = `null` (produces 1 CANNOT_COMPUTE entry — proves the safety net)

All dates labelled **SYNTHETIC/DEMO** — no real case data.

---

## Accuracy Guardrails

- Engine is LLM-free by construction — deterministic Python `datetime` arithmetic only.
- Missing event date → CANNOT_COMPUTE, never an estimate presented as a deadline.
- No silent rule defaults — every rule must have `source_note`.
- All rules marked illustrative; `blocked_from_draft: false` (rules are advisory, not precedent).
- `is_synthetic: true` on every computed item; disclaimer on every API response.

---

## Flag

`deadline_engine` — OFF by default.
Backend: `os.getenv("FEATURE_DEADLINE_ENGINE", "false")`.
Frontend (Week 10): `VITE_FF_DEADLINE_ENGINE=true` in `.env.local`.

---

## Rate Limiting

`/deadlines` added to `heavy_markers` in `main.py::_is_expensive_endpoint`.
`/deadlines/health` shares the prefix but is computationally cheap; default 10 req/min limit is not a concern.

---

## Rollback

Flag OFF → all `/case/{id}/deadlines` and `/deadlines/*` endpoints return 404.
`/deadlines/health` still responds 200 with `enabled: false`.
Rule table and engine files are additive — no existing code broken.

---

## Acceptance Criteria
- [x] Engine output for TC-01 matches hand-computed expected dates 100%
- [x] Every deadline carries rule_id + bilingual basis string; SYNTHETIC labelling visible
- [x] CANNOT_COMPUTE returned (not silently omitted) when event date is null
- [x] Copilot deadline answers cite engine output (zero invented dates)
- [x] 20+ tests covering boundary dates, month-ends, working-day rules, CANNOT_COMPUTE
- [x] `WEEK09_KIRO_COMPLETION.md` committed
