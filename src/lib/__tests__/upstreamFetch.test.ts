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

  it('throws when RELINTEX_BASE_URL is unset rather than calling a bare host', async () => {
    delete process.env.RELINTEX_BASE_URL
    await expect(upstreamFetch('/x')).rejects.toThrow('RELINTEX_BASE_URL is not set')
  })

  it('gives up after MAX_ATTEMPTS and rethrows the transport error', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('ECONNRESET'))
    vi.stubGlobal('fetch', fetchMock)
    process.env.RELINTEX_BASE_URL = 'https://upstream.test'

    await expect(upstreamFetch('/x')).rejects.toThrow('ECONNRESET')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('aborts a request that outlives the timeout', async () => {
    // Covers the abort callback. Without this the timeout is untested code that
    // only runs when an upstream is already having a bad day.
    vi.useFakeTimers()
    const fetchMock = vi.fn((_url: string, init: RequestInit) =>
      new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => reject(new Error('AbortError')))
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
    process.env.RELINTEX_BASE_URL = 'https://upstream.test'

    const pending = upstreamFetch('/slow')
    const assertion = expect(pending).rejects.toThrow('AbortError')
    await vi.advanceTimersByTimeAsync(40_000)   // past all three attempts + backoff
    await assertion
    vi.useRealTimers()
  })
})
