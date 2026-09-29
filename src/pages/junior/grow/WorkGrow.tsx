import { useEffect, useRef, useState } from 'react'
import { ROUTES } from '../../../contracts/types'
import { Arrow } from '../../../components/Arrow'
import { Page } from '../../../components/Page'
import { toast } from '../../../components/toast'
import { getStore, newId, setStore, useStore } from '../../../lib/records'
import { LEARNER_ID, nowIso } from './growContent'
import { StepFocus } from './StepFocus'
import { StepPractise } from './StepPractise'
import { StepReasoning } from './StepReasoning'
import { StepRecord } from './StepRecord'
import { StepWork } from './StepWork'
import { blankReview, buildGrowthRecord, editReview, STEP_LETTERS, STEP_NAMES, suggestedFocus, WORK_STEPS, type Edit, type WorkStep } from './workReview'
import './grow.css'
import './WorkGrow.css'
import './WorkGrowSteps.css'

// The learner's latest own review, so the page resumes where they left it.
function latestReviewId(): string | null {
  const mine = getStore().workReviews.filter((r) => r.learnerId === LEARNER_ID && r.source === 'user')
  mine.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return mine[0]?.id ?? null
}

// Each step's heading, where focus lands after Next, Back and the other step-changing buttons.
const STEP_HEADINGS: Record<WorkStep, string> = {
  review: 'wg-work-title',
  reasoning: 'wg-reasoning-title',
  focus: 'wg-focus-title',
  practise: 'wg-challenge-title',
  done: 'wg-record-title',
}

// Why the forward button is not ready yet, read with it (aria-describedby).
const WAITING: Record<WorkStep, string> = {
  review: 'To continue, fill in The task and What I sent.',
  reasoning: "To continue, fill in What I changed, What I checked or What I'm still unsure about.",
  focus: 'To continue, answer Is this right? If you chose Correct it, send the correction.',
  practise: 'To continue, answer the practice challenge and fill in My next action.',
  done: '',
}

// Work & Grow (#/junior/grow): A–D on one piece of the learner's work, then E, the growth record.
export function WorkGrow() {
  const reviews = useStore((s) => s.workReviews)
  const [id, setId] = useState(() => latestReviewId() ?? newId('work'))
  const review = reviews.find((r) => r.id === id) ?? blankReview(id, LEARNER_ID)
  const [shown, setShown] = useState<WorkStep>(review.step)
  const [enter, setEnter] = useState<'enter-next' | 'enter-back'>('enter-next')
  const edit: Edit = (recipe) => editReview(id, LEARNER_ID, recipe)
  const moved = useRef(false)

  const shownAt = WORK_STEPS.indexOf(shown)
  const reachedAt = WORK_STEPS.indexOf(review.step)

  // The pressed button is gone or changed, so focus moves to the new step's heading.
  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    document.getElementById(STEP_HEADINGS[shown])?.focus({ preventScroll: true })
  }, [id, shown])

  // focus: true for buttons that disappear or change with the step (Next, Back and the like);
  // the step bar's buttons stay, so they keep focus.
  function show(step: WorkStep, focus = false) {
    setEnter(WORK_STEPS.indexOf(step) < WORK_STEPS.indexOf(shown) ? 'enter-back' : 'enter-next')
    setShown(step)
    moved.current = focus
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  function advance(step: WorkStep) {
    edit((r) => {
      if (WORK_STEPS.indexOf(r.step) < WORK_STEPS.indexOf(step)) r.step = step
      if (step === 'focus' && !r.focus.adjusted) Object.assign(r.focus, suggestedFocus(r.work))
    })
    show(step, true)
  }

  function createRecord() {
    const recordId = newId('gr')
    setStore((draft) => {
      const r = draft.workReviews.find((x) => x.id === id)
      if (!r) return
      draft.growth.push(buildGrowthRecord(r, recordId))
      r.growthRecordId = recordId
      r.step = 'done'
      r.updatedAt = nowIso()
    })
    show('done', true)
    toast('Growth record saved to My Growth')
  }

  function startAnother() {
    setId(newId('work'))
    show('review', true)
  }

  const ready: Record<WorkStep, boolean> = {
    review: review.work.context.trim() !== '' && review.work.finalVersion.trim() !== '',
    reasoning: [review.reasoning.changed, review.reasoning.verified, review.reasoning.uncertain].some((t) => t.trim() !== ''),
    focus: review.focus.response !== null,
    practise: review.practise.answer.trim() !== '' && review.practise.nextAction.trim() !== '',
    done: true,
  }
  const next = WORK_STEPS[shownAt + 1]
  // Not ready: the button stays focusable (aria-disabled) and its reason is linked to it.
  const blocked = !ready[shown]
  const waiting = blocked ? { 'aria-disabled': true, 'aria-describedby': 'wg-next-reason' } : {}

  const back =
    shownAt > 0 ? (
      <button type="button" className="btn btn--secondary" onClick={() => show(WORK_STEPS[shownAt - 1], true)}>
        <Arrow back /> Back
      </button>
    ) : (
      <span />
    )

  let forward
  if (shown === 'done') {
    forward = (
      <div className="wg__done-actions">
        <button type="button" className="btn btn--secondary" onClick={startAnother}>
          Review another piece of work
        </button>
        <a className="btn btn--primary" href={ROUTES.juniorGrowth}>
          Open My Growth <Arrow />
        </a>
      </div>
    )
  } else if (shown === 'practise' && !review.growthRecordId) {
    forward = (
      <button type="button" className="btn btn--primary" {...waiting} onClick={() => blocked || createRecord()}>
        Create growth record <Arrow />
      </button>
    )
  } else {
    forward = (
      <button type="button" className="btn btn--primary" {...waiting} onClick={() => blocked || advance(next)}>
        Next <Arrow />
      </button>
    )
  }

  return (
    <Page
      className="wg gr-page"
      title="Work & Grow"
      subtitle="AI drafted it. You decided what to send. Casebook looks at the difference: what you changed, checked and still doubt."
      actions={
        <>
          {back}
          {blocked && (
            <span id="wg-next-reason" className="visually-hidden">
              {WAITING[shown]}
            </span>
          )}
          {forward}
        </>
      }
    >
      <nav className="steps wg-steps" aria-label="Work & Grow steps">
        {WORK_STEPS.map((step, i) => {
          const label = (
            <>
              {STEP_LETTERS[step]}
              <span className="wg-steps__name"> · {STEP_NAMES[step]}</span>
            </>
          )
          if (i > reachedAt) {
            return (
              <span key={step} className="steps__item" data-state="todo">
                {label}
              </span>
            )
          }
          return (
            <button
              key={step}
              type="button"
              className="steps__item"
              data-state={i === shownAt ? 'current' : 'done'}
              aria-current={i === shownAt ? 'step' : undefined}
              aria-label={`${STEP_LETTERS[step]} · ${STEP_NAMES[step]}`}
              onClick={() => show(step)}
            >
              {label}
            </button>
          )
        })}
      </nav>
      <div className={`wg__body ${enter}`} key={`${id}-${shown}`}>
        {shown === 'review' && <StepWork review={review} edit={edit} />}
        {shown === 'reasoning' && <StepReasoning review={review} edit={edit} />}
        {shown === 'focus' && <StepFocus review={review} edit={edit} />}
        {shown === 'practise' && <StepPractise review={review} edit={edit} />}
        {shown === 'done' && <StepRecord review={review} />}
      </div>
    </Page>
  )
}
