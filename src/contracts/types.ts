// The contract for Casebook, shared by every agent.
// Owned by the lead. Other agents read it and never edit it.
// Phase 2: replace and add case content. Pages keep the layout of design/casebook/*.png;
// every case-related string lives in src/data/ and is typed by the interfaces below.
// Generic UI copy (buttons, navigation, headings that never change between cases) stays in the pages.

export type Role = 'senior' | 'junior' | 'manager'

// What each role is called on screen. Code and routes keep the old ids.
export const ROLE_LABELS: Record<Role, string> = {
  junior: 'Learner',
  senior: 'Case Expert',
  manager: 'Team Lead',
}

// ---------------------------------------------------------------------------
// ID rules
// ---------------------------------------------------------------------------
// caseId      lowercase kebab-case, unique across all cases, never changes once it appears in a URL ('japan-launch')
// personId    lowercase first name ('dana')
// teamId      lowercase kebab-case ('solutions')
// skillId     lowercase kebab-case ('framing')
// Inside one case, in display order, starting at 1, with no gaps:
//   materials m1, m2 …   evidence cards c1, c2 …   info requests r1, r2 …
//   decision points dp1–dp4, one per CaseStep in step order
//   options 'A', 'B', 'C' … (escalating to a senior is fixed UI, id 'escalate')
// Cross-references always use ids, never display text.
export type CaseId = string
export type PersonId = string
export type TeamId = string
export type SkillId = string
export type OptionId = string // 'A', 'B', 'C' … or 'escalate'

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
// The shell (developer) owns routing and the sidebar; pages render only the main area.
// Routes with ':caseId' or ':attemptId' are patterns; build them with the href helpers below.
// Overnight build (2026-09-30): screens marked 'new' have no design image. They reuse the
// existing tokens and primitives so they look like the designed screens.
export const ROUTES = {
  landing: '#/', // 01-landing.png, no sidebar
  signIn: '#/sign-in', // 10-sign-in.png, no sidebar
  // Case Expert (role 'senior')
  seniorCases: '#/senior/cases', // new: My Cases
  seniorShare: '#/senior/share', // 02-senior-share.png: Create a Case, step 1
  seniorBreakdown: '#/senior/breakdown', // 03-senior-breakdown.png: Create a Case, step 2
  seniorSkills: '#/senior/skills', // new: Skill Frameworks
  seniorNew: '#/senior/new', // new: Create a Case, a blank form saved as a CaseDraft (records.ts); ?draft=<id> reopens one
  // Learner (role 'junior')
  juniorHome: '#/junior', // 04-junior-home.png: Case Library
  juniorInProgress: '#/junior/in-progress', // kept for old links; not in the navigation
  juniorGrow: '#/junior/grow', // new: Work & Grow
  juniorGrowth: '#/junior/growth', // new: My Growth
  juniorFeedback: '#/junior/feedback', // new: Feedback
  juniorCase: '#/junior/case/:caseId', // new: case details, mode and example/practice choice
  juniorDefine: '#/junior/case/:caseId/define', // 05-junior-define.png
  juniorExamine: '#/junior/case/:caseId/examine', // 06-junior-examine.png
  juniorInvestigate: '#/junior/case/:caseId/investigate', // 07-junior-investigate.png
  juniorDecide: '#/junior/case/:caseId/decide', // 08-junior-decide.png
  juniorReflect: '#/junior/case/:caseId/reflect', // new: after submitting: feedback, revise, variant
  juniorRoom: '#/junior/case/:caseId/room', // new: Team Decision Room
  // Team Lead (role 'manager')
  managerReviews: '#/manager', // new list: Practice Reviews (the queue)
  managerReview: '#/manager/review/:attemptId', // 09-manager-review.png, reworked: one attempt or room
  managerTeam: '#/manager/team', // new: Shared Growth
} as const

export type RouteKey = keyof typeof ROUTES

export type CaseStep = 'define' | 'examine' | 'investigate' | 'decide'
export const CASE_STEPS: CaseStep[] = ['define', 'examine', 'investigate', 'decide']

export function caseHref(caseId: CaseId, step: CaseStep): string {
  return `#/junior/case/${caseId}/${step}`
}

