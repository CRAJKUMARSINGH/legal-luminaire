# Legal Luminaire launch baseline

Verification on 2026-11-25 used the launch-hardening branch. The detailed [launch hardening report](LAUNCH_HARDENING_REPORT.md) records the earlier clean-checkout gate and the release blockers.

- The frontend suite passed 388 tests. The production frontend built successfully with a 614.14 kB minified entry bundle and reported a bundle-size warning.
- Backend pytest passed 207 tests and skipped 5 using a temporary compatible Pydantic and FastAPI environment. The copied virtual environments reference Python installations absent from this host.
- Ruff passed the launch lint selections. Headless Chrome passed the TC-01 offline workflow, blocked Safe Draft printing and bilingual download when required, allowed bilingual download after verification cleared, and exercised Draft Variants.
- The active release restrictions are documented in the [launch report](LAUNCH_HARDENING_REPORT.md). Confidential production and court-use decisions still require their respective approvals and evidence.
