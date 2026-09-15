import { useState, useEffect } from "react";
import { 
  Search, Book, Scale, FlaskConical, Gavel, 
  ArrowRight, ExternalLink, Loader2, Filter, Info
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api-client";

type SearchResult = {
  statutes: any[];
  standards: any[];
  precedents: any[];
};

export const SearchView = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "STATUTES" | "STANDARDS" | "PRECEDENTS">("ALL");

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) {
      setResults(null);
      return;
    }
    
    setLoading(true);
    try {
      const data = await apiFetch<SearchResult>(`/legal-search?q=${encodeURIComponent(val)}`);
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Legal Intelligence Hub</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Search across 1,000+ Indian Statutes, BIS Forensic Standards, and high-impact Rajasthan & Supreme Court precedents.
        </p>
      </div>

      {/* Global Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </div>
        <Input 
          className="h-14 pl-12 pr-4 text-lg rounded-full shadow-lg border-2 border-primary/20 focus:border-primary transition-all bg-white"
          placeholder="Search e.g. 'BIS Sampling', 'Section 409', 'Hemraj Vardar'..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Filters & Results */}
      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex gap-2 justify-center overflow-x-auto pb-2">
              <Button 
                variant={activeTab === "ALL" ? "default" : "outline"} 
                onClick={() => setActiveTab("ALL")}
                className="rounded-full gap-2 text-xs"
              >
                All Results ({results.statutes.length + results.standards.length + results.precedents.length})
              </Button>
              <Button 
                variant={activeTab === "STATUTES" ? "default" : "outline"} 
                onClick={() => setActiveTab("STATUTES")}
                className="rounded-full gap-2 text-xs"
              >
                <Scale className="w-3 h-3" /> Statutes ({results.statutes.length})
              </Button>
              <Button 
                variant={activeTab === "STANDARDS" ? "default" : "outline"} 
                onClick={() => setActiveTab("STANDARDS")}
                className="rounded-full gap-2 text-xs"
              >
                <FlaskConical className="w-3 h-3" /> Standards ({results.standards.length})
              </Button>
              <Button 
                variant={activeTab === "PRECEDENTS" ? "default" : "outline"} 
                onClick={() => setActiveTab("PRECEDENTS")}
                className="rounded-full gap-2 text-xs"
              >
                <Gavel className="w-3 h-3" /> Precedents ({results.precedents.length})
              </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Statutes Section */}
              {(activeTab === "ALL" || activeTab === "STATUTES") && results.statutes.map((s, i) => (
                <ResultCard key={i} icon={<Scale className="w-4 h-4 text-blue-600" />} title={s.code} subtitle={s.title} category="Statute" detail={s.punishment} />
              ))}

              {/* Standards Section */}
              {(activeTab === "ALL" || activeTab === "STANDARDS") && results.standards.map((s, i) => (
                <ResultCard key={i} icon={<FlaskConical className="w-4 h-4 text-amber-600" />} title={s.code} subtitle={s.title} category="BIS Standard" detail={s.category} />
              ))}

              {/* Precedents Section */}
              {(activeTab === "ALL" || activeTab === "PRECEDENTS") && results.precedents.map((s, i) => (
                <ResultCard key={i} icon={<Gavel className="w-4 h-4 text-emerald-600" />} title={s.case} subtitle={s.citation} category={s.court} detail={s.holding} />
              ))}
           </div>
        </div>
      )}

      {/* Empty State / Explore */}
      {!results && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 opacity-80">
           <Card className="hover:border-primary transition-colors cursor-pointer bg-slate-50/50">
              <CardContent className="pt-6">
                 <Book className="w-8 h-8 text-blue-500 mb-4" />
                 <h4 className="font-bold">Browse IPC/BNS</h4>
                 <p className="text-sm text-muted-foreground mt-1">Explore all sections of the new Bhartiya Nyaya Sanhita.</p>
              </CardContent>
           </Card>
           <Card className="hover:border-primary transition-colors cursor-pointer bg-slate-50/50">
              <CardContent className="pt-6">
                 <FlaskConical className="w-8 h-8 text-amber-500 mb-4" />
                 <h4 className="font-bold">BIS Standards</h4>
                 <p className="text-sm text-muted-foreground mt-1">Lookup all Indian Standards for construction & forensics.</p>
              </CardContent>
           </Card>
           <Card className="hover:border-primary transition-colors cursor-pointer bg-slate-50/50">
              <CardContent className="pt-6">
                 <Gavel className="w-8 h-8 text-emerald-500 mb-4" />
                 <h4 className="font-bold">Precedent Matrix</h4>
                 <p className="text-sm text-muted-foreground mt-1">Deep-dive into 50,000+ indexed court judgments.</p>
              </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
};

const ResultCard = ({ icon, title, subtitle, category, detail }: any) => (
  <Card className="hover:shadow-md transition-all border-l-4 border-l-primary/10">
    <CardContent className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{category}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><ArrowRight className="w-3 h-3" /></Button>
      </div>
      <div>
        <h4 className="font-bold text-slate-800 leading-tight">{title}</h4>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">{subtitle}</p>
      </div>
      <div className="bg-slate-50 p-2.5 rounded text-[11px] text-slate-600 leading-relaxed border flex items-start gap-2">
        <Info className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
        {detail}
      </div>
    </CardContent>
  </Card>
);
