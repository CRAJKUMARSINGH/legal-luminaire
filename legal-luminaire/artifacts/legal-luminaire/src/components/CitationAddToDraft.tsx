import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { variantsApi, type CitationHit } from "@/lib/variantsApi";

export interface CitationAddToDraftProps {
  onInsert: (hit: CitationHit) => void;
}

export function CitationAddToDraft({ onInsert }: CitationAddToDraftProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CitationHit[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) return;
    setBusy(true);
    setError("");
    try {
      const response = await variantsApi.citationSearch(query.trim());
      setResults(response.results);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Citation search unavailable.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a proposition or citation"
          aria-label="Citation search"
          onKeyDown={(event) => {
            if (event.key === "Enter") void search();
          }}
        />
        <Button onClick={() => void search()} disabled={busy || !query.trim()}>
          <Search className="mr-1 h-4 w-4" /> Search
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {results.map((hit) => {
        const allowed = hit.tier === "COURT_SAFE" || hit.tier === "VERIFIED";
        return (
          <div key={hit.id} className="rounded border p-2 text-xs">
            <div className="flex items-center gap-2">
              <strong>{hit.title}</strong>
              <Badge variant={allowed ? "secondary" : "destructive"}>{hit.tier}</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">{hit.citation}</p>
            <p className="mt-1">{hit.snippet}</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              disabled={!allowed || !hit.insertable}
              onClick={() => onInsert(hit)}
            >
              <ShieldCheck className="mr-1 h-3 w-3" /> Add verified authority
            </Button>
          </div>
        );
      })}
    </div>
  );
}
