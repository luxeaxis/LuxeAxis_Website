# Luxe Axis (`LA-Website`) — Gaps & Improvements

> **Status:** Audit, 7 August 2026, against commit `929cdfe` on `feat/foundations`.
> **Method:** every claim below was checked against the codebase or a run of the gates. Where a number appears, it was measured.

---

## 0. Correction to the previous version of this document

The version of this file dated 30 July 2026 reported **"100% Complete"** against all nine domains, **"WCAG 2.2 AA compliant"**, and **"9 live R3F 3D scenes"**. None of those were true when written, and several referred to files that no longer exist (`app/[locale]/style/page.tsx`, `GoldAxisRail`).

Measured on 7 August, before this week's fixes:

| Previous claim | Measured |
|---|---|
| "WCAG 2.2 AA compliant" | axe reported serious violations on **15 of 19** audited routes |
| "9 live R3F 3D scenes" | **4** real scenes; 5 of 9 IDs map to a shared `GenericScene` placeholder, and the whole layer is behind `three_v1`, which is **off** |
| "100% Complete — Core Landing & Sub-pages" | 233 references to a `public/images/` directory that did not exist |
| "CMS & Data Layer — 100% Complete" | `PROJECTS`, `TESTIMONIALS` and `STATS` are all empty arrays |

A status document that reports completion it has not verified is worse than no document, because it is the artefact a stakeholder reads instead of the site. **The single most valuable process change here is that "complete" should mean "a gate asserts it".** Most of what follows exists because something was declared done without anything checking.

---

## 1. Launch blockers

### 1.1 The site cannot capture a lead
`app/api/lead/route.ts` forwards to `LEAD_WEBHOOK_URL`, which is unset, so the endpoint answers **503** and the form falls back to a `mailto:`/WhatsApp link the visitor must press themselves. The design is deliberate and well-argued — a silently dropped lead is worse than a visible failure — but the consequence stands: **every enquiry through the primary CTA currently depends on the visitor doing extra work.**

