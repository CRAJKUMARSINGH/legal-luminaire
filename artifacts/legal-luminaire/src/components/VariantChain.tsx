import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChainNode {
  archetypeId: string;
  title: string;
  content: string;
  status: "streaming" | "done" | "error" | "blocked";
}

export interface VariantChainProps {
  baseTitle: string;
  nodes: ChainNode[];
}

const STATUS_ICON = {
  streaming: Loader2,
  done: CheckCircle2,
  error: CircleAlert,
  blocked: CircleAlert,
} as const;

export function VariantChain({ baseTitle, nodes }: VariantChainProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{baseTitle} → connected variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nodes.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Generated variants will appear here. A blocked or pending citation
            must not be exported.
          </p>
        ) : (
          nodes.map((node) => {
            const Icon = STATUS_ICON[node.status];
            return (
              <article key={`${node.archetypeId}-${node.title}`} className="rounded-md border p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className={`h-4 w-4 ${node.status === "streaming" ? "animate-spin" : ""}`} />
                  {node.title}
                  <span className="ml-auto text-xs text-muted-foreground">{node.status}</span>
                </div>
                <pre className="mt-2 whitespace-pre-wrap text-xs">{node.content || "Generating from the approved matter context…"}</pre>
              </article>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
