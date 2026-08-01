# Luxe Axis (`LA-Website`) — Gap Analysis & Improvement Plan

> **Document Status:** Active Audit & Gap Analysis  
> **Date:** July 30, 2026  
> **Target Codebase:** `f:/Apps/LuxeAxis/LA-Website`  
> **Baseline Specs:** `docs/specs/*` (Master Program, 3D Website Spec v1.1, Cinematic Direction, Design System, Interaction Framework, Build Backlog)

---

## 1. Executive Summary

The **Luxe Axis** web application (`luxeaxis-web`) currently possesses an extraordinarily solid foundation:
- **Design Tokens & System:** W3C DTCG token architecture (`luxe-axis.tokens.json`) fully compiled via Style Dictionary into CSS variables and Tailwind utility classes.
- **Component Library:** 24 high-quality primitives and UI components (`Button`, `Card`, `Chip`, `Modal`, `MobileSheet`, `Header`, `Footer`, `Toast`, etc.) with 100% unit test coverage.
- **Testing & Verification:** Zero TypeScript errors (`tsc --noEmit`), zero ESLint warnings, 30 passing unit test suites (248 tests), and baseline Playwright E2E specs.
- **Accessibility & i18n:** `next-intl` configuration supporting `/en` and `/ta` routes, budget-conscious font preloading (≤130KB per locale), and automated contrast tests.

However, comparison against the 8 capstone specifications (`docs/specs/*`) reveals that while the **design system, primitives, and quality pipeline (Phase 0 & 1)** are complete, the **domain content pages, 3D WebGL engine, scroll-driven storytelling, and backend data layers (Phases 2–5)** remain to be implemented.

---

> **Scope change, August 2026 — Tamil / i18n removed.** The specs (`3D Website Spec` §2.3, `Design System` §3.3) require a bilingual EN/தமிழ் site, and §2.1 builds a primary persona around the Tamil diaspora. The client has since taken Tamil out of scope and the entire i18n stack has been removed. The NRI persona still exists in the IA (`/nri`, the persona router) — it is now served in English only. Reinstating Tamil is a rebuild, not a config change; this row is recorded so a future reader does not mistake the divergence from the specs for an oversight.

## 2. Gap Analysis Matrix

| Domain | Spec Baseline Requirement | Current Codebase State | Status / Gap Level |
|---|---|---|---|
| **Design System & Tokens** | W3C DTCG tokens, CSS variables, Tailwind integration, `/style` guide | `tokens/`, `scripts/build-tokens.ts`, `app/[locale]/style/page.tsx` complete | 🟢 **100% Complete** |
| **UI Primitives & Testing** | 24 UI components, WCAG AA contrast, ESLint seam rules, Vitest suite | All components in `components/` built with 248 unit tests passing | 🟢 **100% Complete** |
| **i18n Infrastructure** | `next-intl` English & Tamil (`/en`, `/ta`), font preloading budget | **Removed at the client's direction (Aug 2026).** The `[locale]` segment, `next-intl`, `middleware.ts`, the publication gate and `LangSwitch` are all deleted; the site is English-only and every route is statically prerendered. | ⚪ **Out of scope** |
| **Core Landing & Sub-pages** | Home, Pricing/Calculator, Vastu Tool, Portfolio, NRI Concierge, Audit Flow | Only Home stub (`app/[locale]/page.tsx`) and Style route exist | 🟡 **High Gap (Phase 2)** |
| **3D WebGL Subsystem** | Persistent `<Canvas>`, R3F dynamic scene loader, 9 Three.js scenes | `three/registry.ts` has posters & IDs, but `SCENES` object is empty | 🔴 **Critical Gap (Phase 4)** |
| **Motion & Scroll Engine** | Lenis smooth scroll + GSAP `ScrollTrigger` + 3D axis sync | GSAP tokens exist, but Lenis & axis camera sync not connected | 🟡 **Medium Gap (Phase 3)** |
| **CMS & Data Layer** | Sanity / local Zod models for Projects, Tiers, Faqs, Testimonials | CMS schema & data fetchers (`lib/cms`) not yet implemented | 🟡 **Medium Gap (Phase 2)** |
| **Analytics & DPDPA** | PostHog / GA4 event tracking, DPDPA consent banner, FPS monitoring | Analytics scripts and consent banner not implemented | 🔵 **Low-Medium Gap (Phase 5)** |
| **DX & Scripting** | Cross-platform build scripts (`npm` / `pnpm` fallback execution) | Package scripts assume global `pnpm` in PATH | 🟢 **Low Fix Required** |

---

## 3. Detailed Gap Breakdown by Architecture Pillar

### Pillar A: Core Pages & Conversion Architecture
* **Current State:** The home page (`app/[locale]/page.tsx`) is a minimal stub featuring a single `<SceneSlot id="hero">` with an `<h1>` tag.
* **Gaps:**
  1. **Full Home Page Composition (Task T-14):** Missing sections for *Six-Ways-In Persona Router*, *Proof Strip*, *Vastu Intelligence Teaser*, *Featured Projects*, *Pricing Teaser*, *Testimonial*, and *Audit CTA Band*.
  2. **Fee Calculator & Tiers Route (`/pricing` - Task T-15):** Missing interactive price calculator allowing visitors to estimate scope by sq.ft and finish tier.
  3. **Vastu-Tech Interactive Tool (`/vastu` - Task T-16):** Missing floor plan zone evaluator with human-in-the-loop teal designer verification badge.
  4. **Portfolio & Case Studies (`/portfolio` & `/portfolio/[slug]` - Task T-17):** Missing project listing with filterable material tags and single project deep dives.
  5. **NRI Concierge Page (`/nri` - Task T-18):** Missing dedicated landing page for overseas Tamil diaspora (time-zone transparent updates, remote milestone tracking).
  6. **Audit Booking Flow & Modal (Task T-19):** Missing full multi-step design audit request form.
  7. **SEO Suite & Schema Markup (Task T-20):** Missing structured JSON-LD schemas (`LocalBusiness`, `Service`, `Project`), `sitemap.xml`, `robots.txt`, and OpenGraph images.

