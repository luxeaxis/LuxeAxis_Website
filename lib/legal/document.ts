import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { STUDIO, addressOneLine } from '@/lib/content/studio';

/**
 * The legal documents, read from `docs/Pages/*.md` at build time.
 *
 * The markdown files stay the source of truth rather than being transcribed
 * into TSX. A privacy policy and a terms of service are drafted and revised by
 * a lawyer, and asking them to edit JSX — or transcribing their edits by hand
 * every round — is how a clause quietly changes meaning. They send a markdown
 * file; it renders.
 *
 * This is a parser for the subset those two documents actually use, not a
 * markdown implementation. Anything outside the subset is a parse error rather
 * than something silently dropped, because a legal document losing a clause on
 * the way to the page is the failure that matters here. `tests/unit/legal.test`
 * additionally checks that every source line reaches the output.
 */

export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'strong'; text: string }
  | { kind: 'link'; text: string; href: string }
  /** A link whose target does not exist yet. Rendered as the visible words plus
   *  an explicit marker, never as a dead anchor — see `UNPUBLISHED_ROUTES`. */
  | { kind: 'unpublished-link'; text: string }
  /** A `[Bracketed placeholder]` the studio has not supplied a value for. */
  | { kind: 'gap'; label: string };

export type Block =
  | { kind: 'heading'; level: 2 | 3; text: string; id: string }
  | { kind: 'paragraph'; content: Inline[] }
  | { kind: 'list'; items: Inline[][] }
  | { kind: 'table'; rows: { header: Inline[]; cells: Inline[] }[] }
  | { kind: 'rule' };

export type LegalDocument = {
  title: string;
  effective: string;
  updated: string;
  blocks: Block[];
};

/**
 * Routes these documents link to that the site does not serve.
 *
 * Both documents point at a Cookie Policy four times over, and no such page
 * exists. A legal document is the worst place on a site to ship a 404: the
 * privacy policy makes cookie consent conditional on a document it links to,
 * so a dead link there is a gap in the disclosure itself rather than a broken
 * nav item. The words are kept and the anchor is not, which states the gap
 * instead of hiding it behind a link that fails on click.
 */
const UNPUBLISHED_ROUTES = new Set(['/cookies']);

/**
 * Values the studio has already supplied, substituted into the `[Bracketed]`
 * placeholders the drafts left open.
 *
 * Only facts that exist elsewhere in the codebase and are tested there. The
 * grievance officer's name is deliberately absent: it is a named individual,
 * and inventing one in the section that tells a Data Principal who to complain
 * to would be the single worst fabrication on the site.
 */
function substitutions(): Record<string, string> {
  const address = STUDIO.address ? addressOneLine(STUDIO.address) : null;
  return {
    ...(address ? { '[Registered office address]': address } : {}),
    ...(STUDIO.address?.postalCode ? { '[PIN]': STUDIO.address.postalCode } : {}),
    ...(STUDIO.cin ? { '[Corporate Identity Number]': STUDIO.cin } : {}),
    ...(STUDIO.gst ? { '[GSTIN]': STUDIO.gst } : {}),
  };
}

/** `## 4. Personal data we collect` → `personal-data-we-collect`. */
export function slugify(text: string): string {
  return text
    .replace(/^\d+\.\s*/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Inline markup: `**bold**`, `[text](/href)`, and `[Placeholder]`.
 *
 * One pass with a single alternation rather than sequential replaces, so that
 * a link's own text cannot be re-scanned and mistaken for a placeholder — the
 * bug that would turn `[Cookie Policy](/cookies)` into a gap marker.
 */
function parseInline(source: string): Inline[] {
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)|\[([^\]]+)\]/g;
  const out: Inline[] = [];
  let last = 0;

  for (const match of source.matchAll(pattern)) {
    const index = match.index!;
    if (index > last) out.push({ kind: 'text', text: source.slice(last, index) });
    last = index + match[0].length;

    if (match[1] !== undefined) {
      out.push({ kind: 'strong', text: match[1] });
    } else if (match[2] !== undefined && match[3] !== undefined) {
      out.push(
        UNPUBLISHED_ROUTES.has(match[3])
          ? { kind: 'unpublished-link', text: match[2] }
          : { kind: 'link', text: match[2], href: match[3] },
      );
    } else if (match[4] !== undefined) {
      const filled = substitutions()[`[${match[4]}]`];
      out.push(filled ? { kind: 'text', text: filled } : { kind: 'gap', label: match[4] });
    }
  }

  if (last < source.length) out.push({ kind: 'text', text: source.slice(last) });
  return out;
}

