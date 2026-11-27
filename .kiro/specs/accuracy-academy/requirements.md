# Accuracy Academy — Requirements
**Status**: ACTIVE — promoted 2026-11-27 (`Legal kiro 26.txt` C1; see docs/DOCUMENTATION_INDEX.md §3)
**Flag**: `accuracy_academy` (default OFF)
**Week**: 12 (Antigravity primary)
**Source**: vibecode-submit skill — branching walkthrough + trade-off meters

## Scope
An interactive educational walkthrough that teaches users how to evaluate AI-generated legal content critically. Uses branching scenarios based on real-looking synthetic cases. Each scenario presents an AI output and asks the user to identify errors, hallucinations, or missing citations. Trade-off meters show accuracy vs. speed vs. completeness for different AI modes.

## Data Model
- `AcademyScenario`: `{ id, title, titleHi, prompt, aiOutput, correctErrors: string[], explanation, explanationHi, tradeOffMetrics: { accuracy, speed, completeness } }`
- `UserAttempt`: `{ scenarioId, userId, selectedErrors: string[], score, completedAt }`

## API Contract
- `GET  /api/v1/academy/scenarios` — list all scenarios
- `GET  /api/v1/academy/scenarios/:id` — single scenario
- `POST /api/v1/academy/attempts` — submit attempt; response: `{ score, feedback, correctErrors }`

## Accuracy Guardrails
- Scenario AI outputs must contain deliberate, documented errors — never accidentally accurate fabrications.
- Correct-answer sets are human-authored, not AI-generated.
- No real case names, court numbers, or real-world data in scenarios.
- Trade-off meters display honest ranges, not marketing claims.

## Bilingual Requirement
All scenario titles, explanations, feedback, and UI strings bilingual (English + Hindi).

## Flag
`accuracy_academy` — OFF by default. Enable via `VITE_FF_ACCURACY_ACADEMY=true`.

## Rollback
Disable flag. User attempt history preserved in data layer.

## Acceptance Criteria
- [ ] At least 5 scenarios covering: hallucinated citation, wrong date, missing section, invented order, overconfident summary
- [ ] Branching paths: different feedback based on user selections
- [ ] Trade-off meters display on each scenario
- [ ] All text bilingual
- [ ] No real case data anywhere in scenario content
