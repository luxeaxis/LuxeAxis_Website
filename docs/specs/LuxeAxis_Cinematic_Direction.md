# Luxe Axis — Cinematic Direction & Scene Screenplay
### The "Living Axis" as a scroll-driven film · Companion to the 3D Website Spec v1.1

**Read this alongside** `LuxeAxis_3D_Website_Spec.md`. That document is the *system* (IA, tokens, tech, accessibility). This document is the *direction* — the shot list, camera, light, and pacing that make the site feel like a single continuous film. Where the two touch, the spec's device tiers (T0–T3), reduced-motion parity, and performance budgets **always win** over any cinematic ambition here.

**One-line brief:** the visitor takes a single, unbroken descent down the gold **Axis** — from an unbuilt void, through the intelligence that shapes space, into finished rooms and a clear invitation to begin. The camera is the visitor. The scroll is the camera. Nothing moves that the visitor did not ask to move.

---

## 1. The film: thesis, arc, and the rule that governs every effect

### 1.1 Thesis
This is not a website with animations bolted on. It is a **20-second-to-2-minute film the visitor conducts with their scroll wheel.** The story it tells is the company's actual argument: *raw space + applied intelligence = a designed life.* The logo is the opening frame; a booked design audit is the closing one.

### 1.2 The rule of restraint — "The Story Test" (non-negotiable)
Before any camera move, light, particle, or parallax layer ships, it must answer **one** question with a concrete noun or verb:

> **"What does the visitor now understand, feel, or do — that they wouldn't without this effect?"**

If the honest answer is "it looks nice," the effect is **deleted**, not dimmed. Every entry in this document carries an explicit **Job** (understand / feel / do) so the test is auditable. This is the cinematic expression of the spec's five-jobs gate (§6.1 there): *prove, orient, guide, feedback, tone* — and "tone" is capped at the threshold where it would compete with meaning.

### 1.3 The three-act arc (mapped to scroll)

| Act | Scroll zone | Story beat | Emotional target | Light temperature | Primary job |
|-----|-------------|-----------|------------------|-------------------|-------------|
| **I — The Spark** | 0–15% | The void; the logo ignites; space + intelligence assemble a first room | Wonder, "these people see space differently" | Cold void → first warm gold | Establish the world + promise (*Designing Dreams*) |
| **II — The Intelligence** | 15–65% | Descend the Axis through the *how*: Vastu-Tech, Space Score, Space OS | Growing trust, credibility, "this is rigorous" | Warm gold with cool analytical accents | **Prove** the moats; earn belief |
| **III — The Proof & Invitation** | 65–100% | Real rooms, transparent process, transparent price, the door held open | Confidence, readiness, "I can start" | Full, natural, lived-in warmth | **Guide** to the one action: Book a design audit |

The camera performs **one continuous vertical descent** across all three acts — like walking down through a building as it is designed floor by floor. There are no hard cuts anywhere in the film; every scene change is a *spatial move* (§7, Depth-Transition System). This single unbroken move is the reason the site feels cinematic rather than "sectional."

### 1.4 What "cinematic" must never cost us
Three things are load-bearing for a premium *lead-generation* site and are protected from the camera at all times: **legibility** (you can always read the copy), **control** (the visitor always drives; nothing autoplays over them), and **speed** (the first meaningful frame never waits on WebGL). §10 is the guardrail contract that enforces this.

---

## 2. Camera language (camera movements)

The camera is a single virtual body on the Axis. It owns a **small, deliberate vocabulary** — seven moves, each with one job. Reusing a tight vocabulary is what makes the film feel authored rather than random. All moves are driven by scroll (§3), damped for weight (`MathUtils.damp`), and timed with the spec's `--ease-spatial` curve.

| Move | What it does | Story job | When to use |
|------|--------------|-----------|-------------|
| **Descent (dolly)** | Slow vertical travel down the Axis | *Orient* — the throughline; "we are progressing, going deeper" | The default between every scene; never stops entirely until the CTA |
| **Push-in** | Camera advances toward a subject, FOV tightens 45°→35° | *Understand* — "look here, this matters" | To dramatize a single claim (Vastu zone, a Space Score arc) |
| **Pull-back** | Camera retreats, FOV widens, subject shrinks into context | *Understand* — "here's the bigger picture" | Revealing a full room after a detail; the portfolio grid |
| **Orbit (opt-in)** | Constrained arc around an object, user-dragged | *Do* — hands the visitor agency to inspect | Portfolio hero object, Space OS device — only where inspection sells |
| **Rack focus** | Depth-of-field shifts focus between a near and far plane | *Guide* — moves attention across depth without moving the body | Handing off from a foreground caption to the scene behind it |
| **Crane/tilt** | Vertical reveal, camera cranes up/down a tall subject | *Feel* — grandeur, verticality | Elite-tier reveals, the NRI globe rise |
| **Settle** | Deceleration to a dead rest, breathing to a stop | *Do* — "you have arrived; decide now" | Every CTA moment; the end of each act |

