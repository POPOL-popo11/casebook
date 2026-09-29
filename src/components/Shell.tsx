import { useRef, type ReactNode } from 'react'
import type { Role, RouteKey } from '../contracts/types'
import { Sidebar } from './Sidebar'
import './Shell.css'

// The app frame for every screen except the landing page: the fixed sidebar on the left
// and the canvas to its right. Pages own everything inside the canvas, padding included.
// 'Skip to main content' comes first and shows only while it has focus. It moves focus to the
// canvas itself: a plain '#main' link would change the hash, which is the route.
export function Shell({ role, route, children }: { role: Role; route: RouteKey; children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)
  return (
    <>
      <a
        className="btn btn--light shell__skip"
        href="#main"
        onClick={(event) => {
          event.preventDefault()
          mainRef.current?.focus()
        }}
      >
        Skip to main content
      </a>
      <Sidebar role={role} route={route} />
      <main ref={mainRef} id="main" className="shell__main" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}
