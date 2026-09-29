import { DemoTag } from '../../components/DemoTag'
import type { Feedback, GrowthRecord } from '../../contracts/records'
import type { EvidenceLevel, SkillId } from '../../contracts/types'
import { firstName, getPerson, JUNIOR_PROFILE, skillLabel } from '../../lib/content'
import { levelLabel } from '../../lib/labels'
import { useStore } from '../../lib/records'
import { LEARNER_ID } from './practice'
import './HomeAside.css'

const LEVEL_TONES: Record<EvidenceLevel, string> = {
  independent: 'badge--accent',
  prompted: 'badge--accent',
  practice: 'badge--warn',
  'not-observed': 'badge--neutral',
}

const latest = <T,>(items: T[], at: (item: T) => string): T | undefined =>
  items.reduce<T | undefined>((last, item) => (!last || at(item) >= at(last) ? item : last), undefined)

// The right column on Home (04): 'Your skills' and the latest feedback, both from the store. A
// skill shows the evidence level of the learner's latest growth record for it, or 'Not observed';
// never a score. Anything that came with the demo seed carries the Demo data label.
export function HomeAside() {
  const growth = useStore((store) => store.growth)
  const feedback = useStore((store) => store.feedback)
  const records = growth.filter((record) => record.learnerId === LEARNER_ID)
  const lastRecord = (skillId: SkillId): GrowthRecord | undefined =>
    latest(
      records.filter((record) => record.skillId === skillId),
      (record) => record.date,
    )
  const lastFeedback: Feedback | undefined = latest(
    feedback.filter((item) => item.toId === LEARNER_ID),
    (item) => item.at,
  )
  const from = lastFeedback && getPerson(lastFeedback.fromId)

  return (
    <aside className="jr-aside">
      <section className="card jr-skills" aria-labelledby="jr-skills-title">
        <h2 id="jr-skills-title" className="title jr-skills__title">
          Your skills
        </h2>
        <p className="jr-skills__note">
          Levels come only from your Team Lead or your own confirmation, never from practice scores.
        </p>
        <ul className="jr-skills__list">
          {JUNIOR_PROFILE.skills.map(({ skillId, focus }) => {
            const record = lastRecord(skillId)
            const level = record?.level ?? 'not-observed'
            return (
              <li key={skillId} className="jr-skill">
                <p className="jr-skill__row">
                  <span>{skillLabel(skillId)}</span>
                  {focus && <span className="jr-skill__focus">Focus</span>}
                </p>
                <p className="jr-skill__level">
                  <span className={`badge ${LEVEL_TONES[level] ?? 'badge--neutral'}`}>{levelLabel(level)}</span>
                  {record?.source === 'demo' && <DemoTag kind="data" />}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="jr-feedback" aria-labelledby="jr-feedback-title">
        {lastFeedback && from ? (
          <>
            <p className="jr-feedback__from">
              <span className="avatar avatar--accent jr-feedback__avatar" aria-hidden="true">
                {from.initials}
              </span>
              <span id="jr-feedback-title">{firstName(from)}'s feedback</span>
              {lastFeedback.source === 'demo' && <DemoTag kind="data" className="jr-feedback__demo" />}
            </p>
            <blockquote className="jr-feedback__quote">
              "{[lastFeedback.strength, lastFeedback.improvement].filter(Boolean).join(' ')}"
            </blockquote>
          </>
        ) : (
          <>
            <p id="jr-feedback-title" className="jr-feedback__from">
              Feedback
            </p>
            <p className="jr-feedback__none">Your Team Lead’s feedback appears here once you submit a case.</p>
          </>
        )}
      </section>
    </aside>
  )
}
