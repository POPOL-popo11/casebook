import { useEffect } from 'react'
import type { RoomSession } from '../../contracts/records'
import type { RoomScript } from '../../contracts/types'
import type { RoomUpdate } from './room'
import { foundConflicts, saveFoundConflicts, unsavedConflicts } from './roomScript'
import './fields.css'

type Handling = RoomSession['conflicts'][number]

type RoomConflictsProps = {
  script: RoomScript
  session: RoomSession
  roleTitle: (id: string) => string
  readOnly: boolean
  update: RoomUpdate
}

// 'Conflicts found' in the Decision Room: a conflict between roles appears once every question that
// reveals it has been asked. The learner records how it was handled, and whether it is resolved.
export function RoomConflicts({ script, session, roleTitle, readOnly, update }: RoomConflictsProps) {
  const found = foundConflicts(script, session)
  const unsaved = readOnly ? 0 : unsavedConflicts(script, session).length

  // A session started before conflicts were saved on discovery: save the ones already found.
  useEffect(() => {
    if (unsaved > 0) update((s) => saveFoundConflicts(script, s))
  }, [unsaved, script, update])

  const edit = (conflictId: string, patch: Partial<Handling>) =>
    update((s) => {
      let target = s.conflicts.find((c) => c.conflictId === conflictId)
      if (!target) {
        target = { conflictId, handling: '', status: 'open' }
        s.conflicts.push(target)
      }
      Object.assign(target, patch)
    })

  return (
    <section className="card jr-room-card" aria-labelledby="jr-conflicts-title">
      <h2 id="jr-conflicts-title" className="title title--sm jr-room-card__title">
        Conflicts found
      </h2>
      {found.length === 0 ? (
        <p className="jr-room-card__text">None found yet.</p>
      ) : (
        <ul className="jr-board-list">
          {found.map((conflict) => {
            const handled = session.conflicts.find((c) => c.conflictId === conflict.id)
            return (
              <li key={conflict.id} className="jr-board-list__item jr-conflict">
                <p className="jr-board-list__text">{conflict.text}</p>
                <p className="jr-board-list__meta">Between {conflict.between.map(roleTitle).join(' and ')}</p>
                <div className="field jr-room-field">
                  <label className="field__label" htmlFor={`jr-conflict-${conflict.id}`}>
                    How did you handle it?
                  </label>
                  <textarea
                    id={`jr-conflict-${conflict.id}`}
                    className="textarea jr-grow"
                    rows={2}
                    readOnly={readOnly}
                    value={handled?.handling ?? ''}
                    onChange={(e) => edit(conflict.id, { handling: e.target.value })}
                  />
                </div>
                <div className="segmented jr-conflict__status" role="group" aria-label="Conflict status">
                  {(['open', 'resolved'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className="segmented__item"
                      aria-pressed={(handled?.status ?? 'open') === status}
                      aria-disabled={readOnly || undefined}
                      onClick={() => {
                        if (!readOnly) edit(conflict.id, { status })
                      }}
                    >
                      {status === 'open' ? 'Still open' : 'Resolved'}
                    </button>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
