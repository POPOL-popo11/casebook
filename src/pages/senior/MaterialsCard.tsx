import type { CaseRole, Material } from '../../contracts/types'
import { IconEye, IconFile, IconLock } from '../../components/icons'
import { MaterialBody } from '../../components/MaterialBody'

type MaterialsCardProps = { materials: Material[]; roles?: CaseRole[] }

// 02 · Materials: what the learner sees at the start and what unlocks on request. Each one
// opens to its text, source, date and scope.
export function MaterialsCard({ materials, roles = [] }: MaterialsCardProps) {
  return (
    <section className="card share__card share__card--list" aria-labelledby="share-materials">
      <div className="share__card-head">
        <h2 id="share-materials" className="title title--sm">
          Materials
        </h2>
      </div>
      <ul className="share__materials">
        {materials.map((material) => {
          const holder = material.roleId ? roles.find((r) => r.id === material.roleId)?.title : undefined
          return (
            <li key={material.id} className="share__material-item">
              <details className="share__material-details">
                <summary className="share__material">
                  <IconFile className="share__file" />
                  <span className="share__material-name">
                    {material.title}
                    {holder && <span className="share__holder">Team mode: held by the {holder}</span>}
                  </span>
                  {material.visibility === 'start' ? (
                    <span className="badge badge--neutral share__badge">
                      <IconEye />
                      At start
                    </span>
                  ) : (
                    <span className="badge badge--warn share__badge">
                      <IconLock />
                      On request
                    </span>
                  )}
                </summary>
                <div className="share__material-body">
                  <MaterialBody material={material} />
                </div>
              </details>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
