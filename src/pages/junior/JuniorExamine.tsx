import { useEffect, useRef, type DragEvent } from 'react'
import { caseHref } from '../../contracts/types'
import { getCase } from '../../lib/content'
import { useCaseId } from '../../lib/router'
import { CaseFrame } from './CaseFrame'
import { ChipList } from './ChipList'
import { COLUMNS, factsOf, PLACE_NAMES, type Place } from './examineData'
import { BackArrow, NextArrow } from './icons'
import { usePractice } from './practice'
import { SortCard } from './SortCard'
import './JuniorExamine.css'
import './ExamineReason.css'

// Step 2 of a case (06-junior-examine.png). In practice mode every card starts unsorted; the
// learner places each one, says why, and can move it again at any time, e.g. after Investigate.
// The example shows its own sort, read-only.
export function JuniorExamine() {
  const caseId = useCaseId()
  const content = getCase(caseId)
  const practice = usePractice(content)
  const { mode, example, attempt, readOnly, update } = practice
  const shown =
    mode === 'example' && example
      ? { sort: example.sort, reasons: example.sortReasons ?? {}, missing: example.missing }
      : attempt.examine
  const facts = factsOf(content.cards, shown.sort)
  const cards = useRef(new Map<string, HTMLDivElement>())
  const refocus = useRef<string | null>(null)

  // After a move from the keyboard menu, focus follows the card to its new place.
  useEffect(() => {
    if (!refocus.current) return
    cards.current.get(refocus.current)?.focus()
    refocus.current = null
  })

  const move = (id: string, place: Place, keepFocus: boolean) => {
    const fact = facts.find((f) => f.id === id)
    if (readOnly || !fact || fact.place === place) return
    update((a) => {
      a.examine.sort[id] = place
    })
    if (keepFocus) refocus.current = id
  }

  const dropZone = (place: Place) =>
    readOnly
      ? {}
      : {
          onDragOver: (e: DragEvent) => {
            if (!e.dataTransfer.types.includes('text/plain')) return
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
          },
          onDrop: (e: DragEvent) => {
            e.preventDefault()
            move(e.dataTransfer.getData('text/plain'), place, false)
          },
        }

  const cardRef = (id: string, el: HTMLDivElement | null) => {
    if (el) cards.current.set(id, el)
    else cards.current.delete(id)
  }

  const cardsIn = (place: Place) =>
    facts
      .filter((f) => f.place === place)
      .map((f) => (
        <SortCard
          key={f.id}
          fact={f}
          reason={shown.reasons[f.id] ?? ''}
          readOnly={readOnly}
          onMove={(id, to) => move(id, to, true)}
          onReason={(text) =>
            update((a) => {
              a.examine.reasons[f.id] = text
            })
          }
          cardRef={cardRef}
        />
      ))

  const unsorted = facts.filter((f) => f.place === 'unsorted').length

  return (
    <CaseFrame
      caseId={caseId}
      step="examine"
      className="jr-examine"
      practice={practice}
      actions={
        <>
          <a className="btn btn--secondary" href={caseHref(caseId, 'define')}>
            <BackArrow />
            Back
          </a>
          <a className="btn btn--primary" href={caseHref(caseId, 'investigate')}>
            Next
            <NextArrow />
          </a>
        </>
      }
    >
      <div className="jr-examine__head">
        <h2 className="title title--md jr-examine__title">Sort what you know</h2>
        {!readOnly && <p className="jr-examine__hint">Drag cards between columns</p>}
      </div>
      <section className="card card--dashed jr-tray" aria-label={`Unsorted, ${unsorted}`} {...dropZone('unsorted')}>
        <p className="eyebrow eyebrow--sm jr-tray__label" aria-hidden="true">
          UNSORTED · {unsorted}
        </p>
        <ul className="jr-tray__list">{cardsIn('unsorted')}</ul>
      </section>
      <div className="jr-board">
        {COLUMNS.map(({ place, dot }) => (
          <section key={place} className="jr-column" aria-labelledby={`jr-col-${place}`} {...dropZone(place)}>
            <h3 id={`jr-col-${place}`} className="jr-column__head">
              <span className={`dot ${dot}`} aria-hidden="true" />
              <span className="jr-column__name">{PLACE_NAMES[place]}</span>
              <span className="jr-column__count">{facts.filter((f) => f.place === place).length}</span>
            </h3>
            <ul className="jr-column__list">{cardsIn(place)}</ul>
          </section>
        ))}
      </div>
      <div className="jr-missing">
        <span id="jr-missing" className="jr-missing__label">
          Missing
        </span>
        <ChipList
          items={shown.missing}
          labelledBy="jr-missing"
          chipClass="chip chip--outline"
          addLabel="Add something missing"
          readOnly={readOnly}
          onChange={(missing) =>
            update((a) => {
              a.examine.missing = missing
            })
          }
        />
      </div>
    </CaseFrame>
  )
}
