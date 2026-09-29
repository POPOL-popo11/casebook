import type { Share } from '../../contracts/records'
import { DemoTag } from '../../components/DemoTag'
import { Page } from '../../components/Page'
import { SharedItemView } from '../../components/SharedItemView'
import { demoPerson, personInitials, personName } from '../../lib/content'
import { formatDate } from '../../lib/labels'
import { useStore } from '../../lib/records'
import { ShareItemFeedback } from './ShareItemFeedback'
import './SharedGrowth.css'

// Shares to this Team Lead, newest first. The page reads shares and feedback only: never the
// learner's growth records, work reviews or self-reviews (records.ts).
const sharesTo = (leadId: string) => (store: { shares: Share[] }) =>
  store.shares.filter((s) => s.managerId === leadId).sort((a, b) => b.sharedAt.localeCompare(a.sharedAt))

function ShareCard({ share }: { share: Share }) {
  const count = share.items.length
  const titleId = `sg-${share.id}`
  return (
    <section className="card sg-share" aria-labelledby={titleId}>
      <header className="sg-share__head">
        <span className="avatar" aria-hidden="true">
          {personInitials(share.learnerId)}
        </span>
        <div className="sg-share__heading">
          <h2 id={titleId} className="title title--sm sg-share__title">
            {personName(share.learnerId)} shared {count} record{count === 1 ? '' : 's'}
          </h2>
          <p className="sg-share__meta">
            {formatDate(share.sharedAt)} · The exact copy they chose, without private notes
            {share.source === 'demo' && <DemoTag kind="data" />}
          </p>
        </div>
      </header>
      <ul className="sg-share__items">
        {share.items.map((item) => (
          <li key={item.recordId} className="sg-item">
            <SharedItemView item={item} />
            <ShareItemFeedback share={share} item={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}

// Shared Growth: what learners chose to share with their Team Lead, and the Team Lead's feedback.
export function SharedGrowth() {
  const shares = useStore(sharesTo(demoPerson('manager').id))

  return (
    <Page
      title="Shared Growth"
      subtitle="Only what your team chose to share with you, exactly as they shared it."
    >
      {shares.length === 0 ? (
        <section className="card sg-empty">
          <h2 className="title title--sm">Nothing shared yet</h2>
          <p>When a learner shares growth records from My Growth, they appear here as they shared them.</p>
        </section>
      ) : (
        <div className="sg-list">
          {shares.map((share) => (
            <ShareCard key={share.id} share={share} />
          ))}
        </div>
      )}
    </Page>
  )
}
