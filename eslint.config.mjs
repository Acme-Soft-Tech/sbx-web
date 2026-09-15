import next from 'eslint-config-next'

export default [
  ...next(),
  {
    rules: {
      // The design system has five type-scale roles. A hand-typed size is a policy
      // violation, not a style preference. Semgrep catches the rest.
      'no-restricted-syntax': ['error', {
        selector: "Literal[value=/text-\\[\\d+px\\]/]",
        message: 'Hand-typed font size. Use a type-scale token, or raise it in the spec.',
      }],
    },
  },
]
