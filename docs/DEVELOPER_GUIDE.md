# Legal Luminaire - Developer Guide
## Unified Indian Legal Intelligence Platform v2.0.0

Last Updated: April 29, 2026 | Status: Production-Ready (Phases 1-8 Complete)

## Quick Start

    pnpm install
    pnpm --filter @workspace/legal-luminaire run dev
    # App at http://localhost:5173/

    cd artifacts/legal-luminaire
    pnpm test              # 144 tests, all passing
    pnpm test:coverage     # with coverage report
    pnpm typecheck         # TypeScript check

## Architecture

    src/
    +-- App.tsx                    PROTECTED: main router + sidebar
    +-- main.tsx                   PROTECTED: React root
    +-- config/featureFlags.ts     30+ flags (all new features off by default)
    +-- context/
    |   +-- CaseContext.tsx        PROTECTED: localStorage + optional backend
    |   +-- AccuracyContext.tsx    PROTECTED: accuracy metrics
    +-- lib/
    |   +-- citation-gate.ts       PROTECTED: Citation Safety System
    |   +-- verification-engine.ts PROTECTED: COURT_SAFE/VERIFIED/SECONDARY/PENDING
    |   +-- case01-data.ts         PROTECTED: Hemraj case precedents
    |   +-- modules/
    |       +-- search-engine-v2/  Phase 2
    |       +-- citation-intelligence/ Phase 3
    |       +-- ai-reasoning/      Phase 4
    |       +-- analytics/         Phase 5
    |       +-- graph-visualization/ Phase 6
    +-- components/
    |   +-- CitationGatePanel.tsx  PROTECTED
    |   +-- SearchEngineV2Panel.tsx Phase 2 UI
    |   +-- CitationGraphPanel.tsx  Phase 3 UI
    |   +-- CaseSimilarityPanel.tsx Phase 4 UI
    |   +-- JudgeProfileCard.tsx    Phase 5 UI
    |   +-- CourtAnalyticsDashboard.tsx Phase 5 UI
    |   +-- CitationGraphVisualization.tsx Phase 6 UI
    +-- __tests__/
        +-- search-engine-v2.test.ts     22 tests
        +-- citation-intelligence.test.ts 34 tests
        +-- ai-reasoning.test.ts          48 tests
        +-- analytics-graph.test.ts       40 tests

## Module Reference

### Phase 2 - Search Engine V2 (src/lib/modules/search-engine-v2/)

query-expansion.ts    expandQuery(), calculateQueryComplexity(), extractIPCSections()
relevance-ranking.ts  rankResults(), scoreResult()
search-analytics.ts   trackEvent(), getMetrics()
index.ts              search()

Flags: enableAdvancedSearchV2, enableQueryExpansion, enableEnhancedRanking, enableSearchAnalytics

### Phase 3 - Citation Intelligence (src/lib/modules/citation-intelligence/)

citation-extraction.ts    extractCitations(), validateCitation(), formatCitation()
citation-graph-engine.ts  buildCitationGraph(), analyzeGraph(), computePageRank()
authority-ranking.ts      rankByAuthority(), calculateInfluenceScore()
index.ts                  runCitationIntelligence()

Flags: enableCitationExtraction, enableCitationGraph, enableAuthorityRanking

Usage:
    import { runCitationIntelligence } from "@/lib/modules/citation-intelligence";
    const result = runCitationIntelligence(judgmentText, "doc-id");
    result.summary.readyForDraft    // true/false
    result.ranking.primaryAuthorities
    result.summary.draftBlockers

### Phase 4 - AI Reasoning Layer (src/lib/modules/ai-reasoning/)

query-understanding.ts    understandQuery() - NER, issues, intent, complexity
legal-feature-extractor.ts extractCaseFeatures(), jaccardSimilarity(), termOverlap()
case-similarity-engine.ts  findSimilarCases(), scoreSimilarity(), getTierLabel()
explanation-generator.ts   generateExplanation(), generateBulkExplanations()
index.ts                   runAIReasoning()

4-Layer Scoring:
  Keyword / Term    35 pts  Key term overlap + section Jaccard
  Legal Issue       30 pts  Issue category overlap
  Citation Strength 20 pts  Log-scaled citations x court weight
  Court Relevance   15 pts  Hierarchy weight + same-court bonus

Fact-Fit Tiers (accuracy-rules.md Rule 2):
  >= 70  EXACT      Primary authority
  50-69  ANALOGOUS  Use with qualification
  30-49  WEAK       Supporting only, never primary
  < 30   REJECTED   FATAL if cited as primary

Flags: enableCaseSimilarity, enableQueryUnderstanding, enableExplanationGenerator

Usage:
    import { runAIReasoning } from "@/lib/modules/ai-reasoning";
    const result = runAIReasoning(queryText, corpusCases, { minScore: 30, maxResults: 10 });
    result.summary.topMatchTitle
    result.explanations[0].citationAdvice

### Phase 5 - Analytics Layer (src/lib/modules/analytics/)

