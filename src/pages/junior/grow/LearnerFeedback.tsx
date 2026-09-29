import { useEffect, useState } from 'react'
import { ROUTES } from '../../../contracts/types'
import { Page } from '../../../components/Page'
import { getStore, setStore, useStore } from '../../../lib/records'
import { FeedbackCard } from './FeedbackCard'
import { LEARNER_ID, nowIso } from './growContent'
import './grow.css'
import './LearnerFeedback.css'

// Feedback (#/junior/feedback): the Team Lead's feedback to this learner, newest first, each
// linked to the record it answers, with a way to act on it.
export function LearnerFeedback() {
  const feedback = useStore((s) => s.feedback)
  const attempts = useStore((s) => s.attempts)
  const rooms = useStore((s) => s.rooms)
  const growth = useStore((s) => s.growth)
  const mine = feedback.filter((f) => f.toId === LEARNER_ID).sort((a, b) => b.at.localeCompare(a.at))

  // What was unread when the page opened keeps its 'New' tag for this visit; the store marks it read.
  const [fresh] = useState(() => new Set(getStore().feedback.filter((f) => f.toId === LEARNER_ID && !f.readAt).map((f) => f.id)))
  useEffect(() => {
    if (fresh.size === 0) return
    const at = nowIso()
    setStore((draft) => {
      for (const f of draft.feedback) if (fresh.has(f.id) && !f.readAt) f.readAt = at
    })
  }, [fresh])

  return (
    <Page className="fb gr-page" title="Feedback" subtitle="What your Team Lead said, linked to the work it answers.">
      {mine.length === 0 ? (
        <div className="card gr-empty">
          <p>No feedback yet. When your Team Lead reviews a practice case or a record you shared, it appears here.</p>
          <a className="btn btn--secondary btn--sm" href={ROUTES.juniorGrowth}>
            Share a record from My Growth
          </a>
        </div>
      ) : (
        <div className="fb__list">
          {mine.map((item) => (
            <FeedbackCard key={item.id} item={item} isNew={fresh.has(item.id)} refs={{ attempts, rooms, growth }} />
          ))}
        </div>
      )}
    </Page>
  )
}
