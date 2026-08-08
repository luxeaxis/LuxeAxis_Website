import type { IconName } from '@/components/Icon';

/**
 * The three commercial verticals (Spec §2.2:
 * `/commercial/workplace`, `/commercial/retail-hospitality`,
 * `/commercial/healthcare`).
 *
 * A plain exported constant rather than an async getter, unlike everything in
 * `source.ts`. These are not CMS content — they are the studio's service lines,
 * which change at the pace of the business rather than of a content editor, and
 * each one has a route file's worth of structure behind it. If that ever stops
 * being true, moving it into `source.ts` is a two-line change.
 *
 * The `concerns` are what each sector actually fails on, which is the only
 * thing here that is not a spec quotation. They are deliberately generic
 * industry concerns rather than claims about the studio's experience: saying
 * "clinics have infection-control constraints" is a fact about clinics; saying
 * "we have delivered twelve clinics" would be a fact about the studio, and
 * nobody has told me that one.
 */
export type CommercialVertical = {
  slug: string;
  name: string;
  icon: IconName;
  summary: string;
  concerns: readonly string[];
};

export const COMMERCIAL_VERTICALS: readonly CommercialVertical[] = [
  {
    slug: 'workplace',
    name: 'Workplace',
    icon: 'gauge',
    summary:
      'Offices designed around how the space is actually used, and measured afterwards.',
    concerns: [
      'Desk and meeting-room utilisation',
      'Acoustic separation between focus and collaboration',
      'Daylight and air quality',
      'Reconfiguring as headcount changes',
    ],
  },
  {
    slug: 'retail-hospitality',
    name: 'Retail & Hospitality',
    icon: 'layers',
    summary:
      'Rooms that route people well and hold up to being used hard, every day.',
    concerns: [
      'Footfall and circulation',
      'Sightlines to what you want seen',
      'Materials that survive commercial wear',
      'Lighting that flatters food, product and people',
    ],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    icon: 'compass',
    summary: 'Clinical spaces where compliance and calm are the same problem.',
    concerns: [
      'Infection control and cleanable surfaces',
      'Accessible routes and clearances',
      'Privacy at reception and in consultation',
      'Wayfinding for anxious first-time visitors',
    ],
  },
];

/**
 * A published commercial rate (Spec §10.6 — pricing is stated openly).
 *
 * Commercial genuinely IS priced per square foot, unlike residential, which is
 * banded by property type — so this models what the studio actually publishes
 * rather than being forced into the residential shape. See
 * `lib/content/types.ts`'s `PropertyBracket` for why that distinction matters.
 *
 * Three parts, because a commercial buyer is quoted all three and finding out
 * about any of them later is how a relationship starts badly:
 *
 * - `conceptFee` — a fixed sum before per-area work begins, on the segments
 *   that carry one. Retail, restaurants and clinics do; offices do not.
 * - `perSqFt` — the build rate band.
 * - `executionMargin` — the studio's margin on execution, where one applies.
 *   Published as a number rather than folded silently into the rate, which is
 *   the whole point of the "transparent Supply-Chain Management fee" position.
 * - `designFee` — the studio's own fee, separate again.
 */
export type CommercialRate = {
  id: string;
  /** Which vertical page this belongs on. */
  vertical: string;
  label: string;
  /** Typical area. `null` where none is published. */
  area: { min: number; max: number } | null;
  /** Whole rupees, charged once before per-area work. */
  conceptFee: number | null;
  perSqFt: { low: number; high: number };
  /** A fraction — 0.15 is 15%. `null` where the segment carries none. */
  executionMargin: number | null;
  designFee: { low: number; high: number };
};

export const COMMERCIAL_RATES: readonly CommercialRate[] = [
  {
    id: 'small-office',
    vertical: 'workplace',
    label: 'Small office',
    area: { min: 500, max: 1_000 },
    conceptFee: null,
    perSqFt: { low: 100, high: 150 },
    executionMargin: 0.15,
    designFee: { low: 150_000, high: 450_000 },
  },
  {
    id: 'mid-office',
    vertical: 'workplace',
    label: 'Mid office',
    area: { min: 1_000, max: 5_000 },
    conceptFee: null,
    perSqFt: { low: 120, high: 200 },
    executionMargin: 0.15,
    designFee: { low: 300_000, high: 2_000_000 },
  },
  {
    id: 'large-office',
    vertical: 'workplace',
    label: 'Large office',
    area: { min: 5_000, max: 20_000 },
    conceptFee: null,
    perSqFt: { low: 150, high: 250 },
    // Lower than the smaller offices, and deliberately so — scale earns a
    // better rate, and publishing that is more persuasive than a flat number.
    executionMargin: 0.12,
    designFee: { low: 1_500_000, high: 10_000_000 },
  },
  {
    id: 'retail',
    vertical: 'retail-hospitality',
    label: 'Retail',
    area: { min: 300, max: 1_500 },
    conceptFee: 200_000,
    perSqFt: { low: 150, high: 250 },
    executionMargin: null,
    designFee: { low: 300_000, high: 700_000 },
  },
  {
    id: 'restaurant',
    vertical: 'retail-hospitality',
    label: 'Restaurant or café',
    // No area published for this segment — a 40-cover restaurant and a 200-cover
    // one differ more by kitchen and service design than by floor area.
    area: null,
    conceptFee: 300_000,
    perSqFt: { low: 200, high: 350 },
    executionMargin: null,
    designFee: { low: 500_000, high: 2_000_000 },
  },
  {
    id: 'clinic',
    vertical: 'healthcare',
    label: 'Clinic',
    area: null,
    conceptFee: 200_000,
    perSqFt: { low: 150, high: 300 },
    executionMargin: null,
    designFee: { low: 400_000, high: 1_800_000 },
  },
];

/** The published rates for one vertical, in the order they are listed. */
export function ratesFor(vertical: string): readonly CommercialRate[] {
  return COMMERCIAL_RATES.filter((rate) => rate.vertical === vertical);
}
