// The shared record: everything people do in Casebook, in one store.
// Owned by the lead. The developer implements it in src/lib/records.ts; every page reads and
// writes through it, so a report always matches what was entered, on any page and for any role.
//
// Storage: the browser's localStorage, key STORE_KEY. It survives page and role switches and
// reloads, and 'Reset demo data' puts back the seed. Nothing is sent to a server, there are no
// accounts and no live AI: this is a local demo, and the technical notes say so.
//
// src/lib/records.ts must export exactly these:
//   useStore<T>(select: (store: Store) => T): T      React hook; re-renders when the selection changes
//   getStore(): Store                                 current store, outside React
//   setStore(recipe: (draft: Store) => void): void    change a copy of the store, then save and notify
//   resetDemo(): void                                 back to SEED_STORE (src/data/seed.ts), then go to the role's home
//   newId(prefix: string): string                     e.g. newId('att') → 'att-lx3k9q'
// A saved store whose seedVersion differs from SEED_VERSION is replaced by the seed on load, so
// data saved before a content change can't point at ids that no longer exist.
//
// Rules every page follows:
// - Every input writes through to the store as it changes. No page keeps its own copy at module level.
// - Which record a page works on: ui.activeAttempt / ui.activeRoom for the case; if none, the viewer's
//   latest record with source 'user'; never a demo record. 'Start practice', Feedback and My Growth set
//   the active id before they navigate.
// - Team Lead pages read only attempts and rooms that are not 'in-progress', shares and feedback.
//   They never read workReviews, growth or selfReviews: a Team Lead sees only what was submitted or shared.
// - A growth record is created once per attempt, room or work review (growthRecordId), never per visit.
// Records with source 'demo' come from the seed and show DEMO_DATA_LABEL (types.ts).

import type {
  CaseId,
  Confidence,
  DimensionId,
  EvidenceColumn,
  EvidenceLevel,
  OptionId,
  PersonId,
  PracticeMode,
  SkillId,
} from './types'

export const STORE_KEY = 'casebook:v1'
export const SEED_VERSION = 2 // the lead bumps this whenever content ids or the record shape change

export type ISODate = string // new Date().toISOString()
export type RecordSource = 'demo' | 'user'

// A link from one record to another, e.g. a growth record to the attempt it came from.
export type RecordRef =
  | { kind: 'attempt'; id: string }
  | { kind: 'room'; id: string }
  | { kind: 'work'; id: string }
  | { kind: 'growth'; id: string }
  | { kind: 'share'; id: string }
  | { kind: 'feedback'; id: string }

// ---------------------------------------------------------------------------
// Individual Practice: one learner working one case through the four steps.
// ---------------------------------------------------------------------------
export interface DecideAnswer {
  optionId: OptionId | 'own' | null // 'own' = their own or conditional plan, written in ownPlan
  ownPlan: string
  fields: Record<string, string> // SubmissionField id → answer (types.ts)
  basedOn: string[] // evidence card ids, material ids or request ids they relied on
  why: string
  mainRisk: string // the risk that remains
  owner: string // who owns the next action or the risk
  reviewBy: string // when to review, e.g. 'End of week 4'
  changeMind: string // what would change their mind
  confidence: Confidence | null
}

export interface AttemptDefine {
  goal: string
  success: string[]
  people: string[]
  initialPosition: { recommendation: string; reason: string; confidence: Confidence | null; question: string }
}

export interface AttemptExamine {
  sort: Record<string, EvidenceColumn | 'unsorted'> // evidence card id → column; they can move a card later
  reasons: Record<string, string> // evidence card id → one sentence on why
  missing: string[]
}

export interface AttemptInvestigate {
  requests: { requestId: string; intent: string; at: ISODate }[] // intent = 'what I want to confirm'
}

