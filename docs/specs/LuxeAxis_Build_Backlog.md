# Luxe Axis — Build Backlog for AI-Assisted Development
### 37 session-sized tasks · each with a runnable prompt · clean architecture, fast iterations

**Companions (the AI must load these as context):** `LuxeAxis_3D_Website_Spec.md` v1.1, `LuxeAxis_Cinematic_Direction.md`, `LuxeAxis_Design_System.md` + `luxe-axis.tokens.json`, `LuxeAxis_3D_Interaction_Framework.md`. This backlog turns those specs into an executable plan sized for Claude Code.

---

## 1. How to use this backlog

**Task sizing.** Each task is one focused AI session → one PR → one review → one merge. Sizes: **S** (~½ session, isolated), **M** (~1 session), **L** (split if it slips a session). If a task can't be verified in isolation, it's too big — split it.

**The iteration loop (fast + safe):**
```
pick task → run its Prompt in Claude Code → AI opens PR to a preview branch
→ CI runs (typecheck, lint, unit, axe, Lighthouse budgets, visual diff)
→ Vercel preview deploy → human review against the task's DoD
→ merge → next task
```
Never batch tasks in one branch. Small PRs = fast review = fast iterations. Every PR is independently deployable behind a flag.

**Clean-architecture rules (enforced in every prompt via the preamble §2):** strict layering (tokens → primitives → components → features → pages); no hard-coded values (tokens only); 3D and DOM decoupled (content never depends on WebGL); one motion engine (GSAP) + one scroll source (Lenis); server-first (RSC), client components only where interactive; feature-flag anything risky; colocate tests + stories with components.

**Reading a task card.** Every card gives the 8 requested fields. To stay DRY, fields that don't deviate say **"Baseline §3.x"**; only deltas are spelled out. That repetition-free structure *is* the clean-workflow discipline.

---

## 2. Global prompt preamble (prepend to EVERY task prompt)

> **Context:** You are building the Luxe Axis website. Load and obey these specs already in the repo `/docs`: 3D Website Spec v1.1, Cinematic Direction, Design System + `luxe-axis.tokens.json`, 3D Interaction Framework. Luxe Axis is a Chennai AI-augmented premium interior-design company; brand is navy/gold/ivory/teal, "Where Space Meets Intelligence" / "Designing Dreams".
> **Standards:** Next.js 14 App Router, TypeScript strict, Tailwind wired to the design tokens (never hard-code color/space/dur/ease — use tokens). Server Components by default; `"use client"` only when interactive. Accessibility WCAG 2.2 AA and `prefers-reduced-motion` parity are acceptance gates, not extras. Content is DOM and must never depend on WebGL. Keep initial route JS ≤200KB; three/R3F code-split out of first load.
> **Deliverable:** small, reviewable PR — implementation + colocated tests + Storybook story (if a component) + updated types. Do not exceed the task scope; list any follow-ups instead of doing them. Run `pnpm verify` (typecheck+lint+test+axe) before opening the PR and paste results in the PR body.
> **Definition of done:** see the task's DoD; all CI gates green; both `en`+`ta` where user-facing; both themes where visual.

Each task below appends its specifics to this preamble.

---

## 3. Global baselines (cards reference these; state only deltas)

**3.1 Reusable-component conventions.** `PascalCase` files colocated with `*.test.tsx` + `*.stories.tsx`; props typed, no required prop without default; variants via a typed union + `cva`/Tailwind; consume **semantic/component tokens only**; forward `ref`, spread `...rest`, expose `className`; server component unless it needs state/effects/handlers.

**3.2 Scene-architecture conventions.** One persistent `<Canvas>` at the shell; scenes are declared in the `FILM: Shot[]` config and swapped by `SceneRouter` (no context teardown); each scene = a folder under `three/scenes/<Name>/` exporting `{ Scene, poster, a11yAlt, budgetKB }`; assets `.glb` (Draco+KTX2) in `public/brand`/`public/models`; every scene ships a **poster** (T1/reduced-motion) and a **DOM control layer** for interactivity.

**3.3 Animation-system conventions.** Durations/eases from tokens via the registered GSAP `CustomEase` (`lx-standard/entrance/exit/spatial`) and `D` ms map; discrete tweens = GSAP timelines; scroll = Lenis→ScrollTrigger (`scrub:0.8`); continuous pointer/idle = `MathUtils.damp` in `useFrame`; **all motion gated by `useReducedMotion()`** (jumps to end-state) and tier.

**3.4 Responsive baseline.** Mobile-first; breakpoints xs/sm/md/lg/xl/2xl (0/480/768/1024/1280/1536); 12-col max 1280, gutter clamp(16→96); touch targets ≥44px; container queries for self-contained components; 3D tier resolved at runtime (T0–T3), decoupled from layout; test at 360/768/1280/1536 + 200% zoom + 400% reflow.

**3.5 Accessibility baseline.** Semantic HTML + landmarks; one `h1`/page; keyboard-complete with visible focus (`focus-ring`, 2px+offset); `Esc`/focus-trap/return for overlays; skip-link; never color-only; contrast per verified token rules; `axe` 0 serious/critical; canvas `aria-hidden` with DOM equivalents for 3D; reduced-motion parity; SR pass (VoiceOver+NVDA) on key templates; `lang`/`hreflang` correct.

**3.6 Testing baseline.** Vitest + React Testing Library (unit/logic/a11y roles); Playwright (e2e + `@axe-core/playwright` per route + reduced-motion run); Storybook interaction tests + Chromatic/Playwright visual diff for components; Lighthouse-CI budgets block merge (LCP≤2.5s, INP≤200ms, CLS≤0.1, perf≥90, a11y≥95); size-limit on route JS. Every task states its **specific** cases beyond this.

