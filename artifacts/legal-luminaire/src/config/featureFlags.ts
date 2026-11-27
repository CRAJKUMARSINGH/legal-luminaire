const env = import.meta.env;

function isEnabled(value: unknown, defaultValue = false): boolean {
  if (typeof value !== "string") return defaultValue;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

export const featureFlags = {
  // === EXISTING HYBRID FEATURES (Wave 1 & 2) ===
  hybridStandardsValidity: isEnabled(env.VITE_FF_HYBRID_STANDARDS_VALIDITY, true),
  hybridSessionWorkspace: isEnabled(env.VITE_FF_HYBRID_SESSION_WORKSPACE, true),
  hybridDraftViewer: isEnabled(env.VITE_FF_HYBRID_DRAFT_VIEWER, true),
  hybridDraftStreaming: isEnabled(env.VITE_FF_HYBRID_DRAFT_STREAMING, true),
  /** REFERENCE-APP00 quick case dialog (wired to CaseContext, not the reference stub) */
  referenceQuickCaseDialog: isEnabled(env.VITE_FF_REFERENCE_QUICK_CASE_DIALOG, true),

  // === SEARCH ENGINE V2 (Phase 2) ===
  /** Enhanced search with improved relevance ranking from Legal-Luminary-Search */
  enableAdvancedSearchV2: isEnabled(env.VITE_FF_ENABLE_ADVANCED_SEARCH_V2, false),
  /** Legal query expansion and terminology mapping */
  enableQueryExpansion: isEnabled(env.VITE_FF_ENABLE_QUERY_EXPANSION, false),
  /** Multi-factor relevance ranking (semantic + legal + citation) */
  enableEnhancedRanking: isEnabled(env.VITE_FF_ENABLE_ENHANCED_RANKING, false),
  /** Search analytics and performance tracking */
  enableSearchAnalytics: isEnabled(env.VITE_FF_ENABLE_SEARCH_ANALYTICS, false),

  // === CITATION INTELLIGENCE (Phase 3) ===
  /** Interactive citation graph visualization */
  enableCitationGraph: isEnabled(env.VITE_FF_ENABLE_CITATION_GRAPH, false),
  /** Advanced citation extraction from judgments */
  enableCitationExtraction: isEnabled(env.VITE_FF_ENABLE_CITATION_EXTRACTION, false),
  /** PageRank-style authority ranking for precedents */
  enableAuthorityRanking: isEnabled(env.VITE_FF_ENABLE_AUTHORITY_RANKING, false),
  /** Enhanced cross-reference matrix with graph view */
  enableGraphCrossReference: isEnabled(env.VITE_FF_ENABLE_GRAPH_CROSS_REFERENCE, false),

  // === AI REASONING LAYER (Phase 4) ===
  /** Multi-layer case similarity engine */
  enableCaseSimilarity: isEnabled(env.VITE_FF_ENABLE_CASE_SIMILARITY, false),
  /** 4-layer scoring: semantic + legal issue + citation + court */
  enableMultiLayerScoring: isEnabled(env.VITE_FF_ENABLE_MULTI_LAYER_SCORING, false),
  /** AI-powered explanation generator for case relevance */
  enableExplanationGenerator: isEnabled(env.VITE_FF_ENABLE_EXPLANATION_GENERATOR, false),
  /** Legal NER and query understanding */
  enableQueryUnderstanding: isEnabled(env.VITE_FF_ENABLE_QUERY_UNDERSTANDING, false),

  // === ANALYTICS LAYER (Phase 5) ===
  /** Judge-wise decision pattern analytics */
  enableJudgeAnalytics: isEnabled(env.VITE_FF_ENABLE_JUDGE_ANALYTICS, false),
  /** Court-wise performance and trend analytics */
  enableCourtAnalytics: isEnabled(env.VITE_FF_ENABLE_COURT_ANALYTICS, false),
  /** Outcome prediction based on historical patterns */
  enableOutcomePrediction: isEnabled(env.VITE_FF_ENABLE_OUTCOME_PREDICTION, false),
  /** Judge profile cards with decision metrics */
  enableJudgeProfiles: isEnabled(env.VITE_FF_ENABLE_JUDGE_PROFILES, false),
  /** Court heatmaps and comparative analysis */
  enableCourtHeatmaps: isEnabled(env.VITE_FF_ENABLE_COURT_HEATMAPS, false),

  // === GRAPH VISUALIZATION (Phase 6) ===
  /** Interactive citation graph with D3.js/Cytoscape */
  enableGraphVisualization: isEnabled(env.VITE_FF_ENABLE_GRAPH_VISUALIZATION, false),
  /** Interactive graph features (zoom, pan, filter) */
  enableInteractiveGraph: isEnabled(env.VITE_FF_ENABLE_INTERACTIVE_GRAPH, false),
  /** Timeline mode for citation evolution */
  enableTimelineMode: isEnabled(env.VITE_FF_ENABLE_TIMELINE_MODE, false),
  /** Topic clustering and community detection */
  enableTopicClustering: isEnabled(env.VITE_FF_ENABLE_TOPIC_CLUSTERING, false),
  /** Most influential path finder */
  enableInfluentialPath: isEnabled(env.VITE_FF_ENABLE_INFLUENTIAL_PATH, false),

  // === ADVANCED FEATURES (Future) ===
  /** Neo4j graph database integration */
  enableNeo4jIntegration: isEnabled(env.VITE_FF_ENABLE_NEO4J_INTEGRATION, false),
  /** Real-time collaboration features */
  enableCollaboration: isEnabled(env.VITE_FF_ENABLE_COLLABORATION, false),
  /** Vector database for semantic search (FAISS/Pinecone) */
  enableVectorSearch: isEnabled(env.VITE_FF_ENABLE_VECTOR_SEARCH, false),

  // === WEEK 10: CHRONOLOGY STUDIO & DEADLINE BOARD ===
  /** Chronology Studio - source-cited timeline generation */
  enableChronologyStudio: isEnabled(env.VITE_FF_ENABLE_CHRONOLOGY_STUDIO, true),
  /** Deadline Board - kanban-style deadline tracking */
  enableDeadlineBoard: isEnabled(env.VITE_FF_ENABLE_DEADLINE_BOARD, true),
  /** Month Calendar - calendar view for deadlines */
  enableMonthCalendar: isEnabled(env.VITE_FF_ENABLE_MONTH_CALENDAR, true),

  // === WEEK 12: ACCURACY ACADEMY ===
  /** Accuracy Academy - branching walkthrough + trade-off meters */
  accuracyAcademy: isEnabled(env.VITE_FF_ACCURACY_ACADEMY, true),
  accuracy_academy: isEnabled(env.VITE_FF_ACCURACY_ACADEMY, true),

  // === PLEADING CHAIN ENGINE (blocked — P2-02) ===
  /**
   * Pleading Chain Engine — OFF by default. The variant registry
   * (`subject_variants.json`) is a documented open data gap
   * (docs/blockers/P2-02-PLEADING-VARIANTS.md); the route is dead-ended
   * until that data contract exists. Do not stub the registry with invented data.
   */
  pleadingChain: isEnabled(env.VITE_FF_PLEADING_CHAIN, false),
} as const;

/**
 * Type of the featureFlags object.
 * Import as `FeatureFlags` wherever you need to type a flags parameter
 * or extend the flags shape in tests.
 */
export type FeatureFlags = typeof featureFlags;
