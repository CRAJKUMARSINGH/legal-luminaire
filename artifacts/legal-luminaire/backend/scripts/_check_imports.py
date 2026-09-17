"""Diagnostic: registry + variant_engine imports. Not used by FastAPI."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services import variant_engine as ve
reg = ve.load_registry()
print(f"variant_engine OK: subjects count = {len(reg.get('subjects', {}))}")
print("variant_engine data file read OK")

from registry import DERIVATIVE_TYPES, SUBJECTS, build_system_prompt
print(f"registry OK: DERIVATIVE_TYPES={len(DERIVATIVE_TYPES)}, SUBJECTS={len(SUBJECTS)}")

_by_id = {d["id"]: d for d in DERIVATIVE_TYPES}
cross_ok = True
for s in SUBJECTS:
    for t in s["applicable_types"]:
        if t not in _by_id:
            cross_ok = False
            print(f"BAD REF: subject {s['id']} references type_id {t}")
assert cross_ok, "Cross-reference errors found"
print("registry cross-reference check: all applicable_types map to valid derivative_types")

p = build_system_prompt(DERIVATIVE_TYPES[0], SUBJECTS[0]["id"], court="Rajasthan High Court")
assert "VERIFIED" in p, "build_system_prompt missing VERIFIED marker"
print(f"build_system_prompt OK: prompt length = {len(p)} chars, VERIFIED marker present")

print("NON-FASTAPI IMPORTS OK (all checks passed)")
