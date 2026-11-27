# Citation Deep-Link — Requirements
**Status**: ACTIVE — promoted 2026-11-27 (`Legal kiro 26.txt` C1; see docs/DOCUMENTATION_INDEX.md §3)
**Flag**: `citation_deeplink` (default OFF)
**Week**: 7 (Trae primary)
**Source**: Vyaas Docket — every citation links to its source document

## Scope
Every citation produced by Ask Copilot, the research engine, or the verification panel renders as a clickable deep-link that opens the source document at the relevant page/paragraph. No citation is an orphan.

## Data Model
- `CitationDeepLink`: `{ citation_id: string, document_id: string, page?: number, paragraph?: string, url: string }`

## API Contract
- `GET /api/v1/citations/:id/deeplink` — response: `{ url, document_id, page, paragraph }`

## Accuracy Guardrails
- Deep-links must resolve to real indexed documents in the case book.
- A citation whose source document is not indexed must display a "source not available" state — never a broken link.
- Dead links are logged for review.

## Bilingual Requirement
"Source not available" states bilingual. Link tooltips bilingual.

## Flag
`citation_deeplink` — OFF by default. Enable via `VITE_FF_CITATION_DEEPLINK=true`.

## Rollback
Disable flag; citations render as plain text. No data loss.

## Acceptance Criteria
- [ ] Every citation in Ask Copilot panel is a deep-link when flag ON
- [ ] Unresolvable citations display bilingual "source not available"
- [ ] No broken hrefs (href="#" or empty) committed
