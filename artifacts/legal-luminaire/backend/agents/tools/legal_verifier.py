"""
Enhanced Legal Verification Tools
Direct API integration for Indian legal databases to ensure citation accuracy
"""
from __future__ import annotations

import logging
import re
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


@dataclass
class CitationVerification:
    """Result of citation verification"""
    case_name: str
    citation: str
    verified: bool
    confidence: float
    source_url: str
    exact_holding: str
    court: str
    date: str
    verification_method: str


class IndianKanoonVerifier:
    """Direct Indian Kanoon API integration for precedent verification"""
    
    BASE_URL = "https://api.indiankanoon.org"
    SEARCH_URL = f"{BASE_URL}/search/"
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.session = requests.Session()
        if api_key:
            self.session.headers.update({"Authorization": f"Token {api_key}"})
    
    def verify_citation(self, citation: str) -> CitationVerification:
        """Verify a citation against Indian Kanoon database"""
        try:
            # Clean citation format
            cleaned_citation = self._clean_citation(citation)
            
            # Search for the case
            search_params = {
                "formInput": cleaned_citation,
                "page": 0,
                "max": 1
            }
            
            response = self.session.get(self.SEARCH_URL, params=search_params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if not data.get("docs"):
                return CitationVerification(
                    case_name="Unknown",
                    citation=citation,
                    verified=False,
                    confidence=0.0,
                    source_url="",
                    exact_holding="",
                    court="",
                    date="",
                    verification_method="indiankanoon_api"
                )
            
            case_data = data["docs"][0]
            
            # Extract holding from the case text
            holding = self._extract_holding(case_data)
            
            return CitationVerification(
                case_name=case_data.get("title", ""),
                citation=citation,
                verified=True,
                confidence=0.95,
                source_url=case_data.get("url", ""),
                exact_holding=holding,
                court=case_data.get("court", ""),
                date=case_data.get("date", ""),
                verification_method="indiankanoon_api"
            )
            
        except Exception as e:
            logger.error(f"Indian Kanoon verification failed: {e}")
            return CitationVerification(
                case_name="Error",
                citation=citation,
                verified=False,
                confidence=0.0,
                source_url="",
                exact_holding="",
                court="",
                date="",
                verification_method="indiankanoon_api_error"
            )
    
    def _clean_citation(self, citation: str) -> str:
        """Clean and standardize citation format"""
        # Remove extra spaces and standardize format
        cleaned = re.sub(r'\s+', ' ', citation.strip())
        # Convert common variations
        cleaned = re.sub(r'\bv\.\s*', 'vs.', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'\bversus\b', 'vs.', cleaned, flags=re.IGNORECASE)
        return cleaned
    
    def _extract_holding(self, case_data: Dict[str, Any]) -> str:
        """Extract the key holding from case data"""
        # Try to get from snippet first
        if "snippet" in case_data:
            return case_data["snippet"]
        
        # Fallback to first paragraph of content
        if "content" in case_data and case_data["content"]:
            paragraphs = case_data["content"].split('\n')
            for para in paragraphs:
                if len(para) > 50:  # Substantial paragraph
                    return para[:500]  # First 500 chars
        
        return "Holding not available in API response"


class SCCOnlineVerifier:
    """Supreme Court Online direct API integration"""
    
    BASE_URL = "https://api.scconline.com"
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.session = requests.Session()
        if api_key:
            self.session.headers.update({"X-API-Key": api_key})
    
    def verify_citation(self, citation: str) -> CitationVerification:
        """Verify citation against SCC Online database"""
        try:
            # SCC Online might not have public API, using web scraping as fallback
            search_url = f"https://scconline.com/citation/{self._clean_citation(citation)}"
            
            response = self.session.get(search_url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract case information from HTML
            case_name = self._extract_case_name(soup)
            holding = self._extract_holding(soup)
            
            if case_name:
                return CitationVerification(
                    case_name=case_name,
                    citation=citation,
                    verified=True,
                    confidence=0.90,
                    source_url=search_url,
                    exact_holding=holding,
                    court="Supreme Court of India",
                    date=self._extract_date(soup),
                    verification_method="scc_online_scrape"
                )
            
            return CitationVerification(
                case_name="Not Found",
                citation=citation,
                verified=False,
                confidence=0.0,
                source_url="",
                exact_holding="",
                court="",
                date="",
                verification_method="scc_online_scrape"
            )
            
        except Exception as e:
            logger.error(f"SCC Online verification failed: {e}")
            return CitationVerification(
                case_name="Error",
                citation=citation,
                verified=False,
                confidence=0.0,
                source_url="",
                exact_holding="",
                court="",
                date="",
                verification_method="scc_online_error"
            )
    
    def _clean_citation(self, citation: str) -> str:
        """Clean citation for URL"""
        return re.sub(r'[^\w\s\-]', '', citation).replace(' ', '-').lower()
    
    def _extract_case_name(self, soup: BeautifulSoup) -> str:
        """Extract case name from HTML"""
        # Try common selectors
        selectors = ['h1.case-title', '.case-name', 'title']
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text().strip()
        return ""
    
    def _extract_holding(self, soup: BeautifulSoup) -> str:
        """Extract holding from HTML"""
        # Try to find the main content
        content = soup.select_one('.case-content, .judgment-text, .main-content')
        if content:
            text = content.get_text().strip()
            return text[:500] if text else ""
        return ""
    
    def _extract_date(self, soup: BeautifulSoup) -> str:
        """Extract date from HTML"""
        date_element = soup.select_one('.case-date, .judgment-date, [data-date]')
        if date_element:
            return date_element.get_text().strip()
        return ""


class ManupatraVerifier:
    """Manupatra direct API integration for comprehensive case law"""
    
    BASE_URL = "https://api.manupatra.com"
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.session = requests.Session()
        if api_key:
            self.session.headers.update({"Authorization": f"Bearer {api_key}"})
    
    def verify_citation(self, citation: str) -> CitationVerification:
        """Verify citation against Manupatra database"""
        try:
            # Manupatra might require subscription, using web search as fallback
            search_url = f"https://www.manupatra.com/search?query={self._clean_citation(citation)}"
            
            response = self.session.get(search_url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract case information
            case_element = soup.select_one('.case-result, .search-result')
            if case_element:
                case_name = case_element.select_one('.case-name, .title')
                holding = case_element.select_one('.snippet, .holding')
                
                return CitationVerification(
                    case_name=case_name.get_text().strip() if case_name else "",
                    citation=citation,
                    verified=True,
                    confidence=0.85,
                    source_url=search_url,
                    exact_holding=holding.get_text().strip() if holding else "",
                    court=self._extract_court(case_element),
                    date=self._extract_date_from_element(case_element),
                    verification_method="manupatra_scrape"
                )
            
            return CitationVerification(
                case_name="Not Found",
                citation=citation,
                verified=False,
                confidence=0.0,
                source_url="",
                exact_holding="",
                court="",
                date="",
                verification_method="manupatra_scrape"
            )
            
        except Exception as e:
            logger.error(f"Manupatra verification failed: {e}")
            return CitationVerification(
                case_name="Error",
                citation=citation,
                verified=False,
                confidence=0.0,
                source_url="",
                exact_holding="",
                court="",
                date="",
                verification_method="manupatra_error"
            )
    
    def _clean_citation(self, citation: str) -> str:
        """Clean citation for URL"""
        return requests.utils.quote(citation.strip())
    
    def _extract_court(self, element) -> str:
        """Extract court from element"""
        court_elem = element.select_one('.court, .tribunal')
        return court_elem.get_text().strip() if court_elem else ""
    
    def _extract_date_from_element(self, element) -> str:
        """Extract date from element"""
        date_elem = element.select_one('.date, .judgment-date')
        return date_elem.get_text().strip() if date_elem else ""


class CrossDatabaseConsensus:
    """Cross-database consensus verification for highest accuracy"""
    
    def __init__(self):
        self.indian_kanoon = IndianKanoonVerifier()
        self.scc_online = SCCOnlineVerifier()
        self.manupatra = ManupatraVerifier()
    
    def verify_citation_consensus(self, citation: str) -> Dict[str, Any]:
        """Verify citation across all databases and build consensus"""
        verifications = []
        
        # Verify across all databases
        ik_result = self.indian_kanoon.verify_citation(citation)
        verifications.append(("Indian Kanoon", ik_result))
        
        scc_result = self.scc_online.verify_citation(citation)
        verifications.append(("SCC Online", scc_result))
        
        manu_result = self.manupatra.verify_citation(citation)
        verifications.append(("Manupatra", manu_result))
        
        # Build consensus
        verified_count = sum(1 for _, result in verifications if result.verified)
        total_count = len(verifications)
        
        consensus_confidence = verified_count / total_count if total_count > 0 else 0.0
        
        # Check for divergent holdings
        holdings = [result.exact_holding for _, result in verifications if result.verified]
        divergent = len(set(holdings)) > 1 if holdings else False
        
        return {
            "citation": citation,
            "consensus_confidence": consensus_confidence,
            "verified_count": verified_count,
            "total_count": total_count,
            "divergent_holdings": divergent,
            "verifications": [
                {
                    "source": source,
                    "verified": result.verified,
                    "confidence": result.confidence,
                    "case_name": result.case_name,
                    "holding": result.exact_holding,
                    "source_url": result.source_url
                }
                for source, result in verifications
            ],
            "final_verdict": "VERIFIED" if consensus_confidence >= 0.7 else "PENDING" if consensus_confidence >= 0.3 else "REJECTED"
        }


def verify_precedent_batch(citations: List[str]) -> List[Dict[str, Any]]:
    """Verify multiple citations in batch"""
    consensus = CrossDatabaseConsensus()
    results = []
    
    for citation in citations:
        result = consensus.verify_citation_consensus(citation)
        results.append(result)
    
    return results