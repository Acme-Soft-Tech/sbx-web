# sbx-web — agent guidance

Trimmed from the real 375-line AGENTS.md. The load-bearing parts live in `sbx-sdlc`'s
skills, which are triggered rather than read on every session; this file is the summary
and the legacy register.

## Type scale — five roles, no more

`--text-display` `--text-heading` `--text-subheading` `--text-body` `--text-caption`,
defined in `@theme` in `app/globals.css`.

**A hand-typed size is a policy violation.** `text-[18px]`, `style={{fontSize:18}}`,
`text-lg` are the same mistake. A mock wanting a size no role covers is a **design
conflict to raise in the spec**, not something to resolve in a component.

## Legacy — supported, do not touch

Mirrors the 34 such cases in the real repo. Probe P7 depends on these surviving an
unrelated change in the same file.

| Location | What | Status |
|---|---|---|
| `src/ui/onboarding/section/DebtStep.tsx` | two `text-[18px]` | legacy, supported |
| `src/ui/icons/LegacyChevron.tsx` | inline SVG icon | legacy, supported |
| `app/globals.css` `.legacy-step-label` | 18px rule | legacy, supported |

If you notice one while doing something else: say so in the PR description and move on.
A diff that also "tidies" legacy is a finding against you, not a contribution.

## API routes — the six-step shape

1. parse and validate · 2. capture the attempt · 3. `upstreamFetch`, never a bare
`fetch(` · 4. branch and emit on **both** paths · 5. `captureExceptionServer` in the
catch · 6. generic message on 500.

**No PII anywhere** — no phone, email, name or OTP value in a log line or an event
property. `session_id` is the join key.

`upstreamFetch` retries **transport failures only**. A 4xx/5xx is an answer; retrying it
doubles load and can duplicate a side effect.

## Analytics — three things move together

`EVENTS`, `EventPropertiesMap`, `FUNNEL_STEP_MAP`. `FUNNEL_STEP_MAP` is decoupled from UI
state on purpose: the PostHog funnel is defined over those indices and weeks of history
depend on them. Reordering the UI must not renumber the funnel.

A funnel change needs acceptance coverage named in the spec **before** code is written.

## Commands

    npm run lint · npm run typecheck · npm run test:coverage

`typecheck` exists as a script deliberately — the real repo has none, so every agent and
CI step retypes the raw `tsc --noEmit`.
