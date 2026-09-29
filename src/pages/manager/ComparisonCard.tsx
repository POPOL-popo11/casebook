import type { PracticeAttempt } from '../../contracts/records'
import type { CaseContent, CaseStep } from '../../contracts/types'
import { attemptAtVersion } from '../../lib/assessment'
import { personName } from '../../lib/content'
import { callSummary, PLACE_NAMES } from './attemptAnswers'

// What the learner answered at one step, in a line or two.
function stepAnswer(content: CaseContent, attempt: PracticeAttempt, step: CaseStep): string {
  const { define, examine, investigate, decide } = attempt
  if (step === 'define') return define.goal.trim() || define.initialPosition.recommendation.trim() || 'Not written'
  if (step === 'examine') {
    const places = ['verified', 'needs-checking', 'assumption', 'weak', 'unsorted'] as const
    return places
      .map((place) => {
        const cards = content.cards.filter((c) => (examine.sort[c.id] ?? 'unsorted') === place).map((c) => c.text)
        return cards.length > 0 ? `${PLACE_NAMES[place]}: ${cards.join(', ')}.` : ''
      })
      .filter(Boolean)
      .join(' ')
  }
  if (step === 'investigate') {
    const titles = investigate.requests.map((r) => content.requests.find((x) => x.id === r.requestId)?.title ?? r.requestId)
    return titles.length > 0 ? titles.join(' → ') : 'No requests'
  }
  return callSummary(content, decide)
}

type ComparisonCardProps = { content: CaseContent; attempt: PracticeAttempt; version: number; authorId?: string }

// A secondary view: this attempt beside the Case Expert's reference answers, point by point.
// A reference, not an answer key, so there is no match count.
export function ComparisonCard({ content, attempt, version, authorId }: ComparisonCardProps) {
  const byPoint = content.senior.byPoint
  if (!byPoint) return null
  const shown = attemptAtVersion(attempt, version)
  const learner = personName(attempt.learnerId)
  const expert = authorId ? personName(authorId) : 'the Case Expert'

  return (
    <details className="card rv-card rv-compare">
      <summary className="rv-item__summary rv-compare__summary">
        <span className="rv-item__text">
          <span className="title title--sm rv-card__title">Compare with {expert}’s reference</span>
          <span className="rv-card__lead rv-compare__lead">A reference, not an answer key.</span>
        </span>
      </summary>
      <ol className="rv-compare__points">
        {content.decisionPoints.map((point) => (
          <li key={point.id} className="rv-compare__point">
            <p className="field__label rv-compare__title">{point.title}</p>
            <dl className="rv-answers">
              <div className="rv-answers__row">
                <dt>{learner}</dt>
                <dd>{stepAnswer(content, shown, point.step)}</dd>
              </div>
              {byPoint[point.id] && (
                <div className="rv-answers__row">
                  <dt>{expert}</dt>
                  <dd>
                    {byPoint[point.id].answer}
                    <span className="rv-compare__reason">{byPoint[point.id].reason}</span>
                  </dd>
                </div>
              )}
            </dl>
          </li>
        ))}
      </ol>
    </details>
  )
}
