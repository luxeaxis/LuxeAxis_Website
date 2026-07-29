'use client';

/**
 * Button — the single most policed component in the system: the site's whole
 * job is routing the eye to one primary action, so hierarchy (§3.1) and the
 * full state set (§4) are non-negotiable here.
 *
 * `"use client"` even though every visual state (hover/focus/active) is pure
 * CSS: Button is a leaf control meant to be dropped straight into Server
 * Component pages while still accepting `onClick`/`onChange`-style handlers
 * from whatever client boundary composes it — that requires the component
 * itself to own the client/server split, the same reasoning the brief gives
 * for why Button (unlike Icon) needs the directive.
 */

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

/** Strips every prop this component models off a copy of `props`, leaving
 *  only genuine native attributes (href, onClick, type, form, name…) behind
 *  to forward to the underlying element. Destructuring those fields out by
 *  name instead (`const { variant, size, ... } = props`) would need each one
 *  bound to an unused local, which `@typescript-eslint/no-unused-vars`
 *  (enabled repo-wide, `--max-warnings 0`) rejects without an ignore-pattern
 *  exemption that isn't configured here. */
function omitKnownProps(props: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...props };
  for (const key of [
    'variant',
    'size',
    'loading',
    'disabled',
    'className',
    'as',
    'children',
    'icon',
    'iconLeading',
    'iconTrailing',
    'aria-label',
  ]) {
    delete rest[key];
  }
  return rest;
}

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Closed unions -> lookups, never a template class name (`h-control-${size}`
// resolves to nothing at build time — see components/layout.tsx's GAP for
// the same Tailwind-JIT constraint).
const HEIGHT: Record<ButtonSize, string> = {
  sm: 'h-control-sm',
  md: 'h-control-md',
  lg: 'h-control-lg',
};
const WIDTH: Record<ButtonSize, string> = {
  sm: 'w-control-sm',
  md: 'w-control-md',
  lg: 'w-control-lg',
};

// Spec: "Min touch 44 (pad hit area on sm)" — sm's visual box is 36px, 8px
// short of the 44px touch minimum. Rather than growing the visual control
// (which would break the sm/md/lg rhythm), an invisible ::before pseudo-
// element expands the hit region by `space.1` (4px) a side — a real token,
// not a magic "4px". Only sm needs it; md/lg already meet the minimum.
const TEXT_HIT_PAD: Record<ButtonSize, string | false> = {
  sm: "before:absolute before:content-[''] before:-inset-y-1 before:inset-x-0",
  md: false,
  lg: false,
};
const ICON_HIT_PAD: Record<ButtonSize, string | false> = {
  sm: "before:absolute before:content-[''] before:-inset-1",
  md: false,
  lg: false,
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-contrast hover:bg-accent-hover',
  secondary:
    'bg-transparent border-regular border-border-strong text-on-surface hover:border-accent',
  tertiary:
    'bg-transparent text-accent underline decoration-[length:var(--border-width-regular)] underline-offset-4 hover:text-accent-hover',
  icon: 'rounded-round border-regular border-border-subtle text-on-surface-2 hover:border-border hover:text-on-surface',
  destructive: 'bg-transparent border-regular border-error text-error hover:bg-error hover:text-accent-contrast',
};

/** The one persistent motion the spec allows outside skeleton shimmer (§3.1
 *  Motion, §3.6). `animate-spin` isn't duration/easing-tokenised — there is
 *  no token for "indeterminate spin" — so this is the one place motion isn't
 *  fully token-driven; `motion-reduce:animate-none` stops it under reduced
 *  motion at the component level rather than leaning on the global CSS
 *  safety net alone (globals.css already collapses it via
 *  `animation-duration`, but the brief asks components not to depend on
 *  that alone). */
function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-icon-md w-icon-md animate-spin motion-reduce:animate-none [stroke-width:var(--border-width-regular)]"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

type ButtonShared = {
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

// Labelled variants (primary/secondary/tertiary/destructive): the accessible
// name comes from `children`; leading/trailing icons are decorative accents.
type LabelledVariantProps = {
  variant?: Exclude<ButtonVariant, 'icon'>;
  children: ReactNode;
  icon?: never;
  iconLeading?: IconName;
  iconTrailing?: IconName;
};

// Icon-only control: there is no text for the accessible name to fall back
// on, so `aria-label` is required — a plain `string`, not `string | undefined`
// — making a silent icon-only button impossible to compile, not just an
// audit finding.
type IconOnlyVariantProps = {
  variant: 'icon';
  children?: never;
  icon: IconName;
  iconLeading?: never;
  iconTrailing?: never;
  'aria-label': string;
};

type ButtonVariantProps = LabelledVariantProps | IconOnlyVariantProps;

type ButtonAsButton = { as?: 'button'; href?: never } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'disabled'
>;

type ButtonAsAnchor = { as: 'a'; href: string } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className'
>;

type ButtonElementProps = ButtonAsButton | ButtonAsAnchor;

export type ButtonProps = ButtonShared & ButtonVariantProps & ButtonElementProps;

export function Button(props: ButtonProps) {
  const { size = 'md', loading = false, disabled = false, className, as = 'button' } = props;
  const variant: ButtonVariant = props.variant ?? 'primary';
  const isIconOnly = variant === 'icon';
  // "Loading" locks activation the same way "disabled" does (no double
  // submits), but only `disabled` gets the dimmed 0.4-opacity treatment —
  // they are listed as separate rows in the global states table (§4), and a
  // button mid-submit isn't meant to read as broken/unavailable the way a
  // genuinely disabled one is.
  const isInert = disabled || loading;

  const base = cx(
    'group relative inline-flex items-center justify-center gap-2',
    'font-medium overflow-hidden whitespace-nowrap',
    'transition-colors duration-micro ease-standard',
    'active:scale-press motion-reduce:active:scale-100',
    'focus-visible:outline focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-focus-ring',
    disabled && 'opacity-disabled',
    isIconOnly ? 'rounded-round' : 'rounded-pill',
    HEIGHT[size],
    isIconOnly ? WIDTH[size] : 'px-5',
    isIconOnly ? ICON_HIT_PAD[size] : TEXT_HIT_PAD[size],
    VARIANT_CLASS[variant],
    className,
  );

  // Narrowing on `props.variant === 'icon'` directly (rather than the
  // `isIconOnly` convenience boolean above) is what lets TS discriminate the
  // union here — `props.icon`/`props.children` would otherwise still type
  // as possibly-undefined, since a derived local boolean carries no type
  // information back to the compiler.
  const content = props.variant === 'icon' ? (
    <>
      <span className={cx('inline-flex', loading && 'opacity-0')}>
        <Icon name={props.icon} size="md" decorative />
      </span>
      {loading && (
        <span className="absolute inset-0 inline-flex items-center justify-center" aria-hidden="true">
          <Spinner />
        </span>
      )}
    </>
  ) : (
    <>
      <span className={cx('inline-flex items-center gap-2', loading && 'opacity-0')}>
        {props.iconLeading && <Icon name={props.iconLeading} size="md" decorative />}
        {props.children}
        {props.iconTrailing && (
          <Icon
            name={props.iconTrailing}
            size="md"
            decorative
            className="transition-transform duration-micro ease-standard group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        )}
      </span>
      {loading && (
        <span
          className="absolute inset-0 inline-flex items-center justify-center gap-2 truncate px-5"
          aria-hidden="true"
        >
          <Spinner />
          <span className="truncate">Working…</span>
        </span>
      )}
    </>
  );

  const ariaLabel = props['aria-label'];

  // `rest` is left holding only genuine native attributes (href, onClick,
  // type, form, name…) to forward — spreading the raw union straight onto
  // the DOM node would leak props like `iconLeading` as unrecognised HTML
  // attributes. TS can't narrow this across a discriminated union by key
  // alone, hence the cast to a plain record; the `as === 'a'` branch below
  // re-narrows the element type properly before anything is rendered.
  const rest = omitKnownProps(props as unknown as Record<string, unknown>);

  if (as === 'a') {
    const { href, onClick, ...anchorRest } = rest as { href?: string; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void };
    const handleClick = isInert ? (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault() : onClick;
    return (
      <a
        {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={isInert ? undefined : href}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        aria-disabled={isInert || undefined}
        onClick={handleClick}
        className={base}
      >
        {content}
      </a>
    );
  }

  const { type = 'button', ...buttonRest } = rest as { type?: 'button' | 'submit' | 'reset' };
  return (
    <button
      {...(buttonRest as ButtonHTMLAttributes<HTMLButtonElement>)}
      type={type}
      disabled={isInert}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={base}
    >
      {content}
    </button>
  );
}
