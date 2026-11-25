"""
Hybrid Search Implementation for Legal Documents
Combines dense (embeddings) and sparse (BM25/TF-IDF) retrieval
Optimized for legal keyword matching and semantic understanding
"""
from __future__ import annotations

import asyncio
import hashlib
import logging
import math
import re
from collections import Counter, defaultdict
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass

from langchain_core.documents import Document
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from api.redaction_utils import redact_indian_pii
from config import settings
from cache import cache, cached_async
from .document_store import get_or_create_vectorstore

logger = logging.getLogger(__name__)

@dataclass
class SearchResult:
    """Enhanced search result with scoring metadata."""
    document: Document
    semantic_score: float
    keyword_score: float
    combined_score: float
    rank: int
    matched_keywords: List[str]

class LegalKeywordExpander:
    """Expands legal queries with synonyms and related terms."""
    
    LEGAL_SYNONYMS = {
        'bail': ['anticipatory bail', 'regular bail', 'interim bail', 'bail bond'],
        'discharge': ['discharge petition', 'discharge application', 'section 482'],
        'writ': ['writ petition', 'habeas corpus', 'mandamus', 'certiorari', 'prohibition', 'quo warranto'],
        'fir': ['first information report', 'police complaint', 'cognizance'],
        'charge sheet': ['chargesheet', 'final report', 'police report'],
        'evidence': ['testimony', 'documentary evidence', 'material evidence', 'oral evidence'],
        'jurisdiction': ['territorial jurisdiction', 'pecuniary jurisdiction', 'subject matter jurisdiction'],
        'precedent': ['case law', 'judgment', 'ruling', 'decision', 'authority'],
        'statute': ['act', 'law', 'legislation', 'section', 'provision'],
        'court': ['high court', 'sessions court', 'magistrate', 'tribunal'],
    }
    
    @classmethod
    def expand_query(cls, query: str) -> str:
        """Expand query with legal synonyms."""
        expanded_terms = []
        query_lower = query.lower()
        
        for term, synonyms in cls.LEGAL_SYNONYMS.items():
            if term in query_lower:
                expanded_terms.extend(synonyms)
        
        # Add original query
        expanded_terms.append(query)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_terms = []
        for term in expanded_terms:
            if term not in seen:
                seen.add(term)
                unique_terms.append(term)
        
        return ' '.join(unique_terms)

