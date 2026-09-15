"""
FastAPI routes for Legal Luminaire backend.
Week 3 Enrichment: Document Pipeline, Contradiction Detection, Observability, Rate Limiting
"""
from __future__ import annotations

import asyncio
import logging
import re
import shutil
import time
import uuid
from collections import Counter, defaultdict
from pathlib import Path
from typing import Literal, Optional, Any

from fastapi import APIRouter, BackgroundTasks, Body, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from config import settings
from rag.document_store import (
    ingest_files,
    get_retriever,
    case_has_documents,
    get_case_doc_count,
)
from agents.crew import run_legal_crew
from api.models import (
    ResearchRequest,
    ResearchResponse,
    UploadResponse,
    SimpleUploadResponse,
    CaseStatusResponse,
    HealthResponse,
    TaskOutput,
    ContradictionItem,
    ContradictionDetectionResponse,
    TraceSpan,
    SessionUsageReport,
    ObservabilityResponse,
)

router = APIRouter()
logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".pdf", ".md", ".txt", ".lex", ".doc", ".docx", ".jpg", ".jpeg", ".png"}

# ── In-memory job store for async research/draft jobs ─────────────────────────
# Maps job_id → {"status": "pending"|"running"|"done"|"error", "result": ...}
_jobs: dict[str, dict] = {}

# ── Week 3: Observability stores ──────────────────────────────────────────────
_trace_spans: dict[str, list[TraceSpan]] = defaultdict(list)
_session_usage: dict[str, SessionUsageReport] = {}
_case_sessions: dict[str, list[str]] = defaultdict(list)
_active_sessions: dict[str, str] = {}

COST_PER_1K_TOKENS = {
    "gpt-4o": 0.005,
    "gpt-4o-mini": 0.00015,
    "text-embedding-3-small": 0.00002,
}
APPROX_TOKENS_PER_CHAR = 0.25


def _get_or_create_session(request: Request, case_id: str = "") -> str:
    session_id = request.headers.get("X-Session-Id") or request.cookies.get("ll_session")
    if not session_id:
        session_id = f"sess-{uuid.uuid4().hex[:12]}"
    if session_id not in _session_usage:
        _session_usage[session_id] = SessionUsageReport(
            session_id=session_id,
            case_id=case_id,
            started_at=time.time(),
            last_active=time.time(),
        )
    if case_id and session_id not in _case_sessions.get(case_id, []):
        _case_sessions[case_id].append(session_id)
    _session_usage[session_id].case_id = case_id or _session_usage[session_id].case_id
    _session_usage[session_id].last_active = time.time()
    return session_id


def _record_request(request: Request, endpoint: str, case_id: str = "", approx_chars: int = 0) -> str:
    session_id = _get_or_create_session(request, case_id)
    session = _session_usage[session_id]
    session.total_requests += 1
    session.breakdown_by_endpoint[endpoint] = session.breakdown_by_endpoint.get(endpoint, 0) + 1
    approx_tokens = max(1, int(approx_chars * APPROX_TOKENS_PER_CHAR))
    session.total_tokens_approx += approx_tokens
    model_key = settings.llm_model if settings.llm_model in COST_PER_1K_TOKENS else "gpt-4o"
    session.total_cost_usd_approx += (approx_tokens / 1000) * COST_PER_1K_TOKENS[model_key]
    return session_id


def _start_span(session_id: str, name: str, agent: str = "", metadata: dict = None) -> str:
    span_id = f"span-{uuid.uuid4().hex[:8]}"
    span = TraceSpan(
        span_id=span_id,
        name=name,
        agent=agent,
        start_time=time.time(),
        status="running",
        metadata=metadata or {},
    )
    _trace_spans[session_id].append(span)
    session = _session_usage.get(session_id)
    if session:
        session.spans.append(span)
    return span_id


def _end_span(session_id: str, span_id: str, status: str = "ok", metadata: dict = None) -> None:
    spans = _trace_spans.get(session_id, [])
    for span in spans:
        if span.span_id == span_id:
            span.end_time = time.time()
            span.duration_ms = (span.end_time - span.start_time) * 1000
            span.status = status
            if metadata:
                span.metadata.update(metadata)
            break
    session = _session_usage.get(session_id)
    if session:
        for span in session.spans:
            if span.span_id == span_id:
                span.end_time = time.time()
                span.duration_ms = (span.end_time - span.start_time) * 1000
                span.status = status
                if metadata:
                    span.metadata.update(metadata)
                break


def _evaluate_citation_gate(text: str) -> dict:
    """
    Server-side citation status gate.
    Blocks downstream export when PENDING/FATAL_ERROR appears in output.
    """
    normalized = (text or "").upper()
    statuses = {
        "COURT_SAFE": len(re.findall(r"\bCOURT_SAFE\b", normalized)),
        "VERIFIED": len(re.findall(r"\bVERIFIED\b", normalized)),
        "SECONDARY": len(re.findall(r"\bSECONDARY\b", normalized)),
        "PENDING": len(re.findall(r"\bPENDING\b", normalized)),
        "FATAL_ERROR": len(re.findall(r"\bFATAL_ERROR\b", normalized)),
    }
    must_block = statuses["PENDING"] > 0 or statuses["FATAL_ERROR"] > 0
    needs_ack = statuses["SECONDARY"] > 0 and not must_block
    return {
        "statuses": statuses,
        "must_block": must_block,
        "needs_ack": needs_ack,
        "download_allowed": not must_block,
    }


def _safe_filename(name: str) -> str:
    base = Path(name).name
    base = "".join(ch for ch in base if ch.isprintable() and ch not in {"\x00", "\n", "\r", "\t"})
    return base.strip() or "upload.bin"


def _run_crew_job(job_id: str, req: ResearchRequest, case_context: str) -> None:
    """Executed in a background thread — runs the crew and stores result."""
    _jobs[job_id]["status"] = "running"
    try:
        # Use standard CrewAI pipeline
        crew_result = run_legal_crew(
            query=req.query,
            case_context=case_context,
            incident_type=req.incident_type,
            evidence_type=req.evidence_type,
            procedural_defects=req.procedural_defects,
            mode=req.mode,
        )
        
        # Server-side citation gate enforcement to prevent UI bypass.
        citation_gate = _evaluate_citation_gate(crew_result.get("draft", ""))
        crew_result["citation_gate"] = citation_gate
        if citation_gate["must_block"]:
            crew_result["success"] = False
            crew_result["draft"] = ""
            block_msg = (
                "Citation gate blocked output due to unresolved "
                f"PENDING={citation_gate['statuses']['PENDING']} or "
                f"FATAL_ERROR={citation_gate['statuses']['FATAL_ERROR']}."
            )
            crew_result["error"] = f"{crew_result.get('error', '')} {block_msg}".strip()
        _jobs[job_id]["status"] = "done"
        _jobs[job_id]["result"] = crew_result
    except Exception as e:
        logger.error(f"Crew job {job_id} failed: {e}", exc_info=True)
        _jobs[job_id]["status"] = "error"
        _jobs[job_id]["result"] = {"success": False, "draft": "", "tasks_output": [], "error": str(e)}


