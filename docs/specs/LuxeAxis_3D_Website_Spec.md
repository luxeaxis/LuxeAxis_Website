# Luxe Axis — 3D Website Operating System
### Complete Build Specification for Claude Code

**Client:** Luxe Axis Private Limited — Chennai, Tamil Nadu
**Positioning statement:** *Where Space Meets Intelligence* (rational — the strategic position)
**Signature tagline (logo lockup):** *Designing Dreams* (emotional — locks up with the mark)
**Positioning:** Intelligent Premium — an AI-augmented "space intelligence" company, not a traditional design studio
**Primary brand asset:** `public/brand/LuxeAxis_Logo_Primary.jpg` (supplied 1254×1254; to be re-mastered as layered SVG per §3.6)
**Document version:** 1.1 · Author: Creative Direction + Front-End Engineering
**v1.1 change:** bound the supplied primary logo into the system — corrected wordmark to the real serif LUXE(gold)/AXIS(navy) lockup, added §3.6 Logo & Brand-Mark System + metallic-gold token, reconciled *Designing Dreams* (signature) with *Where Space Meets Intelligence* (positioning), and tied the monogram's interior vignette directly to the hero 3D and loader.
**Target stack (locked, from existing Tech Plan):** Next.js (App Router) · React · TypeScript · bilingual EN/Tamil · DPDPA-compliant · hosted AWS Mumbai (primary) + Singapore (secondary)

---

## 0. How to use this spec with Claude Code

This is a hand-off spec. Read top-to-bottom once, then build in the order of **§10 Implementation Roadmap**. Every section is written to be actionable:

- **Tokens** (§3) are copy-paste ready as CSS variables and Tailwind config. Build these first; everything references them.
- **Component names** are `PascalCase` and map 1:1 to files in the repo structure (§10.2).
- **Every animation** in §6 carries an explicit **Purpose** (why it exists) and a **Reduced-motion fallback** (what happens when the user opts out). Do not ship an animation that is not in that table; if you need a new one, add a row with a purpose first.
- **Acceptance gates** (§10.6) are the definition of done. A page is not complete until it passes them.

Guiding rule for the whole build: **motion must always be subordinate to meaning.** Luxe Axis sells trust and intelligence. A 3D effect that does not prove a claim, guide attention, or reduce cognitive load is deleted, not kept.

---

## 1. Product vision & strategic north star

### 1.1 The core idea — "The Living Axis"

