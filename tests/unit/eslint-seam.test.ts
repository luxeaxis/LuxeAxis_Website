import { describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';
import { resolve } from 'node:path';

/** The DOM→WebGL seam is the architecture's single most load-bearing
 *  constraint (spec §1.2) and it has already been silently disabled once:
 *  ESLint flat config replaces rather than merges a rule's options when a
 *  later `files:`-scoped block sets the same rule name, so the
 *  components/-scoped `features/` restriction in eslint.config.mjs dropped
 *  the repo-wide `three/` restriction for every file under components/ —
 *  exactly where SceneSlot lives. This test lints a virtual file in that
 *  exact location and fails if the seam ever goes unenforced there again. */
describe('the three/ seam is enforced under components/', () => {
  it('flags an import that reaches past the registry from a components/ file', async () => {
    const eslint = new ESLint({
      overrideConfigFile: resolve(__dirname, '../../eslint.config.mjs'),
    });

    const [result] = await eslint.lintText(
      "import x from '@/three/internal/whatever';\nexport default x;\n",
      { filePath: resolve(__dirname, '../../components/__seam-probe.tsx') },
    );

    const seamMessages = result?.messages.filter((m) => m.ruleId === 'no-restricted-imports') ?? [];
    expect(seamMessages.length, 'expected no-restricted-imports to fire on a components/ file reaching past three/registry').toBeGreaterThan(0);
    expect(seamMessages[0]?.message).toContain('three/registry.ts is the only DOM→WebGL seam');
  });

  it('still permits the one sanctioned import: three/registry itself', async () => {
    const eslint = new ESLint({
      overrideConfigFile: resolve(__dirname, '../../eslint.config.mjs'),
    });

    const [result] = await eslint.lintText(
      "import { POSTERS } from '@/three/registry';\nexport default POSTERS;\n",
      { filePath: resolve(__dirname, '../../components/__seam-probe-ok.tsx') },
    );

    const seamMessages = result?.messages.filter((m) => m.ruleId === 'no-restricted-imports') ?? [];
    expect(seamMessages).toHaveLength(0);
  });
});
