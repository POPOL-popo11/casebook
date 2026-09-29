import type { ReactNode } from 'react'

type PointCardProps = {
  number: string
  title: string
  question: string
  confirmed: boolean
  children?: ReactNode
}

// 03 · one decision point: its number, title, the question the junior answers, and its status.
export function PointCard({ number, title, question, confirmed, children }: PointCardProps) {
  return (
    <li className="card bd__point">
      <span className="bd__number">{number}</span>
      <div>
        <h2 className="bd__point-title">{title}</h2>
        <p className="bd__question">{question}</p>
        {children}
      </div>
      {confirmed ? (
        <span className="badge badge--accent bd__badge">Confirmed</span>
      ) : (
        <span className="badge badge--warn bd__badge">Review</span>
      )}
    </li>
  )
}
