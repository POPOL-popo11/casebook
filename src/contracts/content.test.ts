import { describe, expect, it } from 'vitest'
import { CASES } from '../data/cases'
import { CASE_SUMMARIES, RECOMMENDED_CASE_ID } from '../data/library'
import { LANDING_FEATURE } from '../data/landing'
import { PEOPLE } from '../data/people'
import { JUNIOR_PROFILE } from '../data/profile'
import { SKILLS } from '../data/skills'
import { LIBRARY_TABS, TEAMS } from '../data/teams'
import type { Store } from './records'
import { CASE_STEPS, DIMENSIONS, SKILL_IDS, type CaseContent, type SkillFramework, type WorkGrowScript } from './types'

const people = new Set(PEOPLE.map((p) => p.id))
const teams = new Set(TEAMS.map((t) => t.id))
const skills = new Set(SKILLS.map((s) => s.id))
const summaries = new Map(CASE_SUMMARIES.map((s) => [s.id, s]))

const ANSWER_KEYS = ['initialPosition', 'why', 'ownPlan', 'mainRisk', 'owner', 'reviewBy', 'changeMind', 'examineReasons']

const sequential = (ids: string[], prefix: string) => ids.every((id, i) => id === `${prefix}${i + 1}`)

function problemsIn(c: CaseContent): string[] {
  const p: string[] = []
  const at = (msg: string) => p.push(`${c.id}: ${msg}`)
  if (summaries.get(c.id)?.playable !== true) at('needs a CaseSummary with playable: true')
  if (!sequential(c.materials.map((m) => m.id), 'm')) at('materials must be m1, m2 … in order')
  if (!sequential(c.cards.map((x) => x.id), 'c')) at('evidence cards must be c1, c2 … in order')
  if (!sequential(c.requests.map((r) => r.id), 'r')) at('requests must be r1, r2 … in order')
  if (!sequential(c.decisionPoints.map((d) => d.id), 'dp') || c.decisionPoints.length !== 4) at('decision points must be dp1–dp4')
  if (c.decisionPoints.map((d) => d.step).join() !== CASE_STEPS.join()) at('decision points must follow define, examine, investigate, decide')
  for (const d of c.decisionPoints) if (d.status === 'review' && !d.reviewPrompt) at(`${d.id} is 'review' but has no reviewPrompt`)
  const materialIds = new Set(c.materials.map((m) => m.id))
  const cardIds = new Set(c.cards.map((x) => x.id))
  const requestIds = new Set(c.requests.map((r) => r.id))
  const optionIds = new Set([...c.options.map((o) => o.id), 'escalate'])
  for (const r of c.requests) if (r.materialId && !materialIds.has(r.materialId)) at(`${r.id} unlocks missing material ${r.materialId}`)
  for (const s of c.skillIds) if (!skills.has(s)) at(`unknown skill ${s}`)
  if (!optionIds.has(c.senior.decision)) at(`senior decision ${c.senior.decision} is not an option`)
  for (const k of Object.keys(c.senior.sort ?? {})) if (!cardIds.has(k)) at(`senior sort names missing card ${k}`)
  for (const k of c.senior.requestIds ?? []) if (!requestIds.has(k)) at(`senior requests missing request ${k}`)
  for (const k of Object.keys(c.senior.byPoint ?? {})) if (!c.decisionPoints.some((d) => d.id === k)) at(`senior byPoint names missing point ${k}`)
  const ex = c.example
  if (ex) {
    if (!people.has(ex.juniorId)) at(`unknown junior ${ex.juniorId}`)
    if (Object.keys(ex.sort).sort().join() !== [...cardIds].sort().join()) at('example sort must place every evidence card exactly once')
    for (const k of ex.requestedIds) if (!requestIds.has(k)) at(`example requests missing request ${k}`)
    if (!optionIds.has(ex.decision) && ex.decision !== 'own') at(`example decision ${ex.decision} is not an option`)
    const used = ex.requestedIds.reduce((h, id) => h + (c.requests.find((r) => r.id === id)?.hours ?? 0), 0)
    if (used > c.timeBudgetHours) at('example requests exceed the time budget')
    for (const k of Object.keys(ex.sortReasons ?? {})) if (!cardIds.has(k)) at(`example sort reason names missing card ${k}`)
    for (const k of Object.keys(ex.requestIntents ?? {})) if (!requestIds.has(k)) at(`example intent names missing request ${k}`)
  }
  if (c.review) {
    if (!people.has(c.review.managerId)) at(`unknown manager ${c.review.managerId}`)
    for (const s of [...c.review.nextFocus, c.review.nextFocusDefault]) if (!skills.has(s)) at(`unknown next-focus skill ${s}`)
  }
  // Overnight additions: what a learner opens must be readable, and every id they name must exist.
  for (const m of c.materials) if (!m.body || !m.source || !m.date) at(`${m.id} needs body, source and date`)
  for (const r of c.requests) {
    const m = c.materials.find((x) => x.id === r.materialId)
    if (!m || m.visibility !== 'request') at(`${r.id} must unlock a 'request' material`)
  }
  const dims = new Set<string>(DIMENSIONS.map((d) => d.id))
  for (const k of c.assessment?.criteria ?? []) {
    if (!dims.has(k.dimensionId)) at(`criterion ${k.id} names unknown dimension ${k.dimensionId}`)
    for (const key of k.mentionsIn ?? []) if (!ANSWER_KEYS.includes(key) && !(c.submission?.fields ?? []).some((f) => f.id === key)) at(`criterion ${k.id} looks in unknown answer ${key}`)
    for (const id of k.requestIds ?? []) if (!requestIds.has(id)) at(`criterion ${k.id} names missing request ${id}`)
    for (const id of k.notBasedOn ?? []) if (!c.cards.some((x) => x.id === id) && !requestIds.has(id) && !c.materials.some((x) => x.id === id)) at(`criterion ${k.id} rules out unknown Based-on id ${id}`)
  }
  const fieldIds = (c.submission?.fields ?? []).map((f) => f.id)
  if (new Set(fieldIds).size !== fieldIds.length) at('submission field ids must be unique')
  for (const id of fieldIds) if (ANSWER_KEYS.includes(id)) at(`submission field id ${id} clashes with a built-in answer key`)
  for (const k of Object.keys(ex?.submission ?? {})) if (!fieldIds.includes(k)) at(`example submission names missing field ${k}`)
  const roleIds = new Set((c.roles ?? []).map((r) => r.id))
  for (const m of c.materials) if (m.roleId && !roleIds.has(m.roleId)) at(`${m.id} belongs to missing role ${m.roleId}`)
  if (c.room) {
    const r = c.room
    if (!roleIds.has(r.humanRoleId)) at(`room human role ${r.humanRoleId} is missing`)
    for (const id of r.aiRoleIds) if (!roleIds.has(id) || id === r.humanRoleId) at(`room AI role ${id} is missing or is the human`)
    if (!sequential(r.questions.map((q) => q.id), 'q')) at('room questions must be q1, q2 … in order')
    // With playableRoleIds, any role in the room can be an AI role (the one the learner plays is hidden).
    for (const id of r.playableRoleIds ?? []) if (id !== r.humanRoleId && !r.aiRoleIds.includes(id)) at(`playable role ${id} is not in the room`)
    const askable = r.playableRoleIds ? [r.humanRoleId, ...r.aiRoleIds] : r.aiRoleIds
    for (const q of r.questions) {
      if (!askable.includes(q.toRoleId)) at(`${q.id} asks ${q.toRoleId}, which is not an AI role`)
      if (q.materialId && !materialIds.has(q.materialId)) at(`${q.id} cites missing material ${q.materialId}`)
    }
    for (const id of Object.keys(r.challengeReplies ?? {})) if (!askable.includes(id)) at(`challenge reply for non-AI role ${id}`)
    for (const q of r.questions) {
      const m = c.materials.find((x) => x.id === q.materialId)
      if (!m || m.roleId !== q.toRoleId) at(`${q.id} must cite a material held by ${q.toRoleId}`)
    }
    const qIds = new Set(r.questions.map((q) => q.id))
    for (const k of r.conflicts ?? []) for (const q of k.revealedBy) if (!qIds.has(q)) at(`conflict ${k.id} names missing question ${q}`)
    for (const k of r.replies ?? []) if (!askable.includes(k.toRoleId)) at(`reply ${k.id} goes to non-AI role ${k.toRoleId}`)
  }
  return p
}

