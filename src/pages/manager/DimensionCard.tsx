import type { DIMENSIONS } from '../../contracts/types'
import { DemoTag } from '../../components/DemoTag'
import type { CriterionResult } from '../../lib/assessment'
import type { AnswerItem } from './attemptAnswers'
import './Review.css'

// Labelled answers in full, as the learner wrote them.
export function AnswerList({ items }: { items: AnswerItem[] }) {
  return (
    <dl className="rv-answers">
      {items.map((item, i) => (
        <div key={i} className="rv-answers__row">
          <dt>{item.label}</dt>
          <dd>{item.text}</dd>
        </div>
      ))}
    </dl>
  )
}

type DimensionCardProps = {
  dimension: (typeof DIMENSIONS)[number]
  results: CriterionResult[] // the case's criteria for this dimension, assessed
  answersFor: (result: CriterionResult) => AnswerItem[]
  answers: AnswerItem[] // everything the learner wrote that bears on this dimension
}

// One of the five dimensions on an attempt's review. Every check and every answer opens to the
// raw text, so the Team Lead judges from what was written, not from the app's check alone.
export function DimensionCard({ dimension, results, answersFor, answers }: DimensionCardProps) {
  const titleId = `rv-dim-${dimension.id}`
  return (
    <section className="card rv-card" aria-labelledby={titleId}>
      <h2 id={titleId} className="title title--sm rv-card__title">
        {dimension.label}
      </h2>
      <p className="rv-card__lead">{dimension.lookFor}</p>

      {results.length > 0 && (
        <>
          {/* Computed by the app from the case's preset criteria, as on the learner's Reflect. */}
          <div className="rv-card__label rv-card__label--tagged">
            <p className="field__label">The case’s checks</p>
            <DemoTag kind="response" />
          </div>
          <ul className="rv-list">
            {results.map((result) => (
              <li key={result.criterion.id}>
                <details className="rv-item">
                  <summary className="rv-item__summary">
                    <span className={`badge ${result.met ? 'badge--accent' : 'badge--neutral'}`}>
                      {result.met ? 'Met' : 'Not yet'}
                    </span>
                    <span className="rv-item__text">{result.criterion.label}</span>
                  </summary>
                  <div className="rv-item__body">
                    {result.criterion.lookFor && <p className="rv-item__look">{result.criterion.lookFor}</p>}
                    <AnswerList items={answersFor(result)} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="field__label rv-card__label">What they wrote</p>
      {answers.length === 0 ? (
        <p className="rv-card__none">Nothing written for this part.</p>
      ) : (
        <ul className="rv-list">
          {answers.map((answer, i) => (
            <li key={i}>
              <details className="rv-item">
                <summary className="rv-item__summary">
                  <span className="rv-item__label">{answer.label}</span>
                  <span className="rv-item__preview">{answer.text}</span>
                </summary>
                <p className="rv-item__full">{answer.text}</p>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