export interface PracticeAttempt {
  id: string // 'att-…'
  source: RecordSource
  caseId: CaseId
  caseVersion?: string // CaseSummary.version when started
  learnerId: PersonId
  mode: 'individual'
  startedAt: ISODate
  updatedAt: ISODate
  status: 'in-progress' | 'submitted' | 'revised'
  viewedExample: boolean // they opened 'View example' for this case before submitting
  define: AttemptDefine
  examine: AttemptExamine
  investigate: AttemptInvestigate
  decide: DecideAnswer // the working draft
  // Every submit adds a full snapshot. versions[0] is the original answer and never changes; a
  // revision adds another with whyChanged. The Team Lead can open any version.
  versions: { at: ISODate; define: AttemptDefine; examine: AttemptExamine; investigate: AttemptInvestigate; decide: DecideAnswer; whyChanged: string }[]
  variant?: { answer: string; at: ISODate } // the changed-condition challenge after submitting
  growthRecordId?: string
}

// ---------------------------------------------------------------------------
// Team Decision Room: one human plays a role; the other roles are scripted AI roles.
// ---------------------------------------------------------------------------
export interface RoomMessage {
  id: string
  at: ISODate
  from: string // a CaseRole id; the human's role id for the learner's own messages
  to: string // a CaseRole id, or 'all'
  kind: 'question' | 'answer' | 'challenge' | 'proposal' | 'share'
  text: string
  demo: boolean // true for every AI role message: shown with DEMO_RESPONSE_LABEL
  questionId?: string // the RoomQuestion it asked or answered
  replyId?: string // the RoomScript reply that answered it
}

export interface RoomSession {
  id: string // 'room-…'
  source: RecordSource
  caseId: CaseId
  caseVersion?: string
  learnerId: PersonId
  roleId: string // the role the human plays
  startedAt: ISODate
  updatedAt: ISODate
  status: 'in-progress' | 'submitted'
  initialPosition: { recommendation: string; reason: string; confidence: Confidence | null }
  messages: RoomMessage[]
  sharedEvidence: { id: string; text: string; sourceRoleId: string; messageId: string; at: ISODate }[]
  openQuestions: { id: string; text: string; ownerRoleId: string; status: 'open' | 'resolved' | 'unknown' }[]
  conflicts: { conflictId: string; handling: string; status: 'resolved' | 'open' }[] // RoomScript conflicts once found
  recommendation: { plan: string; tradeoffs: string; unresolved: string; owner: string; reviewBy: string; evidenceIds: string[] } // evidenceIds: sharedEvidence ids it uses
  reflection: { changedMind: string; stillUncertain: string } // 'What changed your mind, and why?' / 'What do you still disagree with or remain uncertain about?'
  growthRecordId?: string
}

// ---------------------------------------------------------------------------
// Work & Grow: a learner reviews a piece of their own work.
// ---------------------------------------------------------------------------
export interface WorkReview {
  id: string // 'work-…'
  source: RecordSource
  learnerId: PersonId
  createdAt: ISODate
  updatedAt: ISODate
  step: 'review' | 'reasoning' | 'focus' | 'practise' | 'done' // A–D, then the growth record
  work: {
    role: string
    developmentGoal: string
    context: string
    aiOutput: string
    finalVersion: string
    outcome: 'shipped' | 'in-progress' | 'outcome-pending'
    loadedExample: boolean // true when they pressed 'Load example' instead of pasting their own
  }
  reasoning: {
    changed: string // what I changed
    verified: string // what I checked
    uncertain: string // what I'm still unsure about
    clarifications: { questionId: string; question: string; answer: string }[]
  }
  focus: {
    skillId: SkillId
    title: string
    reason: string
    evidence: string[]
    response: 'confirmed' | 'corrected' | 'mastered' | 'not-relevant' | 'not-enough-info' | null
    correction: string // what the learner said when they corrected it, or what they reported
    adjusted: boolean // true when the app changed its suggestion after the learner's response
  }
  practise: { answer: string; feedback: string; revision: string; nextAction: string }
  growthRecordId?: string
}

// ---------------------------------------------------------------------------
// My Growth: evidence records, sharing, feedback and the self-review draft.
// ---------------------------------------------------------------------------
// 'Practice evidence' / 'Workplace evidence'. Manager feedback is shown from Feedback records;
// nobody creates a growth record of kind 'manager'.
export type GrowthKind = 'practice' | 'workplace' | 'manager'

