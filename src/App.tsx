import { lazy, Suspense, useEffect, type ComponentType } from 'react'
import type { Role, RouteKey } from './contracts/types'
import { Loading } from './components/Loading'
import { usePageChange } from './components/pageChange'
import { Shell } from './components/Shell'
import { Toaster } from './components/Toaster'
import { loadCases } from './lib/catalog'
import { roleOfHash } from './lib/roles'
import { roleOf, RouteMatchContext, useDeadUrlRedirect, useRouteMatch } from './lib/router'
import { Landing } from './pages/landing/Landing'
import { SignIn } from './pages/signin/SignIn'

// The landing page and Sign in are in the first chunk. Each role's screens are one more chunk
// (pages/screens), loaded the first time a page of that role opens.
const ROLE_SCREENS = {
  senior: () => import('./pages/screens/expert'),
  junior: () => import('./pages/screens/learner'),
  manager: () => import('./pages/screens/lead'),
} satisfies Record<Role, () => Promise<unknown>>

type RoleScreens<R extends Role> = Awaited<ReturnType<(typeof ROLE_SCREENS)[R]>>

// One screen from its role's chunk.
function screen<R extends Role>(role: R, name: keyof RoleScreens<R>): ComponentType {
  return lazy(async () => {
    const screens = (await ROLE_SCREENS[role]()) as RoleScreens<R>
    return { default: screens[name] as ComponentType }
  })
}

const expert = (name: keyof RoleScreens<'senior'>) => screen('senior', name)
const learner = (name: keyof RoleScreens<'junior'>) => screen('junior', name)
const lead = (name: keyof RoleScreens<'manager'>) => screen('manager', name)

const JuniorHome = learner('JuniorHome')

// Every route's screen. A route in REDIRECTED (lib/router.ts) never renders; it names its target.
const SCREENS: Record<RouteKey, ComponentType> = {
  landing: Landing,
  signIn: SignIn,
  // Case Expert
  seniorCases: expert('MyCases'),
  seniorShare: expert('SeniorShare'),
  seniorBreakdown: expert('SeniorBreakdown'),
  seniorSkills: expert('SkillFrameworks'),
  // Learner
  juniorHome: JuniorHome,
  juniorInProgress: JuniorHome, // redirected to the library
  juniorGrow: learner('WorkGrow'),
  juniorGrowth: learner('MyGrowth'),
  juniorFeedback: learner('LearnerFeedback'),
  juniorCase: learner('CaseDetails'),
  juniorDefine: learner('JuniorDefine'),
  juniorExamine: learner('JuniorExamine'),
  juniorInvestigate: learner('JuniorInvestigate'),
  juniorDecide: learner('JuniorDecide'),
  juniorReflect: learner('JuniorReflect'),
  juniorRoom: learner('JuniorRoom'),
  // Team Lead
  managerReviews: lead('PracticeReviews'),
  managerReview: lead('ManagerReview'),
  managerTeam: lead('SharedGrowth'),
}

// Called once from main.tsx. A deep link starts loading its role's screens and the cases at once,
// alongside the first chunk. Once the first page has fully loaded and the browser is idle, the
// rest loads in the background, so later pages open without waiting.
export function preloadScreens(): void {
  const role = roleOfHash(window.location.hash)
  if (role) void ROLE_SCREENS[role]()
  const rest = () => {
    void loadCases()
    for (const load of Object.values(ROLE_SCREENS)) void load()
  }
  const whenIdle = () => ('requestIdleCallback' in window ? requestIdleCallback(rest) : setTimeout(rest, 200))
  if (document.readyState === 'complete') whenIdle()
  else window.addEventListener('load', whenIdle, { once: true })
}

export function App() {
  return (
    <>
      {/* Every page but the landing page waits here for the cases (useRouteMatch). */}
      <Suspense fallback={<Loading page />}>
        <Screens />
      </Suspense>
      <Toaster />
    </>
  )
}

function Screens() {
  const match = useRouteMatch()
  const { route, caseId, attemptId } = match
  const role = roleOf(route)
  const Screen = SCREENS[route]
  // Another case, another step of the same case or another attempt is a new screen.
  const screenKey = [route, caseId, attemptId].filter(Boolean).join('/')

  useDeadUrlRedirect(match.redirect)

  // A new screen starts at the top. 'instant' because html has scroll-behavior: smooth.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [screenKey])

  // The tab's title names the page, and a new screen's h1 takes focus.
  usePageChange(match, screenKey)

  // Screens read their ids from here (useCaseId, useAttemptId), never from the URL themselves.
  // While a role's screens load, the sidebar stays and the canvas shows the fallback.
  return (
    <RouteMatchContext value={match}>
      {role ? (
        <Shell role={role} route={route}>
          <Suspense fallback={<Loading />}>
            <Screen key={screenKey} />
          </Suspense>
        </Shell>
      ) : (
        <Screen key={screenKey} />
      )}
    </RouteMatchContext>
  )
}
