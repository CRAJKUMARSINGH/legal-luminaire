# Ownership by boundary

Parallel work is safe only when each change names one of these boundaries.

| Boundary | Owns | Canonical paths |
|----------|------|-----------------|
| Frontend shell and routing | SPA layout, `routes.tsx`, pages, Vite | `artifacts/legal-luminaire/src` |
| Backend API contracts | FastAPI routes, schemas, env | `artifacts/legal-luminaire/backend` |
| Shared types and validation | Workspace packages imported by the SPA | `lib/` |
| Repo governance and CI | pnpm workspace, workflows, governance scripts, ADRs | `package.json`, `pnpm-workspace.yaml`, `.github/`, `scripts/`, `docs/adr/` |
| Content, demos, docs | Fixtures, manuals, marketing copy | `docs/`, `sample_cases/`, `test-assets/`, `real_cases/` |

Every major feature must name: owning module, API endpoints touched, tests added. See [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md).
