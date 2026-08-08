'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';

/**
 * `Reveal` and `Stagger` — the section rise-in pattern (Build Backlog T-22,
 * Spec §9.1 S1: "Text/blocks fade + 16px rise, stagger 80ms, `--dur-3` /
 * ease-entrance. Reduced-motion: content visible in place, no transform").
 *
 * ## Visible by default, hidden only once we know we can un-hide it
 *
 * The obvious implementation — render at `opacity: 0` and fade in — breaks the
 * site for anyone whose JavaScript fails, and "fails" includes a dropped chunk
 * on hotel wifi, not just a disabled setting. Every section on this site would
 * be permanently invisible, which is a far worse outcome than no animation.
 *
 * So the server renders content in its FINAL state. The component only hides an
 * element after it has confirmed, on the client, that it can also show it
 * again. If any step of that fails, the page is simply not animated.
 *
 * ## Above-the-fold content is never animated
 *
 * If an element is already in the viewport when it mounts, it stays visible and
 * skips the animation entirely. That is not an optimisation, it is the
 * requirement: the hero headline is the LCP element (Landing Blueprint §1), and
 * fading it in delays first meaningful paint to buy nothing — the visitor is
 * looking at it before any animation could finish. Rise-in is for content the
 * visitor scrolls to, which is the only content where "rising in" means
 * anything.
 *
 * `useLayoutEffect` rather than `useEffect` so the hide happens before the
 * browser paints, which is what stops a below-the-fold element flashing at full
 * opacity on slow hydration.
 *
 * ## Reduced motion is checked here, not only in CSS
 *
 * globals.css collapses every transition to ~0ms under `prefers-reduced-motion`,
 * which would technically satisfy the spec. This checks `matchMedia` as well and
 * never applies the hidden state at all, so a reduced-motion visitor's DOM is
 * genuinely identical to the un-animated one rather than merely arriving fast.
 * `tests/e2e/motion.spec.ts` asserts that parity by comparing computed styles.
 */

/** Matches the CSS in globals.css. `idle` means "no reveal styling at all" —
 *  the state everything starts and, for reduced motion, stays in. */
type RevealState = 'idle' | 'hidden' | 'shown';

/** Spec §2.3: "stagger siblings by 60–90ms". S1 names 80ms. */
export const STAGGER_STEP_MS = 80;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Reveal({
  children,
  as: Tag = 'div',
  delayMs = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Set by `Stagger` for siblings; rarely passed by hand. */
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<RevealState>('idle');

  useLayoutEffect(() => {
    const node = ref.current;
    // No node, no IntersectionObserver (old browsers, some test environments),
    // or a stated preference for less motion — all three mean "leave it alone",
    // and all three land on the same correct outcome: visible, unanimated.
    if (
      !node ||
      typeof IntersectionObserver === 'undefined' ||
      prefersReducedMotion()
    )
      return;

    // Already on screen: this is above-the-fold content. Do not touch it.
    const box = node.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    setState('hidden');
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (state !== 'hidden' || !node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setState('shown');
        // Once only (S1: "In-view (once)"). Re-animating on every scroll past
        // is the thing that makes a page feel restless rather than composed.
        observer.disconnect();
      },
      // No `rootMargin`, deliberately.
      //
      // A negative bottom margin ("start the reveal once the element has
      // properly entered, rather than on its first pixel") is the tempting
      // refinement, and it shrinks the observation box: anything that comes to
      // rest inside that bottom band — a short last section on a page that
      // cannot scroll further — would never intersect, and would stay at
      // opacity 0 for good.
      //
      // Triggering on the first pixel cannot strand anything, and costs
      // almost nothing here: the movement is 16px over 480ms, so a slightly
      // early start is imperceptible where invisible content would not be.
      // Given that the whole component is built around failing open, the
      // refinement is not worth the class of bug it introduces.
      undefined,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [state]);

  return (
    <Tag
      ref={ref}
      data-reveal={state === 'idle' ? undefined : state}
      style={
        delayMs
          ? ({ '--reveal-delay': `${delayMs}ms` } as React.CSSProperties)
          : undefined
      }
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveals its children in sequence, 80ms apart.
 *
 * Takes an array of nodes rather than wrapping arbitrary children, because the
 * delay has to be computed per child and there is no way to do that for an
 * opaque `ReactNode` without cloning elements and hoping they accept a style
 * prop. An explicit list is honest about what it can stagger.
 */
export function Stagger({
  items,
  as: Tag = 'div',
  itemAs,
  className,
  itemClassName,
}: {
  items: readonly ReactNode[];
  as?: ElementType;
  itemAs?: ElementType;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <Tag className={className}>
      {items.map((item, index) => (
        <Reveal
          key={index}
          as={itemAs}
          delayMs={index * STAGGER_STEP_MS}
          className={itemClassName}
        >
          {item}
        </Reveal>
      ))}
    </Tag>
  );
}
