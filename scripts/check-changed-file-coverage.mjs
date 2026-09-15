#!/usr/bin/env node
// vitest.config.mts emits json-summary specifically to drive this. In the real repo
// this file does not exist, so the reporter feeds a gate that cannot run and the flat
// 20% global floor is the only thing actually firing.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const FLOOR = Number(process.env.CHANGED_FILE_FLOOR ?? 60)
const base = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'HEAD~1'

const changed = execSync(`git diff --name-only ${base}...HEAD`, { encoding: 'utf8' })
  .split('\n')
  .filter((f) => /^(src|app)\/.*\.(ts|tsx)$/.test(f) && !/__tests__|\.test\./.test(f))

if (changed.length === 0) { console.log('no changed source files'); process.exit(0) }

const summary = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'))
const failures = []
for (const file of changed) {
  const key = Object.keys(summary).find((k) => k.endsWith(file))
  if (!key) { failures.push(`${file}: no coverage recorded`); continue }
  const pct = summary[key].lines.pct
  if (pct < FLOOR) failures.push(`${file}: ${pct}% lines < ${FLOOR}%`)
}

if (failures.length) {
  console.error('Changed-file coverage below floor:')
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
console.log(`changed-file coverage OK (${changed.length} files, floor ${FLOOR}%)`)
