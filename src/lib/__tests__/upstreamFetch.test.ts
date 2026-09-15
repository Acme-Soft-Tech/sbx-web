import { afterEach, describe, expect, it, vi } from 'vitest'

import { upstreamFetch } from '../upstreamFetch'

afterEach(() => vi.unstubAllGlobals())

describe('upstreamFetch', () => {
  it('does NOT retry a 500 — an error response is an answer, not a transport failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('boom', { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)
    process.env.RELINTEX_BASE_URL = 'https://upstream.test'

    const res = await upstreamFetch('/x', { method: 'POST' })

    expect(res.status).toBe(500)
    expect(fetchMock).toHaveBeenCalledTimes(1)   // retrying would duplicate side effects
  })

  it('retries a transport failure', async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error('ECONNRESET'))
      .mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    process.env.RELINTEX_BASE_URL = 'https://upstream.test'

    const res = await upstreamFetch('/x')

    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
