# Luxe Axis — Performance, Accessibility & Pre-Launch QA
### Performance-first optimization for a premium 3D site — without losing the premium feel

**Companions:** Spec v1.1, Cinematic Direction, Interface System + tokens, 3D Interaction Framework, Build Backlog. This document is the **optimization + QA layer**: how to hit Core Web Vitals and stable frame rates, ship fast on every device, meet WCAG 2.2 AA, and pass a complete pre-launch gate — with the premium 3D intact.

**The governing principle (resolves the constraint):** *You do not achieve a premium feel by shipping heavy 3D to everyone. You achieve it by delivering the right fidelity to each device, instantly.* Premium = **fast + tailored**, never **heavy**. A flagship gets the full cinematic scene; a mid phone gets a beautiful poster in <1s. Both feel premium; only one pays the GPU tax. Every tactic below serves that idea.

---

## 1. Performance budgets (the contract — enforced in CI, §11)

| Metric | Budget | Notes |
|---|---|---|
| **LCP** | ≤ 2.5s (p75, mid-4G mobile) | LCP element is **DOM text/hero image — never WebGL** |
| **INP** | ≤ 200ms | main thread stays free; 3D off the critical path |
| **CLS** | ≤ 0.1 | reserve all media/skeleton/scene dimensions |
| **TTFB** | ≤ 200ms | edge/CDN, streamed RSC |
| **FCP** | ≤ 1.8s | critical CSS inlined, fonts optimized |
| **TBT** (lab) | ≤ 200ms | hydration split; three lazy |
| **Initial route JS** | ≤ 200KB gzip | three/R3F **excluded** from first load |
| **Fonts total** | ≤ 130KB | 2 preloaded weights, subset latin+tamil |
| **Per-3D-scene** | ≤ 1.5MB (hero ≤ 2.5MB) compressed | Draco + KTX2 |
| **Visible triangles / scene** | ≤ 100k | LOD + culling |
| **Draw calls / scene** | ≤ ~150 | instancing/merging |
| **Frame rate** | 60fps T3 · **30fps hard floor** before auto-downgrade | `PerformanceMonitor` |
| **Lighthouse** | Perf ≥ 90 (mobile), A11y ≥ 95, SEO ≥ 95, BP ≥ 95 | blocks merge |

Budgets are **CI gates** (Lighthouse-CI + size-limit + a custom 3D-budget check on `.glb` size and draw calls). A regression fails the build. What you don't measure, you lose.

---

## 2. Core Web Vitals — tactics

**LCP ≤ 2.5s.**
- LCP element = the DOM `<h1>` / hero image. **Server-render it; never gate it on the canvas.** The 3D `<Canvas>` is dynamically imported *after* first paint.
- Hero image: `next/image`, AVIF/WebP, correct `sizes`, `priority` + `fetchpriority=high`, responsive `srcset`, blurhash placeholder. Or render the hero **poster** (a pre-rendered still of the 3D scene) as the LCP image so even the "3D hero" has an instant, indexable first frame.
- Preload critical: hero image, 2 font weights (`<link rel=preload>`), critical CSS inlined.
- Streamed RSC + edge TTFB; no client data-fetch for above-the-fold.

**INP ≤ 200ms.**
- Keep the main thread free: three/R3F run their own rAF; **never** block input on GL work. Use `frameloop="demand"` so idle costs nothing.
- Split hydration (React Server Components; client islands only where interactive). Defer non-critical JS (`requestIdleCallback`).
- Debounce/throttle pointer + scroll handlers to rAF; passive listeners; avoid long tasks (>50ms) — chunk work.
- Consider **OffscreenCanvas + Web Worker** for the render loop on supported browsers so 3D never competes with input on the main thread.

**CLS ≤ 0.1.**
- Reserve dimensions for every image, skeleton, and canvas (aspect-ratio boxes). Fonts: `font-display: swap` + size-adjust metrics to avoid reflow; preloaded so no FOUT jump.
- No content injected above existing content after load; sticky/nav uses transforms, not layout.

