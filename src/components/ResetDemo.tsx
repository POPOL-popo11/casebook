import { useEffect, useId, useRef, useState } from 'react'
import { resetDemo } from '../lib/records'
import { IconReset } from './icons'
import { toast } from './toast'
import './ResetDemo.css'

// 'Reset demo data' in the sidebar's user area. It asks first, in place: Reset or Cancel.
// Escape cancels. Focus goes to Cancel when it asks, and back to the button when it closes.
export function ResetDemo() {
  const [asking, setAsking] = useState(false)
  const questionId = useId()
  const openRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const refocus = useRef(false)

  useEffect(() => {
    if (asking) cancelRef.current?.focus()
    else if (refocus.current) openRef.current?.focus()
    refocus.current = false
  }, [asking])

  const close = () => {
    refocus.current = true
    setAsking(false)
  }

  const reset = () => {
    resetDemo()
    close()
    toast('Demo data reset.')
  }

  if (!asking) {
    return (
      <button ref={openRef} type="button" className="reset-demo" onClick={() => setAsking(true)}>
        <IconReset />
        Reset demo data
      </button>
    )
  }

  return (
    <div
      className="reset-demo__ask"
      role="group"
      aria-labelledby={questionId}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close()
      }}
    >
      <p id={questionId} className="reset-demo__question">
        Clear everything entered in this browser and restore the demo records?
      </p>
      <div className="reset-demo__actions">
        <button type="button" className="btn btn--sm btn--light" onClick={reset}>
          Reset
        </button>
        <button ref={cancelRef} type="button" className="btn btn--sm btn--outline-dark" onClick={close}>
          Cancel
        </button>
      </div>
    </div>
  )
}
