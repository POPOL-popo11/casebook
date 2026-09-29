import type { ReactNode } from 'react'
import type { DecideAnswer } from '../../contracts/records'
import type { CaseContent } from '../../contracts/types'
import { IconArrowUp, IconCheckCircle, IconPen } from './icons'
import './fields.css'

type Choice = NonNullable<DecideAnswer['optionId']>

type DecideOptionsProps = {
  content: CaseContent
  choice: DecideAnswer['optionId']
  ownPlan: string
  // Practice always offers the learner's own plan; the example shows it only when it chose one.
  showOwn: boolean
  readOnly: boolean
  onChoose: (choice: Choice) => void
  onOwnPlan: (plan: string) => void
}

// 'Make your call' on Decide (08): the case's options, lettered by id, 'Escalate to a senior',
// and the learner's own or conditional plan, one selected at a time. Choosing the own plan
// opens a field for it under the list.
export function DecideOptions({ content, choice, ownPlan, showOwn, readOnly, onChoose, onOwnPlan }: DecideOptionsProps) {
  const option = (id: Choice, className: string, mark: ReactNode, label: string, tradeoff: string) => (
    <button
      key={id}
      type="button"
      className={`option ${className}`}
      aria-pressed={choice === id}
      aria-disabled={readOnly || undefined}
      onClick={() => {
        if (!readOnly) onChoose(id)
      }}
    >
      <span className="option__letter">{mark}</span>
      <span className="jr-option__text">
        <span className="jr-option__label">{label}</span>
        <span className="jr-option__tradeoff">{tradeoff}</span>
      </span>
      {choice === id && <IconCheckCircle className="jr-option__check" />}
    </button>
  )

  return (
    <>
      <div className="jr-options__list" role="group" aria-label="Your call">
        {content.options.map((o) => option(o.id, 'jr-option', o.id, o.label, o.tradeoff))}
        {option(
          'escalate',
          'card--dashed jr-option jr-option--escalate',
          <IconArrowUp />,
          'Escalate to a senior',
          'Beyond what I should decide alone',
        )}
        {showOwn &&
          option(
            'own',
            'card--dashed jr-option jr-option--escalate',
            <IconPen />,
            'My own or conditional plan',
            'Write your own plan, or set conditions on one of these',
          )}
      </div>
      {choice === 'own' && (
        <div className="field jr-own">
          <label className="field__label" htmlFor="jr-own-plan">
            Your plan
          </label>
          <textarea
            id="jr-own-plan"
            className="textarea jr-grow jr-own__plan"
            rows={3}
            placeholder="What you would do, and on what conditions"
            readOnly={readOnly}
            value={ownPlan}
            onChange={(e) => onOwnPlan(e.target.value)}
          />
        </div>
      )}
    </>
  )
}
