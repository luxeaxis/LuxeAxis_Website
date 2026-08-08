import { describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';
import { resolve } from 'node:path';

/** Lints `code` as if it were `relativeFilePath` (repo-root-relative) and
 *  returns the seam-relevant messages: both rules the seam is enforced
 *  through (`no-restricted-imports` for static imports, `no-restricted-syntax`
 *  for dynamic `import()`, which the former cannot see at all). */
async function lintSeam(code: string, relativeFilePath: string) {
  const eslint = new ESLint({
    overrideConfigFile: resolve(__dirname, '../../eslint.config.mjs'),
  });
  const [result] = await eslint.lintText(code, {
    filePath: resolve(__dirname, '../..', relativeFilePath),
  });
  return (result?.messages ?? []).filter(
    (m) =>
      m.ruleId === 'no-restricted-imports' ||
      m.ruleId === 'no-restricted-syntax',
  );
}

const SEAM_MESSAGE = 'WebGL/three.js was descoped';

/** Every directory that is a real consumer of three/ (i.e. everything the
 *  repo-wide seam block in eslint.config.mjs is meant to cover, minus three/
 *  itself, which is deliberately exempt). `components/` is where SceneSlot
 *  lives and was the only directory the original suite probed; but the
 *  documented failure mode — a later `files:`-scoped config block replacing
 *  a rule's options wholesale instead of merging them — is not
 *  directory-specific. eslint.config.mjs currently has exactly one such
 *  directory-scoped override (components/, which re-adds a features/
 *  restriction), but the next one could just as easily land on app/ or
 *  features/ — and app/page.tsx already imports SceneSlot, making
 *  app/ a live candidate today, not a hypothetical. Probing all four keeps
 *  the suite honest about the repo-wide claim it's meant to guard. */
const SEAM_DIRS = ['components', 'app', 'features', 'lib'];

/** The DOM→WebGL seam is the architecture's single most load-bearing
 *  constraint (spec §1.2) and it has already been silently disabled twice on
 *  this branch: once when a `files:`-scoped `no-restricted-imports` block
 *  replaced rather than merged the repo-wide pattern (ESLint flat config
 *  replaces a rule's options wholesale per matching block, it does not merge
 *  `patterns` arrays), and again when the enforced pattern only covered the
 *  `@/three/**` alias spelling — leaving relative imports (`../three/...`),
 *  the bare `three` npm package, `@react-three/*`, and dynamic `import()`
 *  all open. This suite probes every one of those five spellings, from each
 *  of SEAM_DIRS, and fails if any of them ever goes unenforced again in any
 *  of those directories. */
for (const dir of SEAM_DIRS) {
  describe(`the three/ seam is enforced under ${dir}/`, () => {
    it('flags the @/three/** alias spelling', async () => {
      const messages = await lintSeam(
        "import x from '@/three/internal/whatever';\nexport default x;\n",
        `${dir}/__seam-probe-alias.tsx`,
      );
      const seam = messages.filter((m) => m.ruleId === 'no-restricted-imports');
      expect(
        seam.length,
        `expected no-restricted-imports to fire on the @/three/** alias spelling under ${dir}/`,
      ).toBeGreaterThan(0);
      expect(seam[0]?.message).toContain(SEAM_MESSAGE);
    });

    it('flags the relative-path spelling (../three/**)', async () => {
      const messages = await lintSeam(
        "import x from '../three/internal/whatever';\nexport default x;\n",
        `${dir}/__seam-probe-relative.tsx`,
      );
      const seam = messages.filter((m) => m.ruleId === 'no-restricted-imports');
      expect(
        seam.length,
        `expected no-restricted-imports to fire on the relative ../three/** spelling under ${dir}/`,
      ).toBeGreaterThan(0);
      expect(seam[0]?.message).toContain(SEAM_MESSAGE);
    });

    it('flags the bare `three` npm package spelling', async () => {
      const messages = await lintSeam(
        "import * as THREE from 'three';\nexport default THREE;\n",
        `${dir}/__seam-probe-bare-npm.tsx`,
      );
      const seam = messages.filter((m) => m.ruleId === 'no-restricted-imports');
      expect(
        seam.length,
        `expected no-restricted-imports to fire on the bare \`three\` package spelling under ${dir}/`,
      ).toBeGreaterThan(0);
      expect(seam[0]?.message).toContain(SEAM_MESSAGE);
    });

    it('flags the @react-three/* spelling', async () => {
      const messages = await lintSeam(
        "import { Canvas } from '@react-three/fiber';\nexport default Canvas;\n",
        `${dir}/__seam-probe-r3f.tsx`,
      );
      const seam = messages.filter((m) => m.ruleId === 'no-restricted-imports');
      expect(
        seam.length,
        `expected no-restricted-imports to fire on the @react-three/* spelling under ${dir}/`,
      ).toBeGreaterThan(0);
      expect(seam[0]?.message).toContain(SEAM_MESSAGE);
    });

    it('flags the dynamic import() spelling', async () => {
      const messages = await lintSeam(
        "export default function load() {\n  return import('@/three/internal/whatever');\n}\n",
        `${dir}/__seam-probe-dynamic.tsx`,
      );
      const seam = messages.filter((m) => m.ruleId === 'no-restricted-syntax');
      expect(
        seam.length,
        `expected no-restricted-syntax to fire on the dynamic import() spelling under ${dir}/ — no-restricted-imports cannot see ImportExpression nodes at all`,
      ).toBeGreaterThan(0);
      expect(seam[0]?.message).toContain(SEAM_MESSAGE);
    });
  });
}
