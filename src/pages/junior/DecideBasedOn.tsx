import type { CaseContent } from '../../contracts/types'

type DecideBasedOnProps = {
  content: CaseContent
  // Requests made on Investigate: their findings can be relied on too.
  requested: string[]
  // Evidence card and request ids the learner relied on.
  selected: string[]
  // The example's 'Based on' chips, as written; shown instead of the learner's choice.
  exampleText?: string[]
  readOnly: boolean
  onChange: (selected: string[]) => void
}

// A 'Based on' choice in words: an evidence card's text, or for a finding the title of the
// material it unlocked ('Client Lead's note', 'Forecast workings'), never the role that holds it,
// so no two chips read the same. Reflect's 'Based on' row uses the same words.
export function basedOnLabel(content: CaseContent, id: string): string {
  const card = content.cards.find((c) => c.id === id)
  if (card) return card.text
  const request = content.requests.find((r) => r.id === id)
  if (!request) return content.materials.find((m) => m.id === id)?.title ?? id
  const material = content.materials.find((m) => m.id === request.materialId)
  return material?.title ?? request.finding?.label ?? request.title
}

// 'Based on' under the options on Decide (08). In practice the learner picks the evidence cards
// and findings their call relies on; read-only shows what was picked, or the example's chips.
export function DecideBasedOn({ content, requested, selected, exampleText, readOnly, onChange }: DecideBasedOnProps) {
  const choices = [
    ...content.cards.map((card) => card.id),
    ...content.requests.filter((request) => requested.includes(request.id)).map((request) => request.id),
  ].map((id) => ({ id, label: basedOnLabel(content, id) }))
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  const shown = exampleText ?? choices.filter((choice) => selected.includes(choice.id)).map((choice) => choice.label)

  return (
    <div className="jr-based">
      <span id="jr-based" className="jr-based__label">
        Based on
      </span>
      {readOnly ? (
        <ul className="jr-chips" aria-labelledby="jr-based">
          {shown.map((label) => (
            <li key={label} className="chip chip--outline">
              {label}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="jr-chips jr-based__choices" aria-labelledby="jr-based">
          {choices.map(({ id, label }) => (
            <li key={id}>
              <button type="button" className="chip" aria-pressed={selected.includes(id)} onClick={() => toggle(id)}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
