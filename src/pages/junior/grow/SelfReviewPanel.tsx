import { useState } from 'react'
import type { Feedback, GrowthRecord } from '../../../contracts/records'
import { newId, setStore, useStore } from '../../../lib/records'
import { formatDate, KIND_DOTS, KIND_LABELS, LEARNER_ID, nowIso, personName, recordTitle, skillLabel } from './growContent'
import { buildSections } from './selfReview'
import { SelfReviewDraft } from './SelfReviewDraft'
import './SelfReview.css'

// The local calendar day of an ISO time, 'YYYY-MM-DD', as a date input shows it.
function day(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// The performance-review draft: choose a date range and records, then build the four sections.
export function SelfReviewPanel({ records, feedback }: { records: GrowthRecord[]; feedback: Feedback[] }) {
  const selfReviews = useStore((s) => s.selfReviews)
  const latest = selfReviews.filter((sr) => sr.learnerId === LEARNER_ID).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]

  const days = [...records.map((r) => day(r.date)), ...feedback.map((f) => day(f.at))].sort()
  const today = day(nowIso())
  const [from, setFrom] = useState(() => (latest ? day(latest.from) : (days[0] ?? today)))
  const [to, setTo] = useState(() => (latest ? day(latest.to) : [today, days.at(-1) ?? today].sort()[1]))
  // Records the learner unticked. With a saved draft, the boxes start as that draft left them:
  // everything in its range that it did not use starts unticked, unless it is newer than the draft.
  const [left, setLeft] = useState<string[]>(() => {
    if (!latest) return []
    const [start, end] = [day(latest.from), day(latest.to)]
    const drafted = new Date(latest.updatedAt).getTime()
    const leftOut = (iso: string) => day(iso) >= start && day(iso) <= end && !(new Date(iso).getTime() > drafted)
    const ids = [...records.filter((r) => leftOut(r.date)).map((r) => r.id), ...feedback.filter((f) => leftOut(f.at)).map((f) => f.id)]
    return ids.filter((id) => !latest.recordIds.includes(id))
  })

  const within = (iso: string) => day(iso) >= from && day(iso) <= to
  const inRange = records.filter((r) => within(r.date))
  const notesInRange = feedback.filter((f) => within(f.at))
  const chosen = inRange.filter((r) => !left.includes(r.id))
  const chosenNotes = notesInRange.filter((f) => !left.includes(f.id))
  const count = chosen.length + chosenNotes.length

  function toggle(id: string) {
    setLeft((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  function build() {
    const now = nowIso()
    setStore((draft) => {
      draft.selfReviews.push({
        id: newId('sr'),
        learnerId: LEARNER_ID,
        createdAt: now,
        updatedAt: now,
        from: new Date(`${from}T00:00:00`).toISOString(),
        to: new Date(`${to}T23:59:59`).toISOString(),
        recordIds: [...chosen.map((r) => r.id), ...chosenNotes.map((f) => f.id)],
        sections: buildSections(chosen, chosenNotes),
      })
    })
  }

  return (
    <section className="card mg-review" aria-labelledby="mg-review-title">
      <h2 id="mg-review-title" className="title title--md">
        Performance review draft
      </h2>
      <p className="mg-review__lead">
        Choose a date range and the records to use. Casebook sorts them into Contributions, Growth, Challenges and Next goals, and names the
        records behind every line. It adds nothing the records don't say.
      </p>
      <div className="mg-review__controls">
        <div className="mg-review__range">
          <label className="field">
            <span className="field__label">From</span>
            <input type="date" className="input" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="field">
            <span className="field__label">To</span>
            <input type="date" className="input" value={to} min={from} onChange={(e) => setTo(e.target.value)} />
          </label>
        </div>
        <fieldset className="mg-review__records">
          <legend className="field__label">Records in this range</legend>
          {inRange.length + notesInRange.length === 0 ? (
            <p className="mg-review__none">No records in this range.</p>
          ) : (
            <ul className="mg-review__list">
              {inRange.map((r) => (
                <li key={r.id}>
                  <label className="mg-review__record">
                    <input type="checkbox" checked={!left.includes(r.id)} onChange={() => toggle(r.id)} />
                    <span className={`dot ${KIND_DOTS[r.kind]}`} aria-hidden="true" />
                    <span className="mg-review__record-text">
                      <span>
                        <strong>{skillLabel(r.skillId)}</strong> · {KIND_LABELS[r.kind]} · {formatDate(r.date)}
                      </span>
                      <span className="mg-review__situation" title={r.situation}>
                        {recordTitle(r)}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
              {notesInRange.map((f) => (
                <li key={f.id}>
                  <label className="mg-review__record">
                    <input type="checkbox" checked={!left.includes(f.id)} onChange={() => toggle(f.id)} />
                    <span className={`dot ${KIND_DOTS.manager}`} aria-hidden="true" />
                    <span className="mg-review__record-text">
                      <span>
                        <strong>{personName(f.fromId)}</strong> · {KIND_LABELS.manager} · {formatDate(f.at)}
                      </span>
                      <span className="mg-review__situation" title={f.improvement}>
                        {f.improvement}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </fieldset>
        <div className="mg-review__build">
          <button type="button" className="btn btn--primary" disabled={count === 0} onClick={build}>
            {latest ? 'Build a new draft' : 'Build draft'}
          </button>
          <span className="mg-review__count">
            {count} source{count === 1 ? '' : 's'} chosen
          </span>
        </div>
      </div>
      {latest && <SelfReviewDraft key={latest.id} review={latest} records={records} feedback={feedback} />}
    </section>
  )
}
