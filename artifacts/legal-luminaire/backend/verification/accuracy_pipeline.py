"""
Accuracy Verification Pipeline
End-to-end verification system for legal documents with comprehensive accuracy checks
"""
from __future__ import annotations

import logging
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from datetime import datetime
import json

from agents.tools.legal_verifier import CrossDatabaseConsensus, CitationVerification
from rag.standards_database import ISStandardsDatabase, ChainOfCustodySpecialist
from agents.hallucination_breaker import check_hallucination, HallucinationReport

logger = logging.getLogger(__name__)


@dataclass
class VerificationStep:
    """Individual verification step result"""
    step_name: str
    status: str  # "PASSED", "FAILED", "WARNING", "SKIPPED"
    confidence: float
    details: str
    errors: List[str]
    warnings: List[str]
    timestamp: datetime


@dataclass
class CitationAccuracyResult:
    """Result of citation accuracy verification"""
    total_citations: int
    verified_citations: int
    unverified_citations: int
    hallucinated_citations: int
    divergent_citations: int
    accuracy_score: float
    citation_details: List[Dict[str, Any]]


@dataclass
class StandardAccuracyResult:
    """Result of IS/ASTM standard accuracy verification"""
    total_standards: int
    verified_standards: int
    superseded_standards: int
    inapplicable_standards: int
    accuracy_score: float
    standard_details: List[Dict[str, Any]]


@dataclass
class PrecedentRelevanceResult:
    """Result of precedent relevance verification"""
    total_precedents: int
    highly_relevant: int  # fact-fit >= 70
    moderately_relevant: int  # fact-fit 50-69
    low_relevance: int  # fact-fit 30-49
    irrelevant: int  # fact-fit < 30
    average_fact_fit: float
    relevance_score: float
    precedent_details: List[Dict[str, Any]]


@dataclass
class ChainOfCustodyResult:
    """Result of chain-of-custody verification"""
    overall_compliance: float
    critical_violations: int
    high_violations: int
    medium_violations: int
    low_violations: int
    compliances: int
    compliance_score: float
    violation_details: List[Dict[str, Any]]


@dataclass
class AccuracyPipelineResult:
    """Complete accuracy verification pipeline result"""
    overall_confidence: float
    overall_verdict: str  # "READY_FOR_COURT", "REQUIRES_REVIEW", "NOT_READY"
    verification_steps: List[VerificationStep]
    citation_accuracy: CitationAccuracyResult
    standard_accuracy: StandardAccuracyResult
    precedent_relevance: PrecedentRelevanceResult
    chain_of_custody: ChainOfCustodyResult
    hallucination_report: Optional[HallucinationReport]
    recommendations: List[str]
    critical_issues: List[str]
    processing_time: float
    timestamp: datetime


