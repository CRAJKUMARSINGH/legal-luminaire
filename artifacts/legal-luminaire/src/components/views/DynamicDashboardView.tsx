/**
 * Dynamic Dashboard View - Legal Luminaire
 * Works with any case data from the multi-case store
 */

import { useCaseContext } from '@/context/CaseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccuracyBadge } from '@/components/ui/accuracy-badge';
import { 
  Scale, FileText, BookOpen, FlaskConical, Clock, AlertTriangle, 
  CheckCircle2, Info, Users, Calendar, Target, Activity, ShieldAlert, Zap, Gavel, FileSignature
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useState, useEffect, useMemo } from 'react';
import { ForensicRadar } from '@/components/charts/ForensicRadar';
import { TimelineHeatmap } from '@/components/charts/TimelineHeatmap';
import { apiRequest } from "@/lib/api-client";

const StatusBadge = ({ status }: { status: string }) => {
  const variant = status === "VERIFIED" ? "default" : status === "SECONDARY" ? "secondary" : "outline";
  const icon = status === "VERIFIED" ? <CheckCircle2 className="h-3 w-3" /> : status === "SECONDARY" ? <Info className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />;
  return (
    <Badge variant={variant} className="gap-1 text-xs">
      {icon} {status}
    </Badge>
  );
};

