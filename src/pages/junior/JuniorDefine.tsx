import { caseHref } from '../../contracts/types'
import { getCase } from '../../lib/content'
import { useCaseId } from '../../lib/router'
import { CaseFrame } from './CaseFrame'
import { DefineBrief } from './DefineBrief'
import { DefineFrame } from './DefineFrame'
import { DefinePosition } from './DefinePosition'
import { NextArrow } from './icons'
import { usePractice } from './practice'
import './JuniorDefine.css'

// Step 1 of a case (05-junior-define.png). In practice mode the learner frames the task and
// records a first position under it; the example shows the same cards, read-only.
export function JuniorDefine() {
  const caseId = useCaseId()
  const content = getCase(caseId)
  const practice = usePractice(content)

  return (
    <CaseFrame
      caseId={caseId}
      step="define"
      className="jr-define"
      practice={practice}
      actions={
        <a className="btn btn--primary jr-case__next" href={caseHref(caseId, 'examine')}>
          Next
          <NextArrow />
        </a>
      }
    >
      <div className="jr-define__grid">
        <DefineBrief content={content} />
        <div className="jr-define__main">
          <DefineFrame content={content} practice={practice} />
          <DefinePosition practice={practice} />
        </div>
      </div>
    </CaseFrame>
  )
}
