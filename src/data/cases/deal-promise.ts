import type { CaseContent } from '../../contracts/types'

// The Deal We Should—or Shouldn't—Promise, shared by Owen B. (Sales & Commercial). Individual mode only.
// The source gives the task (the prospect will sign if the team commits to an integration within
// 6 weeks; the delivery team hasn't confirmed that time), the material names, the key information
// (the customer's end goal may be met by phased delivery, which Sales has to find out; a revenue
// forecast is not committed revenue), the submission, the three Team Lead observations and the
// follow-up. Every fact beyond those, and all wording not translated from the source, is a
// DRAFT: to be confirmed. The prospect is left unnamed.
// In a material body, '\n' is a line break and lines with '|' are rows of a small table (first row: header).
export const CASE: CaseContent = {
  id: 'deal-promise',
  // The source's task, translated (not a draft).
  background:
    "A prospect says it will sign if the team commits to delivering an integration within 6 weeks. But the delivery team hasn't confirmed that timeline.",
  brief:
    "A prospect says it will sign if the team commits to delivering an integration within 6 weeks. But the delivery team hasn't confirmed that timeline. Recommend how to respond, and draft a reply.", // DRAFT: to be confirmed (the last sentence)
  // m1–m4 open at the start; m5–m8 unlock by request (r1 → m5 … r4 → m8). Figures agree across
  // materials: A$40 million a year at a 0.9% fee is A$360,000; that is 18% of a A$2 million target
  // (82% → 100%). Full integration 10–12 weeks = Phase 1 (about 4 weeks) + Phase 2 (6–8 weeks after).
  // Peak season starts in 10 weeks and they want 4 weeks of live payouts before it: payouts by week 6.
  // Every body, source, date and scope is a DRAFT: to be confirmed.
  materials: [
    {
      id: 'm1',
      title: 'Sales call notes',
      visibility: 'start',
      body: 'The prospect: a travel booking company that pays hotels and tour operators in 12 currencies.\nIn their words: "If you can commit to having the integration live in six weeks, we\'ll sign this week." "Our board meets on Friday." "Another provider told us they could do it in four weeks."\nWhat they want: supplier payouts sent straight from their booking system. Today their finance team pays suppliers by hand, two days a week.\nNot asked yet: what exactly must be live in six weeks, and why six.\nSales note after the call: "Engineering built something similar last year in about six weeks, so this should be fine."',
      source: "Call with the prospect's head of operations, notes by the sales team",
      date: 'Monday',
      scope: 'The first call only; nothing here is agreed',
    },
    {
      id: 'm2',
      title: "Customer's list of requirements",
      visibility: 'start',
      body: 'Requirement | Priority (theirs)\nPay suppliers in 12 currencies | Must have\nPayouts sent from our booking system, with no manual upload | Must have\nPayout status shown live in our booking system | Must have\nMonthly reconciliation report | Nice to have\nEverything above live within 6 weeks of signing | Must have',
      source: "The prospect's procurement team",
      date: 'Monday, after the call',
      scope: 'What they asked for; not when each part is needed',
    },
    {
      id: 'm3',
      title: 'Revenue forecast',
      visibility: 'start',
      body: "Stage: Commit, expected to close this week. Commit is Sales' own forecast category; nothing is signed.\nExpected revenue: A$360,000 a year.\nBasis: the prospect's estimate of A$40 million a year in supplier payouts, at a 0.9% fee.\nDraft contract: no minimum volume.\nThis deal would take the sales team from 82% to 100% of its annual target.",
      source: 'Sales pipeline report',
      date: 'Monday',
      scope: "Sales' forecast; not reviewed by Finance",
    },
    {
      id: 'm4',
      title: 'Current capabilities overview',
      visibility: 'start',
      body: "Available now:\nPayouts in more than 30 currencies, sent by API or by bulk file upload.\nPayout status by API and webhooks, and in the dashboard.\nA standard monthly reconciliation report.\nNot available: a ready-made connector to the prospect's booking system. Custom connectors are scoped and estimated by Solutions Engineering.",
      source: 'Product team',
      date: 'Updated this quarter',
      scope: 'What is available today; no roadmap dates',
    },
    {
      id: 'm5',
      title: 'Technical estimate',
      visibility: 'request',
      body: 'Full integration, payouts sent from their booking system and live status written back: 10–12 weeks.\nPhase 1, payouts only: their booking system sends payouts through our standard payouts API, and Solutions Engineering helps their developers connect it. About 4 weeks, including testing. No custom build on our side.\nPhase 2, live status in their booking system: a custom connector, 6–8 weeks after Phase 1.\nDepends on: their booking system\'s API documentation, which we haven\'t received yet.\nThe similar build last year took 9 weeks, not 6, and it started from a well-documented system.',
      source: 'Solutions Engineering',
      date: 'Tuesday',
      scope: 'A first estimate, before seeing their API documentation',
    },
    {
      id: 'm6',
      title: 'Support cost',
      visibility: 'request',
      body: 'Phase 1, on the standard payouts API: about A$10,000 a year, as for any API customer.\nPhase 2, the custom connector for live status: about A$40,000 a year to monitor and maintain.\nBuilding everything as one custom connector instead: about A$90,000 in the first year, then about A$50,000 a year.\nFinance has not yet reviewed the revenue forecast.',
      source: 'Support team, with Finance',
      date: 'Tuesday',
      scope: 'Running costs after go-live; not the cost of building',
    },
    // The source: the customer's end goal may be met by phased delivery, which Sales has to find out.
    {
      id: 'm7',
      title: 'When the customer actually needs the feature',
      visibility: 'request',
      body: 'Why six weeks: our peak booking season starts in 10 weeks. We want 4 weeks of paying real suppliers through the new setup before then.\nWhat must work by then: supplier payouts sent automatically from our booking system. We pay about 400 suppliers a week, all by hand today.\nWhat can wait: live payout status inside our booking system. Until then, our finance team can check status in your dashboard. Within 6 months is fine.\nThe board meets on Friday and wants to approve a provider with a plan for peak season.',
      source: "Email from the prospect's finance director, answering Sales' questions",
      date: 'Tuesday',
      scope: "The prospect's own plans; not in any contract",
    },
    {
      id: 'm8',
      title: 'Contract commitment rules',
      visibility: 'request',
      body: "1. Sales may promise only what is available now, and roadmap dates already published.\n2. Any go-live or delivery date that depends on our team's work needs written approval from the Head of Solutions Engineering before it goes to the customer.\n3. Custom builds need Finance's sign-off on their cost before they are offered.\n4. A date or promise in an email counts as a commitment.\n5. Revenue counts as committed only when the contract has a minimum volume or fee.",
      source: 'Commercial policy, from Legal and Finance',
      date: 'Current version',
      scope: 'Every proposal, email and contract to a customer',
    },
  ],
  framePrompt: 'They will sign if we promise 6 weeks. What must work in 6 weeks?', // DRAFT: to be confirmed
  constraints: [
    { label: 'Board meets Friday', known: true }, // DRAFT: to be confirmed
    { label: 'Build time?', known: false }, // DRAFT: to be confirmed
    { label: 'Who approves a date?', known: false }, // DRAFT: to be confirmed
  ],
  // Every card comes from a start material (m1–m4); each is a DRAFT: to be confirmed.
  cards: [
    { id: 'c1', text: 'Will sign this week if we commit to 6 weeks', source: 'Prospect, on the call' },
    { id: 'c2', text: 'A$360,000 a year in revenue', source: 'Revenue forecast' },
    { id: 'c3', text: 'No ready-made connector for their system', source: 'Capabilities overview' },
    { id: 'c4', text: 'Every requirement is a must-have', source: "Customer's requirements list" },
    { id: 'c5', text: 'We can build it in about 6 weeks', source: 'Sales note after the call' },
    { id: 'c6', text: 'Another provider offered 4 weeks', source: 'Prospect, in passing' },
  ],
  // The source's four requestable materials. Hours and why lines are DRAFT: to be confirmed.
  // Together they take 3 h against a 2.5 h budget, so the learner has to choose.
  requests: [
    {
      id: 'r1',
      title: 'Technical estimate',
      hours: 1,
      why: 'nobody who would build it has sized the work yet',
      finding: {
        label: 'Technical estimate',
        text: 'Full integration: 10–12 weeks. Phase 1, payouts from their booking system on our standard API: about 4 weeks.',
      },
      materialId: 'm5',
    },
    {
      id: 'r2',
      title: 'Support cost',
      hours: 0.5,
      why: 'a custom build keeps costing after it goes live',
      finding: {
        label: 'Support cost',
        text: 'One custom connector: about A$90,000 in year one. Phase 1 on the standard API: about A$10,000 a year.',
      },
      materialId: 'm6',
    },
    {
      id: 'r3',
      title: 'When the customer actually needs the feature',
      hours: 1,
      why: 'the 6 weeks may be a signing date, not the date they need it',
      finding: {
        label: 'When they need it',
        text: 'Payouts must run 4 weeks before peak season, which starts in 10 weeks. Live status can wait up to 6 months.',
      },
      materialId: 'm7',
    },
    {
      id: 'r4',
      title: 'Contract commitment rules',
      hours: 0.5,
      why: 'someone has to approve a date for work that does not exist yet',
      finding: {
        label: 'Commitment rules',
        text: 'Any date that depends on our team needs the Head of Solutions Engineering in writing. Custom builds need Finance.',
      },
      materialId: 'm8',
    },
  ],
  timeBudgetHours: 2.5, // DRAFT: to be confirmed
  // A promise it all, B phased delivery, C only what exists today. DRAFT: to be confirmed
  options: [
    {
      id: 'A',
      label: 'Promise the full integration in 6 weeks',
      tradeoff: 'Likely signs this week; a date nobody has estimated or approved',
    },
    {
      id: 'B',
      label: 'Offer payouts first, live status later',
      tradeoff: 'Delivers the most important part first; they may want it all at once',
    },
    {
      id: 'C',
      label: 'Offer only what exists today, with no date',
      tradeoff: 'No risky promise; the deal may go to another provider',
    },
  ],
  // DRAFT: to be confirmed (titles follow the Japan case; questions and prompt are drafted)
  decisionPoints: [
    {
      id: 'dp1',
      step: 'define',
      title: 'Define the task',
      question: 'What are you being asked to decide, and what does the prospect need?',
      status: 'confirmed',
    },
    {
      id: 'dp2',
      step: 'examine',
      title: 'Sort the evidence',
      question: 'Which are facts, and which are forecasts, hopes or pressure?',
      status: 'review',
      reviewPrompt: "The A$360,000 rests on the prospect's own estimate. Treat it as an assumption?",
    },
    {
      id: 'dp3',
      step: 'investigate',
      title: 'Close the gaps',
      question: 'What would show what can be built, what they need by when, and who can approve a date?',
      status: 'confirmed',
      chips: ['Technical estimate', 'Support cost', 'When the customer actually needs the feature', 'Contract commitment rules'],
    },
    {
      id: 'dp4',
      step: 'decide',
      title: 'Make the call',
      question: 'Promise, offer in phases, offer only what exists, or escalate? Who approves?',
      status: 'confirmed',
    },
  ],
  skillIds: ['decision', 'collaboration', 'escalation'], // matches library.ts
  // Owen's reference answers: a reference, not an answer key. Everything in senior is a
  // DRAFT: to be confirmed. It follows the source's three Team Lead observations.
  senior: {
    decision: 'B',
    why: 'What they need before peak season is payouts, and Phase 1 delivers that in about 4 weeks. Offering it once the dates are approved moves the deal forward without a false promise.',
    byPoint: {
      dp1: {
        answer:
          'Find out what the prospect needs working in 6 weeks, and recommend an offer the team can keep. Signing this week is their ask, not the goal.',
        reason:
          "A deal won on a promise the team can't keep costs more than it brings in. The job is a deal the team can deliver, and a reply before their board meets.",
      },
      dp2: {
        answer:
          "Verified: what they said on the call, and that there is no ready-made connector. Needs checking: that everything on their list is needed in 6 weeks. Assumptions: the A$360,000, which rests on their own volume estimate, and that we can build it in 6 weeks. Weak: the other provider's four weeks.",
        reason:
          "A pipeline number and a sales note are neither a contract nor an estimate. A rival's promise heard second-hand is pressure, not evidence.",
      },
      dp3: {
        answer:
          'The technical estimate, when they actually need it, and the commitment rules: 2.5 of the 2.5 hours. Skip the support cost.',
        reason:
          'The estimate and their real need decide what can be offered; the rules decide who must approve it. Support cost matters most for a full custom build, which the estimate already rules out for 6 weeks.',
      },
      dp4: {
        answer:
          'B: offer supplier payouts from their booking system first, in about 4 weeks, and live status in a second phase, once the Head of Solutions Engineering approves both dates in writing and Finance signs off the Phase 2 build. Reply before Friday with the plan; no date goes out until it is approved.',
        reason:
          "Phase 1 meets what they need before peak season, and the reply promises nothing the team hasn't confirmed. A is a false promise: the full build takes 10–12 weeks. C is honest, but walks away from a need the team can meet.",
      },
    },
    goal: 'Win the deal with an offer the team can deliver, approved before it goes out',
    success: ['Payouts live before their peak season', 'No date in the reply that nobody approved'],
    sort: {
      c1: 'verified',
      c2: 'assumption',
      c3: 'verified',
      c4: 'needs-checking',
      c5: 'assumption',
      c6: 'weak',
    },
    requestIds: ['r1', 'r3', 'r4'], // 1 + 1 + 0.5 = 2.5 of the 2.5 hours
  },
  // DRAFT: to be confirmed
  outcome:
    'The Head of Solutions Engineering approved 5 weeks for Phase 1. The prospect signed the following Monday, paid its suppliers through the new setup before peak season, and got live status 11 weeks after signing.',
  // The example: Alex first wants to promise 6 weeks to close this week; the estimate and the
  // customer's real need move them to B. They skip the commitment rules, so their reply promises
  // "about 4 weeks" before anyone approved it: the gap the review picks up. Everything in it is a
  // DRAFT: to be confirmed.
  example: {
    juniorId: 'alex',
    initialPosition: {
      recommendation: 'A: promise the full integration in 6 weeks',
      reason: 'They will sign this week, and Engineering built something similar in about six weeks last year.',
      confidence: 'medium',
      question: 'Can Solutions Engineering really build it in 6 weeks?',
    },
    goal: 'Sign the prospect this week',
    success: ['Signed before their board meets on Friday', 'Integration live when they need it'],
    people: ['Prospect', 'Solutions Engineering', 'Sales team'],
    sort: {
      c1: 'verified',
      c2: 'verified',
      c3: 'verified',
      c4: 'needs-checking',
      c5: 'assumption',
      c6: 'weak',
    },
    sortReasons: {
      c1: 'They said it on the call.',
      c2: 'It is in the pipeline report.',
      c3: 'The capabilities overview says so.',
      c4: 'Their list marks everything as a must; I want to know why.',
      c5: 'A sales note, not an estimate.',
      c6: 'Something they heard, and we cannot check it.',
    },
    missing: ['A build estimate', 'Why 6 weeks'],
    requestedIds: ['r1', 'r2', 'r3'], // 1 + 0.5 + 1 = 2.5 of the 2.5 hours
    requestIntents: {
      r1: 'How long the integration really takes to build',
      r2: 'What it would cost us to support',
      r3: 'What they need working in 6 weeks, and why',
    },
    decision: 'B',
    basedOn: ['Full build: 10–12 weeks', 'Payouts needed before peak season', 'Payouts phase: about 4 weeks'],
    why: 'The full integration takes 10–12 weeks, so 6 weeks would be a false promise. What they need before peak season is supplier payouts sent from their booking system, and Phase 1 does that in about 4 weeks. Live status can follow within 6 months.',
    mainRisk: 'They may still choose the provider that told them four weeks',
    changeMind: 'If they need live status before peak season too, I would tell them we cannot meet it in time',
    confidence: 'medium',
    submission: {
      value:
        'About A$360,000 a year, if their volume matches their own estimate. The draft contract has no minimum volume, so none of it is committed yet.',
      dependencies:
        "Their booking system's API documentation, which Solutions Engineering hasn't seen. Time from their developers for testing.",
      'can-promise':
        'Phase 1, supplier payouts sent from their booking system, live in about 4 weeks. Live status in their system in Phase 2, within 6 months.',
      'needs-approval': 'Nothing for Phase 1: the estimate comes from Solutions Engineering. The Phase 2 date, once they have the API documentation.',
      'customer-reply':
        'We can have supplier payouts running from your booking system in about 4 weeks, well before your peak season, with live status in your system within 6 months. We would love to sign this week.',
    },
    whyChanged:
      'I started by wanting to promise 6 weeks, because they would sign this week. The estimate showed the full integration takes 10–12 weeks, and their finance director said what they need before peak season is payouts. The support cost also made me look again at the forecast: it is their own estimate, with no minimum volume.',
    // Stored without quote marks; the page adds them.
    note: 'I first counted the A$360,000 as money in the bank. It is their own estimate.',
  },
  // Sam's review of the example. Everything in it is a DRAFT: to be confirmed. The senior column
  // matches senior.goal, senior.sort, senior.requestIds and senior.decision.
  review: {
    managerId: 'sam',
    submittedWhen: 'today',
    minutes: 22,
    // In a row's text, ' → ' shows as the arrow icon (read as 'then').
    rows: [
      { label: 'Goal', junior: 'Sign the prospect this week', senior: 'A deal the team can deliver', match: 'differs' },
      { label: 'Evidence', junior: 'Forecast first taken as revenue', senior: 'Forecast rests on their estimate', match: 'differs' },
      { label: 'Investigation', junior: 'Estimate → support cost → need', senior: 'Estimate → need → commitment rules', match: 'differs' },
      { label: 'Decision', junior: 'B · Payouts first, status later', senior: 'B · Payouts first, status later', match: 'aligned' },
    ],
    blindSpots: ['The reply promises about 4 weeks before anyone approved it', 'Did not check who can approve a delivery date'],
    confirmQuestions: ['Should an estimate go to a customer before it is approved?', 'Does "about 4 weeks" in an email count as a promise?'],
    feedbackDraft:
      'Good work finding what the prospect needs before peak season. Next time, find out who approves a date before you put one in a reply.',
    nextFocus: ['escalation', 'decision', 'collaboration'],
    nextFocusDefault: 'escalation',
    dimensions: [
      {
        id: 'goal',
        level: 'independent',
        note: 'Alex looked past "sign this week" and asked what the prospect needs working in 6 weeks, and why.',
        evidence: 'Request: "What they need working in 6 weeks, and why." Why: "What they need before peak season is supplier payouts…"',
      },
      {
        id: 'evidence',
        level: 'prompted',
        note: 'Alex first sorted the A$360,000 as verified, and questioned it only when the support cost made them look again.',
        evidence: 'Sort reason: "It is in the pipeline report." Value: "…no minimum volume, so none of it is committed yet."',
      },
      {
        id: 'information',
        level: 'practice',
        note: 'The estimate and the real need were the right asks, but Alex never checked who can approve a delivery date.',
        evidence:
          'Requests: estimate → support cost → need. What needs approval: "Nothing for Phase 1: the estimate comes from Solutions Engineering."',
      },
      {
        id: 'tradeoffs',
        level: 'prompted',
        note: 'Weighed the full build against a phased offer, but the reply trades a signature for a date nobody has approved.',
        evidence: 'Reply: "We can have supplier payouts running… in about 4 weeks… We would love to sign this week."',
      },
      {
        id: 'updating',
        level: 'independent',
        note: 'Moved from promising 6 weeks to a phased offer, and said which facts moved them.',
        evidence: 'Why changed: "I started by wanting to promise 6 weeks, because they would sign this week…"',
      },
    ],
    feedback: {
      strength: 'You asked why 6 weeks, and found that what the prospect needs before peak season can be delivered first.',
      improvement:
        'Find out who approves a date before you put one in a reply. "About 4 weeks" in an email is a commitment, and the Head of Solutions Engineering has not approved it.',
      followUp: 'How would you rewrite the reply so it moves the deal forward without a date nobody has approved?',
    },
  },

  // Everything below is a DRAFT: to be confirmed, except where a comment says it comes from the source.
  goal: "Recommend how to move the deal forward: what it is worth, what can be promised and what needs approval, without promising what the team can't deliver.",
  limits: {
    deadline: "Reply before the prospect's board meets on Friday",
    unacceptable: "Promising a feature or a date the team hasn't confirmed, to close the deal",
    authority:
      "You recommend the offer and draft the reply. A date that depends on our team's work needs the Head of Solutions Engineering's written approval; a custom build needs Finance's sign-off.",
  },
  // The name and the five fields are the source's; the hints are drafted.
  submission: {
    name: 'Opportunity Recommendation',
    fields: [
      { id: 'value', label: 'Value of the opportunity', hint: 'What it is worth, and how sure that is' },
      { id: 'dependencies', label: 'Dependencies to confirm', hint: 'What must be true before anything is promised' },
      { id: 'can-promise', label: 'What can be promised', hint: 'Scope and timing the team can stand behind' },
      { id: 'needs-approval', label: 'What needs approval', hint: 'What, and from whom' },
      { id: 'customer-reply', label: 'Draft reply to the customer', hint: 'What you would send them before Friday' },
    ],
  },
  // From the source's three Team Lead observations: focusing only on closing the deal,
  // understanding the customer's real need, and moving forward without a false promise.
  // ifMentions matches at the start of a word, ignoring case. Words marked 'request only' appear in
  // m5–m8 and not in m1–m4.
  assessment: {
    criteria: [
      {
        id: 'real-need',
        label: 'Finds what the customer needs, and by when',
        lookFor: 'Did they look past "sign this week" to what the prospect needs working in 6 weeks, and what can wait?',
        dimensionId: 'goal',
        ifMentions: [
          'peak',
          'what they need',
          'what they actually need',
          'actually need',
          'real need',
          'can wait',
          // DRAFT: to be confirmed. Bare 'within 6 months' became 'up to 6 months', as r3's finding words it, so
          // 'within 6 months' as a review date doesn't count.
          'up to 6 months',
          'up to six months',
          'why 6 weeks',
          'why six weeks',
        ],
        // DRAFT: to be confirmed. Not the review time: 'before peak season' as a review time names no need.
        mentionsIn: [
          'initialPosition',
          'why',
          'ownPlan',
          'value',
          'dependencies',
          'can-promise',
          'needs-approval',
          'customer-reply',
          'mainRisk',
          'owner',
          'changeMind',
        ],
        fields: ['customer-reply'],
        met: 'You worked out what the customer needs by when, and shaped the offer around it.',
        notYet: 'Their list says everything is a must. What do they need working first, and why 6 weeks?',
      },
      {
        id: 'forecast-not-revenue',
        label: 'Treats the forecast as a forecast',
        lookFor: 'Did they keep the A$360,000 apart from committed revenue, and say what it rests on?',
        dimensionId: 'evidence',
        ifMentions: [
          'no minimum',
          'minimum volume',
          'minimum fee',
          'their estimate',
          'their own estimate',
          "prospect's estimate",
          'not committed',
          'not guaranteed',
          'uncommitted',
          'if their volume',
          'if the volume',
          'only a forecast',
          'just a forecast',
          // DRAFT: to be confirmed. Added for the Examine sort reasons. Not 'an estimate', which would also
          // match the reason 'A sales note, not an estimate' on another card.
          'only an estimate',
          'not secured',
          'nothing secures',
          'no volume commitment',
        ],
        // DRAFT: to be confirmed. Not what can be promised, what needs approval or the reply, where 'not committed' or 'not guaranteed'
        // speaks of a date, not the forecast; nor the review time. The Examine sort reasons count: keeping the
        // A$360,000 apart from committed revenue is done on Examine.
        mentionsIn: ['initialPosition', 'examineReasons', 'why', 'ownPlan', 'value', 'dependencies', 'mainRisk', 'owner', 'changeMind'],
        fields: ['value'],
        met: 'You kept the forecast apart from committed revenue, and said what it rests on.',
        notYet: 'A$360,000 is in the pipeline report. What is it based on, and what in the contract secures it?',
      },
      {
        id: 'sized-the-work',
        label: 'Gets an estimate before shaping the offer',
        lookFor: 'Did they find out from the people who would build it how long the work takes?',
        dimensionId: 'information',
        requestIds: ['r1'],
        // Request only (m5), besides 'about 4 weeks', which the rule above makes count only with r1.
        // DRAFT: to be confirmed. Bare '12 weeks', '9 weeks', '4 weeks' and 'four weeks' became the phrases
        // below, so 'in 4 weeks' as a review date, or the other provider's 'four weeks' (m1), doesn't count.
        ifMentions: [
          '10–12',
          '10-12',
          '10 to 12',
          'up to 12 weeks',
          'phase 1',
          'api documentation',
          'took 9 weeks',
          'similar build',
          'about 4 weeks',
          'about four weeks',
        ],
        // DRAFT: to be confirmed. Not the initial position, written before the estimate, nor the review time ('in about 4 weeks').
        mentionsIn: [
          'why',
          'ownPlan',
          'value',
          'dependencies',
          'can-promise',
          'needs-approval',
          'customer-reply',
          'mainRisk',
          'owner',
          'changeMind',
        ],
        met: 'You checked what the team can build, and when, before shaping the offer.',
        notYet: '6 weeks came from the prospect and a sales note. Who has sized the work?',
      },
      {
        id: 'who-approves',
        label: 'Knows who must approve a date',
        lookFor: 'Did they find out who approves a delivery date and a custom build, and plan to ask them before replying?',
        dimensionId: 'information',
        requestIds: ['r4'],
        ifMentions: ['head of solutions engineering', 'written approval', 'in writing', 'finance sign', "finance's sign", 'finance approv'],
        fields: ['needs-approval'],
        met: 'You named who has to approve the dates and the build, and kept your part to recommending them.',
        notYet: 'Check who is allowed to commit the team to a date, and whether your plan asks them first.',
      },
      {
        id: 'no-false-promise',
        label: 'Moves the deal forward without a false promise',
        lookFor: 'Does the reply offer something real before Friday, while keeping unapproved dates out of it?',
        dimensionId: 'tradeoffs',
        ifMentions: [
          'subject to',
          'once approved',
          'once confirmed',
          'once we confirm',
          'once it is approved',
          'we will confirm',
          'confirm the date',
          'confirm dates',
          'after approval',
          'pending approval',
          'when approved',
          "can't promise",
          'cannot promise',
          'not yet approved',
        ],
        // DRAFT: to be confirmed. Only the reply: the criterion judges what the customer is told.
        mentionsIn: ['customer-reply'],
        fields: ['customer-reply', 'can-promise'],
        met: 'Your reply moves the deal forward without promising anything nobody has approved.',
        notYet: 'Read your reply as the customer would. Which sentences would they hold you to, and has anyone agreed to them?',
      },
      {
        id: 'updates-on-facts',
        label: 'Updates the view on what the new facts show',
        lookFor: 'Faced with the estimate, the real need or the rules, did they change or hold their first position for a stated reason?',
        dimensionId: 'updating',
        // Request only: the estimate (m5), the costs (m6), the real need (m7), the rules (m8).
        ifMentions: [
          '10–12',
          '10-12',
          '10 to 12',
          // DRAFT: to be confirmed. Bare '12 weeks', '9 weeks' and 'within 6 months' became these, as in
          // sized-the-work and real-need.
          'up to 12 weeks',
          'took 9 weeks',
          'similar build',
          'api documentation',
          'peak',
          'up to 6 months',
          'up to six months',
          '400 suppliers',
          'a$90,000',
          '90,000',
          'a$10,000',
          // DRAFT: to be confirmed. Bare 'head of solutions engineering' became these, so the Head of
          // Solutions Engineering as the owner doesn't count as updating the view on its own.
          'head of solutions engineering approves',
          'head of solutions engineering must',
          "head of solutions engineering's",
          'written approval',
        ],
        // DRAFT: to be confirmed. The final answer shows the update, not the initial position (written before the requests), the owner or
        // the review time.
        mentionsIn: [
          'why',
          'ownPlan',
          'value',
          'dependencies',
          'can-promise',
          'needs-approval',
          'customer-reply',
          'mainRisk',
          'changeMind',
        ],
        met: 'Your final answer uses what the estimate, the need or the rules showed, not only the call.',
        notYet: 'Compare your final answer with your first position: which new facts changed it, or why did none?',
      },
    ],
    commonMisses: [
      'Promises the full integration in 6 weeks to close the deal this week.',
      'Counts the A$360,000 forecast as if it were signed revenue.',
      "Takes the customer's list, where everything is a must, at face value without asking what they need by when.",
      'Puts a date in the reply before the Head of Solutions Engineering approves it.',
      'Walks away without testing whether a phased offer meets the need.',
    ],
    acceptableAlternatives: [
      'C, offering only what exists today, if no date can be approved before Friday, as long as the reply says what could follow and when it will be confirmed.',
      'Asking the prospect for a few more days to confirm the dates, with a plan they can take to their board.',
      'B with a minimum volume in the contract, so the value is secured before the custom Phase 2 is built.',
    ],
    mustEscalate: [
      "Any go-live or delivery date that depends on our team's work: the Head of Solutions Engineering approves it in writing.",
      "Any custom build: Finance signs off its cost.",
      'A prospect who insists on the full integration in 6 weeks.',
    ],
  },
  // The source's follow-up has two conditions: the customer rejects the alternative, and it raises
  // its revenue expectation. This variant changes only the second; its figures are drafted.
  variant: {
    title: 'A bigger number on the table',
    changedFact:
      'The prospect\'s CFO, on Thursday: "If the full integration is live in six weeks, we expect to send about twice our estimate through you in the first year: A$80 million, not A$40 million." The draft contract still has no minimum volume.',
    lookFor:
      "Whether the learner sees that a bigger forecast changes neither what the team can build in 6 weeks (10–12 weeks for the full integration) nor who must approve a date; that A$80 million is still the prospect's own estimate with no minimum volume; and whether they hold the phased offer, or ask for a minimum volume, instead of promising the full integration. The source's question: does the basis for the judgement change?",
  },
}