class BM25Scorer:
    """BM25 scoring for keyword-based retrieval."""
    
    def __init__(self, k1: float = 1.2, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.doc_freqs = defaultdict(int)
        self.doc_lengths = []
        self.avg_doc_length = 0
        self.total_docs = 0
        
    def fit(self, documents: List[Document]) -> None:
        """Fit BM25 parameters on documents."""
        self.total_docs = len(documents)
        all_terms = []
        
        for doc in documents:
            terms = self._tokenize(doc.page_content)
            self.doc_lengths.append(len(terms))
            all_terms.extend(terms)
            
            # Count document frequencies
            unique_terms = set(terms)
            for term in unique_terms:
                self.doc_freqs[term] += 1
        
        self.avg_doc_length = sum(self.doc_lengths) / len(self.doc_lengths) if self.doc_lengths else 0
    
    def _tokenize(self, text: str) -> List[str]:
        """Tokenize text for BM25 scoring."""
        # Simple tokenization - can be enhanced with legal-specific preprocessing
        text = text.lower()
        text = re.sub(r'[^\w\s]', ' ', text)
        return [term for term in text.split() if len(term) > 2]
    
    def score(self, query: str, doc_terms: List[str]) -> float:
        """Calculate BM25 score for query-document pair."""
        if not doc_terms or self.avg_doc_length == 0:
            return 0.0
        
        query_terms = self._tokenize(query)
        doc_length = len(doc_terms)
        score = 0.0
        
        for term in query_terms:
            if term in doc_terms:
                # Term frequency in document
                tf = doc_terms.count(term)
                
                # Document frequency
                df = self.doc_freqs.get(term, 0)
                if df == 0:
                    continue
                
                # Inverse document frequency
                idf = math.log((self.total_docs - df + 0.5) / (df + 0.5))
                
                # BM25 formula
                numerator = tf * (self.k1 + 1)
                denominator = tf + self.k1 * (1 - self.b + self.b * (doc_length / self.avg_doc_length))
                
                score += idf * (numerator / denominator)
        
        return score

class HybridSearchEngine:
    """Main hybrid search engine combining semantic and keyword search."""
    
    def __init__(self):
        self.bm25_scorers: Dict[str, BM25Scorer] = {}
        self.tfidf_vectorizers: Dict[str, TfidfVectorizer] = {}
        self.keyword_expander = LegalKeywordExpander()
    
    async def _get_or_create_bm25(self, case_id: str) -> BM25Scorer:
        """Get or create BM25 scorer for a case."""
        if case_id not in self.bm25_scorers:
            # Get all documents for the case
            vs = get_or_create_vectorstore(case_id)
            docs = await self._get_all_documents(vs)
            
            # Create and fit BM25 scorer
            scorer = BM25Scorer()
            scorer.fit(docs)
            self.bm25_scorers[case_id] = scorer
        
        return self.bm25_scorers[case_id]
    
    async def _get_all_documents(self, vectorstore) -> List[Document]:
        """Get all documents from vector store."""
        try:
            # Get all documents from ChromaDB
            results = vectorstore.get()
            docs = []
            
            for i in range(len(results['ids'])):
                doc = Document(
                    page_content=results['documents'][i],
                    metadata=results['metadatas'][i] if results['metadatas'] else {}
                )
                docs.append(doc)
            
            return docs
        except Exception as e:
            logger.error(f"Failed to get all documents: {e}")
            return []
    
    async def _semantic_search(
        self, 
        case_id: str, 
        query: str, 
        k: int = 8,
        metadata_filters: Optional[Dict[str, Any]] = None
    ) -> List[Tuple[Document, float]]:
        """Perform semantic search using embeddings."""
        vs = get_or_create_vectorstore(case_id)
        
        search_kwargs = {"k": k}
        if metadata_filters:
            search_kwargs["filter"] = metadata_filters
        
        try:
            docs = vs.similarity_search_with_score(query, **search_kwargs)
            return [(doc, 1.0 - score) for doc, score in docs]  # Convert to similarity
        except Exception as e:
            logger.error(f"Semantic search failed: {e}")
            return []
    
    async def _keyword_search(
        self, 
        case_id: str, 
        query: str, 
        k: int = 8
    ) -> List[Tuple[Document, float]]:
        """Perform keyword-based search using BM25."""
        # Get or create BM25 scorer
        scorer = await self._get_or_create_bm25(case_id)
        vs = get_or_create_vectorstore(case_id)
        
        # Get all documents
        docs = await self._get_all_documents(vs)
        if not docs:
            return []
        
        # Score all documents
        scored_docs = []
        for doc in docs:
            terms = scorer._tokenize(doc.page_content)
            score = scorer.score(query, terms)
            if score > 0:
                scored_docs.append((doc, score))
        
        # Sort by score and return top k
        scored_docs.sort(key=lambda x: x[1], reverse=True)
        return scored_docs[:k]
    
    async def hybrid_search(
        self,
        case_id: str,
        query: str,
        k: int = 8,
        semantic_weight: float = 0.6,
        keyword_weight: float = 0.4,
        metadata_filters: Optional[Dict[str, Any]] = None
    ) -> List[SearchResult]:
        """
        Perform hybrid search combining semantic and keyword results.
        
        Args:
            case_id: Case identifier
            query: Search query
            k: Number of results to return
            semantic_weight: Weight for semantic search (0-1)
            keyword_weight: Weight for keyword search (0-1)
            metadata_filters: Optional metadata filters
        
        Returns:
            List of search results with combined scores
        """
        # Normalize weights
        total_weight = semantic_weight + keyword_weight
        if total_weight == 0:
            semantic_weight, keyword_weight = 0.5, 0.5
        else:
            semantic_weight /= total_weight
            keyword_weight /= total_weight
        
        # Mask supported identifiers before keyword expansion, cache, and embedding.
        query = redact_indian_pii(query)
        expanded_query = self.keyword_expander.expand_query(query)
        
        # Check cache first
        cache_key = f"hybrid:{case_id}:{hashlib.md5(f'{query}:{k}:{semantic_weight}:{keyword_weight}'.encode()).hexdigest()}"
        cached_result = cache.get("search", cache_key)
        if cached_result:
            return cached_result
        
        # Perform both searches in parallel
        semantic_task = self._semantic_search(case_id, expanded_query, k * 2, metadata_filters)
        keyword_task = self._keyword_search(case_id, query, k * 2)
        
        semantic_results, keyword_results = await asyncio.gather(
            semantic_task, 
            keyword_task,
            return_exceptions=True
        )
        
        # Handle exceptions
        if isinstance(semantic_results, Exception):
            logger.error(f"Semantic search failed: {semantic_results}")
            semantic_results = []
        
        if isinstance(keyword_results, Exception):
            logger.error(f"Keyword search failed: {keyword_results}")
            keyword_results = []
        
        # Combine results
        combined_scores = defaultdict(lambda: {"semantic": 0.0, "keyword": 0.0, "doc": None})
        
        # Add semantic scores
        for doc, score in semantic_results:
            doc_id = id(doc)  # Use object id as unique identifier
            combined_scores[doc_id]["semantic"] = score
            combined_scores[doc_id]["doc"] = doc
        
        # Add keyword scores
        for doc, score in keyword_results:
            doc_id = id(doc)
            combined_scores[doc_id]["keyword"] = score
            if combined_scores[doc_id]["doc"] is None:
                combined_scores[doc_id]["doc"] = doc
        
        # Calculate combined scores and create results
        results = []
        for doc_id, scores in combined_scores.items():
            if scores["doc"] is None:
                continue
            
            # Normalize scores (min-max scaling)
            semantic_score = scores["semantic"]
            keyword_score = scores["keyword"]
            
            # Combine scores with weights
            combined_score = (semantic_score * semantic_weight) + (keyword_score * keyword_weight)
            
            # Extract matched keywords
            matched_keywords = self._extract_matched_keywords(query, scores["doc"].page_content)
            
            result = SearchResult(
                document=scores["doc"],
                semantic_score=semantic_score,
                keyword_score=keyword_score,
                combined_score=combined_score,
                rank=0,  # Will be set after sorting
                matched_keywords=matched_keywords
            )
            results.append(result)
        
        # Sort by combined score and assign ranks
        results.sort(key=lambda x: x.combined_score, reverse=True)
        for i, result in enumerate(results):
            result.rank = i + 1
        
        # Return top k results
        top_results = results[:k]
        
        # Cache results
        cache.set("search", top_results, ttl=settings.cache_ttl_search, cache_key=cache_key)
        
        return top_results
    
    def _extract_matched_keywords(self, query: str, content: str) -> List[str]:
        """Extract keywords from query that match in content."""
        query_terms = set(self.keyword_expander._tokenize(query))
        content_terms = set(self.keyword_expander._tokenize(content))
        matched = query_terms.intersection(content_terms)
        return list(matched)
    
    def clear_cache(self, case_id: Optional[str] = None) -> None:
        """Clear cached indices."""
        if case_id:
            self.bm25_scorers.pop(case_id, None)
            self.tfidf_vectorizers.pop(case_id, None)
        else:
            self.bm25_scorers.clear()
            self.tfidf_vectorizers.clear()

# Global hybrid search engine instance
hybrid_search = HybridSearchEngine()