async def _run_crew_job_async(job_id: str, req: ResearchRequest, case_context: str) -> None:
    """Async version for Harvey.ai integration."""
    _jobs[job_id]["status"] = "running"
    try:
        # Use Harvey.ai if enabled and configured
        if req.use_harvey and settings.harvey_enabled and settings.harvey_api_key:
            logger.info(f"Using Harvey.ai for job {job_id}")
            from agents.harvey_client import HarveyClient
            harvey_client = HarveyClient(
                api_key=settings.harvey_api_key,
                region=settings.harvey_region
            )
            
            # Build Harvey prompt from request parameters
            harvey_prompt = f"""
            Case Context: {case_context}
            
            Query: {req.query}
            Incident Type: {req.incident_type}
            Evidence Type: {req.evidence_type}
            Procedural Defects: {', '.join(req.procedural_defects)}
            Mode: {req.mode}
            Expertise Level: {req.expertise_hint}
            
            Please provide a legal-grade response with citations for Indian courts.
            """
            
            result = await harvey_client.completion(
                prompt=harvey_prompt,
                model=settings.harvey_model,
                include_citations=settings.harvey_include_citations,
                mode="draft" if req.mode == "draft" else "assist"
            )
            
            # Format Harvey response to match crew response structure
            crew_result = {
                "success": True,
                "draft": result.get("response", ""),
                "tasks_output": [
                    {"agent": "Harvey.ai", "output": result.get("response", "")}
                ],
                "citations": result.get("citations", []),
                "source": "harvey"
            }
        else:
            # Fallback to standard CrewAI pipeline
            crew_result = run_legal_crew(
                query=req.query,
                case_context=case_context,
                incident_type=req.incident_type,
                evidence_type=req.evidence_type,
                procedural_defects=req.procedural_defects,
                mode=req.mode,
            )
        
        # Server-side citation gate enforcement to prevent UI bypass.
        citation_gate = _evaluate_citation_gate(crew_result.get("draft", ""))
        crew_result["citation_gate"] = citation_gate
        if citation_gate["must_block"]:
            crew_result["success"] = False
            crew_result["draft"] = ""
            block_msg = (
                "Citation gate blocked output due to unresolved "
                f"PENDING={citation_gate['statuses']['PENDING']} or "
                f"FATAL_ERROR={citation_gate['statuses']['FATAL_ERROR']}."
            )
            crew_result["error"] = f"{crew_result.get('error', '')} {block_msg}".strip()
        _jobs[job_id]["status"] = "done"
        _jobs[job_id]["result"] = crew_result
    except Exception as e:
        logger.error(f"Crew job {job_id} failed: {e}", exc_info=True)
        _jobs[job_id]["status"] = "error"
        _jobs[job_id]["result"] = {"success": False, "draft": "", "tasks_output": [], "error": str(e)}


# ── Health ─────────────────────────────────────────────────────────────────────

@router.get("/health", response_model=HealthResponse)
async def health():
    """
    Backend health-check endpoint.
    Returns service status, API-key configuration flags, and ChromaDB path readiness.
    Mounted at GET /api/v1/health (via main.py prefix /api/v1).
    """
    chroma_ok = True
    try:
        settings.chroma_path.mkdir(parents=True, exist_ok=True)
    except Exception:
        chroma_ok = False

    return HealthResponse(
        status="ok",
        openai_configured=bool(settings.openai_api_key),
        tavily_configured=bool(settings.tavily_api_key),
        chroma_ready=chroma_ok,
    )


# ── File Upload & Indexing ─────────────────────────────────────────────────────

@router.post("/cases/{case_id}/upload", response_model=UploadResponse)
async def upload_documents(
    case_id: str,
    files: list[UploadFile] = File(...),
):
    """Upload case documents and index them into ChromaDB.
    Week 2: emits structured doc_upload event with case_id for observability.
    """
    logger.info(
        "case_event",
        extra={
            "event": "doc_upload_start",
            "case_id": case_id,
            "files_count": len(files),
        }
    )

    case_dir = settings.case_docs_path / case_id
    case_dir.mkdir(parents=True, exist_ok=True)

    saved_paths: list[Path] = []
    errors: list[str] = []

    for upload in files:
        raw_name = upload.filename or ""
        safe_name = _safe_filename(raw_name)
        suffix = Path(safe_name).suffix.lower()
        if suffix not in ALLOWED_EXTENSIONS:
            errors.append(f"{raw_name}: unsupported type {suffix}")
            continue
        dest = case_dir / (safe_name or f"file{suffix}")
        if dest.exists():
            stem = dest.stem
            dest = dest.with_name(f"{stem}-{upload.size}{suffix}")
        try:
            with dest.open("wb") as f:
                shutil.copyfileobj(upload.file, f)
            saved_paths.append(dest)
        except Exception as e:
            errors.append(f"{raw_name}: save failed — {e}")

    if not saved_paths:
        logger.warning(
            "case_event",
            extra={
                "event": "doc_upload_no_valid_files",
                "case_id": case_id,
                "errors_count": len(errors),
            }
        )
        return UploadResponse(
            success=False,
            case_id=case_id,
            errors=errors or ["No valid files uploaded"],
        )

    summary = ingest_files(case_id, saved_paths)
    total_chunks = sum(item.get("chunks", 0) for item in summary["indexed"])

    logger.info(
        "case_event",
        extra={
            "event": "doc_upload_complete",
            "case_id": case_id,
            "indexed_count": len(summary["indexed"]),
            "skipped_count": len(summary["skipped"]),
            "total_chunks": total_chunks,
            "errors_count": len(errors) + len(summary["errors"]),
        }
    )

    return UploadResponse(
        success=True,
        case_id=case_id,
        indexed=summary["indexed"],
        skipped=summary["skipped"],
        errors=errors + summary["errors"],
        total_chunks=total_chunks,
    )


# ── Case Status ────────────────────────────────────────────────────────────────

@router.get("/cases/{case_id}/status", response_model=CaseStatusResponse)
async def case_status(case_id: str):
    return CaseStatusResponse(
        case_id=case_id,
        has_documents=case_has_documents(case_id),
        doc_count=get_case_doc_count(case_id),
    )


# ── Research & Draft ───────────────────────────────────────────────────────────

