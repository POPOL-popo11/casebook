import type { CaseContent } from '../../contracts/types'

// Eight Weeks to Japan, shared by Dana K. (Solutions & Implementation).
// Lines marked 'DRAFT: to be confirmed' were drafted overnight (wording and fictional facts) and
// wait for the team's check. Everything else comes from the source or the design.
// In a material body, '\n' is a line break and lines with '|' are rows of a small table.
export const CASE: CaseContent = {
  id: 'japan-launch',
  // The source's shared task, translated (not a draft).
  background:
    'A furniture retailer wants to enter the Japanese market in 8 weeks. The team needs to propose a payment launch plan, while considering delivery time, technical scope and the operational burden after launch.',
  brief:
    'A furniture retailer wants to enter the Japanese market in 8 weeks. You need to propose the launch scope, an implementation plan and the questions that still need confirming.',
  // m1–m3 open at the start. m4–m9 unlock by request, one per request (r1 → m4 … r6 → m9); in the
  // team room a role holds the ones with its roleId. Case week 1 falls in early July, after m4's
  // January–June period. Every body, source, date and scope is a DRAFT: to be confirmed.
  materials: [
    {
      id: 'm1',
      title: 'Discovery call notes',
      visibility: 'start',
      // DRAFT: to be confirmed. 'and has a promotion planned for launch day' was added overnight, so the
      // promotion that m6, the room, the reference answers and the outcome name is introduced here,
      // on the Brief card, before the learner meets it (QA overnight 1, finding 3).
      body: 'In the founder\'s words: "We have to be live in Japan in 8 weeks." (said twice) "We\'ll handle returns through a local partner." "Our Japanese followers keep asking about the sofas."\nCommitted: the client launches in Japan in 8 weeks, and has a promotion planned for launch day. We send a launch recommendation within a week.\nNot yet confirmed: whether the returns partner has signed. How refunds will work for Japanese orders.',
      source: 'Discovery call with the founder, notes by Dana K.',
      date: 'Week 1, Monday',
      scope: 'The first call only; nothing here is a contract',
    },
    {
      id: 'm2',
      title: 'Checkout configuration',
      visibility: 'start',
      body: "Supported now: card payments in AUD.\nLimits: no JPY prices or payouts yet. No local payment methods. Refunds are issued by hand, one at a time, from the store's admin panel.\nConfirmed by: the client's e-commerce manager.",
      source: "The client's store settings",
      date: 'Week 1, Tuesday',
      scope: 'The Australian store today; nothing is set up for Japan yet',
    },
    {
      id: 'm3',
      title: 'Sales forecast',
      visibility: 'start',
      body: "Year-one sales in Japan: ¥18M.\nAverage order: about A$1,100, from the Australian store's sales export.\nHow the ¥18M was reached: not stated.\nRange or uncertainty: none given.",
      source: 'The founder, shared after the call',
      date: 'Week 1, Monday',
      scope: 'Japan, year one; sales only',
    },
    // The source: Operations holds the returns data, and its market and period are limited.
    // 420 of 3,000 is the 14%; 9 chargebacks, as on Investigate.
    {
      id: 'm4',
      title: 'Refund history',
      visibility: 'request',
      body: 'Market: Australia only. There are no Japanese orders yet.\nPeriod: January to June, the 6 months before the call.\nOrders: 3,000.\nReturned: 420 orders (14%).\nChargebacks: 9.',
      source: "Operations Lead, from the store's refund log",
      date: 'Week 1, Wednesday',
      scope: 'Australia only, January to June',
      roleId: 'operations-lead',
    },
    {
      id: 'm5',
      title: 'Local entity status',
      visibility: 'request',
      // DRAFT: to be confirmed. The last sentence was added overnight: m7 and every option already
      // assume the base scope (card payments in JPY) can go live in 8 weeks, and without it the note
      // leaves open whether the entity blocks the launch.
      body: "Local entity in Japan: applied for, not yet approved.\nExpected approval: in about 10 weeks, after the 8-week launch.\nUntil then: payment methods that need a local entity can't go live. Card payments in JPY, the base scope, don't need one.",
      source: "The client's legal adviser, by email",
      date: 'Week 1, Thursday',
      scope: 'The Japanese entity application only',
    },
    // The source's Client Lead facts; the wording is drafted.
    {
      id: 'm6',
      title: "Client Lead's note",
      visibility: 'request',
      body: "The client's promotion date is set and will not move.\nThe client stresses the launch date, but can accept opening part of the catalogue first. This is not in the shared brief.\nThe sales forecast has not been fully validated.",
      source: 'Client Lead, from calls with the client',
      date: 'Week 1, Wednesday',
      scope: "The client's priorities for the launch",
      roleId: 'client-lead',
    },
    // The source's fifth material, held by the Engineering Lead. From the source: base scope about
    // 6 weeks; some refund scenarios unverified; a more complex plan has no firm date. Which
    // scenarios are unverified is drafted. The Operations column follows the lead's ruling: untested
    // refunds fall to manual handling, and nobody has estimated how many.
    {
      id: 'm7',
      title: 'Delivery/support estimate',
      visibility: 'request',
      body: 'Base scope (card payments in JPY, full refunds): about 6 weeks.\nRefund scenarios not yet verified: partial refunds on orders with several items; refunds for items returned through the local partner; refunds on orders cancelled after dispatch.\nOption | Build time | Manual work for Operations\nWhole catalogue in 8 weeks | Base scope; the unverified scenarios go live untested | Every unverified refund scenario is handled by hand; nobody has estimated how many that is\nDelay | Base scope plus testing every scenario; no firm date | Little, once every scenario is verified\nPilot with part of the catalogue | Base scope | The unverified scenarios are handled by hand, for a smaller range',
      source: 'Engineering Lead',
      date: 'Week 1, Thursday',
      scope: 'Build time and refund testing; the manual workload is not estimated',
      roleId: 'engineering-lead',
    },
    // The source's Operations Lead facts. The source also says a large launch needs more people;
    // under the lead's ruling this note says only that nobody can size it yet.
    {
      id: 'm8',
      title: 'Support capacity note',
      visibility: 'request',
      body: "Pilot: the current team can handle up to 20 refunds a day that need manual handling.\nFull launch: we can't say whether the team is enough. The initial forecast did not estimate the manual refund workload.\nOur refund data covers Australia only, January to June (see Refund history).",
      source: 'Operations Lead',
      date: 'Week 1, Thursday',
      scope: 'Refund handling for a pilot; a full launch is not sized',
      roleId: 'operations-lead',
    },
    // The source: the forecast has not been fully validated. How it was built is drafted.
    {
      id: 'm9',
      title: 'Forecast workings',
      visibility: 'request',
      body: 'The founder estimated the ¥18M from Australian sales, adjusted by hand for Japan.\nNo Japanese demand data was used.\nThe forecast has not been fully validated.',
      source: 'Client Lead, from the founder',
      date: 'Week 1, Wednesday',
      scope: 'How the ¥18M was built',
      roleId: 'client-lead',
    },
  ],
  framePrompt: 'What must be live in 8 weeks, and what could come later?', // DRAFT: to be confirmed
  constraints: [
    { label: '8-week deadline', known: true },
    { label: 'Ops load?', known: false }, // DRAFT: to be confirmed (was 'Budget?')
    { label: 'Local entity?', known: false },
  ],
  // Every card comes from a start material (m1–m3). c2, c3 and c7 are new drafts: they replace
  // three cards that followed the old payment-method options. c1 now cites the forecast (m3).
  cards: [
    { id: 'c1', text: 'Average order ≈ A$1,100', source: 'Forecast, from AU sales' }, // DRAFT: to be confirmed (source)
    { id: 'c2', text: 'Refunds are issued by hand', source: 'Checkout config' }, // DRAFT: to be confirmed
    { id: 'c3', text: 'AUD cards today, no JPY yet', source: 'Checkout config' }, // DRAFT: to be confirmed
    { id: 'c4', text: 'Launch in 8 weeks', source: 'Founder, on the call' },
    { id: 'c5', text: '¥18M in year-one sales', source: 'Forecast, no source' },
    { id: 'c6', text: 'Returns via a local partner', source: "Founder's plan" },
    { id: 'c7', text: 'Followers ask about the sofas', source: "Founder's impression" }, // DRAFT: to be confirmed
  ],
  requests: [
    {
      id: 'r1',
      title: 'Refund history',
      hours: 1,
      why: 'returns drive the refund and support load', // DRAFT: to be confirmed
      // DRAFT: to be confirmed (the scope added to the 14% and the 9)
      finding: { label: 'Refund history', text: 'Australia, January to June: 14% of 3,000 orders returned. 9 chargebacks.' },
      materialId: 'm4',
    },
    {
      id: 'r2',
      title: 'Local entity status',
      hours: 0.5,
      why: 'local payment methods may need one', // DRAFT: to be confirmed
      finding: { label: 'Local entity', text: 'Approved in ~10 weeks, after launch.' },
      materialId: 'm5',
    },
    // r3–r6: the things to discover, each answered by one role's own information. Hours are placeholders.
    // Together the requests take more than the time budget on purpose: the learner has to choose.
    {
      id: 'r3',
      title: 'Whether the client can accept a limited-scope launch',
      hours: 1,
      why: 'the call notes fix a date, not a scope', // DRAFT: to be confirmed
      finding: {
        label: 'Client Lead',
        text: 'The promotion date is already set. But the client can accept making some products available first. This was not written into the shared brief.',
      },
      materialId: 'm6',
    },
    {
      id: 'r4',
      title: 'Refund process readiness',
      hours: 2,
      why: 'refunds must work from the first order', // DRAFT: to be confirmed
      finding: {
        label: 'Engineering Lead',
        text: 'The basic scope is expected to be done in 6 weeks. Some refund scenarios have not been verified yet.',
      },
      materialId: 'm7',
    },
    {
      id: 'r5',
      title: 'Operations support capacity',
      hours: 1.5,
      why: 'someone must run support and refunds after launch', // DRAFT: to be confirmed
      finding: {
        label: 'Operations Lead',
        text: 'During the pilot, up to 20 refunds a day that need manual handling can be supported. The initial forecast did not estimate this workload.',
      },
      materialId: 'm8',
    },
    // The source's fourth thing to discover. The Client Lead holds it; the finding's first
    // sentence is the source's, the second is drafted.
    {
      id: 'r6',
      title: 'How the forecast was built',
      hours: 1, // DRAFT: to be confirmed
      why: 'the ¥18M figure has no stated source', // DRAFT: to be confirmed
      finding: {
        label: 'Client Lead',
        // DRAFT: to be confirmed (second sentence)
        text: 'The forecast has not been fully validated. The founder estimated it from Australian sales, with no Japanese demand data.',
      },
      materialId: 'm9',
    },
  ],
  timeBudgetHours: 5,
  // Launch-scope options, built only from the source's facts. C stays the pilot, so the source's
  // "the point is not that you must choose C" still refers to it. None of them names the client's
  // flexibility, which the learner finds only by asking the Client Lead. (The promotion itself is
  // introduced in m1; that its date will not move comes from the Client Lead, r3.)
  options: [
    // DRAFT: to be confirmed
    { id: 'A', label: 'Launch the whole catalogue in 8 weeks', tradeoff: 'On time, with the full refund and support load' },
    // DRAFT: to be confirmed
    { id: 'B', label: 'Delay until refunds and support are ready', tradeoff: 'Lower risk, but misses the 8-week date' },
    // DRAFT: to be confirmed
    { id: 'C', label: 'Pilot part of the catalogue, then review', tradeoff: 'On time with a smaller load, if the client agrees' },
  ],
  decisionPoints: [
    {
      id: 'dp1',
      step: 'define',
      title: 'Define the task',
      question: 'What does the client really need in 8 weeks?',
      status: 'confirmed',
    },
    {
      id: 'dp2',
      step: 'examine',
      title: 'Sort the evidence',
      question: 'Which materials are facts, and which are assumptions?',
      status: 'review',
      reviewPrompt: 'The forecast has no source. Treat it as an assumption?',
    },
    {
      id: 'dp3',
      step: 'investigate',
      title: 'Close the gaps',
      question: 'What would you ask for, and is it worth the time?',
      status: 'confirmed',
      // The materials that unlock on request, m4–m9. DRAFT: to be confirmed (all but the first two)
      chips: ['Refund history', 'Entity status', "Client Lead's note", 'Delivery/support estimate', 'Support capacity note', 'Forecast workings'],
    },
    {
      id: 'dp4',
      step: 'decide',
      title: 'Make the call',
      question: 'Which scope, on what conditions, and who owns each risk?', // DRAFT: to be confirmed
      status: 'confirmed',
    },
  ],
  skillIds: ['framing', 'investigation', 'collaboration'], // DRAFT: to be confirmed (matches library.ts)
  senior: {
    decision: 'C', // DRAFT: to be confirmed
    // DRAFT: to be confirmed. The last two sentences, in Dana's voice, were added overnight: what she
    // checked first and why. Her order is the review's (client, then Engineering, then Operations: r3, r4, r5).
    why: 'Date fixed, scope flexible. Some refunds untested; ops can handle up to 20 manual refunds a day. I asked the Client Lead first, because the founder had fixed the date but nobody had said the whole catalogue must open on day one. Once I knew the scope could flex, I asked Engineering what could be tested in time and Operations what they could run.',
    // M3, the reference answers: a reference, not an answer key. Every entry below is a
    // DRAFT: to be confirmed. They follow the source's four checks: the client's hard and
    // negotiable needs, enough evidence for the recommendation, the conditions not yet met,
    // and an owner for each risk and next step.
    byPoint: {
      dp1: {
        answer:
          'To be selling in Japan on the fixed date. Nobody has said the whole catalogue must open on day one, so treat the scope as open until the client confirms it.',
        reason:
          'The brief asks for a scope, a plan and the open questions. Telling the hard requirement (the date) from what may be negotiable (the scope) comes before choosing an option.',
      },
      dp2: {
        answer:
          "Verified: the 8-week date and today's checkout (AUD cards, refunds by hand). Needs checking: the average order, which comes from Australia. Assumptions: the ¥18M forecast and the returns partner. Weak: the followers' interest in sofas.",
        reason:
          "The forecast has no source, so it can't size the launch or the refund load. An impression from social media is a lead to check, not evidence to plan on.",
      },
      dp3: {
        answer:
          'Ask the Client Lead, the Engineering Lead and the Operations Lead: 4.5 of the 5 hours. Leave refund history and the forecast basis for later.',
        reason:
          'Each lead holds a fact that can change the scope: what the client can flex, what can be built and tested in time, and what operations can support. The refund history covers Australia only, and the forecast is already treated as an assumption.',
      },
      dp4: {
        answer:
          'C, with conditions: launch only the products the client agrees to, and handle refunds not yet verified by hand, up to 20 a day. Review before opening more. Owners: Engineering for refund testing, Operations for the daily limit, the Client Lead for the scope.',
        reason:
          'The date is fixed but the scope is not, so a smaller launch keeps the promotion without promising refunds nobody has tested. A is also sound if the refund scenarios are verified before launch and Operations can staff full volume. If the client will not accept a smaller scope, B or escalating is the responsible call.',
      },
    },
    goal: 'Be live on the promotion date with a scope the team can deliver and support', // DRAFT: to be confirmed
    success: ['Agreed scope live on the promotion date', 'Refunds handled within ops capacity'], // DRAFT: to be confirmed
    // DRAFT: to be confirmed
    sort: {
      c1: 'needs-checking',
      c2: 'verified',
      c3: 'verified',
      c4: 'verified',
      c5: 'assumption',
      c6: 'assumption',
      c7: 'weak',
    },
    requestIds: ['r3', 'r4', 'r5'], // DRAFT: to be confirmed. 1 + 2 + 1.5 = 4.5 of the 5 hours
  },
  // DRAFT: to be confirmed. Replaces the old outcome, which followed the payment-method options;
  // it keeps 'below forecast' and 'month four'.
  outcome: 'Part of the catalogue went live on the promotion date. Demand came in below forecast; the rest opened in month four.',
  // The example follows the source's demo path: Alex backs a full launch, asks Engineering (r4),
  // Operations (r5), then the Client Lead (r3), and ends on a conditional pilot of their own.
  // Everything in it is a DRAFT: to be confirmed, except the note, kept from the design.
  example: {
    juniorId: 'alex',
    initialPosition: {
      recommendation: 'A: launch the whole catalogue in 8 weeks',
      reason: 'The founder said the date twice, and nothing in the brief says the launch can be smaller.',
      confidence: 'medium',
      question: 'Can Engineering build and test everything in 8 weeks?',
    },
    goal: 'Get the whole store selling in Japan in 8 weeks',
    success: ["Store live in Japan on the client's date", 'Every refund works from the first order'],
    people: ['Founder', 'Client Lead', 'Engineering Lead', 'Operations Lead'],
    sort: {
      c1: 'verified',
      c2: 'verified',
      c3: 'verified',
      c4: 'verified',
      c5: 'needs-checking',
      c6: 'needs-checking',
      c7: 'weak',
    },
    sortReasons: {
      c1: 'From the Australian sales export, so it is a real number.',
      c2: "In the checkout configuration, confirmed by the client's e-commerce manager.",
      c3: 'Confirmed checkout settings: no JPY today.',
      c4: 'The founder said it twice on the call.',
      c5: "No method or source is given, so I can't rely on it yet.",
      c6: "The founder's plan; nobody has confirmed the partner has signed.",
      c7: 'An impression from social media, not data.',
    },
    missing: ['What Engineering can test in time', 'Who handles refunds after launch'],
    requestedIds: ['r4', 'r5', 'r3'], // 2 + 1.5 + 1 = 4.5 of the 5 hours
    requestIntents: {
      r4: 'Whether every refund can be built and tested in 8 weeks',
      r5: "Who handles the refunds the system can't, and how many they can take",
      r3: 'Whether the client would accept a smaller first launch',
    },
    decision: 'own',
    ownPlan:
      'Pilot part of the catalogue on the promotion date: the products the client picks first. Refunds not yet verified are handled by hand, up to 20 a day. Review after 2 weeks before opening more.',
    basedOn: ['Base scope in about 6 weeks', 'Some refunds unverified', 'Up to 20 manual refunds a day', 'Client can start smaller'],
    why: "The date is fixed, but the client can start with part of the catalogue. Some refunds are unverified, Operations can handle up to 20 a day by hand, and the ¥18M forecast is still an assumption. A smaller launch keeps the date without promising what we can't run.",
    mainRisk: 'An unverified refund goes wrong for a real customer before it is tested',
    changeMind: 'If Engineering verifies all three refund scenarios before launch, I would open the whole catalogue',
    confidence: 'medium',
    submission: {
      scope: 'The products the client picks first, paid by card in JPY. The rest of the catalogue waits for the review.',
      preconditions: 'Base scope built and tested by week 6. The client agrees the first product list. Operations agrees to handle unverified refunds by hand.',
      'risk-owners': 'Engineering Lead: refund testing. Operations Lead: manual refunds and the daily limit. Client Lead: the product list and what the client is told.',
      'stop-adjust': 'Pause new products if manual refunds near 20 a day. Open more once Engineering verifies the remaining refund scenarios.',
    },
    whyChanged:
      "I started by backing a full launch because the founder stressed the date. Engineering told me three refund scenarios aren't verified, Operations can handle up to 20 manual refunds a day in a pilot, and the Client Lead said the client can start with part of the catalogue. So I moved to a pilot with conditions.",
    // Stored without quote marks; the page adds them.
    note: 'I took the deadline as fixed. The founder said it twice.',
  },
  review: {
    managerId: 'sam',
    submittedWhen: 'today',
    minutes: 26,
    // In a row's text, ' → ' shows as the arrow icon (read as 'then').
    // Everything below is a DRAFT: to be confirmed. The senior column matches senior.goal,
    // senior.requestIds and senior.decision.
    rows: [
      { label: 'Goal', junior: 'Whole store live in 8 weeks', senior: 'Live on the date, with a scope we can support', match: 'differs' },
      { label: 'Evidence', junior: 'Forecast needs checking', senior: 'Forecast is an assumption', match: 'differs' },
      { label: 'Investigation', junior: 'Engineering → ops → client', senior: 'Client → engineering → ops', match: 'differs' },
      { label: 'Decision', junior: 'Own plan · conditional pilot', senior: 'C with conditions', match: 'aligned' },
    ],
    blindSpots: ['Goal first framed as the whole store on day one', 'Nobody has confirmed the returns partner has signed; not followed up'],
    confirmQuestions: ['Is a 2-week review soon enough?', 'Should Alex have asked the client first?'],
    feedbackDraft:
      'Good use of the three leads: you changed your plan for reasons you can name. Next time, ask the client what is really fixed before you set the goal.',
    nextFocus: ['framing', 'evidence', 'escalation'],
    nextFocusDefault: 'framing',
    dimensions: [
      {
        id: 'goal',
        level: 'prompted',
        note: 'Alex framed the goal as the whole store in 8 weeks, and confirmed what the client could flex only at the end, after Engineering and Operations.',
        evidence: 'Goal: "Get the whole store selling in Japan in 8 weeks." Last request: "Whether the client would accept a smaller first launch."',
      },
      {
        id: 'evidence',
        level: 'independent',
        note: 'Kept the unsourced forecast and the unconfirmed returns partner apart from confirmed facts, with a reason for each card.',
        evidence: '¥18M forecast: "No method or source is given, so I can\'t rely on it yet."',
      },
      {
        id: 'information',
        level: 'independent',
        note: 'Asked Engineering, Operations and the Client Lead, the three questions that could change the call, in 4.5 of the 5 hours.',
        evidence: 'Engineering: "Whether every refund can be built and tested in 8 weeks." Operations: "Who handles the refunds the system can\'t, and how many they can take."',
      },
      {
        id: 'tradeoffs',
        level: 'independent',
        note: 'The plan names its preconditions, owners and a stop condition, and says what stays at risk. It does not cover the returns partner, whose signing nobody has confirmed.',
        evidence: 'Stop or adjust: "Pause new products if manual refunds near 20 a day." Main risk: "An unverified refund goes wrong for a real customer before it is tested."',
      },
      {
        id: 'updating',
        level: 'independent',
        note: 'Moved from a full launch to a conditional pilot, and named the facts that moved them.',
        evidence: 'Why changed: "I started by backing a full launch because the founder stressed the date … So I moved to a pilot with conditions."',
      },
    ],
    feedback: {
      strength: "You changed your plan for reasons you can name: the unverified refunds, the manual limit and the client's flexibility.",
      improvement: "Ask the client what is really fixed before you set the goal. You treated 'live in 8 weeks' as the whole store until your last request.",
      followUp: "Nobody has confirmed the returns partner has signed. How would your pilot handle returns if it isn't ready on the date?",
    },
  },

  // ---------------------------------------------------------------------------
  // Overnight additions. Everything below is a DRAFT: to be confirmed, except where a comment
  // says it comes from the source.
  // ---------------------------------------------------------------------------
  goal: 'Recommend a launch scope and plan the team can deliver and support in 8 weeks, and name what still needs confirming.',
  limits: {
    deadline: 'Live in Japan in 8 weeks', // the source; it gives no budget
    unacceptable: 'Promising the client something the team cannot deliver or support',
    authority:
      "You recommend the scope, its conditions and its owners. Moving the client's date, or committing Engineering's or Operations' time, needs them to agree.",
  },
  // The name and the four field labels are the source's; the hints are drafted.
  submission: {
    name: 'Launch Recommendation',
    fields: [
      { id: 'scope', label: 'Launch scope', hint: 'What goes live on day one, and what comes later' },
      { id: 'preconditions', label: 'Preconditions', hint: 'What must be true before launch' },
      { id: 'risk-owners', label: 'Risk owners', hint: 'Who owns each open risk' },
      { id: 'stop-adjust', label: 'Stop or adjust conditions', hint: 'What would make you pause, shrink or widen the launch' },
    ],
  },
  // From the source's four checks for Case Experts and its three Team Lead observations.
  // ifMentions matches at the start of a word, ignoring case.
  assessment: {
    criteria: [
      {
        id: 'client-needs',
        label: "Confirms the client's hard and negotiable needs",
        lookFor: 'Did they check what must happen on the date and what the client can flex, and use it in the plan?',
        dimensionId: 'goal',
        requestIds: ['r3'],
        // DRAFT: to be confirmed. 'promotion' became the Client Lead's phrases (r3), so 'after the
        // promotion' as a review date doesn't count.
        ifMentions: [
          'part of the catalogue',
          'smaller',
          'some products',
          'first products',
          'will not move',
          'client can accept',
          'client can start',
          'date is fixed',
          'negotiable',
          'flex',
        ],
        // DRAFT: to be confirmed. Not the review time ('after the first products sell').
        mentionsIn: [
          'initialPosition',
          'why',
          'ownPlan',
          'scope',
          'preconditions',
          'risk-owners',
          'stop-adjust',
          'mainRisk',
          'owner',
          'changeMind',
        ],
        met: 'You checked what the client must have and what they can flex, and your plan uses it.',
        notYet: 'Look again at what the client actually said must happen in 8 weeks, and what they never said.',
      },
      {
        id: 'forecast-assumption',
        label: 'Treats the forecast as an assumption',
        lookFor: 'Did they keep the ¥18M forecast apart from the facts, and not let it size the launch?',
        dimensionId: 'evidence',
        // DRAFT: to be confirmed. The words from 'not sourced' on were added for the Examine sort reasons,
        // where a learner says why the ¥18M is not a fact ('No method or source is given').
        ifMentions: [
          'assumption',
          'assume',
          'unproven',
          'not validated',
          'no source',
          'not reliable',
          'not sourced',
          'unsourced',
          'no method',
          'no basis',
          'not stated',
          'unvalidated',
        ],
        // DRAFT: to be confirmed. Not the review time ('when the assumption is tested'). The Examine sort
        // reasons count: keeping the forecast apart from the facts is done on Examine.
        mentionsIn: [
          'initialPosition',
          'examineReasons',
          'why',
          'ownPlan',
          'scope',
          'preconditions',
          'risk-owners',
          'stop-adjust',
          'mainRisk',
          'owner',
          'changeMind',
        ],
        // DRAFT: to be confirmed. Ticking the ¥18M (c5) under 'Based on' means the call still rests on the forecast.
        notBasedOn: ['c5'],
        met: 'You kept the forecast apart from the facts and did not let it decide the scope.',
        notYet: 'Check where each number in your plan comes from, and which of them nobody has tested.',
      },
      {
        id: 'decisive-questions',
        label: 'Asks the questions that can change the call',
        lookFor: 'Did they ask Engineering and Operations before committing to a scope?',
        dimensionId: 'information',
        requestIds: ['r4', 'r5'],
        met: 'You asked the people who build and run the launch before you committed to a scope.',
        // DRAFT: to be confirmed. Points to the missing piece (whether refunds work on day one) without
        // saying which refunds are unverified.
        notYet: "Whether refunds will work on day one is Engineering's call. Did you ask them, and Operations, before you committed to a scope?",
      },
      {
        id: 'engineering-limits',
        label: 'Turns the engineering limits into the plan',
        lookFor: 'Did the plan deal with the refund scenarios that are not verified yet?',
        dimensionId: 'tradeoffs',
        requestIds: ['r4'],
        // DRAFT: to be confirmed. Bare 'test' became 'refund test', 'test the refund' and 'refund scenario',
        // so 'after testing' as a review date doesn't count.
        ifMentions: [
          'unverified',
          'untested',
          'not verified',
          'partial refund',
          'refund test',
          'test the refund',
          'refund scenario',
          'by hand',
          'manual',
        ],
        // DRAFT: to be confirmed. Not the initial position, written before Engineering's answer, nor the review time ('when refund testing
        // is done').
        mentionsIn: ['why', 'ownPlan', 'scope', 'preconditions', 'risk-owners', 'stop-adjust', 'mainRisk', 'owner', 'changeMind'],
        met: 'Your plan says what happens to the refunds that are not verified yet.',
        notYet: 'Look at what Engineering can and cannot promise by launch day, and where your plan uses it.',
      },
      {
        id: 'operations-load',
        label: 'Builds the operations load into the commitment',
        lookFor: 'Did the commitment stay within what Operations said it can handle, and say who carries the manual work?',
        dimensionId: 'tradeoffs',
        requestIds: ['r5'],
        // DRAFT: to be confirmed. Bare 'operations' became the phrases below, so 'Operations Lead' as the
        // owner doesn't count on its own.
        ifMentions: [
          'manual',
          'by hand',
          '20 a day',
          '20 refunds',
          'capacity',
          'workload',
          'operations can',
          'operations said',
          'operations says',
          'operations capacity',
          'operations load',
        ],
        // DRAFT: to be confirmed. Not the initial position, written before Operations' answer.
        mentionsIn: [
          'why',
          'ownPlan',
          'scope',
          'preconditions',
          'risk-owners',
          'stop-adjust',
          'mainRisk',
          'owner',
          'reviewBy',
          'changeMind',
        ],
        met: 'Your commitment stays within what Operations said it can handle.',
        notYet: 'Check who runs refunds and support after launch, and what they can take on.',
      },
      {
        id: 'owners-and-stops',
        label: 'Names preconditions, owners and when to stop or adjust',
        lookFor: 'Are the conditions not yet met explicit, and does each risk and next step have an owner?',
        dimensionId: 'tradeoffs',
        fields: ['preconditions', 'risk-owners', 'stop-adjust'],
        met: 'You named what must be true first, who owns each risk, and when to stop or adjust.',
        // DRAFT: to be confirmed. The app names the fields still empty or too short after this text.
        notYet: 'Say what must be true first, who owns each risk, and when you would stop or adjust.',
      },
      {
        id: 'updates-on-new-facts',
        label: 'Updates the view on new facts',
        lookFor: 'Faced with what they found out, did they change or hold their first position for a stated reason?',
        dimensionId: 'updating',
        // Facts only a request reveals: the fixed date and the client's flexibility (r3), 6 weeks and
        // the refund scenarios (r4), 20 a day (r5), the forecast's validation (r6).
        // DRAFT: to be confirmed. 'promotion' was dropped, since m1 now introduces the promotion at the
        // start; the r3 phrases replace it, so an answer built on the Client Lead's note still counts.
        ifMentions: [
          'will not move',
          'client can accept',
          'client can start',
          'client will accept',
          'not in the shared brief',
          // DRAFT: to be confirmed. Bare '6 weeks' and 'six weeks' became these, so 'in 6 weeks' as a
          // review date doesn't count.
          'about 6 weeks',
          'about six weeks',
          'takes 6 weeks',
          'done in 6 weeks',
          'build in 6 weeks',
          'built in 6 weeks',
          'partial refund',
          'returned through',
          'cancelled after dispatch',
          '20 a day',
          '20 refunds',
          'not fully validated',
        ],
        // DRAFT: to be confirmed. The final answer shows the update, not the initial position (written before the requests), the owner or
        // the review time.
        mentionsIn: ['why', 'ownPlan', 'scope', 'preconditions', 'risk-owners', 'stop-adjust', 'mainRisk', 'changeMind'],
        met: 'Your final answer uses what you found out, not only what you knew at the start.',
        notYet: 'Compare your final plan with your first position: which new facts changed it, or why did none?',
      },
    ],
    commonMisses: [
      "Reads 'live in 8 weeks' as 'the whole catalogue on day one' without asking the client.",
      'Plans on the ¥18M forecast as if it were a fact.',
      'Commits to a scope before asking Engineering which refunds work.',
      'Leaves out who handles refunds by hand, and how many they can take.',
      'Names risks without owners, or a pilot without a review point.',
    ],
    acceptableAlternatives: [
      'A, the whole catalogue in 8 weeks, if the unverified refund scenarios are verified before launch and Operations confirms it has the people for the manual work.',
      'B, or escalating, if the client will not accept a smaller first launch.',
      "The learner's own conditional plan, if it keeps the date, names its preconditions and owners, and says when it would stop or adjust.",
    ],
    mustEscalate: [
      "Moving the client's promotion date.",
      'Committing Engineering or Operations beyond what their leads have agreed.',
      'The client refuses a smaller launch and the refund scenarios cannot be verified in time.',
    ],
  },
  // The source's follow-up: the client no longer accepts a smaller scope.
  variant: {
    title: 'The client wants everything on day one',
    changedFact:
      'Client Lead: The client has changed its mind. It now wants the whole catalogue live on the promotion date and will not accept a smaller first launch.',
    lookFor:
      "Whether the learner re-weighs the call now that a smaller launch is off the table: a full launch only if the refund scenarios can be verified and handled in time, otherwise delay or escalation, instead of keeping the pilot by habit. The source's question: does the original recommendation still hold?",
  },
  // Team mode. Each role's knows comes only from its own information in the source; canNegotiate
  // is the source's; goal, limits and cannotDecide are drafted. Which refund scenarios are
  // unverified is drafted, as in m7.
  roles: [
    {
      id: 'client-lead',
      title: 'Client Lead',
      goal: "Keep the client's launch on the promotion date, with a scope the client will accept.",
      knows: [
        'The promotion date is set.',
        'The client stresses the launch date, but can accept opening part of the catalogue first. This is not in the shared brief.',
        'The sales forecast has not been fully validated. The founder estimated it from Australian sales, with no Japanese demand data.',
      ],
      limits: 'Cannot move the promotion date. Speaks for the client, not for Engineering or Operations.',
      canNegotiate: 'The launch scope, and how the client is told about it.',
      cannotDecide: 'What Engineering can build in time, or what Operations can support.',
    },
    {
      id: 'engineering-lead',
      title: 'Engineering Lead',
      goal: 'Commit only to what can be built and tested before launch.',
      knows: [
        'The base scope, card payments in JPY with full refunds, takes about 6 weeks.',
        'Three refund scenarios are not verified yet: partial refunds on orders with several items, refunds for items returned through the local partner, and refunds on orders cancelled after dispatch.',
        'A more complex scope has no firm delivery date.',
      ],
      limits: 'About 2 weeks between the base build and the launch date, and no firm date for testing every refund scenario.',
      canNegotiate: 'The technical scope, the order of testing, and the conditions for going live.',
      cannotDecide: "The launch date, the client's scope, or how many refunds Operations can handle.",
    },
    {
      id: 'operations-lead',
      title: 'Operations Lead',
      goal: 'Make sure whatever launches can be run day to day, including refunds handled by hand.',
      knows: [
        'In a pilot, the team can handle up to 20 refunds a day that need manual handling.',
        'The initial forecast did not estimate this workload.',
        'The refund data covers Australia only, January to June: 14% of 3,000 orders returned, 9 chargebacks.',
      ],
      limits: 'Cannot say whether the team is enough for a full launch until someone estimates the manual refund load.',
      canNegotiate: "The pilot's size, the support arrangements, and when to review.",
      cannotDecide: 'The launch scope, the date, or what Engineering builds.',
    },
  ],
  // The lead's ruling: the human plays the Client Lead; Engineering and Operations are AI roles.
  // Every answer comes only from the asked role's own material (materialId).
  // DRAFT: to be confirmed. The learner may also play Engineering or Operations; the Client Lead is
  // then an AI role, answering q10–q12, its replies and its challenge reply from m6 and m9 only.
  room: {
    humanRoleId: 'client-lead',
    aiRoleIds: ['engineering-lead', 'operations-lead'],
    playableRoleIds: ['client-lead', 'engineering-lead', 'operations-lead'],
    questions: [
      {
        id: 'q1',
        toRoleId: 'engineering-lead',
        text: 'What can you build and test before the launch date?',
        answer: 'The base scope, card payments in JPY with full refunds, takes about 6 weeks. That leaves about 2 weeks before the date.',
        reveals: 'The base scope takes about 6 weeks',
        materialId: 'm7',
      },
      {
        id: 'q2',
        toRoleId: 'engineering-lead',
        text: "Which refunds aren't verified yet?",
        answer:
          "Three aren't: partial refunds on orders with several items, refunds for items returned through the local partner, and refunds on orders cancelled after dispatch.",
        reveals: 'Three refund scenarios are not verified yet',
        materialId: 'm7',
      },
      {
        id: 'q3',
        toRoleId: 'engineering-lead',
        text: 'Could the whole catalogue go live in 8 weeks?',
        answer:
          'The base build, yes. But the three unverified refund scenarios would go live untested, and every one of them would be handled by hand. Nobody has estimated how many that is.',
        reveals: 'A full launch sends untested refunds to manual handling',
        materialId: 'm7',
      },
      {
        id: 'q4',
        toRoleId: 'engineering-lead',
        text: 'How long would it take to test every refund scenario?',
        answer: "I can't give you a firm date. A more complex scope has no firm delivery date yet.",
        reveals: 'No firm date for testing every refund scenario',
        materialId: 'm7',
      },
      {
        id: 'q5',
        toRoleId: 'engineering-lead',
        text: 'What would you need from me for a smaller launch?',
        answer: 'Tell me which products open first. Then I can agree the order of testing and the conditions for going live around them.',
        materialId: 'm7',
      },
      {
        id: 'q6',
        toRoleId: 'operations-lead',
        text: 'How many refunds can your team handle by hand?',
        answer: 'In a pilot, up to 20 refunds a day that need manual handling.',
        reveals: 'Pilot: up to 20 manual refunds a day',
        materialId: 'm8',
      },
      {
        id: 'q7',
        toRoleId: 'operations-lead',
        text: 'Could your team support a full launch?',
        answer:
          "I can't say. The initial forecast didn't estimate the manual refund workload, so nobody knows how many refunds we would be handling.",
        reveals: 'The forecast has no workload estimate',
        materialId: 'm8',
      },
      {
        id: 'q8',
        toRoleId: 'operations-lead',
        text: 'What does your refund data show?',
        answer:
          'Australia only, January to June: 14% of 3,000 orders were returned, and there were 9 chargebacks. We have no Japanese data yet.',
        reveals: 'The refund data is Australian only',
        materialId: 'm4',
      },
      {
        id: 'q9',
        toRoleId: 'operations-lead',
        text: 'What would you want agreed before a pilot?',
        answer: "The pilot's size, who covers support, and when we review. I can agree all three with you.",
        materialId: 'm8',
      },
      // DRAFT: to be confirmed. q10–q12 ask the Client Lead, for a learner playing another role.
      {
        id: 'q10',
        toRoleId: 'client-lead',
        text: 'Can the launch date move?',
        answer: "No. The client's promotion date is set and will not move.",
        reveals: 'The promotion date will not move',
        materialId: 'm6',
      },
      {
        id: 'q11',
        toRoleId: 'client-lead',
        text: 'Would the client accept a smaller first launch?',
        answer:
          'Yes. The client stresses the launch date, but can accept opening part of the catalogue first. This is not in the shared brief.',
        reveals: 'The client can accept part of the catalogue first',
        materialId: 'm6',
      },
      {
        id: 'q12',
        toRoleId: 'client-lead',
        text: 'How was the ¥18M forecast built?',
        answer:
          'The founder estimated it from Australian sales, adjusted by hand for Japan. No Japanese demand data was used, and the forecast has not been fully validated.',
        reveals: 'The forecast is not validated; no Japanese demand data',
        materialId: 'm9',
      },
    ],
    unknownAnswer: 'That isn’t in my brief, so I don’t know.',
    // When the human writes to an AI role, the first reply whose words appear answers.
    replies: [
      {
        id: 'eng-smaller-scope',
        toRoleId: 'engineering-lead',
        ifMentions: ['part of the catalogue', 'some products', 'smaller', 'fewer products'],
        text: 'That helps. If only part of the catalogue opens first, I can test the refund scenarios those products need first, and leave the rest for later.',
        materialId: 'm7',
      },
      {
        id: 'eng-pilot',
        toRoleId: 'engineering-lead',
        ifMentions: ['pilot', 'trial'],
        text: 'A pilot works for me if Operations handles the unverified refund scenarios by hand until I have tested them.',
        materialId: 'm7',
      },
      {
        id: 'eng-full-launch',
        toRoleId: 'engineering-lead',
        ifMentions: ['full launch', 'whole catalogue', 'everything', 'all products'],
        text: "I can build the base scope in about 6 weeks. The three unverified refund scenarios would go live untested and fall to manual handling. I can't promise them tested by the date.",
        materialId: 'm7',
      },
      {
        id: 'eng-outside-brief',
        toRoleId: 'engineering-lead',
        ifMentions: ['forecast', 'demand', 'sales', 'budget', 'staff'],
        text: "That isn't in my brief. I only know the build and the refund testing.",
      },
      {
        id: 'ops-smaller-scope',
        toRoleId: 'operations-lead',
        ifMentions: ['part of the catalogue', 'some products', 'smaller', 'fewer products'],
        text: 'A smaller first launch means fewer refunds to handle by hand. In a pilot we can take up to 20 a day.',
        materialId: 'm8',
      },
      {
        id: 'ops-pilot',
        toRoleId: 'operations-lead',
        ifMentions: ['pilot', 'trial'],
        text: "We can support a pilot, up to 20 manual refunds a day. Let's agree its size, who covers support, and when we review.",
        materialId: 'm8',
      },
      {
        id: 'ops-full-launch',
        toRoleId: 'operations-lead',
        ifMentions: ['full launch', 'whole catalogue', 'everything', 'all products'],
        text: "For a full launch I can't say whether we have enough people. Nobody has estimated how many refunds would need handling by hand.",
        materialId: 'm8',
      },
      {
        id: 'ops-outside-brief',
        toRoleId: 'operations-lead',
        ifMentions: ['build', 'test', 'engineering', 'code', 'budget'],
        text: "That isn't in my brief. I know what we can handle by hand, not what can be built or tested.",
      },
      // DRAFT: to be confirmed. The Client Lead's replies, from m6.
      {
        id: 'client-smaller-scope',
        toRoleId: 'client-lead',
        ifMentions: ['part of the catalogue', 'some products', 'smaller', 'fewer products', 'pilot'],
        text: 'The client can accept opening part of the catalogue first. The promotion date is set and will not move.',
        materialId: 'm6',
      },
      {
        id: 'client-delay',
        toRoleId: 'client-lead',
        ifMentions: ['delay', 'postpone', 'move the date', 'later date', 'push back'],
        text: "The client's promotion date is set and will not move. Whatever we propose has to keep it.",
        materialId: 'm6',
      },
    ],
    challengeReplies: {
      // DRAFT: to be confirmed. From m6.
      'client-lead':
        'I understand the risk. But the promotion date is set and will not move, and the client stresses it. The client can accept opening part of the catalogue first, so give me a scope I can take to them.',
      'engineering-lead':
        "I hear you, but I can only commit to what we can test. The base scope takes about 6 weeks, three refund scenarios aren't verified, and I have no firm date for them. Tell me the scope and I'll tell you what I can stand behind.",
      'operations-lead':
        "I'm not against it. But I can only promise what we can run: up to 20 manual refunds a day in a pilot. For anything bigger, nobody has estimated the manual load, so I can't tell you whether we have enough people.",
    },
    // DRAFT: to be confirmed. q10 (the date will not move) was added to the two conflicts with the
    // Client Lead, so a learner playing another role finds them by asking the Client Lead. Playing the
    // Client Lead, q10 counts as asked, so nothing changes for that role.
    conflicts: [
      {
        id: 'date-vs-refunds',
        text: 'The promotion date is fixed, but three refund scenarios are not verified.',
        between: ['client-lead', 'engineering-lead'],
        revealedBy: ['q2', 'q10'],
      },
      {
        id: 'refunds-vs-workload',
        text: 'Untested refunds fall to manual handling, and nobody has estimated that load.',
        between: ['engineering-lead', 'operations-lead'],
        revealedBy: ['q3', 'q7'],
      },
      {
        id: 'date-vs-support',
        text: 'The client wants the date, but support is sized only for a pilot.',
        between: ['client-lead', 'operations-lead'],
        revealedBy: ['q6', 'q7', 'q10'],
      },
    ],
  },
}
