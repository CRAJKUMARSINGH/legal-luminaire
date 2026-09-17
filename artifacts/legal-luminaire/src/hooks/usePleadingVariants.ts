import { useCallback, useRef, useState } from 'react'
import { variantsApi, type Archetype, type MatterContext, type VariantFamily } from '@/lib/variantsApi'

export interface ChainNode {
  archetypeId: string
  title: string
  content: string
  status: 'streaming' | 'done' | 'error' | 'blocked'
}

export function usePleadingVariants(caseId: string, subject: string) {
  const [family, setFamily] = useState<VariantFamily | null>(null)
  const [matter, setMatter] = useState<MatterContext | null>(null)
  const [chain, setChain] = useState<ChainNode[]>([])
  const [gateBlock, setGateBlock] = useState<{ message: string; blocked: unknown[] } | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const loadFamily = useCallback(async () => {
    setFamily(await variantsApi.family(subject))
  }, [subject])

  const extractContext = useCallback(
    async (baseDraftMd: string) => {
      const ctx = await variantsApi.matterContext(baseDraftMd, caseId, subject)
      setMatter(ctx)
    },
    [caseId, subject],
  )

  const spawnVariant = useCallback(
    (baseDraftMd: string, archetype: Archetype) => {
      abortRef.current?.abort()
      setGateBlock(null)
      const newIdx = chain.length
      setChain((c) => [...c, { archetypeId: archetype.id, title: archetype.label.en, content: '', status: 'streaming' }])

      abortRef.current = variantsApi.generateStream(
        { base_draft_md: baseDraftMd, case_id: caseId, subject, archetype_id: archetype.id },
        (delta) =>
          setChain((c) => c.map((n, i) => (i === newIdx ? { ...n, content: n.content + delta } : n))),
        () => setChain((c) => c.map((n, i) => (i === newIdx ? { ...n, status: 'done' } : n))),
        (err) => {
          const code = (err as { code?: string }).code
          if (code === 'GATE_BLOCK') {
            setGateBlock({
              message: (err as Error).message,
              blocked: (err as { blocked?: unknown[] }).blocked ?? [],
            })
            setChain((c) => c.map((n, i) => (i === newIdx ? { ...n, status: 'blocked' } : n)))
          } else {
            setChain((c) => c.map((n, i) => (i === newIdx ? { ...n, status: 'error' } : n)))
          }
        },
      )
    },
    [caseId, subject, chain.length],
  )

  /** Citation Search -> Add to Draft. Only COURT_SAFE / VERIFIED may be inserted. */
  const addCitationToDraft = useCallback(
    (nodeIndex: number, hit: { citation: string; tier: string }) => {
      if (hit.tier !== 'COURT_SAFE' && hit.tier !== 'VERIFIED') return false
      setChain((c) =>
        c.map((n, i) => {
          if (i !== nodeIndex) return n
          const m = /\[\[CITATION:(\d+)\]\]/.exec(n.content)
          const insertion = m
            ? n.content.replace(m[0], `*${hit.citation}*`)
            : `${n.content}\n\n**Authorities cited:** ${hit.citation}`
          return { ...n, content: insertion }
        }),
      )
      return true
    },
    [],
  )

  return { family, matter, chain, gateBlock, loadFamily, extractContext, spawnVariant, addCitationToDraft }
}
