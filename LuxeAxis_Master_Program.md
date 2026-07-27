# Luxe Axis — Master Program: Concept → Production
### The coordinated-agency plan that unifies every discipline into one build

This is the **capstone**. Across this engagement the agency has produced seven detailed specifications; this document is the front door that (a) states the single idea uniting them, (b) gives each discipline's decisive position with a pointer to its detailed spec, and (c) goes deep on the two pillars that complete the picture — **Analytics** and the **Long-Term Maintenance Plan**. Read this first; drill into the referenced docs to build.

**Deliberately non-redundant:** where a pillar is already fully specified, this document gives the *decision and the why*, not a re-transcription. Depth is invested where it's genuinely new.

---

## 0. The document suite (how the program is organized)

| # | Document | Owns (agency role) | Requested pillars it covers |
|---|----------|--------------------|------------------------------|
| 1 | `LuxeAxis_3D_Website_Spec.md` v1.1 | Front-end architect / CD | IA, visual identity, **3D scene architecture**, responsive, a11y, roadmap |
| 2 | `LuxeAxis_Cinematic_Direction.md` | Creative director | **Storytelling**, camera/light, scene-by-scene film |
| 3 | `LuxeAxis_Design_System.md` + `luxe-axis.tokens.json` | UI designer | **Systems** (tokens + components), one **animation** language (2D) |
| 4 | `LuxeAxis_3D_Interaction_Framework.md` | Interaction designer / 3D dev | **Animation** (3D), **interaction design**, exact triggers/eases |
| 5 | `LuxeAxis_Build_Backlog.md` | Front-end architect | **Implementation** (37 AI-sized tasks, CI, DoD) |
| 6 | `LuxeAxis_Landing_Page_Blueprint.md` | Conversion strategist | conversion, where 3D helps/hurts |
| 7 | `LuxeAxis_Performance_A11y_QA.md` | Perf engineer / QA | **Optimization**, **deployment**, pre-launch QA |
| 8 | **`LuxeAxis_Master_Program.md`** (this) | Managing director | **Branding** synthesis, **Analytics**, **Maintenance**, program plan |

Plus assets: `public/brand/LuxeAxis_Logo_Primary.jpg` (bound). Together these carry all 11 requested pillars from concept to production.

---

## 1. The unifying idea (all roles, one voice)

Every discipline is expressing **one** thought so the site feels authored by a single mind:

> **"Where Space Meets Intelligence" — rendered, not stated.** The visitor travels down a gold **Axis** through a navy void where raw space assembles into designed life and intelligence illuminates it. The brand mark is the seed; the website is the mark dimensionalized; the business's actual argument (space + applied intelligence = a designed life) *is* the experience.

Three cross-cutting convictions bind the roles and settle every trade-off:

1. **The message beats the machine.** (Strategy + Perf.) Comprehension, the CTA, and speed are never sacrificed to spectacle. DOM-first; LCP never on WebGL; the site converts fully with the 3D turned off.
2. **Motion must prove, never decorate.** (CD + Interaction.) Every animation/scene passes a story test — prove a capability, orient, guide, give feedback — or it's cut.
3. **Premium is fast + tailored, not heavy.** (Architecture + QA.) The right fidelity to each device, instantly. A flagship gets the cinematic scene; a mid phone gets a beautiful poster in <1s. Both feel premium.

And one commercial truth that shapes the whole funnel: **this is a considered, high-ticket, consultative purchase — the site's job is to start a conversation (a free design audit), not close a cart.** Transparency (published pricing), demonstrable intelligence (Vastu-Tech), and human-in-the-loop are the trust levers.

---

## 2. Branding *(brand strategist + creative director)*

**Position:** *Intelligent Premium* — an AI-augmented "space intelligence" company, not a traditional studio; more technological than boutiques, more personal and transparent than aggregators (Livspace/HomeLane).

**Promise vs. signature:** the rational **positioning line** *"Where Space Meets Intelligence"* pairs with the emotional **signature** *"Designing Dreams"* (locks up with the logo). One earns belief; one earns feeling.

