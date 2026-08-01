import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { InlineAlert } from '@/components/InlineAlert';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getNriRegions } from '@/lib/content/source';

/**
 * `/nri/[region]` (Spec §2.2: `/nri/singapore /uae /usa /uk /canada
 * /australia`).
 *
 * Six prerendered region pages. The only genuinely region-specific fact the
 * studio has supplied is the region itself, so the page earns its existence by
 * computing something real from it: the current time in Chennai next to the
 * current time where the visitor is.
 *
 * That is not decoration. §2.1's NRI objection is "can I run a Chennai project
 * from abroad?", and the concrete form of that worry is "will I be on calls at
 * 3am". Showing both clocks answers it with arithmetic rather than reassurance.
 *
 * ## Why the times are computed at request time, not baked in
 *
 * `Intl.DateTimeFormat` with an IANA zone handles daylight saving on both
 * sides; a stored UTC offset would be silently wrong for several of these
 * regions for half of every year — and wrong in exactly the season a visitor
 * checks it. `dynamic = 'force-dynamic'` is the cost of that: these six pages
 * are server-rendered per request rather than prerendered, which is the right
 * trade for a fact whose whole value is being currently true.
 */
export const dynamicParams = false;
export const dynamic = 'force-dynamic';

const CHENNAI = 'Asia/Kolkata';

export async function generateStaticParams() {
  return (await getNriRegions()).map((region) => ({ region: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region: slug } = await params;
  const region = (await getNriRegions()).find((candidate) => candidate.slug === slug);
  if (!region) return {};

  return {
    title: `Designing a Chennai home from ${region.name} — Luxe Axis`,
    description: `Remote interior design for Chennai, run from ${region.name}: reviews over video in your time zone, and progress visible as it happens.`,
    alternates: canonicalFor(`/nri/${region.slug}`),
  };
}

/** Time of day in an IANA zone, as a visitor would read it. */
function timeIn(timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());
}

export default async function NriRegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: slug } = await params;
  const region = (await getNriRegions()).find((candidate) => candidate.slug === slug);
  if (!region) notFound();

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={6} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            {region.name}
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            Designing a Chennai home from {region.name}
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            The studio is on the ground in Chennai. You are not, and the process is built for that
            rather than working around it.
          </p>
          <div>
            <Button as="a" href="/book-audit" size="lg">
              Start your remote design
            </Button>
          </div>
        </Stack>
      </Container>

      <Section
        id="timing"
        eyebrow="The practical bit"
        title="What a review call looks like from here"
        lede="Right now, side by side. Reviews are scheduled to suit your end of this, not ours."
      >
        <div className="grid max-w-measure grid-cols-2 gap-5">
          {[
            { label: region.name, zone: region.timeZone },
            { label: 'Chennai', zone: CHENNAI },
          ].map((place) => (
            <div
              key={place.label}
              className="rounded-lg border border-border-subtle bg-surface-raised p-6"
            >
              <p className="text-small text-on-surface-2">{place.label}</p>
              <p className="mt-2 font-mono text-[length:var(--typography-h2-font-size)] tabular-nums text-on-surface">
                {timeIn(place.zone)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="paying"
        eyebrow="Money"
        title="Paying from abroad"
        lede="Fees are set in rupees. How you can pay them from here, and in what currency, is being confirmed."
      >
        <div className="max-w-measure">
          {/* T-18 asks for a "multi-currency note". What the studio actually
              accepts from each region is a finance question nobody has
              answered, and payment terms are precisely the wrong thing to
              guess at — a visitor could act on it. Named as outstanding. */}
          <InlineAlert tone="info" title="Payment routes are being confirmed">
            <ToBePublished label={`Accepted payment methods from ${region.name}`} />
          </InlineAlert>
        </div>
      </Section>

      <CTASection />
    </main>
  );
}
