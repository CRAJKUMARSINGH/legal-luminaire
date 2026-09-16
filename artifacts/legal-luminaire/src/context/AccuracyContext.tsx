import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCaseContext } from '@/context/CaseContext';

export interface AccuracyMetrics {
  legalCitations: number;
  technicalStandards: number;
  factualClaims: number;
  proceduralReferences: number;
  overallScore: number;
}

/** Accuracy level band — derived from overallScore in AccuracyProvider */
export type AccuracyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AccuracyContextType {
  metrics: AccuracyMetrics;
  updateMetric: (metric: keyof AccuracyMetrics, value: number) => void;
  verifyAccuracy: () => boolean;
  resetMetrics: () => void;
  accuracyLevel: AccuracyLevel;
}

const AccuracyContext = createContext<AccuracyContextType | undefined>(undefined);

export function AccuracyProvider({ children }: { children: ReactNode }) {
  const { selectedCase } = useCaseContext();
  const [metrics, setMetrics] = useState<AccuracyMetrics>({
    legalCitations: 8.8,
    technicalStandards: 9.0,
    factualClaims: 8.5,
    proceduralReferences: 8.8,
    overallScore: 8.775,
  });

  // Dynamically synchronize metrics when selectedCase changes
  useEffect(() => {
    if (selectedCase) {
      const caseLaw = selectedCase.caseLaw || [];
      const verifiedCitations = caseLaw.filter(c => c.status === "VERIFIED").length;
      const citationScore = caseLaw.length > 0 
        ? Math.min(10, Math.max(7.0, (verifiedCitations / caseLaw.length) * 10 + 6.0))
        : 8.5;
      
      const standardsScore = (selectedCase.standards?.length || 0) > 0 ? 9.2 : 8.0;
      const factualScore = (selectedCase.documents?.length || 0) > 0 ? 8.6 : 7.8;
      const proceduralScore = (selectedCase.timeline?.length || 0) > 0 ? 8.8 : 8.0;

      const overall = (citationScore + standardsScore + factualScore + proceduralScore) / 4;
      setMetrics({
        legalCitations: Number(citationScore.toFixed(1)),
        technicalStandards: Number(standardsScore.toFixed(1)),
        factualClaims: Number(factualScore.toFixed(1)),
        proceduralReferences: Number(proceduralScore.toFixed(1)),
        overallScore: Number(overall.toFixed(1)),
      });
    }
  }, [selectedCase]);

  const updateMetric = (metric: keyof AccuracyMetrics, value: number) => {
    setMetrics(prev => {
      const newMetrics = { ...prev, [metric]: value };
      // Sum only the four named sub-metrics, never overallScore itself
      const overall = (
        newMetrics.legalCitations +
        newMetrics.technicalStandards +
        newMetrics.factualClaims +
        newMetrics.proceduralReferences
      ) / 4;
      return { ...newMetrics, overallScore: Number(overall.toFixed(1)) };
    });
  };

  const verifyAccuracy = (): boolean => {
    return metrics.overallScore >= 9.5; // 10/10 requirement
  };

  const resetMetrics = () => {
    setMetrics({
      legalCitations: 8.8,
      technicalStandards: 9.0,
      factualClaims: 8.5,
      proceduralReferences: 8.8,
      overallScore: 8.775,
    });
  };

  const accuracyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 
    metrics.overallScore >= 9.5 ? 'CRITICAL' :
    metrics.overallScore >= 8.0 ? 'HIGH' :
    metrics.overallScore >= 6.0 ? 'MEDIUM' : 'LOW';

  return (
    <AccuracyContext.Provider value={{
      metrics,
      updateMetric,
      verifyAccuracy,
      resetMetrics,
      accuracyLevel,
    }}>
      {children}
    </AccuracyContext.Provider>
  );
}

export function useAccuracyContext() {
  const context = useContext(AccuracyContext);
  if (context === undefined) {
    throw new Error('useAccuracyContext must be used within an AccuracyProvider');
  }
  return context;
}
