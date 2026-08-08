/**
 * Link — inline (inside prose) and standalone (nav-like) anchors (spec
 * §3.1/§3.3). A Server Component: styling is pure CSS states, and
 * `next/link`'s `Link` is itself a pre-built framework component Server
 * Components are explicitly allowed to render directly, so no boundary is
 * needed here the way Button/Field need one for their handlers.
 *
 * `inline` and `standalone` deliberately differ on when the underline shows,
 * and that split is intentional — don't "fix" it to match:
 *
 * - `inline` (prose): the underline is permanent. WCAG 1.4.1 (Use of Color)
 *   requires a non-colour cue on a link sitting in ordinary paragraph text,
 *   where nothing else marks it as interactive — removing the underline at
 *   rest would leave colour as the only signal it's a link at all.
 * - `standalone` (nav-like): the underline is revealed on hover/focus, per
 *   §2.3's "Underline draw" pattern and §3.3's nav states table (`default
 *   on-surface-2 → hover/focus … + underline-draw`). These links already sit
 *   inside their own surrounding chrome (nav landmark, list layout), so they
 *   don't need a permanent underline to read as interactive the way inline
 *   prose links do — and making it permanent here would flatten the
 *   current-page cue down to colour only (current vs. hover would then
 *   differ solely in decoration *colour*, not presence). The current-page
 *   state keeps its own persistent underline (`aria-current="page"`) so it
 *   stays visually distinct from a link merely at rest.
 *
 * Neither variant ever signals hover/focus by colour alone: `standalone`
 * pairs its text-colour change with the underline reveal, never colour in
 * isolation.
 */

import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

export type LinkVariant = 'inline' | 'standalone';

export type LinkProps = {
  href: string;
  children: ReactNode;
  variant?: LinkVariant;
  /** Force external (new-tab, `rel=noopener noreferrer`) handling. Auto-
   *  detected from `href` when omitted — see `isExternalHref` below. */
  external?: boolean;
  className?: string;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'children' | 'className'
>;

const VARIANT_CLASS: Record<LinkVariant, string> = {
  // No explicit decoration-colour class needed: an unset `text-decoration-
  // color` defaults to `currentColor`, so the underline (added in `classes`
  // below) already tracks `text-accent`/`hover:text-accent-hover` for free.
  inline: 'text-accent hover:text-accent-hover',
  // `decoration-transparent` at rest hides the underline (it's still laid
  // out, just invisible) so `hover:`/`focus-visible:decoration-current`
  // "draws" it back in — the reveal-on-hover pattern from the file-level
  // comment. `aria-[current=page]:decoration-accent` wins over the
  // `decoration-transparent` default despite appearing first in the class
  // list: Tailwind's `aria-*` variant compiles to an attribute selector
  // (`[aria-current="page"]`), which carries higher CSS specificity than the
  // plain class selector `decoration-transparent` resolves to, so the
  // cascade — not source order — decides here.
  standalone:
    'text-on-surface-2 decoration-transparent hover:text-on-surface hover:decoration-current focus-visible:text-on-surface focus-visible:decoration-current aria-[current=page]:text-on-surface aria-[current=page]:decoration-accent',
};

function isExternalHref(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('/');
}

export function Link({
  href,
  children,
  variant = 'inline',
  external,
  className,
  target,
  rel,
  ...rest
}: LinkProps) {
  const isExternal = external ?? isExternalHref(href);

  const classes = cx(
    'underline decoration-[length:var(--border-width-regular)] underline-offset-4',
    'transition-colors duration-micro ease-standard',
    'focus-visible:outline focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-focus-ring',
    VARIANT_CLASS[variant],
    className,
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target={target ?? '_blank'}
        rel={rel ?? 'noopener noreferrer'}
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      target={target}
      rel={rel}
      className={classes}
      {...rest}
    >
      {children}
    </NextLink>
  );
}
