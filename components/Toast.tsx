'use client';

/**
 * Toast — bottom-right, glass, ≤3 stacked, auto-dismiss with pause-on-hover/
 * focus (design system §3.5). Needs `"use client"`: it's a Context provider
 * with timers and a live announcement region, nothing about it is static.
 *
 * Provider + hook, not a bare component: §3.5's behaviour ("≤3 stacked",
 * "pausable", "manual close") only makes sense with a single shared queue —
 * any call site that wants to raise a toast has to reach a queue owned above
 * it, so `useToast()` is how the rest of the app pushes into it without
 * having to thread a prop down. `ToastProvider` is mounted once, in
 * `app/[locale]/layout.tsx`, alongside Header/Footer.
 *
 * Role split is the whole point of this set (brief): error toasts are
 * `role="alert"` (assertive), every other tone is `role="status"` (polite)
 * — `ariaRoleFor` (lib/status.ts) is the single place that decision lives,
 * shared with InlineAlert so the two can never drift apart on it. Per §3.5's
 * explicit "never the sole channel for critical info": a caller pushing an
 * error toast for something that blocks the user's task should still also
 * put the failure in-flow (e.g. an InlineAlert next to the form it belongs
 * to) — a toast can be missed (it auto-dismisses; a screen-reader user who
 * isn't in a position to switch focus to it right then hears it once, if at
 * all) and this component has no way to enforce that discipline on its
 * caller, so it's a rule for the call site, not something Toast itself can
 * guarantee.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { ariaRoleFor, STATUS_ICON, STATUS_TEXT_CLASS, type StatusTone } from '@/lib/status';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

export type ToastTone = StatusTone | 'neutral';

export type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Overrides the default 5s auto-dismiss dwell. 5000 is a literal taken
   *  verbatim from §3.5 ("auto-dismiss 5s") — a dwell time, not a
   *  `duration.*` token; those model transition durations (80–1200ms), not
   *  business-logic timers, the same distinction Header.tsx's
   *  `CONDENSE_THRESHOLD_PX` already establishes in this codebase. */
  durationMs?: number;
};

type ToastRecord = ToastInput & { id: string };

const DEFAULT_DURATION_MS = 5000;
// "≤3 stacked" (§3.5) — a 4th push drops the oldest rather than growing the
// stack or refusing the newest, most-relevant one.
const MAX_VISIBLE_TOASTS = 3;

type ToastContextValue = { push: (toast: ToastInput) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): (toast: ToastInput) => void {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast() must be called within a <ToastProvider>.');
  }
  return ctx.push;
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `toast-${idCounter}`;
}

function ToastCard({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: string) => void }) {
  const tone = toast.tone ?? 'neutral';
  const isStatusTone = tone !== 'neutral';
  // Two-phase entrance: mounts already off-position/transparent, then flips
  // to its resting state a frame later so the browser has a "from" value to
  // transition away from — a fresh toast has no earlier render to diff
  // against otherwise, and the transition would never visibly play (§3.5
  // "Slide-in ui+entrance"). Same technique Tooltip.tsx uses.
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  // `number`, not `ReturnType<typeof setTimeout>` — this file always calls
  // `window.setTimeout`/`window.clearTimeout` explicitly (never the bare
  // global), and `@types/node` (a devDependency, auto-included repo-wide)
  // otherwise makes the ambient `setTimeout` ambiguous between DOM's
  // `number` and Node's `NodeJS.Timeout`. `Window.setTimeout` is
  // unambiguous — it always returns `number` — so typing the ref that way
  // sidesteps the ambient overload conflict entirely.
  const timerRef = useRef<number | undefined>(undefined);
  const remainingRef = useRef(toast.durationMs ?? DEFAULT_DURATION_MS);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const startExit = useCallback(() => setExiting(true), []);

  const startTimer = useCallback(
    (ms: number) => {
      window.clearTimeout(timerRef.current);
      startedAtRef.current = Date.now();
      remainingRef.current = ms;
      timerRef.current = window.setTimeout(startExit, ms);
    },
    [startExit],
  );

  useEffect(() => {
    startTimer(remainingRef.current);
    return () => window.clearTimeout(timerRef.current);
  }, [startTimer]);

  const pause = () => {
    window.clearTimeout(timerRef.current);
    remainingRef.current -= Date.now() - startedAtRef.current;
  };
  const resume = () => {
    if (remainingRef.current > 0) startTimer(remainingRef.current);
  };

  return (
    <li
      role={ariaRoleFor(tone)}
      aria-atomic="true"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && exiting) onDismiss(toast.id);
      }}
      className={cx(
        'lx-glass pointer-events-auto w-full max-w-sm rounded-md border border-border-subtle p-4 shadow-2',
        'transition-[opacity,transform] duration-ui motion-reduce:transition-none',
        exiting
          ? 'ease-exit opacity-0 translate-y-[var(--motion-distance-lift)]'
          : visible
            ? 'ease-entrance opacity-100 translate-y-0'
            : 'ease-entrance opacity-0 translate-y-[var(--motion-distance-lift)]',
      )}
    >
      <div className="flex items-start gap-3">
        {isStatusTone && (
          <Icon name={STATUS_ICON[tone]} size="md" decorative className={cx('mt-0.5 shrink-0', STATUS_TEXT_CLASS[tone])} />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-ui text-small font-semibold text-on-surface">{toast.title}</p>
          {toast.description && <p className="mt-1 text-small text-on-surface-2">{toast.description}</p>}
        </div>
        <Button variant="icon" size="sm" icon="close" aria-label="Dismiss notification" onClick={startExit} />
      </div>
    </li>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const push = useCallback((input: ToastInput) => {
    setToasts((prev) => {
      const next = [...prev, { ...input, id: nextId() }];
      return next.length > MAX_VISIBLE_TOASTS ? next.slice(next.length - MAX_VISIBLE_TOASTS) : next;
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ol
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-toast flex flex-col-reverse items-stretch gap-3 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </ol>
    </ToastContext.Provider>
  );
}
