import type { GrowthRecord, WorkReview } from '../../../contracts/records'
import type { EvidenceLevel, PersonId, WorkGrowScript, WorkSample } from '../../../contracts/types'
import { setStore } from '../../../lib/records'
import { mentionsAny, normalise, nowIso, WORK_GROW } from './growContent'

// Work & Grow's steps: A–D, then E, the growth record (stored as step 'done').
export type WorkStep = WorkReview['step']
export const WORK_STEPS: WorkStep[] = ['review', 'reasoning', 'focus', 'practise', 'done']
export const STEP_LETTERS: Record<WorkStep, string> = { review: 'A', reasoning: 'B', focus: 'C', practise: 'D', done: 'E' }
export const STEP_NAMES: Record<WorkStep, string> = {
  review: 'Review my work',
  reasoning: 'Understand my reasoning',
  focus: 'My growth focus',
  practise: 'Practise & apply',
  done: 'Growth record',
}

export type Edit = (recipe: (review: WorkReview) => void) => void

export function blankReview(id: string, learnerId: PersonId): WorkReview {
  const now = nowIso()
  const { skillId, title, reason } = WORK_GROW.focus
  return {
    id,
    source: 'user',
    learnerId,
    createdAt: now,
    updatedAt: now,
    step: 'review',
    work: { role: '', developmentGoal: '', context: '', aiOutput: '', finalVersion: '', outcome: 'outcome-pending', loadedExample: false },
    reasoning: { changed: '', verified: '', uncertain: '', clarifications: [] },
    focus: { skillId, title, reason, evidence: [], response: null, correction: '', adjusted: false },
    practise: { answer: '', feedback: '', revision: '', nextAction: '' },
  }
}

// Change one review in the store, creating it on its first change.
export function editReview(id: string, learnerId: PersonId, recipe: (review: WorkReview) => void): void {
  setStore((draft) => {
    let review = draft.workReviews.find((r) => r.id === id)
    if (!review) {
      review = blankReview(id, learnerId)
      draft.workReviews.push(review)
    }
    recipe(review)
    review.updatedAt = nowIso()
  })
}

// A: 'Load example' fills step A with the script's sample, and step B's three answers too when
// the script has them (the contract field is optional).
export function fillExample(review: WorkReview, sample: WorkSample = WORK_GROW.sample): void {
  const { role, developmentGoal, context, aiOutput, finalVersion, outcome, exampleReasoning } = sample
  review.work = { role, developmentGoal, context, aiOutput, finalVersion, outcome, loadedExample: true }
  if (exampleReasoning) {
    const { changed, verified, uncertain } = exampleReasoning
    Object.assign(review.reasoning, { changed, verified, uncertain })
  }
}

function sameAsSample(work: WorkReview['work']): boolean {
  const s = WORK_GROW.sample
  return (
    work.context === s.context &&
    work.aiOutput === s.aiOutput &&
    work.finalVersion === s.finalVersion &&
    work.developmentGoal === s.developmentGoal
  )
}

// The script's evidence quotes that really appear in this work. A learner's own work keeps only
// the quotes found in it, so the page never shows the sample's words as theirs.
export function focusEvidence(work: WorkReview['work']): string[] {
  if (work.loadedExample && sameAsSample(work)) return [...WORK_GROW.focus.evidence]
  const text = normalise([work.role, work.developmentGoal, work.context, work.aiOutput, work.finalVersion].join(' '))
  return WORK_GROW.focus.evidence.filter((quote) => normalise(quote) !== '' && text.includes(normalise(quote)))
}

// B: the questions still worth asking. One is skipped when the explanation mentions an askUnless word.
export function questionsToAsk(reasoning: WorkReview['reasoning']) {
  const explanation = [reasoning.changed, reasoning.verified, reasoning.uncertain].join(' ')
  return WORK_GROW.clarifyingQuestions.filter((q) => !mentionsAny(explanation, q.askUnless ?? []))
}

// C: the script's suggestion for this work. With none of its evidence in the learner's text,
// it gives noEvidenceReason instead of reason.
export function suggestedFocus(work: WorkReview['work']): Pick<WorkReview['focus'], 'skillId' | 'title' | 'reason' | 'evidence'> {
  const { skillId, title, reason, noEvidenceReason } = WORK_GROW.focus
  const evidence = focusEvidence(work)
  return { skillId, title, reason: evidence.length > 0 ? reason : noEvidenceReason, evidence }
}

