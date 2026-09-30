import { useState } from 'react'
import type { RoomSession } from '../../contracts/records'
import type { RoomScript } from '../../contracts/types'
import { newId } from '../../lib/records'
import type { RoomUpdate } from './room'
import { aiRolesFor } from './roomScript'
import './fields.css'

type Status = RoomSession['openQuestions'][number]['status']

const STATUSES: { id: Status; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'unknown', label: 'Nobody knows' },
]

type RoomBoardProps = {
  script: RoomScript
  session: RoomSession
  roleTitle: (id: string) => string
  readOnly: boolean
  update: RoomUpdate
}

// 'Shared evidence' and 'Open questions' in the Decision Room's left column. Each piece of
// evidence keeps the role it came from; each open question has an owner and a status.
export function RoomBoard({ script, session, roleTitle, readOnly, update }: RoomBoardProps) {
  // The question being written; it joins the list on Add.
  const [text, setText] = useState('')
  const roles = [session.roleId, ...aiRolesFor(script, session.roleId)]
  const [owner, setOwner] = useState(roles[0] ?? '')
  const who = (id: string) => (id === session.roleId ? `You (${roleTitle(id)})` : roleTitle(id))

  const add = () => {
    if (!text.trim()) return
    update((s) => {
      s.openQuestions.push({ id: newId('oq'), text: text.trim(), ownerRoleId: owner, status: 'open' })
    })
    setText('')
  }

  return (
    <>
      <section className="card jr-room-card" aria-labelledby="jr-evidence-title">
        <h2 id="jr-evidence-title" className="title title--sm jr-room-card__title">
          Shared evidence
        </h2>
        {session.sharedEvidence.length === 0 ? (
          <p className="jr-room-card__text">Nothing yet. Share from your brief, or add what the others tell you.</p>
        ) : (
          <ul className="jr-board-list">
            {session.sharedEvidence.map((e) => (
              <li key={e.id} className="jr-board-list__item">
                <p className="jr-board-list__text">{e.text}</p>
                <p className="jr-board-list__meta">
                  From {who(e.sourceRoleId)}
                  {!readOnly && (
                    <button
                      type="button"
                      className="btn btn--link jr-board-list__remove"
                      onClick={() =>
                        update((s) => {
                          s.sharedEvidence = s.sharedEvidence.filter((x) => x.id !== e.id)
                          s.recommendation.evidenceIds = s.recommendation.evidenceIds.filter((id) => id !== e.id)
                        })
                      }
                    >
                      Remove
                    </button>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="card jr-room-card" aria-labelledby="jr-questions-title">
        <h2 id="jr-questions-title" className="title title--sm jr-room-card__title">
          Open questions
        </h2>
        {session.openQuestions.length === 0 && <p className="jr-room-card__text">None recorded yet.</p>}
        <ul className="jr-board-list">
          {session.openQuestions.map((q) => (
            <li key={q.id} className="jr-board-list__item">
              <p className="jr-board-list__text">{q.text}</p>
              <div className="jr-board-list__row">
                <span className="jr-board-list__meta">Owner: {who(q.ownerRoleId)}</span>
                <label className="visually-hidden" htmlFor={`jr-oq-${q.id}`}>
                  Status
                </label>
                <select
                  id={`jr-oq-${q.id}`}
                  className="select jr-board-list__status"
                  value={q.status}
                  disabled={readOnly}
                  onChange={(e) => {
                    const status = e.target.value as Status
                    update((s) => {
                      const target = s.openQuestions.find((x) => x.id === q.id)
                      if (target) target.status = status
                    })
                  }}
                >
                  {STATUSES.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
        {!readOnly && (
          <div className="jr-oq-add">
            <label className="visually-hidden" htmlFor="jr-oq-text">
              New open question
            </label>
            <textarea
              id="jr-oq-text"
              className="textarea jr-line"
              rows={1}
              placeholder="What still needs an answer?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                // Enter still adds the question, as it did from the one-line field.
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  add()
                }
              }}
            />
            <div className="jr-oq-add__row">
              <label className="visually-hidden" htmlFor="jr-oq-owner">
                Owner
              </label>
              <select id="jr-oq-owner" className="select" value={owner} onChange={(e) => setOwner(e.target.value)}>
                {roles.map((id) => (
                  <option key={id} value={id}>
                    Owner: {roleTitle(id)}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn--secondary btn--sm" disabled={!text.trim()} onClick={add}>
                Add
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
