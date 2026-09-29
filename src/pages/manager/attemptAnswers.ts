import type { DecideAnswer, PracticeAttempt } from '../../contracts/records'
import type { AssessmentCriterion, CaseContent, Confidence, DimensionId } from '../../contracts/types'
import { answerLabel, answerSources, attemptAtVersion, mentionsAny, MIN_FIELD_LENGTH } from '../../lib/assessment'
import { basedOnLabel } from '../junior/DecideBasedOn'

// What a learner actually entered, as labelled answers for the Team Lead: grouped under the five
// dimensions, and per criterion the answers its rules read.

export type AnswerItem = { label: string; text: string }

export const PLACE_NAMES = {
  unsorted: 'Unsorted',
  verified: 'Verified',
  'needs-checking': 'Needs checking',
  assumption: 'Assumption',
  weak: 'Weak evidence',
} as const

const CONFIDENCE: Record<Confidence, string> = { low: 'low', medium: 'medium', high: 'high' }

const item = (label: string, text: string | null | undefined): AnswerItem[] =>
  text?.trim() ? [{ label, text: text.trim() }] : []

const withConfidence = (text: string, confidence: Confidence | null) =>
  text.trim() && confidence ? `${text.trim()} (confidence: ${CONFIDENCE[confidence]})` : text

// 'C · Pilot part of the catalogue, then review', their own plan, or escalating.
export function callText(content: CaseContent, decide: DecideAnswer): string {
  if (decide.optionId === 'own') return 'Their own plan'
  if (decide.optionId === 'escalate') return 'Escalate to a senior'
  const option = content.options.find((o) => o.id === decide.optionId)
  return option ? `${option.id} · ${option.label}` : 'No option chosen'
}

// The call in a line or two: their own plan, or the option (or escalating) with any conditions.
export function callSummary(content: CaseContent, decide: DecideAnswer): string {
  const plan = decide.ownPlan.trim()
  if (decide.optionId === 'own') return plan || 'Their own plan, not written yet'
  return [callText(content, decide), plan].filter(Boolean).join('\n')
}

// 'Original' for versions[0], then 'Revision 1', 'Revision 2' …
export const versionLabel = (index: number) => (index === 0 ? 'Original' : `Revision ${index}`)

// basedOn holds evidence card, material or request ids, named as Decide and Reflect name them
// (a finding by the title of the material it unlocked).
function basedOnText(content: CaseContent, ids: string[]): string {
  return ids.map((id) => basedOnLabel(content, id)).join('; ')
}

// The answers of one submitted version, grouped under the five dimensions.
export function answersByDimension(content: CaseContent, record: PracticeAttempt, version: number): Record<DimensionId, AnswerItem[]> {
  const { define, examine, investigate, decide } = attemptAtVersion(record, version)
  const first = define.initialPosition
  const made = new Map(investigate.requests.map((r) => [r.requestId, r]))
  const hours = content.requests.filter((r) => made.has(r.id)).reduce((sum, r) => sum + r.hours, 0)
  return {
    goal: [
      ...item('Goal', define.goal),
      ...item('Success looks like', define.success.filter((s) => s.trim()).join('; ')),
      ...item('People involved', define.people.join(', ')),
      ...item('Initial recommendation', withConfidence(first.recommendation, first.confidence)),
      ...item('Why, at first', first.reason),
      ...item('First question', first.question),
    ],
    evidence: [
      ...content.cards.map((card) => ({
        label: card.text,
        text: [PLACE_NAMES[examine.sort[card.id] ?? 'unsorted'], examine.reasons[card.id]?.trim()].filter(Boolean).join('. '),
      })),
      ...item('Missing', examine.missing.join(', ')),
      ...item('Based on', basedOnText(content, decide.basedOn)),
    ],
    information: [
      ...content.requests.flatMap((r) => {
        const request = made.get(r.id)
        return request ? [{ label: `Asked: ${r.title}`, text: request.intent.trim() ? `What I want to confirm: ${request.intent.trim()}` : 'No reason written' }] : []
      }),
      ...item('Not asked', content.requests.filter((r) => !made.has(r.id)).map((r) => r.title).join('; ')),
      { label: 'Time used', text: `${hours} of ${content.timeBudgetHours} hours` },
    ],
    tradeoffs: [
      { label: 'Call', text: callText(content, decide) },
      ...item('Own plan', decide.ownPlan),
      ...(content.submission?.fields ?? []).flatMap((f) => item(f.label, decide.fields[f.id])),
      ...item('Why', decide.why),
      ...item('Risk that remains', decide.mainRisk),
      ...item('Owner', decide.owner),
      ...item('Review by', decide.reviewBy),
    ],
    updating: [
      ...item('Initial recommendation', withConfidence(first.recommendation, first.confidence)),
      { label: 'Final call', text: withConfidence(callText(content, decide), decide.confidence) },
      ...item('What would change their mind', decide.changeMind),
      ...item(`Why they revised (version ${version + 1})`, version > 0 ? record.versions[version]?.whyChanged : ''),
      ...item('Changed-condition challenge', record.variant?.answer),
    ],
  }
}

// The answers a criterion's rules read, in one version, so the Team Lead can check the app's call.
export function criterionAnswers(content: CaseContent, record: PracticeAttempt, version: number, criterion: AssessmentCriterion): AnswerItem[] {
  const attempt = attemptAtVersion(record, version)
  const items: AnswerItem[] = []
  const made = new Map(attempt.investigate.requests.map((r) => [r.requestId, r]))
  for (const id of criterion.requestIds ?? []) {
    const title = content.requests.find((r) => r.id === id)?.title ?? id
    const request = made.get(id)
    items.push({ label: `Request: ${title}`, text: request ? request.intent.trim() || 'Asked, no reason written' : 'Not asked' })
  }
  for (const id of criterion.fields ?? []) {
    const label = content.submission?.fields.find((f) => f.id === id)?.label ?? id
    const text = attempt.decide.fields[id]?.trim() ?? ''
    items.push({ label, text: text.length >= MIN_FIELD_LENGTH ? text : text ? `${text} (under ${MIN_FIELD_LENGTH} characters)` : 'Empty' })
  }
  if (criterion.ifMentions) {
    const scope = criterion.mentionsIn
    const hits = answerSources(content, attempt, scope).filter((s) => mentionsAny(s.text, criterion.ifMentions ?? []))
    items.push({ label: 'Looked for', text: `A mention of ${criterion.ifMentions.join(', ')}` })
    if (scope) items.push({ label: 'Looked in', text: scope.map((key) => answerLabel(content, key)).join(', ') })
    const none = scope ? 'None of those answers mentions them.' : 'None of the answers mentions them.'
    items.push(...(hits.length > 0 ? hits : [{ label: 'Found in', text: none }]))
  }
  return items
}
