import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      // json-summary drives scripts/check-changed-file-coverage.mjs. In the real repo
      // that script does not exist, so the reporter feeds a gate that cannot run.
      // Here the script exists — see scripts/.
      reporter: ['text', 'json-summary'],
      thresholds: {
        lines: 20, functions: 20, branches: 20, statements: 20,
        // The testing policy ranks risk: money, then OTP, then PII. Encode the ranking
        // rather than leaving a flat 20% floor on the paths that matter most.
        'src/lib/upstreamFetch.ts': { lines: 80, functions: 80, branches: 70, statements: 80 },
        'app/api/**': { lines: 70, functions: 70, branches: 60, statements: 70 },
      },
    },
  },
  resolve: { alias: { '@': new URL('./src/', import.meta.url).pathname } },
})