// The other case pages: details (mode and example/practice), after submitting, the team room.
export function casePageHref(caseId: CaseId, page: 'details' | 'reflect' | 'room'): string {
  return page === 'details' ? `#/junior/case/${caseId}` : `#/junior/case/${caseId}/${page}`
}

// One practice attempt or team room session on the Team Lead's review page (see records.ts ids).
export function reviewHref(attemptId: string): string {
  return `#/manager/review/${attemptId}`
}

export type PracticeMode = 'individual' | 'team'

// The five things a Team Lead assesses, and the four levels of evidence (never a score).
export const DIMENSIONS = [
  { id: 'goal', label: 'Goal understanding', lookFor: 'Did they confirm what the client or team really needs?' },
  { id: 'evidence', label: 'Use of evidence', lookFor: 'Did they separate facts, forecasts and assumptions, and say why?' },
  { id: 'information', label: 'Information gathering', lookFor: 'Did they ask the questions that could change the decision?' },
  { id: 'tradeoffs', label: 'Trade-off quality', lookFor: 'Did they explain the gains, the costs and the risk that remains?' },
  { id: 'updating', label: 'Updating judgement', lookFor: 'Faced with new information, did they hold or change their view for a reason?' },
] as const
export type DimensionId = (typeof DIMENSIONS)[number]['id']

export const EVIDENCE_LEVELS = [
  { id: 'independent', label: 'Demonstrated independently' },
  { id: 'prompted', label: 'Demonstrated with prompting' },
  { id: 'practice', label: 'Needs further practice' },
  { id: 'not-observed', label: 'Not observed' },
] as const
export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number]['id']

// Labels for anything the app did not get from a person. Preset content is never shown as live AI.
export const DEMO_RESPONSE_LABEL = 'Demo response' // a preset answer from an AI role or the app
export const DEMO_DATA_LABEL = 'Demo data' // a seeded record, not something the viewer did
export const FICTIONAL_LABEL = 'Fictional training scenario' // on every case's details page

// ---------------------------------------------------------------------------
// Registries (src/data/people.ts, teams.ts, skills.ts)
// ---------------------------------------------------------------------------
export interface Person {
  id: PersonId
  name: string // 'Dana K.'
  title?: string // 'Senior Consultant'; required for anyone shown in the sidebar or on Sign in
  initials: string // 'DK'
  role: Role
}

export interface Team {
  id: TeamId
  label: string // 'Solutions'; shown as the case eyebrow and on library cards
}

export interface Skill {
  id: SkillId
  label: string // 'Problem Framing'
}

// The six skills (requirements §2–3), fixed tonight. skills.ts has exactly these ids.
// A practice growth record uses its case's first skillId; a Decision Room record uses 'collaboration'.
// Pages show a skill through a lookup that never throws (skillLabel in src/lib/content.ts).
export const SKILL_IDS = ['framing', 'evidence', 'investigation', 'decision', 'collaboration', 'escalation'] as const

// ---------------------------------------------------------------------------
// The case library (src/data/library.ts)
// ---------------------------------------------------------------------------
// Optional fields are only needed where a page shows them; leave them out rather than inventing values.
export interface CaseSummary {
  id: CaseId
  title: string // 'Payment setup for a Japan launch'
  shortName?: string // 'Japan launch'; required for playable cases (the Manager header reads '<junior> · <shortName> case')
  teamId: TeamId
  authorId?: PersonId // the senior who shared it; the library card shows them when present
  minutes?: number // shown on the library card unless the case is in progress
  focus?: string // what it trains, e.g. 'Facts vs. assumptions'; required for the recommended case
  playable: boolean // true only when src/data/cases/<id>.ts exists; otherwise the details page shows a Preview
  progress?: { step: number; of: number } // library card shows 'In progress' and 'Step <step> of <of>'
  // Overnight additions, shown on the card and on the case details page (also for Preview cases):
  blurb?: string // one sentence under the card title
  skillIds?: SkillId[] // 'Skills to practise'
  modes?: PracticeMode[] // which modes the case offers; a Preview case offers none yet
  yourRole?: string // 'Your role' on the details page, e.g. 'Solutions consultant'
  submits?: string // 'What you will submit', e.g. 'Launch Recommendation'
  materialsPreview?: string[] // Preview cases: the material titles a learner would get
  roleTitles?: string[] // Preview cases: the roles in the team mode
  version?: string // 'v1'; attempts and rooms record the version they used
}

