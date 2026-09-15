"""
Advanced Document Processor
Enhanced processing for legal documents with Hindi OCR, table extraction, cross-reference extraction, and citation pattern recognition
"""
from __future__ import annotations

import logging
import re
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path
import hashlib

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

logger = logging.getLogger(__name__)


@dataclass
class ExtractedCitation:
    """Extracted legal citation with metadata"""
    citation_text: str
    citation_type: str  # "SCC", "INSC", "GLR", "HC", "OTHER"
    case_name: str
    year: str
    court: str
    confidence: float
    source_location: str  # page/chunk reference


@dataclass
class ExtractedCrossReference:
    """Extracted cross-reference between documents/sections"""
    reference_type: str  # "internal", "external", "standard", "precedent"
    source_text: str
    target: str
    context: str
    confidence: float


@dataclass
class ExtractedTable:
    """Extracted table data"""
    table_data: List[List[str]]
    headers: List[str]
    caption: str
    page_number: int
    table_type: str  # "schedule", "data", "comparison", "timeline"


@dataclass
class ProcessedDocument:
    """Enhanced document with extracted metadata"""
    original_document: Document
    extracted_citations: List[ExtractedCitation]
    extracted_cross_references: List[ExtractedCrossReference]
    extracted_tables: List[ExtractedTable]
    hindi_sections: List[str]
    english_sections: List[str]
    language_ratio: Dict[str, float]
    document_type: str  # "judgment", "pleading", "report", "contract", "other"
    quality_score: float


