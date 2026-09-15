// Client wrappers. Every call threads session_id so the client and server halves of
// the funnel join in PostHog.
export async function requestOtp(session_id: string): Promise<{ success: boolean }> {
  const res = await fetch('/api/otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ session_id }),
  })
  if (!res.ok) return { success: false }
  return res.json()
}
