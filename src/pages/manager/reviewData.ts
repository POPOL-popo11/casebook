import type { PracticeAttempt, RoomSession, Store } from '../../contracts/records'
import type { CaseContent } from '../../contracts/types'
import { assessAttempt, attemptAtVersion } from '../../lib/assessment'
import { CASES, isPlayable } from '../../lib/content'
import { hasFeedback } from '../../lib/queries'

// What the Team Lead's pages may read (records.ts): attempts and rooms that are not in progress,
// and feedback. Never work reviews, growth records or self-reviews.

export type QueueItem = {
  kind: 'attempt' | 'room'
  id: string
  demo: boolean
  caseId: string
  learnerId: string
  status: 'Submitted' | 'Revised'
  at: string // when it was submitted, or last revised
  reviewed: boolean // a Team Lead has sent feedback on it
  toConfirm: string | null // the key question to confirm, when there is one
}

export const isSubmitted = (record: PracticeAttempt | RoomSession) => record.status !== 'in-progress'

// The index of the latest submitted version: what the Team Lead sees first.
export const latestVersion = (attempt: PracticeAttempt) => Math.max(0, (attempt.versions?.length ?? 0) - 1)

// Whether this is the case's example attempt as seeded: the demo record of the example's learner
// at this case whose original answer is the example's. Only that attempt may show the case's
// review (CaseContent.review), which describes the example and names its learner.
export function isExampleAttempt(attempt: PracticeAttempt, content: CaseContent): boolean {
  const original = attempt.versions?.[0] ?? attempt
  return (
    attempt.source === 'demo' &&
    attempt.caseId === content.id &&
    attempt.learnerId === content.example.juniorId &&
    original.define.goal === content.example.goal &&
    original.decide.optionId === content.example.decision
  )
}

// The first of the case's criteria that the latest version doesn't meet yet, as the question
// a Team Lead looks for. Null when the case has no criteria or every one is met.
export function attemptToConfirm(attempt: PracticeAttempt): string | null {
  if (!isPlayable(attempt.caseId)) return null
  const results = assessAttempt(CASES[attempt.caseId], attemptAtVersion(attempt, latestVersion(attempt)))
  const first = results.find((result) => !result.met)?.criterion
  return first ? first.lookFor || first.label : null
}

// A room's key question: a conflict between the roles they didn't surface, else one they left
// open, else what their recommendation says is unresolved.
export function roomToConfirm(room: RoomSession): string | null {
  const conflicts = CASES[room.caseId]?.room?.conflicts ?? []
  const found = new Map((room.conflicts ?? []).map((c) => [c.conflictId, c]))
  const missed = conflicts.find((c) => !found.has(c.id))
  if (missed) return `Not surfaced: ${missed.text}`
  const open = conflicts.find((c) => found.get(c.id)?.status === 'open')
  if (open) return `Left open: ${open.text}`
  const unresolved = room.recommendation?.unresolved?.trim()
  return unresolved ? `Unresolved: ${unresolved}` : null
}

// Everything submitted, waiting for review first, the newest first within each group.
export function reviewQueue(store: Store): QueueItem[] {
  const attempts = store.attempts.filter(isSubmitted).map(
    (a): QueueItem => ({
      kind: 'attempt',
      id: a.id,
      demo: a.source === 'demo',
      caseId: a.caseId,
      learnerId: a.learnerId,
      status: a.status === 'revised' ? 'Revised' : 'Submitted',
      at: a.versions?.at(-1)?.at ?? a.updatedAt,
      reviewed: hasFeedback(store, a.id),
      toConfirm: attemptToConfirm(a),
    }),
  )
  const rooms = store.rooms.filter(isSubmitted).map(
    (r): QueueItem => ({
      kind: 'room',
      id: r.id,
      demo: r.source === 'demo',
      caseId: r.caseId,
      learnerId: r.learnerId,
      status: 'Submitted',
      at: r.updatedAt,
      reviewed: hasFeedback(store, r.id),
      toConfirm: roomToConfirm(r),
    }),
  )
  return [...attempts, ...rooms].sort((x, y) => Number(x.reviewed) - Number(y.reviewed) || y.at.localeCompare(x.at))
}
