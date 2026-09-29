import type { Person } from '../contracts/types'

// Everyone who appears in Casebook: the three demo accounts, the seniors who shared cases, and the
// other learners in the Team Lead's review queue. All fictional.
export const PEOPLE: Person[] = [
  { id: 'dana', name: 'Dana K.', title: 'Senior Consultant', initials: 'DK', role: 'senior' },
  { id: 'alex', name: 'Alex M.', title: 'Graduate Analyst', initials: 'AM', role: 'junior' },
  { id: 'sam', name: 'Sam R.', title: 'Team Lead', initials: 'SR', role: 'manager' },
  // Case authors on the library cards. A playable case's author needs a title (content.test.ts),
  // so each has one ahead of their case becoming playable.
  { id: 'ravi', name: 'Ravi S.', title: 'Senior Engineer', initials: 'RS', role: 'senior' }, // DRAFT: to be confirmed (title)
  { id: 'tom', name: 'Tom H.', title: 'Senior Risk Analyst', initials: 'TH', role: 'senior' }, // DRAFT: to be confirmed (title)
  { id: 'mei', name: 'Mei L.', title: 'Senior Treasury Analyst', initials: 'ML', role: 'senior' }, // DRAFT: to be confirmed (title)
  { id: 'nadia', name: 'Nadia F.', title: 'Senior Product Manager', initials: 'NF', role: 'senior' }, // DRAFT: to be confirmed
  { id: 'owen', name: 'Owen B.', title: 'Senior Account Executive', initials: 'OB', role: 'senior' }, // DRAFT: to be confirmed
  // Two more learners, so the Team Lead's review queue holds more than Alex's work (seed.ts).
  { id: 'priya', name: 'Priya N.', title: 'Graduate Analyst, Risk', initials: 'PN', role: 'junior' }, // DRAFT: to be confirmed
  { id: 'leo', name: 'Leo T.', title: 'Graduate Analyst, Finance', initials: 'LT', role: 'junior' }, // DRAFT: to be confirmed
]
