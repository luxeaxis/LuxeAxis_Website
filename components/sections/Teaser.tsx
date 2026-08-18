import { Cluster } from '../layout';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import { FeatureCard, ProjectCard, TierCard } from '../Card';
import { ToBePublished } from '../ToBePublished';
import { Section } from './Section';
import { Stagger } from '../Reveal';
import type { IntelligenceFeature, Project, Tier } from '@/lib/content/types';

/**
 * The three "teaser" blocks from the home order (Cinematic §9.1): the
 * Intelligence teaser, featured projects, and the transparent-pricing teaser.
 */

export function IntelligenceTeaser({
  features,
}: {
  features: readonly IntelligenceFeature[];
}) {
  if (features.length === 0) return null;

  return (
    <Section
      id="intelligence"
      eyebrow="See it work"
      title="The intelligence behind the space"
      lede="Four capabilities that do real work on your project — each one a claim we can show you, not a badge on a brochure."
    >
      <Stagger
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch"
        itemClassName="h-full flex flex-col"
        items={features.map((feature) => (
          <FeatureCard
            key={feature.id}
            href={feature.href}
            icon={feature.icon}
            title={feature.name}
            body={feature.claim}
            surface="glass"
            className="h-full flex flex-col justify-between"
          />
        ))}
      />
    </Section>
  );
}

export function FeaturedProjects({
  projects,
}: {
  projects: readonly Project[];
}) {
  if (projects.length === 0) {
    return (
      <Section id="work" eyebrow="The work" title="Recent Chennai projects">
        <EmptyState
          icon="layers"
          title="Case studies are being prepared"
          body="Each project is published only once the client has agreed to it, with real photography rather than renders. Ask us about work like yours in the meantime."
          headingAs="h3"
          action={
            <Button as="a" href="/book-audit" variant="secondary">
              Book an audit
            </Button>
          }
        />
      </Section>
    );
  }

  return (
    <Section id="work" eyebrow="The work" title="Recent Chennai projects">
      <Stagger
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
        items={projects.map((project) => (
          <ProjectCard
            key={project.slug}
            href={`/portfolio/${project.slug}`}
            title={project.title}
            neighbourhood={project.neighbourhood}
            tier={project.tier}
            media={{ kind: 'photo', ...project.image }}
            surface="glass"
          />
        ))}
      />
      <Cluster gap={3}>
        <Button
          as="a"
          href="/portfolio"
          variant="secondary"
          iconTrailing="arrow-right"
        >
          See the full portfolio
        </Button>
      </Cluster>
    </Section>
  );
}

export function PricingTeaser({ tiers }: { tiers: readonly Tier[] }) {
  if (tiers.length === 0) return null;

  const priced = tiers.filter(
    (tier): tier is Tier & { priceFrom: number } => tier.priceFrom !== null,
  );
  const allPriced = priced.length === tiers.length;

  return (
    <Section
      id="pricing"
      eyebrow="Radical transparency"
      title="Most Chennai studios hide the price. We publish it."
      lede="Three tiers, stated openly, with what each one includes. No quote-on-request, no discovery call before you can find out what it costs."
    >
      {allPriced ? (
        <Stagger
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          items={priced.map((tier) => (
            <TierCard
              key={tier.id}
              name={tier.name}
              price={{ amount: tier.priceFrom, period: 'onwards' }}
              inclusions={tier.inclusions}
              cta={{ label: 'See what is included', href: '/pricing' }}
              recommended={tier.recommended}
            />
          ))}
        />
      ) : (
        <Stagger
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          items={tiers.map((tier) => (
            <div key={tier.id} className="flex flex-col gap-3">
              <FeatureCard
                href="/pricing"
                icon="check"
                title={tier.name}
                body={tier.summary}
                surface="glass"
              />
              <p className="px-6 text-small">
                <ToBePublished label="Fee band" />
              </p>
            </div>
          ))}
        />
      )}
      <Cluster gap={3}>
        <Button as="a" href="/pricing" iconTrailing="arrow-right">
          See your price
        </Button>
      </Cluster>
    </Section>
  );
}
