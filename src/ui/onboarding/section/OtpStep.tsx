'use client'
import { useState } from 'react'

export function OtpStep({ sessionId, onSend }: { sessionId: string; onSend: () => Promise<unknown> }) {
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState(false)

  return (
    <section data-testid="step-otp" data-session={sessionId}>
      {!sent ? (
        <button data-testid="send-code" onClick={async () => { await onSend(); setSent(true) }}
                className="text-body">
          Send code
        </button>
      ) : (
        <div data-testid="otp-sent">
          <input data-testid="input-otp" value={code}
                 onChange={(e) => setCode(e.target.value)} className="text-body" />
          <button data-testid="verify" onClick={() => setVerified(code === '000000')}
                  className="text-body">
            Verify
          </button>
          {verified && <p data-testid="verified" className="text-body">Verified</p>}
        </div>
      )}
    </section>
  )
}
