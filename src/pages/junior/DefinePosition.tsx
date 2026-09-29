import type { PracticeAttempt } from '../../contracts/records'
import { ConfidencePicker } from './ConfidencePicker'
import type { Practice } from './practice'
import './fields.css'

type Position = PracticeAttempt['define']['initialPosition']

// 'Your first position' on Define, under Frame the task: what the learner would recommend
// before looking further, why, how sure they are, and the question they most need answered.
// Reflect compares it with their final call. The example shows its own when it has one.
export function DefinePosition({ practice }: { practice: Practice }) {
  const { mode, example, attempt, readOnly, update } = practice
  const position: Position | undefined =
    mode === 'example' ? example?.initialPosition : attempt.define.initialPosition
  if (!position) return null

  const edit = <K extends keyof Position>(key: K, value: Position[K]) =>
    update((a) => {
      a.define.initialPosition[key] = value
    })

  return (
    <section className="card jr-frame jr-position" aria-labelledby="jr-position-title">
      <h2 id="jr-position-title" className="title title--sm jr-frame__title">
        Your first position
      </h2>
      <p className="jr-position__hint">Before you look further. You’ll compare it with your final call.</p>
      <div className="field jr-frame__field">
        <label className="field__label" htmlFor="jr-position-rec">
          What would you recommend now?
        </label>
        <textarea
          id="jr-position-rec"
          className="textarea jr-line"
          rows={1}
          readOnly={readOnly}
          value={position.recommendation}
          onChange={(e) => edit('recommendation', e.target.value)}
        />
      </div>
      <div className="field jr-frame__field">
        <label className="field__label" htmlFor="jr-position-reason">
          Why
        </label>
        <textarea
          id="jr-position-reason"
          className="textarea jr-line"
          rows={1}
          readOnly={readOnly}
          value={position.reason}
          onChange={(e) => edit('reason', e.target.value)}
        />
      </div>
      <div className="jr-frame__pair jr-position__pair">
        <div className="field jr-frame__field">
          <span id="jr-position-confidence" className="field__label">
            Confidence
          </span>
          <ConfidencePicker
            className="jr-position__confidence"
            value={position.confidence}
            labelledBy="jr-position-confidence"
            readOnly={readOnly}
            onChange={(value) => edit('confidence', value)}
          />
        </div>
        <div className="field jr-frame__field">
          <label className="field__label" htmlFor="jr-position-question">
            What I most need to find out
          </label>
          <textarea
            id="jr-position-question"
            className="textarea jr-line"
            rows={1}
            readOnly={readOnly}
            value={position.question}
            onChange={(e) => edit('question', e.target.value)}
          />
        </div>
      </div>
    </section>
  )
}
