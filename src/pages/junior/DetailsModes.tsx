import type { PracticeAttempt } from '../../contracts/records'
import { casePageHref, type CaseContent } from '../../contracts/types'
import { IconCheckCircle, NextArrow } from './icons'

export type Mode = 'individual' | 'team'

type DetailsModesProps = {
  content: CaseContent
  mode: Mode
  onMode: (mode: Mode) => void
  example: boolean
  attempt?: PracticeAttempt
}

// 'Practise it' on a playable case's details page: Individual practice, and the Team Decision
// Room when the case has one. The note under them says what the buttons below will do.
export function DetailsModes({ content, mode, onMode, example, attempt }: DetailsModesProps) {
  const roles = content.roles ?? []
  const roleTitle = (id: string) => roles.find((role) => role.id === id)?.title ?? id
  const room = content.room

  return (
    <section className="card jr-modes" aria-labelledby="jr-modes-title">
      <h2 id="jr-modes-title" className="title title--sm jr-modes__title">
        How do you want to practise?
      </h2>
      <div className="jr-modes__list" role="group" aria-label="Practice mode">
        <ModeOption
          pressed={mode === 'individual'}
          label="Individual practice"
          line="Work through Define, Examine, Investigate and Decide on your own"
          onPress={() => onMode('individual')}
        />
        {room && (
          <ModeOption
            pressed={mode === 'team'}
            label="Team Decision Room"
            line={`You play the ${roleTitle(room.humanRoleId)}. ${listText(room.aiRoleIds.map(roleTitle))} ${
              room.aiRoleIds.length === 1 ? 'is an AI role' : 'are AI roles'
            }.`}
            onPress={() => onMode('team')}
          />
        )}
      </div>
      {mode === 'team' ? (
        <p className="jr-modes__note">
          The AI roles answer only from their own brief. Their answers are preset and marked Demo response.
        </p>
      ) : attempt && attempt.status !== 'in-progress' ? (
        <p className="jr-modes__note">
          You have submitted this case.{' '}
          <a className="btn btn--link jr-modes__link" href={casePageHref(content.id, 'reflect')}>
            See your feedback
            <NextArrow />
          </a>{' '}
          Start practice again for a new, blank attempt.
        </p>
      ) : (
        <p className="jr-modes__note">
          {attempt
            ? 'You have a practice in progress. Continue it where you left off.'
            : 'Start practice gives you a blank answer to fill in.'}
          {example && ' View example shows a worked attempt, read-only.'}
        </p>
      )}
    </section>
  )
}

type ModeOptionProps = { pressed: boolean; label: string; line: string; onPress: () => void }

function ModeOption({ pressed, label, line, onPress }: ModeOptionProps) {
  return (
    <button type="button" className="option jr-mode" aria-pressed={pressed} onClick={onPress}>
      <span className="jr-mode__text">
        <span className="jr-mode__label">{label}</span>
        <span className="jr-mode__line">{line}</span>
      </span>
      {pressed && <IconCheckCircle className="jr-mode__check" />}
    </button>
  )
}

// ['Engineering Lead', 'Operations Lead'] → 'Engineering Lead and Operations Lead'
function listText(items: string[]): string {
  return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
