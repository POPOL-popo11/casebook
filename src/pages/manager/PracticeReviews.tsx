import { reviewHref } from '../../contracts/types'
import { DemoTag } from '../../components/DemoTag'
import { IconArrowRight } from '../../components/icons'
import { Page } from '../../components/Page'
import { caseName, personInitials, personName } from '../../lib/content'
import { formatDate } from '../../lib/labels'
import { useStore } from '../../lib/records'
import { reviewQueue, type QueueItem } from './reviewData'
import './PracticeReviews.css'

const MODE_LABELS = { attempt: 'Individual practice', room: 'Team Decision Room' } as const

function QueueRow({ item }: { item: QueueItem }) {
  return (
    <a className="pr-row" href={reviewHref(item.id)}>
      <span className="pr-row__who">
        <span className="avatar" aria-hidden="true">
          {personInitials(item.learnerId)}
        </span>
        <span className="pr-row__name">{personName(item.learnerId)}</span>
        {item.demo && <DemoTag kind="data" />}
      </span>
      <span className="pr-row__case">{caseName(item.caseId)}</span>
      <span className="pr-row__mode">{MODE_LABELS[item.kind]}</span>
      <span className="pr-row__status">
        <span className={`badge ${item.reviewed ? 'badge--accent' : 'badge--warn'}`}>
          {item.reviewed ? 'Feedback sent' : 'Waiting for review'}
        </span>
        <span className="pr-row__when">
          {item.status} {formatDate(item.at)}
        </span>
      </span>
      {/* Picked by the app from the case's preset checks (reviewData.ts), so it carries the tag. */}
      <span className={`pr-row__confirm${item.toConfirm ? '' : ' pr-row__confirm--none'}`}>
        <span>
          <span className="visually-hidden">To confirm: </span>
          {item.toConfirm ?? 'Nothing flagged by the case’s checks'}
        </span>
        <DemoTag kind="response" />
      </span>
      <IconArrowRight className="pr-row__arrow" light />
    </a>
  )
}

// Practice Reviews: everything the team has submitted, practice attempts and Decision Rooms.
export function PracticeReviews() {
  const items = useStore(reviewQueue)
  const waiting = items.filter((item) => !item.reviewed).length

  return (
    <Page
      className="pr"
      title="Practice Reviews"
      subtitle={
        items.length === 0
          ? 'What your team submits appears here.'
          : `${waiting} waiting for review · ${items.length - waiting} with feedback sent. Practice, not a performance rating.`
      }
    >
      {items.length === 0 ? (
        <section className="card pr__empty">
          <h2 className="title title--sm">Nothing to review yet</h2>
          <p>When a learner submits a practice case or a Team Decision Room, it appears here with what to confirm.</p>
        </section>
      ) : (
        <section className="card pr__list" aria-label="Submitted practice">
          <div className="pr-row pr-row--head" aria-hidden="true">
            <span>Learner</span>
            <span>Case</span>
            <span>Mode</span>
            <span>Status</span>
            <span>Key question to confirm</span>
          </div>
          <ul className="pr__rows">
            {items.map((item) => (
              <li key={item.id}>
                <QueueRow item={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Page>
  )
}
