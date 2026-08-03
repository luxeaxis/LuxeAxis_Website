import { describe, expect, it } from 'vitest';
import {
  ProjectCmsSchema,
  TierCmsSchema,
  CalculatorConfigCmsSchema,
  fetchCmsTiers,
  fetchCmsFaqs,
  fetchCmsGuarantees,
  fetchCmsCalculatorConfig,
} from '@/lib/cms';

describe('CMS Schema & Data Layer (T-12)', () => {
  it('validates ProjectCmsSchema against valid payload', () => {
    const validProject = {
      slug: 'poes-garden',
      title: 'Poes Garden Sanctuary',
      neighbourhood: 'Poes Garden, Chennai',
      tier: 'Signature',
      image: {
        src: '/posters/hero.avif',
        alt: 'A finished living room in Poes Garden',
        aspect: '16/9',
      },
    };

    const parsed = ProjectCmsSchema.parse(validProject);
    expect(parsed.slug).toBe('poes-garden');
    expect(parsed.tier).toBe('Signature');
  });

  it('rejects ProjectCmsSchema with missing required fields', () => {
    const invalidProject = {
      slug: 'test',
      title: 'Test',
    };

    expect(() => ProjectCmsSchema.parse(invalidProject)).toThrow();
  });

  it('fetches and validates CMS tiers', async () => {
    const tiers = await fetchCmsTiers();
    expect(tiers.length).toBeGreaterThan(0);
    for (const tier of tiers) {
      expect(TierCmsSchema.parse(tier)).toBeDefined();
    }
  });

  it('fetches and validates CMS FAQs', async () => {
    const faqs = await fetchCmsFaqs();
    expect(faqs.length).toBeGreaterThan(0);
  });

  it('fetches and validates CMS Guarantees', async () => {
    const guarantees = await fetchCmsGuarantees();
    expect(guarantees.length).toBeGreaterThan(0);
  });

  it('fetches and validates CMS Calculator Config', async () => {
    const config = await fetchCmsCalculatorConfig();
    expect(config).not.toBeNull();
    if (config) {
      const parsed = CalculatorConfigCmsSchema.parse(config);
      expect(parsed.brackets.length).toBeGreaterThan(0);
    }
  });
});
