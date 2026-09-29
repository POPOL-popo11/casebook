import { afterEach, describe, expect, it, vi } from 'vitest'
import { fitTextarea, installAutoGrowFallback } from './autoGrow'

// Vitest runs in node, so the textarea and browser globals are small fakes.
const box = (opts: { height?: string; own?: boolean; hidden?: boolean; scrollHeight?: number } = {}) =>
  ({
    style: { height: opts.height ?? '', overflow: '' },
    scrollHeight: opts.scrollHeight ?? 120,
    hasAttribute: (name: string) => name === 'data-own-height' && !!opts.own,
    getClientRects: () => (opts.hidden ? [] : [{}]),
  }) as unknown as HTMLTextAreaElement

const stubBrowser = (supportsFieldSizing: boolean) => {
  vi.stubGlobal('CSS', { supports: () => supportsFieldSizing })
  vi.stubGlobal('window', { scrollX: 0, scrollY: 0, scrollTo: vi.fn(), addEventListener: vi.fn() })
  vi.stubGlobal('getComputedStyle', () => ({
    boxSizing: 'border-box',
    borderTopWidth: '1px',
    borderBottomWidth: '1px',
    paddingTop: '11px',
    paddingBottom: '11px',
  }))
  const doc = { addEventListener: vi.fn(), querySelectorAll: () => [], body: {} }
  vi.stubGlobal('document', doc)
  vi.stubGlobal('MutationObserver', class { observe = vi.fn() })
  return doc
}

afterEach(() => vi.unstubAllGlobals())

describe('textarea auto-grow fallback', () => {
  it('installs nothing where CSS field-sizing works (Chromium)', () => {
    const doc = stubBrowser(true)
    installAutoGrowFallback()
    expect(doc.addEventListener).not.toHaveBeenCalled()
  })

  it('listens for typing where field-sizing is missing (Safari, Firefox)', () => {
    const doc = stubBrowser(false)
    installAutoGrowFallback()
    expect(doc.addEventListener).toHaveBeenCalledWith('input', expect.any(Function))
  })

  it('sizes a box to its full text height, borders included', () => {
    stubBrowser(false)
    const el = box({ scrollHeight: 160 })
    fitTextarea(el)
    expect(el.style.height).toBe('162px')
  })

  it('keeps sizing a box it sized before', () => {
    stubBrowser(false)
    const el = box({ scrollHeight: 100 })
    fitTextarea(el)
    Object.assign(el, { scrollHeight: 200 })
    fitTextarea(el)
    expect(el.style.height).toBe('202px')
  })

  it('leaves alone a box that sizes itself (AutoTextarea) or is marked data-own-height', () => {
    stubBrowser(false)
    const auto = box({ height: '90px' })
    const marked = box({ own: true })
    fitTextarea(auto)
    fitTextarea(marked)
    expect(auto.style.height).toBe('90px')
    expect(marked.style.height).toBe('')
  })

  it('waits until a hidden box is rendered', () => {
    stubBrowser(false)
    const el = box({ hidden: true })
    fitTextarea(el)
    expect(el.style.height).toBe('')
  })
})