// Honesty rules for growth records:
// - level: set only by the learner's own confirmation or a Team Lead's feedback; otherwise 'not-observed'.
// - prompting: 'some' if they opened View example before submitting or revised after the app's
//   feedback, otherwise 'none'. Work & Grow: 'some' if they used the clarifying questions' hints.
// - outcome: practice and room records are always 'practice-only' (a practice result is never a
//   real result). Workplace records take work.outcome: 'shipped' becomes 'outcome-pending' until the
//   learner states the result; nothing becomes 'achieved' without the learner saying so.
// - The self-review's Contributions cite only workplace records; an 'outcome-pending' record never
//   produces a claim about results.
export interface GrowthRecord {
  id: string // 'gr-…'
  source: RecordSource
  learnerId: PersonId
  date: ISODate
  kind: GrowthKind
  skillId: SkillId
  situation: string
  contribution: string // what they did themselves
  evidence: { text: string; ref?: RecordRef }[]
  prompting: 'none' | 'some' | 'a-lot'
  level: EvidenceLevel // 'not-observed' is allowed and honest
  outcome: 'achieved' | 'partly' | 'not-achieved' | 'outcome-pending' | 'practice-only'
  learning: string // what they learned
  nextStep: string
  privateNote: string // never shared, never in a share snapshot
  links: RecordRef[]
}

// What the Team Lead receives: an exact copy, frozen at the moment of sharing. No private notes.
export interface SharedItem {
  recordId: string
  title?: string // a short heading (e.g. a Work & Grow record's first clause); the full situation stays in situation
  date: ISODate
  kind: GrowthKind
  skillId: SkillId
  situation: string
  contribution: string
  evidence: string[]
  outcome: GrowthRecord['outcome']
  learning: string
  nextStep: string
}

export interface Share {
  id: string // 'share-…'
  source: RecordSource
  learnerId: PersonId
  managerId: PersonId
  sharedAt: ISODate
  items: SharedItem[]
}

export interface Feedback {
  id: string // 'fb-…'
  source: RecordSource
  fromId: PersonId // the Team Lead
  toId: PersonId // the learner
  at: ISODate
  // What it answers: an attempt or room (Practice Reviews), or one shared growth record (Shared
  // Growth: kind 'growth' with the item's recordId, plus shareId).
  about: RecordRef
  shareId?: string
  version?: number // the attempt version reviewed (index into versions)
  strength: string // one thing done well
  improvement: string // the most important improvement
  followUp: string // one follow-up question
  focusSkillId?: SkillId // the Team Lead's 'Next focus'
  nextAction: string // the learner's own next action, filled in on Feedback
  dimensions?: { id: DimensionId; level: EvidenceLevel; note: string }[] // on a practice or room review
  readAt?: ISODate
}

// A performance-review draft built only from chosen records; every statement names its sources.
// Sources may be growth record ids ('gr-…') or feedback ids ('fb-…').
export interface SelfReview {
  id: string // 'sr-…'
  learnerId: PersonId
  createdAt: ISODate
  updatedAt: ISODate
  from: ISODate
  to: ISODate
  recordIds: string[]
  sections: Record<'contributions' | 'growth' | 'challenges' | 'nextGoals', { text: string; sourceRecordIds: string[] }[]>
}

// ---------------------------------------------------------------------------
// The store
// ---------------------------------------------------------------------------
export interface Store {
  version: 1
  seedVersion: number // SEED_VERSION of the seed it started from
  attempts: PracticeAttempt[]
  rooms: RoomSession[]
  workReviews: WorkReview[]
  growth: GrowthRecord[]
  shares: Share[]
  feedback: Feedback[]
  selfReviews: SelfReview[]
  ui: {
    viewMode: Record<CaseId, 'example' | 'practice'> // what the case steps show for each case
    activeAttempt: Record<CaseId, string> // the attempt the steps and reflect page work on
    activeRoom: Record<CaseId, string> // the room session the Decision Room works on
    expertCaseId?: CaseId // the case My Cases opened on Create a Case (Share, Breakdown)
  }
}

export type { PracticeMode }
