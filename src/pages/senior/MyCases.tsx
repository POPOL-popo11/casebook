import type { CaseSummary, PracticeMode } from '../../contracts/types'
import { Page } from '../../components/Page'
import { CASE_SUMMARIES, isPlayable, personName, skillLabel, TEAMS } from '../../lib/content'
import { openExpertCase } from './expertCase'
import './MyCases.css'

const MODE_LABELS: Record<PracticeMode, string> = { individual: 'Individual practice', team: 'Team Decision Room' }

const teamLabel = (id: string) => TEAMS.find((t) => t.id === id)?.label ?? id
const modesText = (s: CaseSummary) => (s.modes?.length ? s.modes.map((m) => MODE_LABELS[m]).join(', ') : 'None yet')

// The header row is only for the eye (aria-hidden). Each cell names its own column to a screen
// reader instead, as 'Function: Solutions'.
function Label({ children }: { children: string }) {
  return <span className="visually-hidden">{`${children}: `}</span>
}

// The cells every row shares: the case, its function, modes, version and status.
function Cells({ summary, published }: { summary: CaseSummary; published: boolean }) {
  return (
    <>
      <span className="mc-row__case">
        <span className="mc-row__title">{summary.title}</span>
        <span className="mc-row__by">{summary.authorId ? `Shared by ${personName(summary.authorId)}` : 'No author yet'}</span>
      </span>
      <span className="mc-row__cell" data-label="Function">
        <Label>Function</Label>
        {teamLabel(summary.teamId)}
      </span>
      <span className="mc-row__cell" data-label="Modes">
        <Label>Modes</Label>
        {modesText(summary)}
      </span>
      <span className="mc-row__cell" data-label="Version">
        <Label>Version</Label>
        {summary.version ?? '—'}
      </span>
      <span className="mc-row__cell">
        <Label>Status</Label>
        <span className={`badge ${published ? 'badge--accent' : 'badge--warn'}`}>{published ? 'Published' : 'Preview'}</span>
      </span>
    </>
  )
}

// A Preview case isn't built as a playable case yet: its row opens to what is planned.
function PreviewDetails({ summary }: { summary: CaseSummary }) {
  const rows: [string, string | undefined][] = [
    ['In one line', summary.blurb],
    ['Learner’s role', summary.yourRole],
    ['They submit', summary.submits],
    ['Materials', summary.materialsPreview?.join('; ')],
    ['Roles in the team mode', summary.roleTitles?.join(', ')],
    ['Skills', summary.skillIds?.map(skillLabel).join(', ')],
  ]
  return (
    <dl className="mc-plan">
      {rows
        .filter((row): row is [string, string] => Boolean(row[1]))
        .map(([label, text]) => (
          <div key={label} className="mc-plan__row">
            <dt>{label}</dt>
            <dd>{text}</dd>
          </div>
        ))}
    </dl>
  )
}

// My Cases: every case in the library, published or in preview. A published case opens on
// Create a Case (Share, then Breakdown) to show how it is built.
export function MyCases() {
  return (
    <Page title="My Cases" subtitle="Every case in the library. Open a published case to see how it is built.">
      <section className="card mc-list" aria-label="Cases">
        <div className="mc-row mc-row--head" aria-hidden="true">
          <span>Case</span>
          <span>Function</span>
          <span>Modes</span>
          <span>Version</span>
          <span>Status</span>
          <span />
        </div>
        <ul className="mc-rows">
          {CASE_SUMMARIES.map((summary) => {
            const published = isPlayable(summary.id)
            return (
              <li key={summary.id}>
                {published ? (
                  <div className="mc-row">
                    <Cells summary={summary} published />
                    <span className="mc-row__action">
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => openExpertCase(summary.id)}>
                        Open
                      </button>
                    </span>
                  </div>
                ) : (
                  <details className="mc-preview">
                    <summary className="mc-row mc-row--summary">
                      <Cells summary={summary} published={false} />
                      <span className="mc-row__action mc-row__planned">What’s planned</span>
                    </summary>
                    <PreviewDetails summary={summary} />
                  </details>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </Page>
  )
}
