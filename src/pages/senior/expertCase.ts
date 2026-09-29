import type { CaseId } from '../../contracts/types'
import { FEATURED_CASE_ID, isPlayable } from '../../lib/content'
import { setStore, useStore } from '../../lib/records'
import { navigate } from '../../lib/router'

// The case Create a Case shows: the one My Cases opened (ui.expertCaseId), else the featured
// case. Only a published (playable) case has the content Share and Breakdown show.
export function useExpertCaseId(): CaseId {
  const opened = useStore((store) => store.ui.expertCaseId)
  return opened && isPlayable(opened) ? opened : FEATURED_CASE_ID
}

// 'Open' on My Cases: remember the case, then show it on Create a Case.
export function openExpertCase(caseId: CaseId): void {
  setStore((draft) => {
    draft.ui.expertCaseId = caseId
  })
  navigate('seniorShare')
}
