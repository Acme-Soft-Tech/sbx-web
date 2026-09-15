import type { EventPropertiesMap } from './events'

// No PII, ever. session_id is the join key — that is what it is for.
export async function captureServer<K extends keyof EventPropertiesMap>(
  event: K,
  properties: EventPropertiesMap[K],
): Promise<void> {
  if (!process.env.POSTHOG_KEY) return
  await fetch('https://app.posthog.com/capture/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ api_key: process.env.POSTHOG_KEY, event, properties }),
  }).catch(() => {})
}

export async function captureExceptionServer(error: unknown, context: { session_id: string }) {
  console.error('[exception]', { session_id: context.session_id, message: String(error) })
}
