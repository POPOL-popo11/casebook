import { describe, expect, it } from 'vitest'
import { SEED_VERSION, type PracticeAttempt, type RoomSession, type Store } from '../contracts/records'
import { CASE_STEPS, ROUTES, caseHref, casePageHref, reviewHref, type RouteKey } from '../contracts/types'
import { CASES, CASE_SUMMARIES, isPlayable } from './content'
import { REDIRECTED, matchHash, type FixedRoute, type PatternRoute } from './router'

const store = (ids: { attempts?: string[]; rooms?: string[]; inProgress?: string[] } = {}): Store => ({
  version: 1,
  seedVersion: SEED_VERSION,
  attempts: [
    ...(ids.attempts ?? []).map((id) => ({ id, status: 'submitted' }) as PracticeAttempt),
    ...(ids.inProgress ?? []).map((id) => ({ id, status: 'in-progress' }) as PracticeAttempt),
  ],
  rooms: (ids.rooms ?? []).map((id) => ({ id, status: 'submitted' }) as RoomSession),
  workReviews: [],
  growth: [],
  shares: [],
  feedback: [],
  selfReviews: [],
  ui: { viewMode: {}, activeAttempt: {}, activeRoom: {} },
})

const empty = store()
const route = (hash: string, s: Store = empty) => matchHash(hash, s).route

describe('router', () => {
  it('matches every fixed route to itself', () => {
    for (const key of Object.keys(ROUTES) as RouteKey[]) {
      if (ROUTES[key].includes('/:') || key in REDIRECTED) continue
      expect(matchHash(ROUTES[key], empty)).toEqual({ route: key, caseId: null, attemptId: null, redirect: null })
    }
  })

  it('reads the draft a Create a Case link reopens', () => {
    expect(matchHash(`${ROUTES.seniorNew}?draft=draft-1`, empty)).toMatchObject({ route: 'seniorNew', draftId: 'draft-1' })
    expect(matchHash(`${ROUTES.seniorNew}?draft=`, empty).draftId).toBeUndefined()
  })

  it('sends a fixed route with no screen to its target, like a dead URL', () => {
    expect(REDIRECTED.juniorInProgress).toBe('juniorHome')
    for (const [from, to] of Object.entries(REDIRECTED) as [FixedRoute, FixedRoute][]) {
      expect(matchHash(ROUTES[from], empty)).toEqual({ route: to, caseId: null, attemptId: null, redirect: ROUTES[to] })
    }
  })

  it('opens the details page for every case in the library, playable or not', () => {
    for (const s of CASE_SUMMARIES) {
      expect(matchHash(casePageHref(s.id, 'details'), empty)).toMatchObject({ route: 'juniorCase', caseId: s.id })
    }
  })

  it('opens the steps and reflect only for playable cases, and the room only with a room script', () => {
    const steps: Record<string, PatternRoute> = {
      define: 'juniorDefine',
      examine: 'juniorExamine',
      investigate: 'juniorInvestigate',
      decide: 'juniorDecide',
    }
    for (const s of CASE_SUMMARIES) {
      const playable = isPlayable(s.id)
      for (const step of CASE_STEPS) expect(route(caseHref(s.id, step))).toBe(playable ? steps[step] : 'juniorHome')
      expect(route(casePageHref(s.id, 'reflect'))).toBe(playable ? 'juniorReflect' : 'juniorHome')
      const room = playable && CASES[s.id].room !== undefined
      expect(route(casePageHref(s.id, 'room'))).toBe(room ? 'juniorRoom' : 'juniorHome')
    }
  })

  it('sends a dead case URL to the case library', () => {
    for (const hash of [
      '#/junior/case/no-such-case',
      '#/junior/case/no-such-case/define',
      '#/junior/case/japan-launch/nope',
      '#/junior/case/japan-launch/',
      '#/junior/case/japan-launch/define/extra',
      '#/junior/case/',
    ]) {
      expect(matchHash(hash, empty)).toEqual({ route: 'juniorHome', caseId: null, attemptId: null, redirect: '#/junior' })
    }
  })

  it('opens a review only for a submitted attempt or room in the store, and sends the rest to the queue', () => {
    const s = store({ attempts: ['att-1'], rooms: ['room-1'], inProgress: ['att-draft'] })
    expect(matchHash(reviewHref('att-draft'), s).redirect).toBe('#/manager')
    expect(matchHash(reviewHref('att-1'), s)).toMatchObject({ route: 'managerReview', attemptId: 'att-1', redirect: null })
    expect(matchHash(reviewHref('room-1'), s)).toMatchObject({ route: 'managerReview', attemptId: 'room-1' })
    expect(matchHash(reviewHref('att-2'), s)).toEqual({
      route: 'managerReviews',
      caseId: null,
      attemptId: null,
      redirect: '#/manager',
    })
    expect(matchHash('#/manager/review/', s).redirect).toBe('#/manager')
  })

  it('shows the landing page for any other hash, as before', () => {
    for (const hash of ['', '#', '#/nope', '#/junior/nope', '#/manager/review']) {
      expect(matchHash(hash, empty)).toEqual({ route: 'landing', caseId: null, attemptId: null, redirect: null })
    }
  })
})
