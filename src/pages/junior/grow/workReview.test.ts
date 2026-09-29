import { describe, expect, it } from 'vitest'
import type { WorkGrowScript } from '../../../contracts/types'
import { WORK_GROW } from '../../../data/workGrow'
import { mentionsAny } from './growContent'
import { feedbackFor } from './workReview'

// The real script's rules, with the confirmation part set by each test: the content agent may not
// have added it yet, so a fixture stands in for it (and a last test checks the real one when present).
type Challenge = WorkGrowScript['challenge']
const without: Challenge = { ...WORK_GROW.challenge, confirmation: undefined }
const confirmation = {
  ifMentions: ['shared log'],
  met: 'You said where their confirmation will show.',
  missing: 'Where in the plan will their confirmation show?',
}
const withFixture: Challenge = { ...WORK_GROW.challenge, confirmation }

const rules = WORK_GROW.challenge.feedback
const says = (text: string) => text.slice(0, text.search(/[.?!]\s/) + 1)
const asks = (text: string) => text.slice(says(text).length).trim()

// Matches the first rule (who they tell) and the second (a partial launch): the first asks the question.
const PLAN = 'Open with half the catalogue in week 6, and tell Operations first.'
// Matches the first rule only: telling someone changes nothing in the plan.
const TELL = 'I tell the client first.'
const NONE = 'Keep the plan as it is.'
const LOGGED = ' Their sign-off goes in the shared log.'

describe('feedbackFor and the confirmation part of the challenge', () => {
  it('with no confirmation in the script, gives the acknowledgements and one question', () => {
    expect(feedbackFor(PLAN, without)).toBe(`${says(rules[0].text)} ${says(rules[1].text)} ${asks(rules[0].text)}`)
    expect(feedbackFor(TELL, without)).toBe(`${says(rules[0].text)} ${WORK_GROW.challenge.defaultFeedback}`)
    expect(feedbackFor(PLAN + LOGGED, without)).toBe(feedbackFor(PLAN, without))
  })

  it('met: joins the acknowledgements, before the one question', () => {
    expect(feedbackFor(PLAN + LOGGED, withFixture)).toBe(
      `${says(rules[0].text)} ${says(rules[1].text)} ${confirmation.met} ${asks(rules[0].text)}`,
    )
    expect(feedbackFor(TELL + LOGGED, withFixture)).toBe(`${says(rules[0].text)} ${confirmation.met} ${WORK_GROW.challenge.defaultFeedback}`)
  })

  it('missing: added at the very end', () => {
    expect(feedbackFor(PLAN, withFixture)).toBe(`${feedbackFor(PLAN, without)} ${confirmation.missing}`)
    expect(feedbackFor(TELL, withFixture)).toBe(`${says(rules[0].text)} ${WORK_GROW.challenge.defaultFeedback} ${confirmation.missing}`)
  })

  it('no rule matched: the default feedback alone, confirmation or not', () => {
    expect(feedbackFor(NONE, without)).toBe(WORK_GROW.challenge.defaultFeedback)
    expect(feedbackFor(NONE, withFixture)).toBe(WORK_GROW.challenge.defaultFeedback)
    expect(feedbackFor(NONE + LOGGED, withFixture)).toBe(WORK_GROW.challenge.defaultFeedback)
  })

  const real = WORK_GROW.challenge.confirmation
  it.runIf(real !== undefined)("the script's own confirmation, once it is there", () => {
    if (!real) return
    expect(real.ifMentions.length).toBeGreaterThan(0)
    const met = feedbackFor(`${PLAN} ${real.ifMentions[0]}.`)
    expect(met).toContain(real.met)
    expect(met).not.toContain(real.missing)
    if (!mentionsAny(PLAN, real.ifMentions)) expect(feedbackFor(PLAN).endsWith(real.missing)).toBe(true)
    expect(feedbackFor(NONE)).toBe(WORK_GROW.challenge.defaultFeedback)
  })
})
