// toast(message) shows a short status message at the bottom centre for 3 seconds.
// Any page can call it; <Toaster /> (mounted once in App) renders it.

type Listener = (message: string) => void

const listeners = new Set<Listener>()

export function toast(message: string): void {
  listeners.forEach((listener) => listener(message))
}

export function subscribeToToasts(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
