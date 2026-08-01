import type { IconName } from '@/components/Icon';

/**
 * The content model (Build Backlog T-12, Spec §2.4).
 *
 * ## Why these are plain TypeScript types and not Zod schemas
 *
 * T-12 specifies "GROQ + Zod validation" against Sanity, and that is right —
 * for data crossing a network boundary, where the compiler has no idea what
 * actually arrives. There is no such boundary yet: `source.ts` is in-repo
 * TypeScript, so every field is already checked at build time, and a runtime
 * validator over compile-time-known data is ceremony that can only ever fail in
 * ways `tsc` already caught.
 *
 * The seam is drawn so that changes when Sanity lands, and only then: pages call
 * the async getters in `source.ts` and never touch the data directly, so
 * swapping the body of those getters for a GROQ query — with Zod parsing at
 * exactly the point the boundary appears — needs no change in any consumer.
 * The getters are already `async` for that reason and no other.
 *
 * The invariants a type genuinely cannot express (non-empty inclusion lists,
 * alt text that carries a claim, a testimonial that names its source) are
 * asserted in `tests/unit/content.test.ts`, which is how this codebase already
 * guards the poster registry and the route lists.
 */

/** A visitor archetype from Spec §2.1, used by the home page's "Six Ways In"
 *  router to send people down the path that answers their question fastest. */
export type Persona = {
  id: string;
  /** How the visitor would describe themselves. */
  label: string;
  /** The question the spec says the site must answer fast for them. Rendered
   *  as the tile's body — it is the routing signal, so it is not decoration. */
  question: string;
  /** Where their path starts (Spec §2.1 "Primary path"). */
  href: string;
  /** Their CTA wording (Spec §2.1 "Primary CTA"). Personas differ here —
   *  a corporate visitor is not booking a home audit — so it is per-persona
   *  rather than a single site-wide string. */
  cta: string;
};

/** One of the proprietary capabilities the studio sells on (Spec §5.3–5.5,
 *  sitemap §2.2 `/intelligence/*`). */
export type IntelligenceFeature = {
  id: string;
  name: string;
  /** What it proves to a sceptical visitor — the spec states these as
   *  "Proves:" lines, which is the right register: a claim, not a feature bullet. */
  claim: string;
  href: string;
  icon: IconName;
};

/** A service tier (Spec §2.2 `/residential/*`, Design System §3.2 tier card). */
export type Tier = {
  id: string;
  name: 'Essential' | 'Signature' | 'Elite';
  /** One line on who it is for. */
  summary: string;
  /** `null` until the studio publishes real figures. Deliberately nullable
   *  rather than optional: a tier with no price is a normal, current state that
   *  every consumer has to handle, and `?` invites callers to forget. Nothing
   *  in this repo may invent a price — the whole pricing proposition is
   *  "we publish ours", and a placeholder number would be the one lie that
   *  discredits it. */
  priceFrom: number | null;
  inclusions: readonly string[];
  /** Exactly one tier may set this (Design System §3.2). */
  recommended?: boolean;
};

/** A completed project (Spec §2.4 Project). */
export type Project = {
  slug: string;
  title: string;
  neighbourhood: string;
  tier: string;
  /** Real photography only. A render standing in for a finished home reads as
   *  less trustworthy than a photograph — Landing Blueprint §3.3 is explicit
   *  that photography beats 3D for this exact content. */
  image: { src: string; alt: string; aspect: `${number}/${number}` };
};

/** A client quote (Spec §2.4 Testimonial). */
export type Testimonial = {
  id: string;
  quote: string;
  /** Attribution is required, not optional. An unattributed testimonial is
   *  indistinguishable from copywriting, and Landing Blueprint §3.5 turns on
   *  proof being documentary — "real faces, real names, real numbers". */
  attribution: { name: string; context: string };
};

/** A headline number for the proof strip (Landing Blueprint §3.5 stat band). */
export type Stat = {
  id: string;
  value: number;
  label: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

/**
 * The Fee Calculator's rate card (Spec §2.4 `CalculatorConfig`, §5.7).
 *
 * `null` from `getCalculatorConfig()` until the studio publishes real rates —
 * and the calculator renders nothing at all while it is. That is not a
 * degraded state to be filled with an approximation: §2's P2 "Show the work"
 * names "the public fee calculator" as a proof of Radical Transparency, and a
 * calculator returning invented numbers is the single most damaging thing this
 * site could ship. A visitor budgets against it.
 *
 * Rates are a BAND, not a point. A studio that has not yet seen the flat cannot
 * honestly quote a single figure, and the blueprint frames tiers as ranges
 * throughout; a precise-looking total would imply a commitment the audit has
 * not made yet.
 */
export type CalculatorConfig = {
  /** Carpet area bounds the calculator accepts, in square feet. */
  area: { min: number; max: number; step: number };
  /** Per-square-foot band for each tier, in whole rupees. */
  rates: Record<Tier['name'], { low: number; high: number }>;
  /** Rounded to this unit so the output reads as an estimate rather than a
   *  quote — ₹18,40,000 invites belief that ₹18,43,217 does not. */
  roundToNearest: number;
};
