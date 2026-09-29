import type { Team, TeamId } from '../contracts/types'

// The six function areas, in the order of the Team menu on Share a case.
export const TEAMS: Team[] = [
  { id: 'solutions', label: 'Solutions' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'risk', label: 'Risk' },
  { id: 'finance', label: 'Finance' },
  { id: 'product', label: 'Product' },
  { id: 'sales', label: 'Sales' },
]

// The team tabs over the case library, after 'All'.
export const LIBRARY_TABS: TeamId[] = ['solutions', 'engineering', 'risk', 'finance', 'product', 'sales']
