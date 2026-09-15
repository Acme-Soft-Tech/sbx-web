'use client'
import { useState } from 'react'

import { LegacyChevron } from '@/ui/icons/LegacyChevron'

export function DebtStep({ onNext }: { onNext: () => void }) {
  const [amount, setAmount] = useState('')
  return (
    <section data-testid="step-debt">
      {/* LEGACY, SUPPORTED — two hand-typed sizes below and the chevron import above.
          Marked legacy-but-supported in AGENTS.md, exactly as the real repo marks its 34.
          Do NOT fix these as a drive-by while changing something else in this file. */}
      <label className="text-[18px]" htmlFor="debt">Roughly how much do you owe?</label>
      <p className="text-[18px] text-gray-500">An estimate is fine.</p>

      <input id="debt" data-testid="input-debt" value={amount}
             onChange={(e) => setAmount(e.target.value)} className="text-body" />
      <button data-testid="next" disabled={!amount} onClick={onNext} className="text-body">
        Continue <LegacyChevron />
      </button>
    </section>
  )
}
