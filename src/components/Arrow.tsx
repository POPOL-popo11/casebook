import { IconArrowLeft, IconArrowRight } from './icons'

// The → or ← inside a button or link. .btn__arrow slides it out and back in on hover;
// data-dir="back" mirrors the motion for ←.
export function Arrow({ back = false }: { back?: boolean }) {
  return (
    <span className="btn__arrow" aria-hidden="true" data-dir={back ? 'back' : undefined}>
      {back ? <IconArrowLeft /> : <IconArrowRight />}
    </span>
  )
}
