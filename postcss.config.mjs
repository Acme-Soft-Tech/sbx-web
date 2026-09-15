// Tailwind v4 ships its PostCSS plugin separately. globals.css uses `@import
// "tailwindcss"` and `@theme`, neither of which resolves without this.
const config = { plugins: { '@tailwindcss/postcss': {} } }

export default config
