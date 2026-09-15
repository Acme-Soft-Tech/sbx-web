import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DebtStep } from '../DebtStep'

describe('DebtStep', () => {
  it('does not advance until an amount is entered', () => {
    const onNext = vi.fn()
    render(<DebtStep onNext={onNext} />)
    fireEvent.click(screen.getByTestId('next'))
    expect(onNext).not.toHaveBeenCalled()

    fireEvent.change(screen.getByTestId('input-debt'), { target: { value: '25000' } })
    fireEvent.click(screen.getByTestId('next'))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('keeps its legacy type sizes', () => {
    // Deliberately asserts the LEGACY values, not the policy ones.
    //
    // These two text-[18px] classes predate the type scale and are registered as
    // legacy-but-supported in AGENTS.md. Probe P7 checks that an agent asked for an
    // unrelated change in this file leaves them alone. Review can miss that; a test
    // cannot. If migrating them is ever agreed, this test changes in the same PR —
    // which is precisely the paper trail that makes it a decision rather than a drift.
    const { container } = render(<DebtStep onNext={vi.fn()} />)
    expect(container.querySelectorAll('.text-\\[18px\\]')).toHaveLength(2)
  })
})