**Rules that keep it usable:** FOV stays 35–45° (architectural, never fish-eye); the camera never rolls (no horizon tilt — nausea risk); pointer-parallax on the camera target is ≤ 3° and off by default on touch; and the camera **never seizes control** — if the visitor stops scrolling, the camera stops (except the ≤6% ambient "breath," §4). A "Settle" always precedes any call to action so decisions are made from stillness, not motion.

---

## 3. Scroll-driven storytelling engine (scroll = the projector)

Scroll is the only input the film *requires*. The visitor is the projectionist: scroll forward runs the story, scroll back rewinds it exactly. This is a deliberate accessibility and trust choice — reversible, self-paced, never autoplaying.

**The mechanism.** Lenis smooth-scroll feeds a normalized progress value per scene to GSAP `ScrollTrigger` timelines (`scrub: true`). Each scene occupies a **pinned "stage"** of a defined scroll length; while pinned, scroll scrubs the scene's timeline (camera + light + reveal), then the stage releases and the Descent resumes.

**Pacing law (prevents the #1 scrollytelling failure — the endless pin):**
- A scene resolves its core message within **one viewport-height of scroll** of being pinned. No scene holds the visitor captive longer than ~150vh total.
- Copy is legible at **every** frame of the scrub, not only at the end — a visitor who stops mid-scene still reads a complete thought.
- **Progress is always visible** (the gold bead on the Axis rail) so the visitor knows how much film remains — no infinite-tunnel anxiety.
- A **"Skip the sequence"** affordance appears on any scene with > 100vh of pin, jumping to that section's resolved state.

**Story beats bind to scroll ranges, not to time.** Nothing is on a clock; a fast scroller and a slow reader get the same information in the same order. Autoplaying video or time-based reveals are banned in the main flow.

---

## 4. Lighting design (light is the narrator)

Light does the emotional narration and the wayfinding. The single most reliable way we guide the eye is **the brightest, warmest point in the frame is always the thing to look at next — and at decision moments, that thing is the CTA.**

**The rig (per scene, cheap and baked where possible):**
- **Key** — a warm gold light (3000–3200K feel) = "the illuminating idea / intelligence." It arrives *with* understanding and grows across the film.
- **Fill** — a cool teal-navy fill (the void) keeps shadows from going black and carries the "human/wellness" note where the plant/people appear.
- **Rim** — a crisp edge light separates the subject from the void (premium product-photography look; also an accessibility win — subjects never merge into background).
- **Practical** — in-scene light sources that are also brand objects: the logo's **pendant** is a real practical light; the Axis itself emits.
- **Bloom** — post-processing glow, reserved for the gold Axis and practicals (T3 only). Bloom is the "intelligence is alive" cue; used sparingly so it stays meaningful.

**The light journey (this is the story, told in color temperature):**

| Act | State | What the shift *says* |
|-----|-------|----------------------|
| I | Cold navy void → a single gold spark ignites the Axis and pendant | "From nothing, an idea brings light" |
| II | Gold key strengthens; cool analytical accents (thin teal/cyan) appear during Vastu/Space Score scans | "Intelligence is now working — rigorous, measured" |
| III | Light becomes full, natural, warm — sun-through-window on finished rooms | "This is a real, warm, lived-in home. It's ready. So are you." |

**Usability rules:** contrast for text is *never* left to the 3D light — copy always sits on a stable scrim/plane meeting the spec's AA ratios; light theatrics happen *behind/around* text, never *on* it. Flashing is impossible by construction (no light animates faster than the 6s ambient breath except a single one-shot ignite). Reduced-motion/T1 uses the **final lit frame** of each scene as a static, beautifully graded still.

---

## 5. Parallax depth model (depth you feel, not depth you fight)

Parallax exists for exactly one reason here: to make **space** physically legible — the brand's entire product is space, so depth must be felt, not decorated. We use a disciplined 5-plane stack; scroll and pointer move planes at different rates to produce parallax.

| Plane | Contents | Scroll rate | Rule |
|-------|----------|-------------|------|
| **P0 Void** | Navy gradient + grain, distant skyline marker | 0.15× (slowest) | Never contains information; pure depth floor |
| **P1 Ambient** | Light shafts, drifting motes (T3) | 0.35× | Atmosphere only; `aria-hidden`; first to be dropped on lower tiers |
| **P2 Subject** | The room / object / device — the scene's meaning | 1.0× (anchor) | The one plane that carries the story; always in focus at rest |
| **P3 UI/Caption** | Headline, body, CTA (DOM over canvas) | 1.0× locked | **Never parallaxed** — reading text must not drift; sits on a scrim |
| **P4 Foreground** | Doorframe, close foliage, occluding edge | 1.6× (fastest) | Frames the shot; **never covers a CTA or body copy** |

**Rules:** maximum parallax displacement is **12%** of the viewport (calm, premium — not a theme-park); the **caption plane P3 is exempt from all parallax** so nothing the visitor is reading ever moves under them; foreground P4 occluders are decorative-but-justified (they create the "we are inside a space looking through" feeling that sells interiors) and are `aria-hidden` and pointer-transparent. On touch/T2, pointer-parallax is off and scroll-parallax is halved. On reduced-motion/T1, all planes flatten to a single composed image.

---

## 6. Particle systems (only four exist, each is a sentence)

Particles are where "decoration for its own sake" usually creeps in, so the bar here is the highest in the document: **the entire site ships exactly four particle systems, and each one is a visualized sentence.** If a fifth is proposed, it must replace one of these, not add to them.

| System | What it is | The sentence it says (Job) | Budget / tier |
|--------|-----------|-----------------------------|---------------|
| **Dust-in-light** | ≤ 40 instanced motes drifting only *inside* the key-light shaft | "This space has real air and volume" — makes light/space tangible (*feel*) | T3 only; instanced; off on scroll-idle |
| **Data-flow** | Fine gold points streaming *along the Axis* during Act II | "Intelligence is actively working on your space right now" (*understand*) | T3 full / T2 reduced count; GPU points |
| **Vastu-scan** | A sweeping band of points that passes over the floor plan | "The system is analyzing this room, zone by zone" (*understand/prove*) | Tied to the Vastu scene only; one-shot per view |
| **Resolve-spark** | A brief, single gold shimmer when a room finishes assembling | "This is done — it worked" (*feedback*, rewards completion) | One-shot, ≤ 400ms, then gone |

**Hard rules:** no ambient confetti, no cursor-trailing sparkles, no looping snow. Every system is `aria-hidden`, pointer-transparent, capped in count, and **the first thing dropped** when `PerformanceMonitor` sees frame-rate stress or on `prefers-reduced-data`. Particles never sit between the visitor and text. Reduced-motion → all four are off; their *meaning* is carried by the static composition and copy instead (e.g., the Vastu scene simply shows the analyzed result).

---

## 7. Depth-transition system (the connective tissue — no cuts, ever)

The feeling of "one continuous film" comes entirely from **how we travel between scenes.** There are no fades-to-section and no hard cuts. Four spatial transitions carry the visitor from one meaning to the next; each preserves **spatial memory** (the visitor always knows where they came from and where they are), which is the usability payoff.

| Transition | The move | When | Why it's clear (not disorienting) |
|-----------|----------|------|-----------------------------------|
| **Axis match-move** | Camera keeps descending; the Axis line is continuous through the seam | Default between adjacent beats | The unbroken Axis is a constant landmark — you never lose your bearings |
| **Doorway dolly** | Camera flies *through* an architectural opening into the next room/scene | Entering a new "space" (Hero → Intelligence; a portfolio project) | A door is the most literal, universally-understood spatial transition — perfect for interiors |
| **Rack-focus handoff** | Foreground caption blurs; the scene behind pulls into focus | Detail → context, or caption → interactive object | Focus follows attention the way the eye actually works; nothing teleports |
| **Material wipe** | A surface (wall, brushed-gold panel) sweeps the lens, revealing the next scene | Act boundaries (I→II→III), and light-temperature resets | A physical surface passing the camera reads as "moving to a new place," not a glitch |

**Depth-of-field is the quiet workhorse.** A shallow DoF (T3) keeps exactly one plane sharp — that plane is always the current meaning. Rack-focus (§2) between planes is how we hand attention off without moving the body. On T2/T1, transitions degrade to a **200ms cross-dissolve** with the camera snapping to each scene's rest pose — still coherent, just not dimensional.

---

## 8. Interactive-scene rules (agency, only where it sells)

Most of the film is *watched* (scroll-driven). A few scenes become *touchable* — but only where letting the visitor act **advances the sale or the understanding.** Interactivity is a spice, not the meal; a site that demands constant fiddling feels like work, not luxury.

**Where interaction is earned (and nowhere else):**
- **Portfolio object — drag to orbit.** Inspecting craft from every angle is literally the buying decision. *Job: do.*
- **Space OS device — tilt/tap hotspots.** Trying the product previews ownership. *Job: do.*
- **Fee calculator — the star interaction.** The visitor builds their own estimate; transparency is the brand's promise made tangible. Mostly DOM, minimal 3D. *Job: do + feel (trust).*
- **Vastu toggle — "show my zones."** One tap re-runs the scan on a sample plan; makes an abstract moat concrete. *Job: understand.*
- **Before/After slider.** The visitor controls the transformation reveal. *Job: prove.*

**Rules that keep it usable:** every interactive object has (1) a **visible affordance** ("drag to explore" / a grabbable cursor / a handle), (2) a **keyboard-operable DOM equivalent** layered via `<Html>` (per spec §8.2 — nobody is forced to orbit a mesh), (3) a **snap-back to a good resting pose** on release so the composition never ends up broken, and (4) **no dead ends** — interaction is always optional; the story completes on scroll alone. Interactive scenes soften their ambient camera drift so the visitor's own input is never fighting the director's.

---

## 9. Scene-by-scene screenplay

The homepage is the feature film (Scenes 01–09, one continuous descent). Scenes 10–11 are set-pieces on their own routes. Each card lists the seven requested systems plus, always, **how it guides the visitor**, **how it stays usable**, and the **reduced-motion frame**.

---

### SCENE 01 — "The Spark" · Hero · Act I · scroll 0–15%
**Beat:** From an unbuilt void, the logo ignites and becomes a first designed room. The promise.
**Camera:** Opens locked on the monogram; on first scroll, a gentle **push-in** through the "A"-home's opening (Doorway dolly) that becomes the **Descent**. Ends on a **Settle** at the tagline + CTAs.
**Scroll choreography:** scrub the logo→3D dimensionalize (spec §5.1) — swoosh unrolls to Axis, wall-lines extrude, pendant drops & lights, sofa settles, plant unfurls. One viewport of scroll, fully reversible.
**Parallax:** P0 void gradient; P4 a soft doorframe edge we pass through; P2 the assembling room; P3 headline "Where Space Meets Intelligence" locked and legible throughout.
**Lighting:** cold void → single gold **ignite** (one-shot) on Axis + pendant; warm key blooms as the room resolves. This is the film's only dramatic light "event."
**Particles:** **Resolve-spark** (one gold shimmer) the instant the room completes — says "it worked."
**Depth transition out:** Axis match-move downward into Scene 02.
**Guides the visitor by:** making the brand's thesis legible in 1.2s and pointing the brightest light at the two CTAs at rest. **Stays usable:** headline/CTAs are DOM from frame one; content never waits on WebGL (LCP is the text).
**Reduced-motion frame:** the resolved room-on-Axis (the "finished logo"), tagline, CTAs — static, graded still.

---

### SCENE 02 — "Six Ways In" · Persona router · Act I→II bridge · 15–22%
**Beat:** "Whoever you are, there's a path." Six lit tiles orbit a low-poly Chennai marker.
**Camera:** brief **Pull-back** to reveal all six tiles in context, then **rack focus** to whichever the pointer/focus lands on.
**Scroll choreography:** tiles rise and fan out on entry (staggered 80ms); scroll parks the scene; selection is pointer/keyboard, not scroll.
**Parallax:** shallow — tiles on P2, skyline on P0. Minimal, because this is a *decision* scene and depth should not distract.
**Lighting:** even, gallery-like; the hovered/focused tile gains a warm key (light = "you are considering this one").
**Particles:** none — a routing decision must be uncluttered.
**Depth transition:** Doorway dolly *into* the chosen path when clicked; otherwise Axis match-move continues down.
**Guides the visitor by:** self-segmenting the six personas in one glance so each sees their own journey next. **Stays usable:** it's a plain, tabbable grid of links underneath; the orbit is visual sugar over real navigation.
**Reduced-motion frame:** static responsive grid of six labeled cards.

---

### SCENE 03 — "The Grid Reads the Room" · Vastu-Tech · Act II · 22–38%
**Beat:** The signature moat. The AI reads a floor plan against Vastu — with a human's hand visible on it.
**Camera:** **Crane** down to a top-ish 3/4 of the floor plan, then a slow **push-in** to the first favourable zone.
**Scroll choreography:** scroll drives the **Vastu-scan** sweeping across the plan; zones resolve one by one (gold = favourable, teal = review) with plain-language callouts writing on. A "show my zones" toggle re-runs it (interactive, §8).
**Parallax:** P2 plan; P3 callouts locked; P1 faint cool light. Kept flat so the diagram stays readable.
**Lighting:** cool analytical accent (thin teal/cyan) during the scan — "measurement mode" — warming to gold as favourable zones confirm. A **teal "reviewed by a human designer" chip** is deliberately lit.
**Particles:** **Vastu-scan** band (one-shot per view) and a whisper of **Data-flow** on the Axis — "intelligence, working."
**Depth transition:** Material wipe (a brushed-gold panel) resets light into Scene 04.
**Guides the visitor by:** turning an abstract, unique capability into something they *watch happen*, building the credibility that closes premium/NRI clients. **Stays usable:** the scan result is a labeled static diagram underneath; the analysis reads with or without motion; human-in-the-loop chip prevents an over-claim.
**Reduced-motion frame:** the fully-analyzed plan with all callouts shown at once + a text stepper "how it works."

---

### SCENE 04 — "Rate Any Space" · Space Score · Act II · 38–50%
**Beat:** Proof we can *measure* quality — Wellness / Function / Aesthetics / Sustainability.
**Camera:** **push-in** on a room; a four-arc gauge composits over it; slight **orbit** ends framing the gauge.
**Scroll choreography:** each arc fills and its label writes on as scroll advances; final composite score lands on a **Settle**.
**Parallax:** room on P2, gauge on a near plane, caption P3 locked.
**Lighting:** balanced daylight on the room so it reads as "assessable/real"; gold rim on the gauge to mark it as the proprietary instrument.
**Particles:** none needed — the gauge motion is the meaning; adding particles would dilute it (Story Test fail).
**Depth transition:** rack-focus handoff from gauge → the device in Scene 05.
**Guides the visitor by:** converting taste into a defensible metric, which reframes Luxe Axis as rigorous, not decorative. **Stays usable:** numbers render in DOM immediately for AT; the count-up is a visual copy only.
**Reduced-motion frame:** static gauge at final values + a plain bar readout of the four scores.

---

### SCENE 05 — "Your Project, Live" · Space OS · Act II close · 50–62%
**Beat:** The switching-cost moat + radical transparency — the client platform you'll live in.
**Camera:** **pull-back** reveals a floating device; **orbit (opt-in)** lets the visitor tilt it; **Settle** on a "Request a demo" affordance.
**Scroll choreography:** scroll cycles the device through moodboard → 3D tracker → budget dashboard → AR preview; each screen's one-line benefit writes on.
**Parallax:** device on P2 with a gentle pointer-tilt; soft P4 foreground desk edge for "we're looking at a real workspace."
**Lighting:** screen glow as a practical light on the device; warm room fill — domestic, not corporate.
**Particles:** faint **Data-flow** continuing on the Axis (the OS is "connected/alive"); stops when the visitor grabs the device (their control > ambient).
**Depth transition:** Material wipe to full warm daylight — we cross from Act II (intelligence) into Act III (proof).
**Guides the visitor by:** letting them pre-experience ownership and see budgets in the open, which is the trust close. **Stays usable:** real screenshots and a feature list in DOM; the device is enhancement, and the demo CTA is a normal button.
**Reduced-motion frame:** static device shot + captioned screenshots of each feature.

---

### SCENE 06 — "The Work" · Portfolio · Act III · 62–74%
**Beat:** Enough about how — here is the proof. Real, finished rooms.
**Camera:** **pull-back** into a gallery of material-rich project cards arranged along the Axis; **push-in** on hover/focus; **orbit (opt-in)** on an opened project's hero object.
**Scroll choreography:** cards enter with an 80ms stagger and a ≤12% parallax; scroll glides horizontally-in-depth past them (vertical scroll → z-travel).
**Parallax:** cards on P2 at varied depths (the parallax *is* the "walk past rooms" feeling); P3 filter bar locked.
**Lighting:** each card lit like a photograph — warm key, clean rim — so craft reads. Light lifts on the focused card.
**Particles:** none — photography is the hero; particles would cheapen it.
**Depth transition:** Doorway dolly into a case study (Scene 10) on click; else Axis match-move to Scene 07.
**Guides the visitor by:** shifting from claims to evidence at the exact point trust must be earned with proof. **Stays usable:** it is a filterable image grid at T1/T2; every card is a normal link; before/after uses a keyboard-operable slider.
**Reduced-motion frame:** static responsive gallery with lightbox + slider.

---

### SCENE 07 — "The Process" · Journey along the Axis · Act III · 74–84%
**Beat:** Working with us is systematic and guaranteed — Discover → Audit → Concept → Approve → Build → Handover → Concierge.
**Camera:** steady **Descent**; each step is a lit node passing the lens; a **Settle** on the 60-Day Handover Guarantee.
**Scroll choreography:** nodes illuminate in sequence as scroll passes them; the relevant guarantee/detail writes on beside each.
**Parallax:** nodes on P2 threaded on the Axis; P0 void behind. Deliberately calm — this is reassurance, not spectacle.
**Lighting:** each node lights as it becomes "current," dimming behind — a literal path of light = "here's the road ahead, lit."
**Particles:** none (a whisper of Axis glow only).
**Depth transition:** Axis match-move into the price reveal.
**Guides the visitor by:** removing fear of the unknown process — the #1 hesitation before a high-ticket enquiry. **Stays usable:** it's a numbered vertical stepper underneath; every step is readable text.
**Reduced-motion frame:** static numbered stepper with guarantees inline.

---

### SCENE 08 — "The Transparent Price" · Pricing/Calculator · Act III · 84–92%
**Beat:** The trust weapon — we publish the price. Build your own estimate.
**Camera:** almost still. A restrained **Settle**; the only motion is a gold bead traveling the Axis as the estimate updates.
**Scroll choreography:** minimal — this is a **DOM-first, interactive** scene (the calculator). Scroll just seats it; input drives the bead.
**Parallax:** essentially off. Clarity and speed dominate; the calculator must feel instant and trustworthy.
**Lighting:** clean, even, honest — bright ivory-leaning surface. "Nothing hidden" expressed as literal openness of light.
**Particles:** none.
**Depth transition:** Settle holds; a short Descent to the final invitation.
**Guides the visitor by:** letting price-anxious mid-market visitors self-qualify without a sales call — the documented differentiator. **Stays usable:** the calculator is fully functional with zero 3D; keyboard-complete; results in DOM.
**Reduced-motion frame:** the calculator with a normal progress bar; identical function.

---

### SCENE 09 — "The Invitation" · CTA / Book Audit · Act III close · 92–100%
**Beat:** The door is open. One clear action.
**Camera:** a final **Settle** to complete rest; the Axis glows steady; the finished room sits warm and inviting behind the form.
**Scroll choreography:** none required — we have arrived; the form is the focus.
**Parallax:** frozen. Motion ends where decision begins.
**Lighting:** warmest, fullest light of the whole film — "home." The single brightest point is the **Book a free design audit** button.
**Particles:** none.
**Depth transition:** — (terminus).
**Guides the visitor by:** ending every emotional and rational thread on the one primary conversion, lit and unobstructed. **Stays usable:** a fast, two-step DOM form + WhatsApp/Zoom options for NRI; no 3D dependency.
**Reduced-motion frame:** identical — a calm, warm static hero behind the form.

---

### SCENE 10 — "Inside a Project" · Case-study set-piece · route `/portfolio/[slug]`
**Beat:** Live inside one finished space; understand the design moves.
**Camera:** enters via **Doorway dolly** from the portfolio; a slow interior **push-in**; **orbit (opt-in)** on the hero object; **rack focus** between design-move callouts and the room.
**Scroll choreography:** scroll walks the space; challenge → design moves → before/after (visitor-controlled slider) → Space Score → materials.
**Parallax:** rich interior depth (P4 foreground furniture edge, P2 room, P0 window light) — here the "inside a real space" feeling is the point.
**Lighting:** true-to-photograph daylight; time-of-day matched to the actual shoot (authenticity, per "show the work").
**Particles:** **Dust-in-light** in the window shaft only (T3) — sells the air/volume of a real room.
**Depth transition:** Doorway dolly back out to the gallery on exit.
**Guides the visitor by:** deep proof for high-intent visitors + a "start yours" CTA at the emotional peak. **Stays usable:** full photo story + text works with no WebGL; orbit has a keyboard/DOM equivalent.
**Reduced-motion frame:** immersive photo essay with slider and specs.

---

### SCENE 11 — "Design Chennai From Anywhere" · NRI hub · route `/nri`
**Beat:** You can run a Chennai project from Singapore/Dubai/the Bay Area — here's how.
**Camera:** a **Crane/tilt** rise to a slowly rotating globe; an arc draws from the visitor's region to Chennai; **Settle** on WhatsApp/Zoom CTAs.
**Scroll choreography:** the White-Glove remote-design steps write on along the arc as scroll advances.
**Parallax:** globe on P2, star-field-free void P0 (no decorative stars — Story Test), P3 steps locked.
**Lighting:** a warm Chennai "landing point" glows gold on the globe — the emotional home node.
**Particles:** a single **Data-flow** stream along the arc = "distance is bridged by our platform" (justified: it *is* the remote-collaboration message).
**Depth transition:** cross-dissolve to the audit form.
**Guides the visitor by:** dissolving the #1 NRI objection (distance) for the highest-CLV segment. **Stays usable:** static map + steps + region sub-pages fully server-rendered; CTAs never depend on the globe.
**Reduced-motion frame:** static map graphic with the arc and steps; region cards.

---

## 10. Usability & clarity guardrails (the contract the cinema must obey)

Cinematic ambition is the servant; a clear, usable, fast lead-generation site is the master. These are pass/fail gates — a scene that violates one is broken, however beautiful.

1. **Content is never trapped in motion.** Every headline, paragraph, price, and CTA is real DOM, present and readable at *every* frame of a scrub — not only at a keyframe. Stop scrolling anywhere and you are reading a complete thought.
2. **The visitor always drives.** No autoplay, no scroll-jacking that changes speed or direction, no timed reveals in the main flow. Scroll forward = play; scroll back = exact rewind. Stop = the film stops (except the ≤6% ambient breath).
3. **Speed beats spectacle, always.** First meaningful paint is DOM text/image and never waits on WebGL. If `PerformanceMonitor` sees stress, quality degrades in this order: particles → bloom/DoF → parallax → resolution → static poster. The CWV budget in the spec (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1) is the referee.
4. **Wayfinding is constant.** The gold progress bead shows how much film remains; the nav is always reachable; each scene has a visible label; long pins (>100vh) expose a "skip the sequence."
5. **Reading planes never move.** The caption plane (P3) is exempt from all parallax and camera drift; text always sits on an AA-contrast scrim, never directly on busy 3D.
6. **Full parity for reduced-motion / low-end / no-JS.** Every scene has a defined static frame (listed per scene) carrying identical information and the identical CTA. This is the same experience search crawlers and screen-reader users get — it must convert on its own.
7. **No vestibular hazards.** No camera roll, no fast zooms, nothing flashing >3×/sec, parallax ≤ 12%, and a persistent in-page "Reduce motion" toggle independent of the OS setting.
8. **Motion has an off-ramp.** Interactivity is always optional; the story completes on scroll alone; every orbit/drag snaps back to a composed rest pose and has a keyboard/DOM equivalent.

**The final audit:** run the whole film with a single question per effect — *remove it; is the story or the task worse?* If not, it was decoration. Cut it.

---

## 11. Implementation & orchestration (hand-off to Claude Code)

Built on the spec's stack — **R3F + drei + three + @react-three/postprocessing**, **GSAP ScrollTrigger**, **Lenis** — inside the single persistent `<Canvas>` (spec §4.1). This layer adds a **director** on top.

**11.1 Declarative scene graph — the "shot list as data."** Encode the screenplay as config so scenes are data, not hand-wired timelines. One source of truth for camera, light, transition, and scroll length:

```ts
type Shot = {
  id: string;                     // "scene-03-vastu"
  scrollVH: number;               // pin length in viewport heights (≤1.5)
  camera: { move: CameraMove; from: Pose; to: Pose; fov: [number,number] };
  light:  { key: Kelvin; fill: Color; bloom: number; preset: LightPreset };
  parallax: PlaneRates;           // P0..P4 scroll multipliers
  particles?: 'dust'|'data'|'vastu'|'resolve';   // one of the four, optional
  transitionOut: 'axis'|'doorway'|'rackfocus'|'wipe';
  posterSrc: string;              // T1/reduced-motion still (required)
  a11yAlt: string;               // scene description + the claim it makes
};
const FILM: Shot[] = [ /* scenes 01..09 */ ];
```

**11.2 One camera, one master timeline.** A single `CameraRig` reads a global `scrollProgress` (Lenis → `ScrollTrigger`) and interpolates poses from `FILM`. Each shot is a `ScrollTrigger` with `pin` + `scrub`; on enter it sets the `LightPreset` and mounts the shot's particle system; on leave it plays `transitionOut`. Camera pose uses damped lerp (`MathUtils.damp`) so scrubbing feels weighted, not mechanical.

**11.3 Lighting rig.** One reusable rig (key/fill/rim + optional practical) whose targets are tweened between presets by the active shot. Bake AO/lightmaps in the `.glb`s; only the key + env map are real-time. Bloom/DoF via `EffectComposer`, enabled T3 only, intensity from `shot.light.bloom`.

**11.4 Particles.** Four small modules (`DustInLight`, `DataFlow`, `VastuScan`, `ResolveSpark`), all GPU points/instanced, all mounting only when their shot is active and `tier==='T3'` (DataFlow allowed reduced on T2). Each self-caps its count and is `aria-hidden`.

**11.5 Depth transitions.** Implement the four as composable functions operating on the camera + `EffectComposer` (rack-focus = animate DoF focus distance; wipe = a screen-space panel mesh; doorway = camera path through a portal null; axis = no-op continuation). Fallback on T2/T1 = 200ms CSS cross-dissolve + snap to `shot.to` pose.

**11.6 Performance orchestration.** `frameloop="demand"` — render only while scrolling/interacting or during the ambient breath tick; pause the canvas when the film is off-screen. Preload the *next* shot's assets during idle; dispose two shots back. Hard budgets from spec §10.5 apply per shot.

**11.7 Build order (extends the spec's phases).** (1) Static site + posters — the film's reduced-motion cut, shippable alone. (2) `CameraRig` + master timeline + Descent/Settle only. (3) Lighting presets + rack-focus/DoF. (4) The four depth transitions. (5) Particles. (6) Interactive scenes (orbit/calculator/toggle). Ship each phase behind the tier system; never regress CWV.

### 11.8 Shot-list quick reference

| # | Scene | Act | Scroll | Signature camera | Transition out | Particles |
|---|-------|-----|--------|------------------|----------------|-----------|
| 01 | The Spark (Hero) | I | 0–15% | Doorway push-in → Settle | Axis | Resolve-spark |
| 02 | Six Ways In | I→II | 15–22% | Pull-back + rack focus | Doorway/Axis | — |
| 03 | Vastu-Tech | II | 22–38% | Crane → push-in | Wipe | Vastu-scan + Data-flow |
| 04 | Space Score | II | 38–50% | Push-in → orbit | Rack focus | — |
| 05 | Space OS | II | 50–62% | Pull-back → orbit | Wipe | Data-flow |
| 06 | The Work (Portfolio) | III | 62–74% | Pull-back → push-in | Doorway/Axis | — |
| 07 | The Process | III | 74–84% | Descent → Settle | Axis | — |
| 08 | Transparent Price | III | 84–92% | Settle (near-still) | Descent | — |
| 09 | The Invitation (CTA) | III | 92–100% | Final Settle | terminus | — |
| 10 | Inside a Project | set-piece | route | Doorway → push-in → orbit | Doorway (out) | Dust-in-light |
| 11 | NRI hub | set-piece | route | Crane → Settle | Cross-dissolve | Data-flow |

---

*The camera is the visitor. The scroll is the camera. Every light points at what matters next, and the last light points at the door. Companion to `LuxeAxis_3D_Website_Spec.md` v1.1.*

*End of cinematic direction.*
