import type { PracticeAttempt } from '../contracts/records'
import type { AssessmentCriterion, CaseContent } from '../contracts/types'

// The app's feedback on a practice attempt, computed from the case's assessment rules
// (types.ts AssessmentCriterion), so a changed answer changes the feedback and the Team Lead's
// grouping. Nothing here is AI: pages show the text with DEMO_RESPONSE_LABEL.

export type CriterionResult = { criterion: AssessmentCriterion; met: boolean; text: string }

// A submission field counts as filled from this many characters, spaces at the ends not counted:
// enough to turn away "tbd" or "-", short enough for "Dana owns refunds".
export const MIN_FIELD_LENGTH = 8

// Lower case, straight apostrophes, no double quotes, single spaces.
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// A word or phrase counts when it starts a word in the text: 'refund' matches 'refunds',
// but 'ops' doesn't match 'stops'.
function mentions(normalisedText: string, phrase: string): boolean {
  const wanted = normalise(phrase)
  return wanted !== '' && new RegExp(`(?<![a-z0-9])${escapeRegExp(wanted)}`).test(normalisedText)
}

// Whether a piece of the learner's text mentions any of the phrases, by the rule above.
export function mentionsAny(text: string, phrases: readonly string[]): boolean {
  const said = normalise(text)
  return phrases.some((phrase) => mentions(said, phrase))
}

// Display names of the answers a criterion's mentionsIn can name (types.ts), besides the case's
// SubmissionField ids, which show as the field's label.
const ANSWER_LABELS: Record<string, string> = {
  why: 'Why',
  ownPlan: 'Own plan',
  mainRisk: 'Risk that remains',
  owner: 'Owner',
  reviewBy: 'Review by',
  changeMind: 'What would change their mind',
  initialPosition: 'Initial position',
  examineReasons: 'Examine sort reasons',
}

const fieldLabel = (content: CaseContent, id: string) => content.submission?.fields.find((f) => f.id === id)?.label ?? id

// The name of one mentionsIn key, for display: 'Why', 'Initial position', a field's label.
export const answerLabel = (content: CaseContent, key: string) => ANSWER_LABELS[key] ?? fieldLabel(content, key)

// Every Examine sort reason, in the case's card order, each labelled by its card; reasons for
// cards the case no longer has come last, labelled by id.
function examineReasons(content: CaseContent, attempt: PracticeAttempt): [string, string, string][] {
  const reasons = attempt.examine?.reasons ?? {}
  const cards = content.cards ?? []
  const order = [...cards.map((c) => c.id), ...Object.keys(reasons).filter((id) => !cards.some((c) => c.id === id))]
  return order
    .filter((id) => id in reasons)
    .map((id) => ['examineReasons', `Examine reason: ${cards.find((c) => c.id === id)?.text ?? id}`, reasons[id]])
}

// What ifMentions reads, labelled for display: why, their own plan, every Decide answer (the
// case's submission fields, the remaining risk, owner, review time and what would change their
// mind), the initial position and every Examine sort reason. Empty answers are left out. With
// mentionsIn (a criterion's mentionsIn keys), only those answers.
export function answerSources(
  content: CaseContent,
  attempt: PracticeAttempt,
  mentionsIn?: readonly string[],
): { label: string; text: string }[] {
  const decide = attempt.decide
  const position = attempt.define?.initialPosition
  const sources: [key: string, label: string, text: string | undefined][] = [
    ['why', 'Why', decide?.why],
    ['ownPlan', 'Own plan', decide?.ownPlan],
    ...Object.entries(decide?.fields ?? {}).map(([id, text]): [string, string, string] => [id, fieldLabel(content, id), text]),
    ['mainRisk', 'Risk that remains', decide?.mainRisk],
    ['owner', 'Owner', decide?.owner],
    ['reviewBy', 'Review by', decide?.reviewBy],
    ['changeMind', 'What would change their mind', decide?.changeMind],
    ['initialPosition', 'Initial recommendation', position?.recommendation],
    ['initialPosition', 'Initial reason', position?.reason],
    ['initialPosition', 'First question', position?.question],
    ...examineReasons(content, attempt),
  ]
  return sources
    .filter((s): s is [string, string, string] => Boolean(s[2]?.trim()) && (!mentionsIn || mentionsIn.includes(s[0])))
    .map(([, label, text]) => ({ label, text }))
}

