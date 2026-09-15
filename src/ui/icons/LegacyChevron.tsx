// LEGACY, SUPPORTED — an inline SVG icon from before the Material icon convention.
// Mirrors the legacy icon components in the real repo. Leave it alone; migrating it
// is its own ticket, not a drive-by in someone else's diff.
export function LegacyChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
