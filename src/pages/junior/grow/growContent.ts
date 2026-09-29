import type { GrowthRecord, RecordRef, Store } from '../../../contracts/records'
import { casePageHref, ROUTES, type CaseId, type PersonId } from '../../../contracts/types'
import { CASE_SUMMARIES, demoPerson, PEOPLE, skillLabel } from '../../../lib/content'
import { formatDate, GROWTH_KIND_DOTS, GROWTH_KIND_LABELS, levelLabel, OUTCOME_LABELS } from '../../../lib/labels'
import { setStore } from '../../../lib/records'
import { WORK_GROW } from '../../../data/workGrow'
import { mentionsAny } from '../../../lib/assessment'

// What the three growth screens share: the Work & Grow script, the labels and a few lookups.
// No lookup here throws: records can name ids that the registries do not hold yet.

// The Work & Grow script (src/data/workGrow.ts).
export { WORK_GROW }

// Word-start matching, the same rule as the case feedback: 'ops' does not match 'stops'.
export { mentionsAny }

// The signed-in learner and the Team Lead they share with.
function demoId(role: 'junior' | 'manager', fallback: PersonId): PersonId {
  try {
    return demoPerson(role).id
  } catch {
    return fallback
  }
}
export const LEARNER_ID: PersonId = demoId('junior', 'alex')
export const TEAM_LEAD_ID: PersonId = demoId('manager', 'sam')

// Labels shared with the Team Lead's pages (lib/labels.ts), so both say the same thing.
export const KIND_LABELS = GROWTH_KIND_LABELS
export const KIND_DOTS = GROWTH_KIND_DOTS
export { formatDate, levelLabel, OUTCOME_LABELS, skillLabel }

export const PROMPTING_LABELS: Record<GrowthRecord['prompting'], string> = {
  none: 'None',
  some: 'Some',
  'a-lot': 'A lot',
}

export function personName(personId: PersonId): string {
  return PEOPLE.find((p) => p.id === personId)?.name ?? personId
}

export function personInitials(personId: PersonId): string {
  return PEOPLE.find((p) => p.id === personId)?.initials ?? personId.slice(0, 2).toUpperCase()
}

export function caseName(caseId: CaseId): string {
  const summary = CASE_SUMMARIES.find((s) => s.id === caseId)
  return summary?.shortName ?? summary?.title ?? caseId
}

export function nowIso(): string {
  return new Date().toISOString()
}

// Lower case, straight quotes, single spaces: how the keyword and quote rules compare text.
export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// A Work & Grow record: its situation is the whole task the learner pasted, so it gets a short title.
export function fromWorkGrow(record: GrowthRecord): boolean {
  return record.kind === 'workplace' && record.links.some((l) => l.kind === 'work')
}

// The short title: the first clause, 60 characters or fewer, cut at a word if it is longer.
// 'Write the launch plan for a client, an outdoor-gear retailer, that…' → 'Write the launch plan for a client'.
export const TITLE_MAX = 60
const clauseEnd = (text: string) => text.trim().replace(/[.;:,\s]+$/, '')
export function shortTitle(situation: string): string {
  const first = clauseEnd(situation.replace(/\s+/g, ' ').trim().split(/[,;:.?!](?=\s)|\s[–—]\s/)[0] ?? '')
  if (first.length <= TITLE_MAX) return first
  const cut = first.slice(0, TITLE_MAX - 1)
  const space = cut.lastIndexOf(' ')
  return `${clauseEnd(space > 0 ? cut.slice(0, space) : cut)}…`
}

// How a record is titled: a Work & Grow record by its short title, any other by its situation.
export function recordTitle(record: GrowthRecord): string {
  return fromWorkGrow(record) ? shortTitle(record.situation) : record.situation
}

type RefStore = Pick<Store, 'attempts' | 'rooms' | 'growth'>

// Where a record reference leads, and what the link says.
export function refLink(ref: RecordRef, store: RefStore): { href: string; label: string } {
  switch (ref.kind) {
    case 'attempt': {
      const attempt = store.attempts.find((a) => a.id === ref.id)
      if (!attempt) return { href: ROUTES.juniorHome, label: 'Practice attempt' }
      return { href: casePageHref(attempt.caseId, 'reflect'), label: `${caseName(attempt.caseId)} · practice attempt` }
    }
    case 'room': {
      const room = store.rooms.find((r) => r.id === ref.id)
      if (!room) return { href: ROUTES.juniorHome, label: 'Team Decision Room' }
      return { href: casePageHref(room.caseId, 'room'), label: `${caseName(room.caseId)} · Team Decision Room` }
    }
    case 'work':
      return { href: ROUTES.juniorGrow, label: 'Work & Grow review' }
    case 'growth': {
      const record = store.growth.find((g) => g.id === ref.id)
      const label = record ? `${KIND_LABELS[record.kind]} · ${skillLabel(record.skillId)} · ${formatDate(record.date)}` : 'Growth record'
      return { href: ROUTES.juniorGrowth, label }
    }
    case 'share':
      return { href: ROUTES.juniorGrowth, label: 'Shared growth records' }
    case 'feedback':
      return { href: ROUTES.juniorFeedback, label: 'Feedback' }
  }
}

// Before a link opens an attempt's reflect page or a room, make it the case's active record, so
// the page opens that record (records.ts: 'Feedback and My Growth set the active id').
export function openRef(ref: RecordRef): void {
  if (ref.kind !== 'attempt' && ref.kind !== 'room') return
  setStore((draft) => {
    if (ref.kind === 'attempt') {
      const attempt = draft.attempts.find((a) => a.id === ref.id)
      if (attempt) draft.ui.activeAttempt = { ...draft.ui.activeAttempt, [attempt.caseId]: attempt.id }
    } else {
      const room = draft.rooms.find((r) => r.id === ref.id)
      if (room) draft.ui.activeRoom = { ...draft.ui.activeRoom, [room.caseId]: room.id }
    }
  })
}
