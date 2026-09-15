'use client'
import { useState } from 'react'

export function EmailStep({ onNext }: { onNext: () => void }) {
  const [email, setEmail] = useState('')
  return (
    <section data-testid="step-email">
      <label className="text-body" htmlFor="email">Your email</label>
      <input id="email" type="email" data-testid="input-email" value={email}
             onChange={(e) => setEmail(e.target.value)} className="text-body" />
      <button data-testid="next" onClick={onNext} className="text-body">
        Continue
      </button>
    </section>
  )
}
