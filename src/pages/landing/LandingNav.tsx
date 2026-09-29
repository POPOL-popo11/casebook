import type { MouseEvent } from 'react'
import { ROUTES } from '../../contracts/types'
import { IconDocument } from '../../components/icons'
import { scrollToSection } from '../../lib/router'

// In-page links keep the hash route as it is and scroll to their section.
const toSection = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault()
  scrollToSection(id)
}

// The logo returns to the top; on '#/' itself there is no hash change to do it for us.
const toTop = (event: MouseEvent<HTMLAnchorElement>) => {
  if (window.location.hash === ROUTES.landing || window.location.hash === '') event.preventDefault()
  window.scrollTo({ top: 0 })
}

export function LandingNav() {
  return (
    <header className="lp-nav">
      <a className="lp-logo" href={ROUTES.landing} onClick={toTop}>
        <IconDocument className="lp-logo__icon" />
        <span>Casebook</span>
      </a>
      <nav className="lp-nav__links" aria-label="Sections">
        <a href="#how-it-works" onClick={toSection('how-it-works')}>
          How it works
        </a>
        <a href="#the-four-moves" onClick={toSection('the-four-moves')}>
          The four moves
        </a>
        <a href="#for-managers" onClick={toSection('for-managers')}>
          For Team Leads
        </a>
      </nav>
      <div className="lp-nav__actions">
        <a className="lp-nav__signin" href={ROUTES.signIn}>
          Sign in
        </a>
        <a className="btn btn--dark btn--pill" href={ROUTES.juniorHome}>
          Get started
        </a>
      </div>
    </header>
  )
}
