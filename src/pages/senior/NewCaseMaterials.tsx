import type { DraftFields } from '../../lib/drafts'

type Material = DraftFields['materials'][number]
type Props = { materials: Material[]; onChange: (materials: Material[]) => void }

// Create a Case · Materials: a title and a body per material; add or remove rows.
export function NewCaseMaterials({ materials, onChange }: Props) {
  const update = (index: number, patch: Partial<Material>) =>
    onChange(materials.map((m, i) => (i === index ? { ...m, ...patch } : m)))

  return (
    <section className="card nc__card" aria-labelledby="nc-materials">
      <h2 id="nc-materials" className="title title--sm nc__card-title">
        Materials
      </h2>
      {materials.length === 0 && <p className="nc__note">No materials yet.</p>}
      <ol className="nc__materials">
        {materials.map((material, i) => (
          <li key={i} className="nc__material">
            <div className="nc__material-head">
              <span className="field__label">Material {i + 1}</span>
              <button
                type="button"
                className="btn btn--link btn--sm"
                onClick={() => onChange(materials.filter((_, j) => j !== i))}
              >
                Remove<span className="visually-hidden"> material {i + 1}</span>
              </button>
            </div>
            <label className="field">
              <span className="visually-hidden">Material {i + 1} title</span>
              <input
                className="input"
                placeholder="Title"
                value={material.title}
                onChange={(e) => update(i, { title: e.target.value })}
              />
            </label>
            <label className="field">
              <span className="visually-hidden">Material {i + 1} text</span>
              <textarea
                className="textarea nc__textarea"
                placeholder="What it says"
                value={material.body}
                onChange={(e) => update(i, { body: e.target.value })}
              />
            </label>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn--link nc__add" onClick={() => onChange([...materials, { title: '', body: '' }])}>
        + Add material
      </button>
    </section>
  )
}
