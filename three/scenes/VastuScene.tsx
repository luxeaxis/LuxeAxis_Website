'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { SceneId, SceneModule } from '../registry';

function VastuSceneContent() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1} color="#C9A84C" />

      {/* Vastu Floor Plan Grid Plane */}
      <gridHelper args={[4, 8, '#C9A84C', '#1A7A85']} position={[0, -0.5, 0]} />

      {/* Favourable Zone Node (Gold) */}
      <mesh position={[0.8, 0, 0.8]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#C9A84C" transparent opacity={0.8} metalness={0.6} />
      </mesh>

      {/* Verified Review Node (Teal) */}
      <mesh position={[-0.8, 0, -0.8]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#1A7A85" transparent opacity={0.8} metalness={0.6} />
      </mesh>
    </group>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'vastu') return null;
  return <VastuSceneContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 100,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
