import type { CaseSummary } from '../../contracts/types'
import { IconFile } from './icons'

// The Preview on the details page of a case that isn't playable yet: what it will include,
// read-only. Nothing here starts a practice, so nothing leads to a dead end.
export function DetailsPreview({ summary }: { summary: CaseSummary }) {
  const materials = summary.materialsPreview ?? []
  const roles = summary.roleTitles ?? []

  return (
    <section className="card jr-preview" aria-labelledby="jr-preview-title">
      <h2 id="jr-preview-title" className="title title--sm jr-preview__title">
        Preview
      </h2>
      <p className="jr-preview__text">
        You can read what this case covers, but its practice isn’t open yet.
      </p>
      {materials.length > 0 && (
        <div className="field jr-preview__block">
          <span id="jr-preview-materials" className="field__label">
            Materials you would get
          </span>
          <ul className="jr-preview__materials" aria-labelledby="jr-preview-materials">
            {materials.map((title) => (
              <li key={title} className="jr-preview__material">
                <IconFile className="jr-preview__file" />
                {title}
              </li>
            ))}
          </ul>
        </div>
      )}
      {roles.length > 0 && (
        <div className="field jr-preview__block">
          <span id="jr-preview-roles" className="field__label">
            Roles in the team mode
          </span>
          <ul className="jr-chips" aria-labelledby="jr-preview-roles">
            {roles.map((role) => (
              <li key={role} className="chip">
                {role}
              </li>
            ))}
          </ul>
        </div>
      )}
      {materials.length === 0 && roles.length === 0 && (
        <p className="jr-preview__text">Its materials and roles are still being written.</p>
      )}
    </section>
  )
}
