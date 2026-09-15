"""
Enhanced Researcher Agent
Upgraded researcher with direct legal database API access, real-time citation verification, precedent relevance scoring, and holding extraction accuracy
"""
from __future__ import annotations

import logging
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from crewai import Agent, Task
from langchain_openai import ChatOpenAI

from config import settings
from agents.tools import web_search, browse_page, indian_kanoon_search, verify_is_standard
from agents.tools.legal_verifier import (
    CrossDatabaseConsensus,
    IndianKanoonVerifier,
    SCCOnlineVerifier,
    ManupatraVerifier,
    CitationVerification
)
from rag.standards_database import ISStandardsDatabase

logger = logging.getLogger(__name__)


@dataclass
class PrecedentAnalysis:
    """Detailed analysis of a legal precedent"""
    case_name: str
    citation: str
    court: str
    date: str
    holding: str
    verification_status: str  # "VERIFIED", "SECONDARY", "PENDING", "REJECTED"
    confidence_score: float
    fact_fit_score: int  # 0-100
    fact_fit_level: str  # "exact", "analogous", "weak", "rejected"
    incident_match: int  # 0-40
    evidence_match: int  # 0-35
    procedural_match: int  # 0-25
    sources: List[Dict[str, Any]]  # Verification sources
    application_note: str
    url: str


@dataclass
class ResearchResult:
    """Complete research result with enhanced verification"""
    precedents: List[PrecedentAnalysis]
    standards_verified: List[Dict[str, Any]]
    search_summary: Dict[str, Any]
    quality_metrics: Dict[str, float]
    recommendations: List[str]


