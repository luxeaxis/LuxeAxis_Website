# Luxe Axis — 3D Interaction Framework
### Three.js / React-Three-Fiber implementation spec · every interaction = trigger · duration · ease · UX problem

**Companions:** `LuxeAxis_3D_Website_Spec.md` v1.1 (system), `LuxeAxis_Cinematic_Direction.md` (film/scene direction), `LuxeAxis_Design_System.md` + `luxe-axis.tokens.json` (2D UI + tokens). This document is the **developer-level interaction layer**: exactly how each 3D behavior is triggered, timed, eased, and why it exists. Durations and eases are drawn from the shared motion tokens so 2D and 3D feel like one hand.

Everything here obeys the two overriding rules from the system spec: **content never waits on WebGL** (DOM/LCP first), and **device tiers T0–T3 + reduced-motion always win** over any effect below.

---

## 0. Foundations

### 0.1 Stack & roles
| Concern | Lib | Role |
|---|---|---|
| Renderer/scene | `three` + `@react-three/fiber` | Declarative scene graph |
| Helpers | `@react-three/drei` | `CameraControls`, `Html`, `useGLTF`, `Environment`, `AdaptiveDpr`, `PerformanceMonitor`, `Preload` |
| Post FX | `@react-three/postprocessing` | Bloom, DoF, vignette (T3 only) |
| Scroll | `lenis` | Smooth scroll → single source of scroll progress |
| Choreography | `gsap` + `ScrollTrigger` + `CustomEase` | Discrete tweens + scroll-scrubbed timelines |
| State bus | `zustand` | Cross-component interaction state (tier, reducedMotion, activeScene, cursor) |

**Golden architecture rule:** ONE persistent `<Canvas>` at app-shell level (`position:fixed; z-index:0; pointer-events:none` except on interactive meshes). Scenes swap via a `SceneRouter` keyed to scroll/route — WebGL context is never torn down. All DOM (headlines, CTAs) renders above the canvas in normal flow. This is what makes the "one continuous film" possible and keeps content independent of the GL layer.

### 0.2 The interaction contract (how to read every entry)
Every interaction below specifies four fields, exactly as requested:

- **Trigger** — the precise event: `loader:complete`, `scroll ∈ [a%,b%]` (scrubbed), `in-view (once)`, `pointerover (raycast)`, `pointermove`, `click/tap`, `focus`, `submit:success`, `idle`.
- **Duration** — one of two kinds; a senior-dev distinction that matters:
  - **Time-based `(t)`** = milliseconds. For discrete tweens (hover, press, one-shots, in-view entrances).
  - **Scroll-based `(s)`** = viewport-heights of scroll the effect is mapped across, plus **scrub-smoothing** (catch-up lag in seconds). For scrubbed camera/scene timelines the *scroll position is the playhead* — there is no ms duration.
- **Ease** — for `(t)` interactions, one of the four tokens (bezier below). For `(s)` interactions ease is **`none` (linear-to-scroll)**; the felt smoothness comes from Lenis lerp + ScrollTrigger `scrub` lag, not an ease curve. This is stated explicitly per entry so it's never ambiguous.
- **UX problem** — the concrete problem it solves. If an interaction can't name one, it isn't built.

### 0.3 Motion tokens → code (canonical mapping)
```ts
// durations (ms) — from tokens
export const D = { instant:80, micro:120, ui:240, enter:480, section:800, signature:1200 };

// easings — cubic-bezier is the source of truth; register once for GSAP
import { gsap } from "gsap"; import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);
CustomEase.create("lx-standard", "M0,0 C0.4,0 0.2,1 1,1");   // cubic-bezier(.4,0,.2,1)
CustomEase.create("lx-entrance", "M0,0 C0.16,1 0.3,1 1,1");  // (.16,1,.3,1)  decelerate/"settle"
CustomEase.create("lx-exit",     "M0,0 C0.4,0 1,1 1,1");     // (.4,0,1,1)    accelerate away
CustomEase.create("lx-spatial",  "M0,0 C0.65,0.05 0.36,1 1,1"); // (.65,.05,.36,1) weighted camera
// convenience approximations: entrance≈expo.out · spatial≈power2.inOut · exit≈power2.in

// framerate-independent damping for useFrame (pointer, idle, cursor)
import { MathUtils } from "three";
// lambda: heavier = smaller. cursor 10 · pointer-parallax 4 · idle 2
const damp = (cur:number, target:number, lambda:number, dt:number) =>
  MathUtils.damp(cur, target, lambda, dt);
```
CSS-var mirror (`--dur-*`, `--ease-*`) already exists in the design-system tokens; the numbers are identical so a hover in the DOM and a hover on a mesh share timing.

