/**
 * Verification Dashboard Component
 * Real-time verification status, confidence meters, and cross-reference matrix display
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Clock, FileText, Database, Shield } from 'lucide-react';

interface CitationVerification {
  citation: string;
  consensus_confidence: number;
  verified_count: number;
  total_count: number;
  divergent_holdings: boolean;
  verifications: Array<{
    source: string;
    verified: boolean;
    confidence: number;
    case_name: string;
    holding: string;
    source_url: string;
  }>;
  final_verdict: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

interface HallucinationReport {
  verdict: string;
  hallucination_score: number;
  ungrounded: string[];
  citation_verifications?: CitationVerification[];
}

interface VerificationDashboardProps {
  hallucinationReport: HallucinationReport;
  citationVerifications?: CitationVerification[];
  isLoading?: boolean;
}

export function VerificationDashboard({
  hallucinationReport,
  citationVerifications = [],
  isLoading = false,
}: VerificationDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'citations' | 'standards'>('overview');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 animate-spin" />
            <span>Running verification checks...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallVerdict = hallucinationReport.verdict === 'SAFE' ? 'VERIFIED' : 
                        hallucinationReport.verdict === 'BLOCKED' ? 'REJECTED' : 'PENDING';
  const overallConfidence = 1 - hallucinationReport.hallucination_score;

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification Status
            </span>
            <Badge variant={overallVerdict === 'VERIFIED' ? 'default' : 
                         overallVerdict === 'REJECTED' ? 'destructive' : 'secondary'}>
              {overallVerdict}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Confidence Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Confidence</span>
              <span className="font-medium">{(overallConfidence * 100).toFixed(1)}%</span>
            </div>
            <Progress value={overallConfidence * 100} className="h-2" />
          </div>

          {/* Hallucination Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Hallucination Risk</span>
              <span className="font-medium">{(hallucinationReport.hallucination_score * 100).toFixed(1)}%</span>
            </div>
            <Progress 
              value={hallucinationReport.hallucination_score * 100} 
              className="h-2"
              indicatorClassName="bg-orange-500"
            />
          </div>

          {/* Status Alert */}
          {overallVerdict === 'REJECTED' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Output blocked due to high hallucination risk. Ungrounded items detected.
              </AlertDescription>
            </Alert>
          )}

          {overallVerdict === 'PENDING' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Manual review recommended. Some citations require verification.
              </AlertDescription>
            </Alert>
          )}

          {overallVerdict === 'VERIFIED' && (
            <Alert className="border-green-500">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                All citations verified and grounded in uploaded documents.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'overview' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('citations')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'citations' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Citations ({citationVerifications.length})
        </button>
        <button
          onClick={() => setActiveTab('standards')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'standards' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Standards
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Ungrounded Items */}
          {hallucinationReport.ungrounded.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Ungrounded Items ({hallucinationReport.ungrounded.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {hallucinationReport.ungrounded.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Verification Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                Verification Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {citationVerifications.filter(c => c.final_verdict === 'VERIFIED').length}
                  </div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {citationVerifications.filter(c => c.final_verdict === 'PENDING').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {citationVerifications.filter(c => c.final_verdict === 'REJECTED').length}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'citations' && (
        <div className="space-y-4">
          {citationVerifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No citations to verify
              </CardContent>
            </Card>
          ) : (
            citationVerifications.map((verification, index) => (
              <CitationCard key={index} verification={verification} />
            ))
          )}
        </div>
      )}

      {activeTab === 'standards' && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Standards verification module</p>
            <p className="text-sm mt-2">IS/ASTM clause checking coming soon</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CitationCard({ verification }: { verification: CitationVerification }) {
  const getStatusColor = (verdict: string) => {
    switch (verdict) {
      case 'VERIFIED': return 'text-green-600';
      case 'PENDING': return 'text-orange-600';
      case 'REJECTED': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (verdict: string) => {
    switch (verdict) {
      case 'VERIFIED': return <CheckCircle className="h-4 w-4" />;
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{verification.citation}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={verification.final_verdict === 'VERIFIED' ? 'default' : 
                           verification.final_verdict === 'REJECTED' ? 'destructive' : 'secondary'}>
                {verification.final_verdict}
              </Badge>
              {verification.divergent_holdings && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Divergent Holdings
                </Badge>
              )}
            </div>
          </div>
          <div className={`flex items-center gap-1 ${getStatusColor(verification.final_verdict)}`}>
            {getStatusIcon(verification.final_verdict)}
            <span className="text-sm font-medium">
              {(verification.consensus_confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Database Consensus */}
        <div>
          <div className="text-sm text-gray-600 mb-2">
            Database Consensus: {verification.verified_count}/{verification.total_count}
          </div>
          <Progress value={(verification.verified_count / verification.total_count) * 100} className="h-1" />
        </div>

        {/* Source Verifications */}
        <div className="space-y-2">
          {verification.verifications.map((source, index) => (
            <div key={index} className="flex items-start gap-3 text-sm">
              <div className={`mt-0.5 ${source.verified ? 'text-green-600' : 'text-red-600'}`}>
                {source.verified ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{source.source}</span>
                  <span className="text-gray-500">{(source.confidence * 100).toFixed(0)}%</span>
                </div>
                {source.case_name && (
                  <div className="text-gray-600">{source.case_name}</div>
                )}
                {source.holding && (
                  <div className="text-gray-500 italic text-xs mt-1">
                    "{source.holding.substring(0, 150)}..."
                  </div>
                )}
                {source.source_url && (
                  <a 
                    href={source.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View Source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}