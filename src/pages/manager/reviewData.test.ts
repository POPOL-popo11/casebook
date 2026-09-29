import { describe, expect, it } from 'vitest'
import { SEED_STORE } from '../../data/seed'
import { CASES, isPlayable } from '../../lib/content'
import { isExampleAttempt } from './reviewData'

// The case's review describes its example attempt and names its learner, so only that attempt
// may start from it on the Team Lead's review page.
describe('isExampleAttempt', () => {
  const attempts = SEED_STORE.attempts.filter((a) => isPlayable(a.caseId))

  it('is true only for the seeded example attempt', () => {
    const examples = attempts.filter((a) => isExampleAttempt(a, CASES[a.caseId])).map((a) => a.id)
    expect(examples).toEqual(['att-demo-alex-japan'])
  })

  it('is false for a user attempt, and for the example on another case', () => {
    const alex = attempts.find((a) => a.id === 'att-demo-alex-japan')!
    expect(isExampleAttempt({ ...alex, source: 'user' }, CASES[alex.caseId])).toBe(false)
    const other = Object.values(CASES).find((c) => c.id !== alex.caseId)!
    expect(isExampleAttempt(alex, other)).toBe(false)
  })
})
