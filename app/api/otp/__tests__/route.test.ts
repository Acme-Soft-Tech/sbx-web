import { describe, expect, it, vi } from 'vitest'

const captureServer = vi.fn()
vi.mock('@/lib/analytics/server', () => ({
  captureServer: (...a: unknown[]) => captureServer(...a),
  captureExceptionServer: vi.fn(),
}))
const upstreamFetch = vi.fn()
vi.mock('@/lib/upstreamFetch', () => ({ upstreamFetch: (...a: unknown[]) => upstreamFetch(...a) }))

import { EVENTS } from '@/lib/analytics/events'
import { POST } from '../route'

const post = (body: unknown) =>
  POST(new Request('http://x/api/otp', { method: 'POST', body: JSON.stringify(body) }))

describe('POST /api/otp', () => {
  it('rejects a body with no session_id', async () => {
    expect((await post({})).status).toBe(400)
  })

  it('emits analytics on the FAILURE path', async () => {
    // The clause agents drop most often, and the one SBX-8 deliberately breaks.
    captureServer.mockClear()
    upstreamFetch.mockResolvedValue(new Response('nope', { status: 503 }))

    const res = await post({ session_id: 's1' })

    expect(res.status).toBe(502)
    expect(captureServer).toHaveBeenCalledWith(EVENTS.OTP_REQUEST_FAILED,
      expect.objectContaining({ session_id: 's1', status: 503 }))
  })

  it('never leaks upstream text to the client', async () => {
    upstreamFetch.mockResolvedValue(new Response('SECRET UPSTREAM DETAIL', { status: 503 }))
    const body = await (await post({ session_id: 's1' })).json()
    expect(JSON.stringify(body)).not.toContain('SECRET')
  })
})
