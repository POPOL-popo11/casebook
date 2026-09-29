import {
  SEED_VERSION,
  type AttemptDefine,
  type AttemptExamine,
  type AttemptInvestigate,
  type DecideAnswer,
  type GrowthRecord,
  type PracticeAttempt,
  type RoomMessage,
  type RoomSession,
  type SharedItem,
  type Store,
} from '../contracts/records'
import type { RoomQuestion } from '../contracts/types'
import { CASE as japan } from './cases/japan-launch'

// The demo records the store starts from, and returns to on 'Reset demo data' (contracts/records.ts).
// Every record has source 'demo' and shows 'Demo data'. All of it is fictional and a
// DRAFT: to be confirmed. Ids, cards, requests, fields, roles and questions are the ones in the
// case each record names (cases/*.ts), and every fact an answer uses comes from that case's
// materials: the start materials and the ones the learner requested.
//
// The story, for the demo:
// - 15 Sep: Alex submits the Japan case (the case's example is this attempt), then revises it after
//   the app's feedback. Its practice record needed some prompting.
// - 22 Sep: at work, Alex scopes a client's New Zealand launch (the client of the Work & Grow
//   sample, workGrow.ts). Its workplace record's outcome is still pending.
// - 23 Sep: Alex shares that record with Sam. 24 Sep: Sam's feedback on it, not yet read.
// - 25–27 Sep: Priya and Leo submit the Japan case, and Priya a Japan Decision Room.
// - 28 Sep: Priya submits Friday Release. 29 Sep: Leo submits The Missing A$48,000. So the Team
//   Lead's queue holds five attempts on three cases and a room, none reviewed yet.

// ---------------------------------------------------------------------------
// Alex: the case's example attempt, as it was submitted. Its words are read from
// cases/japan-launch.ts (example), so the Team Lead sees exactly what 'View example' shows and what
// the case's review quotes; only the owner, the review time and the revision are written here.
// ---------------------------------------------------------------------------
const example = japan.example

const alexDefine: AttemptDefine = {
  goal: example.goal,
  success: [...example.success],
  people: [...example.people],
  initialPosition: example.initialPosition
    ? { ...example.initialPosition }
    : { recommendation: '', reason: '', confidence: null, question: '' },
}

const alexExamine: AttemptExamine = {
  sort: { ...example.sort },
  reasons: { ...example.sortReasons },
  missing: [...example.missing],
}

// Requested a few minutes apart, from 02:31.
const alexInvestigate: AttemptInvestigate = {
  requests: example.requestedIds.map((requestId, i) => ({
    requestId,
    intent: example.requestIntents?.[requestId] ?? '',
    at: `2026-09-15T02:${String(31 + 4 * i).padStart(2, '0')}:00.000Z`,
  })),
}

const alexDecide: DecideAnswer = {
  optionId: example.decision,
  ownPlan: example.ownPlan ?? '',
  fields: { ...example.submission },
  basedOn: [...example.requestedIds], // the requests the example's 'Based on' chips come from
  why: example.why,
  mainRisk: example.mainRisk,
  owner: 'Engineering Lead', // the main risk's owner in the example's risk owners
  reviewBy: 'Two weeks after launch', // the example's plan: 'Review after 2 weeks'
  changeMind: example.changeMind,
  confidence: example.confidence,
}

// The revision after the app's feedback, whose 'not yet' for the forecast (assessment criterion
// 'forecast-assumption') asked where each number in the plan comes from: only 'why' changes.
const alexDecideRevised: DecideAnswer = {
  ...alexDecide,
  why: `${alexDecide.why} The ¥18M forecast is an assumption with no source, so I didn't use it to size the pilot.`,
}

