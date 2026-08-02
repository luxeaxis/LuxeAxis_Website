import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Badge, type BadgeTone } from '@/components/Badge';
import { Button, type ButtonVariant } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { InlineAlert } from '@/components/InlineAlert';
import { Progress } from '@/components/Progress';
import { Skeleton } from '@/components/Skeleton';
import { Tooltip } from '@/components/Tooltip';
import type { StatusTone } from '@/lib/status';
import { OverlayDemo } from './OverlayDemo';
import { FeatureCard, ProjectCard, StatCard, TierCard } from '@/components/Card';
import { Field } from '@/components/Field';
import { FeeCalculator } from '@/components/FeeCalculator';
import { Icon, type IconName } from '@/components/Icon';
import { Link } from '@/components/Link';
import { Center, Cluster, Container, Grid, Stack } from '@/components/layout';
import { SceneSlot } from '@/components/SceneSlot';
import { canonicalFor } from '@/lib/seo/hreflang';
import type { CalculatorConfig } from '@/lib/content/types';

const ROUTE = '/style';

// ILLUSTRATIVE ONLY — not Luxe Axis pricing, and not a proposal.
//
// The real price list now exists and the calculator renders it on /pricing and
// /residential. This specimen stays because /style's job is to show every
// component in isolation, and pointing it at live pricing would mean the
// reference page silently changing whenever commercial terms do.
//
// The rows are named "Demo" and the figures are obviously synthetic, so nobody
// skimming could mistake them for the published list — the same reasoning as
// the "Illustrative" label on the Cards specimen's price band. The route is
// `robots: { index: false }`, so these numbers are also not indexable.

export const metadata: Metadata = {
  title: 'Style reference — Luxe Axis',
  alternates: canonicalFor(ROUTE),
  // A developer reference, not a marketing surface.
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ */
/* Page-local presentation helpers. These exist only to document the   */
/* system and are deliberately NOT promoted to components/ — a         */
/* reference page's scaffolding is not itself part of the system.      */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted">
      {children}
    </p>
  );
}

function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-border-subtle pt-8">
      <Stack gap={6}>
        <Stack gap={2}>
          <h2 id={`${id}-heading`} className="font-display text-[length:var(--typography-h2-font-size)] text-on-surface">
            {title}
          </h2>
          <Center>
            <p className="text-on-surface-2">{lede}</p>
          </Center>
        </Stack>
        {children}
      </Stack>
    </section>
  );
}

/** Labels a specimen with the token that produced it.
 *
 *  The prop is `token`, not `role` — a prop literally named `role` shadows the
 *  ARIA attribute, which both confuses a reader and makes jsx-a11y treat every
 *  usage as an invalid ARIA role. The token path is shown rather than a
 *  resolved hex because in a semantic system the token IS the contract; its
 *  value differs per theme, which is exactly the point. */
function Spec({ token, children }: { token: string; children: ReactNode }) {
  return (
    <Stack gap={2}>
      <div>{children}</div>
      <code className="font-mono text-overline text-on-surface-muted">{token}</code>
    </Stack>
  );
}

function Swatch({ token, className }: { token: string; className: string }) {
  return (
    <Spec token={token}>
      <div className={`h-control-lg w-full rounded-md border border-border-subtle ${className}`} />
    </Spec>
  );
}

/* ------------------------------------------------------------------ */

const SURFACES = [
  ['--surface', 'bg-surface'],
  ['--surface-deep', 'bg-surface-deep'],
  ['--surface-raised', 'bg-surface-raised'],
  ['--surface-raised-2', 'bg-surface-raised-2'],
] as const;

const CONTENT = [
  ['--on-surface', 'bg-on-surface'],
  ['--on-surface-2', 'bg-on-surface-2'],
  ['--on-surface-muted', 'bg-on-surface-muted'],
] as const;

const ACCENTS = [
  ['--accent', 'bg-accent'],
  ['--accent-hover', 'bg-accent-hover'],
  ['--accent-contrast', 'bg-accent-contrast'],
  ['--signal', 'bg-signal'],
] as const;

const EDGES = [
  ['--border-subtle', 'bg-border-subtle'],
  ['--border', 'bg-border'],
  ['--border-strong', 'bg-border-strong'],
  ['--focus-ring', 'bg-focus-ring'],
] as const;

const STATUS = [
  ['--error', 'bg-error'],
  ['--success', 'bg-success'],
] as const;

