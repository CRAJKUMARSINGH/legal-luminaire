# SE-08 — chromadb Advisory Register

Installed: `chromadb==1.5.9` (latest published; `pip index versions` verified 2026-11-17 — no fix exists).

| Advisory | CVE | Severity | Surface | Reachability |
|---|---|---|---|---|
| PYSEC-2026-311 | CVE-2026-45829 | Critical | `/api/v2/tenants/...` collection create + `trust_remote_code` | UNREACHABLE — no server |
| PYSEC-2026-3813 | CVE-2026-45830 | High | Cross-tenant collection read/write (auth'd) | UNREACHABLE — no server/RBAC |
| PYSEC-2026-3814 | CVE-2026-45833 | Critical | Collection update + `trust_remote_code` | UNREACHABLE |
| PYSEC-2026-3815 | CVE-2026-45831 | High | SimpleRBACAuthorizationProvider scoping | UNREACHABLE — provider unused |

Verified: backend uses `langchain_community.vectorstores.Chroma` with
`persist_directory` → embedded PersistentClient. No `HttpClient`,
`SimpleRBAC`, `trust_remote_code`, or `chromadb serve` anywhere in code.

Controls: `pip-audit` stays enabled in CI with narrow per-advisory
`--ignore-vuln` flags; exception documented in
`final-deliverables/SECURITY_EXCEPTIONS.md` (SE-08, severity LOW).
Owner: backend dev. Review: each release / when chromadb >1.5.9 ships.
Expiration: any deployment introducing Chroma server mode or
`trust_remote_code` → exception void, CVEs become CRITICAL.
