import { useState } from 'react'
import { caseHref, type CaseContent, type Material } from '../../contracts/types'
import { basedOnLabel } from './DecideBasedOn'
import { NextArrow } from './icons'
import { MaterialReader } from './MaterialReader'

// The UNLOCKED column on Investigate (07): one card per request, in the order they were made,
// then the peach 'This may change your sort' callout. Each card is named as on Decide's 'Based
// on' chips: the title of the material it unlocks, not the role that holds it. A request that unlocks a material links
// to it, and the material opens in the reader. Before the first request the column holds only
// a one-line empty state: there is nothing yet that could change the sort.
export function InvestigateUnlocked({ content, requested }: { content: CaseContent; requested: string[] }) {
  const [open, setOpen] = useState<Material | null>(null)
  const unlocked = requested.flatMap((id) => content.requests.filter((request) => request.id === id))

  return (
    <section className="jr-unlocked" aria-labelledby="jr-unlocked-title">
      <h2 id="jr-unlocked-title" className="eyebrow eyebrow--sm jr-unlocked__title">
        UNLOCKED
      </h2>
      {unlocked.length === 0 ? (
        <p className="jr-unlocked__empty">Nothing yet. What each request finds shows here.</p>
      ) : (
        <>
          <ul className="jr-unlocked__list">
            {unlocked.map((request) => {
              const material = content.materials.find((m) => m.id === request.materialId)
              return (
                <li key={request.id} className="card jr-finding">
                  <p className="jr-finding__label">{basedOnLabel(content, request.id)}</p>
                  <span className="dot dot--accent jr-finding__dot" aria-hidden="true" />
                  {request.finding?.text && <p className="jr-finding__text">{request.finding.text}</p>}
                  {material && (
                    <button type="button" className="btn btn--link jr-finding__open" onClick={() => setOpen(material)}>
                      Read {material.title}
                      <NextArrow />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
          <div className="callout callout--warn jr-unlocked__warn">
            <p>This may change your sort</p>
            <a className="btn btn--link jr-unlocked__revisit" href={caseHref(content.id, 'examine')}>
              Revisit
              <NextArrow />
            </a>
          </div>
        </>
      )}
      <MaterialReader material={open} onClose={() => setOpen(null)} />
    </section>
  )
}
