// Size Limit config, generated at *load time* from `.next/app-build-manifest.json`
// rather than from a hand-maintained glob.
//
// Why: a glob like `.next/static/chunks/**/*.js` with hand-picked `!excludes`
// (main-*.js, polyfills-*.js, pages/**) has to be kept in sync by hand with
// whatever Next.js happens to name its chunks. It previously missed
// `framework-*.js` (~45 kB gzip, only ever referenced by the legacy Pages
// Router `/_app` and `/_error` entries in `.next/build-manifest.json`, never
// by a real App Router route) and over-broadly excluded `main-app-*.js` (the
// genuine App Router bootstrap chunk) via the `main-*.js` pattern intended
// only for the legacy `main-*.js` Pages Router entry.
//
// Instead, `.next/app-build-manifest.json` states exactly which JS chunks
// each real App Router route (and each layout) loads. We read it fresh on
// every `pnpm size` run and emit one Size Limit check per manifest entry, so
// the measured set can never drift from what Next.js actually built. Because
// the numbers are recomputed from `.next/` (itself gitignored) on every run,
// there is no separate generated JSON artifact to keep in sync or gitignore
// — this file is the whole "generator", and it is committed because its
// logic is stable across builds even though its output is not.

'use strict'

const fs = require('node:fs')
const path = require('node:path')

const projectRoot = __dirname
const nextDir = path.join(projectRoot, '.next')
const manifestPath = path.join(nextDir, 'app-build-manifest.json')

const ROUTE_BUDGET = '200 kB'

if (!fs.existsSync(manifestPath)) {
  throw new Error(
    '[size-limit] Could not find .next/app-build-manifest.json.\n' +
      '  size-limit derives its budget from the Next.js App Router build ' +
      'manifest, so it needs a production build first.\n' +
      '  Run `pnpm build` (or `pnpm next build`), then re-run `pnpm size`.\n' +
      `  Looked for: ${manifestPath}`
  )
}

let manifest
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
} catch (cause) {
  throw new Error(
    `[size-limit] Failed to parse ${manifestPath} as JSON. Try a clean ` +
      're-build with `pnpm build`.',
    { cause }
  )
}

const routes = manifest.pages
if (!routes || typeof routes !== 'object' || Object.keys(routes).length === 0) {
  throw new Error(
    `[size-limit] ${manifestPath} has no "pages" entries. This shouldn't ` +
      'happen for a normal `next build` output — try a clean re-build ' +
      '(`rm -rf .next && pnpm build`).'
  )
}

// tinyglobby (used internally by size-limit to resolve `path` patterns)
// treats each entry as a glob pattern, and glob patterns are POSIX paths:
// backslashes are escape characters, not separators. Absolute Windows paths
// built with `path.join` (e.g. `F:\...\chunks\main-app-x.js`) therefore fail
// to match on Windows unless normalized to forward slashes first.
const toGlobPath = (p) => p.split(path.sep).join('/')

// One check per manifest entry (each real App Router route, plus each
// layout that contributes its own client chunk). This mirrors Next's own
// per-route "First Load JS" reporting almost exactly, so growth in any one
// route's own bundle is caught immediately and precisely, rather than
// averaged into a single whole-app total that drifts as unrelated routes
// are added.

const checks = Object.entries(routes)
  .map(([route, chunks]) => {
    const jsChunks = [...new Set(chunks.filter((chunk) => chunk.endsWith('.js')))].sort()
    return { route, files: jsChunks.map((chunk) => toGlobPath(path.join(nextDir, chunk))) }
  })
  .filter((check) => check.files.length > 0)
  .sort((a, b) => a.route.localeCompare(b.route))

if (checks.length === 0) {
  throw new Error(
    `[size-limit] ${manifestPath} listed no JS chunks for any route — refusing to generate an empty budget.`
  )
}

module.exports = checks.map(({ route, files }) => ({
  name: `route JS: ${route} (from app-build-manifest.json)`,
  path: files,
  limit: ROUTE_BUDGET,
  gzip: true
}))
