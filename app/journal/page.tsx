import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Faq } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFaqs } from '@/lib/content/source';

const ROUTE = '/journal';

export const metadata: Metadata = {
  title: 'Journal & Spatial Intelligence Insights | Luxe Axis Chennai',
  description:
    'Essays and architectural guides from our senior studio team on designing, pricing, Vastu spatial planning, and building luxury interiors in Chennai.',
  alternates: canonicalFor(ROUTE),
};

export default async function JournalPage() {
  const faqs = await getFaqs();
  const journalFaqs = [...faqs].filter((f) => f.id === 'materials' || f.id === 'contractors' || f.id === 'abroad');

  const highlights = [
    { title: 'Spatial Design', desc: 'Ergonomics & Layout Principles' },
    { title: 'Vastu Engineering', desc: 'Solar Compass Alignment' },
    { title: 'Material Science', desc: 'BWP Ply & Blum Hardware' },
    { title: 'Pricing BOQ', desc: 'Transparent Cost Guides' },
    { title: 'Chennai Living', desc: 'Coastal Climate Durability' },
  ];

  const articles = [
    {
      slug: 'vastu-tech-spatial-guide',
      category: 'Vastu Engineering',
      date: 'Aug 2026',
      readTime: '6 min read',
      title: 'The Architectural Guide to Vastu-Tech: Solar Alignment for Chennai Homes',
      excerpt:
        'How ancient Vastu orientation mapped to solar compass vectors eliminates dead zones and optimizes natural light in modern 3BHK and 4BHK apartments.',
      image: '/images/hero/hero-slide-1.jpg',
    },
    {
      slug: 'bwp-plywood-vs-commercial-ply',
      category: 'Material Science',
      date: 'Jul 2026',
      readTime: '8 min read',
      title: 'BWP Marine Plywood vs Commercial Ply: What Every Homeowner Must Know',
      excerpt:
        'Why IS:710 Boiling Water Proof marine plywood is essential for Chennai coastal humidity and preventing kitchen cabinet swelling.',
      image: '/images/hero/hero-slide-2.jpg',
    },
    {
      slug: 'chennai-interior-cost-breakdown',
      category: 'Pricing Transparency',
      date: 'Jul 2026',
      readTime: '7 min read',
      title: 'How to Estimate Your Chennai Home Interior Budget (Essential vs Signature)',
      excerpt:
        'A comprehensive cost breakdown of carpet area rates, Blum soft-close joinery, acrylic finishes, and itemized BOQ contracts.',
      image: '/images/hero/hero-slide-3.jpg',
    },
    {
      slug: 'nri-remote-home-supervision',
      category: 'NRI Remote',
      date: 'Jun 2026',
      readTime: '5 min read',
      title: 'NRI Remote Home Design: How to Monitor Villa Construction Overseas',
      excerpt:
        'Using 4K Space OS daily live feeds, timezone-matched video reviews, and digital escrow milestone releases for zero-leave execution.',
      image: '/images/hero/hero-slide-4.jpg',
    },
    {
      slug: '45-day-handover-factory-prefabrication',
      category: 'Spatial Design',
      date: 'May 2026',
      readTime: '6 min read',
      title: 'The 45-Day Handover Guarantee: How Factory Manufacturing Prevents Delays',
      excerpt:
        'How precision German CNC joinery pre-fabrication cuts on-site civil disruption and guarantees on-time key handover.',
      image: '/images/hero/hero-slide-1.jpg',
    },
    {
      slug: 'coastal-humidity-interior-finishes',
      category: 'Chennai Living',
      date: 'Apr 2026',
      readTime: '7 min read',
      title: 'Designing for Coastal Humidity: Anti-Rust Hardware & Mold-Resistant Finishes',
      excerpt:
        'Selecting marine grade BWP cores, PU lacquers, and stainless steel fittings engineered for Chennai’s saline air.',
      image: '/images/hero/hero-slide-2.jpg',
    },
  ];

  const comparisons = [
    {
      feature: 'Author Expertise',
      generic: 'Freelance SEO copywriters & AI text generators',
      luxeaxis: 'Senior interior architects with 8+ years field experience',
    },
    {
      feature: 'Cost & Rate Data',
      generic: 'Vague promises and outdated generic estimates',
      luxeaxis: 'Real itemized BOQ rate card breakdowns for Chennai',
    },
    {
      feature: 'Climate Specificity',
      generic: 'Generic Western layout advice ignoring monsoon humidity',
      luxeaxis: 'Tested for Chennai coastal humidity and saline air',
    },
    {
      feature: 'Cultural Alignment',
      generic: 'Dismisses Vastu Shastra or treats it as superstition',
      luxeaxis: 'Vastu-Tech solar compass integration for modern layouts',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Journal & Spatial Intelligence Insights | Luxe Axis Chennai',
          description: 'Essays and architectural guides from our senior studio team.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-small text-on-surface-3">
              <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
              <span>/</span>
              <li aria-current="page" className="text-accent font-semibold">Journal</li>
            </ol>
          </nav>

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Architectural Insights & Design Intelligence
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Journal & Spatial <br />
              <span className="text-accent">Intelligence Insights</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Essays, material science analyses, and architectural guides from our senior studio team on designing, pricing, Vastu spatial planning, and building luxury interiors in Chennai.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="#featured-articles" size="lg">
                Explore Articles
              </Button>
              <Button as="a" href="/book-audit" variant="secondary" size="lg">
                Book Free Design Audit →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">12+ Guides</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Published Essays</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">Vastu-Tech</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Spatial Focus</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">Material Science</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">BWP & Hardware</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">0% Fluff</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Architect Written</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">4.9 ★</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Reader Rating</span>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Highlights Strip */}
      <section className="py-6 bg-surface-elevated/40 border-b border-border-subtle/40">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {highlights.map((item) => (
              <div key={item.title} className="p-2">
                <strong className="block font-ui text-small font-bold text-accent uppercase tracking-wider">
                  {item.title}
                </strong>
                <span className="text-[12px] text-on-surface-3 mt-0.5 block">{item.desc}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Featured Article Spotlight Card */}
      <Section
        id="featured-articles"
        eyebrow="Editor's Choice"
        title="Featured Architectural Guide"
        lede="Our flagship essay on balancing ancient Vastu spatial wisdom with modern apartment ergonomics."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-accent/20">
            <Image
              src="/images/hero/hero-slide-3.jpg"
              alt="Featured Vastu-Tech Architectural Journal Guide"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge tone="accent" icon="check">Vastu Engineering</Badge>
              <span className="text-small text-on-surface-3">Aug 2026 • 6 min read</span>
            </div>
            <h3 className="font-display text-h2 font-bold text-on-surface mb-3 leading-tight">
              The Architectural Guide to Vastu-Tech: Solar Alignment for Chennai Homes
            </h3>
            <p className="text-body text-on-surface-2 leading-relaxed mb-6">
              Discover how our studio maps solar compass vectors onto 2D CAD floorplans to optimize natural light, ventilation, and spatial energy across living rooms, kitchens, and master bedrooms.
            </p>
            <Button as="a" href="/book-audit">
              Read Guide & Book Audit →
            </Button>
          </div>
        </div>
      </Section>

      {/* 4. Articles Catalogue Grid */}
      <Section
        id="articles-grid"
        eyebrow="Studio Writing"
        title="Explore All Articles & Guides"
        lede="In-depth insights into material selections, pricing transparency, and execution."
      >
        <Grid cols={3} gap={6}>
          {articles.map((art) => (
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
                <div className="flex items-center justify-between text-overline text-on-surface-3 mb-2">
                  <span className="text-accent font-bold uppercase">{art.category}</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-2 leading-snug">
                  {art.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-6">
                  {art.excerpt}
                </p>
              </div>
              <Button as="a" href="/book-audit" variant="secondary" className="w-full justify-center">
                Read Article →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="Content Standard"
        title="Luxe Axis Journal vs Generic Interior Blogs"
        lede="How our technical architectural writing differs from outsourced marketing blog posts."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border-subtle/60 text-accent font-display text-body font-bold">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Generic Marketing Blogs</th>
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">Luxe Axis Journal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-on-surface-2">
              {comparisons.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-4 font-bold text-on-surface">{row.feature}</td>
                  <td className="py-3 px-4 text-on-surface-3">{row.generic}</td>
                  <td className="py-3 px-4 font-semibold text-accent bg-accent/5">{row.luxeaxis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6. Interactive Before & After Transformation Slider */}
      <Section
        id="transformation"
        eyebrow="Case Study Result"
        title="Featured Article Case Study"
        lede="Side-by-side makeover comparison of a Chennai 3BHK flat profiled in our Vastu-Tech guide."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{ src: '/images/hero/hero-slide-4.jpg', alt: 'Bare shell 3BHK flat before interior fit-out' }}
            afterImage={{ src: '/images/hero/hero-slide-1.jpg', alt: 'Completed luxury 3BHK residential interior in Chennai' }}
          />
        </div>
      </Section>

      {/* 7. Testimonials */}
      <Section
        id="testimonials"
        eyebrow="Reader Feedback"
        title="What Homeowners Say About Our Journal"
        lede="Feedback from homeowners who used our guides during their interior planning."
      >
        <Grid cols={2} gap={6}>
          {[
            {
              name: 'Senthil & Ramya',
              location: 'OMR, Chennai',
              quote:
                'Reading the BWP Marine Plywood guide helped us avoid cheap commercial ply that our previous contractor recommended. The technical depth of Luxe Axis articles is unmatched.',
            },
            {
              name: 'Meenakshi Sundaram',
              location: 'Anna Nagar, Chennai',
              quote:
                'The Vastu-Tech spatial guide gave us clear answers on north-east water zones. We booked a design audit immediately after reading.',
            },
          ].map((t) => (
            <div key={t.name} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <div className="flex text-accent text-small mb-3">★★★★★</div>
                <blockquote className="text-body text-on-surface-2 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <div className="pt-4 border-t border-border-subtle/50">
                <strong className="block font-display text-small font-bold text-on-surface">{t.name}</strong>
                <span className="text-overline text-accent uppercase tracking-wider">📍 {t.location}</span>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 8. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title="Journal & Insights FAQ">
        <Faq items={journalFaqs} />
      </Section>

      {/* 9. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
