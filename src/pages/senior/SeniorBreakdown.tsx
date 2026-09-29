import { useState } from 'react'
import { ROUTES, type DecisionPoint } from '../../contracts/types'
import { Arrow } from '../../components/Arrow'
import { DemoTag } from '../../components/DemoTag'
import { IconLock } from '../../components/icons'
import { Page } from '../../components/Page'
import { getCase } from '../../lib/content'
import { AssessmentCard, VariantCard } from './AssessmentCard'
import { BreakdownAside } from './BreakdownAside'
import { useExpertCaseId } from './expertCase'
import { PointCard } from './PointCard'
import './SeniorBreakdown.css'

// 03-senior-breakdown.png: Create a Case, step 2, for the case My Cases opened: its four decision
// points, then (overnight) how the reasoning is assessed and the changed-condition challenge.
export function SeniorBreakdown() {
  const caseId = useExpertCaseId()
  const content = getCase(caseId)
  const points = content.decisionPoints
  // A point in 'review' needs the Case Expert's review until they answer "Yes".
  const [reviewed, setReviewed] = useState<string[]>([])
  const isConfirmed = (point: DecisionPoint) => point.status === 'confirmed' || reviewed.includes(point.id)
  const pending = points.filter((point) => !isConfirmed(point)).length
  const status = pending === 0 ? 'all confirmed' : `${pending} ${pending === 1 ? 'needs' : 'need'} your review`

  return (
    <Page
      title="Review the breakdown"
      subtitle={
        // The breakdown and its review prompt are preset for the demo, not split by live AI.
        <>
          {points.length} decision points · {status} <DemoTag kind="response" />
        </>
      }
      actions={
        <>
          <a className="btn btn--secondary" href={ROUTES.seniorShare}>
            <Arrow back /> Back
          </a>
          <a className="btn btn--primary" href={ROUTES.seniorCases}>
            Done
          </a>
        </>
      }
    >
      <div key={caseId} className="bd__grid">
        <div className="bd__main">
          <ol className="bd__points">
            {points.map((point, index) => (
              <PointCard
                key={point.id}
                number={String(index + 1).padStart(2, '0')}
                title={point.title}
                question={point.question}
                confirmed={isConfirmed(point)}
              >
                {!isConfirmed(point) && (
                  <div className="bd__prompt">
                    <p className="bd__prompt-text">{point.reviewPrompt}</p>
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => setReviewed((ids) => [...ids, point.id])}
                    >
                      Yes
                    </button>
                  </div>
                )}
                {point.chips && (
                  <ul className="bd__chips" aria-label="Unlocks on request">
                    {point.chips.map((chip) => (
                      <li key={chip} className="chip bd__chip">
                        <IconLock />
                        {chip}
                      </li>
                    ))}
                  </ul>
                )}
              </PointCard>
            ))}
          </ol>
          <AssessmentCard content={content} />
          <VariantCard content={content} />
        </div>
        <BreakdownAside content={content} />
      </div>
    </Page>
  )
}
