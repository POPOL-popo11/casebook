import { useEffect, useState } from 'react'
import { caseHref, casePageHref, ROUTES } from '../../contracts/types'
import { attemptAtVersion } from '../../lib/assessment'
import { caseEyebrow, getCase, getSummary } from '../../lib/content'
import { useStore } from '../../lib/records'
import { useCaseId } from '../../lib/router'
import { byId, useFocusAfter } from './focusAfter'
import { BackArrow, NextArrow } from './icons'
import { useCurrentAttempt } from './practice'
import { callText, ensureGrowthRecord } from './reflect'
import { ReflectAnswer } from './ReflectAnswer'
import { ReflectAside } from './ReflectAside'
import { ReflectFeedback } from './ReflectFeedback'
import { ReflectRevise } from './ReflectRevise'
import './CaseFrame.css'
import './JuniorReflect.css'
import './ReflectParts.css'

// After submitting (new, no design image; built from the case frame and cards): the app's
// feedback and any Team Lead feedback first, then the learner's answer (folded) with its versions;
// beside them the author's call, what happened, the changed-condition challenge, and the growth
// record this attempt made. Next to Done, a next step: the team room, or Work & Grow.
export function JuniorReflect() {
  const caseId = useCaseId()
  const content = getCase(caseId)
  const attempt = useCurrentAttempt(caseId)
  const done = attempt && attempt.status !== 'in-progress' ? attempt : undefined
  const feedback = useStore((store) =>
    store.feedback.filter((f) => done && f.about.kind === 'attempt' && f.about.id === done.id),
  )
  const [picked, setPicked] = useState<number | null>(null)
  const [revising, setRevising] = useState(false)
  // Opening the revise form focuses its heading; saving focuses the new revision's tab, and
  // Cancel goes back to 'Revise your answer'.
  const focusAfter = useFocusAfter()

  // The practice growth record is made once, the first time Reflect opens after submitting.
  useEffect(() => {
    if (done && !done.growthRecordId) ensureGrowthRecord(content)
  }, [content, done])

  const header = (
    <header className="jr-case__header">
      <p className="eyebrow eyebrow--sm jr-case__eyebrow">{caseEyebrow(caseId)}</p>
      <div className="jr-case__titlerow">
        <h1 className="title title--lg jr-case__title">{getSummary(caseId).title}</h1>
        <a className="jr-case__exit" href={ROUTES.juniorHome}>
          Case library
        </a>
      </div>
    </header>
  )

  if (!done) {
    return (
      <div className="jr-case jr-reflect">
        {header}
        <section className="card jr-reflect__empty">
          <h2 className="title title--sm jr-reflect__cardtitle">Nothing submitted yet</h2>
          <p>Feedback appears here once you submit your answer on Decide.</p>
          <a className="btn btn--primary" href={caseHref(caseId, 'decide')}>
            Go to Decide
            <NextArrow />
          </a>
        </section>
      </div>
    )
  }

  const version = Math.min(picked ?? done.versions.length - 1, done.versions.length - 1)
  const original = done.versions[0]
  const shown = done.versions[version]
  const changedCall =
    version > 0 && !!original && !!shown && callText(content, shown.decide) !== callText(content, original.decide)
  // What to do next: the same case with the team when it has a room, otherwise your own work.
  const next = content.room
    ? { href: casePageHref(caseId, 'room'), label: 'Next: try it with the team' }
    : { href: ROUTES.juniorGrow, label: 'Next: bring your own work' }

  return (
    <div className="jr-case jr-reflect">
      {header}
      <h2 className="title title--md jr-reflect__title">How did your call hold up?</h2>
      <div className="jr-reflect__grid">
        <div className="jr-reflect__main">
          <ReflectFeedback
            content={content}
            attempt={attemptAtVersion(done, version)}
            changedCall={changedCall}
            feedback={feedback}
          />
          {revising ? (
            <ReflectRevise
              content={content}
              attempt={done}
              onDone={(saved) => {
                focusAfter(byId(saved ? `jr-version-${done.versions.length}` : 'jr-revise-open'))
                setRevising(false)
                setPicked(null)
              }}
            />
          ) : (
            <ReflectAnswer
              content={content}
              attempt={done}
              version={version}
              onVersion={setPicked}
              onRevise={() => {
                focusAfter(byId('jr-revise-title'))
                setRevising(true)
              }}
            />
          )}
        </div>
        <ReflectAside content={content} attempt={done} />
      </div>
      <div className="jr-case__actions">
        <a className="btn btn--secondary" href={caseHref(caseId, 'decide')}>
          <BackArrow />
          Back to Decide
        </a>
        <div className="jr-reflect__next">
          <a className="btn btn--link" href={next.href}>
            {next.label}
            <NextArrow />
          </a>
          <a className="btn btn--primary" href={casePageHref(caseId, 'details')}>
            Done
            <NextArrow />
          </a>
        </div>
      </div>
    </div>
  )
}
