import type { Feedback, Store } from '../../../contracts/records'
import { ROLE_LABELS, ROUTES } from '../../../contracts/types'
import { DemoData } from './demo'
import { formatDate, KIND_DOTS, KIND_LABELS, openRef, personName, refLink, skillLabel } from './growContent'

type FeedbackEntryProps = { item: Feedback; refs: Pick<Store, 'attempts' | 'rooms' | 'growth'> }

// A 'Manager feedback' entry on My Growth. It comes from a Feedback record: nobody creates a
// growth record of kind 'manager'.
export function FeedbackEntry({ item, refs }: FeedbackEntryProps) {
  const titleId = `mg-feedback-${item.id}`
  const about = refLink(item.about, refs)

  return (
    <article className="card mg-record" aria-labelledby={titleId}>
      <header className="mg-record__head">
        <span className="badge badge--neutral gr-kind">
          <span className={`dot ${KIND_DOTS.manager}`} aria-hidden="true" />
          {KIND_LABELS.manager}
        </span>
        {item.source === 'demo' && <DemoData />}
        <span className="mg-record__date">{formatDate(item.at)}</span>
      </header>
      {item.focusSkillId && <p className="eyebrow eyebrow--sm mg-record__skill">Next focus: {skillLabel(item.focusSkillId)}</p>}
      <h3 id={titleId} className="title title--sm mg-record__title">
        {personName(item.fromId)} · {ROLE_LABELS.manager}
      </h3>
      <dl className="mg-facts">
        <div className="mg-facts__row">
          <dt>Done well</dt>
          <dd>{item.strength}</dd>
        </div>
        <div className="mg-facts__row">
          <dt>To improve</dt>
          <dd>{item.improvement}</dd>
        </div>
        <div className="mg-facts__row">
          <dt>My next action</dt>
          <dd>{item.nextAction || 'Not set yet'}</dd>
        </div>
      </dl>
      <p className="mg-links">
        About:{' '}
        <a className="link" href={about.href} onClick={() => openRef(item.about)}>
          {about.label}
        </a>
        {' · '}
        <a className="link" href={ROUTES.juniorFeedback}>
          Open in Feedback
        </a>
      </p>
    </article>
  )
}
