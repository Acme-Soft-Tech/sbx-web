import { EVENTS } from '@/lib/analytics/events'
import { captureExceptionServer, captureServer } from '@/lib/analytics/server'
import { upstreamFetch } from '@/lib/upstreamFetch'

// The six-step handler shape, in order. See the sbx-api-route skill.
export async function POST(req: Request) {
  // 1. parse and validate
  const body = await req.json().catch(() => null)
  const session_id = body?.session_id
  if (!session_id) return Response.json({ error: 'Bad request' }, { status: 400 })

  // 2. capture the attempt
  await captureServer(EVENTS.OTP_REQUEST_ATTEMPTED, { session_id })

  try {
    // 3. upstream through upstreamFetch, never a bare fetch(
    const res = await upstreamFetch('/api/lead-dr-request-otp', {
      method: 'POST',
      body: JSON.stringify({ session_id }),
    })

    // 4. branch, and emit on BOTH paths. The failure path is the one people forget.
    if (!res.ok) {
      await captureServer(EVENTS.OTP_REQUEST_FAILED, { session_id, status: res.status })
      return Response.json({ error: 'Could not send code' }, { status: 502 })
    }
    await captureServer(EVENTS.OTP_REQUEST_SUCCEEDED, { session_id })
    return Response.json(await res.json())
  } catch (e) {
    // 5. captureExceptionServer in every catch
    await captureExceptionServer(e, { session_id })
    // 6. generic message, no upstream text leaked
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