**TTFB / FCP.** Edge rendering (Vercel/CloudFront Mumbai+Singapore); static-first (SSG/ISR); Brotli; inline critical CSS; HTTP/2-3.

---

## 3. Stable frame rates (protecting the premium feel)

A dropped frame reads as "cheap." Steady 60 (graceful 30 floor) is the target; the render architecture makes it achievable **and** keeps the look.

**Render-loop discipline.**
- `frameloop="demand"` — render only on scroll / interaction / an explicit `invalidate()` tick (e.g., the 6s ambient breath). A static hero at rest costs ~0 GPU.
- Pause the canvas when off-screen (IntersectionObserver → stop the loop) — saves battery, prevents background jank.
- **No per-frame allocations** in `useFrame` (no `new Vector3()` in the loop) — pre-allocate and reuse; object-pool particles. GC pauses are the top cause of micro-stutter.

**Adaptive quality (keeps 60fps AND the look).**
- `PerformanceMonitor` (drei) watches FPS and steps quality: DPR (via `AdaptiveDpr`), post-FX on/off, particle count, shadow resolution — **before** frames drop, not after. The user sees a subtly simpler scene, never a stutter.
- DPR capped per tier (T3 ≤ 2, T2 ≤ 1.5, mobile clamp). Render at lower internal resolution + upscale where imperceptible.
- LOD (near/mid/far) on hero objects; frustum + occlusion culling; merge/instance repeated meshes; limit real-time lights (bake AO/lightmaps — baked light *looks* more premium and costs nothing).

**GPU memory & cost.**
- Texture budget per scene; KTX2/Basis compressed (GPU-native, less VRAM); mipmaps on; power-of-two where needed; channel-pack (ORM) maps.
- `dispose()` geometries/materials/textures on scene exit (SceneRouter disposes two scenes back); watch for context loss and recover to poster.
- Post-processing is expensive: Bloom/DoF **T3 only**, half-res buffers, single combined pass; vignette is cheap and fine.

