import { useMemo } from 'react'
import type { GrowthRecord, RoomMessage, RoomSession, Store } from '../../contracts/records'
import type { CaseContent, CaseId, RoomQuestion, RoomScript } from '../../contracts/types'
import { getSummary } from '../../lib/content'
import { activeRoomId } from '../../lib/queries'
import { newId, setStore, useStore } from '../../lib/records'
import { LEARNER_ID } from './practice'
import { aiRolesFor, matchReply, replyTo, saveFoundConflicts, type LearnerKind } from './roomScript'

// The Team Decision Room through the shared store (contracts/records.ts RoomSession). Every input
// writes through as it changes; the session is the active room for the case (ui.activeRoom).

function blankRoom(content: CaseContent, script: RoomScript, roleId = script.humanRoleId): RoomSession {
  const now = new Date().toISOString()
  return {
    id: newId('room'),
    source: 'user',
    caseId: content.id,
    caseVersion: getSummary(content.id).version,
    learnerId: LEARNER_ID,
    roleId,
    startedAt: now,
    updatedAt: now,
    status: 'in-progress',
    initialPosition: { recommendation: '', reason: '', confidence: null },
    messages: [],
    sharedEvidence: [],
    openQuestions: [],
    conflicts: [],
    recommendation: { plan: '', tradeoffs: '', unresolved: '', owner: '', reviewBy: '', evidenceIds: [] },
    reflection: { changedMind: '', stillUncertain: '' },
  }
}

export function currentRoom(store: Store, caseId: CaseId): RoomSession | undefined {
  const id = activeRoomId(store, caseId, LEARNER_ID)
  return store.rooms.find((r) => r.id === id)
}

export function useCurrentRoom(caseId: CaseId): RoomSession | undefined {
  const id = useStore((store) => activeRoomId(store, caseId, LEARNER_ID))
  const rooms = useStore((store) => store.rooms)
  return useMemo(() => rooms.find((r) => r.id === id), [rooms, id])
}

// The session a new one replaces: none, one already submitted, or (when a role is chosen) one in
// progress with another role.
function sessionFor(draft: Store, content: CaseContent, script: RoomScript, roleId?: string): RoomSession {
  let target = currentRoom(draft, content.id)
  if (!target || target.status !== 'in-progress' || (roleId && target.roleId !== roleId)) {
    target = blankRoom(content, script, roleId)
    draft.rooms.push(target)
  }
  draft.ui.activeRoom[content.id] = target.id
  return target
}

// 'Enter the room' on the details page, playing roleId: a new session unless one is in progress
// with that role.
export function enterRoom(content: CaseContent, roleId?: string): void {
  const script = content.room
  if (script) setStore((draft) => void sessionFor(draft, content, script, roleId))
}

// 'Start the room again': a fresh session with the same role, so the initial position can be
// written again. The old session stays in the store (a submitted one stays in the Team Lead's
// queue); it is just no longer the one the room shows.
export function restartRoom(content: CaseContent): void {
  const script = content.room
  if (!script) return
  setStore((draft) => {
    const fresh = blankRoom(content, script, currentRoom(draft, content.id)?.roleId)
    draft.rooms.push(fresh)
    draft.ui.activeRoom[content.id] = fresh.id
  })
}

export type RoomUpdate = (recipe: (session: RoomSession) => void) => void

export type Room = { session: RoomSession; readOnly: boolean; update: RoomUpdate }

export function useRoom(content: CaseContent, script: RoomScript): Room {
  const saved = useCurrentRoom(content.id)
  const blank = useMemo(() => blankRoom(content, script), [content, script])
  const session = saved ?? blank
  const update: RoomUpdate = (recipe) =>
    setStore((draft) => {
      const target = sessionFor(draft, content, script)
      recipe(target)
      target.updatedAt = new Date().toISOString()
    })
  return { session, readOnly: session.status !== 'in-progress', update }
}

