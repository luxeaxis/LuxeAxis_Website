# Luxe Axis Website — Technical Architecture Design

**Date:** 2026-07-27
**Status:** Approved
**Scope:** Translates the eight Luxe Axis specification documents into an implementable technical architecture. Resolves the contradictions between them and names the workstreams they omit.

**Source documents (normative unless stated otherwise):**
`LuxeAxis_Master_Program.md` · `LuxeAxis_3D_Website_Spec.md` v1.1 · `LuxeAxis_Cinematic_Direction.md` · `LuxeAxis_Design_System.md` · `luxe-axis.tokens.json` · `LuxeAxis_3D_Interaction_Framework.md` · `LuxeAxis_Build_Backlog.md` · `LuxeAxis_Landing_Page_Blueprint.md` · `LuxeAxis_Performance_A11y_QA.md`

---

## 0. Decisions taken

Five questions the specifications leave open or answer inconsistently. Each is settled here and the resolution propagates through the rest of this document.

| # | Question | Decision |
|---|---|---|
| D1 | Home hero: cinematic logo loader, or still-first? | **Still-first.** First paint is a finished-room image + `<h1>` + CTA, and that image is the LCP element. The logo→room assembly becomes a scroll-scrubbed enhancement over 0–15%. The 600 ms minimum-display loader guard is deleted. |
| D2 | Where do `.glb` assets come from? | **Generated in-house / AI-assisted.** Timing and quality are unproven, so the architecture must not couple page delivery to model delivery. |
| D3 | Does vector logo artwork exist? | **No — only `LuxeAxis_Logo_Primary.jpg`.** Vectorization is a multi-day design deliverable that gates both the logo system and the hero geometry. |
| D4 | Hosting and data residency? | **Vercel for the site; lead route and its database pinned to Mumbai (`bom1`).** |
| D5 | CMS? | **Sanity**, under a hard no-personal-data rule. |

### D1 rationale

`Spec §5.1`, `Cinematic SCENE 01` and `Interaction §1 H1` all open on the logo monogram and assemble it into a room. `Landing_Page_Blueprint §1` states the opposite in explicit terms — an assembling hero is *"the single biggest conversion mistake a 3D landing page can make."* `Backlog T-24` compounds it with a 600 ms minimum-display loader guard, a deliberate delay on the LCP route.

The Blueprint's position is correct and is also the position the performance document takes (`LCP element is DOM text/hero image — never WebGL`). The brand moment is preserved; it plays *after* comprehension rather than in front of it.

### D2 / D3 consequence

Both answers point the same way: every visual moment on the site is blocked behind design or asset work of uncertain duration. The architecture in §1 converts those from schedule risks into scheduled enhancements.

---

## 1. System architecture

### 1.1 Application shape

A **single Next.js 14 App Router application**. Not a monorepo — there is one deployable and no shared packages to justify workspace overhead. (`Backlog T-01` says "monorepo"; that wording is corrected.)

### 1.2 Layering

Five layers, strictly one-directional. A module may import only from layers below it. Enforced by ESLint `import/no-restricted-paths`.

```
routes/        app/[locale]/…                     RSC by default
features/      FeeCalculator, BookAudit, PortfolioGrid, CaseStudy
components/    Card, Header, MegaMenu, Footer, SceneSlot
primitives/    Button, Link, Field, Icon, Stack, Cluster, Grid, Container, Bleed, Center
tokens/        styles/tokens.css + tailwind theme (generated — never hand-edited)
```

Two **capability layers** sit orthogonally to the stack and may be reached only through a named seam:

| Layer | Seam | Rule |
|---|---|---|
| `content/` | Typed RSC fetchers | No component ever calls GROQ directly. |
| `three/` | **The scene registry, and nothing else.** | There is exactly one coupling point between DOM and WebGL. |

### 1.3 The scene-slot contract

This is the central architectural decision. Every cinematic moment is a `SceneSlot` whose default render is a poster; live 3D is an optional, lazily-registered upgrade.

