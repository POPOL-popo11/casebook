import { describe, expect, it } from 'vitest'
import type { DecideAnswer, PracticeAttempt } from '../contracts/records'
import type { AssessmentCriterion, CaseContent } from '../contracts/types'
import { CASES } from './content'
import { answerLabel, answerSources, assessAttempt, attemptAtVersion, MIN_FIELD_LENGTH } from './assessment'

const criterion = (id: string, rules: Partial<AssessmentCriterion>): AssessmentCriterion => ({
  id,
  label: id,
  lookFor: '',
  dimensionId: 'evidence',
  met: `${id} met`,
  notYet: `${id} not yet`,
  ...rules,
})

const content = (...criteria: AssessmentCriterion[]) =>
  ({ assessment: { criteria, commonMisses: [], acceptableAlternatives: [], mustEscalate: [] } }) as unknown as CaseContent

const decide = (over: Partial<DecideAnswer> = {}): DecideAnswer => ({
  optionId: null,
  ownPlan: '',
  fields: {},
  basedOn: [],
  why: '',
  mainRisk: '',
  owner: '',
  reviewBy: '',
  changeMind: '',
  confidence: null,
  ...over,
})

const attempt = (over: { decide?: Partial<DecideAnswer>; requests?: string[]; position?: string; reasons?: Record<string, string> } = {}) =>
  ({
    id: 'att-1',
    define: { goal: '', success: [], people: [], initialPosition: { recommendation: over.position ?? '', reason: '', confidence: null, question: '' } },
    examine: { sort: {}, reasons: over.reasons ?? {}, missing: [] },
    investigate: { requests: (over.requests ?? []).map((requestId) => ({ requestId, intent: '', at: '' })) },
    decide: decide(over.decide),
    versions: [],
  }) as unknown as PracticeAttempt

const metOf = (c: CaseContent, a: PracticeAttempt) => assessAttempt(c, a).map((r) => r.met)

