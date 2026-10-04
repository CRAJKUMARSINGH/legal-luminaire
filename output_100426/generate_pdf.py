"""
[NON-CANONICAL — CONVENIENCE COPY ONLY]
Generate court-ready PDF for Hemraj Vardar Discharge Application
Uses reportlab with Unicode/Hindi support via a system font

⚠️  CANONICAL SOURCE OF TRUTH = scripts/ folder at repo root:
    • scripts/generate_discharge_pdf.py     — Hemraj v5 PDF generator (bold fonts + page breaks)
    • scripts/gen_discharge_v5.py           — v5 full pipeline (case01-data.ts compatible)
    • scripts/generate_discharge_english.py — English side-by-side variant
    • scripts/gen_discharge_v4.py           — v4 intermediate revision

This file in output_100426/ is a ONE-OFF STANDALONE copy that was used to
produce DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.pdf on 10 April 2026.
It reads a TXT input from THIS FOLDER (DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.txt)
and writes a PDF to THIS FOLDER. It works, but it doesn't share code with
the production pipeline above. Use scripts/ for all future changes.
"""
import os, sys

# ── Try to find a Unicode font that supports Devanagari ──────────────────────
FONT_CANDIDATES = [
    r"C:\Windows\Fonts\mangal.ttf",
    r"C:\Windows\Fonts\Mangal.ttf",
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\Arial.ttf",
    "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
FONT_PATH = next((f for f in FONT_CANDIDATES if os.path.isfile(f)), None)

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
)
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register font
FONT_NAME = "Helvetica"
if FONT_PATH:
    try:
        pdfmetrics.registerFont(TTFont("CourtFont", FONT_PATH))
        FONT_NAME = "CourtFont"
        print(f"Using font: {FONT_PATH}")
    except Exception as e:
        print(f"Font registration failed: {e}, using Helvetica")
else:
    print("No Devanagari font found, using Helvetica (Hindi may not render)")

# Read source text
src = os.path.join(os.path.dirname(__file__), "DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.txt")
with open(src, encoding="utf-8") as f:
    raw = f.read()

# Output PDF
out = os.path.join(os.path.dirname(__file__), "DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.pdf")

doc = SimpleDocTemplate(
    out,
    pagesize=A4,
    leftMargin=25*mm,
    rightMargin=20*mm,
    topMargin=20*mm,
    bottomMargin=20*mm,
    title="Discharge Application - Hemraj Vardar - Special Session Case 1/2025",
    author="Legal Luminaire",
)

styles = getSampleStyleSheet()
normal = ParagraphStyle(
    "CourtNormal",
    fontName=FONT_NAME,
    fontSize=11,
    leading=18,
    alignment=TA_JUSTIFY,
    spaceAfter=6,
)
heading = ParagraphStyle(
    "CourtHeading",
    fontName=FONT_NAME,
    fontSize=11,
    leading=16,
    alignment=TA_LEFT,
    fontWeight="bold",
    spaceAfter=4,
    spaceBefore=10,
    textColor=colors.black,
)
center = ParagraphStyle(
    "CourtCenter",
    fontName=FONT_NAME,
    fontSize=12,
    leading=18,
    alignment=TA_CENTER,
    spaceAfter=4,
)
bold_center = ParagraphStyle(
    "CourtBoldCenter",
    fontName=FONT_NAME,
    fontSize=13,
    leading=20,
    alignment=TA_CENTER,
    spaceAfter=6,
)

story = []

# Process lines
lines = raw.split("\n")
i = 0
while i < len(lines):
    line = lines[i]
    stripped = line.strip()

    # Horizontal rule lines
    if stripped.startswith("━") or stripped.startswith("─"):
        story.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=4, spaceBefore=4))
        i += 1
        continue

    # Empty line
    if not stripped:
        story.append(Spacer(1, 4*mm))
        i += 1
        continue

    # Section headings (भाग-*)
    if stripped.startswith("भाग-") or stripped.startswith("विशेष सत्र") or stripped.startswith("राज्य बनाम") or stripped.startswith("भारतीय नागरिक"):
        story.append(Paragraph(stripped, heading))
        i += 1
        continue

    # Court heading lines (first few lines)
    if i < 8:
        story.append(Paragraph(stripped, center))
        i += 1
        continue

    # Table lines — collect and render as preformatted
    if stripped.startswith("┌") or stripped.startswith("│") or stripped.startswith("├") or stripped.startswith("└"):
        table_lines = []
        while i < len(lines) and (lines[i].strip().startswith(("┌","│","├","└","┐","┤","┘","─"))):
            table_lines.append(lines[i])
            i += 1
        # Render as monospace paragraph
        table_text = "\n".join(table_lines)
        tbl_style = ParagraphStyle(
            "TablePre",
            fontName="Courier",
            fontSize=8,
            leading=11,
            spaceAfter=6,
        )
        story.append(Paragraph(table_text.replace("\n", "<br/>"), tbl_style))
        continue

    # Normal paragraph
    story.append(Paragraph(stripped, normal))
    i += 1

doc.build(story)
print(f"\nPDF generated: {out}")
print(f"Size: {os.path.getsize(out):,} bytes")
