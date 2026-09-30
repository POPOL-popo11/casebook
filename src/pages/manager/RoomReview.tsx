import type { ReactNode } from 'react'
import type { RoomSession } from '../../contracts/records'
import type { CaseContent, Confidence } from '../../contracts/types'
import { AnswerList } from './DimensionCard'
import type { AnswerItem } from './attemptAnswers'
import { roleTitle, RoomConflicts, RoomInformation } from './RoomInformation'
import { RoomNotAsked } from './RoomNotAsked'

const CONFIDENCE: Record<Confidence, string> = { low: 'Low', medium: 'Medium', high: 'High' }

const rows = (pairs: [string, string | null | undefined][]): AnswerItem[] =>
  pairs.filter((p): p is [string, string] => Boolean(p[1]?.trim())).map(([label, text]) => ({ label, text }))

function Card({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="card rv-card" aria-labelledby={id}>
      <h2 id={id} className="title title--sm rv-card__title">
        {title}
      </h2>
      {children}
    </section>
  )
}

// A Team Decision Room on its review page: the position before and after, what was asked, shared
// and used, what was never asked, the conflicts, what is still unresolved, and the learner's reflection.
export function RoomReview({ content, room }: { content: CaseContent; room: RoomSession }) {
  const { initialPosition: first, recommendation: final, reflection } = room
  const open = room.openQuestions.filter((q) => q.status !== 'resolved')
  const unresolved = rows([
    ['In the recommendation', final.unresolved],
    ...open.map((q): [string, string] => [`${q.status === 'unknown' ? 'Unknown' : 'Open'} · ${roleTitle(content, q.ownerRoleId)}`, q.text]),
  ])

  return (
    <div className="mr__main">
      <Card id="rv-positions" title="Initial and final position">
        <p className="field__label rv-card__label">Before the discussion</p>
        <AnswerList
          items={rows([
            ['Recommendation', first.recommendation],
            ['Why', first.reason],
            ['Confidence', first.confidence ? CONFIDENCE[first.confidence] : 'Not given'],
          ])}
        />
        <p className="field__label rv-card__label">Joint recommendation</p>
        <AnswerList
          items={rows([
            ['Plan', final.plan],
            ['Trade-offs', final.tradeoffs],
            ['Owner', final.owner],
            ['Review by', final.reviewBy],
          ])}
        />
      </Card>

      <RoomInformation content={content} room={room} />
      <RoomNotAsked content={content} room={room} />
      <RoomConflicts content={content} room={room} />

      <Card id="rv-unresolved" title="Still unresolved">
        {unresolved.length > 0 ? <AnswerList items={unresolved} /> : <p className="rv-card__none">Nothing left open.</p>}
      </Card>

      <Card id="rv-reflection" title="Reflection">
        <AnswerList
          items={[
            { label: 'What changed their mind, and why', text: reflection.changedMind.trim() || 'Not written' },
            { label: 'What they still disagree with or are unsure about', text: reflection.stillUncertain.trim() || 'Not written' },
          ]}
        />
      </Card>
    </div>
  )
}
