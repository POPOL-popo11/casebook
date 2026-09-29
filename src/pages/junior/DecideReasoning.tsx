import type { DecideAnswer } from '../../contracts/records'
import { ConfidencePicker } from './ConfidencePicker'
import './fields.css'

type DecideReasoningProps = {
  answer: DecideAnswer
  // Practice also asks who owns the next step and when to review; the example has neither.
  planFields: boolean
  readOnly: boolean
  onEdit: (recipe: (decide: DecideAnswer) => void) => void
}

// The reasoning card on Decide (08): why, the risk that remains, who owns it and when to review
// it, what would change the learner's mind, and how confident they are.
export function DecideReasoning({ answer, planFields, readOnly, onEdit }: DecideReasoningProps) {
  const text = (key: 'why' | 'mainRisk' | 'owner' | 'reviewBy' | 'changeMind') => ({
    readOnly,
    value: answer[key],
    onChange: (e: { target: { value: string } }) => {
      const value = e.target.value
      onEdit((decide) => {
        decide[key] = value
      })
    },
  })

  return (
    <section className="card jr-reasoning" aria-label="Your reasoning">
      <div className="field jr-reasoning__field">
        <label className="field__label" htmlFor="jr-why">
          Why
        </label>
        <textarea id="jr-why" className="textarea jr-reasoning__why" rows={2} {...text('why')} />
      </div>
      <div className="field jr-reasoning__field">
        <label className="field__label" htmlFor="jr-risk">
          Remaining risk
        </label>
        <textarea id="jr-risk" className="textarea jr-line" rows={1} {...text('mainRisk')} />
      </div>
      {planFields && (
        <div className="jr-reasoning__field jr-reasoning__pair">
          <div className="field">
            <label className="field__label" htmlFor="jr-owner">
              Owner
            </label>
            <textarea id="jr-owner" className="textarea jr-line" rows={1} placeholder="Who owns the next step" {...text('owner')} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="jr-review">
              Review by
            </label>
            <textarea id="jr-review" className="textarea jr-line" rows={1} placeholder="When to check again" {...text('reviewBy')} />
          </div>
        </div>
      )}
      <div className="field jr-reasoning__field">
        <label className="field__label" htmlFor="jr-change">
          What would change my mind
        </label>
        <textarea id="jr-change" className="textarea jr-line" rows={1} {...text('changeMind')} />
      </div>
      <div className="field jr-reasoning__field">
        <span id="jr-confidence" className="field__label">
          Confidence
        </span>
        <ConfidencePicker
          className="jr-reasoning__confidence"
          value={answer.confidence}
          labelledBy="jr-confidence"
          readOnly={readOnly}
          onChange={(value) =>
            onEdit((decide) => {
              decide.confidence = value
            })
          }
        />
      </div>
    </section>
  )
}
