import { useEffect, useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react'

// A textarea that grows with its text, so a prefilled answer is never cut off. `rows` stays the
// smallest height. It sizes itself in script, so it also grows where field-sizing is unsupported.
export function AutoTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const fit = () => {
    const el = ref.current
    if (!el) return
    const style = getComputedStyle(el)
    const borders = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + (style.boxSizing === 'border-box' ? borders : 0)}px`
  }

  useLayoutEffect(fit, [props.value])

  // A narrower window, or the web font arriving, wraps the text onto more or fewer lines.
  useEffect(() => {
    void document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return <textarea ref={ref} {...props} />
}
