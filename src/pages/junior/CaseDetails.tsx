import { useState } from 'react'
import { caseHref, casePageHref, FICTIONAL_LABEL, ROUTES, type CaseSummary } from '../../contracts/types'
import { CASE_SUMMARIES, getCase, getPerson, getTeam, isPlayable, skillLabel } from '../../lib/content'
import { useCaseId } from '../../lib/router'
import { DetailsModes, type Mode } from './DetailsModes'
import { DetailsPreview } from './DetailsPreview'
import { BackArrow, NextArrow } from './icons'
import { exampleOf, startPractice, useCurrentAttempt, viewExample } from './practice'
import { enterRoom, useCurrentRoom } from './room'
import './CaseFrame.css'
import './CaseDetails.css'

// A case's details page (new, no design image; built like Define): what the case is, then how
// to practise it. A playable case offers its modes, 'View example' when it has an example, and
// 'Start practice'. A case that isn't playable yet shows a Preview instead.
export function CaseDetails() {
  const caseId = useCaseId()
  const [mode, setMode] = useState<Mode>('individual')
  const attempt = useCurrentAttempt(caseId)
  const room = useCurrentRoom(caseId)
  // The role to play in the room: the one chosen here, else the one of a session in progress.
  const [chosenRole, setChosenRole] = useState<string>()
  const summary = CASE_SUMMARIES.find((s) => s.id === caseId)
  if (!summary) return null

  const content = isPlayable(caseId) ? getCase(caseId) : undefined
  const example = content && exampleOf(content)
  const inProgress = attempt?.status === 'in-progress'
  const roleId = chosenRole ?? (room?.status === 'in-progress' ? room.roleId : content?.room?.humanRoleId) ?? ''

  let actions = <p className="jr-details__note">Practice for this case isn’t open yet.</p>
  if (content && mode === 'team') {
    actions = (
      <a className="btn btn--primary" href={casePageHref(caseId, 'room')} onClick={() => enterRoom(content, roleId)}>
        Enter the room
        <NextArrow />
      </a>
    )
  } else if (content) {
    actions = (
      <div className="jr-details__start">
        {example && (
          <a className="btn btn--secondary" href={caseHref(caseId, 'define')} onClick={() => viewExample(caseId)}>
            View example
          </a>
        )}
        <a className="btn btn--primary" href={caseHref(caseId, 'define')} onClick={() => startPractice(content)}>
          {inProgress ? 'Continue practice' : 'Start practice'}
          <NextArrow />
        </a>
      </div>
    )
  }

  return (
    <div className="jr-case jr-details">
      <header className="jr-case__header">
        <p className="eyebrow eyebrow--sm jr-case__eyebrow">{eyebrowOf(summary)}</p>
        <h1 className="title title--lg jr-case__title">{summary.title}</h1>
        <p className="jr-details__labels">
          <span className="badge badge--neutral">{FICTIONAL_LABEL}</span>
          {!content && <span className="badge badge--warn">Preview</span>}
        </p>
      </header>
      <div className="jr-case__body jr-details__body">
        <div className="jr-details__grid">
          <About summary={summary} fallbackText={content?.brief} submits={content?.submission?.name} />
          {content ? (
            <DetailsModes
              content={content}
              mode={mode}
              onMode={setMode}
              example={!!example}
              attempt={attempt}
              roleId={roleId}
              onRole={setChosenRole}
            />
          ) : (
            <DetailsPreview summary={summary} />
          )}
        </div>
      </div>
      <div className="jr-case__actions">
        <a className="btn btn--secondary" href={ROUTES.juniorHome}>
          <BackArrow />
          Case library
        </a>
        {actions}
      </div>
    </div>
  )
}

// 'SOLUTIONS · FROM DANA K.', or only the team when the case has no author yet.
function eyebrowOf({ teamId, authorId }: CaseSummary): string {
  const team = getTeam(teamId).label
  return (authorId ? `${team} · from ${getPerson(authorId).name}` : team).toUpperCase()
}

type AboutProps = { summary: CaseSummary; fallbackText?: string; submits?: string }

// 'About this case': the blurb (or the brief), your role, what you will submit, the time it
// takes, and the skills it trains.
function About({ summary, fallbackText, submits }: AboutProps) {
  const skillIds = summary.skillIds ?? (isPlayable(summary.id) ? getCase(summary.id).skillIds : [])
  const skills = skillIds.map((id) => ({ id, label: skillLabel(id) }))
  const facts = [
    ['Your role', summary.yourRole],
    ['You will submit', summary.submits ?? submits],
    ['Time', isPlayable(summary.id) && summary.minutes ? `About ${summary.minutes} min` : undefined],
  ].filter(([, value]) => value) as [string, string][]
  const text = summary.blurb ?? fallbackText ?? 'A description of this case is still being written.'

  return (
    <section className="card jr-about" aria-labelledby="jr-about-title">
      <h2 id="jr-about-title" className="title title--sm jr-about__title">
        About this case
      </h2>
      <p className="jr-about__text">{text}</p>
      {facts.length > 0 && (
        <dl className="jr-about__facts">
          {facts.map(([label, value]) => (
            <div key={label} className="jr-about__fact">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {skills.length > 0 && (
        <div className="field jr-about__skills">
          <span id="jr-about-skills" className="field__label">
            Skills to practise
          </span>
          <ul className="jr-chips" aria-labelledby="jr-about-skills">
            {skills.map((skill) => (
              <li key={skill.id} className="chip">
                {skill.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
