import { Fragment } from 'react'
import type { EvidenceColumn } from '../../contracts/types'
import { caseByline, getPerson, getSummary, LANDING_FEATURE } from '../../lib/catalog'

const STEPS = ['Define', 'Examine', 'Investigate', 'Decide']

// Each evidence column's legend dot, as on Examine.
const DOTS: Record<EvidenceColumn, string> = {
  verified: 'dot--accent',
  'needs-checking': 'dot--ring',
  assumption: 'dot--neutral',
  weak: 'dot--warn',
}

// 01 · the product preview beside the hero: a case card, the evidence sort and a manager's note,
// floating on a dotted panel. It illustrates the app, so it is hidden from assistive tech.
export function HeroCollage() {
  const { caseId, sortPreview, quote } = LANDING_FEATURE

  return (
    <div className="lp-collage" aria-hidden="true">
      <div className="card lp-collage__case">
        <p className="eyebrow lp-collage__team">{caseByline(caseId)}</p>
        <p className="title lp-collage__title">{getSummary(caseId).title}</p>
        <div className="lp-collage__steps">
          {STEPS.map((step, index) => (
            <span key={step} className="lp-collage__step" data-done={index < 2}>
              {step}
            </span>
          ))}
        </div>
      </div>

      <div className="card lp-collage__sort">
        <p className="eyebrow lp-collage__sort-label">Sort what you know</p>
        <ul className="lp-collage__facts">
          {sortPreview.map((fact) => (
            <li key={fact.text}>
              <span className={`dot ${DOTS[fact.column]}`} />
              {fact.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="card card--dark lp-collage__note">
        <span className="avatar avatar--accent lp-collage__avatar">{getPerson(quote.fromId).initials}</span>
        <p className="title lp-collage__quote">
          {quote.text.split('\n').map((line, index) => (
            <Fragment key={index}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  )
}
