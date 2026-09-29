import { useEffect, useState, type ReactNode } from 'react'
import { DemoTag } from '../../components/DemoTag'
import { CASE_STEPS, caseHref, casePageHref, ROUTES, type CaseId, type CaseStep } from '../../contracts/types'
import { caseEyebrow, getSummary } from '../../lib/content'
import type { Practice } from './practice'
import './CaseFrame.css'

// The frame shared by the four case steps (05–08): the case header, the four-part
// progress, the step body and the action row pinned to the bottom of the canvas.
// In example mode a banner under the progress says it is the example, marked Demo data.
// Opened before the learner chose Start practice or View example, it sends them to the details page.
const STEP_LABELS: Record<CaseStep, string> = {
  define: 'Define',
  examine: 'Examine',
  investigate: 'Investigate',
  decide: 'Decide',
}

// The step shown last (its place in CASE_STEPS), so the next step body can enter from
// the right side. Reset when the case unmounts without another step taking over.
let lastStep: number | null = null

function enterClass(step: number): string {
  if (lastStep === step) return ''
  return lastStep === null || step > lastStep ? 'enter-next' : 'enter-back'
}

type CaseFrameProps = {
  caseId: CaseId
  step: CaseStep
  // The step body's own class, for its layout.
  className: string
  // Example or practice, and whether it can still be changed.
  practice: Practice
  actions: ReactNode
  children: ReactNode
}

export function CaseFrame({ caseId, step, className, practice, actions, children }: CaseFrameProps) {
  const at = CASE_STEPS.indexOf(step)
  const [enter] = useState(() => enterClass(at))
  const example = practice.mode === 'example'
  const submitted = !example && practice.readOnly

  useEffect(() => {
    lastStep = at
    return () => {
      lastStep = null
    }
  }, [at])

  // A step link opened before the learner chose how to practise: the details page asks first.
  const details = casePageHref(caseId, 'details')
  useEffect(() => {
    if (!practice.chosen) window.location.replace(details)
  }, [practice.chosen, details])

  if (!practice.chosen) return null

  return (
    <div className="jr-case">
      <header className="jr-case__header">
        <p className="eyebrow eyebrow--sm jr-case__eyebrow">{caseEyebrow(caseId)}</p>
        <div className="jr-case__titlerow">
          <h1 className="title title--lg jr-case__title">{getSummary(caseId).title}</h1>
          {submitted && <span className="badge badge--neutral jr-case__label">Submitted · read-only</span>}
          <a className="jr-case__exit" href={example ? details : ROUTES.juniorHome}>
            {example ? 'Exit example' : 'Save and exit'}
          </a>
        </div>
      </header>
      <nav className="steps jr-case__steps" aria-label="Case steps">
        {CASE_STEPS.map((item, i) => (
          <a
            key={item}
            className="steps__item"
            href={caseHref(caseId, item)}
            data-state={i < at ? 'done' : i === at ? 'current' : 'todo'}
            aria-current={i === at ? 'step' : undefined}
          >
            {i + 1} · {STEP_LABELS[item]}
          </a>
        ))}
      </nav>
      {example && (
        <div className="callout jr-case__banner" role="note">
          <p className="jr-case__banner-text">
            <strong>Example</strong> A worked attempt to learn from, read-only.
          </p>
          <DemoTag kind="data" />
        </div>
      )}
      <div className={`jr-case__body ${className} ${enter}`.trim()}>{children}</div>
      <div className="jr-case__actions">{actions}</div>
    </div>
  )
}
