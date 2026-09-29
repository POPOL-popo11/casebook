import { describe, expect, it } from 'vitest'
import type { GrowthRecord, WorkReview } from '../../../contracts/records'
import { SEED_STORE } from '../../../data/seed'
import { WORK_GROW } from '../../../data/workGrow'
import { recordTitle, shortTitle, TITLE_MAX } from './growContent'
import { buildSections, sectionFor } from './selfReview'
import { blankReview, buildGrowthRecord, fillExample } from './workReview'

const RECORD_SECTIONS = ['contributions', 'growth', 'challenges'] as const

function record(over: Partial<GrowthRecord>): GrowthRecord {
  return {
    id: 'gr-test',
    source: 'user',
    learnerId: 'alex',
    date: '2026-09-28T02:00:00.000Z',
    kind: 'practice',
    skillId: 'framing',
    situation: 'A practice case: pick a scope',
    contribution: '',
    evidence: [],
    prompting: 'none',
    level: 'not-observed',
    outcome: 'practice-only',
    learning: '',
    nextStep: '',
    privateNote: '',
    links: [],
    ...over,
  }
}

// The review Work & Grow builds from the example, answered through step D.
function sampleReview(): WorkReview {
  const review = blankReview('work-test', 'alex')
  const { role, developmentGoal, context, aiOutput, finalVersion, outcome } = WORK_GROW.sample
  review.work = { role, developmentGoal, context, aiOutput, finalVersion, outcome, loadedExample: true }
  review.reasoning.changed = 'Changed the scope to card payments only.'
  review.focus.response = 'confirmed'
  review.practise.nextAction = 'Ask Operations what volume it can support.'
  return review
}

describe('self-review draft', () => {
  it('puts each seeded record in exactly one of Contributions, Growth and Challenges', () => {
    const records = SEED_STORE.growth
    const sections = buildSections(records, SEED_STORE.feedback)
    for (const r of records) {
      const places = RECORD_SECTIONS.filter((k) => sections[k].some((l) => l.sourceRecordIds.includes(r.id)))
      expect(places, r.id).toHaveLength(1)
      expect(sections[places[0]].filter((l) => l.sourceRecordIds.includes(r.id)), r.id).toHaveLength(1)
    }
  })

  it('keeps a next step out of the record lines and lists each goal once', () => {
    const a = record({ id: 'gr-a', nextStep: 'Ask the client what is fixed.' })
    const b = record({ id: 'gr-b', date: '2026-09-29T02:00:00.000Z', nextStep: '  ask the client   what is fixed ' })
    const c = record({ id: 'gr-c', nextStep: 'Check with Operations.' })
    const { nextGoals, challenges } = buildSections([a, b, c], [])
    expect(nextGoals.map((l) => l.text)).toEqual(['Ask the client what is fixed.', 'Check with Operations.'])
    expect(nextGoals[0].sourceRecordIds).toEqual(['gr-a', 'gr-b'])
    expect(challenges.some((l) => l.text.includes('what is fixed'))).toBe(false)
  })

  it('sorts records by what they hold', () => {
    expect(sectionFor(record({ kind: 'workplace', contribution: 'Asked first.', outcome: 'outcome-pending' }))).toBe('contributions')
    expect(sectionFor(record({ contribution: 'Asked first.', level: 'practice' }))).toBe('challenges')
    expect(sectionFor(record({ learning: 'Ask first.' }))).toBe('growth')
    expect(sectionFor(record({}))).toBe('challenges')
  })

  it('gives a Work & Grow record a short title and keeps its full situation in the line', () => {
    const r = buildGrowthRecord(sampleReview(), 'gr-work')
    const [line] = buildSections([r], []).contributions
    const title = shortTitle(r.situation)
    expect(title).toBe('Write the launch plan for a client')
    expect(recordTitle(r)).toBe(title)
    expect(recordTitle(SEED_STORE.growth[1])).toBe(SEED_STORE.growth[1].situation)
    expect(line.text.startsWith(`${title}: `)).toBe(true)
    expect(line.text).toContain(`Situation: ${r.situation}`)
    expect(line.text).toContain('outcome pending')
  })

  it('cuts a long first clause at a word, within 60 characters', () => {
    const title = shortTitle('Prepare the quarterly migration plan for every regional merchant account team before the audit')
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX)
    expect(title.endsWith('…')).toBe(true)
    expect(shortTitle('Pick a scope. Then write it up')).toBe('Pick a scope')
  })
})

describe('Work & Grow', () => {
  it('Load example fills step B from exampleReasoning when the script has it', () => {
    const exampleReasoning = { changed: 'Cut the scope.', verified: 'Engineering, by email.', uncertain: 'Operations volume.' }
    const review = blankReview('work-test', 'alex')
    fillExample(review, { ...WORK_GROW.sample, exampleReasoning })
    expect(review.work.context).toBe(WORK_GROW.sample.context)
    expect(review.reasoning).toMatchObject(exampleReasoning)
    const without = blankReview('work-test-2', 'alex')
    fillExample(without, { ...WORK_GROW.sample, exampleReasoning: undefined })
    expect(without.work.loadedExample).toBe(true)
    expect(without.reasoning).toMatchObject({ changed: '', verified: '', uncertain: '' })
  })

  it("starts at 'not-observed', even when the learner confirmed the focus", () => {
    expect(buildGrowthRecord(sampleReview(), 'gr-work').level).toBe('not-observed')
  })
})
