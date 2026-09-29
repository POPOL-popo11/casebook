import './Loading.css'

// What shows while a screen's code or the cases load. It fills the space the screen will take
// (the whole page, or the canvas beside the sidebar) and stays blank on a fast load: the word
// fades in only if loading takes longer than a moment.
export function Loading({ page = false }: { page?: boolean }) {
  return (
    <div className={page ? 'loading loading--page' : 'loading'} role="status">
      <span className="loading__text">Loading…</span>
    </div>
  )
}