const alexAttempt: PracticeAttempt = {
  id: 'att-demo-alex-japan',
  source: 'demo',
  caseId: 'japan-launch',
  caseVersion: 'v1',
  learnerId: 'alex',
  mode: 'individual',
  startedAt: '2026-09-15T02:10:00.000Z',
  updatedAt: '2026-09-15T03:20:00.000Z',
  status: 'revised',
  viewedExample: false,
  define: alexDefine,
  examine: alexExamine,
  investigate: alexInvestigate,
  decide: alexDecideRevised,
  versions: [
    {
      at: '2026-09-15T02:52:00.000Z',
      define: alexDefine,
      examine: alexExamine,
      investigate: alexInvestigate,
      decide: alexDecide,
      whyChanged: example.whyChanged ?? '',
    },
    {
      at: '2026-09-15T03:20:00.000Z',
      define: alexDefine,
      examine: alexExamine,
      investigate: alexInvestigate,
      decide: alexDecideRevised,
      whyChanged:
        "The feedback asked where each number in my plan comes from. The ¥18M forecast has no source, so I now say plainly that the pilot isn't sized on it.",
    },
  ],
  // The case's variant: the client now wants the whole catalogue on day one.
  variant: {
    answer:
      "Then my pilot no longer fits. I would open the whole catalogue only if Engineering can verify the three refund scenarios before the date and Operations confirms it can handle the rest by hand. If not, I'd escalate rather than promise it.",
    at: '2026-09-15T03:35:00.000Z',
  },
  growthRecordId: 'gr-demo-alex-practice',
}

// ---------------------------------------------------------------------------
// Priya (Risk): careful with the evidence, but never asks the client or Operations. Chooses B.
// ---------------------------------------------------------------------------
const priyaDefine: AttemptDefine = {
  goal: 'Launch in Japan without refunds failing for real customers',
  success: ['Every refund scenario tested before launch', 'Chargebacks no higher than in Australia'],
  people: ['Founder', 'Engineering Lead', 'Returns partner'],
  initialPosition: {
    recommendation: 'B: delay until refunds and support are ready',
    reason: 'Refunds are issued by hand today, and nobody has confirmed that the returns partner has signed.',
    confidence: 'medium',
    question: 'How often do customers return orders?',
  },
}

const priyaExamine: AttemptExamine = {
  sort: { c1: 'verified', c2: 'verified', c3: 'verified', c4: 'verified', c5: 'assumption', c6: 'assumption', c7: 'weak' },
  reasons: {
    c1: 'It comes from the Australian sales export.',
    c5: 'No method, source or range is given.',
    c6: "The call notes don't confirm that the partner has signed.",
  },
  missing: ['Refund history', 'How the forecast was built', 'Which refunds work for Japanese orders'],
}

const priyaInvestigate: AttemptInvestigate = {
  requests: [
    { requestId: 'r1', intent: 'How many orders are returned, and over what period', at: '2026-09-25T03:18:00.000Z' },
    { requestId: 'r4', intent: 'Which refund scenarios will work for Japanese orders by launch', at: '2026-09-25T03:24:00.000Z' },
    { requestId: 'r6', intent: 'How the ¥18M was worked out', at: '2026-09-25T03:29:00.000Z' },
  ],
}

const priyaDecide: DecideAnswer = {
  optionId: 'B',
  ownPlan: '',
  fields: {
    scope: 'No launch until every refund scenario is verified. Then the whole catalogue.',
    preconditions: 'Engineering verifies all three refund scenarios. The returns partner is confirmed as signed.',
    'risk-owners': 'Engineering Lead: refund testing. Founder: the returns partner contract.',
    'stop-adjust': 'Launch once testing passes. There is no firm date for it yet.',
  },
  basedOn: ['r1', 'r4', 'r6'],
  why: "In Australia, 420 of 3,000 orders (14%) were returned from January to June, and three refund scenarios, such as partial refunds, aren't verified yet. The ¥18M is an assumption: the founder estimated it from Australian sales, and it is not fully validated. It can't justify launching with refunds untested.",
  mainRisk: 'The client misses its 8-week date',
  owner: 'Engineering Lead',
  reviewBy: 'When refund testing is done',
  changeMind: 'If Engineering verifies the three refund scenarios before week 8',
  confidence: 'high',
}