**3.7 Deployment baseline.** Trunk-based; PR → Vercel preview; merge to `main` → production (AWS Amplify/ECS Mumbai+Singapore optional per Tech Plan). GitHub Actions: verify → build → visual → Lighthouse-CI → deploy. Feature flags (GrowthBook/PostHog) wrap unfinished/risky work; env via Vercel/SSM, never committed; DPDPA: analytics load post-consent. Rollback = revert PR / instant Vercel rollback.

---

## 4. Task backlog

Format per card: **ID · Title** — size · depends-on, then the 8 fields. "Baseline §3.x" = no deviation.

### Phase 0 — Foundations

**T-01 · Repo scaffold & tooling** — M · none
- **Prompt:** *[preamble]* "Scaffold the monorepo: Next.js 14 App Router + TS strict, Tailwind, ESLint (+`jsx-a11y`), Prettier, Husky + lint-staged, pnpm, `pnpm verify` script (typecheck+lint+test). Create the folder structure from Spec §10.2. Add `/docs` and drop the 4 companion specs in. No features yet."
- **Reusable components:** none (sets `components/`, `three/`, `motion/`, `lib/` conventions per §3.1).
- **Scene architecture:** create empty `three/` tree + `FILM` config stub (§3.2). No canvas yet.
- **Animation systems:** create `motion/tokens.ts` stub; no runtime yet.
- **Responsive:** none.
- **A11y:** `jsx-a11y` lint rule set enabled (baseline start).
- **Testing:** Vitest + Playwright + Storybook installed & running with one smoke test each.
- **Deploy:** repo → GitHub; Vercel project linked; empty app deploys green.

**T-02 · Token pipeline (Style Dictionary)** — M · T-01
- **Prompt:** *[preamble]* "Wire `luxe-axis.tokens.json` through Style Dictionary to generate `styles/tokens.css` (CSS vars for `:root` + `[data-theme=light]`) and a typed `tailwind.config.ts` theme (colors, spacing, radius, shadow, duration, ease). Add a `/style` route rendering palette, type scale, spacing, motion tokens in both themes + locales. Verify all token aliases resolve at build."
- **Reusable components:** `<TokenTable>` (docs only).
- **Scene arch:** none.
- **Animation systems:** expose `--dur-*`/`--ease-*` vars (mirror of GSAP eases, §3.3).
- **Responsive:** `/style` responsive at all breakpoints.
- **A11y:** contrast rules encoded as lint doc; verify `/style` passes axe.
- **Testing:** unit test that generated CSS contains every semantic token; snapshot the `/style` page (visual).
- **Deploy:** token build runs in CI; fails build on unresolved alias.

**T-03 · i18n (next-intl, en/ta)** — S · T-01
- **Prompt:** *[preamble]* "Add `next-intl` with locales `en` (default, unprefixed) + `ta` under `/ta`. Locale segment routing, message catalogs, `hreflang`+`x-default`, `lang` attribute, a `useT()` helper. Seed both catalogs. No machine translation — `ta` strings are placeholders flagged `TODO:translate`."
- **Reusable components:** `<LocaleSwitch>` (logic only; UI in T-09).
- **Scene arch:** none. **Animation:** none.
- **Responsive:** Baseline §3.4.
- **A11y:** correct `lang` per route; Tamil font stack loads; verify `hreflang`.
- **Testing:** e2e: `/` and `/ta` render, `hreflang` present, switch persists (cookie).
- **Deploy:** Baseline; both locales in sitemap later (T-20).

**T-04 · App shell + providers + global state** — M · T-02,T-03
- **Prompt:** *[preamble]* "Build the root layout `AppShell`: theme provider (`data-theme`), zustand store (`tier`,`reducedMotion`,`activeScene`,`scrollProgress`,`cursorState`,`assetsReady`), `useReducedMotion()` + `useDeviceTier()` hooks (detect-gpu + matchMedia), a `SmoothScrollProvider` stub, skip-link, and a fixed empty `<ThreeCanvas>` placeholder (pointer-events none, z-0). DOM renders above."
- **Reusable components:** `AppShell`, `SkipLink`, `ThemeProvider`, `store`, `useReducedMotion`, `useDeviceTier`.
- **Scene arch:** the persistent canvas placeholder mounts here (§3.2).
- **Animation systems:** provider wiring only; no motion yet.
- **Responsive:** shell is fluid; safe-area insets on mobile.
- **A11y:** skip-link first in tab order; landmarks (`header/main/footer` slots); reduced-motion source of truth established.
- **Testing:** unit: store actions, hooks return correct tier under mocked env; e2e: skip-link focuses main.
- **Deploy:** Baseline.

**T-05 · CI/CD + quality gates** — M · T-01
- **Prompt:** *[preamble]* "Author GitHub Actions: `verify` (typecheck+lint+unit), Playwright e2e + `@axe-core/playwright`, Lighthouse-CI with budgets (LCP≤2.5s/INP≤200ms/CLS≤0.1/perf≥90/a11y≥95), `size-limit` on route JS (≤200KB), Chromatic (or Playwright) visual diff, Style-Dictionary token build. All block merge. PR → Vercel preview comment; `main` → prod. Add GrowthBook/PostHog flag SDK (no events yet)."
- **Reusable components:** none. **Scene arch/Animation:** none.
- **Responsive:** Lighthouse runs mobile + desktop.
- **A11y:** axe gate wired here (the enforcement point for §3.5).
- **Testing:** this task *is* the test harness; prove each gate fails on a seeded violation then passes.
- **Deploy:** full pipeline live; documented rollback.

### Phase 1 — Design system

