/**
 * Progress — determinate loading bar (design system §3.6). A Server
 * Component: `value` is caller-driven data, not internal state, so there is
 * nothing here that needs a client boundary.
 *
 * "Progress must be honest" (brief) is why this component has no
 * indeterminate mode at all — §3.6 draws the line explicitly ("skeletons
 * for layout-shaped waits, spinners only for indeterminate in-place waits,
 * progress for determinate… honest %, never fake"). A caller with no real
 * percentage to report wants Skeleton or Button's `loading` spinner, not
 * this component animating toward a number it doesn't have.
 *
 * The brief's other Progress rule — "every loader needs a timeout path to a
 * friendly error and retry, never an infinite spin" — is a property of the
 * ASYNC OPERATION driving `value` forward (a file upload, a report job),
 * which only the caller can know how to time out and retry. This component
 * has no concept of elapsed time; it renders whatever `value` it's handed
 * this render. A caller wiring a real upload should pair this with
 * InlineAlert (tone="error", an action to retry) once its own timeout
 * fires — the same delegation Field uses for validation copy.
 */

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

export type ProgressProps = {
  /** 0–100. Values outside that range are clamped, not rejected — a caller
   *  computing a percentage from float division shouldn't have to guard
   *  against 100.0000001 itself. */
  value: number;
  /** The accessible name — "no invented copy": this component will not
   *  guess what's loading, the caller states it (e.g. "Uploading floor
   *  plan"). Also shown visually above the bar. */
  label: string;
  /** Optional step detail below the bar (e.g. "File 2 of 4"). */
  helpText?: string;
  className?: string;
};

export function Progress({ value, label, helpText, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const rounded = Math.round(clamped);

  return (
    <div className={cx('w-full', className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-small text-on-surface-2">{label}</span>
        <span className="font-mono text-small tabular-nums text-on-surface-muted" aria-hidden="true">
          {rounded}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={rounded}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-pill bg-surface-raised"
      >
        <div
          className="h-full rounded-pill bg-accent transition-[width] duration-ui ease-standard motion-reduce:transition-none"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {helpText && <p className="mt-2 text-small text-on-surface-muted">{helpText}</p>}
    </div>
  );
}
