import { casePageHref, ROUTES } from '../../contracts/types'
import { Arrow } from '../../components/Arrow'
import { LANDING_FEATURE } from '../../lib/catalog'
import { HeroCollage } from './HeroCollage'
import { HERO_SUB } from './heroSub'

// 01 · the hero: the headline, sub-copy and buttons rise in on load (title, body, button).
export function Hero() {
  return (
    <section className="lp-hero" aria-labelledby="lp-hero-title">
      <div className="lp-hero__copy">
        <p className="lp-pill">
          Judgement training for the AI era
        </p>
        <h1 id="lp-hero-title" className="title title--xl lp-hero__title reveal reveal--title" data-revealed="true">
          Practise real calls
          <br />
          before they're
          <br />
          <em>yours</em> to make.
        </h1>
        <p className="lp-hero__sub reveal reveal--body" data-revealed="true">
          {HERO_SUB}
        </p>
        <div className="lp-hero__actions reveal reveal--button" data-revealed="true">
          <a className="btn btn--primary btn--pill" href={casePageHref(LANDING_FEATURE.caseId, 'details')}>
            Start a case <Arrow />
          </a>
          <a className="btn btn--secondary btn--pill" href={ROUTES.seniorShare}>
            Share a case
          </a>
        </div>
      </div>
      <HeroCollage />
    </section>
  )
}