# Legacy implementation retained temporarily for reference. The registered
# implementation below is the canonical route and includes observability.
async def _legacy_run_research(case_id: str, req: ResearchRequest, background_tasks: BackgroundTasks):
    """
    Enqueue a multi-agent research/draft job. Returns a job_id immediately.
    Poll GET /cases/{case_id}/research/{job_id} for status and result.
    mode='research' → precedent search + verification only
    mode='draft'    → full discharge application generation
    Week 2: structured case_event logging with case_id scope for observability.
    """
    logger.info(
        "case_event",
        extra={
            "event": "research_start",
            "case_id": case_id,
            "mode": req.mode,
            "offline_mock": req.offline_mock,
            "use_harvey": req.use_harvey,
            "query_length": len(req.query),
        }
    )

    if req.offline_mock:
        job_id = str(uuid.uuid4())
        _jobs[job_id] = {"status": "done", "result": None, "case_id": case_id, "mode": req.mode}

        if req.mode == "draft":
            draft = (
                "[MOCK_DRAFT — OFFLINE]\n\n"
                "IN THE COURT OF THE LEARNED SESSIONS JUDGE, UDAIPUR\n\n"
                "Application for Discharge (Mock)\n\n"
                "GROUND 1: Foundational Scientific Error\n"
                "The FSL report relies on IS 1199:2018 for hardened masonry mortar, which is inapplicable. "
                "Correct reference: IS 2250:1981 for masonry mortar. [PENDING]\n\n"
                "GROUND 2: Sampling Protocol Breach\n"
                "No panchnama and no sealing record were produced. Chain-of-custody is unproven. [SECONDARY]\n\n"
                "PRAYER\n"
                "In view of the above defects, the accused prays for discharge.\n"
            )
        else:
            draft = (
                "[MOCK_RESEARCH — OFFLINE]\n\n"
                "1) Standard mismatch identified: IS 1199:2018 vs IS 2250:1981. [PENDING]\n"
                "2) Sampling protocol concerns: panchnama / sealing / custody. [SECONDARY]\n"
            )

        citation_gate = _evaluate_citation_gate(draft)
        result = {
            "success": not citation_gate["must_block"],
            "draft": "" if citation_gate["must_block"] else draft,
            "tasks_output": [
                {"agent": "OFFLINE_MOCK", "output": draft}
            ],
            "error": (
                "Offline mock produced blocked markers (PENDING/FATAL_ERROR)." if citation_gate["must_block"] else None
            ),
            "citation_gate": citation_gate,
        }
        _jobs[job_id]["result"] = result

        logger.info(
            "case_event",
            extra={
                "event": "research_mock_complete",
                "case_id": case_id,
                "job_id": job_id,
                "mode": req.mode,
                "blocked_by_gate": citation_gate["must_block"],
            }
        )

        return {
            "job_id": job_id,
            "status": "done",
            "case_id": case_id,
            "mode": req.mode,
            "poll_url": f"/api/v1/cases/{case_id}/research/{job_id}",
        }

    if not settings.openai_api_key:
        logger.warning(
            "case_event",
            extra={
                "event": "research_blocked_no_api_key",
                "case_id": case_id,
            }
        )
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY not configured. Add it to backend/.env",
        )

    case_context = ""
    if case_has_documents(case_id):
        try:
            retriever = get_retriever(case_id, k=10)
            docs = retriever.invoke(req.query)
            case_context = "\n\n---\n\n".join(
                f"[Source: {d.metadata.get('source_file', 'unknown')}]\n{d.page_content}"
                for d in docs
            )
            logger.info(
                "case_event",
                extra={
                    "event": "research_rag_retrieved",
                    "case_id": case_id,
                    "rag_docs_count": len(docs),
                }
            )
        except Exception as e:
            logger.warning(
                "case_event",
                extra={
                    "event": "research_rag_failed",
                    "case_id": case_id,
                    "error": str(e),
                }
            )
            case_context = f"[RAG unavailable: {e}]"
    else:
        case_context = "[No documents uploaded for this case. Using query only.]"
        logger.info(
            "case_event",
            extra={
                "event": "research_no_documents",
                "case_id": case_id,
            }
        )

    job_id = str(uuid.uuid4())
    _jobs[job_id] = {"status": "pending", "result": None, "case_id": case_id, "mode": req.mode}

    if req.use_harvey:
        asyncio.create_task(_run_crew_job_async(job_id, req, case_context))
    else:
        background_tasks.add_task(_run_crew_job, job_id, req, case_context)

    logger.info(
        "case_event",
        extra={
            "event": "research_queued",
            "case_id": case_id,
            "job_id": job_id,
            "mode": req.mode,
            "use_harvey": req.use_harvey,
        }
    )

    return {
        "job_id": job_id,
        "status": "pending",
        "case_id": case_id,
        "mode": req.mode,
        "poll_url": f"/api/v1/cases/{case_id}/research/{job_id}",
    }


@router.get("/cases/{case_id}/research/{job_id}", response_model=ResearchResponse)
async def get_research_result(case_id: str, job_id: str):
    """Poll for research/draft job result."""
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")

    status = job["status"]

    if status in ("pending", "running"):
        return ResearchResponse(
            success=False,
            case_id=case_id,
            mode=job.get("mode", ""),
            draft="",
            error=f"Job {status} — poll again shortly",
            doc_count=get_case_doc_count(case_id),
            citation_gate={},
        )

    result = job["result"] or {}
    return ResearchResponse(
        success=result.get("success", False),
        case_id=case_id,
        mode=job.get("mode", ""),
        draft=result.get("draft", ""),
        tasks_output=[
            TaskOutput(agent=t["agent"], output=t["output"])
            for t in result.get("tasks_output", [])
        ],
        error=result.get("error"),
        doc_count=get_case_doc_count(case_id),
        citation_gate=result.get("citation_gate", {}),
    )


# ── On-demand Citation Verification ───────────────────────────────────────────

@router.get("/verify-citation")
async def verify_citation(case_name: str, citation: str = "", case_id: Optional[str] = None):
    """
    On-demand verification of a single case citation.
    Searches Indian Kanoon + web for the case.
    Accepts optional case_id query param for case-scoped verification logging.
    Returns: found/not_found, URL, snippet, confidence.
    """
    logger.info(
        "case_event",
        extra={
            "event": "single_citation_verify_start",
            "case_id": case_id or "unspecified",
            "case_name": case_name[:80],
        }
    )
    from agents.tools import indian_kanoon_search, web_search
    try:
        ik_result = indian_kanoon_search.invoke(case_name)
        web_result = web_search.invoke(f"{case_name} {citation} judgment holding")
        found = "NOT FOUND" not in ik_result.upper()
        result = {
            "case_name": case_name,
            "citation": citation,
            "found_on_indian_kanoon": found,
            "indian_kanoon_result": ik_result[:800],
            "web_result": web_result[:800],
            "confidence": "HIGH" if found else "LOW",
            "recommendation": "SAFE TO USE" if found else "PENDING — obtain certified copy",
        }
        logger.info(
            "case_event",
            extra={
                "event": "single_citation_verify_complete",
                "case_id": case_id or "unspecified",
                "case_name": case_name[:80],
                "found": found,
            }
        )
        return result
    except Exception as e:
        logger.error(
            "case_event",
            extra={
                "event": "single_citation_verify_failed",
                "case_id": case_id or "unspecified",
                "error": str(e),
            }
        )
        return {"error": str(e), "case_name": case_name}


# ── On-demand Standards Verification ──────────────────────────────────────────

@router.get("/verify-standard")
async def verify_standard(code: str):
    """
    On-demand verification of an IS/ASTM/BS standard.
    Returns: scope, applicability, key clauses, source URL.
    """
    from agents.tools import verify_is_standard
    try:
        result = verify_is_standard.invoke(code)
        return {"code": code, "result": result}
    except Exception as e:
        return {"error": str(e), "code": code}


