import { useState } from 'react'
import type { WorkReview } from '../../../contracts/records'
import { DemoResponse } from './demo'
import { mentionsAny, skillLabel, WORK_GROW } from './growContent'
import type { Edit } from './workReview'
import '../fields.css'

type Response = NonNullable<WorkReview['focus']['response']>

const RESPONSES: { id: Response; label: string }[] = [
  { id: 'confirmed', label: 'Yes, that fits' },
  { id: 'corrected', label: 'Correct it' },
  { id: 'mastered', label: 'Already mastered' },
  { id: 'not-relevant', label: 'Not relevant' },
  { id: 'not-enough-info', label: 'Not enough information' },
]

// C. My growth focus. The app never insists: any correction changes the suggestion (afterCorrection
// when it mentions a keyword, else unmatchedCorrection), and the page says it changed.
export function StepFocus({ review, edit }: { review: WorkReview; edit: Edit }) {
  const { focus } = review
  const script = WORK_GROW.focus
  const [correcting, setCorrecting] = useState(false)
  const said = focus.correction
  const setSaid = (text: string) => edit((r) => void (r.focus.correction = text))

  function respond(id: Response) {
    setCorrecting(id === 'corrected')
    if (id !== 'corrected') edit((r) => void (r.focus.response = id))
  }

  function sendCorrection() {
    if (!said.trim()) return
    const next = mentionsAny(said, script.correctionKeywords)
      ? script.afterCorrection
      : { skillId: script.skillId, ...script.unmatchedCorrection }
    edit((r) => {
      r.focus.response = 'corrected'
      r.focus.adjusted = true
      r.focus.skillId = next.skillId
      r.focus.title = next.title
      r.focus.reason = next.reason
    })
    setCorrecting(false)
  }

  const pressed = correcting ? 'corrected' : focus.response
  const reporting = !correcting && (focus.response === 'mastered' || focus.response === 'not-relevant')
  const askingMore = !correcting && focus.response === 'not-enough-info'

  return (
    <div className="wg-pair wg-pair--aside">
      <section className="card wg-card" aria-labelledby="wg-focus-title">
        <div className="wg-card__head">
          <p className="eyebrow">Suggested focus</p>
          <DemoResponse />
        </div>
        {focus.adjusted && (
          <div className="callout wg-callout" role="status">
            <p>
              <strong>Focus changed after your correction.</strong> It was: {script.title}.
            </p>
          </div>
        )}
        <h2 id="wg-focus-title" className="title title--md wg-focus__title" tabIndex={-1}>
          {focus.title}
        </h2>
        <p className="wg-focus__skill">
          <span className="badge badge--accent">{skillLabel(focus.skillId)}</span>
        </p>
        <p className="wg-focus__reason">{focus.reason}</p>
        {focus.adjusted ? (
          <div className="wg-evidence">
            <p className="field__label">Based on your correction</p>
            <blockquote className="wg-quote">{said}</blockquote>
          </div>
        ) : (
          focus.evidence.length > 0 && (
            <div className="wg-evidence">
              <p className="field__label">From your work</p>
              <ul className="wg-quotes">
                {focus.evidence.map((quote) => (
                  <li key={quote} className="wg-quote">
                    {quote}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </section>
      <section className="card wg-card" aria-labelledby="wg-respond-title">
        <h2 id="wg-respond-title" className="title title--sm">
          Is this right?
        </h2>
        <p className="wg-card__lead">You know your work best. Tell Casebook if it got something wrong.</p>
        <div className="wg-responses" role="group" aria-labelledby="wg-respond-title">
          {RESPONSES.map((r) => (
            <button key={r.id} type="button" className="chip" aria-pressed={pressed === r.id} onClick={() => respond(r.id)}>
              {r.label}
            </button>
          ))}
        </div>
        {correcting && (
          <div className="wg-correct">
            <label className="field">
              <span className="field__label">What did Casebook miss?</span>
              <textarea className="textarea jr-grow" rows={3} value={said} placeholder="e.g. what you checked, and with whom" onChange={(e) => setSaid(e.target.value)} />
            </label>
            <button type="button" className="btn btn--primary btn--sm" disabled={!said.trim()} onClick={sendCorrection}>
              Send correction
            </button>
          </div>
        )}
        {reporting && (
          <label className="field wg-correct">
            <span className="field__label">In your words (optional)</span>
            <span className="wg-note">Kept on your record as “Learner reports”. It is not marked as observed.</span>
            <textarea className="textarea jr-grow" rows={3} value={said} onChange={(e) => setSaid(e.target.value)} />
          </label>
        )}
        {askingMore && (
          <div className="wg-correct">
            <div className="wg-feedback">
              <div className="wg-card__head">
                <p className="field__label">One more question</p>
                <DemoResponse />
              </div>
              <p>{script.moreInfoQuestion}</p>
            </div>
            <label className="field">
              <span className="field__label">My answer</span>
              <textarea className="textarea jr-grow" rows={3} value={said} onChange={(e) => setSaid(e.target.value)} />
            </label>
          </div>
        )}
      </section>
    </div>
  )
}
