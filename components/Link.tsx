/**
 * Link — inline (inside prose) and standalone (nav-like) anchors (spec
 * §3.1/§3.3). A Server Component: styling is pure CSS states, and
 * `next/link`'s `Link` is itself a pre-built framework component Server
 * Components are explicitly allowed to render directly, so no boundary is
 * needed here the way Button/Field need one for their handlers.
 *
 * The underline is deliberately ALWAYS ON, in both variants, rather than
 * appearing only on hover. Two rules in the brief pull in the same
 * direction: "never colour-only" (§5) and the explicit non-negotiable that
 * the underline "must not be the only signal removed on hover" — read
 * together, a hover state that *removes* the underline and leaves colour as
 * the sole cue is exactly the anti-pattern being ruled out. A permanent
 * underline is also what WCAG 1.4.1 (Use of Color) asks for on an inline
 * link sitting inside ordinary paragraph text, where nothing else marks it
 * as interactive. (The design doc's §3.3 nav pattern reveals its underline
 * only on hover/focus — that's a deliberately different treatment for
 * chrome-level nav items with their own surrounding affordances, e.g. a nav
 * bar's landmark and layout; it belongs to a future Nav component, not this
 * primitive.)
 */

import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

export type LinkVariant = 'inline' | 'standalone';

export type LinkProps = {
  href: string;
  children: ReactNode;
  variant?: LinkVariant;
  /** Force external (new-tab, `rel=noopener noreferrer`) handling. Auto-
   *  detected from `href` when omitted — see `isExternalHref` below. */
  external?: boolean;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className'>;

const VARIANT_CLASS: Record<LinkVariant, string> = {
  inline: 'text-accent hover:text-accent-hover',
  standalone:
    'text-on-surface-2 hover:text-on-surface aria-[current=page]:text-on-surface aria-[current=page]:decoration-accent',
};

function isExternalHref(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('/');
}

export function Link({ href, children, variant = 'inline', external, className, target, rel, ...rest }: LinkProps) {
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
    <NextLink href={href} target={target} rel={rel} className={classes} {...rest}>
      {children}
    </NextLink>
  );
}
