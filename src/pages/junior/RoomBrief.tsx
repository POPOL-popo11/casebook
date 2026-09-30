import type { RoomSession } from '../../contracts/records'
import type { CaseRole, RoomScript } from '../../contracts/types'
import { byId, useFocusAfter } from './focusAfter'
import type { RoomUpdate } from './room'
import { shareFact } from './room'
import { aiRolesFor } from './roomScript'

type RoomBriefProps = {
  roles: CaseRole[]
  script: RoomScript
  session: RoomSession
  // Sharing needs the initial position first, and nothing changes once submitted.
  canTalk: boolean
  update: RoomUpdate
}

export const initialsOf = (title: string) =>
  title
    .split(/\s+/)
    .map((word) => word[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

// 'My role brief' and 'Participants' in the Decision Room's left column. What only the learner's
// role knows can be shared with everyone; it then joins the shared evidence with its source.
export function RoomBrief({ roles, script, session, canTalk, update }: RoomBriefProps) {
  const mine = roles.find((role) => role.id === session.roleId)
  const shared = new Set(session.sharedEvidence.filter((e) => e.sourceRoleId === session.roleId).map((e) => e.text))
  const ai = aiRolesFor(script, session.roleId)
  const others = roles.filter((role) => ai.includes(role.id))
  // Share is replaced by the Shared badge, which takes focus; any answer is announced in Discussion.
  const focusAfter = useFocusAfter()

  return (
    <>
      {mine && (
        <section className="card jr-room-card" aria-labelledby="jr-brief-role">
          <p className="eyebrow eyebrow--sm jr-room-card__eyebrow">My role brief</p>
          <h2 id="jr-brief-role" className="title title--sm jr-room-card__title">
            {mine.title}
          </h2>
          <p className="jr-room-card__text">{mine.goal}</p>
          <p className="jr-room-card__label">What only you know</p>
          <ul className="jr-knows">
            {mine.knows.map((fact, i) => (
              <li key={fact} className="jr-knows__item">
                <span>{fact}</span>
                {shared.has(fact) ? (
                  <span id={`jr-shared-${i}`} className="badge badge--accent" tabIndex={-1}>
                    Shared
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm jr-knows__share"
                    disabled={!canTalk}
                    onClick={() => {
                      focusAfter(byId(`jr-shared-${i}`))
                      shareFact(update, script, fact)
                    }}
                  >
                    Share<span className="visually-hidden"> with everyone: {fact}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
          <dl className="jr-room-rows">
            <div>
              <dt>Limits</dt>
              <dd>{mine.limits}</dd>
            </div>
            <div>
              <dt>You can negotiate</dt>
              <dd>{mine.canNegotiate}</dd>
            </div>
            <div>
              <dt>Not yours to decide</dt>
              <dd>{mine.cannotDecide}</dd>
            </div>
          </dl>
        </section>
      )}
      <section className="card jr-room-card" aria-labelledby="jr-participants">
        <h2 id="jr-participants" className="title title--sm jr-room-card__title">
          Participants
        </h2>
        <ul className="jr-people">
          {[...(mine ? [mine] : []), ...others].map((role) => (
            <li key={role.id} className="jr-people__item">
              <span className={role.id === session.roleId ? 'avatar avatar--accent' : 'avatar'} aria-hidden="true">
                {initialsOf(role.title)}
              </span>
              <span className="jr-people__name">{role.title}</span>
              {role.id === session.roleId ? (
                <span className="badge badge--accent">You · human</span>
              ) : (
                <span className="badge badge--neutral">AI role</span>
              )}
            </li>
          ))}
        </ul>
        <p className="jr-room-card__note">
          AI roles answer only from their own brief. Their answers are preset and marked Demo response.
        </p>
      </section>
    </>
  )
}
