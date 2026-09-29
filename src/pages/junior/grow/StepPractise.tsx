import type { WorkReview } from '../../../contracts/records'
import { DemoResponse } from './demo'
import { WORK_GROW } from './growContent'
import { feedbackFor, type Edit } from './workReview'
import '../fields.css'

// D. Practise & apply: a challenge with a changed condition, preset feedback, a revision and a
// next action for real work.
export function StepPractise({ review, edit }: { review: WorkReview; edit: Edit }) {
  const { practise } = review
  const { challenge } = WORK_GROW

  function getFeedback() {
    edit((r) => void (r.practise.feedback = feedbackFor(r.practise.answer)))
  }

  return (
    <div className="wg-pair wg-pair--aside">
      <section className="card wg-card" aria-labelledby="wg-challenge-title">
        <div className="wg-card__head">
          <p className="eyebrow">Practice challenge</p>
          <DemoResponse />
        </div>
        <h2 id="wg-challenge-title" className="title title--md wg-focus__title" tabIndex={-1}>
          {challenge.title}
        </h2>
        <div className="callout callout--warn wg-callout">
          <p>
            <strong>What is different this time:</strong> {challenge.changedCondition}
          </p>
        </div>
        <label className="field wg-stack__item">
          <span className="field__label">{challenge.prompt}</span>
          <textarea
            className="textarea jr-grow"
            rows={4}
            value={practise.answer}
            placeholder="Your answer"
            onChange={(e) => edit((r) => void (r.practise.answer = e.target.value))}
          />
        </label>
        <div className="wg-card__foot">
          <button type="button" className="btn btn--secondary btn--sm" disabled={!practise.answer.trim()} onClick={getFeedback}>
            {practise.feedback ? 'Get feedback again' : 'Get feedback'}
          </button>
        </div>
        {practise.feedback && (
          <>
            <div className="wg-feedback" role="status">
              <div className="wg-card__head">
                <p className="field__label">Feedback</p>
                <DemoResponse />
              </div>
              <p>{practise.feedback}</p>
            </div>
            <label className="field wg-stack__item">
              <span className="field__label">Revise my answer</span>
              <textarea
                className="textarea jr-grow"
                rows={4}
                value={practise.revision}
                placeholder="Your answer, revised with the feedback"
                onChange={(e) => edit((r) => void (r.practise.revision = e.target.value))}
              />
            </label>
          </>
        )}
      </section>
      <section className="card wg-card" aria-labelledby="wg-action-title">
        <h2 id="wg-action-title" className="title title--sm">
          Apply it at work
        </h2>
        <p className="wg-card__lead">One thing you will do differently in your real work.</p>
        <label className="field wg-stack__item">
          <span className="field__label">My next action</span>
          <textarea
            className="textarea jr-grow"
            rows={3}
            value={practise.nextAction}
            placeholder="What, and by when"
            onChange={(e) => edit((r) => void (r.practise.nextAction = e.target.value))}
          />
        </label>
        {WORK_GROW.nextActionExamples.length > 0 && (
          <div className="wg-examples">
            <div className="wg-card__head">
              <p className="field__label">Examples</p>
              <DemoResponse />
            </div>
            <ul className="wg-examples__list">
              {WORK_GROW.nextActionExamples.map((example) => (
                <li key={example}>
                  <button type="button" className="chip chip--outline wg-example" onClick={() => edit((r) => void (r.practise.nextAction = example))}>
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
