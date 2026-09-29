import type { Feedback, GrowthRecord, SelfReview } from '../../../contracts/records'
import { formatDate, fromWorkGrow, KIND_LABELS, levelLabel, normalise, OUTCOME_LABELS, personName, shortTitle, skillLabel } from './growContent'

// The performance-review draft is built by rules from the chosen records, never by AI. Every line
// keeps the ids of its sources: growth records ('gr-…') or Team Lead feedback ('fb-…').
// It restates the sources and never adds a result: Contributions cite only workplace records,
// and an 'outcome-pending' record never produces a claim about results.
// Each growth record gives exactly one line, in one of Contributions, Growth or Challenges: a
// first-person sentence built from its own situation, contribution and learning, with its level
// and outcome as a qualifier in brackets. Its next step goes to Next goals only, once per goal.

export type SectionKey = keyof SelfReview['sections']
export const SECTION_KEYS: SectionKey[] = ['contributions', 'growth', 'challenges', 'nextGoals']
export const SECTION_TITLES: Record<SectionKey, string> = {
  contributions: 'Contributions',
  growth: 'Growth',
  challenges: 'Challenges',
  nextGoals: 'Next goals',
}

type Line = SelfReview['sections'][SectionKey][number]
type RecordSection = Exclude<SectionKey, 'nextGoals'>
const line = (text: string, ids: string[]): Line => ({ text, sourceRecordIds: ids })
// 'Draft the plan.' → 'Draft the plan', so a situation can lead into a colon or a bracket.
const clause = (text: string) => text.trim().replace(/[.;:,\s]+$/, '')
// One line of text that ends as a sentence.
const sentence = (text: string) => {
  const t = text.replace(/\s+/g, ' ').trim()
  return t === '' || /[.?!…]['’")\]]*$/.test(t) ? t : `${t}.`
}
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim()

// Where a record happened, from its situation: the part before a colon or the first sentence, or a
// Work & Grow record's short title. 'Eight Weeks to Japan (practice case): recommend…' →
// 'In Eight Weeks to Japan (practice case)'.
function lead(r: GrowthRecord): string {
  const situation = oneLine(r.situation)
  const head = fromWorkGrow(r) ? shortTitle(situation) : clause(situation.split(/:\s|\.\s/)[0] ?? '')
  if (head === '') return r.kind === 'workplace' ? 'At work' : 'In a practice case'
  return r.kind === 'workplace' ? `At work (${head})` : `In ${head}`
}

// The contribution in the first person, never reworded: 'Started by backing…' → 'I started by
// backing…'. Text that already says 'I' or doesn't open with a past-tense verb stays as it is.
const IRREGULAR = new Set(['built', 'chose', 'drew', 'found', 'gave', 'kept', 'led', 'made', 'met', 'ran', 'sent', 'set', 'spent', 'took', 'told', 'wrote'])
function firstPerson(text: string): string {
  const t = sentence(text)
  if (/(^|[^\w'’])I(?!\w)/.test(t)) return t
  const first = t.split(' ')[0]?.toLowerCase() ?? ''
  if (/^[a-z]+ed$/.test(first) || IRREGULAR.has(first)) return `I ${t.charAt(0).toLowerCase()}${t.slice(1)}`
  return t
}

// The level and outcome as a qualifier, the skill too when the line doesn't name it:
// '(Problem Framing; not yet confirmed; practice only)'. It restates the record, never a result.
const LEVEL_WORDS: Record<GrowthRecord['level'], string> = {
  independent: 'shown on my own',
  prompted: 'shown with prompting',
  practice: 'needs more practice',
  'not-observed': 'not yet confirmed',
}
const qualifier = (r: GrowthRecord, withSkill: boolean) =>
  `(${[
    ...(withSkill ? [skillLabel(r.skillId)] : []),
    LEVEL_WORDS[r.level] ?? levelLabel(r.level).toLowerCase(),
    OUTCOME_LABELS[r.outcome].toLowerCase(),
  ].join('; ')})`

// The one section a record goes to: work I did at my job → Contributions; a level of 'needs more
// practice' → Challenges; anything else I did or learned → Growth; a record with neither → Challenges.
export function sectionFor(r: GrowthRecord): RecordSection {
  if (r.kind === 'workplace' && r.contribution.trim()) return 'contributions'
  if (r.level === 'practice') return 'challenges'
  if (r.contribution.trim() || r.learning.trim()) return 'growth'
  return 'challenges'
}

// A record's one line: where, what I did, what I learned, a Work & Grow record's full situation,
// then the qualifier. A Challenges line first names the skill I'm still working on.
function recordLine(r: GrowthRecord, section: RecordSection): Line {
  const still = section === 'challenges'
  const situation = oneLine(r.situation)
  const title = fromWorkGrow(r) ? shortTitle(situation) : clause(situation)
  const head = section === 'contributions' ? title || 'At work' : lead(r)
  const body = [
    still ? `I'm still working on ${skillLabel(r.skillId)}.` : '',
    r.contribution.trim() ? firstPerson(r.contribution) : '',
    r.learning.trim() ? `What I learned: ${sentence(r.learning)}` : '',
    fromWorkGrow(r) && clause(situation) !== title ? `Situation: ${sentence(situation)}` : '',
    qualifier(r, !still),
  ]
  return line(`${head}: ${body.filter(Boolean).join(' ')}`, [r.id])
}

// Two next steps are one goal when they differ only in case, spacing, quotes or the full stop.
const goalKey = (text: string) => normalise(text).replace(/[.!?…\s]+$/, '')

export function buildSections(records: GrowthRecord[], feedback: Feedback[]): SelfReview['sections'] {
  const byDate = [...records].sort((a, b) => a.date.localeCompare(b.date))
  const notes = [...feedback].sort((a, b) => a.at.localeCompare(b.at))
  const linesIn = (section: RecordSection) => byDate.filter((r) => sectionFor(r) === section).map((r) => recordLine(r, section))

  const contributions = linesIn('contributions')

  // Records in date order, then what my Team Lead saw.
  const growth = [
    ...linesIn('growth'),
    ...notes.filter((f) => f.strength.trim()).map((f) => line(`${personName(f.fromId)} noted what I did well: ${sentence(f.strength)}`, [f.id])),
  ]

  const challenges = [
    ...linesIn('challenges'),
    ...notes.filter((f) => f.improvement.trim()).map((f) => line(`${personName(f.fromId)} noted what I should improve: ${sentence(f.improvement)}`, [f.id])),
  ]

  // Next steps from records and the learner's own next actions on feedback: one line per goal,
  // citing every source that set it.
  const goals = new Map<string, Line>()
  const steps = [
    ...byDate.map((r) => ({ id: r.id, text: r.nextStep.trim() })),
    ...notes.map((f) => ({ id: f.id, text: f.nextAction.trim() })),
  ]
  for (const s of steps.filter((x) => x.text !== '')) {
    const known = goals.get(goalKey(s.text))
    if (!known) goals.set(goalKey(s.text), line(oneLine(s.text), [s.id]))
    else if (!known.sourceRecordIds.includes(s.id)) known.sourceRecordIds.push(s.id)
  }
  const nextGoals = [...goals.values()]

  return { contributions, growth, challenges, nextGoals }
}

// 'Workplace evidence, 28 Sep 2026' or 'Manager feedback, 29 Sep 2026': how a line names a source.
export function sourceLabel(id: string, records: GrowthRecord[], feedback: Feedback[]): string {
  const record = records.find((r) => r.id === id)
  if (record) return `${KIND_LABELS[record.kind]}, ${formatDate(record.date)}${record.source === 'demo' ? ', demo data' : ''}`
  const note = feedback.find((f) => f.id === id)
  if (note) return `${KIND_LABELS.manager}, ${formatDate(note.at)}${note.source === 'demo' ? ', demo data' : ''}`
  return 'A source that is no longer in My Growth'
}

// The plain-text version for Copy and Save as .txt.
export function draftText(review: SelfReview, records: GrowthRecord[], feedback: Feedback[]): string {
  const out = [
    'Performance review draft',
    `Draft built from your records: ${review.recordIds.length} source${review.recordIds.length === 1 ? '' : 's'}, ${formatDate(review.from)} to ${formatDate(review.to)}`,
  ]
  for (const key of SECTION_KEYS) {
    out.push('', SECTION_TITLES[key])
    const lines = review.sections[key]
    if (lines.length === 0) out.push('Nothing here: the chosen records hold nothing for this section.')
    lines.forEach((l, i) => {
      out.push(`${i + 1}. ${l.text}`)
      out.push(`   Sources: ${l.sourceRecordIds.map((id) => sourceLabel(id, records, feedback)).join('; ')}`)
    })
  }
  return out.join('\n') + '\n'
}
