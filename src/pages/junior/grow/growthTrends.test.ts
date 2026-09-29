import { describe, expect, it } from 'vitest'
import type { GrowthRecord } from '../../../contracts/records'
import { SEED_STORE } from '../../../data/seed'
import { skillLabel } from './growContent'
import { promptingTrends } from './growthTrends'

const at = (id: string, date: string, prompting: GrowthRecord['prompting'], skillId = 'framing'): GrowthRecord => ({
  ...SEED_STORE.growth[0],
  id,
  date,
  prompting,
  skillId: skillId as GrowthRecord['skillId'],
})

describe('My Growth trend lines', () => {
  it('names the first and latest prompting of a skill with 2 or more records', () => {
    const trends = promptingTrends([
      at('gr-2', '2026-09-22T05:00:00.000Z', 'some'),
      at('gr-1', '2026-09-15T05:00:00.000Z', 'some'),
      at('gr-3', '2026-09-29T05:00:00.000Z', 'none'),
    ])
    expect(trends).toHaveLength(1)
    expect(trends[0].text).toMatch(new RegExp(`^${skillLabel('framing')}: prompting needed fell from Some \\(15 Sept?\\) to None \\(29 Sept?\\) across 3 records$`))
  })

  it('says rose when more prompting was needed', () => {
    const [trend] = promptingTrends([at('gr-1', '2026-09-15T05:00:00.000Z', 'none'), at('gr-2', '2026-09-20T05:00:00.000Z', 'a-lot')])
    expect(trend.text).toContain('rose from None')
  })

  it('shows nothing for one record, or when the prompting did not change', () => {
    expect(promptingTrends([at('gr-1', '2026-09-15T05:00:00.000Z', 'some')])).toEqual([])
    expect(promptingTrends([at('gr-1', '2026-09-15T05:00:00.000Z', 'some'), at('gr-2', '2026-09-20T05:00:00.000Z', 'some')])).toEqual([])
  })

  it('shows nothing when the first and latest records fall on the same day', () => {
    expect(promptingTrends([at('gr-1', '2026-09-30T05:00:00.000Z', 'none'), at('gr-2', '2026-09-30T06:00:00.000Z', 'some')])).toEqual([])
    expect(promptingTrends([at('gr-1', '2026-09-30T05:00:00.000Z', 'none'), at('gr-2', '2026-09-30T06:00:00.000Z', 'a-lot'), at('gr-3', '2026-09-30T07:00:00.000Z', 'some')])).toEqual([])
  })
})
