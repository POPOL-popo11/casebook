import { useEffect, useRef, useState } from 'react'
import type { Feedback, RecordRef } from '../../contracts/records'
import { DIMENSIONS, EVIDENCE_LEVELS, type DimensionId, type EvidenceLevel, type SkillId } from '../../contracts/types'
import { DemoTag } from '../../components/DemoTag'
import { toast } from '../../components/toast'
import { demoPerson, personName, skillLabel } from '../../lib/content'
import { formatDate } from '../../lib/labels'
import { getStore, newId, setStore } from '../../lib/records'
import { SentFeedback } from './SentFeedback'
import './FeedbackColumn.css'

type Levels = Partial<Record<DimensionId, EvidenceLevel>>
type Texts = { strength: string; improvement: string; followUp: string }

// The case's review of its example (CaseContent.review), offered as the starting draft on the
// example attempt only (isExampleAttempt): Demo data.
export type FeedbackPreset = { levels: Levels; notes: Partial<Record<DimensionId, string>>; texts: Texts; focus?: SkillId }

type FeedbackColumnProps = {
  about: RecordRef
  learnerId: string
  version?: number // the attempt version on screen
  call: { label: string; text: string }
  focusOptions: SkillId[]
  preset?: FeedbackPreset
}

const EMPTY: Texts = { strength: '', improvement: '', followUp: '' }
const TEXT_FIELDS: { key: keyof Texts; label: string }[] = [
  { key: 'strength', label: 'One thing done well' },
  { key: 'improvement', label: 'The most important improvement' },
  { key: 'followUp', label: 'One follow-up question' },
]

// When the Team Lead's newest note on this record was sent (their own, not seeded Demo feedback),
// so a reload shows the summary rather than an empty form. Null when they have sent none.
function lastSentAt(about: RecordRef): string | null {
  const managerId = demoPerson('manager').id
  return getStore()
    .feedback.filter((f) => f.source === 'user' && f.fromId === managerId && f.about.kind === about.kind && f.about.id === about.id)
    .reduce<string | null>((latest, f) => (latest === null || f.at > latest ? f.at : latest), null)
}

// 09 · right column: the learner's call, the feedback already sent, and the Team Lead's feedback.
// The parent keys it by record id, so no state carries over from one record to the next.
export function FeedbackColumn({ about, learnerId, version, call, focusOptions, preset }: FeedbackColumnProps) {
  const [levels, setLevels] = useState<Levels>(preset?.levels ?? {})
  const [texts, setTexts] = useState<Texts>(preset?.texts ?? EMPTY)
  const [focus, setFocus] = useState<SkillId | undefined>(preset?.focus)
  const [missing, setMissing] = useState(false)
  const [sentAt, setSentAt] = useState<string | null>(() => lastSentAt(about)) // once sent: the summary, not the form
  const first = personName(learnerId).split(' ')[0]
  const showsPreset = preset !== undefined && TEXT_FIELDS.some(({ key }) => texts[key] !== '' && texts[key] === preset.texts[key])
  // Focus follows the card: to the summary after Send, to the first level after 'Add another
  // note'. Only after the user does either, never on the first render.
  const summaryRef = useRef<HTMLParagraphElement>(null)
  const firstLevelRef = useRef<HTMLSelectElement>(null)
  const moveFocus = useRef(false)
  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    if (sentAt) summaryRef.current?.focus()
    else firstLevelRef.current?.focus()
  }, [sentAt])
  const showSummary = (at: string | null) => {
    moveFocus.current = true
    setSentAt(at)
  }

  const send = () => {
    if (!texts.strength.trim() || !texts.improvement.trim()) {
      setMissing(true)
      return
    }
    const feedback: Feedback = {
      id: newId('fb'),
      source: 'user',
      fromId: demoPerson('manager').id,
      toId: learnerId,
      at: new Date().toISOString(),
      about,
      version,
      strength: texts.strength.trim(),
      improvement: texts.improvement.trim(),
      followUp: texts.followUp.trim(),
      focusSkillId: focus,
      nextAction: '',
      dimensions: DIMENSIONS.flatMap((d) => {
        const level = levels[d.id]
        return level ? [{ id: d.id, level, note: preset?.notes[d.id] ?? '' }] : []
      }),
    }
    setStore((draft) => {
      draft.feedback.push(feedback)
    })
    setLevels({})
    setTexts(EMPTY)
    setFocus(undefined)
    setMissing(false)
    showSummary(feedback.at)
    toast(`Feedback sent to ${first}.`)
  }

  return (
    <div className="mr__side">
      <figure className="card card--dark mr__note">
        <figcaption className="eyebrow mr__note-label">{call.label}</figcaption>
        <blockquote className="mr__quote">{call.text}</blockquote>
      </figure>

      <SentFeedback about={about} />

      <section className="card mr__feedback" aria-labelledby="mr-feedback">
        <div className="mr__head">
          <h2 id="mr-feedback" className="title title--sm mr__feedback-title">
            Your feedback
          </h2>
          {!sentAt && showsPreset && <DemoTag kind="data" />}
        </div>

        {sentAt ? (
          <>
            <p ref={summaryRef} className="mr__sent-summary" tabIndex={-1}>
              {`Sent to ${first} · ${formatDate(sentAt)} · ${first} sees it in Feedback`}
            </p>
            <button type="button" className="btn btn--secondary btn--block" onClick={() => showSummary(null)}>
              Add another note
            </button>
          </>
        ) : (
          <>
            <fieldset className="mr__levels">
              <legend className="field__label">Evidence level for each dimension</legend>
              {DIMENSIONS.map((d, i) => (
                <label key={d.id} className="mr__level">
                  <span className="mr__level-name">{d.label}</span>
                  <select
                    ref={i === 0 ? firstLevelRef : undefined}
                    className="select"
                    value={levels[d.id] ?? ''}
                    onChange={(e) => setLevels({ ...levels, [d.id]: (e.target.value || undefined) as EvidenceLevel | undefined })}
                  >
                    <option value="">Not set</option>
                    {EVIDENCE_LEVELS.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </fieldset>

            {TEXT_FIELDS.map(({ key, label }) => (
              <label key={key} className="field mr__text">
                <span className="field__label">{label}</span>
                <textarea
                  className="textarea"
                  rows={2}
                  value={texts[key]}
                  aria-invalid={missing && key !== 'followUp' && !texts[key].trim() ? true : undefined}
                  onChange={(e) => setTexts({ ...texts, [key]: e.target.value })}
                />
              </label>
            ))}

            <p id="mr-focus" className="field__label mr__focus-label">
              Next focus
            </p>
            <div className="mr__focus" role="group" aria-labelledby="mr-focus">
              {focusOptions.map((skillId) => (
                <button
                  key={skillId}
                  type="button"
                  className="chip chip--outline mr__focus-chip"
                  aria-pressed={focus === skillId}
                  onClick={() => setFocus(focus === skillId ? undefined : skillId)}
                >
                  {skillLabel(skillId)}
                </button>
              ))}
            </div>

            {missing && (
              <p className="mr__missing" role="alert">
                Add one thing done well and the most important improvement.
              </p>
            )}
            <button type="button" className="btn btn--primary btn--block" onClick={send}>
              {`Send to ${first}`}
            </button>
          </>
        )}
      </section>

      <p className="mr__footnote">One practice case, not a performance rating.</p>
    </div>
  )
}
