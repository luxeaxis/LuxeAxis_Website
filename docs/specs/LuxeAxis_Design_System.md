# Luxe Axis — Interface System
### "Intelligent Elegance" · Design tokens + component specs

**Companion files:** `luxe-axis.tokens.json` (canonical W3C DTCG tokens) · `LuxeAxis_3D_Website_Spec.md` v1.1 (system) · `LuxeAxis_Cinematic_Direction.md` (3D film layer). This document is the **2D interface system**: the flat, everyday UI that surrounds the cinematic 3D — buttons, cards, nav, forms, states, loading, and the one motion language that ties every interaction together.

**Design philosophy — luxury is restraint, not addition.** A premium interface earns its feeling from *precision, space, and consistency*, not from ornament. Three brand values set the bar: **Intelligent Elegance** (beauty backed by reason), **Spacefulness** (generous negative space; let elements breathe), and **Radical Transparency** (honest states — never hide loading, errors, or price). Every token and component below is judged against one question: *does this make the product clearer, calmer, and more trustworthy?* If not, it's cut.

### How to use this system
1. **Tokens are law.** Never hard-code a hex, px, duration, or easing in a component — reference a token. The three tiers cascade: **primitive** (raw values) → **semantic/theme** (roles like `surface`, `on-surface`, `accent`) → **component** (e.g. `button.primary-bg`). Components consume *semantic/component* tokens only, so re-theming (dark↔light) never touches component code.
2. **Two themes, one API.** `data-theme="dark"` (default, navy) and `data-theme="light"` (ivory, for reading-heavy pages). Components read `theme.*` tokens, so the same `<Button>` works on both.
3. **Contrast is pre-verified.** Every text/icon color pairing in the token file was computed against navy and ivory. Follow the usage rules — they are AA/AAA gates, not preferences.
4. **Accessibility & reduced-motion are built into each spec**, not appended. A component isn't "done" until its states, focus, and reduced-motion behavior pass (§4, §5).

---

## 1. Foundations

### 1.1 Token architecture (why three tiers)
```
primitive        semantic / theme            component
#0D2B4E   ──►    theme.dark.surface   ──►    card.bg-dark, nav.bg …
#C9A84C   ──►    theme.dark.accent    ──►    button.primary-bg …
```
Primitives are the palette. Semantics assign *meaning* per theme. Component tokens bind meaning to parts. This is what lets the whole product restyle from one file and keeps components theme-agnostic.

### 1.2 Color

**Primitives (brand):** navy `#0D2B4E`, navy-900 `#081B32`, navy-700 `#143A5F`, navy-600 `#1B4670`, ivory `#FCFAF5`, ivory-hi `#FFFFFF`, ivory-sunken `#F1EEE7`, gold `#C9A84C`, gold-deep `#B8860B`, gold-champagne `#E7C874`, teal `#1A7A85`, teal-bright `#4FB6C4`, ink `#111315`.

**Semantic roles (consume these, not primitives):** `surface`, `surface-deep`, `surface-raised`, `on-surface`, `on-surface-2`, `on-surface-muted`, `accent`, `accent-contrast`, `signal`, `border-subtle`, `border`, `border-strong`, `focus-ring`.

**Verified usage rules (the non-negotiables):**

| Rule | Because (measured) |
|------|--------------------|
| Body text on navy = **ivory / white / `on-surface-2` `#C3CBD6`** only | ivory 13.67:1, secondary 8.71:1 — AAA |
| Gold is **emphasis, large text, icons, interactive accent on dark** — never paragraphs | gold on navy 6.24:1 (AA, fine for large/UI); gold on ivory 2.19:1 ❌ |
| **Never gold text on ivory**; use `gold-deep` for large/icon only (3.12:1) | small gold on ivory fails |
| **Never teal `#1A7A85` as text on navy** — use `teal-bright #4FB6C4` | brand teal on navy 2.83:1 ❌; teal-bright 5.99:1 ✅ |
| Brand teal is a **fill** (white/ivory label) or **text on ivory** (4.83:1) | verified |
| Status colors switch by surface: `*-on-dark` (lighter) vs `*-on-light` (deeper) | e.g. error 5.54:1 on navy / 6.29:1 on ivory |
| Primary button = gold fill + **ink** label | ink on gold 8.15:1 AAA |
| State is **never color-only** — pair with icon, underline, or text | color-blind safety |

