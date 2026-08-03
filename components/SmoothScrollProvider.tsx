'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useAppStore } from '@/lib/store';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { gsap, registerScrollPlugins, ScrollTrigger } from '@/lib/motion/scroll';

/**
 * The Smooth Scroll Provider (Build Backlog T-21, Spec §3.3).
 *
 * Single scroll source (Lenis `lerp: 0.1`), bridged to GSAP `ScrollTrigger`
 * and Lenis ticker. Bypassed instantly when `reducedMotion` is true or OS
 * prefers reduced motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
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
        const progress = totalHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / totalHeight)) : 0;
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

  return <>{children}</>;
}