# ── Chat / Iterative Refinement ────────────────────────────────────────────────

class ChatRequest(BaseModel):
    case_id: str
    message: str
    history: list[dict] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = Field(default_factory=list)
    verification_notes: list[str] = Field(default_factory=list)


async def _chat_impl(case_id: str, message: str, history: list[dict]):
    """Internal shared chat implementation used by both route variants."""
    logger.info(
        "case_event",
        extra={
            "event": "chat_start",
            "case_id": case_id,
            "history_length": len(history),
            "message_length": len(message),
        }
    )

    if not settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY not configured.")

    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

    case_context = ""
    docs = []
    if case_has_documents(case_id):
        try:
            retriever = get_retriever(case_id, k=5)
            docs = retriever.invoke(message)
            case_context = "\n".join(
                f"[{d.metadata.get('source_file', 'doc')}]: {d.page_content[:400]}"
                for d in docs
            )
        except Exception:
            pass

    llm = ChatOpenAI(
        model=settings.llm_model,
        temperature=0.1,
        openai_api_key=settings.openai_api_key,
    )

    system = f"""You are a senior advocate specialising in Indian construction-law defence.
You are assisting with case {case_id}.

CASE CONTEXT FROM UPLOADED DOCUMENTS:
{case_context or '[No documents uploaded]'}

RULES:
- Answer only from verified facts and uploaded documents.
- If you cite a case, include the full citation.
- If you are unsure, say so and recommend verification.
- Use Hindi legal terminology where appropriate.
- Never hallucinate citations or IS clause numbers."""

    messages = [SystemMessage(content=system)]
    for h in history[-6:]:
        if h.get("role") == "user":
            messages.append(HumanMessage(content=h["content"]))
        elif h.get("role") == "assistant":
            messages.append(AIMessage(content=h["content"]))
    messages.append(HumanMessage(content=message))

    try:
        response = llm.invoke(messages)
        reply = str(response.content)
        logger.info(
            "case_event",
            extra={
                "event": "chat_complete",
                "case_id": case_id,
                "reply_length": len(reply),
                "sources_count": len(docs or []),
            }
        )
        return ChatResponse(
            reply=reply,
            sources=[d.metadata.get("source_file", "") for d in (docs or [])],
            verification_notes=[],
        )
    except Exception as e:
        logger.error(
            "case_event",
            extra={
                "event": "chat_failed",
                "case_id": case_id,
                "error": str(e),
            }
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Chat interface for iterative refinement.
    Legacy route: case_id provided in request body.
    Prefer /cases/{case_id}/chat for new integrations.
    """
    return await _chat_impl(req.case_id, req.message, req.history)


@router.post("/cases/{case_id}/chat", response_model=ChatResponse)
async def chat_for_case(case_id: str, message: str = Body(...), history: list[dict] = Body(default_factory=list)):
    """
    Chat interface scoped to a specific case via URL path.
    Week 2 multi-case route.
    """
    return await _chat_impl(case_id, message, history)


# ── Preload Case 01 Documents ──────────────────────────────────────────────────

@router.post("/cases/case01/preload")
async def preload_case01():
    """
    Pre-load all CASE01_HEMRAJ_STATE_2025 documents into ChromaDB.
    Indexes: defence reports, discharge applications, standards matrices, etc.
    """
    from repo_paths import hemraj_case_dir, workspace_root

    case_id = "case01"
    case_dir = hemraj_case_dir()
    if not case_dir.exists():
        legacy = workspace_root() / "CASE01_HEMRAJ_STATE_2025"
        if legacy.exists():
            case_dir = legacy

    if not case_dir.exists():
        return {"success": False, "error": f"CASE01_HEMRAJ_STATE_2025 directory not found at {case_dir}"}

    # Collect all indexable files
    extensions = {".md", ".txt", ".lex", ".pdf"}
    files = [f for f in case_dir.rglob("*") if f.suffix.lower() in extensions and f.is_file()]

    if not files:
        return {"success": False, "error": "No indexable files found in CASE01_HEMRAJ_STATE_2025"}

    summary = ingest_files(case_id, files)
    total = sum(item.get("chunks", 0) for item in summary["indexed"])

    return {
        "success": True,
        "case_id": case_id,
        "files_indexed": len(summary["indexed"]),
        "total_chunks": total,
        "skipped": summary["skipped"],
        "errors": summary["errors"],
    }


# ── Week 3.1: Standalone Upload Endpoint ──────────────────────────────────────

@router.post("/upload-document", response_model=SimpleUploadResponse)
async def upload_document_standalone(
    request: Request,
    file: UploadFile = File(...),
    case_id: str = Form("default-case"),
):
    """
    Week 3: Standalone single-file upload endpoint.
    Matches the frontend UploadView contract (POST /api/v1/upload-document).
    Uploads a single document, indexes it into the case's vector store,
    and returns a simple {success, message} response.

    Frontend: UploadView.tsx calls this endpoint via FormData.
    """
    session_id = _record_request(request, "upload-document", case_id, file.size or 0)
    span_id = _start_span(session_id, "upload_document_standalone", "pipeline",
                          {"filename": file.filename, "case_id": case_id})

    case_dir = settings.case_docs_path / case_id
    case_dir.mkdir(parents=True, exist_ok=True)

    raw_name = file.filename or ""
    safe_name = _safe_filename(raw_name)
    suffix = Path(safe_name).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        _end_span(session_id, span_id, "error", {"reason": "unsupported_type"})
        return SimpleUploadResponse(
            success=False,
            message=f"Unsupported file type: {suffix}. Allowed: PDF, MD, DOCX, JPG, PNG.",
            case_id=case_id,
        )

    dest = case_dir / (safe_name or f"file-{uuid.uuid4().hex[:6]}{suffix}")
    if dest.exists():
        stem = dest.stem
        dest = dest.with_name(f"{stem}-{file.size or 'dup'}{suffix}")

    try:
        with dest.open("wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        _end_span(session_id, span_id, "error", {"reason": "save_failed", "error": str(e)})
        return SimpleUploadResponse(
            success=False,
            message=f"Failed to save file: {e}",
            case_id=case_id,
        )

    try:
        summary = ingest_files(case_id, [dest])
        indexed_count = len(summary["indexed"])
        total_chunks = sum(item.get("chunks", 0) for item in summary["indexed"])
        errors = summary["errors"]

        logger.info(
            "case_event",
            extra={
                "event": "upload_document_complete",
                "case_id": case_id,
                "filename": safe_name,
                "indexed_count": indexed_count,
                "total_chunks": total_chunks,
                "session_id": session_id,
            }
        )

        if errors:
            msg = f"Indexed {indexed_count} file, {total_chunks} chunks. Warnings: {'; '.join(errors[:3])}"
        else:
            msg = f"Indexed {safe_name} — {total_chunks} chunks ready for RAG search."

        _end_span(session_id, span_id, "ok",
                  {"indexed_count": indexed_count, "total_chunks": total_chunks})

        return SimpleUploadResponse(
            success=True,
            message=msg,
            case_id=case_id,
            indexed_count=indexed_count,
            total_chunks=total_chunks,
        )
    except Exception as e:
        logger.error(f"Indexing failed for {dest}: {e}", exc_info=True)
        _end_span(session_id, span_id, "error", {"reason": "indexing_failed", "error": str(e)})
        return SimpleUploadResponse(
            success=False,
            message=f"File saved but indexing failed: {e}",
            case_id=case_id,
        )


# ── Week 3.2: Expanded Contradiction Detection ────────────────────────────────

_PARTY_NAME_PATTERNS = [
    re.compile(r"(?:accused|respondent|defendant|complainant|appellant|petitioner|plaintiff|state)\s*(?:of|[\s:.-])*\s*([A-Z][A-Za-z0-9.\s]{2,60}?)(?:[,.;\n]|vs|v\.|versus)", re.I),
    re.compile(r"([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,4})\s*(?:s/o|d/o|w/o|son\s+of|daughter\s+of|wife\s+of)", re.I),
]
_AMOUNT_PATTERNS = [
    re.compile(r"(?:Rs\.?|INR|₹|rupees?)\s*([\d,]+(?:\.\d+)?)", re.I),
    re.compile(r"([\d,]+(?:\.\d+)?)\s*(?:rupees?|Rs\.?)", re.I),
]
_LOCATION_PATTERNS = [
    re.compile(r"at\s+([A-Z][A-Za-z\s-]{3,40}?)(?:\s*(?:road|street|lane|avenue|colony|sector|village|town|city|district|mandal|tehsil))", re.I),
    re.compile(r"([A-Z][A-Za-z\s-]{3,40})\s*(?:district|tehsil|mandal)", re.I),
]
_DATE_PATTERNS = [
    re.compile(r"(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})"),
    re.compile(r"(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})", re.I),
]


def _extract_all(text: str, patterns: list[re.Pattern]) -> list[str]:
    found: list[str] = []
    for p in patterns:
        for m in p.finditer(text or ""):
            val = m.group(1).strip().rstrip(".,;: ")
            if 2 <= len(val) <= 80:
                found.append(val)
    return found


def _normalize_name(s: str) -> str:
    s = re.sub(r"[\s.]+", " ", s.lower()).strip()
    return re.sub(r"\b(shri|sri|smt|mt|mr|mrs|ms|dr|prof)\b", "", s).strip()


def _normalize_amount(s: str) -> float:
    try:
        return float(re.sub(r"[,]", "", s))
    except ValueError:
        return 0.0


def _jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def _detect_contradictions_from_docs(
    case_id: str,
    doc_contents: list[tuple[str, str]],
) -> list[ContradictionItem]:
    """
    Week 3: Rule-based contradiction detection covering:
    - DATE_MISMATCH (existing, now expanded patterns)
    - NAME_DISCREPANCY (party names across docs)
    - AMOUNT_MISMATCH (figures/amounts across docs)
    - LOCATION_MISMATCH (place names across docs)
    - FACTUAL_CONTRADICTION (key assertion differences)

    Works without any LLM API keys — fully deterministic.
    """
    contradictions: list[ContradictionItem] = []
    if len(doc_contents) < 2:
        return contradictions

    # Extract per-document field values
    per_doc: list[dict] = []
    for fname, content in doc_contents:
        per_doc.append({
            "file": fname,
            "names": _extract_all(content, _PARTY_NAME_PATTERNS),
            "amounts": _extract_all(content, _AMOUNT_PATTERNS),
            "locations": _extract_all(content, _LOCATION_PATTERNS),
            "dates": _extract_all(content, _DATE_PATTERNS),
        })

    # Compare pairs of documents
    counter = 0
    for i in range(len(per_doc)):
        for j in range(i + 1, len(per_doc)):
            a, b = per_doc[i], per_doc[j]

            # NAME_DISCREPANCY
            a_names = {_normalize_name(n) for n in a["names"] if len(_normalize_name(n)) > 2}
            b_names = {_normalize_name(n) for n in b["names"] if len(_normalize_name(n)) > 2}
            if a_names and b_names:
                overlap = _jaccard(a_names, b_names)
                if 0 < overlap < 0.4:
                    a_only = sorted(a_names - b_names)[:3]
                    b_only = sorted(b_names - a_names)[:3]
                    if a_only and b_only:
                        counter += 1
                        contradictions.append(ContradictionItem(
                            id=f"contra-name-{counter}",
                            type="NAME_DISCREPANCY",
                            description=f"Party names differ between {a['file']} and {b['file']}",
                            evidence_a=f"In {a['file']}: {', '.join(a_only)}",
                            evidence_b=f"In {b['file']}: {', '.join(b_only)}",
                            source_a="primary",
                            source_b="primary",
                            target_field="accused_names",
                            severity="MEDIUM" if overlap > 0.1 else "HIGH",
                        ))

            # AMOUNT_MISMATCH
            a_amounts = {_normalize_amount(x) for x in a["amounts"] if _normalize_amount(x) > 0}
            b_amounts = {_normalize_amount(x) for x in b["amounts"] if _normalize_amount(x) > 0}
            if a_amounts and b_amounts:
                exact_match = bool(a_amounts & b_amounts)
                if not exact_match and len(a_amounts) <= 5 and len(b_amounts) <= 5:
                    for amt_a in sorted(a_amounts)[:3]:
                        for amt_b in sorted(b_amounts)[:3]:
                            if amt_a != amt_b and min(amt_a, amt_b) > 0:
                                ratio = max(amt_a, amt_b) / max(min(amt_a, amt_b), 1)
                                if ratio > 1.1:
                                    counter += 1
                                    contradictions.append(ContradictionItem(
                                        id=f"contra-amount-{counter}",
                                        type="AMOUNT_MISMATCH",
                                        description=f"Amount discrepancy: ₹{amt_a:,.2f} vs ₹{amt_b:,.2f} ({ratio:.1f}x difference)",
                                        evidence_a=f"In {a['file']}: Rs. {amt_a:,.2f}",
                                        evidence_b=f"In {b['file']}: Rs. {amt_b:,.2f}",
                                        source_a="primary",
                                        source_b="primary",
                                        target_field="amount_in_dispute",
                                        severity="HIGH" if ratio > 2 else "MEDIUM",
                                    ))
                                    break
                        else:
                            continue
                        break

            # LOCATION_MISMATCH
            a_locs = {l.lower().strip() for l in a["locations"] if len(l) > 3}
            b_locs = {l.lower().strip() for l in b["locations"] if len(l) > 3}
            if a_locs and b_locs:
                overlap = _jaccard(a_locs, b_locs)
                if 0 < overlap < 0.3:
                    a_only = sorted(a_locs - b_locs)[:2]
                    b_only = sorted(b_locs - a_locs)[:2]
                    if a_only and b_only:
                        counter += 1
                        contradictions.append(ContradictionItem(
                            id=f"contra-loc-{counter}",
                            type="LOCATION_MISMATCH",
                            description=f"Location names differ between {a['file']} and {b['file']}",
                            evidence_a=f"In {a['file']}: {', '.join(a_only)}",
                            evidence_b=f"In {b['file']}: {', '.join(b_only)}",
                            source_a="primary",
                            source_b="primary",
                            target_field="jurisdiction",
                            severity="MEDIUM",
                        ))

            # DATE_MISMATCH — expanded
            a_dates = set(a["dates"])
            b_dates = set(b["dates"])
            if a_dates and b_dates and not (a_dates & b_dates):
                if len(a_dates) <= 5 and len(b_dates) <= 5:
                    counter += 1
                    sample_a = sorted(a_dates)[0]
                    sample_b = sorted(b_dates)[0]
                    contradictions.append(ContradictionItem(
                        id=f"contra-date-{counter}",
                        type="DATE_MISMATCH",
                        description=f"Dates do not overlap between {a['file']} and {b['file']}",
                        evidence_a=f"In {a['file']}: {sample_a}" + (f" (+{len(a_dates)-1} more)" if len(a_dates) > 1 else ""),
                        evidence_b=f"In {b['file']}: {sample_b}" + (f" (+{len(b_dates)-1} more)" if len(b_dates) > 1 else ""),
                        source_a="primary",
                        source_b="primary",
                        target_field="timeline_events",
                        severity="HIGH",
                    ))

            # FACTUAL_CONTRADICTION — keyword-based assertion polarity
            FACTUAL_KEYWORDS = ["present", "absent", "sealed", "unsealed", "signed", "unsigned",
                                "witnessed", "not witnessed", "admitted", "denied",
                                "confiscated", "not confiscated", "received", "not received"]
            a_text_lower = (doc_contents[i][1] or "").lower()
            b_text_lower = (doc_contents[j][1] or "").lower()
            for kw in FACTUAL_KEYWORDS:
                neg_kw = f"not {kw}" if not kw.startswith("not ") else kw.replace("not ", "", 1)
                if kw in a_text_lower and neg_kw in b_text_lower:
                    counter += 1
                    contradictions.append(ContradictionItem(
                        id=f"contra-fact-{counter}",
                        type="FACTUAL_CONTRADICTION",
                        description=f"Opposing factual assertions: '{kw}' vs '{neg_kw}'",
                        evidence_a=f"In {a['file']}: found '{kw}' assertion",
                        evidence_b=f"In {b['file']}: found '{neg_kw}' assertion",
                        source_a="primary",
                        source_b="primary",
                        target_field="factual_assertions",
                        severity="HIGH",
                    ))
                    break

    return contradictions


@router.post("/cases/{case_id}/detect-contradictions", response_model=ContradictionDetectionResponse)
async def detect_contradictions_expanded(case_id: str, request: Request):
    """
    Week 3.2: Expanded contradiction detection.
    Covers: DATE_MISMATCH, NAME_DISCREPANCY, AMOUNT_MISMATCH,
            LOCATION_MISMATCH, FACTUAL_CONTRADICTION.

    Scans all uploaded primary-source documents for the case and runs
    fully deterministic rule-based detection. No LLM API keys required.
    """
    session_id = _record_request(request, "detect_contradictions", case_id)
    span_id = _start_span(session_id, "detect_contradictions", "verifier", {"case_id": case_id})

    case_dir = settings.case_docs_path / case_id
    doc_contents: list[tuple[str, str]] = []

    if case_dir.exists():
        read_exts = {".txt", ".md", ".lex"}
        for fpath in sorted(case_dir.rglob("*")):
            if not fpath.is_file():
                continue
            ext = fpath.suffix.lower()
            try:
                if ext in read_exts:
                    content = fpath.read_text(encoding="utf-8", errors="ignore")
                    doc_contents.append((fpath.name, content))
                elif ext == ".pdf":
                    try:
                        from langchain_community.document_loaders import PyPDFLoader
                        loader = PyPDFLoader(str(fpath))
                        pages = loader.load()
                        content = "\n".join(p.page_content for p in pages)
                        if content.strip():
                            doc_contents.append((fpath.name, content))
                    except Exception:
                        pass
            except Exception:
                continue

    contradictions = _detect_contradictions_from_docs(case_id, doc_contents)
    by_type = dict(Counter(c.type for c in contradictions))

    n_docs = len(doc_contents)
    n_contra = len(contradictions)
    if n_contra == 0:
        summary = (f"No contradictions detected across {n_docs} primary-source document(s). "
                   "All dates, names, amounts, locations, and assertions are internally consistent.")
    else:
        high_count = sum(1 for c in contradictions if c.severity == "HIGH")
        summary = (f"Found {n_contra} contradiction(s) across {n_docs} document(s): "
                   f"{high_count} HIGH severity. Breakdown: "
                   + ", ".join(f"{k}={v}" for k, v in by_type.items()))

    _end_span(session_id, span_id, "ok",
              {"n_docs": n_docs, "n_contradictions": n_contra, "by_type": by_type})

    return ContradictionDetectionResponse(
        success=True,
        case_id=case_id,
        contradictions=contradictions,
        summary=summary,
        by_type=by_type,
    )


# ── Week 3.3 & 3.5: RAG Context Enhanced + Observability ──────────────────────

@router.post("/cases/{case_id}/research")
async def run_research(case_id: str, req: ResearchRequest, background_tasks: BackgroundTasks, request: Request):
    """
    Week 3: Enqueue a multi-agent research/draft job. Returns a job_id immediately.
    mode='research' → precedent search + verification only
    mode='draft'    → full discharge application generation

    Week 3 updates:
    - Observability: request recording + session tracing
    - Week 3.3: Primary-source emphasis — RAG context blocks now clearly
      label [PRIMARY SOURCE] vs [SECONDARY / WEB SOURCE] vs [STANDARD]
    """
    approx_chars = len(req.query) + sum(len(p) for p in req.procedural_defects)
    session_id = _record_request(request, "research_start", case_id, approx_chars)
    span_id = _start_span(session_id, "run_research", "crew",
                          {"case_id": case_id, "mode": req.mode, "offline_mock": req.offline_mock,
                           "use_harvey": req.use_harvey, "query_length": len(req.query)})

    logger.info(
        "case_event",
        extra={
            "event": "research_start",
            "case_id": case_id,
            "mode": req.mode,
            "offline_mock": req.offline_mock,
            "use_harvey": req.use_harvey,
            "query_length": len(req.query),
            "session_id": session_id,
        }
    )

    if req.offline_mock:
        job_id = str(uuid.uuid4())
        _jobs[job_id] = {"status": "done", "result": None, "case_id": case_id, "mode": req.mode,
                         "session_id": session_id}

        if req.mode == "draft":
            draft = (
                "[MOCK_DRAFT — OFFLINE]\n\n"
                "IN THE COURT OF THE LEARNED SESSIONS JUDGE, UDAIPUR\n\n"
                "Application for Discharge (Mock)\n\n"
                "GROUND 1: Foundational Scientific Error\n"
                "The FSL report relies on IS 1199:2018 for hardened masonry mortar, which is inapplicable. "
                "Correct reference: IS 2250:1981 for masonry mortar. [PENDING]\n\n"
                "GROUND 2: Sampling Protocol Breach\n"
                "No panchnama and no sealing record were produced. Chain-of-custody is unproven. [SECONDARY]\n\n"
                "PRAYER\n"
                "In view of the above defects, the accused prays for discharge.\n"
            )
        else:
            draft = (
                "[MOCK_RESEARCH — OFFLINE]\n\n"
                "1) Standard mismatch identified: IS 1199:2018 vs IS 2250:1981. [PENDING]\n"
                "2) Sampling protocol concerns: panchnama / sealing / custody. [SECONDARY]\n"
            )

        citation_gate = _evaluate_citation_gate(draft)
        result = {
            "success": not citation_gate["must_block"],
            "draft": "" if citation_gate["must_block"] else draft,
            "tasks_output": [
                {"agent": "OFFLINE_MOCK", "output": draft}
            ],
            "error": (
                "Offline mock produced blocked markers (PENDING/FATAL_ERROR)." if citation_gate["must_block"] else None
            ),
            "citation_gate": citation_gate,
        }
        _jobs[job_id]["result"] = result

        logger.info(
            "case_event",
            extra={
                "event": "research_mock_complete",
                "case_id": case_id,
                "job_id": job_id,
                "mode": req.mode,
                "blocked_by_gate": citation_gate["must_block"],
                "session_id": session_id,
            }
        )

        _end_span(session_id, span_id, "ok", {"job_id": job_id, "blocked_by_gate": citation_gate["must_block"]})

        return {
            "job_id": job_id,
            "status": "done",
            "case_id": case_id,
            "mode": req.mode,
            "poll_url": f"/api/v1/cases/{case_id}/research/{job_id}",
            "session_id": session_id,
        }

    if not settings.openai_api_key:
        _end_span(session_id, span_id, "error", {"reason": "no_openai_key"})
        logger.warning(
            "case_event",
            extra={
                "event": "research_blocked_no_api_key",
                "case_id": case_id,
                "session_id": session_id,
            }
        )
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY not configured. Add it to backend/.env",
        )

    # Week 3.3: PRIMARY SOURCE EMPHASIS in RAG context
    case_context_parts: list[str] = []
    if case_has_documents(case_id):
        try:
            retriever = get_retriever(case_id, k=10)
            docs = retriever.invoke(req.query)
            for d in docs:
                src = d.metadata.get("source_file", "unknown")
                src_type = d.metadata.get("source_type", "primary")
                if src_type == "primary" or src.startswith(("uploaded_cases", "case01", "TC-")):
                    tag = "[PRIMARY SOURCE — User Uploaded Document]"
                    source_class = "primary"
                elif src_type == "standard" or any(tok in src.lower() for tok in ("is_", "astm", "bis", "standard")):
                    tag = "[OFFICIAL STANDARD — BIS/ASTM Reference]"
                    source_class = "official_standard"
                else:
                    tag = "[SECONDARY / WEB SOURCE — Verify Before Citing]"
                    source_class = "secondary"
                # Week 3.3: explicit source-type prefix on every RAG context block
                case_context_parts.append(
                    f"{tag}\nSource File: {src}\n"
                    f"Source Class: {source_class}\n\n"
                    f"{d.page_content}"
                )
            case_context = "\n\n---\n\n".join(case_context_parts) or "[No documents uploaded for this case. Using query only.]"
            logger.info(
                "case_event",
                extra={
                    "event": "research_rag_retrieved",
                    "case_id": case_id,
                    "rag_docs_count": len(docs),
                    "session_id": session_id,
                }
            )
        except Exception as e:
            logger.warning(
                "case_event",
                extra={
                    "event": "research_rag_failed",
                    "case_id": case_id,
                    "error": str(e),
                    "session_id": session_id,
                }
            )
            case_context = f"[RAG unavailable: {e}]"
    else:
        case_context = "[No documents uploaded for this case. Using query only.]"
        logger.info(
            "case_event",
            extra={
                "event": "research_no_documents",
                "case_id": case_id,
                "session_id": session_id,
            }
        )

    job_id = str(uuid.uuid4())
    _jobs[job_id] = {"status": "pending", "result": None, "case_id": case_id, "mode": req.mode,
                     "session_id": session_id, "span_id": span_id}

    crew_span_id = _start_span(session_id, "crew_pipeline", "crew",
                               {"job_id": job_id, "mode": req.mode, "use_harvey": req.use_harvey})

    if req.use_harvey:
        asyncio.create_task(_run_crew_job_async(job_id, req, case_context, session_id, crew_span_id))
    else:
        background_tasks.add_task(_run_crew_job, job_id, req, case_context, session_id, crew_span_id)

    logger.info(
        "case_event",
        extra={
            "event": "research_queued",
            "case_id": case_id,
            "job_id": job_id,
            "mode": req.mode,
            "use_harvey": req.use_harvey,
            "session_id": session_id,
        }
    )

    return {
        "job_id": job_id,
        "status": "pending",
        "case_id": case_id,
        "mode": req.mode,
        "poll_url": f"/api/v1/cases/{case_id}/research/{job_id}",
        "session_id": session_id,
    }


def _run_crew_job(job_id: str, req: ResearchRequest, case_context: str,
                  session_id: str = "", crew_span_id: str = "") -> None:
    """Executed in a background thread — runs the crew and stores result.
    Week 3: observability — session_id + crew span tracking.
    """
    _jobs[job_id]["status"] = "running"
    try:
        crew_result = run_legal_crew(
            query=req.query,
            case_context=case_context,
            incident_type=req.incident_type,
            evidence_type=req.evidence_type,
            procedural_defects=req.procedural_defects,
            mode=req.mode,
        )

        citation_gate = _evaluate_citation_gate(crew_result.get("draft", ""))
        crew_result["citation_gate"] = citation_gate
        crew_result["source_types"] = {"primary_sources_in_context": case_context.count("[PRIMARY SOURCE"),
                                       "secondary_sources_in_context": case_context.count("[SECONDARY / WEB SOURCE"),
                                       "standards_in_context": case_context.count("[OFFICIAL STANDARD")}
        if citation_gate["must_block"]:
            crew_result["success"] = False
            crew_result["draft"] = ""
            block_msg = (
                "Citation gate blocked output due to unresolved "
                f"PENDING={citation_gate['statuses']['PENDING']} or "
                f"FATAL_ERROR={citation_gate['statuses']['FATAL_ERROR']}."
            )
            crew_result["error"] = f"{crew_result.get('error', '')} {block_msg}".strip()
        _jobs[job_id]["status"] = "done"
        _jobs[job_id]["result"] = crew_result

        if session_id and crew_span_id:
            _end_span(session_id, crew_span_id, "ok",
                      {"job_id": job_id, "blocked_by_gate": citation_gate["must_block"],
                       "draft_length": len(crew_result.get("draft", "")),
                       "tasks_count": len(crew_result.get("tasks_output", []))})
    except Exception as e:
        logger.error(f"Crew job {job_id} failed: {e}", exc_info=True)
        _jobs[job_id]["status"] = "error"
        _jobs[job_id]["result"] = {"success": False, "draft": "", "tasks_output": [], "error": str(e)}
        if session_id and crew_span_id:
            _end_span(session_id, crew_span_id, "error", {"job_id": job_id, "error": str(e)})


async def _run_crew_job_async(job_id: str, req: ResearchRequest, case_context: str,
                              session_id: str = "", crew_span_id: str = "") -> None:
    """Async version for Harvey.ai integration.
    Week 3: observability — session_id + crew span tracking.
    """
    _jobs[job_id]["status"] = "running"
    try:
        if req.use_harvey and settings.harvey_enabled and settings.harvey_api_key:
            logger.info(f"Using Harvey.ai for job {job_id}")
            from agents.harvey_client import HarveyClient
            harvey_client = HarveyClient(
                api_key=settings.harvey_api_key,
                region=settings.harvey_region
            )

            harvey_prompt = f"""
            Case Context: {case_context}
            
            Query: {req.query}
            Incident Type: {req.incident_type}
            Evidence Type: {req.evidence_type}
            Procedural Defects: {', '.join(req.procedural_defects)}
            Mode: {req.mode}
            Expertise Level: {req.expertise_hint}
            
            Please provide a legal-grade response with citations for Indian courts.
            """

            result = await harvey_client.completion(
                prompt=harvey_prompt,
                model=settings.harvey_model,
                include_citations=settings.harvey_include_citations,
                mode="draft" if req.mode == "draft" else "assist"
            )

            crew_result = {
                "success": True,
                "draft": result.get("response", ""),
                "tasks_output": [
                    {"agent": "Harvey.ai", "output": result.get("response", "")}
                ],
                "citations": result.get("citations", []),
                "source": "harvey",
            }
        else:
            crew_result = run_legal_crew(
                query=req.query,
                case_context=case_context,
                incident_type=req.incident_type,
                evidence_type=req.evidence_type,
                procedural_defects=req.procedural_defects,
                mode=req.mode,
            )

        citation_gate = _evaluate_citation_gate(crew_result.get("draft", ""))
        crew_result["citation_gate"] = citation_gate
        crew_result["source_types"] = {"primary_sources_in_context": case_context.count("[PRIMARY SOURCE"),
                                       "secondary_sources_in_context": case_context.count("[SECONDARY / WEB SOURCE"),
                                       "standards_in_context": case_context.count("[OFFICIAL STANDARD")}
        if citation_gate["must_block"]:
            crew_result["success"] = False
            crew_result["draft"] = ""
            block_msg = (
                "Citation gate blocked output due to unresolved "
                f"PENDING={citation_gate['statuses']['PENDING']} or "
                f"FATAL_ERROR={citation_gate['statuses']['FATAL_ERROR']}."
            )
            crew_result["error"] = f"{crew_result.get('error', '')} {block_msg}".strip()
        _jobs[job_id]["status"] = "done"
        _jobs[job_id]["result"] = crew_result

        if session_id and crew_span_id:
            _end_span(session_id, crew_span_id, "ok",
                      {"job_id": job_id, "blocked_by_gate": citation_gate["must_block"],
                       "draft_length": len(crew_result.get("draft", ""))})
    except Exception as e:
        logger.error(f"Crew job {job_id} failed: {e}", exc_info=True)
        _jobs[job_id]["status"] = "error"
        _jobs[job_id]["result"] = {"success": False, "draft": "", "tasks_output": [], "error": str(e)}
        if session_id and crew_span_id:
            _end_span(session_id, crew_span_id, "error", {"job_id": job_id, "error": str(e)})


# ── Week 3.5: Observability Endpoints ─────────────────────────────────────────

@router.get("/observability/session", response_model=ObservabilityResponse)
async def get_session_observability(request: Request, session_id: Optional[str] = None, case_id: Optional[str] = None):
    """
    Week 3.5: Get observability data for a session or case.
    Returns request counts, approximate token usage, approximate cost,
    trace spans with duration, and endpoint breakdown.

    Query params:
    - session_id: specific session to query (optional)
    - case_id: case scope for sessions summary (optional)

    Frontend can poll this to surface usage and trace info non-intrusively.
    """
    if session_id:
        session = _session_usage.get(session_id)
        if not session:
            return ObservabilityResponse(
                success=False,
                error=f"Session {session_id} not found.",
            )
        return ObservabilityResponse(
            success=True,
            session=session,
            case_summary={
                "sessions_for_case": len(_case_sessions.get(session.case_id, [])),
            },
        )

    if case_id:
        sessions_for_case = _case_sessions.get(case_id, [])
        recent = []
        total_requests = 0
        total_tokens = 0
        total_cost = 0.0
        for sid in sessions_for_case[-20:]:
            s = _session_usage.get(sid)
            if s:
                recent.append({
                    "session_id": s.session_id,
                    "total_requests": s.total_requests,
                    "total_tokens_approx": s.total_tokens_approx,
                    "total_cost_usd_approx": round(s.total_cost_usd_approx, 4),
                    "last_active": s.last_active,
                    "started_at": s.started_at,
                })
                total_requests += s.total_requests
                total_tokens += s.total_tokens_approx
                total_cost += s.total_cost_usd_approx
        return ObservabilityResponse(
            success=True,
            case_summary={
                "case_id": case_id,
                "session_count": len(sessions_for_case),
                "total_requests_all_sessions": total_requests,
                "total_tokens_approx_all_sessions": total_tokens,
                "total_cost_usd_approx_all_sessions": round(total_cost, 4),
            },
            recent_sessions=recent,
        )

    # Default: global summary
    all_sessions = list(_session_usage.values())
    recent = []
    for s in sorted(all_sessions, key=lambda x: x.last_active, reverse=True)[:20]:
        recent.append({
            "session_id": s.session_id,
            "case_id": s.case_id,
            "total_requests": s.total_requests,
            "total_tokens_approx": s.total_tokens_approx,
            "total_cost_usd_approx": round(s.total_cost_usd_approx, 4),
            "last_active": s.last_active,
        })
    return ObservabilityResponse(
        success=True,
        case_summary={
            "total_sessions": len(all_sessions),
            "total_requests_all": sum(s.total_requests for s in all_sessions),
            "total_tokens_approx_all": sum(s.total_tokens_approx for s in all_sessions),
            "total_cost_usd_approx_all": round(sum(s.total_cost_usd_approx for s in all_sessions), 4),
        },
        recent_sessions=recent,
    )


@router.get("/cases/{case_id}/observability", response_model=ObservabilityResponse)
async def get_case_observability(case_id: str, request: Request):
    """Case-scoped observability — sugar for /observability/session?case_id=XYZ."""
    return await get_session_observability(request, session_id=None, case_id=case_id)


# ── Week 3.2: Legacy contradiction route (back-compat) ────────────────────────

@router.post("/detect-contradictions", response_model=ContradictionDetectionResponse)
async def detect_contradictions_legacy(request: Request, case_id: str = Body(..., embed=True)):
    """Legacy route: case_id in request body. Prefer /cases/{case_id}/detect-contradictions."""
    return await detect_contradictions_expanded(case_id, request)
