import type { Metadata } from 'next';
import { Container, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Grid } from '@/components/layout';
import { ProjectCard } from '@/components/Card';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFeaturedProjects } from '@/lib/content/source';

const ROUTE = '/portfolio';

export const metadata: Metadata = {
  title: 'Portfolio — Luxe Axis',
  description: 'Completed interior projects in Chennai, published with the client’s consent.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/portfolio` (Spec §2.2). The index only — Build Backlog T-16's filters and
 * `/portfolio/[slug]` case studies wait for content.
 *
 * Shipped empty because it is linked from the header nav, the footer and the
 * home page's persona router, and a 404 on the studio's own work is a worse
 * answer than "not published yet".
 *
 * The blocker is not design effort. `Project` in Spec §2.4 carries a
 * `consentStatus` field precisely because a client's home is not the studio's
 * to publish by default, and Landing Blueprint §3.3 requires real photography
 * rather than renders ("a render of a real project reads as *less* trustworthy
 * than the photograph"). Both are content decisions somebody else has to make.
 *
 * No filter bar either: filtering an empty set is a control that does nothing,
 * and its facets (category, neighbourhood, tier) can only be derived from
 * projects that exist. It lands with the first ones.
 */
export default async function PortfolioPage() {
  const projects = await getFeaturedProjects();

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={8}>
          <Stack gap={4} className="max-w-measure">
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
              The work
            </p>
            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
              Projects we have finished
            </h1>
            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
              Real photography of real homes, published once the people who live in them have
              agreed to it.
            </p>
          </Stack>

          {projects.length === 0 ? (
            <EmptyState
              icon="layers"
              title="Case studies are being prepared"
              body="We publish a project only with the client’s consent and with real photography rather than renders, which takes longer than putting up a gallery. Ask us about work like yours and we will walk you through it directly."
              headingAs="h2"
              action={
                <Button as="a" href="/book-audit" variant="secondary">
                  Book an audit
                </Button>
              }
            />
          ) : (
            <Grid cols={3} gap={5}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  title={project.title}
                  neighbourhood={project.neighbourhood}
                  tier={project.tier}
                  media={{ kind: 'photo', ...project.image }}
                />
              ))}
            </Grid>
          )}
        </Stack>
      </Container>

      <CTASection />
    </main>
  );
}
