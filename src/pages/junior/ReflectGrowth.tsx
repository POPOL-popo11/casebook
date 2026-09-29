import { ROUTES } from '../../contracts/types'
import { skillLabel } from '../../lib/content'
import { levelLabel, OUTCOME_LABELS } from '../../lib/labels'
import { useStore } from '../../lib/records'
import { NextArrow } from './icons'
import { editGrowth } from './reflect'
import './JuniorReflect.css'
import './ReflectParts.css'
import './fields.css'

// 'Added to My Growth' on Reflect and in the Decision Room: the practice growth record made once
// for the attempt or room, its honest values shown as they are, and the two things only the
// learner can write.
export function ReflectGrowth({ recordId }: { recordId?: string }) {
  const record = useStore((store) => store.growth.find((g) => g.id === recordId))
  if (!record) return null

  return (
    <section className="card jr-side" aria-labelledby="jr-growth-title">
      <h2 id="jr-growth-title" className="title title--sm jr-reflect__cardtitle">
        Added to My Growth
      </h2>
      <p className="jr-side__text">
        Saved as practice evidence for {skillLabel(record.skillId)}. You choose later whether to share it.
      </p>
      <ul className="jr-chips jr-side__chips">
        <li className="badge badge--neutral">{OUTCOME_LABELS[record.outcome]}</li>
        <li className="badge badge--neutral">{levelLabel(record.level)}</li>
        <li className="badge badge--neutral">{record.prompting === 'none' ? 'No prompting' : 'Some prompting'}</li>
      </ul>
      <div className="field jr-side__field">
        <label className="field__label" htmlFor="jr-growth-learning">
          What I learned
        </label>
        <textarea
          id="jr-growth-learning"
          className="textarea jr-grow"
          rows={3}
          value={record.learning}
          onChange={(e) => editGrowth(record.id, 'learning', e.target.value)}
        />
      </div>
      <div className="field jr-side__field">
        <label className="field__label" htmlFor="jr-growth-next">
          My next step
        </label>
        <textarea
          id="jr-growth-next"
          className="textarea jr-line"
          rows={1}
          value={record.nextStep}
          onChange={(e) => editGrowth(record.id, 'nextStep', e.target.value)}
        />
      </div>
      <a className="btn btn--link jr-side__link" href={ROUTES.juniorGrowth}>
        Open My Growth
        <NextArrow />
      </a>
    </section>
  )
}
