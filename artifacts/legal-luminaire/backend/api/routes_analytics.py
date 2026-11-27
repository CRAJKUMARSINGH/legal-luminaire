"""
Analytics API Routes
FastAPI routes for Phase 5: Judge & Court Analytics
"""

from __future__ import annotations
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from agents.judgment_parser import parse_judgment, ParsedJudgment

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


class JudgmentInput(BaseModel):
    case_id: str
    text: str


class BulkAnalyticsRequest(BaseModel):
    judgments: list[JudgmentInput]


#  In-memory analytics (stateless per request) 

def _pct(n: int, d: int) -> float:
    return round(n / d * 100, 1) if d > 0 else 0.0


def _build_judge_metrics(records: list[ParsedJudgment], judge_name: str) -> dict:
    recs = [r for r in records if judge_name.lower() in (n.lower() for n in r.judge_names)]
    total = len(recs)
    if total == 0:
        return {"judge": judge_name, "total_cases": 0}

    allowed = sum(1 for r in recs if r.outcome == "ALLOWED")
    dismissed = sum(1 for r in recs if r.outcome == "DISMISSED")
    bail_recs = [r for r in recs if r.bail_decision]
    bail_granted = sum(1 for r in bail_recs if r.bail_decision == "GRANTED")
    convicted = sum(1 for r in recs if r.outcome == "CONVICTED")
    acquitted = sum(1 for r in recs if r.outcome == "ACQUITTED")
    criminal_trials = convicted + acquitted

    section_freq: dict[str, int] = {}
    for r in recs:
        for s in r.ipc_sections + r.crpc_sections:
            section_freq[s] = section_freq.get(s, 0) + 1
    top_sections = sorted(section_freq.items(), key=lambda x: x[1], reverse=True)[:10]

    return {
        "judge": judge_name,
        "total_cases": total,
        "allow_rate": _pct(allowed, total),
        "dismiss_rate": _pct(dismissed, total),
        "bail_grant_rate": _pct(bail_granted, len(bail_recs)),
        "conviction_rate": _pct(convicted, criminal_trials),
        "acquittal_rate": _pct(acquitted, criminal_trials),
        "constitutional_cases": sum(1 for r in recs if r.is_constitutional),
        "top_sections": [{"section": s, "count": c} for s, c in top_sections],
    }


def _build_court_metrics(records: list[ParsedJudgment], court_name: str) -> dict:
    recs = [r for r in records if court_name.lower() in r.court.lower()]
    total = len(recs)
    if total == 0:
        return {"court": court_name, "total_cases": 0}

    allowed = sum(1 for r in recs if r.outcome == "ALLOWED")
    dismissed = sum(1 for r in recs if r.outcome == "DISMISSED")
    bail_recs = [r for r in recs if r.bail_decision]
    bail_granted = sum(1 for r in bail_recs if r.bail_decision == "GRANTED")
    convicted = sum(1 for r in recs if r.outcome == "CONVICTED")
    acquitted = sum(1 for r in recs if r.outcome == "ACQUITTED")
    criminal_trials = convicted + acquitted

    by_year: dict[int, list] = {}
    for r in recs:
        by_year.setdefault(r.year, []).append(r)
    trend = [
        {"year": y, "cases": len(yr), "allow_rate": _pct(sum(1 for r in yr if r.outcome == "ALLOWED"), len(yr))}
        for y, yr in sorted(by_year.items())
    ]

    return {
        "court": court_name,
        "total_cases": total,
        "allow_rate": _pct(allowed, total),
        "dismiss_rate": _pct(dismissed, total),
        "bail_grant_rate": _pct(bail_granted, len(bail_recs)),
        "conviction_rate": _pct(convicted, criminal_trials),
        "acquittal_rate": _pct(acquitted, criminal_trials),
        "outcome_trend": trend,
    }


#  Routes 

@router.post("/parse")
async def parse_single(req: JudgmentInput):
    """Parse a single judgment and return structured data."""
    try:
        parsed = parse_judgment(req.case_id, req.text)
        return {
            "case_id": parsed.case_id,
            "judge_names": parsed.judge_names,
            "court": parsed.court,
            "year": parsed.year,
            "month": parsed.month,
            "outcome": parsed.outcome,
            "bail_decision": parsed.bail_decision,
            "ipc_sections": parsed.ipc_sections,
            "crpc_sections": parsed.crpc_sections,
            "offences": parsed.offences,
            "is_constitutional": parsed.is_constitutional,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/bulk-parse")
async def bulk_parse(req: BulkAnalyticsRequest):
    """Parse multiple judgments and return analytics."""
    try:
        records = [parse_judgment(j.case_id, j.text) for j in req.judgments]
        all_judges = list({n for r in records for n in r.judge_names})
        all_courts = list({r.court for r in records})
        return {
            "total_parsed": len(records),
            "judges": [_build_judge_metrics(records, j) for j in all_judges],
            "courts": [_build_court_metrics(records, c) for c in all_courts],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/judge/{judge_name}")
async def judge_analytics(judge_name: str, req: BulkAnalyticsRequest):
    """Get analytics for a specific judge."""
    try:
        records = [parse_judgment(j.case_id, j.text) for j in req.judgments]
        return _build_judge_metrics(records, judge_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/court/{court_name}")
async def court_analytics(court_name: str, req: BulkAnalyticsRequest):
    """Get analytics for a specific court."""
    try:
        records = [parse_judgment(j.case_id, j.text) for j in req.judgments]
        return _build_court_metrics(records, court_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