**Values that operationalize into the site:** Intelligent Elegance (beauty backed by reason), Spacefulness (generous negative space), Radical Transparency (published pricing, honest states), Technology Humility (AI assists; humans decide → the visible teal "reviewed by a designer" cue).

**Identity, locked:** navy `#0D2B4E` / gold `#C9A84C` / ivory `#FCFAF5` / teal `#1A7A85`; Playfair Display + Inter (+ Noto Tamil); the serif LA-monogram logo whose interior vignette (pendant, sofa, plant, swoosh) seeds the 3D hero. Voice is warm-professional; forbidden superlatives ("world-class/best/cheapest/unbeatable").
→ *Detailed in docs 1 & 3; verified color/contrast in the tokens file.*

## 3. Storytelling *(creative director)*

A three-act descent down the Axis: **I The Spark** (logo ignites → a first room assembles — wonder + promise), **II The Intelligence** (Vastu-Tech, Space Score, Space OS — proof + credibility), **III The Proof & Invitation** (real work, transparent process/price, the door held open → the audit). One continuous camera move, zero hard cuts; the light warms from cold void to lived-in home as trust builds. Copy always centers the visitor ("your space") and proves with specifics.
→ *Full scene-by-scene screenplay in doc 2.*

## 4. 3D scene architecture *(front-end architect)*

One persistent `<Canvas>` at the app shell (`fixed`, `z-0`, pointer-events only on interactive meshes); scenes declared in a `FILM: Shot[]` config and swapped by `SceneRouter` with **no WebGL context teardown** (continuity + no jank). Each scene = a folder exporting `{ Scene, poster, a11yAlt, budgetKB }`, ships a **poster** (T1/reduced-motion) and a **DOM control layer**. Runtime device tiers T0–T3 select fidelity; content is 100% DOM and independent of GL.
→ *Detailed in docs 1 & 4.*

## 5. Animation *(motion / interaction)*

**One motion language**, 2D and 3D sharing tokens: durations (`instant 80 … signature 1200`) and four eases (`standard/entrance/exit/spatial`, given as cubic-beziers + GSAP `CustomEase`). Weighted, "enter slow / exit quick," small distances, staggered. Every interaction carries an exact **trigger · duration · ease · UX problem** (a 62-row master index), and every one has a **reduced-motion fallback**. GSAP is the one tween engine; Lenis the one scroll source.
→ *Detailed in docs 3 (2D) & 4 (3D).*

## 6. Systems *(UI designer)*

A three-tier token architecture (**primitive → semantic/theme → component**) in W3C DTCG format, machine-validated (all 83 aliases resolve), building to `tokens.css` + `tailwind.config` via Style Dictionary. Two themes (dark navy default / light ivory), verified contrast baked into usage rules (e.g., gold is emphasis/large-only; status colors ship per-surface variants). A restrained component library — buttons, cards, nav, forms, feedback, loading — each with anatomy, variants, all states, motion, and a11y. **Glassmorphism only where it earns its place** (floating nav, overlays over 3D, modal scrim); solid everywhere else.
→ *Detailed in doc 3 + tokens file.*

## 7. Interaction design *(UX)*

**IA:** persona-first routing (six personas → six intents → six paths), a sitemap built around the audit conversion, bilingual EN/தமிழ் routing. **Conversion architecture:** one primary action (Book a free design audit) surfaced as a *ladder of commitment* (audit → calculator → WhatsApp → lookbook) so there's always a yes sized to readiness. **Interactivity is earned** — drag-orbit, calculator, Vastu toggle only where it advances understanding or the sale; every 3D interaction has a keyboard/DOM equivalent.
→ *Detailed in docs 1, 4 & 6.*

## 8. Implementation *(front-end architect)*