```ts
// three/registry.ts — the ONLY coupling point between DOM and WebGL

export type SceneId =
  | 'hero' | 'persona-router' | 'vastu' | 'space-score'
  | 'space-os' | 'portfolio' | 'journey' | 'pricing-axis' | 'nri-globe';

export type ScenePoster = {
  src: string;                 // AVIF/WebP, art-directed per breakpoint
  alt: string;                 // the CLAIM the scene makes — not a description of pixels
  aspect: `${number}/${number}`;
  priority?: boolean;          // true for 'hero' only — this is the LCP element
};

export type SceneModule = {
  Scene: React.ComponentType<{ shot: Shot }>;
  budgetKB: number;
  minTier: 'T2' | 'T3';
  flag: string;
};

export const POSTERS: Record<SceneId, ScenePoster>;
export const SCENES: Partial<Record<SceneId, () => Promise<SceneModule>>>;
```

The types carry the guarantee. `POSTERS` is a **total** `Record` — every scene must have a poster or the build fails typecheck. `SCENES` is `Partial` — the type system encodes that live 3D is optional, so no page can be written that depends on a scene existing.

**Usage:**

```tsx
<SceneSlot id="hero">
  <h1>{t('hero.headline')}</h1>      {/* real DOM · the LCP element · never moves */}
  <BookAuditCta />
</SceneSlot>
```

`SceneSlot` renders an aspect-ratio box, the poster inside it, and `children` above in normal flow. It upgrades to live 3D only when **all** of the following hold:

1. a module is registered for that `SceneId`,
2. its feature flag is on,
3. resolved tier ≥ `minTier`,
4. reduced-motion is off,
5. first paint has already occurred.

On upgrade the slot publishes `activeScene` to the store; the single persistent canvas — mounted once, dynamically imported, `ssr: false` — renders into that box's coordinates. The poster remains in the DOM underneath as the context-loss fallback, `aria-hidden`, faded out.

### 1.4 Properties this yields

| Property | Why it holds |
|---|---|
| **Zero CLS by construction** | DOM children never move between poster and live modes. |
| **Structural reduced-motion parity** | The reduced-motion path *is* the default path, not a branch to maintain. |
| **Asset decoupling** | Phase 2 ships with `SCENES = {}` and the site is complete, converting, and launchable. |
| **Pipeline validated without polygons** | `T-25` proves upgrade + rollback with a registered no-op scene. |

The last point dissolves the `T-27`/`T-28` ordering defect: the hero is no longer the scene that validates the pipeline, so object primitives can precede it naturally.

---

## 2. Token pipeline

### 2.1 The defect

`luxe-axis.tokens.json` binds component tokens to **primitives** rather than semantics:

```jsonc
"component": { "button": { "primary-bg": { "$value": "{color.brand.gold}" } } }
```

This voids the file's own stated law (`Design_System §1.1`: *"re-theming never touches component code"*). The light theme's teal accent cannot reach the button. The same fault affects `field.border-focus`, and `nav.bg` is a raw `rgba(13,43,78,0.55)` literal that pins navy into the light theme.

Related: **no light-theme component tokens exist at all** — only `card.bg-dark`, `field.bg-dark`, `field.border-dark`.

### 2.2 The restructure

Insert a theme-agnostic `semantic` alias tier between theme and component; build once per theme.

```
tokens/
  luxe-axis.tokens.json      primitives + theme.dark.* + theme.light.*   (source, unchanged)
  modes/dark.json            semantic.accent → {theme.dark.accent}   …
  modes/light.json           semantic.accent → {theme.light.accent}  …
```

```jsonc
"component": {
  "button": {
    "primary-bg":       { "$value": "{semantic.accent}" },
    "primary-fg":       { "$value": "{semantic.accent-contrast}" },
    "primary-hover-bg": { "$value": "{semantic.accent-hover}" }
  },
  "nav": {
    "height": { "$value": "72px" }
  }
}
```

