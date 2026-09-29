import { useState } from 'react'
import type { DecideAnswer, PracticeAttempt } from '../../contracts/records'
import type { CaseContent } from '../../contracts/types'
import { DecideBasedOn } from './DecideBasedOn'
import { DecideOptions } from './DecideOptions'
import { DecideReasoning } from './DecideReasoning'
import { DecideSubmission } from './DecideSubmission'
import { discardDraft, editDraft, saveRevision } from './reflect'
import './JuniorDecide.css'
import './ReflectParts.css'
import './fields.css'

// onDone says whether a revision was saved (true) or the changes were dropped (false).
type ReflectReviseProps = { content: CaseContent; attempt: PracticeAttempt; onDone: (saved: boolean) => void }

// 'Revise your answer' on Reflect: Decide's answer again, starting from the latest version and
// saved to the attempt's working draft as it is typed. Saving adds a version with the reason it
// changed; the original stays exactly as it was submitted. Cancel drops the unsaved changes.
export function ReflectRevise({ content, attempt, onDone }: ReflectReviseProps) {
  // Only the reason waits for Save: a revision's whyChanged lives on the version it creates.
  const [whyChanged, setWhyChanged] = useState('')
  const answer = attempt.decide
  const latest = attempt.versions[attempt.versions.length - 1]
  const changed = !latest || JSON.stringify(latest.decide) !== JSON.stringify(answer)
  const valid = answer.optionId !== null && (answer.optionId !== 'own' || answer.ownPlan.trim() !== '')
  const hint = !changed
    ? 'Change something in your answer first'
    : !valid
      ? 'Choose an option, or write your own plan'
      : !whyChanged.trim()
        ? 'Say why you changed it'
        : ''
  const edit = (recipe: (decide: DecideAnswer) => void) => editDraft(content.id, recipe)

  return (
    <section className="jr-revise jr-decide" aria-labelledby="jr-revise-title">
      <h2 id="jr-revise-title" className="title title--md jr-revise__title" tabIndex={-1}>
        Revise your answer
      </h2>
      <p className="jr-revise__intro">Your original answer stays as you submitted it. This adds a new version.</p>
      <div className="jr-options">
        <DecideOptions
          content={content}
          choice={answer.optionId}
          ownPlan={answer.ownPlan}
          showOwn
          readOnly={false}
          onChoose={(optionId) =>
            edit((decide) => {
              decide.optionId = optionId
            })
          }
          onOwnPlan={(plan) =>
            edit((decide) => {
              decide.ownPlan = plan
            })
          }
        />
        <DecideBasedOn
          content={content}
          requested={attempt.investigate.requests.map((r) => r.requestId)}
          selected={answer.basedOn}
          readOnly={false}
          onChange={(basedOn) =>
            edit((decide) => {
              decide.basedOn = basedOn
            })
          }
        />
      </div>
      <DecideReasoning answer={answer} planFields readOnly={false} onEdit={edit} />
      {content.submission && (
        <DecideSubmission
          submission={content.submission}
          values={answer.fields}
          readOnly={false}
          onChange={(id, value) =>
            edit((decide) => {
              decide.fields[id] = value
            })
          }
        />
      )}
      <div className="field jr-revise__why">
        <label className="field__label" htmlFor="jr-why-changed">
          Why did you change it?
        </label>
        <textarea
          id="jr-why-changed"
          className="textarea jr-grow"
          rows={2}
          value={whyChanged}
          onChange={(e) => setWhyChanged(e.target.value)}
        />
      </div>
      <div className="jr-revise__actions">
        {hint && (
          <p id="jr-revise-hint" className="jr-revise__hint">
            {hint}
          </p>
        )}
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            discardDraft(content.id)
            onDone(false)
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn--primary"
          aria-disabled={hint !== '' || undefined}
          aria-describedby={hint ? 'jr-revise-hint' : undefined}
          onClick={() => {
            // Save stays focusable while it can't be used, so its reason can be heard.
            if (hint) return
            saveRevision(content, whyChanged.trim())
            onDone(true)
          }}
        >
          Save revision
        </button>
      </div>
    </section>
  )
}