export function DynamicDashboardView() {
  const { selectedCase } = useCaseContext();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest(`/cases/${selectedCase.id}/stats`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedCase.id]);

  // Fallback radar data for demo / offline mode
  const radarData = useMemo(() => {
    if (stats?.radar && stats.radar.length > 0) return stats.radar;
    return [
      { subject: "Chain of Custody", A: 3.6, fullMark: 5 },
      { subject: "Sampling Method", A: 4.2, fullMark: 5 },
      { subject: "Weather Evidence", A: 2.9, fullMark: 5 },
      { subject: "BIS/IS Standards", A: 3.8, fullMark: 5 },
      { subject: "Natural Justice", A: 4.5, fullMark: 5 },
      { subject: "FSL Protocol", A: 3.5, fullMark: 5 },
    ];
  }, [stats?.radar]);

  // Fallback heatmap data for demo / offline mode
  const heatmapData = useMemo(() => {
    if (stats?.heatmap && stats.heatmap.length > 0) return stats.heatmap;
    if (selectedCase.timeline && selectedCase.timeline.length > 0) {
      const map: Record<string, number> = {};
      selectedCase.timeline.forEach((item) => {
        const ym = (item.date || "").slice(0, 7) || "2024-09";
        map[ym] = (map[ym] || 0) + 1;
      });
      const generated = Object.entries(map).map(([date, count]) => ({ date, count }));
      if (generated.length > 0) return generated;
    }
    return [
      { date: "2024-08", count: 2 },
      { date: "2024-09", count: 4 },
      { date: "2024-10", count: 1 },
      { date: "2024-11", count: 3 },
      { date: "2024-12", count: 5 },
      { date: "2025-01", count: 2 },
    ];
  }, [stats?.heatmap, selectedCase.timeline]);

  // Calculate statistics from context for fallback/sync
  const verifiedCount = selectedCase.caseLaw?.filter((c) => c.status === "VERIFIED").length || 0;
  const pendingCount = selectedCase.caseLaw?.filter((c) => c.status === "PENDING").length || 0;
  const secondaryCount = selectedCase.caseLaw?.filter((c) => c.status === "SECONDARY").length || 0;

  const activeStrategyCount = selectedCase.strategy?.filter((s) => s.status === "ACTIVE").length || 0;
  const completedStrategyCount = selectedCase.strategy?.filter((s) => s.status === "COMPLETED").length || 0;

  const getComplexityColor = (complexity: string) => {
    switch (complexity?.toLowerCase()) {
      case 'basic': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-orange-500';
      case 'expert': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Case Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{selectedCase.title}</h2>
            <p className="text-muted-foreground mt-1">{selectedCase.brief}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="destructive">{selectedCase.charges || 'Charges TBD'}</Badge>
              <Badge variant="outline">{selectedCase.court}</Badge>
              <Badge className={getStatusColor(selectedCase.status || 'Draft')}>
                {selectedCase.status || 'Draft'}
              </Badge>
              {selectedCase.metadata && (
                <>
                  <Badge variant="outline">{selectedCase.metadata.category}</Badge>
                  <Badge className={`${getComplexityColor(selectedCase.metadata.complexity)} bg-opacity-10`}>
                    {selectedCase.metadata.complexity}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Badge */}
      <div className="flex justify-center">
        <AccuracyBadge showDetails={true} size="lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Documents", labelHi: "दस्तावेज़", value: selectedCase.documents?.length || 0, icon: FileText, color: "text-blue-500" },
          { label: "Case Law Citations", labelHi: "नज़ीर उद्धरण", value: selectedCase.caseLaw?.length || 0, icon: BookOpen, color: "text-emerald-500" },
          { label: "Standards Referenced", labelHi: "प्रासंगिक मानक", value: selectedCase.standards?.length || 0, icon: FlaskConical, color: "text-violet-500" },
          { label: "Timeline Events", labelHi: "घटनाक्रम", value: selectedCase.timeline?.length || 0, icon: Clock, color: "text-amber-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-[10px] text-muted-foreground/75 font-normal">{s.labelHi}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Case Metadata */}
      {selectedCase.metadata && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Case Information / केस जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Category / श्रेणी</p>
                <p className="text-sm text-muted-foreground">{selectedCase.metadata.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Complexity / जटिलता</p>
                <p className="text-sm text-muted-foreground">{selectedCase.metadata.complexity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Estimated Duration / अनुमानित अवधि</p>
                <p className="text-sm text-muted-foreground">{selectedCase.metadata.estimatedDuration}</p>
              </div>
            </div>
            {selectedCase.metadata.requiredResources && selectedCase.metadata.requiredResources.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-2">Required Resources / आवश्यक संसाधन</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.metadata.requiredResources.map((resource, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}      {/* Quick Actions (Week 11 Hardening) */}
      <Card className="border-primary/20 bg-primary/5 my-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Advocate Quick Actions / अधिवक्ता त्वरित कार्रवाई
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button 
            className="gap-2 bg-primary text-[11px] font-bold h-9" 
            onClick={() => navigate(`/case/${selectedCase.id}/drafting?type=BAIL_439`)}
          >
            <Gavel className="w-3.5 h-3.5" />
            GENERATE §439 BAIL APPLICATION
          </Button>
          <Button 
            variant="outline"
            className="gap-2 border-primary/20 text-[11px] font-bold h-9 bg-white/50" 
            onClick={() => navigate(`/case/${selectedCase.id}/drafting?type=DISCHARGE`)}
          >
            <FileSignature className="w-3.5 h-3.5" />
            GENERATE §250 DISCHARGE APP
          </Button>
          <div className="flex-1" />
          <p className="text-[10px] text-primary/60 italic flex items-center gap-1">
             <Info className="w-3 h-3" /> Auto-populated using extracted OMNI-facts
          </p>
        </CardContent>
      </Card>

      {/* --- WEEK 5: FORENSIC ANALYTICS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Forensic Risk Radar / फोरेंसिक जोखिम रडार
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
             {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
             ) : (
                <ForensicRadar data={radarData} />
             )}
          </CardContent>
          <div className="px-5 py-3 bg-slate-50/30 border-t text-[10px] text-muted-foreground italic">
            * Visualization of prosecution gaps by Indian Standards (BIS/IS) categories.
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Timeline Heatmap / घटनाक्रम सघनता
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
             {loading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground italic">
                  Calculating clusters...
                </div>
             ) : (
                <TimelineHeatmap data={heatmapData} />
             )}
          </CardContent>
          <div className="px-5 py-3 bg-slate-50/30 border-t text-[10px] text-muted-foreground italic">
            * Clustering of case incidents by Year-Month.
          </div>
        </Card>
      </div>

      {/* Verification Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Citation Verification Status / उद्धरण सत्यापन स्थिति</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Verified / सत्यापित</span>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(verifiedCount / (selectedCase.caseLaw?.length || 1)) * 120}px` }} />
                <span className="text-sm font-medium">{verifiedCount}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Secondary / द्वितीयक</span>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-secondary" style={{ width: `${(secondaryCount / (selectedCase.caseLaw?.length || 1)) * 120}px` }} />
                <span className="text-sm font-medium">{secondaryCount}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending / प्रतीक्षारत</span>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: `${(pendingCount / (selectedCase.caseLaw?.length || 1)) * 120}px` }} />
                <span className="text-sm font-medium">{pendingCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Strategy Progress / रणनीति प्रगति</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active / सक्रिय</span>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-green-500" style={{ width: `${(activeStrategyCount / (selectedCase.strategy?.length || 1)) * 120}px` }} />
                <span className="text-sm font-medium">{activeStrategyCount}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completed / पूर्ण</span>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(completedStrategyCount / (selectedCase.strategy?.length || 1)) * 120}px` }} />
                <span className="text-sm font-medium">{completedStrategyCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Pillars */}
      {selectedCase.strategy && selectedCase.strategy.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Strategy Pillars / प्रमुख रणनीतिक स्तंभ</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {selectedCase.strategy.slice(0, 6).map((strategy, i) => (
                <li key={strategy.id || i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-muted-foreground">{strategy.title}</span>
                    {strategy.description && (
                      <p className="text-xs text-muted-foreground mt-1">{strategy.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {strategy.priority}
                  </Badge>
                </li>
              ))}
              {selectedCase.strategy.length > 6 && (
                <li className="text-xs text-muted-foreground italic">
                  ... and {selectedCase.strategy.length - 6} more strategy items
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recent Timeline Events */}
      {selectedCase.timeline && selectedCase.timeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Timeline Events / हालिया घटनाक्रम
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {selectedCase.timeline.slice(0, 5).map((event, i) => (
                <li key={event.id || i} className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      event.status === 'COMPLETED' ? 'bg-green-500' :
                      event.status === 'VERIFIED' ? 'bg-blue-500' :
                      event.status === 'SECONDARY' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                    {event.date && (
                      <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                    )}
                  </div>
                  <StatusBadge status={event.status} />
                </li>
              ))}
              {selectedCase.timeline.length > 5 && (
                <li className="text-xs text-muted-foreground italic">
                  ... and {selectedCase.timeline.length - 5} more events
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Case Files */}
      {selectedCase.files && selectedCase.files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Case Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedCase.files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {file.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
