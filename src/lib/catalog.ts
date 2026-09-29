import { use } from 'react'
import type {
  CaseContent,
  CaseId,
  CaseSummary,
  Person,
  PersonId,
  Role,
  Skill,
  SkillFramework,
  SkillId,
  Team,
  TeamId,
} from '../contracts/types'
import { LANDING_FEATURE } from '../data/landing'
import { CASE_SUMMARIES, RECOMMENDED_CASE_ID } from '../data/library'
import { PEOPLE } from '../data/people'
import { JUNIOR_PROFILE } from '../data/profile'
import { SKILLS } from '../data/skills'
import { LIBRARY_TABS, TEAMS } from '../data/teams'

// Everything content.ts offers except the case bodies (src/data/cases), which are most of the
// data. The landing page, Sign in, the sidebar and the router import this file, so the first
// page loads without the cases; content.ts adds them for the role screens, which load later.
// Pages keep importing content.ts.
export { CASE_SUMMARIES, JUNIOR_PROFILE, LANDING_FEATURE, LIBRARY_TABS, PEOPLE, RECOMMENDED_CASE_ID, SKILLS, TEAMS }

type Cases = Record<CaseId, CaseContent>

// The cases, once loaded: content.ts hands them over when it loads, loadCases() fetches them.
let cases: Cases | null = null
let loading: Promise<Cases> | null = null

export function provideCases(loaded: Cases): void {
  cases = loaded
}

export function casesLoaded(): boolean {
  return cases !== null
}

export function loadCases(): Promise<Cases> {
  loading ??= cases ? Promise.resolve(cases) : import('../data/cases').then((m) => (cases = m.CASES))
  return loading
}

// Suspends the calling component until the cases have loaded (React's use()).
export function waitForCases(): void {
  if (!cases) use(loadCases())
}

function loadedCases(): Cases {
  if (!cases) throw new Error('The cases have not loaded yet')
  return cases
}

// Case Experts' skill templates (src/data/frameworks.ts). Loaded through a glob, so the app
// still builds, with none shown, if the file isn't there.
const frameworkFiles = import.meta.glob<{ SKILL_FRAMEWORKS: SkillFramework[] }>('../data/frameworks.ts', { eager: true })
export const SKILL_FRAMEWORKS: SkillFramework[] = Object.values(frameworkFiles)[0]?.SKILL_FRAMEWORKS ?? []

// Lookups throw on an unknown id. contracts/content.test.ts checks that every id in src/data
// resolves, and the router opens a case step only for a playable case.
function lookup<T extends { id: string }>(items: T[], kind: string): (id: string) => T {
  const byId = new Map(items.map((item) => [item.id, item]))
  return (id) => {
    const item = byId.get(id)
    if (!item) throw new Error(`Unknown ${kind}: ${id}`)
    return item
  }
}

export const getPerson: (personId: PersonId) => Person = lookup(PEOPLE, 'person')
export const getTeam: (teamId: TeamId) => Team = lookup(TEAMS, 'team')
export const getSkill: (skillId: SkillId) => Skill = lookup(SKILLS, 'skill')

// A skill's name for display. Never throws: an unknown id (say, in a record saved before the
// skills changed) shows as the id itself.
export function skillLabel(id: string): string {
  return SKILLS.find((skill) => skill.id === id)?.label ?? id
}

// A person's name for display, as 'Alex M.'. Never throws: an unknown id shows as the id.
export function personName(id: string): string {
  return PEOPLE.find((person) => person.id === id)?.name ?? id
}

// A person's initials for an avatar, as 'AM'. Never throws.
export function personInitials(id: string): string {
  return PEOPLE.find((person) => person.id === id)?.initials ?? id.slice(0, 2).toUpperCase()
}

// A case's short name for display ('Eight Weeks to Japan'), else its title. Never throws.
export function caseName(caseId: CaseId): string {
  const summary = CASE_SUMMARIES.find((s) => s.id === caseId)
  return summary?.shortName ?? summary?.title ?? caseId
}
export const getSummary: (caseId: CaseId) => CaseSummary = lookup(CASE_SUMMARIES, 'case')

// A case can be played when its summary says so and src/data/cases holds its content.
export function isPlayable(caseId: CaseId): boolean {
  return Object.hasOwn(loadedCases(), caseId) && CASE_SUMMARIES.some((s) => s.id === caseId && s.playable)
}

export function getCase(caseId: CaseId): CaseContent {
  if (!isPlayable(caseId)) throw new Error(`Not a playable case: ${caseId}`)
  return loadedCases()[caseId]
}

// 'Dana K.' → 'Dana'
export function firstName(person: Person): string {
  return person.name.split(' ')[0]
}

// The senior who shared a playable case. Its steps and its review name them, so it must have one.
export function caseAuthor(caseId: CaseId): Person {
  const { authorId } = getSummary(caseId)
  if (authorId === undefined) throw new Error(`Case ${caseId} has no authorId`)
  return getPerson(authorId)
}

// 'Japan launch': the Manager header reads '<junior> · <shortName> case'. content.test.ts
// requires it on every playable case.
export function caseShortName(caseId: CaseId): string {
  const { shortName } = getSummary(caseId)
  if (shortName === undefined) throw new Error(`Case ${caseId} has no shortName`)
  return shortName
}

// 'Solutions · Dana K.': the team and author on the landing collage.
export function caseByline(caseId: CaseId): string {
  return `${getTeam(getSummary(caseId).teamId).label} · ${caseAuthor(caseId).name}`
}

// 'SOLUTIONS · FROM DANA K.': the eyebrow over the case title on every step.
export function caseEyebrow(caseId: CaseId): string {
  return `${getTeam(getSummary(caseId).teamId).label} · from ${caseAuthor(caseId).name}`.toUpperCase()
}

// "Next, you'll see Dana's call": the line beside Submit on Decide.
export function nextCallText(caseId: CaseId): string {
  return `Next, you'll see ${firstName(caseAuthor(caseId))}'s call`
}

// "Submitted. Dana's call is next.": the toast after Submit on Decide.
export function submittedText(caseId: CaseId): string {
  return `Submitted. ${firstName(caseAuthor(caseId))}'s call is next.`
}

// The Senior and Manager screens have no case id in their route, so they show the case the
// landing features. content.test.ts checks that it is playable.
export const FEATURED_CASE_ID: CaseId = LANDING_FEATURE.caseId

// The demo account for each role, on Sign in and in the sidebar: the featured case's author,
// the junior whose profile the library shows, and the manager who reviews the featured case.
// The manager needs the cases: the router waits for them on every page but the landing page.
export function demoPerson(role: Role): Person {
  if (role === 'senior') return caseAuthor(FEATURED_CASE_ID)
  if (role === 'junior') return getPerson(JUNIOR_PROFILE.juniorId)
  return getPerson(getCase(FEATURED_CASE_ID).review.managerId)
}
