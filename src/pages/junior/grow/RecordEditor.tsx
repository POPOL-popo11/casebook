import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { GrowthRecord } from '../../../contracts/records'
import { setStore } from '../../../lib/records'
import { AutoTextarea } from './AutoTextarea'
import './RecordEditor.css'

// The learner's own words on a record. Level, prompting, outcome, kind, date and skill are not
// the learner's to rewrite here (records.ts), and shares stay the frozen copies they were.
type Draft = Pick<GrowthRecord, 'situation' | 'contribution' | 'evidence' | 'learning' | 'nextStep'>

type RecordEditorProps = {
  record: GrowthRecord
  onDone: () => void
}

// Edit mode of a record card on My Growth: Save writes the record to the store, Cancel discards.
export function RecordEditor({ record, onDone }: RecordEditorProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [draft, setDraft] = useState<Draft>(() => ({
    situation: record.situation,
    contribution: record.contribution,
    evidence: record.evidence.map((item) => ({ ...item })),
    learning: record.learning,
    nextStep: record.nextStep,
  }))

  useEffect(() => {
    formRef.current?.querySelector('textarea')?.focus()
  }, [])

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }))
  const setEvidence = (evidence: Draft['evidence']) => set({ evidence })

  function save(e: FormEvent) {
    e.preventDefault()
    setStore((store) => {
      const g = store.growth.find((x) => x.id === record.id)
      if (!g) return
      g.situation = draft.situation
      g.contribution = draft.contribution
      g.evidence = draft.evidence.filter((item) => item.text.trim() !== '')
      g.learning = draft.learning
      g.nextStep = draft.nextStep
    })
    onDone()
  }

  const idBase = `mg-edit-${record.id}`

  return (
    <form ref={formRef} className="mg-edit" onSubmit={save} aria-label="Edit record">
      <label className="field">
        <span className="field__label">Situation</span>
        <AutoTextarea className="textarea" rows={2} value={draft.situation} onChange={(e) => set({ situation: e.target.value })} />
      </label>
      <label className="field">
        <span className="field__label">What I did</span>
        <AutoTextarea className="textarea" rows={3} value={draft.contribution} onChange={(e) => set({ contribution: e.target.value })} />
      </label>
      <fieldset className="field mg-edit__fieldset" aria-describedby={draft.evidence.length === 0 ? `${idBase}-none` : undefined}>
        <legend className="field__label">Evidence</legend>
        {draft.evidence.length === 0 && (
          <p id={`${idBase}-none`} className="mg-edit__none">
            None recorded
          </p>
        )}
        {draft.evidence.map((item, i) => (
          <div key={i} className="mg-edit__evidence">
            <AutoTextarea
              className="textarea"
              rows={2}
              aria-label={`Evidence ${i + 1}`}
              value={item.text}
              onChange={(e) => setEvidence(draft.evidence.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
            />
            <button
              type="button"
              className="btn btn--link mg-edit__remove"
              aria-label={`Remove evidence ${i + 1}`}
              onClick={() => setEvidence(draft.evidence.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn--link mg-edit__add" onClick={() => setEvidence([...draft.evidence, { text: '' }])}>
          + Add evidence
        </button>
      </fieldset>
      <label className="field">
        <span className="field__label">What I learned</span>
        <AutoTextarea className="textarea" rows={3} value={draft.learning} onChange={(e) => set({ learning: e.target.value })} />
      </label>
      <label className="field">
        <span className="field__label">Next step</span>
        <AutoTextarea className="textarea" rows={2} value={draft.nextStep} onChange={(e) => set({ nextStep: e.target.value })} />
      </label>
      <div className="mg-edit__actions">
        <button type="submit" className="btn btn--primary btn--sm">
          Save
        </button>
        <button type="button" className="btn btn--secondary btn--sm" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}
