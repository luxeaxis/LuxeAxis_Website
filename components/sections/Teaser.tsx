import { Cluster, Grid } from '../layout';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import { FeatureCard, ProjectCard, TierCard } from '../Card';
import { ToBePublished } from '../ToBePublished';
import { Section } from './Section';
import type { IntelligenceFeature, Project, Tier } from '@/lib/content/types';

/**
 * The three "teaser" blocks from the home order (Cinematic §9.1): the
 * Intelligence teaser, featured projects, and the transparent-pricing teaser.
 *
 * Kept in one file because they are one pattern — section frame, a grid of the
 * card the content type already has, one CTA onward — and splitting them into
 * three near-identical modules would make the shared shape harder to see, not
 * easier. Each still exports separately so the home page reads as a list of
 * named sections.
 *
 * All three follow the same rule as `ProofStrip`: render nothing rather than
 * render placeholder content.
 */

/** Intelligence teaser — links to §5.3/5.4/5.5. Claims come from each scene's
 *  "Proves:" line, which is the right register: these are assertions the studio
 *  has to stand behind, not feature bullets. */
export function IntelligenceTeaser({ features }: { features: readonly IntelligenceFeature[] }) {
  if (features.length === 0) return null;

  return (
    <Section
      id="intelligence"
      eyebrow="See it work"
      title="The intelligence behind the space"
      lede="Four capabilities that do real work on your project — each one a claim we can show you, not a badge on a brochure."
    >
      <Grid cols={4} gap={5}>
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            href={feature.href}
            icon={feature.icon}
            title={feature.name}
            body={feature.claim}
          />
        ))}
      </Grid>
    </Section>
  );
}

/**
 * Featured projects. Empty until real, consented case studies exist — `Project`
 * in Spec §2.4 carries a `consentStatus` field precisely because a client's
 * home is not the studio's to publish by default.
 *
 * Landing Blueprint §3.3 is also explicit that this content is photographic:
 * "don't render the finished home in 3D where a real photo exists; a render of
 * a real project reads as *less* trustworthy than the photograph."
 */
export function FeaturedProjects({ projects }: { projects: readonly Project[] }) {
  if (projects.length === 0) {
    return (
      <Section id="work" eyebrow="The work" title="Recent Chennai projects">
        {/* Named as pending rather than hidden. A studio with no visible work
            looks like a studio with no work; saying the case studies are being
            prepared is both true and a better answer than an empty page.
            Deliberately shows no project, no photograph and no neighbourhood —
            a plausible-looking sample project would be a fabricated case study
            about a client who does not exist. */}
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
    <Section
      id="work"
      eyebrow="The work"
      title="Recent Chennai projects"
    >
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
      <Cluster gap={3}>
        <Button as="a" href="/portfolio" variant="secondary" iconTrailing="arrow-right">
          See the full portfolio
        </Button>
      </Cluster>
    </Section>
  );
}

/**
 * The pricing teaser — the transparency weapon (Landing Blueprint §3.6).
 *
 * Renders the tiers WITHOUT figures while `priceFrom` is null, rather than
 * hiding the section: the tier structure is real and useful on its own, and
 * this is the one section where showing up empty-handed would be actively
 * ironic — the studio's stated differentiator is "most Chennai studios hide the
 * price, we publish it". Saying "published on the pricing page" and linking
 * there is honest; a placeholder number would not be.
 *
 * `TierCard` requires a `price`, so a tier with no figure gets `amount: 0` and
 * is rendered through the summary line instead — see the guard below, which is
 * why this maps to `FeatureCard` rather than `TierCard` until real prices land.
 * §3.6 also gives the clearest "3D hurts" call on the whole page: pricing is
 * DOM, instant and plain, because spectacle around price signals hiding
 * something.
 */
export function PricingTeaser({ tiers }: { tiers: readonly Tier[] }) {
  if (tiers.length === 0) return null;

  const priced = tiers.filter((tier): tier is Tier & { priceFrom: number } => tier.priceFrom !== null);
  const allPriced = priced.length === tiers.length;

  return (
    <Section
      id="pricing"
      eyebrow="Radical transparency"
      title="Most Chennai studios hide the price. We publish it."
      lede="Three tiers, stated openly, with what each one includes. No quote-on-request, no discovery call before you can find out what it costs."
    >
      {allPriced ? (
        <Grid cols={3} gap={5}>
          {priced.map((tier) => (
            <TierCard
              key={tier.id}
              name={tier.name}
              price={{ amount: tier.priceFrom, period: 'onwards' }}
              inclusions={tier.inclusions}
              cta={{ label: 'See what is included', href: '/pricing' }}
              recommended={tier.recommended}
            />
          ))}
        </Grid>
      ) : (
        // Tier structure without invented figures. The moment `priceFrom` is
        // filled in for every tier, the branch above takes over and these
        // become real price bands with no change here.
        <Grid cols={3} gap={5}>
          {tiers.map((tier) => (
            <div key={tier.id} className="flex flex-col gap-3">
              <FeatureCard href="/pricing" icon="check" title={tier.name} body={tier.summary} />
              {/* The fee band named as pending, in the place the price will go.
                  This is the one section where a placeholder number would be
                  actively self-defeating: the heading above it says the studio
                  publishes its prices. */}
              <p className="px-6 text-small">
                <ToBePublished label="Fee band" />
              </p>
            </div>
          ))}
        </Grid>
      )}
      <Cluster gap={3}>
        <Button as="a" href="/pricing" iconTrailing="arrow-right">
          See your price
        </Button>
      </Cluster>
    </Section>
  );
}
