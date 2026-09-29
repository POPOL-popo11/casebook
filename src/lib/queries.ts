import type { ISODate, RecordSource, Store } from '../contracts/records'
import type { CaseId, PersonId } from '../contracts/types'

// Questions many screens ask of the record store. Pure functions of the store: pass them to
// useStore(), e.g. useStore((s) => unreadFeedbackCount(s, learnerId)).

type Owned = { id: string; source: RecordSource; caseId: CaseId; learnerId: PersonId; startedAt: ISODate; updatedAt: ISODate }

// The contract's rule for which record a page works on: the case's active id when it is this
// learner's own record at this case; otherwise their most recently updated 'user' record there;
// never a demo record. null when they have none yet.
function pickActive(records: Owned[], activeId: string | undefined, caseId: CaseId, learnerId: PersonId): string | null {
  const mine = records.filter((r) => r.source === 'user' && r.caseId === caseId && r.learnerId === learnerId)
  if (activeId !== undefined && mine.some((r) => r.id === activeId)) return activeId
  const latest = (r: Owned) => `${r.updatedAt}|${r.startedAt}`
  return mine.reduce<Owned | null>((best, r) => (!best || latest(r) > latest(best) ? r : best), null)?.id ?? null
}

// The attempt the case steps and the reflect page work on (ui.activeAttempt).
export function activeAttemptId(store: Store, caseId: CaseId, learnerId: PersonId): string | null {
  return pickActive(store.attempts, store.ui.activeAttempt[caseId], caseId, learnerId)
}

// The room session the Decision Room works on (ui.activeRoom).
export function activeRoomId(store: Store, caseId: CaseId, learnerId: PersonId): string | null {
  return pickActive(store.rooms, store.ui.activeRoom[caseId], caseId, learnerId)
}

// Whether a Team Lead has answered this attempt, room, share or growth record.
export function hasFeedback(store: Store, recordId: string): boolean {
  return store.feedback.some((f) => f.about.id === recordId)
}

// Feedback the learner hasn't opened yet (no readAt): the Feedback count in the Learner sidebar.
// The Feedback page sets readAt when it shows a piece of feedback.
export function unreadFeedbackCount(store: Store, learnerId: PersonId): number {
  return store.feedback.filter((f) => f.toId === learnerId && !f.readAt).length
}

// Submitted attempts (revised ones too) and submitted rooms with no feedback yet:
// the Practice Reviews count in the Team Lead sidebar.
export function waitingForReviewCount(store: Store): number {
  const attempts = store.attempts.filter((a) => a.status !== 'in-progress' && !hasFeedback(store, a.id))
  const rooms = store.rooms.filter((r) => r.status === 'submitted' && !hasFeedback(store, r.id))
  return attempts.length + rooms.length
}
