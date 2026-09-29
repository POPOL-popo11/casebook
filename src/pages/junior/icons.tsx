import type { ReactNode } from 'react'

// Inline stroke icons for the junior screens, drawn to match design/casebook/04–08.
// Each viewBox is in CSS pixels at the size the design uses, so 1 unit = 1px when the
// icon's font-size equals `size` (the shared .icon class sizes an icon to 1em).
type SvgProps = { size: number; stroke: number; className?: string; children: ReactNode }

function Svg({ size, stroke, className, children }: SvgProps) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ strokeWidth: stroke }}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

type IconProps = { className?: string }

// 16px: the search field on Home.
export const IconSearch = ({ className }: IconProps) => (
  <Svg size={16} stroke={1.3} className={className}>
    <circle cx="6.75" cy="6.75" r="4.75" />
    <path d="M10.4 10.4 14 14" />
  </Svg>
)

// 16px: a brief material, a page with a cut corner.
export const IconFile = ({ className }: IconProps) => (
  <Svg size={16} stroke={1.25} className={className}>
    <path d="M4.75.75h4.5l3 3v10.5a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1V1.75a1 1 0 0 1 1-1z" />
  </Svg>
)

// 12px: 'More unlocks when you ask for it'.
export const IconLock = ({ className }: IconProps) => (
  <Svg size={12} stroke={1.2} className={className}>
    <rect x="1.6" y="5.1" width="8.8" height="6" rx="1.4" />
    <path d="M3.6 5.1V3.6a2.4 2.4 0 0 1 4.8 0v1.5" />
  </Svg>
)

// 18px: the blue question callout.
export const IconQuestion = ({ className }: IconProps) => (
  <Svg size={18} stroke={1.4} className={className}>
    <circle cx="9" cy="9" r="8.1" />
    <path d="M6.9 6.9a2.15 2.15 0 0 1 4.2.6c0 1.45-2.1 1.8-2.1 3.2" />
    <path d="M9 13.2h.01" style={{ strokeWidth: 1.9 }} />
  </Svg>
)

// 12px: the tick in 'Requested'.
export const IconCheck = ({ className }: IconProps) => (
  <Svg size={12} stroke={1.6} className={className}>
    <path d="M2.4 6.3 4.9 8.7 9.6 3.6" />
  </Svg>
)

// 18px: the filled tick on the selected option. The disc takes currentColor;
// the tick's colour is set by the page CSS on .jr-tick.
export const IconCheckCircle = ({ className }: IconProps) => (
  <Svg size={18} stroke={1.8} className={className}>
    <circle cx="9" cy="9" r="9" fill="currentColor" stroke="none" />
    <path className="jr-tick" d="M5.4 9.2 7.8 11.5 12.6 6.6" />
  </Svg>
)

// 12px arrows for buttons and links, and the escalate option.
export const IconArrowRight = ({ className }: IconProps) => (
  <Svg size={12} stroke={1.5} className={className}>
    <path d="M1.75 6h8.5M6.75 2.5 10.25 6l-3.5 3.5" />
  </Svg>
)

export const IconArrowLeft = ({ className }: IconProps) => (
  <Svg size={12} stroke={1.5} className={className}>
    <path d="M10.25 6h-8.5M5.25 2.5 1.75 6l3.5 3.5" />
  </Svg>
)

// The arrow inside a button or link, wrapped so the shared hover motion can slide it.
export const NextArrow = () => (
  <span className="btn__arrow" aria-hidden="true">
    <IconArrowRight />
  </span>
)

export const BackArrow = () => (
  <span className="btn__arrow" data-dir="back" aria-hidden="true">
    <IconArrowLeft />
  </span>
)

export const IconArrowUp = ({ className }: IconProps) => (
  <Svg size={12} stroke={1.2} className={className}>
    <path d="M6 10.75v-9.5M2.25 5 6 1.25 9.75 5" />
  </Svg>
)

// 12px: 'My own or conditional plan' on Decide, drawn like the escalate arrow.
export const IconPen = ({ className }: IconProps) => (
  <Svg size={12} stroke={1.2} className={className}>
    <path d="M8.25 1.75 10.25 3.75 4 10 1.5 10.5 2 8z" />
  </Svg>
)
