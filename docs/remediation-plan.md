# Luxe Axis — Remediation Plan

> **Companion to** [`gaps_and_improvements.md`](./gaps_and_improvements.md), which explains *what is wrong and why*. This document is the *what to do about it*, as work items you can pick up, assign, and close.
> **Baseline:** commit `318eae7` on `feat/foundations`, 7 August 2026.

---

## How to use this

Each task carries everything needed to start it without re-reading the audit: the files it touches, the steps, and an **acceptance test** — a command or an observable outcome that decides whether it is done. Nothing here is "done when it looks right".

**Status:** `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked

**Effort:** **S** ≈ under an hour · **M** ≈ half a day · **L** ≈ multi-day

**`BLOCKED-ON: business`** means an engineer cannot finish it without a fact only the studio has. These are collected in Phase 0 so they can be answered in one sitting rather than discovered one at a time.

---

## Phase 0 — Questions only the studio can answer

Nothing in Phase 1 that depends on these can start until they are answered. Answer all six together; each one unblocks work below.

| # | Question | Unblocks | Why it cannot be guessed |
|---|---|---|---|
| Q1 | Where should a booking enquiry go? A webhook URL, an inbox, a CRM, or the Space OS lead queue? | T-01 | The endpoint is built and inert; it needs a destination |
| Q2 | What is the **commercial** fit-out handover commitment, if any? Is the "written delay compensation clause" real? | T-04 | `lib/content/commercial.ts` publishes no timeline at all; the pages promise one 16 times |
| Q3 | Do the per-service pages (modular kitchen, wardrobe, false ceiling…) have their own delivery commitments, or do they inherit the tier model? | T-04 | ~115 flat "45-day" claims depend on the answer |
| Q4 | Which projects may we publish? For each: name, area, location, tier, and permission to name it. | T-05, T-06 | `PROJECTS` is empty; the case-study route prerenders nothing |
| Q5 | Is there a real Google rating and review count? Are there completed-project counts we can stand behind? | T-05 | "4.9 ★", "45+ Works", "15+ Penthouses", "2,000+ kitchens", "25+ Neighborhoods" have no source |
| Q6 | Do we have project photography? If not, what is the plan and timeline? | T-03, T-14 | Every image is a solid-tone placeholder AVIF |

> **Recommended framing for Q2/Q3/Q5:** the site's entire differentiator is *"most Chennai studios hide the price, we publish it."* A number we cannot defend costs more here than a number we decline to give. "We commit per tier, and here is the tier table" is a stronger page than an unsourced "45-day guarantee".

---

## Phase 1 — Launch blockers

### `[!]` T-01 — Wire the lead destination · **S** · BLOCKED-ON: Q1
The primary CTA cannot deliver an enquiry.

- **Files:** deployment env; `app/api/lead/route.ts` (no code change expected)
- **Steps:** set `LEAD_WEBHOOK_URL` to an HTTPS endpoint accepting JSON. Confirm the route returns 200 and the payload arrives.
- **Acceptance:** submit the form on `/book-audit` in a deployed environment; the enquiry lands at the destination and the success state renders — not the mailto fallback.
- **Note:** the 503-when-unconfigured behaviour is correct and should stay. Do not "fix" it by returning 200.

### `[ ]` T-02 — Document the environment · **S**
Five variables are read and none documented; a deploy missing one fails silently.

- **Files:** new `.env.example`; `README.md`
- **Steps:** document `LEAD_WEBHOOK_URL`, `NEXT_PUBLIC_SITE_ORIGIN`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_FLAG_THREE_V1`, `NEXT_PUBLIC_FLAG_SMOOTH_SCROLL` — each with its effect when unset.
- **Acceptance:** a new engineer can bring the app up from `.env.example` alone.

### `[ ]` T-03 — Cut the homepage video payload · **M**
55.8 MB over a 40-second visit, against a stated "speed is trust" principle.

- **Files:** `components/sections/Hero.tsx`; `public/videos/`
- **Steps:**
  1. Transcode the three real loops to ~2–3 MB 720p H.264 (target: **under 10 MB total**).
  2. Add `preload="none"` and start playback only when the slide becomes active.
  3. Gate video behind a viewport width check and `navigator.connection.saveData` — poster stills otherwise.
  4. Delete `2hero-slide-3.mp4` (15 MB, referenced nowhere) and the three 42-byte stubs.
  5. Either supply a real `hero-slide-4.mp4` or drop slide 4 to poster-only — today it is a 42-byte file that silently fails.
- **Acceptance:** DevTools Network on `/` shows **< 10 MB** of video over 60 seconds; Lighthouse mobile performance ≥ 80.
- **Note:** the 71 MB already in git history is not removed by this. Rewriting that is a separate call — cheap now, expensive after the branch is shared.

### `[!]` T-04 — Resolve the handover claims · **M** · BLOCKED-ON: Q2, Q3
~130 unsourced contractual promises across commercial and residential service pages.

