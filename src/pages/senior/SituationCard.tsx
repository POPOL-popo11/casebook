import type { CaseSummary } from '../../contracts/types'
import { getTeam, TEAMS } from '../../lib/content'

// 02 · Situation: editable title, team and background, prefilled from the case.
export function SituationCard({ summary, background }: { summary: CaseSummary; background: string }) {
  return (
    <section className="card share__card" aria-labelledby="share-situation">
      <h2 id="share-situation" className="title title--sm share__card-title">
        Situation
      </h2>
      <div className="share__pair">
        <div className="field">
          <label className="field__label" htmlFor="share-title">
            Title
          </label>
          <input id="share-title" className="input" defaultValue={summary.title} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="share-team">
            Team
          </label>
          <select id="share-team" className="select" defaultValue={getTeam(summary.teamId).label}>
            {TEAMS.map((team) => (
              <option key={team.id}>{team.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label className="field__label" htmlFor="share-background">
          Background
        </label>
        <textarea
          id="share-background"
          className="textarea share__textarea share__textarea--grow"
          rows={3}
          defaultValue={background}
        />
      </div>
    </section>
  )
}
