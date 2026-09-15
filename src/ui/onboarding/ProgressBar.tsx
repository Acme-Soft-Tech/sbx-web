// Position comes from the funnel's own step state — this keeps no counter of its own.
// A second counter drifts the first time a step is added, and nobody notices until a
// screenshot looks wrong.
//
// The data-testid and ARIA attributes are a CONTRACT with sbx-qa, pinned in
// sdlc/work/SBX-5/spec.md. Renaming them breaks the acceptance suite in another repo,
// where the failure will look like a product regression rather than a rename.
export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div
      data-testid="progress"
      role="progressbar"
      data-step={step}
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label="Onboarding progress"
      className="h-1 w-full bg-gray-200"
    >
      <div className="h-1 bg-black" style={{ width: `${pct}%` }} />
    </div>
  )
}