**Stack:** Next.js 14 App Router · TypeScript strict · Tailwind (tokens) · R3F + drei + three + postprocessing · GSAP + ScrollTrigger + Lenis · next-intl · Sanity (headless) · Vercel edge (AWS Mumbai/Singapore optional). **Architecture:** strict layering (tokens→primitives→components→features→pages); server-first (RSC), client islands where interactive; three/R3F dynamically imported, out of first-load JS. **Plan:** a **37-task backlog** across 6 phases, each task one AI session → one PR → one review, with a global prompt preamble and an 11-point Definition of Done. **Ordering is the risk control: build the fully-working static site first (M1), layer motion, then 3D last (M2)** — every scene behind a flag with instant poster rollback.
→ *Detailed in doc 5 (backlog) + doc 1 §10.*

## 9. Optimization *(performance engineer)*

Performance is a **CI-enforced contract**: LCP ≤2.5s (DOM, never WebGL), INP ≤200ms, CLS ≤0.1, initial JS ≤200KB (three code-split out), per-scene ≤1.5MB (hero ≤2.5MB), 60fps / 30fps hard floor. Stable frame rate via `frameloop="demand"`, adaptive quality (`PerformanceMonitor`), no per-frame allocations, and a **degrade ladder** (particles→post-FX→pointer FX→parallax→shadows→DPR→poster) whose last rung still looks premium. Assets: Draco + KTX2 + meshopt, AVIF/WebP, subset fonts, Brotli.
→ *Detailed in doc 7 (+ its 74-item pre-launch QA checklist).*

---

## 10. Analytics *(conversion strategist)* — measurement framework

Analytics exists to answer three questions and nothing else: **Are we generating qualified conversations? Which journeys/segments/creatives cause them? And is the 3D helping or hurting?** Vanity metrics (raw pageviews, generic "engagement") are explicitly de-prioritized.

### 10.1 KPI tree (North Star → drivers → diagnostics)
- **North Star:** *Qualified design-audit conversations booked per month* (the point where marketing hands to sales). Everything ladders to this.
- **Primary drivers (targets from the business plan):** LP conversion rate ≥ 3.5% (NRI ≥ 5%); MQL→audit ≥ 22%; CPQL ≤ ₹8k residential / ₹12k commercial; audit no-show rate.
- **Secondary conversions:** fee-calculator completions, WhatsApp conversations, lookbook downloads, newsletter/Design-Club opt-ins.
- **Experience diagnostics:** field CWV (LCP/INP/CLS p75), **FPS-by-tier**, scroll-depth, scene-completion, bounce — segmented by device tier and reduced-motion.

### 10.2 Event taxonomy (explicit, privacy-safe — no autocapture)
Consistent `snake_case`; every event carries global props: `locale`, `device_tier` (T0–T3), `reduced_motion` (bool), `persona_guess`, `utm_*`, `page`, `variant_*` (active experiments).

| Stage | Events |
|---|---|
| Acquisition | `page_view`, `scroll_50`, `scroll_90`, `nav_open` |
| Story/3D | `scene_view{scene}`, `scene_complete{scene}`, `demo_interact{vastu\|space_os\|before_after}`, `orbit_used` |
| Consideration | `calc_start`, `calc_complete{estimate_band}`, `pricing_view`, `tier_click{tier}`, `faq_open{q}`, `lookbook_download` |
| Intent (primary) | `audit_start`, `audit_step{n}`, `audit_submit`, `whatsapp_open`, `call_click` |
| Nurture | `newsletter_subscribe`, `design_club_join` |
| Health | `web_vitals{lcp,inp,cls}`, `fps_sample{scene,tier,p75}`, `error{type}` |

The lead payload posts to the **Space OS lead queue** with full `utm/source` attribution and a first-touch timestamp (feeds the 30-min SLA). **No PII in analytics event payloads** — PII lives only in the CRM/Space OS.

### 10.3 The "does 3D convert?" instrumentation (the signature analysis)
Because the whole site is a bet on 3D, the bet must be measurable, not assumed:
- Tag **every conversion** with `device_tier` and `reduced_motion`, so conversion rate can be sliced full-3D (T3) vs. lite (T2) vs. poster/reduced-motion (T1). If reduced-motion/poster converts *as well or better*, that's a signal to simplify — and it's honest.
- Run the **decisive A/B: 3D hero vs. static-image hero**, measuring CVR **and** bounce **and** LCP together. Ship whatever wins (often static on mobile).
- Correlate `scene_complete` and `demo_interact` with downstream `audit_submit` — does watching the Vastu demo actually lift conversion, or just time-on-page? Kill scenes that cost performance without lifting conversion.

