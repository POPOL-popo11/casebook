import type { Store } from '../contracts/records'
import type { RouteKey } from '../contracts/types'
import { CASE_SUMMARIES, caseName, FEATURED_CASE_ID, getSummary, personName } from './catalog'
import type { RouteMatch } from './router'

// The browser tab's title on each page, read out when the page changes: the page, then the app,
// as 'Case Library · Work Buddy'. A case page names the case first, as
// 'Eight Weeks to Japan · Define · Work Buddy'.

const APP = 'Work Buddy'

// The page's name, as the sidebar or the page's own heading calls it.
const PAGE_NAMES: Record<RouteKey, string> = {
  landing: '',
  signIn: 'Sign in',
  seniorCases: 'My Cases',
  seniorShare: 'Share a case', // unused: the page names its case (expertCaseHeading)
  seniorBreakdown: 'Review the breakdown',
  seniorSkills: 'Skill Frameworks',
  seniorNew: 'Create a Case',
  juniorHome: 'Case Library',
  juniorInProgress: 'Case Library',
  juniorGrow: 'Work & Grow',
  juniorGrowth: 'My Growth',
  juniorFeedback: 'Feedback',
  juniorCase: '',
  juniorDefine: 'Define',
  juniorExamine: 'Examine',
  juniorInvestigate: 'Investigate',
  juniorDecide: 'Decide',
  juniorReflect: 'Reflect',
  juniorRoom: 'Team Decision Room',
  managerReviews: 'Practice Reviews',
  managerReview: 'Practice review',
  managerTeam: 'Shared Growth',
}

// The Case Expert's Share page is headed by the case it shows (pages/senior/expertCase.ts): the
// one My Cases opened, else the featured case. Read from the summaries, which are there before
// the cases load.
function expertCaseHeading(store: Store): string {
  const opened = store.ui.expertCaseId
  const shown = opened && CASE_SUMMARIES.some((s) => s.id === opened && s.playable) ? opened : FEATURED_CASE_ID
  return `Case: ${getSummary(shown).title}`
}

// The learner and case of the attempt or room on the Team Lead's review page.
function reviewed(attemptId: string, store: Store): string[] {
  const record = [...store.attempts, ...store.rooms].find((r) => r.id === attemptId)
  return record ? [personName(record.learnerId), caseName(record.caseId)] : []
}

export function pageTitle(match: RouteMatch, store: Store): string {
  const { route, caseId, attemptId } = match
  const parts: string[] = []
  if (caseId !== null) parts.push(getSummary(caseId).title)
  if (route === 'managerReview' && attemptId !== null) parts.push(...reviewed(attemptId, store))
  parts.push(route === 'seniorShare' ? expertCaseHeading(store) : PAGE_NAMES[route], APP)
  return parts.filter(Boolean).join(' · ')
}
