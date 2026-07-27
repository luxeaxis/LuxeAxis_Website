import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';

describe('scaffold', () => {
  it('pins an exact Next.js version so CI and local builds match', () => {
    expect(pkg.dependencies.next).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('exposes a single verify entry point', () => {
    expect(pkg.scripts.verify).toContain('typecheck');
    expect(pkg.scripts.verify).toContain('lint');
    expect(pkg.scripts.verify).toContain('test');
  });
});
