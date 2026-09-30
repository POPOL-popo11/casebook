import type { RoomMessage, RoomSession } from '../../contracts/records'
import type { RoomScript } from '../../contracts/types'

// The Decision Room's scripted AI roles (types.ts RoomScript). Nothing here is live AI: every
// answer is written in the case and shown with DEMO_RESPONSE_LABEL. An AI role never invents a fact.

export type LearnerKind = Extract<RoomMessage['kind'], 'question' | 'challenge' | 'proposal' | 'share'>

// Lower case, straight apostrophes, no quotes or end punctuation, single spaces.
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”"?!.,;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// A phrase counts when it starts a word in the text: 'pilot' matches 'pilots', 'ops' not 'stops'.
function mentions(text: string, phrase: string): boolean {
  const wanted = normalise(phrase)
  return wanted !== '' && new RegExp(`(?<![a-z0-9])${escapeRegExp(wanted)}`).test(normalise(text))
}

export type Reply = { text: string; questionId?: string; replyId?: string }

// What an AI role answers, in this order: a scripted question asked in the same words; else the
// first scripted reply whose words appear in the message; else, to a challenge or a proposal, the
// role's challenge reply; else the script's 'I don't know'.
export function replyTo(script: RoomScript, toRoleId: string, kind: LearnerKind, text: string): Reply {
  const said = normalise(text)
  const question = script.questions.find((q) => q.toRoleId === toRoleId && normalise(q.text) === said)
  if (question) return { text: question.answer, questionId: question.id }
  const reply = matchReply(script, toRoleId, text)
  if (reply) return reply
  const challenge = kind === 'challenge' || kind === 'proposal' ? script.challengeReplies?.[toRoleId] : undefined
  return { text: challenge ?? script.unknownAnswer }
}

// Only a scripted reply whose words appear, e.g. when a fact is shared with everyone.
export function matchReply(script: RoomScript, toRoleId: string, text: string): Reply | undefined {
  const reply = script.replies?.find((r) => r.toRoleId === toRoleId && r.ifMentions.some((p) => mentions(text, p)))
  return reply && { text: reply.text, replyId: reply.id }
}

// Every role in the room: the default human role, the AI roles, and any other playable role.
export function roomRoleIds(script: RoomScript): string[] {
  return [...new Set([script.humanRoleId, ...script.aiRoleIds, ...(script.playableRoleIds ?? [])])]
}

// The roles a learner may choose to play (types.ts RoomScript.playableRoleIds).
export function playableRoleIds(script: RoomScript): string[] {
  return script.playableRoleIds?.length ? script.playableRoleIds : [script.humanRoleId]
}

// The AI roles when the learner plays roleId: every other role in the room.
export function aiRolesFor(script: RoomScript, roleId: string): string[] {
  return roomRoleIds(script).filter((id) => id !== roleId)
}

// The questions asked so far, by id: suggested ones, and free text that matched one.
export function askedIds(session: RoomSession): Set<string> {
  return new Set(
    session.messages.filter((m) => m.kind === 'question' && m.questionId).map((m) => m.questionId as string),
  )
}

// A conflict counts as found once every question that reveals it has been asked.
// A question to the role the learner plays counts as asked: they already hold that information.
export function foundConflicts(script: RoomScript, session: RoomSession) {
  const asked = askedIds(session)
  for (const q of script.questions) if (q.toRoleId === session.roleId) asked.add(q.id)
  return (script.conflicts ?? []).filter((c) => c.revealedBy.length > 0 && c.revealedBy.every((id) => asked.has(id)))
}

// Found conflicts the session hasn't saved yet. Each is saved as soon as it is found, open and not
// yet handled, so the Team Lead sees it as surfaced even if the learner never edits it.
export function unsavedConflicts(script: RoomScript, session: RoomSession) {
  return foundConflicts(script, session).filter((c) => !session.conflicts.some((saved) => saved.conflictId === c.id))
}

export function saveFoundConflicts(script: RoomScript, session: RoomSession): void {
  for (const c of unsavedConflicts(script, session)) session.conflicts.push({ conflictId: c.id, handling: '', status: 'open' })
}

// What 'Add to shared evidence' takes from an AI message: the fact its question reveals, else the message.
export function evidenceText(script: RoomScript, message: RoomMessage): string {
  const question = script.questions.find((q) => q.id === message.questionId)
  return question?.reveals ?? message.text
}
