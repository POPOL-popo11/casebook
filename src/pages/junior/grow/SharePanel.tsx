import { useEffect, useRef, useState } from 'react'
import type { GrowthRecord, SharedItem } from '../../../contracts/records'
import { ROUTES } from '../../../contracts/types'
import { toast } from '../../../components/toast'
import { newId, setStore, useStore } from '../../../lib/records'
import { SharedItemView } from '../../../components/SharedItemView'
import { DemoData } from './demo'
import { formatDate, fromWorkGrow, LEARNER_ID, nowIso, personName, shortTitle, TEAM_LEAD_ID } from './growContent'
import './SharePanel.css'

// Exactly what the Team Lead receives: a frozen copy. Never the private note (nor level or prompting).
// A Work & Grow record gets the self-review's short title as its heading; the full situation stays.
function toSharedItem(r: GrowthRecord): SharedItem {
  return {
    recordId: r.id,
    title: fromWorkGrow(r) ? shortTitle(r.situation) : undefined,
    date: r.date,
    kind: r.kind,
    skillId: r.skillId,
    situation: r.situation,
    contribution: r.contribution,
    evidence: r.evidence.map((e) => e.text),
    outcome: r.outcome,
    learning: r.learning,
    nextStep: r.nextStep,
  }
}

type SharePanelProps = { chosen: GrowthRecord[]; onShared: () => void }
type FocusTarget = 'lead' | 'preview' | 'history'

// Sharing in three steps: select records (on the cards), preview the exact copy, confirm.
// A change in the selection drops the preview, so it never goes stale. The panel stays mounted,
// so its "N records selected." live region is announced as boxes are ticked.
export function SharePanel({ chosen, onShared }: SharePanelProps) {
  const lead = personName(TEAM_LEAD_ID)
  const [preview, setPreview] = useState<SharedItem[] | null>(null)
  const selection = chosen.map((r) => r.id).join(',')
  const [previewed, setPreviewed] = useState(selection)
  if (previewed !== selection) {
    setPreviewed(selection)
    setPreview(null)
  }
  const shares = useStore((s) => s.shares)
  const feedback = useStore((s) => s.feedback)
  const mine = shares.filter((s) => s.learnerId === LEARNER_ID).sort((a, b) => b.sharedAt.localeCompare(a.sharedAt))

  // After Preview, Back and Confirm the pressed button is gone, so focus moves to what replaced it.
  const leadRef = useRef<HTMLParagraphElement>(null)
  const previewRef = useRef<HTMLButtonElement>(null)
  const historyRef = useRef<HTMLParagraphElement>(null)
  const refocus = useRef<FocusTarget | null>(null)
  useEffect(() => {
    if (!refocus.current) return
    const target = { lead: leadRef, preview: previewRef, history: historyRef }[refocus.current].current
    if (!target) return
    refocus.current = null
    target.focus()
  })

  const none = chosen.length === 0
  function openPreview() {
    if (none) return
    refocus.current = 'lead'
    setPreview(chosen.map(toSharedItem))
  }

  function confirm() {
    if (!preview || preview.length === 0) return
    const items = preview
    setStore((draft) => {
      draft.shares.push({ id: newId('share'), source: 'user', learnerId: LEARNER_ID, managerId: TEAM_LEAD_ID, sharedAt: nowIso(), items })
    })
    refocus.current = 'history'
    setPreview(null)
    onShared()
    toast(`Shared with ${lead}`)
  }

  return (
    <section className="card mg-share" aria-labelledby="mg-share-title">
      <h2 id="mg-share-title" className="title title--sm">
        Share with {lead}
      </h2>
      {preview === null ? (
        <>
          <ol className="mg-share__steps">
            <li data-state={chosen.length > 0 ? 'done' : 'current'}>1. Select records</li>
            <li data-state="todo">2. Preview what {lead} receives</li>
            <li data-state="todo">3. Confirm</li>
          </ol>
          <p id="mg-share-count" className="mg-share__count" aria-live="polite">
            {none ? 'No records selected.' : `${chosen.length} record${chosen.length === 1 ? '' : 's'} selected.`}
          </p>
          <button
            ref={previewRef}
            type="button"
            className="btn btn--primary btn--block"
            aria-disabled={none || undefined}
            aria-describedby="mg-share-count"
            onClick={openPreview}
          >
            Preview
          </button>
          <p className="mg-share__note">Private notes are never shared.</p>
        </>
      ) : (
        <>
          <p ref={leadRef} className="mg-share__lead" tabIndex={-1}>
            This is the exact copy {lead} will see. It leaves out private notes, and it won't change if you edit the record later.
          </p>
          <ul className="mg-preview">
            {preview.map((item) => (
              <li key={item.recordId} className="mg-preview__item">
                <SharedItemView item={item} />
              </li>
            ))}
          </ul>
          <div className="mg-share__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                refocus.current = 'preview'
                setPreview(null)
              }}
            >
              Back
            </button>
            <button type="button" className="btn btn--primary" onClick={confirm}>
              Confirm and share
            </button>
          </div>
        </>
      )}
      {mine.length > 0 && (
        <div className="mg-history">
          <p ref={historyRef} className="field__label" tabIndex={-1}>
            Shared so far
          </p>
          <ul className="mg-history__list">
            {mine.map((share) => (
              <li key={share.id}>
                <span>
                  {formatDate(share.sharedAt)} · {share.items.length} record{share.items.length === 1 ? '' : 's'} to {personName(share.managerId)}
                </span>
                {share.source === 'demo' && <DemoData />}
                {feedback.some((f) => f.shareId === share.id || f.about.id === share.id) && (
                  <a className="link" href={ROUTES.juniorFeedback}>
                    Feedback received
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
