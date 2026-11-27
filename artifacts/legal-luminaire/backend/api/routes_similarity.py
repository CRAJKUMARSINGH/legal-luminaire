"""
Similarity API Routes
FastAPI routes for Phase 4: Case Similarity Engine
"""

from __future__ import annotations
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from agents.case_similarity import (
    extract_features, find_similar_cases, score_similarity,
    CaseFeatures, SimilarityScore,
)

router = APIRouter(prefix="/api/similarity", tags=["similarity"])


class CaseInput(BaseModel):
    case_id: str
    title: str
    court: str
    year: int
    text: str
    citation_count: int = 0


class SimilarityRequest(BaseModel):
    query: CaseInput
    corpus: list[CaseInput]
    min_score: float = 30.0
    max_results: int = 15


class SimilarityResponse(BaseModel):
    results: list[dict]
    total: int
    exact: int
    analogous: int
    weak: int
    rejected: int
    avg_score: float


@router.post("/find", response_model=SimilarityResponse)
async def find_similar(req: SimilarityRequest):
    """Find cases similar to the query from the provided corpus."""
    try:
        query_features = extract_features(
            req.query.case_id, req.query.title, req.query.court,
            req.query.year, req.query.text, req.query.citation_count,
        )
        corpus_features = [
            extract_features(c.case_id, c.title, c.court, c.year, c.text, c.citation_count)
            for c in req.corpus
        ]
        results = find_similar_cases(
            query_features, corpus_features,
            min_score=req.min_score, max_results=req.max_results,
        )
        from collections import Counter
        tier_counts = Counter(r.tier.value for r in results)
        avg = round(sum(r.total_score for r in results) / len(results), 1) if results else 0.0
        return SimilarityResponse(
            results=[{
                "case_id": r.case_id, "title": r.title, "court": r.court,
                "year": r.year, "total_score": r.total_score, "tier": r.tier.value,
                "matched_issues": r.matched_issues, "matched_sections": r.matched_sections,
                "explanation": r.explanation,
                "breakdown": {
                    "keyword": r.keyword_score, "issue": r.issue_score,
                    "citation": r.citation_score, "court": r.court_score,
                },
            } for r in results],
            total=len(results),
            exact=tier_counts.get("EXACT", 0),
            analogous=tier_counts.get("ANALOGOUS", 0),
            weak=tier_counts.get("WEAK", 0),
            rejected=tier_counts.get("REJECTED", 0),
            avg_score=avg,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/score")
async def score_pair(query: CaseInput, candidate: CaseInput):
    """Score similarity between exactly two cases."""
    try:
        q = extract_features(query.case_id, query.title, query.court, query.year, query.text, query.citation_count)
        c = extract_features(candidate.case_id, candidate.title, candidate.court, candidate.year, candidate.text, candidate.citation_count)
        result = score_similarity(q, c)
        return {
            "total_score": result.total_score, "tier": result.tier.value,
            "matched_issues": result.matched_issues, "matched_sections": result.matched_sections,
            "explanation": result.explanation,
            "breakdown": {
                "keyword": result.keyword_score, "issue": result.issue_score,
                "citation": result.citation_score, "court": result.court_score,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
