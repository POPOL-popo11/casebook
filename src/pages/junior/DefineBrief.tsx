import { useState } from 'react'
import type { CaseContent, Material } from '../../contracts/types'
import { IconFile, IconLock } from './icons'
import { MaterialReader } from './MaterialReader'

// The Brief card on Define (05): the ask, the materials shared from the start, and the locked
// note. A material's name opens it in the reader.
export function DefineBrief({ content }: { content: CaseContent }) {
  const materials = content.materials.filter((material) => material.visibility === 'start')
  const [open, setOpen] = useState<Material | null>(null)

  return (
    <section className="card jr-brief" aria-labelledby="jr-brief-title">
      <h2 id="jr-brief-title" className="title title--sm jr-brief__title">
        Brief
      </h2>
      <p className="jr-brief__text">{content.brief}</p>
      <ul className="jr-brief__materials">
        {materials.map((material) => (
          <li key={material.id}>
            <button type="button" className="jr-brief__material" onClick={() => setOpen(material)}>
              <IconFile className="jr-brief__file" />
              {material.title}
            </button>
          </li>
        ))}
      </ul>
      <p className="jr-brief__more">
        <IconLock className="jr-brief__lock" />
        More unlocks when you ask for it
      </p>
      <MaterialReader material={open} onClose={() => setOpen(null)} />
    </section>
  )
}
