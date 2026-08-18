import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Stack, Grid } from '@/components/layout';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFeaturedProjects, getProjectBySlug } from '@/lib/content/source';

type PortfolioSlugPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const projects = await getFeaturedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PortfolioSlugPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return {
      title: 'Project Not Found — Luxe Axis',
    };
  }

  const route = `/portfolio/${project.slug}`;
  return {
    title: `${project.title} — Portfolio | Luxe Axis`,
    description: `Detailed interior design case study for ${project.title} in ${project.neighbourhood}.`,
    alternates: canonicalFor(route),
  };
}

/**
 * `/portfolio/[slug]` Case Study Detail Page (Build Backlog T-16, Spec §2.2).
 */
export default async function PortfolioSlugPage({
  params,
}: PortfolioSlugPageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={8}>
          <Breadcrumbs path={`/portfolio/${project.slug}`} />

          <Stack gap={4} className="max-w-measure">
            <div className="flex items-center gap-3">
              <Badge tone="accent">{project.tier} Tier</Badge>
              <span className="font-ui text-small text-on-surface-2">
                {project.neighbourhood}
              </span>
            </div>
            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
              {project.title}
            </h1>
          </Stack>

          {/* Interactive Before/After Renovation Comparison */}
          <section aria-label="Renovation Comparison">
            <Stack gap={4}>
              <h2 className="font-display text-[length:var(--typography-h2-font-size)] text-on-surface">
                Before & After Transformation
              </h2>
              <BeforeAfterSlider
                beforeImage={
                  project.beforeImage ?? {
                    src: '/posters/portfolio-chennai-residence-before.png',
                    alt: `Original space of ${project.title} before renovation in ${project.neighbourhood}`,
                  }
                }
                afterImage={{ src: project.image.src, alt: project.image.alt }}
                aspect={project.image.aspect}
              />
            </Stack>
          </section>

          {/* Case Study Overview Grid */}
          <Grid cols={3} gap={6}>
            <div className="col-span-2 rounded-lg border border-border-subtle bg-surface-deep p-6">
              <Stack gap={3}>
                <h3 className="font-display text-h3 text-on-surface">
                  Project Highlights
                </h3>
                <p className="text-on-surface-2">
                  Designed according to the client’s spatial requirements with
                  custom Vastu-Tech layout verification and transparent
                  supply-chain sourcing under the {project.tier} tier
                  specifications.
                </p>
              </Stack>
            </div>

            <div className="rounded-lg border border-border-subtle bg-surface-deep p-6">
              <Stack gap={4}>
                <h3 className="font-display text-h3 text-on-surface">
                  Case Study Specs
                </h3>
                <div className="space-y-2 font-ui text-small">
                  <div className="flex justify-between border-b border-border-subtle pb-2">
                    <span className="text-on-surface-2">Location</span>
                    <span className="font-semibold text-on-surface">
                      {project.neighbourhood}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border-subtle pb-2">
                    <span className="text-on-surface-2">Tier Level</span>
                    <span className="font-semibold text-on-surface">
                      {project.tier}
                    </span>
                  </div>
                </div>
                <Button
                  as="a"
                  href="/book-audit"
                  variant="primary"
                  className="w-full"
                >
                  Discuss Your Space
                </Button>
              </Stack>
            </div>
          </Grid>
        </Stack>
      </Container>

      <CTASection />
    </main>
  );
}
