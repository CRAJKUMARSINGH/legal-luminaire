"""Advocate-grade matter drafting generation layer."""

from drafting.catalog import (
    DOCUMENT_STAGES,
    TEMPLATES,
    get_template,
    list_templates,
    resolve_legacy_draft_type,
)
from drafting.engine import (
    DraftGenerationSpec,
    GenerationBundle,
    build_generation_bundle,
    render_skeleton,
)

__all__ = [
    "DOCUMENT_STAGES",
    "TEMPLATES",
    "DraftGenerationSpec",
    "GenerationBundle",
    "build_generation_bundle",
    "get_template",
    "list_templates",
    "render_skeleton",
    "resolve_legacy_draft_type",
]
