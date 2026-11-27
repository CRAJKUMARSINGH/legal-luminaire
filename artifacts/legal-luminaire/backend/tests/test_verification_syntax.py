"""
Syntax and structure checks for verification system modules.

These helpers are invoked from main() as a standalone script:
  python tests/test_verification_syntax.py

They are NOT pytest test functions — the helpers are prefixed with _check_
so pytest does not collect them as fixtures.

A single pytest test (test_verification_systems_syntax_and_structure) calls
main() and asserts it returns 0.
"""

import ast
import sys
from pathlib import Path


# ── Helper functions (not pytest-collected) ────────────────────────────────────

def _check_file_syntax(filepath: Path):
    """Return (passed: bool, message: str) for Python syntax validity."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
        ast.parse(code)
        return True, "Syntax valid"
    except SyntaxError as e:
        return False, f"Syntax error: {e}"
    except Exception as e:
        return False, f"Error: {e}"


def _check_class_structure(filepath: Path, expected_classes: list):
    """Return (passed: bool, message: str) checking expected class names exist."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
        tree = ast.parse(code)

        found_classes = [
            node.name
            for node in ast.walk(tree)
            if isinstance(node, ast.ClassDef)
        ]

        missing = [cls for cls in expected_classes if cls not in found_classes]
        if missing:
            return False, f"Missing classes: {missing}"
        return True, f"All expected classes found: {found_classes}"
    except Exception as e:
        return False, f"Error: {e}"


def _check_function_structure(filepath: Path, expected_functions: list):
    """Return (passed: bool, message: str) checking expected function names exist."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
        tree = ast.parse(code)

        found_functions = [
            node.name
            for node in ast.walk(tree)
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
        ]

        missing = [fn for fn in expected_functions if fn not in found_functions]
        if missing:
            return False, f"Missing functions: {missing}"
        return True, f"All expected functions found: {found_functions}"
    except Exception as e:
        return False, f"Error: {e}"


# ── Test specification ─────────────────────────────────────────────────────────

def _build_test_specs(backend_dir: Path) -> list:
    return [
        {
            "file": backend_dir / "verification" / "accuracy_pipeline.py",
            "classes": ["AccuracyVerificationPipeline", "AccuracyPipelineResult"],
            "functions": [
                "run_full_pipeline",
                "_verify_citation_accuracy",
                "_verify_standard_accuracy",
                "_verify_precedent_relevance",
                "_verify_chain_of_custody",
                "_detect_hallucinations",
            ],
        },
        {
            "file": backend_dir / "verification" / "error_detector.py",
            "classes": ["LegalErrorDetector", "DetectedError"],
            "functions": [
                "detect_errors",
                "_detect_hallucinated_citations",
                "_detect_incorrect_standards",
                "_detect_superseded_standards",
                "_detect_misrepresented_holdings",
                "_detect_factual_inconsistencies",
                "_detect_contradictory_arguments",
            ],
        },
        {
            "file": backend_dir / "agents" / "enhanced_researcher.py",
            "classes": ["EnhancedResearcherAgent"],
            "functions": [
                "verify_precedent_enhanced",
                "batch_verify_precedents",
                "_calculate_fact_fit",
                "_extract_best_holding",
            ],
        },
        {
            "file": backend_dir / "rag" / "advanced_processor.py",
            "classes": ["AdvancedDocumentProcessor", "ProcessedDocument"],
            "functions": [
                "process_document",
                "extract_citations",
                "extract_cross_references",
                "extract_tables",
                "detect_language_sections",
                "detect_document_type",
            ],
        },
        {
            "file": backend_dir / "rag" / "case_isolated_store.py",
            "classes": ["CaseIsolatedDocumentStore", "CaseMetadata"],
            "functions": [
                "get_case_vectorstore",
                "ingest_documents",
                "get_case_metadata",
                "get_retriever",
                "delete_case",
                "list_all_cases",
            ],
        },
    ]


# ── Main runner ────────────────────────────────────────────────────────────────

def main() -> int:
    backend_dir = Path(__file__).parent.parent
    specs = _build_test_specs(backend_dir)

    print("Testing Verification Systems Structure and Syntax")
    print("=" * 60)

    all_passed = True
    for spec in specs:
        filepath = spec["file"]
        print(f"\nTesting: {filepath.name}")
        print("-" * 60)

        passed, message = _check_file_syntax(filepath)
        print(f"  Syntax: {'PASS' if passed else 'FAIL'} {message}")
        all_passed = all_passed and passed

        if "classes" in spec:
            passed, message = _check_class_structure(filepath, spec["classes"])
            print(f"  Classes: {'PASS' if passed else 'FAIL'} {message}")
            all_passed = all_passed and passed

        if "functions" in spec:
            passed, message = _check_function_structure(filepath, spec["functions"])
            print(f"  Functions: {'PASS' if passed else 'FAIL'} {message}")
            all_passed = all_passed and passed

    print("\n" + "=" * 60)
    if all_passed:
        print("PASS: All tests passed!")
        return 0
    else:
        print("FAIL: Some tests failed")
        return 1


# ── Single pytest-collectable test ────────────────────────────────────────────

def test_verification_systems_syntax_and_structure():
    """Runs the full structural syntax check and asserts it passes."""
    exit_code = main()
    assert exit_code == 0, (
        "One or more verification system files failed syntax or structure checks. "
        "Run: python tests/test_verification_syntax.py for details."
    )


def test_verification_consumers_can_import_the_shared_verifier():
    from agents.legal_verifier import CrossDatabaseConsensus
    from verification import accuracy_pipeline, error_detector

    assert accuracy_pipeline.CrossDatabaseConsensus is CrossDatabaseConsensus
    assert error_detector.CrossDatabaseConsensus is CrossDatabaseConsensus


if __name__ == "__main__":
    sys.exit(main())