// Data files that may not exist yet are loaded through import.meta.glob, so their checks wait for them.
const seedFiles = import.meta.glob<{ SEED_STORE: Store }>('../data/seed.ts', { eager: true })
const frameworkFiles = import.meta.glob<{ SKILL_FRAMEWORKS: SkillFramework[] }>('../data/frameworks.ts', { eager: true })
const workGrowFiles = import.meta.glob<{ WORK_GROW: WorkGrowScript }>('../data/workGrow.ts', { eager: true })

function seedProblems(s: Store): string[] {
  const p: string[] = []
  const known = (id: string, what: string) => people.has(id) || p.push(`seed: unknown ${what} ${id}`)
  const ids = new Set<string>()
  const all = [...s.attempts, ...s.rooms, ...s.workReviews, ...s.growth, ...s.shares, ...s.feedback, ...s.selfReviews]
  for (const r of all) {
    if (ids.has(r.id)) p.push(`seed: duplicate id ${r.id}`)
    ids.add(r.id)
  }
  for (const a of s.attempts) {
    known(a.learnerId, 'learner')
    const c = CASES[a.caseId]
    if (!c) p.push(`seed: ${a.id} names missing case ${a.caseId}`)
    else {
      for (const k of Object.keys(a.examine.sort)) if (!c.cards.some((x) => x.id === k)) p.push(`seed: ${a.id} sorts missing card ${k}`)
      for (const r of a.investigate.requests) if (!c.requests.some((x) => x.id === r.requestId)) p.push(`seed: ${a.id} requests missing ${r.requestId}`)
    }
  }
  for (const r of s.rooms) {
    known(r.learnerId, 'learner')
    if (!CASES[r.caseId]?.roles?.some((x) => x.id === r.roleId)) p.push(`seed: ${r.id} plays missing role ${r.roleId}`)
  }
  for (const g of s.growth) {
    known(g.learnerId, 'learner')
    if (!skills.has(g.skillId)) p.push(`seed: ${g.id} names unknown skill ${g.skillId}`)
    for (const l of g.links) if (!ids.has(l.id) && ![...s.attempts, ...s.rooms, ...s.workReviews].some((x) => x.id === l.id)) p.push(`seed: ${g.id} links missing ${l.id}`)
  }
  for (const sh of s.shares) {
    known(sh.learnerId, 'learner')
    known(sh.managerId, 'manager')
    for (const it of sh.items) if (!s.growth.some((g) => g.id === it.recordId)) p.push(`seed: ${sh.id} shares missing record ${it.recordId}`)
  }
  for (const f of s.feedback) {
    known(f.fromId, 'feedback author')
    known(f.toId, 'feedback recipient')
    if (!ids.has(f.about.id)) p.push(`seed: ${f.id} is about missing ${f.about.id}`)
  }
  return p
}

