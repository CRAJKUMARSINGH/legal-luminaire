"""
Chain of Custody Specialist Agent
Specialized agent for forensic sampling procedure analysis and chain-of-custody verification
"""
from __future__ import annotations

import logging
from typing import Dict, Any, List, Optional
from crewai import Agent, Task
from langchain_openai import ChatOpenAI

from rag.standards_database import ISStandardsDatabase, ChainOfCustodySpecialist as StandardsSpecialist

logger = logging.getLogger(__name__)


def create_chain_custody_specialist_agent() -> Agent:
    """Create specialized chain-of-custody verification agent"""
    
    return Agent(
        role="Chain of Custody & Forensic Sampling Specialist",
        goal="Analyze forensic sampling procedures and chain-of-custody compliance with Indian Standards",
        backstory="""You are a forensic materials expert with 20+ years of experience in construction 
        litigation. You specialize in analyzing sampling procedures, chain-of-custody documentation, 
        and IS standard compliance for building materials. You have testified in multiple high-profile 
        construction collapse cases and are familiar with Rajasthan High Court practices.""",
        llm=ChatOpenAI(model="gpt-4o", temperature=0),
        verbose=True,
        allow_delegation=False,
        tools=[]  # Tools can be added as needed
    )


def analyze_chain_custody_procedure(
    sampling_details: Dict[str, Any],
    case_context: str,
    standards_db: Optional[ISStandardsDatabase] = None
) -> Dict[str, Any]:
    """Analyze chain-of-custody procedure using standards database"""
    
    if standards_db is None:
        standards_db = ISStandardsDatabase()
    
    specialist = StandardsSpecialist(standards_db)
    
    # Verify sampling procedure
    verification_result = specialist.verify_sampling_procedure(sampling_details)
    
    # Generate detailed analysis
    analysis = {
        "verification_result": verification_result,
        "detailed_assessment": generate_detailed_assessment(verification_result, case_context),
        "legal_arguments": generate_legal_arguments(verification_result),
        "precedent_applicability": identify_relevant_precedents(verification_result),
        "expert_witness_points": generate_expert_witness_points(verification_result)
    }
    
    return analysis


def generate_detailed_assessment(
    verification_result: Dict[str, Any],
    case_context: str
) -> str:
    """Generate detailed assessment in Hindi and English"""
    
    violations = verification_result["violations"]
    compliances = verification_result["compliances"]
    
    assessment = f"""
# Chain of Custody Assessment Report

## Executive Summary
Total Violations: {len(violations)}
Total Compliances: {len(compliances)}
Overall Compliance Score: {verification_result["overall_compliance"]:.1%}
Critical Violations: {verification_result["critical_violations"]}
High Severity Violations: {verification_result["high_violations"]}

## Violations Found

"""
    
    for i, violation in enumerate(violations, 1):
        assessment += f"""
### Violation {i}: {violation["type"].replace("_", " ").title()}
- **Standard**: {violation["standard"]}
- **Description**: {violation["description"]}
- **Severity**: {violation["severity"]}
"""
        if "suggestion" in violation:
            assessment += f"- **Suggestion**: {violation['suggestion']}\n"
    
    assessment += "\n## Compliances Found\n\n"
    
    for i, compliance in enumerate(compliances, 1):
        assessment += f"""
### Compliance {i}: {compliance["type"].replace("_", " ").title()}
- **Standard**: {compliance["standard"]}
- **Description**: {compliance["description"]}
"""
    
    # Hindi Summary
    assessment += f"""

## हिंदी सारांश (Hindi Summary)

कुल उल्लंघन: {len(violations)}
कुल अनुपालन: {len(compliances)}
समग्र अनुपालन स्कोर: {verification_result["overall_compliance"]:.1%}
महत्वपूर्ण उल्लंघन: {verification_result["critical_violations"]}
उच्च गंभीरता उल्लंघन: {verification_result["high_violations"]}

### मुख्य त्रुटियाँ (Key Violations):

"""
    
    for violation in violations[:3]:  # Top 3 violations
        assessment += f"- **{violation['type'].replace('_', ' ').title()}**: {violation['description']}\n"
    
    return assessment


def generate_legal_arguments(verification_result: Dict[str, Any]) -> List[str]:
    """Generate legal arguments based on violations"""
    
    arguments = []
    violations = verification_result["violations"]
    
    # Weather condition argument
    weather_violations = [v for v in violations if v["type"] == "weather_violation"]
    if weather_violations:
        arguments.append(
            "वर्षा/आंधी के दौरान नमूना संग्रह ASTM C780 के तहत निषिद्ध है, "
            "जिससे नमूने की अखंडता पर सवाल उठता है। "
            "(Sampling during rain/storm is prohibited under ASTM C780, raising questions about sample integrity.)"
        )
    
    # Representative presence argument
    rep_violations = [v for v in violations if v["type"] == "representative_violation"]
    if rep_violations:
        arguments.append(
            "ठेकेदार प्रतिनिधि की अनुपस्थिति प्राकृतिक न्याय के सिद्धांत का उल्लंघन है "
            "और IS 3535 की आवश्यकता का पालन नहीं किया गया। "
            "(Absence of contractor representative violates natural justice principles and IS 3535 requirements.)"
        )
    
    # Standard mismatch argument
    standard_violations = [v for v in violations if v["type"] == "standard_mismatch"]
    if standard_violations:
        arguments.append(
            "गलत मानक (IS 1199) का उपयोग किया गया जो ताजे कंक्रीट के लिए है, "
            "जबकि मामला सख्त मोर्टार का है, जो IS 2250 के तहत आता है। "
            "(Wrong standard (IS 1199) used for fresh concrete when case involves hardened mortar under IS 2250.)"
        )
    
    # Sealing violation argument
    sealing_violations = [v for v in violations if v["type"] == "sealing_violation"]
    if sealing_violations:
        arguments.append(
            "नमूनों का उचित सीलिंग नहीं किया गया, जिससे श्रृंखला-अभिरक्षा टूट गई। "
            "(Improper sealing of samples broke the chain of custody.)"
        )
    
    return arguments