### 10.4 Dashboards & reporting
- **Executive (monthly):** North Star trend, CVR, CPQL, CLV/CAC, channel mix, MQL→audit.
- **Growth (weekly):** funnel drop-off by step, experiment results, top landing paths, calculator completion, NRI vs. domestic.
- **Experience (continuous):** field CWV p75 + FPS-by-tier + error rate (alerting on regression).
- **SEO (monthly):** rankings for the target clusters, organic entrances, Search Console coverage.

### 10.5 Experimentation program
A always-on, prioritized test roadmap (GrowthBook/PostHog), one primary metric per test, pre-registered hypothesis, min sample + duration to avoid peeking. Backlog seeded from doc 6 §6: 3D-vs-static hero, headline, CTA label, calculator placement, demo present/absent. **Kill rule:** any 3D variant with lower CVR or higher bounce than its static control is removed regardless of aesthetics; log the learning.

### 10.6 Attribution & tooling
- **Tools:** GA4 (acquisition/SEO), **PostHog** (product events, funnels, session replay, flags, experiments), Vercel Speed Insights / `web-vitals` (field CWV), Search Console (SEO), Space OS/CRM (revenue truth), Sentry (errors).
- **Attribution:** first-touch + last-touch + UTM captured at lead; closed-loop by writing the eventual project value back from Space OS to the analytics user (hashed id) for CLV/CAC by channel. Model directionally (small B2C volumes) — don't over-fit.
- **Privacy (DPDPA):** analytics load **only after consent**; no PII in payloads; IP anonymized; data retained per policy; a documented deletion path. Consent state itself is logged (compliance).

---

## 11. Deployment *(perf engineer / DevOps)*

Trunk-based; PR → Vercel preview (own Lighthouse run) → `main` → production (edge; AWS Mumbai+Singapore optional for data-residency). CI gates block merge: verify → axe → build → **Lighthouse-CI budgets** → size-limit + **3D-asset budget** → visual diff. Every 3D scene ships behind a **feature flag with instant poster rollback**; canary before 100%. Monitoring: field CWV, FPS-by-tier probe, Sentry (incl. WebGL context-loss + `.glb` failures), synthetic checks on key routes + the lead endpoint. Security headers (CSP incl. `worker-src`/`blob:`, HSTS), secrets in Vercel/SSM. One-click rollback; 72-hour post-launch watch.
→ *Detailed in doc 7 §10–11.*

---

## 12. Long-term maintenance plan *(managing director)*

A premium 3D site is a **living product**, not a project that ends at launch. Left unmaintained it rots in three predictable ways: **performance drifts** (new content/models bloat budgets), **dependencies age** (Three.js/Next move fast; security CVEs accrue), and **content goes stale** (portfolio/pricing/journal fall behind the business). This plan keeps it fast, current, secure, and growing.

### 12.1 Operating model & ownership (RACI)
| Area | Accountable | Responsible | Cadence |
|---|---|---|---|
| Content (portfolio, journal, pricing, TA translations) | Marketing Lead | Content Lead + Designer | Continuous |
| Design system + tokens | (Fractional) UI lead | Front-end dev | Per change, semver'd |
| 3D scenes + asset pipeline | Front-end architect | 3D dev (in-house or vendor) | Per new scene/project |
| Performance & a11y budgets | Front-end architect | Dev team | Continuous (CI) + quarterly audit |
| Analytics & experimentation | Marketing Lead | Performance Marketer | Weekly/monthly |
| Infra, security, deploys | CTO / Eng Lead | DevOps | Continuous + monthly patch |
| Roadmap & prioritization | CBO/CEO | Cross-functional | Quarterly |

For a Year-1 team this is realistically **1 front-end dev (0.5–1 FTE) + a fractional 3D specialist + the marketing team + a support retainer**; the backlog's AI-assisted workflow keeps ongoing dev light.

