#!/usr/bin/env node
// vitest.config.mts emits json-summary specifically to drive this. In the real repo
// this file does not exist, so the reporter feeds a gate that cannot run and the flat
// 20% global floor is the only thing actually firing.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const FLOOR = Number(process.env.CHANGED_FILE_FLOOR ?? 60)

// Try bases in order and use the first that resolves. HEAD~1 does not exist on a
// single-commit history or a shallow CI clone, and a gate that dies with a stack
// trace is worse than one that says why it could not run.
const candidates = [
  process.env.GITHUB_BASE_REF && `origin/${process.env.GITHUB_BASE_REF}`,
  'upstream/main',
  'origin/main',
  'HEAD~1',
].filter(Boolean)

const resolve = (ref) => {
  try {
    execSync(`git rev-parse --verify --quiet ${ref}^{commit}`, { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

const base = candidates.find(resolve)
if (!base) {
  console.log(`no usable base ref (tried: ${candidates.join(', ')}) — skipping`)
  process.exit(0)
}

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
