/** Typed API client for the Pleading Chain Engine. */
import { streamRequest } from "./api-client";

// Re-export streamRequest for external use
export { streamRequest };

export interface Bilingual { en: string; hi: string }

export interface Archetype {
  id: string
  kind: 'subsequent' | 'defence' | 'interlocutory' | 'execution' | 'appeal'
  label: Bilingual
  glossary: string[]
  citations: string[]
  stage: string
}

export interface VariantFamily {
  id: string
  label: Bilingual
  base_pleadings: { id: string; label: Bilingual }[]
  variants: Archetype[]
  terminology_depth: string
  court_formats: string[]
}

export interface MatterContext {
  case_id: string
  subject: string
  court: string
  case_no: string
  petitioners: string[]
  respondents: string[]
  stage: string
}

export interface CitationHit {
  id: string
  title: string
  citation: string
  snippet: string
  tier: 'COURT_SAFE' | 'VERIFIED' | 'SECONDARY' | 'PENDING' | 'FATAL_ERROR'
  insertable: boolean
}

async function parseJson<T>(res: Response): Promise<T> {
  if (res.status === 428) {
    const body = await res.json().catch(() => ({}))
    throw Object.assign(new Error(body.detail?.message ?? 'Fact-Fit Gate blocked'), {
      code: 'GATE_BLOCK',
      blocked: body.detail?.blocked ?? [],
    })
  }
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

export const variantsApi = {
  subjects: () =>
    streamRequest("/variants/subjects").then((res: Response) => parseJson<{ id: string; label: Bilingual }[]>(res)),

  family: (subject: string) =>
    streamRequest(`/variants/families?subject=${encodeURIComponent(subject)}`).then((res: Response) => parseJson<VariantFamily>(res)),

  matterContext: (base_draft_md: string, caseId: string, subject: string) =>
    streamRequest("/variants/matter-context", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base_draft_md, case_id: caseId, subject }),
    }).then((res: Response) => parseJson<MatterContext>(res)),

  /** SSE stream of the generated variant. Calls onDelta per chunk. */
  generateStream: (
    payload: { base_draft_md: string; case_id: string; subject: string; archetype_id: string },
    onDelta: (text: string) => void,
    onDone: (citationSlots: number) => void,
    onError: (err: unknown) => void,
  ): AbortController => {
    const ctrl = new AbortController()
    ;(async () => {
      try {
        const res = await streamRequest("/variants/generate", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        })
        if (res.status === 428) {
          const body = await res.json().catch(() => ({}))
          onError(Object.assign(new Error(body.detail?.message ?? 'Fact-Fit Gate blocked'), {
            code: 'GATE_BLOCK', blocked: body.detail?.blocked ?? [],
          }))
          return
        }
        if (!res.ok || !res.body) throw new Error(`generate failed: ${res.status}`)
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const events = buf.split('\n\n')
          buf = events.pop() ?? ''
          for (const ev of events) {
            const line = ev.replace(/^data: /, '')
            if (!line) continue
            const msg = JSON.parse(line)
            if (msg.error) onError(new Error(msg.error))
            else if (msg.done) onDone(msg.citation_slots ?? 0)
            else onDelta(msg.delta ?? '')
          }
        }
      } catch (e) {
        if ((e as Error).name !== 'AbortError') onError(e)
      }
    })()
    return ctrl
  },

  citationSearch: (q: string, limit = 10) =>
    streamRequest("/variants/citations/search", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, limit }),
    }).then((res: Response) => parseJson<{ results: CitationHit[] }>(res)),
}
