import type { EvidenceCard, EvidenceColumn } from '../../contracts/types'

// The places an evidence card can sit on Examine (06): the unsorted tray and the four columns.
export type Place = EvidenceColumn | 'unsorted'

// An evidence card and where it sits now.
export type Fact = EvidenceCard & { place: Place }

export const PLACE_NAMES: Record<Place, string> = {
  unsorted: 'Unsorted',
  verified: 'Verified',
  'needs-checking': 'Needs checking',
  assumption: 'Assumption',
  weak: 'Weak evidence',
}

// The four columns, left to right, with their legend dots.
export const COLUMNS: { place: EvidenceColumn; dot: string }[] = [
  { place: 'verified', dot: 'dot--accent' },
  { place: 'needs-checking', dot: 'dot--ring' },
  { place: 'assumption', dot: 'dot--neutral' },
  { place: 'weak', dot: 'dot--warn' },
]

export const PLACES: Place[] = ['unsorted', 'verified', 'needs-checking', 'assumption', 'weak']

// The case's evidence cards in order, each where the sort places it; unsorted when it doesn't.
export const factsOf = (cards: EvidenceCard[], sort: Record<string, Place>): Fact[] =>
  cards.map((card) => ({ ...card, place: sort[card.id] ?? 'unsorted' }))
