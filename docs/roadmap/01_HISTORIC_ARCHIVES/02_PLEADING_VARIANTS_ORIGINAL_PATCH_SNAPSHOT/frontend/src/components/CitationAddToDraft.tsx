import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { variantsApi, type CitationHit } from '@/lib/variantsApi'

const TIER_COLOR: Record<CitationHit['tier'], string> = {
  COURT_SAFE: 'bg-emerald-600',
  VERIFIED: 'bg-green-600',
  SECONDARY: 'bg-yellow-600',
  PENDING: 'bg-orange-600',
  FATAL_ERROR: 'bg-red-600',
}

/** Citation Search panel. "Add to Draft" is disabled for anything below
 *  VERIFIED — the same non-optional philosophy as the export gate. */
export function CitationAddToDraft({ onInsert }: { onInsert: (hit: CitationHit) => void }) {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<CitationHit[]>([])
  const [searching, setSearching] = useState(false)

  const search = async () => {
    setSearching(true)
    try {
      const { results } = await variantsApi.citationSearch(q)
      setHits(results)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Search statutes / precedents for this draft…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
        />
        <Button onClick={search} disabled={searching || !q.trim()}>
          {searching ? '…' : 'Search'}
        </Button>
      </div>
      <div className="space-y-2 max-h-[420px] overflow-y-auto">
        {hits.map((h) => (
          <div key={h.id} className="rounded-md border p-3 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{h.title}</span>
              <Badge className={TIER_COLOR[h.tier]}>{h.tier}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{h.snippet}</p>
            <Button
              size="sm"
              variant="outline"
              disabled={!h.insertable}
              title={h.insertable ? 'Insert into draft' : 'Blocked by Fact-Fit Gate — verify first'}
              onClick={() => onInsert(h)}
            >
              {h.insertable ? '＋ Add to Draft' : '🔒 Verify first'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