class EnhancedResearcherAgent:
    """Enhanced researcher with direct legal database API access"""
    
    def __init__(self):
        self.consensus_verifier = CrossDatabaseConsensus()
        self.standards_db = ISStandardsDatabase()
        self.indian_kanoon = IndianKanoonVerifier()
        self.scc_online = SCCOnlineVerifier()
        self.manupatra = ManupatraVerifier()
    
    def create_agent(self) -> Agent:
        """Create enhanced researcher agent"""
        
        enhanced_system = """You are an elite Supreme Court-level legal researcher with direct access to Indian legal databases.

ENHANCED CAPABILITIES:
- Direct API access to Indian Kanoon, SCC Online, and Manupatra
- Real-time citation verification with cross-database consensus
- Precedent relevance scoring with fact-fit analysis
- Holding extraction with accuracy verification
- IS/ASTM standard verification with clause-level precision

VERIFICATION PROTOCOL:
1. For EACH citation, use cross-database consensus verification
2. Score fact-fit: incident (0-40) + evidence (0-35) + procedural (0-25)
3. Extract holdings VERBATIM from verified sources only
4. Mark divergent holdings across databases
5. Flag superseded IS standards immediately

RESEARCH QUALITY METRICS:
- Citation verification accuracy: >95%
- Holding extraction accuracy: >90%
- Standard verification: >98%
- Zero hallucination tolerance

OUTPUT FORMAT:
For each precedent provide:
- NAME: [full case name]
- CITATION: [exact citation]
- COURT: [court name]
- DATE: [date]
- HOLDING: "[verbatim quote]"
- VERIFICATION: [consensus_confidence% - sources_used]
- FACT_FIT: [score/100 - level]
- APPLICATION: [specific application]
- URL: [primary verified source]
"""
        
        llm = ChatOpenAI(
            model=settings.llm_model,
            temperature=settings.llm_temperature_research,
            openai_api_key=settings.openai_api_key,
        )
        
        return Agent(
            role="Enhanced Legal Researcher & Citation Verifier",
            goal=(
                "Verify every citation using direct legal database APIs with cross-database consensus. "
                "Extract holdings with 90%+ accuracy. Score precedents for fact-fit relevance. "
                "Verify IS/ASTM standards at clause level. Maintain zero hallucination tolerance."
            ),
            backstory=enhanced_system,
            tools=[web_search, browse_page, indian_kanoon_search, verify_is_standard],
            llm=llm,
            verbose=True,
            allow_delegation=False,
            max_iter=10,
        )
    
    def verify_precedent_enhanced(
        self,
        citation: str,
        case_context: str,
        incident_type: str,
        evidence_type: str,
        procedural_defects: List[str]
    ) -> PrecedentAnalysis:
        """Enhanced precedent verification with detailed analysis"""
        
        # Cross-database consensus verification
        consensus_result = self.consensus_verifier.verify_citation_consensus(citation)
        
        # Calculate fact-fit score
        fact_fit = self._calculate_fact_fit(
            case_context,
            incident_type,
            evidence_type,
            procedural_defects,
            consensus_result
        )
        
        # Extract best holding from verified sources
        best_holding = self._extract_best_holding(consensus_result)
        
        # Determine verification status
        verification_status = self._determine_verification_status(consensus_result, fact_fit)
        
        # Extract source information
        sources = [
            {
                "source": v["source"],
                "verified": v["verified"],
                "confidence": v["confidence"],
                "case_name": v["case_name"],
                "url": v["source_url"]
            }
            for v in consensus_result["verifications"]
        ]
        
        # Get primary URL
        primary_url = ""
        for v in consensus_result["verifications"]:
            if v["verified"] and v["source_url"]:
                primary_url = v["source_url"]
                break
        
        return PrecedentAnalysis(
            case_name=consensus_result["verifications"][0]["case_name"] if consensus_result["verifications"] else "Unknown",
            citation=citation,
            court=consensus_result["verifications"][0].get("case_name", "Unknown") if consensus_result["verifications"] else "Unknown",
            date=consensus_result["verifications"][0].get("date", "") if consensus_result["verifications"] else "",
            holding=best_holding,
            verification_status=verification_status,
            confidence_score=consensus_result["consensus_confidence"],
            fact_fit_score=fact_fit["total_score"],
            fact_fit_level=fact_fit["level"],
            incident_match=fact_fit["incident_match"],
            evidence_match=fact_fit["evidence_match"],
            procedural_match=fact_fit["procedural_match"],
            sources=sources,
            application_note=self._generate_application_note(fact_fit, case_context),
            url=primary_url
        )
    
    def _calculate_fact_fit(
        self,
        case_context: str,
        incident_type: str,
        evidence_type: str,
        procedural_defects: List[str],
        consensus_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calculate fact-fit score for precedent relevance"""
        
        # Base scores
        incident_match = 0
        evidence_match = 0
        procedural_match = 0
        
        # Extract holding text for analysis
        holding_text = ""
        for v in consensus_result["verifications"]:
            if v["verified"] and v["holding"]:
                holding_text = v["holding"]
                break
        
        # Incident type matching (0-40 points)
        incident_keywords = {
            "construction wall collapse": ["collapse", "wall", "structural", "building", "construction"],
            "forensic mortar sampling": ["mortar", "sampling", "forensic", "testing", "material"],
            "chain of custody": ["custody", "chain", "procedure", "representative", "sealing"],
        }
        
        if incident_type in incident_keywords:
            keywords = incident_keywords[incident_type]
            matches = sum(1 for keyword in keywords if keyword.lower() in holding_text.lower())
            incident_match = min(int((matches / len(keywords)) * 40), 40)
        
        # Evidence type matching (0-35 points)
        evidence_keywords = {
            "material sampling forensic lab report": ["lab", "report", "forensic", "sample", "test"],
            "chain of custody documentation": ["custody", "documentation", "procedure", "chain"],
        }
        
        if evidence_type in evidence_keywords:
            keywords = evidence_keywords[evidence_type]
            matches = sum(1 for keyword in keywords if keyword.lower() in holding_text.lower())
            evidence_match = min(int((matches / len(keywords)) * 35), 35)
        
        # Procedural defect matching (0-25 points)
        defect_keywords = {
            "no panchnama": ["panchnama", "documentation", "procedure"],
            "no chain of custody": ["custody", "chain", "procedure"],
            "no contractor representative": ["representative", "contractor", "presence"],
            "wrong IS standard": ["standard", "IS", "wrong", "inappropriate"],
            "rain/storm sampling": ["rain", "storm", "weather", "adverse"],
            "no sealing": ["seal", "sealing", "closure"],
        }
        
        for defect in procedural_defects:
            if defect in defect_keywords:
                keywords = defect_keywords[defect]
                matches = sum(1 for keyword in keywords if keyword.lower() in holding_text.lower())
                procedural_match += min(int((matches / len(keywords)) * 8), 8)
        
        procedural_match = min(procedural_match, 25)
        
        # Calculate total and determine level
        total_score = incident_match + evidence_match + procedural_match
        
        if total_score >= 70:
            level = "exact"
        elif total_score >= 50:
            level = "analogous"
        elif total_score >= 30:
            level = "weak"
        else:
            level = "rejected"
        
        return {
            "incident_match": incident_match,
            "evidence_match": evidence_match,
            "procedural_match": procedural_match,
            "total_score": total_score,
            "level": level
        }
    
    def _extract_best_holding(self, consensus_result: Dict[str, Any]) -> str:
        """Extract the best holding from verified sources"""
        
        # Priority: Indian Kanoon > SCC Online > Manupatra
        source_priority = ["Indian Kanoon", "SCC Online", "Manupatra"]
        
        for source_name in source_priority:
            for verification in consensus_result["verifications"]:
                if verification["source"] == source_name and verification["verified"]:
                    holding = verification.get("holding", "")
                    if holding and len(holding) > 50:  # Substantial holding
                        return holding[:500]  # First 500 chars
        
        # Fallback to any verified source
        for verification in consensus_result["verifications"]:
            if verification["verified"]:
                holding = verification.get("holding", "")
                if holding:
                    return holding[:500]
        
        return "Holding not available"
    
    def _determine_verification_status(
        self,
        consensus_result: Dict[str, Any],
        fact_fit: Dict[str, Any]
    ) -> str:
        """Determine overall verification status"""
        
        consensus_confidence = consensus_result["consensus_confidence"]
        fact_fit_level = fact_fit["level"]
        
        if consensus_confidence >= 0.8 and fact_fit_level in ["exact", "analogous"]:
            return "VERIFIED"
        elif consensus_confidence >= 0.5 and fact_fit_level in ["exact", "analogous", "weak"]:
            return "SECONDARY"
        elif consensus_confidence >= 0.3:
            return "PENDING"
        else:
            return "REJECTED"
    
    def _generate_application_note(self, fact_fit: Dict[str, Any], case_context: str) -> str:
        """Generate application note for precedent"""
        
        level = fact_fit["level"]
        scores = f"Incident: {fact_fit['incident_match']}/40, Evidence: {fact_fit['evidence_match']}/35, Procedural: {fact_fit['procedural_match']}/25"
        
        if level == "exact":
            return f"PRIMARY AUTHORITY - Directly applicable. {scores}"
        elif level == "analogous":
            return f"ANALOGOUS - Use with qualification. {scores}"
        elif level == "weak":
            return f"WEAK - Supporting authority only. {scores}"
        else:
            return f"REJECTED - Not applicable. {scores}"
    
    def batch_verify_precedents(
        self,
        citations: List[str],
        case_context: str,
        incident_type: str,
        evidence_type: str,
        procedural_defects: List[str]
    ) -> ResearchResult:
        """Verify multiple precedents in batch with enhanced analysis"""
        
        precedents = []
        verification_stats = {
            "total": len(citations),
            "verified": 0,
            "secondary": 0,
            "pending": 0,
            "rejected": 0
        }
        
        for citation in citations:
            try:
                analysis = self.verify_precedent_enhanced(
                    citation,
                    case_context,
                    incident_type,
                    evidence_type,
                    procedural_defects
                )
                precedents.append(analysis)
                verification_stats[analysis.verification_status.lower()] += 1
            except Exception as e:
                logger.error(f"Failed to verify citation {citation}: {e}")
        
        # Calculate quality metrics
        avg_confidence = sum(p.confidence_score for p in precedents) / len(precedents) if precedents else 0.0
        avg_fact_fit = sum(p.fact_fit_score for p in precedents) / len(precedents) if precedents else 0.0
        
        # Generate recommendations
        recommendations = self._generate_recommendations(precedents, verification_stats)
        
        return ResearchResult(
            precedents=precedents,
            standards_verified=[],  # Standards handled separately
            search_summary=verification_stats,
            quality_metrics={
                "avg_confidence": avg_confidence,
                "avg_fact_fit": avg_fact_fit,
                "verification_rate": verification_stats["verified"] / verification_stats["total"] if verification_stats["total"] > 0 else 0.0
            },
            recommendations=recommendations
        )
    
    def _generate_recommendations(
        self,
        precedents: List[PrecedentAnalysis],
        stats: Dict[str, int]
    ) -> List[str]:
        """Generate recommendations based on research results"""
        
        recommendations = []
        
        # Analyze verification rates
        verification_rate = stats["verified"] / stats["total"] if stats["total"] > 0 else 0.0
        
        if verification_rate < 0.5:
            recommendations.append("LOW VERIFICATION RATE - Consider additional research or alternative precedents")
        elif verification_rate < 0.8:
            recommendations.append("MODERATE VERIFICATION RATE - Use verified precedents as primary authorities")
        
        # Check for rejected precedents
        if stats["rejected"] > 0:
            recommendations.append(f"{stats['rejected']} PRECEDENTS REJECTED - Do not use in court filings")
        
        # Check for pending precedents
        if stats["pending"] > 0:
            recommendations.append(f"{stats['pending']} PRECEDENTS PENDING - Requires additional verification")
        
        # Analyze fact-fit scores
        high_fit_precedents = [p for p in precedents if p.fact_fit_level in ["exact", "analogous"]]
        if len(high_fit_precedents) < 2:
            recommendations.append("LOW FACT-FIT PRECEDENTS - Consider expanding search for more relevant authorities")
        
        # Check for divergent holdings
        divergent_sources = []
        for p in precedents:
            source_names = [s["source"] for s in p.sources if s["verified"]]
            if len(set(source_names)) > 1:
                divergent_sources.append(p.citation)
        
        if divergent_sources:
            recommendations.append(f"DIVERGENT HOLDINGS in {len(divergent_sources)} precedents - Cross-reference carefully")
        
        return recommendations


def create_enhanced_researcher_task(
    query: str,
    case_context: str,
    incident_type: str,
    evidence_type: str,
    procedural_defects: List[str],
    target_precedents: Optional[List[str]] = None
) -> Task:
    """Create enhanced research task"""
    
    agent = EnhancedResearcherAgent().create_agent()
    
    # Default precedents to search if not specified
    if target_precedents is None:
        target_precedents = [
            "Kattavellai @ Devakar v. State of Tamil Nadu (2025) INSC 845",
            "Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4",
            "State of Bihar v. Ramesh Singh (1977) 4 SCC 39",
            "Jacob Mathew v. State of Punjab (2005) 6 SCC 1",
            "State of Maharashtra v. Damu (2000) 6 SCC 269",
            "State of Punjab v. Baldev Singh (1999) 6 SCC 172",
        ]
    
    task_description = f"""
ENHANCED RESEARCH TASK:

CASE CONTEXT:
{case_context[:2000]}

USER QUERY: {query}
INCIDENT TYPE: {incident_type}
EVIDENCE TYPE: {evidence_type}
PROCEDURAL DEFECTS: {', '.join(procedural_defects)}

TARGET PRECEDENTS TO VERIFY:
{chr(10).join(f'- {cite}' for cite in target_precedents)}

ENHANCED VERIFICATION REQUIREMENTS:
1. Use cross-database consensus (Indian Kanoon + SCC Online + Manupatra)
2. Extract holdings VERBATIM from primary verified sources
3. Score fact-fit: incident (0-40) + evidence (0-35) + procedural (0-25)
4. Mark divergent holdings across databases
5. Flag superseded or inapplicable standards
6. Generate specific application notes for each precedent

OUTPUT FORMAT:
For each precedent:
- NAME: [full case name]
- CITATION: [exact citation]
- COURT: [court name]
- DATE: [date]
- HOLDING: "[verbatim quote from verified source]"
- VERIFICATION: [consensus_confidence% - sources_used]
- FACT_FIT: [score/100 - level - incident/evidence/procedural breakdown]
- APPLICATION: [specific application to this case]
- URL: [primary verified source]

QUALITY SUMMARY:
- Total precedents verified
- Verification rate
- Average confidence score
- Average fact-fit score
- Recommendations for precedent selection
"""
    
    return Task(
        description=task_description,
        agent=agent,
        expected_output="Enhanced research report with verified precedents, fact-fit analysis, and quality metrics."
    )