import type { CaseContent, CaseId } from '../../contracts/types'
import { CASE as dealPromise } from './deal-promise'
import { CASE as fasterOnboarding } from './faster-onboarding'
import { CASE as fridayRelease } from './friday-release'
import { CASE as japanLaunch } from './japan-launch'
import { CASE as missing48000 } from './missing-48000'
import { CASE as urgentOnboarding } from './urgent-onboarding'

// Every playable case, by id. Each also needs a CaseSummary with playable: true in library.ts.
export const CASES: Record<CaseId, CaseContent> = {
  [japanLaunch.id]: japanLaunch,
  [fridayRelease.id]: fridayRelease,
  [urgentOnboarding.id]: urgentOnboarding,
  [missing48000.id]: missing48000,
  [fasterOnboarding.id]: fasterOnboarding,
  [dealPromise.id]: dealPromise,
}
