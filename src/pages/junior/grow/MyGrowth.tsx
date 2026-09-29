import { useState } from 'react'
import type { Feedback, GrowthKind, GrowthRecord } from '../../../contracts/records'
import { ROUTES } from '../../../contracts/types'
import { Page } from '../../../components/Page'
import { useStore } from '../../../lib/records'
import { FeedbackEntry } from './FeedbackEntry'
import { KIND_LABELS, LEARNER_ID } from './growContent'
import { promptingTrends } from './growthTrends'
import { RecordCard } from './RecordCard'
import { SelfReviewPanel } from './SelfReviewPanel'
import { SharePanel } from './SharePanel'
import './grow.css'
import './MyGrowth.css'

type Filter = GrowthKind | 'all'
const FILTERS: Filter[] = ['all', 'practice', 'workplace', 'manager']

// One row of the list: a growth record, or a piece of Team Lead feedback ('Manager feedback').
type Entry = { kind: GrowthKind; date: string; record?: GrowthRecord; note?: Feedback }

// My Growth (#/junior/growth): the learner's records with their sources, sharing, and the
// performance-review draft.
export function MyGrowth() {
  const growth = useStore((s) => s.growth)
  const feedback = useStore((s) => s.feedback)
  const attempts = useStore((s) => s.attempts)
  const rooms = useStore((s) => s.rooms)
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<string[]>([])

  const records = growth.filter((r) => r.learnerId === LEARNER_ID && r.kind !== 'manager')
  const notes = feedback.filter((f) => f.toId === LEARNER_ID)
  const entries: Entry[] = [
    ...records.map((record) => ({ kind: record.kind, date: record.date, record })),
    ...notes.map((note) => ({ kind: 'manager' as const, date: note.at, note })),
  ].sort((a, b) => b.date.localeCompare(a.date))
  const shown = filter === 'all' ? entries : entries.filter((e) => e.kind === filter)
  const chosen = records.filter((r) => selected.includes(r.id))
  const refs = { attempts, rooms, growth }
  const trends = promptingTrends(records)

  function toggle(id: string) {
    setSelected((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  return (
    <Page className="mg gr-page" title="My Growth" subtitle="Practice, workplace evidence and feedback in one place. You choose what to share.">
      {trends.length > 0 && (
        <ul className="mg-trends" aria-label="How the prompting you needed changed">
          {trends.map((t) => (
            <li key={t.skillId}>{t.text}</li>
          ))}
        </ul>
      )}
      <div className="mg__grid">
        <section className="mg__records" aria-labelledby="mg-records-title">
          <div className="mg__records-head">
            <h2 id="mg-records-title" className="title title--md">
              Records
            </h2>
            <div className="mg-filters" role="group" aria-label="Show records">
              {FILTERS.map((f) => (
                <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : KIND_LABELS[f]}
                </button>
              ))}
            </div>
          </div>
          {entries.length === 0 ? (
            <div className="card gr-empty">
              <p>No growth records yet. Finish a practice case or review a piece of your work to add one.</p>
              <a className="btn btn--secondary btn--sm" href={ROUTES.juniorGrow}>
                Open Work & Grow
              </a>
            </div>
          ) : shown.length === 0 ? (
            <div className="card gr-empty">
              <p>Nothing here yet.</p>
            </div>
          ) : (
            <div className="mg__list">
              {shown.map(({ record, note }) => {
                if (record) {
                  return (
                    <RecordCard
                      key={record.id}
                      record={record}
                      refs={refs}
                      selected={selected.includes(record.id)}
                      onToggle={() => toggle(record.id)}
                    />
                  )
                }
                return note ? <FeedbackEntry key={note.id} item={note} refs={refs} /> : null
              })}
            </div>
          )}
        </section>
        <aside className="mg__side">
          <SharePanel chosen={chosen} onShared={() => setSelected([])} />
        </aside>
      </div>
      <SelfReviewPanel records={records} feedback={notes} />
    </Page>
  )
}
