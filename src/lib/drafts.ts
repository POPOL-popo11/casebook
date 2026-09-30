import type { CaseDraft, Store } from '../contracts/records'
import { ROUTES } from '../contracts/types'
import { demoPerson } from './catalog'
import { newId, setStore } from './records'

// Create a Case saves a CaseDraft (contracts/records.ts): not playable, not in the Case Library.
// Stores saved before drafts existed have no caseDrafts: read them as none.

export type DraftFields = Omit<CaseDraft, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>

export const DECISION_COUNT = 4

export const blankDraft = (): DraftFields => ({
  title: '',
  teamId: undefined,
  goal: '',
  limits: '',
  materials: [
    { title: '', body: '' },
    { title: '', body: '' },
  ],
  decisions: Array.from({ length: DECISION_COUNT }, () => ''),
})

export const caseDrafts = (store: Store): CaseDraft[] => store.caseDrafts ?? []

export function fieldsOf(draft: CaseDraft): DraftFields {
  return {
    title: draft.title,
    teamId: draft.teamId,
    goal: draft.goal,
    limits: draft.limits,
    materials: draft.materials.map((m) => ({ ...m })),
    decisions: Array.from({ length: DECISION_COUNT }, (_, i) => draft.decisions[i] ?? ''),
  }
}

// Saves the fields as a new draft (id null) or over an existing one; returns the draft's id.
export function saveDraft(id: string | null, fields: DraftFields): string {
  const now = new Date().toISOString()
  const draftId = id ?? newId('draft')
  setStore((store) => {
    const drafts = (store.caseDrafts ??= [])
    const existing = drafts.find((d) => d.id === draftId)
    if (existing) Object.assign(existing, fields, { updatedAt: now })
    else drafts.push({ id: draftId, authorId: demoPerson('senior').id, createdAt: now, updatedAt: now, ...fields })
  })
  return draftId
}

export const draftHref = (id: string) => `${ROUTES.seniorNew}?draft=${encodeURIComponent(id)}`
