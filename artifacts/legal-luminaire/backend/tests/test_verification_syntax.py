"""
Simple syntax and structure test for verification systems
Tests the code structure without requiring full dependency installation
"""

import ast
import sys
from pathlib import Path

def test_file_syntax(filepath):
    """Test that a Python file has valid syntax"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        ast.parse(code)
        return True, "Syntax valid"
    except SyntaxError as e:
        return False, f"Syntax error: {e}"
    except Exception as e:
        return False, f"Error: {e}"

def test_class_structure(filepath, expected_classes):
    """Test that expected classes exist in the file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        tree = ast.parse(code)
        
        found_classes = []
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                found_classes.append(node.name)
        
        missing = [cls for cls in expected_classes if cls not in found_classes]
        if missing:
            return False, f"Missing classes: {missing}"
        return True, f"All expected classes found: {found_classes}"
    except Exception as e:
        return False, f"Error: {e}"

def test_function_structure(filepath, expected_functions):
    """Test that expected functions exist in the file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        tree = ast.parse(code)
        
        found_functions = []
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                found_functions.append(node.name)
            elif isinstance(node, ast.AsyncFunctionDef):
                found_functions.append(node.name)
        
        missing = [func for func in expected_functions if func not in found_functions]
        if missing:
            return False, f"Missing functions: {missing}"
        return True, f"All expected functions found: {found_functions}"
    except Exception as e:
        return False, f"Error: {e}"

def main():
    backend_dir = Path(__file__).parent.parent
    tests = [
        {
            'file': backend_dir / 'verification' / 'accuracy_pipeline.py',
            'classes': ['AccuracyVerificationPipeline', 'AccuracyPipelineResult'],
            'functions': ['verify_citation_accuracy', 'verify_standards_accuracy', 
                         'verify_precedent_relevance', 'verify_chain_of_custody', 
                         'detect_hallucinations', 'run_verification']
        },
        {
            'file': backend_dir / 'verification' / 'error_detector.py',
            'classes': ['LegalErrorDetector', 'LegalError'],
            'functions': ['detect_hallucinated_citations', 'detect_incorrect_is_clauses',
                         'detect_superseded_standards', 'detect_misrepresented_holdings',
                         'detect_factual_inconsistencies', 'detect_contradictory_arguments',
                         'suggest_missing_precedents']
        },
        {
            'file': backend_dir / 'agents' / 'enhanced_researcher.py',
            'classes': ['EnhancedLegalResearcher'],
            'functions': ['verify_citation', 'batch_verify_citations', 
                         'score_precedent_relevance', 'extract_holding']
        },
        {
            'file': backend_dir / 'rag' / 'advanced_processor.py',
            'classes': ['AdvancedDocumentProcessor', 'ProcessedDocument'],
            'functions': ['process_document', 'extract_tables', 'extract_cross_references',
                         'recognize_citations', 'detect_language', 'classify_document_type']
        },
        {
            'file': backend_dir / 'rag' / 'case_isolated_store.py',
            'classes': ['CaseIsolatedDocumentStore', 'CaseDocumentRegistry'],
            'functions': ['create_case_collection', 'add_document', 'search_documents',
                         'detect_contamination', 'delete_case_collection']
        }
    ]
    
    print("Testing Verification Systems Structure and Syntax")
    print("=" * 60)
    
    all_passed = True
    for test in tests:
        filepath = test['file']
        print(f"\nTesting: {filepath.name}")
        print("-" * 60)
        
        # Test syntax
        passed, message = test_file_syntax(filepath)
        print(f"  Syntax: {'PASS' if passed else 'FAIL'} {message}")
        all_passed = all_passed and passed
        
        # Test classes
        if 'classes' in test:
            passed, message = test_class_structure(filepath, test['classes'])
            print(f"  Classes: {'PASS' if passed else 'FAIL'} {message}")
            all_passed = all_passed and passed
        
        # Test functions
        if 'functions' in test:
            passed, message = test_function_structure(filepath, test['functions'])
            print(f"  Functions: {'PASS' if passed else 'FAIL'} {message}")
            all_passed = all_passed and passed
    
    print("\n" + "=" * 60)
    if all_passed:
        print("PASS: All tests passed!")
        return 0
    else:
        print("FAIL: Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
