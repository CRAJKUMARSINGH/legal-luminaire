# Recovery board

Update this file at end-of-day close. Buckets: `broken now` · `risky but working` · `duplicate/inconsistent` · `unknown/unowned` · `approved exception`.

| Title | Bucket | Module | Owner | Severity | Why it matters | Next action | Due |
|-------|--------|--------|-------|----------|----------------|-------------|-----|
| GitHub required checks not set on `main` | unknown/unowned | CI | G-1 interim | high | CI can be ignored without branch protection | Mark frontend + backend jobs required | Day 15+ |
| Release / data / auth / infra owners still interim | unknown/unowned | org | Recovery Lead | high | No durable review accountability | Name people or keep interim explicit | Day 5 / Day 30 |
| Express `api-server` still in tree | duplicate/inconsistent | backends | Architecture Owner | med | Dual-backend confusion | Keep quarantined (ADR-009); no new features | EXC-1 review |
| Three search implementations | duplicate/inconsistent | search | Frontend + G-2 | med | Same problem, three clients | Do not add a fourth; ADR later | next 30d |
| Two case persistence shapes | duplicate/inconsistent | CaseContext | Frontend | med | Hydration races | Adapter only; no third store | EXC-4 |
| No staging environment | risky but working | infra | G-4 | med | Prod is the only shared env | Design only this month | EXC-5 |
| Variant/copilot pytest not in CI | risky but working | backend tests | Backend | med | High-risk routes untested in gate | Fix tests then add job | Day 30 |
| `LL_REQUIRE_LLM_KEYS` defaults false | approved exception | config | G-3 | med | Missing keys fail late unless prod sets true | Set true on hosted FastAPI | EXC-LLM-KEYS |

Empty `broken now` = no known production outage. Add a row before any hotfix.
