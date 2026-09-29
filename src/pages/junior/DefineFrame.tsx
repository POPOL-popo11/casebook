import type { CaseContent } from '../../contracts/types'
import { ChipList } from './ChipList'
import { IconQuestion } from './icons'
import type { Practice } from './practice'
import './fields.css'

const SUCCESS_HINTS = ['One sign of success', 'Another sign of success']

// The 'Frame the task' card on Define (05). In practice mode the goal, what success looks like
// and the people involved are the learner's own, saved to their attempt as they type; the
// example shows its answers, read-only.
export function DefineFrame({ content, practice }: { content: CaseContent; practice: Practice }) {
  const { mode, example, attempt, readOnly, update } = practice
  const view = mode === 'example' && example ? example : attempt.define
  const success = [...view.success, '', ''].slice(0, Math.max(2, view.success.length))

  const editSuccess = (index: number, value: string) =>
    update((a) => {
      const next = [...a.define.success, '', ''].slice(0, Math.max(2, a.define.success.length))
      next[index] = value
      a.define.success = next
    })

  return (
    <section className="card jr-frame" aria-labelledby="jr-frame-title">
      <h2 id="jr-frame-title" className="title title--sm jr-frame__title">
        Frame the task
      </h2>
      <div className="field jr-frame__field">
        <label className="field__label" htmlFor="jr-goal">
          Goal
        </label>
        <textarea
          id="jr-goal"
          className="textarea jr-line"
          rows={1}
          placeholder="What must this work achieve?"
          readOnly={readOnly}
          value={view.goal}
          onChange={(e) => {
            const value = e.target.value
            update((a) => {
              a.define.goal = value
            })
          }}
        />
      </div>
      <div className="field jr-frame__field" role="group" aria-labelledby="jr-success">
        <span id="jr-success" className="field__label">
          Success looks like
        </span>
        <div className="jr-frame__pair">
          {success.map((value, i) => (
            <textarea
              key={i}
              className="textarea jr-line"
              rows={1}
              aria-label={`Success looks like, point ${i + 1}`}
              placeholder={SUCCESS_HINTS[i]}
              readOnly={readOnly}
              value={value}
              onChange={(e) => editSuccess(i, e.target.value)}
            />
          ))}
        </div>
      </div>
      <div className="jr-frame__lists">
        <div className="field jr-frame__list">
          <span id="jr-constraints" className="field__label">
            Constraints
          </span>
          <ul className="jr-chips" aria-labelledby="jr-constraints">
            {content.constraints.map(({ label, known }) => (
              <li key={label} className={known ? 'chip' : 'chip chip--dashed'}>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="field jr-frame__list">
          <span id="jr-people" className="field__label">
            People involved
          </span>
          <ChipList
            items={view.people}
            labelledBy="jr-people"
            chipClass="chip"
            addLabel="Add a person"
            readOnly={readOnly}
            onChange={(people) =>
              update((a) => {
                a.define.people = people
              })
            }
          />
        </div>
      </div>
      <div className="callout jr-frame__callout">
        <IconQuestion className="jr-frame__question" />
        <p>{content.framePrompt}</p>
      </div>
    </section>
  )
}
