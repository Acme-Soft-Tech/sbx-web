'use client'
import { useState } from 'react'

import { requestOtp } from '@/api/api'
import { DebtStep } from './section/DebtStep'
import { EmailStep } from './section/EmailStep'
import { NameStep } from './section/NameStep'
import { OtpStep } from './section/OtpStep'

const newSessionId = () => Math.random().toString(36).slice(2)

export function Onboarding() {
  const [step, setStep] = useState(1)
  const [sessionId] = useState(newSessionId)
  const next = () => setStep((s) => s + 1)

  return (
    <main data-testid="funnel" data-step={step} className="mx-auto max-w-md p-6">
      <h1 className="text-heading">Get started</h1>
      {step === 1 && <NameStep onNext={next} />}
      {step === 2 && <EmailStep onNext={next} />}
      {step === 3 && <DebtStep onNext={next} />}
      {step === 4 && <OtpStep sessionId={sessionId} onSend={() => requestOtp(sessionId)} />}
    </main>
  )
}
