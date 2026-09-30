import type { CaseId, CaseSummary } from '../contracts/types'

// Every case in the library, one per function area. The five after the Japan launch are the
// 'More cases' cards, in order. Titles are the user's English titles, unchanged.
// Blurbs are the source's English card lines, unchanged. What each case submits, its materials and
// its team-mode roles are translated from the source's case sections. skillIds map the source's three
// card abilities (in Chinese) onto the six skills; that mapping is a DRAFT: to be confirmed.
// minutes: DRAFT: to be confirmed. About 2 min per material and 2 per submission field, to the nearest 5
// (materials + fields: Japan 9 + 4 → 25, Friday 7 + 5 → 25, Urgent 7 + 5 → 25, Missing 7 + 5 → 25, Faster 7 + 4 → 20, Deal 8 + 5 → 25).
export const CASE_SUMMARIES: CaseSummary[] = [
  {
    id: 'japan-launch',
    title: 'Eight Weeks to Japan',
    shortName: 'Eight Weeks to Japan',
    teamId: 'solutions',
    authorId: 'dana',
    minutes: 25, // from the design; the estimate above also gives 25
    focus: 'Facts vs. assumptions',
    playable: true,
    version: 'v1',
    blurb: 'A retailer wants to launch in Japan. What can your team responsibly commit to?',
    skillIds: ['framing', 'investigation', 'collaboration'], // DRAFT: to be confirmed (mapping)
    modes: ['individual', 'team'],
    // DRAFT: to be confirmed. Alone, you ask the Client Lead (r3); in the team room, you play them.
    yourRole: 'Solutions consultant; the Client Lead in the team room (or choose another role)', // DRAFT: to be confirmed. '(or choose another role)' added with the room's role choice.
    submits:
      'A one-page Launch Recommendation: launch scope, preconditions, risk owners, and conditions to stop or adjust',
    // The initial materials, by their titles in cases/japan-launch.ts.
    materialsPreview: ['Discovery call notes', 'Checkout configuration', 'Sales forecast'],
    roleTitles: ['Client Lead', 'Engineering Lead', 'Operations Lead'],
  },
  {
    id: 'friday-release',
    title: 'Friday Release: Roll Back or Patch?',
    shortName: 'Friday Release', // DRAFT: to be confirmed
    teamId: 'engineering',
    authorId: 'ravi',
    minutes: 25, // DRAFT: to be confirmed (estimate, see the note above CASE_SUMMARIES)
    playable: true,
    version: 'v1',
    blurb: 'Most transactions succeed, but a small group of customers may be charged twice. What happens next?',
    skillIds: ['evidence', 'investigation', 'escalation'], // DRAFT: to be confirmed (mapping)
    modes: ['individual', 'team'], // DRAFT: to be confirmed (team room added)
    yourRole: 'Engineer on the release team', // DRAFT: to be confirmed
    submits:
      'Incident Recommendation: confirmed impact, what is not yet confirmed, recommended action, who to escalate to, and the plan for customer updates',
    // Initial materials, then the ones you request.
    materialsPreview: [
      'Overall metrics',
      'Three customer support tickets',
      'Release change summary',
      'Breakdown by affected payment method',
      'Retry logs',
      'Rollback notes',
      'On-call staff details',
    ],
    // DRAFT: to be confirmed. The room's roles in cases/friday-release.ts; the source listed
    // Engineering, Customer Support and Product, and no material belongs to Product.
    roleTitles: ['Release Engineer', 'On-call Engineer', 'Support Lead'],
  },
  {
    id: 'urgent-onboarding',
    title: 'The Urgent Onboarding Request',
    shortName: 'Urgent Onboarding', // DRAFT: to be confirmed
    teamId: 'risk',
    authorId: 'tom', // DRAFT: to be confirmed
    minutes: 25, // DRAFT: to be confirmed (estimate, see the note above CASE_SUMMARIES)
    playable: true,
    version: 'v1',
    blurb: 'A valuable customer needs access tomorrow, but their documents tell different stories.',
    skillIds: ['evidence', 'escalation', 'collaboration'], // DRAFT: to be confirmed (mapping)
    modes: ['individual'],
    yourRole: 'Onboarding analyst', // DRAFT: to be confirmed
    submits:
      'Review & Escalation Note: where the conflicts are, what documents are needed and why, who handles it, and how to explain it to the customer',
    materialsPreview: [
      'Application summary',
      'Business description',
      'Company relationship chart',
      'Simplified review process for this case',
      'Document update dates',
      "The customer's explanation",
      'How the related entities are connected',
    ],
    roleTitles: ['Commercial', 'Onboarding Operations', 'Compliance'],
  },
  {
    id: 'missing-48000',
    title: 'The Missing A$48,000',
    shortName: 'Missing A$48,000', // DRAFT: to be confirmed
    teamId: 'finance',
    authorId: 'mei', // DRAFT: to be confirmed
    minutes: 25, // DRAFT: to be confirmed (estimate, see the note above CASE_SUMMARIES)
    playable: true,
    version: 'v1',
    blurb: 'The ledger and bank statement disagree before the reporting deadline. Find out why.',
    skillIds: ['evidence', 'investigation', 'decision'], // DRAFT: to be confirmed (mapping)
    modes: ['individual'],
    yourRole: 'Finance analyst', // DRAFT: to be confirmed
    submits:
      'Reconciliation Exception Note: what makes up the difference, the evidence, unresolved risks, who owns the fix, and preventive measures',
    materialsPreview: [
      'Ledger and bank statement summaries',
      'When the statement was generated',
      'Pending transactions list',
      'Settlement times',
      'Duplicate record check',
      'Statement date range',
      'Data import log',
    ],
    roleTitles: ['Treasury', 'Engineering', 'Operations'],
  },
  {
    id: 'faster-onboarding',
    title: 'Faster Onboarding, Better Product?',
    shortName: 'Faster Onboarding', // DRAFT: to be confirmed; a playable case needs one
    teamId: 'product',
    authorId: 'nadia', // DRAFT: to be confirmed
    minutes: 20, // DRAFT: to be confirmed (estimate, see the note above CASE_SUMMARIES)
    playable: true,
    version: 'v1',
    blurb: 'A new flow improves completion rates. Is the evidence strong enough to expand it?',
    skillIds: ['evidence', 'framing', 'decision'], // DRAFT: to be confirmed (mapping)
    modes: ['individual'],
    yourRole: 'Product analyst', // DRAFT: to be confirmed
    submits:
      "Experiment Review: what you can conclude now, what you can't, what still needs testing, and the conditions for expanding the pilot",
    materialsPreview: [
      'Completion rates for both versions',
      'Sample sizes',
      'Flow change notes',
      'User groups',
      'Later activation',
      'Manual review workload',
      'Observation period and how users were assigned',
    ],
    roleTitles: ['Product', 'Risk', 'Operations'],
  },
  {
    id: 'deal-promise',
    // U+2060 (word joiner) before the second em dash keeps '—Promise' from starting a line.
    title: 'The Deal We Should—or Shouldn’t⁠—Promise',
    shortName: 'The Deal', // DRAFT: to be confirmed; a playable case needs one
    teamId: 'sales',
    authorId: 'owen', // DRAFT: to be confirmed
    minutes: 25, // DRAFT: to be confirmed (estimate, see the note above CASE_SUMMARIES)
    playable: true,
    version: 'v1',
    blurb: 'A prospect will sign this week if you promise a feature that is not yet available.',
    skillIds: ['decision', 'collaboration', 'escalation'], // DRAFT: to be confirmed (mapping)
    modes: ['individual'],
    yourRole: 'Account executive', // DRAFT: to be confirmed
    submits:
      'Opportunity Recommendation: the value of the opportunity, dependencies to confirm, what can be promised, what needs approval, and a draft reply to the customer',
    materialsPreview: [
      'Sales call notes',
      "Customer's list of requirements",
      'Revenue forecast',
      'Current capabilities overview',
      'Technical estimate',
      'Support cost',
      'When the customer actually needs the feature',
      'Contract commitment rules',
    ],
    roleTitles: ['Sales', 'Solutions Engineering', 'Finance'],
  },
]

// 'Recommended for you' on the case library.
export const RECOMMENDED_CASE_ID: CaseId = 'japan-launch'
