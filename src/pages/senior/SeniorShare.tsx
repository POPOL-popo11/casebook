import { ROUTES } from '../../contracts/types'
import { Arrow } from '../../components/Arrow'
import { IconCheck, IconShield } from '../../components/icons'
import { Page } from '../../components/Page'
import { getCase, getSummary } from '../../lib/content'
import { DecisionCard } from './DecisionCard'
import { useExpertCaseId } from './expertCase'
import { GoalCard } from './GoalCard'
import { MaterialsCard } from './MaterialsCard'
import { ModesCard } from './ModesCard'
import { SituationCard } from './SituationCard'
import './SeniorShare.css'

// 02-senior-share.png: Create a Case, step 1, showing the case My Cases opened. The overnight
// cards (goal and limits, modes and skills) and each material's text join the designed ones.
// The case shown is always a published one, so the heading names it instead of 'Share a case'.
export function SeniorShare() {
  const caseId = useExpertCaseId()
  const content = getCase(caseId)
  const summary = getSummary(caseId)

  return (
    <Page
      title={`Case: ${summary.title}`}
      subtitle="Include only what you knew at the time."
      aside={
        <p className="share__saved">
          <IconCheck />
          Published{summary.version ? ` · ${summary.version}` : ''}
        </p>
      }
      actions={
        <a className="btn btn--primary" href={ROUTES.seniorBreakdown}>
          Review the breakdown <Arrow />
        </a>
      }
    >
      <div key={caseId} className="share__grid">
        <div className="share__column">
          <SituationCard summary={summary} background={content.background} />
          <GoalCard content={content} />
          <MaterialsCard materials={content.materials} roles={content.roles} />
        </div>
        <div className="share__column">
          <DecisionCard content={content} />
          <ModesCard summary={summary} content={content} />
          <div className="card share__privacy">
            <IconShield className="share__shield" />
            <p className="share__privacy-text">Remove client names and pricing before you share.</p>
          </div>
        </div>
      </div>
    </Page>
  )
}
