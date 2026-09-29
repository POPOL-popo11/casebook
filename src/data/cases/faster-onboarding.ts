import type { CaseContent } from '../../contracts/types'

// Faster Onboarding, Better Product?, shared by Nadia F. (Product). Individual mode only.
// The source gives the task (62% to 74%, the team wants to roll it out to everyone), the material
// names, the key information (the two flows' applicants differ, later risk results haven't shown
// yet, the manual review load may change), the submission, the three Team Lead observations and the
// follow-up. Every fact beyond those, and all wording not translated from the source, is a
// DRAFT: to be confirmed.
// In a material body, '\n' is a line break and lines with '|' are rows of a small table (first row: header).
export const CASE: CaseContent = {
  id: 'faster-onboarding',
  // The source's task, translated (not a draft).
  background: 'The completion rate of the new onboarding flow rose from 62% to 74%. The team wants to roll it out to everyone.',
  brief:
    'The completion rate of the new onboarding flow rose from 62% to 74%. The team wants to roll it out to everyone. You need to give your assessment and a recommendation.',
  // m1–m3 open at the start; m4–m7 unlock by request (r1 → m4 … r4 → m7). Figures agree across
  // materials: 5,000 old-flow applicants, 3,100 completed (62%); 1,000 new-flow applicants, 740
  // completed (74%). By group: partner-referred 1,000 of 1,250 (80%) and 560 of 700 (80%); direct
  // 2,100 of 3,750 (56%) and 180 of 300 (60%). Manual reviews 465 of 3,100 (15%) and 222 of 740 (30%).
  // The pilot ran Weeks 1–4; the data was pulled in Week 6, so only Week 1 has 30 days of history.
  // Every body, source, date and scope is a DRAFT: to be confirmed.
  materials: [
    {
      id: 'm1',
      title: 'Completion rates for both versions',
      visibility: 'start',
      body: 'Completion: the applicant submits a full application.\nOld flow: 62%. New flow: 74%. That is 12 percentage points higher.\nPeriod: the pilot, Weeks 1–4.\nProduct team\'s summary: "The new flow lifts completion by 12 points. Both groups are new business applicants, so the comparison is like for like. We propose rolling it out to all applicants."',
      source: 'Pilot results, Product team',
      date: 'Week 6, Monday',
      scope: 'Completion only; nothing after an application is submitted',
    },
    {
      id: 'm2',
      title: 'Sample sizes',
      visibility: 'start',
      body: 'Applicants in the pilot, Weeks 1–4:\nFlow | Started | Completed\nOld flow | 5,000 | 3,100\nNew flow | 1,000 | 740\nHow applicants were split between the two flows: not described here.',
      source: 'Pilot results, Product team',
      date: 'Week 6, Monday',
      scope: 'Counts only; who the applicants were is not shown',
    },
    {
      id: 'm3',
      title: 'Flow change notes',
      visibility: 'start',
      body: "The new flow went live as a pilot on Week 1, Monday.\nSteps: 7 before, 4 now.\nCompany details now fill in from the business registry once the applicant enters their company number.\nMoved to after submission: the business owners' details, and document uploads. Reviewers ask for them by email when an application needs them.\nRisk checks: unchanged.\nFeedback: five pilot applicants left comments saying the form felt quicker.",
      source: 'Product team',
      date: 'Week 1, Monday; feedback added in Week 4',
      scope: 'What changed in the form; not how applicants were chosen for it',
    },
    {
      id: 'm4',
      title: 'User groups',
      visibility: 'request',
      body: "Applicants by how they arrived, Weeks 1–4:\nGroup | Old flow | New flow\nReferred by a partner | 1,000 of 1,250 completed (80%) | 560 of 700 completed (80%)\nCame directly | 2,100 of 3,750 completed (56%) | 180 of 300 completed (60%)\nAll applicants | 3,100 of 5,000 completed (62%) | 740 of 1,000 completed (74%)\nReferred by a partner: 25% of old-flow applicants, 70% of new-flow applicants.\nPartner-referred applicants usually complete more often: their partner has already collected most of their details.",
      source: 'Product analytics',
      date: 'Week 6, Tuesday',
      scope: 'Weeks 1–4, split only by how applicants arrived',
    },
    // The source: later risk results have not fully shown yet.
    {
      id: 'm5',
      title: 'Later activation',
      visibility: 'request',
      body: 'Activation: the new account makes its first payment within 30 days of the application being completed.\nOnly applications completed in Week 1 have had 30 days so far.\nFlow | Week 1 applications | Activated within 30 days\nOld flow | 780 | 468 (60%)\nNew flow | 150 | 81 (54%)\nNot split by how applicants arrived.\nRisk results: accounts restricted after a risk review usually show up 60–90 days after the application. No pilot account is that old yet.',
      source: 'Product analytics, with the Risk team',
      date: 'Week 6, Tuesday',
      scope: 'Week 1 applications only; no risk results yet',
    },
    // The source: the manual review burden may also change.
    {
      id: 'm6',
      title: 'Manual review workload',
      visibility: 'request',
      body: "Completed applications sent to manual review, Weeks 1–4:\nFlow | Completed | Sent to manual review\nOld flow | 3,100 | 465 (15%)\nNew flow | 740 | 222 (30%)\nWhy more: new-flow applications often arrive without the owners' details, so a reviewer has to ask for them by email.\nEach review takes about 20 minutes. One that needs an email adds about 2 days before the account opens.\nCapacity: the review team can take about 25% more reviews a week than before the pilot, without more staff.\nOperations' estimate: if every applicant used the new flow, manual reviews would about double.",
      source: 'Operations, review team lead',
      date: 'Week 6, Tuesday',
      scope: 'Manual reviews only; not the risk checks themselves',
    },
    // The source: the two flows' applicants are not fully alike.
    {
      id: 'm7',
      title: 'Observation period and how users were assigned',
      visibility: 'request',
      body: "Pilot period: 4 weeks, Weeks 1–4. Both flows ran over the same 4 weeks.\nWho saw the new flow: every applicant who arrived through the largest partner's referral link, and every applicant from one paid-search landing page. Everyone else saw the old flow.\nNobody was assigned at random.\nCompletion is counted on the day an application is submitted. First payments and risk reviews come later, so 4 weeks shows little of either.",
      source: 'Product team, pilot set-up',
      date: 'Week 6, Tuesday',
      scope: 'How the pilot was run; not its results',
    },
  ],
  framePrompt: 'Completion rose 12 points. Did the new flow cause it?', // DRAFT: to be confirmed
  constraints: [
    { label: 'Product review Thursday', known: true }, // DRAFT: to be confirmed
    { label: 'Review capacity?', known: false }, // DRAFT: to be confirmed
    { label: 'Fair comparison?', known: false }, // DRAFT: to be confirmed
  ],
  // Every card comes from a start material (m1–m3); each is a DRAFT: to be confirmed.
  cards: [
    { id: 'c1', text: 'New flow 74%, old flow 62%', source: 'Completion rates' },
    { id: 'c2', text: 'New flow 1,000 applicants, old 5,000', source: 'Sample sizes' },
    { id: 'c3', text: "Owners' details now asked after submission", source: 'Flow change notes' },
    { id: 'c4', text: 'The two groups were alike', source: "Product team's summary" },
    { id: 'c5', text: 'The new flow caused the rise', source: "Product team's summary" },
    { id: 'c6', text: 'Applicants found the form quicker', source: 'Five pilot comments' },
  ],
  // The source's four requestable materials. Hours and why lines are DRAFT: to be confirmed.
  // Together they take 3 h against a 2.5 h budget, so the learner has to choose.
  requests: [
    {
      id: 'r1',
      title: 'User groups',
      hours: 1,
      why: 'a different mix of applicants can move the rate on its own',
      finding: {
        label: 'User groups',
        text: '70% of new-flow applicants came through a partner, against 25%. Within each group the gap is 0 and 4 points.',
      },
      materialId: 'm4',
    },
    {
      id: 'r2',
      title: 'Later activation',
      hours: 1,
      why: 'finishing the form is not the same as using the account',
      finding: {
        label: 'Later activation',
        text: 'Week 1 only: 54% of new-flow applicants made a first payment within 30 days, against 60%. No risk results yet.',
      },
      materialId: 'm5',
    },
    {
      id: 'r3',
      title: 'Manual review workload',
      hours: 0.5,
      why: 'questions moved after submission may move work to Operations',
      finding: {
        label: 'Manual reviews',
        text: '30% of new-flow applications need a manual review, against 15%. The review team can take about 25% more.',
      },
      materialId: 'm6',
    },
    {
      id: 'r4',
      title: 'Observation period and how users were assigned',
      hours: 0.5,
      why: 'a fair comparison needs similar applicants over the same weeks',
      finding: {
        label: 'Pilot set-up',
        text: "Not random: the new flow went to the largest partner's link and one paid-search page, for 4 weeks.",
      },
      materialId: 'm7',
    },
  ],
  timeBudgetHours: 2.5, // DRAFT: to be confirmed
  // A roll out now, B a fair test with limits, C wait. DRAFT: to be confirmed
  options: [
    {
      id: 'A',
      label: 'Roll the new flow out to everyone',
      tradeoff: 'Keeps the lift if it is real; commits before activation, reviews and risk are known',
    },
    {
      id: 'B',
      label: 'Expand as a fair test, with limits',
      tradeoff: 'Shows what the flow itself does; the full rollout waits several weeks',
    },
    {
      id: 'C',
      label: 'Keep the pilot as it is, and wait',
      tradeoff: 'No new risk; more of the same data is still not a fair comparison',
    },
  ],
  // DRAFT: to be confirmed (titles follow the Japan case; questions and prompt are drafted)
  decisionPoints: [
    {
      id: 'dp1',
      step: 'define',
      title: 'Define the task',
      question: 'What is the team asking, and what would make the new flow better?',
      status: 'confirmed',
    },
    {
      id: 'dp2',
      step: 'examine',
      title: 'Sort the evidence',
      question: 'Which are measurements, and which are readings of them?',
      status: 'review',
      reviewPrompt: 'The summary says the two groups were alike. Has anyone checked?',
    },
    {
      id: 'dp3',
      step: 'investigate',
      title: 'Close the gaps',
      question: 'What would show whether the flow or the applicants made the difference, and what else the flow changed?',
      status: 'confirmed',
      chips: ['User groups', 'Later activation', 'Manual review workload', 'Observation period and how users were assigned'],
    },
    {
      id: 'dp4',
      step: 'decide',
      title: 'Make the call',
      question: 'Roll out, test fairly, or wait? On what conditions?',
      status: 'confirmed',
    },
  ],
  skillIds: ['evidence', 'framing', 'decision'], // matches library.ts
  // Nadia's reference answers: a reference, not an answer key. Everything in senior is a
  // DRAFT: to be confirmed. It follows the source's three Team Lead observations.
  senior: {
    decision: 'B',
    why: 'Most of the 12 points comes from who saw the new flow. A random split, with limits on activation, manual reviews and risk, shows what the flow itself does without overloading Operations.',
    byPoint: {
      dp1: {
        answer:
          'Judge what the pilot shows about the flow, and recommend whether and how to expand it. A better flow brings in customers who complete, go on to use their accounts and pass risk checks, at a review load Operations can carry.',
        reason:
          'Completion is the one number the pilot moved. The team needs good customers, so the question is whether the flow brings in more of them, and at what cost.',
      },
      dp2: {
        answer:
          "Verified: the two completion rates, the sample sizes, and the owners' details moving after submission. Needs checking: that the two groups were alike. Assumption: that the flow caused the rise. Weak: five comments that the form felt quicker.",
        reason:
          "The rates are measurements; the summary's reading of them is not. Nothing at the start says how applicants were split between the flows.",
      },
      dp3: {
        answer:
          'User groups, later activation and the manual review workload: 2.5 of the 2.5 hours. Skip how users were assigned: the user groups already show the two groups differ.',
        reason:
          'The user groups show whether the flow or the mix made the difference. Activation and the review load show what the completion rate hides.',
      },
      dp4: {
        answer:
          'B: run the new flow against the old one at random, for 1 in 5 applicants in every channel, until 30-day activation is in. Stop if activation falls clearly below the old flow or manual reviews pass what Operations can take. The product lead decides any wider rollout, with Operations and Risk.',
        reason:
          'Most of the 12 points comes from the mix. A random split answers the real question, and 1 in 5 keeps the extra reviews to about 20%, within the 25% Operations can take. A is premature; C collects more of the same unfair comparison.',
      },
    },
    goal: 'Find out whether the new flow brings in more good customers, at a review load Operations can carry',
    success: ['A fair comparison: similar applicants, chosen at random', 'Activation, reviews and risk checked, not only completion'],
    sort: {
      c1: 'verified',
      c2: 'verified',
      c3: 'verified',
      c4: 'needs-checking',
      c5: 'assumption',
      c6: 'weak',
    },
    requestIds: ['r1', 'r2', 'r3'], // 1 + 1 + 0.5 = 2.5 of the 2.5 hours
  },
  // DRAFT: to be confirmed
  outcome:
    "A random split in every channel, run for 8 weeks, showed a lift of about 3 points, not 12. The team moved the owners' details back before submission to keep manual reviews level, then rolled the flow out.",
  // The example: Alex first wants to roll out, taking the summary's word that the groups were alike;
  // the user groups move them to B. They skip the manual review workload, so their test would put
  // half of all applicants on the new flow, more reviews than Operations can take: the gap the review
  // picks up. Everything in it is a DRAFT: to be confirmed.
  example: {
    juniorId: 'alex',
    initialPosition: {
      recommendation: 'A: roll the new flow out to every applicant',
      reason: 'Completion rose 12 points across 1,000 applicants. That is a big lift on a fair-sized group.',
      confidence: 'medium',
      question: 'Does the lift hold for every kind of applicant?',
    },
    goal: 'Decide whether every applicant should get the new flow',
    success: ['More applicants finish the form', 'No drop in customers who go on to use their account'],
    people: ['Product team', 'New applicants', 'Risk team'],
    sort: {
      c1: 'verified',
      c2: 'verified',
      c3: 'verified',
      c4: 'verified',
      c5: 'needs-checking',
      c6: 'weak',
    },
    sortReasons: {
      c1: 'Straight from the pilot results.',
      c2: 'Counted in the sample sizes.',
      c3: 'In the flow change notes.',
      c4: 'The Product team says so in its summary.',
      c5: 'Likely, but nothing yet rules out other causes.',
      c6: 'Five comments from people who finished the form.',
    },
    missing: ['Who saw each flow', 'Whether new customers use their accounts'],
    requestedIds: ['r1', 'r2', 'r4'], // 1 + 1 + 0.5 = 2.5 of the 2.5 hours
    requestIntents: {
      r1: 'Whether the lift holds for every kind of applicant',
      r2: 'Whether applicants who finish go on to use their accounts',
      r4: 'How applicants were put into each flow, and for how long',
    },
    decision: 'B',
    basedOn: ['New flow: 70% partner-referred', 'Gaps within groups: 0 and 4 points', 'Week 1 activation: 54% vs 60%'],
    why: 'Most of the 12 points comes from who saw the new flow: 70% of its applicants came through a partner, against 25% in the old flow, and partner-referred applicants complete 80% of the time in either flow. Within each group the gap is 0 and 4 points. A random split would show what the flow itself does.',
    mainRisk: 'Fewer active customers: Week 1 activation is 54% vs 60%',
    changeMind: 'If a random split still shows a clear lift and activation holds, I would recommend rolling it out',
    confidence: 'medium',
    submission: {
      'conclude-now':
        'New-flow applicants completed more often, 74% against 62%. Within the same kind of applicant the gap is small: 80% vs 80% for partner-referred, 60% vs 56% for direct.',
      'cannot-conclude':
        'That the new flow caused the 12-point rise: applicants were not assigned at random, and 70% of new-flow applicants came through a partner. Nor whether they become active, low-risk customers.',
      'still-to-test': 'A random split within each channel, long enough to see 30-day activation and the first risk review results.',
      'expand-conditions':
        'Expand to half of all applicants, chosen at random. Stop if 30-day activation falls more than 3 points below the old flow.',
    },
    whyChanged:
      'I started by wanting to roll it out, because 12 points looked large. The user groups showed most new-flow applicants came through a partner, and they complete just as often in the old flow. So the rise says more about who saw the new flow than about the flow itself.',
    // Stored without quote marks; the page adds them.
    note: "I took the summary's word that the two groups were alike. They weren't.",
  },
  // Sam's review of the example. Everything in it is a DRAFT: to be confirmed. The senior column
  // matches senior.goal, senior.sort, senior.requestIds and senior.decision.
  review: {
    managerId: 'sam',
    submittedWhen: 'today',
    minutes: 20,
    // In a row's text, ' → ' shows as the arrow icon (read as 'then').
    rows: [
      { label: 'Goal', junior: 'Roll out to all, or not', senior: 'Good customers, not just completion', match: 'differs' },
      { label: 'Evidence', junior: 'Groups first taken as alike', senior: 'Groups need checking', match: 'differs' },
      { label: 'Investigation', junior: 'Groups → activation → assignment', senior: 'Groups → activation → review load', match: 'differs' },
      { label: 'Decision', junior: 'B · Expand as a fair test', senior: 'B · Expand as a fair test', match: 'aligned' },
    ],
    blindSpots: ["Took the summary's word that the groups were alike", 'Did not check what the flow does to manual reviews'],
    confirmQuestions: ['Can the review team carry half of all applicants on the new flow?', 'Is a 3-point activation limit the right stop line?'],
    feedbackDraft:
      'Good catch: most of the 12 points came from who saw the new flow. Next time, check what a change moves onto other teams before you size the next test.',
    nextFocus: ['decision', 'evidence', 'framing'],
    nextFocusDefault: 'decision',
    dimensions: [
      {
        id: 'goal',
        level: 'independent',
        note: 'Alex judged the flow by whether new customers go on to use their accounts, not only by completion.',
        evidence: 'Success: "No drop in customers who go on to use their account." Main risk: "Fewer active customers: Week 1 activation is 54% vs 60%"',
      },
      {
        id: 'evidence',
        level: 'prompted',
        note: 'Alex first sorted "The two groups were alike" as verified, taking the summary\'s word, and corrected it only when the user groups came in.',
        evidence: 'Sort reason: "The Product team says so in its summary." Note: "…They weren\'t."',
      },
      {
        id: 'information',
        level: 'independent',
        note: 'Asked who saw each flow and how they were chosen, and designed a random split from what they found.',
        evidence: 'Requests: user groups → later activation → assignment. Still to test: "A random split within each channel…"',
      },
      {
        id: 'tradeoffs',
        level: 'practice',
        note: 'Weighed completion against activation, but not the manual review load. Half of all applicants on the new flow would need more reviews than Operations can take.',
        evidence: 'Conditions: "Expand to half of all applicants, chosen at random. Stop if 30-day activation falls…" No mention of manual reviews.',
      },
      {
        id: 'updating',
        level: 'independent',
        note: 'Moved from a full rollout to a fair test, and said which facts moved them.',
        evidence: 'Why changed: "I started by wanting to roll it out, because 12 points looked large…"',
      },
    ],
    feedback: {
      strength:
        'You looked behind the 12 points, found most of it came from who saw the new flow, and designed a test that shows what the flow itself does.',
      improvement:
        'Check what a change moves onto other teams. New-flow applications need a manual review twice as often, and half of all applicants on the new flow would mean more reviews than Operations can take.',
      followUp: 'How many applicants could see the new flow before the review team falls behind?',
    },
  },

  // Everything below is a DRAFT: to be confirmed, except where a comment says it comes from the source.
  goal: 'Judge what the pilot really shows, and recommend whether and how to expand the new flow, without claiming more than the evidence supports.',
  limits: {
    deadline: 'Recommend at the product review on Thursday, Week 6',
    unacceptable: 'Claiming the flow works better than the evidence shows, or adding more manual reviews than Operations can take',
    authority:
      'You recommend what to conclude and what to test next. The product lead decides any rollout; Operations must agree to extra review work, and Risk to any change in which applications get reviewed.',
  },
  // The name and the four fields are the source's; the hints are drafted.
  submission: {
    name: 'Experiment Review',
    fields: [
      { id: 'conclude-now', label: 'What you can conclude now', hint: 'What the data shows, with numbers' },
      { id: 'cannot-conclude', label: "What you can't conclude", hint: "Claims the data doesn't support yet" },
      { id: 'still-to-test', label: 'What still needs testing', hint: 'What to measure next, and how to make it fair' },
      { id: 'expand-conditions', label: 'Conditions for expanding the pilot', hint: 'What must hold before more applicants see it, and when to stop' },
    ],
  },
  // From the source's three Team Lead observations: taking a change in a metric as its cause,
  // optimising a single metric, and designing a more reliable next test.
  // ifMentions matches at the start of a word, ignoring case. Words marked 'request only' appear in
  // m4–m7 and not in m1–m3.
  assessment: {
    criteria: [
      {
        id: 'better-product',
        label: 'Defines better as more than completion',
        lookFor: 'Did they judge the flow by whether new customers go on to use their accounts and pass risk checks, not only by completion?',
        dimensionId: 'goal',
        ifMentions: [
          'activation',
          'activate',
          'active',
          'first payment',
          'use their account',
          'use the account',
          'good customers',
          'risk review',
          'risk result',
          'risk outcome',
          'restricted',
          'fraud',
        ],
        met: 'You judged the flow by what the business needs from new customers, not only by completion.',
        notYet: 'Completing the form is one step. What does the team need from applicants after they finish it?',
      },
      {
        id: 'rise-not-cause',
        label: 'Keeps the rise apart from its cause',
        lookFor: 'Did they treat 62% → 74% as a difference between two groups, not yet as the effect of the flow?',
        dimensionId: 'evidence',
        // 'like for like' is left out on purpose: the summary in m1 uses it to claim the groups match.
        ifMentions: [
          'mix',
          'random',
          'referred',
          'referral',
          'partner',
          'different applicants',
          'different groups',
          'different kinds',
          'who saw',
          'selection',
          'confound',
          'by chance',
          // DRAFT: to be confirmed. Added for the Examine sort reasons, which count by default: a learner
          // doubts the claimed cause there ('nothing yet rules out other causes').
          'other cause',
          'other explanation',
          'correlation',
          'causation',
          'not proof',
          'not a fair test',
          'not like for like',
        ],
        fields: ['cannot-conclude'],
        // DRAFT: to be confirmed. Ticking the summary's claims (c4 'The two groups were alike', c5 'The new flow
        // caused the rise') under 'Based on' means the call still rests on the flow being the cause.
        notBasedOn: ['c4', 'c5'],
        met: 'You kept the rise apart from its cause, and said what else could explain it.',
        notYet: 'A difference between two groups is not yet the effect of the flow. Who was in each group?',
      },
      {
        id: 'who-saw-it',
        label: 'Checks who saw each flow',
        lookFor: 'Did they find out which applicants saw the new flow, and how they were chosen?',
        dimensionId: 'information',
        // Request only (m4 or m7). '25%' is left out: m6 uses it for review capacity.
        ifMentions: ['partner', 'referred', 'referral', 'paid search', 'paid-search', 'not random', 'not at random', '80%', '56%', '70%'],
        met: 'You found out who saw each flow before judging the difference.',
        notYet: 'Before you credit the flow, find out who saw it and how they were chosen.',
      },
      {
        id: 'review-load',
        label: 'Weighs the manual review load',
        lookFor: 'Did they check what the new flow does to manual reviews, and keep any expansion within what Operations can take?',
        dimensionId: 'tradeoffs',
        requestIds: ['r3'],
        // DRAFT: to be confirmed. Bare 'operations', 'review team' and 'reviews' became the phrases below,
        // so 'Operations' or 'Review team' as the owner, or 'weekly reviews' as a review date, doesn't count.
        ifMentions: [
          'manual review',
          'review load',
          'review capacity',
          'review queue',
          'review team can',
          'more reviews',
          'extra reviews',
          'reviews a week',
          'capacity',
          'operations can',
          "operations' estimate",
          'operations capacity',
          'workload',
          '30%',
          'twice as',
        ],
        // DRAFT: to be confirmed. Not the owner ('Operations') or the review time, as the phrases above already intend.
        mentionsIn: [
          'initialPosition',
          'why',
          'ownPlan',
          'conclude-now',
          'cannot-conclude',
          'still-to-test',
          'expand-conditions',
          'mainRisk',
          'changeMind',
        ],
        met: 'You weighed the extra manual reviews against the gain in completion.',
        notYet: 'The new flow moved some questions to after submission. Where did that work go?',
      },
      {
        id: 'fair-next-test',
        label: 'Designs a fairer next test',
        lookFor: 'Does the next step compare similar applicants, for long enough to see activation and risk results?',
        dimensionId: 'information',
        ifMentions: [
          'random',
          'a/b',
          'each channel',
          'every channel',
          'same channel',
          'within each',
          'fair test',
          'fair comparison',
          'comparable',
          'same kind of applicant',
          'same kinds of applicant',
        ],
        // DRAFT: to be confirmed. Not what you can or can't conclude, where 'random' or 'within each' describes the pilot that ran, not the
        // next test.
        mentionsIn: [
          'initialPosition',
          'why',
          'ownPlan',
          'still-to-test',
          'expand-conditions',
          'mainRisk',
          'owner',
          'reviewBy',
          'changeMind',
        ],
        fields: ['still-to-test', 'expand-conditions'],
        met: 'Your next step would give a fair answer: comparable applicants, measured for long enough.',
        notYet: "More of the same data won't settle it. What would make the next comparison fair?",
      },
      {
        id: 'updates-on-data',
        label: 'Updates the view on what the extra data shows',
        lookFor: 'Faced with the user groups, activation or review data, did they change or hold their first position for a stated reason?',
        dimensionId: 'updating',
        // Request only: the groups (m4), activation and risk timing (m5), the review load (m6), the set-up (m7).
        ifMentions: [
          'partner',
          'referred',
          'paid search',
          'paid-search',
          'not random',
          'not at random',
          '80%',
          '56%',
          '60%',
          '70%',
          '54%',
          // DRAFT: to be confirmed. Bare '30 days' became these, so 'in 30 days' as a review date doesn't count.
          'payment within 30 days',
          'activated within 30 days',
          'active within 30 days',
          '30-day activation',
          '60–90',
          '60-90',
          '30%',
          '465',
          '222',
          'twice as',
          'doubled',
        ],
        // DRAFT: to be confirmed. The final answer shows the update, not the initial position (written before the requests), the owner or
        // the review time.
        mentionsIn: ['why', 'ownPlan', 'conclude-now', 'cannot-conclude', 'still-to-test', 'expand-conditions', 'mainRisk', 'changeMind'],
        met: 'Your final answer uses what the extra data showed, not only the headline rate.',
        notYet: 'Compare your final answer with your first position: which new facts changed it, or why did none?',
      },
    ],
    commonMisses: [
      'Reads 62% → 74% as the effect of the new flow.',
      "Takes the summary's word that the two groups were alike.",
      'Judges the flow on completion alone, and misses activation, manual reviews and risk.',
      'Asks for more of the same pilot data instead of a fair comparison.',
      'Expands the flow faster than Operations can review the extra applications.',
    ],
    acceptableAlternatives: [
      'C, keeping the pilot running, but only if it is changed into a random split within the same channels.',
      "Moving the owners' details back before submission first, then testing again, to keep manual reviews level.",
      'Escalating to the product lead with the evidence so far, if a random split cannot be agreed before Thursday.',
    ],
    mustEscalate: [
      'Any rollout beyond the pilot: the product lead decides.',
      'Extra manual review work beyond what Operations has agreed to.',
      'Any change in which applications go to manual review: Risk must agree.',
    ],
  },
  // The source's follow-up: the completion advantage holds, but the manual review load rises
  // sharply. That is the one changed condition; its figures are drafted.
  variant: {
    title: 'The lift holds, but reviews pile up',
    changedFact:
      'Operations, two weeks into a wider test: the new flow still completes more often than the old one. But manual reviews have risen well past the pilot: 45% of new-flow applications now need one, against 15% for the old flow, and the review queue is 4 working days behind.',
    lookFor:
      "Whether the learner stops treating completion as the only win: slows or pauses the expansion, moves the owners' details back before submission, or agrees extra review capacity with Operations, and sets a review-load limit that would stop the rollout; and whether they bring in Operations and Risk rather than deciding alone. The source's question: how would you adjust the recommendation?",
  },
}
