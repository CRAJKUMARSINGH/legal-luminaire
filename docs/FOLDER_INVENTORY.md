# Folder inventory — keep / experiment / archive

Canonical product (ADR-009): **one web app** at `artifacts/legal-luminaire` and **one FastAPI** at `artifacts/legal-luminaire/backend`.

Physical moves of the live app (`apps/…`, `services/…`) wait until CI and deploy configs are retargeted. Historical trees stay in place until they are copied into `archive/` first.

| Path | Decision | Owner boundary | One-line purpose |
|------|----------|----------------|------------------|
| `artifacts/legal-luminaire` | **Keep** (canonical frontend) | Frontend shell + routing | Production SPA |
| `artifacts/legal-luminaire/backend` | **Keep** (canonical API) | Backend API contracts | FastAPI product API |
| `lib/` | **Keep** if imported by the SPA | Shared types / validation | Workspace libraries used by the product |
| `docs/` | **Keep** | Docs consistency | Canonical documentation (`docs/adr` = architecture) |
| `scripts/` | **Keep** | Repo governance + CI | Root tooling and governance checks |
| `.github/` | **Keep** | Repo governance + CI | Workflows |
| `test-assets/` | **Keep** | Content / demos | Synthetic reusable test templates |
| `sample_cases/` | **Keep** (later `content/` or `case-assets/`) | Content / demos | Product demo case fixtures |
| `real_cases/` | **Keep in repo only if needed** (later `content/`) | Content / demos | Named case packs; treat as demo/reference, not a second app |
| `archive/` | **Keep** (bucket) | Governance | Destination + index for historical outputs |
| `experiments/` | **Keep** (bucket) | Governance | Index for prototypes not on the production path |
| `artifacts/api-server` | **Experiment** (quarantined in place) | Frozen | Express API — not production |
| `artifacts/mockup-sandbox` | **Experiment** (in place) | Frozen | UI sandbox |
| `ETERNAL_RESEARCH_CHILD` | **Experiment** (in place) | Frozen | Lab / daemon, not product runtime |
| `SUPPLEMENT/` | **Archive (read-only)** | Frozen | Agent snapshots, patches, task log — see `SUPPLEMENT/ARCHIVED.md` |
| `Attached_Assets/` | **Archive** (in place) | Frozen | Reference documents |
| `output_100426/` | **Archive** (in place) | Frozen | One-off generated filings |
| `OPERATION PROJECT TEST/` | **Archive** (in place) | Frozen | Tester corpora; not runtime |
| `.trae/` | **Auxiliary** | Governance | Agent recovery/specs — not runtime |
| `.kiro/` | **Auxiliary** | Governance | Feature specs (`requirements.md` / `design.md` / `tasks.md`) |
| `faq/`, `logo-ideas/` | **Archive-ish** | Docs / marketing | Ancillary assets |

Do not add product features under experiment or archive paths. Do not delete those trees until they exist under `archive/` (or an external backup).