// ---------------------------------------------------------------------------
// One playable case (src/data/cases/<caseId>.ts)
// ---------------------------------------------------------------------------
export type EvidenceColumn = 'verified' | 'needs-checking' | 'assumption' | 'weak'
export type Confidence = 'low' | 'medium' | 'high'

export interface Material {
  id: string // m1 …
  title: string // 'Discovery call notes'
  visibility: 'start' | 'request' // visible from the start, or unlocked by a request
  body?: string // the full text, opened from the material's name; '\n' is a line break, '|' rows are a small table
  source?: string // who made it, e.g. 'Client call, notes by Dana K.'
  date?: string // e.g. 'Week 1, Monday'
  scope?: string // what it covers and what it doesn't, e.g. 'AU store only, Jan–Jun'
  roleId?: string // team mode: only this role holds it at the start (a CaseRole id)
}

export interface Constraint {
  label: string // '8-week deadline' or 'Budget?'
  known: boolean // false renders as a dashed chip
}

export interface EvidenceCard {
  id: string // c1 …
  text: string // 'Cards accepted, AUD only'
  source: string // 'Checkout config'
}

export interface InfoRequest {
  id: string // r1 …
  title: string // 'Refund history'
  hours: number // in 0.5 h steps
  why?: string // the reason line, without the 'Why:' prefix
  finding?: { label: string; text: string } // the unlocked card; a request without one shows the page's placeholder
  materialId?: string // the 'request' material it unlocks
}

export interface DecisionOption {
  id: OptionId // 'A', 'B', 'C' …
  label: string // 'Pilot on cards, then review'
  tradeoff: string // 'Launch on time, learn demand'
}

export interface DecisionPoint {
  id: string // dp1–dp4
  step: CaseStep
  title: string // 'Sort the evidence'
  question: string // 'Which materials are facts, and which are assumptions?'
  status: 'confirmed' | 'review'
  reviewPrompt?: string // required when status is 'review'
  chips?: string[] // e.g. ['Refund history', 'Entity status']
}

// The senior's reference answers: a reference, not an answer key.
export interface SeniorReference {
  decision: OptionId // shown as 'Your call' on Share a case
  why: string
  // Filled in phase 2: one reference answer and its reason per decision point.
  byPoint?: Record<string, { answer: string; reason: string }> // decisionPointId → answer
  goal?: string
  success?: string[]
  sort?: Record<string, EvidenceColumn> // evidence card id → column
  requestIds?: string[]
}

// The example attempt that 'View example' shows, read-only, on every step.
export interface ExampleAttempt {
  initialPosition?: { recommendation: string; reason: string; confidence: Confidence; question: string }
  sortReasons?: Record<string, string> // evidence card id → why it sits in that column
  requestIntents?: Record<string, string> // request id → 'what I want to confirm'
  ownPlan?: string // their own plan or conditional recommendation, when not only an option
  submission?: Record<string, string> // SubmissionField id → answer
  whyChanged?: string // what changed their mind between Define and Decide
  juniorId: PersonId
  goal: string
  success: string[]
  people: string[] // chips under 'People involved'
  sort: Record<string, EvidenceColumn | 'unsorted'> // where each evidence card starts on Examine
  missing: string[] // chips under 'Missing'
  requestedIds: string[] // requests already made on Investigate
  decision: OptionId // preselected on Decide
  basedOn: string[] // 'Based on' chips
  why: string
  mainRisk: string
  changeMind: string
  confidence: Confidence
  note: string // the junior's note shown to the manager
}

export interface ReviewRow {
  label: string // 'Goal'
  junior: string
  senior: string
  match: 'aligned' | 'differs'
}

// The Team Lead's review of the example attempt.
export interface ManagerReview {
  dimensions?: { id: DimensionId; level: EvidenceLevel; note: string; evidence: string }[] // replaces rows as the main view
  feedback?: { strength: string; improvement: string; followUp: string }
  managerId: PersonId
  submittedWhen: string // 'today'
  minutes: number // 26
  rows: ReviewRow[]
  blindSpots: string[]
  confirmQuestions: string[]
  feedbackDraft: string
  nextFocus: SkillId[] // chips offered under 'Next focus', in order
  nextFocusDefault: SkillId
}