/** A `| a | b |` row, split on unescaped pipes. */
function tableCells(line: string): string[] {
  return line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isDivider(line: string): boolean {
  return /^\|[\s|:-]+\|$/.test(line);
}

export function parseLegalMarkdown(source: string): LegalDocument {
  const lines = source.split('\n');
  const blocks: Block[] = [];
  let title = '';
  let effective = '';
  let updated = '';

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]!;
    const trimmed = line.trim();

    if (!trimmed) continue;
    // `---` is both a horizontal rule and the separator these documents put
    // between sections. Rendered as a rule; harmless either way.
    if (/^---+$/.test(trimmed)) {
      blocks.push({ kind: 'rule' });
      continue;
    }
    if (trimmed.startsWith('# ')) {
      title = trimmed.slice(2).trim();
      continue;
    }
    if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4).trim();
      blocks.push({ kind: 'heading', level: 3, text, id: slugify(text) });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3).trim();
      blocks.push({ kind: 'heading', level: 2, text, id: slugify(text) });
      continue;
    }

    // The two dated lines in the front matter, lifted out so the page can put
    // them where a reader looks for them rather than mid-prose.
    const dated = /^\*\*(Effective date|Last updated):\*\*\s*(.+)$/.exec(trimmed);
    if (dated) {
      const value = dated[2]!.trim();
      // "[Insert publication date]" is not a date. Left empty so the page shows
      // a gap: a policy whose own revision date is a stub tells the reader
      // nothing about which version binds them.
      const resolved = value.startsWith('[') ? '' : value;
      if (dated[1] === 'Effective date') effective = resolved;
      else updated = resolved;
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const items: Inline[][] = [];
      while (i < lines.length && lines[i]!.trim().startsWith('- ')) {
        items.push(parseInline(lines[i]!.trim().slice(2).trim()));
        i += 1;
      }
      i -= 1;
      blocks.push({ kind: 'list', items });
      continue;
    }

    if (trimmed.startsWith('|')) {
      const rows: { header: Inline[]; cells: Inline[] }[] = [];
      while (i < lines.length && lines[i]!.trim().startsWith('|')) {
        const current = lines[i]!.trim();
        i += 1;
        if (isDivider(current)) continue;
        const cells = tableCells(current);
        // Every table in these documents is a two-column label/value list, so
        // the first cell is the row header. A wider table would need a real
        // <thead>, and the parse error below is how we would find out.
        if (cells.length !== 2) {
          throw new Error(`legal markdown: expected a 2-column row, got: ${current}`);
        }
        // The first row of the CIN/GSTIN tables is an empty `| | |` header.
        if (!cells[0] && !cells[1]) continue;
        rows.push({ header: parseInline(cells[0]!), cells: parseInline(cells[1]!) });
      }
      i -= 1;
      if (rows.length > 0) blocks.push({ kind: 'table', rows });
      continue;
    }

    blocks.push({ kind: 'paragraph', content: parseInline(trimmed) });
  }

  return { title, effective, updated, blocks };
}

/** Reads and parses one of the documents in `docs/Pages/`. */
export function loadLegalDocument(file: string): LegalDocument {
  return parseLegalMarkdown(readFileSync(join(process.cwd(), 'docs', 'Pages', file), 'utf8'));
}
