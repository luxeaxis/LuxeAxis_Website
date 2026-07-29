export function SkipLink() {
  return (
    <a
      href="#main"
      // Every value here resolves to a design token. Before the theme exposed
      // the space, z-index and border-width scales, this line reached for
      // Tailwind's own left-4/px-4/z-50/outline-2 defaults — the first
      // component in the codebase, already breaking "tokens only".
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-header focus:rounded-md focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-on-surface focus:outline focus:outline-focus focus:outline-offset-focus focus:outline-focus-ring"
    >
      Skip to content
    </a>
  );
}
