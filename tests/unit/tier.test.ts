import { describe, expect, it } from 'vitest';
import { resolveTier, type TierEnv } from '@/lib/tier/resolve';

const flagship: TierEnv = {
  prefersReducedMotion: false,
  saveData: false,
  effectiveType: '4g',
  deviceMemory: 8,
  hardwareConcurrency: 8,
  coarsePointer: false,
  hasWebGL: true,
};

describe('resolveTier', () => {
  it('gives a flagship the full experience', () => {
    expect(resolveTier(flagship)).toBe('T3');
  });

  it('locks to T1 on reduced-motion regardless of hardware', () => {
    expect(resolveTier({ ...flagship, prefersReducedMotion: true })).toBe('T1');
  });

  it('locks to T1 on Save-Data — the real signal, not prefers-reduced-data', () => {
    expect(resolveTier({ ...flagship, saveData: true })).toBe('T1');
  });

  it('locks to T1 on a slow connection', () => {
    expect(resolveTier({ ...flagship, effectiveType: '2g' })).toBe('T1');
    expect(resolveTier({ ...flagship, effectiveType: '3g' })).toBe('T1');
  });

  it('reports T0 when WebGL is unavailable', () => {
    expect(resolveTier({ ...flagship, hasWebGL: false })).toBe('T0');
  });

  it('drops to T2 on constrained memory', () => {
    expect(resolveTier({ ...flagship, deviceMemory: 2 })).toBe('T2');
  });

  it('drops to T2 on few cores', () => {
    expect(resolveTier({ ...flagship, hardwareConcurrency: 2 })).toBe('T2');
  });

  it('keeps a capable touch device at T3 — coarse pointer alone is not weakness', () => {
    expect(resolveTier({ ...flagship, coarsePointer: true })).toBe('T3');
  });

  it('prefers the most restrictive signal when several apply', () => {
    expect(resolveTier({ ...flagship, prefersReducedMotion: true, deviceMemory: 2 })).toBe('T1');
  });
});
