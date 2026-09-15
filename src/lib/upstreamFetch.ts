const TIMEOUT_MS = 8000
const MAX_ATTEMPTS = 3

/**
 * The only way out of this app. A bare fetch( inside app/api is a policy violation.
 *
 * Retries TRANSPORT failures only. A 4xx or 5xx is an ANSWER, not a failure to reach —
 * retrying it doubles load on an upstream that is already struggling and can duplicate
 * a side effect.
 */
export async function upstreamFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = process.env.RELINTEX_BASE_URL
  if (!base) throw new Error('RELINTEX_BASE_URL is not set')

  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      return await fetch(`${base}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.OTP_API_TOKEN ?? ''}`,
          ...(init.headers ?? {}),
        },
        body: typeof init.body === 'string' ? init.body : JSON.stringify(init.body),
      })
    } catch (e) {
      lastError = e                       // transport only — worth another attempt
      if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 200 * attempt))
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastError
}