class AccuracyVerificationPipeline:
    """End-to-end accuracy verification for legal documents"""
    
    def __init__(self):
        self.consensus_verifier = CrossDatabaseConsensus()
        self.standards_db = ISStandardsDatabase()
        self.chain_custody_specialist = ChainOfCustodySpecialist(self.standards_db)
        self.verification_steps: List[VerificationStep] = []
    
    def run_full_pipeline(
        self,
        document_text: str,
        case_context: str,
        retrieved_chunks: Optional[List] = None,
        incident_type: str = "construction wall collapse forensic mortar sampling",
        evidence_type: str = "material sampling forensic lab report chain of custody",
        procedural_defects: Optional[List[str]] = None
    ) -> AccuracyPipelineResult:
        """Run the complete accuracy verification pipeline"""
        
        start_time = datetime.now()
        self.verification_steps = []
        
        if procedural_defects is None:
            procedural_defects = [
                "no panchnama", "no chain of custody", "no contractor representative",
                "wrong IS standard (IS 1199 used instead of IS 2250)",
                "rain/storm sampling", "no sealing", "no FSL inward register",
            ]
        
        try:
            # Step 1: Citation accuracy verification
            citation_result = self._verify_citation_accuracy(document_text)
            
            # Step 2: Standard accuracy verification
            standard_result = self._verify_standard_accuracy(document_text)
            
            # Step 3: Precedent relevance verification
            precedent_result = self._verify_precedent_relevance(
                document_text, case_context, incident_type, evidence_type, procedural_defects
            )
            
            # Step 4: Chain-of-custody verification
            custody_result = self._verify_chain_of_custody(document_text, procedural_defects)
            
            # Step 5: Hallucination detection
            hallucination_report = self._detect_hallucinations(document_text, retrieved_chunks)
            
            # Calculate overall confidence
            overall_confidence = self._calculate_overall_confidence(
                citation_result, standard_result, precedent_result, custody_result, hallucination_report
            )
            
            # Determine overall verdict
            overall_verdict = self._determine_overall_verdict(
                overall_confidence, citation_result, standard_result, precedent_result, custody_result, hallucination_report
            )
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                citation_result, standard_result, precedent_result, custody_result, hallucination_report
            )
            
            # Identify critical issues
            critical_issues = self._identify_critical_issues(
                citation_result, standard_result, precedent_result, custody_result, hallucination_report
            )
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return AccuracyPipelineResult(
                overall_confidence=overall_confidence,
                overall_verdict=overall_verdict,
                verification_steps=self.verification_steps,
                citation_accuracy=citation_result,
                standard_accuracy=standard_result,
                precedent_relevance=precedent_result,
                chain_of_custody=custody_result,
                hallucination_report=hallucination_report,
                recommendations=recommendations,
                critical_issues=critical_issues,
                processing_time=processing_time,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error(f"Accuracy pipeline failed: {e}", exc_info=True)
            
            # Return failure result
            return AccuracyPipelineResult(
                overall_confidence=0.0,
                overall_verdict="NOT_READY",
                verification_steps=self.verification_steps,
                citation_accuracy=CitationAccuracyResult(0, 0, 0, 0, 0, 0.0, []),
                standard_accuracy=StandardAccuracyResult(0, 0, 0, 0, 0.0, []),
                precedent_relevance=PrecedentRelevanceResult(0, 0, 0, 0, 0, 0.0, 0.0, []),
                chain_of_custody=ChainOfCustodyResult(0.0, 0, 0, 0, 0, 0, 0.0, []),
                hallucination_report=None,
                recommendations=[f"Pipeline error: {str(e)}"],
                critical_issues=[f"Critical pipeline failure: {str(e)}"],
                processing_time=(datetime.now() - start_time).total_seconds(),
                timestamp=datetime.now()
            )
    
    def _verify_citation_accuracy(self, document_text: str) -> CitationAccuracyResult:
        """Verify citation accuracy using cross-database consensus"""
        
        step = VerificationStep(
            step_name="Citation Accuracy Verification",
            status="IN_PROGRESS",
            confidence=0.0,
            details="Verifying citations against Indian Kanoon, SCC Online, and Manupatra",
            errors=[],
            warnings=[],
            timestamp=datetime.now()
        )
        
        try:
            # Extract citations from document
            citations = self._extract_citations(document_text)
            
            verified_count = 0
            unverified_count = 0
            hallucinated_count = 0
            divergent_count = 0
            citation_details = []
            
            for citation in citations:
                try:
                    # Verify using cross-database consensus
                    result = self.consensus_verifier.verify_citation_consensus(citation)
                    
                    citation_detail = {
                        "citation": citation,
                        "verified": result["final_verdict"] == "VERIFIED",
                        "confidence": result["consensus_confidence"],
                        "sources": [v["source"] for v in result["verifications"] if v["verified"]],
                        "divergent": result["divergent_holdings"]
                    }
                    citation_details.append(citation_detail)
                    
                    if result["final_verdict"] == "VERIFIED":
                        verified_count += 1
                    elif result["final_verdict"] == "REJECTED":
                        hallucinated_count += 1
                    else:
                        unverified_count += 1
                    
                    if result["divergent_holdings"]:
                        divergent_count += 1
                        
                except Exception as e:
                    logger.warning(f"Failed to verify citation {citation}: {e}")
                    unverified_count += 1
                    citation_details.append({
                        "citation": citation,
                        "verified": False,
                        "confidence": 0.0,
                        "sources": [],
                        "divergent": False,
                        "error": str(e)
                    })
            
            # Calculate accuracy score
            total_citations = len(citations)
            accuracy_score = verified_count / total_citations if total_citations > 0 else 1.0
            
            step.status = "PASSED" if accuracy_score >= 0.8 else "WARNING" if accuracy_score >= 0.5 else "FAILED"
            step.confidence = accuracy_score
            step.details = f"Verified {verified_count}/{total_citations} citations ({accuracy_score:.1%} accuracy)"
            
            if hallucinated_count > 0:
                step.errors.append(f"Found {hallucinated_count} potentially hallucinated citations")
            if divergent_count > 0:
                step.warnings.append(f"Found {divergent_count} citations with divergent holdings")
            
            self.verification_steps.append(step)
            
            return CitationAccuracyResult(
                total_citations=total_citations,
                verified_citations=verified_count,
                unverified_citations=unverified_count,
                hallucinated_citations=hallucinated_count,
                divergent_citations=divergent_count,
                accuracy_score=accuracy_score,
                citation_details=citation_details
            )
            
        except Exception as e:
            logger.error(f"Citation accuracy verification failed: {e}")
            step.status = "FAILED"
            step.errors.append(str(e))
            self.verification_steps.append(step)
            
            return CitationAccuracyResult(0, 0, 0, 0, 0, 0.0, [])
    
    def _verify_standard_accuracy(self, document_text: str) -> StandardAccuracyResult:
        """Verify IS/ASTM standard accuracy"""
        
        step = VerificationStep(
            step_name="Standard Accuracy Verification",
            status="IN_PROGRESS",
            confidence=0.0,
            details="Verifying IS/ASTM standards against BIS portal and archive.org",
            errors=[],
            warnings=[],
            timestamp=datetime.now()
        )
        
        try:
            # Extract standards from document
            standards = self._extract_standards(document_text)
            
            verified_count = 0
            superseded_count = 0
            inapplicable_count = 0
            standard_details = []
            
            for standard in standards:
                try:
                    # Verify standard
                    result = self.standards_db.verify_standard(standard)
                    
                    standard_detail = {
                        "standard": standard,
                        "verified": result.get("verified", False),
                        "superseded": result.get("superseded", False),
                        "title": result.get("title", ""),
                        "scope": result.get("scope", ""),
                        "applicability": result.get("material_applicability", [])
                    }
                    standard_details.append(standard_detail)
                    
                    if result.get("verified", False):
                        verified_count += 1
                        if result.get("superseded", False):
                            superseded_count += 1
                            step.warnings.append(f"Standard {standard} is superseded")
                    else:
                        inapplicable_count += 1
                        step.errors.append(f"Standard {standard} could not be verified")
                        
                except Exception as e:
                    logger.warning(f"Failed to verify standard {standard}: {e}")
                    inapplicable_count += 1
                    standard_details.append({
                        "standard": standard,
                        "verified": False,
                        "superseded": False,
                        "error": str(e)
                    })
            
            # Calculate accuracy score
            total_standards = len(standards)
            accuracy_score = verified_count / total_standards if total_standards > 0 else 1.0
            
            step.status = "PASSED" if accuracy_score >= 0.9 and superseded_count == 0 else "WARNING" if accuracy_score >= 0.7 else "FAILED"
            step.confidence = accuracy_score
            step.details = f"Verified {verified_count}/{total_standards} standards ({accuracy_score:.1%} accuracy)"
            
            if superseded_count > 0:
                step.warnings.append(f"Found {superseded_count} superseded standards")
            
            self.verification_steps.append(step)
            
            return StandardAccuracyResult(
                total_standards=total_standards,
                verified_standards=verified_count,
                superseded_standards=superseded_count,
                inapplicable_standards=inapplicable_count,
                accuracy_score=accuracy_score,
                standard_details=standard_details
            )
            
        except Exception as e:
            logger.error(f"Standard accuracy verification failed: {e}")
            step.status = "FAILED"
            step.errors.append(str(e))
            self.verification_steps.append(step)
            
            return StandardAccuracyResult(0, 0, 0, 0, 0.0, [])
    
    def _verify_precedent_relevance(
        self,
        document_text: str,
        case_context: str,
        incident_type: str,
        evidence_type: str,
        procedural_defects: List[str]
    ) -> PrecedentRelevanceResult:
        """Verify precedent relevance using fact-fit analysis"""
        
        step = VerificationStep(
            step_name="Precedent Relevance Verification",
            status="IN_PROGRESS",
            confidence=0.0,
            details="Analyzing precedent relevance using fact-fit scoring",
            errors=[],
            warnings=[],
            timestamp=datetime.now()
        )
        
        try:
            # Extract precedents from document
            precedents = self._extract_precedents(document_text)
            
            highly_relevant = 0
            moderately_relevant = 0
            low_relevance = 0
            irrelevant = 0
            total_fact_fit = 0
            precedent_details = []
            
            for precedent in precedents:
                try:
                    # Calculate fact-fit score
                    fact_fit = self._calculate_fact_fit_score(
                        precedent, case_context, incident_type, evidence_type, procedural_defects
                    )
                    
                    precedent_detail = {
                        "precedent": precedent,
                        "fact_fit_score": fact_fit["total_score"],
                        "incident_match": fact_fit["incident_match"],
                        "evidence_match": fact_fit["evidence_match"],
                        "procedural_match": fact_fit["procedural_match"],
                        "relevance_level": fact_fit["level"]
                    }
                    precedent_details.append(precedent_detail)
                    
                    total_fact_fit += fact_fit["total_score"]
                    
                    if fact_fit["level"] == "exact":
                        highly_relevant += 1
                    elif fact_fit["level"] == "analogous":
                        moderately_relevant += 1
                    elif fact_fit["level"] == "weak":
                        low_relevance += 1
                    else:
                        irrelevant += 1
                        
                except Exception as e:
                    logger.warning(f"Failed to analyze precedent {precedent}: {e}")
                    irrelevant += 1
                    precedent_details.append({
                        "precedent": precedent,
                        "fact_fit_score": 0,
                        "error": str(e)
                    })
            
            # Calculate relevance score
            total_precedents = len(precedents)
            average_fact_fit = total_fact_fit / total_precedents if total_precedents > 0 else 0.0
            relevance_score = highly_relevant / total_precedents if total_precedents > 0 else 1.0
            
            step.status = "PASSED" if relevance_score >= 0.6 else "WARNING" if relevance_score >= 0.3 else "FAILED"
            step.confidence = relevance_score
            step.details = f"Found {highly_relevant} highly relevant precedents out of {total_precedents} ({relevance_score:.1%} relevance)"
            
            if irrelevant > 0:
                step.warnings.append(f"Found {irrelevant} irrelevant precedents")
            
            self.verification_steps.append(step)
            
            return PrecedentRelevanceResult(
                total_precedents=total_precedents,
                highly_relevant=highly_relevant,
                moderately_relevant=moderately_relevant,
                low_relevance=low_relevance,
                irrelevant=irrelevant,
                average_fact_fit=average_fact_fit,
                relevance_score=relevance_score,
                precedent_details=precedent_details
            )
            
        except Exception as e:
            logger.error(f"Precedent relevance verification failed: {e}")
            step.status = "FAILED"
            step.errors.append(str(e))
            self.verification_steps.append(step)
            
            return PrecedentRelevanceResult(0, 0, 0, 0, 0, 0.0, 0.0, [])
    
    def _verify_chain_of_custody(
        self,
        document_text: str,
        procedural_defects: List[str]
    ) -> ChainOfCustodyResult:
        """Verify chain-of-custody compliance"""
        
        step = VerificationStep(
            step_name="Chain-of-Custody Verification",
            status="IN_PROGRESS",
            confidence=0.0,
            details="Analyzing chain-of-custody compliance with IS standards",
            errors=[],
            warnings=[],
            timestamp=datetime.now()
        )
        
        try:
            # Extract sampling details from document
            sampling_details = self._extract_sampling_details(document_text, procedural_defects)
            
            # Verify using chain-of-custody specialist
            verification_result = self.chain_custody_specialist.verify_sampling_procedure(sampling_details)
            
            step.status = "PASSED" if verification_result["overall_compliance"] >= 0.8 else "WARNING" if verification_result["overall_compliance"] >= 0.5 else "FAILED"
            step.confidence = verification_result["overall_compliance"]
            step.details = f"Chain-of-custody compliance: {verification_result['overall_compliance']:.1%}"
            
            if verification_result["critical_violations"] > 0:
                step.errors.append(f"Found {verification_result['critical_violations']} critical violations")
            if verification_result["high_violations"] > 0:
                step.warnings.append(f"Found {verification_result['high_violations']} high-severity violations")
            
            self.verification_steps.append(step)
            
            return ChainOfCustodyResult(
                overall_compliance=verification_result["overall_compliance"],
                critical_violations=verification_result["critical_violations"],
                high_violations=verification_result["high_violations"],
                medium_violations=0,  # Not currently tracked
                low_violations=0,  # Not currently tracked
                compliances=len(verification_result["compliances"]),
                compliance_score=verification_result["overall_compliance"],
                violation_details=verification_result["violations"]
            )
            
        except Exception as e:
            logger.error(f"Chain-of-custody verification failed: {e}")
            step.status = "FAILED"
            step.errors.append(str(e))
            self.verification_steps.append(step)
            
            return ChainOfCustodyResult(0.0, 0, 0, 0, 0, 0, 0.0, [])
    
    def _detect_hallucinations(
        self,
        document_text: str,
        retrieved_chunks: Optional[List]
    ) -> Optional[HallucinationReport]:
        """Detect hallucinations in the document"""
        
        step = VerificationStep(
            step_name="Hallucination Detection",
            status="IN_PROGRESS",
            confidence=0.0,
            details="Checking for hallucinated content using grounding verification",
            errors=[],
            warnings=[],
            timestamp=datetime.now()
        )
        
        try:
            # Use hallucination breaker
            hallucination_report = check_hallucination(document_text, retrieved_chunks or [])
            
            step.status = "PASSED" if not hallucination_report.blocked else "FAILED"
            step.confidence = 1.0 - hallucination_report.hallucination_score
            step.details = f"Hallucination score: {hallucination_report.hallucination_score:.2%}"
            
            if hallucination_report.blocked:
                step.errors.append(f"Hallucination circuit breaker triggered - {len(hallucination_report.ungrounded)} ungrounded items")
            elif hallucination_report.ungrounded:
                step.warnings.append(f"Found {len(hallucination_report.ungrounded)} potentially ungrounded items")
            
            self.verification_steps.append(step)
            
            return hallucination_report
            
        except Exception as e:
            logger.error(f"Hallucination detection failed: {e}")
            step.status = "FAILED"
            step.errors.append(str(e))
            self.verification_steps.append(step)
            
            return None
    
    def _calculate_overall_confidence(
        self,
        citation_result: CitationAccuracyResult,
        standard_result: StandardAccuracyResult,
        precedent_result: PrecedentRelevanceResult,
        custody_result: ChainOfCustodyResult,
        hallucination_report: Optional[HallucinationReport]
    ) -> float:
        """Calculate overall confidence score"""
        
        # Weighted average of all verification steps
        weights = {
            "citation": 0.25,
            "standard": 0.20,
            "precedent": 0.25,
            "custody": 0.15,
            "hallucination": 0.15
        }
        
        overall = (
            citation_result.accuracy_score * weights["citation"] +
            standard_result.accuracy_score * weights["standard"] +
            precedent_result.relevance_score * weights["precedent"] +
            custody_result.compliance_score * weights["custody"]
        )
        
        # Add hallucination score if available
        if hallucination_report:
            hallucination_score = 1.0 - hallucination_report.hallucination_score
            overall += hallucination_score * weights["hallucination"]
        else:
            # If no hallucination check, reduce weight proportionally
            total_other_weights = sum(weights.values()) - weights["hallucination"]
            overall = overall / total_other_weights
        
        return min(overall, 1.0)
    
    def _determine_overall_verdict(
        self,
        overall_confidence: float,
        citation_result: CitationAccuracyResult,
        standard_result: StandardAccuracyResult,
        precedent_result: PrecedentRelevanceResult,
        custody_result: ChainOfCustodyResult,
        hallucination_report: Optional[HallucinationReport]
    ) -> str:
        """Determine overall verdict"""
        
        # Critical failure conditions
        if hallucination_report and hallucination_report.blocked:
            return "NOT_READY"
        
        if citation_result.hallucinated_citations > 0:
            return "NOT_READY"
        
        if standard_result.superseded_standards > 0:
            return "REQUIRES_REVIEW"
        
        if custody_result.critical_violations > 0:
            return "REQUIRES_REVIEW"
        
        # Confidence-based verdict
        if overall_confidence >= 0.85:
            return "READY_FOR_COURT"
        elif overall_confidence >= 0.70:
            return "REQUIRES_REVIEW"
        else:
            return "NOT_READY"
    
    def _generate_recommendations(
        self,
        citation_result: CitationAccuracyResult,
        standard_result: StandardAccuracyResult,
        precedent_result: PrecedentRelevanceResult,
        custody_result: ChainOfCustodyResult,
        hallucination_report: Optional[HallucinationReport]
    ) -> List[str]:
        """Generate recommendations based on verification results"""
        
        recommendations = []
        
        # Citation recommendations
        if citation_result.accuracy_score < 0.8:
            recommendations.append("Improve citation verification rate - verify additional sources")
        if citation_result.hallucinated_citations > 0:
            recommendations.append("Remove or verify potentially hallucinated citations")
        if citation_result.divergent_citations > 0:
            recommendations.append("Review citations with divergent holdings across databases")
        
        # Standard recommendations
        if standard_result.superseded_standards > 0:
            recommendations.append("Replace superseded standards with current versions")
        if standard_result.accuracy_score < 0.9:
            recommendations.append("Verify additional IS/ASTM standards against official sources")
        
        # Precedent recommendations
        if precedent_result.relevance_score < 0.6:
            recommendations.append("Search for more relevant precedents with higher fact-fit scores")
        if precedent_result.irrelevant > 0:
            recommendations.append("Remove or replace irrelevant precedents")
        
        # Chain-of-custody recommendations
        if custody_result.critical_violations > 0:
            recommendations.append("Address critical chain-of-custody violations before filing")
        if custody_result.high_violations > 0:
            recommendations.append("Review high-severity chain-of-custody issues")
        
        # Hallucination recommendations
        if hallucination_report and hallucination_report.ungrounded:
            recommendations.append("Review and provide sources for ungrounded content")
        
        if not recommendations:
            recommendations.append("Document meets accuracy standards - ready for court filing")
        
        return recommendations
    
    def _identify_critical_issues(
        self,
        citation_result: CitationAccuracyResult,
        standard_result: StandardAccuracyResult,
        precedent_result: PrecedentRelevanceResult,
        custody_result: ChainOfCustodyResult,
        hallucination_report: Optional[HallucinationReport]
    ) -> List[str]:
        """Identify critical issues that must be addressed"""
        
        critical_issues = []
        
        if hallucination_report and hallucination_report.blocked:
            critical_issues.append("HALLUCINATION DETECTED - Document contains unverified content")
        
        if citation_result.hallucinated_citations > 0:
            critical_issues.append(f"HALLUCINATED CITATIONS - {citation_result.hallucinated_citations} citations could not be verified")
        
        if standard_result.superseded_standards > 0:
            critical_issues.append(f"SUPERSEDED STANDARDS - {standard_result.superseded_standards} standards are no longer current")
        
        if custody_result.critical_violations > 0:
            critical_issues.append(f"CRITICAL CUSTODY VIOLATIONS - {custody_result.critical_violations} critical procedural defects found")
        
        if precedent_result.irrelevant > precedent_result.highly_relevant:
            critical_issues.append("LOW PRECEDENT RELEVANCE - Most precedents have low fact-fit scores")
        
        return critical_issues
    
    # Helper methods for extraction
    def _extract_citations(self, text: str) -> List[str]:
        """Extract legal citations from text"""
        import re
        citation_patterns = [
            r'\bv\.\s+[\w\s&]+\s+\(\d{4}\)\s+\d+\s+SCC\s+\d+',
            r'\b[\w\s&]+\s+v\.\s+[\w\s&]+\s+\(\d{4}\)\s+\d+\s+SCC\s+\d+',
            r'\b[\w\s&]+\s+v\.\s+[\w\s&]+\s+\d{4}\s+INSC\s+\d+',
            r'\b\d{4}\s+SCC\s+OnLine\s+\w+\s+\d+',
        ]
        
        citations = []
        for pattern in citation_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            citations.extend(matches)
        
        return list(set(citations))  # Deduplicate
    
    def _extract_standards(self, text: str) -> List[str]:
        """Extract IS/ASTM standards from text"""
        import re
        standard_patterns = [
            r'IS\s+(\d+)(?::\s*(\d{4}))?',
            r'ASTM\s+([A-Z]\d+)(?::\s*(\d{4}))?',
            r'BS\s+(\d+)(?::\s*(\d{4}))?',
        ]
        
        standards = []
        for pattern in standard_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if match[1]:  # Has year
                    standards.append(f"{match[0]}:{match[1]}")
                else:
                    standards.append(match[0])
        
        return list(set(standards))  # Deduplicate
    
    def _extract_precedents(self, text: str) -> List[str]:
        """Extract case precedents from text"""
        # This is a simplified extraction - in production would use more sophisticated NLP
        return self._extract_citations(text)  # Reuse citation extraction
    
    def _extract_sampling_details(self, text: str, procedural_defects: List[str]) -> Dict[str, Any]:
        """Extract sampling procedure details from text"""
        # This is a simplified extraction - in production would use more sophisticated NLP
        return {
            "weather_conditions": "rain" if "rain" in text.lower() else "unknown",
            "contractor_representative_present": "representative" in text.lower(),
            "sampling_locations": ["location_1", "location_2", "location_3", "location_4", "location_5"],  # Placeholder
            "standard_used": "IS 1199" if "IS 1199" in text else "IS 2250",
            "material_type": "hardened_mortar" if "mortar" in text.lower() else "fresh_concrete",
            "proper_sealing": "seal" in text.lower(),
            "procedural_defects": procedural_defects
        }
    
    def _calculate_fact_fit_score(
        self,
        precedent: str,
        case_context: str,
        incident_type: str,
        evidence_type: str,
        procedural_defects: List[str]
    ) -> Dict[str, Any]:
        """Calculate fact-fit score for a precedent"""
        # Simplified fact-fit calculation - in production would use more sophisticated analysis
        incident_match = 20  # Placeholder
        evidence_match = 15  # Placeholder
        procedural_match = 10  # Placeholder
        
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