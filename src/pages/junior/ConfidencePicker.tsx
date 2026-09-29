import type { Confidence } from '../../contracts/types'

const LEVELS: { id: Confidence; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

type ConfidencePickerProps = {
  value: Confidence | null
  labelledBy: string
  readOnly: boolean
  onChange: (value: Confidence) => void
  className?: string
}

// Low / Medium / High on the segmented control (08). Read-only keeps the choice visible.
export function ConfidencePicker({ value, labelledBy, readOnly, onChange, className }: ConfidencePickerProps) {
  return (
    <div className={className ? `segmented ${className}` : 'segmented'} role="group" aria-labelledby={labelledBy}>
      {LEVELS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className="segmented__item"
          aria-pressed={value === id}
          aria-disabled={readOnly || undefined}
          onClick={() => {
            if (!readOnly) onChange(id)
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
