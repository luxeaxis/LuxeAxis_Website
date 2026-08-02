import { Fragment } from 'react';
import { Link } from '@/components/Link';
import { Stack } from '@/components/layout';
import { ToBePublished } from '@/components/ToBePublished';
import type { Block, Inline, LegalDocument as Document } from '@/lib/legal/document';

/**
 * Renders a parsed legal document.
 *
 * Long-form prose, so the measure is held tight and the vertical rhythm is
 * generous — someone reading a warranty clause is doing close reading, not
 * scanning. Headings carry ids so a clause can be linked to directly, which is
 * what people actually do with these pages ("see /terms#warranties").
 */

function Inlines({ content }: { content: Inline[] }) {
  return (
    <>
      {content.map((node, index) => {
        switch (node.kind) {
          case 'strong':
            return (
              <strong key={index} className="font-medium text-on-surface">
                {node.text}
              </strong>
            );
          case 'link':
            return (
              <Link key={index} href={node.href} variant="inline">
                {node.text}
              </Link>
            );
          case 'unpublished-link':
            // The words stay; the anchor does not. A legal document is the
            // worst place on a site to ship a link that 404s.
            return (
              <span key={index} className="text-on-surface">
                {node.text} (<ToBePublished />)
              </span>
            );
          case 'gap':
            return <ToBePublished key={index} label={node.label} />;
          default:
            return <Fragment key={index}>{node.text}</Fragment>;
        }
      })}
    </>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'heading':
            return block.level === 2 ? (
              <h2
                key={index}
                id={block.id}
                className="mt-8 font-display text-[length:var(--typography-h2-font-size)] text-on-surface"
              >
                {block.text}
              </h2>
            ) : (
              <h3
                key={index}
                id={block.id}
                className="mt-6 font-display text-[length:var(--typography-h3-font-size)] text-on-surface"
              >
                {block.text}
              </h3>
            );
          case 'list':
            return (
              <ul key={index} className="flex flex-col gap-2 pl-5 text-on-surface-2">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="list-disc">
                    <Inlines content={item} />
                  </li>
                ))}
              </ul>
            );
          case 'table':
            return (
              // Two-column label/value throughout, so a description list rather
              // than a table: there are no column headers to navigate by, and
              // <dt>/<dd> is what a screen reader announces as a pairing.
              <dl key={index} className="flex flex-col gap-3 border-l-regular border-accent pl-5">
                {block.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-col gap-1">
                    <dt className="font-ui text-small text-on-surface-muted">
                      <Inlines content={row.header} />
                    </dt>
                    <dd className="text-on-surface-2">
                      <Inlines content={row.cells} />
                    </dd>
                  </div>
                ))}
              </dl>
            );
          case 'rule':
            // Decorative: these separate sections that already have headings,
            // so announcing them adds nothing.
            return <hr key={index} aria-hidden="true" className="border-border-subtle" />;
          default:
            return (
              <p key={index} className="text-on-surface-2">
                <Inlines content={block.content} />
              </p>
            );
        }
      })}
    </>
  );
}

export function LegalDocument({ document }: { document: Document }) {
  return (
    <Stack gap={5} className="max-w-measure">
      <Stack gap={2}>
        <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
          {document.title}
        </h1>
        {/* Which version binds you is the first thing a reader of a policy
            needs. An unfilled revision date is shown as the gap it is rather
            than quietly omitted. */}
        <p className="font-ui text-small text-on-surface-muted">
          Effective {document.effective || <ToBePublished>Effective date to be published</ToBePublished>} · Last
          updated {document.updated || <ToBePublished>revision date to be published</ToBePublished>}
        </p>
      </Stack>
      <Blocks blocks={document.blocks} />
    </Stack>
  );
}