// "1 fact", "2 facts": the count with its noun in the right number.
const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? '' : 's'}`

const message = (fields: Omit<RoomMessage, 'id' | 'at'>): RoomMessage => ({
  id: newId('msg'),
  at: new Date().toISOString(),
  ...fields,
})

// A suggested question, and the asked role's scripted answer. A conflict it reveals is saved at once.
export function askQuestion(update: RoomUpdate, script: RoomScript, question: RoomQuestion): void {
  update((s) => {
    const { id: questionId, toRoleId } = question
    s.messages.push(
      message({ from: s.roleId, to: toRoleId, kind: 'question', text: question.text, demo: false, questionId }),
      message({ from: toRoleId, to: s.roleId, kind: 'answer', text: question.answer, demo: true, questionId }),
    )
    saveFoundConflicts(script, s)
  })
}

// The learner's own words to one AI role, and that role's scripted reply (roomScript.replyTo).
export function sendMessage(update: RoomUpdate, script: RoomScript, toRoleId: string, kind: LearnerKind, text: string) {
  update((s) => {
    const reply = replyTo(script, toRoleId, kind, text)
    const { questionId, replyId } = reply
    s.messages.push(
      message({ from: s.roleId, to: toRoleId, kind, text, demo: false, questionId }),
      message({ from: toRoleId, to: s.roleId, kind: 'answer', text: reply.text, demo: true, questionId, replyId }),
    )
    saveFoundConflicts(script, s)
  })
}

// A fact from the learner's own brief, shared with everyone and added to shared evidence. An AI
// role answers only when a scripted reply matches it.
export function shareFact(update: RoomUpdate, script: RoomScript, text: string): void {
  update((s) => {
    const shared = message({ from: s.roleId, to: 'all', kind: 'share', text, demo: false })
    s.messages.push(shared)
    s.sharedEvidence.push({ id: newId('ev'), text, sourceRoleId: s.roleId, messageId: shared.id, at: shared.at })
    for (const roleId of aiRolesFor(script, s.roleId)) {
      const reply = matchReply(script, roleId, text)
      if (reply) s.messages.push(message({ from: roleId, to: s.roleId, kind: 'answer', text: reply.text, demo: true, replyId: reply.replyId }))
    }
  })
}

// Submit: the session is final, and one practice growth record for Collaboration is made for it.
export function submitRoom(content: CaseContent, roleTitle: (id: string) => string): void {
  setStore((draft) => {
    const s = currentRoom(draft, content.id)
    if (!s || s.status !== 'in-progress') return
    const at = new Date().toISOString()
    s.status = 'submitted'
    s.updatedAt = at
    if (s.growthRecordId) return
    const asked = s.messages.filter((m) => m.from === s.roleId && m.kind === 'question').length
    const mine = s.sharedEvidence.filter((e) => e.sourceRoleId === s.roleId).length
    const record: GrowthRecord = {
      id: newId('gr'),
      source: 'user',
      learnerId: LEARNER_ID,
      date: at,
      kind: 'practice',
      skillId: 'collaboration',
      situation: `${getSummary(content.id).title} (Team Decision Room): played the ${roleTitle(s.roleId)} with AI roles`,
      contribution: `Asked ${count(asked, 'question')}, shared ${count(mine, 'fact')} from my brief and wrote the joint recommendation.`,
      evidence: [
        { text: `Joint recommendation: ${s.recommendation.plan}`, ref: { kind: 'room', id: s.id } },
        ...s.sharedEvidence.map((e) => ({
          text: `Shared evidence from ${e.sourceRoleId === s.roleId ? 'my brief' : `the ${roleTitle(e.sourceRoleId)}`}: ${e.text}`,
        })),
      ],
      prompting: 'none',
      level: 'not-observed',
      outcome: 'practice-only',
      learning: '',
      nextStep: '',
      privateNote: '',
      links: [{ kind: 'room', id: s.id }],
    }
    draft.growth.push(record)
    s.growthRecordId = record.id
  })
}
