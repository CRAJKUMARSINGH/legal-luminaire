"""Diagnostic: print registry fields. Not used by FastAPI."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from registry import DERIVATIVE_TYPES, SUBJECTS

print("--- DERIVATIVE_TYPES[0] ---")
d0 = DERIVATIVE_TYPES[0]
for k, v in d0.items():
    if isinstance(v, (dict, list)) and len(str(v)) > 80:
        v = str(v)[:80] + "..."
    print(f"  {k}: {v}")

print()
print("--- SUBJECTS[0] ---")
s0 = SUBJECTS[0]
for k, v in s0.items():
    if isinstance(v, (dict, list)) and len(str(v)) > 120:
        v = str(v)[:120] + "..."
    print(f"  {k}: {v}")
