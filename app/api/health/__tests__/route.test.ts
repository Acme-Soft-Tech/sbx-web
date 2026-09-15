import { describe, expect, it } from 'vitest'

import { GET } from '../route'

describe('GET /api/health', () => {
  it('is dependency-free and returns ok', async () => {
    // No DB, no upstream: a liveness probe that touches a dependency reports the
    // dependency's health, not the app's.
    const res = await GET()
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
  })
})
