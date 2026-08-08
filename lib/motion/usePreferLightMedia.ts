'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Whether the visitor should get the lightweight media path — poster stills
 * rather than autoplay video loops.
 *
 * True when any of these hold: reduced motion, mobile viewport, prefers-reduced-
 * data, or the browser's save-data hint. Hero video alone was ~56 MB per visit;
 * on Chennai mobile connections that is the difference between fast and unusable.
 */
export function usePreferLightMedia(): boolean {
  const reducedMotion = useReducedMotion();
  const [preferLight, setPreferLight] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const wide = window.matchMedia('(min-width: 1024px)');
    const reducedData = window.matchMedia('(prefers-reduced-data: reduce)');

    const update = () => {
      const connection = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection;
      setPreferLight(
        reducedMotion ||
          !wide.matches ||
          reducedData.matches ||
          connection?.saveData === true,
      );
    };

    update();
    wide.addEventListener('change', update);
    reducedData.addEventListener('change', update);
    return () => {
      wide.removeEventListener('change', update);
      reducedData.removeEventListener('change', update);
    };
  }, [reducedMotion]);

  return preferLight;
}
