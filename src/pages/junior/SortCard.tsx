import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { PLACES, PLACE_NAMES, type Fact, type Place } from './examineData'
import './fields.css'

type SortCardProps = {
  fact: Fact
  // Why the learner put the card where it is: one sentence.
  reason: string
  readOnly: boolean
  onMove: (id: string, place: Place) => void
  onReason: (reason: string) => void
  // Registers the card element so the board can give it focus again after a move.
  cardRef: (id: string, el: HTMLDivElement | null) => void
}

// A fact on Examine (06). Drag it to another place, or focus it and press Enter to open a small
// 'Move to…' menu that lists the other places. Once placed, a field under it asks why. Read-only,
// it is a plain card with the reason, if any, as its last line.
export function SortCard({ fact, reason, readOnly, onMove, onReason, cardRef }: SortCardProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const cardEl = useRef<HTMLDivElement | null>(null)
  const menuId = `jr-move-${fact.id}`

  useEffect(() => {
    if (open) menuRef.current?.querySelector('button')?.focus()
  }, [open])

  if (readOnly) {
    return (
      <li className="jr-fact">
        <div className="card jr-fact__card jr-fact__card--static">
          <span className="jr-fact__title">{fact.text}</span>
          <span className="jr-fact__source">{fact.source}</span>
          {reason && <span className="jr-fact__why">{reason}</span>}
        </div>
      </li>
    )
  }

  const closeMenu = () => {
    setOpen(false)
    cardEl.current?.focus()
  }

  const onCardKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((isOpen) => !isOpen)
    }
  }

  const onMenuKey = (e: KeyboardEvent) => {
    const items = [...(menuRef.current?.querySelectorAll('button') ?? [])]
    const at = items.indexOf(document.activeElement as HTMLButtonElement)
    const go = (i: number) => {
      e.preventDefault()
      items[(i + items.length) % items.length]?.focus()
    }
    if (e.key === 'ArrowDown') go(at + 1)
    else if (e.key === 'ArrowUp') go(at - 1)
    else if (e.key === 'Home') go(0)
    else if (e.key === 'End') go(items.length - 1)
    else if (e.key === 'Escape') {
      e.preventDefault()
      closeMenu()
    }
  }

  // Close when focus leaves the card and its menu, e.g. on Tab or a click elsewhere.
  const onBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
  }

  return (
    <li className="jr-fact" onBlur={onBlur}>
      <div
        ref={(el) => {
          cardEl.current = el
          cardRef(fact.id, el)
        }}
        className="card jr-fact__card"
        role="button"
        tabIndex={0}
        draggable
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={onCardKey}
        onDragStart={(e) => {
          setOpen(false)
          e.dataTransfer.setData('text/plain', fact.id)
          e.dataTransfer.effectAllowed = 'move'
        }}
      >
        <span className="jr-fact__title">{fact.text}</span>
        <span className="jr-fact__source">{fact.source}</span>
      </div>
      {open && (
        <div id={menuId} ref={menuRef} className="jr-move" role="menu" aria-label="Move to" onKeyDown={onMenuKey}>
          <p className="jr-move__label" aria-hidden="true">
            Move to…
          </p>
          {PLACES.filter((place) => place !== fact.place).map((place) => (
            <button
              key={place}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className="jr-move__item"
              onClick={() => {
                setOpen(false)
                onMove(fact.id, place)
              }}
            >
              {PLACE_NAMES[place]}
            </button>
          ))}
        </div>
      )}
      {fact.place !== 'unsorted' && (
        <textarea
          className="textarea jr-line jr-fact__reason"
          rows={1}
          aria-label={`Why is “${fact.text}” in ${PLACE_NAMES[fact.place]}?`}
          placeholder="Why here?"
          value={reason}
          onChange={(e) => onReason(e.target.value)}
        />
      )}
    </li>
  )
}
