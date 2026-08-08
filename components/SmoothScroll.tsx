'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useAppStore } from '@/lib/store';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import {
  gsap,
  registerScrollPlugins,
  ScrollTrigger,
} from '@/lib/motion/scroll';

/**
 * The Smooth Scroll Provider (Build Backlog T-21, Spec §3.3).
 *
 * Single scroll source (Lenis), bridged to GSAP `ScrollTrigger` and the Lenis
 * ticker, publishing `scrollProgress` to the store for the camera rig (T-26)
 * to consume. Bypassed instantly when `reducedMotion` is set or the OS asks
 * for it, falling back to a passive native scroll listener.
 *
 * Never imported directly by the layout. `SmoothScrollGate` decides whether
 * this module is reachable at all, so that the ~135 kB of Lenis and GSAP in
 * here can be dropped from the bundle entirely when the flag is off — a
 * reduced-motion visitor was previously downloading both and using neither.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const storeReducedMotion = useAppStore((state) => state.reducedMotion);
  const osReducedMotion = useReducedMotion();
  const setScrollProgress = useAppStore((state) => state.setScrollProgress);

  const isReduced = storeReducedMotion || osReducedMotion;

  useEffect(() => {
    registerScrollPlugins();

    if (isReduced) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }

      const handleNativeScroll = () => {
        const docEl = document.documentElement;
        const totalHeight = docEl.scrollHeight - docEl.clientHeight;
        const progress =
          totalHeight > 0
            ? Math.min(1, Math.max(0, window.scrollY / totalHeight))
            : 0;
        setScrollProgress(progress);
      };

      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      handleNativeScroll();

      return () => {
        window.removeEventListener('scroll', handleNativeScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    const onScroll = (e: { progress: number; direction: number }) => {
      ScrollTrigger.update();
      setScrollProgress(e.progress, e.direction >= 0 ? 'down' : 'up');
    };

    lenis.on('scroll', onScroll);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isReduced, setScrollProgress]);

  // Renders nothing. It used to wrap the whole tree and pass children
  // straight through, which meant the root layout could not gate it behind a
  // flag without also gating the page — see components/SmoothScrollGate.tsx.
  return null;
}