- **Files:** `lib/content/commercial.ts`; `app/commercial/**`; `app/residential/**`; `tests/unit/content.test.ts`
- **Steps:**
  1. If commitments exist → add them to the content layer as structured data, per vertical/service, the way `lib/content/source.ts` does for tiers.
  2. If they do not → replace the figure with the shape of the commitment, as `/process` and `TrustMarquee` already do.
  3. Remove "written delay compensation clause" everywhere unless Q2 confirms it exists.
  4. Widen `FIGURE` in the guard from `/\b60[-\s]day/i` to `/\b(45|60)[-\s]day/i` — the one-character change that completes it.
- **Acceptance:** `npx vitest run tests/unit/content.test.ts` passes with the widened regex.

### `[!]` T-05 — Retire or substantiate the invented statistics · **M** · BLOCKED-ON: Q4, Q5
Same fabrication pattern the testimonials had, in the stat layer.

- **Files:** `lib/content/source.ts` (`STATS`); `components/TrustMarquee.tsx`; `lib/nav.ts`; `app/portfolio/**`; `app/residential/**`
- **Targets:** "4.9 ★ Google Rating" (×3), "45+ Works", "15+ Penthouses Completed", "2,000+ modular kitchens delivered", "25+ Neighborhoods Across Chennai"
- **Steps:** fill `STATS` with what is real; route pages through it; delete the rest. Follow the `TestimonialBand` pattern — the section renders a pending state when empty and lights up when data arrives.
- **Acceptance:** no numeric claim in `app/` or `components/` that is not traceable to `lib/content/`. Add a guard in the shape of the handover one.

### `[!]` T-06 — Publish real projects · **L** · BLOCKED-ON: Q4, Q6
`PROJECTS` is empty, so `/portfolio/[slug]` prerenders zero pages — the strongest SEO asset a design studio has is dark.

- **Files:** `lib/content/source.ts`; `app/portfolio/villas|penthouses|apartments/page.tsx`; `components/sections/Hero.tsx`
- **Steps:** populate `PROJECTS`; replace the invented arrays on the three collection pages; fix the hero's slide-1 link, which currently 404s at `/portfolio/poes-garden-villa`; correct "The Emerald Villa" (nav says Indiranagar — Bangalore; the villas page says Adyar).
- **Acceptance:** `npm run build` prerenders ≥ 1 path under `/portfolio/[slug]`; no internal link 404s.

### `[ ]` T-07 — Fix the hero's dead link now · **S**
Does not need Q4. The homepage should not link to a 404 while T-06 is pending.

- **Files:** `components/sections/Hero.tsx:31`
- **Steps:** point slide 1 at `/portfolio` until a real slug exists.
- **Acceptance:** every `href` in `HERO_SLIDES` resolves to a prerendered route.

---

## Phase 2 — Accessibility

### `[ ]` T-08 — Hero pause control · **S**
**WCAG 2.2.2, Level A**, on the homepage. The lowest bar in the standard.

- **Files:** `components/sections/Hero.tsx`
- **Steps:** add a labelled play/pause button; stop the interval when paused; respect `useReducedMotion()` by not auto-advancing at all (the CSS kill switch cannot reach a JS `setInterval`); persist the choice for the session. Remove the docstring's claim of controls that do not exist.
- **Acceptance:** an e2e test asserts the carousel does not advance when paused, and does not auto-advance under `prefers-reduced-motion: reduce`.

### `[ ]` T-09 — Make the mega menu usable · **M**
No `aria-expanded`/`aria-haspopup`, no Esc (WCAG 1.4.13), and **unopenable on touch ≥768px — every iPad**.

- **Files:** `components/Header.tsx`
- **Steps:** convert the trigger to a `<button>` with `aria-expanded` and `aria-controls`; open on click as well as hover; close on Esc and outside click, returning focus to the trigger. `components/MobileSheet.tsx` already does the focus and Esc handling well — follow it.
- **Acceptance:** e2e test opens each menu by click, closes with Esc, and asserts focus returns to the trigger. Passes at a 768px touch viewport.

### `[ ]` T-10 — Close the remaining contrast traps · **S**
- **Files:** `tokens/luxe-axis.tokens.json`
- **Steps:** `surface-raised-2` (`#33634B`) fails AA for every text role (primary 4.09:1) — fix or delete it, since nothing uses it as a background. `gold-deep` `#B8860B` is 2.55:1 on the new ivory, below the 3:1 non-text floor — restore the "LARGE/icon only" caveat its description lost, or remove it.
- **Acceptance:** the surface-sweep test in `tests/unit/contrast.test.ts` extended to cover `surface-raised-2`, passing.

### `[ ]` T-11 — Extend axe coverage · **S**
- **Files:** `tests/e2e/a11y.spec.ts`
- **Steps:** add `/nri/[region]`, `/residential/[tier]`, `/commercial/[vertical]`, `/portfolio/[slug]` and `/journal`.
- **Acceptance:** suite passes with the additions.

