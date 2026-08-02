import type { IconName } from '@/components/Icon';
import type { SceneId } from '@/three/registry';

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
  /** The scene reserved for this feature (Spec §5.3–5.5), so the page holds
   *  its slot for T-32 and upgrades poster → live with no layout change.
   *  Optional: Virtual Staging appears in the sitemap with no scene of its own. */
  sceneId?: SceneId;
  /** A paragraph on what the capability actually is. */
  summary: string;
  /** The commercial argument the spec attaches to it — its "moat". Kept
   *  separate from `claim` because they answer different questions: the claim
   *  is what it does for the visitor, this is why it is defensible. */
  proof?: string;
  /** Sub-capabilities, where the spec enumerates them. */
  highlights?: readonly string[];
  /**
   * How it works, in words.
   *
   * T-17 requires "diagrams have text-equivalent steppers", and this is that
   * equivalent — authored first rather than derived from a diagram later, so
   * the accessible version can never be the afterthought that lags behind the
   * picture. It is also §5.3's own reduced-motion fallback: "a 'See how it
   * works' text stepper replaces the scan."
   */
  steps?: readonly { title: string; body: string }[];
  /** Spec P4, "AI assists, humans decide" — §5.3 calls for a visible
   *  "reviewed by a human" chip on Vastu specifically. */
  humanInTheLoop?: string;
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
 * One row of the published price list (Spec §2.4 `CalculatorConfig`, §5.7).
 *
 * ## Why property type and not a per-square-foot rate
 *
 * The first version of this modelled a rate band multiplied by carpet area,
 * which is the obvious shape for a fee calculator and is not how the studio
 * actually prices. The published list bands TOTAL project cost by property
 * type, with the design fee as a separate figure.
 *
 * Deriving a per-square-foot rate from those bands means dividing a range by a
 * range, and the answer is uselessly wide — a 1BHK works out anywhere between
 * ~₹540 and ~₹1,500 per square foot depending which ends you pick. Shipping
 * that would have invented precision the studio never gave, in the one place a
 * visitor makes a financial decision. Area is kept as guidance for choosing the
 * right row, not as a multiplier.
 *
 * Two figures, because they answer different questions. `projectCost` is what
 * the whole job comes to; `designFee` is what the studio charges for the design
 * within it. Publishing only the first is what makes a visitor suspect the
 * second is hidden inside it.
 */
export type PropertyBracket = {
  id: string;
  /** As the studio lists it — "2BHK", "Villa". */
  label: string;
  /** Typical carpet area, for orientation. `null` upper bound means open-ended
   *  ("2,000+ sq ft"), which is exactly how the villa row is published. */
  area: { min: number; max: number | null } | null;
  /** Which tiers this property type is served by. Several rows span two. */
  tiers: readonly Tier['name'][];
  /** Whole rupees. */
  projectCost: { low: number; high: number };
  designFee: { low: number; high: number };
};

/**
 * The Fee Calculator's published price list.
 *
 * `null` from `getCalculatorConfig()` would mean no list has been published and
 * the calculator does not render at all — a calculator returning invented
 * numbers is the single most damaging thing this site could ship, because a
 * visitor budgets against it.
 */
export type CalculatorConfig = {
  brackets: readonly PropertyBracket[];
};

/** A recurring service with a published price (concierge subscriptions). */
export type Subscription = {
  id: string;
  name: string;
  summary: string;
  /** Whole rupees per month. */
  monthly: number;
  /** Whole rupees per year, where an annual rate is published. */
  yearly: number | null;
};

/** A stage of the client journey (Spec 5.8, Cinematic SCENE 07). */
export type ProcessStage = {
  id: string;
  /** The stage names are the spec's own, in its order: Discover, Audit,
   *  Concept, Approve, Build, Handover, Concierge. */
  name: string;
  body: string;
  /** The guarantee attached to this stage, where one is. */
  guaranteeId?: string;
};

/**
 * A published commitment (Spec 10.6).
 *
 * `terms` was nullable because the specs named both guarantees and stated
 * neither set of conditions. The studio has since published them, so a
 * guarantee that still carries `null` is one whose conditions genuinely are not
 * written — and it renders as an explicit gap rather than a silent omission,
 * because a guarantee is a contractual promise and its conditions are the part
 * that binds.
 */
export type Guarantee = {
  id: string;
  name: string;
  summary: string;
  terms: string | null;
  /** Where the commitment differs by tier — the timeline guarantee is 45 days
   *  on Essential, 60 on Signature and milestone-based on Elite, so a single
   *  headline figure would misstate two of the three. */
  byTier?: Partial<Record<Tier['name'], string>>;
};

/** An NRI region with its own landing page (Spec 2.2). */
export type NriRegion = {
  slug: string;
  name: string;
  /** An IANA zone, not a fixed offset — offsets change twice a year in several
   *  of these regions and a hard-coded one would be wrong half the time. */
  timeZone: string;
};

/** A question a visitor actually asks (Landing Blueprint 3.7). */
export type Faq = {
  id: string;
  question: string;
  answer: string;
  /** Where to go next, per 3.7's "each answer ends with a soft CTA link". */
  link?: { label: string; href: string };
};