Style Dictionary runs twice with `outputReferences: true`:

```css
:root                { --accent:#C9A84C; --accent-contrast:#111315; --btn-primary-bg:var(--accent); }
[data-theme="light"] { --accent:#1A7A85; --accent-contrast:#FFFFFF; }
```

Component variables are declared **once**, as `var()` references. A runtime `data-theme` flip re-resolves them with no rebuild and no duplicate declarations. All `*-dark` component tokens collapse into single theme-neutral tokens.

**Three semantic roles must be added** to complete the set: `accent-hover`, `field-bg`, `field-border-focus`.

The glass fill (`--nav-bg`) is **computed at build time** from `color.brand.*` and `opacity.glass-*`, and emitted as a resolved `rgba()` per theme. `color-mix()` was considered and rejected: with both themes generated at build time there is no runtime `--surface` override for it to track, so it would have bought only a browser-support caveat and a hand-written literal fallback that duplicates the navy primitive — which the tokens-only rule forbids.

### 2.3 Required custom transforms

`Backlog T-02` is sized **M**; these three items are most of that task:

| Token type | Work |
|---|---|
| `elevation` | DTCG shadow arrays → single CSS `box-shadow` list, preserving the two-layer light-border-plus-glow recipe |
| `typography` | Composite tokens → CSS custom-property sets + a Tailwind `fontSize` entry carrying `lineHeight` / `letterSpacing` |
| `fontSize` | `clamp()` strings are not valid `dimension` values — pass through as `$type: "other"` with a documented exception |

### 2.4 Token CI gates

**Alias resolution.** Build fails on any unresolved reference. (Already required by `T-02`.)

**Contrast assertion.** Every ratio in the specifications is a claim written in prose, and prose drifts the first time a hex is nudged. Recompute from token values and assert both directions:

```ts
expect(ratio(semantic.onSurface, semantic.surface)).toBeGreaterThanOrEqual(7);
expect(ratio(brand.gold, brand.ivory)).toBeLessThan(4.5);      // documents WHY the rule exists
expect(TEXT_ROLE_TOKENS).not.toContain('color.brand.teal');    // the palette's #1 trap
```

This palette has two genuine traps — gold-on-ivory and teal-on-navy — and four documents restate them inconsistently. Asserting the forbidden pairings as forbidden makes the reasoning executable.

### 2.5 Source of truth

`luxe-axis.tokens.json` is normative.

**`Spec §3.1`'s inline CSS block is marked illustrative and non-normative.** It is a stale subset — missing `teal-bright`, both neutral ramps, `navy-700`/`navy-600` — and §3.1 explicitly invites copy-pasting it, which would reintroduce the teal-on-navy contrast failure the token file exists to prevent.

---

## 3. Content, leads and data residency

### 3.1 CMS

Sanity, per `Spec §12`. The i18n plugin and editor experience justify it over Payload for a non-technical marketing team.

**Hard rule, enforced at schema review: no personal data in Sanity, ever.** Sanity's dataset is hosted outside India. Project content is not personal data, so this is compliant — but it stops being compliant the moment someone models a lead or an enquiry as a document type, which is a natural thing for a CMS-oriented developer to do. Testimonials carry a consent flag and a display name only.

Enforced by a schema lint in CI (§6.2, gate 6).

### 3.2 Lead pipeline — persist before deliver

The "Space OS lead queue" appears in five documents as the lead destination and is defined nowhere: no contract, no auth, no schema, no statement of whether it exists. `T-19` depends on it. The design removes that dependency from the critical path.

```
BookAuditForm  (client island, React Hook Form + Zod)
      ↓ POST
/api/lead      Route Handler · runtime:'nodejs' · region:'bom1'
      ├─ Zod re-validate server-side (never trust the client schema)
      ├─ Rate limit  (per-IP + per-phone, sliding window)
      ├─ Bot check   (honeypot + submit-timing; Turnstile only if abuse appears)
      ├─ PERSIST to Postgres, Mumbai region ─────────► 200 returned here
      └─ then LeadSink.deliver(lead)  ·  retried on failure
```

