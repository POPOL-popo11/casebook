import type { GrowthKind, GrowthRecord } from '../contracts/records'
import { EVIDENCE_LEVELS } from '../contracts/types'

// Display words for record fields, shared by the learner's and the Team Lead's pages so both say
// the same thing. The wording matches developer-junior #2's My Growth screens.

// Every record shows where its evidence came from (requirements §7).
export const GROWTH_KIND_LABELS: Record<GrowthKind, string> = {
  practice: 'Practice evidence',
  workplace: 'Workplace evidence',
  manager: 'Manager feedback',
}

// The legend dot beside each kind.
export const GROWTH_KIND_DOTS: Record<GrowthKind, string> = {
  practice: 'dot--neutral',
  workplace: 'dot--accent',
  manager: 'dot--lead', // v3: teal for Team Lead feedback
}

export const OUTCOME_LABELS: Record<GrowthRecord['outcome'], string> = {
  achieved: 'Achieved',
  partly: 'Partly achieved',
  'not-achieved': 'Not achieved',
  'outcome-pending': 'Outcome pending',
  'practice-only': 'Practice only',
}

// 'Demonstrated independently' … 'Not observed'. Never throws.
export function levelLabel(level: string): string {
  return EVIDENCE_LEVELS.find((l) => l.id === level)?.label ?? level
}

// '29 Sep 2026'. A value that isn't a date shows as it is.
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
