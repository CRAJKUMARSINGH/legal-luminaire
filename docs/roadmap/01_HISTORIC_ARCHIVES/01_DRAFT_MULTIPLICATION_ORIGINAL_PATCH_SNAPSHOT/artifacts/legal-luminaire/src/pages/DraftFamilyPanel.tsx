/**
 * DraftFamilyPanel — "Draft Multiplication" studio.
 *
 * One subject → full document family: take a parent draft (petition /
 * application) and multiply it into rejoinder, replication, counter-affidavit,
 * supplementary application, amendment application, interim/stay, review,
 * appeal, caveat, execution, restoration, additional evidence — with
 * jurisdiction-aware terminology from the backend registry and Citation Search
 * authority blocks piped in as verified precedents.
 *
 * Additive page: mounts at /case/:id/draft-family; does not modify existing
 * drafting flows.
 */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import {
  GitBranch, Loader2, FileText, BookOpen, ShieldCheck, ShieldAlert,
  Copy, RefreshCcw, ChevronRight, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaseContext } from "@/context/CaseContext";
import { useToast } from "@/hooks/use-toast";
import { AUTHORITIES, type Authority } from "@/data/citations";
import { search } from "@/lib/search";
import {
  fetchDerivativeTypes, fetchSubjects, fetchDraftFamily, generateDerivativeDraft,
  type DerivativeTypeInfo, type SubjectInfo, type DraftFamilyRecord,
} from "@/lib/draft-family";

