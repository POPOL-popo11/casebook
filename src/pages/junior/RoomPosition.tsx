import type { RoomSession } from '../../contracts/records'
import { ConfidencePicker } from './ConfidencePicker'
import type { RoomUpdate } from './room'
import './fields.css'

type Position = RoomSession['initialPosition']

const CONFIDENCE_LABELS: Record<NonNullable<Position['confidence']>, string> = { low: 'Low', medium: 'Medium', high: 'High' }

type RoomPositionProps = { session: RoomSession; update: RoomUpdate; onRestart: () => void }

// 'My initial position' in the Decision Room, written before talking to anyone. It locks once the
// discussion starts, so the review can compare it with the joint recommendation. Locked, it reads
// as plain text with a Locked badge (not as fields that ignore typing), and 'Start the room again'
// opens a fresh session to write a new one.
export function RoomPosition({ session, update, onRestart }: RoomPositionProps) {
  const position = session.initialPosition
  const locked = session.status !== 'in-progress' || session.messages.length > 0
  const edit = <K extends keyof Position>(key: K, value: Position[K]) =>
    update((s) => {
      s.initialPosition[key] = value
    })

  return (
    <section className="card jr-room-card" aria-labelledby="jr-position-title">
      <div className="jr-room-position__head">
        <h2 id="jr-position-title" className="title title--sm jr-room-card__title">
          My initial position
        </h2>
        {locked && <span className="badge badge--neutral">Locked</span>}
      </div>
      <p className="jr-room-card__text">
        {locked
          ? 'Written before the discussion started, so your Team Lead can compare it with the plan you agree.'
          : 'Write all three before you talk to anyone. It locks when the discussion starts.'}
      </p>

      {locked ? (
        <dl className="jr-room-position__values">
          <div>
            <dt className="field__label">What would you recommend now?</dt>
            <dd>{position.recommendation.trim() || 'Not written'}</dd>
          </div>
          <div>
            <dt className="field__label">Confidence</dt>
            <dd>{position.confidence ? CONFIDENCE_LABELS[position.confidence] : 'Not set'}</dd>
          </div>
          <div>
            <dt className="field__label">Why</dt>
            <dd>{position.reason.trim() || 'Not written'}</dd>
          </div>
        </dl>
      ) : (
        <>
          <div className="jr-room-grid">
            <div className="field jr-room-field">
              <label className="field__label" htmlFor="jr-room-rec">
                What would you recommend now?
              </label>
              <textarea
                id="jr-room-rec"
                className="textarea jr-line"
                rows={1}
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
                readOnly={false}
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
              value={position.reason}
              onChange={(e) => edit('reason', e.target.value)}
            />
          </div>
        </>
      )}

      {locked && (
        <div className="jr-room-position__restart">
          <button type="button" className="btn btn--secondary btn--sm" onClick={onRestart}>
            Start the room again
          </button>
          <p className="jr-room-position__note">Sets this discussion aside and opens a new one, starting from your initial position.</p>
        </div>
      )}
    </section>
  )
}