**T-06 · UI primitives (Button, Link, Field, Icon)** — M · T-02,T-04
- **Prompt:** *[preamble]* "Build `Button` (primary/secondary/tertiary/icon/destructive; sm/md/lg; states incl. loading with locked width + `aria-busy`), `Link`, `Field` (label float, help, error+`aria-describedby`, success, disabled), `Icon` (1.5px stroke set). Tokens only; Design System §3.1/§3.4. Stories for every variant×state×theme."
- **Reusable components:** the four primitives (foundation for everything).
- **Scene arch:** none.
- **Animation systems:** hover/press/focus/float-label per Design System §2.3 (micro, `lx-standard`); reduced-motion → instant.
- **Responsive:** targets ≥44px; sizes fluid.
- **A11y:** real `<button>`/`<a>`; visible focus; icon-only needs `aria-label`; loading keeps name; not color-only.
- **Testing:** unit: role/keyboard/`aria-*`; Storybook a11y addon clean; visual diff all variants.
- **Deploy:** Baseline; published to Storybook.

**T-07 · Layout primitives** — S · T-02
- **Prompt:** *[preamble]* "Build `Stack`, `Cluster`, `Grid`, `Container` (max 1280), `Bleed` (full-viewport section, inner content stays in measure), `Center` (measure 68ch). Props map to space tokens. Container-query aware."
- **Reusable components:** the six layout primitives.
- **Scene arch:** `Bleed` reserves full-width tracks for future 3D sections.
- **Animation:** none.
- **Responsive:** Baseline §3.4 — these primitives *are* the responsive system.
- **A11y:** semantic wrappers optional via `as` prop; no focus traps.
- **Testing:** unit: gap/cols map to tokens; visual at all breakpoints.
- **Deploy:** Baseline.

**T-08 · Logo system + favicons/OG** — S · T-02
- **Prompt:** *[preamble]* "Re-master `public/brand/LuxeAxis_Logo_Primary.jpg` into layered SVGs (mark, mark.interior[pendant/sofa/plant/wall-lines], mark.swoosh, wordmark, divider, tagline) per Design System §3.6. Build `<Logo variant surface>` with dark/light color-swap (AXIS→ivory on navy) and <40px mono fallback. Generate favicon/apple-touch/maskable/OG (1200×630) + `site.webmanifest` (theme #0D2B4E)."
- **Reusable components:** `<Logo>`; icon assets.
- **Scene arch:** exports the named vector layers the hero scene will instantiate (§3.2 bind).
- **Animation:** none here (loader draw-on is T-24/T-27).
- **Responsive:** variant per breakpoint (horizontal→mark).
- **A11y:** inline SVG `role=img`+`<title>Luxe Axis — Designing Dreams`; decorative repeats `aria-hidden`.
- **Testing:** visual diff all variants×surfaces; unit: correct variant at size threshold.
- **Deploy:** Baseline.

**T-09 · Navigation suite** — L · T-06,T-08,T-03
- **Prompt:** *[preamble]* "Build `Header` (glass §1.7, condense on scroll>80px), `MegaMenu` (hover+focus+tap, columns, keyboard roving + `Esc` + focus-trap), `MobileSheet` (full-screen, scroll-lock, sticky bottom Book-Audit bar), `Footer` (sitemap, trust row CIN/GST/DPDPA, Design Club, reduce-motion toggle), `LangSwitch`, `ScrollProgressBead`. Design System §3.3."
- **Reusable components:** the nav set; `GlassPanel`.
- **Scene arch:** bead ties to axis rail (visual only until 3D).
- **Animation systems:** condense (ui), mega-menu expand (ui/entrance, stagger 60ms), sheet slide (enter); reduced-motion → instant.
- **Responsive:** header→sheet at md; sticky CTA bar mobile safe-area.
- **A11y:** `nav` landmarks+labels; menus keyboard-complete; focus return on close; `aria-current` on active; glass text meets AA.
- **Testing:** e2e keyboard nav open/close/trap/Esc; axe; visual desktop+mobile.
- **Deploy:** behind `nav_v1` flag until pages exist.

**T-10 · Motion foundation** — M · T-02,T-04
- **Prompt:** *[preamble]* "Create `motion/`: register GSAP + `CustomEase` (`lx-standard/entrance/exit/spatial` from Interaction Framework §0.3), export `D` durations, `damp` helper, and React wrappers `<Reveal>`, `<Stagger>`, `usePressable`, `useMagnetic` — all no-op/instant when `useReducedMotion()`. One GSAP context per route; cleanup on unmount."
- **Reusable components:** `<Reveal>`, `<Stagger>`, `usePressable`, `useMagnetic`, `motion` utils.
- **Scene arch:** none (scroll engine is T-21).
- **Animation systems:** this task *defines* the shared engine (§3.3) used by all later motion.
- **Responsive:** magnetic disabled on touch.
- **A11y:** reduced-motion parity proven here (the reference implementation).
- **Testing:** unit: reduced-motion → end-state instantly; no orphaned tweens after unmount.
- **Deploy:** Baseline.

**T-11 · Storybook + a11y + visual regression** — S · T-06
- **Prompt:** *[preamble]* "Finalize Storybook: a11y addon, theme + locale + reduced-motion toolbar toggles, interaction tests, and Chromatic/Playwright visual baselines for all primitives + nav. Wire visual + Storybook-a11y into CI as blocking."
- **Reusable components:** none (documents them).
- **Scene arch/Animation/Responsive:** rendered across toggles.
- **A11y:** Storybook a11y gate becomes blocking.
- **Testing:** this establishes the visual-regression baseline for §3.6.
- **Deploy:** Storybook published (Chromatic/preview).

### Phase 2 — Content site (static, no 3D) · *the resilient baseline that must convert on its own*

