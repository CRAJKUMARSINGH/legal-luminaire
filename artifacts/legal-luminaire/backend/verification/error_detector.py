"""
Legal Error Detector
Detects hallucinated citations, incorrect IS clauses, superseded standards, misrepresented holdings, and factual inconsistencies
"""
from __future__ import annotations

import logging
import re
from typing import Dict, Any, List, Optional, Set
from dataclasses import dataclass
from datetime import datetime
from enum import Enum

from agents.tools.legal_verifier import CrossDatabaseConsensus
from rag.standards_database import ISStandardsDatabase

logger = logging.getLogger(__name__)


class ErrorSeverity(Enum):
    """Severity levels for detected errors"""
    CRITICAL = "CRITICAL"  # Must fix before filing
    HIGH = "HIGH"  # Should fix before filing
    MEDIUM = "MEDIUM"  # Review recommended
    LOW = "LOW"  # Minor issue


class ErrorType(Enum):
    """Types of legal errors that can be detected"""
    HALLUCINATED_CITATION = "HALLUCINATED_CITATION"
    INCORRECT_IS_CLAUSE = "INCORRECT_IS_CLAUSE"
    SUPERSEDED_STANDARD = "SUPERSEDED_STANDARD"
    MISREPRESENTED_HOLDING = "MISREPRESENTED_HOLDING"
    FACTUAL_INCONSISTENCY = "FACTUAL_INCONSISTENCY"
    CONTRADICTORY_ARGUMENT = "CONTRADICTORY_ARGUMENT"
    MISSING_PRECEDENT = "MISSING_PRECEDENT"
    INAPPLICABLE_STANDARD = "INAPPLICABLE_STANDARD"


@dataclass
class DetectedError:
    """A detected error in the legal document"""
    error_type: ErrorType
    severity: ErrorSeverity
    location: str  # Reference to where error occurs in document
    description: str
    incorrect_content: str
    suggested_correction: str
    confidence: float
    verification_details: Dict[str, Any]


@dataclass
class ErrorDetectionResult:
    """Result of error detection analysis"""
    total_errors: int
    critical_errors: int
    high_errors: int
    medium_errors: int
    low_errors: int
    errors_by_type: Dict[ErrorType, int]
    detected_errors: List[DetectedError]
    overall_document_health: str  # "HEALTHY", "NEEDS_REVIEW", "CRITICAL"
    recommendations: List[str]
    timestamp: datetime


