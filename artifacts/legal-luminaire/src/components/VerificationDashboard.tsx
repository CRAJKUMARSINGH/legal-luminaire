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
  standards_verification?: {
    total_standards: number;
    verified_standards: number;
    superseded_standards: number;
    inapplicable_standards: number;
    standard_details: Array<{
      standard_code: string;
      clause_reference: string;
      verification_status: 'VERIFIED' | 'SUPERSEDED' | 'INAPPLICABLE' | 'PENDING';
      source_url?: string;
      replacement_standard?: string;
    }>;
  };
  chain_of_custody_verification?: {
    sampling_procedures_compliant: boolean;
    representative_present: boolean;
    weather_conditions_valid: boolean;
    sample_locations_count: number;
    chain_of_custody_documented: boolean;
    seal_integrity: boolean;
    concerns: string[];
  };
}

interface VerificationDashboardProps {
  hallucinationReport: HallucinationReport;
  citationVerifications?: CitationVerification[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function VerificationDashboard({
  hallucinationReport,
  citationVerifications = [],
  isLoading = false,
  onRefresh,
}: VerificationDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'citations' | 'standards' | 'chain_of_custody'>('overview');

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
              className="h-2 [&>div]:bg-orange-500"
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
          Standards {hallucinationReport.standards_verification && `(${hallucinationReport.standards_verification.total_standards})`}
        </button>
        <button
          onClick={() => setActiveTab('chain_of_custody')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'chain_of_custody' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Chain of Custody
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
        <div className="space-y-4">
          {!hallucinationReport.standards_verification ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No standards verification data available</p>
                <p className="text-sm mt-2">Run verification to check IS/ASTM standards</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Standards Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Standards Verification Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {hallucinationReport.standards_verification.total_standards}
                      </div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {hallucinationReport.standards_verification.verified_standards}
                      </div>
                      <div className="text-sm text-gray-600">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {hallucinationReport.standards_verification.superseded_standards}
                      </div>
                      <div className="text-sm text-gray-600">Superseded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {hallucinationReport.standards_verification.inapplicable_standards}
                      </div>
                      <div className="text-sm text-gray-600">Inapplicable</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Standard Details */}
              {hallucinationReport.standards_verification.standard_details.map((standard, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{standard.standard_code}</CardTitle>
                        <div className="text-sm text-gray-600 mt-1">
                          Clause: {standard.clause_reference}
                        </div>
                      </div>
                      <Badge variant={
                        standard.verification_status === 'VERIFIED' ? 'default' :
                        standard.verification_status === 'SUPERSEDED' ? 'destructive' :
                        standard.verification_status === 'INAPPLICABLE' ? 'secondary' : 'outline'
                      }>
                        {standard.verification_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {standard.replacement_standard && (
                      <div className="text-sm text-orange-600 mb-2">
                        Replacement: {standard.replacement_standard}
                      </div>
                    )}
                    {standard.source_url && (
                      <a 
                        href={standard.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Standard
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'chain_of_custody' && (
        <div className="space-y-4">
          {!hallucinationReport.chain_of_custody_verification ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No chain of custody verification data available</p>
                <p className="text-sm mt-2">Run verification to check forensic sampling procedures</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Chain of Custody Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Chain of Custody Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <ChainOfCustodyItem 
                      label="Sampling Procedures" 
                      compliant={hallucinationReport.chain_of_custody_verification.sampling_procedures_compliant}
                    />
                    <ChainOfCustodyItem 
                      label="Representative Present" 
                      compliant={hallucinationReport.chain_of_custody_verification.representative_present}
                    />
                    <ChainOfCustodyItem 
                      label="Weather Conditions" 
                      compliant={hallucinationReport.chain_of_custody_verification.weather_conditions_valid}
                    />
                    <ChainOfCustodyItem 
                      label="Chain Documented" 
                      compliant={hallucinationReport.chain_of_custody_verification.chain_of_custody_documented}
                    />
                    <ChainOfCustodyItem 
                      label="Seal Integrity" 
                      compliant={hallucinationReport.chain_of_custody_verification.seal_integrity}
                    />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {hallucinationReport.chain_of_custody_verification.sample_locations_count}
                      </div>
                      <div className="text-sm text-gray-600">Sample Locations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Concerns */}
              {hallucinationReport.chain_of_custody_verification.concerns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Concerns ({hallucinationReport.chain_of_custody_verification.concerns.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {hallucinationReport.chain_of_custody_verification.concerns.map((concern, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
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

function ChainOfCustodyItem({ label, compliant }: { label: string; compliant: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
      <span className="text-sm font-medium">{label}</span>
      <div className={`flex items-center gap-1 ${compliant ? 'text-green-600' : 'text-red-600'}`}>
        {compliant ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        <span className="text-sm">{compliant ? 'Compliant' : 'Non-Compliant'}</span>
      </div>
    </div>
  );
}