import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Registers GSAP plugins once safely across SSR / Next.js client executions.
 */
let registered = false;

export function registerScrollPlugins() {
  if (typeof window === 'undefined') return;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export { gsap, ScrollTrigger };
