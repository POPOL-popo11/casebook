import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// base './' keeps asset paths relative, so dist/ works on any static host.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    // Vitest swaps CSS for empty strings unless told otherwise; the style contract test
    // reads every .css file with ?raw, so it needs the real contents.
    css: { include: [/.+/] },
  },
})
