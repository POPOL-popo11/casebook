// The style contract. Names only: the designer sets every value in
// src/styles/tokens.css, the single source of truth. CSS outside src/styles may
// use these names but never raw colours or font stacks.
// contracts.test.ts checks tokens.css defines every name and primitives.css
// defines every class.

export const TOKENS = [
  // Colour: light app
  '--color-canvas', // page background
  '--color-surface', // cards
  '--color-field', // inputs and textareas
  '--color-sunken', // board columns, segmented-control track, empty bars
  '--color-chip', // filled chips such as '8-week deadline'
  '--color-border', // card and input borders
  '--color-border-strong', // dashed chips, dividers that need to show
  '--color-text', // primary text
  '--color-text-2', // secondary text
  '--color-text-3', // muted text, still 4.5:1 on --color-canvas
  '--color-accent', // the blue: primary buttons, progress, links, selected states
  '--color-accent-hover',
  '--color-accent-soft', // pale blue fills: selected option, Confirmed badge, blue callout
  '--color-on-accent', // text on --color-accent
  '--color-warn', // orange: Focus, weak evidence
  '--color-warn-soft', // peach fills: Review badge, On request badge, warn callout
  '--color-warn-ink', // dark orange text on --color-warn-soft
  '--color-neutral', // grey dot for Assumption
  '--color-lead', // v3: teal for Team Lead feedback, Published, Agrees, Saved
  '--color-lead-soft', // v3: pale teal fills behind --color-lead-ink
  '--color-lead-ink', // v3: dark teal text on --color-lead-soft
  // Colour: dark surfaces (sidebar, dark cards, dark CTA band)
  '--color-dark',
  '--color-dark-raised', // active nav row
  '--color-dark-track', // role-switcher track
  '--color-on-dark', // text on dark
  '--color-on-dark-2', // secondary text on dark
  '--color-focus', // focus ring
  '--shadow-card',
  '--shadow-raised', // floating cards on the landing page, active segmented item
  // Type
  '--font-serif', // headlines and card titles
  '--font-sans', // interface text
  '--font-mono', // eyebrows such as 'SOLUTIONS · FROM DANA K.'
  '--text-xs', // 12px
  '--text-sm', // 13px
  '--text-md', // 14px
  '--text-base', // 15px
  '--text-lg', // 17px
  '--title-sm', // card titles
  '--title-md', // section titles such as 'Sort what you know'
  '--title-lg', // page titles such as 'Share a case'
  '--title-xl', // landing headline
  '--tracking-eyebrow',
  // Space, 4px base
  '--space-1', // 4px
  '--space-2', // 8px
  '--space-3', // 12px
  '--space-4', // 16px
  '--space-5', // 20px
  '--space-6', // 24px
  '--space-7', // 32px
  '--space-8', // 40px
  '--space-9', // 48px
  '--space-10', // 64px
  // Shape and size
  '--radius-sm', // inputs, buttons
  '--radius-md', // small cards, options
  '--radius-lg', // cards
  '--radius-xl', // landing panels and the CTA band
  '--radius-pill',
  '--sidebar-width',
  '--size-control', // 44px minimum hit area
  // Motion (the SpaceX-style values are in the motion addendum)
  '--ease-out', // small UI feedback
  '--duration-fast', // small UI feedback, about 160ms
  '--ease-expo', // cubic-bezier(0.19, 1, 0.22, 1), SpaceX's hover and reveal curve
  '--ease-standard', // cubic-bezier(0.25, 0.8, 0.25, 1), SpaceX's overlay fade
  '--duration-hover', // 0.5s button fill
  '--duration-reveal', // 1s text rise
  '--duration-step', // step-to-step slide
  '--duration-fill', // progress, meter and skill bar fills
  '--duration-toast',
  '--reveal-distance-title',
  '--reveal-distance-body',
  '--reveal-distance-button', // travels furthest, as on SpaceX
  '--reveal-stagger', // delay between title, body and button
  // Added by the designer from measuring the design (see the designer report, section 5)
  '--color-text-4',
  '--color-hairline',
  '--color-border-control',
  '--color-border-input',
  '--color-border-dashed',
  '--color-track', // step bars, meter
  '--color-track-soft', // skill segments
  '--color-panel',
  '--color-warn-deep',
  '--color-on-dark-3',
  '--color-on-dark-body',
  '--color-dark-border',
  '--color-scrim', // overnight: backdrop behind the phone menu
  '--color-dark-outline',
  '--color-dark-avatar',
  '--color-accent-line',
  '--color-focus-on-dark',
  '--color-dot', // landing dot grid
  '--shadow-item',
  '--shadow-primary',
  '--shadow-primary-lg',
  '--icon-chevron',
  '--text-xl',
  '--text-eyebrow',
  '--text-eyebrow-sm',
  '--tracking-eyebrow-sm',
  '--title-case',
  '--title-role',
  '--title-h2',
  '--title-move',
  '--radius-sm-plus',
  '--radius-card-xl',
] as const

