import { describe, expect, it } from 'vitest'
import { SEED_VERSION, type PracticeAttempt, type Store } from '../contracts/records'
import { ROUTES, type RouteKey } from '../contracts/types'
import { CASE_SUMMARIES, caseName, FEATURED_CASE_ID, personName, PEOPLE } from './content'
import { pageTitle } from './pageTitle'
import type { RouteMatch } from './router'

const store = (attempts: PracticeAttempt[] = []): Store => ({
  version: 1,
  seedVersion: SEED_VERSION,
  attempts,
  rooms: [],
  workReviews: [],
  growth: [],
  shares: [],
  feedback: [],
  selfReviews: [],
  ui: { viewMode: {}, activeAttempt: {}, activeRoom: {} },
})

const match = (route: RouteKey, caseId: string | null = null, attemptId: string | null = null): RouteMatch => ({
  route,
  caseId,
  attemptId,
  redirect: null,
})

describe('page titles', () => {
  it('name the page, then the app', () => {
    expect(pageTitle(match('landing'), store())).toBe('Work Buddy')
    expect(pageTitle(match('juniorHome'), store())).toBe('Case Library · Work Buddy')
    expect(pageTitle(match('managerTeam'), store())).toBe('Shared Growth · Work Buddy')
  })

  it('name the case first on a case page', () => {
    const { id, title } = CASE_SUMMARIES[0]
    expect(pageTitle(match('juniorDefine', id), store())).toBe(`${title} · Define · Work Buddy`)
    expect(pageTitle(match('juniorCase', id), store())).toBe(`${title} · Work Buddy`)
  })

  it('name the learner and case on a practice review', () => {
    const { id: caseId } = CASE_SUMMARIES[0]
    const learnerId = PEOPLE[0].id
    const attempt = { id: 'att-1', caseId, learnerId, status: 'submitted' } as PracticeAttempt
    expect(pageTitle(match('managerReview', null, 'att-1'), store([attempt]))).toBe(
      `${personName(learnerId)} · ${caseName(caseId)} · Practice review · Work Buddy`,
    )
  })

  it('name the case on the Case Expert’s Share page: the one My Cases opened, else the featured case', () => {
    const featured = CASE_SUMMARIES.find((s) => s.id === FEATURED_CASE_ID)!
    const other = CASE_SUMMARIES.find((s) => s.playable && s.id !== FEATURED_CASE_ID)!
    const opened = (expertCaseId?: string): Store => ({ ...store(), ui: { ...store().ui, expertCaseId } })
    expect(pageTitle(match('seniorShare'), store())).toBe(`Case: ${featured.title} · Work Buddy`)
    expect(pageTitle(match('seniorShare'), opened(other.id))).toBe(`Case: ${other.title} · Work Buddy`)
    expect(pageTitle(match('seniorShare'), opened('no-such-case'))).toBe(`Case: ${featured.title} · Work Buddy`)
  })

  it('give every fixed route its own name', () => {
    const fixed = (Object.keys(ROUTES) as RouteKey[]).filter((r) => !ROUTES[r].includes('/:') && r !== 'landing')
    for (const route of fixed) expect(pageTitle(match(route), store())).toMatch(/^[^·]+ · Work Buddy$/)
  })
})
