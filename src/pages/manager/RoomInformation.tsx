import type { RoomMessage, RoomSession } from '../../contracts/records'
import type { CaseContent } from '../../contracts/types'
import { DemoTag } from '../../components/DemoTag'

export const roleTitle = (content: CaseContent, id: string) =>
  id === 'all' ? 'Everyone' : (content.roles?.find((r) => r.id === id)?.title ?? id)

const KIND_VERBS: Record<RoomMessage['kind'], string> = {
  question: 'Asked',
  challenge: 'Challenged',
  proposal: 'Proposed',
  share: 'Shared',
  answer: 'Answered',
}

// The reply an AI role gave to one of the learner's messages: the next message from that role.
function replyTo(room: RoomSession, message: RoomMessage): RoomMessage | undefined {
  const after = room.messages.slice(room.messages.indexOf(message) + 1)
  return after.find((m) => m.from === message.to && m.from !== room.roleId)
}

// What the learner asked, challenged or proposed, with each AI role's scripted reply; then the
// evidence they shared and which of it their recommendation uses.
export function RoomInformation({ content, room }: { content: CaseContent; room: RoomSession }) {
  const mine = room.messages.filter((m) => m.from === room.roleId)
  const used = new Set(room.recommendation.evidenceIds)

  return (
    <section className="card rv-card" aria-labelledby="rv-info">
      <h2 id="rv-info" className="title title--sm rv-card__title">
        Information asked, shared and used
      </h2>
      <p className="rv-card__lead">
        {mine.length} message{mine.length === 1 ? '' : 's'} · {room.sharedEvidence.length} piece
        {room.sharedEvidence.length === 1 ? '' : 's'} of shared evidence · {used.size} used in the recommendation
      </p>

      <p className="field__label rv-card__label">Asked and discussed</p>
      {mine.length === 0 ? (
        <p className="rv-card__none">They didn’t ask anything.</p>
      ) : (
        <ul className="rv-list">
          {mine.map((message) => {
            const reply = replyTo(room, message)
            return (
              <li key={message.id} className="rv-msg">
                <p className="rv-msg__line">
                  <span className="rv-msg__who">
                    {KIND_VERBS[message.kind]} · {roleTitle(content, message.to)}
                  </span>
                  {message.text}
                </p>
                {reply && (
                  <p className="rv-msg__line rv-msg__reply">
                    <span className="rv-msg__who">
                      {roleTitle(content, reply.from)} {reply.demo && <DemoTag kind="response" />}
                    </span>
                    {reply.text}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <p className="field__label rv-card__label">Shared evidence</p>
      {room.sharedEvidence.length === 0 ? (
        <p className="rv-card__none">Nothing was added to the shared evidence.</p>
      ) : (
        <ul className="rv-list">
          {room.sharedEvidence.map((evidence) => (
            <li key={evidence.id} className="rv-msg">
              <p className="rv-msg__line">
                <span className="rv-msg__who">
                  From {roleTitle(content, evidence.sourceRoleId)}
                  {used.has(evidence.id) && <span className="badge badge--accent">Used in the recommendation</span>}
                </span>
                {evidence.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// The conflicts the script holds between the roles: which were surfaced, and how each was handled.
export function RoomConflicts({ content, room }: { content: CaseContent; room: RoomSession }) {
  const conflicts = content.room?.conflicts ?? []
  if (conflicts.length === 0) return null
  const found = new Map((room.conflicts ?? []).map((c) => [c.conflictId, c]))

  return (
    <section className="card rv-card" aria-labelledby="rv-conflicts">
      {/* The conflicts come from the room script; 'Not surfaced' is the app's check against it. */}
      <div className="rv-card__head">
        <h2 id="rv-conflicts" className="title title--sm rv-card__title">
          Conflicts between the roles
        </h2>
        <DemoTag kind="response" />
      </div>
      <ul className="rv-list rv-card__list">
        {conflicts.map((conflict) => {
          const handled = found.get(conflict.id)
          const badge = !handled ? ['badge--neutral', 'Not surfaced'] : handled.status === 'resolved' ? ['badge--accent', 'Resolved'] : ['badge--warn', 'Open']
          return (
            <li key={conflict.id} className="rv-msg">
              <p className="rv-msg__line">
                <span className="rv-msg__who">
                  {conflict.between.map((id) => roleTitle(content, id)).join(' and ')}
                  <span className={`badge ${badge[0]}`}>{badge[1]}</span>
                </span>
                {conflict.text}
              </p>
              {handled?.handling.trim() && (
                <p className="rv-msg__line rv-msg__reply">
                  <span className="rv-msg__who">How they handled it</span>
                  {handled.handling}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
