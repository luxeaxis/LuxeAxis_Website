'use client';

/**
 * Dust-in-light — one of the four particle systems the site is permitted.
 *
 * Cinematic Direction §6 sets the highest bar in the document here: "the entire
 * site ships exactly four particle systems, and each one is a visualized
 * sentence. If a fifth is proposed, it must replace one of these, not add to
 * them." This is the first: **≤40 instanced motes drifting only inside the
 * key-light shaft**, saying "this space has real air and volume". T3 only.
 *
 * The hard rules from that section are all structural here rather than
 * conventional:
 *
 *   - **Capped count.** `MAX_MOTES` is 40 and the prop is clamped to it.
 *   - **Only inside the shaft.** Motes are generated within a box aligned to
 *     the key light and wrap inside it. Dust in the shadows is just noise; dust
 *     in the beam is what makes light legible.
 *   - **Never between the visitor and text.** The caller places this behind the
 *     reading plane; it is additive and unlit so it cannot darken anything.
 *   - **First thing dropped.** `Step.NoParticles` is rung one of the ladder in
 *     `quality.ts`, so this is what a struggling device loses before anything
 *     else.
 *   - **Off under reduced motion**, with the meaning carried by the static
 *     composition instead.
 *
 * ## Points, not InstancedMesh
 *
 * The spec says "instanced", meaning "one draw call, not forty" — which is the
 * property that matters. `Points` achieves it more cheaply than `InstancedMesh`
 * for camera-facing specks: one vertex per mote instead of a transformed
 * quad each, no per-instance matrices to upload, and screen-space sizing for
 * free. The round, soft falloff comes from `gl_PointCoord` in the fragment
 * shader, so there is no sprite texture to load either.
 *
 * ## It never calls `invalidate()`
 *
 * Deliberate, and it is what §6's "off on scroll-idle" asks for. The motes
 * animate only during frames something else already requested — a camera
 * transition, a drag. On a settled canvas they hold still and cost nothing,
 * rather than pinning a render loop at 60fps to drift specks nobody is looking
 * at. This is the same decision as the ambient breath in `RoomShell`.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, type Points as PointsType } from 'three';
import { useAppStore } from '@/lib/store';
import { useCapabilities } from './quality';
import { useSceneTier } from './tier';
import { PALETTE } from './palette';

const MAX_MOTES = 40;

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  attribute float aScale;
  varying float vAlpha;

  void main() {
    vec3 p = position;

    // Slow, uncorrelated drift. Each mote gets its own phase from aSeed so the
    // field never pulses in unison — synchronised particles read as a screen
    // effect rather than as air.
    p.y += sin(uTime * 0.12 + aSeed * 6.28) * 0.28;
    p.x += cos(uTime * 0.09 + aSeed * 4.71) * 0.22;
    p.z += sin(uTime * 0.07 + aSeed * 3.14) * 0.18;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // Fade at the extremes of the shaft so motes appear and vanish inside the
    // beam instead of popping at a hard boundary.
    float edge = 1.0 - smoothstep(0.55, 1.0, abs(position.y) / 2.2);
    vAlpha = edge * aScale;

    // Perspective-correct sizing: distant motes get smaller, as real dust does.
    gl_PointSize = uSize * aScale * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Round, soft-edged mote from the point's own coordinates — no texture.
    vec2 d = gl_PointCoord - vec2(0.5);
    float r = dot(d, d);
    if (r > 0.25) discard;

    float falloff = 1.0 - smoothstep(0.0, 0.25, r);
    gl_FragColor = vec4(uColor, falloff * vAlpha * 0.55);
  }
`;

export function DustInLight({
  /** Centre of the light shaft, world space. */
  position = [0, 1.6, 0] as [number, number, number],
  /** Extent of the shaft the motes are confined to. */
  size = [2.4, 4.4, 2.4] as [number, number, number],
  count = MAX_MOTES,
}: {
  position?: [number, number, number];
  size?: [number, number, number];
  count?: number;
} = {}) {
  const tier = useSceneTier();
  const capabilities = useCapabilities(tier);
  const reducedMotion = useAppStore((state) => state.reducedMotion);
  const pointsRef = useRef<PointsType>(null);

  const motes = Math.min(count, MAX_MOTES);

  const { positions, seeds, scales } = useMemo(() => {
    const positions = new Float32Array(motes * 3);
    const seeds = new Float32Array(motes);
    const scales = new Float32Array(motes);

    for (let i = 0; i < motes; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * size[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * size[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * size[2];
      seeds[i] = Math.random();
      // Varied brightness and size. A field of identical motes reads as a
      // pattern; the variation is what makes it read as dust.
      scales[i] = 0.45 + Math.random() * 0.55;
    }

    return { positions, seeds, scales };
  }, [motes, size]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 5.5 },
      uColor: { value: new Color(PALETTE.goldChampagne) },
    }),
    [],
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  // Rung one of the degradation ladder, the tier ceiling, and the visitor's own
  // motion preference — any one of the three removes the system entirely.
  if (!capabilities.particles) return null;
  if (reducedMotion) return null;

  return (
    <points ref={pointsRef} position={position} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        // Additive so motes only ever add light. Dust that could darken the
        // room behind it would be wrong physically and would risk pulling text
        // contrast down, which §6 forbids outright.
        blending={AdditiveBlending}
      />
    </points>
  );
}