const priyaAttempt: PracticeAttempt = {
  id: 'att-demo-priya-japan',
  source: 'demo',
  caseId: 'japan-launch',
  caseVersion: 'v1',
  learnerId: 'priya',
  mode: 'individual',
  startedAt: '2026-09-25T03:00:00.000Z',
  updatedAt: '2026-09-25T03:47:00.000Z',
  status: 'submitted',
  viewedExample: false,
  define: priyaDefine,
  examine: priyaExamine,
  investigate: priyaInvestigate,
  decide: priyaDecide,
  versions: [
    {
      at: '2026-09-25T03:47:00.000Z',
      define: priyaDefine,
      examine: priyaExamine,
      investigate: priyaInvestigate,
      decide: priyaDecide,
      whyChanged: 'Nothing changed my first view. The refund history and the forecast workings made me surer that waiting is safer.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Leo (Finance): asks the client and Operations, not Engineering, and sizes the pilot on the forecast.
// ---------------------------------------------------------------------------
const leoDefine: AttemptDefine = {
  goal: 'Launch in Japan in 8 weeks at a size the team can run',
  success: ['Live in Japan by week 8', 'Refunds stay within what Operations can handle'],
  people: ['Founder', 'Client Lead', 'Operations Lead'],
  initialPosition: {
    recommendation: 'C: pilot part of the catalogue, then review',
    reason: 'Refunds are issued by hand, one at a time, so a full launch could swamp the team.',
    confidence: 'low',
    question: 'How many refunds can Operations handle by hand?',
  },
}

const leoExamine: AttemptExamine = {
  sort: { c1: 'verified', c2: 'verified', c3: 'verified', c4: 'verified', c5: 'verified', c6: 'needs-checking', c7: 'weak' },
  reasons: {
    c2: 'It is in the checkout configuration.',
    c5: "It's the founder's own forecast for Japan.",
  },
  missing: ['Operations capacity', 'Whether the client would start smaller'],
}

const leoInvestigate: AttemptInvestigate = {
  requests: [
    { requestId: 'r5', intent: 'How many manual refunds Operations can take each day', at: '2026-09-26T05:12:00.000Z' },
    { requestId: 'r3', intent: 'Whether the client would launch with fewer products', at: '2026-09-26T05:16:00.000Z' },
    { requestId: 'r1', intent: 'How many orders get returned', at: '2026-09-26T05:21:00.000Z' },
  ],
}

const leoDecide: DecideAnswer = {
  optionId: 'own',
  ownPlan:
    'Pilot on the promotion date with the products the client picks first. Operations handles refunds by hand, up to 20 a day. Open the rest of the catalogue after a review in week 10.',
  fields: {
    scope: 'The products the client picks first. The rest after the review.',
    preconditions: 'The client agrees the first product list. Operations staffs up to 20 manual refunds a day.',
    'risk-owners': 'Operations Lead: the 20-a-day limit. Client Lead: the product list.',
    'stop-adjust': 'If manual refunds pass 20 a day, stop adding products until the review.',
  },
  basedOn: ['c5', 'r1', 'r3', 'r5'],
  why: 'The client can start with part of the catalogue, and Operations can handle up to 20 manual refunds a day in a pilot. With ¥18M a year and 14% of orders returned, a small first range should stay under that limit.',
  mainRisk: 'Returns in Japan run higher than in Australia',
  owner: 'Operations Lead',
  reviewBy: 'Week 10, two weeks after launch',
  changeMind: 'If manual refunds pass 20 a day in the first week',
  confidence: 'medium',
}

const leoAttempt: PracticeAttempt = {
  id: 'att-demo-leo-japan',
  source: 'demo',
  caseId: 'japan-launch',
  caseVersion: 'v1',
  learnerId: 'leo',
  mode: 'individual',
  startedAt: '2026-09-26T04:55:00.000Z',
  updatedAt: '2026-09-26T05:40:00.000Z',
  status: 'submitted',
  viewedExample: false,
  define: leoDefine,
  examine: leoExamine,
  investigate: leoInvestigate,
  decide: leoDecide,
  versions: [
    {
      at: '2026-09-26T05:40:00.000Z',
      define: leoDefine,
      examine: leoExamine,
      investigate: leoInvestigate,
      decide: leoDecide,
      whyChanged:
        'I kept the pilot. The Client Lead confirmed the client can start smaller, and Operations gave me the 20-a-day limit, so I made it the stop condition.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Priya on Friday Release (cases/friday-release.ts). DRAFT: to be confirmed.
// Careful with the evidence again: she keeps the complaints apart from the records, checks them
// against the retry logs and finds that the incident manager approves. But she spends her first
// hour on the breakdown by method and never asks for the rollback notes, so she recommends a full
// rollback without knowing what it undoes or that the retry has its own switch.
// Requests r1 + r2 + r4: 1 + 1.5 + 0.5 = 3 of the 3 hours. Nothing from m6 (rollback notes).
// ---------------------------------------------------------------------------
const priyaFridayDefine: AttemptDefine = {
  goal: 'Stop the double charges, and find every customer who was charged twice',
  success: ['No card payment authorised twice after the fix', 'Every customer charged twice is refunded'],
  people: ['Customers charged twice', 'Payments on-call', 'Customer Support'],
  initialPosition: {
    recommendation: 'A: roll back the whole release',
    reason: 'The new retry is the only change to payment logic in 2.14, and the first complaint came in at 18:20 that evening.',
    confidence: 'medium',
    question: 'Do the payment records show all three customers were charged twice?',
  },
}

const priyaFridayExamine: AttemptExamine = {
  sort: { c1: 'verified', c2: 'verified', c3: 'verified', c4: 'needs-checking', c5: 'verified', c6: 'assumption', c7: 'weak' },
  reasons: {
    c1: 'From the payments dashboard, across all 42,000 payments.',
    c2: 'The dashboard shows none, but the alert only fires below 95%.',
    c3: 'Three tickets in the support queue mention a double charge.',
    c4: "It's what the customers say. Nobody has matched the tickets to payment records yet.",
    c5: 'Change 1 in the release summary.',
    c6: "The author's expectation. The note gives no count.",
    c7: "Second-hand, in one customer's ticket.",
  },
  missing: ['Which payments were authorised twice', 'Who approves a change to live payments this weekend'],
}

const priyaFridayInvestigate: AttemptInvestigate = {
  requests: [
    { requestId: 'r1', intent: 'Which payment methods have orders authorised twice', at: '2026-09-28T01:21:00.000Z' },
    { requestId: 'r2', intent: 'Whether each ticket matches a payment that was really captured twice', at: '2026-09-28T01:29:00.000Z' },
    { requestId: 'r4', intent: 'Who has to approve a rollback this weekend', at: '2026-09-28T01:36:00.000Z' },
  ],
}

const priyaFridayDecide: DecideAnswer = {
  optionId: 'A',
  ownPlan: '',
  fields: {
    'confirmed-impact':
      '37 card orders have two authorisations, all on the timeout retry path. 12 were captured twice, including Tickets 1 and 2. No wallet or bank debit payment has two.',
    'not-confirmed': 'Whether any of the 25 pending holds will still be captured. Ticket 3 is one of them: a hold, not yet a charge.',
    action:
      'Roll back release 2.14 now. Support refunds the 12 orders once the incident manager confirms the list, and the on-call engineer watches the 25 holds.',
    'escalate-to':
      'The incident manager. They approve any rollback of live payments and any message to customers, and nobody has told them about the complaints yet.',
    'customer-update':
      'Once the incident manager approves it, Support tells the 12 customers a refund is on its way, and tells the customer behind Ticket 3 that their second amount is a pending hold.',
  },
  basedOn: ['c5', 'r1', 'r2', 'r4'],
  why: 'Only card payments have orders authorised twice, and the retry logs put all 37 on the new timeout retry. 12 orders were captured twice. The retry is the only payment change in 2.14, so rolling back the release removes the cause.',
  mainRisk: 'More card orders are authorised twice until the incident manager approves the rollback',
  owner: 'Incident manager',
  reviewBy: 'Saturday afternoon, once the rollback is live',
  changeMind: 'If orders were still authorised twice after the rollback, I would look for a second cause',
  confidence: 'medium',
}

const priyaFridayAttempt: PracticeAttempt = {
  id: 'att-demo-priya-friday',
  source: 'demo',
  caseId: 'friday-release',
  caseVersion: 'v1',
  learnerId: 'priya',
  mode: 'individual',
  startedAt: '2026-09-28T01:05:00.000Z',
  updatedAt: '2026-09-28T01:58:00.000Z',
  status: 'submitted',
  viewedExample: false,
  define: priyaFridayDefine,
  examine: priyaFridayExamine,
  investigate: priyaFridayInvestigate,
  decide: priyaFridayDecide,
  versions: [
    {
      at: '2026-09-28T01:58:00.000Z',
      define: priyaFridayDefine,
      examine: priyaFridayExamine,
      investigate: priyaFridayInvestigate,
      decide: priyaFridayDecide,
      whyChanged:
        'I kept my first view. The logs showed the new retry is the cause, and that Ticket 3 is only a pending hold. The on-call details showed the incident manager has to approve the rollback, so I added that.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Leo on The Missing A$48,000 (cases/missing-48000.ts). DRAFT: to be confirmed.
// Explains the A$30,000 with the settlement times and says plainly it is expected, not received.
// But he takes the month-end team's 'probably timing' as fact and stops there, so he never asks
// for the duplicate check or the import log: the A$18,000 is reported as timing too, which is the
// case's core conflict (explaining part of the gap is not solving all of it).
// Requests r1 + r3: 1 + 0.5 = 1.5 of the 3 hours. Nothing from m5 or m7 (the duplicate, the import).
// ---------------------------------------------------------------------------
const leoMissingDefine: AttemptDefine = {
  goal: 'Explain the A$48,000 difference in the June report, due by 15:00',
  success: ['The report reaches the Financial Controller on time', 'Each unmatched item has a stated reason'],
  people: ['Financial Controller', 'Month-end team', 'Card processor'],
  initialPosition: {
    recommendation: 'A: report it all as timing that will clear',
    reason: 'Both items were recorded in the last two days of June, and the month-end team says items like these usually clear in a few days.',
    confidence: 'medium',
    question: 'When do the 30 June card sales reach the bank?',
  },
}

const leoMissingExamine: AttemptExamine = {
  sort: { c1: 'verified', c2: 'verified', c3: 'verified', c4: 'verified', c5: 'verified', c6: 'weak' },
  reasons: {
    c1: 'Both balances come from the finance system and the bank statement.',
    c2: 'The time is on the statement file.',
    c3: 'The matching run lists both items.',
    c4: 'The pending list describes it as card sales of 30 June.',
    c5: "The month-end team's note says these usually clear in a few days.",
    c6: 'One message in the team chat, with no record behind it.',
  },
  missing: ['When card sales reach the bank', 'Whether the statement covers all of 30 June'],
}

const leoMissingInvestigate: AttemptInvestigate = {
  requests: [
    { requestId: 'r1', intent: 'When the 30 June card sales will reach the bank', at: '2026-09-29T03:24:00.000Z' },
    { requestId: 'r3', intent: 'Whether the statement stops before the end of 30 June', at: '2026-09-29T03:31:00.000Z' },
  ],
}

const leoMissingDecide: DecideAnswer = {
  optionId: 'A',
  ownPlan: '',
  fields: {
    'make-up':
      'A$30,000 of card sales from 30 June, due in the bank on 2 July, and A$18,000, the Pellham Fixtures receipt for invoice 4471 recorded on 29 June, not yet on the statement. Total A$48,000.',
    evidence:
      'Settlement times: card sales reach the bank two business days after the sale, so the 30 June sales are due on 2 July. Statement date range: the statement stops at 16:00 on 30 June, and the bank posted nothing after that. The month-end team expects both items to clear in a few days.',
    'open-risks':
      'The A$30,000 is expected on 2 July and is not received yet. The Pellham receipt should follow on the July statement, but its date is not confirmed.',
    'fix-owner':
      "No correction to the ledger before 15:00: any change needs the Financial Controller's approval, and both items should clear. The month-end team checks the bank feed on 2 and 3 July.",
    prevention: 'List the card sales and receipts still on their way at month-end in the report, each with the date it is due.',
  },
  basedOn: ['c4', 'c5', 'r1', 'r3'],
  why: 'The settlement times show card sales reach the bank two business days after the sale, so the A$30,000 from 30 June is due on 2 July. The Pellham receipt is timing too, as the month-end team said, so I would report the whole A$48,000 as timing that will clear.',
  mainRisk: 'The Pellham receipt may take longer than the card sales to reach the bank',
  owner: 'Month-end team',
  reviewBy: '2 July, when the card sales are due',
  changeMind: 'If the Pellham A$18,000 is not in the bank by 3 July, I would ask Pellham Fixtures when they paid',
  confidence: 'high',
}

const leoMissingAttempt: PracticeAttempt = {
  id: 'att-demo-leo-missing',
  source: 'demo',
  caseId: 'missing-48000',
  caseVersion: 'v1',
  learnerId: 'leo',
  mode: 'individual',
  startedAt: '2026-09-29T03:10:00.000Z',
  updatedAt: '2026-09-29T03:52:00.000Z',
  status: 'submitted',
  viewedExample: false,
  define: leoMissingDefine,
  examine: leoMissingExamine,
  investigate: leoMissingInvestigate,
  decide: leoMissingDecide,
  versions: [
    {
      at: '2026-09-29T03:52:00.000Z',
      define: leoMissingDefine,
      examine: leoMissingExamine,
      investigate: leoMissingInvestigate,
      decide: leoMissingDecide,
      whyChanged:
        "I kept my first view, and I'm surer of it now. The settlement times showed the card sales are due on 2 July, as the month-end team said. The statement stops at 16:00 on 30 June and nothing was posted after that, so nothing was left off the June statement.",
    },
  ],
}

// ---------------------------------------------------------------------------
// Priya's Japan Decision Room: she plays the Client Lead; Engineering and Operations are the AI
// roles. Every question, answer, reply and shared fact is read from the room script
// (cases/japan-launch.ts, room), so the AI roles say nothing their brief doesn't hold.
// ---------------------------------------------------------------------------
const script = japan.room
const HUMAN = 'client-lead'
const roomAt = (minute: number) => `2026-09-27T02:${String(minute).padStart(2, '0')}:00.000Z`
const scripted = (id: string): RoomQuestion | undefined => script?.questions.find((q) => q.id === id)
const replyText = (id: string): string => script?.replies?.find((r) => r.id === id)?.text ?? script?.unknownAnswer ?? ''

// A suggested question and the AI role's answer: messages msg-demo-<n> and msg-demo-<n + 1>.
function asked(questionId: string, n: number, minute: number): RoomMessage[] {
  const q = scripted(questionId)
  const role = q?.toRoleId ?? ''
  return [
    { id: `msg-demo-${n}`, at: roomAt(minute), from: HUMAN, to: role, kind: 'question', text: q?.text ?? '', demo: false, questionId },
    { id: `msg-demo-${n + 1}`, at: roomAt(minute), from: role, to: HUMAN, kind: 'answer', text: q?.answer ?? '', demo: true, questionId },
  ]
}

// What she writes herself, and the scripted reply it gets (the first reply whose words appear).
function proposed(to: string, text: string, replyId: string, n: number, minute: number): RoomMessage[] {
  return [
    { id: `msg-demo-${n}`, at: roomAt(minute), from: HUMAN, to, kind: 'proposal', text, demo: false },
    { id: `msg-demo-${n + 1}`, at: roomAt(minute), from: to, to: HUMAN, kind: 'answer', text: replyText(replyId), demo: true, replyId },
  ]
}

// A fact from an answer, added to Shared evidence with its source.
function sharedFrom(questionId: string, id: string, messageId: string, minute: number) {
  const q = scripted(questionId)
  return { id, text: q?.reveals ?? '', sourceRoleId: q?.toRoleId ?? '', messageId, at: roomAt(minute) }
}

const CLIENT_SHARE = 'From my side: the client can accept opening part of the catalogue first. It is not in the shared brief.'

const priyaRoom: RoomSession = {
  id: 'room-demo-priya-japan',
  source: 'demo',
  caseId: 'japan-launch',
  caseVersion: 'v1',
  learnerId: 'priya',
  roleId: HUMAN,
  startedAt: roomAt(0),
  updatedAt: roomAt(41),
  status: 'submitted',
  initialPosition: {
    recommendation: 'Launch the whole catalogue on the promotion date',
    reason: "The promotion date is set. The client can accept part of the catalogue first, but I'd rather not ask unless the team needs it.",
    confidence: 'medium',
  },
  messages: [
    ...asked('q1', 1, 6),
    ...asked('q2', 3, 8),
    ...asked('q3', 5, 11),
    ...asked('q6', 7, 14),
    ...asked('q7', 9, 16),
    { id: 'msg-demo-11', at: roomAt(19), from: HUMAN, to: 'all', kind: 'share', text: CLIENT_SHARE, demo: false },
    ...proposed('operations-lead', 'What if we open part of the catalogue first, as a pilot on the promotion date?', 'ops-smaller-scope', 12, 21),
    ...proposed(
      'engineering-lead',
      'If the client opens part of the catalogue first, can you test the refunds those products need first?',
      'eng-smaller-scope',
      14,
      24,
    ),
  ],
  sharedEvidence: [
    sharedFrom('q1', 'se-demo-1', 'msg-demo-2', 7),
    sharedFrom('q2', 'se-demo-2', 'msg-demo-4', 9),
    sharedFrom('q3', 'se-demo-3', 'msg-demo-6', 12),
    sharedFrom('q6', 'se-demo-4', 'msg-demo-8', 15),
    sharedFrom('q7', 'se-demo-5', 'msg-demo-10', 17),
    { id: 'se-demo-6', text: 'The client can accept opening part of the catalogue first', sourceRoleId: HUMAN, messageId: 'msg-demo-11', at: roomAt(19) },
  ],
  openQuestions: [
    { id: 'oq-demo-1', text: 'How many refunds a day would the first product range need by hand?', ownerRoleId: 'operations-lead', status: 'unknown' },
    { id: 'oq-demo-2', text: 'When can the three unverified refund scenarios be tested?', ownerRoleId: 'engineering-lead', status: 'open' },
    { id: 'oq-demo-3', text: 'Has the returns partner signed?', ownerRoleId: HUMAN, status: 'open' },
  ],
  // The script's conflicts, all three found: each one's questions were asked above.
  conflicts: [
    {
      conflictId: 'date-vs-refunds',
      handling: 'Open part of the catalogue on the date. Refunds not yet verified are handled by hand until Engineering tests them.',
      status: 'resolved' as const,
    },
    {
      conflictId: 'refunds-vs-workload',
      handling: 'The pilot is capped at 20 manual refunds a day. The load for a full launch is still not estimated.',
      status: 'open' as const,
    },
    {
      conflictId: 'date-vs-support',
      handling: 'The date stays, and the first launch is sized as a pilot that Operations can support.',
      status: 'resolved' as const,
    },
  ].filter((c) => script?.conflicts?.some((k) => k.id === c.conflictId)),
  recommendation: {
    plan: 'Open part of the catalogue on the promotion date, paid by card in JPY. Refunds not yet verified are handled by hand, up to 20 a day. Open more after a review.',
    tradeoffs:
      'We keep the date with a smaller first range instead of the whole catalogue on day one. Until Engineering tests them, the unverified refunds cost Operations manual work.',
    unresolved: 'Nobody has estimated the manual refund load. Nobody has confirmed whether the returns partner has signed.',
    owner: 'Engineering Lead: refund testing. Operations Lead: the 20-a-day limit. Client Lead: the first product list.',
    reviewBy: 'Two weeks after launch',
    evidenceIds: ['se-demo-1', 'se-demo-2', 'se-demo-4', 'se-demo-6'],
  },
  reflection: {
    changedMind:
      'I came in wanting the whole catalogue on the date. Engineering said three refund scenarios would go live untested, and Operations could only commit to a pilot of up to 20 manual refunds a day. So I offered what I knew about the client: part of the catalogue first.',
    stillUncertain:
      "Nobody has estimated the manual refund load, so I don't know how big the first range can be. I also don't know whether the returns partner has signed.",
  },
}

// ---------------------------------------------------------------------------
// Alex's growth records. Honesty rules (records.ts): practice is 'practice-only'; level stays
// 'not-observed' (nobody has confirmed one); the workplace outcome is pending.
// ---------------------------------------------------------------------------
const alexPractice: GrowthRecord = {
  id: 'gr-demo-alex-practice',
  source: 'demo',
  learnerId: 'alex',
  date: '2026-09-15T03:40:00.000Z',
  kind: 'practice',
  skillId: 'framing', // the Japan case's first skill
  situation: 'Eight Weeks to Japan (practice case): recommend a launch scope for a retailer entering Japan in 8 weeks',
  contribution:
    'Started by backing a full launch, then asked Engineering, Operations and the Client Lead, and moved to a conditional pilot of my own.',
  evidence: [
    {
      text: 'Asked Engineering, Operations and the Client Lead before settling on a scope, in 4.5 of the 5 hours.',
      ref: { kind: 'attempt', id: alexAttempt.id },
    },
    {
      text: 'Revised my answer after the feedback to say the ¥18M forecast is an assumption.',
      ref: { kind: 'attempt', id: alexAttempt.id },
    },
  ],
  prompting: 'some', // revised after the app's feedback
  level: 'not-observed',
  outcome: 'practice-only',
  learning:
    "I read 'live in 8 weeks' as the whole store. The date was fixed but the scope wasn't, and I only found that out when I asked the Client Lead last.",
  nextStep: 'Ask the client what is really fixed before I set the goal.',
  privateNote: 'I nearly submitted option A before asking anyone.',
  links: [{ kind: 'attempt', id: alexAttempt.id }],
}

// The same client as the Work & Grow sample (workGrow.ts), a week before its launch plan.
const alexWork: GrowthRecord = {
  id: 'gr-demo-alex-work',
  source: 'demo',
  learnerId: 'alex',
  date: '2026-09-22T05:30:00.000Z',
  kind: 'workplace',
  skillId: 'framing',
  situation: 'Scoping the New Zealand launch for an outdoor-gear retailer, before committing a date',
  contribution:
    'Before agreeing a date, I asked the client which payment methods had to be live on day one and which could follow.',
  evidence: [
    { text: 'The client confirmed by email that card payments are needed on day one and other payment methods can follow after launch.' },
    { text: "The launch plan's day-one scope now lists card payments only." },
  ],
  prompting: 'none',
  level: 'not-observed',
  outcome: 'outcome-pending',
  learning: 'Asking what was fixed first made the day-one scope smaller and the date easier to keep.',
  nextStep: 'Check with each team that runs the launch what it can support, before I send the plan.',
  privateNote: "I wasn't sure I was allowed to push back on the client's date.",
  links: [],
}

// What the Team Lead receives: an exact copy of the record at the moment of sharing, without the
// private note.
function sharedCopy(r: GrowthRecord): SharedItem {
  return {
    recordId: r.id,
    date: r.date,
    kind: r.kind,
    skillId: r.skillId,
    situation: r.situation,
    contribution: r.contribution,
    evidence: r.evidence.map((e) => e.text),
    outcome: r.outcome,
    learning: r.learning,
    nextStep: r.nextStep,
  }
}

export const SEED_STORE: Store = {
  version: 1,
  seedVersion: SEED_VERSION,
  attempts: [alexAttempt, priyaAttempt, leoAttempt, priyaFridayAttempt, leoMissingAttempt],
  rooms: [priyaRoom],
  workReviews: [],
  growth: [alexPractice, alexWork],
  shares: [
    {
      id: 'share-demo-alex-1',
      source: 'demo',
      learnerId: 'alex',
      managerId: 'sam',
      sharedAt: '2026-09-23T01:30:00.000Z',
      items: [sharedCopy(alexWork)],
    },
  ],
  // Sam's answer to the share. The library's 'Sam's feedback' (profile.ts) quotes its gist. It has no
  // readAt, so it counts as unread, and the learner's next action is left for them to write.
  feedback: [
    {
      id: 'fb-demo-sam-1',
      source: 'demo',
      fromId: 'sam',
      toId: 'alex',
      at: '2026-09-24T02:15:00.000Z',
      about: { kind: 'growth', id: alexWork.id },
      shareId: 'share-demo-alex-1',
      strength: 'You asked the client what had to be live on day one before you committed a date. Good instinct to ask for data first.',
      improvement: 'Next, name who owns each risk, and check that the teams who run the launch can support it.',
      followUp: 'Which team would feel it first if launch volume is higher than planned, and have they seen the plan?',
      focusSkillId: 'collaboration',
      nextAction: '',
    },
  ],
  selfReviews: [],
  ui: { viewMode: {}, activeAttempt: {}, activeRoom: {} },
}