**Metallic gold gradient** (`color.gradient.gold-metallic`) is decorative only — logo, hero, large brand moments. Never on body text or small UI (it smears and fails contrast at small sizes).

### 1.3 Typography

**Families:** **Playfair Display** (display/headlines — the editorial, luxury voice), **Inter** (UI/body — screen legibility), **Noto Serif/Sans Tamil** (bilingual mirror), monospace for prices/calculator (tabular figures). Self-host via `next/font`, `display:swap`, subset latin+tamil, ≤130KB, preload Playfair 600 + Inter 400 only.

**Scale (composite `typography.*` tokens, fluid `clamp()`):** `display` → `h1` → `h2` (Playfair) · `h3` (Inter 600) · `body-lg` / `body` / `small` (Inter) · `overline` (uppercase eyebrow, tracked `0.04em`) · `price` (mono, tabular).

**Rules:** one `h1` per page; never skip heading levels; body line-height 1.6; max line length `68ch` (`size.measure`) for readability (Spacefulness); tracking tightens on large display (`-0.02em`) and widens on small overlines. Numerals in prices/calculators use `font-variant-numeric: tabular-nums` so figures don't jitter as they update.

### 1.4 Spacing & sizing
- **4px base grid.** Space scale `space.1–10` = 4/8/12/16/24/32/48/64/96/128. Use tokens for every padding, gap, and stack — no arbitrary values.
- **Density:** default is *comfortable* (luxury = air). Cards pad `space.6` (32), stacks gap `space.4` (16), section rhythm `space.section-y` (clamp 64→128).
- **Touch:** interactive targets ≥ `size.touch-min` (44px) even when the visual control is smaller (pad the hit area).

### 1.5 Grid & layout
- **12 columns**, max content `1280px` (`size.container`), gutter 24px desktop / 16px mobile, outer margin `space.gutter` (clamp 16→96).
- **Breakpoints:** xs 0 · sm 480 · md 768 · lg 1024 · xl 1280 (design baseline) · 2xl 1536. Mobile-first; container queries for self-contained components (cards, calculator).
- **Layout primitives** to build (so pages compose from tokens, not ad-hoc CSS): `<Stack gap>`, `<Cluster gap>`, `<Grid cols>`, `<Container>`, `<Bleed>` (full-viewport 3D section while text stays in the 12-col measure), `<Center measure>`.

### 1.6 Radii, borders & elevation
- **Radii:** inputs & glass `radius.md` (14), cards `radius.lg` (24), pills/buttons `radius.pill`, avatars `round`.
- **Borders:** hairline 1px; icon stroke 1.5px; focus 2px with 2px offset. On dark use `border-subtle/border/border-strong` (ivory at 10/16/28% alpha); on light, navy at 8/14/24%.
- **Elevation is light, not shadow, on dark.** `elevation.dark-1/2` = a 1px light border + a soft gold/navy glow (things *emerge from* the void). On light, `elevation.light-1/2` = soft navy-tinted drop shadows. Never heavy black shadows on navy — they look muddy and cheapen the surface.

### 1.7 Glassmorphism policy — *earned, not default*
Glass is powerful and overused. It ships in **exactly three places**, each with a functional reason; anywhere else, use a solid `surface-raised`.

| Allowed use | Why it earns its place |
|-------------|------------------------|
| **Header / sticky nav** | Must float over scrolling 3D + content while staying legible — translucency signals "layer above," preserves spatial continuity with the scene behind |
| **Floating overlays over the 3D canvas** (mega-menu panel, conversion rail, toasts on the hero) | They sit on live WebGL; glass keeps the scene's context visible so the overlay feels *in* the space, not pasted on top |
| **Modal scrim + dialog** | The frosted scrim keeps the page faintly visible (context/orientation) while focusing the dialog |