The lead is durable **before** the response returns. Delivery is a downstream, retryable concern.

```ts
interface LeadSink {
  readonly name: string;
  deliver(lead: Lead): Promise<DeliveryResult>;
}
```

| Sink | Status |
|---|---|
| `EmailSink` | Always registered, always on. Day-one path to a human inside the 30-minute first-touch SLA. |
| `SpaceOsSink` | Registers when that contract materializes. No change to form, route, or schema. |
| `WhatsAppSink` | Optional. |

`T-19` can therefore ship and be verified without anyone answering whether Space OS exists.

### 3.3 Hosting

**Vercel for the site; the lead route and its database pinned to `bom1` (Mumbai).**

`Spec §12` leaves Vercel-vs-AWS open and `Performance_A11y_QA §11` hedges both ways. Vercel supplies preview deploys, ISR, on-demand revalidation and Speed Insights — all of which the CI gates and the content workflow already assume. Standing up Amplify/ECS to host marketing pages buys latency the CDN already provides and costs the preview-deploy review loop the entire backlog is built around. Pinning only the lead route satisfies DPDPA for the only data it governs.

### 3.4 Tamil — an honest publication gate

**The contradiction:** `T-03` seeds `ta` catalogs as `TODO:translate` placeholders; `Backlog §6` DoD item 9 requires `en`+`ta` where user-facing; no task ever produces Tamil content. As written, every page task fails its own definition of done.

**Resolution:** `ta` is published **per-route**, not globally. Every CMS document and message namespace carries `publishedLocales`. A route is Tamil-live only when a human-reviewed translation exists.

- `hreflang` is emitted only for locales actually published on that route.
- `sitemap.ts` includes only published locale-route pairs.
- An unpublished `/ta/*` route issues a **307** to its English equivalent — temporary, because the route becomes live the moment a translation is published and a 308 would be cached against that. It never renders English under `lang="ta"`, and never machine translation, which the brand policy forbids outright.

**DoD item 9 is reworded:** *"`en` complete; `ta` complete **or** correctly unpublished."*

**Font budget consequence:** Noto Serif Tamil and Noto Sans Tamil load only on `/ta/*`. Four families globally cannot fit ≤130 KB; two per locale can. **The budget is per-locale**, and the CI check is written that way so it is enforceable.

---

## 4. Motion and 3D runtime

### 4.1 Tier resolution — four phases

`detect-gpu` ships a substantial GPU benchmark table and does async work. Running it before first paint fights the ≤200 KB budget and delays the poster.

| Phase | When | Signal | Result |
|---|---|---|---|
| 0 | SSR | `Save-Data` request header (middleware) | Server renders posters; `tier = T1` assumed |
| 1 | Hydration, synchronous | `matchMedia` reduced-motion · `connection.saveData` · `effectiveType` · `deviceMemory` · `hardwareConcurrency` · `pointer:coarse` | Lock T1, or provisional T2/T3 |
| 2 | Inside the lazy `three` chunk, post-paint | `detect-gpu` | Confirm or downgrade |
| 3 | Continuous | `PerformanceMonitor` | Live downgrade |

`detect-gpu` lives **inside** the dynamically imported three chunk, already excluded from first load, so it costs nothing until a scene is under consideration.

**Correction to carry through all documents:** `prefers-reduced-data` has no shipping browser support. It appears in four documents as a live signal. The real signals are `navigator.connection.saveData` and the `Save-Data` header; the media query remains only as forward-looking progressive enhancement.

### 4.2 Frameloop — one authoritative policy

The specifications assert `frameloop="demand"` absolutely, then specify a 6-second breathing glow (A1), drifting motes (A2), material sheen (A3), a cursor spotlight (A4) and damped pointer parallax — all of which require continuous frames. `Performance_A11y_QA §3` papers over this with *"or an explicit `invalidate()` tick."*

