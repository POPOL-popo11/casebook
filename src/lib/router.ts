import { createContext, useContext, useEffect, useSyncExternalStore } from 'react'
import type { Store } from '../contracts/records'
import { ROUTES, type CaseId, type Role, type RouteKey } from '../contracts/types'
import { CASE_SUMMARIES, getCase, isPlayable, waitForCases } from './catalog'
import { getStore, useStore } from './records'

// A tiny hash router. A fixed route is one hash, ROUTES[route]. A pattern route carries an id:
// '#/junior/case/:caseId…' or '#/manager/review/:attemptId'. Link to those with caseHref(),
// casePageHref() and reviewHref() from contracts/types.ts. Anything else is the landing page.

// The routes whose hash has a ':param', and every other route.
export type PatternRoute = {
  [K in RouteKey]: (typeof ROUTES)[K] extends `${string}:${string}` ? K : never
}[RouteKey]
export type FixedRoute = Exclude<RouteKey, PatternRoute>

type Params = { caseId?: string; attemptId?: string }

const inLibrary = (caseId = '') => CASE_SUMMARIES.some((s) => s.id === caseId)
const playable = (caseId = '') => isPlayable(caseId)
const hasRoom = (caseId = '') => isPlayable(caseId) && getCase(caseId).room !== undefined
// Team Lead pages read only attempts and rooms that are no longer in progress (records.ts).
const isReviewable = (id = '', store: Store) =>
  [...store.attempts, ...store.rooms].some((record) => record.id === id && record.status !== 'in-progress')

// When a matched id names something that exists. Every pattern route needs a rule here.
const VALID: Record<PatternRoute, (params: Params, store: Store) => boolean> = {
  juniorCase: (p) => inLibrary(p.caseId), // details: any case in the library, Preview or playable
  juniorDefine: (p) => playable(p.caseId),
  juniorExamine: (p) => playable(p.caseId),
  juniorInvestigate: (p) => playable(p.caseId),
  juniorDecide: (p) => playable(p.caseId),
  juniorReflect: (p) => playable(p.caseId),
  juniorRoom: (p) => hasRoom(p.caseId), // only a case with a room script
  managerReview: (p, store) => isReviewable(p.attemptId, store), // a submitted attempt or room in the store
}

// A dead URL under one of these prefixes is replaced by the page its role starts from.
const DEAD_URL_TARGETS: { prefix: string; route: FixedRoute }[] = [
  { prefix: '#/junior/case/', route: 'juniorHome' },
  { prefix: '#/manager/review/', route: 'managerReviews' },
]

// Fixed routes kept for old links whose screen isn't built: they redirect like a dead URL.
export const REDIRECTED: Partial<Record<FixedRoute, FixedRoute>> = {
  juniorInProgress: 'juniorHome',
}

const ROUTE_KEYS = Object.keys(ROUTES) as RouteKey[]
const isPatternRoute = (route: RouteKey): route is PatternRoute => ROUTES[route].includes('/:')
const FIXED = new Map<string, RouteKey>(ROUTE_KEYS.filter((r) => !isPatternRoute(r)).map((r) => [ROUTES[r], r]))
const PATTERNS = ROUTE_KEYS.filter(isPatternRoute).map((route) => ({ route, parts: ROUTES[route].split('/') }))

// redirect: where a dead URL is sent; the route is already the page at that address.
export type RouteMatch = { route: RouteKey; caseId: CaseId | null; attemptId: string | null; redirect: string | null }

const page = (route: RouteKey, params: Params = {}, redirect: string | null = null): RouteMatch => ({
  route,
  caseId: params.caseId ?? null,
  attemptId: params.attemptId ?? null,
  redirect,
})

export function matchHash(hash: string, store: Store = getStore()): RouteMatch {
  const fixed = FIXED.get(hash)
  if (fixed) {
    const target = REDIRECTED[fixed as FixedRoute]
    return target ? page(target, {}, ROUTES[target]) : page(fixed)
  }
  const parts = hash.split('/')
  for (const { route, parts: pattern } of PATTERNS) {
    if (pattern.length !== parts.length) continue
    const params: Params = {}
    const fits = pattern.every((segment, i) => {
      if (!segment.startsWith(':')) return segment === parts[i]
      params[segment.slice(1) as keyof Params] = parts[i]
      return parts[i] !== ''
    })
    if (fits && VALID[route](params, store)) return page(route, params)
  }
  const dead = DEAD_URL_TARGETS.find((target) => hash.startsWith(target.prefix))
  return dead ? page(dead.route, {}, ROUTES[dead.route]) : page('landing')
}

export function routeFromHash(hash: string): RouteKey {
  return matchHash(hash).route
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function useHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash)
}

// App is the only component that follows the URL. A page that subscribed as well could hear a
// hash change before App and render once more on a route that is no longer its own.
// It follows the store too: after 'Reset demo data' a reviewed attempt may no longer exist.
// Every page but the landing page reads the cases (the case checks above, Sign in, the sidebar),
// so App suspends until they have loaded; the landing page renders without them.
export function useRouteMatch(): RouteMatch {
  const hash = useHash()
  if (hash !== '' && hash !== ROUTES.landing) waitForCases()
  return useStore((store) => matchHash(hash, store))
}

export function useRoute(): RouteKey {
  return useRouteMatch().route
}

// App provides the current match to the screen it renders.
export const RouteMatchContext = createContext<RouteMatch | null>(null)

// The case id on every case route: details, the four steps, reflect and room. App shows the
// steps, reflect and room only for a playable case, so getCase() resolves there. The details
// page also opens Preview cases: use getSummary() there, and getCase() only when isPlayable().
export function useCaseId(): CaseId {
  const caseId = useContext(RouteMatchContext)?.caseId ?? null
  if (caseId === null) throw new Error('useCaseId() is only available on a case route')
  return caseId
}

// The attempt or room id on the Team Lead's review route ('att-…' or 'room-…'). App shows the
// route only when the store holds that attempt or room, submitted.
export function useAttemptId(): string {
  const attemptId = useContext(RouteMatchContext)?.attemptId ?? null
  if (attemptId === null) throw new Error('useAttemptId() is only available on the review route')
  return attemptId
}

// Mounted once in App: a dead URL is rewritten, in place, to the page App already shows for it.
export function useDeadUrlRedirect(redirect: string | null): void {
  useEffect(() => {
    if (redirect) window.location.replace(redirect)
  }, [redirect])
}

export function navigate(route: FixedRoute): void {
  window.location.hash = ROUTES[route]
}

// The role whose sidebar a route shows; the landing page and Sign in have none.
export function roleOf(route: RouteKey): Role | null {
  if (route.startsWith('senior')) return 'senior'
  if (route.startsWith('junior')) return 'junior'
  if (route.startsWith('manager')) return 'manager'
  return null
}

// In-page links on the landing page scroll to a section without changing the route.
export function scrollToSection(id: string): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}
