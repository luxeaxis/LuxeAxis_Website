import { useTranslations } from 'next-intl';
import { alternatesFor } from '@/lib/seo/hreflang';

export const metadata = { alternates: alternatesFor('/') };

export default function HomePage() {
  const t = useTranslations('hero');
  return (
    <main id="main" tabIndex={-1}>
      <h1>{t('headline')}</h1>
    </main>
  );
}
