import { DemoTag } from '../../components/DemoTag'
import type { Feedback, PracticeAttempt } from '../../contracts/records'
import { DIMENSIONS, type CaseContent } from '../../contracts/types'
import { assessAttempt } from '../../lib/assessment'
import { getPerson } from '../../lib/content'
import { formatDate, levelLabel } from '../../lib/labels'

type ReflectFeedbackProps = {
  content: CaseContent
  // The attempt as it was at the version shown (attemptAtVersion).
  attempt: PracticeAttempt
  // The shown version is a revision whose call differs from the original's.
  changedCall: boolean
  feedback: Feedback[]
}

// Feedback on Reflect, first in the column: a one-line summary ('3 of 5 checks met'), the app's
// check of the shown version against the case's criteria, met or not yet, marked Demo response
// because it is preset; then any Team Lead feedback on the attempt.
export function ReflectFeedback({ content, attempt, changedCall, feedback }: ReflectFeedbackProps) {
  const results = assessAttempt(content, attempt)
  const met = results.filter((result) => result.met).length
  const summary = [
    results.length > 0 ? `${met} of ${results.length} checks met` : '',
    changedCall ? 'you changed your call after new facts' : '',
  ].filter(Boolean)
  const line = summary.join(', and ')

  return (
    <>
      {line && <p className="jr-reflect__summary">{line.charAt(0).toUpperCase() + line.slice(1)}.</p>}
      <section className="card jr-check" aria-labelledby="jr-check-title">
        <div className="jr-check__head">
          <h2 id="jr-check-title" className="title title--sm jr-reflect__cardtitle">
            Feedback on your reasoning
          </h2>
          <DemoTag kind="response" />
        </div>
        <p className="jr-check__intro">A preset check of what you wrote against this case’s criteria.</p>
        {results.length === 0 ? (
          <p className="jr-check__none">This case has no criteria to check against yet.</p>
        ) : (
          <ul className="jr-check__list">
            {results.map(({ criterion, met, text }) => (
              <li key={criterion.id} className="jr-check__item">
                <p className="jr-check__row">
                  <span className="jr-check__label">{criterion.label}</span>
                  <span className={met ? 'badge badge--accent' : 'badge badge--warn'}>{met ? 'Met' : 'Not yet'}</span>
                </p>
                <p className="jr-check__text">{text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      {feedback.map((item) => (
        <TeamLeadFeedback key={item.id} item={item} />
      ))}
    </>
  )
}

function TeamLeadFeedback({ item }: { item: Feedback }) {
  const from = getPerson(item.fromId)
  const parts: [string, string][] = [
    ['What went well', item.strength],
    ['Most important improvement', item.improvement],
    ['A question to think about', item.followUp],
  ]
  const dimension = (id: string) => DIMENSIONS.find((d) => d.id === id)?.label ?? id

  return (
    <section className="card jr-lead" aria-label={`Feedback from ${from.name}`}>
      <div className="jr-check__head">
        <p className="jr-lead__from">
          <span className="avatar avatar--accent" aria-hidden="true">
            {from.initials}
          </span>
          <span>
            <strong>{from.name}</strong> · {formatDate(item.at)}
            {item.version !== undefined && ` · on ${item.version === 0 ? 'the original' : `revision ${item.version}`}`}
          </span>
        </p>
        {item.source === 'demo' && <DemoTag kind="data" />}
      </div>
      <dl className="jr-lead__parts">
        {parts
          .filter(([, text]) => text.trim())
          .map(([label, text]) => (
            <div key={label} className="jr-lead__part">
              <dt>{label}</dt>
              <dd>{text}</dd>
            </div>
          ))}
      </dl>
      {item.dimensions && item.dimensions.length > 0 && (
        <ul className="jr-lead__dims">
          {item.dimensions.map((d) => (
            <li key={d.id} className="jr-lead__dim">
              <span>{dimension(d.id)}</span>
              <span className="badge badge--neutral">{levelLabel(d.level)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
