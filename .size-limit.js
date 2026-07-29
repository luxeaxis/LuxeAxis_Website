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
// every `pnpm size` run and emit one Size Limit check per navigable route,
// with every ancestor layout's chunks attributed to it (see below), so the
// measured set can never drift from what Next.js actually built and never
// undercounts a route's real first-load JS. Because the numbers are
// recomputed from `.next/` (itself gitignored) on every run, there is no
// separate generated JSON artifact to keep in sync or gitignore — this file
// is the whole "generator", and it is committed because its logic is stable
// across builds even though its output is not.

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

// One check per navigable route (i.e. per manifest entry that isn't itself
// a layout). A `layout` entry is not an independently navigable route — its
// JS ships alongside every route nested under it — so counting it as a
// separate "route JS" check both fabricates a URL nobody requests and,
// worse, excludes the layout's own chunk from the real routes that actually
// serve it. We instead union each route's chunks with those of every
// ancestor layout on its path, walking the manifest key's route-path
// segments so this handles any nesting depth (a route may sit under more
// than one layout as the app grows) rather than special-casing `[locale]`.
//
// Manifest keys look like "<routePath>/<entryType>", e.g.
// "/[locale]/pricing/page" or "/[locale]/layout". `ownPathOf` strips the
// trailing "/<entryType>" segment to recover the route path each entry
// applies to, so a layout at "" (root) or "/[locale]" can be matched
// against every route path that equals it or is nested under it.

const lastSegment = (key) => key.slice(key.lastIndexOf('/') + 1)
const ownPathOf = (key) => key.slice(0, key.length - lastSegment(key).length - 1)

// `layout` is not the only wrapper whose JS ships with the routes beneath it.
// `template`, `error`, `loading`, `not-found`, `global-error` and `default`
// (parallel routes) all do too. Treating only `layout` as a wrapper meant the
// first `app/[locale]/error.tsx` or `loading.tsx` anyone added would both
// fabricate its own "route JS" check for a URL nobody navigates to AND go
// unattributed to the real routes that serve it — the identical bug this file
// was already fixed for twice, waiting to happen a third time.
const NAVIGABLE_ENTRY_TYPES = new Set(['page', 'route'])
const WRAPPER_ENTRY_TYPES = new Set([
  'layout',
  'template',
  'error',
  'loading',
  'not-found',
  'global-error',
  'default'
])

// Fail loud on an entry type we don't recognise rather than guessing. Guessing
// "wrapper" would silently drop a navigable route's own budget check; guessing
// "navigable" would fabricate a check and under-attribute real routes. Either
// way the gate would keep reporting green while measuring the wrong thing,
// which is the failure mode this whole file exists to prevent.
for (const key of Object.keys(routes)) {
  const entryType = lastSegment(key)
  if (!NAVIGABLE_ENTRY_TYPES.has(entryType) && !WRAPPER_ENTRY_TYPES.has(entryType)) {
    throw new Error(
      `[size-limit] Unrecognised App Router entry type "${entryType}" in ` +
        `${manifestPath} (key: "${key}").\n` +
        '  This file must know whether it is a navigable route (gets its own ' +
        'budget check) or a wrapper (its chunks are attributed to the routes ' +
        'nested under it). Add it to NAVIGABLE_ENTRY_TYPES or ' +
        'WRAPPER_ENTRY_TYPES in .size-limit.js.'
    )
  }
}

const isNavigableEntry = (key) => NAVIGABLE_ENTRY_TYPES.has(lastSegment(key))

const wrapperEntries = Object.entries(routes)
  .filter(([key]) => !isNavigableEntry(key))
  .map(([key, chunks]) => ({ routePath: ownPathOf(key), chunks }))

// Ancestor wrappers of `routePath`: wrappers whose own path is `routePath`
// itself (the one directly wrapping this route) or a proper prefix of it
// (an ancestor further up the tree, including the root layout at "").
const ancestorWrappersOf = (routePath) =>
  wrapperEntries.filter(
    ({ routePath: wrapperPath }) =>
      routePath === wrapperPath || routePath.startsWith(`${wrapperPath}/`)
  )

// Ancestor-layout attribution closes the specific gap this file was last
// fixed for (a layout's own client chunk excluded from its descendant
// routes), but it does not fully close the general problem: verified
// directly against a real `next start` response (see task report), a chunk
// can also be *shared* client-boundary code — e.g. a provider rendered by a
// layout — that webpack physically bundles into one particular sibling
// PAGE's own output file rather than into that layout's file or a numbered
// "shared by all" chunk. `app-build-manifest.json`'s per-route entry has no
// way to represent "also depends on a chunk that lives inside a different
// route's own file", so walking ancestor layouts alone still under-measures
// that route.
//
// The one place this is recorded accurately is the per-route React Server
// Components client-reference manifest that Next.js emits next to the
// compiled route at `.next/server/app/**/<page|route>_client-reference-
// manifest.js` — it is exactly what Next's own RSC renderer reads to decide
// which `<script src>` tags to emit for that route, so by construction it
// cannot disagree with what the browser is actually told to download. We
// treat `app-build-manifest.json` (checked above) as the primary, versioned
// source for the route/layout tree shape and the shared framework chunks,
// and use this file only to fill in whatever it misses — not as a
// replacement, so a change to its internal shape degrades to "measures
// slightly less than reality" rather than to a crash.
const serverAppDir = path.join(nextDir, 'server', 'app')

