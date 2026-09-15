import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressBar } from '../ProgressBar'

// Plain getAttribute rather than jest-dom matchers: adding @testing-library/jest-dom
// would be a dependency bought for nicer assertion text, and this is a rig.
describe('ProgressBar', () => {
  it('exposes the DOM contract sbx-qa selects on', () => {
    // These attribute names are pinned in sdlc/work/SBX-5/spec.md and are read by the
    // acceptance suite in a DIFFERENT repo. This test is what makes a rename fail here,
    // loudly, instead of over there where it looks like a product regression.
    render(<ProgressBar step={2} total={4} />)
    const bar = screen.getByTestId('progress')
    expect(bar.getAttribute('role')).toBe('progressbar')
    expect(bar.getAttribute('data-step')).toBe('2')
    expect(bar.getAttribute('aria-valuenow')).toBe('2')
    expect(bar.getAttribute('aria-valuemin')).toBe('1')
    expect(bar.getAttribute('aria-valuemax')).toBe('4')
  })

  it('reports the step it is given, at both ends of the funnel', () => {
    const { rerender } = render(<ProgressBar step={1} total={4} />)
    expect(screen.getByTestId('progress').getAttribute('data-step')).toBe('1')
    rerender(<ProgressBar step={4} total={4} />)
    expect(screen.getByTestId('progress').getAttribute('data-step')).toBe('4')
  })
})
