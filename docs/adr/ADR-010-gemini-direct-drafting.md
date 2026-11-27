# ADR-010 — Supersede the unrecovered drafting package

## Decision

Keep `api/routes_drafting.py` as the canonical Gemini-direct drafting integration. Continue to support the existing case-scoped and legacy endpoints. Use the existing frontend Draft Template Library for template discovery. The offline synthetic-case workflow remains available through Safe Draft and Bilingual Draft Studio.

The missing drafting and registry Python sources never shipped and are superseded. Preserve the recovery record and avoid reconstructing legal logic from bytecode. A future structured drafting system requires a separate decision, source-backed requirements, and verification.

## Release scope

The Gemini-direct integration returns drafts for advocate review. It redacts the supported identifiers before calling the provider and checks returned text against the shared citation registry. Draft conflict detection, structural placeholder validation, stronger prompt-injection controls, and draft provenance remain outside this release's synthetic-demo scope. This decision neither certifies the live provider nor clears confidential-production or court-use gates.

## Evidence

The old skip-only tests are replaced by executable tests against both supported request paths with a provider double. They cover redaction, withholding a draft with a known pending citation, and generic handling of provider failures.