// Mirrors `ownPathOf`, but for locating the compiled output file rather than
// matching route ancestry: "/[locale]/pricing/page" -> the manifest emitted
// at server/app/[locale]/pricing/page_client-reference-manifest.js.
const clientReferenceManifestPathFor = (routeKey) => {
  const segments = routeKey.split('/').filter(Boolean)
  const entryType = segments[segments.length - 1]
  const dirSegments = segments.slice(0, -1)
  return path.join(serverAppDir, ...dirSegments, `${entryType}_client-reference-manifest.js`)
}

// The file's chunk paths are written in URL-encoded form (e.g.
// `%5Blocale%5D`), because they are meant to become literal `<script src>`
// URLs — unlike `app-build-manifest.json`, which uses plain filesystem-style
// segments (`[locale]`). Decoding brings both sources into the same form so
// a chunk found via both isn't double-counted as two different-looking
// strings, and so it resolves to the real file on disk.
const decodeChunkPath = (p) => decodeURIComponent(p)

const extraChunksFor = (routeKey) => {
  const manifestFile = clientReferenceManifestPathFor(routeKey)
  if (!fs.existsSync(manifestFile)) return []

  let rscManifest
  try {
    // These files are plain synchronous scripts Next.js generates as part of
    // our own build (`globalThis.__RSC_MANIFEST[routeKey] = {...}`) — safe
    // to load with `require` like any other generated build artifact.
    require(manifestFile)
    rscManifest = globalThis.__RSC_MANIFEST && globalThis.__RSC_MANIFEST[routeKey]
  } catch (cause) {
    throw new Error(
      `[size-limit] Failed to load the client reference manifest for ` +
        `"${routeKey}" at ${manifestFile}. Next.js's internal RSC manifest ` +
        'format may have changed; try a clean re-build (`rm -rf .next && ' +
        'pnpm build`), and if that doesn\'t help this file needs updating.',
      { cause }
    )
  }
  if (!rscManifest || typeof rscManifest.clientModules !== 'object') return []

  const chunks = new Set()
  for (const mod of Object.values(rscManifest.clientModules)) {
    for (const chunk of mod.chunks || []) {
      if (typeof chunk === 'string' && chunk.endsWith('.js')) chunks.add(decodeChunkPath(chunk))
    }
  }
  return [...chunks]
}

let clientReferenceChunkTotal = 0

const checks = Object.entries(routes)
  .filter(([route]) => isNavigableEntry(route))
  .map(([route, chunks]) => {
    const ancestorChunks = ancestorWrappersOf(ownPathOf(route)).flatMap((w) => w.chunks)
    const clientReferenceChunks = extraChunksFor(route)
    clientReferenceChunkTotal += clientReferenceChunks.length
    // Dedupe: shared chunks (e.g. the webpack runtime, main-app bootstrap,
    // or a provider chunk bundled into a sibling route's own file) can
    // appear in more than one of the three sources above.
    const jsChunks = [
      ...new Set(
        [...chunks, ...ancestorChunks, ...clientReferenceChunks].filter((chunk) => chunk.endsWith('.js'))
      ),
    ].sort()
    return { route, files: jsChunks.map((chunk) => toGlobPath(path.join(nextDir, chunk))) }
  })
  .filter((check) => check.files.length > 0)
  .sort((a, b) => a.route.localeCompare(b.route))

if (checks.length === 0) {
  throw new Error(
    `[size-limit] ${manifestPath} listed no JS chunks for any route — refusing to generate an empty budget.`
  )
}

// `extraChunksFor` returns [] on two silent paths: a missing manifest file, and
// a manifest whose `clientModules` shape it doesn't recognise. Left unchecked,
// a change to Next's internal RSC manifest format would make every route
// silently measure ~6.4 kB LESS than it actually ships — undercounting, which
// is the direction that manufactures false confidence, and precisely the bug
// this mechanism was added to fix. A budget gate that quietly stops measuring
// is worse than no gate. If we found routes but the RSC manifests contributed
// nothing at all, that is a format change, not a legitimately empty result.
if (clientReferenceChunkTotal === 0) {
  throw new Error(
    '[size-limit] Found ' +
      `${checks.length} navigable route(s), but no client-reference manifest ` +
      'yielded any chunks.\n' +
      "  That almost certainly means Next.js's internal RSC manifest shape " +
      'changed (globalThis.__RSC_MANIFEST[route].clientModules[*].chunks).\n' +
      '  Refusing to report a budget that silently undercounts. Try a clean ' +
      're-build (`rm -rf .next && pnpm build`); if the shape really changed, ' +
      'update extraChunksFor() in .size-limit.js.'
  )
}

module.exports = checks.map(({ route, files }) => ({
  name: `route JS: ${route} (from app-build-manifest.json)`,
  path: files,
  limit: ROUTE_BUDGET,
  gzip: true
}))
