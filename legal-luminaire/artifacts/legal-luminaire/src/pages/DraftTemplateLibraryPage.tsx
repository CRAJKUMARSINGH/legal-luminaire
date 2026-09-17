import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ALL_FAMILIES,
  DRAFT_TEMPLATES,
  searchTemplates,
  type DraftTemplate,
} from "@/data/draft-template-library";

export default function DraftTemplateLibraryPage() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const templates = useMemo(() => {
    const searched = query.trim() ? searchTemplates(query) : DRAFT_TEMPLATES;
    return family === "all"
      ? searched
      : searched.filter((template) => template.matterFamily === family);
  }, [family, query]);

  const chooseTemplate = (template: DraftTemplate) => {
    sessionStorage.setItem("draft-template-library:selected", JSON.stringify(template));
    setLocation("/case/demo-1/drafting");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold">Draft template library</h1>
        <p className="text-sm text-muted-foreground">
          Browse synthetic or locally mirrored drafting material. Empty paths
          remain visible but cannot be loaded.
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates, courts, or tags" />
        </div>
        <select className="rounded-md border bg-background px-3 text-sm" value={family} onChange={(event) => setFamily(event.target.value)}>
          <option value="all">All families</option>
          {ALL_FAMILIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <p className="text-xs text-muted-foreground">{templates.length} template{templates.length === 1 ? "" : "s"} shown</p>
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="flex items-start gap-2 text-base">
                <FileText className="mt-0.5 h-4 w-4 shrink-0" /> {template.title}
              </CardTitle>
              {template.titleHi && <p className="text-xs text-muted-foreground">{template.titleHi}</p>}
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">{template.language}</Badge>
                <Badge variant="outline">{template.lowestTier}</Badge>
                <Badge variant="outline">{template.verifiedCitations} verified</Badge>
                {template.pendingCitations > 0 && <Badge variant="destructive">{template.pendingCitations} pending</Badge>}
              </div>
              <Button size="sm" disabled={!template.publicPath} onClick={() => chooseTemplate(template)}>
                {template.publicPath ? "Load into drafting" : "File not mirrored"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