### 0.4 Input & scroll model
```ts
// Lenis is the ONE scroll source; feed it to GSAP ticker & ScrollTrigger
const lenis = new Lenis({ lerp:0.1, smoothWheel:true });        // ~0.1 lerp = calm, premium
gsap.ticker.add((t)=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0);
ScrollTrigger.scrollerProxy(...); ScrollTrigger.defaults({ scrub: 0.8 }); // 0.8s catch-up lag
```
- **Scroll** drives all camera/scene timelines (§4). **Never** hijack scroll speed/direction; scroll forward = play, back = exact rewind.
- **Pointer** hover uses R3F raycasting (`onPointerOver/Out/Move` on meshes); `pointer-events` enabled only on interactive meshes for cost + scroll integrity.
- **Every pointer/scroll interaction has a keyboard/DOM equivalent** (drei `<Html>` buttons) — nobody is required to orbit a mesh (a11y, spec §8.2).

### 0.5 Tiering & reduced-motion gates (govern EVERY interaction)
Resolve tier once on load (`detect-gpu` + `deviceMemory` + `matchMedia`), store in zustand; `PerformanceMonitor` can downgrade live.

| Tier | Trigger | Interaction behavior |
|---|---|---|
| **T3 Full** | Desktop/high-end mobile | All effects: post-FX, particles, pointer FX, DoF |
| **T2 Lite** | Mid mobile / integrated GPU / `prefers-reduced-data` | No post-FX, DPR≤1.5, particles reduced/off, pointer parallax off, scroll FX halved |
| **T1 Static** | Low-end / no-WebGL / `prefers-reduced-motion` / save-data | **No live canvas** — pre-rendered posters; all interactions collapse to instant state or ≤150ms opacity |
| **T0 SSR/no-JS** | Crawler / JS off | Semantic DOM + posters; fully usable |

**Global reduced-motion:** a `useReducedMotion()` hook drives both GSAP (timelines jump to end-state; `scrub` disabled → snap) and R3F (mounts poster variant). Degradation order under FPS stress: particles → bloom/DoF → pointer FX → parallax → DPR → poster. **The number (60fps / CWV) always wins over the effect.**

---

## 1. Hero scene — "The Axis Forms"

**Intent:** dimensionalize the logo — the monogram's interior (pendant, sofa, plant) + swoosh lift off the 2D mark and assemble into a lit room on the gold Axis. The whole first-viewport story is **scroll-scrubbed and reversible**; the visitor conducts it.

| # | Interaction | Trigger | Duration | Ease | UX problem solved |
|---|---|---|---|---|---|
| H1 | Logo line-art draw-on (handoff from loader) | `loader:complete` | `(t)` 1200ms (signature), staged strokes @120ms stagger | `lx-entrance` | Turns dead load time into brand meaning; hides last-mile asset settle |
| H2 | Swoosh → Axis unroll | `scroll ∈ [0,4%]` | `(s)` mapped over 4vh, scrub 0.8 | none (linear-to-scroll) | Establishes the vertical spine → teaches "scroll travels down the Axis" |
| H3 | Wall-lines extrude (2D→3D) | `scroll ∈ [3,7%]` | `(s)` 4vh | none | Communicates "space is being built" without copy |
| H4 | Pendant drop + practical light ignite | `scroll ∈ [6,9%]` | `(s)` 3vh; emissive/`intensity` 0→1 | none (scrub) | Directs the eye to the room's focal point (light = look-here) |
| H5 | Sofa settle + material resolve (wireframe→PBR) | `scroll ∈ [8,12%]` | `(s)` 4vh; `roughness`/opacity lerp | none | Signals craft/finish — the "designed" payoff |
| H6 | Plant unfurl (teal, last) | `scroll ∈ [11,14%]` | `(s)` 3vh; scale + slight rotate | none | The human/wellness note ("AI assists, humans decide") |
| H7 | Resolve-spark (one-shot bloom pulse) | `scroll crosses 14%` (once, both directions guarded) | `(t)` 400ms | `lx-exit` (quick out) | Rewards completion; punctuates "it worked" |
| H8 | Idle: Axis breathing glow + pointer parallax | `idle` + `pointermove` (T3) | continuous; glow 6s loop ±6%; parallax damped λ4 | n/a (damped) | Keeps the scene feeling alive/intelligent without demanding attention |
| H9 | Hero settle → CTA + scroll cue reveal | `scroll ≥ 15%` (pin end) | `(t)` 480ms CTA rise; cue loop 1.6s | `lx-entrance` | Hands control back at rest; tells the visitor how to proceed |

**Implementation notes.** One GSAP timeline bound to a pinned `ScrollTrigger` (`end:"+=150%"`, `scrub:0.8`, `pin:true`). H2–H6 are `timeline.to(...)` steps positioned by scroll fraction; the **geometry is the exact vector set extracted from the logo** (spec §3.6) so mark and scene never drift. H7 uses a guarded flag so scrubbing back and forth doesn't re-fire the spark. Bloom (drei/postprocessing) only on Axis + pendant emissive, T3 only.
**Reduced-motion / T1:** render the *resolved* frame (finished room-on-Axis) as a graded static poster with the tagline + CTAs — H1–H8 skipped, H9's CTA present immediately.

