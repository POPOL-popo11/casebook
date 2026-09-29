import { caseHref } from '../../contracts/types'
import { getCase } from '../../lib/content'
import { useCaseId } from '../../lib/router'
import { CaseFrame } from './CaseFrame'
import { BackArrow, NextArrow } from './icons'
import { InvestigateRequests } from './InvestigateRequests'
import { InvestigateUnlocked } from './InvestigateUnlocked'
import { hoursText } from './investigateData'
import { usePractice } from './practice'
import './JuniorInvestigate.css'
import './InvestigateAsk.css'

// Step 3 of a case (07-junior-investigate.png). In practice mode the learner writes what they
// want to confirm before each request, and each unlocked request can open its material. The
// example shows its own requests, read-only.
export function JuniorInvestigate() {
  const caseId = useCaseId()
  const content = getCase(caseId)
  const practice = usePractice(content)
  const { mode, example, attempt, readOnly, update } = practice
  const made =
    mode === 'example' && example
      ? example.requestedIds.map((id) => ({ requestId: id, intent: example.requestIntents?.[id] ?? '' }))
      : attempt.investigate.requests
  const requested = made.map((r) => r.requestId)
  const intents = Object.fromEntries(made.map((r) => [r.requestId, r.intent]))
  const budget = content.timeBudgetHours
  const used = content.requests.filter((r) => requested.includes(r.id)).reduce((sum, r) => sum + r.hours, 0)

  const request = (id: string, intent: string) => {
    const hours = content.requests.find((r) => r.id === id)?.hours ?? 0
    if (readOnly || requested.includes(id) || used + hours > budget) return
    update((a) => {
      a.investigate.requests.push({ requestId: id, intent, at: new Date().toISOString() })
    })
  }

  return (
    <CaseFrame
      caseId={caseId}
      step="investigate"
      className="jr-investigate"
      practice={practice}
      actions={
        <>
          <a className="btn btn--secondary" href={caseHref(caseId, 'examine')}>
            <BackArrow />
            Back
          </a>
          <a className="btn btn--primary" href={caseHref(caseId, 'decide')}>
            Next
            <NextArrow />
          </a>
        </>
      }
    >
      <div className="jr-investigate__head">
        <h2 className="title title--md jr-investigate__title">What will you find out?</h2>
        <div className="jr-time">
          <p className="jr-time__row">
            <span id="jr-time-label" className="jr-time__label">
              Time used
            </span>
            <span className="jr-time__value">
              {hoursText(used)} / {budget} h
            </span>
          </p>
          <div
            className="meter jr-time__meter"
            role="meter"
            aria-labelledby="jr-time-label"
            aria-valuemin={0}
            aria-valuemax={budget}
            aria-valuenow={used}
            aria-valuetext={`${hoursText(used)} of ${budget} hours`}
          >
            <div className="meter__fill" style={{ width: `${(used / budget) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="jr-investigate__grid">
        <InvestigateRequests
          content={content}
          requested={requested}
          intents={intents}
          used={used}
          readOnly={readOnly}
          onRequest={request}
        />
        <InvestigateUnlocked content={content} requested={requested} />
      </div>
    </CaseFrame>
  )
}
