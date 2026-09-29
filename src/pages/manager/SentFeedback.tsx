import type { RecordRef } from '../../contracts/records'
import { DIMENSIONS } from '../../contracts/types'
import { DemoTag } from '../../components/DemoTag'
import { skillLabel } from '../../lib/content'
import { formatDate, levelLabel } from '../../lib/labels'
import { useStore } from '../../lib/records'
import { versionLabel, type AnswerItem } from './attemptAnswers'
import { AnswerList } from './DimensionCard'

// The feedback already sent on this attempt, room or shared record, newest first, as the learner
// receives it on their Feedback page.
export function SentFeedback({ about }: { about: RecordRef }) {
  const sent = useStore((store) => store.feedback.filter((f) => f.about.kind === about.kind && f.about.id === about.id))
  if (sent.length === 0) return null

  return (
    <section className="card mr__sent" aria-labelledby={`mr-sent-${about.id}`}>
      <h2 id={`mr-sent-${about.id}`} className="title title--sm mr__feedback-title">
        Feedback sent
      </h2>
      <ul className="mr__sent-list">
        {[...sent].reverse().map((f) => {
          const items: AnswerItem[] = [
            { label: 'Done well', text: f.strength },
            { label: 'Improve', text: f.improvement },
            { label: 'Follow-up', text: f.followUp },
            { label: 'Next focus', text: f.focusSkillId ? skillLabel(f.focusSkillId) : '' },
            ...(f.dimensions ?? []).map((d) => ({
              label: DIMENSIONS.find((x) => x.id === d.id)?.label ?? d.id,
              text: levelLabel(d.level) + (d.note ? `. ${d.note}` : ''),
            })),
          ].filter((item) => item.text.trim())
          return (
            <li key={f.id} className="mr__sent-item">
              <p className="mr__sent-meta">
                {formatDate(f.at)}
                {f.version !== undefined && ` · on the ${versionLabel(f.version).toLowerCase()}`}
                {` · ${f.readAt ? 'Read' : 'Not read yet'}`}
                {f.source === 'demo' && <DemoTag kind="data" />}
              </p>
              <AnswerList items={items} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