### Pillar B: 3D WebGL Graphics Subsystem
* **Current State:** Poster registry ([three/registry.ts](file:///f:/Apps/LuxeAxis/LA-Website/three/registry.ts)) contains metadata and poster `.avif` paths for all 9 scenes (`hero`, `persona-router`, `vastu`, `space-score`, `space-os`, `portfolio`, `journey`, `pricing-axis`, `nri-globe`).
* **Gaps:**
  1. **Persistent App Shell `<Canvas>` (Task T-21):** Missing root R3F/Three `<Canvas>` component mounted fixed in the app shell layer (`z-0`).
  2. **Scene Router & Asset Loader (Task T-22):** Missing dynamic importer for Three.js scene modules with Draco + KTX2 model loader and VRAM budget guardrails.
  3. **9 Live Three.js Scenes (Tasks T-24 – T-35):** None of the 9 interactive 3D WebGL scenes have been authored yet (currently falling back cleanly to T1 static posters via `SceneSlot`).

### Pillar C: Motion Engine & Scroll Synchronization
* **Current State:** GSAP cubic-bezier tokens and reduced-motion store state ([lib/store.ts](file:///f:/Apps/LuxeAxis/LA-Website/lib/store.ts)) are established.
* **Gaps:**
  1. **Lenis Smooth Scroll Integration:** Lenis scroll provider needs full integration with GSAP `ScrollTrigger`.
  2. **Gold Axis Scroll Rail:** Missing the visual gold axis line scroll synchronization down the page, driving active scene transitions as the user scrolls through sections.

### Pillar D: CMS, Data Layer & Content Infrastructure
* **Current State:** Components rely on hardcoded or mock props.
* **Gaps:**
  1. **Data Layer & Zod Validation (Task T-12):** Missing Sanity CMS schemas and GROQ fetchers with Zod runtime validation for Projects, Services, Tiers, Testimonials, and FAQs.
  2. **Tamil Localization Content (`/ta` catalog):** Missing full human-reviewed Tamil translation strings in `messages/ta.json`.

### Pillar E: Analytics, DPDPA Consent & Observability
* **Current State:** No tracking scripts present.
* **Gaps:**
  1. **DPDPA Consent Banner:** Missing Indian Data Protection compliant consent banner prior to initializing analytics.
  2. **Conversion & Diagnostics Tracking:** Missing event telemetry for CTA clicks, calculator completions, scroll depth, and runtime FPS metrics by device tier (T0–T3).

### Pillar F: Developer Experience & Cross-Platform Reliability
* **Current State:** `package.json` scripts call `pnpm` directly (e.g. `"build": "pnpm tokens && next build"`).
* **Gaps:**
  1. On systems where `pnpm` is not in global system PATH (or running via standard `npm`), commands like `npm run verify` or `npm run build` fail.
  2. **Fix:** Update scripts to use standard execution or `npx pnpm` fallbacks.

---

## 4. Actionable Improvement Plan & Roadmap

```
Phase 2: Static Content Site (Tasks T-12 to T-20)
  ├── T-12: CMS Schema & Data Layer (Zod fetchers)
  ├── T-13: Card Family & Poster Slots
  ├── T-14: Full Home Page Composition
  ├── T-15: Pricing Page & Interactive Fee Calculator
  ├── T-16: Vastu-Tech Interactive Tool
  ├── T-17: Portfolio & Case Study Pages
  ├── T-18: NRI Concierge Page
  ├── T-19: Design Audit Booking Modal & Flow
  └── T-20: SEO Suite (JSON-LD, Sitemap, OG Images)

Phase 3: Motion Engine & Scroll Sync (Tasks T-21 to T-23)
  ├── T-21: Lenis Smooth Scroll + ScrollTrigger Integration
  ├── T-22: Persistent WebGL Shell Canvas & Scene Router
  └── T-23: Gold Axis Rail & Camera Controller

Phase 4: 3D Scene Implementation (Tasks T-24 to T-35)
  ├── T-24 to T-32: Build 9 R3F Scenes (Hero, Vastu, Space OS, etc.)
  ├── T-33: 3D Portfolio Panel Objects
  └── T-34: Adaptive Performance Degrade Ladder & FPS Monitor

Phase 5: Analytics, DPDPA & Launch Prep (Tasks T-36 to T-37)
  ├── T-36: DPDPA Consent Banner & Telemetry
  └── T-37: Pre-launch A11y, Performance & Lighthouse QA
```

---

## 5. Recommended Next Immediate Steps

1. **Update Cross-Platform Package Scripts (`package.json`):**
   Replace direct `pnpm` script references with standard npm/npx equivalents so all developers can execute `npm run verify` without PATH friction.

2. **Execute Phase 2 (Content Pages & Fee Calculator):**
   Build out `app/[locale]/pricing/page.tsx` with the interactive Fee Calculator and complete the full home page sections in `app/[locale]/page.tsx` using the `SceneSlot` static poster infrastructure.

3. **Wire CMS / Mock Data Fetchers:**
   Create typed fetchers in `lib/cms/` to supply project and pricing tier data to components.
