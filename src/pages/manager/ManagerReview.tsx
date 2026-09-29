import { useState } from 'react'
import type { PracticeAttempt, RoomSession } from '../../contracts/records'
import { ROUTES, type CaseContent, type DimensionId } from '../../contracts/types'
import { Arrow } from '../../components/Arrow'
import { DemoTag } from '../../components/DemoTag'
import { Page } from '../../components/Page'
import { CASES, caseName, getSummary, isPlayable, personName, SKILLS } from '../../lib/content'
import { formatDate } from '../../lib/labels'
import { useStore } from '../../lib/records'
import { useAttemptId } from '../../lib/router'
import { AttemptReview } from './AttemptReview'
import { callSummary } from './attemptAnswers'
import { FeedbackColumn, type FeedbackPreset } from './FeedbackColumn'
import { isExampleAttempt, latestVersion } from './reviewData'
import { roleTitle } from './RoomInformation'
import { RoomReview } from './RoomReview'
import './ManagerReview.css'

const FOCUS_OPTIONS = SKILLS.map((skill) => skill.id)
const firstName = (id: string) => personName(id).split(' ')[0]

// The case's review describes its example attempt, so it is the starting draft (Demo data) only on
// that attempt. Every other attempt, including other demo learners', starts with an empty draft.
function presetFor(attempt: PracticeAttempt, content: CaseContent): FeedbackPreset | undefined {
  const review = isExampleAttempt(attempt, content) ? content.review : undefined
  if (!review) return undefined
  const dims = review.dimensions ?? []
  return {
    levels: Object.fromEntries(dims.map((d) => [d.id, d.level])),
    notes: Object.fromEntries(dims.map((d) => [d.id, d.note])) as Partial<Record<DimensionId, string>>,
    texts: review.feedback ?? { strength: '', improvement: '', followUp: '' },
    focus: review.nextFocusDefault,
  }
}

function BackLink() {
  return (
    <a className="btn btn--link mr__back" href={ROUTES.managerReviews}>
      <Arrow back /> All reviews
    </a>
  )
}

function AttemptPage({ attempt, content }: { attempt: PracticeAttempt; content: CaseContent }) {
  const [version, setVersion] = useState(latestVersion(attempt))
  const versions = attempt.versions ?? []
  const shown = versions[version]?.decide ?? attempt.decide
  const revised = versions.length > 1 ? ` · Revised ${formatDate(versions[versions.length - 1].at)}` : ''
  return (
    <Page
      className="mr"
      title={`${personName(attempt.learnerId)} · ${caseName(attempt.caseId)} case`}
      subtitle={
        <>
          Individual practice · Submitted {formatDate(versions[0]?.at ?? attempt.updatedAt)}
          {revised} {attempt.source === 'demo' && <DemoTag kind="data" />}
        </>
      }
      aside={<BackLink />}
    >
      <div className="mr__grid">
        <AttemptReview
          content={content}
          attempt={attempt}
          version={version}
          onVersion={setVersion}
          authorId={getSummary(attempt.caseId).authorId}
        />
        <FeedbackColumn
          key={attempt.id}
          about={{ kind: 'attempt', id: attempt.id }}
          learnerId={attempt.learnerId}
          version={version}
          call={{ label: `${firstName(attempt.learnerId)}’s call`, text: callSummary(content, shown) }}
          focusOptions={FOCUS_OPTIONS}
          preset={presetFor(attempt, content)}
        />
      </div>
    </Page>
  )
}

function RoomPage({ room, content }: { room: RoomSession; content: CaseContent }) {
  return (
    <Page
      className="mr"
      title={`${personName(room.learnerId)} · ${caseName(room.caseId)} case`}
      subtitle={
        <>
          Team Decision Room · Played the {roleTitle(content, room.roleId)} · Submitted {formatDate(room.updatedAt)}{' '}
          {room.source === 'demo' && <DemoTag kind="data" />}
        </>
      }
      aside={<BackLink />}
    >
      <div className="mr__grid">
        <RoomReview content={content} room={room} />
        <FeedbackColumn
          key={room.id}
          about={{ kind: 'room', id: room.id }}
          learnerId={room.learnerId}
          call={{ label: `${firstName(room.learnerId)}’s recommendation`, text: room.recommendation.plan.trim() || 'No plan written' }}
          focusOptions={FOCUS_OPTIONS}
        />
      </div>
    </Page>
  )
}

// 09-manager-review.png, reworked: one submitted attempt or Team Decision Room. App shows this
// route only when the store holds a submitted attempt or room with this id.
export function ManagerReview() {
  const id = useAttemptId()
  const attempt = useStore((store) => store.attempts.find((a) => a.id === id))
  const room = useStore((store) => store.rooms.find((r) => r.id === id))
  const caseId = attempt?.caseId ?? room?.caseId ?? ''
  if (!isPlayable(caseId)) {
    return <Page className="mr" title="Practice review" subtitle="This case is no longer in the library." aside={<BackLink />} />
  }
  if (attempt) return <AttemptPage attempt={attempt} content={CASES[caseId]} />
  if (room) return <RoomPage room={room} content={CASES[caseId]} />
  return null
}
