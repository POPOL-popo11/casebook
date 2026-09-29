import { useState } from 'react'
import type { CaseContent } from '../../contracts/types'
import { IconLock } from '../../components/icons'

// 02 · Decision: the options the senior had, which one they chose, why, and what happened.
export function DecisionCard({ content }: { content: CaseContent }) {
  const [call, setCall] = useState(content.senior.decision)

  return (
    <section className="card share__card" aria-labelledby="share-decision">
      <h2 id="share-decision" className="title title--sm share__card-title">
        Decision
      </h2>
      <div className="share__options" role="group" aria-label="Options">
        {content.options.map((option) => {
          const chosen = option.id === call
          return (
            <button
              key={option.id}
              type="button"
              className="option share__option"
              aria-pressed={chosen}
              onClick={() => setCall(option.id)}
            >
              <span className="option__letter">{option.id}</span>
              <span className="share__option-label">{option.label}</span>
              {chosen && <span className="share__your-call">Your call</span>}
            </button>
          )
        })}
      </div>
      <div className="field share__why">
        <label className="field__label" htmlFor="share-why">
          Why
        </label>
        <textarea
          id="share-why"
          className="textarea share__textarea"
          rows={2}
          defaultValue={content.senior.why}
        />
      </div>
      <div className="field">
        <div className="share__label-row">
          <label className="field__label" htmlFor="share-outcome">
            Outcome
          </label>
          <span className="share__hint">
            <IconLock />
            Shown after they decide
          </span>
        </div>
        <textarea
          id="share-outcome"
          className="textarea share__textarea"
          rows={2}
          defaultValue={content.outcome}
        />
      </div>
    </section>
  )
}