// Shared classes the designer implements in src/styles/primitives.css.
// State lives in attributes, never extra classes:
// aria-pressed="true" (chip, option, segmented__item), aria-current="page" (navitem),
// data-state="done|current|todo" (steps__item), data-on="true" (skillbar__seg),
// data-tone="warn" (skillbar).
export const PRIMITIVE_CLASSES = [
  'btn', // 44px, radius-sm, 600 weight; :disabled dimmed
  'btn--primary', // blue fill, white text ('Next →', 'Submit')
  'btn--secondary', // white fill, border ('← Back', 'Share a case')
  'btn--dark', // dark fill ('Get started')
  'btn--light', // canvas-coloured fill on dark ('Start case →')
  'btn--link', // text-only blue link button ('Review', '+ Add', 'Decide now →')
  'btn--pill', // fully rounded (landing buttons)
  'btn--block', // full width
  'card', // white, border, radius-lg, shadow-card
  'card--dark', // dark fill, light text
  'card--dashed', // dashed border, no fill (unsorted tray, 'Escalate to a senior')
  'eyebrow', // mono, uppercase, tracked, small
  'title', // serif
  'title--xl',
  'title--lg',
  'title--md',
  'title--sm',
  'subtitle', // sans secondary line under a page title
  'field', // label + control stack
  'field__label', // bold small label ('Goal', 'Why')
  'input',
  'textarea',
  'select',
  'chip', // pill, filled with --color-chip
  'chip--dashed', // dashed outline ('Budget?')
  'chip--outline', // white with border ('Refund history' under Missing, 'Based on' chips)
  'chip--add', // small dashed circle with '+'
  'badge', // small rounded status label
  'badge--accent', // 'Confirmed', 'Aligned', 'Requested'
  'badge--warn', // 'Review', 'Differs', 'On request'
  'badge--neutral', // 'At start'
  'badge--lead', // v3: teal, Team Lead feedback ('Manager feedback', 'Sent')
  'segmented', // track with items ('Low / Medium / High')
  'segmented__item',
  'segmented--dark', // the sidebar role switcher
  'option', // decision option row: letter, label, trade-off; aria-pressed="true" = blue border + soft fill
  'option__letter',
  'steps', // four-part progress ('1 · Define' …)
  'steps__item',
  'meter', // 'Time used' bar
  'meter__fill',
  'skillbar', // five-segment skill bar
  'skillbar__seg',
  'avatar', // initials circle
  'avatar--dark',
  'avatar--accent',
  'navitem', // sidebar row with icon
  'count', // small pill count in the sidebar ('1', '3')
  'dot', // 8px legend dot
  'dot--accent',
  'dot--ring', // hollow blue ring ('Needs checking')
  'dot--neutral',
  'dot--warn',
  'dot--lead', // v3: teal legend dot for Manager feedback
  'callout', // pale blue box with an icon
  'callout--warn', // peach box
  'link', // inline blue text link
  'icon', // inline SVG sized to 1em, stroke currentColor
  'visually-hidden',
  // Motion (see the motion addendum)
  'btn__arrow', // arrow inside a button: slides out and back in on hover; data-dir="back" for ←
  'reveal', // hidden until data-revealed="true", then rises and fades in
  'reveal--title',
  'reveal--body',
  'reveal--button',
  'enter-next', // step content arriving from the right
  'enter-back', // step content arriving from the left
  // Added by the designer from measuring the design
  'btn--outline-dark', // outline pill on the dark CTA band
  'btn--sm', // Yes, No, Edit, Request
  'eyebrow--sm',
  'eyebrow--on-dark',
] as const