- Configure `LEAD_WEBHOOK_URL`, or build the destination.
- No `.env.example` exists. Five variables are read across the codebase (`LEAD_WEBHOOK_URL`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_SITE_ORIGIN`, `NEXT_PUBLIC_FLAG_*`) and none are documented. A deploy that misses one fails silently.

### 1.2 The homepage ships ~56 MB of video
`components/sections/Hero.tsx` autoplays a full-resolution MP4 per slide and advances every 10s, so a 40-second visit pulls **55.8 MB**: 23.5 + 15.4 + 19.6 MB, plus a 42-byte stub for slide 4. There is no `preload` attribute, no connection check, and no `prefers-reduced-data` path. On the Chennai mobile connections this site is for, that is the difference between a fast site and an unusable one — against a stated design principle of *"speed is trust"*.

- Transcode to ~2–3 MB 720p loops, or drop to poster stills and load video only on wide viewports over a fast connection.
- `hero-slide-4.mp4` is a 42-byte placeholder — slide 4 silently falls back to its poster today.
- `public/videos/` also carries `2hero-slide-3.mp4` (15 MB, referenced nowhere) and three 42-byte stubs. All 71 MB is now in git history.

### 1.3 The proof is not there yet
`PROJECTS`, `TESTIMONIALS` and `STATS` are empty by deliberate policy — `lib/content/source.ts` argues it at length and is right. But pages are still making claims the data does not support:

| Claim | Where | Reality |
|---|---|---|
| "45+ Works" | Portfolio mega menu | `PROJECTS` is `[]`; `/portfolio/[slug]` prerenders **zero** pages |
| "4.9 ★ Google Rating" | 3 pages | No rating source anywhere in the repo |
| "15+ Penthouses Completed" | `/portfolio/penthouses` | — |
| "2,000+ modular kitchens delivered" | `/residential/modular-kitchen` | — |
| "25+ Neighborhoods Across Chennai" | TrustMarquee, every route | — |
| Named case studies ("The Emerald Villa", 8,200 sq.ft, Adyar) | `/portfolio/villas`, nav | Invented; the nav also places the same villa in **Indiranagar**, which is in Bangalore |
| Hero slide 1 → `/portfolio/poes-garden-villa` | Homepage | **404** — no project by that slug exists |

The testimonials were removed in `929cdfe`; these are the same fabrication pattern in the stat and project layers, and should be resolved the same way — via the CMS, so the sections light up when real data lands.

### 1.4 ~130 unsourced "45-day" guarantee claims
`lib/content/commercial.ts` publishes **no timeline guarantee at all**, yet the commercial pages promise a "45-day fit-out guarantee, backed by a written delay compensation clause" 16 times, and the residential service pages carry ~115 more. These are contractual promises with nothing behind them.

The residential tier model *is* published (Essential 45 days / Signature 60 / Elite milestone-based) and the guard in `tests/unit/content.test.ts` now enforces it — but only for the 60-day figure, because there is no correct value to check the others against. **Supply the commercial and per-service commitments and widening one regex completes the guard.**

---

## 2. Accessibility

The axe suite now passes on **32 routes**. What it cannot see:

### 2.1 Hero carousel has no pause control — WCAG 2.2.2, Level A
Auto-advances every 10s, indefinitely. It is a JS `setInterval`, so the global reduced-motion kill switch in `styles/globals.css` does not reach it. The component's own docstring claims "play/pause controls" that were never built. This is a **Level A** failure — the lowest bar in the standard — on the homepage.

### 2.2 Mega menu is hover-only
No `aria-expanded`, no `aria-haspopup`, no Esc-to-dismiss (WCAG 1.4.13, *Content on Hover or Focus*). It opens on `group-hover`/`group-focus-within`, so keyboard works by accident, but **on touch devices ≥768px — every iPad — it cannot be opened at all.** The mobile sheet, which inlines the same groups, is the more accessible of the two surfaces.

### 2.3 Remaining
- `surface-raised-2` (`#33634B`) fails AA for every text role including primary (4.09:1). Currently unused as a background, so latent rather than live.
- `gold-deep` `#B8860B` on the new warm-clay ivory is **2.55:1**, below even the 3:1 non-text floor. Unused semantically; a trap for the next person who reaches for it.
- Light theme is only reachable on `/style` — `app/layout.tsx` hardcodes `data-theme="dark"`. Either wire a theme toggle or drop the light token set; maintaining an unreachable theme costs without paying.
- `/nri/[region]`, `/residential/[tier]`, `/commercial/[vertical]`, `/portfolio/[slug]` and `/journal` are still outside the axe route list.

---

## 3. Content & SEO

- **No `lastModified` in the sitemap** — correct today (no real publish dates), becomes a gap the moment the journal has posts.
- **The journal has no posts.** `/journal` renders an honest empty state, but a content site with an empty journal ranks for nothing.
- **`/portfolio/[slug]` prerenders nothing**, so the case-study route — the strongest SEO asset a design studio has — is dark.
- **`breadcrumbJsonLd` is now emitted on 43 pages** (fixed in `56099b9`); it was absent from 40 of them.
- **No `Organization` review/rating markup**, correctly — do not add it until real reviews exist, or it becomes a Google policy violation rather than a gap.
- **Metadata descriptions repeat the unsourced 45-day claim** in ~10 `generateMetadata` blocks, which puts it in search results as well as on the page.

---

## 4. Testing

Strong where it exists — 429 unit tests, 94 e2e, and several genuinely good architectural guards (the ESLint seam test, the token contrast suite, the handover-claim guard). Gaps:

- **14 components have no unit test**, including `BookAuditForm` (the conversion path), `ConsentBanner` and `ConsentCheckbox` (the DPDPA compliance surface), and `Breadcrumbs`.
- **No test covers `/api/lead`.** The one route that handles personal data, validates consent and can fail closed has no test at all.
- **No visual regression testing.** A palette change of the scale that just landed (navy→emerald across every token) had nothing checking it but axe and human eyes.
- **`size-limit` is configured but not wired into `verify`,** and reportedly crashes. The bundle budget is therefore unenforced.
- **`npm run verify` omits `build` and `test:e2e`.** Both of this week's regressions would have been caught pre-commit by a verify that ran them.

---

## 5. Architecture & maintenance

- **Page components carry their own content.** Each service page inlines 300–600 lines of arrays for highlights, features, FAQs and comparison tables. That is why one bad breadcrumb became 40 copies, and why a claim can be corrected on `/process` and survive on 25 other pages. Move page content into `lib/content/` behind the same fetchers the CMS layer already provides.
- **66 raw `<a href="/…">` across 40 files** bypass `Link` — full page reloads, and no design-system focus treatment. Add `@next/next/no-html-link-for-pages` to the ESLint config so it cannot recur.
- **No lint rule catches undefined Tailwind classes.** `text-on-surface-3` (291 uses), `bg-surface-elevated` (42), `py-0.2`, `scrollbar-thin` and an `xs:` breakpoint all compiled to nothing. A safelist-diff check or `eslint-plugin-tailwindcss` would have caught every one.
- **Prettier is a dependency but not enforced.** Formatting is inconsistent across `app/`; add `prettier --check` to `verify`.
- **The 3D layer is 5 placeholder scenes behind an off flag.** Either finish it or descope it — `three` + `@react-three/fiber` + `@types/three` are carried in `dependencies` for a feature no visitor sees.
- **`components/sections/CTASection.tsx` exports `TestimonialBand`,** which is not a CTA. Minor, but it is why the import lines now read oddly on 29 pages.

---

## 6. What is genuinely good

Worth stating, because the list above is long and the foundation under it is not weak:

- **The token pipeline.** W3C DTCG source, Style Dictionary build, contrast assertions against the token file rather than the output. The palette swap was survivable *because* of this.
- **The reasoning in the comments.** `lib/content/source.ts`, `app/api/lead/route.ts`, `lib/lead/fallback.ts` and `next.config.mjs` each explain not just what they do but which alternative was rejected and why. That is unusually good, and it is what made this audit fast.
- **The refusal to invent.** The empty-collections policy, the `ToBePublished` component, the 503-rather-than-silent-success lead route, and the "no CSP is better than a fake CSP" note in `next.config.mjs` are the same instinct applied four times. The failures documented above are all cases of page code *bypassing* that instinct, not the instinct being absent.
- **Security headers** are set thoughtfully at the app rather than the CDN, with the CSP gap named explicitly instead of papered over.
- **`SmoothScrollGate`** — gating the module so ~135 kB of Lenis and GSAP leaves the bundle entirely, rather than shipping it to reduced-motion visitors who will never use it.

---

## 7. Suggested order

| # | Item | Why first |
|---|---|---|
| 1 | Configure `LEAD_WEBHOOK_URL` + add `.env.example` | The site cannot convert without it |
| 2 | Compress or drop the hero video | 56 MB is the single biggest visitor-facing defect |
| 3 | Hero pause control | WCAG Level A, homepage, ~20 lines |
| 4 | Supply commercial + per-service handover figures, widen the guard | Unsourced contractual promises |
| 5 | Fill `PROJECTS`/`STATS`, or remove the claims that depend on them | Fabrication risk, and unblocks the case-study SEO route |
| 6 | Mega-menu `aria-expanded` + Esc + touch | Whole device class currently locked out |
| 7 | `verify` runs build, e2e, prettier and size-limit | Stops the next round of this |
| 8 | Move page content into `lib/content/` | Stops one fix needing 40 edits |
