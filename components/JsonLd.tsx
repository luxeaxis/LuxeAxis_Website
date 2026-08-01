/**
 * Renders a structured-data block.
 *
 * `dangerouslySetInnerHTML` is the documented way to emit JSON-LD from React:
 * passing the JSON as a child would HTML-escape its quotes and produce a script
 * body that no parser accepts. The name is alarming and the usage is not — the
 * content is always our own, serialised from typed objects built in
 * `lib/seo/jsonLd.ts`, never anything a visitor supplied.
 *
 * One component per node rather than one merged graph: a malformed node is then
 * a malformed node, not a whole invalid document, and Google reads several
 * separate blocks on a page perfectly well.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
