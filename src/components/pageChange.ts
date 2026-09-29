import { useEffect, useRef } from 'react'
import { pageTitle } from '../lib/pageTitle'
import { useStore } from '../lib/records'
import type { RouteMatch } from '../lib/router'
import './pageChange.css'

// How long a new page's heading is waited for while its screen's code loads.
const WAIT_MS = 10_000

// Called once, in App. Every page names itself in the browser tab (lib/pageTitle.ts). When the
// page changes, focus moves to its h1, so a screen reader reads the new page and Tab carries on
// from there. The first page to load keeps the browser's own focus.
export function usePageChange(match: RouteMatch, screenKey: string): void {
  const title = useStore((store) => pageTitle(match, store))
  useEffect(() => {
    document.title = title
  }, [title])

  const shown = useRef<string | null>(null)
  useEffect(() => {
    const previous = shown.current
    shown.current = screenKey
    if (previous === null || previous === screenKey) return
    return focusHeadingWhenShown()
  }, [screenKey])
}

// The page's h1 takes focus once it is on screen: at once, or when its screen's code has loaded.
// Returns a function that stops waiting.
function focusHeadingWhenShown(): () => void {
  const focused = (): boolean => {
    const heading = [...document.querySelectorAll<HTMLElement>('main h1')].find((h) => h.getClientRects().length > 0)
    if (!heading) return false
    heading.tabIndex = -1
    heading.dataset.pageFocus = ''
    heading.focus({ preventScroll: true })
    return document.activeElement === heading
  }
  if (focused()) return () => {}

  const observer = new MutationObserver(() => {
    if (focused()) stop()
  })
  const timer = window.setTimeout(() => stop(), WAIT_MS)
  function stop() {
    observer.disconnect()
    window.clearTimeout(timer)
  }
  observer.observe(document.body, { childList: true, subtree: true })
  return stop
}
