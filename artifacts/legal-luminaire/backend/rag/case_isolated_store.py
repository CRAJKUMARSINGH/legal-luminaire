"""
Case Isolated Document Store
Per-case ChromaDB collections with enhanced isolation, cross-case contamination prevention, and case-specific features
"""
from __future__ import annotations

import logging
import sqlite3
from pathlib import Path
from typing import Dict, Any, List, Optional, Set
from dataclasses import dataclass
from datetime import datetime
import hashlib

from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

from config import settings
from rag.advanced_processor import AdvancedDocumentProcessor, ProcessedDocument

logger = logging.getLogger(__name__)


@dataclass
class CaseMetadata:
    """Metadata for a case's document store"""
    case_id: str
    case_name: str
    created_at: datetime
    last_updated: datetime
    document_count: int
    total_chunks: int
    languages: Dict[str, float]
    document_types: Dict[str, int]
    quality_score: float
    embedding_model: str
    is_active: bool


@dataclass
class CrossCaseContaminationCheck:
    """Result of cross-case contamination check"""
    case_id: str
    is_contaminated: bool
    contamination_sources: List[str]
    shared_documents: List[str]
    risk_level: str  # "LOW", "MEDIUM", "HIGH"
    recommendations: List[str]


class CaseIsolatedDocumentStore:
    """Per-case ChromaDB collections with enhanced isolation and contamination prevention"""
    
    def __init__(self, base_path: Optional[Path] = None):
        self.base_path = base_path or settings.chroma_path
        self.base_path.mkdir(parents=True, exist_ok=True)
        
        # Initialize metadata database
        self.metadata_db_path = self.base_path / "case_metadata.db"
        self._initialize_metadata_db()
        
        # Initialize advanced processor
        self.processor = AdvancedDocumentProcessor()
        
        # Track active cases to prevent cross-contamination
        self._active_cases: Set[str] = set()
        self._case_cache: Dict[str, Chroma] = {}
    
    def _initialize_metadata_db(self):
        """Initialize SQLite database for case metadata"""
        conn = sqlite3.connect(self.metadata_db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS case_metadata (
                case_id TEXT PRIMARY KEY,
                case_name TEXT,
                created_at TIMESTAMP,
                last_updated TIMESTAMP,
                document_count INTEGER DEFAULT 0,
                total_chunks INTEGER DEFAULT 0,
                languages TEXT,
                document_types TEXT,
                quality_score REAL DEFAULT 0.0,
                embedding_model TEXT,
                is_active BOOLEAN DEFAULT 1
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS document_registry (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id TEXT,
                document_hash TEXT,
                file_name TEXT,
                file_path TEXT,
                indexed_at TIMESTAMP,
                FOREIGN KEY (case_id) REFERENCES case_metadata(case_id)
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cross_case_alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id TEXT,
                other_case_id TEXT,
                alert_type TEXT,
                description TEXT,
                created_at TIMESTAMP,
                resolved BOOLEAN DEFAULT 0,
                FOREIGN KEY (case_id) REFERENCES case_metadata(case_id)
            )
        """)
        
        conn.commit()
        conn.close()
    
    def get_case_vectorstore(self, case_id: str, embedding_model: Optional[str] = None) -> Chroma:
        """Get or create a case-isolated vector store"""
        
        # Check for cross-contamination
        if self._active_cases and case_id not in self._active_cases:
            self._check_cross_case_contamination(case_id)
        
        # Return cached instance if available
        if case_id in self._case_cache:
            return self._case_cache[case_id]
        
        # Create new isolated collection
        case_path = self.base_path / case_id
        case_path.mkdir(parents=True, exist_ok=True)
        
        embedding_model = embedding_model or settings.embedding_model
        embeddings = OpenAIEmbeddings(
            model=embedding_model,
            openai_api_key=settings.openai_api_key,
        )
        
        vectorstore = Chroma(
            collection_name=f"case_{case_id}",
            embedding_function=embeddings,
            persist_directory=str(case_path),
        )
        
        # Cache and track
        self._case_cache[case_id] = vectorstore
        self._active_cases.add(case_id)
        
        # Update metadata
        self._update_case_metadata(case_id, {"embedding_model": embedding_model})
        
        logger.info(f"Created/accessed isolated vector store for case {case_id}")
        return vectorstore
    
    def ingest_documents(
        self,
        case_id: str,
        documents: List[Document],
        process_with_advanced: bool = True,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Ingest documents into case-isolated store with enhanced processing"""
        
        vectorstore = self.get_case_vectorstore(case_id)
        
        # Process documents with advanced processor
        if process_with_advanced:
            processed_docs = []
            for doc in documents:
                try:
                    processed = self.processor.process_document(doc, metadata)
                    processed_docs.append(processed)
                except Exception as e:
                    logger.error(f"Failed to process document: {e}")
                    # Fall back to original document
                    processed_docs.append(ProcessedDocument(
                        original_document=doc,
                        extracted_citations=[],
                        extracted_cross_references=[],
                        extracted_tables=[],
                        hindi_sections=[],
                        english_sections=[],
                        language_ratio={"hindi": 0.0, "english": 1.0},
                        document_type="other",
                        quality_score=0.5
                    ))
        else:
            # Simple processing without advanced features
            processed_docs = [
                ProcessedDocument(
                    original_document=doc,
                    extracted_citations=[],
                    extracted_cross_references=[],
                    extracted_tables=[],
                    hindi_sections=[],
                    english_sections=[],
                    language_ratio={"hindi": 0.0, "english": 1.0},
                    document_type="other",
                    quality_score=0.5
                )
                for doc in documents
            ]
        
        # Chunk processed documents
        all_chunks = []
        for processed_doc in processed_docs:
            chunks = self.processor.chunk_processed_document(processed_doc)
            all_chunks.extend(chunks)
        
        # Add chunks to vector store
        vectorstore.add_documents(all_chunks)
        
        # Register documents
        self._register_documents(case_id, documents, metadata)
        
        # Update case metadata
        self._update_case_statistics(case_id, processed_docs, all_chunks)
        
        logger.info(f"Ingested {len(documents)} documents ({len(all_chunks)} chunks) for case {case_id}")
        
        return {
            "case_id": case_id,
            "documents_processed": len(documents),
            "chunks_created": len(all_chunks),
            "citations_extracted": sum(len(p.extracted_citations) for p in processed_docs),
            "cross_refs_extracted": sum(len(p.extracted_cross_references) for p in processed_docs),
            "tables_extracted": sum(len(p.extracted_tables) for p in processed_docs),
            "average_quality": sum(p.quality_score for p in processed_docs) / len(processed_docs) if processed_docs else 0.0
        }
    
    def _register_documents(self, case_id: str, documents: List[Document], metadata: Optional[Dict[str, Any]]):
        """Register documents in the document registry"""
        conn = sqlite3.connect(self.metadata_db_path)
        cursor = conn.cursor()
        
        for doc in documents:
            doc_hash = hashlib.md5(doc.page_content.encode()).hexdigest()[:12]
            file_name = doc.metadata.get("source_file", "unknown")
            file_path = doc.metadata.get("file_path", "")
            
            cursor.execute("""
                INSERT OR REPLACE INTO document_registry 
                (case_id, document_hash, file_name, file_path, indexed_at)
                VALUES (?, ?, ?, ?, ?)
            """, (case_id, doc_hash, file_name, file_path, datetime.now()))
        
        conn.commit()
        conn.close()
    
    def _update_case_statistics(self, case_id: str, processed_docs: List[ProcessedDocument], chunks: List[Document]):
        """Update case statistics after ingestion"""
        if not processed_docs:
            return
        
        # Aggregate statistics
        total_languages = {"hindi": 0.0, "english": 0.0}
        doc_type_counts = {}
        total_quality = 0.0
        
        for processed in processed_docs:
            total_languages["hindi"] += processed.language_ratio["hindi"]
            total_languages["english"] += processed.language_ratio["english"]
            total_quality += processed.quality_score
            
            doc_type = processed.document_type
            doc_type_counts[doc_type] = doc_type_counts.get(doc_type, 0) + 1
        
        # Normalize language ratios
        num_docs = len(processed_docs)
        avg_languages = {
            "hindi": total_languages["hindi"] / num_docs,
            "english": total_languages["english"] / num_docs
        }
        
        # Update metadata
        import json
        self._update_case_metadata(case_id, {
            "document_count": self._get_document_count(case_id) + len(processed_docs),
            "total_chunks": self._get_chunk_count(case_id) + len(chunks),
            "languages": json.dumps(avg_languages),
            "document_types": json.dumps(doc_type_counts),
            "quality_score": total_quality / num_docs,
            "last_updated": datetime.now()
        })
    
    def _update_case_metadata(self, case_id: str, updates: Dict[str, Any]):
        """Update case metadata in database"""
        conn = sqlite3.connect(self.metadata_db_path)
        cursor = conn.cursor()
        
        # Build update query dynamically
        set_clauses = []
        values = []
        
        for key, value in updates.items():
            if key in ["languages", "document_types"]:
                import json
                value = json.dumps(value) if not isinstance(value, str) else value
            set_clauses.append(f"{key} = ?")
            values.append(value)
        
        if set_clauses:
            values.append(case_id)
            query = f"UPDATE case_metadata SET {', '.join(set_clauses)} WHERE case_id = ?"
            cursor.execute(query, values)
            
            # If no row exists, insert one
            if cursor.rowcount == 0:
                insert_query = """
                    INSERT INTO case_metadata (case_id, case_name, created_at, last_updated)
                    VALUES (?, ?, ?, ?)
                """
                cursor.execute(insert_query, (case_id, f"Case {case_id}", datetime.now(), datetime.now()))
        
        conn.commit()
        conn.close()
    
    def _get_document_count(self, case_id: str) -> int:
        """Get document count for a case"""
        conn = sqlite3.connect(self.metadata_db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM document_registry WHERE case_id = ?", (case_id,))
        count = cursor.fetchone()[0]
        conn.close()
        return count
    
    def _get_chunk_count(self, case_id: str) -> int:
        """Get chunk count for a case"""
        try:
            vectorstore = self.get_case_vectorstore(case_id)
            return vectorstore._collection.count()
        except Exception:
            return 0
    
    def get_case_metadata(self, case_id: str) -> Optional[CaseMetadata]:
        """Get metadata for a case"""
        conn = sqlite3.connect(self.metadata_db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM case_metadata WHERE case_id = ?", (case_id,))
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return None
        
        columns = [desc[0] for desc in cursor.description]
        metadata_dict = dict(zip(columns, row))
        
        import json
        languages = json.loads(metadata_dict["languages"]) if metadata_dict["languages"] else {"hindi": 0.0, "english": 1.0}
        document_types = json.loads(metadata_dict["document_types"]) if metadata_dict["document_types"] else {}
        
        conn.close()
        
        return CaseMetadata(
            case_id=metadata_dict["case_id"],
            case_name=metadata_dict["case_name"],
            created_at=datetime.fromisoformat(metadata_dict["created_at"]) if isinstance(metadata_dict["created_at"], str) else metadata_dict["created_at"],
            last_updated=datetime.fromisoformat(metadata_dict["last_updated"]) if isinstance(metadata_dict["last_updated"], str) else metadata_dict["last_updated"],
            document_count=metadata_dict["document_count"],
            total_chunks=metadata_dict["total_chunks"],
            languages=languages,
            document_types=document_types,
            quality_score=metadata_dict["quality_score"],
            embedding_model=metadata_dict["embedding_model"],
            is_active=metadata_dict["is_active"]
        )
    
    def _check_cross_case_contamination(self, case_id: str) -> CrossCaseContaminationCheck:
        """Check for potential cross-case contamination"""
        contamination_sources = []
        shared_documents = []
        
        # Check for shared documents in registry
        conn = sqlite3.connect(self.metadata_db_path)
        cursor = conn.cursor()
        
        # Get documents for other cases
        cursor.execute("""
            SELECT document_hash, file_name, case_id 
            FROM document_registry 
            WHERE case_id != ?
        """, (case_id,))
        
        other_case_docs = cursor.fetchall()
        
        # Get documents for current case
        cursor.execute("""
            SELECT document_hash, file_name 
            FROM document_registry 
            WHERE case_id = ?
        """, (case_id,))
        
        current_case_docs = cursor.fetchall()
        current_hashes = {doc[0] for doc in current_case_docs}
        
        # Check for shared hashes
        for other_hash, other_file, other_case in other_case_docs:
            if other_hash in current_hashes:
                contamination_sources.append(other_case)
                shared_documents.append(f"{other_file} (hash: {other_hash})")
        
        conn.close()
        
        # Determine risk level
        risk_level = "LOW"
        if len(contamination_sources) > 0:
            risk_level = "MEDIUM"
        if len(contamination_sources) > 2:
            risk_level = "HIGH"
        
        # Generate recommendations
        recommendations = []
        if contamination_sources:
            recommendations.append("Review shared documents between cases")
            recommendations.append("Consider deduplicating documents or creating case-specific copies")
            recommendations.append("Ensure document isolation for confidentiality")
        
        # Log alert if contamination detected
        if contamination_sources:
            self._log_contamination_alert(case_id, contamination_sources, shared_documents)
        
        return CrossCaseContaminationCheck(
            case_id=case_id,
            is_contaminated=len(contamination_sources) > 0,
            contamination_sources=contamination_sources,
            shared_documents=shared_documents,
            risk_level=risk_level,
            recommendations=recommendations
        )
    
    def _log_contamination_alert(self, case_id: str, sources: List[str], shared_docs: List[str]):
        """Log a cross-case contamination alert"""
        conn = sqlite3.connect(self.metadata_db_path)
        cursor = conn.cursor()
        
        for source in sources:
            cursor.execute("""
                INSERT INTO cross_case_alerts 
                (case_id, other_case_id, alert_type, description, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (
                case_id,
                source,
                "DOCUMENT_SHARING",
                f"Shared documents detected with case {source}: {', '.join(shared_docs)}",
                datetime.now()
            ))
        
        conn.commit()
        conn.close()
        
        logger.warning(f"Cross-case contamination detected for case {case_id}: sources={sources}")
    
    def get_retriever(self, case_id: str, k: int = 8, search_type: str = "similarity"):
        """Get a retriever for a specific case"""
        vectorstore = self.get_case_vectorstore(case_id)
        return vectorstore.as_retriever(search_kwargs={"k": k, "search_type": search_type})
    
    def delete_case(self, case_id: str) -> bool:
        """Delete a case and all its data"""
        try:
            # Remove from cache
            if case_id in self._case_cache:
                del self._case_cache[case_id]
            
            # Remove from active cases
            if case_id in self._active_cases:
                self._active_cases.remove(case_id)
            
            # Delete vector store directory
            case_path = self.base_path / case_id
            if case_path.exists():
                import shutil
                shutil.rmtree(case_path)
            
            # Delete from metadata database
            conn = sqlite3.connect(self.metadata_db_path)
            cursor = conn.cursor()
            
            cursor.execute("DELETE FROM case_metadata WHERE case_id = ?", (case_id,))
            cursor.execute("DELETE FROM document_registry WHERE case_id = ?", (case_id,))
            cursor.execute("DELETE FROM cross_case_alerts WHERE case_id = ?", (case_id,))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Deleted case {case_id} and all associated data")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete case {case_id}: {e}")
            return False
    
    def list_all_cases(self) -> List[CaseMetadata]:
        """List all cases with their metadata"""
        conn = sqlite3.connect(self.metadata_db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT case_id FROM case_metadata")
        case_ids = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        
        cases = []
        for case_id in case_ids:
            metadata = self.get_case_metadata(case_id)
            if metadata:
                cases.append(metadata)
        
        return cases
    
    def search_across_cases(
        self,
        query: str,
        case_ids: Optional[List[str]] = None,
        k: int = 5
    ) -> Dict[str, List[Document]]:
        """Search across multiple cases (with isolation safeguards)"""
        
        if case_ids is None:
            case_ids = [case.case_id for case in self.list_all_cases()]
        
        results = {}
        
        for case_id in case_ids:
            try:
                retriever = self.get_retriever(case_id, k=k)
                docs = retriever.get_relevant_documents(query)
                results[case_id] = docs
            except Exception as e:
                logger.error(f"Failed to search case {case_id}: {e}")
                results[case_id] = []
        
        return results