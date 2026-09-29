import type { RoomSession } from '../../contracts/records'
import { ConfidencePicker } from './ConfidencePicker'
import type { RoomUpdate } from './room'
import './fields.css'

type Position = RoomSession['initialPosition']

// 'My initial position' in the Decision Room, written before talking to anyone. It locks once the
// discussion starts, so the review can compare it with the joint recommendation.
export function RoomPosition({ session, update }: { session: RoomSession; update: RoomUpdate }) {
  const position = session.initialPosition
  const locked = session.status !== 'in-progress' || session.messages.length > 0
  const edit = <K extends keyof Position>(key: K, value: Position[K]) =>
    update((s) => {
      s.initialPosition[key] = value
    })

  return (
    <section className="card jr-room-card" aria-labelledby="jr-position-title">
      <h2 id="jr-position-title" className="title title--sm jr-room-card__title">
        My initial position
      </h2>
      <p className="jr-room-card__text">
        {locked ? 'Written before the discussion started.' : 'Before you talk to anyone. It locks when the discussion starts.'}
      </p>
      <div className="jr-room-grid">
        <div className="field jr-room-field">
          <label className="field__label" htmlFor="jr-room-rec">
            What would you recommend now?
          </label>
          <textarea
            id="jr-room-rec"
            className="textarea jr-line"
            rows={1}
            readOnly={locked}
            value={position.recommendation}
            onChange={(e) => edit('recommendation', e.target.value)}
          />
        </div>
        <div className="field jr-room-field">
          <span id="jr-room-confidence" className="field__label">
            Confidence
          </span>
          <ConfidencePicker
            className="jr-room-confidence"
            value={position.confidence}
            labelledBy="jr-room-confidence"
            readOnly={locked}
            onChange={(value) => edit('confidence', value)}
          />
        </div>
      </div>
      <div className="field jr-room-field">
        <label className="field__label" htmlFor="jr-room-reason">
          Why
        </label>
        <textarea
          id="jr-room-reason"
          className="textarea jr-line"
          rows={1}
          readOnly={locked}
          value={position.reason}
          onChange={(e) => edit('reason', e.target.value)}
        />
      </div>
    </section>
  )
}
