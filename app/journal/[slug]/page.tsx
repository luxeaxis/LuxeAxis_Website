import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container, Stack } from '@/components/layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { JsonLd } from '@/components/JsonLd';
import { canonicalFor } from '@/lib/seo/hreflang';
import { Reveal } from '@/components/Reveal';
import {
  getAllJournalArticles,
  getJournalArticleBySlug,
} from '@/lib/content/journal';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = await getAllJournalArticles();
  return articles.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getJournalArticleBySlug(params.slug);
  if (!article) {
    return {
      title: 'Article Not Found | Luxe Axis Journal',
    };
  }

  const route = `/journal/${article.slug}`;
  const title = `${article.title} | Luxe Axis Journal`;
  const description = article.excerpt;

  return {
    title,
    description,
    keywords: [
      article.category.toLowerCase(),
      'chennai interior design',
      'luxury interior architecture',
      'vastu design chennai',
      article.title.toLowerCase(),
    ],
    alternates: canonicalFor(route),
    openGraph: {
      title,
      description,
      url: canonicalFor(route).canonical,
      type: 'article',
      publishedTime: article.date,
      images: [
        {
          url: article.image || '/posters/intel-hero-vastu-tech.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.image || '/posters/intel-hero-vastu-tech.png'],
    },
  };
}

export default async function JournalArticlePage({ params }: PageProps) {
  const article = await getJournalArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const allArticles = await getAllJournalArticles();
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  // Convert raw markdown headings and paragraphs into clean semantic HTML sections
  const paragraphs = article.content
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt,
          image: [article.image],
          datePublished: article.date,
          author: {
            '@type': 'Person',
            name: article.author.name,
            jobTitle: article.author.role,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Luxe Axis',
            url: 'https://luxeaxis.in',
          },
          url: canonicalFor(`/journal/${article.slug}`).canonical,
        }}
      />

      {/* 1. Article Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <Container className="max-w-4xl">
          <Breadcrumbs path={`/journal/${article.slug}`} />

          <Stack gap={6} className="mt-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">{article.category}</Badge>
              <span className="text-small text-on-surface-muted">
                {article.date} • {article.readTime}
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-h1-font-size)] md:text-[length:var(--typography-display-font-size)] font-bold text-on-surface leading-tight tracking-tight">
              {article.title}
            </h1>

            <p className="text-body-lg text-on-surface-2 leading-relaxed font-medium">
              {article.excerpt}
            </p>

            {/* Author Byline */}
            <div className="flex items-center gap-4 pt-4 border-t border-border-subtle/50">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent flex items-center justify-center font-display font-bold text-accent">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <strong className="block font-ui text-body font-bold text-on-surface">
                  {article.author.name}
                </strong>
                <span className="text-small text-on-surface-muted">
                  {article.author.role} • Luxe Axis Design Studio
                </span>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Cover Image Banner */}
      <section className="py-8 bg-surface-deep">
        <Container className="max-w-4xl">
          <Reveal>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-accent/30 shadow-2xl">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 3. Article Content Body */}
      <article className="py-12 bg-surface-deep">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="space-y-6 text-on-surface-2 text-body leading-relaxed font-normal">
            {paragraphs.map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith('# ')) {
                return null; // Skip duplicate h1
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2
                    key={idx}
                    className="font-display text-h2 font-bold text-on-surface pt-8 pb-2 border-b border-border-subtle/40"
                  >
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3
                    key={idx}
                    className="font-display text-h3 font-bold text-accent pt-4"
                  >
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('- ')) {
                const items = trimmed
                  .split('\n')
                  .map((item) => item.replace(/^- /, ''));
                return (
                  <ul key={idx} className="space-y-2 pl-6 list-disc text-on-surface-2">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\./.test(trimmed)) {
                const items = trimmed
                  .split('\n')
                  .map((item) => item.replace(/^\d+\.\s*/, ''));
                return (
                  <ol key={idx} className="space-y-2 pl-6 list-decimal text-on-surface-2">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-body text-on-surface-2 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

            {/* In-Article Consultation Callout Box */}
            <div className="my-12 p-8 rounded-2xl lx-liquid-glass border border-accent/40 text-center space-y-4">
              <h3 className="font-display text-h3 font-bold text-on-surface">
                Plan Your Residence with Our Senior Architects
              </h3>
              <p className="text-small text-on-surface-2 max-w-xl mx-auto leading-relaxed">
                Book a complimentary 60-minute CAD floorplan review & Vastu-Tech audit at our Nungambakkam Experience Studio.
              </p>
              <Button as="a" href="/book-audit" size="lg">
                Book Free Design Audit →
              </Button>
            </div>
          </Reveal>
        </Container>
      </article>

      {/* 4. Related Articles Section */}
      {relatedArticles.length > 0 && (
        <Section
          id="related-articles"
          eyebrow="Further Reading"
          title="Related Architectural Insights"
          lede="More technical guides and material comparisons from our studio."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {relatedArticles.map((art) => (
              <div
                key={art.slug}
                className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-accent/20">
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-overline text-accent font-bold uppercase block mb-1">
                    {art.category}
                  </span>
                  <h3 className="font-display text-h4 font-bold text-on-surface mb-2">
                    {art.title}
                  </h3>
                  <p className="text-small text-on-surface-2 line-clamp-2 mb-4">
                    {art.excerpt}
                  </p>
                </div>
                <Button
                  as="a"
                  href={`/journal/${art.slug}`}
                  variant="secondary"
                  className="w-full justify-center"
                >
                  Read Guide →
                </Button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 5. Bottom CTA Section */}
      <CTASection />
    </main>
  );
}
