"""
Legal Luminaire Multi-Agent Crew v3.
Pipeline: Researcher → Standards Verifier → Fact Checker → Drafter → Hallucination Gate
─────────────────────────────────────────────────────────────────────────────────────────
Upgrades v3:
  • Query complexity + expertise level classification drives chunk size & response style
  • Hallucination Circuit Breaker post-processes Drafter output before returning
  • Fact Checker uses cross-database consensus (IK + SCC + Manupatra)
"""
from __future__ import annotations

import logging
from typing import Any

from crewai import Crew, Task, Process

from agents.researcher import create_researcher_agent
from agents.enhanced_researcher import EnhancedResearcherAgent, create_enhanced_researcher_task
from agents.standards_verifier import create_standards_verifier_agent
from agents.fact_checker import create_fact_checker_agent
from agents.drafter import create_drafter_agent
from agents.hallucination_breaker import check_hallucination
from agents.chain_custody_specialist import create_chain_custody_specialist_agent, analyze_chain_custody_procedure
from agents.tools.legal_verifier import CrossDatabaseConsensus
from rag.query_classifier import classify_query, get_drafter_style_instruction
from rag.standards_database import ISStandardsDatabase
from rag.case_isolated_store import CaseIsolatedDocumentStore
import re

logger = logging.getLogger(__name__)


def extract_citations_from_output(text: str) -> list[str]:
    """Extract case citations from generated text for verification"""
    # Pattern to match common Indian legal citation formats
    citation_patterns = [
        r'\bv\.\s+[\w\s&]+\s+\(\d{4}\)\s+\d+\s+SCC\s+\d+',  # Standard SCC format
        r'\b[\w\s&]+\s+v\.\s+[\w\s&]+\s+\(\d{4}\)\s+\d+\s+SCC\s+\d+',  # Full case name
        r'\b[\w\s&]+\s+v\.\s+[\w\s&]+\s+\d{4}\s+INSC\s+\d+',  # INSC format
        r'\b\d{4}\s+SCC\s+OnLine\s+\w+\s+\d+',  # SCC Online format
        r'\b[\w\s&]+\s+v\.\s+[\w\s&]+\s+\(\d{4}\)\s+\d+\s+GLR\s+\d+',  # GLR format
    ]
    
    citations = []
    for pattern in citation_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        citations.extend(matches)
    
    # Deduplicate while preserving order
    seen = set()
    unique_citations = []
    for citation in citations:
        if citation not in seen:
            seen.add(citation)
            unique_citations.append(citation)
    
    return unique_citations


def extract_citations_from_output(text: str) -> list[str]:
    """Extract case citations from generated text for verification"""
    # Pattern to match common Indian legal citation formats
    citation_patterns = [
        r'\bv\.\s+[\w\s&]+\s+\(\d{4}\)\s+\d+\s+SCC\s+\d+',  # Standard SCC format
        r'\b[\w\s&]+\s+v\.\s+[\w\s&]+\s+\(\d{4}\)\s+\d+\s+SCC\s+\d+',  # Full case name
        r'\b[\w\s&]+\s+v\.\s+[\w\s&]+\s+\d{4}\s+INSC\s+\d+',  # INSC format
        r'\b\d{4}\s+SCC\s+OnLine\s+\w+\s+\d+',  # SCC Online format
        r'\b[\w\s&]+\s+v\.\s+[\w\s&]+\s+\(\d{4}\)\s+\d+\s+GLR\s+\d+',  # GLR format
    ]
    
    citations = []
    for pattern in citation_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        citations.extend(matches)
    
    # Deduplicate while preserving order
    seen = set()
    unique_citations = []
    for citation in citations:
        if citation not in seen:
            seen.add(citation)
            unique_citations.append(citation)
    
    return unique_citations