describe('assessAttempt', () => {
  it('requestIds: met only when every request was made', () => {
    const c = content(criterion('asks', { requestIds: ['r1', 'r3'] }))
    expect(metOf(c, attempt({ requests: ['r1', 'r2', 'r3'] }))).toEqual([true])
    expect(metOf(c, attempt({ requests: ['r1'] }))).toEqual([false])
  })

  it('ifMentions: one mention anywhere in the answers, at the start of a word, in any case', () => {
    const c = content(criterion('ops', { ifMentions: ['operations', 'ops', 'client’s deadline'] }))
    expect(metOf(c, attempt({ decide: { why: 'Operations can’t cover it.' } }))).toEqual([true])
    expect(metOf(c, attempt({ decide: { ownPlan: 'Ask OPS first' } }))).toEqual([true])
    expect(metOf(c, attempt({ decide: { fields: { scope: 'the client\'s deadline holds' } } }))).toEqual([true])
    expect(metOf(c, attempt({ decide: { owner: 'Ops lead' } }))).toEqual([true])
    expect(metOf(c, attempt({ position: 'Check operationsfirst' }))).toEqual([true])
    expect(metOf(c, attempt({ decide: { why: 'It stops the launch' } }))).toEqual([false])
    expect(metOf(c, attempt())).toEqual([false])
  })

  it('fields: each named field holds at least 8 characters', () => {
    const c = content(criterion('filled', { fields: ['scope', 'owner'] }))
    expect(MIN_FIELD_LENGTH).toBe(8)
    expect(metOf(c, attempt({ decide: { fields: { scope: 'x'.repeat(8), owner: 'Dana owns refunds' } } }))).toEqual([true])
    expect(metOf(c, attempt({ decide: { fields: { scope: 'x'.repeat(8), owner: 'x'.repeat(7) } } }))).toEqual([false])
    expect(metOf(c, attempt({ decide: { fields: { scope: 'x'.repeat(8), owner: `  ${'x'.repeat(6)}  ` } } }))).toEqual([false])
    expect(metOf(c, attempt({ decide: { fields: { scope: 'tbd', owner: '-' } } }))).toEqual([false])
  })

  it('fields: the notYet text names exactly the fields still empty or too short', () => {
    const c = {
      ...content(criterion('filled', { fields: ['pre', 'owners', 'stop'] })),
      submission: { name: '', fields: [{ id: 'pre', label: 'Preconditions' }, { id: 'owners', label: 'Risk owners' }] },
    } as unknown as CaseContent
    const textOf = (f: Record<string, string>) => assessAttempt(c, attempt({ decide: { fields: f } }))[0].text
    expect(textOf({ pre: 'Returns partner signed', owners: 'tbd', stop: 'Stop if refunds fail' })).toBe(
      'filled not yet Still empty or too short: Risk owners.',
    )
    expect(textOf({ owners: 'Dana owns refunds' })).toBe('filled not yet Still empty or too short: Preconditions, stop.')
    expect(textOf({ pre: 'Returns partner signed', owners: 'Dana owns refunds', stop: 'Stop if refunds fail' })).toBe('filled met')
  })

  it('fields: no list of fields when only another rule fails', () => {
    const c = content(criterion('both', { fields: ['scope'], ifMentions: ['refund'] }))
    const [result] = assessAttempt(c, attempt({ decide: { fields: { scope: 'Japan only' } } }))
    expect([result.met, result.text]).toEqual([false, 'both not yet'])
  })

  it('notBasedOn: met when none is ticked; otherwise not met and the ticked ones are named', () => {
    const c = {
      ...content(criterion('nb', { notBasedOn: ['c2', 'r1', 'm3', 'x9'] })),
      cards: [{ id: 'c2', text: 'Cards accepted, AUD only' }],
      requests: [{ id: 'r1', title: 'Refund history', materialId: 'm1' }],
      materials: [{ id: 'm1', title: 'Refund log' }, { id: 'm3', title: 'Call notes' }],
    } as unknown as CaseContent
    const resultOf = (basedOn: string[]) => assessAttempt(c, attempt({ decide: { basedOn } }))[0]
    expect([resultOf([]).met, resultOf([]).text]).toEqual([true, 'nb met'])
    expect([resultOf(['c1']).met, resultOf(['c1']).text]).toEqual([true, 'nb met'])
    const ticked = resultOf(['x9', 'c2', 'r1', 'm3'])
    expect([ticked.met, ticked.text]).toEqual([false, "nb not yet Your 'Based on' still lists: Cards accepted, AUD only, Refund log, Call notes, x9."])
  })

  it('notBasedOn: after the fields suffix; no effect on a criterion without it', () => {
    const c = content(criterion('both', { fields: ['scope'], notBasedOn: ['c2'] }), criterion('plain', { ifMentions: ['refund'] }))
    const results = assessAttempt(c, attempt({ decide: { basedOn: ['c2'], why: 'refunds by hand' } }))
    expect(results.map((r) => [r.met, r.text])).toEqual([
      [false, "both not yet Still empty or too short: scope. Your 'Based on' still lists: c2."],
      [true, 'plain met'],
    ])
  })

  it('needs every rule a criterion has, and never meets a criterion without rules', () => {
    const c = content(criterion('both', { requestIds: ['r1'], ifMentions: ['refund'] }), criterion('none', {}))
    expect(metOf(c, attempt({ requests: ['r1'], decide: { why: 'refunds by hand' } }))).toEqual([true, false])
    expect(metOf(c, attempt({ requests: ['r1'] }))).toEqual([false, false])
  })

  it('returns the criterion and its met or notYet text, in the case’s order', () => {
    const c = content(criterion('a', { ifMentions: ['alpha'] }), criterion('b', { ifMentions: ['beta'] }))
    const results = assessAttempt(c, attempt({ decide: { why: 'beta' } }))
    expect(results.map((r) => [r.criterion.id, r.text])).toEqual([
      ['a', 'a not yet'],
      ['b', 'b met'],
    ])
  })

  it('gives no results for a case without an assessment, and never throws on real cases', () => {
    expect(assessAttempt({} as CaseContent, attempt())).toEqual([])
    for (const c of Object.values(CASES)) {
      expect(assessAttempt(c, attempt())).toHaveLength(c.assessment?.criteria.length ?? 0)
    }
  })

  describe('mentionsIn', () => {
    const phrases = ['cannot promise', 'can’t promise']
    const promisedInReply = { why: 'I cannot promise a date yet.', fields: { 'customer-reply': 'You will have it by Friday.' } }

    it('matches inside the named answers', () => {
      const c = content(criterion('no-promise', { ifMentions: phrases, mentionsIn: ['why'] }))
      expect(metOf(c, attempt({ decide: { why: 'We can’t promise Friday.' } }))).toEqual([true])
    })

    it('is not met when the only match is outside the named answers', () => {
      const c = content(criterion('no-promise', { ifMentions: phrases, mentionsIn: ['customer-reply'] }))
      expect(metOf(c, attempt({ decide: promisedInReply }))).toEqual([false])
      expect(metOf(c, attempt({ decide: { ownPlan: 'cannot promise', mainRisk: 'cannot promise' }, position: 'cannot promise' }))).toEqual([false])
    })

    it('reads a SubmissionField id as that field only', () => {
      const c = content(criterion('no-promise', { ifMentions: phrases, mentionsIn: ['customer-reply'] }))
      const reply = { fields: { 'customer-reply': 'We cannot promise Friday.', scope: 'x' } }
      expect(metOf(c, attempt({ decide: reply }))).toEqual([true])
      expect(metOf(c, attempt({ decide: { fields: { scope: 'We cannot promise Friday.' } } }))).toEqual([false])
    })

    it('reads initialPosition as the initial recommendation, reason and question', () => {
      const c = content(criterion('first', { ifMentions: ['refund'], mentionsIn: ['initialPosition', 'owner'] }))
      expect(metOf(c, attempt({ position: 'Refund them first' }))).toEqual([true])
      expect(metOf(c, attempt({ decide: { owner: 'Refunds team' } }))).toEqual([true])
      expect(metOf(c, attempt({ decide: { why: 'refund' } }))).toEqual([false])
    })

    it('without mentionsIn, still matches in any answer', () => {
      const c = content(criterion('no-promise', { ifMentions: phrases }))
      expect(metOf(c, attempt({ decide: promisedInReply }))).toEqual([true])
    })

    it('answerSources lists only the named answers, labelled', () => {
      const c = { submission: { name: '', fields: [{ id: 'customer-reply', label: 'Customer reply' }] } } as unknown as CaseContent
      const a = attempt({ decide: { ...promisedInReply, owner: 'Ops lead' } })
      expect(answerSources(c, a, ['customer-reply', 'owner'])).toEqual([
        { label: 'Customer reply', text: 'You will have it by Friday.' },
        { label: 'Owner', text: 'Ops lead' },
      ])
      expect(answerSources(c, a).map((s) => s.label)).toEqual(['Why', 'Customer reply', 'Owner'])
      expect(answerLabel(c, 'customer-reply')).toBe('Customer reply')
      expect(answerLabel(c, 'initialPosition')).toBe('Initial position')
    })
  })

  describe('examineReasons', () => {
    const cards = [
      { id: 'c1', text: 'Cards accepted, AUD only', source: 'Checkout config' },
      { id: 'c2', text: 'Forecast of 400 orders', source: 'Sales deck' },
    ]
    const withCards = (...criteria: AssessmentCriterion[]) => ({ ...content(...criteria), cards }) as unknown as CaseContent
    const unsourced = { c2: 'No source for the forecast.' }

    it('counts every Examine sort reason in the default answers', () => {
      const c = withCards(criterion('assumption', { ifMentions: ['no source'] }))
      expect(metOf(c, attempt({ reasons: unsourced }))).toEqual([true])
      expect(metOf(c, attempt({ reasons: { c1: 'Fine', c2: '' } }))).toEqual([false])
    })

    it('with mentionsIn, reads only the sort reasons', () => {
      const c = withCards(criterion('assumption', { ifMentions: ['no source'], mentionsIn: ['examineReasons'] }))
      expect(metOf(c, attempt({ reasons: unsourced }))).toEqual([true])
      expect(metOf(c, attempt({ decide: { why: 'There is no source.' }, position: 'no source' }))).toEqual([false])
    })

    it('does not count sort reasons when mentionsIn leaves them out', () => {
      const c = withCards(criterion('assumption', { ifMentions: ['no source'], mentionsIn: ['why'] }))
      expect(metOf(c, attempt({ reasons: unsourced }))).toEqual([false])
    })

    it('answerSources labels each reason by its card, in card order, and leaves out empty ones', () => {
      const a = attempt({ decide: { why: 'Hold' }, reasons: { old: 'A card since removed', c2: 'No source.', c1: '  ' } })
      expect(answerSources(withCards(), a)).toEqual([
        { label: 'Why', text: 'Hold' },
        { label: 'Examine reason: Forecast of 400 orders', text: 'No source.' },
        { label: 'Examine reason: old', text: 'A card since removed' },
      ])
      expect(answerSources(withCards(), a, ['examineReasons']).map((s) => s.label)).toEqual([
        'Examine reason: Forecast of 400 orders',
        'Examine reason: old',
      ])
      expect(answerLabel(withCards(), 'examineReasons')).toBe('Examine sort reasons')
    })

    it('attemptAtVersion reads the sort reasons of that version', () => {
      const c = withCards(criterion('assumption', { ifMentions: ['no source'], mentionsIn: ['examineReasons'] }))
      const a = attempt()
      a.versions = [{ at: '', define: a.define, examine: { sort: {}, reasons: unsourced, missing: [] }, investigate: a.investigate, decide: a.decide, whyChanged: '' }]
      expect(metOf(c, a)).toEqual([false])
      expect(metOf(c, attemptAtVersion(a, 0))).toEqual([true])
    })
  })

  it('attemptAtVersion assesses a submitted version, not the working draft', () => {
    const c = content(criterion('why', { ifMentions: ['refund'] }))
    const a = attempt({ decide: { why: 'nothing yet' } })
    a.versions = [{ at: '', define: a.define, examine: a.examine, investigate: a.investigate, decide: decide({ why: 'refund risk' }), whyChanged: '' }]
    expect(metOf(c, a)).toEqual([false])
    expect(metOf(c, attemptAtVersion(a, 0))).toEqual([true])
    expect(attemptAtVersion(a, 5)).toBe(a)
  })
})
