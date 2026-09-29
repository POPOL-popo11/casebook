import { useEffect, useRef, useState } from 'react'
import './ChipList.css'

type ChipListProps = {
  items: string[]
  labelledBy: string
  // The chips' classes, e.g. 'chip' (People involved) or 'chip chip--outline' (Missing).
  chipClass: string
  // The '+' chip's accessible name and the field's placeholder, e.g. 'Add a person'.
  addLabel: string
  readOnly: boolean
  onChange: (items: string[]) => void
}

// A row of chips the learner writes: each can be removed, and the dashed '+' opens a small
// field. Enter adds what was typed and keeps the field open; Escape closes it.
export function ChipList({ items, labelledBy, chipClass, addLabel, readOnly, onChange }: ChipListProps) {
  return (
    <ul className="jr-chips" aria-labelledby={labelledBy}>
      {items.map((item, i) => (
        <li key={`${i}-${item}`} className={`${chipClass} jr-chip`}>
          {item}
          {!readOnly && (
            <button
              type="button"
              className="jr-chip__remove"
              aria-label={`Remove ${item}`}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              ×
            </button>
          )}
        </li>
      ))}
      {!readOnly && <ChipAdder label={addLabel} onAdd={(text) => onChange([...items, text])} />}
    </ul>
  )
}

function ChipAdder({ label, onAdd }: { label: string; onAdd: (text: string) => void }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const refocus = useRef(false)

  useEffect(() => {
    if (open) input.current?.focus()
    else if (refocus.current) button.current?.focus()
    refocus.current = false
  }, [open])

  const add = () => {
    const value = text.trim()
    if (value) onAdd(value)
    setText('')
  }

  if (!open) {
    return (
      <li className="jr-chips__add">
        <button ref={button} type="button" className="chip chip--add" aria-label={label} onClick={() => setOpen(true)}>
          +
        </button>
      </li>
    )
  }

  return (
    <li className="jr-chips__add">
      <input
        ref={input}
        className="input jr-chipadd"
        aria-label={label}
        placeholder={label}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            add()
          } else if (e.key === 'Escape') {
            e.preventDefault()
            refocus.current = true
            setText('')
            setOpen(false)
          }
        }}
        onBlur={() => {
          // Escape already closed it without adding.
          if (!refocus.current) add()
          setOpen(false)
        }}
      />
    </li>
  )
}