def run_legal_crew(
    query: str,
    case_context: str,
    incident_type: str = "construction wall collapse forensic mortar sampling",
    evidence_type: str = "material sampling forensic lab report chain of custody",
    procedural_defects: list[str] | None = None,
    mode: str = "draft",
    expertise_hint: str | None = None,
    retrieved_chunks: list | None = None,
) -> dict[str, Any]:
    """
    Run the full 4-agent pipeline with hallucination circuit breaker.

    Parameters
    ----------
    query            : User query
    case_context     : RAG-retrieved document text
    incident_type    : Nature of incident for researcher
    evidence_type    : Type of evidence involved
    procedural_defects : Known defects list
    mode             : 'draft' | 'research'
    expertise_hint   : 'layperson' | 'junior' | 'senior' (optional override)
    retrieved_chunks : Raw Document objects from hybrid_search (for hallucination check)

    Returns dict with success, draft, hallucination_report, tasks_output, error.
    """
    if procedural_defects is None:
        procedural_defects = [
            "no panchnama", "no chain of custody", "no contractor representative",
            "wrong IS standard (IS 1199 used instead of IS 2250)",
            "rain/storm sampling", "no sealing", "no FSL inward register",
        ]

    # ── Query Classification ───────────────────────────────────────────────────
    profile = classify_query(query, expertise_hint=expertise_hint)
    style_instruction = get_drafter_style_instruction(profile)
    logger.info(
        f"Query profile: complexity={profile.complexity}, expertise={profile.expertise}, "
        f"k={profile.k_retrieval}, mode={profile.response_mode}"
    )

    defects_str = "; ".join(procedural_defects)
    ctx_snippet = case_context[:2500] if case_context else "[No uploaded documents]"

    # Initialize enhanced verification systems
    standards_db = ISStandardsDatabase()
    consensus_verifier = CrossDatabaseConsensus()
    case_store = CaseIsolatedDocumentStore()
    
    # Use enhanced researcher with direct API access
    enhanced_researcher = EnhancedResearcherAgent()
    researcher = enhanced_researcher.create_agent()
    verifier   = create_standards_verifier_agent()
    checker    = create_fact_checker_agent()
    chain_custody = create_chain_custody_specialist_agent()
    drafter    = create_drafter_agent()

    # ── Task 1: Enhanced Research & verify precedents ─────────────────────────────
    # Use enhanced researcher with direct API access
    task_research = create_enhanced_researcher_task(
        query=query,
        case_context=ctx_snippet,
        incident_type=incident_type,
        evidence_type=evidence_type,
        procedural_defects=procedural_defects
    )

    # ── Task 2: Verify IS/ASTM standards ──────────────────────────────────────
    task_verify_standards = Task(
        description=f"""
CASE CONTEXT: {ctx_snippet[:1000]}

YOUR TASK — Verify ALL IS/ASTM/BS standards relevant to this case:

Use verify_is_standard tool for each:
1. IS 1199:2018 — confirm it is for FRESH CONCRETE only (prosecution's error)
2. IS 2250:1981 — confirm it is the CORRECT standard for masonry mortar
3. IS 3535:1986 — confirm Clause 4.1 (contractor rep) and Clause 6.2 (5 locations)
4. IS 4031 (Part 6) — confirm 27±2°C temperature requirement
5. ASTM C1324 — confirm Sections 7-8 (carbonated layer removal)
6. ASTM C780 — confirm Section 6.1 (rain/moisture protection)
7. CPWD Manual 2023 — confirm Sections 3.7.4 and 12.2.1 (joint sampling)
8. NBC 2016/2023 — confirm Section 3.4 (Force Majeure)
9. IS 516:1959 — sampling of hardened concrete (confirm if applicable)
10. IS 9012:1978 — testing mortar joints (confirm clause relevance)
11. IS 1905:1987 — unreinforced masonry structures (structural safety)

Also use web_search to find exact clause text from archive.org or bis.gov.in.
Flag any IS standard cited by prosecution that is SUPERSEDED or does not match the material.

Output: CODE, TITLE, SCOPE, APPLIES_TO_THIS_CASE, KEY_CLAUSES, SOURCE_URL, VERDICT.
""",
        agent=verifier,
        expected_output="Verified standards list with scope, applicability verdict, key clauses, and source URLs.",
        context=[task_research],
    )

    # ── Task 3: Chain-of-custody analysis ───────────────────────────────────────
    task_chain_custody = Task(
        description=f"""
CASE CONTEXT: {ctx_snippet[:1500]}

INCIDENT TYPE: {incident_type}
EVIDENCE TYPE: {evidence_type}
PROCEDURAL DEFECTS: {defects_str}

YOUR TASK — Specialized chain-of-custody analysis:

1. Analyze sampling procedure against IS 3535, IS 2250, ASTM C780, ASTM C1324
2. Identify weather condition violations (rain/storm sampling)
3. Verify contractor representative presence requirements
4. Check sampling location representativeness (minimum 5 locations)
5. Validate sealing and chain-of-custody documentation
6. Detect standard mismatches (IS 1199 vs IS 2250 for hardened mortar)
7. Generate detailed Hindi/English assessment
8. Create legal arguments for discharge application
9. Identify relevant precedents (Kattavellai 2025, Uttarakhand HC 2026, Rajasthan HC 2025)
10. Generate expert witness examination points
11. Create cross-reference matrix (violation → IS clause → precedent)

OUTPUT REQUIREMENTS:
- Detailed assessment in both Hindi and English
- Legal arguments formatted for court use
- Precedent analysis with exact citations
- Expert witness examination questions
- Cross-reference matrix table
- Overall compliance score with recommendation
""",
        agent=chain_custody,
        expected_output="Comprehensive chain-of-custody analysis with legal arguments, precedents, expert witness points, and cross-reference matrix.",
        context=[task_research, task_verify_standards],
    )

    # ── Task 4: Fact-check and produce clean verified list ─────────────────────
    task_fact_check = Task(
        description=f"""
Review the researcher's precedents, verifier's standards outputs, and chain-custody analysis.

YOUR TASK:
1. For each PRIMARY precedent: use cross_database_consensus to check all 3 databases.
2. Check logical consistency: does the holding actually support the defence argument?
3. Check fact-fit match to this case (stadium wall collapse, forensic mortar sampling).
4. Separate into VERIFIED_LIST (safe to use) and REJECTED_LIST (do not use).
5. Flag FATAL ERRORS: any rejected item being used as primary authority.
6. For IS standards: confirm IS 1199:2018 is WRONG for hardened mortar.
7. Assign final confidence: HIGH/MEDIUM/LOW for each precedent.
8. Flag DIVERGENT: if SCC Online and Manupatra give conflicting holdings.

KNOWN SAFE PRECEDENTS:
- Kattavellai 2025 INSC 845 — VERIFIED, BINDING
- Prafulla Kumar Samal (1979) 3 SCC 4 — VERIFIED
- Ramesh Singh (1977) 4 SCC 39 — VERIFIED
- Jacob Mathew (2005) 6 SCC 1 — VERIFIED
- State of Maharashtra v. Damu (2000) 6 SCC 269 — VERIFIED
- State of Punjab v. Baldev Singh (1999) 6 SCC 172 — VERIFIED

KNOWN PENDING (do not use as primary):
- R.B. Constructions (2014 SCC OnLine Bom 125) — PENDING
- K.S. Kalra (2011 SCC OnLine Del 3412) — PENDING
- Builders Association v. State of UP (2018) — PENDING
- Mohanbhai (2003) 4 GLR 3121 — PENDING

Output: VERIFIED_LIST, REJECTED_LIST, DIVERGENT_CITATIONS, FATAL_ERRORS, STANDARDS_VERDICT, OVERALL_CONFIDENCE.
""",
        agent=checker,
        expected_output="Clean verified list of precedents and standards, with rejected list, divergent citations, and fatal errors flagged.",
        context=[task_research, task_verify_standards, task_chain_custody],
    )

    # ── Task 4: Draft the discharge application ────────────────────────────────
    draft_instruction = (
        "Using ONLY the verified precedents and standards from the fact-checker's output,\n"
        "and the case context from uploaded documents:\n\n"
        f"CASE CONTEXT: {ctx_snippet}\n"
        f"USER QUERY: {query}\n"
        f"MODE: {mode}\n\n"
        f"RESPONSE STYLE INSTRUCTION:\n{style_instruction}\n\n"
    )

    if mode == "draft":
        draft_instruction += (
            "GENERATE INTENSE HINDI DISCHARGE APPLICATION (SYNERGY UNIQUE):\n\n"
            "MANDATORY SYNERGY MAPPING:\n"
            "For every defect, you MUST link it to a specific IS clause AND a verified SC/HC precedent.\n"
            "Example: 'Storm/Rain Sampling' -> 'IS 2250 Clause 6.1 / ASTM C780' -> 'Kattavellai Chain of Custody failure'.\n\n"
            "Structure (mandatory):\n"
            "1. न्यायालय शीर्षक - Special Session Case No. 1/2025, Udaipur\n"
            "2. प्रार्थना-पत्र शीर्षक - u/s 250 BNSS 2023 / 227 CrPC\n"
            "3. प्रकरण के तथ्य - Detailed history including technical timeline\n"
            "4. THE FOUNDATIONAL SCIENTIFIC ERROR - Contrast IS 1199 (Fresh) vs IS 2250 (Hardened)\n"
            "5. आधार 1-12 - High-intensity mapping (Technical Cl. -> Precedent)\n"
            "6. विस्तृत विधिक तर्क - Using ONLY VERIFIED/COURT_SAFE holdings\n"
            "7. प्रार्थना - Specific reliefs including FSL exclusion\n"
            "8. सत्यापन + शपथ-पत्र\n"
            "11. फाइलिंग चेकलिस्ट\n\n"
            "QUALITY RULES:\n"
            "- Chaste Hindi, Rajasthan High Court style\n"
            "- Quote holdings VERBATIM from verified list only\n"
            "- Every IS clause must have clause number\n"
            "- Mark uncertain facts as [VERIFY BEFORE FILING]\n"
            "- Target: 25-30 pages when printed\n"
        )
    else:
        draft_instruction += "GENERATE RESEARCH REPORT:\n"

    task_draft = Task(
        description=draft_instruction,
        agent=drafter,
        expected_output=(
            "Complete court-ready Hindi discharge application (25-30 pages) with "
            "cross-reference matrix, oral arguments, prayer, and filing checklist."
            if mode == "draft"
            else "Research report with verified precedents, standards analysis, and argument blocks."
        ),
        context=[task_research, task_verify_standards, task_chain_custody, task_fact_check],
    )

    crew = Crew(
        agents=[researcher, verifier, chain_custody, checker, drafter],
        tasks=[task_research, task_verify_standards, task_chain_custody, task_fact_check, task_draft],
        process=Process.sequential,
        verbose=True,
        memory=True,
    )

    try:
        result = crew.kickoff()
        tasks_output = []
        agent_names = ["researcher", "standards_verifier", "chain_custody", "fact_checker", "drafter"]
        for i, task_result in enumerate(crew.tasks):
            agent_name = agent_names[i] if i < len(agent_names) else f"agent_{i}"
            output_text = ""
            if hasattr(task_result, "output") and task_result.output:
                output_text = str(task_result.output)
            tasks_output.append({"agent": agent_name, "output": output_text})

        final_output = str(result) if result else ""

        # ── Enhanced Accuracy Verification ─────────────────────────────────────
        chunks = retrieved_chunks or []
        hallucination_report = check_hallucination(final_output, chunks)
        
        # Additional verification for citations
        extracted_citations = extract_citations_from_output(final_output)
        citation_verifications = []
        if extracted_citations:
            citation_verifications = consensus_verifier.verify_precedent_batch(extracted_citations)
        
        logger.info(f"Hallucination gate verdict: {hallucination_report.verdict}")
        logger.info(f"Citation verification count: {len(citation_verifications)}")

        if hallucination_report.blocked:
            return {
                "success": False,
                "draft": "",
                "hallucination_report": hallucination_report.to_dict(),
                "tasks_output": tasks_output,
                "error": (
                    f"HALLUCINATION CIRCUIT BREAKER TRIGGERED — "
                    f"output blocked. Score: {hallucination_report.hallucination_score:.2%}. "
                    f"Ungrounded items: {hallucination_report.ungrounded[:5]}"
                ),
                "query_profile": profile.to_dict(),
                "citation_verifications": citation_verifications,
            }

        return {
            "success": True,
            "draft": final_output,
            "hallucination_report": hallucination_report.to_dict(),
            "tasks_output": tasks_output,
            "error": None,
            "query_profile": profile.to_dict(),
            "citation_verifications": citation_verifications,
        }

    except Exception as e:
        logger.error(f"Crew execution failed: {e}", exc_info=True)
        return {
            "success": False,
            "draft": "",
            "hallucination_report": None,
            "tasks_output": [],
            "error": str(e),
            "query_profile": profile.to_dict() if "profile" in dir() else {},
        }