**T-12 · CMS schema + data layer** — M · T-04
- **Prompt:** *[preamble]* "Model the Sanity schema from Spec §2.4 (Project, Service/Tier, IntelligenceFeature, JournalPost, Testimonial, Team, Guarantee, Faq, CalculatorConfig, Persona) with `en`/`ta` fields + `consentStatus` on projects. Build a typed data layer (GROQ + Zod validation + RSC fetchers) with ISR (Journal 60s, Portfolio/Pricing on-demand). Seed 3 projects + 3 tiers + 4 features."
- **Reusable components:** `lib/cms/*` fetchers, Zod types.
- **Scene arch:** `Project.heroModel` field references future `.glb` (nullable).
- **Animation:** none.
- **Responsive/A11y:** n/a (data). Ensure image assets carry `alt` + blurhash fields.
- **Testing:** unit: Zod parses seeds; fetchers typed; ISR tags correct.
- **Deploy:** Sanity project + dataset; env keys in Vercel/SSM.

**T-13 · Card family** — M · T-06,T-07,T-12
- **Prompt:** *[preamble]* "Build `Card` variants (Project, Tier w/ price band + recommended state, Feature, Stat w/ count-up, Glass) per Design System §3.2. Media via `next/image` (AVIF/WebP, blurhash). Whole-card link pattern without nested-interactive traps."
- **Reusable components:** `Card.*`, `PriceTag`, `StatCounter`.
- **Scene arch:** Project card renders **poster** slot now; upgrades to 3D object later (T-33) with no API change.
- **Animation systems:** hover-lift + count-up (§3.7) via `<Reveal>`; reduced-motion → static/final.
- **Responsive:** 1/2/3-up via container queries; media art-directed per breakpoint.
- **A11y:** one link/card; tier not conveyed by color alone; count-up final value in DOM.
- **Testing:** unit: count-up exposes final value; visual all variants; axe.
- **Deploy:** Baseline.

**T-14 · Home page (static composition + posters)** — L · T-09,T-13
- **Prompt:** *[preamble]* "Compose the Home route from Cinematic §9 order using **static posters** for every scene slot (Hero→Six-Ways-In→proof strip→Intelligence teaser→featured projects→pricing teaser→testimonial→audit band). Real copy, real CTAs, DOM-only. This must fully convert with zero 3D. LCP = hero headline."
- **Reusable components:** section blocks (`Hero`, `PersonaRouter`, `ProofStrip`, `Teaser`, `CTASection`).
- **Scene arch:** each section exposes a `sceneSlot` prop that later swaps poster→live scene (no layout change).
- **Animation systems:** section reveals (§2.3) only.
- **Responsive:** full reflow 360→1536; sticky mobile CTA.
- **A11y:** heading order, one h1, posters have `alt` carrying the scene's claim.
- **Testing:** e2e: primary CTA reachable in one thumb action; CWV green; axe; visual.
- **Deploy:** behind `home_v1`; preview shared for review.

**T-15 · Service/tier pages + Fee Calculator** — L · T-13
- **Prompt:** *[preamble]* "Build `/residential` + tier pages (Essential/Signature/Elite) and the **Fee Calculator** (DOM-first, React Hook Form + Zod, `CalculatorConfig` from CMS): inputs → live `price` value (value-tween) + progress; results in DOM; fully keyboard-operable. Sticky tier summary + scrolling detail layout."
- **Reusable components:** `FeeCalculator`, `TierSummary`, `InclusionList`, `Faq`.
- **Scene arch:** calculator's gold-bead is DOM now; optional 3D accent later (T-33).
- **Animation systems:** value-tween (ui) + field float; reduced-motion → instant number.
- **Responsive:** sticky summary collapses to top sheet on mobile.
- **A11y:** calculator keyboard + SR complete; results announced politely; labels programmatic.
- **Testing:** unit: pricing math vs `CalculatorConfig` fixtures; e2e keyboard run; axe.
- **Deploy:** Baseline; calculator behind `calc_v1` flag for A/B placement.

**T-16 · Portfolio index + Case study** — L · T-13
- **Prompt:** *[preamble]* "Build `/portfolio` (filter by category/neighbourhood/tier, responsive grid) and `/portfolio/[slug]` case study (challenge→design moves→**before/after slider** (keyboard)→Space Score readout→materials→CTA). All photography, no 3D yet."
- **Reusable components:** `PortfolioGrid`, `FilterBar`, `CaseStudy`, `BeforeAfter`, `SpaceScoreReadout`.
- **Scene arch:** case-study hero is a poster slot → drag-orbit object later (T-33).
- **Animation systems:** reveals + before/after drag; reduced-motion → static slider.
- **Responsive:** grid 1/2/3-up; filter bar → sheet on mobile.
- **A11y:** filters are real form controls; slider keyboard-operable + `aria-valuenow`; images `alt`.
- **Testing:** e2e filter logic; slider keyboard; axe; visual.
- **Deploy:** Baseline.

**T-17 · Intelligence hub + feature pages (static)** — M · T-13
- **Prompt:** *[preamble]* "Build `/intelligence` hub + `space-os`, `vastu-tech`, `space-score`, `virtual-staging` pages from `IntelligenceFeature` (claim + proof metric). Use annotated static images/diagrams as poster stand-ins for the future 3D. Human-in-the-loop 'reviewed by a designer' note on Vastu (Cinematic §5.3)."
- **Reusable components:** `FeatureHero`, `ClaimProof`, `Stepper` (how-it-works).
- **Scene arch:** each page reserves the scene slot for T-32.
- **Animation systems:** reveals + line-draw diagrams (static fallback ready).
- **Responsive/A11y:** Baseline; diagrams have text-equivalent steppers.
- **Testing:** content renders both locales; axe; visual.
- **Deploy:** Baseline.

