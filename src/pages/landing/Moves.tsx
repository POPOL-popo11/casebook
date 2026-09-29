import { revealDelay, useReveal } from '../../lib/useReveal'

const MOVES = [
  { number: '01', title: 'Define', question: "What's the real goal?" },
  { number: '02', title: 'Examine', question: 'What can I trust?' },
  { number: '03', title: 'Investigate', question: "What's worth finding out?" },
  { number: '04', title: 'Decide', question: 'What would change my mind?' },
]

// 01 · "The four moves of good judgement"; the first move carries the accent.
export function Moves() {
  const [ref, revealed] = useReveal<HTMLElement>()

  return (
    <section ref={ref} id="the-four-moves" className="lp-moves" aria-labelledby="lp-moves-title">
      <h2 id="lp-moves-title" className="eyebrow lp-moves__label reveal reveal--body" data-revealed={revealed}>
        The four moves of good judgement
      </h2>
      <ol className="lp-moves__list">
        {MOVES.map((move, index) => (
          <li
            key={move.number}
            className="lp-move reveal reveal--body"
            data-accent={index === 0 || undefined}
            data-revealed={revealed}
            style={revealDelay(index + 1)}
          >
            <span className="lp-move__number">{move.number}</span>
            <h3 className="title lp-move__title">{move.title}</h3>
            <p className="lp-move__question">{move.question}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
