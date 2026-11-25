"""
RAG Document Store — per-case ChromaDB collections.
Handles PDF, DOCX, MD, TXT, and image (OCR) ingestion.
"""
from __future__ import annotations

import hashlib
import logging
from pathlib import Path
from typing import Optional

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
)
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

from api.redaction_utils import redact_indian_pii
from config import settings

logger = logging.getLogger(__name__)

SPLITTER = RecursiveCharacterTextSplitter(
    chunk_size=1200,
    chunk_overlap=200,
    separators=["\n\n", "\n", "।", ".", " "],  # Hindi-aware separators
)


def _file_hash(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()[:12]


def _load_file(path: Path) -> list[Document]:
    """Load a single file into LangChain Documents."""
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


def get_embeddings() -> OpenAIEmbeddings:
    return OpenAIEmbeddings(
        model=settings.embedding_model,
        openai_api_key=settings.openai_api_key,
    )


def get_or_create_vectorstore(case_id: str) -> Chroma:
    """Get or create a per-case ChromaDB collection."""
    persist_dir = settings.chroma_path / case_id
    persist_dir.mkdir(parents=True, exist_ok=True)
    return Chroma(
        collection_name=f"case_{case_id}",
        embedding_function=get_embeddings(),
        persist_directory=str(persist_dir),
    )


def ingest_files(case_id: str, file_paths: list[Path]) -> dict:
    """
    Ingest a list of files into the case's vector store.
    Returns a summary of what was indexed.
    """
    vectorstore = get_or_create_vectorstore(case_id)
    summary = {"indexed": [], "skipped": [], "errors": []}

    for path in file_paths:
        if not path.exists():
            summary["errors"].append(f"{path.name}: file not found")
            continue

        docs = _load_file(path)
        if not docs:
            summary["skipped"].append(path.name)
            continue

        # Redact before splitting so an identifier cannot be divided across chunks.
        file_hash = _file_hash(path)
        for doc in docs:
            doc.page_content = redact_indian_pii(doc.page_content)
            doc.metadata.update({
                "case_id": case_id,
                "source_file": path.name,
                "file_hash": file_hash,
            })

        chunks = SPLITTER.split_documents(docs)
        vectorstore.add_documents(chunks)
        summary["indexed"].append({"file": path.name, "chunks": len(chunks)})
        logger.info(f"Indexed {path.name} → {len(chunks)} chunks for case {case_id}")

    return summary


def get_retriever(case_id: str, k: int = 8):
    """Return a retriever for the given case."""
    vs = get_or_create_vectorstore(case_id)
    return vs.as_retriever(search_kwargs={"k": k})


def case_has_documents(case_id: str) -> bool:
    """Check if a case has any indexed documents."""
    try:
        vs = get_or_create_vectorstore(case_id)
        return vs._collection.count() > 0
    except Exception:
        return False


def get_case_doc_count(case_id: str) -> int:
    try:
        vs = get_or_create_vectorstore(case_id)
        return vs._collection.count()
    except Exception:
        return 0
