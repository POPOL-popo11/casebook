/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest'
import { PRIMITIVE_CLASSES, TOKENS } from './tokens'

const cssFiles = import.meta.glob('/src/**/*.css', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')
const definedIn = (css: string) => new Set([...stripComments(css).matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]))

describe('style contract', () => {
  const tokensCss = cssFiles['/src/styles/tokens.css'] ?? ''
  const tokens = definedIn(tokensCss)

  it('tokens.css defines every token in tokens.ts', () => {
    expect(TOKENS.filter((t) => !tokens.has(t))).toEqual([])
  })

  it('primitives.css defines every class in tokens.ts', () => {
    const primitives = stripComments(cssFiles['/src/styles/primitives.css'] ?? '')
    const missing = PRIMITIVE_CLASSES.filter((c) => !new RegExp(`\\.${c}(?![a-z0-9_-])`).test(primitives))
    expect(missing).toEqual([])
  })

  it('CSS outside src/styles takes every colour and font from a token', () => {
    const problems: string[] = []
    for (const [path, raw] of Object.entries(cssFiles)) {
      if (path.startsWith('/src/styles/')) continue
      const css = stripComments(raw)
      if (/#[0-9a-fA-F]{3,8}\b/.test(css)) problems.push(`${path}: raw hex colour`)
      if (/\b(?:rgba?|hsla?|oklch|lab|lch)\(/.test(css)) problems.push(`${path}: raw colour function`)
      for (const m of css.matchAll(/font-family\s*:\s*([^;}]+)/g)) {
        const value = m[1].trim()
        if (!value.startsWith('var(--font-') && value !== 'inherit') problems.push(`${path}: font-family must use a --font token`)
      }
    }
    expect(problems).toEqual([])
  })

  it('every var() refers to a token or a property defined in the same file', () => {
    const problems: string[] = []
    for (const [path, raw] of Object.entries(cssFiles)) {
      const local = definedIn(raw)
      for (const m of stripComments(raw).matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
        if (!tokens.has(m[1]) && !local.has(m[1])) problems.push(`${path}: ${m[1]} is not defined`)
      }
    }
    expect(problems).toEqual([])
  })
})
