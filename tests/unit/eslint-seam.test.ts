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
    (m) => m.ruleId === 'no-restricted-imports' || m.ruleId === 'no-restricted-syntax',
  );
}

const SEAM_MESSAGE = 'three/registry.ts is the only DOM→WebGL seam';

/** The DOM→WebGL seam is the architecture's single most load-bearing
 *  constraint (spec §1.2) and it has already been silently disabled twice on
 *  this branch: once when a `files:`-scoped `no-restricted-imports` block
 *  replaced rather than merged the repo-wide pattern (ESLint flat config
 *  replaces a rule's options wholesale per matching block, it does not merge
 *  `patterns` arrays), and again when the enforced pattern only covered the
 *  `@/three/**` alias spelling — leaving relative imports (`../three/...`),
 *  the bare `three` npm package, `@react-three/*`, and dynamic `import()`
 *  all open. This suite probes every one of those five spellings from a
 *  components/ file (where SceneSlot lives and the restriction matters most)
 *  and fails if any of them ever goes unenforced again. Each assertion checks
 *  the reported `ruleId` and message text, not just a non-zero count — a
 *  probe that only checked "some problem fired" would pass even if an
 *  unrelated rule (e.g. `@next/next/no-img-element`) happened to also flag
 *  the same line. */
describe('the three/ seam is enforced under components/', () => {
  it('flags the @/three/** alias spelling', async () => {
    const messages = await lintSeam(
      "import x from '@/three/internal/whatever';\nexport default x;\n",
      'components/__seam-probe-alias.tsx',
    );
    const seam = messages.filter((m) => m.ruleId === 'no-restricted-imports');
    expect(seam.length, 'expected no-restricted-imports to fire on the @/three/** alias spelling').toBeGreaterThan(0);
    expect(seam[0]?.message).toContain(SEAM_MESSAGE);
  });

  it('flags the relative-path spelling (../three/**)', async () => {
    const messages = await lintSeam(
      "import x from '../three/internal/whatever';\nexport default x;\n",
      'components/__seam-probe-relative.tsx',
    );
    const seam = messages.filter((m) => m.ruleId === 'no-restricted-imports');
    expect(seam.length, 'expected no-restricted-imports to fire on the relative ../three/** spelling').toBeGreaterThan(0);
    expect(seam[0]?.message).toContain(SEAM_MESSAGE);
  });

  it('flags the bare `three` npm package spelling', async () => {
    const messages = await lintSeam(
      "import * as THREE from 'three';\nexport default THREE;\n",
      'components/__seam-probe-bare-npm.tsx',
    );
    const seam = messages.filter((m) => m.ruleId === 'no-restricted-imports');
    expect(seam.length, 'expected no-restricted-imports to fire on the bare `three` package spelling').toBeGreaterThan(0);
    expect(seam[0]?.message).toContain(SEAM_MESSAGE);
  });

  it('flags the @react-three/* spelling', async () => {
    const messages = await lintSeam(
      "import { Canvas } from '@react-three/fiber';\nexport default Canvas;\n",
      'components/__seam-probe-r3f.tsx',
    );
    const seam = messages.filter((m) => m.ruleId === 'no-restricted-imports');
    expect(seam.length, 'expected no-restricted-imports to fire on the @react-three/* spelling').toBeGreaterThan(0);
    expect(seam[0]?.message).toContain(SEAM_MESSAGE);
  });

  it('flags the dynamic import() spelling', async () => {
    const messages = await lintSeam(
      "export default function load() {\n  return import('@/three/internal/whatever');\n}\n",
      'components/__seam-probe-dynamic.tsx',
    );
    const seam = messages.filter((m) => m.ruleId === 'no-restricted-syntax');
    expect(seam.length, 'expected no-restricted-syntax to fire on the dynamic import() spelling — no-restricted-imports cannot see ImportExpression nodes at all').toBeGreaterThan(0);
    expect(seam[0]?.message).toContain(SEAM_MESSAGE);
  });

  it('still permits the one sanctioned import: three/registry itself', async () => {
    const messages = await lintSeam(
      "import { POSTERS } from '@/three/registry';\nexport default POSTERS;\n",
      'components/__seam-probe-ok.tsx',
    );
    expect(messages).toHaveLength(0);
  });
});
