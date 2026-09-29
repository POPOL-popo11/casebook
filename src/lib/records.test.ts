import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SEED_VERSION, STORE_KEY, type PracticeAttempt, type Store } from '../contracts/records'

const seedFiles = import.meta.glob<{ SEED_STORE: Store }>('../data/seed.ts', { eager: true })
const SEED = Object.values(seedFiles)[0]?.SEED_STORE
const LISTS = ['attempts', 'rooms', 'workReviews', 'growth', 'shares', 'feedback', 'selfReviews'] as const

function memoryStorage(saved?: unknown): Storage {
  const data = new Map<string, string>(
    saved === undefined ? [] : [[STORE_KEY, typeof saved === 'string' ? saved : JSON.stringify(saved)]],
  )
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  }
}

// A fresh copy of the module, reading the given storage (or none) and window when it first loads.
async function freshStore(storage?: Storage, hash?: string) {
  vi.resetModules()
  if (storage) vi.stubGlobal('localStorage', storage)
  if (hash !== undefined) vi.stubGlobal('window', { location: { hash }, addEventListener: () => {} })
  return import('./records')
}

const expectSeedLists = (store: Store) => {
  for (const list of LISTS) expect(store[list]).toEqual(SEED?.[list] ?? [])
}

const attempt = (id: string) => ({ id, caseId: 'japan-launch', learnerId: 'alex' }) as PracticeAttempt
const saved = (seedVersion: unknown) => ({ version: 1, seedVersion, attempts: [attempt('att-saved')], ui: { viewMode: {} } })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('record store', () => {
  it('starts from the seed (or empty) when nothing is saved, at the current seed version', async () => {
    const { getStore } = await freshStore(memoryStorage())
    expect(getStore()).toMatchObject({ version: 1, seedVersion: SEED_VERSION })
    expect(getStore().ui).toMatchObject({ activeAttempt: {}, activeRoom: {} })
    expectSeedLists(getStore())
  })

  it('setStore changes a copy, then saves it', async () => {
    const storage = memoryStorage()
    const { getStore, setStore } = await freshStore(storage)
    const before = getStore()
    const count = before.attempts.length
    setStore((draft) => {
      draft.attempts.push(attempt('att-test'))
    })
    expect(before.attempts).toHaveLength(count)
    expect(getStore()).not.toBe(before)
    expect(getStore().attempts.at(-1)?.id).toBe('att-test')
    const written = JSON.parse(storage.getItem(STORE_KEY) ?? '{}')
    expect(written.attempts.at(-1).id).toBe('att-test')
    expect(written.seedVersion).toBe(SEED_VERSION)
  })

  it('loads a saved copy of the current seed version, filling in missing lists and ui maps', async () => {
    const loaded = (await freshStore(memoryStorage(saved(SEED_VERSION)))).getStore()
    expect(loaded.attempts.map((a) => a.id)).toEqual(['att-saved'])
    expect(loaded.rooms).toEqual([])
    expect(loaded.ui).toEqual({ viewMode: {}, activeAttempt: {}, activeRoom: {} })
  })

  it('replaces a saved copy by the seed when it is from another seed version, unreadable or another version', async () => {
    for (const value of [saved(SEED_VERSION + 1), saved(undefined), '{not json', { ...saved(SEED_VERSION), version: 2 }]) {
      expectSeedLists((await freshStore(memoryStorage(value))).getStore())
    }
  })

  it('resetDemo puts back the seed, removes the saved copy and goes to the role’s home', async () => {
    const storage = memoryStorage()
    const { getStore, resetDemo, setStore } = await freshStore(storage, '#/manager/review/att-gone')
    setStore((draft) => {
      draft.attempts.push(attempt('att-gone'))
      draft.ui.activeAttempt['japan-launch'] = 'att-gone'
    })
    resetDemo()
    expect(storage.getItem(STORE_KEY)).toBeNull()
    expectSeedLists(getStore())
    expect(getStore().ui.activeAttempt['japan-launch']).toBeUndefined()
    expect(window.location.hash).toBe('#/manager')
  })

  it('resetDemo stays on the landing page, which belongs to no role', async () => {
    const { resetDemo } = await freshStore(memoryStorage(), '#/')
    resetDemo()
    expect(window.location.hash).toBe('#/')
  })

  it('keeps working in memory without localStorage', async () => {
    const { getStore, setStore } = await freshStore()
    setStore((draft) => {
      draft.feedback = []
    })
    expect(getStore().feedback).toEqual([])
  })

  it('newId gives unique ids with the prefix', async () => {
    const { newId } = await freshStore()
    const ids = Array.from({ length: 2000 }, () => newId('att'))
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^att-[a-z0-9]+$/)
  })

  it('useStore renders a selection, even one that builds a new array each time', async () => {
    const { useStore } = await freshStore(memoryStorage())
    const Count = () => createElement('p', null, useStore((s) => s.attempts.filter(Boolean)).length)
    expect(renderToString(createElement(Count))).toBe(`<p>${SEED?.attempts.length ?? 0}</p>`)
  })
})
