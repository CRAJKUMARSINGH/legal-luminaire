/**
 * DraftVariantsPage — Drafting Studio → "Spawn Connected Variants".
 * Route: /case/:id/draft-variants
 *
 * Flow:
 *  1. Select subject (50 available) → variant family loads.
 *  2. Paste / confirm the base draft → MatterContext extracted (deterministic).
 *  3. Click any archetype chip → variant streams into the chain, threaded to
 *     the SAME matter (parties / court / case no. carried verbatim).
 *  4. Fill [[CITATION:n]] slots via Citation Search → Add to Draft
 *     (COURT_SAFE / VERIFIED only — Fact-Fit Gate applies).
 */
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'wouter'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { VariantChain } from '@/components/VariantChain'
import { CitationAddToDraft } from '@/components/CitationAddToDraft'
import { usePleadingVariants } from '@/hooks/usePleadingVariants'
import { variantsApi, type Archetype } from '@/lib/variantsApi'

const KIND_TAG: Record<string, string> = {
  defence: '🛡 Defence', subsequent: '🔗 Subsequent', interlocutory: '⚖ Interlocutory',
  execution: '⚒ Execution', appeal: '🔀 Appeal',
}

export default function DraftVariantsPage() {
  const { id: caseId } = useParams<{ id: string }>()
  const [subjects, setSubjects] = useState<{ id: string; label: { en: string; hi: string } }[]>([])
  const [subject, setSubject] = useState('')
  const [baseDraft, setBaseDraft] = useState('')
  const [activeNode, setActiveNode] = useState(0)
  const { family, matter, chain, gateBlock, loadFamily, extractContext, spawnVariant, addCitationToDraft } =
    usePleadingVariants(caseId ?? 'demo-1', subject)

  useEffect(() => {
    variantsApi.subjects().then((s: { id: string; label: { en: string; hi: string } }[]) => setSubjects(s))
  }, [])
  useEffect(() => {
    if (subject) void loadFamily()
  }, [subject, loadFamily])

  const archetypes = useMemo(() => family?.variants ?? [], [family])

  return (
    <div className="container mx-auto max-w-6xl space-y-6 py-8 px-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">⚡ Pleading Chain — Connected Drafts</h1>
        <p className="text-sm text-muted-foreground">
          One petition/application → rejoinder, supplementary affidavit, IA, contempt, execution and more —
          all threaded to the same matter, all 50 subjects.
        </p>
      </header>

      {gateBlock && (
        <Alert variant="destructive">
          <AlertTitle>🔒 Fact-Fit Gate blocked variant generation</AlertTitle>
          <AlertDescription>
            {gateBlock.message} Resolve PENDING citations on the base draft first — same rule as export.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <div className="flex gap-2 items-center">
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-[320px]">
                <SelectValue placeholder="Select subject (1 of 50)" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label.en} · {s.label.hi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              disabled={!subject || !baseDraft.trim()}
              onClick={() => void extractContext(baseDraft)}
            >
              Extract Matter Context
            </Button>
          </div>

          {matter && (
            <Alert>
              <AlertTitle>Matter locked 🔗</AlertTitle>
              <AlertDescription className="text-xs">
                {matter.court} · {matter.case_no}
                <br />
                Pet: {matter.petitioners.join(', ') || '—'} | Res: {matter.respondents.join(', ') || '—'}
              </AlertDescription>
            </Alert>
          )}

          <textarea
            className="w-full min-h-[220px] rounded-md border bg-background p-3 font-mono text-xs"
            placeholder="Paste the base petition / application drafted in Drafting Studio…"
            value={baseDraft}
            onChange={(e) => setBaseDraft(e.target.value)}
          />

          {family && (
            <div className="space-y-2">
              <h2 className="font-semibold text-sm">
                Connected variants for {family.label.en} ({archetypes.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {archetypes.map((a: Archetype) => (
                  <Button
                    key={a.id}
                    size="sm"
                    variant="secondary"
                    disabled={!matter}
                    title={a.glossary.join(' · ')}
                    onClick={() => spawnVariant(baseDraft, a)}
                  >
                    {KIND_TAG[a.kind] ?? a.kind} {a.label.en}
                  </Button>
                ))}
              </div>
              {!matter && <p className="text-xs text-muted-foreground">Extract Matter Context first — variants inherit it verbatim.</p>}
            </div>
          )}

          <VariantChain baseTitle="Base Draft" nodes={chain} />
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-sm">🔍 Citation Search → Add to Draft</h2>
          <CitationAddToDraft
            onInsert={(hit) => {
              addCitationToDraft(activeNode, hit)
            }}
          />
          <div className="rounded-md border p-3 max-h-[420px] overflow-y-auto">
            {chain[activeNode] ? (
              <>
                <div className="flex gap-1 mb-2 flex-wrap">
                  {chain.map((n, i) => (
                    <Button key={i} size="sm" variant={i === activeNode ? 'default' : 'ghost'} onClick={() => setActiveNode(i)}>
                      {n.title}
                    </Button>
                  ))}
                </div>
                <pre className="whitespace-pre-wrap text-xs font-mono">{chain[activeNode].content || '(streaming…)'}</pre>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Generate a variant to edit and insert citations here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