// D: a feedback rule's text is two parts. Its first sentence says what the answer does, the rest
// asks what to look at next: 'You matched the launch… . Next, say who owns…' → says / asks.
function splitRule(text: string): { says: string; asks: string } {
  const end = text.search(/[.?!]\s+(?=[A-Z‘“'"])/)
  if (end < 0) return { says: text.trim(), asks: '' }
  return { says: text.slice(0, end + 1).trim(), asks: text.slice(end + 1).trim() }
}

// D: every rule whose words the answer mentions, not only the first, so each point the answer
// makes is acknowledged. One question follows, from the most specific rule that matched (the
// script lists the most specific first), so the feedback never asks for what the answer already
// gives: an answer that sets a smaller launch is not asked what it will propose. No match: the default.
// The script's first rule is who the learner tells, and its question (owner, review) comes after a
// plan change. So an answer that only tells someone changes nothing in the plan: after the
// acknowledgement, the default follows, which asks what changes in the plan.
// The prompt ends by asking how the plan will show their confirmation. When the script has a
// confirmation rule and some feedback rule matched: an answer that mentions one of its words gets
// its met sentence among the acknowledgements, before the question; any other gets its missing
// sentence at the very end. With no feedback rule matched, the default alone, as before.
export function feedbackFor(answer: string, challenge: WorkGrowScript['challenge'] = WORK_GROW.challenge): string {
  const rules = challenge.feedback
  const hits = rules.filter((f) => mentionsAny(answer, f.ifMentions))
  if (hits.length === 0) return challenge.defaultFeedback
  const matched = hits.map((f) => splitRule(f.text))
  const changesPlan = hits.some((f) => f !== rules[0])
  const asks = changesPlan ? matched.find((m) => m.asks !== '')?.asks : challenge.defaultFeedback
  const { confirmation } = challenge
  const confirmed = confirmation !== undefined && mentionsAny(answer, confirmation.ifMentions)
  return [
    ...matched.map((m) => m.says),
    ...(confirmation && confirmed ? [confirmation.met] : []),
    ...(asks ? [asks] : []),
    ...(confirmation && !confirmed ? [confirmation.missing] : []),
  ].join(' ')
}

const RESPONSE_WORDS: Record<string, string> = {
  corrected: 'Corrected the suggestion',
  mastered: 'Already mastered',
  'not-relevant': 'Not relevant',
  'not-enough-info': 'Not enough information',
}

// Growth record honesty rules (records.ts): the level starts 'not-observed' and is set only by the
// learner's own confirmation or by the Team Lead;
// prompting is 'some' only if they used the clarifying questions; a workplace outcome never
// becomes 'achieved' by itself, and 'shipped' stays 'outcome-pending' until the learner states it.
const OUTCOME_FROM_WORK: Record<WorkReview['work']['outcome'], GrowthRecord['outcome']> = {
  shipped: 'outcome-pending',
  'in-progress': 'outcome-pending',
  'outcome-pending': 'outcome-pending',
}

// E: the workplace growth record, built only from what the learner entered. Created once per review.
export function buildGrowthRecord(review: WorkReview, id: string): GrowthRecord {
  const ref = { kind: 'work' as const, id: review.id }
  const { focus, reasoning, practise } = review
  const evidence: GrowthRecord['evidence'] = []
  if (reasoning.verified.trim()) evidence.push({ text: `Checked: ${reasoning.verified.trim()}`, ref })
  if (focus.response && focus.response !== 'confirmed') {
    evidence.push({ text: `Learner reports: ${focus.correction.trim() || RESPONSE_WORDS[focus.response]}`, ref })
  }
  // Always 'not-observed' at first: agreeing with the suggested focus is not a level. The learner
  // sets one on step E or in My Growth, or the Team Lead's feedback does.
  const level: EvidenceLevel = 'not-observed'
  const usedHints = reasoning.clarifications.some((c) => c.answer.trim() !== '')
  return {
    id,
    source: 'user',
    learnerId: review.learnerId,
    date: nowIso(),
    kind: 'workplace',
    skillId: focus.skillId,
    situation: review.work.context.trim(),
    contribution: (reasoning.changed || review.work.finalVersion).trim(),
    evidence,
    prompting: usedHints ? 'some' : 'none',
    level,
    outcome: OUTCOME_FROM_WORK[review.work.outcome],
    // The learner's own reflection, written on step E: the challenge answer is practice, not learning.
    learning: '',
    nextStep: practise.nextAction.trim(),
    privateNote: '',
    links: [ref],
  }
}
