import { useTranslations } from 'next-intl';
import { SceneSlot } from '@/components/SceneSlot';
import { alternatesFor } from '@/lib/seo/hreflang';

export const metadata = { alternates: alternatesFor('/') };

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
