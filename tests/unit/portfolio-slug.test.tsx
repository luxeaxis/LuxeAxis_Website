import { describe, expect, it } from 'vitest';
import {
  generateMetadata,
  generateStaticParams,
} from '@/app/portfolio/[slug]/page';

describe('Portfolio Case Study Page (T-16)', () => {
  it('generates static params for all featured projects', async () => {
    const params = await generateStaticParams();
    expect(Array.isArray(params)).toBe(true);
  });

  it('generates metadata for unknown project safely', async () => {
    const metadata = await generateMetadata({
      params: { slug: 'unknown-project' },
    });
    expect(metadata.title).toBe('Project Not Found — Luxe Axis');
  });
});
