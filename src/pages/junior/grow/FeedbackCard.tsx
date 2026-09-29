import type { Feedback, RecordRef, Store } from '../../../contracts/records'
import { casePageHref, DIMENSIONS, ROLE_LABELS, ROUTES } from '../../../contracts/types'
import { Arrow } from '../../../components/Arrow'
import { setStore } from '../../../lib/records'
import { DemoData } from './demo'
import { formatDate, levelLabel, openRef, personInitials, personName, refLink, skillLabel } from './growContent'
import '../fields.css'

type Refs = Pick<Store, 'attempts' | 'rooms' | 'growth'>

// Where the learner acts on the feedback: the reflect page to revise an attempt, and so on.
function actionLink(about: RecordRef, refs: Refs): { href: string; label: string } | null {
  switch (about.kind) {
    case 'attempt': {
      const attempt = refs.attempts.find((a) => a.id === about.id)
      return attempt ? { href: casePageHref(attempt.caseId, 'reflect'), label: 'Revise my answer' } : null
    }
    case 'room': {
      const room = refs.rooms.find((r) => r.id === about.id)
      return room ? { href: casePageHref(room.caseId, 'room'), label: 'Reopen the room' } : null
    }
    case 'work':
      return { href: ROUTES.juniorGrow, label: 'Open Work & Grow' }
    case 'growth':
    case 'share':
      return { href: ROUTES.juniorGrowth, label: 'Open My Growth' }
    default:
      return null
  }
}

const dimensionLabel = (id: string) => DIMENSIONS.find((d) => d.id === id)?.label ?? id

type FeedbackCardProps = { item: Feedback; isNew: boolean; refs: Refs }

// One piece of Team Lead feedback: what it answers, the three parts, and the learner's next action.
export function FeedbackCard({ item, isNew, refs }: FeedbackCardProps) {
  const about = refLink(item.about, refs)
  const act = actionLink(item.about, refs)
  const fieldId = `fb-next-${item.id}`

  // Written through to the store as the learner types.
  function setNextAction(text: string) {
    setStore((d) => {
      const f = d.feedback.find((x) => x.id === item.id)
      if (f) f.nextAction = text
    })
  }

  return (
    <article className="card fb-card" aria-label={`Feedback from ${personName(item.fromId)}, ${formatDate(item.at)}`}>
      <header className="fb-card__head">
        <span className="avatar avatar--accent" aria-hidden="true">
          {personInitials(item.fromId)}
        </span>
        <div className="fb-card__who">
          <p className="fb-card__from">
            {personName(item.fromId)} · {ROLE_LABELS.manager}
          </p>
          <p className="fb-card__date">{formatDate(item.at)}</p>
        </div>
        <div className="fb-card__tags">
          {isNew && <span className="badge badge--accent">New</span>}
          {item.source === 'demo' && <DemoData />}
        </div>
      </header>
      <p className="fb-card__about">
        About:{' '}
        <a className="link" href={about.href} onClick={() => openRef(item.about)}>
          {about.label}
        </a>
        {item.shareId && ' (shared with your Team Lead)'}
      </p>
      <div className="fb-card__parts">
        <div className="fb-part">
          <p className="field__label">Done well</p>
          <p>{item.strength}</p>
        </div>
        <div className="fb-part">
          <p className="field__label">Most important improvement</p>
          <p>{item.improvement}</p>
        </div>
        <div className="fb-part">
          <p className="field__label">A question to think about</p>
          <p>{item.followUp}</p>
        </div>
      </div>
      {item.focusSkillId && (
        <p className="fb-card__focus">
          Next focus: <span className="badge badge--accent">{skillLabel(item.focusSkillId)}</span>
        </p>
      )}
      {item.dimensions && item.dimensions.length > 0 && (
        <dl className="fb-dims">
          {item.dimensions.map((d) => (
            <div key={d.id} className="fb-dims__row">
              <dt>{dimensionLabel(d.id)}</dt>
              <dd>
                <span className="badge badge--neutral">{levelLabel(d.level)}</span>
                {d.note && <span className="fb-dims__note">{d.note}</span>}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <div className="fb-card__act">
        <label className="field fb-card__next" htmlFor={fieldId}>
          <span className="field__label">My next action</span>
          <textarea
            id={fieldId}
            className="textarea jr-line"
            rows={1}
            value={item.nextAction}
            placeholder="What you will do differently, and when"
            onChange={(e) => setNextAction(e.target.value)}
          />
        </label>
        <div className="fb-card__buttons">
          <span className="fb-card__saved" aria-live="polite">
            {item.nextAction.trim() ? 'Saved' : ''}
          </span>
          {act && (
            <a className="btn btn--secondary btn--sm" href={act.href} onClick={() => openRef(item.about)}>
              {act.label}
              <Arrow />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
