# Luxe Axis — 3D Landing Page Blueprint
### Conversion-first · captures attention in 3 seconds · starts a conversation

**Companions:** the site Spec v1.1, Cinematic Direction, Interface System + tokens, 3D Interaction Framework. This is a **single, high-intent landing page** (paid + organic traffic target for "Book a free design audit") — a tighter, more ruthless cut of the site whose only job is to move a stranger to *start a conversation*.

**Assumption (stated, not asked):** primary visitor = mid-premium Chennai homeowner (IT professional, 2–3BHK, price-anxious) with NRI as the high-value secondary. One primary action: **Book a free design audit.** If you want a persona-specific variant (NRI, commercial), the structure below forks cleanly.

---

## 0. The strategic thesis (read this first)

**You are not selling a cart — you are opening a relationship.** A ₹8L–2Cr interior project is a considered, high-anxiety, months-long decision. Nobody "buys now." So the landing page's job is **not** to close; it's to make a stranger feel *understood, safe, and curious enough to talk to you.* Every CTA is a conversation-opener, not a checkout.

This reframes 3D entirely. On a checkout page, 3D is friction. Here, the visitor's core anxieties are **"will it look good?", "can I trust them?", and "what will it cost?"** — and two of those are *spatial and demonstrable*. That is precisely where 3D earns its keep: **3D that shows the space or shows the intelligence working builds trust; 3D that decorates, delays, or performs steals the conversation.** The full map is §4 — it's the most important section here.

**Three non-negotiables govern the whole page:**
1. **The message beats the machine.** The value proposition and the primary CTA are DOM, server-rendered, painted before any WebGL. 3D is atmosphere and proof layered *behind and after* — never the gatekeeper of comprehension.
2. **Every section answers one question and asks for one thing.** No section without a conversion job.
3. **Speed is trust.** A premium brand that loads slowly reads as *not* premium. LCP ≤ 2.5s on mid-tier mobile or the effect is cut.

---

## 1. The 3-second hook

Eye-tracking reality: a first-time visitor decides to stay or bounce in ~3 seconds, reading in an F-pattern from the top-left. In those 3 seconds they must answer three questions **without scrolling and without waiting for 3D**:

| Second | Question | What delivers it (all DOM, instant) |
|--------|----------|--------------------------------------|
| **~1s** | "What is this?" | Headline (benefit + specificity, ≤8 words) + a real, beautiful room as the hero image/first frame |
| **~2s** | "Why should I care / why them?" | Sub-head naming the 3 differentiators + a one-line trust strip |
| **~3s** | "What do I do?" | One high-contrast primary CTA + one low-commitment secondary, both above the fold |

**Above-the-fold anatomy (first viewport, mobile-first):**
```
[ logo ]                         [ Book a free audit ]   ← sticky, always present
──────────────────────────────────────────────────────
   H1: benefit headline (Playfair, large, DOM)
   Sub: 3 differentiators in one sentence
   [ Book a free design audit ]   [ See your price → ]   ← primary + secondary
   Trust strip: Transparent pricing · Vastu-smart · 60-day handover guarantee
──────────────────────────────────────────────────────
   (behind all of the above: a real finished room; a
    quiet gold Axis; ambient motion begins AFTER paint)
```

**Why DOM-first, 3D-as-atmosphere (the critical call).** The single biggest conversion mistake a 3D landing page can make is a hero that *assembles* before it communicates — the visitor stares at a loading/animating void while the clock runs out. So: the hero's **first paint is a stunning still** (photographic room + headline + CTA); the cinematic "Axis Forms" assembly is a **scroll-triggered enhancement**, not the blocking intro. The visitor is hooked by a finished, aspirational, *legible* frame in <1s; the 3D rewards them for staying, it doesn't tax them for arriving.

---

## 2. Conversion architecture (the page as a conversation ladder)

High-ticket visitors won't jump straight to the biggest ask. Offer a **ladder of commitment** so there's always a "yes" sized to their readiness:

| Rung | CTA (conversation-opener) | Commitment | For whom |
|------|---------------------------|-----------|----------|
| **Primary** | **Book a free design audit** | Medium (a call/visit) | Ready-ish buyers |
| **Self-serve** | **See your price in 2 minutes** (calculator) | Low (anonymous) | Price-anxious researchers |
| **Human, low-friction** | **Chat with a designer on WhatsApp** | Low (async) | NRI / mobile / hesitant |
| **Passive** | **Get the lookbook** (email) | Very low | Top-of-funnel browsers |

