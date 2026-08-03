'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import type { SceneId, SceneModule } from '../registry';

function HeroSceneContent() {
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.1;
      ringRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#C9A84C" />
      <pointLight position={[-4, -3, -2]} intensity={0.8} color="#1A7A85" />

      {/* Central Gold Axis Pillar */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 6, 16]} />
        <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Rotating Outer Architectural Ring */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.8, 0.03, 16, 64]} />
        <meshStandardMaterial color="#FCFAF5" roughness={0.3} metalness={0.5} wireframe={false} />
      </mesh>

      {/* Accent Geometric Nodes */}
      <mesh position={[1.4, 0.8, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#1A7A85" roughness={0.1} metalness={0.9} />
      </mesh>

      <mesh position={[-1.2, -0.9, 0.5]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.7} />
      </mesh>
    </group>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'hero') return null;
  return <HeroSceneContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 120,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