Replaced by a single rule, owned by one `useCanvasFrameloop()` hook:

```ts
'never'    // no active scene · canvas off-screen · tab hidden
'demand'   // scene active but at rest, or tier === T2
'always'   // scene active AND in viewport AND tier === T3 AND ambient enabled
```

**Consequence, stated because the documents do not:** ambient motion (A1–A4) is **T3-and-in-viewport only**. A1 is currently written as unconditional, which would hold a render loop open on mid-tier phones for a ±6 % glow oscillation.

### 4.3 View Transitions over a persistent canvas

`T-23` layers `next-view-transitions` over a fixed WebGL canvas. The View Transitions API snapshots the outgoing page including the canvas, producing a frozen-frame flash or a visibly doubled canvas on every route change.

- The canvas root carries `view-transition-name: none` and never participates in a transition. Only `main` is captured.
- Scene continuity across routes is the **camera rig's** responsibility, not the DOM transition's — that is the entire reason the WebGL context is persistent.
- `ScrollTrigger.refresh()` fires on the transition's `finished` promise, not on a router event. Refreshing before the new DOM commits computes pin positions against the old layout.

### 4.4 Degrade ladder as data

`Performance_A11y_QA §12 B` requires proving the ladder degrades *in order*; no task owns it and no mechanism exists to produce the proof.

```ts
const LADDER = ['particles','postfx','pointerFx','parallax','shadows','dpr','poster'] as const;
```

`PerformanceMonitor` decline steps down one rung; sustained incline steps back up one, with hysteresis to prevent oscillation. Each rung is a value in the store. **Scenes read the store and never implement their own degradation.** This makes the ladder unit-testable (assert ordering) and e2e-testable (throttle GPU, assert sequence).

### 4.5 Two smaller resolutions

**One motion engine.** GSAP only; Lenis the sole scroll source. `Design_System §2.4`'s mention of Framer Motion `staggerChildren` is deleted — it contradicts `Backlog §1`'s own architecture rule.

**FPS-per-tier probe.** Cited in three documents, owned by no task. It attaches to `ThreeCanvas` (`T-25`), samples p75 frame time per scene per tier, and posts on an idle callback. Without it, the "does 3D convert?" analysis in `Master §10.3` has no data.

---

## 5. Failure modes

**Governing principle: no failure in the experience layer may degrade the conversion layer.** A scene error boundary renders the poster; it never renders an error.

| Failure | Handling |
|---|---|
| WebGL context loss | `webglcontextlost` sets a store flag, scene unmounts, poster fades back in place. One recovery attempt, then permanent poster for the session. Sentry event with tier + scene. |
| `.glb` load failure / >8 s timeout | Slot stays on poster silently. Sentry. No spinner outliving its welcome, no broken frame. |
| Scene runtime error | Scene-level error boundary → poster. No visible indication of failure. |
| CMS fetch failure | ISR serves last good render (`stale-while-revalidate`). Cold cache with no data → branded error page, never blank. |
| Lead POST failure | One silent retry, then a fallback panel preserving every entered value, surfacing WhatsApp, phone, and a `mailto:` with answers pre-filled. A network error must never cost a lead. |
| Font load failure | `size-adjust` metric-matched fallbacks — failure costs appearance, never layout. |
| Analytics / consent script failure | Fire-and-forget, fully isolated. Cannot block render, hydration, or submission. |
| Missing translation key | Dev: throw. Prod: fall back to English **and** report. Never render a raw `namespace.key`. |
| Missing poster | Caught at build — `POSTERS` is a total `Record`, plus a build script asserting each file exists on disk. |

Five of these ten resolve to *show the poster*. That is the §1.3 contract paying for itself: because the fallback is the default render path rather than a special case, error handling in the 3D layer is largely "stop doing the optional thing," with no separate error UI to design, translate or test.

---

## 6. Testing and CI gates

### 6.1 Test layers

