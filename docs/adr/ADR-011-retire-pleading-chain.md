# ADR-011 — Retire the unreleased Pleading Chain

## Decision

Retire Pleading Chain. The registry was never committed, the API router was never registered, and Draft Family already leads to Safe Draft. A supported release would require a source-backed registry and a case-scoped API. The existing drafting workflow can serve users while that work stays off the release path.

Remove the dormant router, registry-dependent engine, and client request code. Preserve existing case-scoped bookmarks with a bilingual retirement message and a link to Safe Draft for the same case.

## Verification

The API regression checks that the router is absent and the OpenAPI schema exposes no variants routes. The offline browser check visits the legacy URL, checks that it makes no variants API requests, and follows the Safe Draft link. The same browser run checks that pending citations still block Safe Draft printing and bilingual downloads.

Any future replacement requires independently verified source data, explicit case authorization, and a tested citation gate before the API is exposed.