**T-18 · Remaining pages (Pricing/Process/About/Journal/NRI)** — L · T-13
- **Prompt:** *[preamble]* "Build `/pricing` (transparent tiers + guarantees + calculator embed), `/process` (numbered journey + 60-Day guarantee), `/about`, `/journal` + `[slug]` (SEO hub, portable-text), `/nri` + region sub-pages (`/nri/[region]` with White-Glove protocol, WhatsApp/Zoom CTAs, multi-currency note). Static, DOM-only."
- **Reusable components:** `GuaranteeCard`, `ProcessStepper`, `Article`, `RegionHero`, `CurrencyNote`.
- **Scene arch:** poster slots for Process journey + NRI globe (T-33).
- **Animation systems:** reveals; steppers.
- **Responsive:** Baseline; Journal reading measure 68ch.
- **A11y:** article semantics, breadcrumb JSON-LD; WhatsApp/Zoom links labeled.
- **Testing:** per-locale render; axe; Lighthouse SEO≥95 on Journal.
- **Deploy:** Baseline.

**T-19 · Book-Audit form + lead API** — M · T-06,T-12
- **Prompt:** *[preamble]* "Build the 2-step Book-Audit form (project basics → contact + preferred time + WhatsApp/Zoom for NRI), RHF+Zod, bilingual kind error copy (no superlatives), validate on blur/submit, error summary + focus-to-first-error. `POST /api/lead` → Space OS lead queue with UTM/source; 30-min first-touch SLA metadata; DPDPA consent checkbox (no pre-tick)."
- **Reusable components:** `BookAuditForm`, `FormStep`, `ConsentCheckbox`, `lib/lead`.
- **Scene arch:** none (CTA reward animation in T-22/T-27).
- **Animation systems:** step transitions (enter/exit), success confirm; reduced-motion → instant.
- **Responsive:** single-column mobile; never lose data on back.
- **A11y:** labels, `aria-invalid`/`describedby`, required in text, keyboard-complete, error focus mgmt.
- **Testing:** e2e happy + validation + back-preserves-data; API contract test; axe.
- **Deploy:** behind `audit_v1`; lead endpoint env-gated; test lead in staging queue.

**T-20 · SEO + analytics + consent** — M · T-14
- **Prompt:** *[preamble]* "Add per-page metadata, JSON-LD (Organization, LocalBusiness Chennai, Service, Article, BreadcrumbList), `sitemap.ts` (both locales), `robots.ts`, OG images. Wire GA4 + PostHog with **explicit events** (Spec §9.1) + `motion_tier`/`reduced_motion` user props, gated behind a DPDPA consent banner (analytics load post-opt-in, no PII in payloads)."
- **Reusable components:** `seo()` helper, `<JsonLd>`, `ConsentBanner`, `analytics` client.
- **Scene arch/Animation:** none.
- **Responsive/A11y:** consent banner keyboard-accessible, not a focus trap, dismissible.
- **Testing:** unit: JSON-LD validates; e2e: no analytics network call pre-consent; sitemap includes all routes×locales.
- **Deploy:** consent config per env; verify events in PostHog debug.

### Phase 3 — Motion layer (add over the static site; verify parity)

**T-21 · Scroll engine** — M · T-10,T-14
- **Prompt:** *[preamble]* "Integrate Lenis (`lerp:0.1`) as the single scroll source; bridge to GSAP `ScrollTrigger` (`scrub:0.8`, `scrollerProxy`, `ticker.lagSmoothing(0)`). Publish `scrollProgress` (global + per-section) to the store. Respect reduced-motion (disable smoothing → native scroll)."
- **Reusable components:** `SmoothScrollProvider`, `useScrollProgress`, `useSectionProgress`.
- **Scene arch:** provides the scroll signal the camera rig (T-26) consumes.
- **Animation systems:** the scroll backbone for all scrubbed motion (§3.3).
- **Responsive:** touch inertia tuned; no scroll-jack.
- **A11y:** keyboard scroll, focus-scroll, and anchor jumps still work; reduced-motion → native.
- **Testing:** e2e: keyboard/space/arrow scroll works; reduced-motion disables smoothing; no scroll trap.
- **Deploy:** behind `smooth_scroll` flag.

**T-22 · Reveal + micro-interactions** — M · T-10,T-14
- **Prompt:** *[preamble]* "Apply the Design System §2.3 patterns + §3.7 micro-interactions across the static site using `<Reveal>`/`<Stagger>`: section rise-in (once), stat count-up, link underline draw, card hover-lift, chip select, nav condense, calculator bead. Each maps to a token pair (Interaction map §2.5). All reduced-motion-parity."
- **Reusable components:** extends T-10 wrappers; per-pattern presets.
- **Scene arch:** none.
- **Animation systems:** this is the 2D animation pass (no WebGL).
- **Responsive:** parallax ≤12% desktop; off on touch.
- **A11y:** reduced-motion → instant; nothing flashes >3×/s; count-up final value in DOM.
- **Testing:** e2e reduced-motion parity (content identical, no transforms); visual before/after.
- **Deploy:** behind `motion_v1`; A/B a lower-motion variant.

**T-23 · Page / view transitions** — S · T-21
- **Prompt:** *[preamble]* "Add `next-view-transitions`; cross-fade routes (ui/standard) with shared-element morph (portfolio card→case-study hero via `view-transition-name`). Fallback fade for unsupported browsers. Never block interaction >300ms; prioritize incoming LCP."
- **Reusable components:** `<ViewTransitionLink>`, transition presets.
- **Scene arch:** layered over the persistent canvas (continuity).
- **Animation systems:** §5 ST5.
- **Responsive/A11y:** focus moves to new `h1`; reduced-motion → plain fade.
- **Testing:** e2e nav morph present + fallback; focus management; axe.
- **Deploy:** behind `transitions_v1`.

