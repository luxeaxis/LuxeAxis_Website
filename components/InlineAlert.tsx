/**
 * InlineAlert — in-flow banner: success/warning/error/info (design system
 * §3.5). A Server Component: the icon + copy + optional action is pure
 * markup — `action` is a `ReactNode` slot (a `<Button>`/`<Link>` the CALLER
 * wires up with its own handler), the same delegation Field uses for its
 * `error`/`success` strings, so InlineAlert itself never needs to own a
 * handler or go client.
 *
 * Role split is the whole point of this set (brief): errors are
 * `role="alert"` (assertive — interrupts); every other tone is
 * `role="status"` (polite — announced without interrupting). `ariaRoleFor`
 * (lib/status.ts) is the single place that split is decided, shared with
 * Toast so the two can never drift apart on it.
 */

import type { ReactNode } from 'react';
import { Icon } from './Icon';
import {
  ariaRoleFor,
  STATUS_ICON,
  STATUS_TEXT_CLASS,
  type StatusTone,
} from '@/lib/status';

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

export type InlineAlertProps = {
  tone: StatusTone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function InlineAlert({
  tone,
  title,
  children,
  action,
  className,
}: InlineAlertProps) {
  return (
    <div
      role={ariaRoleFor(tone)}
      className={cx(
        'flex gap-3 rounded-md border-hairline bg-surface-raised p-4',
        tone === 'success' && 'border-success',
        tone === 'warning' && 'border-warning',
        tone === 'error' && 'border-error',
        tone === 'info' && 'border-info',
        className,
      )}
    >
      <Icon
        name={STATUS_ICON[tone]}
        size="md"
        decorative
        className={cx('mt-0.5 shrink-0', STATUS_TEXT_CLASS[tone])}
      />
      <div className="min-w-0 flex-1">
        <p className="font-ui font-semibold text-on-surface">{title}</p>
        {children && (
          <div className="mt-1 text-small text-on-surface-2">{children}</div>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
