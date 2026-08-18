import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/seo/hreflang';
import { CareersClient } from '@/components/CareersClient';

const ROUTE = '/careers';

export const metadata: Metadata = {
  title: 'Careers & Culture | Shape the Future of Luxury Architecture & Vastu-Tech | Luxe Axis',
  description:
    'Explore career opportunities at Luxe Axis Chennai. Join an elite studio of principal architects, computational Vastu researchers, 3D artists, and project execution engineers.',
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'Careers & Culture | Luxe Axis Architecture & Vastu-Tech Studio',
    description:
      'Join India’s premier luxury architectural design & Vastu-Tech studio in Chennai. Explore open roles, culture pillars, and comprehensive benefits.',
    url: canonicalFor(ROUTE).canonical,
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
