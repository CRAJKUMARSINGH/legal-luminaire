# WHY LEGAL LUMINAIRE WINS
**Version**: v2.3.0-competition | September 2026  
**For**: vibecode.law / Emergent Builder Competition submission

---

## One-Line Pitch

> **"The only Indian legal AI that hard-blocks unverified citations at source — accuracy-gated, bilingual, local-first, court-ready."**

---

## The Problem Every Indian Advocate Faces

Every other legal AI tool (Manupatra AI, SCC Online AI, Harvey AI, LexisNexis AI) generates
court documents that *look* accurate. They cite real case names. They quote plausible
holdings. They apply standards.

But when the advocate files that document, the judge notices:
- The cited paragraph doesn't say what the AI claimed.
- The IS standard cited governs fresh concrete, not the hardened masonry mortar at issue.
- The SC case from 2025 is real — but the quote is paraphrased, not verbatim.

One fabricated citation in a Supreme Court filing ends a career.

---

## What Legal Luminaire Does Differently

| Feature | Every Other AI | Legal Luminaire |
|---------|---------------|-----------------|
| Unverified citation in draft | ⚠ Flagged after generation | ⛔ Hard-blocked before generation |
| Paragraph number | Invented | Only cited if confirmed from certified copy |
| IS standard applicability | Generic clause lookup | IS 1199:2018 ≠ IS 2250:1981 enforced at engine level |
| Fact-Fit Gate | None | 3-axis scoring: incident / evidence / procedural defect |
| Hindi drafts | Translation layer | Native bilingual — chaste Rajasthan HC legal Hindi |
| Local-first | Cloud-only | Runs on Netlify static with zero API key for demo |
| Infrastructure arbitration | None | 5 full-lifecycle cases (TC-22..TC-26), ₹351 Cr claims |

---

## The Technical Moat (Hard to Copy)

1. **Citation Gate** (`citation-gate.ts`) — real-time SAFE / WARN / BLOCKED verdict on
   every word typed in the draft editor. PENDING citations are hard-blocked, not just
   warned. This is enforced in TypeScript, Python backend, and the CI pipeline.

2. **Verification Engine** (`verification-engine.ts`) — 5-tier accuracy system
   (COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR). Every precedent carries
   `reporter`, `volume`, `page`, `para`, `verifiedBy` — structured fields, not free text.

3. **Fact-Fit Gate** — scores every precedent on 3 axes (incident match 0–40,
   evidence match 0–35, procedural defect match 0–25). Score < 30 → FATAL_ERROR.
   Prevents "analogous" cases being cited as primary authority.

4. **IS Standard Engine** — IS 1199:2018 (fresh concrete) vs IS 2250:1981 (masonry mortar)
   vs ASTM C1324 (hardened masonry forensics) enforced at data level, not just UI labels.

---

## Practice Areas Covered

Criminal Defence · Bail Applications · Discharge Applications · Infrastructure Arbitration ·
Consumer Forums · Service Writs · Land Acquisition · Family Law · Commercial Recovery ·
Conveyancing · IP / Technology · Labour / Employment · Tax / Regulatory

---

## Numbers

- **26 demo cases** pre-loaded (TC-01 through TC-26)
- **51 intake training examples** (EX-001 through EX-051)
- **9 precedents** in verification registry, 4 COURT_SAFE
- **343 Vitest tests** — all passing
- **33 legacy route redirects** — zero flash, CDN-edge resolution
- **5 infrastructure arbitration cases** — ₹351.85 Cr total contract value
- **< 5 minutes** — judge-to-demo-complete time

---

## Why This Wins

Judges evaluate legal AI on one criterion: **would a real advocate trust this in court?**

Legal Luminaire is the only submission where the answer is demonstrably **yes** — because
the system itself refuses to generate a document it cannot defend. The citation gate is
not a feature. It is the product.

*Legal Luminaire — Stop researching. Start winning. Accuracy first. Always.*
