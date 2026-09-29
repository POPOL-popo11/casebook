import { useEffect, useRef } from 'react'
import { MaterialBody } from '../../components/MaterialBody'
import type { Material } from '../../contracts/types'
import './MaterialReader.css'

type MaterialReaderProps = { material: Material | null; onClose: () => void }

// A case material, opened from its name: the shared MaterialBody (its text, then who made it,
// when, and what it covers) in a modal dialog. Escape, Close or a click outside the card closes it.
export function MaterialReader({ material, onClose }: MaterialReaderProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (material && !dialog.open) dialog.showModal()
    else if (!material && dialog.open) dialog.close()
  }, [material])

  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      className="jr-reader"
      aria-labelledby="jr-reader-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      {material && (
        <div className="card jr-reader__card">
          <header className="jr-reader__head">
            <div className="jr-reader__heading">
              <p className="eyebrow eyebrow--sm jr-reader__eyebrow">Material</p>
              <h2 id="jr-reader-title" className="title title--sm jr-reader__title">
                {material.title}
              </h2>
            </div>
            <button type="button" className="btn btn--secondary btn--sm jr-reader__close" onClick={close}>
              Close
            </button>
          </header>
          <div className="jr-reader__body">
            <MaterialBody material={material} />
          </div>
        </div>
      )}
    </dialog>
  )
}
