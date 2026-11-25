"""
Backend Lab Report Extraction Routes — Week 8
Specialized parsing for NABL/FSL lab reports.
"""
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import logging
import shutil
from pathlib import Path
from tempfile import TemporaryDirectory

from api.redaction_utils import redact_indian_pii

router = APIRouter()
logger = logging.getLogger(__name__)

class LabTestResult(BaseModel):
    parameter: str = Field(description="e.g. Compressive Strength, C/S Ratio")
    observed_value: str = Field(description="The value found by the lab")
    specified_value: str = Field(description="The value required by the standard (e.g. IS 456)")
    unit: str = Field(description="e.g. N/mm2, %")
    status: str = Field(description="PASS / FAIL / MARGINAL")

class LabReportExtraction(BaseModel):
    report_no: str
    date_of_issue: str
    sample_description: str
    results: List[LabTestResult]
    conclusion: str
    standard_applied: str

@router.post("/extract-lab-report", response_model=LabReportExtraction)
async def extract_lab_report(file: UploadFile = File(...)):
    """Extract structured data from a NABL Lab Report (PDF/Image)."""
    gemini_key = os.environ.get("GOOGLE_API_KEY", "")
    if not gemini_key:
        raise HTTPException(status_code=500, detail="Gemini key not configured.")

    ext = Path(file.filename or "").suffix.lower()
    if ext not in {".pdf", ".png", ".jpg", ".jpeg"}:
        raise HTTPException(status_code=415, detail="Upload a PDF, PNG, or JPEG lab report.")

    try:
        with TemporaryDirectory(prefix="ll-lab-") as temp_dir:
            temp_path = Path(temp_dir) / f"report{ext}"
            with temp_path.open("wb") as destination:
                shutil.copyfileobj(file.file, destination)

            if ext == ".pdf":
                from langchain_community.document_loaders import PyPDFLoader

                extracted_text = "\n".join(
                    doc.page_content for doc in PyPDFLoader(str(temp_path)).load()
                )
            else:
                import pytesseract
                from PIL import Image

                with Image.open(temp_path) as image:
                    extracted_text = pytesseract.image_to_string(image)
    except Exception as error:
        logger.error("Lab report text extraction failed (%s)", type(error).__name__)
        raise HTTPException(status_code=500, detail="Failed to read file.") from error

    # 2. Gemini Structured Extraction
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import ChatPromptTemplate
        
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=gemini_key,
            temperature=0.1,
        )
        structured_llm = llm.with_structured_output(LabReportExtraction)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a professional forensic lab validator. Extract the following table data from the lab report. "
                       "Ensure you capture 'Observed' vs 'Specified/Requirement' values accurately. "
                       "Identify the IS/BIS standard applied to the test."),
            ("human", "{text}")
        ])
        
        chain = prompt | structured_llm
        result = chain.invoke({"text": redact_indian_pii(extracted_text)[:12000]})
        return result
    except Exception as error:
        logger.error("Lab report AI extraction failed (%s)", type(error).__name__)
        raise HTTPException(status_code=502, detail="Lab report extraction failed.") from error
