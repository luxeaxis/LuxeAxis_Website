import type { ReactNode } from 'react';
import { Button, type ButtonVariant } from '@/components/Button';
import { Field } from '@/components/Field';
import { Icon, type IconName } from '@/components/Icon';
import { Link } from '@/components/Link';
import { Center, Cluster, Container, Grid, Stack } from '@/components/layout';
import { assertPublished } from '@/lib/i18n/guard';
import { alternatesFor } from '@/lib/seo/hreflang';
import { isPublished, LOCALES, type Locale } from '@/lib/i18n/published';

const ROUTE = '/style';

export function generateStaticParams() {
  return LOCALES.filter((locale) => isPublished(ROUTE, locale)).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Style reference — Luxe Axis',
    alternates: alternatesFor(ROUTE, locale as Locale),
    // A developer reference, not a marketing surface.
    robots: { index: false, follow: false },
  };
}

/* ------------------------------------------------------------------ */
/* Page-local presentation helpers. These exist only to document the   */
/* system and are deliberately NOT promoted to components/ — a         */
/* reference page's scaffolding is not itself part of the system.      */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-ui text-overline uppercase tracking-[0.18em] text-on-surface-muted">
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
          <h2 id={`${id}-heading`} className="font-display text-3xl text-on-surface">
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
  ['overline', 'font-ui text-overline uppercase tracking-[0.18em]', 'Radical Transparency'],
  [
    'price',
    'font-mono text-[length:var(--typography-price-font-size)] tabular-nums',
    '₹ 18,40,000',
  ],
] as const;

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
          <h3 className="font-display text-xl">Buttons</h3>
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
          <h3 className="font-display text-xl">Links</h3>
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
          <h3 className="font-display text-xl">Fields</h3>
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
          <h3 className="font-display text-xl">Icons</h3>
          <Cluster gap={4}>
            {ICON_NAMES.map((name) => (
              <Icon key={name} name={name} size="lg" decorative />
            ))}
          </Cluster>
        </Stack>
      </Stack>
    </div>
  );
}

export default async function StylePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertPublished(ROUTE, locale as Locale);

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
            id="tamil"
            title="Tamil type"
            lede="The Tamil families load only on /ta routes, so the font budget stays per-locale. This is a glyph specimen demonstrating the stack, not translated interface copy."
          >
            <div lang="ta">
              <Spec token="font.family.display-ta">
                <p className="font-display text-[length:var(--typography-h2-font-size)] text-on-surface">
                  இடம் அறிவைச் சந்திக்கும் இடம்
                </p>
              </Spec>
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
        </Stack>
      </Container>
    </main>
  );
}
