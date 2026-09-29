import type { DecideAnswer, GrowthRecord, PracticeAttempt, RecordRef, Store } from '../../contracts/records'
import type { CaseContent, CaseId } from '../../contracts/types'
import { getSummary } from '../../lib/content'
import { newId, setStore } from '../../lib/records'
import { currentAttempt, LEARNER_ID } from './practice'

// The writes Reflect makes, after the attempt is submitted. Every one goes through the store.

// The submitted attempt of the case, inside a setStore recipe; nothing when it isn't submitted.
function submitted(draft: Store, caseId: CaseId) {
  const attempt = currentAttempt(draft, caseId)
  return attempt && attempt.status !== 'in-progress' ? attempt : undefined
}

// The working draft of a revision: attempt.decide, which versions never share.
export function editDraft(caseId: CaseId, recipe: (decide: DecideAnswer) => void): void {
  setStore((draft) => {
    const attempt = submitted(draft, caseId)
    if (!attempt) return
    recipe(attempt.decide)
    attempt.updatedAt = new Date().toISOString()
  })
}

// Back to the latest saved version, dropping unsaved changes to the draft.
export function discardDraft(caseId: CaseId): void {
  setStore((draft) => {
    const attempt = submitted(draft, caseId)
    const latest = attempt?.versions[attempt.versions.length - 1]
    if (attempt && latest) attempt.decide = structuredClone(latest.decide)
  })
}

// A revision: a new full snapshot with the reason it changed. versions[0] stays as it was. A
// revision after the app's feedback counts as prompting on the practice growth record, and the
// record's own words are rebuilt to name the revision (practiceStory). Level and outcome stay.
export function saveRevision(content: CaseContent, whyChanged: string): void {
  setStore((draft) => {
    const attempt = submitted(draft, content.id)
    if (!attempt) return
    const at = new Date().toISOString()
    const { define, examine, investigate, decide } = structuredClone(attempt)
    attempt.versions.push({ at, define, examine, investigate, decide, whyChanged })
    attempt.status = 'revised'
    attempt.updatedAt = at
    const record = draft.growth.find((g) => g.id === attempt.growthRecordId)
    if (record && record.source === 'user') {
      record.prompting = 'some'
      Object.assign(record, practiceStory(content, attempt))
    }
  })
}

// The changed-condition challenge's answer, saved as it is typed.
export function editVariant(caseId: CaseId, answer: string): void {
  setStore((draft) => {
    const attempt = submitted(draft, caseId)
    if (attempt) attempt.variant = { answer, at: new Date().toISOString() }
  })
}

// The attempt's call in words: the option's label, 'Escalate to a senior', or their own plan.
export function callText(content: CaseContent, decide: DecideAnswer): string {
  if (decide.optionId === 'own') return decide.ownPlan.trim() || 'Their own plan'
  if (decide.optionId === 'escalate') return 'Escalate to a senior'
  const option = content.options.find((o) => o.id === decide.optionId)
  return option ? `${option.id} · ${option.label}` : 'No call made'
}

// Ends a sentence unless it already ends with one (an own plan may).
const stop = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`)

// The practice record's own words, from the attempt's versions: the original call, and after a
// revision also the final call and the latest reason, in the demo record's style ('Revised my
// answer after the feedback…'). The learner never edits these two fields, so a revision rebuilds them.
function practiceStory(content: CaseContent, attempt: PracticeAttempt): Pick<GrowthRecord, 'contribution' | 'evidence'> {
  const ref: RecordRef = { kind: 'attempt', id: attempt.id }
  const original = callText(content, attempt.versions[0]?.decide ?? attempt.decide)
  const asked = content.requests.filter((r) => attempt.investigate.requests.some((q) => q.requestId === r.id))
  const askedFor = asked.length > 0 ? [{ text: `Asked for: ${asked.map((r) => r.title).join(', ')}` }] : []
  const first = `Worked through the case on my own and submitted my call: ${original}`
  const revisions = attempt.versions.length - 1
  const latest = attempt.versions[revisions]
  if (revisions < 1 || !latest) return { contribution: first, evidence: [{ text: `Submitted my call: ${original}`, ref }, ...askedFor] }
  const final = callText(content, latest.decide)
  const revised = `Revised my answer after the feedback${revisions > 1 ? ` (${revisions} times)` : ''}`
  // 'Kept my call' only when no version ever changed it; A → C → A came back to the first call.
  const kept = attempt.versions.every((v) => callText(content, v.decide) === original)
  const same = kept ? `${revised} and kept my call` : `${revised} and came back to my first call`
  const change = final === original ? same : `${revised}. My final call: ${final}`
  const why = latest.whyChanged.trim()
  // 'My reason', not 'Why I changed it': the self-review adds 'I' only to text without one.
  return {
    contribution: [stop(first), stop(change), why ? stop(`My reason: ${why}`) : ''].filter(Boolean).join(' '),
    evidence: [{ text: `Submitted my call: ${original}`, ref }, { text: change, ref }, ...askedFor],
  }
}

// The practice growth record, created once per attempt (growthRecordId); saveRevision keeps its
// words current. Honesty rules (contracts/records.ts): the case's first skill, level
// 'not-observed' until a person confirms it, outcome 'practice-only', prompting 'some' if they saw
// the example or revised after feedback.
export function ensureGrowthRecord(content: CaseContent): void {
  setStore((draft) => {
    const attempt = submitted(draft, content.id)
    if (!attempt || attempt.growthRecordId) return
    const record: GrowthRecord = {
      id: newId('gr'),
      source: 'user',
      learnerId: LEARNER_ID,
      date: attempt.versions[0]?.at ?? new Date().toISOString(),
      kind: 'practice',
      skillId: content.skillIds[0] ?? 'decision',
      situation: `${getSummary(content.id).title} (practice case)`,
      ...practiceStory(content, attempt),
      prompting: attempt.viewedExample || attempt.versions.length > 1 ? 'some' : 'none',
      level: 'not-observed',
      outcome: 'practice-only',
      learning: '',
      nextStep: '',
      privateNote: '',
      links: [{ kind: 'attempt', id: attempt.id }],
    }
    draft.growth.push(record)
    attempt.growthRecordId = record.id
  })
}

// What the learner writes on their growth record: what they learned and their next step.
export function editGrowth(recordId: string, key: 'learning' | 'nextStep', value: string): void {
  setStore((draft) => {
    const record = draft.growth.find((g) => g.id === recordId)
    if (record && record.source === 'user') record[key] = value
  })
}

