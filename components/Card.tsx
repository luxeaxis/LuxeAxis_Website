/**
 * Card family — Project / Tier / Feature / Stat (design system §3.2). Server
 * Components throughout: every visual state below (hover-lift, elevation
 * step, title-warm, focus ring) is pure CSS, and the one genuinely animated
 * part (the count-up) already lives in its own client leaf, `StatCounter`,
 * the same "don't mark the whole card client for one animated child" split
 * the brief calls out.
 *
 * ## The whole-card-link problem (§3.2 a11y: "avoid nested interactive
 * traps — use a card-wide link with the action as a visual affordance, OR a
 * clear single CTA")
 *
 * Rather than one generic `<Card variant interactive? cta? href?>` whose
 * props could be combined into a nested `<a><button/></a>`, each variant's
 * prop type only offers the ONE interaction shape that variant actually
 * uses — the invalid combination has no prop to express it with:
 *
 * - `ProjectCard` / `FeatureCard`: `href` is the only interactive prop.
 *   There is no `cta`/`onClick` slot to plant a nested control in. The
 *   entire card is one `<a>`; any "action" reads as a trailing arrow icon
 *   (`aria-hidden`, purely visual), never a second focusable element.
 * - `TierCard`: `cta: { label, href }` is the only interactive prop. There
 *   is no `href` on the card itself — the outer element is a plain `<div>`,
 *   and the CTA is one real `<Button as="a">`. A tier card needs real
 *   inclusions text and a real price, which a card-wide link would force
 *   into decoration (the classic trap this file exists to avoid).
 * - `StatCard`: neither prop exists. It is never interactive — a number and
 *   a label, nothing to click.
 *
 * `tests/unit/card.test.tsx` asserts each rendered card exposes exactly the
 * interactive elements its variant allows (one for Project/Feature/Tier,
 * zero for Stat) — not "at most one" as a runtime check, but as the direct
 * consequence of what the type signature lets a caller pass.
 *
 * ## Whole-card anchor is NOT `components/Link.tsx`
 *
 * `Link.tsx`'s base classes always include a permanent `underline` (its
 * `inline` variant needs that per WCAG 1.4.1 — see that file's own
 * comment). `text-decoration-line` on an ancestor renders through block
 * descendants too, not just the ancestor's own inline text — wrapping a
 * card's media + heading + body in `<Link>` would draw a stray underline
 * under the whole card's text, not just style a small text run the way
 * every other `<Link>` usage in this codebase does. Project/FeatureCard
 * therefore use `next/link`'s bare `Link` directly (imported the same way
 * `components/Link.tsx` itself does), styled for a block-level card region
 * instead of an inline text link — a different anatomy, not a rebuild of
 * the Link primitive.
 *
 * ## Glass (§1.7)
 *
 * Every variant accepts `surface?: 'solid' | 'glass'` (default `'solid'`).
 * Glass reuses the header's `.lx-glass` recipe (`styles/globals.css`) rather
 * than a second one — §1.7 permits it in exactly three places, and "a card
 * floating over the 3D canvas" is one; nothing here enforces that policy at
 * the type level (the header's own glass usage isn't type-enforced either),
 * so it stays a caller responsibility, documented at each call site.
 */

import NextLink from 'next/link';
import Image from 'next/image';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Stack } from './layout';
import { PriceTag } from './PriceTag';
import { StatCounter } from './StatCounter';
import type { PosterId } from '@/lib/content/posters';
import { SceneSlot } from './SceneSlot';

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

export type CardSurface = 'solid' | 'glass';

