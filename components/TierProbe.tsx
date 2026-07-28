'use client';
import { useDeviceTier } from '@/lib/tier/useDeviceTier';

/** Resolves the device tier into the store on mount. Renders nothing — it
 *  exists because the layout is a Server Component and cannot call a hook. */
export function TierProbe() {
  useDeviceTier();
  return null;
}
