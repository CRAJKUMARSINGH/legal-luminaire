import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FAMILIES = [
  ["Reply / rejoinder", "Respond to an opponent's pleading using only the approved matter record."],
  ["Supplementary affidavit", "Add a bounded factual update without silently changing the case theory."],
  ["Interlocutory application", "Prepare a reviewable application shell with unresolved fields visible."],
  ["Execution / appeal", "Start a connected downstream draft for supervisor review."],
] as const;

export default function DraftFamilyPanel() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState("");
  const note = useMemo(
    () => FAMILIES.find(([name]) => name === selected)?.[1],
    [selected],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold">Draft family</h1>
        <p className="text-sm text-muted-foreground">
          Choose a document relationship before drafting. This screen does not
          certify citations or filing readiness.
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {FAMILIES.map(([name, description]) => (
          <button
            type="button"
            key={name}
            onClick={() => setSelected(name)}
            className={`rounded-lg border p-4 text-left transition ${selected === name ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
          >
            <p className="font-medium">{name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </button>
        ))}
      </div>
      {note && (
        <Card>
          <CardHeader><CardTitle className="text-base">{selected}</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted-foreground">{note}</p>
            <Button onClick={() => setLocation("/case/demo-1/draft-variants")}>
              Open connected drafting
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