**Narrative order (message → objection → proof, repeating):** Hook → *show it works* (demo) → *show the transformation* (story) → *show where it's going* (future) → *show others trust us* (social proof) → *show the price honestly* (pricing) → *answer the last doubts* (FAQ) → *invite the conversation* (CTA). Every 1–1.5 screens, a CTA reappears — matched to the anxiety that section just resolved (e.g., the CTA after Pricing is "See your price," the CTA after Social Proof is "Book a free audit").

**CTA rhythm:** one primary action, repeated ~5–6× down the page, plus a persistent sticky bar (mobile) / header button (desktop). Never two competing primaries in one viewport — one gold button, everything else quieter.

---

## 3. Section-by-section blueprint

Each section states its **conversion job · copy direction · layout · 3D verdict · motion · measure.** 3D verdict is called explicitly here and mapped in full in §4.

### 3.1 Immersive hero
- **Conversion job:** land the 3-second hook; earn the first CTA click or scroll.
- **Copy (options to A/B; brand voice — warm, specific, no superlatives):**
  - H1a: *"Premium interiors, designed with intelligence — and priced in the open."*
  - H1b: *"Your Chennai home, thoughtfully designed. Transparently priced."*
  - Sub: *"AI-assisted design, Vastu-smart, delivered on a 60-day handover guarantee. Real designers, honest pricing."*
  - Trust strip: *Transparent pricing · Vastu-smart AI · 60-day handover guarantee · 200+ vetted vendors*
- **Layout:** headline + sub + primary/secondary CTA left (desktop) / stacked (mobile); a real finished room fills the frame; sticky CTA persists.
- **3D verdict — ATMOSPHERE ONLY (helps, if disciplined).** First paint = a photographic still, not an assembling scene. After paint, a *subtle* gold Axis glow + ≤3° pointer parallax adds depth. The full "Axis Forms" assembly plays **on first scroll**, not on load. If the 3D can't stay behind the message, cut it to a static hero — the message wins.
- **Motion:** headline reveal (enter, 480ms) → CTA settle; ambient Axis breath (6s loop, T3). Reduced-motion → static.
- **Measure:** scroll-past rate, hero CTA CTR, LCP (must be the H1/room, ≤2.5s).

### 3.2 Animated product demo — "Watch the intelligence work"
- **Conversion job:** convert the abstract claim "AI-augmented" into *seen* proof; this is the section 3D was made for.
- **Copy:** overline *"See it work"*; H2 *"We check your plan against Vastu — in seconds, then a human confirms it."* Support line naming the human-in-the-loop.
- **Layout:** a floor-plan centerpiece; plain-language callouts write on as zones resolve (gold = favourable, teal = review); a visible *"reviewed by a designer"* chip; one CTA: *"Get your space checked — book a free audit."*
- **3D verdict — BUILDS TRUST (the strongest use).** A short, scroll-scrubbed demo of the Vastu-Tech scan (or Space Score gauge / Space OS device) is *demonstration, not decoration* — it makes a unique, hard-to-believe capability credible. This is where immersive 3D directly lifts conversion.
- **Guardrail:** it must be **fast, legible, and finite** — ≤ one viewport of scroll, message readable at every frame, and a static annotated version for reduced-motion/mobile. A demo that's confusing or slow *hurts* (see §4).
- **Motion:** scroll-scrubbed scan; one-shot per view. Reduced-motion → static analyzed plan + text stepper.
- **Measure:** demo completion (scroll-through), CTA CTR directly after, time-on-section.

### 3.3 Storytelling sections — the transformation
- **Conversion job:** move from "capable" to "I can see *my* life here" — emotional buy-in + the craft proof.
- **Copy:** a 3-beat micro-story: *the bare shell → the intelligent process → the finished, lived-in home.* Keep it about the visitor ("your space"), not the studio. One before/after per beat.
- **Layout:** alternating text + visual; the hero move is a **before/after reveal** the visitor controls.
- **3D verdict — MIXED, lean photographic.** The transformation's emotional punch comes from **real photography** ("show the work"), not renders. Use a light 3D/interactive **before/after slider** (visitor-controlled) — that interactivity builds trust. But don't render the finished home in 3D where a real photo exists; a render of a real project reads as *less* trustworthy than the photograph. Photography > 3D here.
- **Motion:** scroll reveals; before/after drag. Reduced-motion → static slider.
- **Measure:** before/after interactions, scroll depth to social proof.

