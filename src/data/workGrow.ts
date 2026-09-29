import type { WorkGrowScript } from '../contracts/types'

// Work & Grow's script (requirements §6). Everything the app says here is preset and shown as
// 'Demo response'; simple rules over what the learner wrote choose between the lines.
// The work sample is Alex's own (fictional) launch plan for a different client from the Japan case,
// so a practice case is never shown as real work. The focus reason quotes requirements §6.
// Every line below except that quote and the challenge's changed condition is a DRAFT: to be confirmed.
export const WORK_GROW: WorkGrowScript = {
  // DRAFT: to be confirmed. The client, the market and the dates are fictional drafts.
  sample: {
    learnerId: 'alex',
    role: 'Graduate Analyst, Solutions',
    developmentGoal: 'Agree launch plans that every team involved can deliver and support.',
    context:
      'Write the launch plan for a client, an outdoor-gear retailer, that wants online payments live in New Zealand in 6 weeks, before its spring sale. I drafted it with an AI tool, then edited it before sending it to the client.',
    aiOutput:
      'Launch plan for online payments in New Zealand.\nWeeks 1 to 2: confirm requirements and payment methods with the client.\nWeeks 3 to 5: Engineering builds and tests the checkout integration.\nWeek 6: go live with the full catalogue.\nRisk: integration delays. Mitigation: weekly check-ins.',
    // Confirms the engineering timeline; says nothing on whether Operations can support the launch.
    finalVersion:
      'Launch plan for online payments in New Zealand.\nScope: card payments for the full catalogue, live in week 6, before the spring sale.\nWeeks 1 to 5: Engineering builds and tests the checkout integration. Engineering confirmed the integration will be ready by the end of week 5.\nWeek 6: go live.\nAfter launch: add other payment methods, as agreed with the client.\nRisk: integration delays. Engineering reports progress every Friday.',
    outcome: 'outcome-pending',
    // DRAFT: to be confirmed. Alex's step B answers for 'Load example', in Alex's voice. They follow the
    // difference between aiOutput and finalVersion and Alex's workplace record (seed.ts). On purpose they
    // don't mention Operations, refunds or support, the gap the focus suggestion names, nor how Engineering's
    // confirmation was recorded or what would shrink the launch, so all three clarifying questions are still asked.
    exampleReasoning: {
      changed:
        'I cut the day-one scope to card payments and moved the other payment methods to after launch, as agreed with the client. I named the spring sale as the reason for week 6, and swapped the weekly check-ins for a progress report from Engineering every Friday.',
      verified:
        'The client confirmed that card payments are needed on day one and the other payment methods can follow. Engineering confirmed on a call that the integration will be ready by the end of week 5.',
      uncertain: 'Whether the integration will really be ready by the end of week 5, and what we do if it slips this close to the spring sale.',
    },
  },
  // DRAFT: to be confirmed
  clarifyingQuestions: [
    {
      id: 'q1',
      text: 'Who handles refunds and customer questions after launch, and have they seen the plan?',
      why: 'A launch date depends on the teams who run the launch afterwards, not only on the build.',
      askUnless: ['operations', 'support team', 'customer support', 'refunds'],
    },
    {
      id: 'q2',
      text: "Where is Engineering's confirmation recorded, so the client can rely on it?",
      why: 'A confirmation that lives only in a call is hard for anyone else to check.',
      askUnless: ['email', 'ticket', 'in writing', 'recorded', 'meeting notes'],
    },
    {
      id: 'q3',
      text: 'What would make you open with fewer products or move the date?',
      why: 'A plan is easier to trust when it says what would change it.',
      askUnless: ['fewer products', 'move the date', 'pilot', 'phase'],
    },
  ],
  focus: {
    skillId: 'collaboration',
    title: 'Cross-team dependency management',
    // The source's words (requirements §6), not a draft.
    reason:
      'You confirmed the engineering timeline, but your review does not yet show whether Operations can support the proposed launch.',
    // Exact quotes from sample.finalVersion; the page shows only those found in the learner's own text.
    evidence: [
      'Engineering confirmed the integration will be ready by the end of week 5',
      'card payments for the full catalogue, live in week 6',
    ],
    // DRAFT: to be confirmed
    noEvidenceReason:
      'None of the lines this suggestion is based on appear in your work, so it may not fit. Check whether your work shows that every team the launch depends on can support it, or correct the suggestion.',
    // Matched as plain text inside the correction, so a bare 'ops' would also match 'stops' or
    // 'shops'; the Ops keywords below are phrases instead.
    correctionKeywords: ['operations', 'with ops', 'ops team', 'ops lead', 'confirmed with', 'checked with', 'support team'],
    // DRAFT: to be confirmed
    afterCorrection: {
      skillId: 'evidence',
      title: 'Making evidence visible in your plans',
      reason:
        "You did confirm it; the gap is recording it. Your final version doesn't show that check, so the client and the other teams can't rely on it yet.",
    },
    // DRAFT: to be confirmed
    unmatchedCorrection: {
      title: 'A focus you choose',
      reason:
        'Thanks for correcting this. Casebook has set its suggestion aside. Say what you checked and with whom, or name the skill you want to practise next.',
    },
    moreInfoQuestion: 'Which teams did you check the plan with, and what did each of them say it could support?', // DRAFT: to be confirmed
  },
  challenge: {
    title: 'Operations at half capacity', // DRAFT: to be confirmed
    changedCondition: 'Operations can support only half the expected volume.',
    // DRAFT: to be confirmed. The judge's wording (overnight fixes, C4).
    prompt: 'Your launch is still set for week 6. What do you change, who do you tell first, and how will the plan show their confirmation?',
    // DRAFT: to be confirmed. A phrase counts when it starts a word in the answer, in any case
    // ('phase' matches 'phased', 'half the catalog' matches 'half the catalogue'). Every rule the
    // answer matches is acknowledged with its first sentence (what the learner did); then the rest
    // of the first matching rule follows as the one question (what next). So the most specific
    // rule comes first, and every text reads 'What they did. What next?'.
    // Order: telling first, so an answer that says who it tells gets the next step, while an answer
    // that changes the plan without saying who it tells is asked that by the plan rule it matches.
    // DRAFT: to be confirmed. The telling rule must stay first: an answer that matches only it
    // changes nothing in the plan, so the page follows it with defaultFeedback instead of its question.
    // The partial launch comes before the date and the staff rules, so 'open with half the range
    // and hire temps' is answered as a partial launch. An answer that only adds staff keeps the
    // plan as it is, so it is asked about capacity instead.
    feedback: [
      // Telling people: the client, Operations or anyone else, named as who hears it first.
      {
        ifMentions: [
          'tell',
          'let the client know',
          'let operations know',
          'let ops know',
          'let them know',
          'inform the',
          'inform operations',
          'inform ops',
          'notify',
          'warn the',
          'warn operations',
          'call the',
          'email the',
          'message the',
          'contact the',
          'contact operations',
          'update the client',
          'update operations',
          'speak to',
          'speak with',
          'talk to',
          'talk with',
          'brief the',
          'brief operations',
          'loop in',
          'raise it with',
          'flag it to',
          'escalate',
          'the client first',
          'operations first',
          'ops first',
          'client lead',
          'account manager',
        ],
        text: 'You thought about who needs to know. Next, say who owns the change, and when you will review it.',
      },
      // Rule 1: a smaller or partial launch, on time.
      {
        ifMentions: [
          'fewer products',
          'fewer items',
          'part of the catalog',
          'part of the range',
          'half the catalog',
          'half the range',
          'half the products',
          'half of the catalog',
          'half of the range',
          'half of the products',
          'open with half',
          'launch with half',
          'start with half',
          'go live with half',
          'smaller range',
          'smaller catalog',
          'reduced range',
          'limited range',
          'add the rest',
          'the rest later',
          'rest of the range',
          'rest of the catalog',
          'the other half',
          'best-selling',
          'best-sellers',
          'best sellers',
          'top sellers',
          'pilot',
          'phase',
          'in stages',
          'staged',
          'stagger',
          'gradual',
          'smaller launch',
          'partial launch',
          'soft launch',
          'limited launch',
          'limit orders',
          'order limit',
          'daily limit',
          'cap orders',
          'order cap',
          'daily cap',
        ],
        text: 'You matched the launch to the support Operations can give. Who do you tell first, and when?',
      },
      // Moving the whole launch later. Phrases name the launch or the date, so 'delay the rest' in
      // a partial launch is not read as a later date.
      {
        ifMentions: [
          'delay the launch',
          'delaying the launch',
          'delayed launch',
          'delay launch',
          'delay go-live',
          'delay go live',
          'delay the go-live',
          'delay by',
          'delay until',
          'delay to',
          'launch later',
          'go live later',
          'move the date',
          'move the launch',
          'move go-live',
          'move the go-live',
          'later date',
          'new launch date',
          'postpone the launch',
          'postpone launch',
          'postpone go-live',
          'postpone by',
          'postpone until',
          'postpone to',
          'push back the launch',
          'push the launch',
          'push back the date',
          'push the date',
          'push it back',
          'push back by',
          'push back to',
        ],
        text: 'You moved the date, which keeps the load within what Operations can support, but the client set that date for its sale. Who do you tell first, and when?',
      },
      // Relying on more people in Operations.
      {
        ifMentions: [
          'more staff',
          'extra staff',
          'temporary staff',
          'more people',
          'extra people',
          'temps',
          'hire',
          'hiring',
          'overtime',
          'contractors',
        ],
        text: 'Your answer depends on Operations finding more people. Has anyone confirmed they can, and what does the plan look like with the capacity they have today?',
      },
    ],
    // DRAFT: to be confirmed. Also follows the first rule when an answer only says who it tells.
    defaultFeedback: "Your answer keeps the plan as it was. What do you change in the plan for the orders and refunds Operations can't handle?", // DRAFT: to be confirmed
    // DRAFT: to be confirmed. The prompt's last part: how the plan will show their confirmation.
    // Phrases that mean the confirmation is written down or signed, matched at the start of a word.
    // Not bare 'email' (the first rule's 'email the client' is telling, not a record), bare 'confirm'
    // ('ask Operations to confirm' is asking), 'confirmed on' ('confirmed on a call' is the gap step B
    // asks about), 'on record' ('based on records') or 'in the plan' ('the change in the plan').
    confirmation: {
      ifMentions: [
        'in writing',
        'written confirmation',
        'written sign-off',
        'written agreement',
        'written approval',
        'written record',
        'written down',
        'write it down',
        'sign-off',
        'sign off',
        'signs off',
        'signed off',
        'signed-off',
        'signoff',
        'confirm by email',
        'confirms by email',
        'confirmed by email',
        'confirmation by email',
        'confirmation email',
        'email confirmation',
        'reply by email',
        'replies by email',
        'agree by email',
        'agrees by email',
        'agreed by email',
        'dated',
        'with its date',
        'who confirmed',
        'record their',
        'record it',
        'record the confirmation',
        'record the agreement',
        'recorded confirmation',
        'confirmation in the plan',
        'confirmations in the plan',
        'confirmation to the plan',
        'confirmations to the plan',
        'confirmation into the plan',
        'attach',
        'shared log',
        'log their',
        'log it',
      ],
      met: 'You said how the plan will show their confirmation.',
      missing: 'Where will their confirmation be written down?',
    },
  },
  // DRAFT: to be confirmed
  nextActionExamples: [
    'Ask Operations what volume they can support before I send the next launch plan.',
    "Add each team's confirmation, with its date, to the plan I send the client.",
    'Name an owner for each open risk and a date to review it.',
  ],
}