| Layer | Tool | Covers |
|---|---|---|
| Unit | Vitest | Token alias resolution, contrast assertions, tier resolver under mocked env, calculator pricing math, degrade-ladder ordering, reduced-motion → end-state, Zod schemas |
| Component | Storybook + a11y addon + interaction tests | Every variant × state × theme × locale |
| Visual | Chromatic *or* Playwright snapshots | Primitives, nav, cards, all logo variants |
| E2E | Playwright + `@axe-core/playwright` | Conversion smoke, keyboard-only, axe per route per locale, plus dedicated **reduced-motion**, **no-JS** and **no-WebGL** runs |
| Budget | Lighthouse-CI · size-limit · custom 3D check | CWV, route JS, per-locale fonts, `.glb` size, draw calls |

### 6.2 Six gates that do not currently exist

All are required by the QA checklist and owned by no task.

| # | Gate | Rationale |
|---|---|---|
| 1 | **Contrast assertion** | Recompute WCAG ratios from token values; assert forbidden pairings fail. |
| 2 | **Per-locale font budget** | ≤130 KB for `en`, ≤130 KB for `ta`. As a global number it is unachievable with four families and would be quietly ignored. |
| 3 | **Scene-slot parity** | For every `SceneId`: poster exists, `alt` non-empty, `alt` ≠ generic placeholder. Prevents shipping `alt=""` on nine images carrying the site's actual claims. |
| 4 | **No-WebGL e2e run** | `QA §12 D` requires it; nothing automates it. Playwright project with WebGL disabled, asserting the conversion path completes. |
| 5 | **Degrade-ladder ordering** | `QA §12 B` requires proof; no mechanism currently produces it. |
| 6 | **PII-free CMS lint** | Schema check that no Sanity document type declares a personal-data field. |

---

## 7. Backlog corrections

### 7.1 Ordering and scope

| Item | Correction |
|---|---|
| `T-28` / `T-27` | **`T-28` precedes `T-27`.** The hero's H5 material-resolve *is* `T-28`'s O2 primitive. `T-27`'s own card admits the ambiguity; the dependency graph draws it backwards. |
| `T-20` | **Split.** SEO helpers (`seo()`, `<JsonLd>`) after `T-14`; per-route metadata and event wiring after `T-18`/`T-19`, since they instrument routes that do not exist at `T-14`. |
| `T-22` | Gains dependencies on `T-15`–`T-18`. It applies motion "across the static site," which is those pages. |
| `T-19` | Gains rate limiting and bot protection. `QA §12 J` requires both; the card omits both. |
| `T-24` | **The 600 ms minimum-display loader guard is removed** (D1). The brand loader survives as the async/skeleton system; it no longer gates first paint on the home route. The logo draw-on moves into the `hero` scene's scroll-scrubbed timeline. |
| `T-01` | "Monorepo" → single application. |
| `Spec §10.3` | Phase numbers realigned to the Master/Backlog numbering. Currently "Phase 3" means 3D in one document and motion in two others. |
| Analytics taxonomy | `Master §10.2` becomes canonical. `Spec §9.1`'s older event names (`scroll_75`, `moment_view`, `calc_complete`, `lookbook_dl`, `subscribe`) are deprecated in place. |

### 7.2 Missing workstreams

Five workstreams the backlog omits entirely. Given D2 and D3, these are the real critical path.

