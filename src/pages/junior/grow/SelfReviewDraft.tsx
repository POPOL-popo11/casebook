import type { Feedback, GrowthRecord, SelfReview } from '../../../contracts/records'
import { toast } from '../../../components/toast'
import { setStore } from '../../../lib/records'
import { formatDate, nowIso } from './growContent'
import { draftText, SECTION_KEYS, SECTION_TITLES, sourceLabel, type SectionKey } from './selfReview'
import { AutoTextarea } from './AutoTextarea'

type DraftProps = { review: SelfReview; records: GrowthRecord[]; feedback: Feedback[] }

// The saved draft: four sections, every line editable and naming its source records.
export function SelfReviewDraft({ review, records, feedback }: DraftProps) {
  function editLine(key: SectionKey, index: number, text: string) {
    setStore((draft) => {
      const sr = draft.selfReviews.find((x) => x.id === review.id)
      if (!sr) return
      sr.sections[key][index].text = text
      sr.updatedAt = nowIso()
    })
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(draftText(review, records, feedback))
      toast('Draft copied')
    } catch {
      toast('Copy is blocked here. Save it as a .txt file instead.')
    }
  }

  function save() {
    const blob = new Blob([draftText(review, records, feedback)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'self-review-draft.txt'
    document.body.append(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast('Saved self-review-draft.txt')
  }

  return (
    <div className="mg-draft">
      <div className="mg-draft__head">
        <div>
          <span className="badge badge--accent">Draft built from your records</span>
          <p className="mg-draft__meta">
            {review.recordIds.length} source{review.recordIds.length === 1 ? '' : 's'}, {formatDate(review.from)} to {formatDate(review.to)}. Edit any
            line; the sources stay with it.
          </p>
        </div>
        <div className="mg-draft__tools">
          <button type="button" className="btn btn--secondary btn--sm" onClick={copy}>
            Copy
          </button>
          <button type="button" className="btn btn--secondary btn--sm" onClick={save}>
            Save as .txt
          </button>
        </div>
      </div>
      {SECTION_KEYS.map((key) => (
        <section key={key} className="mg-draft__section" aria-labelledby={`mg-draft-${key}`}>
          <h3 id={`mg-draft-${key}`} className="title title--sm">
            {SECTION_TITLES[key]}
          </h3>
          {review.sections[key].length === 0 ? (
            <p className="mg-draft__empty">Nothing here: the chosen records hold nothing for this section.</p>
          ) : (
            <ol className="mg-draft__lines">
              {review.sections[key].map((line, i) => (
                <li key={i} className="mg-draft__line">
                  <AutoTextarea
                    className="textarea"
                    rows={2}
                    aria-label={`${SECTION_TITLES[key]}, line ${i + 1}`}
                    value={line.text}
                    onChange={(e) => editLine(key, i, e.target.value)}
                  />
                  <p className="mg-draft__sources">
                    Sources: {line.sourceRecordIds.map((id) => sourceLabel(id, records, feedback)).join('; ')}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
    </div>
  )
}