class LegalErrorDetector:
    """Detects various types of legal errors in documents"""
    
    def __init__(self):
        self.consensus_verifier = CrossDatabaseConsensus()
        self.standards_db = ISStandardsDatabase()
        
        # Known safe precedents (from implementation plan)
        self.known_safe_precedents = {
            "Kattavellai @ Devakar v. State of Tamil Nadu (2025) INSC 845",
            "Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4",
            "State of Bihar v. Ramesh Singh (1977) 4 SCC 39",
            "Jacob Mathew v. State of Punjab (2005) 6 SCC 1",
            "State of Maharashtra v. Damu (2000) 6 SCC 269",
            "State of Punjab v. Baldev Singh (1999) 6 SCC 172",
        }
        
        # Known problematic precedents
        self.known_problematic_precedents = {
            "R.B. Constructions (2014 SCC OnLine Bom 125)",
            "K.S. Kalra (2011 SCC OnLine Del 3412)",
            "Builders Association v. State of UP (2018)",
            "Mohanbhai (2003) 4 GLR 3121",
        }
    
    def detect_errors(
        self,
        document_text: str,
        case_context: str,
        incident_type: str = "construction wall collapse forensic mortar sampling",
        evidence_type: str = "material sampling forensic lab report chain of custody"
    ) -> ErrorDetectionResult:
        """Run comprehensive error detection on document"""
        
        detected_errors = []
        
        # Detect hallucinated citations
        citation_errors = self._detect_hallucinated_citations(document_text)
        detected_errors.extend(citation_errors)
        
        # Detect incorrect IS clauses
        standard_errors = self._detect_incorrect_standards(document_text, case_context)
        detected_errors.extend(standard_errors)
        
        # Detect superseded standards
        superseded_errors = self._detect_superseded_standards(document_text)
        detected_errors.extend(superseded_errors)
        
        # Detect misrepresented holdings
        holding_errors = self._detect_misrepresented_holdings(document_text)
        detected_errors.extend(holding_errors)
        
        # Detect factual inconsistencies
        factual_errors = self._detect_factual_inconsistencies(document_text, case_context)
        detected_errors.extend(factual_errors)
        
        # Detect contradictory arguments
        contradiction_errors = self._detect_contradictory_arguments(document_text)
        detected_errors.extend(contradiction_errors)
        
        # Detect missing precedents
        missing_errors = self._detect_missing_precedents(document_text, incident_type, evidence_type)
        detected_errors.extend(missing_errors)
        
        # Categorize errors by severity and type
        error_counts = self._categorize_errors(detected_errors)
        
        # Determine overall document health
        overall_health = self._determine_document_health(error_counts)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(detected_errors, error_counts)
        
        return ErrorDetectionResult(
            total_errors=len(detected_errors),
            critical_errors=error_counts["severity"]["CRITICAL"],
            high_errors=error_counts["severity"]["HIGH"],
            medium_errors=error_counts["severity"]["MEDIUM"],
            low_errors=error_counts["severity"]["LOW"],
            errors_by_type=error_counts["type"],
            detected_errors=detected_errors,
            overall_document_health=overall_health,
            recommendations=recommendations,
            timestamp=datetime.now()
        )
    
    def _detect_hallucinated_citations(self, document_text: str) -> List[DetectedError]:
        """Detect potentially hallucinated citations"""
        
        errors = []
        citations = self._extract_citations(document_text)
        
        for citation in citations:
            try:
                # Verify using cross-database consensus
                result = self.consensus_verifier.verify_citation_consensus(citation)
                
                if result["final_verdict"] == "REJECTED":
                    errors.append(DetectedError(
                        error_type=ErrorType.HALLUCINATED_CITATION,
                        severity=ErrorSeverity.CRITICAL,
                        location=self._find_citation_location(document_text, citation),
                        description=f"Citation could not be verified on any legal database",
                        incorrect_content=citation,
                        suggested_correction="Remove this citation or find verified alternative",
                        confidence=0.9,
                        verification_details=result
                    ))
                elif result["final_verdict"] == "PENDING":
                    errors.append(DetectedError(
                        error_type=ErrorType.HALLUCINATED_CITATION,
                        severity=ErrorSeverity.HIGH,
                        location=self._find_citation_location(document_text, citation),
                        description=f"Citation verification inconclusive - low confidence",
                        incorrect_content=citation,
                        suggested_correction="Verify this citation manually or use more reliable precedent",
                        confidence=0.7,
                        verification_details=result
                    ))
                elif result["divergent_holdings"]:
                    errors.append(DetectedError(
                        error_type=ErrorType.MISREPRESENTED_HOLDING,
                        severity=ErrorSeverity.MEDIUM,
                        location=self._find_citation_location(document_text, citation),
                        description=f"Divergent holdings found across databases for this citation",
                        incorrect_content=citation,
                        suggested_correction="Review holding and specify which source is being used",
                        confidence=0.8,
                        verification_details=result
                    ))
                    
            except Exception as e:
                logger.warning(f"Failed to verify citation {citation}: {e}")
                errors.append(DetectedError(
                    error_type=ErrorType.HALLUCINATED_CITATION,
                    severity=ErrorSeverity.HIGH,
                    location=self._find_citation_location(document_text, citation),
                    description=f"Citation verification failed: {str(e)}",
                    incorrect_content=citation,
                    suggested_correction="Manually verify this citation",
                    confidence=0.6,
                    verification_details={"error": str(e)}
                ))
        
        return errors
    
    def _detect_incorrect_standards(self, document_text: str, case_context: str) -> List[DetectedError]:
        """Detect incorrect IS/ASTM standard usage"""
        
        errors = []
        standards = self._extract_standards(document_text)
        
        # Check for known problematic standard usage
        if "IS 1199" in document_text and "mortar" in case_context.lower():
            errors.append(DetectedError(
                error_type=ErrorType.INCORRECT_IS_CLAUSE,
                severity=ErrorSeverity.CRITICAL,
                location=self._find_standard_location(document_text, "IS 1199"),
                description="IS 1199 is for FRESH concrete only, not hardened mortar",
                incorrect_content="IS 1199",
                suggested_correction="Use IS 2250 for hardened masonry mortar",
                confidence=0.95,
                verification_details={"correct_standard": "IS 2250", "material": "hardened_mortar"}
            ))
        
        for standard in standards:
            try:
                result = self.standards_db.verify_standard(standard)
                
                if not result.get("verified", False):
                    errors.append(DetectedError(
                        error_type=ErrorType.INCORRECT_IS_CLAUSE,
                        severity=ErrorSeverity.HIGH,
                        location=self._find_standard_location(document_text, standard),
                        description=f"Standard {standard} could not be verified in database",
                        incorrect_content=standard,
                        suggested_correction="Verify standard code and check if it exists",
                        confidence=0.8,
                        verification_details=result
                    ))
                
                # Check applicability to mortar cases
                if "mortar" in case_context.lower():
                    applicability = self.standards_db.check_applicability(standard, "hardened_mortar")
                    if not applicability["applicable"]:
                        errors.append(DetectedError(
                            error_type=ErrorType.INAPPLICABLE_STANDARD,
                            severity=ErrorSeverity.HIGH,
                            location=self._find_standard_location(document_text, standard),
                            description=f"Standard {standard} is not applicable to hardened mortar",
                            incorrect_content=standard,
                            suggested_correction=applicability.get("suggestion", "Use appropriate standard for material type"),
                            confidence=0.85,
                            verification_details=applicability
                        ))
                        
            except Exception as e:
                logger.warning(f"Failed to verify standard {standard}: {e}")
        
        return errors
    
    def _detect_superseded_standards(self, document_text: str) -> List[DetectedError]:
        """Detect use of superseded standards"""
        
        errors = []
        standards = self._extract_standards(document_text)
        
        for standard in standards:
            try:
                result = self.standards_db.verify_standard(standard)
                
                if result.get("superseded", False):
                    replacement = result.get("replacement_code", "current version")
                    errors.append(DetectedError(
                        error_type=ErrorType.SUPERSEDED_STANDARD,
                        severity=ErrorSeverity.CRITICAL,
                        location=self._find_standard_location(document_text, standard),
                        description=f"Standard {standard} has been superseded",
                        incorrect_content=standard,
                        suggested_correction=f"Use {replacement} instead",
                        confidence=0.95,
                        verification_details=result
                    ))
                    
            except Exception as e:
                logger.warning(f"Failed to check superseded status for {standard}: {e}")
        
        return errors
    
    def _detect_misrepresented_holdings(self, document_text: str) -> List[DetectedError]:
        """Detect potentially misrepresented case holdings"""
        
        errors = []
        
        # Check for known problematic precedents
        for problematic in self.known_problematic_precedents:
            if problematic.lower() in document_text.lower():
                errors.append(DetectedError(
                    error_type=ErrorType.MISREPRESENTED_HOLDING,
                    severity=ErrorSeverity.HIGH,
                    location=self._find_citation_location(document_text, problematic),
                    description=f"Using potentially unreliable precedent: {problematic}",
                    incorrect_content=problematic,
                    suggested_correction="Replace with verified precedent from known safe list",
                    confidence=0.8,
                    verification_details={"known_issue": "Low verification status"}
                ))
        
        # Check for holding misrepresentations (simplified pattern matching)
        holding_patterns = [
            r'held\s+that\s+[^.]*?\.',
            r'it\s+was\s+held\s+[^.]*?\.',
            r'court\s+held\s+[^.]*?\.',
        ]
        
        for pattern in holding_patterns:
            matches = re.finditer(pattern, document_text, re.IGNORECASE)
            for match in matches:
                holding_text = match.group(0)
                # In production, would verify holding against database
                # For now, flag very long holdings as suspicious
                if len(holding_text) > 200:
                    errors.append(DetectedError(
                        error_type=ErrorType.MISREPRESENTED_HOLDING,
                        severity=ErrorSeverity.MEDIUM,
                        location=f"offset_{match.start()}",
                        description="Unusually long holding statement - may be paraphrased or incorrect",
                        incorrect_content=holding_text[:100] + "...",
                        suggested_correction="Verify holding against original judgment and quote verbatim",
                        confidence=0.6,
                        verification_details={"holding_length": len(holding_text)}
                    ))
        
        return errors
    
    def _detect_factual_inconsistencies(self, document_text: str, case_context: str) -> List[DetectedError]:
        """Detect factual inconsistencies within the document"""
        
        errors = []
        
        # Check for contradictory dates
        date_pattern = r'\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b'
        dates = re.findall(date_pattern, document_text)
        
        if len(dates) > 1:
            # Check if dates are inconsistent (simplified check)
            # In production, would do more sophisticated date analysis
            if len(set(dates)) > 5:  # Many different dates might indicate inconsistency
                errors.append(DetectedError(
                    error_type=ErrorType.FACTUAL_INCONSISTENCY,
                    severity=ErrorSeverity.LOW,
                    location="multiple_locations",
                    description="Multiple different dates found - verify timeline consistency",
                    incorrect_content=f"Found {len(set(dates))} different dates",
                    suggested_correction="Review and standardize date references",
                    confidence=0.5,
                    verification_details={"dates_found": list(set(dates))}
                ))
        
        # Check for contradictory standard references
        if "IS 1199" in document_text and "IS 2250" in document_text:
            errors.append(DetectedError(
                error_type=ErrorType.FACTUAL_INCONSISTENCY,
                severity=ErrorSeverity.HIGH,
                location="multiple_locations",
                description="Document references both IS 1199 (fresh concrete) and IS 2250 (mortar) - clarify material type",
                incorrect_content="Mixed standard references",
                suggested_correction="Clarify which material type is involved and use appropriate standard",
                confidence=0.9,
                verification_details={"standards": ["IS 1199", "IS 2250"]}
            ))
        
        # Check for inconsistent sampling descriptions
        if "rain" in document_text.lower() and "proper sampling" in document_text.lower():
            errors.append(DetectedError(
                error_type=ErrorType.FACTUAL_INCONSISTENCY,
                severity=ErrorSeverity.HIGH,
                location="multiple_locations",
                description="Document mentions rain during sampling but also claims proper sampling procedure",
                incorrect_content="Contradictory sampling conditions",
                suggested_correction="Clarify weather conditions during sampling and procedural compliance",
                confidence=0.85,
                verification_details={"weather_mentioned": "rain", "procedure_claimed": "proper"}
            ))
        
        return errors
    
    def _detect_contradictory_arguments(self, document_text: str) -> List[DetectedError]:
        """Detect contradictory legal arguments"""
        
        errors = []
        
        # Check for contradictory discharge application arguments
        contradictory_patterns = [
            (r'no\s+evidence\s+exists', r'ample\s+evidence'),
            (r'procedure\s+followed', r'procedure\s+not\s+followed'),
            (r'standard\s+complied', r'standard\s+violated'),
            (r'sampling\s+proper', r'sampling\s+improper'),
        ]
        
        for pattern1, pattern2 in contradictory_patterns:
            if re.search(pattern1, document_text, re.IGNORECASE) and re.search(pattern2, document_text, re.IGNORECASE):
                errors.append(DetectedError(
                    error_type=ErrorType.CONTRADICTORY_ARGUMENT,
                    severity=ErrorSeverity.HIGH,
                    location="multiple_locations",
                    description=f"Contradictory arguments found: '{pattern1}' vs '{pattern2}'",
                    incorrect_content="Contradictory legal arguments",
                    suggested_correction="Resolve contradiction and maintain consistent argument",
                    confidence=0.8,
                    verification_details={"patterns": [pattern1, pattern2]}
                ))
        
        return errors
    
    def _detect_missing_precedents(
        self,
        document_text: str,
        incident_type: str,
        evidence_type: str
    ) -> List[DetectedError]:
        """Detect missing important precedents"""
        
        errors = []
        
        # Check for missing key precedents based on case type
        key_precedents = {
            "chain of custody": [
                "Kattavellai @ Devakar v. State of Tamil Nadu (2025) INSC 845",
            ],
            "discharge application": [
                "Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4",
                "State of Bihar v. Ramesh Singh (1977) 4 SCC 39",
            ],
            "forensic evidence": [
                "State of Maharashtra v. Damu (2000) 6 SCC 269",
                "Jacob Mathew v. State of Punjab (2005) 6 SCC 1",
            ],
        }
        
        for case_type, precedents in key_precedents.items():
            if case_type.lower() in incident_type.lower() or case_type.lower() in evidence_type.lower():
                for precedent in precedents:
                    if precedent.lower() not in document_text.lower():
                        errors.append(DetectedError(
                            error_type=ErrorType.MISSING_PRECEDENT,
                            severity=ErrorSeverity.MEDIUM,
                            location="precedent_section",
                            description=f"Potentially missing key precedent for {case_type}: {precedent}",
                            incorrect_content="Missing precedent",
                            suggested_correction=f"Consider adding {precedent} to strengthen argument",
                            confidence=0.7,
                            verification_details={"case_type": case_type, "suggested_precedent": precedent}
                        ))
        
        return errors
    
    def _categorize_errors(self, errors: List[DetectedError]) -> Dict[str, Any]:
        """Categorize errors by severity and type"""
        
        severity_counts = {severity.value: 0 for severity in ErrorSeverity}
        type_counts = {error_type.value: 0 for error_type in ErrorType}
        
        for error in errors:
            severity_counts[error.severity.value] += 1
            type_counts[error.error_type.value] += 1
        
        return {
            "severity": severity_counts,
            "type": type_counts
        }
    
    def _determine_document_health(self, error_counts: Dict[str, Any]) -> str:
        """Determine overall document health based on errors"""
        
        critical = error_counts["severity"]["CRITICAL"]
        high = error_counts["severity"]["HIGH"]
        
        if critical > 0:
            return "CRITICAL"
        elif high > 2:
            return "CRITICAL"
        elif high > 0:
            return "NEEDS_REVIEW"
        elif error_counts["severity"]["MEDIUM"] > 3:
            return "NEEDS_REVIEW"
        else:
            return "HEALTHY"
    
    def _generate_recommendations(
        self,
        errors: List[DetectedError],
        error_counts: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations based on detected errors"""
        
        recommendations = []
        
        # Critical error recommendations
        if error_counts["severity"]["CRITICAL"] > 0:
            recommendations.append("CRITICAL: Address all critical errors before filing - document may be rejected")
        
        # Specific error type recommendations
        if error_counts["type"]["HALLUCINATED_CITATION"] > 0:
            recommendations.append("Remove or verify all hallucinated citations - use only verified precedents")
        
        if error_counts["type"]["SUPERSEDED_STANDARD"] > 0:
            recommendations.append("Replace all superseded standards with current versions")
        
        if error_counts["type"]["INCORRECT_IS_CLAUSE"] > 0:
            recommendations.append("Review and correct all IS/ASTM standard references")
        
        if error_counts["type"]["MISREPRESENTED_HOLDING"] > 0:
            recommendations.append("Verify all case holdings against original judgments")
        
        if error_counts["type"]["CONTRADICTORY_ARGUMENT"] > 0:
            recommendations.append("Resolve all contradictory arguments to maintain consistency")
        
        if error_counts["type"]["MISSING_PRECEDENT"] > 0:
            recommendations.append("Consider adding suggested key precedents to strengthen legal arguments")
        
        # General recommendations
        if not errors:
            recommendations.append("No errors detected - document appears ready for filing")
        elif error_counts["severity"]["CRITICAL"] == 0 and error_counts["severity"]["HIGH"] <= 1:
            recommendations.append("Document has minor issues - review recommendations before filing")
        
        return recommendations
    
    # Helper methods
    def _extract_citations(self, text: str) -> List[str]:
        """Extract legal citations from text"""
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
        
        return list(set(citations))
    
    def _extract_standards(self, text: str) -> List[str]:
        """Extract IS/ASTM standards from text"""
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
        
        return list(set(standards))
    
    def _find_citation_location(self, text: str, citation: str) -> str:
        """Find location of citation in text"""
        index = text.lower().find(citation.lower())
        if index != -1:
            return f"offset_{index}"
        return "unknown_location"
    
    def _find_standard_location(self, text: str, standard: str) -> str:
        """Find location of standard in text"""
        index = text.lower().find(standard.lower())
        if index != -1:
            return f"offset_{index}"
        return "unknown_location"