const TYPE_RAMP = [
  [
    'display',
    'font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-tight',
    'Where Space Meets Intelligence',
  ],
  [
    'h1',
    'font-display text-[length:var(--typography-h1-font-size)] leading-snug tracking-tight',
    'The Intelligence Behind the Space',
  ],
  ['h2', 'font-display text-[length:var(--typography-h2-font-size)] leading-snug', 'Designing Dreams'],
  ['h3', 'font-ui text-[length:var(--typography-h3-font-size)] font-semibold', 'A designed life, measured'],
  [
    'body-lg',
    'font-ui text-[length:var(--typography-body-lg-font-size)]',
    'Raw space and applied intelligence produce a home that works.',
  ],
  [
    'body',
    'font-ui text-[length:var(--typography-body-font-size)]',
    'Every animation must prove a capability, orient, guide, or give feedback.',
  ],
  ['small', 'font-ui text-small', 'Reviewed by a designer before it reaches you.'],
  ['overline', 'font-ui text-overline uppercase tracking-[var(--font-tracking-wider)]', 'Radical Transparency'],
  [
    'price',
    'font-mono text-[length:var(--typography-price-font-size)] tabular-nums',
    '₹ 18,40,000',
  ],
] as const;

const ILLUSTRATIVE_RATES: CalculatorConfig = {
  brackets: [
    {
      id: 'demo-flat',
      label: 'Demo flat',
      area: { min: 100, max: 200 },
      tiers: ['Essential'],
      projectCost: { low: 100_000, high: 200_000 },
      designFee: { low: 10_000, high: 20_000 },
    },
    {
      id: 'demo-house',
      label: 'Demo house',
      area: { min: 300, max: null },
      tiers: ['Signature', 'Elite'],
      projectCost: { low: 300_000, high: 900_000 },
      designFee: { low: 30_000, high: 90_000 },
    },
  ],
};

const SPACE_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const SPACE_WIDTH: Record<(typeof SPACE_STEPS)[number], string> = {
  1: 'w-1',
  2: 'w-2',
  3: 'w-3',
  4: 'w-4',
  5: 'w-5',
  6: 'w-6',
  7: 'w-7',
  8: 'w-8',
  9: 'w-9',
  10: 'w-10',
};

const EASINGS = [
  ['standard', 'ease-standard', 'General UI. The default.'],
  ['entrance', 'ease-entrance', 'Decelerates — things settle rather than arrive.'],
  ['exit', 'ease-exit', 'Accelerates away. Shorter than its entrance.'],
  ['spatial', 'ease-spatial', 'Weighted. Reserved for camera and 3D moves.'],
] as const;

const BUTTON_VARIANTS: readonly Exclude<ButtonVariant, 'icon'>[] = [
  'primary',
  'secondary',
  'tertiary',
  'destructive',
];

const ICON_NAMES: readonly IconName[] = [
  'arrow-right',
  'chevron-down',
  'close',
  'check',
  'alert-circle',
];

const BADGE_TONES: readonly BadgeTone[] = ['neutral', 'accent', 'success', 'warning', 'error', 'info'];
const STATUS_TONES: readonly StatusTone[] = ['success', 'warning', 'error', 'info'];

// Illustrative only. Real copy is content work and does not exist yet, so
// these say what the component is for rather than pretending to be product
// text — and none of them invent a fact about the business.
const ALERT_TITLE: Record<StatusTone, string> = {
  success: 'Your audit is booked',
  warning: 'This estimate excludes civil work',
  error: 'We could not save that change',
  info: 'Pricing shown is a band, not a quote',
};

const ALERT_BODY: Record<StatusTone, string> = {
  success: 'A designer will confirm the time by WhatsApp.',
  warning: 'Structural changes are quoted separately after the site visit.',
  error: 'Nothing was lost. Try again, or reach us on WhatsApp.',
  info: 'The final figure follows the measured site survey.',
};

/** The specimen block rendered once per theme. Everything inside resolves its
 *  tokens from the nearest `data-theme`, so rendering it twice side by side is
 *  what makes a theme regression visible rather than merely testable. */