---

## 2. Object animations (reusable primitives)

**Intent:** a small library of object behaviors reused across every scene, so motion is consistent and cheap. Each is a function on a mesh/group, tier- and reduced-motion-aware.

| # | Interaction | Trigger | Duration | Ease | UX problem solved |
|---|---|---|---|---|---|
| O1 | Entrance (fade + rise 16px / or scale 0.96→1) | `in-view (once)` via ScrollTrigger | `(t)` 480ms (enter) | `lx-entrance` | Leads the eye in reading order; avoids everything popping at once |
| O2 | Material resolve (wireframe→PBR: opacity + roughness + emissive) | `scroll ∈ scene range` or `in-view` | `(t)` 480–800ms or `(s)` scene-mapped | `lx-entrance` / none | Shows "concept → finished" — the core brand transformation |
| O3 | Instanced stagger (furniture, grid cells, list nodes) | parent `in-view` | `(t)` per child, stagger 80ms | `lx-entrance` | Creates rhythm; implies craft and order (Spacefulness) |
| O4 | Idle float (bob ≤6px, sinusoidal) | `idle`, scene active, T3 | continuous 4–6s | n/a (sin, damped) | Keeps hero objects feeling physical, not frozen — tone only |
| O5 | Line draw-on (dashOffset animation) | `in-view (once)` | `(t)` 600ms | `lx-entrance` | Explains diagrams progressively (Vastu grid, journey path) |
| O6 | State morph (zone recolor / floor-plan change) | data change or `scroll` | `(t)` 240ms (ui) | `lx-standard` | Makes analysis legible as it happens (Vastu/Space Score) |
| O7 | Assemble / explode (product parts separate) | toggle `click`/`in-view` | `(t)` 800ms | `lx-spatial` | Reveals how a product/space is composed (showcase clarity) |
| O8 | LOD / detail swap | camera distance threshold | instant (crossfade 120ms) | `lx-standard` | Performance — invisible; prevents pop by short crossfade |

**Implementation.** Prefer animating cheap props: `material.opacity`, `emissiveIntensity`, `position`, `scale`, `rotation`, `dashOffset`; avoid per-frame geometry rebuilds. Use `InstancedMesh` + per-instance attributes for O3; drive stagger with GSAP `stagger:0.08`. Idle O4 runs in `useFrame` with damped sine, and **pauses when the scene is off-screen** (`frameloop="demand"`). All entrances are **once** (no re-trigger on scroll-back) unless the scene is explicitly scrubbed.
**Reduced-motion:** O1/O2/O5 → final state instantly; O4 off; O6 instant recolor; O7 shows assembled state with a static exploded diagram alternative.

---

## 3. Hover & cursor effects

**Intent:** make the dark, cinematic surface feel responsive and "lit from within," and telegraph what's interactive — without a busy, gimmicky cursor. Desktop-pointer only; touch and keyboard get equivalent affordances.