// Shared chrome: radius.lg, padding space.6, border-subtle, baseline
// elevation.1 (§3.2 "Sizes/layout" + "States: default (elevation dark-1)").
// `interactive` adds the hover-lift + elevation-2 + focus ring the spec's
// hover/focus-within rows describe — applied only to the variants whose
// outer element is itself the activation target (ProjectCard/FeatureCard's
// anchor). TierCard/StatCard's outer element is a static `<div>`; giving it
// hover feedback with nothing under the pointer to activate would be a false
// affordance, so they stay at the `interactive: false` baseline.
function frameClass({
  surface = 'solid',
  interactive,
  emphasized,
}: {
  surface?: CardSurface;
  interactive: boolean;
  emphasized?: boolean;
}): string {
  return cx(
    'relative rounded-xl p-6 shadow-1 transition-all duration-300',
    surface === 'glass'
      ? 'lx-liquid-glass-card border border-accent/30 shadow-[0_12px_36px_rgba(0,0,0,0.4)]'
      : 'bg-surface-raised/90 backdrop-blur-md border border-border-subtle/80 hover:bg-surface-raised',
    emphasized ? 'border-accent shadow-[0_0_24px_rgba(255,193,7,0.25)]' : '',
    interactive &&
      cx(
        'transition-all duration-300 ease-standard motion-reduce:transition-none',
        'hover:-translate-y-[var(--motion-distance-lift)] hover:border-accent hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_35px_4px_rgba(255,193,7,0.45)]',
        'active:scale-press motion-reduce:active:scale-100',
        'focus-visible:outline focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-focus-ring',
      ),
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wide)] text-on-surface-muted">
      {children}
    </p>
  );
}

