import {
  ProjectCmsSchema,
  TierCmsSchema,
  FaqCmsSchema,
  TestimonialCmsSchema,
  GuaranteeCmsSchema,
  CalculatorConfigCmsSchema,
  type ProjectCms,
  type TierCms,
  type FaqCms,
  type TestimonialCms,
  type GuaranteeCms,
  type CalculatorConfigCms,
} from './schema';
import {
  getFeaturedProjects,
  getTiers,
  getFaqs,
  getTestimonials,
  getGuarantees,
  getCalculatorConfig,
} from '@/lib/content/source';

/**
 * CMS Data Layer Fetchers with Zod runtime validation (Build Backlog T-12).
 *
 * Provides typed GROQ/Sanity fetchers with fallback to seed data and Zod
 * validation against the project models.
 */

export async function fetchCmsProjects(): Promise<ProjectCms[]> {
  try {
    const rawData = await getFeaturedProjects();
    return rawData.map((project) =>
      ProjectCmsSchema.parse({
        slug: project.slug,
        title: project.title,
        neighbourhood: project.neighbourhood,
        tier: project.tier,
        image: {
          src: project.image.src,
          alt: project.image.alt,
          aspect: project.image.aspect,
        },
      }),
    );
  } catch (error) {
    console.warn('[cms] Failed to validate project data:', error);
    return [];
  }
}

export async function fetchCmsTiers(): Promise<TierCms[]> {
  try {
    const rawData = await getTiers();
    return rawData.map((tier) =>
      TierCmsSchema.parse({
        id: tier.id,
        name: tier.name,
        summary: tier.summary,
        priceFrom: tier.priceFrom,
        inclusions: [...tier.inclusions],
        recommended: tier.recommended,
      }),
    );
  } catch (error) {
    console.warn('[cms] Failed to validate tier data:', error);
    return [];
  }
}

export async function fetchCmsFaqs(): Promise<FaqCms[]> {
  try {
    const rawData = await getFaqs();
    return rawData.map((faq) =>
      FaqCmsSchema.parse({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        link: faq.link,
      }),
    );
  } catch (error) {
    console.warn('[cms] Failed to validate FAQ data:', error);
    return [];
  }
}

export async function fetchCmsTestimonials(): Promise<TestimonialCms[]> {
  try {
    const rawData = await getTestimonials();
    return rawData.map((testimonial) =>
      TestimonialCmsSchema.parse({
        id: testimonial.id,
        quote: testimonial.quote,
        attribution: {
          name: testimonial.attribution.name,
          context: testimonial.attribution.context,
        },
      }),
    );
  } catch (error) {
    console.warn('[cms] Failed to validate testimonial data:', error);
    return [];
  }
}

export async function fetchCmsGuarantees(): Promise<GuaranteeCms[]> {
  try {
    const rawData = await getGuarantees();
    return rawData.map((guarantee) =>
      GuaranteeCmsSchema.parse({
        id: guarantee.id,
        name: guarantee.name,
        summary: guarantee.summary,
        terms: guarantee.terms,
        byTier: guarantee.byTier,
      }),
    );
  } catch (error) {
    console.warn('[cms] Failed to validate guarantee data:', error);
    return [];
  }
}

export async function fetchCmsCalculatorConfig(): Promise<CalculatorConfigCms | null> {
  try {
    const rawData = await getCalculatorConfig();
    if (!rawData) return null;
    return CalculatorConfigCmsSchema.parse({
      brackets: rawData.brackets.map((b) => ({
        id: b.id,
        label: b.label,
        area: b.area ? { min: b.area.min, max: b.area.max } : null,
        tiers: [...b.tiers],
        projectCost: { low: b.projectCost.low, high: b.projectCost.high },
        designFee: { low: b.designFee.low, high: b.designFee.high },
      })),
    });
  } catch (error) {
    console.warn('[cms] Failed to validate calculator config data:', error);
    return null;
  }
}
