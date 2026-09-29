import type { JuniorProfile } from '../contracts/types'

// The junior's own side of the case library: 'Your skills' and the latest feedback.
// Quoted words (feedback, notes) are stored without quote marks; the page adds them.
// 'Your skills' lists the six skills of skills.ts, in the same order.
export const JUNIOR_PROFILE: JuniorProfile = {
  juniorId: 'alex',
  skills: [
    { skillId: 'framing', level: 4 },
    { skillId: 'evidence', level: 2 },
    { skillId: 'investigation', level: 3 },
    { skillId: 'decision', level: 3 },
    // DRAFT: to be confirmed. The two new skills' levels, and Focus moved here from Evidence: Sam's
    // latest feedback (seed.ts) and the Work & Grow focus (workGrow.ts) both point to Collaboration.
    { skillId: 'collaboration', level: 2, focus: true },
    { skillId: 'escalation', level: 2 },
  ],
  feedback: { fromId: 'sam', text: 'Good instinct to ask for data first. Next, name who owns each risk.' },
}