function answerText(content: CaseContent, attempt: PracticeAttempt, mentionsIn?: readonly string[]): string {
  return normalise(answerSources(content, attempt, mentionsIn).map((s) => s.text).join('\n'))
}

// The name of one 'Based on' id, as Decide shows it: the evidence card's text, else the request's
// material title (or finding label, or title), else the material's title, else the id.
function basedOnLabel(content: CaseContent, id: string): string {
  const card = (content.cards ?? []).find((c) => c.id === id)
  if (card) return card.text
  const request = (content.requests ?? []).find((r) => r.id === id)
  const materials = content.materials ?? []
  if (!request) return materials.find((m) => m.id === id)?.title ?? id
  return materials.find((m) => m.id === request.materialId)?.title ?? request.finding?.label ?? request.title
}

// One result per criterion, in the case's order. A criterion is met when every rule it has passes:
//   requestIds  every one of them was requested on Investigate
//   ifMentions  the answers mention at least one of them; with mentionsIn, only those answers count
//   fields      each of those submission fields holds at least MIN_FIELD_LENGTH characters
//   notBasedOn  none of those ids (cards, requests, materials) is in the final Decide 'Based on'
// A criterion with no rules is never met: the app has no evidence to claim it from.
// When the fields rule fails, the notYet text ends by naming the fields still empty or too short,
// so the learner is never sent back to a field they did fill in. When the notBasedOn rule fails,
// it then names the ticked ones, as Decide labels them.
export function assessAttempt(content: CaseContent, attempt: PracticeAttempt): CriterionResult[] {
  const requested = new Set((attempt.investigate?.requests ?? []).map((r) => r.requestId))
  const fields = attempt.decide?.fields ?? {}
  const basedOn = attempt.decide?.basedOn ?? []
  const allText = answerText(content, attempt)
  return (content.assessment?.criteria ?? []).map((criterion) => {
    const rules: boolean[] = []
    if (criterion.requestIds) rules.push(criterion.requestIds.every((id) => requested.has(id)))
    if (criterion.ifMentions) {
      const text = criterion.mentionsIn ? answerText(content, attempt, criterion.mentionsIn) : allText
      rules.push(criterion.ifMentions.some((phrase) => mentions(text, phrase)))
    }
    const short = (criterion.fields ?? []).filter((id) => (fields[id] ?? '').trim().length < MIN_FIELD_LENGTH)
    if (criterion.fields) rules.push(short.length === 0)
    const ticked = (criterion.notBasedOn ?? []).filter((id) => basedOn.includes(id))
    if (criterion.notBasedOn) rules.push(ticked.length === 0)
    const met = rules.length > 0 && rules.every(Boolean)
    let notYet = criterion.notYet
    if (short.length > 0) notYet += ` Still empty or too short: ${short.map((id) => fieldLabel(content, id)).join(', ')}.`
    if (ticked.length > 0) notYet += ` Your 'Based on' still lists: ${ticked.map((id) => basedOnLabel(content, id)).join(', ')}.`
    return { criterion, met, text: met ? criterion.met : notYet }
  })
}

// The attempt as it was at one submitted version (versions[index]), to assess or show that
// version. An index with no version gives the attempt's current answers.
export function attemptAtVersion(attempt: PracticeAttempt, index: number): PracticeAttempt {
  const version = attempt.versions?.[index]
  if (!version) return attempt
  const { define, examine, investigate, decide } = version
  return { ...attempt, define, examine, investigate, decide }
}