export default function DraftFamilyPanel() {
  const { selectedCase } = useCaseContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [types, setTypes] = useState<DerivativeTypeInfo[]>([]);
  const [family, setFamily] = useState<DraftFamilyRecord[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [authorityQuery, setAuthorityQuery] = useState("");
  const [pickedAuthorities, setPickedAuthorities] = useState<Authority[]>([]);
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<DraftFamilyRecord | null>(null);

  useEffect(() => {
    (async () => {
      const [s, t, f] = await Promise.all([
        fetchSubjects(), fetchDerivativeTypes(), fetchDraftFamily(selectedCase.id),
      ]);
      setSubjects(s);
      setTypes(t);
      setFamily(f);
      if (s.length > 0 && !subjectId) setSubjectId(s[0].id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCase.id]);

  const applicableTypes = useMemo(() => {
    if (!subjectId) return types;
    return types.filter((t) => {
      const s = subjects.find((x) => x.id === subjectId);
      return s ? s.applicable_types.includes(t.id) : true;
    });
  }, [subjectId, subjects, types]);

  // Citation Search integration: reuse the same synonym-aware engine as CitationSearchPage
  const authorityHits = useMemo(() => {
    if (!authorityQuery.trim()) return [];
    return search(authorityQuery).hits.slice(0, 6).map((h) => h.authority);
  }, [authorityQuery]);

  const toggleAuthority = (a: Authority) => {
    setPickedAuthorities((prev) =>
      prev.some((p) => p.id === a.id) ? prev.filter((p) => p.id !== a.id) : [...prev, a]
    );
  };

  const refreshFamily = async () => {
    setFamily(await fetchDraftFamily(selectedCase.id));
  };

  const generate = async () => {
    if (!subjectId || !typeId) return;
    setIsGenerating(true);
    try {
      const result = await generateDerivativeDraft(selectedCase.id, {
        subject_id: subjectId,
        derivative_type_id: typeId,
        parent_draft_id: parentId,
        authority_blocks: pickedAuthorities,
        additional_notes: notes,
      });
      if (result.success) {
        toast({
          title: "Derivative Draft Generated",
          description: `${result.citations_extracted.length} citation(s) queued for verification.`,
        });
        setOutput({
          id: result.draft_id ?? "draft",
          title: typeId,
          draft_type: typeId,
          subject_id: subjectId,
          content: result.draft_content,
          generated_at: new Date().toISOString(),
          review_status: "DRAFT",
          lineage: {
            derivative_type_id: typeId,
            derivative_type_label: typeId,
            subject_id: subjectId,
            parent_draft_id: parentId,
            authority_ids: pickedAuthorities.map((a) => a.id),
            citations_extracted: result.citations_extracted,
          },
        });
        await refreshFamily();
      } else {
        toast({ title: "Generation Failed", description: result.error || "Unknown error", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network Error", description: "Is the backend running?", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output.content);
      toast({ title: "Copied", description: "Derivative draft copied to clipboard." });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3 shrink-0">
            <GitBranch className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Draft Multiplication — Document Family</h1>
            <p className="text-sm text-muted-foreground mt-1">
              One parent draft → the complete family: rejoinder, replication, counter-affidavit,
              supplementary &amp; amendment applications, interim/stay, review, appeal, caveat,
              execution, restoration. Terminology follows the 50-subject registry; precedents are
              piped in from Citation Search as verified authority blocks.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4" /> Subject (50-subject registry)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                className="w-full p-2 text-sm rounded-lg border bg-slate-50"
                value={subjectId}
                onChange={(e) => { setSubjectId(e.target.value); setTypeId(""); }}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>

              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Derivative Version
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto">
                {applicableTypes.map((t) => (
                  <Button
                    key={t.id}
                    variant={typeId === t.id ? "default" : "outline"}
                    className="w-full justify-start gap-2 h-10 text-xs"
                    onClick={() => setTypeId(t.id)}
                  >
                    <FileText className="w-4 h-4" /> {t.label}
                  </Button>
                ))}
                {applicableTypes.length === 0 && (
                  <p className="text-xs text-muted-foreground">Select a subject to see its versions.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Authority Blocks (Citation Search)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                className="w-full p-2 text-sm rounded-lg border bg-slate-50"
                placeholder="Search verified authorities…"
                value={authorityQuery}
                onChange={(e) => setAuthorityQuery(e.target.value)}
              />
              {authorityHits.map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggleAuthority(a)}
                  className={`w-full text-left p-2 rounded-lg border text-xs transition-all ${
                    pickedAuthorities.some((p) => p.id === a.id)
                      ? "border-primary bg-primary/10"
                      : "border-slate-200 bg-white hover:border-primary/40"
                  }`}
                >
                  <p className="font-bold">{a.shortTitle || a.title}</p>
                  <p className="text-muted-foreground mt-0.5">{a.citation}</p>
                </button>
              ))}
              {pickedAuthorities.length > 0 && (
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {pickedAuthorities.length} authority block(s) will be piped into the draft.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Parent Draft &amp; Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                className="w-full p-2 text-sm rounded-lg border bg-slate-50"
                value={parentId ?? ""}
                onChange={(e) => setParentId(e.target.value || null)}
              >
                <option value="">No parent (root document)</option>
                {family.map((d) => (
                  <option key={d.id} value={d.id}>{d.title || d.id}</option>
                ))}
              </select>
              <textarea
                className="w-full min-h-[80px] p-3 text-sm rounded-lg border bg-slate-50"
                placeholder="Additional guidance for this version…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button className="w-full h-12 gap-2" onClick={generate} disabled={isGenerating || !typeId}>
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                Generate Derivative Draft
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output + family tree */}
        <div className="space-y-4 lg:col-span-2">
          {output && (
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm capitalize">{output.lineage?.derivative_type_label}</CardTitle>
                <Button size="sm" variant="ghost" onClick={copyOutput} className="gap-1.5">
                  <Copy className="w-4 h-4" /> Copy
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  {output.lineage?.citations_extracted.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold">
                      <ShieldAlert className="w-3 h-3" /> {c}
                    </span>
                  ))}
                </div>
                <div className="whitespace-pre-wrap text-[13px] font-serif leading-relaxed max-h-[500px] overflow-y-auto p-4 rounded-lg border bg-slate-50">
                  {output.content}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Document Family Tree ({family.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {family.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No drafts yet. Generate the parent application in the Drafting Studio, then multiply it here.
                </p>
              ) : (
                <ul className="space-y-2">
                  {family.map((d) => (
                    <li key={d.id} className="flex items-center gap-2 text-sm p-2 rounded-lg border bg-white">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <span className="font-medium truncate flex-1">{d.title || d.id}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        {d.lineage?.parent_draft_id ? `child of ${d.lineage.parent_draft_id}` : "root"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
