'use client';
import { create } from 'zustand';
import type { Tier } from '@/lib/tier/resolve';
import type { SceneId } from '@/three/registry';

type AppState = {
  tier: Tier;
  reducedMotion: boolean;
  activeScene: SceneId | null;
  scrollProgress: number;
  scrollDirection: 'up' | 'down';
  /**
   * The current journey station's DOM id, or null when the page is not a
   * journey.
   *
   * This is the one value the camera navigates by, and the direction of the
   * dependency matters: the DOM decides which station is current — from a link
   * click, a history entry, or the section that has scrolled into view — and
   * the camera reacts. Nothing in `three/` ever writes it.
   *
   * That is what keeps the journey accessible. Because navigation is the cause
   * and camera movement is the effect, removing the camera entirely (flag off,
   * T0/T1, reduced motion, no WebGL) leaves a page whose sections are still
   * linkable, still reachable by keyboard, and still in reading order. There is
   * no "3D mode" to fall back FROM.
   */
  station: string | null;
  /** Which way the last station change travelled. Lets the camera ease
   *  differently arriving backwards than forwards. */
  stationDirection: 'forward' | 'back';
  setTier: (tier: Tier) => void;
  setReducedMotion: (value: boolean) => void;
  setActiveScene: (scene: SceneId | null) => void;
  setScrollProgress: (progress: number, direction?: 'up' | 'down') => void;
  setStation: (station: string | null, direction?: 'forward' | 'back') => void;
};

export const useAppStore = create<AppState>((set) => ({
  // T1 until proven otherwise: the server renders posters, and an optimistic
  // default would flash live scenes onto devices that cannot hold 30fps.
  tier: 'T1',
  reducedMotion: true,
  activeScene: null,
  scrollProgress: 0,
  scrollDirection: 'down',
  station: null,
  stationDirection: 'forward',
  setTier: (tier) => set({ tier }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setActiveScene: (activeScene) => set({ activeScene }),
  setScrollProgress: (scrollProgress, scrollDirection = 'down') =>
    set({ scrollProgress, scrollDirection }),
  setStation: (station, stationDirection = 'forward') =>
    set({ station, stationDirection }),
}));
