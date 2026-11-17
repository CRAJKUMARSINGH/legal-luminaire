# Legal Source Closure — 11 Outstanding Items

Source of truth: `final-deliverables/LEGAL_SOURCE_REVIEW.md`.

**Status: BLOCKED — external dependency, not a software defect.**

The 11 items require certified authoritative source documents (court
records, standards texts) and qualified advocate review. Neither can be
produced by code. Software-side gates already enforced:

- Citation registry is server-side, fail-closed (verified:
  `CITATION_EXPORT_REGRESSION.md`)
- PENDING/unknown/fabricated citations blocked at export
- No client-submitted status is authoritative

Outstanding human actions per item: obtain certified copy → record
metadata (court, ID, date, hash, verifier) → advocate approves tier →
registry promotion with audit trail. Court-use export stays disabled
until all 11 closed.
