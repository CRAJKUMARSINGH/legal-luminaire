"""Checks for duplicate routes and retired API surfaces."""

from __future__ import annotations

import ast
from pathlib import Path


def test_backend_routes_have_no_duplicate_method_and_path_pairs() -> None:
    api_dir = Path(__file__).parents[1] / "api"
    seen: dict[tuple[str, str], tuple[Path, int]] = {}
    duplicates: list[str] = []

    for source_path in sorted(api_dir.glob("routes*.py")):
        tree = ast.parse(source_path.read_text(encoding="utf-8"))
        for node in ast.walk(tree):
            if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                continue
            for decorator in node.decorator_list:
                if not (
                    isinstance(decorator, ast.Call)
                    and isinstance(decorator.func, ast.Attribute)
                    and decorator.func.attr in {"get", "post", "put", "patch", "delete"}
                    and decorator.args
                    and isinstance(decorator.args[0], ast.Constant)
                    and isinstance(decorator.args[0].value, str)
                ):
                    continue

                key = (decorator.func.attr.upper(), decorator.args[0].value)
                previous = seen.get(key)
                if previous:
                    duplicates.append(
                        f"{key[0]} {key[1]}: {previous[0]}:{previous[1]} and "
                        f"{source_path}:{node.lineno}"
                    )
                else:
                    seen[key] = (source_path, node.lineno)

    assert not duplicates, "Duplicate backend routes found:\n" + "\n".join(duplicates)


def test_pleading_chain_api_is_retired() -> None:
    from importlib.util import find_spec

    from main import app

    assert find_spec("api.routes_pleading_variants") is None
    paths = app.openapi()["paths"]
    assert not any(path == "/api/v1/variants" or path.startswith("/api/v1/variants/") for path in paths)
