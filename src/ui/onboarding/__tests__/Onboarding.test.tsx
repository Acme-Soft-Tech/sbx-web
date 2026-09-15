import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/api/api', () => ({ requestOtp: vi.fn().mockResolvedValue({ success: true }) }))

import { Onboarding } from '../Onboarding'

describe('Onboarding', () => {
  it('starts on the name step', () => {
    render(<Onboarding />)
    expect(screen.getByTestId('funnel').dataset.step).toBe('1')
  })

  it('advances once a name is entered', () => {
    render(<Onboarding />)
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Test' } })
    fireEvent.click(screen.getByTestId('next'))
    expect(screen.getByTestId('funnel').dataset.step).toBe('2')
  })
})
