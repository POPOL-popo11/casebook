import { useEffect, useRef, useState } from 'react'
import type { Feedback, Share, SharedItem } from '../../contracts/records'
import type { SkillId } from '../../contracts/types'
import { DemoTag } from '../../components/DemoTag'
import { toast } from '../../components/toast'
import { demoPerson, personName, skillLabel, SKILLS } from '../../lib/content'
import { formatDate } from '../../lib/labels'
import { newId, setStore, useStore } from '../../lib/records'

type Texts = { strength: string; improvement: string; followUp: string }
const EMPTY: Texts = { strength: '', improvement: '', followUp: '' }
const FIELDS: { key: keyof Texts; label: string }[] = [
  { key: 'strength', label: 'One thing done well' },
  { key: 'improvement', label: 'The most important improvement' },
  { key: 'followUp', label: 'One follow-up question' },
]

// Feedback on one shared record: what was already sent on it in this share, and a short form.
// It answers the record ({ kind: 'growth', id: recordId }) and names the share it came in.
export function ShareItemFeedback({ share, item }: { share: Share; item: SharedItem }) {
  const sent = useStore((store) =>
    store.feedback.filter((f) => f.about.kind === 'growth' && f.about.id === item.recordId && f.shareId === share.id),
  )
  const [open, setOpen] = useState(false)
  const [texts, setTexts] = useState<Texts>(EMPTY)
  const [focus, setFocus] = useState<SkillId | undefined>()
  const [missing, setMissing] = useState(false)
  const first = personName(share.learnerId).split(' ')[0]
  // Focus follows the form: into its first field when it opens, back to the button when it
  // closes or is sent. Only after the user opens or closes it, never on the first render.
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstFieldRef = useRef<HTMLTextAreaElement>(null)
  const moveFocus = useRef(false)
  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    if (open) firstFieldRef.current?.focus()
    else toggleRef.current?.focus()
  }, [open])
  const toggle = (next: boolean) => {
    moveFocus.current = true
    setOpen(next)
  }

  const send = () => {
    if (!texts.strength.trim() || !texts.improvement.trim()) return setMissing(true)
    const feedback: Feedback = {
      id: newId('fb'),
      source: 'user',
      fromId: demoPerson('manager').id,
      toId: share.learnerId,
      at: new Date().toISOString(),
      about: { kind: 'growth', id: item.recordId },
      shareId: share.id,
      strength: texts.strength.trim(),
      improvement: texts.improvement.trim(),
      followUp: texts.followUp.trim(),
      focusSkillId: focus,
      nextAction: '',
    }
    setStore((draft) => {
      draft.feedback.push(feedback)
    })
    setTexts(EMPTY)
    setFocus(undefined)
    setMissing(false)
    toggle(false)
    toast(`Feedback sent to ${first}.`)
  }

  return (
    <div className="sg-fb">
      {sent.map((f) => (
        <div key={f.id} className="sg-fb__sent">
          <p className="sg-fb__meta">
            Your feedback · {formatDate(f.at)} · {f.readAt ? 'Read' : 'Not read yet'}
            {f.source === 'demo' && <DemoTag kind="data" />}
          </p>
          <p className="sg-fb__line"><strong>Done well:</strong> {f.strength}</p>
          <p className="sg-fb__line"><strong>Improve:</strong> {f.improvement}</p>
          {f.followUp && <p className="sg-fb__line"><strong>Follow-up:</strong> {f.followUp}</p>}
          {f.focusSkillId && <p className="sg-fb__line"><strong>Next focus:</strong> {skillLabel(f.focusSkillId)}</p>}
        </div>
      ))}

      {!open ? (
        <button ref={toggleRef} type="button" className="btn btn--secondary btn--sm sg-fb__open" onClick={() => toggle(true)}>
          {sent.length > 0 ? 'Add more feedback' : 'Give feedback'}
        </button>
      ) : (
        <div className="sg-fb__form" role="group" aria-label={`Feedback for ${first}`}>
          {FIELDS.map(({ key, label }, i) => (
            <label key={key} className="field">
              <span className="field__label">{label}</span>
              <textarea
                ref={i === 0 ? firstFieldRef : undefined}
                className="textarea"
                rows={2}
                value={texts[key]}
                aria-invalid={missing && key !== 'followUp' && !texts[key].trim() ? true : undefined}
                onChange={(e) => setTexts({ ...texts, [key]: e.target.value })}
              />
            </label>
          ))}
          <p className="field__label">Next focus</p>
          <div className="sg-fb__focus" role="group" aria-label="Next focus">
            {SKILLS.map((skill) => (
              <button
                key={skill.id}
                type="button"
                className="chip chip--outline"
                aria-pressed={focus === skill.id}
                onClick={() => setFocus(focus === skill.id ? undefined : skill.id)}
              >
                {skill.label}
              </button>
            ))}
          </div>
          {missing && (
            <p className="sg-fb__missing" role="alert">
              Add one thing done well and the most important improvement.
            </p>
          )}
          <div className="sg-fb__actions">
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => toggle(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn--primary btn--sm" onClick={send}>
              {`Send to ${first}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
