"""
Stadium Collapse Case Pre-loading Script
Legal Luminaire - Gap Filling Action Plan Task 1.1

Pre-loads all Stadium Collapse (Hemraj Vardar) documents into ChromaDB
for the specific case ID: stadium_collapse_2025

This script:
1. Identifies all relevant Stadium Collapse documents
2. Ingests them into a dedicated ChromaDB collection
3. Validates indexing and retrieval quality
4. Generates a pre-loading summary report
"""
from __future__ import annotations

import logging
import sys
from pathlib import Path
from typing import List

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from rag.document_store import ingest_files, get_retriever, case_has_documents, get_case_doc_count
from config import settings

logger = logging.getLogger(__name__)

# Stadium Collapse Case Configuration
CASE_ID = "stadium_collapse_2025"
CASE_NAME = "Hemraj Vardar Stadium Collapse Case"

# Source document paths
SOURCE_DIR = Path(__file__).parent.parent.parent.parent.parent / "real_cases" / "CASE01_HEMRAJ_STATE_2025"

# Key documents to prioritize (will be indexed first)
PRIORITY_DOCUMENTS = [
    "Comprehensive_Legal_Defence_Report_Stadium_Collapse.md",
    "Stadium_Collapse_Defence_Hindi.lex",
    "Cross_Reference_Matrix_Detailed.lex",
    "Standards_Matrix_IS_ASTM_NABL.md",
    "Case_Facts_Timeline.md",
    "Case_Law_Matrix_Verified_Pending.md",
    "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md",
    "DEEPsEARCH.md",
]

# Supported file extensions
SUPPORTED_EXTENSIONS = {".md", ".lex", ".txt", ".pdf", ".html"}


def collect_document_paths() -> List[Path]:
    """
    Collect all Stadium Collapse document paths.
    Returns priority documents first, then other documents.
    """
    if not SOURCE_DIR.exists():
        logger.error(f"Source directory not found: {SOURCE_DIR}")
        return []

    all_files = []
    priority_files = []
    other_files = []

    for file_path in SOURCE_DIR.rglob("*"):
        if file_path.is_file() and file_path.suffix.lower() in SUPPORTED_EXTENSIONS:
            if file_path.name in PRIORITY_DOCUMENTS:
                priority_files.append(file_path)
            else:
                other_files.append(file_path)

    # Sort to ensure consistent ordering
    priority_files.sort()
    other_files.sort()

    all_files = priority_files + other_files
    logger.info(f"Collected {len(all_files)} documents ({len(priority_files)} priority, {len(other_files)} other)")
    
    return all_files


def main():
    """Main pre-loading function."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    logger.info(f"Starting Stadium Collapse case pre-loading for {CASE_NAME}")
    logger.info(f"Case ID: {CASE_ID}")
    logger.info(f"Source directory: {SOURCE_DIR}")
    
    # Step 1: Collect document paths
    document_paths = collect_document_paths()
    if not document_paths:
        logger.error("No documents found to ingest. Aborting.")
        return
    
    # Step 2: Clear existing collection if it exists
    logger.info(f"Checking for existing collection for case {CASE_ID}...")
    if case_has_documents(CASE_ID):
        logger.warning(f"Collection already exists for {CASE_ID} with {get_case_doc_count(CASE_ID)} documents")
        logger.info("To clear existing data, delete the ChromaDB collection directory manually")
        logger.info(f"Collection directory: {settings.chroma_path / CASE_ID}")
    
    # Step 3: Ingest documents
    logger.info(f"Starting ingestion of {len(document_paths)} documents...")
    summary = ingest_files(CASE_ID, document_paths)
    
    # Step 4: Generate summary report
    logger.info("=" * 60)
    logger.info("PRE-LOADING SUMMARY REPORT")
    logger.info("=" * 60)
    logger.info(f"Case: {CASE_NAME}")
    logger.info(f"Case ID: {CASE_ID}")
    logger.info(f"Source Directory: {SOURCE_DIR}")
    logger.info(f"Total Files Attempted: {len(document_paths)}")
    logger.info(f"Successfully Indexed: {len(summary['indexed'])}")
    logger.info(f"Skipped: {len(summary['skipped'])}")
    logger.info(f"Errors: {len(summary['errors'])}")
    
    if summary['indexed']:
        logger.info("\nIndexed Documents:")
        for item in summary['indexed']:
            logger.info(f"  ✓ {item['file']}: {item['chunks']} chunks")
    
    if summary['skipped']:
        logger.info("\nSkipped Documents:")
        for filename in summary['skipped']:
            logger.info(f"  ⊘ {filename}")
    
    if summary['errors']:
        logger.info("\nErrors:")
        for error in summary['errors']:
            logger.info(f"  ✗ {error}")
    
    # Step 5: Validate retrieval
    logger.info("\n" + "=" * 60)
    logger.info("RETRIEVAL VALIDATION")
    logger.info("=" * 60)
    
    test_queries = [
        "Kattavellai Supreme Court DNA guidelines",
        "rain sampling violations",
        "IS 1199 fresh concrete wrong standard",
        "IS 2250 masonry mortar correct standard",
        "ASTM C1324 hardened masonry mortar",
        "surface contamination",
        "chain of custody defects",
        "absence of representative",
    ]
    
    retriever = get_retriever(CASE_ID, k=3)
    
    for query in test_queries:
        logger.info(f"\nTesting query: '{query}'")
        try:
            docs = retriever.invoke(query)
            if docs:
                logger.info(f"  ✓ Retrieved {len(docs)} documents")
                for i, doc in enumerate(docs[:2], 1):
                    src = doc.metadata.get('source_file', 'unknown')
                    preview = doc.page_content[:100].replace('\n', ' ')
                    logger.info(f"    [{i}] {src}: {preview}...")
            else:
                logger.warning(f"  ✗ No documents retrieved")
        except Exception as e:
            logger.error(f"  ✗ Retrieval failed: {e}")
    
    # Step 6: Final status
    total_chunks = sum(item['chunks'] for item in summary['indexed'])
    logger.info("\n" + "=" * 60)
    logger.info("PRE-LOADING COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Status: SUCCESS")
    logger.info(f"Total Documents Indexed: {len(summary['indexed'])}")
    logger.info(f"Total Chunks Created: {total_chunks}")
    logger.info(f"ChromaDB Collection: case_{CASE_ID}")
    logger.info(f"Collection Path: {settings.chroma_path / CASE_ID}")
    logger.info("\nThe Stadium Collapse case is now ready for:")
    logger.info("  - RAG-based question answering")
    logger.info("  - Citation verification")
    logger.info("  - Standards verification")
    logger.info("  - Multi-agent drafting")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()