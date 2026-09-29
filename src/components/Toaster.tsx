import { useEffect, useState } from 'react'
import { subscribeToToasts } from './toast'
import './Toaster.css'

// A toast is on screen for 3 seconds in all: it rises in, stays, then fades out over the last 300ms.
const VISIBLE_MS = 2700
const EXIT_MS = 300

type Toast = { id: number; message: string; leaving: boolean }

// Mounted once in App. The status region always exists so screen readers announce each toast.
export function Toaster() {
  const [current, setCurrent] = useState<Toast | null>(null)

  useEffect(() => {
    let nextId = 0
    return subscribeToToasts((message) => {
      nextId += 1
      setCurrent({ id: nextId, message, leaving: false })
    })
  }, [])

  useEffect(() => {
    if (!current) return
    const timer = window.setTimeout(
      () => setCurrent(current.leaving ? null : { ...current, leaving: true }),
      current.leaving ? EXIT_MS : VISIBLE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [current])

  return (
    <div className="toaster" role="status" aria-live="polite">
      {current && (
        <p key={current.id} className="toaster__toast" data-leaving={current.leaving || undefined}>
          {current.message}
        </p>
      )}
    </div>
  )
}
