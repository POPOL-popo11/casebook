import { useState } from 'react'
import { casePageHref, type CaseSummary, type TeamId } from '../../contracts/types'
import { CASE_SUMMARIES, getPerson, getTeam, isPlayable, LIBRARY_TABS, RECOMMENDED_CASE_ID } from '../../lib/content'
import './HomeCases.css'

// 'All' (null), then the library's team tabs.
const TABS: (TeamId | null)[] = [null, ...LIBRARY_TABS]

// 'All' lists every case except the recommended one, which is the card above. A team tab
// lists every case of that team, the recommended one included. Both keep library order.
const MORE_CASES = CASE_SUMMARIES.filter((summary) => summary.id !== RECOMMENDED_CASE_ID)

function casesOn(tab: TeamId | null): CaseSummary[] {
  return tab === null ? MORE_CASES : CASE_SUMMARIES.filter((summary) => summary.teamId === tab)
}

// 'More cases' on Home (04): team tabs over a grid of case cards, filtered by the search too.
// Every card opens its case details page; a case that can't be played yet shows a Preview there.
export function HomeCases({ search }: { search: string }) {
  const [tab, setTab] = useState<TeamId | null>(null)
  const query = search.trim().toLowerCase()
  const shown = casesOn(tab).filter((summary) => summary.title.toLowerCase().includes(query))

  return (
    <section className="jr-cases" aria-labelledby="jr-cases-title">
      <div className="jr-cases__head">
        <h2 id="jr-cases-title" className="title jr-cases__title">
          More cases
        </h2>
        <div className="jr-tabs" role="group" aria-label="Team">
          {TABS.map((teamId) => (
            <button
              key={teamId ?? 'all'}
              type="button"
              className="jr-tabs__tab"
              aria-pressed={tab === teamId}
              onClick={() => setTab(teamId)}
            >
              {teamId ? getTeam(teamId).label : 'All'}
            </button>
          ))}
        </div>
      </div>
      <ul className="jr-cases__grid">
        {shown.map((summary) => (
          <li key={summary.id} className="jr-cases__item">
            <a className="card jr-casecard" href={casePageHref(summary.id, 'details')}>
              <CaseCardBody summary={summary} />
            </a>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="jr-cases__empty">No cases match.</p>}
    </section>
  )
}

// Inside a card: the team, and the minutes unless the case is in progress or only a Preview;
// the title and its one-line blurb (at most two lines); then the author when the case has one,
// and the progress when it has some.
function CaseCardBody({ summary }: { summary: CaseSummary }) {
  const { id, teamId, title, blurb, minutes, authorId, progress } = summary
  const author = authorId === undefined ? undefined : getPerson(authorId)
  return (
    <>
      <span className="jr-casecard__top">
        <span className="eyebrow jr-casecard__team">{getTeam(teamId).label.toUpperCase()}</span>
        {progress ? (
          <span className="jr-casecard__status">In progress</span>
        ) : !isPlayable(id) ? (
          <span className="badge badge--warn jr-casecard__preview">Preview</span>
        ) : (
          <span className="jr-casecard__time">{minutes} min</span>
        )}
      </span>
      <span className="title jr-casecard__title">{title}</span>
      {blurb && <span className="jr-casecard__blurb">{blurb}</span>}
      {author && (
        <span className="jr-casecard__author">
          <span className="avatar jr-casecard__avatar" aria-hidden="true">
            {author.initials}
          </span>
          {author.name}
        </span>
      )}
      {progress && (
        <span className="jr-casecard__progress">
          <span className="jr-casecard__bar" aria-hidden="true">
            {Array.from({ length: progress.of }, (_, i) => (
              <span key={i} className="jr-casecard__seg" data-on={i < progress.step ? 'true' : undefined} />
            ))}
          </span>
          <span className="jr-casecard__step">
            Step {progress.step} of {progress.of}
          </span>
        </span>
      )}
    </>
  )
}
