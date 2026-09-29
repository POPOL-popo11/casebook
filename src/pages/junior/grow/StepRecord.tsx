import type { GrowthRecord, WorkReview } from '../../../contracts/records'
import { EVIDENCE_LEVELS, type EvidenceLevel } from '../../../contracts/types'
import { setStore, useStore } from '../../../lib/records'
import { AutoTextarea } from './AutoTextarea'
import { KIND_DOTS, KIND_LABELS, OUTCOME_LABELS, PROMPTING_LABELS, skillLabel } from './growContent'
import '../fields.css'

const PROMPTING = Object.keys(PROMPTING_LABELS) as GrowthRecord['prompting'][]
// A workplace record is never 'practice-only'.
const OUTCOMES = (Object.keys(OUTCOME_LABELS) as GrowthRecord['outcome'][]).filter((o) => o !== 'practice-only')

// E. Growth record: the workplace record Work & Grow created, edited in place in My Growth's store.
export function StepRecord({ review }: { review: WorkReview }) {
  const growth = useStore((s) => s.growth)
  const record = growth.find((g) => g.id === review.growthRecordId)

  if (!record) {
    return (
      <section className="card card--dashed wg-card wg-card--waiting">
        <p className="wg-note">Finish step D to create the growth record.</p>
      </section>
    )
  }

  const edit = (recipe: (g: GrowthRecord) => void) =>
    setStore((draft) => {
      const g = draft.growth.find((x) => x.id === record.id)
      if (g) recipe(g)
    })

  return (
    <div className="wg-pair wg-pair--aside">
      <section className="card wg-card" aria-labelledby="wg-record-title">
        <div className="wg-card__head">
          <h2 id="wg-record-title" className="title title--sm" tabIndex={-1}>
            Growth record
          </h2>
          <span className="badge badge--neutral">
            <span className={`dot ${KIND_DOTS[record.kind]}`} aria-hidden="true" />
            {KIND_LABELS[record.kind]}
          </span>
        </div>
        <p className="wg-card__lead">
          Saved to My Growth. Changes save as you type. Focus: <strong>{review.focus.title}</strong> ({skillLabel(record.skillId)})
        </p>
        <div className="wg-stack">
          <label className="field">
            <span className="field__label">Situation</span>
            <AutoTextarea className="textarea" rows={2} value={record.situation} onChange={(e) => edit((g) => void (g.situation = e.target.value))} />
          </label>
          <label className="field">
            <span className="field__label">What I did myself</span>
            <AutoTextarea className="textarea" rows={3} value={record.contribution} onChange={(e) => edit((g) => void (g.contribution = e.target.value))} />
          </label>
          <fieldset className="field wg-fieldset">
            <legend className="field__label">Evidence</legend>
            {record.evidence.map((item, i) => (
              <div key={i} className="wg-evidence-row">
                <AutoTextarea
                  className="textarea"
                  rows={2}
                  aria-label={`Evidence ${i + 1}`}
                  value={item.text}
                  onChange={(e) => edit((g) => void (g.evidence[i].text = e.target.value))}
                />
                <button type="button" className="btn btn--link wg-remove" onClick={() => edit((g) => void g.evidence.splice(i, 1))}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn--link wg-add"
              onClick={() => edit((g) => void g.evidence.push({ text: '', ref: { kind: 'work', id: review.id } }))}
            >
              + Add evidence
            </button>
          </fieldset>
          <label className="field">
            <span className="field__label">What I learned</span>
            <AutoTextarea
              className="textarea"
              rows={3}
              value={record.learning}
              placeholder="What did this work teach you? Write it in your own words."
              onChange={(e) => edit((g) => void (g.learning = e.target.value))}
            />
          </label>
        </div>
      </section>
      <section className="card wg-card" aria-labelledby="wg-record-about">
        <div className="wg-card__head">
          <h2 id="wg-record-about" className="title title--sm">
            About this record
          </h2>
        </div>
        <div className="wg-stack">
          <div className="field">
            <span className="field__label" id="wg-prompting">
              Prompting I needed
            </span>
            <div className="segmented" role="group" aria-labelledby="wg-prompting">
              {PROMPTING.map((p) => (
                <button key={p} type="button" className="segmented__item" aria-pressed={record.prompting === p} onClick={() => edit((g) => void (g.prompting = p))}>
                  {PROMPTING_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
          <label className="field">
            <span className="field__label">What the evidence shows</span>
            <select className="select" value={record.level} onChange={(e) => edit((g) => void (g.level = e.target.value as EvidenceLevel))}>
              {EVIDENCE_LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Outcome</span>
            <select className="select" value={record.outcome} onChange={(e) => edit((g) => void (g.outcome = e.target.value as GrowthRecord['outcome']))}>
              {OUTCOMES.map((o) => (
                <option key={o} value={o}>
                  {OUTCOME_LABELS[o]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Next step</span>
            <AutoTextarea className="textarea" rows={2} value={record.nextStep} onChange={(e) => edit((g) => void (g.nextStep = e.target.value))} />
          </label>
          <label className="field">
            <span className="field__label">Private note</span>
            <span className="wg-note">Only you see this. It is never shared.</span>
            <textarea className="textarea jr-grow" rows={2} value={record.privateNote} onChange={(e) => edit((g) => void (g.privateNote = e.target.value))} />
          </label>
        </div>
      </section>
    </div>
  )
}
