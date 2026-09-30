import { useState } from 'react'
import { Page } from '../../components/Page'
import { toast } from '../../components/toast'
import { TEAMS } from '../../lib/content'
import { blankDraft, caseDrafts, draftHref, fieldsOf, saveDraft, type DraftFields } from '../../lib/drafts'
import { getStore } from '../../lib/records'
import { useDraftId } from '../../lib/router'
import { NewCaseMaterials } from './NewCaseMaterials'
import './NewCase.css'

const findDraft = (id: string | null) => (id ? (caseDrafts(getStore()).find((d) => d.id === id) ?? null) : null)

// Create a Case: a blank form saved as a CaseDraft. '?draft=<id>' reopens a saved one (My Cases).
// A draft is not playable and not in the Case Library.
export function NewCase() {
  const draftId = useDraftId()
  const [opened, setOpened] = useState(draftId)
  const [id, setId] = useState(() => findDraft(draftId)?.id ?? null)
  const [fields, setFields] = useState<DraftFields>(() => {
    const draft = findDraft(draftId)
    return draft ? fieldsOf(draft) : blankDraft()
  })
  const [error, setError] = useState('')

  // Another draft, or a blank form, opened on this page (the sidebar, My Cases). Saving a new
  // draft puts its own id in the URL: that one is already in the form.
  if (draftId !== opened) {
    setOpened(draftId)
    if (draftId !== id) {
      const draft = findDraft(draftId)
      setId(draft?.id ?? null)
      setFields(draft ? fieldsOf(draft) : blankDraft())
      setError('')
    }
  }

  const set = (patch: Partial<DraftFields>) => setFields((f) => ({ ...f, ...patch }))

  function save() {
    const title = fields.title.trim()
    if (!title) {
      setError('Give the case a title to save the draft.')
      return
    }
    setError('')
    const saved = saveDraft(id, { ...fields, title })
    setId(saved)
    if (draftId !== saved) window.location.replace(draftHref(saved))
    toast('Draft saved.')
  }

  return (
    <Page
      title="Create a Case"
      subtitle="This saves a draft only: it is not playable yet and not in the Case Library."
      aside={id && <span className="badge badge--warn">Draft</span>}
      actions={
        <div className="nc__actions">
          {error && (
            <p className="nc__error" role="alert">
              {error}
            </p>
          )}
          <button type="button" className="btn btn--primary" onClick={save}>
            Save draft
          </button>
        </div>
      }
    >
      <div className="nc__grid">
        <div className="nc__column">
          <section className="card nc__card" aria-labelledby="nc-case">
            <h2 id="nc-case" className="title title--sm nc__card-title">
              The case
            </h2>
            <div className="nc__fields">
              <label className="field">
                <span className="field__label">Title</span>
                <input
                  className="input"
                  value={fields.title}
                  aria-invalid={error ? true : undefined}
                  onChange={(e) => set({ title: e.target.value })}
                />
              </label>
              <label className="field">
                <span className="field__label">Team (optional)</span>
                <select
                  className="select"
                  value={fields.teamId ?? ''}
                  onChange={(e) => set({ teamId: e.target.value || undefined })}
                >
                  <option value="">No team</option>
                  {TEAMS.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field__label">Goal</span>
                <textarea className="textarea nc__textarea" value={fields.goal} onChange={(e) => set({ goal: e.target.value })} />
              </label>
              <label className="field">
                <span className="field__label">Limits</span>
                <textarea
                  className="textarea nc__textarea"
                  value={fields.limits}
                  onChange={(e) => set({ limits: e.target.value })}
                />
              </label>
            </div>
          </section>
          <NewCaseMaterials materials={fields.materials} onChange={(materials) => set({ materials })} />
        </div>

        <div className="nc__column">
          <section className="card nc__card" aria-labelledby="nc-decisions">
            <h2 id="nc-decisions" className="title title--sm nc__card-title">
              Four decision points
            </h2>
            <div className="nc__fields">
              {fields.decisions.map((text, i) => (
                <label key={i} className="field">
                  <span className="field__label">Decision {i + 1}</span>
                  <input
                    className="input"
                    value={text}
                    onChange={(e) => set({ decisions: fields.decisions.map((d, j) => (j === i ? e.target.value : d)) })}
                  />
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Page>
  )
}