function ThemeSpecimen({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <div
      data-theme={theme}
      className="rounded-lg border border-border-subtle bg-surface p-6 text-on-surface"
    >
      <Stack gap={6}>
        <Eyebrow>{theme} theme</Eyebrow>

        <Stack gap={3}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Buttons</h3>
          {(['lg', 'md', 'sm'] as const).map((size) => (
            <Cluster key={size} gap={3}>
              {BUTTON_VARIANTS.map((variant) => (
                <Button key={variant} variant={variant} size={size}>
                  {variant}
                </Button>
              ))}
              <Button variant="icon" size={size} aria-label="Close" icon="close" />
            </Cluster>
          ))}
          <Cluster gap={3}>
            <Button variant="primary" iconTrailing="arrow-right">
              Book audit
            </Button>
            <Button variant="secondary" iconLeading="check">
              With leading icon
            </Button>
          </Cluster>
          <Cluster gap={3}>
            <Button variant="primary" loading>
              Book audit
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </Cluster>
        </Stack>

        <Stack gap={3}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Links</h3>
          <p className="text-on-surface-2">
            An <Link href="/pricing">inline link</Link> keeps its underline permanently — in prose
            there is no surrounding affordance to signal it is interactive.
          </p>
          <Cluster gap={5}>
            <Link href="/pricing" variant="standalone">
              Standalone reveals on hover
            </Link>
            <Link href="https://example.com" variant="standalone" external>
              External
            </Link>
          </Cluster>
        </Stack>

        <Stack gap={4}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Fields</h3>
          <Field label="Full name" name={`name-${theme}`} help="As it should appear on the proposal." />
          <Field
            label="Phone"
            name={`phone-${theme}`}
            type="tel"
            required
            error="Enter a phone number we can reach you on."
          />
          <Field
            label="Email"
            name={`email-${theme}`}
            type="email"
            success="We'll confirm within the hour."
          />
          <Field label="Notes" name={`notes-${theme}`} multiline rows={2} disabled />
        </Stack>

        <Stack gap={3}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Icons</h3>
          <Cluster gap={4}>
            {ICON_NAMES.map((name) => (
              <Icon key={name} name={name} size="lg" decorative />
            ))}
          </Cluster>
        </Stack>

        {/* The feedback set renders per theme because status tones are the
            roles most likely to diverge between them: each ships a lighter
            *-on-dark and a deeper *-on-light variant, so a tone that reads
            clearly on navy can wash out on ivory. Both are on screen at once
            precisely so that is visible rather than merely asserted. */}
        <Stack gap={3}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Badges</h3>
          <Cluster gap={2}>
            {BADGE_TONES.map((tone) => (
              <Badge key={tone} tone={tone}>
                {tone}
              </Badge>
            ))}
          </Cluster>
          <Cluster gap={2}>
            <Chip>Static chip</Chip>
            <Chip selected>Selected</Chip>
          </Cluster>
        </Stack>

        <Stack gap={3}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Inline alerts</h3>
          {STATUS_TONES.map((tone) => (
            <InlineAlert key={tone} tone={tone} title={ALERT_TITLE[tone]}>
              {ALERT_BODY[tone]}
            </InlineAlert>
          ))}
        </Stack>

        <Stack gap={3}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Tooltip</h3>
          <Cluster gap={3}>
            <Tooltip content="Opens on hover and on focus, and is wired via aria-describedby.">
              <Button variant="secondary">Hover or focus me</Button>
            </Tooltip>
          </Cluster>
        </Stack>

        <Stack gap={3}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Progress</h3>
          <Progress
            value={62}
            label="Uploading floor plan"
            helpText="Honest percentages only — never a bar that moves to look busy."
          />
        </Stack>

        <Stack gap={3}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Skeleton</h3>
          <Stack gap={3}>
            <Skeleton variant="text" lines={3} label="Loading project summary" />
            <Cluster gap={3} align="center">
              <Skeleton variant="circle" />
              <Skeleton variant="block" height="4rem" />
            </Cluster>
          </Stack>
        </Stack>

        <Stack gap={3}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Empty state</h3>
          <EmptyState
            icon="alert-circle"
            title="No projects match those filters"
            body="Widen the neighbourhood or tier to see more work."
            action={<Button variant="secondary">Clear filters</Button>}
          />
        </Stack>

        <Stack gap={4}>
          <h3 className="font-display text-[length:var(--typography-h3-font-size)]">Cards</h3>
          {/* Every figure, inclusion and project name below is an obvious
              placeholder — §3.2/the brief: "no invented copy and no
              fabricated facts… demo content on /style must be obviously
              illustrative." Nothing here is a real Luxe Axis project, price
              or client number. */}
          <p className="text-small text-on-surface-muted">
            Specimen content only — figures, inclusions and the project name below are illustrative
            placeholders, not real Luxe Axis data.
          </p>

          <Grid cols={2} gap={5}>
            <ProjectCard
              href="/portfolio"
              eyebrow="Specimen"
              title="Illustrative project"
              neighbourhood="Adyar, Chennai"
              tier="Signature"
              media={{ kind: 'scene', sceneId: 'portfolio' }}
            />
            <FeatureCard
              href="/intelligence"
              icon="check"
              title="Illustrative intelligence feature"
              body="One line stating the capability's claim, not a description of pixels."
            />
          </Grid>

          <Grid cols={3} gap={5}>
            <TierCard
              name="Essential"
              price={{ amount: 500000, period: 'onwards (illustrative)' }}
              inclusions={['Illustrative inclusion one', 'Illustrative inclusion two']}
              cta={{ label: 'Book audit', href: '/book-audit' }}
            />
            <TierCard
              name="Signature"
              price={{ amount: 1000000, period: 'onwards (illustrative)' }}
              inclusions={[
                'Illustrative inclusion one',
                'Illustrative inclusion two',
                'Illustrative inclusion three',
              ]}
              cta={{ label: 'Book audit', href: '/book-audit' }}
              recommended
            />
            <TierCard
              name="Elite"
              price={{ amount: 2000000, period: 'onwards (illustrative)' }}
              inclusions={['Illustrative inclusion one', 'Illustrative inclusion two']}
              cta={{ label: 'Book audit', href: '/book-audit' }}
            />
          </Grid>

          <Grid cols={3} gap={5}>
            <StatCard value={120} suffix="+" label="Illustrative projects delivered" />
            <StatCard value={98} suffix="%" label="Illustrative client satisfaction" />
            <StatCard value={12} label="Illustrative years in practice" />
          </Grid>

          <Stack gap={2}>
            <Eyebrow>Glass card — floating over the 3D canvas only (§1.7)</Eyebrow>
            {/* The literal permitted case: a card floating ON TOP of a
                scene, not styled next to one. SceneSlot's own overlay slot
                (`components/SceneSlot.tsx`) hosts it directly, the same
                place a mega-menu panel or hero toast would sit — everywhere
                else on the site this variant renders `surface="solid"`. */}
            <SceneSlot id="portfolio">
              <div className="max-w-xs p-6">
                <FeatureCard
                  href="/intelligence"
                  icon="check"
                  title="Floating over the scene"
                  body="Glass keeps the scene's context visible instead of pasting a solid panel over it (§1.7)."
                  surface="glass"
                />
              </div>
            </SceneSlot>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}

export default function StylePage() {
  return (
    <main id="main" tabIndex={-1} className="py-section-y">
      <Container>
        <Stack gap={10}>
          <header>
            <Stack gap={3}>
              <Eyebrow>Luxe Axis · Interface System</Eyebrow>
              <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-tight text-on-surface">
                Style reference
              </h1>
              <Center>
                <p className="text-on-surface-2">
                  Every token and primitive in the system, rendered. Tests prove these behave; this
                  page is how a human judges whether they look right. Luxury here is precision,
                  space and consistency — not ornament.
                </p>
              </Center>
            </Stack>
          </header>

          <Section
            id="colour"
            title="Colour"
            lede="Semantic roles, not raw palette. A component names the role it needs and the theme decides the value, which is why each swatch is labelled by token rather than by hex."
          >
            <Stack gap={5}>
              {(
                [
                  ['Surfaces', SURFACES],
                  ['Content', CONTENT],
                  ['Accent', ACCENTS],
                  ['Edges', EDGES],
                  ['Status', STATUS],
                ] as const
              ).map(([group, entries]) => (
                <Stack key={group} gap={3}>
                  <Eyebrow>{group}</Eyebrow>
                  <Grid cols={4} gap={4}>
                    {entries.map(([token, className]) => (
                      <Swatch key={token} token={token} className={className} />
                    ))}
                  </Grid>
                </Stack>
              ))}
            </Stack>
          </Section>

          <Section
            id="typography"
            title="Typography"
            lede="Playfair Display carries the editorial voice; Inter does the work. The system's character comes from the scale jump between them, not from a third font."
          >
            <Stack gap={5}>
              {TYPE_RAMP.map(([token, className, specimen]) => (
                <Spec key={token} token={`typography.${token}`}>
                  <p className={`${className} text-on-surface`}>{specimen}</p>
                </Spec>
              ))}
            </Stack>
          </Section>

          <Section
            id="calculator"
            title="Fee Calculator"
            lede="Shown against an ILLUSTRATIVE rate card, because the real one does not exist yet — getCalculatorConfig() returns null, so this component renders nowhere on the live site. The rates below are round numbers chosen to be obviously fake; they are not Luxe Axis pricing and must never be copied into lib/content/source.ts."
          >
            <div className="max-w-measure">
              <FeeCalculator config={ILLUSTRATIVE_RATES} />
            </div>
          </Section>

          <Section
            id="space"
            title="Space"
            lede="A 4px base grid. Generous by default — spacefulness is a brand value, so the scale climbs steeply at the top rather than offering many near-identical small steps."
          >
            <Stack gap={2}>
              {SPACE_STEPS.map((step) => (
                <Cluster key={step} gap={3} align="center">
                  <code className="w-icon-lg font-mono text-overline text-on-surface-muted">
                    {step}
                  </code>
                  <div className={`h-2 rounded-sm bg-accent ${SPACE_WIDTH[step]}`} />
                </Cluster>
              ))}
            </Stack>
          </Section>

          <Section
            id="form"
            title="Radius, edge and elevation"
            lede="On dark surfaces elevation is expressed with light — a hairline border and a soft glow — never a heavy black shadow, which reads muddy on navy."
          >
            <Grid cols={4} gap={5}>
              <Spec token="radius.sm">
                <div className="h-control-lg rounded-sm border border-border bg-surface-raised" />
              </Spec>
              <Spec token="radius.md">
                <div className="h-control-lg rounded-md border border-border bg-surface-raised" />
              </Spec>
              <Spec token="radius.lg">
                <div className="h-control-lg rounded-lg border border-border bg-surface-raised" />
              </Spec>
              <Spec token="radius.pill">
                <div className="h-control-lg rounded-pill border border-border bg-surface-raised" />
              </Spec>
              <Spec token="elevation.dark-1">
                <div className="h-control-lg rounded-lg bg-surface-raised shadow-dark-1" />
              </Spec>
              <Spec token="elevation.dark-2">
                <div className="h-control-lg rounded-lg bg-surface-raised shadow-dark-2" />
              </Spec>
              <Spec token="border-width.hairline">
                <div className="h-control-lg rounded-lg border-hairline border-border-strong" />
              </Spec>
              <Spec token="border-width.regular">
                <div className="h-control-lg rounded-lg border-regular border-border-strong" />
              </Spec>
            </Grid>
          </Section>

          <Section
            id="motion"
            title="Motion"
            lede="Calm, weighted, precise — like a well-damped drawer. Nothing bounces, nothing overshoots, nothing runs linear. Hover a track to play its curve; all four collapse to an instant state change under reduced-motion."
          >
            <Stack gap={4}>
              {EASINGS.map(([token, easeClass, note]) => (
                <Stack key={token} gap={2}>
                  <div className="group h-8 w-full rounded-sm border border-border-subtle p-1">
                    <div
                      className={`h-full w-8 rounded-sm bg-accent transition-transform duration-signature ${easeClass} motion-reduce:transition-none group-hover:translate-x-[700%]`}
                    />
                  </div>
                  <Cluster gap={3} align="baseline">
                    <code className="font-mono text-overline text-on-surface-muted">
                      easing.{token}
                    </code>
                    <span className="text-small text-on-surface-2">{note}</span>
                  </Cluster>
                </Stack>
              ))}
            </Stack>
          </Section>

          <Section
            id="primitives"
            title="Primitives, both themes"
            lede="Rendered side by side deliberately. The light theme is the one that historically shipped broken, because nobody looked at it — a role can pass contrast on navy and fail on ivory while resolving from a single semantic name."
          >
            <Grid cols={2} gap={6}>
              <ThemeSpecimen theme="dark" />
              <ThemeSpecimen theme="light" />
            </Grid>
          </Section>

          <Section
            id="overlays"
            title="Overlays and interaction"
            lede="Modal, Toast and the interactive Chip states need handlers and open/closed state, so they sit outside the theme blocks behind triggers. Rendering an overlay permanently open on a reference page would trap focus and make everything below it unreachable."
          >
            <OverlayDemo />
          </Section>
        </Stack>
      </Container>
    </main>
  );
}
