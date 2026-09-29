import type { CaseContent } from '../../contracts/types'

// Friday Release: Roll Back or Patch?, shared by Ravi S. (Engineering). Individual mode only.
// The source gives the task, the material names, what the requested materials reveal (the problem
// sits in one retry path, and the complaints don't prove every payment was charged twice), the
// submission, the three Team Lead observations and the follow-up. Every fact beyond those, and all
// wording not translated from the source, is a DRAFT: to be confirmed.
// In a material body, '\n' is a line break and lines with '|' are rows of a small table (first row: header).
export const CASE: CaseContent = {
  id: 'friday-release',
  // The source's task, translated (not a draft).
  background:
    "After Friday's release, the payment success rate is still close to normal, but three suspected double-charge complaints have come in.",
  brief:
    "After Friday's release, the payment success rate is still close to normal, but three suspected double-charge complaints have come in. Decide what to investigate first, and what action to recommend.",
  // m1–m3 open at the start; m4–m7 unlock by request (r1 → m4 … r4 → m7). Figures agree across
  // materials: 80% of 42,000 payments are cards; the card, wallet and debit rates average to the
  // overall 97.8% (usual 98.1%); 37 orders = 12 captured twice + 25 pending holds.
  // Every body, source, date and scope is a DRAFT: to be confirmed.
  materials: [
    {
      id: 'm1',
      title: 'Overall metrics',
      visibility: 'start',
      body: 'Window: Friday 15:00 (the release) to Saturday 09:00.\nPayments attempted: 42,000.\nSuccess rate: 97.8%. The previous four Fridays averaged 98.1%.\nAlerts: none. The success-rate alert fires below 95%.\nBy payment method: not shown on this dashboard.',
      source: 'Payments dashboard',
      date: 'Saturday, 09:00',
      scope: 'All payments, as one rate; no split by payment method',
    },
    {
      id: 'm2',
      title: 'Three customer support tickets',
      visibility: 'start',
      body: 'Ticket | Received | What the customer says\n1 | Friday 18:20 | "I was charged twice for one order." Two A$89.00 charges show on their banking app.\n2 | Friday 21:05 | "Two charges of A$240.00 for one order. A friend was charged twice too."\n3 | Saturday 08:40 | "Charged twice for A$56.50." The screenshot shows one charge and one pending amount.',
      source: 'Customer Support queue',
      date: 'Friday 18:20 to Saturday 08:40',
      scope: 'The three tickets that mention a double charge; none checked against payment records yet',
    },
    {
      id: 'm3',
      title: 'Release change summary',
      visibility: 'start',
      body: 'Release 2.14 of the payments service went live on Friday at 15:00.\nChange 1: card payments that time out waiting for the card network are now retried once, automatically.\nChange 2: new status labels on the internal payments dashboard. No payment logic.\nTesting: passed in staging. The timeout retry was not tested against a slow card network.\nAuthor\'s note: "Retries only fire on timeouts, so there should be very few."',
      source: 'Payments team release notes',
      date: 'Friday, 14:30',
      scope: 'What changed in 2.14; not how it behaves in production',
    },
    {
      id: 'm4',
      title: 'Breakdown by affected payment method',
      visibility: 'request',
      body: 'Method | Share of payments | Success since release | Usual Friday | Orders with two authorisations\nCards | 80% | 97.5% | 97.9% | 37\nDigital wallets | 12% | 98.9% | 98.9% | 0\nBank debit | 8% | 99.1% | 99.2% | 0',
      source: 'Payments dashboard, split by method',
      date: 'Saturday, 09:30',
      scope: 'Friday 15:00 to Saturday 09:00, by payment method only',
    },
    // The source: the problem concentrates in one retry path, and the complaints don't yet prove
    // that every payment was charged twice.
    {
      id: 'm5',
      title: 'Retry logs',
      visibility: 'request',
      body: 'Card payments that timed out and were retried: 1,240.\nOrders with two authorisations: 37, all on the timeout retry path. None elsewhere.\nOf those 37: 12 were captured twice, so the customer was charged twice. 25 have the first authorisation still pending: a hold, not yet a charge.\nTickets 1 and 2 match orders captured twice. Ticket 3 matches a pending hold.\nNot yet known: whether any of the 25 holds will still be captured.',
      source: 'Payments service logs, pulled by the on-call engineer',
      date: 'Saturday, 10:00',
      scope: 'Card payments since the release; what happens to the pending holds is not known yet',
    },
    // The source: a rollback's impact must be confirmed first.
    {
      id: 'm6',
      title: 'Rollback notes',
      visibility: 'request',
      body: 'Rollback to 2.13: about 40 minutes. Payments keep running during it.\nWhat a rollback undoes: both changes in 2.14, the timeout retry and the dashboard labels.\nAfter a rollback, timed-out card payments fail as they did before 2.14, and customers try again themselves.\nWithout a rollback: the timeout retry has its own switch, and can be turned off in about 5 minutes.\nEither way, the 12 orders already charged twice need refunds.',
      source: 'Payments team runbook',
      date: 'Last updated Friday, 14:00',
      scope: 'Release 2.14 only',
    },
    {
      id: 'm7',
      title: 'On-call staff details',
      visibility: 'request',
      body: 'Payments on-call this weekend: the on-call engineer and the incident manager.\nThe incident manager approves any rollback or switch change to live payments, and any message to customers about an incident.\nCustomer Support sends customer updates, and issues refunds once the incident manager confirms the list of orders.\nYou can page both. Neither has been told about the complaints yet.',
      source: 'On-call rota and incident process',
      date: 'This weekend',
      scope: 'Payments incidents only',
    },
  ],
  framePrompt: 'Success is near normal. Does that make the impact small?', // DRAFT: to be confirmed
  constraints: [
    { label: 'Due Saturday noon', known: true }, // DRAFT: to be confirmed
    { label: 'Approver?', known: false }, // DRAFT: to be confirmed
    { label: 'Scope?', known: false }, // DRAFT: to be confirmed
  ],
  // Every card comes from a start material (m1–m3); each is a DRAFT: to be confirmed.
  cards: [
    { id: 'c1', text: 'Success 97.8%, usual 98.1%', source: 'Overall metrics' },
    { id: 'c2', text: 'No alert fired', source: 'Overall metrics' },
    { id: 'c3', text: 'Three double-charge complaints', source: 'Support tickets' },
    { id: 'c4', text: 'All three were charged twice', source: 'Customers, in tickets' },
    { id: 'c5', text: 'New retry for timed-out cards', source: 'Release summary' },
    { id: 'c6', text: 'Retries should be rare', source: "Release author's note" },
    { id: 'c7', text: 'A friend was charged twice too', source: 'Customer, second-hand' },
  ],
  // The source's four requestable materials. Hours and why lines are DRAFT: to be confirmed.
  // Together they take 3.5 h against a 3 h budget, so the learner has to choose.
  requests: [
    {
      id: 'r1',
      title: 'Breakdown by affected payment method',
      hours: 1,
      why: 'an average can hide one method failing',
      finding: {
        label: 'Breakdown by method',
        text: 'Only card payments dipped. 37 card orders have two authorisations; wallets and bank debits have none.',
      },
      materialId: 'm4',
    },
    {
      id: 'r2',
      title: 'Retry logs',
      hours: 1.5,
      why: 'the new retry is the only payment change in the release',
      finding: {
        label: 'Retry logs',
        text: 'All 37 are on the timeout retry path. 12 were captured twice; 25 have a first hold still pending.',
      },
      materialId: 'm5',
    },
    {
      id: 'r3',
      title: 'Rollback notes',
      hours: 0.5,
      why: 'a rollback has effects of its own',
      finding: {
        label: 'Rollback notes',
        text: 'A rollback takes about 40 minutes. The timeout retry can also be switched off on its own in about 5 minutes.',
      },
      materialId: 'm6',
    },
    {
      id: 'r4',
      title: 'On-call staff details',
      hours: 0.5,
      why: 'someone has to approve any change to live payments',
      finding: {
        label: 'On-call',
        text: 'The incident manager approves rollbacks, switch changes and customer messages. Support sends the updates.',
      },
      materialId: 'm7',
    },
  ],
  timeBudgetHours: 3, // DRAFT: to be confirmed
  // A roll back, B patch forward, C switch off the retry path (the brief's three). DRAFT: to be confirmed
  options: [
    { id: 'A', label: 'Roll back the whole release', tradeoff: 'Removes the retry change, and everything else in 2.14' },
    { id: 'B', label: 'Patch the retry and ship a fix', tradeoff: 'Keeps the release; the fix still has to be written and tested' },
    { id: 'C', label: 'Switch off the timeout retry, then fix it', tradeoff: 'Stops the retry quickly; timed-out payments fail as before' },
  ],
  // DRAFT: to be confirmed (titles follow the Japan case; questions and prompt are drafted)
  decisionPoints: [
    {
      id: 'dp1',
      step: 'define',
      title: 'Define the task',
      question: 'How big is this, and what are you being asked to decide?',
      status: 'confirmed',
    },
    {
      id: 'dp2',
      step: 'examine',
      title: 'Sort the evidence',
      question: 'Which are facts, and which are complaints or guesses?',
      status: 'review',
      reviewPrompt: 'The tickets are complaints, not checked records. Treat them as needing checks?',
    },
    {
      id: 'dp3',
      step: 'investigate',
      title: 'Close the gaps',
      question: 'What would show where the double charges come from, and who can approve a change?',
      status: 'confirmed',
      chips: ['Breakdown by affected payment method', 'Retry logs', 'Rollback notes', 'On-call staff details'],
    },
    {
      id: 'dp4',
      step: 'decide',
      title: 'Make the call',
      question: 'Roll back, patch, switch off the retry, or escalate? Who approves?',
      status: 'confirmed',
    },
  ],
  skillIds: ['evidence', 'investigation', 'escalation'], // matches library.ts
  // Ravi's reference answers: a reference, not an answer key. Everything in senior is a
  // DRAFT: to be confirmed. It follows the source's three Team Lead observations.
  senior: {
    decision: 'C',
    why: 'Only the timeout retry double-charges. Switching it off stops new cases in minutes without undoing the rest.',
    byPoint: {
      dp1: {
        answer:
          'Find out how many customers are charged twice and why, then recommend an action and who must approve it. The near-normal success rate says nothing about those customers.',
        reason:
          'An average over 42,000 payments can hide a small group that is hurt badly. The task is to size that harm and stop it, not to judge the release as a whole.',
      },
      dp2: {
        answer:
          'Verified: the success rates, no alert, three complaints, the new timeout retry. Needs checking: that all three were charged twice. Assumption: that retries are rare. Weak: the friend who was charged twice too.',
        reason:
          "A complaint tells you what a customer sees, not what the payment records show. The author's note is a hope, not a measurement.",
      },
      dp3: {
        answer: 'Retry logs, rollback notes and on-call staff details: 2.5 of the 3 hours. Skip the breakdown by payment method.',
        reason:
          'The retry is the only payment change, so its logs show the cause directly. The rollback notes show what each action costs, and the on-call staff details show who approves.',
      },
      dp4: {
        answer:
          'C: ask the incident manager to switch off the timeout retry now. Refund the 12 orders charged twice, watch the 25 pending holds, and patch the retry before switching it back on. Support tells the affected customers.',
        reason:
          'Switching off the retry stops new double charges in about 5 minutes and keeps the rest of 2.14. A is also sound if the switch fails or the cause turns out not to be the retry. B alone is not enough: double charges go on until the patch ships.',
      },
    },
    goal: 'Stop further double charges and put right the customers already hit, with the right approval',
    success: ['No new double charges after the switch', 'Every customer charged twice refunded and told'],
    sort: {
      c1: 'verified',
      c2: 'verified',
      c3: 'verified',
      c4: 'needs-checking',
      c5: 'verified',
      c6: 'assumption',
      c7: 'weak',
    },
    requestIds: ['r2', 'r3', 'r4'], // 1.5 + 0.5 + 0.5 = 2.5 of the 3 hours
  },
  // DRAFT: to be confirmed
  outcome:
    'The retry was switched off on Saturday morning. The 12 customers were refunded; the fixed retry returned the next Thursday.',
  // The example: Alex first wants to roll back, taking the complaints as proof; the logs and the
  // rollback notes move them to C. They skip the on-call staff details, so their escalation names the
  // wrong person: the gap the review picks up. Everything in it is a DRAFT: to be confirmed.
  example: {
    juniorId: 'alex',
    initialPosition: {
      recommendation: 'A: roll back the release now',
      reason: 'Three customers were charged twice right after the release, so the release is the cause.',
      confidence: 'medium',
      question: 'Is the new retry charging people twice?',
    },
    goal: 'Stop customers being charged twice',
    success: ['No new double charges', 'Customers charged twice get their money back'],
    people: ['Customers who complained', 'Customer Support', 'Payments on-call'],
    sort: {
      c1: 'verified',
      c2: 'verified',
      c3: 'verified',
      c4: 'verified',
      c5: 'verified',
      c6: 'needs-checking',
      c7: 'weak',
    },
    sortReasons: {
      c1: 'Straight from the payments dashboard.',
      c2: 'The dashboard shows no alert.',
      c3: 'Three tickets in the support queue.',
      c4: 'All three customers say so.',
      c5: 'In the release change summary.',
      c6: "The author's expectation; nobody has counted yet.",
      c7: 'Second-hand, from one customer.',
    },
    missing: ['Which payments are affected', 'What a rollback would undo'],
    requestedIds: ['r1', 'r2', 'r3'], // 1 + 1.5 + 0.5 = 3 of the 3 hours
    requestIntents: {
      r1: 'Whether the dip is in one payment method or all of them',
      r2: 'Whether the new retry is charging people twice',
      r3: 'What a rollback would undo, and how long it takes',
    },
    decision: 'C',
    basedOn: ['37 double authorisations, all cards', 'All on the retry path', 'Switch-off in 5 minutes'],
    why: 'Only the timeout retry path shows double authorisations, and 12 orders were captured twice. Switching the retry off stops new cases in about 5 minutes without undoing the rest of the release.',
    mainRisk: 'Some of the 25 pending holds may still be captured before they drop off',
    changeMind: 'If double authorisations turn up outside the retry path, I would roll back the whole release',
    confidence: 'medium',
    submission: {
      'confirmed-impact': '12 card orders charged twice, all on the timeout retry path. Tickets 1 and 2 are among them.',
      'not-confirmed': 'Whether any of the 25 pending holds will be captured. Whether the retry caused anything else.',
      action: 'Switch off the timeout retry now, refund the 12 orders, then patch the retry before turning it back on.',
      'escalate-to': 'My team lead, to get approval for the switch.',
      'customer-update': 'Support emails the 12 customers today to say a refund is on its way.',
    },
    whyChanged:
      'I started by wanting to roll back, because I took the three complaints as proof. The logs showed the problem is only the timeout retry, and Ticket 3 was a pending hold, not a charge. The rollback notes showed the retry can be switched off on its own, so I chose that instead.',
    // Stored without quote marks; the page adds them.
    note: 'I first assumed all three complaints were double charges. Ticket 3 was only a pending hold.',
  },
  // Sam's review of the example. Everything in it is a DRAFT: to be confirmed. The senior column
  // matches senior.goal, senior.sort, senior.requestIds and senior.decision.
  review: {
    managerId: 'sam',
    submittedWhen: 'today',
    minutes: 18,
    // In a row's text, ' → ' shows as the arrow icon (read as 'then').
    rows: [
      { label: 'Goal', junior: 'Stop the double charges', senior: 'Stop them, with the right approval', match: 'differs' },
      { label: 'Evidence', junior: 'Complaints taken as proven', senior: 'Complaints need checking', match: 'differs' },
      { label: 'Investigation', junior: 'Breakdown → logs → rollback', senior: 'Logs → rollback → on-call', match: 'differs' },
      { label: 'Decision', junior: 'C · Switch off the retry', senior: 'C · Switch off the retry', match: 'aligned' },
    ],
    blindSpots: ['Complaints first taken as proven double charges', 'Did not find out who approves live changes'],
    confirmQuestions: ['Should Alex have paged the incident manager sooner?', 'Is watching the 25 holds enough?'],
    feedbackDraft:
      'Good change of mind once the logs came in. Next time, find out who approves a live change before you recommend one.',
    nextFocus: ['escalation', 'evidence', 'investigation'],
    nextFocusDefault: 'escalation',
    dimensions: [
      {
        id: 'goal',
        level: 'independent',
        note: 'Alex framed the task around the customers charged twice, not the near-normal success rate.',
        evidence: 'Goal: "Stop customers being charged twice." Confirmed impact: "12 card orders charged twice, all on the timeout retry path."',
      },
      {
        id: 'evidence',
        level: 'prompted',
        note: 'Alex first sorted "All three were charged twice" as verified, and corrected it only when the logs showed Ticket 3 was a pending hold.',
        evidence: 'Sort reason: "All three customers say so." Note: "Ticket 3 was only a pending hold."',
      },
      {
        id: 'information',
        level: 'practice',
        note: 'The logs and rollback notes were the right asks, but Alex never checked who approves a change to live payments.',
        evidence: 'Requests: breakdown → retry logs → rollback notes. Escalate to: "My team lead, to get approval for the switch."',
      },
      {
        id: 'tradeoffs',
        level: 'independent',
        note: 'Compared what a rollback and a switch-off each stop and undo, and named the risk that remains.',
        evidence: 'Why: "…stops new cases in about 5 minutes without undoing the rest of the release." Main risk: "Some of the 25 pending holds may still be captured."',
      },
      {
        id: 'updating',
        level: 'independent',
        note: 'Moved from a full rollback to switching off the retry, and said which facts moved them.',
        evidence: 'Why changed: "I started by wanting to roll back, because I took the three complaints as proof…"',
      },
    ],
    feedback: {
      strength: 'You let the logs change your mind: from a full rollback to switching off only the retry that caused the harm.',
      improvement:
        'Find out who approves changes to live payments before you recommend one. Your escalation named your team lead, not the incident manager.',
      followUp: 'Ticket 3 was a pending hold. What would you tell that customer, and when?',
    },
  },

  // Everything below is a DRAFT: to be confirmed, except where a comment says it comes from the source.
  goal: 'Find out how far the double charges reach, stop them, and recommend an action and who must approve it, without claiming more than the evidence shows.',
  limits: {
    deadline: 'Recommend an action by Saturday noon',
    unacceptable: 'Leaving customers charged twice without a fix or an update, or changing live payments without approval',
    authority:
      'You recommend the action, who approves it and the customer update. A rollback or a switch change to live payments needs the incident manager.',
  },
  // The name and the five fields are the source's; the hints are drafted.
  submission: {
    name: 'Incident Recommendation',
    fields: [
      { id: 'confirmed-impact', label: 'Confirmed impact', hint: 'What the records show, with numbers' },
      { id: 'not-confirmed', label: 'Not yet confirmed', hint: "What you still don't know" },
      { id: 'action', label: 'Recommended action', hint: 'What to do now, and what comes next' },
      { id: 'escalate-to', label: 'Escalate to', hint: 'Who must decide or approve, and why' },
      { id: 'customer-update', label: 'Customer update plan', hint: 'Who tells customers what, and when' },
    ],
  },
  // From the source's three Team Lead observations: complaints taken as proven failures, looking
  // only at the average, and knowing what you may recommend and who must approve.
  // ifMentions matches at the start of a word, ignoring case.
  assessment: {
    criteria: [
      {
        id: 'harm-to-customers',
        label: 'Sizes the harm to the customers hit, not the average',
        lookFor: 'Did they state how many customers were charged twice, and plan for them?',
        dimensionId: 'goal',
        ifMentions: ['charged twice', 'double charge', 'double-charge', 'refund'],
        fields: ['confirmed-impact', 'customer-update'],
        met: 'You sized the harm to the customers hit, and planned what they need.',
        notYet: 'The overall rate looks fine. Look at who is behind the complaints, and what they need from you.',
      },
      {
        id: 'complaints-checked',
        label: 'Checks the complaints against the records',
        lookFor: 'Did they check the complaints before treating them as proven double charges?',
        dimensionId: 'evidence',
        // r2 stays required: only the retry logs match each ticket to the records (captured twice, or a
        // pending hold). The breakdown (r1) counts authorisations by method, not charges per ticket.
        requestIds: ['r2'],
        // DRAFT: to be confirmed. The words from 'not matched' on were added for the Examine sort reasons, which
        // count by default: a learner keeps the tickets apart there ('Nobody has matched the tickets to payment
        // records yet'). r2 is still required.
        ifMentions: ['pending', 'captured twice', 'not every', 'not all', 'not matched', 'nobody has matched', 'no one has matched', 'unproven', 'not proven'],
        // DRAFT: to be confirmed. Ticking the customers' claims (c4 'All three were charged twice', c7 'A friend was
        // charged twice too') under 'Based on' means the call still treats them as proven double charges.
        notBasedOn: ['c4', 'c7'],
        met: 'You checked the complaints against the payment records, and kept the unproven ones apart.',
        notYet: 'A complaint is what a customer sees. What would show whether each one was really charged twice?',
      },
      {
        id: 'past-the-average',
        label: 'Looks past the average',
        lookFor: 'Did they look at the payments behind the complaints, not only the overall rate?',
        dimensionId: 'information',
        // DRAFT: to be confirmed. Either request shows the payments behind the average: the breakdown
        // by method (r1: 37 card orders with two authorisations, wallets and bank debit untouched) or
        // the retry logs (r2: the retry path, 12 captured twice, 25 pending holds). requestIds needs
        // every id it lists, so the rule is the words only those two materials give; none of them is
        // in m1–m3 (m2 has 'pending amount', not 'pending hold').
        ifMentions: [
          '37',
          'two authorisations',
          'two authorizations',
          'double authorisation',
          'double authorization',
          'wallet',
          'bank debit',
          '97.5',
          'retry path',
          'captured twice',
          '12 orders',
          '12 card orders',
          'pending hold',
          '25 holds',
          '1,240',
        ],
        met: 'You looked past the average to the payments behind the complaints.',
        notYet: 'An average can hide a small group. What would show exactly which payments went wrong?',
      },
      {
        id: 'who-approves',
        label: 'Knows who must approve',
        lookFor: 'Did they find out who approves a change to live payments, and ask them?',
        dimensionId: 'information',
        requestIds: ['r4'],
        ifMentions: ['incident manager'],
        fields: ['escalate-to'],
        met: 'You named who has to approve the change, and kept your part to recommending it.',
        notYet: 'Check who is allowed to change live payments this weekend, and whether your plan asks them.',
      },
      {
        id: 'action-costs',
        label: 'Weighs what each action stops and undoes',
        lookFor: 'Did they compare a rollback, a patch and a switch-off by what each stops and what each undoes?',
        dimensionId: 'tradeoffs',
        requestIds: ['r3'],
        // DRAFT: to be confirmed. Bare '5 minutes' and '40 minutes' became the phrases below, so 'in 40
        // minutes' as a review time doesn't count.
        ifMentions: [
          'undo',
          'the rest of the release',
          'about 5 minutes',
          'about 40 minutes',
          'takes 5 minutes',
          'takes 40 minutes',
          'off in 5 minutes',
          'rollback takes',
        ],
        // DRAFT: to be confirmed. Not the review time ('in about 40 minutes').
        mentionsIn: [
          'initialPosition',
          'why',
          'ownPlan',
          'confirmed-impact',
          'not-confirmed',
          'action',
          'escalate-to',
          'customer-update',
          'mainRisk',
          'owner',
          'changeMind',
        ],
        met: 'You compared what each action stops, what it undoes and how fast it works.',
        notYet: 'Before you pick an action, check what it would undo and how long it takes.',
      },
      {
        id: 'refunds-and-update',
        label: 'Plans refunds and the customer update',
        lookFor: 'Does the plan put right the customers already charged twice, and say who tells them?',
        dimensionId: 'tradeoffs',
        ifMentions: ['refund'],
        // DRAFT: to be confirmed. Only the plan: why, the own plan, the action, the customer update and who owns the next step. 'Refund' in
        // the impact, the open questions or the initial position plans nothing.
        mentionsIn: ['why', 'ownPlan', 'action', 'customer-update', 'owner'],
        fields: ['action', 'customer-update'],
        met: 'Your plan puts right the customers already hit, and says who tells them.',
        notYet: 'Stopping new cases is half the job. What happens for the customers already hit?',
      },
      {
        id: 'updates-on-logs',
        label: 'Updates the view on what the records show',
        lookFor: 'Faced with the logs, did they change or hold their first position for a stated reason?',
        dimensionId: 'updating',
        // Facts only a request reveals: the 37 and the untouched wallets and bank debit (r1), the 12 and
        // the pending holds (r2), the switch and the times (r3), the incident manager (r4).
        // DRAFT: to be confirmed. 'pending' became 'pending hold' and '25 holds', since Ticket 3 (m2, at
        // the start) already says 'pending amount'; the r1 phrases were added so the breakdown counts too.
        ifMentions: [
          'pending hold',
          '25 holds',
          '12 orders',
          '37',
          'two authorisations',
          'two authorizations',
          'wallet',
          'bank debit',
          'captured twice',
          'retry path',
          // DRAFT: to be confirmed. Bare '5 minutes' and '40 minutes' became these, as in action-costs.
          'about 5 minutes',
          'about 40 minutes',
          'takes 5 minutes',
          'takes 40 minutes',
          'off in 5 minutes',
          // DRAFT: to be confirmed. Bare 'incident manager' became these, so the incident manager as the
          // owner doesn't count as updating the view on its own.
          'incident manager approves',
          'incident manager must',
          "incident manager's approval",
          'incident manager confirms',
        ],
        // DRAFT: to be confirmed. The final answer shows the update, not the initial position (written before the requests), the owner or
        // the review time.
        mentionsIn: [
          'why',
          'ownPlan',
          'confirmed-impact',
          'not-confirmed',
          'action',
          'escalate-to',
          'customer-update',
          'mainRisk',
          'changeMind',
        ],
        met: 'Your final answer uses what the records showed, not only the complaints.',
        notYet: 'Compare your final action with your first position: which new facts changed it, or why did none?',
      },
    ],
    commonMisses: [
      'Reads the near-normal success rate as "no real impact".',
      'Treats every complaint as a proven double charge.',
      'Recommends a rollback without checking what it undoes.',
      'Plans the fix but not the refunds or the customer update.',
      "Makes or promises a change to live payments without the incident manager's approval.",
    ],
    acceptableAlternatives: [
      'A, a full rollback, if the retry cannot be switched off on its own, or double authorisations turn up outside the retry path.',
      'Escalating straight to the incident manager with the evidence so far, if the cause cannot be confirmed quickly.',
      'B, but only together with a way to stop new double charges until the patch ships.',
    ],
    mustEscalate: [
      'Any rollback or switch change to live payments: the incident manager approves it.',
      'Any message to customers about the incident.',
      'Double authorisations found outside the timeout retry path.',
    ],
  },
  // The source's follow-up: a rollback might undo another critical fix. The fix and its impact are drafted.
  variant: {
    title: 'The rollback would undo a refund fix',
    changedFact:
      'Engineering: Release 2.14 also carried a late hotfix that is not in the change summary. It fixed refunds failing on cards issued abroad. About 300 of those refunds had failed since Wednesday and are now going through. Rolling back 2.14 would stop them again.',
    lookFor:
      "Whether the learner weighs the rollback's new cost, about 300 refunds stopping again, against the double charges, and picks a narrower action instead of rolling back by habit; and whether they check that switching off the retry leaves the refund fix alone. The source's question: how would you choose the action again?",
  },
}
