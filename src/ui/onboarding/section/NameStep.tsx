'use client'
import { useState } from 'react'

export function NameStep({ onNext }: { onNext: () => void }) {
  const [name, setName] = useState('')
  return (
    <section data-testid="step-name">
      <label className="text-body" htmlFor="name">Your name</label>
      <input id="name" data-testid="input-name" value={name}
             onChange={(e) => setName(e.target.value)} className="text-body" />
      <button data-testid="next" disabled={!name} onClick={onNext} className="text-body">
        Continue
      </button>
    </section>
  )
}
