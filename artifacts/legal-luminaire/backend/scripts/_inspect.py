"""Diagnostic: print registry sample. Not used by FastAPI."""
from pathlib import Path
import json
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from registry import DERIVATIVE_TYPES, SUBJECTS

print("DERIVATIVE_TYPES[0] keys:", list(DERIVATIVE_TYPES[0].keys()))
print("DERIVATIVE_TYPES[0] full:", json.dumps(DERIVATIVE_TYPES[0], indent=2, ensure_ascii=False)[:500])
print()
print("SUBJECTS[0] keys:", list(SUBJECTS[0].keys()))
print("SUBJECTS[0] full:", json.dumps(SUBJECTS[0], indent=2, ensure_ascii=False)[:500])
