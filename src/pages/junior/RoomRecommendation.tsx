import type { RoomSession } from '../../contracts/records'
import type { RoomUpdate } from './room'
import './fields.css'

type Recommendation = RoomSession['recommendation']
type TextKey = Exclude<keyof Recommendation, 'evidenceIds'>

const FIELDS: { key: TextKey; label: string; rows: number }[] = [
  { key: 'plan', label: 'The plan', rows: 3 },
  { key: 'tradeoffs', label: 'Trade-offs', rows: 2 },
  { key: 'unresolved', label: 'Still unresolved', rows: 2 },
]

type RoomRecommendationProps = { session: RoomSession; readOnly: boolean; update: RoomUpdate }

// 'Joint recommendation' and 'My reflection' at the end of the Decision Room. The recommendation
// cites the shared evidence it uses by id, so the review can trace it back to the discussion.
export function RoomRecommendation({ session, readOnly, update }: RoomRecommendationProps) {
  const rec = session.recommendation
  const edit = (key: TextKey, value: string) =>
    update((s) => {
      s.recommendation[key] = value
    })
  const toggle = (id: string) =>
    update((s) => {
      const ids = s.recommendation.evidenceIds
      s.recommendation.evidenceIds = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    })
  const reflect = (key: keyof RoomSession['reflection'], value: string) =>
    update((s) => {
      s.reflection[key] = value
    })

  return (
    <>
      <section className="card jr-room-card" aria-labelledby="jr-joint-title">
        <h2 id="jr-joint-title" className="title title--sm jr-room-card__title">
          Joint recommendation
        </h2>
        {FIELDS.map(({ key, label, rows }) => (
          <div key={key} className="field jr-room-field">
            <label className="field__label" htmlFor={`jr-joint-${key}`}>
              {label}
            </label>
            <textarea
              id={`jr-joint-${key}`}
              className="textarea jr-grow"
              rows={rows}
              readOnly={readOnly}
              value={rec[key]}
              onChange={(e) => edit(key, e.target.value)}
            />
          </div>
        ))}
        <div className="jr-room-grid">
          <div className="field jr-room-field">
            <label className="field__label" htmlFor="jr-joint-owner">
              Owner
            </label>
            <textarea id="jr-joint-owner" className="textarea jr-line" rows={1} placeholder="Who owns the next step" readOnly={readOnly} value={rec.owner} onChange={(e) => edit('owner', e.target.value)} />
          </div>
          <div className="field jr-room-field">
            <label className="field__label" htmlFor="jr-joint-review">
              Review by
            </label>
            <textarea id="jr-joint-review" className="textarea jr-line" rows={1} placeholder="When to check again" readOnly={readOnly} value={rec.reviewBy} onChange={(e) => edit('reviewBy', e.target.value)} />
          </div>
        </div>
        <div className="field jr-room-field">
          <span id="jr-joint-evidence" className="field__label">
            Evidence it uses
          </span>
          {session.sharedEvidence.length === 0 ? (
            <p className="jr-room-card__text">Add shared evidence first, then pick what the plan relies on.</p>
          ) : (
            <ul className="jr-chips" aria-labelledby="jr-joint-evidence">
              {session.sharedEvidence.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={rec.evidenceIds.includes(e.id)}
                    aria-disabled={readOnly || undefined}
                    onClick={() => {
                      if (!readOnly) toggle(e.id)
                    }}
                  >
                    {e.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <section className="card jr-room-card" aria-labelledby="jr-reflection-title">
        <h2 id="jr-reflection-title" className="title title--sm jr-room-card__title">
          My reflection
        </h2>
        <div className="field jr-room-field">
          <label className="field__label" htmlFor="jr-reflect-changed">
            What changed your mind, and why?
          </label>
          <textarea id="jr-reflect-changed" className="textarea jr-grow" rows={3} readOnly={readOnly} value={session.reflection.changedMind} onChange={(e) => reflect('changedMind', e.target.value)} />
        </div>
        <div className="field jr-room-field">
          <label className="field__label" htmlFor="jr-reflect-uncertain">
            What do you still disagree with or remain uncertain about?
          </label>
          <textarea id="jr-reflect-uncertain" className="textarea jr-grow" rows={3} readOnly={readOnly} value={session.reflection.stillUncertain} onChange={(e) => reflect('stillUncertain', e.target.value)} />
        </div>
      </section>
    </>
  )
}
