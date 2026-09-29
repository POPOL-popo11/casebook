import { useEffect, useRef } from 'react'

type Finder = () => Element | null | undefined

// Focus after an action that removes or disables the pressed button: the handler names what
// should take focus, and it gets it after the render that shows it, instead of falling to <body>.
// Set the finder before the store update, so the render that update causes can find the target.
export function useFocusAfter(): (find: Finder) => void {
  const pending = useRef<Finder | null>(null)
  useEffect(() => {
    const target = pending.current?.()
    if (target instanceof HTMLElement) {
      pending.current = null
      target.focus()
    }
  })
  return (find) => {
    pending.current = find
  }
}

// The element with this id, for a finder.
export const byId = (id: string) => () => document.getElementById(id)