export interface CaseContent {
  id: CaseId // must match a CaseSummary with playable: true
  background: string // Share a case → Background
  brief: string // Define → Brief
  materials: Material[]
  framePrompt: string // Define → the question callout
  constraints: Constraint[]
  cards: EvidenceCard[]
  requests: InfoRequest[]
  timeBudgetHours: number
  options: DecisionOption[] // A, B, C …; escalation is fixed UI
  decisionPoints: DecisionPoint[] // exactly four, dp1–dp4, one per CaseStep
  skillIds: SkillId[] // skills this case trains; selected on Review the breakdown
  senior: SeniorReference
  outcome: string // Share a case → Outcome, shown to juniors only after they decide
  // Required until the pages handle a case without them (developer, tonight); then they become optional
  // and a case without an example offers only 'Start practice'.
  example: ExampleAttempt // what 'View example' shows
  review: ManagerReview // the Team Lead's review of the example attempt
  // Overnight additions:
  goal?: string // what the work must achieve
  limits?: { deadline?: string; budget?: string; unacceptable?: string; authority?: string } // authority: what the learner may decide alone
  submission?: { name: string; fields: SubmissionField[] } // the final submission on Decide, e.g. 'Launch Recommendation'
  assessment?: Assessment // how Case Experts and Team Leads judge the reasoning; never shown to the learner before they submit
  variant?: Variant // the changed-condition follow-up after submitting
  roles?: CaseRole[] // team mode: the roles in the Decision Room
  room?: RoomScript // team mode: who the human plays and what the AI roles can answer
}

export interface SubmissionField {
  id: string // kebab-case, unique in the case: 'scope', 'preconditions'
  label: string // 'Launch scope'
  hint?: string // placeholder text
}

// The app's feedback after submitting is computed from these rules by src/lib/assessment.ts
// (developer): assessAttempt(content, attempt) → one result per criterion, so changing an answer
// changes the feedback and the Team Lead's grouping. Every criterion has at least one rule (a
// criterion with none is never met). ifMentions matches at the start of a word, ignoring case, in
// the initial position, why, ownPlan, every submission field, mainRisk, owner, reviewBy and changeMind:
// 'refund' matches 'refunds'; 'ops' does not match 'stops'. A criterion is met when every rule it has passes:
//   requestIds: the attempt requested all of them;  ifMentions: the answers mention at least one;
//   fields: those submission fields are filled (at least 8 characters; the feedback then names any that are empty or too short).
export interface AssessmentCriterion {
  id: string // kebab-case, unique in the case
  label: string // 'Confirms the client’s hard and negotiable needs'
  lookFor: string // for Case Experts and Team Leads
  dimensionId: DimensionId // which of the five dimensions it informs
  requestIds?: string[]
  ifMentions?: string[] // lower-case words or phrases, matched in the initial position, why, ownPlan, mainRisk, owner, reviewBy, changeMind and every submission field
  // Where ifMentions looks. Default: every answer listed above. Use it when the words only count in one
  // place, e.g. a promise made in the customer reply field. Keys: 'initialPosition', 'why', 'ownPlan',
  // 'mainRisk', 'owner', 'reviewBy', 'changeMind', 'examineReasons' (all Examine sort reasons), or a SubmissionField id.
  mentionsIn?: string[]
  notBasedOn?: string[] // ids (evidence cards, materials, requests) that must NOT be in the final decide.basedOn for the criterion to be met
  fields?: string[] // SubmissionField ids
  met: string // feedback when met: what they did, quoting nothing they didn't write
  notYet: string // feedback when not met: what to look at next, without giving the answer away
}

export interface Assessment {
  criteria: AssessmentCriterion[]
  commonMisses: string[]
  acceptableAlternatives: string[] // different plans that are also sound
  mustEscalate: string[] // situations the learner must not decide alone
}

export interface Variant {
  title: string // 'The client changes its mind'
  changedFact: string // the one new fact the learner sees, as a short material
  lookFor: string // for Case Experts and Team Leads only: what the variant tests
}

export interface CaseRole {
  id: string // kebab-case, unique in the case: 'client-lead'
  title: string // 'Client Lead'
  goal: string
  knows: string[] // their own information, from the case materials
  limits: string
  canNegotiate: string
  cannotDecide: string
}

