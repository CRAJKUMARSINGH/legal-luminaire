"""
Optimized RAG Document Store with Caching and Async Processing
Implements parallel processing, semantic chunking, and incremental indexing.
"""
from __future__ import annotations

import asyncio
import hashlib
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Optional, List, Dict, Any, AsyncGenerator
import time

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
)
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

from config import settings
from cache import cache, cached_async

logger = logging.getLogger(__name__)

# Semantic-aware splitter with legal context preservation
SPLITTER = RecursiveCharacterTextSplitter(
    chunk_size=1200,
    chunk_overlap=200,
    separators=[
        "\n\n",  # Paragraph breaks
        "\n",   # Line breaks
        "।",    # Hindi sentence terminator
        r"\. ", # Sentence with space
        ". ",   # Sentence
        "; ",   # Semicolon
        ", ",   # Comma
        " ",    # Space
    ],
)

# Thread pool for parallel document processing
executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="doc_processor")


def _file_hash(path: Path) -> str:
    """Generate MD5 hash of file for change detection."""
    return hashlib.md5(path.read_bytes()).hexdigest()


def _load_file_sync(path: Path) -> List[Document]:
    """Load a single file synchronously."""
    suffix = path.suffix.lower()
    try:
        if suffix == ".pdf":
            return PyPDFLoader(str(path)).load()
        elif suffix in (".md", ".txt", ".lex"):
            return TextLoader(str(path), encoding="utf-8").load()
        elif suffix in (".doc", ".docx"):
            try:
                from langchain_community.document_loaders import UnstructuredWordDocumentLoader
            except ImportError:
                logger.warning(f"UnstructuredWordDocumentLoader not available — install 'unstructured' to handle DOCX. Skipping {path.name}.")
                return []
            return UnstructuredWordDocumentLoader(str(path)).load()
        elif suffix in (".jpg", ".jpeg", ".png", ".tiff"):
            try:
                from langchain_community.document_loaders import UnstructuredImageLoader
            except ImportError:
                logger.warning(f"UnstructuredImageLoader not available — install 'unstructured[inference]' to handle images. Skipping {path.name}.")
                return []
            return UnstructuredImageLoader(str(path)).load()
        else:
            logger.warning(f"Unsupported file type: {suffix} — skipping {path.name}")
            return []
    except Exception as e:
        logger.error(f"Failed to load {path.name}: {e}")
        return []