**The recipe (token-driven):** `background: rgba(navy,0.55)` · `backdrop-filter: blur(14px) saturate(1.1)` · `1px` `border-subtle` (a hairline of light on the top edge sells the "pane of glass") · `radius.md`. Light theme: `rgba(ivory,0.7)`, blur 14, navy hairline.

**Guardrails:** text on glass must still meet AA — if the scene behind is bright/busy, increase fill opacity or add a subtle solid plate behind the text (never let legibility depend on what's rendering behind). Always ship a **solid fallback** where `backdrop-filter` is unsupported (feature-query). On T1/reduced-data, glass degrades to solid `surface-raised`. Never stack glass on glass (blur compounds into mud).

---

## 2. Motion language — one system, applied everywhere

Motion is the single strongest signal of "polished and intentional." One vocabulary governs every moving pixel — 2D UI here, and it shares tokens with the 3D film so the whole product feels authored by one hand.

### 2.1 Principles
1. **Every motion has a job** — *orient, guide, give feedback, or express brand tone.* No motion is decorative (the same gate as the spec's five-jobs rule).
2. **Weighted, never bouncy.** Luxury motion feels like a well-damped drawer: it accelerates gently and *settles*. No springy overshoot, no elastic, no linear on anything visible.
3. **Enter slow, exit quick.** Entrances decelerate (`easing.entrance`); exits accelerate away (`easing.exit`) and are shorter — attention should land, not linger on departures.
4. **Distance is small.** Rise 16px, lift 8px, nudge 4px. Big travel reads as cheap; restraint reads as expensive.
5. **One thing leads.** In any composition, one element moves with intent and siblings follow in a `60–90ms` stagger. Never animate everything at once.
6. **Reduced-motion is a first-class path**, not a shutoff — meaning is preserved via instant state + ≤150ms opacity.

### 2.2 Motion tokens (from `duration`, `easing`, `motion`)
- **Durations:** `instant 80` · `micro 120` (hover/press/focus) · `ui 240` (menus/toggles/tooltips) · `enter 480` (entrances/expands) · `section 800` · `signature 1200`.
- **Easings:** `standard (.4,0,.2,1)` · `entrance (.16,1,.3,1)` · `exit (.4,0,1,1)` · `spatial (.65,.05,.36,1)`.
- **Distance:** `rise 16px` · `lift 8px` · `nudge 4px` · `press-scale 0.98`. **Stagger:** 60/80/90ms.

### 2.3 Standard patterns (reuse these — do not invent per-component motion)

| Pattern | Recipe | Used by |
|---------|--------|---------|
| **Enter** | opacity 0→1 + translateY `rise`→0, `enter` + `entrance` | cards, sections, list items (staggered) |
| **Exit** | opacity 1→0 + translateY 0→`-8px`, `ui` + `exit` | dismissed toasts, closing menus |
| **Hover-lift** | translateY `-lift` + elevation step + accent warm, `micro` + `standard` | cards, project tiles |
| **Press** | scale `press-scale` + inner-glow, `micro` | buttons, tappable rows |
| **Focus** | 2px focus ring fades in (`micro`); never removed without stronger cue | all interactive |
| **Underline draw** | gold underline wipes L→R, `micro` | links, nav items (also the non-color state cue) |
| **Expand/Collapse** | height/opacity, `enter` + `standard`; chevron rotates `ui` | accordions, mega-menu, FAQ |
| **Float-label** | label scales 1→0.8 & rises into border, `micro` | text fields |
| **Value tween** | number counts to target, `ui`; visual only (final value in DOM for AT) | calculator, stats |
| **Reveal (scroll)** | Enter pattern triggered in-view, once, staggered | section content |
| **Loading shimmer** | 1.4s linear sheen across skeleton (the one allowed loop) | skeletons |

### 2.4 Choreography & reduced-motion
- **Orchestration:** parent leads, children stagger `80ms`; siblings in the same visual group share one timeline (GSAP timeline or Framer Motion `staggerChildren`) so timing is consistent, not per-element guesswork.
- **Interruptibility:** motion is always interruptible — a user action mid-animation takes priority (e.g., closing a menu that's still opening). No input is ever queued behind an animation.
- **`prefers-reduced-motion: reduce`:** all transforms, parallax, scroll-scrub, count-ups, and the shimmer loop are disabled; only ≤150ms opacity fades remain. Provide a global `useReducedMotion()` hook + a CSS safety net (`* { animation:none!important; transition-duration:.001ms!important }`). Plus an in-product "Reduce motion" toggle (footer + preferences) independent of the OS.

### 2.5 Interaction → motion map (the contract)
Every interactive state resolves to a token pair so behavior is identical everywhere:

| Interaction | Duration | Easing | Distance/transform |
|-------------|----------|--------|--------------------|
| Hover (control) | `micro` | `standard` | color/opacity; `nudge` on icon |
| Hover (card) | `micro` | `standard` | `-lift` + elevation |
| Press/active | `micro` | `standard` | `press-scale` |
| Focus in/out | `micro` | `standard` | ring opacity |
| Menu/tooltip open | `ui` | `entrance` | fade + `rise` (or 8px drop) |
| Menu/tooltip close | `ui` | `exit` | fade + `-8px` |
| Element enter | `enter` | `entrance` | fade + `rise` |
| Section reveal | `section` | `entrance` | fade + `rise`, staggered |
| Route/view transition | `ui` | `standard` | cross-fade + shared-element morph |

---

## 3. Component specifications

Each spec lists: **purpose · anatomy · variants · sizes · states · tokens · motion · a11y · signature.** All components consume semantic/component tokens (theme-agnostic) and inherit the motion language (§2). States follow the global states system (§4).

### 3.1 Buttons

**Purpose.** Trigger actions; establish a strict visual hierarchy so the eye always finds the primary action (the site's whole job is to route to *Book a design audit*).

**Anatomy.** `[ leading-icon? · label · trailing-icon? ]`, pill radius, optional loading spinner replacing content.

**Variants (hierarchy is enforced — max one primary per view):**

| Variant | Fill / border | Label | Use |
|---------|---------------|-------|-----|
| **Primary** | gold `#C9A84C` fill (hover → champagne) | ink `#111315` | The single most important action (Book audit) |
| **Secondary** | transparent + 1.5px `border-strong` | `on-surface` | Alternative actions (Explore work) |
| **Tertiary / text** | none | `accent` + underline-draw | Low-emphasis inline actions |
| **Icon** | circular, `border-subtle` | icon `on-surface-2` | Compact controls (close, next) — needs `aria-label` |
| **Destructive** | transparent + `error` border/label | `error-on-*` | Rare; confirmation-gated |

**Sizes.** sm 36 / md 44 / lg 52 (`component.button.height-*`); padding-x `space.5`; gap `space.2`; icon `icon-md`. Min touch 44 (pad hit area on sm).

**States.** default · hover (fill→champagne / lift color) · focus-visible (2px `focus-ring`, 2px offset) · active (`press-scale` 0.98 + inner glow) · loading (spinner in, label→`Working…`, `aria-busy`, width locked to prevent reflow) · disabled (opacity 0.4, no pointer, `aria-disabled`) · success flash (brief check, for inline confirms).

**Motion.** Hover/press = `micro` + `standard`; icon nudges `4px` on hover; loading spinner is the only persistent motion. Reduced-motion: no scale/nudge; color state only.

**A11y.** Real `<button>` (or `<a>` when navigating); visible focus always; label is text (icon-only requires `aria-label`); loading sets `aria-busy=true` and keeps the accessible name; never rely on color alone (primary has weight, tertiary has underline).

```tsx
<Button variant="primary|secondary|tertiary|icon|destructive"
        size="sm|md|lg" loading={false} iconLeading iconTrailing
        as="button|a" href? disabled? aria-label? />
```

### 3.2 Cards

**Purpose.** Package a single idea (a project, a service tier, an intelligence feature) as a calm, scannable, tappable unit. Cards are the workhorse of the flat UI.

**Anatomy.** `media / eyebrow (overline) / title (h3) / body (small|body) / meta / action`. Optional full-card link (whole card clickable) with a nested primary action.

**Variants.**

| Variant | Notes |
|---------|-------|
| **Project card** | Media-forward (photo or 3D object at T3); title + neighbourhood/tier meta; hover-lift; opens case study |
| **Service / tier card** | Essential/Signature/Elite; price band (`price` type); inclusions list; one CTA; a "recommended" tier gets a gold hairline + overline badge |
| **Feature card** | Intelligence features (Vastu-Tech, Space Score…); icon + claim + link |
| **Stat card** | Big `price`/number (count-up) + label; for proof strips |
| **Glass card** | Only when floating over the 3D canvas (§1.7); else solid `surface-raised` |

**Sizes/layout.** Radius `lg` (24), padding `space.6`, internal gap `space.4`; media uses `radius.md` inner; grid 1/2/3-up at sm/md/lg via container queries.

**States.** default (elevation `dark-1`) · hover (`-lift` 8px + elevation `dark-2` + title color warms to accent) · focus-within (focus ring on the card when it's a link) · pressed (`press-scale`) · loading (skeleton, §3.6) · disabled/coming-soon (muted + "Soon" chip).

**Motion.** Enter pattern on scroll-in, staggered `80ms`; hover-lift `micro`. Reduced-motion: no lift/stagger; hover = border/color only.

**A11y.** One semantic link per card (avoid nested interactive traps — use a card-wide link with the action as a visual affordance, or a clear single CTA); media has `alt`; don't convey tier by color alone (label it).

```tsx
<Card variant="project|tier|feature|stat|glass" href? recommended?
      media title eyebrow meta action loading? />
```

### 3.3 Navigation

**Purpose.** Orient the visitor and keep the primary CTA always one action away, without competing with the cinematic scene.

**Components & specs.**
- **Header (glass, `nav.height` 72 → condensed 56 on scroll).** Left: logo (`logo-horizontal`, condenses to `mark`). Center/right: ≤5 top items + one **Book Audit** primary button held far right. Glass recipe from §1.7; `z-index.header`. Condense on scroll >80px (`ui`, height + blur only — no layout shift of content).
- **Mega-menu.** Opens on hover *and* focus (desktop) / tap (touch); DOM/HTML panel (not 3D) for speed + a11y; sub-items in columns + one featured proof link + one live thumbnail. Expand pattern (`ui`, fade + 8px drop, items stagger 60ms). Full keyboard: arrow-key roving, `Esc` closes and returns focus, focus trap while open.
- **Mobile sheet.** Hamburger → full-screen sheet slides up (`enter`, `entrance`); thumb-reachable accordion; sticky **Book Audit** bar pinned to bottom safe-area; body scroll-locked while open.
- **Breadcrumbs.** On deep pages (portfolio/journal); `nav[aria-label="Breadcrumb"]`, `BreadcrumbList` JSON-LD.
- **Scroll-progress bead.** Thin gold bead on an axis rail (ties to the 3D film); reduced-motion → static thin bar.
- **Language switch (EN/தமிழ்).** Utility top-right; persists via cookie; updates `lang` + `hreflang`; cross-fade label (`micro`).
- **Footer.** Full sitemap, trust row (CIN/GST/DPDPA/privacy), Design Club opt-in, WhatsApp, address, social, logo-primary + tagline, and the "Reduce motion" toggle.

**States.** link: default `on-surface-2` → hover/focus `on-surface` + underline-draw; current page: gold underline persistent + `aria-current="page"`.

**A11y.** `<nav>` landmarks with labels; skip-to-content link first in tab order; menus operable by keyboard with `Esc`/arrow support; focus returns to trigger on close; the primary CTA reachable within one action on mobile.

### 3.4 Forms

**Purpose.** Convert. Forms are where trust is won or lost — especially the two-step **Book Audit** form and the **Fee Calculator**. Radical Transparency means honest, immediate, human-toned feedback.

**Field anatomy.** `label (float) / control / helper|error / optional counter`. Height `control-lg` (52), radius `md`, padding-x `space.4`, subtle fill `rgba(ivory,0.04)` on dark, 1px `border` → focus `gold` 2px, error `error-on-dark`.

**Controls covered.** Text/email/tel, textarea (auto-grow), select (custom, keyboard-complete), combobox/autocomplete (location), radio & checkbox (custom 20px, gold check, 44px hit), toggle/switch, segmented control (tiers), slider (calculator; keyboard + `aria-valuenow`), stepper, file upload (drag+click, progress), date/time (audit scheduling).

**Validation model.**
- **When:** validate on blur and on submit — never keystroke-by-keystroke red (hostile). Show success (green check) on valid blur for high-stakes fields.
- **How:** inline message below field + icon + `aria-invalid` + `aria-describedby`; on submit, a summary at top links to each error; focus moves to first error.
- **Tone:** plain, specific, kind — "Enter a phone number we can reach you on," not "Invalid input." No forbidden superlatives; never blame the user.
- **Copy source:** Zod schema messages centralized; bilingual.

**Signature patterns.**
- **Book Audit (2-step):** Step 1 project basics (type, location, budget band, timeline) → Step 2 contact + preferred time + WhatsApp/Zoom (NRI). Progress indicator; step transitions use Enter/Exit; never lose entered data on back; posts to Space OS lead queue with UTM.
- **Fee Calculator:** inputs drive a live `price` value (value-tween, `ui`) + a gold bead on the axis; results in DOM immediately; fully keyboard-operable; the DOM-first star interaction (spectacle minimal).

**States (every field).** default · focus (float-label + 2px gold ring) · filled · error (border + message + icon) · success (check) · disabled (0.4) · read-only · loading (async validation spinner in-field).

**Motion.** Float-label `micro`; error message slides in `ui` + `entrance`; success check draws `ui`. Reduced-motion: label/message appear instantly with icon; no draw.

**A11y.** Programmatic `<label for>`; required marked in text (not color/asterisk alone); errors linked via `aria-describedby`; logical tab order; 44px targets; autocomplete attributes; visible focus; the form must complete with keyboard only and with no JS-motion.

```tsx
<Field label name type help error success required disabled
       value onChange /> // renders label+control+message, wires aria-*
<Fieldset legend> … </Fieldset>
<FormStep index of total title> … </FormStep>
```

### 3.5 Feedback & status

**Purpose.** Tell the truth about what's happening — the visible half of Radical Transparency. Never leave an action unacknowledged.

| Component | Spec | Motion | A11y |
|-----------|------|--------|------|
| **Toast** | Bottom-right, glass, ≤3 stacked, auto-dismiss 5s (pausable on hover/focus), manual close | Slide-in `ui`+`entrance`; exit `ui`+`exit` | `role="status"` (polite) / `role="alert"` for errors; never sole channel for critical info |
| **Inline alert** | In-flow banner: success/warning/error/info; icon + title + body + optional action; per-surface status color | Enter pattern | `role="alert"` for errors; icon + text (not color alone) |
| **Badge / chip** | Status/tier/filter; pill; `overline` type; removable chips have a 44px hit close | Micro press | Text label; if dismissible, `aria-label` on close |
| **Tooltip** | Short hint on hover *and* focus; 240ms open delay, 0 close; glass; max ~240px | `ui` fade + 4px | `aria-describedby`; never contains essential-only info or interactive content |
| **Modal / dialog** | Centered; glass scrim (keeps context faintly visible); focus-trapped; `Esc` + scrim-click close; body scroll-lock | Scrim fade `ui`; panel fade + `rise` `enter` | `role="dialog" aria-modal`; focus to first element in, return to trigger out |
| **Popover / sheet** | Anchored panel (filters, language, share) | Expand pattern | Roving focus, `Esc` closes |
| **Empty state** | Line-art motif (logo vignette icons) + one sentence + one action; never a dead end | Enter pattern | Meaningful heading + actionable text |

**Global rule:** feedback appears within 100ms of the action; destructive actions are confirmation-gated; success is shown, not assumed.

### 3.6 Loading sequences

**Purpose.** Make waiting feel intentional and fast. Perceived performance is a luxury cue — jank reads as cheap. Match the loader to the wait.

| Wait type | Pattern | Spec |
|-----------|---------|------|
| **Initial app load** | **Brand loader** — the logo `mark` interior line-art draws on, then dimensionalizes into the hero (ties to spec G2). ≤1.2s; if assets aren't ready, hold on the drawn mark, never a naked spinner | One-shot; reduced-motion → static logo, no draw |
| **Content blocks (SSR/ISR streaming)** | **Skeletons** matched to final layout (card, list, media); shimmer sheen 1.4s | Prevents CLS (reserve final dimensions); the one allowed looping motion; off in reduced-motion (static muted blocks) |
| **In-component async** (button submit, field validation) | **Inline spinner** replacing the control's content; width locked | `aria-busy`; label → "Working…" |
| **Route / view transition** | Cross-fade + shared-element morph over the persistent canvas; incoming LCP element prioritized | `ui`; never block interaction >300ms |
| **Long / determinate** (file upload, report gen) | **Progress bar** with real percentage + step label; gold fill on the axis rail | `role="progressbar"` + `aria-valuenow`; honest %, never fake |
| **Optimistic** (add to moodboard, subscribe) | Apply UI immediately, reconcile on response, roll back with a toast on failure | Announce failure via `role="alert"` |

**Rules.** Choose the *lightest* loader that's honest: skeletons for layout-shaped waits, spinners only for indeterminate in-place waits, progress for determinate. Never show a spinner for <300ms (flash) — use `instant` state instead. Never a full-screen spinner after the first paint. Every loader has a **timeout → friendly error + retry**, never an infinite spin.

### 3.7 Micro-interactions catalog

Small, deliberate details that make the product feel considered. **Each is listed with its Job and reduced-motion fallback** — the same discipline as the 3D layer. If a micro-interaction has no job, it isn't built.

| Micro-interaction | Behavior | Job | Reduced-motion |
|-------------------|----------|-----|----------------|
| **Button icon nudge** | Trailing arrow shifts `nudge` 4px on hover | *Guide* — implies forward motion toward the action | No shift; color only |
| **Link underline draw** | Gold underline wipes L→R on hover/focus | *Feedback* + the non-color affordance | Instant underline on focus |
| **Card title warm** | Title color eases to `accent` on card hover | *Feedback* — confirms the whole card is live | Instant color |
| **Float label** | Label rises into the field border on focus/fill | *Feedback* + keeps label persistent (usability) | Instant position |
| **Value tween** | Price/stat counts to target | *Guide* — draws the eye to a credibility number | Final value shown at once |
| **Calculator bead** | Gold bead slides the axis as estimate updates | *Feedback* — makes transparent pricing feel responsive | Bead jumps to position |
| **Copy-confirm** | "Copied" check replaces icon 1.2s (share, email) | *Feedback* — confirms an invisible action | Text swap, no draw |
| **Toggle thumb** | Switch thumb slides; track color eases | *Feedback* | Instant state |
| **Chip select** | Filter chip fills + tiny check draws on select | *Feedback* | Instant fill + icon |
| **Nav condense** | Header shrinks + gains glass on scroll | *Orient* — reclaims space, keeps CTA present | Instant state swap |
| **Focus ring bloom** | Ring fades in over `micro` | *Feedback* + a11y (visible focus) | Instant ring |
| **Pull-to-refresh (mobile)** | Logo mark rotates a few degrees under tension | *Feedback* + brand tone | Standard native indicator |

**Sound & haptics:** none by default (luxury restraint + accessibility). Optional subtle mobile haptic on primary submit only, respecting OS settings.

---

## 4. Global states system

Every interactive component implements the same state set so behavior is predictable everywhere. If a component can enter a state, it must be *designed* for it — no "undefined" states.

| State | Visual rule | Notes |
|-------|-------------|-------|
| **Default** | Semantic `surface`/`on-surface` | — |
| **Hover** | +1 elevation or color warm; `micro`+`standard` | Pointer only; never the sole affordance (touch has none) |
| **Focus-visible** | 2px `focus-ring` + 2px offset | Keyboard; never removed; distinct from hover |
| **Active/pressed** | `press-scale` 0.98 + inner glow | `micro` |
| **Selected/current** | Gold hairline/underline + `aria-current`/`aria-selected` | Not color-only |
| **Disabled** | opacity `0.4`, no pointer events, `aria-disabled` | Keep readable; explain *why* nearby if non-obvious |
| **Loading** | Skeleton or in-place spinner; `aria-busy` | Lock dimensions to prevent CLS |
| **Empty** | Motif + sentence + action | Never a blank/dead end |
| **Error** | `error-on-*` border/message + icon + `role="alert"` | Actionable, kind copy |
| **Success** | `success-on-*` + check | Show, don't assume |
| **Read-only** | Muted fill, no focus ring on the control | Distinct from disabled |

---

## 5. Accessibility (baked into every component)

WCAG 2.2 AA is the floor, not a feature. Per-component specs above already encode this; the cross-cutting rules:
- **Contrast pre-verified** for all text/icon pairings (§1.2 table + token descriptions). Non-text UI (borders, focus, icons) ≥ 3:1.
- **Keyboard-complete:** every action reachable and operable without a pointer; logical tab order; `Esc` closes layers; focus trapped in modals and returned on close; skip-link first.
- **Visible focus** always (`focus-ring`, 2px + offset), distinct from hover.
- **Targets ≥ 44px**; spacing prevents mis-taps.
- **Never color-only:** pair with icon/text/underline/weight (color-blind safety).
- **Motion:** full `prefers-reduced-motion` parity + in-product toggle; nothing flashes >3×/s.
- **Screen readers:** semantic elements first; `aria-*` only to fill gaps; live regions for toasts/errors; animated numbers expose final value in DOM.
- **Bilingual:** `lang` per locale; Tamil font coverage; verify line-height for taller Tamil glyphs; never machine-translate UI strings.
- **Testing gate:** `axe` 0 serious/critical per component (Storybook + Playwright), plus manual keyboard + VoiceOver/NVDA on the six key templates.

---

## 6. Delivery & handoff

**Files.** `luxe-axis.tokens.json` (canonical) → build to `tokens.css` (CSS custom properties, `:root` + `[data-theme="light"]`) and `tailwind.config.ts` via **Style Dictionary** (single source → CSS + TS + native later). Components consume CSS variables, never raw values.

**Naming.** Token path = CSS var: `theme.dark.surface` → `--surface`; `component.button.primary-bg` → `--btn-primary-bg`. Tailwind maps semantic tokens to utilities (`bg-surface`, `text-on-surface`, `rounded-lg`, `shadow-dark-1`, `duration-ui`, `ease-entrance`).

**Component library.** Build in React + TypeScript, documented in **Storybook** with every variant × state × theme × locale rendered, plus an a11y addon and a "reduced-motion" toolbar toggle. Each component ships: spec (this doc), stories, unit + a11y tests, and a usage snippet.

**Build order (matches the spec's phases).** tokens → `tokens.css`/tailwind → primitives (`Button`, `Link`, `Field`, `Icon`) → layout primitives (`Stack`/`Grid`/`Container`/`Bleed`) → `Card` family → `Nav` (header/mega/mobile/footer) → form patterns (Book Audit, Calculator) → feedback (toast/alert/modal/tooltip) → loading (brand loader/skeletons/progress) → micro-interactions pass. Ship each behind the a11y + reduced-motion gates before layering the 3D/cinematic system on top.

**Definition of done (per component):** all states designed & built · tokens only (no hard-coded values) · keyboard + SR pass · `axe` clean · reduced-motion parity · both themes · both locales · Storybook stories complete.

*Companion to `luxe-axis.tokens.json`. End of interface system.*
