import { Cta, LandingFooter } from './Cta'
import { Hero } from './Hero'
import { LandingNav } from './LandingNav'
import { Moves } from './Moves'
import { Roles } from './Roles'
import { Ways } from './Ways'
import './Landing.css'
import './Hero.css'
import './Sections.css'
import './Responsive.css'

// 01-landing.png: no sidebar; content 1312px wide between 64px margins.
export function Landing() {
  return (
    <div className="lp">
      <LandingNav />
      <main>
        <Hero />
        <Roles />
        <Ways />
        <Moves />
        <Cta />
      </main>
      <LandingFooter />
    </div>
  )
}
