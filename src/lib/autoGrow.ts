// Sentence boxes grow with their text through CSS `field-sizing: content`. Browsers without it
// (Safari and Firefox today) keep a textarea at its smallest height, so long text would scroll
// inside a small box. This fallback sizes every textarea in script instead, and only in those
// browsers: where field-sizing works it installs nothing.
//
// A textarea that sizes itself is left alone: one marked `data-own-height`, or one that already
// has an inline height this fallback did not set (grow/AutoTextarea sets it in a layout effect,
// before the observer below first sees the box).

const sized = new WeakSet<HTMLTextAreaElement>()

function isOurs(el: HTMLTextAreaElement): boolean {
  if (sized.has(el)) return true
  return !el.hasAttribute('data-own-height') && !el.style.height
}

// Height = the text's full height. The CSS min-height still applies, so a short answer keeps
// its designed size. A box that is not rendered (display: none) has no height to measure yet.
export function fitTextarea(el: HTMLTextAreaElement): void {
  if (!isOurs(el) || el.getClientRects().length === 0) return
  const style = getComputedStyle(el)
  const px = (v: string) => parseFloat(v) || 0
  const extra =
    style.boxSizing === 'border-box'
      ? px(style.borderTopWidth) + px(style.borderBottomWidth)
      : -(px(style.paddingTop) + px(style.paddingBottom))
  // Collapsing the box for a moment can shorten the page; keep the reader where they were.
  const { scrollX, scrollY } = window
  // No scrollbar while measuring: a classic one narrows the text and adds a wrapped line.
  const overflow = el.style.overflow
  sized.add(el)
  el.style.overflow = 'hidden'
  // Measured from zero, not 'auto': like field-sizing, the CSS min-height is the floor, not rows.
  el.style.height = '0px'
  el.style.height = `${el.scrollHeight + extra}px`
  el.style.overflow = overflow
  if (window.scrollY !== scrollY) window.scrollTo(scrollX, scrollY)
}

function fitAll(root: ParentNode): void {
  root.querySelectorAll('textarea').forEach(fitTextarea)
}

export function installAutoGrowFallback(): void {
  if (typeof CSS === 'undefined' || CSS.supports('field-sizing', 'content')) return

  // Typing into any box, including uncontrolled ones.
  document.addEventListener('input', (e) => {
    if (e.target instanceof HTMLTextAreaElement) fitTextarea(e.target)
  })

  // New boxes, and boxes whose text React changed (a controlled textarea's value is mirrored
  // into its text content, which the observer sees).
  new MutationObserver((records) => {
    const boxes = new Set<HTMLTextAreaElement>()
    for (const r of records) {
      const target = r.target instanceof HTMLTextAreaElement ? r.target : r.target.parentNode
      if (target instanceof HTMLTextAreaElement) boxes.add(target)
      r.addedNodes.forEach((n) => {
        if (n instanceof HTMLTextAreaElement) boxes.add(n)
        else if (n instanceof Element) n.querySelectorAll('textarea').forEach((t) => boxes.add(t))
      })
    }
    boxes.forEach(fitTextarea)
  }).observe(document.body, { childList: true, characterData: true, subtree: true })

  // A narrower window, or the web font arriving, wraps the text onto more or fewer lines.
  let frame = 0
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => fitAll(document))
  })
  void document.fonts?.ready.then(() => fitAll(document))

  fitAll(document)
}
