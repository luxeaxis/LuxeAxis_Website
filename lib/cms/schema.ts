import { z } from 'zod';

/**
 * Zod validation schemas for CMS data objects matching lib/content/types.ts (Build Backlog T-12, Spec §2.4).
 */

export const ProjectCmsSchema = z.object({
  slug: z.string(),
  title: z.string(),
  neighbourhood: z.string(),
  tier: z.string(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
    aspect: z.string(),
  }),
});

export const TierCmsSchema = z.object({
  id: z.string(),
  name: z.enum(['Essential', 'Signature', 'Elite']),
  summary: z.string(),
  priceFrom: z.number().nullable(),
  inclusions: z.array(z.string()),
  recommended: z.boolean().optional(),
});

export const FaqCmsSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  link: z.object({ label: z.string(), href: z.string() }).optional(),
});

export const TestimonialCmsSchema = z.object({
  id: z.string(),
  quote: z.string(),
  attribution: z.object({
    name: z.string(),
    context: z.string(),
  }),
});

export const GuaranteeCmsSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  terms: z.string().nullable(),
  byTier: z.record(z.string(), z.string()).optional(),
});

export const PropertyBracketSchema = z.object({
  id: z.string(),
  label: z.string(),
  area: z.object({ min: z.number(), max: z.number().nullable() }).nullable(),
  tiers: z.array(z.enum(['Essential', 'Signature', 'Elite'])),
  projectCost: z.object({ low: z.number(), high: z.number() }),
  designFee: z.object({ low: z.number(), high: z.number() }),
});

export const CalculatorConfigCmsSchema = z.object({
  brackets: z.array(PropertyBracketSchema),
});

export type ProjectCms = z.infer<typeof ProjectCmsSchema>;
export type TierCms = z.infer<typeof TierCmsSchema>;
export type FaqCms = z.infer<typeof FaqCmsSchema>;
export type TestimonialCms = z.infer<typeof TestimonialCmsSchema>;
export type GuaranteeCms = z.infer<typeof GuaranteeCmsSchema>;
export type CalculatorConfigCms = z.infer<typeof CalculatorConfigCmsSchema>;
