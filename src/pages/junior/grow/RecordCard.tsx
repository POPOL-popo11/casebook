import type { GrowthRecord, Store } from '../../../contracts/records'
import { DemoData } from './demo'
import { formatDate, KIND_DOTS, KIND_LABELS, levelLabel, openRef, OUTCOME_LABELS, PROMPTING_LABELS, recordTitle, refLink, skillLabel } from './growContent'

type RecordCardProps = {
  record: GrowthRecord
  refs: Pick<Store, 'attempts' | 'rooms' | 'growth'>
  selected: boolean
  onToggle: () => void
}

// One growth record on My Growth: its source, the evidence, and the honest state of the result.
export function RecordCard({ record, refs, selected, onToggle }: RecordCardProps) {
  const titleId = `mg-record-${record.id}`
  const links = record.links.filter((ref, i, all) => all.findIndex((r) => r.kind === ref.kind && r.id === ref.id) === i)
  // A Work & Grow record is titled by its first clause; its full situation opens the facts.
  const title = recordTitle(record)
  const situationRow = title.trim() !== record.situation.trim()

  return (
    <article className="card mg-record" aria-labelledby={titleId} data-selected={selected}>
      <header className="mg-record__head">
        <span className="badge badge--neutral gr-kind">
          <span className={`dot ${KIND_DOTS[record.kind]}`} aria-hidden="true" />
          {KIND_LABELS[record.kind]}
        </span>
        {record.source === 'demo' && <DemoData />}
        <span className="mg-record__date">{formatDate(record.date)}</span>
        <label className="mg-select">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            aria-label={`Select to share: ${title || 'Untitled record'}, ${formatDate(record.date)}`}
          />
          Select to share
        </label>
      </header>
      <p className="eyebrow eyebrow--sm mg-record__skill">{skillLabel(record.skillId)}</p>
      <h3 id={titleId} className="title title--sm mg-record__title">
        {title}
      </h3>
      <dl className="mg-facts">
        {situationRow && (
          <div className="mg-facts__row">
            <dt>Situation</dt>
            <dd>{record.situation}</dd>
          </div>
        )}
        <div className="mg-facts__row">
          <dt>What I did</dt>
          <dd>{record.contribution || 'Not recorded'}</dd>
        </div>
        <div className="mg-facts__row">
          <dt>Evidence</dt>
          <dd>
            {record.evidence.length === 0 ? (
              'None recorded'
            ) : (
              <ul className="mg-evidence">
                {record.evidence.map((item, i) => (
                  <li key={i}>
                    {item.text}
                    {item.ref && !links.some((l) => l.kind === item.ref?.kind && l.id === item.ref?.id) && (
                      <>
                        {' '}
                        <a className="link mg-evidence__link" href={refLink(item.ref, refs).href} onClick={() => item.ref && openRef(item.ref)}>
                          {refLink(item.ref, refs).label}
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
        <div className="mg-facts__row">
          <dt>What I learned</dt>
          <dd>{record.learning || 'Not recorded'}</dd>
        </div>
        <div className="mg-facts__row">
          <dt>Next step</dt>
          <dd>{record.nextStep || 'Not set'}</dd>
        </div>
      </dl>
      <dl className="mg-meta">
        <div>
          <dt>Prompting needed</dt>
          <dd>{PROMPTING_LABELS[record.prompting]}</dd>
        </div>
        <div>
          <dt>Evidence shows</dt>
          <dd>{levelLabel(record.level)}</dd>
        </div>
        <div>
          <dt>Outcome</dt>
          <dd>{OUTCOME_LABELS[record.outcome]}</dd>
        </div>
      </dl>
      {links.length > 0 && (
        <p className="mg-links">
          From:{' '}
          {links.map((ref, i) => (
            <span key={`${ref.kind}-${ref.id}`}>
              {i > 0 && ', '}
              <a className="link" href={refLink(ref, refs).href} onClick={() => openRef(ref)}>
                {refLink(ref, refs).label}
              </a>
            </span>
          ))}
        </p>
      )}
      {record.privateNote.trim() !== '' && (
        <p className="mg-private">
          <strong>Private note, never shared:</strong> {record.privateNote}
        </p>
      )}
    </article>
  )
}
