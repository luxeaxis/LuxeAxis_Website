/**
 * Icon — 1.5px stroke, rounded joins, `currentColor`, from a small closed set
 * (see spec §3.1 anatomy / §5 "never colour-only"). A Server Component: pure
 * markup, no state or handlers, so it never needs `"use client"`.
 *
 * Icon-only usage requires an accessible label — the spec calls this out as
 * a rule that's easy to break silently, so it is enforced in the type, not
 * just in a comment: callers must pass either `label` (the icon stands
 * alone, e.g. a bare icon button) or `decorative` (the icon sits next to its
 * own visible text and would be redundant to a screen reader). There is no
 * default for either — omitting both is a compile error, not a silent a11y
 * gap.
 */

export type IconName =
  | 'arrow-right'
  | 'chevron-down'
  | 'chevron-left'
  | 'close'
  | 'check'
  | 'alert-circle';

export type IconSize = 'sm' | 'md' | 'lg';

// Closed union -> lookup, not a template literal: Tailwind can't resolve a
// class name assembled at runtime (`h-icon-${size}` emits no CSS at all —
// see components/layout.tsx's GAP for the same constraint on gap-*).
const DIMENSION: Record<IconSize, string> = {
  sm: 'h-icon-sm w-icon-sm',
  md: 'h-icon-md w-icon-md',
  lg: 'h-icon-lg w-icon-lg',
};

const PATHS: Record<IconName, React.ReactNode> = {
  'arrow-right': <path d="M4 12h16M13 5l7 7-7 7" />,
  'chevron-down': <path d="M5 8.5l7 7 7-7" />,
  'chevron-left': <path d="M15.5 5l-7 7 7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M4.5 12.5l5 5L19.5 7" />,
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.75v5.5" />
      <path d="M12 16.25h.01" />
    </>
  ),
};

type IconBaseProps = {
  name: IconName;
  size?: IconSize;
  className?: string;
};

type IconLabelledProps = IconBaseProps & { label: string; decorative?: false };
type IconDecorativeProps = IconBaseProps & { label?: undefined; decorative: true };

export type IconProps = IconLabelledProps | IconDecorativeProps;

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

export function Icon(props: IconProps) {
  const { name, size = 'md', className } = props;
  const a11y = props.decorative
    ? { 'aria-hidden': true as const }
    : { role: 'img' as const, 'aria-label': props.label };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      // border-width.regular (1.5px) is the token that names itself "Icon
      // stroke / default" — referenced via the CSS var it emits rather than
      // the bare number, through Tailwind's arbitrary-property syntax, so
      // this is still "tokens only" rather than a literal 1.5.
      className={cx('[stroke-width:var(--border-width-regular)]', DIMENSION[size], className)}
      {...a11y}
    >
      {PATHS[name]}
    </svg>
  );
}
