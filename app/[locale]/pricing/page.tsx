import { alternatesFor } from '@/lib/seo/hreflang';
import type { Locale } from '@/lib/i18n/published';

// Previously exported no metadata at all, so /pricing emitted zero hreflang.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { alternates: alternatesFor('/pricing', locale as Locale) };
}

export default function PricingPage() {
  return (
    <main id="main" tabIndex={-1}>
      <h1>Pricing</h1>
    </main>
  );
}
