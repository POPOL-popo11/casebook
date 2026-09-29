import { useEffect, useRef, useState, type CSSProperties } from 'react'

// Items in a row rise one --reveal-stagger after another: style={revealDelay(index)}.
export const revealDelay = (index: number) =>
  ({ '--reveal-delay': `calc(var(--reveal-stagger) * ${index})` }) as CSSProperties

// Reveals a section the first time about a fifth of it scrolls into view.
// Put the ref on the section and data-revealed={revealed} on its .reveal elements.
// Without IntersectionObserver everything is revealed at once.
export function useReveal<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (revealed || !element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [revealed, threshold])

  return [ref, revealed] as const
}