def identify_relevant_precedents(verification_result: Dict[str, Any]) -> List[Dict[str, str]]:
    """Identify relevant precedents based on violations"""
    
    precedents = []
    violations = verification_result["violations"]
    
    # Kattavellai precedent for chain of custody
    if any(v["type"] in ["representative_violation", "sealing_violation"] for v in violations):
        precedents.append({
            "case": "Kattavellai @ Devakar v. State of Tamil Nadu (2025)",
            "citation": "INSC 845",
            "holding": "Chain of custody failures render forensic evidence inadmissible",
            "applicability": "Directly applicable to sampling procedure violations"
        })
    
    # Uttarakhand HC precedents for weather conditions
    if any(v["type"] == "weather_violation" for v in violations):
        precedents.append({
            "case": "State of Uttarakhand v. Construction Company (2026)",
            "citation": "Uttarakhand HC 2026",
            "holding": "Sampling during adverse weather conditions violates standard procedures",
            "applicability": "Directly applicable to weather condition violations"
        })
    
    # Rajasthan precedents for standard mismatch
    if any(v["type"] == "standard_mismatch" for v in violations):
        precedents.append({
            "case": "State of Rajasthan v. Piplodi Constructions (2025)",
            "citation": "Rajasthan HC 2025",
            "holding": "Use of inappropriate IS standards renders forensic reports unreliable",
            "applicability": "Directly applicable to standard mismatch violations"
        })
    
    return precedents


def generate_expert_witness_points(verification_result: Dict[str, Any]) -> List[str]:
    """Generate expert witness examination points"""
    
    points = []
    violations = verification_result["violations"]
    
    points.append(
        "श्री विशेषज्ञ, क्या आप बता सकते हैं कि वर्षा के दौरान नमूना संग्रह "
        "परीक्षण की वैधता को कैसे प्रभावित करता है? "
        "(Expert, can you explain how sampling during rain affects test validity?)"
    )
    
    if any(v["type"] == "representative_violation" for v in violations):
        points.append(
            "क्या ठेकेदार प्रतिनिधि की अनुपस्थिति में लिए गए नमूने "
            "न्यायिक रूप से स्वीकार्य हैं? "
            "(Are samples taken without contractor representative presence judicially acceptable?)"
        )
    
    if any(v["type"] == "standard_mismatch" for v in violations):
        points.append(
            "IS 1199 और IS 2250 में क्या अंतर है और इस मामले में कौन सा मानक लागू होना चाहिए? "
            "(What is the difference between IS 1199 and IS 2250, and which should apply in this case?)"
        )
    
    points.append(
        "श्रृंखला-अभिरक्षा के दस्तावेजीकरण की कमी के मामले में "
        "प्रासंगिकता के सिद्धांत कैसे लागू होते हैं? "
        "(How do principles of relevancy apply in cases of missing chain-of-custody documentation?)"
    )
    
    return points


def create_chain_custody_task(
    sampling_details: Dict[str, Any],
    case_context: str,
    standards_db: Optional[ISStandardsDatabase] = None
) -> Task:
    """Create a chain-of-custody analysis task"""
    
    agent = create_chain_custody_specialist_agent()
    
    task_description = f"""
CASE CONTEXT:
{case_context}

SAMPLING DETAILS TO ANALYZE:
- Weather Conditions: {sampling_details.get('weather_conditions', 'Not specified')}
- Contractor Representative Present: {sampling_details.get('contractor_representative_present', False)}
- Sampling Locations: {len(sampling_details.get('sampling_locations', []))}
- Standard Used: {sampling_details.get('standard_used', 'Not specified')}
- Material Type: {sampling_details.get('material_type', 'Unknown')}
- Proper Sealing: {sampling_details.get('proper_sealing', False)}

YOUR TASK:
1. Analyze the sampling procedure against relevant IS standards
2. Identify all violations and compliances
3. Generate detailed Hindi/English assessment
4. Create legal arguments for discharge application
5. Identify relevant precedents (Kattavellai, Uttarakhand HC, Rajasthan HC)
6. Generate expert witness examination points
7. Provide cross-reference matrix linking violations to standards and precedents

OUTPUT REQUIREMENTS:
- Detailed assessment in both Hindi and English
- Legal arguments formatted for court use
- Precedent analysis with citations
- Expert witness examination questions
- Cross-reference matrix table
- Overall compliance score with recommendation
"""
    
    return Task(
        description=task_description,
        agent=agent,
        expected_output="Comprehensive chain-of-custody analysis with legal arguments, precedents, and expert witness points."
    )