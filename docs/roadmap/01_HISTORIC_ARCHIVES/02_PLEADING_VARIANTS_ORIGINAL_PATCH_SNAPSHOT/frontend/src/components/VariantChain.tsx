import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ChainNode } from '@/hooks/usePleadingVariants'

const STATUS_STYLE: Record<ChainNode['status'], string> = {
  streaming: 'bg-blue-600',
  done: 'bg-emerald-600',
  error: 'bg-red-600',
  blocked: 'bg-amber-600',
}

/** Matter-thread visual: base draft -> connected variants in spawn order. */
export function VariantChain({ baseTitle, nodes }: { baseTitle: string; nodes: ChainNode[] }) {
  return (
    <div className="flex items-start gap-3 overflow-x-auto py-4">
      <Card className="min-w-[220px] border-2 border-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{baseTitle}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">Root pleading · MatterContext source</CardContent>
      </Card>
      {nodes.map((n, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-muted-foreground">→</span>
          <Card className="min-w-[220px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {n.title}
                <Badge className={STATUS_STYLE[n.status]}>{n.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {n.status === 'streaming' ? 'Drafting…' : `${n.content.length.toLocaleString()} chars`}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
