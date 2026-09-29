import type { Role } from '../contracts/types'
import type { FixedRoute } from './router'

// Where each role starts: the sidebar's role switcher and 'Reset demo data' go here.
export const ROLE_HOME: Record<Role, FixedRoute> = {
  senior: 'seniorCases',
  junior: 'juniorHome',
  manager: 'managerReviews',
}

// The role whose pages a hash belongs to; the landing page and Sign in belong to none.
export function roleOfHash(hash: string): Role | null {
  for (const [role, prefix] of [
    ['senior', '#/senior'],
    ['junior', '#/junior'],
    ['manager', '#/manager'],
  ] as const) {
    if (hash === prefix || hash.startsWith(`${prefix}/`)) return role
  }
  return null
}