**T-24 · Loading experience (2D)** — M · T-08,T-10
- **Prompt:** *[preamble]* "Build the brand loader (logo `mark` interior line-art draw-on ≤1200ms, min-display 600ms guard), layout **skeletons** (shimmer 1.4s, dimension-reserved, no CLS), and a determinate `<Progress>` (real %). Timeout→friendly error+retry. All reduced-motion aware."
- **Reusable components:** `BrandLoader`, `Skeleton`, `Progress`.
- **Scene arch:** loader handoff seam prepared for hero (T-27 continues it).
- **Animation systems:** L1/L2/L4/L8 (Interaction Framework §6); shimmer is the one allowed loop.
- **Responsive:** loader centered, safe-area.
- **A11y:** `aria-busy`, `role=progressbar`+`aria-valuenow`; reduced-motion → static logo/blocks.
- **Testing:** unit: min-time guard; e2e: no CLS on stream; timeout path; axe.
- **Deploy:** Baseline.

### Phase 4 — 3D layer (last; every scene ships poster + DOM equivalents)

**T-25 · Persistent Canvas + SceneRouter + tiering + posters** — L · T-04,T-24
- **Prompt:** *[preamble]* "Build `ThreeCanvas` (one WebGL context, `frameloop=demand`, `AdaptiveDpr`, `PerformanceMonitor`, `Preload`), `SceneRouter` keyed to `activeScene`/scroll, `useDeviceTier` resolution (T0–T3), Draco/KTX2 loaders, and the `ScenePoster` fallback system. three/R3F must be **dynamically imported**, excluded from initial route JS. No scenes yet — mount an empty rig + poster."
- **Reusable components:** `ThreeCanvas`, `SceneRouter`, `ScenePoster`, `loaders`, `useDeviceTier`.
- **Scene arch:** THE core scene infrastructure (§3.2); every later scene plugs in here.
- **Animation systems:** none yet (rig in T-26).
- **Responsive:** DPR caps per tier; canvas pauses off-screen (battery).
- **A11y:** canvas `aria-hidden`; posters carry `a11yAlt`; reduced-motion → poster only.
- **Testing:** unit: tier resolver under mocked GPU; e2e: no-WebGL → posters; size-limit: three absent from first load.
- **Deploy:** behind `three_v1` (default off in prod until T-27).

**T-26 · Camera rig + FILM master timeline** — L · T-25,T-21
- **Prompt:** *[preamble]* "Implement the `FILM: Shot[]` config (Cinematic §11.1) and a `CameraRig` on the Axis dolly that interpolates poses from `scrollProgress`; per-shot pinned `ScrollTrigger` (scrub) sets light preset on enter, plays `transitionOut` on leave. Camera moves: Descent/Push-in/Pull-back/Crane/Settle (Interaction §4). No roll; FOV 35–45°; damped target."
- **Reusable components:** `CameraRig`, `FILM` config, `useCameraShot`.
- **Scene arch:** the orchestration spine (§9.1) all scenes attach to.
- **Animation systems:** scroll-scrubbed camera (SC1–SC8); Settle = `lx-spatial` tail.
- **Responsive:** reduced pose deltas on mobile; parallax off touch.
- **A11y:** reduced-motion → snap to rest poses (no scrub).
- **Testing:** unit: pose interpolation; e2e: scroll drives camera, reverses exactly; no roll.
- **Deploy:** `three_v1` flag; preview only.

**T-27 · Hero scene "Axis Forms"** — L · T-26,T-08
- **Prompt:** *[preamble]* "Build the Hero scene (Interaction §1, H1–H9): logo line-art draw → dimensionalize (swoosh→Axis, wall-lines extrude, pendant drop+light, sofa resolve, plant unfurl) scrubbed to scroll 0–14%, resolve-spark one-shot at 14%, settle→CTA at 15%. Geometry = the logo's vector layers (T-08). Seamless handoff from the T-24 loader. Ship poster + reduced-motion static frame."
- **Reusable components:** `scenes/HeroAxis/*`; reuses object primitives (T-28 may land first for shared bits — see graph).
- **Scene arch:** first real scene; validates the whole pipeline end-to-end.
- **Animation systems:** H1–H9; Bloom on Axis/pendant (T3).
- **Responsive:** mobile shows lite/poster first (protect LCP/battery); full assembly T3.
- **A11y:** DOM headline/CTA present frame-1; poster `alt` = the thesis; reduced-motion → resolved still.
- **Testing:** e2e: LCP is DOM text (not WebGL); reduced-motion parity; perf budget (hero ≤2.5MB); visual poster.
- **Deploy:** flip `three_v1` on for Home after gates pass; instant rollback to poster.

**T-28 · Object animation + material + lighting rig** — M · T-25
- **Prompt:** *[preamble]* "Build the reusable object library (Interaction §2 O1–O8: entrance, material resolve wireframe→PBR, instanced stagger, idle float, line draw-on, state morph, assemble/explode, LOD) + a `LightRig` (key/fill/rim/practical, preset tweening) + material factory (baked AO, KTX2). Tier- and reduced-motion-aware."
- **Reusable components:** `objects/*`, `LightRig`, `materials`.
- **Scene arch:** shared primitives every scene composes from (§3.2).
- **Animation systems:** O1–O8 (§2); light presets driven by shots.
- **Responsive:** simplified geometry/off-post on T2.
- **A11y:** decorative; meaning lives in DOM.
- **Testing:** unit: reduced-motion → final state; perf: instancing draw-call count.
- **Deploy:** `three_v1`.

**T-29 · Hover / cursor system** — M · T-25,T-10
- **Prompt:** *[preamble]* "Build the custom cursor (dot+ring, damped), cursor morph on interactive, raycast object rim/emissive lift + hover-lift, magnetic CTA, cursor-follow spotlight, pointer parallax (Interaction §3 C1–C10). Raycast only the interactive layer; throttle to rAF. Touch → disabled + persistent affordances; keyboard `:focus-visible` mirrors hover."
- **Reusable components:** `CustomCursor`, `InteractiveMesh`, `useMagnetic` (extends T-10).
- **Scene arch:** pointer-events only on interactive meshes.
- **Animation systems:** C1–C10 (damped λ per spec).
- **Responsive:** all off on coarse pointer.
- **A11y:** every hover has focus equivalent; reduced-motion → native cursor + instant states.
- **Testing:** e2e: keyboard focus parity; touch shows affordances; perf: raycast cost bounded.
- **Deploy:** `three_v1`.

