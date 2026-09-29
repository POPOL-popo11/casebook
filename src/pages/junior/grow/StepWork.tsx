import type { WorkReview } from '../../../contracts/records'
import { DemoData } from './demo'
import { fillExample, type Edit } from './workReview'
import '../fields.css'

type Work = WorkReview['work']
type TextKey = 'role' | 'developmentGoal' | 'context' | 'aiOutput' | 'finalVersion'

const OUTCOMES: { id: Work['outcome']; label: string }[] = [
  { id: 'shipped', label: 'Shipped' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'outcome-pending', label: 'Outcome pending' },
]

// A. Review my work: the learner pastes their own work, or loads the fictional example.
export function StepWork({ review, edit }: { review: WorkReview; edit: Edit }) {
  const { work } = review
  const set = (key: TextKey) => (e: { target: { value: string } }) => edit((r) => void (r.work[key] = e.target.value))

  function loadExample() {
    edit((r) => fillExample(r))
  }

  return (
    <section className="card wg-card" aria-labelledby="wg-work-title">
      <div className="wg-card__head">
        <h2 id="wg-work-title" className="title title--sm" tabIndex={-1}>
          Review my work
        </h2>
        <div className="wg-card__tools">
          {work.loadedExample && <DemoData />}
          <button type="button" className="btn btn--secondary btn--sm" onClick={loadExample}>
            Load example
          </button>
        </div>
      </div>
      <p className="wg-card__lead">Paste a piece of your own work, or load the fictional example. Remove client names and pricing first.</p>
      <div className="wg-grid">
        <label className="field">
          <span className="field__label">My role</span>
          <textarea className="textarea jr-line" rows={1} value={work.role} onChange={set('role')} placeholder="e.g. Solutions consultant" />
        </label>
        <label className="field">
          <span className="field__label">My development goal</span>
          <textarea className="textarea jr-line" rows={1} value={work.developmentGoal} onChange={set('developmentGoal')} placeholder="What you are working towards" />
        </label>
        <label className="field wg-grid__wide">
          <span className="field__label">The task</span>
          <textarea className="textarea jr-grow" rows={3} value={work.context} onChange={set('context')} placeholder="What you were asked to do, and for whom" />
        </label>
        <label className="field">
          <span className="field__label">AI draft</span>
          <textarea className="textarea jr-grow" rows={5} value={work.aiOutput} onChange={set('aiOutput')} placeholder="Paste the draft, if you used one" />
        </label>
        <label className="field">
          <span className="field__label">What I sent</span>
          <textarea className="textarea jr-grow" rows={5} value={work.finalVersion} onChange={set('finalVersion')} placeholder="Paste your final version" />
        </label>
        <div className="field wg-grid__wide">
          <span className="field__label" id="wg-outcome">
            Outcome so far
          </span>
          <div className="segmented wg-segmented" role="group" aria-labelledby="wg-outcome">
            {OUTCOMES.map((o) => (
              <button
                key={o.id}
                type="button"
                className="segmented__item"
                aria-pressed={work.outcome === o.id}
                onClick={() => edit((r) => void (r.work.outcome = o.id))}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
