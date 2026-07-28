'use client';
import { create } from 'zustand';
import type { Tier } from '@/lib/tier/resolve';
import type { SceneId } from '@/three/registry';

type AppState = {
  tier: Tier;
  reducedMotion: boolean;
  activeScene: SceneId | null;
  setTier: (tier: Tier) => void;
  setReducedMotion: (value: boolean) => void;
  setActiveScene: (scene: SceneId | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  // T1 until proven otherwise: the server renders posters, and an optimistic
  // default would flash live scenes onto devices that cannot hold 30fps.
  tier: 'T1',
  reducedMotion: true,
  activeScene: null,
  setTier: (tier) => set({ tier }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setActiveScene: (activeScene) => set({ activeScene }),
}));