### 3.4 Future showcases — "Where this is going"
- **Conversion job:** signal momentum and category leadership (you're the future, not a safe-but-static studio) → aspiration + FOMO, gently.
- **Copy:** overline *"On the roadmap"*; short cards — *Space Score* (rate any space), *AR remote design* (design from anywhere), *Vastu-Tech* patent-pending. Frame as *"what your project gets to grow into,"* not vaporware.
- **Layout:** a compact horizontal set of 3 forward-looking cards; one CTA: *"Be an early client — book a free audit."*
- **3D verdict — SPARINGLY (tone, not proof).** One restrained hero object (e.g., a slowly rotating Space Score gauge) can signal "advanced." But future/roadmap content is *promissory* — over-produced 3D on unshipped features risks over-claiming and eroding the hard-won trust from §3.2. Keep it light; label clearly; let the shipped demo (§3.2) carry the credibility weight.
- **Motion:** gentle idle float on one object (T3). Reduced-motion → static.
- **Measure:** engagement (secondary); mainly a brand/aspiration beat.

### 3.5 Social proof
- **Conversion job:** borrow trust — "people like me chose them and were glad."
- **Copy:** a stat band (*projects delivered, on-time %, NPS, referral rate*), 2–3 named testimonials tied to real projects/neighbourhoods, builder/press logos, Google rating. NRI testimonial for the secondary persona.
- **Layout:** stat band → testimonial cards (real faces) → logo row.
- **3D verdict — AVOID (3D HERE HURTS).** Trust here is *documentary* — real faces, real names, real numbers, real photos. Rendering testimonials/faces in a 3D space makes them feel staged and *reduces* credibility. Keep this section flat, fast, photographic. The only motion: a subtle count-up on the stats (final value in DOM).
- **Motion:** stat count-up (once). Reduced-motion → final numbers.
- **Measure:** scroll depth, testimonial expansion, CTA CTR after proof (should be high — put a primary CTA here).

### 3.6 Pricing — the transparency weapon
- **Conversion job:** resolve the biggest anxiety (cost) and turn transparency into a differentiator that competitors won't match.
- **Copy:** *"Most Chennai studios hide the price. We publish it."* Tier bands (Essential / Signature / Elite) with real ₹ ranges + the fee calculator; the *60-Day Handover Guarantee* and transparent *Supply-Chain fee* stated plainly. CTA: *"See your price in 2 minutes."*
- **Layout:** three clear tier cards + an embedded, DOM-first **fee calculator** (inputs → instant estimate).
- **3D verdict — DO NOT USE 3D (it actively hurts).** Price-anxious visitors want *fast, scannable, honest numbers.* 3D adds cognitive load and load time exactly when the visitor is most utilitarian — and worse, spectacle around pricing subtly signals "hiding something," undermining the very transparency you're claiming. Pricing is DOM, instant, plain, tabular. This is the clearest "3D hurts" call on the page.
- **Motion:** calculator value-tween only (ui). Reduced-motion → instant number.
- **Measure:** calculator starts/completions, tier card clicks, CTA CTR (this is a top-converting section).

### 3.7 FAQs — objection handling
- **Conversion job:** clear the last rational blockers so the emotional "yes" isn't vetoed by an unanswered doubt.
- **Copy:** the real objections, answered plainly — *"How much does it cost?", "How long does it take?", "Can I manage this from abroad?" (NRI), "Do you do Vastu?", "What if you're late?" (the guarantee), "Is the AI designing my home?" (no — humans decide).* Each answer ends with a soft CTA link.
- **Layout:** accordion; search on desktop; schema markup (`FAQPage`) for SEO.
- **3D verdict — ZERO 3D (hurts).** FAQs are a pure reading/answer-seeking task; any 3D is distraction that slows comprehension and delays the answer the visitor came for. Flat, fast, accessible. Full stop.
- **Motion:** accordion expand/collapse (ui). Reduced-motion → instant.
- **Measure:** FAQ opens (which questions = which anxieties), post-FAQ CTA CTR.

### 3.8 Conversation-focused CTAs (the closing system)
- **Conversion job:** make saying "yes" feel easy, human, and low-risk — a chat, not a contract.
- **Copy:** final band — H2 *"Let's talk about your space."* Sub reduces friction: *"A free 45-minute audit with a real designer. No obligation, no hard sell."* Primary *Book a free design audit* + *Chat on WhatsApp* + reassurance line *"You'll speak to a designer, not a bot."*
- **Layout:** warm, full-width closing section; the finished room behind, a simple 2-step form or a single button to the booking flow; WhatsApp/Zoom for NRI.
- **3D verdict — CALM/NONE at the moment of action.** Behind the closing copy, a *still* warm room is fine; **no motion, no ambient 3D near the form or button** — the moment of action must be frictionless and focused, with the CTA as the single brightest thing. Movement near the CTA steals the click.
- **Motion:** CTA settle-into-view; submit → gentle success confirm. Reduced-motion → instant.
- **Measure:** the primary conversion — audit bookings, WhatsApp opens, form completion rate.

---

## 4. Where 3D builds trust vs. where it hurts conversion — *the map*

The one rule that predicts every case:

> **3D builds trust when it *demonstrates a capability* or *reduces uncertainty about a spatial product.* It hurts conversion when it *delays comprehension, taxes performance, competes with the CTA, or replaces authentic human proof.***

Put plainly: **"show me it works" and "show me the space" → 3D wins. "Spectacle, loading, or fake-feeling proof" → 3D loses.**

### 4.1 Where 3D BUILDS trust (use it here)

| Use | Why it converts | Condition |
|-----|-----------------|-----------|
| **Product demo — the Vastu-Tech scan / Space Score / Space OS** | Turns an unbelievable claim into *seen* proof; watching the AI work is far more convincing than a bullet point | Fast, legible, finite (≤1 viewport), human-in-the-loop shown, static fallback |
| **Spatial inspection — drag-orbit a finished room / object** | For a *spatial* product, "walk around it" reduces purchase uncertainty (the e-commerce 3D effect) — you're de-risking the imagination | Opt-in, snap-back, keyboard equivalent, only on high-intent moments |
| **Before/after transformation (interactive)** | Visitor-controlled reveal = they *do* the transformation; agency builds belief | Real photography inside the 3D frame, not renders |
| **Hero atmosphere (behind the message)** | Sets a premium emotional frame in <1s — signals "this is a serious, modern studio" | Strictly behind DOM; never blocks LCP; assembles on scroll, not load |
| **Materiality close-ups** | A materials-driven business gains trust from seeing real brass/stone/oak render true | Small, on-demand, high-fidelity; not ambient |

### 4.2 Where 3D HURTS conversion (avoid it here)

| Place | Why it kills conversion | Do this instead |
|-------|--------------------------|-----------------|
| **The first 3 seconds / hero load** | An assembling scene delays the value prop + CTA past the bounce window; LCP tanks | DOM headline + CTA + still image first paint; 3D after scroll |
| **Pricing** | Price-anxious visitors want fast, honest, scannable numbers; 3D adds load + cognitive tax, and spectacle-around-price signals "hiding something" (undercuts your transparency USP) | Flat, instant, tabular pricing + DOM calculator |
| **FAQs** | Pure reading task; any 3D is distraction that slows the answer they came for | Flat accordion, searchable, schema-marked |
| **Social proof / testimonials** | Trust here is *documentary*; rendering real people/quotes in 3D feels staged and *lowers* credibility | Real faces, names, photos, numbers — flat |
| **The form / moment of action** | Friction and motion near the CTA steal the click and slow the highest-value moment | Calm, still, one bright CTA, zero ambient motion |
| **Mobile / low-end / slow networks (much of the audience)** | Heavy 3D destroys performance + battery → mass bounce; the median Chennai/NRI visitor is on mobile | Aggressive tiering (T0–T2 → posters), never ship heavy 3D as required |
| **Anywhere 3D repeats with no new information** | Novelty decays in seconds; it becomes pure latency tax and visual noise | Cut it; silence is premium |

### 4.3 The four governing laws
1. **The message beats the machine.** If 3D delays comprehension or the CTA, it loses — every time, no exceptions in the first viewport.
2. **Demonstrate, don't decorate.** 3D must *prove a capability* or *let the visitor inspect the product.* If it does neither, it's decoration → cut.
3. **Never let the spectacle out-shine the CTA.** The brightest, most-moving thing in any viewport should be the action, not an object.
4. **Authentic beats rendered for human trust.** People, prices, and proof are more trustworthy flat and real than dimensional and produced.

**The litmus test for any 3D element on this page:** *"If I delete this, does a specific anxiety go unanswered, or does the page just get faster?"* If faster — delete it.

---

## 5. Copy & conversation-focused CTA bank

**Voice:** warm-professional, specific, transparent. **Forbidden** (brand policy): "world-class", "best-in-class", "unbeatable", "cheapest", and any superlative you can't prove. Lead with the visitor ("your space"), prove with specifics (₹ ranges, guarantees, numbers).

**Primary CTA (A/B):** *Book a free design audit* · *Book my free audit* · *Start with a free audit*
**Secondary (self-serve):** *See your price in 2 minutes* · *Estimate my project* · *Try the fee calculator*
**Human / low-friction:** *Chat with a designer on WhatsApp* · *Ask us anything* · *Tell us about your space*
**Passive / top-funnel:** *Get the lookbook* · *See recent Chennai projects*

**Friction-reducers (place under CTAs):** *No obligation.* · *You'll speak to a real designer, not a bot.* · *Free 45-minute audit.* · *Transparent pricing — see it before you talk to us.*

**Section headlines (conversation-framed):**
- Demo: *"See our AI check a real floor plan — then a designer confirms it."*
- Story: *"From bare shell to a home that's unmistakably yours."*
- Future: *"You're not hiring a studio. You're joining what's next."*
- Social proof: *"Chennai families — and NRIs abroad — already trust us."*
- Pricing: *"Most studios hide the price. Here's ours."*
- FAQ: *"The questions everyone asks before they start."*
- Close: *"Let's talk about your space."*

**Micro-conversation prompts (make CTAs feel like dialogue, not forms):** first form field is a friendly opener — *"What are you dreaming up?"* (project type) rather than "Select category"; NRI path opens with *"Designing from abroad? We do this every week."*

---

## 6. Measurement & the 3-second proof

**The one number:** audit bookings + qualified WhatsApp conversations per 100 visitors. Target LP CVR ≥ 3.5% (≥ 5% on NRI variants, per the existing playbook). Everything else is diagnostic.

**Funnel events (fire, post-consent):** `hero_view` → `hero_cta_click` / `scroll_50` → `demo_complete` → `calc_start`/`calc_complete` → `proof_view` → `pricing_view` → `faq_open` → `audit_start` → `audit_submit` / `whatsapp_open`. Tag every conversion with `motion_tier` and `reduced_motion` so you can *prove* whether 3D helped or hurt.

**The 3-second test (run it, don't assume):** 5-second tests (UsabilityHub) — show the hero for 5s, then ask "what does this company do / what would you do next?" ≥ 80% must name interior design + the primary action. Plus session replays (PostHog/Hotjar) watching for rage-scrolls past a slow hero.

**A/B experiments (highest-leverage first):**
1. **3D hero vs. static-image hero** — the decisive test. Measure CVR *and* bounce *and* LCP. If static wins or ties, ship static (it usually wins on mobile).
2. Hero headline (benefit vs. brand line).
3. Calculator above vs. below social proof.
4. Primary CTA label ("Book a free audit" vs. "See your price").
5. Demo present vs. absent (does the Vastu demo lift or distract?).

**Kill criteria (be ruthless):** any 3D element whose variant shows *lower* CVR or *higher* bounce than its static control is removed — regardless of how good it looks. Log the result; move on. The page serves conversion, not the renderer.

---

## 7. Guardrails — so the page is actually fast (speed = trust)

- **Performance budget (hard):** LCP ≤ 2.5s on mid-tier 4G mobile — **the LCP element is the DOM headline/hero image, never WebGL.** INP ≤ 200ms, CLS ≤ 0.1. Initial route JS ≤ 200KB; three/R3F dynamically imported, **excluded from first load** and only booted after first paint / on scroll.
- **Tiering:** resolve T0–T3 at runtime; ship posters to T0–T2; the hero's first paint is a poster for *everyone*, upgraded to live 3D only on capable devices after the message is up.
- **Accessibility (conversion + compliance):** WCAG 2.2 AA; full `prefers-reduced-motion` parity (the reduced-motion visitor gets the identical message, proof, and CTAs as static frames); keyboard-complete; visible focus; the whole page converts with zero 3D and zero JS-motion. Bilingual EN/தமிழ்.
- **Trust hygiene:** real photography (consented), honest numbers, DPDPA-compliant forms (no pre-ticked consent), company facts in the footer. Nothing on this page over-claims — over-claiming is the fastest way to lose a high-ticket lead.

**The whole blueprint in one line:** *lead with a legible, beautiful, honest promise in three seconds; use 3D only to prove the intelligence and let people feel the space; keep price, proof, and the ask fast, human, and frictionless — and start a conversation.*

*Companion to the Luxe Axis Spec v1.1, Cinematic Direction, Interface System, and 3D Interaction Framework.*

*End of landing-page blueprint.*