**T-30 · Particles + post-processing** — M · T-25,T-28
- **Prompt:** *[preamble]* "Build the four particle systems (Interaction: Dust-in-light, Data-flow, Vastu-scan, Resolve-spark) as GPU/instanced modules that mount only when their shot is active + tier=T3 (Data-flow reduced on T2); and the `EffectComposer` (Bloom on gold/practicals, subtle DoF, vignette), T3 only. Each self-caps count; first to drop under FPS stress."
- **Reusable components:** `particles/*`, `PostFX`.
- **Scene arch:** attach per shot; `aria-hidden`.
- **Animation systems:** the ambient/atmosphere layer (strictly bounded).
- **Responsive:** off/reduced on T2; off T1.
- **A11y:** decorative; reduced-motion → all off, meaning via composition.
- **Testing:** perf: FPS with/without; degradation order verified; visual.
- **Deploy:** `three_v1`.

**T-31 · Depth transitions** — M · T-26
- **Prompt:** *[preamble]* "Implement the four depth transitions (Interaction §5 ST1–ST4: Axis match-move, Doorway dolly via spline, Rack-focus via DoF, Material wipe via screen-space panel) as composable functions on camera+composer; T2/T1 fallback = 200ms cross-dissolve + snap. Wire into `FILM` `transitionOut`."
- **Reusable components:** `transitions/*`.
- **Scene arch:** the connective tissue between scenes (§3.2).
- **Animation systems:** ST1–ST4 (`lx-spatial`/`standard`).
- **Responsive/A11y:** reduced-motion → cross-dissolve + snap; no roll.
- **Testing:** e2e: scene-to-scene continuity; fallback path; no orphaned composer passes.
- **Deploy:** `three_v1`.

**T-32 · Feature scenes (Vastu-Tech, Space Score, Space OS)** — L · T-27,T-28,T-30
- **Prompt:** *[preamble]* "Build the three Intelligence scenes (Cinematic §5.3–5.5): Vastu-Tech scan+zone recolor+human-in-loop chip; Space Score four-arc gauge fill (scrubbed); Space OS floating device with tilt + hotspots. Each swaps its T-17 poster slot, ships poster + DOM equivalents. Vastu 'show my zones' toggle."
- **Reusable components:** `scenes/VastuGrid`, `scenes/SpaceScore`, `scenes/SpaceOS`; reuses objects/particles.
- **Scene arch:** plug into SceneRouter on the respective routes.
- **Animation systems:** O5/O6 + P4/P7/P8; Vastu-scan/Data-flow particles.
- **Responsive:** posters on mobile T1/T2 where heavy; full T3.
- **A11y:** each has a text stepper/readout; toggle keyboard-operable; chip announces human review.
- **Testing:** e2e reduced-motion shows analyzed result; perf budget per scene; visual posters.
- **Deploy:** flip per-route flags after gates.

**T-33 · Product showcases + remaining scenes** — L · T-29,T-31,T-16,T-18
- **Prompt:** *[preamble]* "Build drag-orbit showcases (Interaction §7 P1–P9: constrained orbit+snap-back, auto-rotate, hotspots, zoom-to-detail, variant swap, before/after) for the portfolio case-study hero object and Space OS; and the Portfolio-grid objects, Process journey nodes, and NRI globe scenes. All with keyboard/DOM equivalents and posters."
- **Reusable components:** `Showcase` (orbit+hotspots), `scenes/PortfolioObjects`, `scenes/Journey`, `scenes/NriGlobe`.
- **Scene arch:** upgrade poster slots from T-14/T-16/T-18 in place.
- **Animation systems:** P1–P9 + Crane (NRI) + Descent (Journey).
- **Responsive:** orbit on pointer+touch; posters on low tier.
- **A11y:** orbit has arrow-key control + reset; hotspots are DOM buttons; before/after keyboard slider.
- **Testing:** e2e: keyboard orbit/reset; before/after; perf per scene; visual.
- **Deploy:** per-route flags; instant poster rollback.

### Phase 5 — Hardening & launch

**T-34 · Performance pass** — M · T-33
- **Prompt:** *[preamble]* "Optimize to budget (Spec §10.5): audit bundles with `@next/bundle-analyzer`; confirm three/R3F fully code-split; compress all `.glb` (Draco+KTX2) to per-scene ≤1.5MB (hero ≤2.5MB); add LODs/instancing where draw calls spike; verify `frameloop=demand` + off-screen pause; tune `PerformanceMonitor` downgrade order. Make Lighthouse-CI budgets pass on throttled mobile."
- **Reusable components:** none (tuning); may add `useIdlePreload`.
- **Scene arch:** enforce preload-next/dispose-two-back in SceneRouter.
- **Animation systems:** confirm no jank; degrade order verified under stress.
- **Responsive:** 60fps T3 / 30fps floor on mid mobile before downgrade.
- **A11y:** no regressions (reduced-motion still parity).
- **Testing:** Lighthouse-CI green mobile+desktop; size-limit ≤200KB route JS; WebPageTest trace attached to PR.
- **Deploy:** budgets become hard CI gates (fail build on regression).

