import { useRef, useSyncExternalStore } from 'react'
import { SEED_VERSION, STORE_KEY, type Store } from '../contracts/records'
import { ROUTES } from '../contracts/types'
import { ROLE_HOME, roleOfHash } from './roles'

// The shared record store (contracts/records.ts): everything people do in Casebook, kept in this
// browser's localStorage. There is no server and there are no accounts: this is a local demo.
// Treat what useStore() and getStore() return as read-only; change records only through setStore().

const LISTS = ['attempts', 'rooms', 'workReviews', 'growth', 'shares', 'feedback', 'selfReviews'] as const

const EMPTY_STORE: Store = {
  version: 1,
  seedVersion: SEED_VERSION,
  attempts: [],
  rooms: [],
  workReviews: [],
  growth: [],
  shares: [],
  feedback: [],
  selfReviews: [],
  ui: { viewMode: {}, activeAttempt: {}, activeRoom: {} },
}

// A stored or seeded value with a missing list or ui map still loads; any other version doesn't.
function normalize(value: unknown): Store | null {
  if (typeof value !== 'object' || value === null || (value as Partial<Store>).version !== 1) return null
  const v = value as Partial<Store>
  const store: Store = { ...structuredClone(EMPTY_STORE), ...v, version: 1 }
  for (const list of LISTS) if (!Array.isArray(store[list])) store[list] = []
  store.ui = {
    ...v.ui,
    viewMode: { ...v.ui?.viewMode },
    activeAttempt: { ...v.ui?.activeAttempt },
    activeRoom: { ...v.ui?.activeRoom },
  }
  return store
}

// The demo records from src/data/seed.ts; until content adds that file, the store starts empty.
// The seed is always the current seed, whatever seedVersion the file itself says.
const seedFiles = import.meta.glob<{ SEED_STORE: Store }>('../data/seed.ts', { eager: true })
const SEED_STORE: Store = {
  ...(normalize(Object.values(seedFiles)[0]?.SEED_STORE) ?? EMPTY_STORE),
  seedVersion: SEED_VERSION,
}

const seed = (): Store => structuredClone(SEED_STORE)

// Whether a growth record came with the demo. A shared copy keeps only the record's id, so the
// pages that show copies label them from the seed, never by reading the learner's live records.
const SEEDED_GROWTH = new Set(SEED_STORE.growth.map((record) => record.id))
export const isSeededGrowth = (recordId: string): boolean => SEEDED_GROWTH.has(recordId)

// localStorage can be missing (tests), blocked or full; the store then lives in memory only.
function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

// A saved copy from another seed version may point at ids that no longer exist: the seed replaces it.
function load(): Store {
  try {
    const saved = storage()?.getItem(STORE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<Store> | null
      const store = parsed?.seedVersion === SEED_VERSION ? normalize(parsed) : null
      if (store) return store
    }
  } catch {
    // Unreadable: start again from the seed.
  }
  return seed()
}

function save(next: Store): void {
  try {
    storage()?.setItem(STORE_KEY, JSON.stringify(next))
  } catch {
    // Blocked or full: the change still holds for this visit.
  }
}

let store: Store | null = null
const listeners = new Set<() => void>()

function current(): Store {
  store ??= load()
  return store
}

function commit(next: Store): void {
  store = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// Another tab changed or reset the store: follow it.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORE_KEY || event.key === null) commit(load())
  })
}

// Same keys and the same values (Object.is): a new array or object holding the same records.
function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  const ra = a as Record<string, unknown>
  const rb = b as Record<string, unknown>
  return keysA.every((key) => Object.hasOwn(rb, key) && Object.is(ra[key], rb[key]))
}

// Re-renders when the selection changes. The selector may build a new array or object each time:
// the result is cached per store and selector, and a shallow-equal result keeps the old reference.
export function useStore<T>(select: (store: Store) => T): T {
  const memo = useRef<{ store: Store; select: (store: Store) => T; value: T } | null>(null)
  const getSnapshot = (): T => {
    const now = current()
    const last = memo.current
    if (last && last.store === now && last.select === select) return last.value
    const next = select(now)
    const value = last && shallowEqual(last.value, next) ? last.value : next
    memo.current = { store: now, select, value }
    return value
  }
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function getStore(): Store {
  return current()
}

// The recipe changes a deep copy; the copy then replaces the store, is saved and is announced.
export function setStore(recipe: (draft: Store) => void): void {
  const draft = structuredClone(current())
  recipe(draft)
  save(draft)
  commit(draft)
}

// Back to the seed, then to the current role's home page (the landing page and Sign in stay).
// The saved copy is removed, so a later visit also starts from the latest seed.
export function resetDemo(): void {
  try {
    storage()?.removeItem(STORE_KEY)
  } catch {
    // Blocked: the reset still holds for this visit.
  }
  commit(seed())
  const role = typeof window === 'undefined' ? null : roleOfHash(window.location.hash)
  if (role) window.location.hash = ROUTES[ROLE_HOME[role]]
}

// 'att' → 'att-mg5x1a2bq7': a time in base 36 that only goes up in this tab, so ids made here
// never repeat, and two random characters for ids made in another tab at the same moment.
let lastTime = 0
export function newId(prefix: string): string {
  lastTime = Math.max(Date.now(), lastTime + 1)
  const random = Math.floor(Math.random() * 1296).toString(36).padStart(2, '0')
  return `${prefix}-${lastTime.toString(36)}${random}`
}
