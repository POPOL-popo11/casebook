import { useEffect, useId, useRef, useState, type ComponentType } from 'react'
import type { Store } from '../contracts/records'
import { ROLE_LABELS, ROUTES, type Role, type RouteKey } from '../contracts/types'
import { demoPerson } from '../lib/catalog'
import { unreadFeedbackCount, waitingForReviewCount } from '../lib/queries'
import { useStore } from '../lib/records'
import { ROLE_HOME } from '../lib/roles'
import { navigate, type FixedRoute } from '../lib/router'
import {
  IconBriefcase,
  IconClose,
  IconDocument,
  IconFolder,
  IconGrid,
  IconHome,
  IconLayers,
  IconList,
  IconMenu,
  IconMessage,
  IconPeople,
  IconPlus,
  IconTrend,
  type IconProps,
} from './icons'
import { ResetDemo } from './ResetDemo'
import './Sidebar.css'

type NavItem = {
  label: string
  icon: ComponentType<IconProps>
  to: FixedRoute
  activeOn: RouteKey[]
  // A number from the record store, shown as a count when it is above zero. 'unit' is read
  // out after the number by screen readers: 'Feedback, 1 unread'.
  count?: { of: (store: Store) => number; unit: string }
}


const unreadFeedback = (store: Store) => unreadFeedbackCount(store, demoPerson('junior').id)

// Navigation from requirements §2. Each role starts on ROLE_HOME (lib/roles.ts).
const NAV: Record<Role, NavItem[]> = {
  senior: [
    // Share and Breakdown show the case My Cases opened.
    { label: 'My Cases', icon: IconFolder, to: 'seniorCases', activeOn: ['seniorCases', 'seniorShare', 'seniorBreakdown'] },
    { label: 'Create a Case', icon: IconPlus, to: 'seniorNew', activeOn: ['seniorNew'] },
    { label: 'Skill Frameworks', icon: IconLayers, to: 'seniorSkills', activeOn: ['seniorSkills'] },
  ],
  junior: [
    {
      label: 'Case Library',
      icon: IconGrid,
      to: 'juniorHome',
      // Active inside every case too: details, the four steps, reflect and the team room.
      activeOn: [
        'juniorHome',
        'juniorInProgress',
        'juniorCase',
        'juniorDefine',
        'juniorExamine',
        'juniorInvestigate',
        'juniorDecide',
        'juniorReflect',
        'juniorRoom',
      ],
    },
    { label: 'Work & Grow', icon: IconBriefcase, to: 'juniorGrow', activeOn: ['juniorGrow'] },
    { label: 'My Growth', icon: IconTrend, to: 'juniorGrowth', activeOn: ['juniorGrowth'] },
    {
      label: 'Feedback',
      icon: IconMessage,
      to: 'juniorFeedback',
      activeOn: ['juniorFeedback'],
      count: { of: unreadFeedback, unit: 'unread' },
    },
  ],
  manager: [
    {
      label: 'Practice Reviews',
      icon: IconList,
      to: 'managerReviews',
      activeOn: ['managerReviews', 'managerReview'],
      count: { of: waitingForReviewCount, unit: 'waiting for review' },
    },
    { label: 'Shared Growth', icon: IconPeople, to: 'managerTeam', activeOn: ['managerTeam'] },
  ],
}

// The design's order: Case Expert, Learner, Team Lead.
const ROLE_ORDER: Role[] = ['senior', 'junior', 'manager']

export function Sidebar({ role, route }: { role: Role; route: RouteKey }) {
  const nav = NAV[role]
  const user = demoPerson(role)
  const counts = useStore((store) => nav.map((item) => item.count?.of(store) ?? 0))
  // Phones only: the sidebar is a top bar whose menu opens the panel. It closes on every route.
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const menuRef = useRef<HTMLButtonElement>(null)
  useEffect(() => setOpen(false), [route])

  return (
    <>
      <aside
        className="sidebar"
        data-open={open || undefined}
        onKeyDown={(event) => {
          if (event.key !== 'Escape' || !open) return
          setOpen(false)
          menuRef.current?.focus()
        }}
      >
        <div className="sidebar__bar">
          <a className="sidebar__logo" href={ROUTES.landing}>
            <IconDocument className="sidebar__logo-icon" />
            <span>Casebook</span>
          </a>
          <button
            ref={menuRef}
            type="button"
            className="sidebar__menu"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
          >
            {open ? <IconClose /> : <IconMenu />}
            Menu
          </button>
        </div>

        <div id={panelId} className="sidebar__panel">
          <div className="segmented segmented--dark sidebar__roles" role="group" aria-label="Role">
            {ROLE_ORDER.map((r) => (
              <button
                key={r}
                type="button"
                className="segmented__item"
                aria-pressed={r === role}
                onClick={() => navigate(ROLE_HOME[r])}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>

          <nav className="sidebar__nav" aria-label={`${ROLE_LABELS[role]} navigation`}>
            {/* One click back to the landing page from anywhere (the logo goes there too, but doesn't look like a link). */}
            <a className="navitem" href={ROUTES.landing}>
              <IconHome />
              <span className="sidebar__nav-label">Home</span>
            </a>
            {nav.map((item, i) => (
              <a
                key={item.label}
                className="navitem"
                href={ROUTES[item.to]}
                aria-current={item.activeOn.includes(route) ? 'page' : undefined}
              >
                <item.icon />
                <span className="sidebar__nav-label">{item.label}</span>
                {item.count && counts[i] > 0 && (
                  <span className="count">
                    {counts[i]}
                    <span className="visually-hidden"> {item.count.unit}</span>
                  </span>
                )}
              </a>
            ))}
          </nav>

          <div className="sidebar__user">
            <div className="sidebar__me">
              <span className="avatar avatar--dark" aria-hidden="true">
                {user.initials}
              </span>
              <span className="sidebar__who">
                <span className="sidebar__name">{user.name}</span>
                <span className="sidebar__title">{user.title}</span>
              </span>
            </div>
            <ResetDemo />
            <p className="sidebar__demo-note">Local demo: records stay in this browser. No accounts, no server, no live AI.</p>
          </div>
        </div>
      </aside>
      {/* Phones: the backdrop behind the open menu. A click on it closes the menu, as Escape does. */}
      {open && <div className="sidebar__scrim" aria-hidden="true" onClick={() => setOpen(false)} />}
    </>
  )
}
