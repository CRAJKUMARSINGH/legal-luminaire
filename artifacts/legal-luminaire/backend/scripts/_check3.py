"""Diagnostic: bilingual registry prompt. Not used by FastAPI."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services import variant_engine as ve
reg = ve.load_registry()
print(f"variant_engine OK: subjects count = {len(reg.get('subjects', {}))}")

from registry import DERIVATIVE_TYPES, SUBJECTS, build_system_prompt
print(f"registry OK: DERIVATIVE_TYPES={len(DERIVATIVE_TYPES)}, SUBJECTS={len(SUBJECTS)}")

_by_id = {d["id"]: d for d in DERIVATIVE_TYPES}
for s in SUBJECTS:
    for t in s["applicable_types"]:
        assert t in _by_id, (s["id"], t)
print("registry cross-reference OK")

p = build_system_prompt(DERIVATIVE_TYPES[0], SUBJECTS[0]["id"], court="Rajasthan High Court")
assert "VERIFIED" in p
print(f"build_system_prompt OK: prompt={len(p)} chars")

p2 = build_system_prompt(DERIVATIVE_TYPES[0], SUBJECTS[0]["id"])
assert isinstance(p2, str) and len(p2) > 200
print("bilingual prompt build OK")
print("NON-FASTAPI IMPORTS OK (all checks passed)")
