import type { ComponentType } from 'react'
import { casePageHref, ROLE_LABELS, ROUTES } from '../../contracts/types'
import { Arrow } from '../../components/Arrow'
import { IconMessage, IconPlay, IconUpload, type IconProps } from '../../components/icons'
import { LANDING_FEATURE } from '../../lib/catalog'
import { revealDelay, useReveal } from '../../lib/useReveal'

type RoleCard = {
  id?: string
  eyebrow: string
  icon: ComponentType<IconProps>
  title: string
  body: string
  link: string
  href: string
  dark?: boolean
}

const ROLES: RoleCard[] = [
  {
    eyebrow: `01 · ${ROLE_LABELS.senior}`,
    icon: IconUpload,
    title: 'Share',
    body: "Share a case you've worked, broken into the four decisions you faced.",
    link: 'Share a case',
    href: ROUTES.seniorShare,
  },
  {
    eyebrow: `02 · ${ROLE_LABELS.junior}`,
    icon: IconPlay,
    title: 'Replay',
    body: 'Step into the decision. New information unlocks only when you ask.',
    link: 'Start a case',
    href: casePageHref(LANDING_FEATURE.caseId, 'details'),
    dark: true,
  },
  {
    id: 'for-managers',
    eyebrow: `03 · ${ROLE_LABELS.manager}`,
    icon: IconMessage,
    title: 'Review',
    body: 'See how they reasoned, not just a score. Give feedback in a minute.',
    link: 'See a review',
    href: ROUTES.managerReviews,
  },
]

// 01 · "One case, three roles."
export function Roles() {
  const [ref, revealed] = useReveal<HTMLElement>()

  return (
    <section ref={ref} id="how-it-works" className="lp-roles" aria-labelledby="lp-roles-title">
      <div className="lp-roles__head">
        <h2 id="lp-roles-title" className="title lp-roles__title reveal reveal--title" data-revealed={revealed}>
          One case, three roles.
        </h2>
        <p className="lp-roles__lead reveal reveal--body" data-revealed={revealed}>
          Everyone works from the same real decision.
        </p>
      </div>
      <div className="lp-roles__cards">
        {ROLES.map((role, index) => (
          <article
            key={role.title}
            id={role.id}
            className={`card lp-role reveal reveal--body${role.dark ? ' card--dark lp-role--dark' : ''}`}
            data-revealed={revealed}
            style={revealDelay(index + 1)}
          >
            <div className="lp-role__top">
              <p className="eyebrow lp-role__eyebrow">{role.eyebrow}</p>
              <role.icon className="lp-role__icon" />
            </div>
            <h3 className="title lp-role__title">{role.title}</h3>
            <p className="lp-role__body">{role.body}</p>
            <a className="btn btn--link lp-role__link" href={role.href}>
              {role.link} <Arrow />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
