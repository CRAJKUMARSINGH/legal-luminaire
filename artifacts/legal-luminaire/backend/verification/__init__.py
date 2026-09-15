"""
Verification Package
Accuracy verification and error detection for legal documents
"""
from .accuracy_pipeline import AccuracyVerificationPipeline, AccuracyPipelineResult
from .error_detector import LegalErrorDetector, ErrorDetectionResult

__all__ = [
    "AccuracyVerificationPipeline",
    "AccuracyPipelineResult", 
    "LegalErrorDetector",
    "ErrorDetectionResult"
]