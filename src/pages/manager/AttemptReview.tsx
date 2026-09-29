import type { PracticeAttempt } from '../../contracts/records'
import { DIMENSIONS, type CaseContent } from '../../contracts/types'
import { assessAttempt, attemptAtVersion } from '../../lib/assessment'
import { formatDate } from '../../lib/labels'
import { answersByDimension, criterionAnswers, versionLabel } from './attemptAnswers'
import { ComparisonCard } from './ComparisonCard'
import { DimensionCard } from './DimensionCard'

type VersionSwitcherProps = { attempt: PracticeAttempt; version: number; onVersion: (version: number) => void }

// Which submitted version the page shows. The original answer never changes; each revision
// says why it changed.
function VersionSwitcher({ attempt, version, onVersion }: VersionSwitcherProps) {
  const versions = attempt.versions
  const whyChanged = versions[version]?.whyChanged.trim()
  return (
    <section className="card rv-card rv-versions" aria-label="Versions">
      <div className="segmented rv-versions__switch" role="group" aria-label="Show version">
        {versions.map((v, i) => (
          <button
            key={v.at}
            type="button"
            className="segmented__item"
            aria-pressed={i === version}
            onClick={() => onVersion(i)}
          >
            {versionLabel(i)} · {formatDate(v.at)}
          </button>
        ))}
      </div>
      {version > 0 && (
        <p className="rv-versions__why">
          <span className="field__label">Why they revised</span>
          {whyChanged || 'No reason written.'}
        </p>
      )}
    </section>
  )
}

type AttemptReviewProps = {
  content: CaseContent
  attempt: PracticeAttempt
  version: number
  onVersion: (version: number) => void
  authorId?: string
}

// An attempt's answers under the five dimensions, grouped through the case's assessment.
export function AttemptReview({ content, attempt, version, onVersion, authorId }: AttemptReviewProps) {
  const results = assessAttempt(content, attemptAtVersion(attempt, version))
  const answers = answersByDimension(content, attempt, version)

  return (
    <div className="mr__main">
      {attempt.versions.length > 1 && <VersionSwitcher attempt={attempt} version={version} onVersion={onVersion} />}
      {DIMENSIONS.map((dimension) => (
        <DimensionCard
          key={dimension.id}
          dimension={dimension}
          results={results.filter((result) => result.criterion.dimensionId === dimension.id)}
          answersFor={(result) => criterionAnswers(content, attempt, version, result.criterion)}
          answers={answers[dimension.id]}
        />
      ))}
      <ComparisonCard content={content} attempt={attempt} version={version} authorId={authorId} />
    </div>
  )
}
