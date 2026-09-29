import { useState } from 'react'
import { casePageHref } from '../../contracts/types'
import { firstName, getPerson, getSummary, JUNIOR_PROFILE, RECOMMENDED_CASE_ID } from '../../lib/content'
import { HomeAside } from './HomeAside'
import { HomeCases } from './HomeCases'
import { IconSearch, NextArrow } from './icons'
import './JuniorHome.css'

// The junior's case library (04-junior-home.png).
export function JuniorHome() {
  const [search, setSearch] = useState('')
  const junior = getPerson(JUNIOR_PROFILE.juniorId)
  const recommended = getSummary(RECOMMENDED_CASE_ID)

  return (
    <div className="jr-home">
      <header className="jr-home__head">
        <h1 className="title reveal reveal--title jr-home__greeting" data-revealed="true">
          Good afternoon, {firstName(junior)}
        </h1>
        <label className="jr-search">
          <span className="visually-hidden">Search cases</span>
          <IconSearch className="jr-search__icon" />
          <input
            type="search"
            className="input jr-search__input"
            placeholder="Search cases"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </header>
      <section className="card card--dark jr-hero" aria-labelledby="jr-hero-title">
        <div className="jr-hero__text">
          <p className="eyebrow jr-hero__eyebrow">RECOMMENDED FOR YOU</p>
          <h2 id="jr-hero-title" className="title jr-hero__title">
            {recommended.title}
          </h2>
          <p className="jr-hero__meta">
            {recommended.focus} · {recommended.minutes} min
          </p>
        </div>
        <a className="btn btn--light btn--pill jr-hero__start" href={casePageHref(RECOMMENDED_CASE_ID, 'details')}>
          Start case
          <NextArrow />
        </a>
      </section>
      <div className="jr-home__grid">
        <HomeCases search={search} />
        <HomeAside />
      </div>
    </div>
  )
}
