import type { ComponentType } from 'react'
import { casePageHref, ROUTES } from '../../contracts/types'
import { Arrow } from '../../components/Arrow'
import { IconBriefcase, IconPeople, IconPlay, IconShield, type IconProps } from '../../components/icons'
import { LANDING_FEATURE } from '../../lib/catalog'
import { revealDelay, useReveal } from '../../lib/useReveal'

type Way = { eyebrow: string; icon: ComponentType<IconProps>; title: string; body: string; link: string; href: string; dark?: boolean }

// Each claim here is something the prototype does. The Decision Room's other roles are scripted
// and every reply is labelled; nothing is shared until the learner previews and confirms it.
const WAYS: Way[] = [
  {
    eyebrow: 'Individual Practice',
    icon: IconPlay,
    title: 'Replay a case',
    body: 'Work a past case in four steps, then see feedback on your reasoning, revise, and try a changed condition.',
    link: 'Open a case',
    href: casePageHref(LANDING_FEATURE.caseId, 'details'),
  },
  {
    eyebrow: 'Team Decision Rooms',
    icon: IconPeople,
    title: 'Decide together',
    body: 'Play one role while the others answer only from their own briefs, as labelled demo responses. Agree a plan.',
    link: 'Enter a room',
    href: casePageHref(LANDING_FEATURE.caseId, 'room'),
    dark: true,
  },
  {
    eyebrow: 'Work & Grow',
    icon: IconBriefcase,
    title: 'Learn from your work',
    body: 'Bring a piece of your own work, pick one skill to practise, try a short challenge and keep the evidence.',
    link: 'Review your work',
    href: ROUTES.juniorGrow,
  },
]

// Overnight: the three ways to practise, in the style of "One case, three roles."
export function Ways() {
  const [ref, revealed] = useReveal<HTMLElement>()

  return (
    <section ref={ref} id="ways-to-practise" className="lp-roles lp-ways" aria-labelledby="lp-ways-title">
      <div className="lp-roles__head">
        <h2 id="lp-ways-title" className="title lp-roles__title reveal reveal--title" data-revealed={revealed}>
          Three ways to practise.
        </h2>
        <p className="lp-roles__lead reveal reveal--body" data-revealed={revealed}>
          From library cases to your own work.
        </p>
      </div>
      <div className="lp-roles__cards">
        {WAYS.map((way, index) => (
          <article
            key={way.eyebrow}
            className={`card lp-role reveal reveal--body${way.dark ? ' card--dark lp-role--dark' : ''}`}
            data-revealed={revealed}
            style={revealDelay(index + 1)}
          >
            <div className="lp-role__top">
              <p className="eyebrow lp-role__eyebrow">{way.eyebrow}</p>
              <way.icon className="lp-role__icon" />
            </div>
            <h3 className="title lp-role__title">{way.title}</h3>
            <p className="lp-role__body">{way.body}</p>
            <a className="btn btn--link lp-role__link" href={way.href}>
              {way.link} <Arrow />
            </a>
          </article>
        ))}
      </div>
      <p className="lp-ways__note reveal reveal--body" data-revealed={revealed}>
        <IconShield />
        <span>
          <strong>You choose what to share.</strong> Growth records stay private until you pick them, preview the exact
          copy and confirm.
        </span>
      </p>
    </section>
  )
}