// Trailing affordance for the whole-card-link variants — purely visual (the
// entire card is already the link; this glyph just signals "this goes
// somewhere"), so it is `decorative` and nudges on hover exactly like
// Button's `iconTrailing` (§3.7 "Button icon nudge").
function TrailingArrow() {
  return (
    <Icon
      name="arrow-right"
      size="md"
      decorative
      className="shrink-0 text-on-surface-muted transition-transform duration-micro ease-standard group-hover:translate-x-1 group-hover:text-accent motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Project card                                                        */
/* ------------------------------------------------------------------ */

export type ProjectCardMedia =
  // A poster from lib/content/posters.ts — the catalogue that heads major
  // sections. Only ids in POSTER_IDS can be passed; there is no per-project
  // poster yet, so this is for showcase scenes ('portfolio' etc.), not
  // arbitrary project photos.
  | { kind: 'scene'; sceneId: PosterId }
  // An arbitrary case-study photo. `aspect` is required, not defaulted —
  // SceneSlot's own poster registry never defaults it either (every entry
  // states its aspect explicitly), so a card composing a real photo should
  // be just as explicit rather than guessing a ratio that doesn't match the
  // supplied image.
  | { kind: 'photo'; src: string; alt: string; aspect: `${number}/${number}` };

export type ProjectCardProps = {
  href: string;
  title: string;
  neighbourhood: string;
  tier?: string;
  eyebrow?: string;
  media: ProjectCardMedia;
  surface?: CardSurface;
  className?: string;
};

export function ProjectCard({
  href,
  title,
  neighbourhood,
  tier,
  eyebrow,
  media,
  surface = 'solid',
  className,
}: ProjectCardProps) {
  return (
    <NextLink
      href={href}
      className={cx(
        'group flex flex-col h-full overflow-hidden justify-between',
        frameClass({ surface, interactive: true }),
        className,
      )}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg relative">
            {media.kind === 'scene' ? (
              <SceneSlot id={media.sceneId}>{null}</SceneSlot>
            ) : (
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {tier && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-surface-deep/85 border border-accent/40 text-accent font-ui text-[11px] font-bold tracking-wider backdrop-blur-md shadow-md">
                    {tier} Tier
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-ui text-[length:var(--typography-h3-font-size)] font-semibold text-on-surface transition-colors duration-micro ease-standard group-hover:text-accent">
                {title}
              </h3>
              <TrailingArrow />
            </div>
          </div>
        </div>
        <div className="pt-3 mt-3 border-t border-border-subtle/50 flex items-center justify-between text-small text-on-surface-2">
          <span>{neighbourhood}</span>
          {tier && <span className="font-medium text-accent">{tier}</span>}
        </div>
      </div>
    </NextLink>
  );
}

/* ------------------------------------------------------------------ */
/* Feature card                                                        */
/* ------------------------------------------------------------------ */

export type FeatureCardProps = {
  href?: string;
  /** Optional. A feature is usually best introduced by its glyph, but some
   *  cards in this family lead with words alone — the home page's persona
   *  tiles ask "which of these is you?", where any icon would be decoration
   *  competing with the question, and an arrow specifically would collide with
   *  the trailing arrow the card already draws. Omitting it drops the slot
   *  entirely rather than reserving empty space. */
  icon?: IconName;
  title: string;
  body?: string;
  surface?: CardSurface;
  className?: string;
};

export function FeatureCard({
  href,
  icon,
  title,
  body,
  surface = 'solid',
  className,
}: FeatureCardProps) {
  const content = (
    <div className="h-full flex flex-col justify-between space-y-4">
      {icon && (
        <Icon name={icon} size="lg" decorative className="text-accent" />
      )}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-ui text-[length:var(--typography-h3-font-size)] font-semibold text-on-surface transition-colors duration-micro ease-standard group-hover:text-accent">
            {title}
          </h3>
          {href && <TrailingArrow />}
        </div>
        {body && <p className="text-small text-on-surface-2 leading-relaxed">{body}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <NextLink
        href={href}
        className={cx(
          'group block h-full flex flex-col justify-between',
          frameClass({ surface, interactive: true }),
          className,
        )}
      >
        {content}
      </NextLink>
    );
  }

  return (
    <div
      className={cx(
        'group block h-full flex flex-col justify-between',
        frameClass({ surface, interactive: false }),
        className,
      )}
    >
      {content}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tier card                                                           */
/* ------------------------------------------------------------------ */

export type TierName = 'Essential' | 'Signature' | 'Elite';

export type TierCardProps = {
  name: TierName;
  price: { amount: number; period?: string };
  inclusions: readonly string[];
  cta: { label: string; href: string };
  /** Gets the gold hairline AND the overline badge (§3.2: "a 'recommended'
   *  tier gets a gold hairline and an overline badge" — never colour alone,
   *  see the badge text below). */
  recommended?: boolean;
  surface?: CardSurface;
  className?: string;
};

export function TierCard({
  name,
  price,
  inclusions,
  cta,
  recommended = false,
  surface = 'solid',
  className,
}: TierCardProps) {
  return (
    <div
      className={cx(
        frameClass({ surface, interactive: false, emphasized: recommended }),
        className,
      )}
    >
      <Stack gap={4}>
        {/* Real, perceivable text — not a colour-only badge — is what makes
            "recommended" announced rather than merely styled: a screen
            reader reading through the card's content hits this line the
            same as any other text, no aria-live or special role required.
            The gold hairline (frameClass above) is the paired visual cue;
            this is the non-colour one §5 requires alongside it. */}
        {recommended && (
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wide)] text-accent">
            Recommended
          </p>
        )}
        <h3 className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
          {name}
        </h3>
        <PriceTag amount={price.amount} period={price.period} />
        <ul className="flex flex-col gap-2">
          {inclusions.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-small text-on-surface-2"
            >
              <Icon
                name="check"
                size="sm"
                decorative
                className="mt-0.5 shrink-0 text-accent"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Button
          as="a"
          href={cta.href}
          variant={recommended ? 'primary' : 'secondary'}
          className="w-full"
        >
          {cta.label}
        </Button>
      </Stack>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */

export type StatCardProps = {
  value: number;
  label: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  surface?: CardSurface;
  className?: string;
};

export function StatCard({
  value,
  label,
  decimals,
  prefix,
  suffix,
  surface = 'solid',
  className,
}: StatCardProps) {
  return (
    <div
      className={cx(
        frameClass({ surface, interactive: false }),
        'overflow-hidden flex flex-col justify-between min-w-0 p-6 sm:p-7',
        className
      )}
    >
      <Stack gap={2} className="min-w-0 overflow-hidden">
        <p className="font-mono text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight tabular-nums text-on-surface tracking-tight min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          <StatCounter
            value={value}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
          />
        </p>
        <p className="text-small text-on-surface-2 font-medium leading-snug">{label}</p>
      </Stack>
    </div>
  );
}