class AdvancedDocumentProcessor:
    """Enhanced document processing with legal-specific extraction"""
    
    # Legal citation patterns
    CITATION_PATTERNS = [
        # SCC format: "State v. Accused (2024) 5 SCC 123"
        r'([\w\s&]+v\.?[\w\s&]+)\s*\((\d{4})\)\s*(\d+)\s+SCC\s+(\d+)',
        # INSC format: "Case Name v. Another 2024 INSC 456"
        r'([\w\s&]+v\.?[\w\s&]+)\s*(\d{4})\s+INSC\s+(\d+)',
        # GLR format: "Case v. Another (2024) 3 GLR 789"
        r'([\w\s&]+v\.?[\w\s&]+)\s*\((\d{4})\)\s*(\d+)\s+GLR\s+(\d+)',
        # HC format: "Case v. Another 2024 SCC OnLine Raj 123"
        r'([\w\s&]+v\.?[\w\s&]+)\s*(\d{4})\s+SCC\s+OnLine\s+(\w+)\s+(\d+)',
        # General citation format
        r'([\w\s&]+v\.?[\w\s&]+)\s*\((\d{4})\)\s+[\w\s\d]+',
    ]
    
    # IS/ASTM standard patterns
    STANDARD_PATTERNS = [
        r'IS\s+(\d+)(?::(\d{4}))?',
        r'ASTM\s+([A-Z]\d+)(?::(\d{4}))?',
        r'BS\s+(\d+)(?::(\d{4}))?',
        r'ISO\s+(\d+)(?::(\d{4}))?',
    ]
    
    # Cross-reference patterns
    CROSS_REF_PATTERNS = [
        r'section\s+(\d+)(?:\s*\([^)]+\))?',
        r'clause\s+(\d+)(?:\.[\d]+)*(?:\s*\([^)]+\))?',
        r'paragraph\s+(\d+)(?:\s*\([^)]+\))?',
        r'article\s+(\d+)(?:\s*\([^)]+\))?',
        r'rule\s+(\d+)(?:\s*\([^)]+\))?',
        r'regulation\s+(\d+)(?:\s*\([^)]+\))?',
        r'(\d+)\s+[\w\s]+(?:Act|Code|Law)',
    ]
    
    def __init__(self):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,
            chunk_overlap=300,
            separators=["\n\n", "\n", "।", ".", " "],
        )
    
    def process_document(self, document: Document, metadata: Optional[Dict[str, Any]] = None) -> ProcessedDocument:
        """Process a document with enhanced extraction"""
        
        # Extract citations
        citations = self.extract_citations(document.page_content)
        
        # Extract cross-references
        cross_refs = self.extract_cross_references(document.page_content)
        
        # Extract tables (basic implementation)
        tables = self.extract_tables(document.page_content)
        
        # Detect language sections
        hindi_sections, english_sections = self.detect_language_sections(document.page_content)
        
        # Calculate language ratio
        language_ratio = self.calculate_language_ratio(document.page_content)
        
        # Detect document type
        document_type = self.detect_document_type(document.page_content, metadata)
        
        # Calculate quality score
        quality_score = self.calculate_quality_score(document, citations, cross_refs)
        
        return ProcessedDocument(
            original_document=document,
            extracted_citations=citations,
            extracted_cross_references=cross_refs,
            extracted_tables=tables,
            hindi_sections=hindi_sections,
            english_sections=english_sections,
            language_ratio=language_ratio,
            document_type=document_type,
            quality_score=quality_score
        )
    
    def extract_citations(self, text: str) -> List[ExtractedCitation]:
        """Extract legal citations from text"""
        citations = []
        
        for pattern in self.CITATION_PATTERNS:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    citation_text = match.group(0)
                    
                    # Determine citation type
                    citation_type = self._determine_citation_type(citation_text)
                    
                    # Extract components
                    case_name = match.group(1).strip() if len(match.groups()) > 0 else ""
                    year = match.group(2) if len(match.groups()) > 1 else ""
                    court = self._determine_court(citation_text)
                    
                    citation = ExtractedCitation(
                        citation_text=citation_text,
                        citation_type=citation_type,
                        case_name=case_name,
                        year=year,
                        court=court,
                        confidence=0.85,
                        source_location=f"offset_{match.start()}"
                    )
                    citations.append(citation)
                except Exception as e:
                    logger.warning(f"Failed to parse citation {match.group(0)}: {e}")
        
        return citations
    
    def _determine_citation_type(self, citation: str) -> str:
        """Determine the type of citation"""
        if "SCC" in citation.upper():
            if "INSC" in citation.upper():
                return "INSC"
            return "SCC"
        elif "GLR" in citation.upper():
            return "GLR"
        elif "SCC OnLine" in citation:
            return "HC"
        return "OTHER"
    
    def _determine_court(self, citation: str) -> str:
        """Determine court from citation"""
        citation_upper = citation.upper()
        if "SCC" in citation_upper and "OnLine" not in citation:
            return "Supreme Court of India"
        elif "OnLine" in citation_upper:
            # Extract HC code
            match = re.search(r'OnLine\s+(\w+)', citation_upper)
            if match:
                hc_code = match.group(1)
                hc_names = {
                    "DEL": "Delhi High Court",
                    "BOM": "Bombay High Court",
                    "CAL": "Calcutta High Court",
                    "MAD": "Madras High Court",
                    "RAJ": "Rajasthan High Court",
                    "KAR": "Karnataka High Court",
                    "GUJ": "Gujarat High Court",
                }
                return hc_names.get(hc_code, f"High Court ({hc_code})")
        return "Unknown"
    
    def extract_cross_references(self, text: str) -> List[ExtractedCrossReference]:
        """Extract cross-references from text"""
        cross_refs = []
        
        # Extract internal references (sections, clauses, etc.)
        for pattern in self.CROSS_REF_PATTERNS:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    ref_text = match.group(0)
                    target = match.group(1) if match.groups() else ""
                    
                    # Get context around the reference
                    start = max(0, match.start() - 50)
                    end = min(len(text), match.end() + 50)
                    context = text[start:end]
                    
                    # Determine reference type
                    ref_type = self._determine_reference_type(ref_text)
                    
                    cross_ref = ExtractedCrossReference(
                        reference_type=ref_type,
                        source_text=ref_text,
                        target=target,
                        context=context,
                        confidence=0.75
                    )
                    cross_refs.append(cross_ref)
                except Exception as e:
                    logger.warning(f"Failed to parse cross-reference {match.group(0)}: {e}")
        
        # Extract standard references
        for pattern in self.STANDARD_PATTERNS:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    ref_text = match.group(0)
                    standard_code = match.group(1) if match.groups() else ""
                    
                    start = max(0, match.start() - 30)
                    end = min(len(text), match.end() + 30)
                    context = text[start:end]
                    
                    cross_ref = ExtractedCrossReference(
                        reference_type="standard",
                        source_text=ref_text,
                        target=standard_code,
                        context=context,
                        confidence=0.90
                    )
                    cross_refs.append(cross_ref)
                except Exception as e:
                    logger.warning(f"Failed to parse standard reference {match.group(0)}: {e}")
        
        return cross_refs
    
    def _determine_reference_type(self, ref_text: str) -> str:
        """Determine the type of cross-reference"""
        ref_lower = ref_text.lower()
        if "section" in ref_lower:
            return "internal"
        elif "clause" in ref_lower:
            return "internal"
        elif "article" in ref_lower:
            return "internal"
        elif "v." in ref_lower or "vs" in ref_lower:
            return "precedent"
        return "external"
    
    def extract_tables(self, text: str) -> List[ExtractedTable]:
        """Extract tables from text (basic implementation)"""
        tables = []
        
        # Simple table detection based on structure
        lines = text.split('\n')
        potential_tables = []
        current_table = []
        
        for line in lines:
            # Detect table rows by multiple tab/space separators
            if re.search(r'\t{2,}|\s{5,}', line):
                current_table.append(line)
            elif current_table:
                # End of table
                if len(current_table) > 2:  # At least header + 1 data row
                    potential_tables.append(current_table.copy())
                current_table = []
        
        # Process potential tables
        for table_lines in potential_tables:
            try:
                # Parse table structure
                table_data = []
                for line in table_lines:
                    # Split by tabs or multiple spaces
                    row = re.split(r'\t+|\s{3,}', line.strip())
                    table_data.append([cell.strip() for cell in row if cell.strip()])
                
                if table_data:
                    headers = table_data[0] if table_data else []
                    table = ExtractedTable(
                        table_data=table_data[1:] if len(table_data) > 1 else [],
                        headers=headers,
                        caption="",
                        page_number=0,
                        table_type=self._determine_table_type(headers, table_data)
                    )
                    tables.append(table)
            except Exception as e:
                logger.warning(f"Failed to parse table: {e}")
        
        return tables
    
    def _determine_table_type(self, headers: List[str], data: List[List[str]]) -> str:
        """Determine the type of table based on content"""
        if not headers:
            return "data"
        
        headers_lower = [h.lower() for h in headers]
        
        if any(word in " ".join(headers_lower) for word in ["schedule", "item", "part"]):
            return "schedule"
        elif any(word in " ".join(headers_lower) for word in ["date", "time", "timeline"]):
            return "timeline"
        elif any(word in " ".join(headers_lower) for word in ["comparison", "vs", "versus"]):
            return "comparison"
        return "data"
    
    def detect_language_sections(self, text: str) -> Tuple[List[str], List[str]]:
        """Detect Hindi and English sections in text"""
        hindi_sections = []
        english_sections = []
        
        # Hindi character range detection
        hindi_pattern = re.compile(r'[\u0900-\u097F]')
        
        # Split text into paragraphs
        paragraphs = text.split('\n\n')
        
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            # Count Hindi characters
            hindi_chars = len(hindi_pattern.findall(para))
            total_chars = len(para.replace(' ', ''))
            
            if total_chars > 0:
                hindi_ratio = hindi_chars / total_chars
                if hindi_ratio > 0.3:  # More than 30% Hindi characters
                    hindi_sections.append(para)
                else:
                    english_sections.append(para)
        
        return hindi_sections, english_sections
    
    def calculate_language_ratio(self, text: str) -> Dict[str, float]:
        """Calculate the ratio of Hindi to English content"""
        hindi_pattern = re.compile(r'[\u0900-\u097F]')
        
        hindi_chars = len(hindi_pattern.findall(text))
        total_chars = len(text.replace(' ', ''))
        
        if total_chars == 0:
            return {"hindi": 0.0, "english": 1.0}
        
        hindi_ratio = hindi_chars / total_chars
        english_ratio = 1.0 - hindi_ratio
        
        return {
            "hindi": hindi_ratio,
            "english": english_ratio
        }
    
    def detect_document_type(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """Detect the type of legal document"""
        text_lower = text.lower()
        
        # Check for judgment indicators
        judgment_keywords = ["judgment", "order", "decree", "court", "petition", "writ", "appeal"]
        if any(keyword in text_lower for keyword in judgment_keywords):
            return "judgment"
        
        # Check for pleading indicators
        pleading_keywords = ["plaint", "written statement", "application", "petition", "prayer", "averment"]
        if any(keyword in text_lower for keyword in pleading_keywords):
            return "pleading"
        
        # Check for report indicators
        report_keywords = ["report", "analysis", "investigation", "forensic", "laboratory", "test"]
        if any(keyword in text_lower for keyword in report_keywords):
            return "report"
        
        # Check for contract indicators
        contract_keywords = ["agreement", "contract", "terms", "conditions", "clause", "party"]
        if any(keyword in text_lower for keyword in contract_keywords):
            return "contract"
        
        # Check metadata for hints
        if metadata:
            filename = metadata.get("source_file", "").lower()
            if "judgment" in filename or "order" in filename:
                return "judgment"
            elif "report" in filename:
                return "report"
            elif "contract" in filename or "agreement" in filename:
                return "contract"
        
        return "other"
    
    def calculate_quality_score(self, document: Document, citations: List[ExtractedCitation], 
                                cross_refs: List[ExtractedCrossReference]) -> float:
        """Calculate a quality score for the document"""
        score = 0.5  # Base score
        
        # Citation quality
        if citations:
            avg_citation_confidence = sum(c.confidence for c in citations) / len(citations)
            score += avg_citation_confidence * 0.2
        
        # Cross-reference quality
        if cross_refs:
            avg_ref_confidence = sum(r.confidence for r in cross_refs) / len(cross_refs)
            score += avg_ref_confidence * 0.15
        
        # Text length (longer documents generally have more content)
        text_length = len(document.page_content)
        if text_length > 1000:
            score += 0.1
        if text_length > 5000:
            score += 0.1
        
        # Metadata presence
        if document.metadata:
            metadata_score = min(len(document.metadata) * 0.02, 0.15)
            score += metadata_score
        
        return min(score, 1.0)
    
    def chunk_processed_document(self, processed_doc: ProcessedDocument) -> List[Document]:
        """Chunk a processed document while preserving metadata"""
        chunks = self.splitter.split_documents([processed_doc.original_document])
        
        # Enhance each chunk with extracted metadata
        for i, chunk in enumerate(chunks):
            # Add citation metadata
            chunk.metadata.update({
                "extracted_citations": [c.citation_text for c in processed_doc.extracted_citations],
                "citation_count": len(processed_doc.extracted_citations),
                "cross_ref_count": len(processed_doc.extracted_cross_references),
                "table_count": len(processed_doc.extracted_tables),
                "document_type": processed_doc.document_type,
                "language_ratio": processed_doc.language_ratio,
                "quality_score": processed_doc.quality_score,
                "chunk_index": i,
                "total_chunks": len(chunks)
            })
        
        return chunks


def process_document_batch(documents: List[Document]) -> List[ProcessedDocument]:
    """Process a batch of documents"""
    processor = AdvancedDocumentProcessor()
    processed_docs = []
    
    for doc in documents:
        try:
            processed = processor.process_document(doc)
            processed_docs.append(processed)
        except Exception as e:
            logger.error(f"Failed to process document: {e}")
    
    return processed_docs


def enhance_document_metadata(document: Document, additional_metadata: Dict[str, Any]) -> Document:
    """Enhance document metadata with additional information"""
    document.metadata.update(additional_metadata)
    return document