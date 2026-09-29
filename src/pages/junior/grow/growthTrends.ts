import type { GrowthRecord } from '../../../contracts/records'
import type { SkillId } from '../../../contracts/types'
import { PROMPTING_LABELS, skillLabel } from './growContent'

// My Growth's trend lines: for each skill with 2 or more records, how the prompting needed changed
// from the first record to the latest. No change, or first and latest on the same day, no line:
// the page never invents a trend.
const PROMPTING_ORDER: GrowthRecord['prompting'][] = ['none', 'some', 'a-lot']

// '15 Sept': the day and month, as formatDate writes them, without the year.
function dayMonth(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// The local calendar day, so two records made the same day never read as a trend.
function dayKey(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export type Trend = { skillId: SkillId; text: string }

// 'Problem Framing: prompting needed fell from Some (15 Sept) to None (30 Sept) across 3 records'.
export function promptingTrends(records: GrowthRecord[]): Trend[] {
  const bySkill = new Map<SkillId, GrowthRecord[]>()
  for (const r of records) bySkill.set(r.skillId, [...(bySkill.get(r.skillId) ?? []), r])
  const trends: Trend[] = []
  for (const [skillId, list] of bySkill) {
    if (list.length < 2) continue
    const byDate = [...list].sort((a, b) => a.date.localeCompare(b.date))
    const first = byDate[0]
    const last = byDate[byDate.length - 1]
    if (dayKey(first.date) === dayKey(last.date)) continue
    const change = PROMPTING_ORDER.indexOf(last.prompting) - PROMPTING_ORDER.indexOf(first.prompting)
    if (change === 0) continue
    const from = `${PROMPTING_LABELS[first.prompting]} (${dayMonth(first.date)})`
    const to = `${PROMPTING_LABELS[last.prompting]} (${dayMonth(last.date)})`
    trends.push({
      skillId,
      text: `${skillLabel(skillId)}: prompting needed ${change < 0 ? 'fell' : 'rose'} from ${from} to ${to} across ${list.length} records`,
    })
  }
  return trends.sort((a, b) => a.text.localeCompare(b.text))
}