### 12.2 Maintenance cadences
| Cadence | Activities |
|---|---|
| **Continuous (CI)** | Perf/a11y/visual/size gates on every PR; error + uptime alerting; consent/analytics integrity |
| **Weekly** | Publish content (Reels/journal per marketing plan), review funnel + experiment results, triage bugs, check field CWV + FPS dashboards |
| **Monthly** | Dependency + security patch window (Next/React/Three/R3F/GSAP minors, CVE scan); analytics business review; SEO ranking review; add new portfolio projects (photography + optional 3D) |
| **Quarterly** | Full accessibility audit + statement refresh; performance deep-dive (budgets, bundle, asset sizes, Lighthouse trend); design-system version review + component deprecations; experiment roadmap reset; content freshness sweep (pricing, guarantees, team) |
| **Semi-annual** | Major dependency upgrades (Next major, Three.js version bumps) on a branch with full regression + visual + perf pass; brand/creative refresh check |
| **Annual** | Strategy review — does the site still serve the business (new services, cities, franchise)? Security pen-test; DR restore drill; token/brand system audit |

### 12.3 Content operations
Sanity is the single source; non-devs publish without deploys (ISR + on-demand revalidation). Standards enforced: every project needs consented photography, `alt` text carrying the design claim, and (optionally) an optimized `.glb`. Tamil content is human-reviewed, never machine-translated. A lightweight editorial calendar (from the marketing manual) governs cadence; a "publish checklist" (image weight, alt, SEO fields, both locales) is part of the CMS workflow.

### 12.4 Design-system versioning
Tokens + components are **semver'd** and changelog'd; breaking token changes are a major bump with a migration note. Components are deprecated with a one-release warning, never deleted silently. Storybook + visual-regression baselines are the contract; a token change that shifts contrast re-runs the verified-contrast check. This keeps the "one authored hand" intact as the site grows.

### 12.5 3D asset pipeline upkeep
New rooms/projects flow through the same automated pipeline (`gltf-transform`: Draco + KTX2 + resize + prune + instance) with the **per-scene budget as a hard CI gate** — an oversized `.glb` fails the build, so 3D can't silently bloat performance. Posters are regenerated whenever a scene changes (a scene is never shipped without its T1 still). An asset-version manifest busts caches on model updates. New scenes launch behind flags with poster rollback, exactly like the initial build.

### 12.6 Dependency, security & platform
Monthly patch window with automated PRs (Renovate/Dependabot) gated by the full CI suite; **WebGL/Three.js upgrades get extra scrutiny** (visual + FPS regression) because they can silently change rendering. CVE scanning on deps; CSP and security headers reviewed each quarter; secrets rotated per policy; DPDPA data-handling reviewed annually with legal.

### 12.7 Performance & accessibility as *ongoing* gates
The launch budgets (§9) never relax — they run on every PR and are trended quarterly (field CWV p75 + FPS-by-tier). A regression past budget **blocks release**. Accessibility is re-audited quarterly (automated every PR, manual SR pass quarterly) and the `/accessibility` statement kept truthful. This prevents the classic decay where a fast, accessible launch degrades invisibly over a year.

### 12.8 Incident response, backups & cost
- **Incidents:** severity levels + runbooks (site down, WebGL crash spike, lead-form failure, CWV cliff, security); on-call owner; one-click rollback; post-incident review.
- **Backups/DR:** CMS dataset + assets backed up; infra reproducible from code (IaC); annual restore drill; RPO/RTO documented.
- **Cost:** monthly watch on hosting/bandwidth (3D assets are bandwidth-heavy — CDN + immutable caching keep it bounded), CMS, analytics, and font/asset services; alert on anomalies.

### 12.9 Roadmap evolution (the site grows with the business)
The architecture is built to extend, not be rebuilt: **Space OS** (client portal) links from the site; the **AR remote-design** and **Space Score** features graduate from "future showcase" to shipped scenes on the same SceneRouter; **new cities/franchise** reuse the token/i18n system; a **fee-calculator v2**, testimonial video, and the annual *Chennai Spaces Report* slot into existing patterns. Each addition is a backlog-style task behind a flag — the site is never "finished," it compounds.