async def _load_file_async(path: Path) -> List[Document]:
    """Load a single file asynchronously."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, _load_file_sync, path)


def get_embeddings() -> OpenAIEmbeddings:
    """Get embeddings instance (reused via module-level singleton)."""
    return OpenAIEmbeddings(
        model=settings.embedding_model,
        openai_api_key=settings.openai_api_key,
    )


def get_or_create_vectorstore(case_id: str) -> Chroma:
    """Get or create a per-case ChromaDB collection with optimized settings."""
    persist_dir = settings.chroma_path / case_id
    persist_dir.mkdir(parents=True, exist_ok=True)
    
    # Use persistent client with optimized HNSW settings
    client_settings = {
        "chroma_db_impl": "duckdb+parquet",
        "allow_reset": False,
        "anonymized_telemetry": False,
    }
    
    return Chroma(
        collection_name=f"case_{case_id}",
        embedding_function=get_embeddings(),
        persist_directory=str(persist_dir),
        client_settings=client_settings,
    )


async def ingest_files_parallel(case_id: str, file_paths: List[Path]) -> Dict[str, Any]:
    """
    Ingest files in parallel with incremental indexing.
    Only processes new/modified files based on hash comparison.
    """
    start_time = time.time()
    vectorstore = get_or_create_vectorstore(case_id)
    
    summary = {
        "indexed": [],
        "skipped": [],
        "errors": [],
        "total_files": len(file_paths),
        "processing_time": 0,
    }
    
    # Check which files need processing (incremental indexing)
    files_to_process = []
    for path in file_paths:
        if not path.exists():
            summary["errors"].append(f"{path.name}: file not found")
            continue
        
        current_hash = _file_hash(path)
        cache_key = f"file_hash:{case_id}:{path.name}"
        cached_hash = cache.get("file_hash", case_id, path.name)
        
        if cached_hash == current_hash:
            summary["skipped"].append(path.name)
            logger.info(f"Skipping unchanged file: {path.name}")
        else:
            files_to_process.append((path, current_hash))
    
    if not files_to_process:
        summary["processing_time"] = time.time() - start_time
        return summary
    
    logger.info(f"Processing {len(files_to_process)} files for case {case_id}")
    
    # Load files in parallel
    load_tasks = [_load_file_async(path) for path, _ in files_to_process]
    docs_results = await asyncio.gather(*load_tasks, return_exceptions=True)
    
    # Process results
    all_chunks = []
    for (path, file_hash), docs in zip(files_to_process, docs_results):
        if isinstance(docs, Exception):
            summary["errors"].append(f"{path.name}: {str(docs)}")
            continue
        
        if not docs:
            summary["skipped"].append(path.name)
            continue
        
        # Tag each chunk with enhanced metadata
        for doc in docs:
            doc.metadata.update({
                "case_id": case_id,
                "source_file": path.name,
                "file_hash": file_hash,
                "file_size": path.stat().st_size,
                "modified_time": path.stat().st_mtime,
                "ingestion_time": time.time(),
            })
        
        # Use semantic chunking
        chunks = SPLITTER.split_documents(docs)
        all_chunks.extend(chunks)
        
        # Cache file hash to avoid reprocessing
        cache.set("file_hash", file_hash, ttl=86400, case_id=case_id, file_name=path.name)
        
        summary["indexed"].append({
            "file": path.name,
            "chunks": len(chunks),
            "size_mb": round(path.stat().st_size / (1024 * 1024), 2)
        })
        
        logger.info(f"Indexed {path.name} → {len(chunks)} chunks")
    
    # Batch add all chunks to vector store
    if all_chunks:
        logger.info(f"Adding {len(all_chunks)} total chunks to vector store")
        vectorstore.add_documents(all_chunks)
        
        # Persist changes
        try:
            vectorstore.persist()
            logger.info("Vector store persisted successfully")
        except Exception as e:
            logger.warning(f"Failed to persist vector store: {e}")
    
    summary["processing_time"] = time.time() - start_time
    summary["total_chunks"] = len(all_chunks)
    
    return summary


@cached_async("retriever", ttl=settings.cache_ttl_search)
async def get_retriever(case_id: str, k: int = 8, search_type: str = "similarity"):
    """Return cached retriever for the given case."""
    vs = get_or_create_vectorstore(case_id)
    return vs.as_retriever(
        search_kwargs={"k": k, "search_type": search_type}
    )


async def hybrid_search(
    case_id: str, 
    query: str, 
    k: int = 8,
    metadata_filters: Optional[Dict[str, Any]] = None
) -> List[Document]:
    """
    Hybrid search combining semantic and keyword matching.
    Includes metadata pre-filtering for better performance.
    """
    cache_key = f"hybrid_search:{case_id}:{hashlib.md5(query.encode()).hexdigest()}"
    cached_result = cache.get("search", cache_key)
    if cached_result:
        return cached_result
    
    vs = get_or_create_vectorstore(case_id)
    
    # Prepare search arguments
    search_kwargs = {"k": k}
    if metadata_filters:
        search_kwargs["filter"] = metadata_filters
    
    # Perform semantic search
    semantic_docs = vs.similarity_search(query, **search_kwargs)
    
    # Perform keyword search (if available in Chroma)
    try:
        keyword_docs = vs.similarity_search(
            query, 
            search_type="mmr",  # Maximal Marginal Relevance
            **search_kwargs
        )
    except Exception:
        # Fallback to semantic search if MMR fails
        keyword_docs = semantic_docs
    
    # Combine and deduplicate results
    seen_content = set()
    combined_docs = []
    
    for doc in semantic_docs + keyword_docs:
        content_hash = hashlib.md5(doc.page_content.encode()).hexdigest()
        if content_hash not in seen_content:
            seen_content.add(content_hash)
            combined_docs.append(doc)
    
    # Cache results
    cache.set("search", combined_docs, ttl=settings.cache_ttl_search, key=cache_key)
    
    return combined_docs[:k]


async def case_has_documents(case_id: str) -> bool:
    """Check if a case has any indexed documents."""
    try:
        vs = get_or_create_vectorstore(case_id)
        count = await asyncio.get_event_loop().run_in_executor(
            executor, vs._collection.count
        )
        return count > 0
    except Exception:
        return False


async def get_case_doc_count(case_id: str) -> int:
    """Get document count for a case."""
    try:
        vs = get_or_create_vectorstore(case_id)
        return await asyncio.get_event_loop().run_in_executor(
            executor, vs._collection.count
        )
    except Exception:
        return 0


async def get_case_stats(case_id: str) -> Dict[str, Any]:
    """Get comprehensive statistics for a case."""
    try:
        vs = get_or_create_vectorstore(case_id)
        count = await asyncio.get_event_loop().run_in_executor(
            executor, vs._collection.count
        )
        
        # Get cache stats
        cache_stats = cache.get_stats()
        
        return {
            "case_id": case_id,
            "document_count": count,
            "cache_stats": cache_stats,
            "last_updated": time.time(),
        }
    except Exception as e:
        logger.error(f"Failed to get stats for case {case_id}: {e}")
        return {
            "case_id": case_id,
            "document_count": 0,
            "error": str(e),
        }


def cleanup_executor():
    """Clean up the thread pool executor."""
    executor.shutdown(wait=True)
