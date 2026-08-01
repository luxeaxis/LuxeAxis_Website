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
    summary: 'Offices designed around how the space is actually used, and measured afterwards.',
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
    summary: 'Rooms that route people well and hold up to being used hard, every day.',
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
