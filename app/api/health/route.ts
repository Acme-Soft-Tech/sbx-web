// Dependency-free liveness probe. Must not touch the database or upstream.
export async function GET() {
  return Response.json({ ok: true, ts: Date.now() })
}