---

## 13. Concept → production roadmap

The sequence is the risk control: **a fully working, accessible, converting site exists before the first polygon renders.** Two shippable milestones.

| Phase | Weeks* | Output | Gate to exit |
|---|---|---|---|
| **0 · Foundations** | 1–2 | Repo, token pipeline, i18n, app shell, CI/CD + quality gates | Token page renders both themes/locales; CI gates enforce; a11y ≥95 on shell |
| **1 · Design system** | 2–4 | Primitives, layout, logo, nav, motion foundation, Storybook | All components pass axe + visual; reduced-motion parity proven |
| **2 · Static site (M1)** | 4–8 | Every page, CMS, calculator, book-audit + lead API, SEO, analytics — **no 3D** | **M1: converts end-to-end with zero 3D; CWV green; launchable** |
| **3 · Motion layer** | 8–10 | Scroll engine, reveals/micro-interactions, transitions, 2D loader | Reduced-motion parity; no CWV regression |
| **4 · 3D layer** | 10–15 | Canvas+router+tiers, camera rig, hero, feature scenes, showcases | Each scene: poster + DOM equivalent + perf budget met |
| **5 · Hardening & launch (M2)** | 15–17 | Perf pass, full a11y audit, cross-device QA, experiments, launch | **M2: 74-item QA checklist all-green; go/no-go signed** |

*Indicative for a small AI-assisted team; the backlog's 37 tasks are the detailed plan. **M1 can go live and generate leads while Phases 3–5 proceed** — the business doesn't wait on the 3D.

**Definition of launch (M2 go/no-go):** all `[GATE]` items in the pre-launch checklist green — CWV budgets met on mobile; 30fps floor holds; axe + keyboard + reduced-motion + SR pass; the site fully converts with zero 3D/JS; JSON-LD valid + SEO clean; rollback tested + monitoring live + DPDPA compliant; and Perf/A11y/SEO/Content/Eng sign-offs recorded.

## 14. Program risks & mitigations
| Risk | Mitigation |
|---|---|
| 3D tanks performance / conversion | Static-first build (M1 independent of 3D); flags + instant poster rollback; the "does-3D-convert" instrumentation + kill rule |
| Scope/timeline slip on 3D | 3D is last and optional to launch; ship M1, add scenes incrementally |
| 3D asset production bottleneck | Pipeline + budgets automate optimization; commission `.glb`s as a parallel workstream; posters ready first |
| Accessibility regressions over time | a11y is a CI gate + quarterly audit, not a one-time pass |
| Performance decay post-launch | Budgets stay enforced on every PR; quarterly perf deep-dive; RUM alerting |
| Over-claiming erodes trust | Human-in-the-loop cue; transparency (published pricing); no forbidden superlatives; consented proof only |
| Key-person/vendor dependency | Documented system (these 8 docs), semver'd design system, AI-assisted workflow lowers the bus factor |

## 15. The program in one paragraph
Luxe Axis gets a website that **is** its business argument: space meeting intelligence, rendered as a calm, cinematic descent that proves real capabilities and invites a conversation. It launches **fast and accessible with zero 3D**, then layers a premium cinematic experience that the capable devices earn — measured relentlessly so the 3D must *prove* it converts. Built from one token system and one motion language, shipped through AI-assisted tasks behind feature flags, and maintained as a living product that compounds with the company. **Concept to production, one authored hand, performance and trust first.**

---

### Document suite — build order for handoff
1. **This master program** (orientation) → 2. **Spec v1.1** (system + IA + a11y) → 3. **Design System + tokens** (build foundation) → 4. **Cinematic Direction** (story/scenes) → 5. **3D Interaction Framework** (exact motion) → 6. **Landing Page Blueprint** (conversion) → 7. **Performance/A11y/QA** (optimization + checklist) → 8. **Build Backlog** (execute: 37 tasks, start at T-01).

*Prepared by the coordinated agency team — creative direction, brand strategy, UI/UX, front-end architecture, QA engineering, and conversion strategy — as one program.*

*End of master program.*
