import { Link } from "wouter";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INFRA_ARB_CASES } from "@/data/demo-cases/infra-arb-cases";

export default function InfraArbClaimPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <Link href="/infra-arb-browser" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to infrastructure arbitration
      </Link>
      <header>
        <h1 className="text-2xl font-bold">Infrastructure arbitration claim workspace</h1>
        <p className="text-sm text-muted-foreground">
          Synthetic claim starters only. The record must be reviewed before any
          legal submission is prepared.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {INFRA_ARB_CASES.map((item) => (
          <Card key={item.id}>
            <CardHeader><CardTitle className="text-base">{item.id} · {item.title}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{item.summary}</p>
              <p className="flex items-start gap-2 text-xs text-amber-700">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Synthetic facts require source verification.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
