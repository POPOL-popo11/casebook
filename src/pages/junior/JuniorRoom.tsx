import { casePageHref, ROUTES, type CaseContent, type RoomScript } from '../../contracts/types'
import { caseEyebrow, getCase, getSummary } from '../../lib/content'
import { useCaseId } from '../../lib/router'
import { byId, useFocusAfter } from './focusAfter'
import { BackArrow, NextArrow } from './icons'
import { ReflectGrowth } from './ReflectGrowth'
import { submitRoom, useRoom } from './room'
import { RoomBoard } from './RoomBoard'
import { RoomBrief } from './RoomBrief'
import { RoomConflicts } from './RoomConflicts'
import { RoomDiscussion } from './RoomDiscussion'
import { RoomPosition } from './RoomPosition'
import { RoomRecommendation } from './RoomRecommendation'
import './CaseFrame.css'
import './JuniorRoom.css'
import './RoomTalk.css'

// The Team Decision Room (new, no design image; built from the case frame and cards). One human
// plays a role; the other roles are scripted AI roles whose every answer is marked Demo response.
// The router opens it only for a case with a room script.
export function JuniorRoom() {
  const caseId = useCaseId()
  const content = getCase(caseId)
  return content.room ? <Room content={content} script={content.room} /> : null
}

// About 80 characters of what was written, cut at a word, for the summary after Submit.
function clip(text: string, max = 80): string {
  const flat = text.trim().replace(/\s+/g, ' ')
  if (flat.length <= max) return flat
  const cut = flat.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,.;:–-]+$/, '')}…`
}

function Room({ content, script }: { content: CaseContent; script: RoomScript }) {
  const { session, readOnly, update } = useRoom(content, script)
  const roles = content.roles ?? []
  const roleTitle = (id: string) => roles.find((role) => role.id === id)?.title ?? id
  const positioned = session.initialPosition.recommendation.trim() !== ''
  const planned = session.recommendation.plan.trim() !== ''
  const canTalk = !readOnly && positioned
  const canSubmit = !readOnly && positioned && planned
  const focusAfter = useFocusAfter()
  const hint = readOnly
    ? 'Submitted'
    : !positioned
      ? 'Write your initial position first'
      : !planned
        ? 'Write the joint recommendation to submit'
        : 'Your Team Lead can review it once you submit'

  // Submit stays focusable while it can't be used (aria-disabled), so its reason can be heard.
  const submit = () => {
    if (!canSubmit) return
    focusAfter(byId('jr-room-done'))
    submitRoom(content, roleTitle)
  }

  return (
    <div className="jr-case jr-room">
      <header className="jr-case__header">
        <p className="eyebrow eyebrow--sm jr-case__eyebrow">Team Decision Room · {caseEyebrow(content.id)}</p>
        <div className="jr-case__titlerow">
          <h1 className="title title--lg jr-case__title">{getSummary(content.id).title}</h1>
          <a className="jr-case__exit" href={casePageHref(content.id, 'details')}>
            Case details
          </a>
        </div>
      </header>
      {readOnly && (
        <div id="jr-room-done" className="callout jr-room__done" role="status" tabIndex={-1}>
          <p className="jr-room__donetext">
            You started at ‘{clip(session.initialPosition.recommendation)}’ and agreed ‘{clip(session.recommendation.plan)}’.
            Your Team Lead sees the whole session in Practice Reviews.
          </p>
          <a className="btn btn--link" href={ROUTES.juniorGrow}>
            Next: bring your own work
            <NextArrow />
          </a>
        </div>
      )}
      <div className="jr-room__grid">
        <div className="jr-room__side">
          <RoomBrief roles={roles} script={script} session={session} canTalk={canTalk} update={update} />
          <RoomBoard script={script} session={session} roleTitle={roleTitle} readOnly={readOnly} update={update} />
        </div>
        <div className="jr-room__main">
          <RoomPosition session={session} update={update} />
          <RoomDiscussion script={script} session={session} roleTitle={roleTitle} canTalk={canTalk} update={update} />
          <RoomConflicts script={script} session={session} roleTitle={roleTitle} readOnly={readOnly} update={update} />
          <RoomRecommendation session={session} readOnly={readOnly} update={update} />
          {readOnly && <ReflectGrowth recordId={session.growthRecordId} />}
        </div>
      </div>
      <div className="jr-case__actions">
        <a className="btn btn--secondary" href={casePageHref(content.id, 'details')}>
          <BackArrow />
          Case details
        </a>
        <div className="jr-room__submit">
          <p id="jr-room-hint">{hint}</p>
          <button
            type="button"
            className="btn btn--primary"
            aria-disabled={!canSubmit || undefined}
            aria-describedby="jr-room-hint"
            onClick={submit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
