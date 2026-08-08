import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  loadLegalDocument,
  parseLegalMarkdown,
  slugify,
} from '@/lib/legal/document';
import type { Block, Inline } from '@/lib/legal/document';

/**
 * The legal documents.
 *
 * The failure this suite exists to prevent is a clause going missing. A parser
 * that drops a line renders a privacy policy that reads fine and no longer says
 * what the studio's lawyer wrote — and nothing about the page would look wrong.
 * So the central test is coverage of the source text, not a sample of outputs.
 */

const FILES = [
  'LuxeAxis_PrivacyPolicy.md',
  'LuxeAxis_TermsOfService.md',
] as const;

function flatten(blocks: Block[]): string {
  const inline = (nodes: Inline[]): string =>
    nodes
      .map((node) => (node.kind === 'gap' ? `[${node.label}]` : node.text))
      .join('');

  return blocks
    .map((block) => {
      switch (block.kind) {
        case 'heading':
          return block.text;
        case 'paragraph':
          return inline(block.content);
        case 'list':
          return block.items.map(inline).join(' ');
        case 'table':
          return block.rows
            .map((row) => `${inline(row.header)} ${inline(row.cells)}`)
            .join(' ');
        default:
          return '';
      }
    })
    .join('\n');
}

/** Strip the markup this parser consumes, leaving the words a reader sees. */
function words(source: string): string {
  return source
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

describe.each(FILES)('%s', (file) => {
  const source = readFileSync(
    join(process.cwd(), 'docs', 'Pages', file),
    'utf8',
  );
  const document = parseLegalMarkdown(source);
  const rendered = words(flatten(document.blocks));

  it('carries every sentence of the source through to the output', () => {
    // The whole point. Each source line that contains prose must appear in the
    // parsed document — a clause dropped by the parser is a clause the studio
    // believes it published.
    const missing = source
      .split('\n')
      .map((line) => line.trim())
      .filter(
        (line) =>
          line &&
          !/^#/.test(line) &&
          !/^---+$/.test(line) &&
          !/^\|[\s|:-]+\|$/.test(line) &&
          !/^\*\*(Effective date|Last updated):/.test(line) &&
          // The `| | |` header row of the two-column tables carries no text.
          !/^\|\s*\|\s*\|$/.test(line),
      )
      .map((line) => words(line.replace(/^-\s*/, '')))
      // A `[Bracketed placeholder]` is either substituted from studio.ts or
      // rendered as a gap marker, so the line will not survive verbatim. Split
      // on the placeholders and require every prose fragment around them to
      // appear — that still catches a dropped clause, which is the point.
      .flatMap((line) =>
        line.split(/\[[^\]]+\]/).map((fragment) => fragment.trim()),
      )
      .filter((fragment) => fragment.replace(/[\s,.]/g, '').length > 2)
      .filter((fragment) => !rendered.includes(fragment));

    expect(missing, 'these lines never reached the page').toEqual([]);
  });

  it('parses without falling back to raw markdown on the page', () => {
    // A `**` or a `](` surviving into the output means a construct the parser
    // did not recognise is being shown to the reader as source code.
    expect(rendered).not.toContain('**');
    expect(rendered).not.toContain('](');
  });

  it('gives every section a heading id, so a clause can be linked to', () => {
    const headings = document.blocks.filter(
      (block): block is Extract<Block, { kind: 'heading' }> =>
        block.kind === 'heading',
    );
    expect(headings.length).toBeGreaterThan(10);
    for (const heading of headings) {
      expect(heading.id, heading.text).toMatch(/^[a-z0-9-]+$/);
    }
    // Duplicate ids would make one of the two unreachable and are invalid HTML.
    const ids = headings.map((heading) => heading.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('placeholders', () => {
  const documents = FILES.map((file) => loadLegalDocument(file));

  function gaps(blocks: Block[]): string[] {
    const fromInline = (nodes: Inline[]) =>
      nodes.filter((node) => node.kind === 'gap').map((node) => node.label);
    return blocks.flatMap((block) => {
      switch (block.kind) {
        case 'paragraph':
          return fromInline(block.content);
        case 'list':
          return block.items.flatMap(fromInline);
        case 'table':
          return block.rows.flatMap((row) => [
            ...fromInline(row.header),
            ...fromInline(row.cells),
          ]);
        default:
          return [];
      }
    });
  }

  it('fills the facts the studio has already supplied', () => {
    // The drafts left the address, CIN and GSTIN bracketed. Those are known,
    // tested facts held in lib/content/studio.ts, so they are substituted from
    // there rather than typed in twice — a privacy policy naming a different
    // CIN from the footer is a discrepancy in a statutory identifier.
    for (const document of documents) {
      const outstanding = gaps(document.blocks);
      expect(outstanding).not.toContain('Registered office address');
      expect(outstanding).not.toContain('Corporate Identity Number');
      expect(outstanding).not.toContain('GSTIN');
      expect(outstanding).not.toContain('PIN');
    }

    const privacy = documents[0]!;
    const text = flatten(privacy.blocks);
    expect(text).toContain('U74102TN2026PTC194776');
    expect(text).toContain('33AAGCL9614E1ZM');
    expect(text).toContain('Nungambakkam');
  });

  it('leaves the grievance officer named as outstanding, never invented', () => {
    // A named individual, in the section that tells a Data Principal who to
    // complain to. Inventing one would be the worst fabrication available on
    // this site: it directs a statutory complaint at a person who does not
    // exist, and the DPDP Act requires the channel to actually work.
    for (const document of documents) {
      expect(gaps(document.blocks)).toContain('Name of Grievance Officer');
    }
  });

  it('does not publish a revision date it was never given', () => {
    // Both drafts say "[Insert publication date]". Which version binds you is
    // the first thing a reader of a policy needs, so this shows as a gap rather
    // than defaulting to today's date — a build date is not a revision date.
    for (const document of documents) {
      expect(document.updated).toBe('');
      expect(document.effective).toBe('1 May 2026');
    }
  });
});

describe('links out of the legal documents', () => {
  it('never renders an anchor to a page the site does not serve', () => {
    // Both documents link to a Cookie Policy four times over and no such page
    // exists. A legal document is the worst place on a site to ship a 404: the
    // privacy policy makes cookie consent conditional on a document it links
    // to, so a dead link there is a hole in the disclosure itself.
    const hrefs = FILES.flatMap((file) =>
      loadLegalDocument(file).blocks.flatMap((block) => {
        const nodes =
          block.kind === 'paragraph'
            ? block.content
            : block.kind === 'list'
              ? block.items.flat()
              : block.kind === 'table'
                ? block.rows.flatMap((row) => [...row.header, ...row.cells])
                : [];
        return nodes
          .filter((node) => node.kind === 'link')
          .map((node) => node.href);
      }),
    );

    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs).not.toContain('/cookies');
    // Everything still linked is a route this site actually serves.
    for (const href of hrefs) {
      expect(['/privacy', '/terms']).toContain(href);
    }
  });
});

describe('slugify', () => {
  it('drops the section number and keeps the name', () => {
    expect(slugify('4. Personal data we collect')).toBe(
      'personal-data-we-collect',
    );
    expect(slugify("11. Children's data")).toBe('children-s-data');
  });
});
