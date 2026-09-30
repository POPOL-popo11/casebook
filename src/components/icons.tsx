import type { ReactNode } from 'react'
import './icons.css'

// Inline stroke icons drawn on a 24px grid. The shared .icon class sizes them to 1em.
export type IconProps = { className?: string }

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

// The Casebook logo: a page with a cut corner and three lines of text.
export const IconDocument = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h8.5L19 7.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M9 11.5h6M9 14.5h6M9 17.5h3" />
  </Svg>
)

// Home: a house, for the link back to the landing page.
export const IconHome = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 8.5V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V8.5" />
  </Svg>
)

// A material: a blank page with a cut corner.
export const IconFile = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.5 2h6l4 4v15a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
  </Svg>
)

export const IconPlus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const IconFolder = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
  </Svg>
)

export const IconGrid = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </Svg>
)

export const IconClock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
)

// A speech bubble with its tail at the bottom left.
export const IconMessage = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 4h18v12H10l-3.5 3.5V16H3z" />
  </Svg>
)

export const IconList = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Svg>
)

export const IconPeople = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.4a6 6 0 0 1 3 5.6" />
  </Svg>
)

// Work & Grow: a briefcase, for your own work.
export const IconBriefcase = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" />
  </Svg>
)

// My Growth: a line that rises.
export const IconTrend = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </Svg>
)

// Skill Frameworks: stacked levels.
export const IconLayers = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l9 5-9 5-9-5z" />
    <path d="M3 13l9 5 9-5" />
  </Svg>
)

// The phone menu: open (three lines) and close (a cross).
export const IconMenu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
)

export const IconClose = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)

// Reset demo data: an arrow turning back.
export const IconReset = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 4v6h6" />
    <path d="M5.1 15a8 8 0 1 0 1.9-8.3L3 10" />
  </Svg>
)

export const IconEye = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
)

export const IconLock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
)

export const IconShield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.5l6.5 2.8v5.9c0 4.6-2.8 8.3-6.5 10.3-3.7-2-6.5-5.7-6.5-10.3V5.3z" />
  </Svg>
)

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
)

// The design's arrows look like the sans font's → and ←: 11×10, bold in buttons, lighter in text.
// They are drawn on their own tight grid so the ink sits where the glyph would (see icons.css).
function ArrowSvg({ className, d, light }: IconProps & { d: string; light?: boolean }) {
  return (
    <svg
      className={`icon icon--arrow${className ? ` ${className}` : ''}`}
      viewBox="0 0 11 10"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} strokeWidth={light ? 1.3 : 1.8} />
    </svg>
  )
}

export const IconArrowRight = ({ light, ...p }: IconProps & { light?: boolean }) => (
  <ArrowSvg {...p} light={light} d="M0.9 5h9.2M5.9 0.9 10.1 5 5.9 9.1" />
)

export const IconArrowLeft = ({ light, ...p }: IconProps & { light?: boolean }) => (
  <ArrowSvg {...p} light={light} d="M10.1 5H0.9M5.1 0.9 0.9 5 5.1 9.1" />
)

export const IconChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
)

export const IconMic = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
  </Svg>
)

export const IconUpload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M3 14.5V20h18v-5.5" />
  </Svg>
)

export const IconPlay = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.5 5.5v13L18 12z" />
  </Svg>
)
