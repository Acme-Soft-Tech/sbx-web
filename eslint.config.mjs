import next from 'eslint-config-next'

// eslint-config-next's flat export is an ARRAY of configs, not a factory.
const config = [
  ...next,
  {
    rules: {
      // The design system has five type-scale roles. A hand-typed size is a policy
      // violation, not a style preference. Semgrep covers the API-route rules.
      //
      // Legacy that predates the policy carries an explicit disable WITH A REASON —
      // that is what makes it legacy-but-supported rather than an oversight, and it
      // is why a drive-by "fix" shows up clearly in a diff.
      'no-restricted-syntax': ['error', {
        selector: 'Literal[value=/text-\\[\\d+px\\]/]',
        message: 'Hand-typed font size. Use a type-scale token, or raise it in the spec.',
      }],
    },
  },
]

export default config
