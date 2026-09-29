import type { ComponentType } from 'react'
import { ROLE_LABELS, ROUTES, type Role } from '../../contracts/types'
import { Arrow } from '../../components/Arrow'
import { IconDocument, IconMessage, IconUpload, type IconProps } from '../../components/icons'
import { demoPerson, firstName } from '../../lib/catalog'
import type { FixedRoute } from '../../lib/router'
import { revealDelay } from '../../lib/useReveal'
import { HERO_SUB } from '../landing/heroSub'
import './SignIn.css'

// One card per role; the person on it is that role's demo account.
type Persona = {
  role: Role
  eyebrow: string
  icon?: ComponentType<IconProps>
  body: string
  to: FixedRoute
  dark?: boolean
}

const PERSONAS: Persona[] = [
  {
    role: 'senior',
    eyebrow: `01 · ${ROLE_LABELS.senior}`,
    icon: IconUpload,
    body: "Share a case you've worked, broken into the four decisions you faced.",
    to: 'seniorCases',
  },
  {
    role: 'junior',
    eyebrow: `02 · ${ROLE_LABELS.junior}`,
    body: 'Step into the decision. New information unlocks only when you ask.',
    to: 'juniorHome',
    dark: true,
  },
  {
    role: 'manager',
    eyebrow: `03 · ${ROLE_LABELS.manager}`,
    icon: IconMessage,
    body: 'See how they reasoned, not just a score. Give feedback in a minute.',
    to: 'managerReviews',
  },
]

function PersonaCard({ persona, index }: { persona: Persona; index: number }) {
  const Icon = persona.icon
  const person = demoPerson(persona.role)
  const nameId = `si-${person.id}`
  return (
    <section
      className={`card si-card reveal reveal--body${persona.dark ? ' card--dark si-card--dark' : ''}`}
      data-revealed="true"
      style={revealDelay(index + 1)}
      aria-labelledby={nameId}
    >
      <div className="si-card__top">
        <p className="eyebrow si-card__eyebrow">{persona.eyebrow}</p>
        {Icon ? <Icon className="si-card__icon" /> : <span className="si-start">Start here</span>}
      </div>
      <div className="si-who">
        <span className="avatar si-avatar" aria-hidden="true">
          {person.initials}
        </span>
        <div>
          <h2 id={nameId} className="title si-name">
            {person.name}
          </h2>
          <p className="si-role">{person.title}</p>
        </div>
      </div>
      <p className="si-body">{persona.body}</p>
      <a className={`btn ${persona.dark ? 'btn--light' : 'btn--secondary'} si-continue`} href={ROUTES[persona.to]}>
        Continue as {firstName(person)} <Arrow />
      </a>
    </section>
  )
}

// 10-sign-in.png: pick a demo account; no sidebar. The title, lead and cards rise in on load.
export function SignIn() {
  return (
    <div className="si">
      <header className="si-nav">
        <a className="si-logo" href={ROUTES.landing}>
          <IconDocument className="si-logo__icon" />
          <span>Casebook</span>
        </a>
        <a className="btn btn--link si-back" href={ROUTES.landing}>
          <Arrow back /> Back to home
        </a>
      </header>
      <main className="si-main">
        <p className="si-pill">
          <span className="dot dot--accent si-pill__dot" aria-hidden="true" />
          Prototype · demo accounts
        </p>
        <h1 className="title si-title reveal reveal--title" data-revealed="true">
          Sign in to Casebook
        </h1>
        <div className="si-lead reveal reveal--body" data-revealed="true">
          <p>{HERO_SUB}</p>
          <p>Pick a demo account to explore each role. No password needed.</p>
        </div>
        <div className="si-grid">
          {PERSONAS.map((persona, index) => (
            <PersonaCard key={persona.role} persona={persona} index={index} />
          ))}
        </div>
        <p className="si-foot">You can switch roles any time from the sidebar.</p>
      </main>
    </div>
  )
}
