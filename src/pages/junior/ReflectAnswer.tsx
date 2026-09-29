import { useState } from 'react'
import type { PracticeAttempt } from '../../contracts/records'
import type { CaseContent } from '../../contracts/types'
import { formatDate } from '../../lib/labels'
import { basedOnLabel } from './DecideBasedOn'
import { callText } from './reflect'

const CONFIDENCE = { low: 'Low', medium: 'Medium', high: 'High' } as const

type ReflectAnswerProps = {
  content: CaseContent
  attempt: PracticeAttempt
  // Which submitted version to show: 0 is the original.
  version: number
  onVersion: (version: number) => void
  onRevise?: () => void
}

// 'Your answer' on Reflect, under the feedback: one submitted version, exactly as it was saved,
// with a switch between the original and each revision that is always in view. It opens with the
// first position and the final call, so the change shows; the rest is folded behind
// 'Show my full answer'.
export function ReflectAnswer({ content, attempt, version, onVersion, onRevise }: ReflectAnswerProps) {
  const [open, setOpen] = useState(false)
  const shown = attempt.versions[version]
  if (!shown) return null
  const { decide } = shown
  const position = shown.define.initialPosition
  const rows: [string, string][] = [
    ['Why', decide.why],
    ['Remaining risk', decide.mainRisk],
    ['Owner', decide.owner],
    ['Review by', decide.reviewBy],
    ['What would change my mind', decide.changeMind],
    ['Confidence', decide.confidence ? CONFIDENCE[decide.confidence] : ''],
    ['Based on', decide.basedOn.map((id) => basedOnLabel(content, id)).join(' · ')],
    ...(content.submission?.fields ?? []).map((field): [string, string] => [field.label, decide.fields[field.id] ?? '']),
  ]

  return (
    <section className="card jr-answer" aria-labelledby="jr-answer-title">
      <div className="jr-answer__head">
        <h2 id="jr-answer-title" className="title title--sm jr-reflect__cardtitle">
          Your answer
        </h2>
        {attempt.versions.length > 1 && (
          <div className="segmented jr-answer__versions" role="group" aria-label="Version">
            {attempt.versions.map((v, i) => (
              <button
                key={v.at}
                id={`jr-version-${i}`}
                type="button"
                className="segmented__item"
                aria-pressed={i === version}
                onClick={() => onVersion(i)}
              >
                {i === 0 ? 'Original' : `Revision ${i}`}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="jr-answer__when">
        {version === 0 ? 'Submitted' : 'Revised'} {formatDate(shown.at)}
      </p>
      {version > 0 && shown.whyChanged && (
        <p className="callout jr-answer__changed">
          <span>
            <strong>Why I changed it</strong> {shown.whyChanged}
          </span>
        </p>
      )}
      <div className="jr-answer__calls">
        <div className="jr-answer__call">
          <p className="jr-answer__label">First position</p>
          <p className="jr-answer__value">{position.recommendation || 'Not written'}</p>
          {position.reason && <p className="jr-answer__note">{position.reason}</p>}
          {position.confidence && <p className="jr-answer__note">Confidence: {CONFIDENCE[position.confidence]}</p>}
        </div>
        <div className="jr-answer__call jr-answer__call--final">
          <p className="jr-answer__label">Final call</p>
          <p className="jr-answer__value">{callText(content, decide)}</p>
        </div>
      </div>
      <button
        type="button"
        className="btn btn--link jr-answer__more"
        aria-expanded={open}
        aria-controls="jr-answer-rows"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Hide my full answer' : 'Show my full answer'}
      </button>
      <dl id="jr-answer-rows" className="jr-answer__rows" hidden={!open}>
        {rows.map(([name, value]) => (
          <div key={name} className="jr-answer__row">
            <dt>{name}</dt>
            <dd data-empty={value.trim() ? undefined : 'true'}>{value.trim() || 'Left blank'}</dd>
          </div>
        ))}
      </dl>
      {onRevise && (
        <button id="jr-revise-open" type="button" className="btn btn--secondary jr-answer__revise" onClick={onRevise}>
          Revise your answer
        </button>
      )}
    </section>
  )
}
