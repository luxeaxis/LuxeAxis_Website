import type { Metadata } from 'next';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/pricing';

export const metadata: Metadata = {
  title: 'Pricing — Luxe Axis',
  alternates: canonicalFor(ROUTE),
};

export default function PricingPage() {
  return (
    <main id="main" tabIndex={-1}>
      <h1>Pricing</h1>
    </main>
  );
}
