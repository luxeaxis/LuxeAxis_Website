import { Link } from './Link';
import { Stack } from './layout';
import type { Faq as FaqItem } from '@/lib/content/types';

/**
 * The FAQ accordion (Build Backlog T-15/T-18).
 *
 * Built on native `<details>`/`<summary>` rather than a JS disclosure widget,
 * and that is the whole design:
 *
 * - It works with no JavaScript, which matters because Landing Blueprint §3.7
 *   calls FAQs "a pure reading/answer-seeking task" — the one content type a
 *   visitor most needs to succeed at on a bad connection.
 * - The open/closed state, the button semantics and keyboard operation
 *   (Enter/Space, and the browser's own find-in-page expanding a closed
 *   section) all come from the platform. A hand-rolled version reproduces
 *   maybe three of those four, and never the last one.
 * - It is a Server Component. No `"use client"`, no bundle cost at all.
 *
 * §3.7 also gives the strongest possible verdict on decoration here: "ZERO 3D
 * (hurts). Any 3D is distraction that slows the answer the visitor came for.
 * Flat, fast, accessible. Full stop." So there is no motion beyond the marker
 * rotation, and no reveal.
 *
 * Each answer ends with a soft CTA link where the content layer supplies one,
 * per §3.7's "each answer ends with a soft CTA link".
 */
export function Faq({ items }: { items: readonly FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <Stack gap={0} as="div" className="max-w-measure">
      {items.map((item) => (
        <details
          key={item.id}
          className="group lx-liquid-glass-card rounded-xl p-5 mb-3.5 border border-accent/20 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer items-start justify-between gap-4 font-ui font-semibold text-on-surface focus-visible:outline focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-focus-ring">
            {item.question}
            {/* A CSS-drawn chevron rather than the Icon component: `Icon` would
                need a rotation class per state, and `group-open:` on a pure
                shape keeps the whole thing declarative. `aria-hidden` because
                `<summary>` already announces its own expanded state. */}
            <span
              aria-hidden="true"
              className="mt-1 h-2 w-2 shrink-0 rotate-45 border-b-regular border-r-regular border-accent transition-transform duration-micro ease-standard group-open:-rotate-135 motion-reduce:transition-none"
            />
          </summary>
          <div className="pt-3">
            <p className="text-on-surface-2">{item.answer}</p>
            {item.link && (
              <p className="mt-3">
                <Link
                  href={item.link.href}
                  variant="inline"
                  className="text-small"
                >
                  {item.link.label}
                </Link>
              </p>
            )}
          </div>
        </details>
      ))}
    </Stack>
  );
}

/**
 * `FAQPage` structured data (Landing Blueprint §3.7: "schema markup
 * (`FAQPage`) for SEO").
 *
 * Emitted from the SAME `items` the accordion renders, never a hand-kept
 * parallel copy — Google treats structured data that disagrees with the visible
 * page as a spam signal, and a second list is the obvious way to end up there.
 *
 * `dangerouslySetInnerHTML` is the documented way to emit JSON-LD in React:
 * putting the object in as a child would HTML-escape the quotes and produce
 * invalid JSON. The content is our own, built from typed data, not user input.
 */
export function FaqJsonLd({ items }: { items: readonly FaqItem[] }) {
  if (items.length === 0) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
