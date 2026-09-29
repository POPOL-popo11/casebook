import type { ReactNode } from 'react'
import './Page.css'

type PageProps = {
  title: ReactNode
  subtitle?: ReactNode
  // Right-aligned content in the header row, e.g. 'Draft saved' or 'Full answers →'.
  aside?: ReactNode
  // The action row at the bottom of the canvas, e.g. '← Back' and 'Publish case'.
  actions?: ReactNode
  className?: string
  children?: ReactNode
}

// The frame for a screen inside the shell: page title, content, and an action row pinned to the bottom.
// The title and subtitle rise in on mount (the designer's .reveal classes).
export function Page({ title, subtitle, aside, actions, className, children }: PageProps) {
  return (
    <div className={className ? `page ${className}` : 'page'}>
      <header className="page__header">
        <div className="page__heading">
          <h1 className="title title--lg page__title reveal reveal--title" data-revealed="true">
            {title}
          </h1>
          {subtitle && (
            <p className="subtitle page__subtitle reveal reveal--body" data-revealed="true">
              {subtitle}
            </p>
          )}
        </div>
        {aside && <div className="page__aside">{aside}</div>}
      </header>
      {children}
      {actions && <div className="page__actions">{actions}</div>}
    </div>
  )
}