describe('content contract', () => {
  it('every playable case follows the ID rules and cross-references', () => {
    expect(Object.values(CASES).flatMap(problemsIn)).toEqual([])
  })

  it('CASES keys match their case ids, and every playable summary has content', () => {
    const problems: string[] = []
    for (const [key, c] of Object.entries(CASES)) if (key !== c.id) problems.push(`CASES['${key}'] holds ${c.id}`)
    for (const s of CASE_SUMMARIES) if (s.playable && !CASES[s.id]) problems.push(`${s.id} is playable but has no content`)
    expect(problems).toEqual([])
  })

  it('library, landing and profile references resolve', () => {
    const problems: string[] = []
    const ids = CASE_SUMMARIES.map((s) => s.id)
    if (new Set(ids).size !== ids.length) problems.push('duplicate case ids')
    for (const s of CASE_SUMMARIES) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id)) problems.push(`${s.id}: caseId must be kebab-case`)
      if (!teams.has(s.teamId)) problems.push(`${s.id}: unknown team ${s.teamId}`)
      if (s.authorId !== undefined && !people.has(s.authorId)) problems.push(`${s.id}: unknown author ${s.authorId}`)
      if (s.playable && !s.shortName) problems.push(`${s.id}: a playable case needs a shortName`)
      if (s.playable && !s.authorId) problems.push(`${s.id}: a playable case needs an author`)
      if (!s.progress && s.minutes === undefined) problems.push(`${s.id}: needs minutes unless it is in progress`)
    }
    const recommended = summaries.get(RECOMMENDED_CASE_ID)
    if (!recommended) problems.push('RECOMMENDED_CASE_ID is not in the library')
    else if (!recommended.focus || recommended.minutes === undefined) problems.push('the recommended case needs focus and minutes')
    // Everyone the app names on screen: the landing quote, the junior and their feedback,
    // and each playable case's author, junior and reviewing manager (sidebar, Sign in, headers).
    const shown = [LANDING_FEATURE.quote.fromId, JUNIOR_PROFILE.juniorId, JUNIOR_PROFILE.feedback.fromId]
    for (const c of Object.values(CASES)) {
      const author = summaries.get(c.id)?.authorId
      if (author) shown.push(author)
      if (c.example) shown.push(c.example.juniorId)
      if (c.review) shown.push(c.review.managerId)
    }
    if ([...skills].sort().join() !== [...SKILL_IDS].sort().join()) problems.push('skills.ts must hold exactly SKILL_IDS')
    for (const s of CASE_SUMMARIES) {
      if (!s.blurb || !s.skillIds?.length || !s.yourRole || !s.submits) problems.push(`${s.id}: needs blurb, skillIds, yourRole and submits`)
      if (!s.playable && (s.materialsPreview?.length ?? 0) < 2) problems.push(`${s.id}: a Preview needs at least 2 materialsPreview`)
      for (const k of s.skillIds ?? []) if (!skills.has(k)) problems.push(`${s.id}: unknown skill ${k}`)
      for (const m of s.modes ?? []) if (m !== 'individual' && m !== 'team') problems.push(`${s.id}: unknown mode ${m}`)
      if ((s.modes ?? []).includes('team') && !CASES[s.id]?.room) problems.push(`${s.id}: offers team mode but has no room script`)
    }
    for (const id of shown) {
      if (people.has(id) && !PEOPLE.find((p) => p.id === id)?.title) problems.push(`${id}: people shown in the app need a title`)
    }
    for (const t of LIBRARY_TABS) if (!teams.has(t)) problems.push(`unknown library tab ${t}`)
    if (!CASES[LANDING_FEATURE.caseId]) problems.push('the landing feature needs a playable case')
    if (!people.has(LANDING_FEATURE.quote.fromId)) problems.push('unknown landing quote author')
    if (!people.has(JUNIOR_PROFILE.juniorId) || !people.has(JUNIOR_PROFILE.feedback.fromId)) problems.push('unknown profile person')
    for (const s of JUNIOR_PROFILE.skills) if (!skills.has(s.skillId)) problems.push(`unknown profile skill ${s.skillId}`)
    expect(problems).toEqual([])
  })

  it('the demo seed, skill frameworks and Work & Grow script point at things that exist', () => {
    const problems: string[] = []
    for (const m of Object.values(seedFiles)) problems.push(...seedProblems(m.SEED_STORE))
    for (const m of Object.values(frameworkFiles)) {
      for (const f of m.SKILL_FRAMEWORKS) {
        if (!teams.has(f.teamId)) problems.push(`framework ${f.id}: unknown team ${f.teamId}`)
        for (const s of f.skills) {
          if (!skills.has(s.skillId)) problems.push(`framework ${f.id}: unknown skill ${s.skillId}`)
          if (s.behaviours.length !== f.levels.length) problems.push(`framework ${f.id}: ${s.skillId} needs one behaviour per level`)
        }
      }
    }
    for (const m of Object.values(workGrowFiles)) {
      const w = m.WORK_GROW
      if (!people.has(w.sample.learnerId)) problems.push(`work & grow: unknown learner ${w.sample.learnerId}`)
      for (const k of [w.focus.skillId, w.focus.afterCorrection.skillId]) if (!skills.has(k)) problems.push(`work & grow: unknown skill ${k}`)
    }
    expect(problems).toEqual([])
  })
})
