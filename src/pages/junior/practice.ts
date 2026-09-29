import { useMemo } from 'react'
import type { DecideAnswer, PracticeAttempt, Store } from '../../contracts/records'
import type { CaseContent, CaseId, ExampleAttempt } from '../../contracts/types'
import { getSummary, JUNIOR_PROFILE } from '../../lib/content'
import { activeAttemptId } from '../../lib/queries'
import { newId, setStore, useStore } from '../../lib/records'

// Individual practice through the shared store (src/contracts/records.ts): which view each case
// shows on its four steps, the attempt they work on, and the writes the steps make. Every input
// writes through to the store as it changes; nothing is kept anywhere else.

export type ViewMode = 'example' | 'practice'

// The learner the junior screens act for: the demo account the library greets.
export const LEARNER_ID = JUNIOR_PROFILE.juniorId

// A case's example attempt. The contract makes it optional, so it is read defensively.
export function exampleOf(content: CaseContent): ExampleAttempt | undefined {
  const { example } = content as { example?: ExampleAttempt }
  return example
}

export function blankDecide(): DecideAnswer {
  return {
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
  }
}

// A new, blank attempt. It counts as having seen the example when the case was showing it.
function blankAttempt(content: CaseContent, viewedExample: boolean): PracticeAttempt {
  const now = new Date().toISOString()
  return {
    id: newId('att'),
    source: 'user',
    caseId: content.id,
    caseVersion: getSummary(content.id).version,
    learnerId: LEARNER_ID,
    mode: 'individual',
    startedAt: now,
    updatedAt: now,
    status: 'in-progress',
    viewedExample,
    define: {
      goal: '',
      success: ['', ''],
      people: [],
      initialPosition: { recommendation: '', reason: '', confidence: null, question: '' },
    },
    examine: {
      sort: Object.fromEntries(content.cards.map((card) => [card.id, 'unsorted'])),
      reasons: {},
      missing: [],
    },
    investigate: { requests: [] },
    decide: blankDecide(),
    versions: [],
  }
}

// The attempt a case's steps and Reflect work on (activeAttemptId: ui.activeAttempt for the case,
// else the learner's latest own attempt, never a demo one).
export function currentAttempt(store: Store, caseId: CaseId): PracticeAttempt | undefined {
  const id = activeAttemptId(store, caseId, LEARNER_ID)
  return store.attempts.find((a) => a.id === id)
}

// The hook form, for pages.
export function useCurrentAttempt(caseId: CaseId): PracticeAttempt | undefined {
  const id = useStore((store) => activeAttemptId(store, caseId, LEARNER_ID))
  const attempts = useStore((store) => store.attempts)
  return useMemo(() => attempts.find((a) => a.id === id), [attempts, id])
}

export type Practice = {
  mode: ViewMode
  example: ExampleAttempt | undefined
  // Practice mode: the attempt, or a blank one until the first change creates it.
  attempt: PracticeAttempt
  // The example, and an attempt already submitted, can be read but not changed.
  readOnly: boolean
  // False until the learner has picked Start practice or View example on the details page, or
  // has an attempt: a step link opened before that goes to the details page (CaseFrame).
  chosen: boolean
  update: (recipe: (attempt: PracticeAttempt) => void) => void
}

export function usePractice(content: CaseContent): Practice {
  const caseId = content.id
  const stored = useStore((store) => store.ui.viewMode[caseId])
  const saved = useCurrentAttempt(caseId)
  const example = exampleOf(content)
  const mode: ViewMode = example && stored !== 'practice' ? 'example' : 'practice'
  const blank = useMemo(() => blankAttempt(content, false), [content])
  const attempt = saved ?? blank

  const update = (recipe: (attempt: PracticeAttempt) => void) =>
    setStore((draft) => {
      let target = currentAttempt(draft, caseId)
      if (!target || target.status !== 'in-progress') {
        target = blankAttempt(content, false)
        draft.attempts.push(target)
      }
      recipe(target)
      target.updatedAt = new Date().toISOString()
      draft.ui.viewMode[caseId] = 'practice'
      draft.ui.activeAttempt[caseId] = target.id
    })

  return {
    mode,
    example,
    attempt,
    readOnly: mode === 'example' || attempt.status !== 'in-progress',
    chosen: stored !== undefined || saved !== undefined,
    update,
  }
}

// 'Start practice': a new blank attempt, unless one is in progress, which it continues. Either
// way it becomes the active attempt before the page navigates.
export function startPractice(content: CaseContent): void {
  setStore((draft) => {
    let target = currentAttempt(draft, content.id)
    if (!target || target.status !== 'in-progress') {
      target = blankAttempt(content, draft.ui.viewMode[content.id] === 'example')
      draft.attempts.push(target)
    }
    draft.ui.activeAttempt[content.id] = target.id
    draft.ui.viewMode[content.id] = 'practice'
  })
}

// 'View example': the steps show the case's example, read-only. An attempt not yet submitted
// records that its learner looked at the example.
export function viewExample(caseId: CaseId): void {
  setStore((draft) => {
    draft.ui.viewMode[caseId] = 'example'
    const current = currentAttempt(draft, caseId)
    if (current?.status === 'in-progress') current.viewedExample = true
  })
}

// Submit on Decide: a full snapshot becomes versions[0], which never changes afterwards.
export function submitAttempt(caseId: CaseId): void {
  setStore((draft) => {
    const target = currentAttempt(draft, caseId)
    if (!target || target.status !== 'in-progress') return
    const at = new Date().toISOString()
    const { define, examine, investigate, decide } = structuredClone(target)
    target.versions.push({ at, define, examine, investigate, decide, whyChanged: '' })
    target.status = 'submitted'
    target.updatedAt = at
  })
}
