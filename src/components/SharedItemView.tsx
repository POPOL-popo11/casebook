import type { ReactNode } from 'react'
import type { SharedItem } from '../contracts/records'
import { skillLabel } from '../lib/catalog'
import { formatDate, GROWTH_KIND_DOTS, GROWTH_KIND_LABELS, OUTCOME_LABELS } from '../lib/labels'
import { isSeededGrowth } from '../lib/records'
import { DemoTag } from './DemoTag'
import './SharedItemView.css'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="shared-item__row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

// One shared growth record exactly as the Team Lead receives it: the frozen SharedItem copy,
// never the live record, so the learner's preview and Shared Growth always match. It has no
// private note to show. A copy of a seeded record carries Demo data, whoever shared it. The parent
// supplies the card or list around it. With a short title as the heading, the full situation
// comes first in the fields.
export function SharedItemView({ item }: { item: SharedItem }) {
  return (
    <article className="shared-item">
      <div className="shared-item__head">
        <p className="eyebrow eyebrow--sm shared-item__eyebrow">
          <span className={`dot ${GROWTH_KIND_DOTS[item.kind] ?? 'dot--neutral'}`} aria-hidden="true" />
          {GROWTH_KIND_LABELS[item.kind] ?? item.kind} · {formatDate(item.date)} · {skillLabel(item.skillId)}
        </p>
        {isSeededGrowth(item.recordId) && <DemoTag kind="data" />}
      </div>
      <h3 className="title title--sm shared-item__title">{item.title || item.situation || 'Untitled record'}</h3>
      <dl className="shared-item__fields">
        {item.title && item.title !== item.situation && <Row label="Situation">{item.situation}</Row>}
        <Row label="What I did">{item.contribution || 'Not recorded'}</Row>
        <Row label="Evidence">
          {item.evidence.length > 0 ? (
            <ul className="shared-item__evidence">
              {item.evidence.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          ) : (
            'None listed'
          )}
        </Row>
        <Row label="Outcome">{OUTCOME_LABELS[item.outcome] ?? item.outcome}</Row>
        <Row label="What I learned">{item.learning || 'Not recorded'}</Row>
        <Row label="Next step">{item.nextStep || 'Not set'}</Row>
      </dl>
    </article>
  )
}