| # | Interaction | Trigger | Duration | Ease | UX problem solved |
|---|---|---|---|---|---|
| C1 | Custom cursor (dot + trailing ring) | `pointermove` (fine pointer only) | follow damped λ: dot 14 / ring 8 | n/a (damped) | A precise, branded pointer; the ring's lag reads as "considered" |
| C2 | Cursor morph on interactive (ring grows + label: "drag" / "open" / "view") | `pointerover` interactive (raycast/DOM) | `(t)` 120ms (micro) | `lx-standard` | Removes ambiguity about what can be touched (discoverability) |
| C3 | Object rim/emissive lift | `pointerover` mesh (raycast) | `(t)` 120ms | `lx-standard` | Confirms the exact object under cursor (feedback precision) |
| C4 | Object hover lift (translateY −8px) | `pointerover` card/object | `(t)` 120ms | `lx-standard` | Signals "pick me / clickable" with physical affordance |
| C5 | Magnetic CTA (button eases toward cursor within ~80px) | `pointermove` in radius | pull damped λ6; release 240ms | `lx-entrance` on release | Reduces final targeting effort to the money action (Fitts's law) |
| C6 | Cursor-follow spotlight (soft radial light tracks pointer on dark sections) | `pointermove` (T3) | damped λ5 | n/a | Gently lifts whatever the visitor points at — guides attention |
| C7 | Material sheen tracks cursor (specular highlight on gold/brass) | `pointermove` over metal | damped λ8 | n/a | Sells materiality (brushed metal realism) — brand tone |
| C8 | Pointer parallax on camera target (≤3°) | `pointermove` (T3, non-touch) | damped λ4 | n/a | Adds depth/life without moving content; parallax = space cue |
| C9 | Link/hotspot underline or ring draw | `pointerover`/`focus` | `(t)` 120ms | `lx-standard` | The non-color affordance (color-blind safe) |
| C10 | Hover-out reset (all above) | `pointerout`/`blur` | `(t)` 120ms | `lx-exit` | Clean, quick return — no lingering states that confuse |

**Implementation.**
```tsx
// R3F raycast hover with damped emissive (C3) — no re-render per frame
function InteractiveMesh(props){
  const ref = useRef<Mesh>(null!); const hovered = useRef(0);
  useFrame((_,dt)=>{ const m=ref.current.material as MeshStandardMaterial;
    m.emissiveIntensity = MathUtils.damp(m.emissiveIntensity, hovered.current?0.6:0.0, 10, dt); });
  return <mesh ref={ref}
    onPointerOver={(e)=>{e.stopPropagation(); hovered.current=1; setCursor('view');}}
    onPointerOut={()=>{ hovered.current=0; setCursor('default'); }}
    onClick={props.onOpen} {...props}/>;
}
```
Cursor (C1/C2) is a DOM overlay driven by damped `pointermove` (rAF), not a mesh — cheaper and crisper. Raycast only against a curated interactive layer (`raycaster.layers`) to keep hover cheap.
**Touch:** all hover states are **non-essential**; on `(pointer:coarse)` C1–C8 are disabled and interactivity is conveyed by persistent affordances (a "drag" handle, a chevron, a button). **Keyboard:** `:focus-visible` mirrors C2/C3/C9 exactly. **Reduced-motion:** custom cursor → native cursor; C3/C4/C9 become instant color/border changes; C5–C8 off.

---

## 4. Scroll-triggered camera moves

**Intent:** the camera is the visitor; scroll is the camera. A **single camera on a dolly constrained to the Axis** reads global scroll progress and interpolates poses from the scene config. A tight vocabulary of moves (from the cinematic layer) with exact scrub config. For all scrubbed moves, **Ease = none (linear-to-scroll)**; smoothness comes from Lenis lerp (0.1) + ScrollTrigger `scrub:0.8`.

| # | Move | Trigger | Duration | Ease | UX problem solved |
|---|---|---|---|---|---|
| SC1 | **Descent** (vertical dolly down the Axis) | `scroll` global (default between scenes) | `(s)` continuous; scrub 0.8 | none | Throughline & orientation — "we're progressing, going deeper" |
| SC2 | **Push-in** (advance; FOV 45°→35°) | `scroll ∈ pinned-scene range` | `(s)` ~80–120vh; scrub 0.8 | none | Focuses attention on one claim (Vastu zone, gauge, product) |
| SC3 | **Pull-back** (retreat; FOV→45°) | `scroll ∈ range` | `(s)` ~80vh; scrub 0.8 | none | Reveals context after a detail (room → portfolio grid) |
| SC4 | **Crane / tilt** (vertical reveal of a tall subject) | `scroll ∈ range` | `(s)` ~100vh; scrub 1.0 (heavier) | none | Conveys scale/grandeur (Elite tier, NRI globe rise) |
| SC5 | **Settle** (decel to dead rest at a decision point) | `scroll` reaches scene `end` | `(t)` 800ms tail | `lx-spatial` | Decisions are made from stillness, not motion — precedes every CTA |
| SC6 | **Rack focus** (DoF focus distance A→B) | `scroll` sub-range or `pointerover` caption | `(t)` 480ms or `(s)` | `lx-standard` / none | Moves attention across depth without moving the body — no nausea |
| SC7 | Pointer parallax overlay (≤3°) | `pointermove` (T3) | damped λ4 | n/a | Depth/life layered over the scroll pose |
| SC8 | Scroll-velocity damping (no whip on fast flicks) | `scroll` velocity | Lenis lerp 0.1 | n/a | Prevents motion sickness & overshoot on aggressive scroll |

**Implementation.**
```ts
// one rig, poses from FILM config; scrub maps scroll→pose. No camera roll ever.
useLayoutEffect(()=>{ const tl = gsap.timeline({ scrollTrigger:{
    trigger:sceneEl, start:"top top", end:"+=120%", pin:true, scrub:0.8,
    onLeave:()=>playTransition(shot.transitionOut) }});
  tl.to(cam.position, { x:shot.to.x, y:shot.to.y, z:shot.to.z, ease:"none" }, 0)
    .to(cam, { fov:shot.fov[1], onUpdate:()=>cam.updateProjectionMatrix(), ease:"none" }, 0);
}, [shot]);
// camera target damped in useFrame for weight (SC5 tail + SC7 parallax)
useFrame((_,dt)=>{ cam.position.y = MathUtils.damp(cam.position.y, targetY, 6, dt); });
```
**Hard rules:** FOV 35–45°, **no roll** (horizon never tilts — vestibular safety), parallax ≤3°, camera **stops when scroll stops**. Pin lengths ≤150vh per scene (spec pacing law).
**Reduced-motion / T1:** `scrub` disabled — camera **snaps** to each scene's rest pose on section enter; no dolly, no DoF, no parallax. Content identical.

---

## 5. Section transitions

**Intent:** the "one continuous film" feeling comes from *never hard-cutting*. Four spatial transitions carry the visitor between scenes and preserve spatial memory (you always know where you came from). Plus DOM/route transitions layered over the persistent canvas.

| # | Transition | Trigger | Duration | Ease | UX problem solved |
|---|---|---|---|---|---|
| ST1 | **Axis match-move** (continuous descent through the seam) | `scroll` crossing adjacent scenes | `(s)` continuous | none | No teleport between sections — the Axis is a constant landmark |
| ST2 | **Doorway dolly** (camera flies through an opening into next room) | `scroll` at scene boundary / `click` project | `(t)` 800ms (section) | `lx-spatial` | Entering a "new space" reads instantly (universal door metaphor) |
| ST3 | **Rack-focus handoff** (foreground blurs, next plane sharpens) | `scroll` boundary | `(t)` 480ms | `lx-standard` | Attention moves the way the eye does — nothing jumps |
| ST4 | **Material wipe** (brushed-gold panel sweeps the lens) | `scroll` at Act boundaries (I→II→III) | `(t)` 600ms | `lx-spatial` | Marks a chapter change + covers a light-temperature reset |
| ST5 | **Route change** (View Transitions API + shared element) | client navigation `click` | `(t)` 240ms (ui) | `lx-standard` | Continuity between pages; shared element morph = "same object" |
| ST6 | Scene mount/preload (SceneRouter) | scene approaching viewport (idle) | preloaded; crossfade 240ms | `lx-standard` | Zero stall entering a scene; disposes 2 scenes back for memory |

**Implementation.** ST1 is a no-op continuation (same rig, no seam). ST2 animates the camera along a portal spline (a `CatmullRomCurve3` through a doorway null). ST3 tweens `DepthOfField.target`/`focusDistance` (postprocessing). ST4 is a screen-space panel mesh on an ortho overlay swept across NDC x. ST5 uses `next-view-transitions` with `view-transition-name` on the shared card→hero. ST6: drei `<Preload>` on the next shot during `requestIdleCallback`; `useGLTF.preload()` for the following `.glb`.
**Reduced-motion / T2/T1:** all of ST1–ST4 collapse to a **200ms cross-dissolve** + camera snap to the next rest pose; ST5 falls back to a plain fade. Coherent, just not dimensional.

---

## 6. Loading experience

**Intent:** make waiting feel intentional and fast (perceived performance = luxury). Match the loader to the wait; never a naked full-screen spinner; never block first paint on WebGL.

| # | Interaction | Trigger | Duration | Ease | UX problem solved |
|---|---|---|---|---|---|
| L1 | **Brand loader** — logo `mark` interior line-art draws on | `app:mount` | `(t)` ≤1200ms (signature); min-display 600ms | `lx-entrance` | Converts unavoidable boot time into brand; prevents spinner-flash |
| L2 | Determinate progress (asset %) | `three` LoadingManager `onProgress` | tracks real %; bar fill 240ms/step | `lx-standard` | Honest wait; reduces abandonment (progress > uncertainty) |
| L3 | **Seamless handoff loader→hero** | `assets:ready && min-time elapsed` | `(t)` 480ms crossfade into H1/H2 | `lx-entrance` | No jarring "loaded!" cut — the mark simply becomes the scene |
| L4 | DOM skeletons (SSR/ISR streaming blocks) | RSC stream / route load | shimmer 1.4s loop (the one allowed loop) | linear | Prevents CLS; shows layout shape immediately |
| L5 | Next-scene preload | scene N within 1 viewport of entry (idle) | background; 0 visible | n/a | Zero stall on scroll into the next scene |
| L6 | Progressive texture streaming | after first paint | KTX2 mip stream; fade-in 240ms | `lx-standard` | LCP never waits on a texture; quality arrives gracefully |
| L7 | Per-scene Suspense fallback | `React.Suspense` boundary | poster shown until ready; crossfade 240ms | `lx-standard` | No blank canvas; poster is the reduced-motion frame anyway |
| L8 | Timeout / error → poster + retry | load > 8s or error | instant swap; retry `micro` | `lx-standard` | Resilience — never an infinite spinner; site still converts |

**Implementation.**
```tsx
// min-display guard so fast loads still read as intentional, slow loads never flash
const ready = useAssetsReady(); const minElapsed = useMinTime(600);
const done = ready && minElapsed;
// three LoadingManager → progress store for L2
manager.onProgress = (_,loaded,total)=> setProgress(loaded/total);
<Suspense fallback={<ScenePoster src={shot.posterSrc}/>}>{done && <Hero/>}</Suspense>
```
LCP element is DOM (hero headline/CTA), rendered by the server **behind** the loader overlay, so it's painted before the loader even clears. L1 is a lightweight inline SVG (the logo), not a GL scene — it shows instantly with no bundle dependency.
**Reduced-motion / T1:** L1 → static logo (no draw); L4 → static muted blocks (no shimmer); L2/L8 unchanged (they're informational, not decorative).

---

## 7. Product showcases

**Intent:** the "products" are the Space OS device, portfolio project objects, the Vastu-Tech plan, the Space Score gauge, and virtual-staging. Interaction here is *earned* — inspection is literally the buying decision — so it gets real agency, always with a keyboard/DOM equivalent.

| # | Interaction | Trigger | Duration | Ease | UX problem solved |
|---|---|---|---|---|---|
| P1 | **Drag-orbit** (constrained azimuth ±35°, polar clamped) | `pointerdown`+drag / arrow keys | follows input; inertia decay 600ms | `lx-exit` (decay) | Inspecting craft from angles closes the sale; reduces decision regret |
| P2 | Auto-rotate idle (until first interaction) | scene `in-view` && no input 3s | 0.15 rad/s | linear | Signals "this is interactive" + shows the object off |
| P3 | Snap-back to hero pose | `pointerup`/`blur` after orbit | `(t)` 480ms | `lx-entrance` | Composition never ends up broken/upside-down |
| P4 | Hotspot reveal (annotations via `<Html>`) | `in-view` / hover / focus | `(t)` 240ms fade+scale | `lx-standard` | Explains features in context (Space OS moodboard, budget, AR) |
| P5 | Zoom-to-detail (dolly to hotspot) | `click` hotspot | `(t)` 800ms | `lx-spatial` | Directs to the exact selling detail without user aiming the camera |
| P6 | Variant / finish swap (material or product config) | `click` swatch | `(t)` 240ms crossfade of maps | `lx-standard` | Lets clients try finishes — personalization = higher intent |
| P7 | Space Score gauge fill (4 arcs write on) | `scroll ∈ range` | `(s)` scene-mapped | none | Turns taste into a measurable, defensible score |
| P8 | Vastu scan sweep + zone recolor | `scroll` / "show my zones" `click` | `(s)` or `(t)` 1200ms one-shot | none / `lx-standard` | Makes an abstract, unique capability something you watch happen |
| P9 | Before/After reveal (staging) | drag slider / arrow keys | follows input | none | Visitor controls the transformation — proof, self-paced |

**Implementation.**
```tsx
// drei CameraControls (or OrbitControls) with clamps + snap-back (P1/P3)
<CameraControls ref={cc} minAzimuthAngle={-0.6} maxAzimuthAngle={0.6}
   minPolarAngle={1.1} maxPolarAngle={1.7} dollySpeed={0} />
// on release: cc.current.setLookAt(...heroPose, true) // enableTransition=true → eased snap
// keyboard equivalents (a11y): ← → rotate step, Enter = open, Esc = reset
```
Every showcase renders a **DOM control layer** (`<Html>`): buttons for variant swap (P6), a slider input for before/after (P9), a "reset view" button (P3), and hotspot buttons (P4) — so the entire showcase is operable by keyboard and screen reader. Auto-rotate (P2) stops permanently on first user input (respect intent).
**Reduced-motion / T1:** P1/P2/P5 off → a static hero shot + a small set of pre-rendered angle thumbnails; P4 hotspots become a static labeled list; P6 swaps still work (instant); P7/P8 show final state; P9 slider works without animation.

---

## 8. CTA animations

**Intent:** the site's one job is to route to **Book a design audit**. CTAs must be found instantly and rewarded on completion — but with restraint (a screaming button cheapens luxury). In 3D scenes, the lighting itself points at the CTA.

| # | Interaction | Trigger | Duration | Ease | UX problem solved |
|---|---|---|---|---|---|
| CTA1 | Scroll cue (hero chevron / "scroll to begin") | hero at rest, no scroll 2s | loop 1.6s, ±6px | `lx-standard` | Teaches the primary input (scroll) to first-time visitors |
| CTA2 | Primary hover (fill gold→champagne + lift + icon nudge 4px) | `pointerover`/`focus` | `(t)` 120ms | `lx-standard` | Confirms the money action is live; draws the click |
| CTA3 | Primary press | `pointerdown`/`keydown` | `(t)` 120ms scale 0.98 | `lx-standard` | Tactile confirmation of the highest-value tap |
| CTA4 | Magnetic pull (desktop, within ~80px) | `pointermove` in radius | pull λ6; release 240ms | `lx-entrance` | Lowers targeting effort to the conversion (Fitts's law) |
| CTA5 | Settle-into-view (camera settles, CTA rises) | scene `end` reached (SC5) | `(t)` 480ms CTA rise, +80ms after settle | `lx-entrance` | Every scene resolves on the action, from stillness |
| CTA6 | Submit → success (gold "settle" pulse + confirmation card rise) | `submit:success` | `(t)` pulse 400ms + card 480ms | `lx-entrance` | Rewards conversion; sets a calm, confident closing tone |
| CTA7 | Persistent conversion rail appears | `scroll > first section` (once) | `(t)` 240ms slide-in | `lx-entrance` | Keeps the action one tap away after intent is shown |
| CTA8 | Lighting cue (brightest/warmest point = the CTA) | scene at rest | matches SC5 (800ms) | `lx-spatial` | In 3D scenes, guides the eye to the action via light, not clutter |
| CTA9 | Secondary de-emphasis | always | n/a | n/a | One primary per view; secondary is outline-only so the eye finds the money action |

**Implementation.** CTA1 loop **stops permanently on first scroll**. CTA4 magnetic uses damped translate on the button element (DOM), disabled on touch and reduced-motion. CTA6: a short GSAP timeline — a one-shot bloom pulse on the 3D Axis (T3) synced to a DOM confirmation card Enter pattern; posts to the Space OS lead queue with UTM before the reward plays. CTA8 is a lighting preset (§ cinematic) not an animation per se — the key light lands on the CTA's DOM region.
**Reduced-motion / T1:** CTA1 → static chevron; CTA2/CTA3 → instant color/border; CTA4 off; CTA5/CTA7 → appear instantly; CTA6 → confirmation card shown instantly (no pulse); CTA8 → static graded frame. The conversion path is byte-for-byte identical.

---

## 9. Orchestration, performance & QA

**9.1 Master timeline.** A single `FILM: Shot[]` config (from the cinematic doc) is the source of truth; a `CameraRig` reads global `scrollProgress` and interpolates poses; each shot owns a pinned `ScrollTrigger` that (a) scrubs camera + scene timelines, (b) sets the light preset on enter, (c) mounts its one particle system, (d) plays `transitionOut` on leave. Discrete interactions (hover, press, one-shots) are local GSAP tweens using the registered eases. **One motion engine (GSAP) + one scroll source (Lenis)** — no competing rAF loops.

**9.2 Event/state bus (zustand).** Holds `tier`, `reducedMotion`, `activeScene`, `scrollProgress`, `cursorState`, `assetsReady`. Interactions read from it rather than prop-drilling; the DOM cursor, nav condense, and scene FX all subscribe.

**9.3 Performance budgets (per the system spec, enforced per interaction).**
- Initial JS ≤ 200KB gzip; **three/R3F code-split, excluded from first load**.
- Per-scene ≤ 1.5MB (hero ≤ 2.5MB) compressed (Draco + KTX2). ≤ 100k visible tris.
- 60fps T3 / 30fps floor before `PerformanceMonitor` downgrades (order in §0.5).
- `frameloop="demand"` — render only on scroll/interaction/idle-tick; pause canvas off-screen (battery).
- Raycast only the interactive layer; throttle `pointermove` handlers to rAF.

**9.4 QA gates (a scene ships only when all pass).** Content complete & converting at T1/reduced-motion (parity); CWV green on throttled mobile (LCP≤2.5s, INP≤200ms, CLS≤0.1); `axe` 0 serious/critical; keyboard + SR pass (every 3D interaction has a DOM equivalent); every interaction present maps to a row in §10 (has trigger+duration+ease+UX problem) and has a reduced-motion fallback; no camera roll; nothing flashes >3×/s.

---

## 10. Master interaction index

Single reference for every interaction in this framework. `(t)`=time-based ms · `(s)`=scroll-based vh (ease = none/linear-to-scroll). Eases: standard `(.4,0,.2,1)` · entrance `(.16,1,.3,1)` · exit `(.4,0,1,1)` · spatial `(.65,.05,.36,1)`.

| ID | Interaction | Trigger | Duration | Ease | UX problem |
|----|-------------|---------|----------|------|-----------|
| H1 | Logo draw-on | loader:complete | (t)1200 | entrance | Meaningful load |
| H2–H6 | Room assemble | scroll 0–14% | (s)~14vh | none | "Space being built" |
| H7 | Resolve-spark | scroll xes 14% | (t)400 | exit | Completion reward |
| H8 | Axis breath/parallax | idle/pointer | loop/λ4 | n/a | Alive, not frozen |
| H9 | Hero settle→CTA | scroll ≥15% | (t)480 | entrance | Hand back control |
| O1 | Entrance rise | in-view once | (t)480 | entrance | Reading order |
| O2 | Material resolve | scroll/in-view | (t)480–800 | entrance | Concept→finished |
| O3 | Instanced stagger | parent in-view | (t)80/child | entrance | Rhythm/craft |
| O4 | Idle float | idle T3 | loop 4–6s | n/a | Physicality |
| O5 | Line draw-on | in-view once | (t)600 | entrance | Progressive diagrams |
| O6 | State morph | data/scroll | (t)240 | standard | Legible analysis |
| O7 | Assemble/explode | click/in-view | (t)800 | spatial | Show composition |
| O8 | LOD swap | distance | (t)120 xfade | standard | Perf, no pop |
| C1 | Custom cursor | pointermove | λ8–14 | n/a | Branded precision |
| C2 | Cursor morph | pointerover | (t)120 | standard | Discoverability |
| C3 | Rim/emissive lift | raycast over | (t)120 | standard | Feedback precision |
| C4 | Object lift | pointerover | (t)120 | standard | "Clickable" |
| C5 | Magnetic CTA | pointermove radius | λ6/240 | entrance | Fitts's law |
| C6 | Cursor spotlight | pointermove T3 | λ5 | n/a | Guide attention |
| C7 | Material sheen | pointermove metal | λ8 | n/a | Materiality |
| C8 | Pointer parallax | pointermove T3 | λ4 | n/a | Depth cue |
| C9 | Underline/ring draw | over/focus | (t)120 | standard | Non-color affordance |
| C10 | Hover reset | pointerout/blur | (t)120 | exit | Clean return |
| SC1 | Descent | scroll global | (s)cont | none | Orientation |
| SC2 | Push-in | scroll in range | (s)80–120vh | none | Focus a claim |
| SC3 | Pull-back | scroll in range | (s)80vh | none | Reveal context |
| SC4 | Crane/tilt | scroll in range | (s)100vh | none | Scale/grandeur |
| SC5 | Settle | scroll end | (t)800 | spatial | Decide from stillness |
| SC6 | Rack focus | scroll/hover | (t)480 | standard | Attention w/o nausea |
| SC7 | Pointer parallax | pointermove T3 | λ4 | n/a | Depth/life |
| SC8 | Velocity damping | scroll velocity | lerp0.1 | n/a | Anti motion-sickness |
| ST1 | Axis match-move | scroll seam | (s)cont | none | No teleport |
| ST2 | Doorway dolly | boundary/click | (t)800 | spatial | Enter a space |
| ST3 | Rack-focus handoff | boundary | (t)480 | standard | Eye-like attention |
| ST4 | Material wipe | act boundary | (t)600 | spatial | Chapter change |
| ST5 | Route transition | nav click | (t)240 | standard | Page continuity |
| ST6 | Scene preload | approaching idle | xfade240 | standard | No entry stall |
| L1 | Brand loader | app:mount | (t)≤1200 | entrance | Load as brand |
| L2 | Progress % | onProgress | %/240 | standard | Honest wait |
| L3 | Loader→hero handoff | assets ready | (t)480 | entrance | No "loaded!" cut |
| L4 | Skeletons | stream/route | loop 1.4s | linear | No CLS |
| L5 | Next-scene preload | within 1vh idle | bg | n/a | No scroll stall |
| L6 | Texture streaming | post-paint | fade240 | standard | LCP unblocked |
| L7 | Suspense poster | Suspense | xfade240 | standard | No blank canvas |
| L8 | Timeout/retry | >8s/error | instant | standard | Resilience |
| P1 | Drag-orbit | drag/keys | input+decay600 | exit | Inspect = buy |
| P2 | Auto-rotate | in-view idle | 0.15rad/s | linear | "Interactive" cue |
| P3 | Snap-back | release/blur | (t)480 | entrance | Never broken frame |
| P4 | Hotspot reveal | in-view/hover/focus | (t)240 | standard | Feature-in-context |
| P5 | Zoom-to-detail | click hotspot | (t)800 | spatial | Direct to selling detail |
| P6 | Variant swap | click swatch | (t)240 | standard | Personalization |
| P7 | Space Score fill | scroll range | (s) | none | Measurable quality |
| P8 | Vastu scan | scroll/click | (s)/(t)1200 | none/standard | Watch the moat work |
| P9 | Before/After | drag/keys | input | none | Self-paced proof |
| CTA1 | Scroll cue | rest 2s | loop 1.6s | standard | Teach the input |
| CTA2 | Primary hover | over/focus | (t)120 | standard | Draw the click |
| CTA3 | Primary press | down | (t)120 | standard | Tactile confirm |
| CTA4 | Magnetic pull | pointermove radius | λ6/240 | entrance | Lower effort |
| CTA5 | Settle-into-view | scene end | (t)480 | entrance | Resolve on action |
| CTA6 | Submit success | submit:success | (t)400+480 | entrance | Reward conversion |
| CTA7 | Conversion rail | scroll>section1 | (t)240 | entrance | Action one-tap away |
| CTA8 | Lighting cue | scene rest | (t)800 | spatial | Guide by light |
| CTA9 | Secondary de-emphasis | always | n/a | n/a | One primary per view |

*Every interaction above degrades to an instant/≤150ms-opacity equivalent under `prefers-reduced-motion`, and to a static poster at T1/T0 — with identical information and an identical conversion path. Companion to the Luxe Axis 3D Website Spec v1.1, Cinematic Direction, and Interface System.*

*End of 3D interaction framework.*