**The degrade ladder (order under stress — feel preserved as long as possible):**
`particles → post-FX (bloom/DoF) → pointer FX → parallax → shadow res → DPR → static poster.`
The last rung — poster — still looks premium (it's a beautifully graded still), so even the worst device gets the brand, just not the motion.

**Telemetry:** ship a lightweight FPS/RUM probe (sample p75 frame time per scene, per tier) so real-world jank is visible post-launch, not guessed.

---

## 4. Lazy loading

The whole strategy: **nothing heavy loads before the visitor needs it, and the 3D engine never touches the first byte the browser paints.**

- **Route code-splitting:** three/R3F/postprocessing/GSAP in a **dynamically imported** client chunk (`next/dynamic`, `ssr:false`), booted *after* first paint or on first scroll/idle — kept out of the initial ≤200KB.
- **Canvas deferral:** the persistent `<Canvas>` mounts post-hydration; until then the hero **poster** is the visible (and LCP) element.
- **Scene streaming:** `SceneRouter` mounts only the active scene; `<Preload>` the *next* scene during `requestIdleCallback`; `useGLTF.preload()` the following `.glb`; **dispose two scenes back** to cap memory.
- **Progressive textures:** KTX2 mip-streaming — a low mip appears immediately, full res streams after paint; LCP never waits on a texture.
- **Below-the-fold:** IntersectionObserver / `loading="lazy"` for images, embeds, and non-hero sections; hydrate interactive islands on visibility (or interaction) not on load.
- **Fonts:** `next/font` self-host, subset (latin + tamil), preload only the 2 above-the-fold weights; the rest load lazily.
- **Third-parties:** analytics/chat load **after consent + idle** (never blocking); no render-blocking tags.

```tsx
const ThreeCanvas = dynamic(() => import("@/three/ThreeCanvas"), {
  ssr: false, loading: () => <ScenePoster src={hero.poster} priority />,
});
// mount after first paint so LCP = DOM hero, not GL
```

---

## 5. Asset compression

**3D geometry & textures (the biggest wins):**
- **glTF 2.0 (.glb)** + **Draco** (geometry) + **KTX2/Basis Universal** (GPU-native textures) + **meshopt** where useful. Pipeline: `gltf-transform` / `gltfpack` in CI (`draco`, `etc1s`/`uastc`, `resize`, `prune`, `dedup`, `instance`).
- Right-size textures (no 4K where 1K reads identically); mipmaps on; **channel-pack** (occlusion-roughness-metalness into one RGB); atlas small maps; power-of-two.
- **Bake** lighting/AO to maps (fewer runtime lights = faster *and* richer). LODs generated per hero object.
- Target: per-scene ≤ 1.5MB (hero ≤ 2.5MB) *after* compression — a CI check fails the build on oversize `.glb`.

**2D imagery:** AVIF (then WebP fallback) via `next/image`; responsive `srcset`+`sizes`; blurhash/LQIP placeholders; strip EXIF; art-directed crops per breakpoint.

**Fonts:** woff2, subset to used glyphs (latin + tamil ranges), consider variable fonts to cut weight; `font-display: swap` + `size-adjust`.

**Text/transfer:** Brotli (level 11 static) for HTML/CSS/JS/JSON/SVG; SVGO on all SVG (logo, icons); tree-shake + minify; no unused Tailwind (JIT/purge).

**Video (avoid on the hero):** prefer a poster still over autoplay video. If used, AV1/HEVC, muted, `preload="none"`, poster image, never the LCP.

---

## 6. Responsive rendering

Responsiveness here means two things: **layout** responsiveness *and* **fidelity** responsiveness (how much 3D each device gets). They're decoupled.

- **Device tiers T0–T3** resolved at runtime (`detect-gpu` + `deviceMemory` + `hardwareConcurrency` + `matchMedia`), re-evaluated live by `PerformanceMonitor`. Tier selects the scene variant; layout is independent.
- **DPR management:** cap `dpr={[1, tierMax]}` (T3 2 / T2 1.5 / low 1); `AdaptiveDpr` drops it under load and restores when idle.
- **Canvas sizing:** ResizeObserver (debounced) → update renderer + camera aspect; avoid layout thrash; `resize` never causes CLS (canvas in an aspect-ratio box).
- **Honor user/system signals:** `prefers-reduced-motion` → poster/T1; `prefers-reduced-data` / `Save-Data` header → T2 or posters; `navigator.connection.effectiveType` (2g/3g) → posters; battery/thermal (where available) → downgrade.
- **Layout:** mobile-first, breakpoints xs–2xl, 12-col max 1280, container queries for components, fluid `clamp()` type, touch targets ≥44px, safe-area insets.
- **Mobile-specific:** hero first paint is a poster for everyone (protect LCP/battery), live 3D upgrades only on capable devices after paint; disable pointer-parallax/cursor FX on coarse pointers; pause canvas on tab blur.
- **Art direction:** different image crops and even different scene compositions per breakpoint (a mobile scene is simpler by design, not just scaled).

---

## 7. Accessibility compliance (WCAG 2.2 AA — a 3D site's specific risks)

- **Reduced-motion parity (the #1 3D risk):** `prefers-reduced-motion: reduce` → the T1 poster experience with **identical information and CTAs**, zero transforms/scrub/parallax; only ≤150ms opacity remains. Plus an in-product "Reduce motion" toggle (not everyone can set the OS flag). Global CSS safety net + `useReducedMotion()` driving GSAP (jump to end) and R3F (mount poster).
- **Canvas & keyboard:** the `<Canvas>` is `aria-hidden="true"` and not focusable (decorative). Every interactive 3D object has a **real focusable DOM control** (drei `<Html>` / sibling button) — nobody must orbit a mesh. Full keyboard operability, logical tab order, skip-link, `Esc`/focus-trap/return on overlays.
- **Visible focus** everywhere (`focus-ring`, 2px + offset, ≥3:1). Never remove outlines without a stronger cue.
- **Contrast** per the verified token pairings (ivory/white on navy AAA; gold as emphasis/large only; teal-bright for text on dark; status colors per surface). Non-text UI ≥ 3:1. Never color-only — pair with icon/text/underline.
- **Screen readers:** semantic landmarks, one `h1`/page, ordered headings, `<button>` vs `<a>` correct. 3D scenes carry a concise text alternative describing the depiction **and the claim** it makes. Animated numbers expose the final value in the DOM (not just the visual tween). Toasts/errors via `role=status`/`alert`.
- **Forms:** programmatic labels, `aria-describedby`/`aria-invalid`, required in text, error summary + focus-to-first-error, 44px targets, autocomplete attributes.
- **Zoom/reflow:** usable at 200% zoom and 400% reflow (no horizontal scroll, no clipping). **Forced-colors / high-contrast** mode supported (logo → mono, glass → solid).
- **Vestibular safety:** no camera roll, no fast zooms, nothing flashes > 3×/s, parallax ≤ 12%.
- **Bilingual:** correct `lang` per locale (`en`/`ta`), Tamil glyph coverage + line-height, `hreflang`. Human-reviewed `ta` (no machine translation of UI).
- **Testing:** `axe` 0 serious/critical per route (CI); manual keyboard-only + VoiceOver(iOS/Safari) + NVDA(Windows) on the 6 key templates; colour-blind sim; publish an `/accessibility` statement (conformance target, known issues, contact).

---

## 8. SEO

The rule for a 3D site: **content lives in the DOM/HTML, never locked inside the canvas.** Crawlers get the full text + posters; the 3D is progressive enhancement.

- **Rendering:** SSG/ISR/SSR (RSC) so every page's copy, headings, links, and posters are in the server HTML. The site is fully usable and indexable with JS disabled (T0).
- **Metadata:** per-page `title`/`description`, canonical URLs, Open Graph + Twitter cards (logo-primary on navy OG image), `theme-color`.
- **i18n:** `hreflang` (`en`, `ta`, `x-default`) on every page; locale-correct URLs (`/` default, `/ta`); both locales in the sitemap.
- **Crawlability:** `sitemap.xml` (all routes × locales, lastmod), `robots.txt`, clean semantic HTML, descriptive `alt` on every image/poster (carry the scene's claim), internal linking, breadcrumbs.
- **Core Web Vitals = ranking:** the perf work in §1–§6 is also SEO; passing CWV is a ranking signal.
- **Content:** the Journal/SEO hub server-rendered with keyword clusters ("interior designer Chennai", "2BHK interior design Chennai price", "office interior designer Chennai"); FAQ content indexable; no cloaking (crawler sees what users see).
- **No duplicate content;** parameterized/filter URLs canonicalized; 301s for any legacy paths.

---

## 9. Structured data (JSON-LD)

Server-render JSON-LD on the relevant pages; validate with Google Rich Results Test + Schema.org validator in CI.

| Type | Where | Key fields |
|---|---|---|
| `Organization` | site-wide | name, logo, url, sameAs (socials), contactPoint |
| `LocalBusiness` (InteriorDesignService) | home/contact | address (Chennai), geo, openingHours, priceRange, areaServed, telephone |
| `Service` | service/tier pages | serviceType, provider, areaServed, offers (price bands) |
| `Offer` / `AggregateOffer` | pricing | priceCurrency INR, price/lowPrice–highPrice |
| `Product` + `AggregateRating` | portfolio/showcase (if applicable) | name, image, review, ratingValue |
| `Article` / `BlogPosting` | journal | headline, author, datePublished, image |
| `BreadcrumbList` | deep pages | itemListElement |
| `FAQPage` | FAQ section | Question/acceptedAnswer pairs |
| `Review` / `AggregateRating` | social proof | author, reviewRating, reviewBody (consented) |
| `VideoObject` | any project video | name, thumbnailUrl, uploadDate, duration |
| `WebSite` + `SearchAction` | home | potentialAction (sitelinks search) |

Only mark up content **visible on the page** (no spammy markup); keep ratings real and consented (brand transparency).

---

## 10. Caching

- **Static/hashed assets** (`_next/static`, `.glb`, KTX2, fonts, images): `Cache-Control: public, max-age=31536000, immutable`. Content-hashed filenames → safe forever-cache; a new build = new hash.
- **HTML/ISR pages:** `s-maxage` + `stale-while-revalidate` at the edge; on-demand revalidation (webhook from CMS) for Portfolio/Pricing; time-based (60s) for Journal.
- **CDN/edge:** serve from Mumbai + Singapore PoPs; Brotli at edge; HTTP/2/3; early hints (`103`) for hero image + fonts where supported.
- **3D assets:** long-TTL immutable + preload the *next* scene; browser disk-cache keeps repeat visits instant; a small **asset manifest/version** busts caches on model updates.
- **Service worker (optional, careful):** if used, precache the shell + poster images for instant repeat loads and offline-friendly fallback; **never** cache-trap stale JS (network-first for HTML, cache-first for hashed assets). Skip if it complicates deploys — not required.
- **API/lead:** never cache POST; short cache for read-only config (calculator config) with SWR.

---

## 11. Deployment

- **Pipeline (GitHub Actions):** `verify` (typecheck/lint/unit) → `axe` e2e → build → **Lighthouse-CI budgets (blocking)** → size-limit (≤200KB) + 3D-asset budget check → visual diff → deploy. A red gate blocks merge.
- **Environments:** PR → Vercel **preview** (shareable, with its own Lighthouse run); `main` → production. Optional AWS Amplify/ECS in **Mumbai (primary) + Singapore (secondary)** per the Tech Plan for data-residency/latency.
- **Progressive rollout:** feature-flag every 3D scene (GrowthBook/PostHog); launch scenes behind flags with **instant poster rollback**; canary a % of traffic; watch RUM before 100%.
- **Monitoring:** RUM/field CWV (Vercel Speed Insights or CrUX + web-vitals lib), the custom **FPS-per-tier probe**, error tracking (Sentry, incl. WebGL context-loss + failed `.glb` loads), uptime/synthetic checks on key routes + the lead endpoint, log the 30-min first-touch SLA.
- **Release hygiene:** immutable hashed assets, atomic deploys, one-click rollback (revert PR / Vercel instant rollback), documented runbook, DPDPA (analytics post-consent, data in-region), secrets in Vercel/SSM (never committed), security headers (CSP incl. `worker-src`/`blob:` for OffscreenCanvas, HSTS, `X-Content-Type-Options`, Referrer-Policy).
- **Post-launch watch (72h):** field CWV p75, FPS by tier, conversion funnel, error rate, 404s/redirects — rollback trigger if CWV or conversion regress.

---

## 12. Complete pre-launch QA checklist

Run in full on a production-parity build across the device matrix. **Every item has a measurable pass criterion.** Sign-off requires all **[GATE]** items green.

### A · Performance & Core Web Vitals
- [ ] **[GATE]** LCP ≤ 2.5s p75 on throttled mid-4G mobile (Moto-G-class), every key template
- [ ] **[GATE]** LCP element is DOM (headline/hero image/poster), **confirmed not the canvas** (check in DevTools/WebPageTest)
- [ ] **[GATE]** INP ≤ 200ms (field + lab); no long tasks > 200ms on load
- [ ] **[GATE]** CLS ≤ 0.1 on every route (incl. after fonts, images, canvas mount)
- [ ] TTFB ≤ 200ms from Chennai/Singapore PoPs; FCP ≤ 1.8s; TBT ≤ 200ms (lab)
- [ ] **[GATE]** Initial route JS ≤ 200KB gzip; three/R3F absent from first-load bundle (verify in analyzer)
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95, Best-Practices ≥ 95
- [ ] No render-blocking resources; critical CSS inlined; fonts preloaded (2 weights, ≤130KB)
- [ ] Third-party/analytics load post-consent + idle; none block the main thread

### B · Frame rate & 3D stability
- [ ] **[GATE]** 60fps sustained on T3 reference device across all scenes; **30fps hard floor** never breached on mid mobile
- [ ] `PerformanceMonitor` downgrade verified live (throttle GPU → quality steps down, no stutter)
- [ ] Degrade ladder proven in order: particles → post-FX → pointer FX → parallax → shadow → DPR → poster
- [ ] `frameloop="demand"` confirmed (idle hero ≈ 0% GPU); canvas pauses off-screen and on tab blur
- [ ] No per-frame allocations (profiler shows no GC sawtooth during scroll); particles pooled
- [ ] Per-scene ≤ 1.5MB (hero ≤ 2.5MB), ≤ 100k visible tris, ≤ ~150 draw calls (3D-budget check green)
- [ ] `dispose()` on scene exit verified (no VRAM growth after navigating all scenes; heap stable)
- [ ] WebGL context-loss handled → recovers to poster, no crash
- [ ] Battery/thermal: 5-min mobile session doesn't overheat/throttle to jank

### C · Lazy loading & assets
- [ ] Canvas dynamically imported after first paint; hero poster is the pre-canvas visible element
- [ ] Next-scene preload on idle; two-scenes-back disposed; no stall entering any scene
- [ ] Images `next/image` AVIF/WebP + responsive `sizes` + blurhash; below-fold lazy
- [ ] All `.glb` Draco+KTX2 compressed and within budget; textures right-sized + mipmapped
- [ ] Fonts subset (latin+tamil) woff2, `display:swap` + `size-adjust`; SVGO on all SVG; Brotli on text
- [ ] No oversized/unoptimized asset in the network waterfall (manual audit)

### D · Responsive & cross-device
- [ ] Layouts correct at 360 / 768 / 1024 / 1280 / 1536; no horizontal scroll; safe-area insets on notched phones
- [ ] Device tiers resolve correctly (low/mid/high GPU) → right scene variant; posters on T0–T2 where heavy
- [ ] `prefers-reduced-data` / Save-Data / 2g-3g → posters; `prefers-reduced-motion` → poster/T1
- [ ] Touch: pointer-parallax & custom cursor disabled on coarse pointers; targets ≥ 44px
- [ ] Browsers: latest Chrome, Safari, Firefox, Edge + iOS Safari + Android Chrome (incl. one older iOS)
- [ ] No-WebGL and no-JS: site fully usable, content + posters + CTAs present and converting
- [ ] Resize/orientation change: no layout thrash, no CLS, canvas re-fits

### E · Accessibility (WCAG 2.2 AA)
- [ ] **[GATE]** `axe` (Playwright) 0 serious/critical on every route, both locales
- [ ] **[GATE]** Reduced-motion parity: identical information + identical CTAs as static; zero transforms/scrub
- [ ] **[GATE]** Keyboard-complete: all actions reachable/operable; every 3D interaction has a DOM/keyboard equivalent
- [ ] Visible focus everywhere (2px ring + offset, ≥3:1); `Esc`/focus-trap/return on menus & modals; skip-link works
- [ ] Contrast verified on all text/icon pairings (both themes, both locales); non-text UI ≥ 3:1; never color-only
- [ ] Screen-reader pass (VoiceOver iOS/Safari + NVDA Windows) on the 6 key templates; scenes have text alternatives stating the claim; animated numbers expose final value
- [ ] Forms: labels, `aria-invalid`/`describedby`, error summary + focus mgmt, required in text
- [ ] 200% zoom + 400% reflow usable; forced-colors/high-contrast mode OK (logo mono, glass solid)
- [ ] No flashing > 3×/s; no camera roll; parallax ≤ 12%; "Reduce motion" in-product toggle present
- [ ] `lang`/`hreflang` correct; Tamil renders with correct glyphs/line-height; `/accessibility` statement published

### F · SEO & structured data
- [ ] Every page server-renders full copy/headings/links/posters (view-source check); usable with JS off
- [ ] `title`/`description`/canonical per page; OG + Twitter cards render (debugger check)
- [ ] `hreflang` en/ta/x-default on all pages; both locales in `sitemap.xml`; `robots.txt` correct
- [ ] All images/posters have descriptive `alt`; one `h1`/page; heading order valid; breadcrumbs present
- [ ] **[GATE]** JSON-LD validates (Rich Results + Schema validator): Organization, LocalBusiness, Service, Offer, Article, BreadcrumbList, FAQPage present where relevant; only marks up visible content
- [ ] 301s for any legacy URLs; no duplicate content; filter/param URLs canonicalized
- [ ] Search Console: property verified, sitemap submitted, no coverage errors on a pre-crawl

### G · Caching & headers
- [ ] Hashed static/`.glb`/KTX2/fonts served `immutable, max-age=31536000`
- [ ] ISR pages: `s-maxage` + `stale-while-revalidate`; on-demand revalidation webhook works (edit CMS → page updates)
- [ ] Brotli at edge; HTTP/2-3; repeat visit loads scenes from cache (near-instant, verify in Network)
- [ ] Asset manifest/version busts caches on model update; no stale-JS trap (network-first HTML)
- [ ] Security headers present: CSP (incl. `worker-src`/`blob:`), HSTS, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy

### H · Deployment, monitoring & rollback
- [ ] CI gates all green on the release commit (verify, axe, Lighthouse-CI, size-limit, 3D-budget, visual)
- [ ] Preview == production parity; env vars/secrets set per environment (none committed)
- [ ] Every 3D scene behind a flag with tested **instant poster rollback**; canary plan defined
- [ ] RUM live (field CWV), FPS-per-tier probe reporting, Sentry capturing (incl. context-loss + `.glb` fails), uptime/synthetic on key routes + lead endpoint
- [ ] One-click rollback tested; runbook written; on-call/owner assigned for launch window

### I · Content, analytics, legal & consent
- [ ] Copy proofed EN + TA; **no forbidden superlatives** ("world-class/best/cheapest/unbeatable"); claims backed by data
- [ ] All project imagery/testimonials have recorded consent; prices current; guarantees accurate
- [ ] Analytics events fire correctly **only after consent** (GA4 + PostHog); `motion_tier`/`reduced_motion` tagged
- [ ] DPDPA: consent banner (no pre-tick), privacy notice, data in-region, deletion path; no PII in event payloads
- [ ] Lead form posts to Space OS queue with UTM/source; test lead received; 30-min first-touch SLA wired
- [ ] Footer trust row (CIN/GST/privacy/terms); WhatsApp/contact links correct; 404 & error pages branded + helpful

### J · Security
- [ ] HTTPS everywhere, HSTS; no mixed content; no secrets/keys in client bundle (grep build output)
- [ ] Form inputs validated server-side (Zod) + rate-limited; spam/bot protection on lead endpoint
- [ ] Dependencies audited (no known critical CVEs); CSP blocks inline-script injection; SRI where applicable

### K · Final Go / No-Go gates (all must be green to launch)
- [ ] **[GATE]** All CWV budgets met (field or lab p75) on mobile
- [ ] **[GATE]** 30fps floor holds on mid-tier mobile; degrade + poster fallback verified
- [ ] **[GATE]** `axe` clean + keyboard + reduced-motion parity + SR pass on key templates
- [ ] **[GATE]** Site fully converts with **zero 3D / zero JS** (poster + DOM path)
- [ ] **[GATE]** JSON-LD valid; SEO crawl clean; sitemap/robots/hreflang correct
- [ ] **[GATE]** Rollback tested; monitoring live; consent/DPDPA compliant
- [ ] Sign-off: Perf ✅ · A11y ✅ · SEO ✅ · Content ✅ · Eng lead ✅

---

**The one-line QA philosophy:** *the site must be excellent — fast, accessible, indexable, converting — with the 3D turned off; the 3D then makes the capable devices feel extraordinary. If any premium effect can't hold that line, it degrades until it can.*

*Companion to the Luxe Axis Spec v1.1, Cinematic Direction, Interface System, 3D Interaction Framework, and Build Backlog.*

*End of performance, accessibility & QA document.*
