import { useTranslations } from 'next-intl';
import { SceneSlot } from '@/components/SceneSlot';
import { alternatesFor } from '@/lib/seo/hreflang';
import type { Locale } from '@/lib/i18n/published';

// generateMetadata, not a static `metadata` export: a static object is shared by
// every locale, so /ta would canonicalise to the English URL and be dropped as a
// duplicate.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { alternates: alternatesFor('/', locale as Locale) };
}

export default function HomePage() {
  const t = useTranslations('hero');
  return (
    <main id="main" tabIndex={-1}>
      <SceneSlot id="hero">
        <h1>{t('headline')}</h1>
      </SceneSlot>
    </main>
  );
}