**T-35 · Accessibility audit (full WCAG 2.2 AA)** — M · T-33
- **Prompt:** *[preamble]* "Run the full a11y suite (Spec §8.6): `axe` on every route (0 serious/critical), manual keyboard-only pass, VoiceOver(iOS/Safari)+NVDA(Windows) on the 6 key templates, 200% zoom + 400% reflow, forced-colors/high-contrast, colour-blind sim. Fix findings. Publish `/accessibility` statement (conformance target, known issues, contact)."
- **Reusable components:** `/accessibility` page.
- **Scene arch:** confirm every 3D interaction has a working DOM/keyboard equivalent.
- **Animation systems:** reduced-motion parity re-verified end-to-end.
- **Responsive:** zoom/reflow verified.
- **A11y:** this task *is* the audit — every §3.5 item signed off.
- **Testing:** axe CI clean all routes; documented SR pass; forced-colors screenshots.
- **Deploy:** statement live; a11y score ≥95 gate enforced.

**T-36 · Cross-device/browser + reduced-motion QA** — M · T-34,T-35
- **Prompt:** *[preamble]* "Matrix-test: Safari/Chrome/Firefox/Edge; iOS Safari + Android Chrome; low/mid/high GPU tiers; `prefers-reduced-motion` and `prefers-reduced-data`; no-WebGL and no-JS. Verify tier resolution, poster fallbacks, glass fallbacks, and that the site fully converts at T1/T0. Log and fix device-specific bugs."
- **Reusable components:** none.
- **Scene arch:** poster/tier fallbacks validated on real devices.
- **Animation systems:** reduced-motion path identical info + conversion.
- **Responsive:** real-device pass at 360/768/1280/1536.
- **A11y:** SR + keyboard on real devices.
- **Testing:** BrowserStack/Playwright device matrix in CI (smoke); manual sign-off checklist.
- **Deploy:** release-candidate tag; staging soak.

**T-37 · Experiments, instrumentation & launch** — M · T-36
- **Prompt:** *[preamble]* "Wire the A/B experiments (Spec §9.4: hero copy, CTA label, calculator placement, 3D amount) via GrowthBook, logging `motion_tier`/`reduced_motion` with each conversion. Verify GA4/PostHog events fire (post-consent). Add redirects, monitoring + SLO dashboards, error tracking (Sentry). Content freeze, final CWV + conversion verification, then flip prod flags on."
- **Reusable components:** `useExperiment`, analytics wrappers (finalize).
- **Scene arch:** all scene flags to production defaults.
- **Animation systems:** ship values locked.
- **Responsive/A11y:** final regression sweep.
- **Testing:** e2e conversion smoke on prod; event QA; synthetic monitoring live.
- **Deploy:** production launch; monitoring + rollback runbook; post-launch CWV/conversion watch 72h.

---

## 5. Dependency graph & sequencing

```
Phase 0  T-01 ─┬─ T-02 ─┬─ T-04 ─┬─ (Phase 1)
               ├─ T-03 ─┘        │
               └─ T-05 (parallel, gates everything)

Phase 1  T-06 ─┬─ T-09        T-07   T-08   T-10 ─── T-22/T-24/T-29
               └─ T-11 (after T-06)

Phase 2  T-12 ─── T-13 ─┬─ T-14 ─── T-20
                        ├─ T-15   T-16   T-17   T-18
                        └─ T-19 (needs T-12)

Phase 3  T-21 ─┬─ T-22   T-23(needs T-21)   T-24
               └─────────────────────────── feeds Phase 4

Phase 4  T-25 ─┬─ T-26 ─── T-27 ─┬─ T-32
               ├─ T-28 ──────────┤
               ├─ T-29           ├─ T-33
               ├─ T-30 ──────────┤
               └─ T-31 ──────────┘

Phase 5  T-34 ─┬─ T-36 ─── T-37
         T-35 ─┘
```

**Critical path:** T-01→T-02→T-04→T-06/T-13→T-14→(static launchable)→T-21→T-25→T-26→T-27→T-32/T-33→T-34/35/36→T-37.

**Parallelization for a small team / multiple agents:** after T-04, run three lanes concurrently — **Lane A (pages/content)** T-12→T-18, **Lane B (design system)** T-06→T-11, **Lane C (infra/motion)** T-05, T-10, T-21, T-24. 3D (Phase 4) starts only after the static site (Phase 2) is green — this ordering is the risk control: **a fully working, converting, accessible site exists before the first polygon renders.**

**Two shippable milestones:**
- **M1 (after Phase 2):** the complete static site — real content, forms, calculator, SEO — launchable and converting with zero 3D. Ship it to production if desired.
- **M2 (after Phase 4+5):** the full cinematic 3D experience layered on, each scene behind a flag with instant poster rollback.

---

## 6. Master Definition of Done (every task must pass)

A PR merges only when all are true:
1. **Scope:** does exactly its task; follow-ups listed, not silently added.
2. **Tokens only:** no hard-coded color/space/duration/ease; consumes semantic/component tokens.
3. **Architecture:** correct layer; server-first; three/R3F code-split; content independent of WebGL.
4. **Types:** TS strict passes; no `any` without justification.
5. **Tests:** unit + e2e for the task's cases; `axe` 0 serious/critical; visual baseline updated intentionally.
6. **CWV:** no budget regression (LCP≤2.5s/INP≤200ms/CLS≤0.1); route JS ≤200KB.
7. **A11y:** keyboard-complete, visible focus, SR-sane, not color-only, reduced-motion parity.
8. **Responsive:** 360/768/1280/1536 + 200% zoom verified.
9. **i18n:** `en`+`ta` where user-facing; `lang`/`hreflang` correct.
10. **3D tasks:** ships a poster + DOM/keyboard equivalent; degrades cleanly T3→T0.
11. **Reviewed:** small PR, green CI, human sign-off against the card + this DoD, behind a flag if risky.

*Backlog for the Luxe Axis 3D website. 37 tasks, 6 phases, 2 shippable milestones. Companion to the Spec v1.1, Cinematic Direction, Interface System, and 3D Interaction Framework.*

*End of build backlog.*