### `[ ]` T-12 — Decide on the light theme · **S**
`app/layout.tsx` hardcodes `data-theme="dark"`, so the light token set is only reachable on `/style`. Either wire a toggle or drop it — an unreachable theme costs maintenance and pays nothing.

---

## Phase 3 — Stop the recurrence

These are why the defects arrived in batches of 40 rather than singly. **Doing these before Phase 4 is what makes Phase 4 safe.**

### `[ ]` T-13 — Make `verify` mean verified · **S**
Both of this week's regressions would have been caught pre-commit.

- **Files:** `package.json`
- **Steps:** `verify` → `typecheck && lint && prettier --check && test && build && test:e2e`. Fix or remove `size-limit`, which is configured but unwired and reportedly crashes; an unenforced budget is not a budget.
- **Acceptance:** `npm run verify` runs all gates and passes clean.

### `[ ]` T-14 — Lint the classes that compile to nothing · **S**
`text-on-surface-3` (291 uses), `bg-surface-elevated` (42), `py-0.2`, `scrollbar-thin` and an undefined `xs:` breakpoint all silently produced no CSS.

- **Files:** `eslint.config.*`
- **Steps:** add `eslint-plugin-tailwindcss` (or a safelist-diff check) so an undefined utility fails lint. Add `@next/next/no-html-link-for-pages` in the same pass — **66 raw `<a href="/…">` across 40 files** currently bypass `Link`, costing client-side navigation and design-system focus styles.
- **Acceptance:** `npm run lint` fails on a planted `text-on-surface-9` and a planted `<a href="/pricing">`.

### `[ ]` T-15 — Test the untested surfaces · **M**
14 components have no unit test, including the conversion path and the compliance surface.

- **Priority order:** `app/api/lead/route.ts` (handles personal data, validates consent, can fail closed — **currently zero tests**) → `BookAuditForm` → `ConsentBanner` + `ConsentCheckbox` → `Breadcrumbs` → the rest.
- **Acceptance:** each has a test asserting its failure behaviour, not just its happy path.

### `[ ]` T-16 — Visual regression testing · **M**
A palette swap across every token landed with nothing checking it but axe and human eyes.

- **Steps:** Playwright screenshot baselines for `/`, `/style`, and one page per template family, in both themes if T-12 keeps light.
- **Acceptance:** a deliberate colour change fails the suite.

---

## Phase 4 — Architecture

### `[ ]` T-17 — Move page content into the content layer · **L**
**The single highest-leverage item here.** Each service page inlines 300–600 lines of arrays. That is why one malformed breadcrumb became 40 copies, why a corrected claim survived on 25 pages, and why T-04 and T-05 are M-sized instead of S.

- **Steps:** extract highlights, features, FAQs, comparison tables and stats into `lib/content/` behind the existing fetcher pattern. Do it template family by family — residential services first, they are the most numerous and most duplicated.
- **Acceptance:** a copy change to a shared claim requires **one** edit. Page components contain layout and no content arrays.
- **Sequencing:** do T-13 through T-16 first. This is a large refactor and it wants the gates in place before it starts.

### `[ ]` T-18 — Resolve the 3D layer · **M**
Four real scenes; five of nine IDs map to a shared `GenericScene` placeholder; the whole layer sits behind `three_v1`, which is off. `three`, `@react-three/fiber` and `@types/three` are carried in `dependencies` for something no visitor sees.

- **Decide:** finish the five placeholder scenes, or descope and remove the dependencies. Either is fine; carrying it half-built is not.

### `[ ]` T-19 — Content Security Policy · **M**
`next.config.mjs` sets security headers well and names the missing CSP explicitly rather than shipping a fake one — good judgement, and the note says it deserves its own work with its own proof.

- **Steps:** per-request nonces through middleware into the document; e2e proof that no route console-errors under the policy.

### `[ ]` T-20 — Small cleanups · **S**
- `TestimonialBand` is exported from `components/sections/CTASection.tsx` and is not a CTA — move it to its own module.
- `videoRef` in `Hero.tsx` is assigned and never read.
- Sitemap has no `lastModified` — correct today, revisit when the journal carries real publish dates.
- `/journal` has no posts. An empty journal ranks for nothing.

---

## Verification reference

```bash
npm run verify
```

Individual gates:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run test
```

```bash
npx playwright test tests/e2e/a11y.spec.ts --reporter=list
```

```bash
npm run build
```

---

## Summary

| Phase | Items | Blocked on studio input |
|---|---|---|
| 0 — Questions | 6 questions | — |
| 1 — Launch blockers | T-01 … T-07 | T-01, T-04, T-05, T-06 |
| 2 — Accessibility | T-08 … T-12 | none |
| 3 — Stop the recurrence | T-13 … T-16 | none |
| 4 — Architecture | T-17 … T-20 | none |

**11 of 20 items are unblocked today.** T-07, T-08, T-10, T-11, T-13 and T-14 are all **S** and together close a Level A accessibility failure, a homepage 404, and the two gate gaps that let this batch through in the first place.
