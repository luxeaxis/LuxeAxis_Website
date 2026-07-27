'use client';
import { create } from 'zustand';
import type { Tier } from '@/lib/tier/resolve';

type AppState = {
  tier: Tier;
  reducedMotion: boolean;
  setTier: (tier: Tier) => void;
  setReducedMotion: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  // T1 until proven otherwise: the server renders posters, and an optimistic
  // default would flash live scenes onto devices that cannot hold 30fps.
  tier: 'T1',
  reducedMotion: true,
  setTier: (tier) => set({ tier }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
