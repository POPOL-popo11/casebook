import type { PracticeAttempt } from '../../contracts/records'
import type { CaseContent } from '../../contracts/types'
import { caseAuthor, firstName } from '../../lib/content'
import { blankDecide } from './practice'
import { callText, editVariant } from './reflect'
import { ReflectGrowth } from './ReflectGrowth'
import './fields.css'

type ReflectAsideProps = { content: CaseContent; attempt: PracticeAttempt }

// The right column on Reflect, shown only after submitting: the case author's own call, what
// happened in the real case, the changed-condition challenge, and the growth record.
export function ReflectAside({ content, attempt }: ReflectAsideProps) {
  const author = firstName(caseAuthor(content.id))
  const senior = { ...blankDecide(), optionId: content.senior.decision }
  const alternatives = content.assessment?.acceptableAlternatives ?? []
  const variant = content.variant

  return (
    <aside className="jr-reflect__aside">
      <section className="card jr-side" aria-labelledby="jr-senior-title">
        <h2 id="jr-senior-title" className="title title--sm jr-reflect__cardtitle">
          {author}’s call
        </h2>
        <p className="jr-side__call">{callText(content, senior)}</p>
        <p className="jr-side__text">{content.senior.why}</p>
        {alternatives.length > 0 && (
          <>
            <p className="jr-side__label">Other sound plans</p>
            <ul className="jr-side__list">
              {alternatives.map((plan) => (
                <li key={plan}>{plan}</li>
              ))}
            </ul>
          </>
        )}
      </section>
      <section className="card jr-side" aria-labelledby="jr-outcome-title">
        <h2 id="jr-outcome-title" className="title title--sm jr-reflect__cardtitle">
          What happened
        </h2>
        <p className="jr-side__text">{content.outcome}</p>
        <p className="jr-side__note">A good or bad outcome is separate from the quality of the decision at the time.</p>
      </section>
      {variant && (
        <section className="card jr-side" aria-labelledby="jr-variant-title">
          <p className="eyebrow eyebrow--sm jr-side__eyebrow">What if</p>
          <h2 id="jr-variant-title" className="title title--sm jr-reflect__cardtitle">
            {variant.title}
          </h2>
          <p className="callout callout--warn jr-side__fact">{variant.changedFact}</p>
          <div className="field jr-side__field">
            <label className="field__label" htmlFor="jr-variant-answer">
              What would you change in your plan, and why?
            </label>
            <textarea
              id="jr-variant-answer"
              className="textarea jr-grow"
              rows={4}
              value={attempt.variant?.answer ?? ''}
              onChange={(e) => editVariant(content.id, e.target.value)}
            />
          </div>
        </section>
      )}
      <ReflectGrowth recordId={attempt.growthRecordId} />
    </aside>
  )
}
