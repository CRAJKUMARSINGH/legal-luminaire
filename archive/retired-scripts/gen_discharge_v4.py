# -*- coding: utf-8 -*-
"""
Generate DISCHARGE_APPLICATION_HEMRAJ_v4.pdf from v4.lex
High-Fidelity Synergy UNIQUE Styling
"""
import os, sys, re
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# --- Configuration ---
BASE_DIR = Path(__file__).resolve().parent.parent
LEX_FILE = BASE_DIR / "real_cases/CASE01_HEMRAJ_STATE_2025/DISCHARGE_APPLICATION_UPDATED_v4.lex"
OUT_FILE = BASE_DIR / "DISCHARGE_APPLICATION_HEMRAJ_v4.pdf"

# --- Font Setup ---
HINDI_FONT = "Helvetica"
HINDI_FONT_BOLD = "Helvetica-Bold"

for font_path, font_name in [
    (r"C:\Windows\Fonts\mangal.ttf", "Mangal"),
    (r"C:\Windows\Fonts\NotoSerifDevanagari-Regular.ttf", "NotoSerif"),
    (r"C:\Windows\Fonts\aparaj.ttf", "Aparajita"),
]:
    if os.path.exists(font_path):
        try:
            pdfmetrics.registerFont(TTFont(font_name, font_path))
            HINDI_FONT = font_name
            break
        except: pass

for font_path, font_name in [
    (r"C:\Windows\Fonts\mangalb.ttf", "MangalBold"),
    (r"C:\Windows\Fonts\NotoSerifDevanagari-Bold.ttf", "NotoSerifBold"),
    (r"C:\Windows\Fonts\aparajb.ttf", "AparajitaBold"),
]:
    if os.path.exists(font_path):
        try:
            pdfmetrics.registerFont(TTFont(font_name, font_path))
            HINDI_FONT_BOLD = font_name
            break
        except: pass

# --- Styles ---
def make_styles():
    s = {}
    s['title'] = ParagraphStyle('title', fontName=HINDI_FONT_BOLD, fontSize=13, leading=18, alignment=TA_CENTER, spaceAfter=4)
    s['sub'] = ParagraphStyle('sub', fontName=HINDI_FONT, fontSize=11, leading=16, alignment=TA_CENTER, spaceAfter=3)
    s['sec'] = ParagraphStyle('sec', fontName=HINDI_FONT_BOLD, fontSize=11, leading=16, spaceBefore=12, spaceAfter=6, underline=True)
    s['body'] = ParagraphStyle('body', fontName=HINDI_FONT, fontSize=10.5, leading=17, alignment=TA_JUSTIFY, spaceAfter=6)
    s['quote'] = ParagraphStyle('quote', fontName=HINDI_FONT, fontSize=10, leading=15, leftIndent=16, rightIndent=8, spaceAfter=4, textColor=colors.HexColor('#003366'), backColor=colors.HexColor('#f0f4ff'), borderPad=4)
    s['small'] = ParagraphStyle('small', fontName=HINDI_FONT, fontSize=9, leading=13, textColor=colors.grey, spaceAfter=3)
    return s

ST = make_styles()

def hr(thick=1): return HRFlowable(width="100%", thickness=thick, color=colors.black, spaceAfter=4, spaceBefore=4)
def sp(h=4): return Spacer(1, h*mm)

# --- Parsing Logic ---
def parse_lex():
    content = LEX_FILE.read_text(encoding="utf-8")
    lines = content.splitlines()
    story = []
    
    in_table = False
    table_data = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if in_table:
                story.append(build_table(table_data))
                table_data = []
                in_table = False
            story.append(sp(2))
            continue

        # Detect separators
        if set(stripped) <= {"━", "─", "=", "-", " "}:
            if in_table:
                story.append(build_table(table_data))
                table_data = []
                in_table = False
            story.append(hr(2 if "━" in line or "=" in line else 1))
            continue

        # Detect Tables (Box drawing characters)
        if "│" in line or "┌" in line or "├" in line:
            in_table = True
            if "│" in line:
                cells = [c.strip() for c in line.split("│") if c.strip() or line.count("│") > 1]
                if cells: table_data.append(cells)
            continue
        elif in_table:
            story.append(build_table(table_data))
            table_data = []
            in_table = False

        # Detect Titles and Headers
        if line.startswith("विशेष सत्र") or line.startswith("राज्य बनाम") or line.startswith("भारतीय नागरिक"):
            story.append(Paragraph(f"<b>{stripped}</b>", ST['title'] if "संख्या" not in line else ST['sub']))
            continue

        # Detect Parts/Sections
        if "भाग-" in line or "आधार संख्या" in line:
            story.append(Paragraph(f"<u><b>{stripped}</b></u>", ST['sec']))
            continue

        # Detect Quotes (Tomaso Bruno, Kattavellai, etc.)
        if stripped.startswith('"') or "v." in stripped:
            story.append(Paragraph(stripped, ST['quote']))
            continue

        # Default Body Text
        story.append(Paragraph(stripped, ST['body']))

    if in_table:
        story.append(build_table(table_data))

    return story

def build_table(data):
    if not data: return sp(1)
    # Filter out horizontal border rows
    clean_data = []
    for row in data:
        if any(c for c in row if set(c) > {"─", "┬", "┐", "┴", "┘", "┼", " ", "┌", "├", "└"}):
            clean_data.append([Paragraph(c, ST['small']) for c in row])
    
    if not clean_data: return sp(1)
    
    num_cols = max(len(r) for r in clean_data)
    for r in clean_data:
        while len(r) < num_cols: r.append("")
        
    t = Table(clean_data, colWidths=[(A4[0]-30*mm)/num_cols]*num_cols)
    t.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (-1,0), colors.whitesmoke),
        ('FONTNAME', (0,0), (-1,0), HINDI_FONT_BOLD),
    ]))
    return t

# --- Build PDF ---
def main():
    doc = SimpleDocTemplate(
        str(OUT_FILE), pagesize=A4,
        leftMargin=15*mm, rightMargin=15*mm, topMargin=15*mm, bottomMargin=15*mm,
        title="Discharge Application Hemraj v4"
    )
    story = parse_lex()
    doc.build(story)
    print(f"Successfully generated: {OUT_FILE}")

if __name__ == "__main__":
    main()
