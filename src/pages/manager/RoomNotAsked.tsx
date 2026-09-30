import type { RoomSession } from '../../contracts/records'
import type { CaseContent } from '../../contracts/types'
import { roleTitle } from './RoomInformation'

// The room script's questions this session never asked. Questions to the role the learner
// played (room.roleId) are left out: they already held that information.
export function RoomNotAsked({ content, room }: { content: CaseContent; room: RoomSession }) {
  const questions = content.room?.questions ?? []
  if (questions.length === 0) return null
  const asked = new Set(room.messages.filter((m) => m.from === room.roleId && m.questionId).map((m) => m.questionId))
  const missed = questions.filter((q) => q.toRoleId !== room.roleId && !asked.has(q.id))

  return (
    <section className="card rv-card" aria-labelledby="rv-not-asked">
      <h2 id="rv-not-asked" className="title title--sm rv-card__title">
        Not asked
      </h2>
      <p className="rv-card__lead">The app’s check against the room script: scripted questions this session never asked.</p>
      {missed.length === 0 ? (
        <p className="rv-card__none rv-card__label">Every scripted question was asked.</p>
      ) : (
        <ul className="rv-list rv-card__label">
          {missed.map((q) => (
            <li key={q.id} className="rv-msg">
              <p className="rv-msg__line">
                <span className="rv-msg__who">{roleTitle(content, q.toRoleId)}</span>
                {q.text}
              </p>
              {q.reveals && (
                <p className="rv-msg__line rv-msg__reply">
                  <span className="rv-msg__who">Would have revealed</span>
                  {q.reveals}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
