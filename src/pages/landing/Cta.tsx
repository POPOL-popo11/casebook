import { ROUTES } from '../../contracts/types'
import { useReveal } from '../../lib/useReveal'

// 01 · the dark call-to-action band.
export function Cta() {
  const [ref, revealed] = useReveal<HTMLElement>()

  return (
    <section ref={ref} className="lp-cta" aria-labelledby="lp-cta-title">
      <h2 id="lp-cta-title" className="title lp-cta__title reveal reveal--title" data-revealed={revealed}>
        Turn your team's best{' '}
        <br />
        calls into <em>practice</em>.
      </h2>
      <div className="lp-cta__actions reveal reveal--button" data-revealed={revealed}>
        <a className="btn btn--light btn--pill" href={ROUTES.seniorShare}>
          Share your first case
        </a>
        <a className="btn btn--outline-dark btn--pill" href={ROUTES.juniorHome}>
          Browse cases
        </a>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer className="lp-footer">
      <span className="title lp-footer__logo">Casebook</span>
      <span className="lp-footer__meta">Prototype · FEIT Hackathon 2026</span>
    </footer>
  )
}
