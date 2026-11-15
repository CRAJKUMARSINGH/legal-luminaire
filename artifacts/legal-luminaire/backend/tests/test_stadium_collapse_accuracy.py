"""
Integration tests — Stadium Collapse accuracy verification systems.

Tests that:
  1. The TC-01 Stadium Collapse comprehensive defence document exists and
     contains the expected legal content markers.
  2. All verification system module files exist on disk.
  3. The accuracy_pipeline.py module contains the required class definitions.
"""

import sys
from pathlib import Path


def test_stadium_collapse_document():
    """TC-01 Stadium Collapse defence document exists and contains key content."""
    stadium_doc_path = (
        Path(__file__).parent.parent
        / "uploaded_cases"
        / "TC-01"
        / "Comprehensive_Legal_Defence_Report_Stadium_Collapse.md"
    )

    assert stadium_doc_path.exists(), (
        f"Stadium Collapse document not found at {stadium_doc_path}"
    )

    with open(stadium_doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    required_patterns = [
        ("IS 1199:2018", "Indian Standard 1199"),
        ("IS 2250:1981", "Indian Standard 2250"),
        ("ASTM C1324", "ASTM Standard C1324"),
        ("ASTM C780", "ASTM Standard C780"),
        ("Kattavellai", "Legal precedent Kattavellai"),
        ("Chain of Custody", "Chain of custody terminology"),
        ("FORENSIC SAMPLING", "Forensic sampling section"),
        ("Supreme Court", "Supreme Court reference"),
    ]

    missing = [desc for pattern, desc in required_patterns if pattern not in content]
    assert not missing, (
        f"Missing required content markers in Stadium Collapse document: {missing}"
    )


def test_verification_systems_exist():
    """All verification system module files must exist on disk."""
    backend_dir = Path(__file__).parent.parent

    required_files = [
        backend_dir / "verification" / "accuracy_pipeline.py",
        backend_dir / "verification" / "error_detector.py",
        backend_dir / "agents" / "enhanced_researcher.py",
        backend_dir / "rag" / "advanced_processor.py",
        backend_dir / "rag" / "case_isolated_store.py",
        backend_dir / "agents" / "tools" / "legal_verifier.py",
        backend_dir / "rag" / "standards_database.py",
        backend_dir / "agents" / "chain_custody_specialist.py",
    ]

    missing = [str(f) for f in required_files if not f.exists()]
    assert not missing, (
        f"The following verification system files are missing: {missing}"
    )


def test_document_structure():
    """accuracy_pipeline.py must contain the required class definitions."""
    backend_dir = Path(__file__).parent.parent
    accuracy_pipeline = backend_dir / "verification" / "accuracy_pipeline.py"

    assert accuracy_pipeline.exists(), (
        f"accuracy_pipeline.py not found at {accuracy_pipeline}"
    )

    with open(accuracy_pipeline, "r", encoding="utf-8") as f:
        content = f.read()

    required_classes = [
        "AccuracyVerificationPipeline",
        "AccuracyPipelineResult",
        "CitationAccuracyResult",
        "StandardAccuracyResult",
    ]

    missing = [cls for cls in required_classes if cls not in content]
    assert not missing, (
        f"accuracy_pipeline.py is missing required class definitions: {missing}"
    )


if __name__ == "__main__":
    import pytest
    sys.exit(pytest.main([__file__, "-v"]))
