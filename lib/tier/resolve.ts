export type Tier = 'T0' | 'T1' | 'T2' | 'T3';

export type TierEnv = {
  prefersReducedMotion: boolean;
  saveData: boolean;
  effectiveType: string | undefined;
  deviceMemory: number | undefined;
  hardwareConcurrency: number | undefined;
  coarsePointer: boolean;
  hasWebGL: boolean;
};

const SLOW_CONNECTIONS = new Set(['slow-2g', '2g', '3g']);

/** Phase-1 synchronous resolution (spec §4.1). Cheap signals only — detect-gpu
 *  runs later, inside the lazily imported WebGL chunk, so it never touches the
 *  initial bundle. Most restrictive signal wins. */
export function resolveTier(env: TierEnv): Tier {
  if (!env.hasWebGL) return 'T0';
  if (env.prefersReducedMotion) return 'T1';
  if (env.saveData) return 'T1';
  if (env.effectiveType && SLOW_CONNECTIONS.has(env.effectiveType)) return 'T1';
  if (env.deviceMemory !== undefined && env.deviceMemory < 4) return 'T2';
  if (env.hardwareConcurrency !== undefined && env.hardwareConcurrency < 4) return 'T2';
  return 'T3';
}
