import { useState } from 'react'
import type { WorkReview } from '../../../contracts/records'
import { DemoResponse } from './demo'
import { WORK_GROW } from './growContent'
import { questionsToAsk, type Edit } from './workReview'
import '../fields.css'

type TextKey = 'changed' | 'verified' | 'uncertain'

const PROMPTS: { key: TextKey; label: string; hint: string }[] = [
  { key: 'changed', label: 'What I changed', hint: 'What you changed from the draft, and why' },
  { key: 'verified', label: 'What I checked', hint: 'Facts you confirmed, and with whom' },
  { key: 'uncertain', label: "What I'm still unsure about", hint: 'What you could not confirm yet' },
]

// B. Understand my reasoning: the learner explains, then the app asks its preset questions,
// skipping any that the explanation already answers (askUnless).
export function StepReasoning({ review, edit }: { review: WorkReview; edit: Edit }) {
  const { reasoning } = review
  const [asked, setAsked] = useState(reasoning.clarifications.length > 0)
  const explained = PROMPTS.some((p) => reasoning[p.key].trim() !== '')
  const asking = WORK_GROW.clarifyingQuestions.filter((q) => reasoning.clarifications.some((c) => c.questionId === q.id))

  function ask() {
    const questions = questionsToAsk(reasoning)
    edit((r) => {
      r.reasoning.clarifications = questions.map((q) => ({
        questionId: q.id,
        question: q.text,
        answer: r.reasoning.clarifications.find((c) => c.questionId === q.id)?.answer ?? '',
      }))
    })
    setAsked(true)
  }

  function answer(questionId: string, text: string) {
    edit((r) => {
      const c = r.reasoning.clarifications.find((x) => x.questionId === questionId)
      if (c) c.answer = text
    })
  }

  return (
    <div className="wg-pair">
      <section className="card wg-card" aria-labelledby="wg-reasoning-title">
        <h2 id="wg-reasoning-title" className="title title--sm" tabIndex={-1}>
          Understand my reasoning
        </h2>
        <p className="wg-card__lead">Explain the choices behind your final version.</p>
        <div className="wg-stack">
          {PROMPTS.map((p) => (
            <label key={p.key} className="field">
              <span className="field__label">{p.label}</span>
              <textarea
                className="textarea jr-grow"
                rows={3}
                value={reasoning[p.key]}
                placeholder={p.hint}
                onChange={(e) => edit((r) => void (r.reasoning[p.key] = e.target.value))}
              />
            </label>
          ))}
        </div>
        <div className="wg-card__foot">
          <button type="button" className="btn btn--secondary btn--sm" disabled={!explained} onClick={ask}>
            {asked ? 'Ask me again' : 'Ask me questions'}
          </button>
        </div>
      </section>
      {asked ? (
        <section className="card wg-card" aria-labelledby="wg-questions-title">
          <div className="wg-card__head">
            <h2 id="wg-questions-title" className="title title--sm">
              Questions from Casebook
            </h2>
            <DemoResponse />
          </div>
          {asking.length === 0 ? (
            <p className="wg-card__lead">Your explanation already answers Casebook's questions.</p>
          ) : (
            <>
              <p className="wg-card__lead">Answer the ones that help. They are hints, not a test.</p>
              <ol className="wg-questions">
                {asking.map((q, i) => (
                  <li key={q.id} className="wg-question">
                    <label className="field">
                      <span className="field__label">
                        {i + 1}. {q.text}
                      </span>
                      <span className="wg-note">Why we ask: {q.why}</span>
                      <textarea
                        className="textarea jr-grow"
                        rows={2}
                        value={reasoning.clarifications.find((c) => c.questionId === q.id)?.answer ?? ''}
                        placeholder="Your answer"
                        onChange={(e) => answer(q.id, e.target.value)}
                      />
                    </label>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>
      ) : (
        <section className="card card--dashed wg-card wg-card--waiting">
          <p className="wg-note">Casebook asks its questions after you explain your choices.</p>
        </section>
      )}
    </div>
  )
}
