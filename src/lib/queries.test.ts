import { describe, expect, it } from 'vitest'
import { SEED_VERSION, type Feedback, type PracticeAttempt, type RoomSession, type Store } from '../contracts/records'
import { activeAttemptId, activeRoomId, unreadFeedbackCount, waitingForReviewCount } from './queries'

type Rec = Pick<PracticeAttempt, 'id' | 'source' | 'caseId' | 'learnerId' | 'startedAt' | 'updatedAt' | 'status'>

const rec = (id: string, over: Partial<Rec> = {}): Rec => ({
  id,
  source: 'user',
  caseId: 'japan-launch',
  learnerId: 'alex',
  startedAt: '2026-09-29T10:00:00.000Z',
  updatedAt: '2026-09-29T10:00:00.000Z',
  status: 'submitted',
  ...over,
})

const store = (over: Partial<Store> = {}): Store => ({
  version: 1,
  seedVersion: SEED_VERSION,
  attempts: [],
  rooms: [],
  workReviews: [],
  growth: [],
  shares: [],
  feedback: [],
  selfReviews: [],
  ui: { viewMode: {}, activeAttempt: {}, activeRoom: {} },
  ...over,
})

const attempts = (...list: Rec[]) => list as PracticeAttempt[]
const fb = (about: string, over: Partial<Feedback> = {}) => ({ id: `fb-${about}`, toId: 'alex', about: { kind: 'attempt', id: about }, ...over }) as Feedback

describe('active record', () => {
  const list = attempts(
    rec('att-old', { updatedAt: '2026-09-29T09:00:00.000Z' }),
    rec('att-new', { updatedAt: '2026-09-29T11:00:00.000Z' }),
    rec('att-demo', { source: 'demo', updatedAt: '2026-09-29T12:00:00.000Z' }),
    rec('att-other', { learnerId: 'jo', updatedAt: '2026-09-29T13:00:00.000Z' }),
    rec('att-case', { caseId: 'friday-release', updatedAt: '2026-09-29T14:00:00.000Z' }),
  )

  it('uses the active id when it is the learner’s own record at this case', () => {
    const s = store({ attempts: list, ui: { viewMode: {}, activeAttempt: { 'japan-launch': 'att-old' }, activeRoom: {} } })
    expect(activeAttemptId(s, 'japan-launch', 'alex')).toBe('att-old')
  })

  it('otherwise takes the learner’s latest user record, never a demo one', () => {
    expect(activeAttemptId(store({ attempts: list }), 'japan-launch', 'alex')).toBe('att-new')
    for (const bad of ['att-demo', 'att-other', 'att-case', 'att-gone']) {
      const s = store({ attempts: list, ui: { viewMode: {}, activeAttempt: { 'japan-launch': bad }, activeRoom: {} } })
      expect(activeAttemptId(s, 'japan-launch', 'alex')).toBe('att-new')
    }
  })

  it('is null when the learner has no record of their own yet', () => {
    const s = store({ attempts: attempts(rec('att-demo', { source: 'demo' })) })
    expect(activeAttemptId(s, 'japan-launch', 'alex')).toBeNull()
  })

  it('follows the same rule for rooms', () => {
    const rooms = [rec('room-a'), rec('room-b', { updatedAt: '2026-09-29T11:00:00.000Z' })] as unknown as RoomSession[]
    expect(activeRoomId(store({ rooms }), 'japan-launch', 'alex')).toBe('room-b')
    const s = store({ rooms, ui: { viewMode: {}, activeAttempt: {}, activeRoom: { 'japan-launch': 'room-a' } } })
    expect(activeRoomId(s, 'japan-launch', 'alex')).toBe('room-a')
  })
})

describe('sidebar counts', () => {
  it('counts the learner’s unread feedback', () => {
    const s = store({ feedback: [fb('a'), fb('b', { readAt: '2026-09-29T10:00:00.000Z' }), fb('c', { toId: 'jo' })] })
    expect(unreadFeedbackCount(s, 'alex')).toBe(1)
  })

  it('counts submitted attempts and rooms with no feedback yet', () => {
    const s = store({
      attempts: attempts(rec('att-1'), rec('att-2', { status: 'revised' }), rec('att-3', { status: 'in-progress' }), rec('att-4')),
      rooms: [rec('room-1'), rec('room-2', { status: 'in-progress' })] as unknown as RoomSession[],
      feedback: [fb('att-4')],
    })
    expect(waitingForReviewCount(s)).toBe(3)
  })
})
