import { useEffect, useRef, useState } from 'react'
import { caseHref, type CaseContent } from '../../contracts/types'
import { IconCheck, NextArrow } from './icons'
import { hoursText } from './investigateData'
import './fields.css'

type InvestigateRequestsProps = {
  content: CaseContent
  requested: string[]
  // Request id → what the learner wanted to confirm with it.
  intents: Record<string, string>
  used: number
  readOnly: boolean
  onRequest: (id: string, intent: string) => void
}

// The request list on Investigate (07). 'Request' first asks what the learner wants to confirm;
// sending it marks the row Requested and spends its hours. A request that would pass the time
// budget is disabled, and so is every request when the answer can't be changed.
export function InvestigateRequests({ content, requested, intents, used, readOnly, onRequest }: InvestigateRequestsProps) {
  const [asking, setAsking] = useState<string | null>(null)
  const [intent, setIntent] = useState('')
  const field = useRef<HTMLTextAreaElement>(null)
  const badges = useRef(new Map<string, HTMLElement>())
  const buttons = useRef(new Map<string, HTMLElement>())
  const refocus = useRef<{ id: string; to: 'badge' | 'button' } | null>(null)

  useEffect(() => {
    if (asking) field.current?.focus()
  }, [asking])

  // Sent: focus moves to the new badge. Cancelled: back to the row's Request button.
  useEffect(() => {
    const target = refocus.current
    if (!target) return
    ;(target.to === 'badge' ? badges : buttons).current.get(target.id)?.focus()
    refocus.current = null
  })

  const keep = (map: Map<string, HTMLElement>, id: string) => (el: HTMLElement | null) => {
    if (el) map.set(id, el)
    else map.delete(id)
  }

  const cancel = () => {
    if (asking) refocus.current = { id: asking, to: 'button' }
    setAsking(null)
  }

  const send = (id: string) => {
    const text = intent.trim()
    if (!text) return
    refocus.current = { id, to: 'badge' }
    setAsking(null)
    onRequest(id, text)
  }

  return (
    <section className="card jr-requests" aria-label="Requests">
      <ul className="jr-requests__list">
        {content.requests.map((request) => {
          const done = requested.includes(request.id)
          const open = asking === request.id
          return (
            <li key={request.id} className="jr-request" data-asking={open || undefined}>
              <div className="jr-request__text">
                <p className="jr-request__title">{request.title}</p>
                {request.why && <p className="jr-request__why">Why: {request.why}</p>}
                {done && intents[request.id] && (
                  <p className="jr-request__intent">To confirm: {intents[request.id]}</p>
                )}
                {open && (
                  <form
                    className="jr-ask"
                    onSubmit={(e) => {
                      e.preventDefault()
                      send(request.id)
                    }}
                  >
                    <label className="field__label" htmlFor={`jr-ask-${request.id}`}>
                      What I want to confirm
                    </label>
                    <div className="jr-ask__row">
                      <textarea
                        id={`jr-ask-${request.id}`}
                        ref={field}
                        className="textarea jr-line jr-ask__input"
                        rows={1}
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            e.preventDefault()
                            cancel()
                          }
                          // Enter still sends, as it did from the one-line field.
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            e.currentTarget.form?.requestSubmit()
                          }
                        }}
                      />
                      <button type="submit" className="btn btn--primary btn--sm" disabled={!intent.trim()}>
                        Request
                      </button>
                      <button type="button" className="btn btn--link jr-ask__cancel" onClick={cancel}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <span className="jr-request__hours">{hoursText(request.hours)} h</span>
              {done ? (
                <span
                  ref={keep(badges.current, request.id)}
                  className="badge badge--accent jr-request__badge"
                  tabIndex={-1}
                >
                  <IconCheck className="jr-request__check" />
                  Requested
                </span>
              ) : (
                !open && (
                  <button
                    ref={keep(buttons.current, request.id)}
                    type="button"
                    className="btn btn--secondary btn--sm jr-request__btn"
                    disabled={readOnly || used + request.hours > content.timeBudgetHours}
                    onClick={() => {
                      setIntent('')
                      setAsking(request.id)
                    }}
                  >
                    Request<span className="visually-hidden"> {request.title}</span>
                  </button>
                )
              )}
            </li>
          )
        })}
      </ul>
      <div className="jr-requests__footer">
        <p className="jr-requests__enough">Enough to decide?</p>
        <a className="btn btn--link jr-requests__decide" href={caseHref(content.id, 'decide')}>
          Decide now
          <NextArrow />
        </a>
      </div>
    </section>
  )
}