judge-analytics.ts  buildJudgeProfile(), buildAllJudgeProfiles(), normalizeJudgeName()
court-analytics.ts  buildCourtProfile(), predictOutcome(), buildAllCourtProfiles()
index.ts            runAnalytics()

Judge Metrics: allowRate, dismissRate, bailGrantRate, bailRejectRate,
  convictionRate, acquittalRate, appealReversalRate, avgDisposalDays,
  strictnessIndex (0-100), consistencyScore (0-100)

Outcome Prediction: BAIL | APPEAL | CRIMINAL_TRIAL | GENERAL
Confidence: HIGH (>=50 cases) | MEDIUM (20-49) | LOW (<20)

Flags: enableJudgeAnalytics, enableCourtAnalytics, enableOutcomePrediction

### Phase 6 - Graph Visualization (src/lib/modules/graph-visualization/)

graph-metrics.ts  computeBetweennessCentrality(), bfsShortestPath(),
                  detectTopicClusters(), findInfluentialPath()
index.ts          buildVisualization(), serializeForVisualization(),
                  applyFilter(), buildTimeline(), NEO4J_SCHEMA

Node Visual Encoding:
  Size:    8-40px (PageRank)
  Color:   Supreme=blue, High=cyan, Sessions=green, Tribunal=violet
  Border:  Yellow=Landmark, Red=Bridge
  Opacity: 0.4-1.0 (PageRank)

Neo4j Schema (NEO4J_SCHEMA export):
  Nodes: Case, Judge, Court, Statute, Topic
  Edges: CITES, HEARD_BY, IN_COURT, REFERS_TO, HAS_TOPIC, OVERRULES, DISTINGUISHES

Flags: enableGraphVisualization, enableInteractiveGraph, enableTimelineMode,
       enableTopicClustering, enableInfluentialPath, enableNeo4jIntegration

## Feature Flags - Enable via .env.local (never commit)

Phase 2:  VITE_FF_ENABLE_ADVANCED_SEARCH_V2, VITE_FF_ENABLE_QUERY_EXPANSION,
          VITE_FF_ENABLE_ENHANCED_RANKING, VITE_FF_ENABLE_SEARCH_ANALYTICS
Phase 3:  VITE_FF_ENABLE_CITATION_EXTRACTION, VITE_FF_ENABLE_CITATION_GRAPH,
          VITE_FF_ENABLE_AUTHORITY_RANKING, VITE_FF_ENABLE_GRAPH_CROSS_REFERENCE
Phase 4:  VITE_FF_ENABLE_CASE_SIMILARITY, VITE_FF_ENABLE_MULTI_LAYER_SCORING,
          VITE_FF_ENABLE_EXPLANATION_GENERATOR, VITE_FF_ENABLE_QUERY_UNDERSTANDING
Phase 5:  VITE_FF_ENABLE_JUDGE_ANALYTICS, VITE_FF_ENABLE_COURT_ANALYTICS,
          VITE_FF_ENABLE_OUTCOME_PREDICTION, VITE_FF_ENABLE_JUDGE_PROFILES
Phase 6:  VITE_FF_ENABLE_GRAPH_VISUALIZATION, VITE_FF_ENABLE_INTERACTIVE_GRAPH,
          VITE_FF_ENABLE_TIMELINE_MODE, VITE_FF_ENABLE_TOPIC_CLUSTERING

## Protected Files - Never Break These

src/App.tsx                              Wrong version crashes without backend
src/main.tsx                             React root
src/index.css                            Global styles
src/context/CaseContext.tsx              Must fall back to localStorage
src/context/AccuracyContext.tsx          Accuracy metrics
src/lib/citation-gate.ts                 Citation Safety - Rule 6
src/components/CitationGatePanel.tsx     Gate UI
src/components/views/SafeDraftEditor.tsx WYSIWYG with gate
src/pages/SafeDraftPage.tsx              Safe draft route
src/lib/verification-engine.ts           Verification tiers
src/lib/case01-data.ts                   blockedFromDraft: true default
vite.config.ts                           No Replit env vars required

## Adding New Features - Checklist

1. Create module under src/lib/modules/<name>/
2. Add feature flag to src/config/featureFlags.ts
3. Guard all logic: if (!featureFlags.yourFlag) return defaultValue
4. Add route to App.tsx only - never replace the whole file
5. Write tests in src/__tests__/
6. Run pnpm test - all 144 must still pass
7. Update CHANGELOG.md
8. Commit with descriptive message

## Rollback Procedures

30 seconds - disable via feature flag:
    VITE_FF_ENABLE_CITATION_GRAPH=false pnpm dev

5 minutes - git revert:
    git -C artifacts/legal-luminaire log --oneline -10
    git -C artifacts/legal-luminaire revert <hash>

15 minutes - full restore:
    git -C artifacts/legal-luminaire checkout main
    pnpm --filter @workspace/legal-luminaire run dev

Full procedures: docs/ROLLBACK_PLAN.md
