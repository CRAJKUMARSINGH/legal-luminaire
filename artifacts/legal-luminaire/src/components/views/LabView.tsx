import { useState } from "react";
import { 
  FlaskConical, Upload, CheckCircle, AlertCircle, 
  Info, ArrowRight, Table, Loader2, FileText, BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api-client";

type LabResult = {
  parameter: string;
  observed_value: string;
  specified_value: string;
  unit: string;
  status: string;
};

type LabExtraction = {
  report_no: string;
  date_of_issue: string;
  sample_description: string;
  results: LabResult[];
  conclusion: string;
  standard_applied: string;
};

export const LabView = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [extraction, setExtraction] = useState<LabExtraction | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiRequest("/extract-lab-report", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setExtraction(data);
        toast({ title: "Analysis Complete", description: "Lab data extracted successfully." });
      } else {
        toast({ title: "Extraction Failed", description: data.detail || "Unknown error", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Network error during lab extraction.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start justify-between bg-slate-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
        <div className="space-y-4 z-10 relative">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">WEEK 8: LAB VALIDATION</Badge>
          <h2 className="text-3xl font-bold tracking-tight">Forensic NABL Report Analyzer</h2>
          <p className="text-slate-400 max-w-md">
            Upload your NABL Lab reports (FSL, CTL, BIT) to automatically extract chemical & strength tables and validate against Indian Standards.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full px-6" asChild>
              <label className="cursor-pointer">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload Lab PDF
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
              </label>
            </Button>
            <p className="text-[10px] text-slate-500 italic flex items-center gap-1">
              <Info className="w-3 h-3" /> Supports FSL (Forensic Science Lab) & CTL reports.
            </p>
          </div>
        </div>
        <FlaskConical className="w-64 h-64 text-white/5 absolute -right-12 -bottom-12 rotate-12" />
      </div>

      {extraction && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* LEFT: Metadata */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="border-none shadow-md overflow-hidden">
                 <div className="h-2 bg-amber-500" />
                 <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Report Metadata</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-500 uppercase">Report Number</p>
                       <p className="text-sm font-bold text-slate-800">{extraction.report_no}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-500 uppercase">Date of Issue</p>
                       <p className="text-sm font-bold text-slate-800">{extraction.date_of_issue}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-500 uppercase">Standard Applied</p>
                       <Badge variant="outline" className="text-primary font-bold">{extraction.standard_applied}</Badge>
                    </div>
                 </CardContent>
              </Card>

              <Card className="bg-slate-50 border-dashed">
                 <CardContent className="p-6 space-y-3">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                       <Info className="w-4 h-4 text-primary" />
                       Conclusion Summary
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                       "{extraction.conclusion}"
                    </p>
                 </CardContent>
              </Card>
           </div>

           {/* RIGHT: Results Table */}
           <div className="lg:col-span-2">
              <Card className="border-none shadow-lg">
                 <CardHeader className="border-b bg-slate-50/50">
                    <div className="flex items-center justify-between">
                       <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <Table className="w-4 h-4 text-primary" />
                          Testing Parameters & Obs. Values
                       </CardTitle>
                       <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">VALIDATED</Badge>
                    </div>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-slate-50 border-b">
                                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Parameter</th>
                                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase text-center">Observed</th>
                                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase text-center">Specified</th>
                                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase text-center">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y">
                             {extraction.results.map((res, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                   <td className="p-4">
                                      <p className="text-xs font-bold text-slate-700">{res.parameter}</p>
                                      <p className="text-[10px] text-slate-400">{res.unit}</p>
                                   </td>
                                   <td className="p-4 text-center text-sm font-medium">{res.observed_value}</td>
                                   <td className="p-4 text-center text-sm text-slate-500 font-mono italic">{res.specified_value}</td>
                                   <td className="p-4 text-center">
                                      <Badge 
                                         className={res.status === "FAIL" ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}
                                         variant="outline"
                                      >
                                         {res.status === "FAIL" ? <AlertCircle className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                                         {res.status}
                                      </Badge>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </CardContent>
              </Card>

              <div className="mt-4 flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                       <BarChart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase">Litigation Readiness</p>
                       <p className="text-xs font-medium text-slate-700">All procedural non-compliance matches IS 456 Annexures.</p>
                    </div>
                 </div>
                 <Button size="sm" variant="outline" className="text-xs gap-1">
                    Push to Matrix <ArrowRight className="w-3 h-3" />
                 </Button>
              </div>
           </div>
        </div>
      )}

      {/* Placeholder / Empty State */}
      {!extraction && !isUploading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="h-64 rounded-3xl bg-slate-100 border-2 border-dashed flex flex-col items-center justify-center gap-4">
              <FileText className="w-12 h-12 text-slate-300" />
              <p className="text-xs font-medium">Wait for Upload...</p>
           </div>
           <div className="h-64 rounded-3xl bg-slate-100 border-2 border-dashed flex flex-col items-center justify-center gap-4">
              <Table className="w-12 h-12 text-slate-300" />
              <p className="text-xs font-medium">Wait for Stats...</p>
           </div>
        </div>
      )}
    </div>
  );
};
