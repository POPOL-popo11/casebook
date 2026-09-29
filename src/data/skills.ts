import type { Skill } from '../contracts/types'

// The six skills of requirements §3, in the order of 'Skills trained' on Review the breakdown and of
// the source's Skill filter. Ids are kept from the first version, so older records still resolve;
// only the labels changed ('decision' is shown as Trade-offs). contracts/types.ts fixes SKILL_IDS.
export const SKILLS: Skill[] = [
  { id: 'framing', label: 'Problem Framing' },
  { id: 'evidence', label: 'Evidence Assessment' },
  { id: 'investigation', label: 'Investigation' },
  { id: 'decision', label: 'Trade-offs' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'escalation', label: 'Escalation' },
]
