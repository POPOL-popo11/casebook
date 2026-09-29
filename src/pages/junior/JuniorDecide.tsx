import type { DecideAnswer } from '../../contracts/records'
import { caseHref, casePageHref, type ExampleAttempt } from '../../contracts/types'
import { getCase, nextCallText } from '../../lib/content'
import { useCaseId } from '../../lib/router'
import { CaseFrame } from './CaseFrame'
import { DecideBasedOn } from './DecideBasedOn'
import { DecideOptions } from './DecideOptions'
import { DecideReasoning } from './DecideReasoning'
import { DecideSubmission } from './DecideSubmission'
import { BackArrow, NextArrow } from './icons'
import { startPractice, submitAttempt, usePractice } from './practice'
import './JuniorDecide.css'

// The example's call in the shape of a learner's answer, so Decide shows both the same way.
function exampleAnswer(example: ExampleAttempt): DecideAnswer {
  return {
    optionId: example.decision,
    ownPlan: example.ownPlan ?? '',
    fields: example.submission ?? {},
    basedOn: [],
    why: example.why,
    mainRisk: example.mainRisk,
    owner: '',
    reviewBy: '',
    changeMind: example.changeMind,
    confidence: example.confidence,
  }
}

// Step 4 of a case (08-junior-decide.png). In practice mode the learner picks an option or
// writes their own plan, fills in the case's submission and their reasoning, and submits:
// the answer is saved as the attempt's first version and Reflect opens.
export function JuniorDecide() {
  const caseId = useCaseId()
  const content = getCase(caseId)
  const practice = usePractice(content)
  const { mode, example, attempt, readOnly, update } = practice
  const inExample = mode === 'example' && example !== undefined
  const answer = inExample ? exampleAnswer(example) : attempt.decide
  const requested = inExample ? example.requestedIds : attempt.investigate.requests.map((r) => r.requestId)
  const submission = content.submission
  const showSubmission = submission !== undefined && (!inExample || example.submission !== undefined)
  const valid = answer.optionId !== null && (answer.optionId !== 'own' || answer.ownPlan.trim() !== '')

  const edit = (recipe: (decide: DecideAnswer) => void) => update((a) => recipe(a.decide))

  // Submit stays focusable while it can't be used (aria-disabled), so its reason can be heard.
  const submit = () => {
    if (!valid) return
    submitAttempt(caseId)
    window.location.hash = casePageHref(caseId, 'reflect')
  }

  let finish = (
    <div className="jr-decide__submit">
      <p id="jr-decide-next" className="jr-decide__next">
        {valid ? nextCallText(caseId) : 'Choose an option, or write your own plan'}
      </p>
      <button
        type="button"
        className="btn btn--primary"
        aria-disabled={!valid || undefined}
        aria-describedby="jr-decide-next"
        onClick={submit}
      >
        Submit
      </button>
    </div>
  )
  if (inExample) {
    finish = (
      <div className="jr-decide__submit">
        <p className="jr-decide__next">That’s the whole example</p>
        <a className="btn btn--primary" href={caseHref(caseId, 'define')} onClick={() => startPractice(content)}>
          Start practice
          <NextArrow />
        </a>
      </div>
    )
  } else if (readOnly) {
    finish = (
      <div className="jr-decide__submit">
        <p className="jr-decide__next">Submitted</p>
        <a className="btn btn--primary" href={casePageHref(caseId, 'reflect')}>
          See your feedback
          <NextArrow />
        </a>
      </div>
    )
  }

  return (
    <CaseFrame
      caseId={caseId}
      step="decide"
      className="jr-decide"
      practice={practice}
      actions={
        <>
          <a className="btn btn--secondary" href={caseHref(caseId, 'investigate')}>
            <BackArrow />
            Back
          </a>
          {finish}
        </>
      }
    >
      <h2 className="title title--md jr-decide__title">Make your call</h2>
      <div className="jr-decide__grid">
        <div className="jr-options">
          <DecideOptions
            content={content}
            choice={answer.optionId}
            ownPlan={answer.ownPlan}
            showOwn={!inExample || answer.optionId === 'own'}
            readOnly={readOnly}
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
            requested={requested}
            selected={answer.basedOn}
            exampleText={inExample ? example.basedOn : undefined}
            readOnly={readOnly}
            onChange={(basedOn) =>
              edit((decide) => {
                decide.basedOn = basedOn
              })
            }
          />
        </div>
        <DecideReasoning answer={answer} planFields={!inExample} readOnly={readOnly} onEdit={edit} />
      </div>
      {showSubmission && (
        <DecideSubmission
          submission={submission}
          values={answer.fields}
          readOnly={readOnly}
          onChange={(id, value) =>
            edit((decide) => {
              decide.fields[id] = value
            })
          }
        />
      )}
    </CaseFrame>
  )
}
