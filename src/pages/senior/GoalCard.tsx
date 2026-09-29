import type { CaseContent } from '../../contracts/types'

// 02 · Goal and limits (overnight): what the work must achieve, and the limits the learner works
// within, including what they may decide alone.
export function GoalCard({ content }: { content: CaseContent }) {
  const limits = content.limits ?? {}
  const rows: [string, string | undefined][] = [
    ['Goal', content.goal],
    ['Deadline', limits.deadline],
    ['Budget', limits.budget],
    ['Not acceptable', limits.unacceptable],
    ['They may decide alone', limits.authority],
  ]
  const shown = rows.filter((row): row is [string, string] => Boolean(row[1]?.trim()))

  return (
    <section className="card share__card" aria-labelledby="share-goal">
      <h2 id="share-goal" className="title title--sm share__card-title">
        Goal and limits
      </h2>
      {shown.length === 0 ? (
        <p className="share__empty">No goal or limits written for this case yet.</p>
      ) : (
        <dl className="share__facts">
          {shown.map(([label, text]) => (
            <div key={label} className="share__fact">
              <dt>{label}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
