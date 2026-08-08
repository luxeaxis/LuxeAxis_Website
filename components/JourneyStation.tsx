import type { ReactNode } from 'react';

/**
 * Wraps one section as a journey station.
 *
 * Three attributes, each doing one job — and the reason this is a component
 * rather than three classes copied into nine sections is that forgetting any
 * one of them breaks the journey in a way that is invisible until someone tests
 * with a keyboard.
 *
 * ## `tabIndex={-1}`
 *
 * Makes the section a valid target for `element.focus()` without putting it in
 * the Tab order. This is what lets journey navigation move focus rather than
 * scroll: focus moves, the browser scrolls the section into view itself using
 * `scroll-padding-top` and the visitor's own reduced-motion setting, and a
 * screen reader announces the section by its accessible name on arrival.
 *
 * Without it, `focus()` silently does nothing on a `<section>`, navigation
 * appears to work for mouse users, and keyboard users are left at the top of
 * the document with their next Tab landing somewhere unrelated.
 *
 * ## `scroll-snap-align: start`
 *
 * The "guided" rhythm, implemented by the browser. Native snapping keeps
 * trackpad momentum, keyboard paging, find-in-page and screen-reader virtual
 * cursors intact — all of which a JS scroll-jacker breaks. It is also trivially
 * switched off for reduced motion, in CSS, with no JavaScript involved.
 *
 * ## `data-station`
 *
 * The hook `JourneyProvider`'s IntersectionObserver and the e2e suite both
 * query. A data attribute rather than a class so restyling cannot break
 * behaviour.
 */
export function JourneyStation({
  id,
  children,
  className = '',
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      id={id}
      data-station={id}
      tabIndex={-1}
      // `scroll-mt` matches the sticky header so a snapped or focused station
      // is not hidden behind it. globals.css sets `scroll-padding-top` for
      // anchor navigation; this is the same offset for snap alignment, and the
      // two must stay equal.
      className={`lx-station scroll-mt-[calc(var(--component-nav-height)+var(--space-4))] focus:outline-none ${className}`}
    >
      {children}
    </div>
  );
}