// The Decision Room is scripted: the human plays one role, the others are AI roles whose every
// answer is written here from the case materials and shown with DEMO_RESPONSE_LABEL.
// Anything outside the script gets unknownAnswer; an AI role never invents a fact.
export interface RoomScript {
  humanRoleId: string // a CaseRole id
  aiRoleIds: string[] // the other roles, answered from the script
  // The roles a learner may choose to play (default: [humanRoleId]). When they play another one, every
  // other role, humanRoleId included, is an AI role; questions to the role they play are hidden, and
  // count as asked when checking which conflicts were found (they already hold that information).
  // Questions, replies and challengeReplies may be addressed to any role in the room.
  playableRoleIds?: string[]
  questions: RoomQuestion[] // what the human can ask; shown as suggestions per role
  unknownAnswer: string // 'That isn’t in my brief, so I don’t know.'
  // When the human writes to an AI role (a challenge, a proposal, or sharing a fact), the first reply
  // whose words appear in the message answers; otherwise challengeReplies[role]; otherwise unknownAnswer.
  replies?: { id: string; toRoleId: string; ifMentions: string[]; text: string; materialId?: string }[]
  challengeReplies?: Record<string, string> // AI role id → reply when the human disagrees or proposes a plan
  // A conflict between roles counts as found once every question in revealedBy has been asked.
  conflicts?: { id: string; text: string; between: string[]; revealedBy: string[] }[] // between: role ids; revealedBy: question ids
}

export interface RoomQuestion {
  id: string // q1, q2 … in display order
  toRoleId: string // an AI role
  text: string // the question as the learner asks it
  answer: string // the AI role's answer, only from its own information
  reveals?: string // a fact the learner can add to Shared evidence
  materialId?: string // the material the answer comes from
}

// ---------------------------------------------------------------------------
// Other content (src/data/profile.ts, landing.ts)
// ---------------------------------------------------------------------------
export interface JuniorProfile {
  juniorId: PersonId
  skills: { skillId: SkillId; level: number; focus?: boolean }[] // 0–5 filled segments, in display order
  feedback: { fromId: PersonId; text: string } // "Sam's feedback" on the library page
}

export interface LandingFeature {
  caseId: CaseId // the case in the landing collage
  sortPreview: { text: string; column: EvidenceColumn }[] // the 'Sort what you know' card
  quote: { fromId: PersonId; text: string } // the dark feedback card
}

// ---------------------------------------------------------------------------
// Overnight additions: Skill Frameworks and Work & Grow (src/data/frameworks.ts, workGrow.ts)
// ---------------------------------------------------------------------------
// A Case Expert's skill template for one function: observable behaviours, never scores.
export interface SkillFramework {
  id: string // kebab-case
  teamId: TeamId
  title: string // 'Solutions & Implementation: junior to senior'
  levels: string[] // column headings, e.g. ['Getting started', 'Independent', 'Ready for senior']
  skills: { skillId: SkillId; behaviours: string[] }[] // one behaviour per level, same order as levels
}

// Work & Grow is scripted too: the app's questions, suggestion and feedback are preset, shown
// with DEMO_RESPONSE_LABEL, and chosen by simple rules over what the learner wrote.
export interface WorkSample {
  learnerId: PersonId
  role: string // 'Solutions consultant'
  developmentGoal: string
  context: string // the task
  aiOutput: string // what an AI tool drafted
  finalVersion: string // what the learner actually sent
  outcome: 'shipped' | 'in-progress' | 'outcome-pending'
  exampleReasoning?: { changed: string; verified: string; uncertain: string } // 'Load example' also fills step B with these
}

