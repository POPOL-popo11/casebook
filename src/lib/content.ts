import { CASES } from '../data/cases'
import { provideCases } from './catalog'

// How pages read src/data: the data itself, lookups by id and the few strings built from
// content. No JSX here. A page needs only this one import.
// The lookups live in catalog.ts, which the first page uses without the case bodies. This file
// adds the cases, so only the role screens, which load later, carry them.
provideCases(CASES)

export { CASES }
export {
  CASE_SUMMARIES,
  FEATURED_CASE_ID,
  JUNIOR_PROFILE,
  LANDING_FEATURE,
  LIBRARY_TABS,
  PEOPLE,
  RECOMMENDED_CASE_ID,
  SKILLS,
  SKILL_FRAMEWORKS,
  TEAMS,
  caseAuthor,
  caseByline,
  caseEyebrow,
  caseName,
  caseShortName,
  demoPerson,
  firstName,
  getCase,
  getPerson,
  getSkill,
  getSummary,
  getTeam,
  isPlayable,
  nextCallText,
  personInitials,
  personName,
  skillLabel,
  submittedText,
} from './catalog'
