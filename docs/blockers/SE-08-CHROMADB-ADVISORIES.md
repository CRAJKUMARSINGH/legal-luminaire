# SE-08 — chromadb Vulnerability Exception Lifecycle
**Priority:** P1  
**Status:** OPEN — 4 advisories active; all assessed as UNREACHABLE in current deployment  
**Opened:** Pre-2026-11  
**Owner:** Backend engineering  
**Reference:** `audit-results/SE08_CHROMADB_ADVISORY_REGISTER.md`,
`final-deliverables/SECURITY_EXCEPTIONS.md`

---

## Current state

Installed: `chromadb==1.5.9` (latest published as of 2026-11-17 — no patched version exists).

| Advisory | CVE | Severity | Vulnerable surface | Reachability verdict |
|---|---|---|---|---|
| PYSEC-2026-311 | CVE-2026-45829 | Critical | `/api/v2/tenants/` + `trust_remote_code` | **UNREACHABLE** |
| PYSEC-2026-3813 | CVE-2026-45830 | High | Cross-tenant collection read/write | **UNREACHABLE** |
| PYSEC-2026-3814 | CVE-2026-45833 | Critical | Collection update + `trust_remote_code` | **UNREACHABLE** |
| PYSEC-2026-3815 | CVE-2026-45831 | High | `SimpleRBACAuthorizationProvider` scoping | **UNREACHABLE** |

**Why unreachable:** The backend uses `langchain_community.vectorstores.Chroma`
with `persist_directory` only — this invokes the embedded `PersistentClient`.
No `HttpClient`, `chromadb serve`, `SimpleRBAC`, or `trust_remote_code` is
present anywhere in the codebase.

**Current CI control:** `pip-audit` runs in CI with per-advisory
`--ignore-vuln PYSEC-2026-311,PYSEC-2026-3813,PYSEC-2026-3814,PYSEC-2026-3815`
(narrowest possible scope — no whole-package or whole-scan suppression).

---

## Exception record

| Field | Value |
|---|---|
| Advisory IDs | PYSEC-2026-311, -3813, -3814, -3815 |
| Installed version | chromadb==1.5.9 |
| Fix availability | None as of 2026-11-17 |
| Exploitability | Vulnerable code paths (HttpClient, trust_remote_code) not present |
| Compensating control | Embedded client only; no Chroma server endpoint exposed |
| Owner | Backend engineering lead |
| Review trigger | Any new chromadb release; any PR introducing HttpClient or trust_remote_code |
| Exception void condition | Any deployment using `chromadb serve`, `HttpClient`, `SimpleRBAC`, or `trust_remote_code` |
| Exception expiry | Reviewed at each release; hard expiry if fix ships or architecture changes |

---

## Acceptance criteria

SE-08 is resolved when **one** of the following is true:

### A — Patched version available and tested

1. A `chromadb` release ships that fixes all 4 CVEs (verify with `pip-audit --no-deps chromadb==<version>`).
2. The patched version is tested in an isolated branch: RAG ingestion, retrieval, persistence, migration, and performance all pass.
3. `--ignore-vuln` flags removed from CI `pip-audit` invocation.
4. `audit-results/SE08_CHROMADB_ADVISORY_REGISTER.md` updated with resolution date and version.

### B — Architecture change eliminates the dependency

1. If `chromadb` is replaced by another vector store, verify the replacement has no equivalent advisories.
2. Remove `chromadb` from `requirements.txt`; remove `--ignore-vuln` flags.
3. Update register with resolution date.

### C — New advisory requiring reassessment

If a new `chromadb` advisory is published:
1. Within 5 business days: assess whether the vulnerable code path is reachable.
2. If reachable: escalate to P0, block deployment, document in register.
3. If unreachable: add advisory ID to `--ignore-vuln` flags with justification. Do not silently extend the existing ignore list.

---

## What must NOT happen

- Do not suppress the entire `pip-audit` scan (`--ignore-service` or `--skip`).
- Do not add all findings for `chromadb` to the ignore list (`--ignore-vuln chromadb`).
- Do not introduce `HttpClient`, `chromadb serve`, `SimpleRBAC`, or `trust_remote_code`
  without first reassessing all 4 CVEs and updating this register.
- Do not promote the exception to production if the exception void condition is triggered.

---

## Monitoring cadence

- Check `pip index versions chromadb` at each release.
- Run `pip-audit` in CI on every PR that modifies `requirements.txt`.
- Review this register at each release gate review.