export interface WorkGrowScript {
  sample: WorkSample // 'Load example' fills step A with it
  clarifyingQuestions: { id: string; text: string; why: string; askUnless?: string[] }[] // step B; skipped when the explanation mentions an askUnless word
  focus: {
    skillId: SkillId
    title: string // 'Cross-team dependency management'
    reason: string // what the sample shows and what it doesn't yet show
    evidence: string[] // short quotes from the sample; only quotes found in the learner's own text are shown
    noEvidenceReason: string // shown instead of reason when none of the evidence is in the learner's text
    // The app never insists. Any non-empty correction changes the suggestion and sets the level to
    // 'not-observed'; a correction with one of these words gets afterCorrection, any other gets
    // unmatchedCorrection. 'mastered' and 'not-relevant' record 'not-observed' with 'Learner reports: …';
    // 'not-enough-info' asks moreInfoQuestion.
    correctionKeywords: string[]
    afterCorrection: { skillId: SkillId; title: string; reason: string }
    unmatchedCorrection: { title: string; reason: string }
    moreInfoQuestion: string
  }
  challenge: {
    title: string
    changedCondition: string // differs from the work sample, e.g. Operations can support half the volume
    prompt: string
    feedback: { ifMentions: string[]; text: string }[] // every matching rule's first sentence is acknowledged; then the rest of the first (most specific) matching rule, except that an answer matching only the first rule (who they tell) gets defaultFeedback after its acknowledgement. Write each text as 'what they did. what next?'
    defaultFeedback: string
    // The prompt's last part: how the plan will show their confirmation. When the answer mentions any of
    // ifMentions, met joins the acknowledgements (before the question); otherwise, if any feedback rule
    // matched, missing is added at the end. With no rule matched, defaultFeedback alone.
    confirmation?: { ifMentions: string[]; met: string; missing: string }
  }
  nextActionExamples: string[]
}

// ---------------------------------------------------------------------------
// Where content lives. Adding a case means only these three changes:
//   1. src/data/cases/<caseId>.ts        export const CASE: CaseContent
//   2. src/data/cases/index.ts            add it to CASES: Record<CaseId, CaseContent>
//   3. src/data/library.ts                add its CaseSummary to CASE_SUMMARIES
// Shared registries: src/data/people.ts (PEOPLE), teams.ts (TEAMS, LIBRARY_TABS),
// skills.ts (SKILLS), library.ts (CASE_SUMMARIES, RECOMMENDED_CASE_ID),
// profile.ts (JUNIOR_PROFILE), landing.ts (LANDING_FEATURE).
// contracts/content.test.ts checks the ID rules and every cross-reference.
// ---------------------------------------------------------------------------

// Where each junior page lives (developer-junior), imported by the shell by these exact names:
//   src/pages/junior/JuniorHome.tsx         export function JuniorHome()
//   src/pages/junior/JuniorDefine.tsx       export function JuniorDefine()
//   src/pages/junior/JuniorExamine.tsx      export function JuniorExamine()
//   src/pages/junior/JuniorInvestigate.tsx  export function JuniorInvestigate()
//   src/pages/junior/JuniorDecide.tsx       export function JuniorDecide()
// New junior screens (overnight), imported by App with these exact names:
//   src/pages/junior/CaseDetails.tsx          export function CaseDetails()      juniorCase
//   src/pages/junior/JuniorReflect.tsx        export function JuniorReflect()    juniorReflect
//   src/pages/junior/JuniorRoom.tsx           export function JuniorRoom()       juniorRoom
//   src/pages/junior/grow/WorkGrow.tsx        export function WorkGrow()         juniorGrow      (developer-junior #2)
//   src/pages/junior/grow/MyGrowth.tsx        export function MyGrowth()         juniorGrowth    (developer-junior #2)
//   src/pages/junior/grow/LearnerFeedback.tsx export function LearnerFeedback()  juniorFeedback  (developer-junior #2)
// Each owner creates its files first as a stub that renders a heading, so App can import them at once.
// Shared pieces (developer), used by every page that needs them instead of re-implementing them:
//   src/components/DemoTag.tsx        export function DemoTag({ kind }: { kind: 'response' | 'data' })
//   src/components/MaterialBody.tsx   export function MaterialBody({ material }: { material: Material })  '\n' breaks, '|' rows as a table, plus source/date/scope
//   src/components/SharedItemView.tsx export function SharedItemView({ item }: { item: SharedItem })   the exact version a Team Lead sees; the learner's share preview uses it too
//   src/lib/assessment.ts             export function assessAttempt(content: CaseContent, attempt: PracticeAttempt): { criterion: AssessmentCriterion; met: boolean; text: string }[]
//   src/lib/content.ts                export function skillLabel(id: string): string   never throws; unknown ids show the id
// Route params: useCaseId() on case routes; useAttemptId() on managerReview (developer, src/lib/router.ts).
// Shared helper from the developer: src/components/toast.ts  export function toast(message: string): void