The site is built around one persistent 3D metaphor that literally renders the tagline. As the visitor scrolls, they travel down a vertical **Axis** — a fine line of light in a deep navy void. Along that axis, **space** assembles (bare architectural volumes resolve into finished, lived-in rooms) and **intelligence** illuminates it (a Vastu grid, a Space Score gauge, data light, the AI's "reasoning"). 

- **Navy void (#0D2B4E)** = space, potential, the unbuilt.
- **Gold light (#C9A84C / #B8860B)** = intelligence, craft, the illuminating idea.
- **Teal signal (#1A7A85)** = the human / wellness dimension — the reminder that "AI assists; humans decide."

This is not decoration. It is the argument of the business rendered spatially: raw space + applied intelligence = a designed life. Every signature 3D moment (§5.3) is a proof point of a real Luxe Axis capability, never an abstract flourish.

**The logo is the seed of the whole system.** The primary mark already contains the entire concept in miniature: the "A" is a gabled *home* whose negative space holds a line-art interior — a pendant light (the illuminating idea), a sofa (the lived-in space), a potted plant (the teal human/wellness note) — resting on a single sweeping gold *swoosh* (the Axis / horizon). The website simply **dimensionalizes the logo**: the same pendant, seat, plant and horizon line that live inside the "A" are the exact elements that assemble in the 3D hero (§5.1), and the swoosh becomes the gold Axis the visitor travels. Brand mark and product experience are therefore one continuous idea — the mark promises *Designing Dreams*, the site delivers *Where Space Meets Intelligence*.

### 1.2 Non-negotiable design principles (derived from brand values)

| # | Principle | Source value | What it forces in the build |
|---|-----------|-------------|------------------------------|
| P1 | **Motion proves, never distracts** | Intelligent Elegance | Every animation maps to a claim, an affordance, or attention guidance (§6.1). |
| P2 | **Show the work** | Radical Transparency | Real project photography, real data, the public fee calculator, no stock substitution. |
| P3 | **Trust over spectacle** | Trust over reach | Performance & legibility beat wow-factor. Fast first paint, honest copy, no dark patterns. |
| P4 | **Human in the loop is visible** | Technology Humility | Teal "human" cues appear wherever AI is shown; AI is framed as amplifier, not author. |
| P5 | **Calm by default, rich on intent** | Spacefulness | Generous negative space; heavy 3D is opt-in via scroll/hover, never auto-assaulting. |
| P6 | **Accessible is the baseline, not a tier** | Sustainable / inclusive premium | WCAG 2.2 AA and full reduced-motion parity are acceptance gates, not add-ons. |

### 1.3 Success metrics (the site is a lead engine, tie build to these)

The website is the top of the Owned funnel and the primary conversion surface. Instrument against the business's own KPI targets:

- **Primary conversion:** *Design Audit booked* (the qualified-lead handoff stage). Target site-wide CVR ≥ 3.5% of unique visitors; NRI landing pages ≥ 5% (per existing NRI playbook).
- **Secondary:** Fee-calculator completion, brochure/lookbook download, Space OS demo request, newsletter opt-in.
- **Quality:** MQL-to-audit ≥ 22%; bounce on NRI pages ≤ 55%.
- **Experience health:** LCP ≤ 2.5s on 4G mid-tier mobile, INP ≤ 200ms, CLS ≤ 0.1 (§10.5). If a 3D feature threatens these, it degrades — the number wins.

---

## 2. Information architecture

### 2.1 Audience → intent → path

Six primary personas from the business model, each with a distinct entry intent the IA must serve:

| Persona | Core question the site must answer fast | Primary path | Primary CTA |
|---------|------------------------------------------|--------------|-------------|
| IT professional (2/3BHK, OMR corridor) | "Can I afford a premium job, and what will it cost?" | Home → Residential → **Fee Calculator** → Audit | Book free audit |
| Entrepreneur / villa owner | "Is this bespoke enough for me?" | Home → Portfolio → Elite tier → Audit | Book design audit |
| **NRI (Tamil diaspora)** | "Can I run a Chennai project from abroad?" | Geo landing (/nri) → Remote/White-Glove protocol → WhatsApp/Zoom | Start remote design |
| Corporate / SME workplace | "Will this improve my workspace + be data-backed?" | Home → Commercial → POE/analytics → Consult | Request workspace consult |
| Retail / F&B / Healthcare | "Do they understand experience + compliance?" | Commercial → vertical page → Consult | Request consult |
| Design-curious / community | "Are these people credible authorities?" | Journal / Chennai Spaces Report / Academy | Join Design Club / subscribe |

### 2.2 Sitemap

```
/                         Home — the Living Axis narrative + all-audience routing
/residential              Overview + the three tiers
  /residential/essential
  /residential/signature
  /residential/elite
/commercial               Workplace, retail, hospitality, healthcare
  /commercial/workplace
  /commercial/retail-hospitality
  /commercial/healthcare
/digital                  Remote design (Starter / Pro / Premium)
/intelligence             The tech story hub: "The Intelligence Behind the Space"
  /intelligence/space-os        Client platform (project tracking, moodboards, AR)
  /intelligence/vastu-tech      AI Vastu compatibility — the signature moat
  /intelligence/space-score     Proprietary Wellness/Function/Aesthetics/Sustainability metric
  /intelligence/virtual-staging Real-estate B2B staging
/portfolio                Filterable project gallery
  /portfolio/[project]          Immersive case study
/pricing                  Transparent pricing + the Fee Calculator (trust magnet)
/process                  How we work — the journey along the Axis, guarantees
/about                    Studio, philosophy, team, values, Design Club
/journal                  Content/SEO hub + Chennai Spaces Report
/nri                      NRI hub → /nri/singapore /uae /usa /uk /canada /australia
/contact                  Audit booking (primary conversion) + studio details
/book-audit               Dedicated conversion route (ad landing target)
Utility: /privacy /terms /accessibility /sitemap.xml + /ta/* bilingual mirror
```

### 2.3 Navigation model

- **Primary header (persistent, glass-morphic over the canvas):** Residential · Commercial · Intelligence · Portfolio · Pricing — with a single high-contrast gold **"Book Audit"** button held right. Max 5 top items + 1 CTA; deeper items live in mega-menu panels.
- **Mega-menu:** on hover/focus (desktop) or tap (touch), a panel drops with sub-items + one live 3D thumbnail + one "featured proof" link (e.g., latest project, Chennai Spaces Report). Panel is DOM/HTML, not 3D, for speed and a11y.
- **Language switch (EN / தமிழ்):** top-right utility, persists via cookie + `hreflang`.
- **Mobile:** hamburger → full-screen sheet, thumb-reachable accordion, sticky "Book Audit" bar pinned to bottom safe-area.
- **Footer:** full sitemap, trust row (CIN, GST, DPDPA/privacy, professional-indemnity note), Design Club opt-in, social, address (Chennai), WhatsApp.
- **Persistent conversion rail:** a subtle bottom-right "Book a free design audit" affordance that appears after the first scroll section on every page except the booking pages themselves.

### 2.4 URL, i18n & content model

- **Routing:** App Router with locale segment `/[locale]/...` where locale ∈ `en` (default, un-prefixed) `ta`. `next-intl` for message catalogs. `hreflang` + `x-default` on every page. Tamil is a first-class mirror, not an afterthought (brand launched bilingual).
- **CMS:** headless (Sanity or Payload — pick one; Sanity recommended for editor UX + i18n plugin). Rendering via RSC + ISR (revalidate 60s for Journal, on-demand for Portfolio/Pricing).
- **Core content entities:**

```ts
Project { title, slug, tier, category, neighbourhood, year,
          heroModel?(glTF), gallery[], beforeAfter[], designMoves[],
          spaceScore{wellness,function,aesthetics,sustainability},
          testimonial?, consentStatus, locales{en,ta} }
Service { name, tier, inclusions[], priceBand, faqs[], ctaVariant }
IntelligenceFeature { name, claim, proofMetric, demoModel?, locales }
JournalPost { title, slug, cluster(SEO), body(portable-text), author, seo }
Persona/Segment, Testimonial, TeamMember, Guarantee, Faq, CalculatorConfig
```

- **SEO:** per-page metadata, JSON-LD (`Organization`, `LocalBusiness` Chennai, `Service`, `Article`, `BreadcrumbList`), keyword clusters from the marketing plan ("interior designer Chennai", "2BHK interior design Chennai price", "office interior designer Chennai"). Fee calculator and Journal are the organic engines — server-render them fully, no 3D dependency for content.

---

## 3. Visual identity (web expression)

The identity is inherited from the Brand Voice & Visual Identity Policy and expressed for screen. The default surface is **dark** (the navy void that makes the gold "intelligence" light read as luminous), with **light/ivory** sections used deliberately for reading-heavy content (Journal, Pricing, legal) where a bright, calm surface aids comprehension (principle P5).

### 3.1 Colour system — tokens + verified contrast rules

Contrast ratios below are computed (WCAG 2.x). **Follow the usage rules — they are accessibility gates, not suggestions.**

| Token | Hex | Role | Verified pairings (ratio) |
|-------|-----|------|----------------------------|
| `--color-navy` | `#0D2B4E` | Primary dark surface / brand base | Ivory text **13.67:1 ✅AAA**; White text **14.26:1 ✅AAA** |
| `--color-navy-900` | `#081B32` | Deepest void (canvas bg, gradients) | for depth only |
| `--color-ivory` | `#FCFAF5` | Primary light surface / text on navy | Navy text on ivory **13.67:1 ✅AAA** |
| `--color-gold` | `#C9A84C` | **Interactive/importance accent on dark** | On navy **6.24:1 ✅AA**; Navy text *on* gold **6.24:1 ✅AA** |
| `--color-gold-deep` | `#B8860B` | Gold for large text/icons only | On navy **4.38:1 (AA large only)**; **never** gold body text on ivory (2.19:1 ❌) |
| `--color-teal` | `#1A7A85` | Human/wellness signal; links on light | On ivory **4.83:1 ✅AA**; White on teal **5.04:1 ✅AA**; **never** teal on navy (2.83:1 ❌) |
| `--color-ink` | `#111315` | Text on gold buttons/light chips | On gold-light **8.15:1 ✅AAA** |

**Hard rules baked from the math:**
1. Body text on navy → **ivory or white only**. Gold is for emphasis words, rules, icons, and large display — not paragraphs.
2. Gold-light `#C9A84C` is the interactive gold on dark (buttons, links, focus). Gold-deep `#B8860B` is reserved for headings/iconography.
3. **Never** put gold text on ivory (fails) or teal text on navy (fails). Teal is a *light-surface* colour and a 3D material colour, not a dark-surface text colour.
4. Primary button = gold-light fill + `--color-ink` label (8.15:1). Secondary = ivory outline on navy. Never rely on colour alone for state (add icon/underline) — colour-blind safe.

```css
:root{
  --color-navy:#0D2B4E; --color-navy-900:#081B32;
  --color-ivory:#FCFAF5; --color-gold:#C9A84C; --color-gold-deep:#B8860B;
  --color-teal:#1A7A85; --color-ink:#111315;
  --surface:var(--color-navy); --on-surface:var(--color-ivory);
  --accent:var(--color-gold); --accent-strong:var(--color-gold-deep);
  --focus-ring:#EAD48A; /* gold-tint, ≥3:1 vs navy for visible focus */
  /* Metallic gold used by the LOGO + large brand/hero moments ONLY — decorative, never for body text or small UI (see contrast rules) */
  --gold-champagne:#E7C874;
  --gradient-gold:linear-gradient(135deg,#E7C874 0%,#C9A84C 45%,#A87B2E 100%);
}
[data-theme="light"]{ --surface:var(--color-ivory); --on-surface:var(--color-navy); --accent:var(--color-teal); }
```

### 3.2 Typography

Per policy: **Playfair Display** (pre-approved display alternate) carries the editorial, luxury voice for headlines; **Inter** (pre-approved) is the UI/body workhorse for legibility on screen; Georgia is retained as the print/system fallback for display. Tamil uses **Noto Serif Tamil** (display) + **Noto Sans Tamil** (body) so the bilingual mirror keeps the same tonal contrast.

- Load via `next/font` (self-hosted, `display:swap`, subset latin + tamil). Cap web-font payload ≤ 130KB. Preload only the two weights above the fold (Playfair 600, Inter 400).
- **Type scale (fluid, `clamp()` — 1.2 mobile → 1.25 desktop ratio):**

| Token | clamp() | Use |
|-------|---------|-----|
| `--fs-display` | `clamp(2.75rem, 6vw, 5.5rem)` | Hero H1 (Playfair 600, tight -0.02em) |
| `--fs-h1` | `clamp(2rem, 4vw, 3.25rem)` | Section titles |
| `--fs-h2` | `clamp(1.5rem, 2.5vw, 2.25rem)` | Sub-sections |
| `--fs-h3` | `clamp(1.25rem, 1.6vw, 1.5rem)` | Card titles |
| `--fs-body` | `clamp(1rem, 1.1vw, 1.125rem)` | Body (Inter 400, line-height 1.6) |
| `--fs-small` | `0.875rem` | Meta, captions, legal |

- **Wordmark (per supplied artwork):** a refined high-contrast **serif**, generously letter-spaced, in a **two-colour split** — **"LUXE" in gold**, **"AXIS" in navy** — followed by a thin rule with a centred four-point gold star/sparkle, and the signature line **"DESIGNING DREAMS"** in gold small-caps, wide-tracked. The display serif on web is **Playfair Display** (matches the supplied letterforms). The wordmark is always rendered as an inline **SVG from the official artwork file — never live text, never retyped, never restretched or recoloured** (Brand Voice & Visual Identity Policy). Provide dark-surface (gold+ivory) and light-surface (gold+navy) variants. Full usage in §3.6.

### 3.3 Spacing, grid & radii

- **Base unit:** 4px. Spacing scale `4,8,12,16,24,32,48,64,96,128`.
- **Grid:** 12-col, max content width 1280px, gutter 24px desktop / 16px mobile, outer margin `clamp(16px,5vw,96px)`. A wide "bleed" track lets 3D canvas sections span full viewport while text stays in the 12-col measure.
- **Radii:** `--r-sm 8px`, `--r-md 14px`, `--r-lg 24px`, `--r-pill 999px`. Cards use `--r-lg`. Glass panels use `--r-md`.
- **Elevation:** on dark, elevation is expressed with *light* (a soft gold/ivory inner glow + subtle border `rgba(252,250,245,.12)`), not heavy drop shadows. On light surfaces, use soft neutral shadows `0 8px 30px rgba(13,43,78,.08)`.

### 3.4 Materials, imagery & texture

- **Materiality is the brand's product** — surfaces should feel like specified materials: brushed brass (gold), honed navy stone, warm oak, linen. Use subtle grain/noise overlay (SVG turbulence at ~3% opacity) on navy to avoid flat digital blacks; this reads as "considered", not "cheap gradient".
- **Photography:** natural light, no heavy filters, no Instagram presets, no stock for project work (policy). All project imagery `next/image`, AVIF/WebP, blurhash placeholders, art-directed crops per breakpoint.
- **Glass-morphism:** navigation and floating UI use `backdrop-filter: blur(14px)` over navy at 55% opacity with a 1px ivory-tint border. Provide a solid-fill fallback where `backdrop-filter` is unsupported.
- **Iconography:** thin 1.5px line icons, rounded joins, gold-deep on dark / navy on light. Custom set for the Intelligence features (Vastu compass, Space Score gauge, AR viewport).

### 3.5 Motion tokens (the physics of the brand)

Motion is "calm, weighted, precise" — like well-engineered furniture drawers. Codify it so every animation pulls from the same vocabulary (consistency = P1 + Intelligent Elegance).

```css
:root{
  --dur-1:120ms;  /* micro feedback (hover, press) */
  --dur-2:240ms;  /* UI transitions (menus, toggles) */
  --dur-3:480ms;  /* element entrances */
  --dur-4:800ms;  /* section reveals, camera moves */
  --dur-5:1200ms; /* signature hero choreography */
  --ease-standard:cubic-bezier(.4,0,.2,1);
  --ease-entrance:cubic-bezier(.16,1,.3,1);   /* decelerate, "settling" */
  --ease-exit:cubic-bezier(.4,0,1,1);
  --ease-spatial:cubic-bezier(.65,.05,.36,1); /* camera / 3D, weighted */
}
```
Rules: nothing snaps (no linear on visible motion); entrances decelerate (things *settle*, echoing "spacefulness"); exits are quicker than entrances; stagger siblings by 60–90ms; parallax never exceeds 12% displacement (calm, not carnival).

### 3.6 Logo & brand-mark system

**Source artwork:** `public/brand/LuxeAxis_Logo_Primary.jpg` (supplied). The raster must be **re-mastered as layered vector SVG** before build — the raster is reference only; production uses vector so the mark stays crisp and animatable.

**Anatomy of the mark (name the layers — the animation & 3D system reference them):**
- `mark` — the interlocked **L + A monogram**; the "A" is a gabled *home* silhouette.
- `mark.interior` — the line-art vignette inside the "A": `pendant`, `sofa`, `plant`, `wall-lines`. **This is the seed set for the hero 3D (§5.1).**
- `mark.swoosh` — the sweeping gold ribbon under the monogram = **the Axis / horizon**.
- `wordmark` — serif **"LUXE"** (gold) + **"AXIS"** (navy).
- `divider` — thin rule + centred four-point **star**.
- `tagline` — **"DESIGNING DREAMS"** small-caps.

**Lockup variants to produce (all as optimised SVG + 2×/3× PNG):**

| Variant | Contents | Primary use |
|---------|----------|-------------|
| `logo-primary` | Full stacked lockup (mark + wordmark + divider + tagline) | Footer, about, share/OG, print |
| `logo-horizontal` | Mark left + wordmark right (no tagline) | Desktop header (condensed state) |
| `wordmark` | LUXE AXIS only | Inline text contexts, legal |
| `mark` | Monogram only (with/without swoosh) | **Favicon, app icon, avatar, loader, watermark** |
| `mark-mono` | Single-colour knockouts: all-gold, all-navy, all-ivory | On photos, dark/light surfaces, forced-colors |

**Colour handling (respects the §3.1 contrast rules):**
- On dark surfaces: metallic `--gradient-gold` on the mark + gold "LUXE" + **ivory "AXIS"** (navy AXIS is invisible on navy — swap to ivory). 
- On light/ivory surfaces: gold mark + gold "LUXE" + **navy "AXIS"** (as supplied).
- Small sizes (< 40px), forced-colors, and high-contrast mode: use **flat `mark-mono`** (no gradient) — metallic gradients smear and fail contrast when tiny. The gradient is a large-format flourish only.
- Never recolour outside the palette, rotate, stretch, add shadows, or place on a busy/low-contrast background (Policy 01).

**Clear space & minimum sizes:** clear space = height of the "L" on all sides. Min: full lockup 120px wide; horizontal 90px; mark 24px. Below 24px use a simplified mark (drop `mark.interior` detail — it muddies at small scale).

**Deliverables checklist:** `favicon.ico` (mark), `icon.svg`, `apple-touch-icon.png` 180², maskable `icon-512.png` (mark on navy, safe-zone padded), `opengraph-image` (logo-primary on navy with the tagline, 1200×630), `site.webmanifest` theme-color `#0D2B4E`.

**Placement:**
- **Header:** `logo-horizontal` (dark variant) top-left, links to `/`. Condenses to `mark` only on scroll (N1) below `md`.
- **Footer:** `logo-primary` with tagline.
- **Loader / first paint:** the `mark` line-art draws on, then dimensionalizes into the hero (G2, §6.2).
- **Accessibility:** inline SVG carries `role="img"` + `<title>Luxe Axis — Designing Dreams</title>`; the `<img>` fallback `alt="Luxe Axis — Designing Dreams"`. Decorative repeats of the mark are `aria-hidden`.

**The interior vignette as a reusable motif.** Extract `pendant`, `sofa`, `plant`, `swoosh` as a small **line-icon set** drawn in the same stroke weight as the logo. Reuse them as: section dividers, list bullets on service pages, empty-state art, and — most importantly — the **exact geometry that the hero 3D scene instantiates** so the brand mark and the WebGL scene are visibly the same objects. This is the tightest possible bind between identity and product (P1, P2).

---

## 4. 3D interaction system

### 4.1 Stack & rendering strategy

| Concern | Choice | Why |
|---------|--------|-----|
| Renderer | **Three.js** via **React Three Fiber (R3F)** | Declarative, component-parity with the React app, mature ecosystem |
| Helpers | **@react-three/drei** | Camera rigs, loaders, `<Html>`, environment, `AdaptiveDpr`, `Preload` |
| Perf/scaling | **@react-three/drei `PerformanceMonitor`** + `AdaptiveDpr`/`AdaptiveEvents` | Auto-throttles DPR/quality to hold frame rate |
| Scroll | **Lenis** (smooth scroll) + **GSAP ScrollTrigger** | Frame-accurate scroll choreography, pinning, scrubbing |
| Tweening (DOM) | **GSAP** (timeline) | Complements ScrollTrigger; one motion engine for DOM |
| Post-processing | **@react-three/postprocessing** (Bloom, subtle DoF, vignette) | The gold "intelligence" glow depends on Bloom; used sparingly on hero only |
| Physics | none by default | No physics engine unless a moment truly needs it — bytes cost trust (P3) |

**Single persistent Canvas.** One `<Canvas>` lives at the app-shell level behind the DOM (`position:fixed; z-index:0; pointer-events:none` except on interactive moments). Scenes are swapped by route/scroll rather than mounting/unmounting WebGL contexts — this avoids context-loss jank and lets the Axis feel continuous between pages (reinforces the single-metaphor narrative). DOM content renders above it in normal flow with transparent section backgrounds where the 3D should show through.

```
<AppShell>
  <ThreeCanvas>            // fixed, full-viewport, one WebGL context
     <AxisRig/>            // the light-line spine + camera dolly
     <SceneRouter/>        // shows the active scene graph by route/scroll
  </ThreeCanvas>
  <SmoothScrollProvider>   // Lenis
     <main> …DOM sections… </main>
  </SmoothScrollProvider>
</AppShell>
```

### 4.2 Camera & the Axis rig

- One camera on a **dolly constrained to the Axis** (mostly vertical travel), driven by normalized scroll progress `0→1` per page. Scroll maps to camera position via a GSAP timeline (`scrub: true`), so the user's scroll *is* the camera — no autoplay, the user is always in control (P3, and it's an accessibility win).
- Gentle **pointer parallax** offsets the camera target by ≤ 3° (desktop pointer / device-orientation on mobile is **off by default** — motion-sensitivity). Damped with `MathUtils.damp` for weight.
- Field of view 35–45° (architectural, not fish-eye). Camera moves use `--ease-spatial` timing.

### 4.3 Asset pipeline (budget-driven)

- Format **glTF 2.0 (.glb)**, **Draco** geometry compression, **KTX2 / Basis** textures, `meshopt` where useful.
- Per-scene budget: ≤ 1.5MB compressed geometry+textures, ≤ 100k triangles visible, ≤ 4 draw-heavy materials. Hero scene hard cap **2.5MB**.
- **LODs** for any hero object (near/mid/far). Instancing for repeated elements (furniture, grid cells, particles).
- Lazy-load scenes with `React.lazy` + `<Preload all/>` for the *next* scene during idle. Textures stream after first paint; never block LCP on a texture.
- Lighting baked where possible (baked AO + lightmaps) to cut runtime cost; one real-time key light + environment map (`.hdr` ≤ 512²) for the gold glint.

### 4.4 Device tiers & graceful degradation (this is a requirement, not a nice-to-have)

Detect on load (GPU heuristic via `detect-gpu`, `navigator.deviceMemory`, `hardwareConcurrency`, `matchMedia('(prefers-reduced-motion)')`, `matchMedia('(prefers-reduced-data)')`, save-data header).

| Tier | Trigger | 3D behaviour |
|------|---------|--------------|
| **T3 Full** | Desktop / high-end mobile, no reduced flags | Full scenes, Bloom, DoF, pointer parallax, scroll choreography |
| **T2 Lite** | Mid mobile / integrated GPU / `prefers-reduced-data` | Simplified geometry, no post-processing, DPR capped 1.5, particles off |
| **T1 Static** | Low-end, `prefers-reduced-motion`, no-WebGL, or save-data | **No live canvas.** Pre-rendered poster images/video-still per moment; all content & CTAs fully present |
| **T0 SSR/no-JS** | Crawler, JS disabled | Semantic HTML + posters. Site is 100% usable and indexable |

**The content never lives inside the 3D.** Every headline, stat, and CTA is real DOM. If WebGL fails at any tier, the page is still complete and converts. This is both a resilience and an accessibility guarantee.

### 4.5 Interaction mechanics

- **Scroll-driven** (primary): camera dolly + scene state scrub to scroll. Sections `pin` while a moment plays, then release.
- **Hover/focus** (desktop): materials respond (subtle emissive lift on gold), portfolio objects rise ~8px. All hover states have keyboard-focus equivalents.
- **Drag-orbit** (opt-in): only on explicitly interactive objects (portfolio hero object, Space OS device) with a visible "drag to explore" affordance; constrained orbit, snaps back on release.
- **Pointer:events** enabled only on interactive meshes to keep the page scrollable and cheap.

---

## 5. Signature 3D moments (each proves a real capability)

Every moment below is tied to a business claim from the strategy so the spectacle *earns its bytes* (P1). Ordered by scroll journey on the home page, then feature pages.

### 5.1 Home — "The Axis Forms" (hero) — *the logo, dimensionalized*
**What:** The page opens on the **logo's monogram**, centred. The "A"-home's interior line-art (`pendant`, `sofa`, `plant`, `wall-lines`) and the gold `swoosh` are the literal seed. As the loader completes and the user begins to scroll, the flat line-art **lifts off the 2D mark into 3D**: the `swoosh` unrolls into the gold **Axis** running down the viewport; the `wall-lines` extrude into a bare-shell volume around it; the `pendant` drops and lights (warm key light blooms on); the `sofa` gains material and settles; the `plant` (teal/green — the human note, "AI assists, humans decide") unfurls last. The same four objects that live inside the logo are now a furnished room on the Axis.
**Proves:** the concept-to-finished-home transformation and the "40% faster concept-to-approval" promise — space + intelligence = a designed life — while making the brand mark and the product experience visibly one thing (see §1.1, §3.6).
**Mechanics:** scroll-scrubbed timeline continuing directly out of the G2 loader (no seam); Bloom on the Axis and pendant; the geometry is the **same vector set** extracted from the logo (§3.6), so identity and scene never drift. Ends pinned on the positioning line **"Where Space Meets Intelligence"** with the two primary CTAs (Book Audit / Explore Work); the signature line *Designing Dreams* sits with the wordmark.
**Reduced-motion / T1:** a single, beautifully lit static render of the finished room-on-Axis (the "resolved" logo) with tagline and CTAs. No assembly; the logo remains recognisably the source image.

### 5.2 Home — "Six Ways In" persona router
**What:** Six softly-lit tiles orbit a low-poly Chennai skyline marker; hovering/focusing a tile lifts it and previews its path. **Purpose:** route the six personas fast (§2.1) without a wall of text. **Reduced-motion:** static responsive grid of six cards.

### 5.3 Vastu-Tech AI — "The Grid Reads the Room"
**What:** A 3D floor plan; a gold Vastu grid + compass overlays and animates a compatibility scan; zones pulse (favourable = gold, attention = teal) with plain-language callouts. A visible **teal "reviewed by human" chip** appears (P4 — AI assists, humans decide).
**Proves:** the Vastu-Tech moat — "India's first AI Vastu compatibility checker." This is the single most differentiating screen; give it the most polish.
**Reduced-motion / T1:** static annotated floor-plan image with the same callouts; a "See how it works" text stepper replaces the scan.

### 5.4 Space Score — "Rate any space"
**What:** A room with a rotating four-arc gauge resolving to scores on **Wellness / Function / Aesthetics / Sustainability**; each arc fills as its label writes on.
**Proves:** the proprietary Space Score metric (B2B/licensing story). **Reduced-motion:** static gauge at final values + bar readout.

### 5.5 Space OS — "Your project, live"
**What:** A floating device (tablet) showing the client portal — moodboard, 3D progress tracker, budget dashboard, AR preview — with a light drag-to-tilt. **Proves:** the Space OS switching-cost moat + Radical Transparency (budget visible). **Reduced-motion:** static device shot + feature list; real screenshots.

### 5.6 Portfolio — "Rooms you can walk around"
**What:** Projects as material-rich 3D cards on the Axis; the open project gets a constrained drag-orbit hero object; scroll drives a slow push-in through the case study. **Proves:** craft quality ("show the work"). **Reduced-motion:** gallery of high-res photos with lightbox; before/after slider.

### 5.7 Pricing — "The transparent axis"
**What:** Mostly DOM (a real, fast fee calculator) with a restrained 3D accent: a gold slider bead travels the Axis as the estimate updates. **Proves:** the published-pricing trust signal — "first Chennai studio to publish a clear fee calculator." Keep 3D minimal here; **conversion > spectacle**. **Reduced-motion:** the calculator with a normal progress bar.

### 5.8 Process — "The journey along the Axis"
**What:** The client journey rendered as lit nodes descending the Axis (Discover → Audit → Concept → Approve → Build → Handover → Concierge), each node a scroll-revealed step with the relevant guarantee (e.g., 60-Day Handover Guarantee) attached. **Proves:** systematised delivery + guarantees. **Reduced-motion:** vertical numbered stepper.

### 5.9 NRI hub — "Design Chennai from anywhere"
**What:** A slowly rotating globe with an arc from the visitor's region to Chennai; the White-Glove remote protocol steps write on along the arc. **Proves:** the NRI remote-design capability (highest-CLV segment). **Reduced-motion:** static map graphic + steps; WhatsApp/Zoom CTAs unaffected.

---

## 6. Animation language

### 6.1 The five jobs an animation may do (and if it does none, it's cut)

Every animation on this site must serve at least one of these. This is the gate referenced in §0.

1. **Prove** — dramatize a real capability/claim (the 3D moments in §5).
2. **Orient** — show where you are / where content came from or went (page & element transitions).
3. **Guide** — direct attention to the next decision, usually a CTA (choreographed reveals, focus).
4. **Feedback** — confirm an action happened (hover, press, submit, validate).
5. **Set tone** — ambient life that signals craft, used at ≤ the threshold where it becomes distracting (subtle only).

Anything that only "looks cool" fails all five and is removed. Consistency with the motion tokens (§3.5) is mandatory.

### 6.2 Full animation inventory

Duration/easing reference the tokens in §3.5. **Every row states its purpose and its reduced-motion fallback** (`prefers-reduced-motion: reduce`). Global rule: in reduced-motion mode, opacity fades ≤ 150ms are allowed, but **no transforms, parallax, scroll-scrubbing, autoplay, or 3D choreography** — content appears in place, instantly usable.

#### A. Global & page-level

| ID | Animation | Trigger | Motion / token | Purpose (job) | Reduced-motion fallback |
|----|-----------|---------|----------------|---------------|--------------------------|
| G1 | **Axis continuity transition** | Route change | The gold Axis line stays; DOM cross-fades, camera dollies to next scene `--dur-4 / ease-spatial` | Orient + Tone — the persistent spine tells users it's one continuous "space", reduces disorientation between pages | Instant DOM swap, 120ms opacity fade, no camera move |
| G2 | **Logo-to-scene loader** | Initial paint | The `mark` interior line-art (pendant/sofa/plant) **draws on** stroke-by-stroke, the `swoosh` sweeps, then it seamlessly dimensionalizes into the hero (§5.1) `--dur-5` | Tone + Prove — the brand mark *becomes* the product in ~1.2s; states "Designing Dreams → Where Space Meets Intelligence" in one gesture | Static resolved logo/hero renders immediately; no draw-on, no dimensionalize |
| G3 | **Skeleton → content** | Async/data load | Shimmer placeholder → content fade `--dur-2` | Feedback — communicates progress, prevents layout shift (CLS) | Same, fade only |
| G4 | **Scroll progress bead** | Scroll | Gold bead tracks page progress along a thin axis rail | Orient — persistent sense of depth/position in a long page | Static thin progress bar |

#### B. Navigation & UI micro-interactions

| ID | Animation | Trigger | Motion / token | Purpose (job) | Reduced-motion fallback |
|----|-----------|---------|----------------|---------------|--------------------------|
| N1 | **Header condense** | Scroll > 80px | Header shrinks, gains glass blur `--dur-2 / ease-standard` | Orient + Guide — reclaims space, keeps "Book Audit" always available | Instant state swap, no size tween |
| N2 | **Mega-menu open** | Hover/focus/tap | Panel fades + 8px drop, items stagger 60ms `--dur-2` | Feedback + Guide — reveals structure without a page load | Instant show, no stagger/slide |
| N3 | **Link underline draw** | Hover/focus | Gold underline wipes L→R `--dur-1` | Feedback — affordance; also the non-colour state cue (colour-blind safe) | Underline appears instantly on focus |
| N4 | **Button press** | Pointer/key down | Scale 0.98 + inner-glow lift `--dur-1` | Feedback — tactile confirmation of the primary conversion action | Colour/border state change only |
| N5 | **Language switch** | Toggle EN/தமிழ் | Cross-fade label + 150ms content refade | Feedback — confirms locale change | Instant text swap |
| N6 | **Mobile menu sheet** | Tap hamburger | Full-screen sheet slides up `--dur-3 / ease-entrance` | Orient — clear modal context on touch | Sheet appears instantly (fade) |

#### C. Scroll choreography (content reveals)

| ID | Animation | Trigger | Motion / token | Purpose (job) | Reduced-motion fallback |
|----|-----------|---------|----------------|---------------|--------------------------|
| S1 | **Section rise-in** | In-view (once) | Text/blocks fade + 16px rise, stagger 80ms `--dur-3 / ease-entrance` | Guide — leads the eye down in reading order; "settling" easing = spacefulness | Content visible in place, no transform |
| S2 | **Signature moment scrub** | Scroll within pinned section | The §5 moments scrub to scroll progress | Prove — dramatizes a capability under full user control | Section un-pins; shows the moment's static poster + text |
| S3 | **Stat count-up** | In-view | Numbers (₹, %, project counts) tick to value `--dur-4` | Guide + Prove — draws attention to credibility figures | Final number rendered immediately |
| S4 | **Image parallax** | Scroll | ≤ 12% vertical offset on project imagery | Tone — subtle depth, premium feel | No parallax; static image |
| S5 | **Before/After reveal** | Scroll or drag | Wipe or slider between states | Prove — "show the work" transformation | Draggable slider only (no auto-wipe), fully keyboard operable |

#### D. Feedback & forms (conversion-critical — keep crisp)

| ID | Animation | Trigger | Motion / token | Purpose (job) | Reduced-motion fallback |
|----|-----------|---------|----------------|---------------|--------------------------|
| F1 | **Field focus** | Focus | Label floats up, gold focus ring `--dur-1` | Feedback + a11y — clear focus target (also satisfies visible-focus requirement) | Focus ring appears instantly (no float) |
| F2 | **Inline validation** | Blur/submit | Error slides in with icon; success check draws | Feedback — reduces form abandonment on the audit form | Message appears instantly with icon |
| F3 | **Fee-calculator update** | Input change | Estimate number tweens; gold bead nudges along axis `--dur-2` | Feedback + Prove — makes the transparent-pricing promise feel responsive | Number updates instantly; bar jumps |
| F4 | **Submit success** | Audit booked | Gentle gold "settle" pulse + confirmation card rise | Feedback — rewards the primary conversion; sets calm, confident tone | Confirmation card shown instantly |
| F5 | **Toast / WhatsApp nudge** | Event / delay | Slide-in from bottom-right `--dur-2` | Guide — surfaces the low-friction NRI/WhatsApp path | Appears instantly, static |

#### E. Ambient (tone only — strictly bounded)

| ID | Animation | Trigger | Motion / token | Purpose (job) | Reduced-motion fallback |
|----|-----------|---------|----------------|---------------|--------------------------|
| A1 | **Axis breathing glow** | Idle | Gold emissive oscillates ±6% over 6s | Tone — signals a "live, intelligent" system, subliminal | Off — static glow |
| A2 | **Dust/light motes** | Idle (T3 only) | ≤ 40 instanced particles drift slowly near light | Tone — atmosphere, material realism | Off entirely |
| A3 | **Material sheen** | Pointer over gold | Specular highlight tracks cursor | Tone + Feedback — brass/brushed-metal realism reinforces materiality | Off |
| A4 | **Cursor-follow spotlight** | Pointer move (T3) | Faint radial light follows cursor on dark sections | Guide — gently lifts whatever the user points at | Off |

**Global reduced-motion implementation:** a single `useReducedMotion()` hook (drives both GSAP and R3F) + CSS `@media (prefers-reduced-motion: reduce){ *{animation:none!important; transition-duration:.001ms!important} }` safety net. GSAP timelines check the flag and jump to end-state. The 3D `SceneRouter` mounts the **poster** variant (T1) when the flag is set — so reduced-motion users get the T1 experience regardless of device tier. **Parity is a launch gate (§10.6): the reduced-motion site must deliver identical information and identical conversion paths.**

### 6.3 Page-transition system (detail)

Use the **View Transitions API** (`next-view-transitions`) for DOM continuity, layered over the persistent canvas (G1). Shared elements (a portfolio card → its case-study hero) use `view-transition-name` for a morph. Fallback for unsupported browsers: standard fade (`--dur-2`). Transitions never block interaction > 300ms; the incoming page's LCP element is prioritized over the exit animation.

---

## 7. Responsive layouts

### 7.1 Breakpoints

| Token | Min width | Target |
|-------|-----------|--------|
| `xs` | 0 | Small phones (360) |
| `sm` | 480 | Phones |
| `md` | 768 | Tablet / large phone landscape |
| `lg` | 1024 | Small laptop |
| `xl` | 1280 | Desktop (design baseline) |
| `2xl` | 1536 | Large desktop |

Mobile-first. Design the baseline at `xl`, then reflow down. Use container queries for self-contained components (cards, calculator) so they adapt to their slot, not just the viewport.

### 7.2 Layout behaviour per breakpoint

- **xs–sm (mobile):** single column; hero text over a **static or T2-lite** 3D poster (never the full assembly on first load — protects LCP/battery); sticky bottom "Book Audit" bar; sections stack; mega-menu → full-screen sheet; type steps to the low end of each `clamp()`; touch targets ≥ 44×44px; horizontal scrollers for tiers/portfolio become swipeable snap-carousels.
- **md (tablet):** 2-column where sensible (service cards, portfolio grid 2-up); 3D allowed at T2/T3 but pointer parallax off (touch); mega-menu as tap-panel.
- **lg–2xl (desktop):** full 12-col; full 3D at T3; hover states, drag-orbit, cursor spotlight; portfolio 3-up; split layouts (sticky text column + scrolling 3D canvas column).

### 7.3 3D per device (cross-ref §4.4)

The **layout** and the **3D tier** are decoupled: a low-end desktop can be T2, a flagship phone can be T3. Always resolve tier at runtime, then pick the scene variant. On mobile T3, cap DPR at 2, disable Bloom on scroll, and pause the canvas (`frameloop="demand"`) when the moment is off-screen to save battery.

### 7.4 Key page layouts (wireframe intent)

- **Home:** Hero (5.1) → Six Ways In (5.2) → proof strip (stats S3) → Intelligence teaser (link to 5.3/5.4/5.5) → featured projects (5.6) → transparent-pricing teaser (link to 5.7) → testimonial → audit CTA band.
- **Service (tier) page:** sticky left summary (tier, price band, inclusions, CTA) + scrolling right column (what's included, process excerpt, relevant projects, FAQs). Calculator embedded.
- **Portfolio index:** filter bar (category / neighbourhood / tier) + responsive grid; each card is a 3D object at T3, an image at T1/T2.
- **Case study:** immersive hero (drag-orbit T3 / photo T1) → challenge → design moves → before/after (S5) → Space Score → materials → testimonial → "start yours" CTA.
- **Pricing:** hero → **Fee Calculator** (the star, DOM-first) → what's included per tier → guarantees (60-Day Handover, transparent Supply-Chain fee) → FAQ → audit CTA.
- **Contact / Book-Audit:** two-step form (project basics → contact + preferred time), WhatsApp + Zoom options surfaced for NRI, studio map, trust row. Minimal 3D; speed and clarity win.

---

## 8. Accessibility strategy (WCAG 2.2 AA — an acceptance gate)

Accessibility is baseline (P6). A 3D marketing site has specific, well-known risks; each is addressed below.

### 8.1 Motion & vestibular safety
- `prefers-reduced-motion: reduce` is **fully honoured** — drops to the T1 poster experience with zero transforms/scrubbing (see §6.2 global implementation). Information parity is mandatory.
- No autoplaying looping motion faster than the ambient thresholds; nothing flashes > 3×/sec (seizure safety).
- Provide a persistent **"Reduce motion"** toggle in the footer and in a first-visit preferences chip, independent of the OS setting, stored in a cookie. (Some users can't change OS settings.)

### 8.2 Keyboard & focus
- Full keyboard operability; logical tab order following DOM (which follows reading order).
- **Visible focus** everywhere: `--focus-ring` (gold-tint, ≥ 3:1 vs navy). Never remove outlines without a stronger replacement.
- Skip-to-content link; focus is moved to the new page's `<h1>` region on client navigation and returned to the trigger on modal close.
- The 3D canvas is `aria-hidden="true"` and **not focusable** (it's decorative); all meaning is in the DOM beside it. Interactive 3D objects (portfolio, Space OS) have a **real focusable DOM control** layered via drei `<Html>` that does the same thing (e.g., a button "Open project"), so keyboard users are never asked to orbit a mesh.

### 8.3 Screen readers & semantics
- Landmarks (`header/nav/main/footer`), one `<h1>` per page, ordered headings, `<button>` vs `<a>` used correctly.
- 3D scenes carry a concise text alternative describing what they depict and, crucially, the *claim* they make (e.g., "Diagram: our AI checks a floor plan against Vastu zones; favourable zones in gold, review zones in teal, confirmed by a human designer"). Count-up stats expose the final value to AT immediately (`aria-live` off; render final in DOM, animate a visual copy).
- Forms: programmatic labels, `aria-describedby` for hints/errors, `aria-invalid`, errors summarized at top and linked to fields.

### 8.4 Colour & contrast (from the verified table §3.1)
- Body text pairings all meet AA (ivory/white on navy = 13–14:1). Gold text is emphasis/large only; **never gold on ivory**. Teal is a light-surface text colour only.
- State is never colour-only (icons, underlines, text labels accompany colour — N3, F1).
- Test both themes and both languages.

### 8.5 Bilingual a11y
- `lang` attribute switches with locale (`en` / `ta`); Tamil font stack ensures glyph coverage; verify line-height/spacing for Tamil (taller glyphs). `hreflang` correct. Don't machine-translate — use the CMS's reviewed `ta` content.

### 8.6 Testing checklist (CI + manual)
- Automated: `axe-core` in Playwright on every route (0 serious/critical), Lighthouse a11y ≥ 95, ESLint `jsx-a11y`.
- Manual: keyboard-only pass, VoiceOver (Safari/iOS) + NVDA (Windows) pass on top 6 templates, reduced-motion pass, 200% zoom & 400% reflow, forced-colors/high-contrast mode, colour-blind simulation.
- Publish an **/accessibility statement** (conformance target, known issues, contact) — matches the brand's Radical Transparency value.

---

## 9. Conversion strategy

### 9.1 Funnel & the one primary action
Everything ladders to **"Book a free design audit."** Secondary conversions feed it or capture intent for nurture. One primary CTA style (gold fill) used *only* for the audit; secondary actions use the outline style so the eye always finds the money action (Guide, N4).

| Stage | On-site moment | Micro-conversion | Instrument |
|-------|----------------|------------------|------------|
| Attract | Hero, Journal, NRI landing | Scroll depth, dwell | `page_view`, `scroll_75` |
| Interest | Intelligence moments, Portfolio | Feature engage, project open | `moment_view`, `project_open` |
| Consideration | **Fee Calculator**, tiers, guarantees | Calculator complete, lookbook download | `calc_complete`, `lookbook_dl` |
| Intent | Book-Audit form, WhatsApp | Form start / submit | `audit_start`, `audit_submit` |
| Nurture | Newsletter, Design Club | Opt-in | `subscribe` |

### 9.2 Trust signals (place deliberately, per Radical Transparency)
Published pricing + calculator; **60-Day Handover Guarantee** and transparent "Supply-Chain Management fee" on Pricing/Process; real project photography with client consent; testimonials tied to named projects; DPDPA/privacy clarity at every form; company facts (CIN/GST) in footer; NPS/awards when available. **No** unsubstantiated superlatives — the Brand Voice Guide forbids "world-class", "best-in-class", "unbeatable", "cheapest"; copy proves with specifics instead.

### 9.3 Persona-aware CTAs
CTA label adapts to path: residential → "Book a free design audit"; commercial → "Request a workspace consult"; NRI → "Start your remote design" + WhatsApp; digital → "Get an AI moodboard". Keep verbs concrete; one primary per view.

### 9.4 Experimentation
A/B via feature-flags (e.g., PostHog/GrowthBook): hero copy, CTA label, calculator placement (above vs below tiers), amount of 3D on Pricing. **Always test a lower-motion variant** — if T1/reduced-motion converts as well or better, that's a signal to simplify. Log motion tier with every conversion to correlate spectacle vs. outcome.

---

## 10. Implementation roadmap

### 10.1 Stack summary
Next.js 14+ (App Router, RSC, ISR) · TypeScript (strict) · Tailwind CSS (tokens from §3 wired into `tailwind.config`) · R3F + drei + three + postprocessing · GSAP + ScrollTrigger + Lenis · `next-intl` (en/ta) · Sanity (headless CMS) · `next/font` · `next/image` · analytics (GA4 + PostHog) · forms (React Hook Form + Zod) → CRM/Space OS lead queue + WhatsApp Business API + Razorpay-ready · hosting Vercel *or* AWS Amplify/ECS (Mumbai primary, Singapore secondary per Tech Plan) · CI GitHub Actions.

### 10.2 Repository structure
```
luxeaxis-web/
├─ app/
│  ├─ [locale]/
│  │  ├─ (marketing)/ page.tsx (home) residential/ commercial/ digital/
│  │  │   intelligence/(space-os|vastu-tech|space-score|virtual-staging)/
│  │  │   portfolio/[slug]/ pricing/ process/ about/ journal/[slug]/
│  │  │   nri/[region]/ contact/ book-audit/
│  │  ├─ layout.tsx (AppShell + ThreeCanvas + SmoothScroll)
│  │  └─ (legal)/ privacy terms accessibility
│  ├─ api/ (lead, calculator, revalidate, contact)
│  └─ opengraph-image, sitemap.ts, robots.ts
├─ three/
│  ├─ ThreeCanvas.tsx  AxisRig.tsx  SceneRouter.tsx
│  ├─ scenes/ HeroAxis/ VastuGrid/ SpaceScore/ SpaceOS/ PortfolioObjects/ Journey/ NriGlobe/
│  ├─ lib/ useDeviceTier.ts useReducedMotion.ts loaders.ts materials.ts
│  └─ posters/ (T1 pre-rendered stills per scene)
├─ components/ (ui/, nav/, forms/, calculator/, cards/, sections/)
├─ motion/ (tokens.ts, gsap.ts, scrollChoreography.ts, transitions.ts)
├─ styles/ (tokens.css from §3.1/§3.5, globals.css)
├─ content/ (sanity schema, queries)
├─ lib/ (analytics.ts, i18n.ts, seo.ts, flags.ts)
├─ public/
│  ├─ brand/ (LuxeAxis_Logo_Primary.jpg [supplied ref] + re-mastered SVGs: logo-primary, logo-horizontal, wordmark, mark, mark-mono; favicon/OG/app icons per §3.6)
│  └─ (fonts, glb models, posters)
└─ tests/ (playwright: a11y, visual, conversion smoke)
```

### 10.3 Phased milestones

| Phase | Deliverable | Exit criteria |
|-------|-------------|---------------|
| **0 · Foundations** | Repo, tokens (§3), Tailwind wiring, i18n scaffold, CMS schema, layout shell with empty canvas, CI (lint/typecheck/axe) | Token page renders EN+TA; Lighthouse a11y ≥ 95 on shell |
| **1 · Content site (no 3D)** | All pages fully built as **T1/static** — real content, nav, forms, calculator, SEO, analytics | Site converts end-to-end with JS-lite; CWV green; this is the resilient baseline |
| **2 · Motion layer** | GSAP/Lenis scroll choreography (S1–S5), micro-interactions (N/F), page transitions | Reduced-motion parity verified; no CWV regression |
| **3 · 3D layer** | Persistent canvas, AxisRig, hero (5.1), then feature moments 5.3→5.9 behind tiers | Each moment ships with its poster + passes perf budget (§10.5) |
| **4 · Hardening** | Perf tuning, full a11y audit, cross-device/browser, load/SEO QA, content freeze | All acceptance gates (§10.6) pass |
| **5 · Launch** | Analytics verified, A/B flags live, redirects, monitoring/SLO dashboards | Post-launch CWV & conversion tracking confirmed |

> Sequencing rule: **build the static site first, add motion, add 3D last.** The site must be excellent before a single polygon renders. This guarantees the fallback is real and de-risks the schedule.

### 10.4 Component build order (dependency-aware)
tokens → `Button`/`Link`/`Field` primitives → `Header`/`MegaMenu`/`Footer` → section blocks → `FeeCalculator` → `PortfolioGrid`/`CaseStudy` → forms + lead API → analytics → `ThreeCanvas`/`AxisRig` → `HeroAxis` → feature scenes → transitions → experimentation flags.

### 10.5 Performance budgets & Core Web Vitals (hard limits)

| Metric | Budget |
|--------|--------|
| LCP (4G, mid mobile) | ≤ 2.5s (LCP element is DOM text/image, **never** gated on WebGL) |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| Initial JS (route, gzip) | ≤ 200KB; **three/R3F code-split & lazy**, excluded from first load |
| Per-3D-scene payload | ≤ 1.5MB (hero ≤ 2.5MB), compressed |
| Fonts | ≤ 130KB total, 2 preloaded weights |
| Frame rate | 60fps T3 / graceful 30fps floor before auto-downgrade via `PerformanceMonitor` |
| Lighthouse | Perf ≥ 90 (mobile), A11y ≥ 95, SEO ≥ 95, Best-Practices ≥ 95 |

Enforce with `@next/bundle-analyzer`, a size-limit CI check, and Lighthouse-CI budgets that **fail the build** on regression.

### 10.6 Acceptance gates (definition of done — per page)
1. Renders complete & converts at **T1/reduced-motion** with information parity.
2. CWV budgets met on throttled mobile.
3. `axe` 0 serious/critical; keyboard + SR pass; visible focus; 200% zoom OK.
4. EN + TA both correct (content, `lang`, `hreflang`).
5. Every animation present maps to a §6.2 row (has a purpose) and has its reduced-motion fallback wired.
6. Analytics events fire; primary CTA reachable within one thumb-zone action on mobile.
7. No forbidden superlatives in copy; all claims backed by data/consented assets.

### 10.7 Analytics & instrumentation
GA4 + PostHog (autocapture off; explicit events from §9.1). Track `motion_tier` and `reduced_motion` as user properties to correlate experience with conversion. Consent-managed (DPDPA): analytics load after opt-in; no PII in event payloads; forms post to the Space OS lead queue with source/UTM attribution for the 30-minute first-touch SLA.

---

## 11. Claude Code execution prompts (paste these in order)

Each prompt is scoped to one phase and references this spec. Run sequentially; verify the phase's exit criteria before the next.

1. **Scaffold:** "Create a Next.js 14 App Router + TypeScript (strict) project with Tailwind, `next-intl` (locales `en` default, `ta`), self-hosted `next/font` (Playfair Display, Inter, Noto Serif/Sans Tamil), and the repo structure in §10.2. Wire the CSS tokens from §3.1 and §3.5 into `styles/tokens.css` and `tailwind.config`. Add GitHub Actions running typecheck, ESLint (with `jsx-a11y`), and `axe` Playwright smoke."
2. **Design-token page + primitives + logo:** "Build `Button`, `Link`, `Field`, `Card`, `GlassPanel` from the tokens, enforcing the contrast rules in §3.1 (primary = gold-light fill + ink label). Re-master `public/brand/LuxeAxis_Logo_Primary.jpg` into the layered SVG variants and favicon/OG/app-icon set per §3.6 (named layers: mark, mark.interior[pendant/sofa/plant/wall-lines], mark.swoosh, wordmark, divider, tagline), and build a `<Logo variant=… surface=…>` component with the dark/light colour-swap and small-size mono fallback. Add a `/style` reference route rendering the palette, type scale, spacing, motion tokens, and all logo variants in both themes and both locales."
3. **Static site (Phase 1):** "Build every route in §2.2 as fully static, accessible, server-rendered pages with real content slots from the Sanity schema (§2.4), the Header/MegaMenu/Footer (§2.3), the Fee Calculator (§5.7/§9), and the two-step Book-Audit form posting to `/api/lead`. No 3D, no scroll animation yet. Meet all §10.6 gates except motion."
4. **Motion layer (Phase 2):** "Add Lenis + GSAP. Implement the animation inventory §6.2 groups A–F using the motion tokens, the `useReducedMotion` hook, and the global reduced-motion CSS. Implement View-Transitions page changes (§6.3). Verify reduced-motion parity."
5. **3D foundation (Phase 3a):** "Add the persistent `ThreeCanvas`, `AxisRig`, `SceneRouter`, `useDeviceTier` (T0–T3 per §4.4), loaders (Draco/KTX2), and the poster fallback system. Ship the Hero 'Axis Forms' moment (§5.1) with its poster. Enforce the §10.5 budgets; three/R3F must be code-split out of first load."
6. **3D moments (Phase 3b):** "Implement scenes in this order with posters and the stated Purpose from §5: Vastu-Tech (5.3) → Space Score (5.4) → Space OS (5.5) → Portfolio objects (5.6) → Journey (5.8) → NRI globe (5.9). Each must pass its perf budget and reduced-motion fallback."
7. **Harden & launch (Phases 4–5):** "Run the full §8.6 a11y suite and §10.5 Lighthouse-CI budgets as blocking checks. Wire GA4 + PostHog events (§10.7) with DPDPA consent gating and feature flags for the §9.4 experiments. Add sitemap, robots, JSON-LD, redirects, and monitoring."

---

## 12. Assumptions & decisions to confirm
- **CMS:** Sanity assumed (i18n + editor UX). Swap to Payload if self-hosting is required — schema in §2.4 is portable.
- **Host:** Vercel assumed for DX; the Tech Plan's AWS Mumbai/Singapore topology is supported via Amplify/ECS if infra consolidation is preferred.
- **3D asset creation:** this spec covers the *system*; the `.glb` models (room, floor plan, device, globe) need to be produced/optimised (Blender) to the §4.3 budgets — commission or generate as a parallel workstream.
- **Booking backend:** form posts to the Space OS lead queue; if a calendaring tool (Cal.com/Calendly) is preferred for audit scheduling, slot it into the Book-Audit step 2.
- **Domain/locale:** default `en` un-prefixed, `ta` under `/ta`. Confirm whether Tamil launches with the full site or a prioritised subset.

*End of specification.*
