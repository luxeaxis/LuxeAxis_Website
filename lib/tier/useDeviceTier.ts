'use client';
import { useEffect } from 'react';
import { resolveTier, type TierEnv } from './resolve';
import { useAppStore } from '@/lib/store';

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithHints = Navigator & {
  connection?: NetworkInformation;
  deviceMemory?: number;
};

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function useDeviceTier(): void {
  const setTier = useAppStore((s) => s.setTier);
  const setReducedMotion = useAppStore((s) => s.setReducedMotion);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nav = navigator as NavigatorWithHints;

    const read = (): TierEnv => ({
      prefersReducedMotion: motionQuery.matches,
      saveData: nav.connection?.saveData ?? false,
      effectiveType: nav.connection?.effectiveType,
      deviceMemory: nav.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      coarsePointer: window.matchMedia('(pointer: coarse)').matches,
      hasWebGL: hasWebGL(),
    });

    const apply = () => {
      const env = read();
      setTier(resolveTier(env));
      setReducedMotion(env.prefersReducedMotion);
    };

    apply();
    motionQuery.addEventListener('change', apply);
    return () => motionQuery.removeEventListener('change', apply);
  }, [setTier, setReducedMotion]);
}
