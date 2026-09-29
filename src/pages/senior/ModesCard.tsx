import type { CaseContent, CaseSummary, PracticeMode } from '../../contracts/types'
import { skillLabel } from '../../lib/content'

const MODE_LABELS: Record<PracticeMode, string> = { individual: 'Individual practice', team: 'Team Decision Room' }

// 02 · Modes and skills (overnight): how learners can practise the case, what they submit and
// which skills it trains.
export function ModesCard({ summary, content }: { summary: CaseSummary; content: CaseContent }) {
  const modes = summary.modes ?? []
  const skills = summary.skillIds ?? content.skillIds

  return (
    <section className="card share__card" aria-labelledby="share-modes">
      <h2 id="share-modes" className="title title--sm share__card-title">
        Modes and skills
      </h2>
      <p className="field__label share__sub">Modes</p>
      <ul className="share__chips">
        {modes.length === 0 ? (
          <li className="chip chip--dashed">None yet</li>
        ) : (
          modes.map((mode) => (
            <li key={mode} className="chip">
              {MODE_LABELS[mode]}
            </li>
          ))
        )}
      </ul>
      {content.submission && (
        <>
          <p className="field__label share__sub">They submit</p>
          <p className="share__text">
            {content.submission.name}: {content.submission.fields.map((f) => f.label).join(', ')}
          </p>
        </>
      )}
      <p className="field__label share__sub">Skills</p>
      <ul className="share__chips">
        {skills.map((id) => (
          <li key={id} className="chip chip--outline">
            {skillLabel(id)}
          </li>
        ))}
      </ul>
    </section>
  )
}