| ID | Workstream | Tasks | Notes |
|---|---|---|---|
| **A** | Brand assets | `A-01` logo vectorization · `A-02` vignette icon set · `A-03` favicon/OG set | Only the JPEG exists (D3). The artwork is flat vector-style — clean edges, no photographic texture — so it auto-traces well and `A-01` is ~1–2 days of design, not a week. Manual work is stroke-weight normalisation on the interior and cleaning the gradient mesh on the letterforms. Gates `T-08`. See §9 for what it does **not** give `T-27`. |
| **B** | Posters | `B-01` art direction + production, 9 scenes | **Needed in Phase 2 at `T-14`**, long before any 3D exists. Under §1.3 these are the primary visual deliverable, not a fallback. |
| **C** | 3D models | `C-01` `gltf-transform` pipeline + CI budget gate · `C-02…` per-scene `.glb` | The pipeline and its hard gates must exist **before** the first model. With AI-assisted generation (D2), unoptimized assets would otherwise silently blow the budgets. |
| **D** | Content | `D-01` EN copy all routes · `D-02` TA translation per route, human-reviewed · `D-03` privacy/terms/DPDPA legal copy | `D-02` feeds the §3.4 publication gate. |
| **E** | Ops | `E-01` Sanity Studio deploy + roles + preview · `E-02` branded 404/500 · `E-03` FPS probe (folds into `T-25`) | |

### 7.3 The scheduling consequence

Workstream **A** gates the hero. Workstream **B** gates the entire Phase 2 site. Both are design work, not code.

**Poster production (`B-01`) is the highest-leverage thing to start.** The 37 coding tasks cannot produce a reviewable home page without it, and under this architecture posters are what actually ships.

---

## 8. Open items

| Item | Owner | Notes |
|---|---|---|
| Space OS lead-queue contract | Client / CTO | Not blocking — §3.2 makes it a plug-in. Needed before `SpaceOsSink` can be written. |
| Sanity plan and dataset region | Client | Compliant as designed (no PII), but the position should be recorded in the DPDPA documentation. |
| Design source of truth | — | There is no Figma. Storybook plus the `/style` route are the visual contract. Stakeholders expecting comps before `T-14` review should be told this now. |
| Calendaring for audit scheduling | Client | `Spec §12` flags Cal.com/Calendly as an alternative to a raw time preference in Book-Audit step 2. |

---

---

## 9. Corrections from the supplied artwork

Recorded after reviewing `brand/LuxeAxis_Logo_Primary.jpg` directly. Three `Spec §3.6` / `§5.1` statements do not survive contact with the actual mark.

### 9.1 Layer naming

`mark.interior.wall-lines` is misnamed. The element is a **slatted panel** — roughly ten vertical strokes of varying height along the left of the A's interior, reading as vertical blinds or a fluted wall. Rename to `mark.interior.slats`. The A itself has **no crossbar**; it is a pure triangle, which is what lets it read as a gable.

### 9.2 The swoosh is horizontal

`Spec §5.1` H2 says *"the `swoosh` unrolls into the gold Axis running down the viewport."* In the artwork the swoosh sweeps **left-to-right** as a horizon line beneath both letterforms.

Turning it into a vertical spine is a 90° reinterpretation — creatively sound, but a **transformation, not a continuation**. The hero timeline needs an explicit beat where the horizon rotates into the axis. `Interaction §1 H2` (scroll 0–4 %) currently has no such beat and must gain one, or the "brand mark and website are one continuous idea" claim will visibly cheat at the exact moment it is being asserted.

### 9.3 "The same geometry" is aspirational

`Spec §3.6` and `§5.1` both claim the 3D hero instantiates *the exact vector set* extracted from the logo, so that "identity and scene never drift."

The interior is flat elevation line-art. The pendant is a 2D silhouette; extruding it yields a flat cutout, not a lamp. The hero objects will be **new models designed from the mark** — matching silhouette and proportion, sharing nothing literal.

**Consequence for workstream C:** `A-01` does not feed `T-27` geometry. Hero models are original work in `C-02`, briefed against the vectorized mark for silhouette fidelity. Any plan assuming the vectors drop into the scene is wrong.

### 9.4 Minimum size

`Spec §3.6` sets 24 px as the threshold below which `mark.interior` is dropped. The interior strokes are hairlines and will mud well before that. Move the `mark-mono` switchover to **~64 px**, and let the favicon be the monogram with the interior dropped entirely.

---

*Companion to the eight Luxe Axis specification documents. Supersedes them where explicitly stated in §0, §2.5, §4, §7 and §9.*
