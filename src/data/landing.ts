import type { LandingFeature } from '../contracts/types'

// The product preview beside the landing hero.
// In quote.text, '\n' marks a line break the design shows.
export const LANDING_FEATURE: LandingFeature = {
  caseId: 'japan-launch',
  // Three Japan evidence cards (c4, c5, c7) in the columns the example puts them in.
  sortPreview: [
    { text: 'Launch in 8 weeks', column: 'verified' },
    { text: '¥18M in year-one sales', column: 'needs-checking' },
    { text: 'Followers ask about the sofas', column: 'weak' }, // DRAFT: to be confirmed (card c7)
  ],
  quote: { fromId: 'sam', text: "Frame the goal around what\nthe client can't afford to get\nwrong." },
}
